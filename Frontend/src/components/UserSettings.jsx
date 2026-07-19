import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Home,
  Plus,
  Trash2,
  LogOut,
  Edit,
  X,
  Moon,
  Sun,
  Clock,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  DollarSign, // ✅ Added missing import
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const UserSettings = () => {
  const [loading, setLoading] = useState(false);

  // -------- Profile ----------
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // -------- Preferences ----------
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    darkMode: false,
  });
  const [editPrefs, setEditPrefs] = useState({ ...preferences });
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);

  // -------- Privacy ----------
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    shareLocation: false,
    allowCookies: true,
  });

  // -------- Notifications ----------
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    orderUpdates: true,
    promotionalOffers: false,
    notificationSounds: true,
  });

  // -------- Addresses ----------
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // -------- Payment Methods ----------
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPayment, setNewPayment] = useState({
    type: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    upiId: "",
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // -------- Change Password ----------
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // -------- Load Data ----------
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const name = localStorage.getItem("userName") || "Rohit Prajapati";
      const email = localStorage.getItem("userEmail") || "rohit@example.com";
      const phone = localStorage.getItem("userPhone") || "+91 9876543210";
      const location = localStorage.getItem("userLocation") || "Mumbai, India";
      setProfile({ name, email, phone, location });
      setEditProfile({ name, email, phone, location });

      const savedPrefs = localStorage.getItem("userPreferences");
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(parsed);
        setEditPrefs(parsed);
      } else {
        setEditPrefs(preferences);
      }

      const savedPrivacy = localStorage.getItem("userPrivacy");
      if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));

      const savedNotifs = localStorage.getItem("userNotificationSettings");
      if (savedNotifs) setNotificationSettings(JSON.parse(savedNotifs));

      const savedAddresses = localStorage.getItem("userAddresses");
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      } else {
        const defaultAddr = {
          id: Date.now(),
          name: "Rohit Prajapati",
          phone: "+91 9876543210",
          address: "123, Food Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        };
        setAddresses([defaultAddr]);
        localStorage.setItem("userAddresses", JSON.stringify([defaultAddr]));
      }

      const savedPayments = localStorage.getItem("userPayments");
      if (savedPayments) {
        setPaymentMethods(JSON.parse(savedPayments));
      } else {
        const defaultPayment = {
          id: Date.now() + 1,
          type: "card",
          cardNumber: "•••• •••• •••• 4242",
          cardName: "Rohit Prajapati",
          expiry: "12/26",
        };
        setPaymentMethods([defaultPayment]);
        localStorage.setItem("userPayments", JSON.stringify([defaultPayment]));
      }
    } catch (err) {
      console.error("Error loading user settings:", err);
    }
  };

  // -------- Profile Handlers ----------
  const handleProfileChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    setProfile(editProfile);
    localStorage.setItem("userName", editProfile.name);
    localStorage.setItem("userEmail", editProfile.email);
    localStorage.setItem("userPhone", editProfile.phone);
    localStorage.setItem("userLocation", editProfile.location);
    toast.success("Profile updated!");
    setIsEditingProfile(false);
  };

  // -------- Preferences Handlers ----------
  const handlePrefChange = (key, value) => {
    setEditPrefs({ ...editPrefs, [key]: value });
  };

  const savePreferences = () => {
    setPreferences(editPrefs);
    localStorage.setItem("userPreferences", JSON.stringify(editPrefs));
    toast.success("Preferences updated!");
    setIsEditingPrefs(false);
  };

  // -------- Privacy Handlers ----------
  const togglePrivacy = (key) => {
    const updated = { ...privacySettings, [key]: !privacySettings[key] };
    setPrivacySettings(updated);
    localStorage.setItem("userPrivacy", JSON.stringify(updated));
    toast.info(`${key.replace(/([A-Z])/g, " $1").trim()} toggled`);
  };

  // -------- Notification Toggle ----------
  const toggleNotification = (key) => {
    const updated = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(updated);
    localStorage.setItem("userNotificationSettings", JSON.stringify(updated));
    toast.info(`${key.replace(/([A-Z])/g, " $1").trim()} toggled`);
  };

  // -------- Address Handlers ----------
  const handleAddAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill all fields");
      return;
    }
    const addr = { ...newAddress, id: Date.now() };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setNewAddress({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setShowAddressForm(false);
    toast.success("Address added!");
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Delete this address?")) {
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated);
      localStorage.setItem("userAddresses", JSON.stringify(updated));
      toast.success("Address removed");
    }
  };

  // -------- Payment Handlers ----------
  const handleAddPayment = () => {
    if (newPayment.type === "card") {
      if (!newPayment.cardNumber || !newPayment.cardName || !newPayment.expiry) {
        toast.error("Please fill all card details");
        return;
      }
    } else {
      if (!newPayment.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
    }
    const payment = { id: Date.now(), ...newPayment };
    const updated = [...paymentMethods, payment];
    setPaymentMethods(updated);
    localStorage.setItem("userPayments", JSON.stringify(updated));
    setNewPayment({ type: "card", cardNumber: "", cardName: "", expiry: "", upiId: "" });
    setShowPaymentForm(false);
    toast.success("Payment method added!");
  };

  const handleDeletePayment = (id) => {
    if (window.confirm("Remove this payment method?")) {
      const updated = paymentMethods.filter((p) => p.id !== id);
      setPaymentMethods(updated);
      localStorage.setItem("userPayments", JSON.stringify(updated));
      toast.success("Payment method removed");
    }
  };

  // -------- Password Handlers ----------
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // -------- Logout ----------
  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.clear();
      toast.success("Logged out");
      window.location.href = "/login";
    }
  };

  // -------- Components ----------
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
      <div className="flex-1 pr-4">
        <p className="font-medium text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, editMode, onEdit, onCancel }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-500" />
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
      </div>
      {!editMode && onEdit && (
        <button onClick={onEdit} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <Edit size={13} /> Edit
        </button>
      )}
      {editMode && onCancel && (
        <button onClick={onCancel} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
          <X size={13} /> Cancel
        </button>
      )}
    </div>
  );

  // -------- Render ----------
  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h1 className="text-2xl font-bold text-gray-800">User Settings</h1>
          <span className="ml-1 text-[10px] bg-green-100 text-green-600 px-2.5 py-0.5 rounded-full font-medium">
            My Account
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1 ml-4">
          Manage your profile, preferences, and account settings
        </p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* ----- Profile ----- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <SectionHeader
            icon={User}
            title="Profile Information"
            editMode={isEditingProfile}
            onEdit={() => setIsEditingProfile(true)}
            onCancel={() => setIsEditingProfile(false)}
          />
          {isEditingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editProfile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editProfile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editProfile.location}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <button onClick={saveProfile} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Save</button>
                <button onClick={() => setIsEditingProfile(false)} className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium text-gray-600">Name:</span> {profile.name}</div>
              <div><span className="font-medium text-gray-600">Email:</span> {profile.email}</div>
              <div><span className="font-medium text-gray-600">Phone:</span> {profile.phone}</div>
              <div><span className="font-medium text-gray-600">Location:</span> {profile.location}</div>
            </div>
          )}
        </div>

        {/* ----- Preferences ----- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <SectionHeader
            icon={SettingsIcon}
            title="Preferences"
            editMode={isEditingPrefs}
            onEdit={() => {
              setEditPrefs(preferences);
              setIsEditingPrefs(true);
            }}
            onCancel={() => setIsEditingPrefs(false)}
          />
          {isEditingPrefs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={editPrefs.language}
                  onChange={(e) => handlePrefChange("language", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={editPrefs.currency}
                  onChange={(e) => handlePrefChange("currency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={editPrefs.timezone}
                  onChange={(e) => handlePrefChange("timezone", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date Format</label>
                <select
                  value={editPrefs.dateFormat}
                  onChange={(e) => handlePrefChange("dateFormat", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Dark Mode</p>
                  <p className="text-xs text-gray-500">Switch to dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPrefs.darkMode}
                    onChange={(e) => handlePrefChange("darkMode", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500">
                    <div className="absolute top-1 left-1 text-xs text-gray-500 peer-checked:text-white peer-checked:left-6 transition-all">
                      {editPrefs.darkMode ? "🌙" : "☀️"}
                    </div>
                  </div>
                </label>
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <button onClick={savePreferences} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Save</button>
                <button onClick={() => setIsEditingPrefs(false)} className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium text-gray-600">Language:</span> {preferences.language === 'en' ? 'English' : preferences.language}</div>
              <div><span className="font-medium text-gray-600">Currency:</span> {preferences.currency}</div>
              <div><span className="font-medium text-gray-600">Timezone:</span> {preferences.timezone}</div>
              <div><span className="font-medium text-gray-600">Date Format:</span> {preferences.dateFormat}</div>
              <div><span className="font-medium text-gray-600">Dark Mode:</span> {preferences.darkMode ? 'Enabled' : 'Disabled'}</div>
            </div>
          )}
        </div>

        {/* ----- Privacy ----- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-purple-500" />
            <h2 className="text-base font-bold text-gray-800">Privacy</h2>
          </div>
          <div className="space-y-1.5">
            {[
              { key: "showOnlineStatus", label: "Show Online Status", desc: "Let others see when you're online" },
              { key: "shareLocation", label: "Share Location", desc: "Allow app to use your location" },
              { key: "allowCookies", label: "Allow Cookies", desc: "Enable cookies for personalized experience" },
            ].map(({ key, label, desc }) => (
              <ToggleSwitch
                key={key}
                checked={privacySettings[key]}
                onChange={() => togglePrivacy(key)}
                label={label}
                description={desc}
              />
            ))}
          </div>
        </div>

        {/* ----- Notifications (Compact) ----- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={18} className="text-purple-500" />
            <h2 className="text-base font-bold text-gray-800">Notification Settings</h2>
          </div>
          <div className="space-y-1.5">
            {[
              { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications" },
              { key: "emailAlerts", label: "Email Alerts", desc: "Receive email notifications" },
              { key: "orderUpdates", label: "Order Updates", desc: "Get notified about your orders" },
              { key: "promotionalOffers", label: "Promotional Offers", desc: "Receive offers and deals" },
              { key: "notificationSounds", label: "Notification Sounds", desc: "Play sound for notifications" },
            ].map(({ key, label, desc }) => (
              <ToggleSwitch
                key={key}
                checked={notificationSettings[key]}
                onChange={() => toggleNotification(key)}
                label={label}
                description={desc}
              />
            ))}
          </div>
        </div>

        {/* // -------- Addresses -------- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Home size={18} className="text-green-500" />
            <h2 className="text-base font-bold text-gray-800">Saved Addresses</h2>
          </div>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="font-medium text-gray-800">{addr.name}</p>
                  <p className="text-xs text-gray-500">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-xs text-gray-400">{addr.phone}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {showAddressForm && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddAddress} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Add</button>
                  <button onClick={() => setShowAddressForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                </div>
              </div>
            )}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus size={15} /> Add New Address
              </button>
            )}
          </div>
        </div>

        {/* // -------- Payment Methods -------- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">Payment Methods</h2>
          </div>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="font-medium text-gray-800">
                    {pm.type === "card" ? "💳" : "📱"} {pm.type === "card" ? pm.cardNumber : pm.upiId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pm.type === "card" ? `${pm.cardName} • Exp: ${pm.expiry}` : "UPI"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePayment(pm.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {showPaymentForm && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <select
                  value={newPayment.type}
                  onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
                {newPayment.type === "card" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={newPayment.cardNumber}
                      onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={newPayment.cardName}
                      onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Expiry (MM/YY)"
                      value={newPayment.expiry}
                      onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="UPI ID (e.g., name@upi)"
                    value={newPayment.upiId}
                    onChange={(e) => setNewPayment({ ...newPayment, upiId: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <div className="flex gap-2">
                  <button onClick={handleAddPayment} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Add</button>
                  <button onClick={() => setShowPaymentForm(false)} className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                </div>
              </div>
            )}
            {!showPaymentForm && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus size={15} /> Add Payment Method
              </button>
            )}
          </div>
        </div>

        {/* // -------- Change Password -------- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={18} className="text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">Change Password</h2>
          </div>
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Edit size={13} /> Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-md">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">New Password (min 6 chars)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                  className="w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

         {/* -------- Logout -------- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all text-sm"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserSettings;