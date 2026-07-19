import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (!json.success) {
        toast.error("Invalid Email or Password");
        return;
      }

      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userEmail", json.email);
      localStorage.setItem("userRole", json.role);
      localStorage.setItem("userName", json.name);

      toast.success("Login Successful 🎉");

      if (json.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
      
    } catch (err) {
  console.log(err);
  toast.error("Invalid Credentials");
} finally {
  setLoading(false);
 }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Login to your account
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Enter your email below to login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>

            <input
              type="email"
              name="email"
              placeholder="m@example.com"
              value={credentials.email}
              onChange={onChange}
              required
              className="w-full h-11 px-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Password */}

          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Password</label>

              <span className="text-sm text-pink-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={onChange}
                required
                className="w-full h-11 px-4 pr-12 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
              />

              {showPassword ? (
                <EyeOff
                  size={20}
                  onClick={() => setShowPassword(false)}
                  className="absolute right-4 top-3 cursor-pointer text-gray-600"
                />
              ) : (
                <Eye
                  size={20}
                  onClick={() => setShowPassword(true)}
                  className="absolute right-4 top-3 cursor-pointer text-gray-600"
                />
              )}
            </div>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white rounded-xl font-semibold flex items-center justify-center transition mt-2 "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Please wait...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
