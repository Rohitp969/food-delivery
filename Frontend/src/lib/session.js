// The rest of the app (cart, checkout, my orders) reads these keys directly
const KEYS = ["authToken", "userEmail", "userName", "userRole"];

export const getSession = () => ({
  token: localStorage.getItem("authToken"),
  email: localStorage.getItem("userEmail"),
  name: localStorage.getItem("userName"),
  role: localStorage.getItem("userRole"),
});

export const saveSession = ({ authToken, email, name, role }) => {
  localStorage.setItem("authToken", authToken);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userName", name);
  localStorage.setItem("userRole", role);
};

export const updateSessionUser = (user) => {
  localStorage.setItem("userName", user.name);
  window.dispatchEvent(new Event("session-change"));
};

export const clearSession = () => {
  KEYS.forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event("session-change"));
};

// Where to send someone right after they log in
export const homeFor = (role) => (role === "admin" ? "/admin/dashboard" : "/");
