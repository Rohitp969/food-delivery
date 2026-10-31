import React, { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Button from "../components/ui/Button";
import { Input, PasswordInput } from "../components/ui/Field";
import { api } from "../lib/api";
import { homeFor, saveSession } from "../lib/session";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const json = await api("/api/loginUser", { method: "POST", body: credentials });
      saveSession(json);
      toast.success(`Welcome back, ${json.name.split(" ")[0]}`);

      // Return to the page that asked them to log in, if they're allowed there.
      // Only same-site paths: "//evil.com" would leave the site.
      const from = location.state?.from || searchParams.get("next");
      const sameSite = from?.startsWith("/") && !from.startsWith("//");
      const canReturn = sameSite && (!from.startsWith("/admin") || json.role === "admin");
      navigate(canReturn ? from : homeFor(json.role), { replace: true });
    } catch (err) {
      if (err.data?.needsVerification) {
        toast.info(err.message);
        navigate("/verify-email", { state: { email: err.data.email } });
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      description="Welcome back. Enter your email and password to continue."
      footer={
        <>
          New to GoFood?{" "}
          <Link to="/signup" className="font-semibold text-leaf hover:text-leaf-dark">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {searchParams.get("expired") && !error && (
          <FormAlert tone="info">Your session expired. Log in again to continue.</FormAlert>
        )}

        <Input
          id="email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={credentials.email}
          onChange={onChange}
          required
        />

        <PasswordInput
          id="password"
          label="Password"
          name="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={onChange}
          required
          labelAction={
            <Link to="/forgot-password" className="text-sm font-semibold text-leaf hover:text-leaf-dark">
              Forgot password?
            </Link>
          }
        />

        <FormAlert>{error}</FormAlert>

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={!credentials.email || !credentials.password}
          className="w-full"
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
