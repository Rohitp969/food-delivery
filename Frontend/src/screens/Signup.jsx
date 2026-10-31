import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Button from "../components/ui/Button";
import { Input, PasswordInput } from "../components/ui/Field";
import { api } from "../lib/api";

const RULES = {
  firstName: (v) => (v.trim() ? "" : "Enter your first name"),
  lastName: (v) => (v.trim() ? "" : "Enter your last name"),
  email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com"),
  password: (v) => (v.length >= 5 ? "" : "Use at least 5 characters"),
  location: (v) => (v.trim() ? "" : "Enter the address we should deliver to"),
};

// Server validation paths -> form fields
const SERVER_FIELDS = { name: "firstName", email: "email", password: "password", location: "location" };

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    setFormError("");
  };

  // Validate a field once the person leaves it, not while they type
  const onBlur = (e) => {
    const { name, value } = e.target;
    if (value) setErrors({ ...errors, [name]: RULES[name](value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = Object.fromEntries(
      Object.entries(RULES).map(([name, rule]) => [name, rule(credentials[name])]),
    );
    setErrors(found);
    const firstInvalid = Object.keys(found).find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setLoading(true);
    try {
      const json = await api("/api/createUser", {
        method: "POST",
        body: {
          name: `${credentials.firstName.trim()} ${credentials.lastName.trim()}`,
          email: credentials.email.trim(),
          password: credentials.password,
          location: credentials.location.trim(),
        },
      });

      toast.success(json.message || "We sent a code to your email");
      navigate("/verify-email", { state: { email: json.email } });
    } catch (err) {
      const serverField = SERVER_FIELDS[err.data?.errors?.[0]?.path];
      if (serverField) {
        setErrors({ ...errors, [serverField]: err.message });
      } else {
        setFormError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: credentials[name],
    onChange,
    onBlur,
    error: errors[name],
  });

  return (
    <AuthLayout
      title="Create your account"
      description="It takes a minute. We'll email you a code to confirm it's really you."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-leaf hover:text-leaf-dark">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="First name" autoComplete="given-name" {...fieldProps("firstName")} />
          <Input label="Last name" autoComplete="family-name" {...fieldProps("lastName")} />
        </div>

        <Input label="Email" type="email" autoComplete="email" {...fieldProps("email")} />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          hint="At least 5 characters"
          {...fieldProps("password")}
        />

        <Input
          label="Delivery address"
          autoComplete="street-address"
          hint="House number, street and area"
          {...fieldProps("location")}
        />

        <FormAlert>{formError}</FormAlert>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-xs leading-relaxed text-muted">
          By creating an account you agree to receive order updates by email.
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
