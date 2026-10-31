import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import OtpInput from "../components/OtpInput";
import Button from "../components/ui/Button";
import { Input, PasswordInput } from "../components/ui/Field";
import { api } from "../lib/api";
import { useCountdown } from "../lib/useCountdown";

const RESEND_COOLDOWN = 60;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useCountdown(0);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const update = (changes) => {
    setForm({ ...form, ...changes });
    setError("");
  };

  const requestCode = async () => {
    try {
      await api("/api/forgotPassword", { method: "POST", body: { email: form.email.trim() } });
      setCooldown(RESEND_COOLDOWN);
      return true;
    } catch (err) {
      setError(err.message);
      if (err.data?.retryAfter) setCooldown(err.data.retryAfter);
      return false;
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (await requestCode()) {
      toast.success("We sent a code to your email");
      setStep("reset");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    if (await requestCode()) {
      update({ otp: "" });
      toast.success("We sent you a new code");
    }
    setResending(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (form.password.length < 5) {
      setError("Your new password needs at least 5 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("The two passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await api("/api/resetPassword", {
        method: "POST",
        body: { email: form.email.trim(), otp: form.otp, password: form.password },
      });
      toast.success("Password reset. Log in with your new password.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <>
      Remembered it?{" "}
      <Link to="/login" className="font-semibold text-leaf hover:text-leaf-dark">
        Back to log in
      </Link>
    </>
  );

  if (step === "email") {
    return (
      <AuthLayout
        title="Reset your password"
        description="Enter the email you signed up with and we'll send you a code."
        footer={footer}
      >
        <form onSubmit={handleSendCode} className="space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            required
          />

          <FormAlert>{error}</FormAlert>

          <Button type="submit" size="lg" loading={loading} disabled={!form.email} className="w-full">
            {loading ? "Sending code..." : "Send code"}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description={
        <>
          Enter the code we sent to <span className="font-semibold break-all text-ink">{form.email}</span>{" "}
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError("");
            }}
            className="font-semibold text-leaf hover:text-leaf-dark"
          >
            (change)
          </button>
        </>
      }
      footer={footer}
    >
      <form onSubmit={handleReset} className="space-y-5">
        <OtpInput value={form.otp} onChange={(otp) => update({ otp })} />

        <PasswordInput
          id="password"
          label="New password"
          autoComplete="new-password"
          hint="At least 5 characters"
          value={form.password}
          onChange={(e) => update({ password: e.target.value })}
          required
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => update({ confirmPassword: e.target.value })}
          required
        />

        <FormAlert>{error}</FormAlert>

        <Button type="submit" size="lg" loading={loading} disabled={form.otp.length !== 6} className="w-full">
          {loading ? "Saving..." : "Save new password"}
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

export default ForgotPassword;
