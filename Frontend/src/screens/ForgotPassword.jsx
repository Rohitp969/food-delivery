import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { api } from "../lib/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api("/api/forgotPassword", { method: "POST", body: { email: email.trim() } });
      navigate("/reset-password/otp", { state: { email: email.trim() } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email you signed up with and we'll send you a code."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-leaf hover:text-leaf-dark">
            Back to log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />

        <FormAlert>{error}</FormAlert>

        <Button type="submit" size="lg" loading={loading} disabled={!email} className="w-full">
          {loading ? "Sending code..." : "Send code"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
