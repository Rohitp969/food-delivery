import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Camera, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { Avatar } from "../ui/Display";
import { Input } from "../ui/Field";
import FormAlert from "../FormAlert";
import { api, uploadImage } from "../../lib/api";
import { updateSessionUser } from "../../lib/session";

const MAX_BYTES = 5 * 1024 * 1024;

const ProfileForm = ({ user, onSaved }) => {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || "",
    location: user.location || "",
    avatar: user.avatar || "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dirty =
    form.name !== user.name ||
    form.phone !== (user.phone || "") ||
    form.location !== (user.location || "") ||
    form.avatar !== (user.avatar || "");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setFormError("");
  };

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setFormError("That photo is over 5 MB. Choose a smaller one.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, avatar: url }));
    } catch (err) {
      setFormError(`Photo upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = "Enter your full name";
    if (!form.location.trim()) found.location = "Enter the address we should deliver to";
    if (form.phone && !/^\+?[0-9\s-]{7,15}$/.test(form.phone.trim())) found.phone = "Enter a valid phone number, like +91 98765 43210";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const data = await api("/api/account/me", { method: "PUT", body: form });
      updateSessionUser(data.user);
      toast.success("Profile saved");
      onSaved(data.user);
    } catch (err) {
      const path = err.data?.errors?.[0]?.path;
      if (path && path in form) setErrors({ [path]: err.message });
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6" noValidate>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={form.name} src={form.avatar} size="lg" />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
              <Loader2 className="h-5 w-5 animate-spin text-leaf" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" icon={Camera} onClick={() => fileRef.current?.click()} disabled={uploading}>
            {form.avatar ? "Change photo" : "Add photo"}
          </Button>
          {form.avatar && (
            <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, avatar: "" })} disabled={uploading}>
              Remove
            </Button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="profile-name" label="Full name" name="name" autoComplete="name" value={form.name} onChange={onChange} error={errors.name} />
        <Input
          id="profile-phone"
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          hint="So the delivery partner can reach you"
        />
        <Input
          id="profile-location"
          label="Delivery address"
          name="location"
          autoComplete="street-address"
          value={form.location}
          onChange={onChange}
          error={errors.location}
          className="sm:col-span-2"
        />
        <Input
          id="profile-email"
          label="Email"
          value={user.email}
          disabled
          hint="Your orders are linked to this email, so it can't be changed here."
          className="sm:col-span-2"
        />
      </div>

      <FormAlert>{formError}</FormAlert>

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          disabled={!dirty || saving}
          onClick={() => {
            setForm({ name: user.name, phone: user.phone || "", location: user.location || "", avatar: user.avatar || "" });
            setErrors({});
            setFormError("");
          }}
        >
          Discard changes
        </Button>
        <Button type="submit" loading={saving} disabled={!dirty || uploading}>
          Save profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
