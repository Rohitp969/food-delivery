import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { PasswordInput } from "../ui/Field";
import FormAlert from "../FormAlert";
import { api } from "../../lib/api";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

const PasswordForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", form: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.currentPassword) found.currentPassword = "Enter your current password";
    if (form.newPassword.length < 5) found.newPassword = "Use at least 5 characters";
    else if (form.newPassword !== form.confirmPassword) found.confirmPassword = "This doesn't match the new password";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await api("/api/account/me/password", {
        method: "PUT",
        body: { currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      toast.success("Password updated. We've emailed you a confirmation.");
      setForm(EMPTY);
    } catch (err) {
      if (/current password/i.test(err.message)) setErrors({ currentPassword: err.message });
      else if (/new password/i.test(err.message)) setErrors({ newPassword: err.message });
      else setErrors({ form: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-md space-y-5" noValidate>
      <PasswordInput
        id="current-password"
        label="Current password"
        name="currentPassword"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={onChange}
        error={errors.currentPassword}
        labelAction={
          <Link to="/forgot-password" className="text-sm font-semibold text-leaf hover:text-leaf-dark">
            Forgot it?
          </Link>
        }
      />
      <PasswordInput
        id="new-password"
        label="New password"
        name="newPassword"
        autoComplete="new-password"
        hint="At least 5 characters"
        value={form.newPassword}
        onChange={onChange}
        error={errors.newPassword}
      />
      <PasswordInput
        id="confirm-password"
        label="Confirm new password"
        name="confirmPassword"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
      />
      <FormAlert>{errors.form}</FormAlert>
      <Button type="submit" loading={saving}>
        Update password
      </Button>
    </form>
  );
};

export default PasswordForm;
