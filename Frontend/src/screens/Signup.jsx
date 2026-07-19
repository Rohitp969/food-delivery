import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    geolocation: "",
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
      const response = await fetch("http://localhost:5000/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:
            credentials.firstName.trim() +
            " " +
            credentials.lastName.trim(),
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
        }),
      });

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Signup Failed");
        setLoading(false);
        return;
      }

      toast.success("Account Created Successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-5">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Create your account
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Enter your details below to create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold mb-2">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={credentials.firstName}
                onChange={onChange}
                required
                className="w-full h-11 px-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={credentials.lastName}
                onChange={onChange}
                required
                className="w-full h-11 px-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 mt-2">
              Email
            </label>

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

          <div>

            <label className="block text-sm font-semibold mb-2 mt-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
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
                    {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2 mt-2">
              Address
            </label>

            <input
              type="text"
              name="geolocation"
              placeholder="Enter your address"
              value={credentials.geolocation}
              onChange={onChange}
              required
              className="w-full h-11 px-4 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-2xl shadow-xl bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white rounded- font-semibold flex items-center justify-center transition mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Please wait...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-600 hover:text-pink-700 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
    // </div>

  );
};

export default Signup;