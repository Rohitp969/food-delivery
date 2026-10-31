import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Button from "../components/ui/Button";
import { PasswordInput } from "../components/ui/Field";
import { api } from "../lib/api";

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email = "", otp = "" } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email || !otp) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setError("Your new password needs at least 5 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("The two passwords don't match");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api("/api/resetPassword", {
        method: "POST",
        body: { email, otp, password },
      });
      toast.success("Password reset. Log in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      description={`Set a new password for ${email}.`}
      footer={
        <>
          Need to verify the code again?{" "}
          <Link
            to="/reset-password/otp"
            state={{ email }}
            className="font-semibold text-leaf hover:text-leaf-dark"
          >
            Back to code
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          id="password"
          label="New password"
          autoComplete="new-password"
          hint="At least 5 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          required
        />

        <FormAlert>{error}</FormAlert>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;
