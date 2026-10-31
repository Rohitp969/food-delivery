import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import OtpInput from "../components/OtpInput";
import Button from "../components/ui/Button";
import { api } from "../lib/api";
import { useCountdown } from "../lib/useCountdown";

const RESEND_COOLDOWN = 60;

const ResetPasswordOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useCountdown(RESEND_COOLDOWN);

  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api("/api/verifyResetOtp", { method: "POST", body: { email, otp } });
      navigate("/reset-password/change", { state: { email, otp } });
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
      await api("/api/resendOtp", { method: "POST", body: { email, purpose: "reset" } });
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
      title="Verify your code"
      description={
        <>
          Enter the 6-digit code we sent to{" "}
          <span className="break-all font-semibold text-ink">{email}</span>.
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link to="/forgot-password" className="font-semibold text-leaf hover:text-leaf-dark">
            Start again
          </Link>
        </>
      }
    >
      <form onSubmit={handleVerify} className="space-y-5">
        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError("");
          }}
        />

        <FormAlert>{error}</FormAlert>

        <Button type="submit" size="lg" loading={loading} disabled={otp.length !== 6} className="w-full">
          {loading ? "Verifying..." : "Verify code"}
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

export default ResetPasswordOtp;
