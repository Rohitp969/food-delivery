import { useCallback, useEffect, useRef, useState } from "react";

// Runs `loader` whenever `deps` change (or reload() is called) and keeps the
// last good data on screen while the next request is in flight. Responses
// from superseded requests are ignored, so fast filter changes can't race.
export const useFetch = (loader, deps) => {
  const [version, setVersion] = useState(0);
  const key = JSON.stringify([...deps, version]);
  const [result, setResult] = useState({ key: null, data: null, error: "" });
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let active = true;
    loaderRef.current().then(
      (data) => active && setResult({ key, data, error: "" }),
      (err) => active && setResult((prev) => ({ ...prev, key, error: err.message })),
    );
    return () => {
      active = false;
    };
  }, [key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (update) => setResult((prev) => ({ ...prev, data: typeof update === "function" ? update(prev.data) : update })),
    [],
  );

  return { data: result.data, error: result.error, loading: result.key !== key, reload, setData };
};
