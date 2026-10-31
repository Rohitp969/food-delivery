import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import OtpInput from "../components/OtpInput";
import Button from "../components/ui/Button";
import { api } from "../lib/api";
import { homeFor, saveSession } from "../lib/session";
import { useCountdown } from "../lib/useCountdown";

const RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useCountdown(RESEND_COOLDOWN);

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const json = await api("/api/verifyEmail", { method: "POST", body: { email, otp } });
      saveSession(json);
      toast.success("Email verified. Your account is ready.");
      navigate(homeFor(json.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");

    try {
      await api("/api/resendOtp", { method: "POST", body: { email, purpose: "verify" } });
      setOtp("");
      setCooldown(RESEND_COOLDOWN);
      toast.success("We sent you a new code");
    } catch (err) {
      setError(err.message);
      if (err.data?.retryAfter) setCooldown(err.data.retryAfter);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Check your email"
      description={
        <>
          Enter the 6-digit code we sent to{" "}
          <span className="font-semibold break-all text-ink">{email}</span>. It expires in 10 minutes.
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link to="/signup" className="font-semibold text-leaf hover:text-leaf-dark">
            Sign up again
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError("");
          }}
        />

        <FormAlert>{error}</FormAlert>

        <Button type="submit" size="lg" loading={loading} disabled={otp.length !== 6} className="w-full">
          {loading ? "Verifying..." : "Verify email"}
        </Button>

        <p className="text-center text-[15px] text-muted">
          Didn't get it? Check spam, or{" "}
          {cooldown > 0 ? (
            <span className="tabular">resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-leaf hover:text-leaf-dark disabled:text-muted"
            >
              {resending ? "sending..." : "resend the code"}
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
