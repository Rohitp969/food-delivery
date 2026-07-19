import React, { useState, useEffect, useRef } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Save,
  Shield,
  RefreshCw,
  CheckCircle,
  DollarSign,
  Clock,
  Upload,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "GoFood Admin",
    siteTagline: "Delivering Happiness",
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    darkMode: false, // future use – currently not applied
    maintenanceMode: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    orderNotifications: true,
    userNotifications: true,
    systemNotifications: false,
    lowStockAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load settings from localStorage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedGeneral = localStorage.getItem("adminGeneralSettings");
      if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
      const savedNotification = localStorage.getItem("adminNotificationSettings");
      if (savedNotification) setNotificationSettings(JSON.parse(savedNotification));
      const savedSecurity = localStorage.getItem("adminSecuritySettings");
      if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity));
    } catch (err) {
      console.log("Error loading settings:", err);
    }
  };

  // ✅ REMOVED dark mode effect – no dark class toggling

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("adminGeneralSettings", JSON.stringify(generalSettings));
      localStorage.setItem("adminNotificationSettings", JSON.stringify(notificationSettings));
      localStorage.setItem("adminSecuritySettings", JSON.stringify(securitySettings));
      setSaved(true);
      toast.success("All settings saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralChange = (key, value) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };

  const handleNotificationChange = (key, value) => {
    setNotificationSettings({ ...notificationSettings, [key]: value });
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Reset – only toast, no confirm, no reload
  const resetSettings = () => {
    const defaultGeneral = {
      siteName: "GoFood Admin",
      siteTagline: "Delivering Happiness",
      currency: "INR",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      darkMode: false,
      maintenanceMode: false,
    };
    const defaultNotification = {
      pushNotifications: true,
      emailAlerts: true,
      orderNotifications: true,
      userNotifications: true,
      systemNotifications: false,
      lowStockAlerts: true,
    };
    const defaultSecurity = {
      twoFactorAuth: false,
      sessionTimeout: "30",
      maxLoginAttempts: "5",
    };

    setGeneralSettings(defaultGeneral);
    setNotificationSettings(defaultNotification);
    setSecuritySettings(defaultSecurity);

    localStorage.setItem("adminGeneralSettings", JSON.stringify(defaultGeneral));
    localStorage.setItem("adminNotificationSettings", JSON.stringify(defaultNotification));
    localStorage.setItem("adminSecuritySettings", JSON.stringify(defaultSecurity));

    toast.success("Settings reset to default successfully!");
  };

  const exportSettings = () => {
    const allSettings = {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allSettings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Settings exported successfully!");
  };

  const importSettings = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.general) setGeneralSettings(data.general);
        if (data.notifications) setNotificationSettings(data.notifications);
        if (data.security) setSecuritySettings(data.security);
        localStorage.setItem("adminGeneralSettings", JSON.stringify(data.general || generalSettings));
        localStorage.setItem("adminNotificationSettings", JSON.stringify(data.notifications || notificationSettings));
        localStorage.setItem("adminSecuritySettings", JSON.stringify(data.security || securitySettings));
        toast.success("Settings imported successfully!");
        e.target.value = "";
      } catch (err) {
        toast.error("Invalid file format. Please import a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Toggle switch component – no dark mode classes
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white text-gray-900 rounded-2xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
            Admin Only
          </span>
        </div>
        <p className="text-gray-500 mt-2 ml-4">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Saving..." : "Save All"}
        </button>
        <button
          onClick={resetSettings}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all"
        >
          <RefreshCw size={18} />
          Reset Defaults
        </button>
        <button
          onClick={exportSettings}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
        >
          <Download size={18} />
          Export Settings
        </button>
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
        >
          <Upload size={18} />
          Import Settings
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importSettings} className="hidden" />
      </div>

      {/* Settings Cards – No dark mode classes */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon size={20} className="text-blue-500" />
            <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) => handleGeneralChange("siteName", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
              <input
                type="text"
                value={generalSettings.siteTagline}
                onChange={(e) => handleGeneralChange("siteTagline", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter tagline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign size={14} className="inline mr-1" /> Currency
              </label>
              <select
                value={generalSettings.currency}
                onChange={(e) => handleGeneralChange("currency", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock size={14} className="inline mr-1" /> Timezone
              </label>
              <select
                value={generalSettings.timezone}
                onChange={(e) => handleGeneralChange("timezone", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                value={generalSettings.dateFormat}
                onChange={(e) => handleGeneralChange("dateFormat", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <ToggleSwitch
                checked={generalSettings.darkMode}
                onChange={(val) => handleGeneralChange("darkMode", val)}
                label="Dark Mode (Coming Soon)"
                description="Switch to dark theme (currently disabled)"
              />
              <ToggleSwitch
                checked={generalSettings.maintenanceMode}
                onChange={(val) => handleGeneralChange("maintenanceMode", val)}
                label="Maintenance Mode"
                description="Put site under maintenance"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} className="text-purple-500" />
            <h2 className="text-lg font-bold text-gray-800">Notification Settings</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications" },
              { key: "emailAlerts", label: "Email Alerts", desc: "Receive email notifications" },
              { key: "orderNotifications", label: "Order Notifications", desc: "Get notified about new orders" },
              { key: "userNotifications", label: "User Notifications", desc: "Get notified about new users" },
              { key: "systemNotifications", label: "System Notifications", desc: "System updates and maintenance alerts" },
              { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Get notified when stock is low" },
            ].map(({ key, label, desc }) => (
              <ToggleSwitch
                key={key}
                checked={notificationSettings[key]}
                onChange={(val) => handleNotificationChange(key, val)}
                label={label}
                description={desc}
              />
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-gray-800">Security Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
              <input
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => handleSecurityChange("maxLoginAttempts", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <ToggleSwitch
                checked={securitySettings.twoFactorAuth}
                onChange={(val) => handleSecurityChange("twoFactorAuth", val)}
                label="Two-Factor Authentication"
                description="Enable 2FA for extra security"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (min 5 chars)</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="5"
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="5"
                className="w-full px-4 py-2.5 border border-gray-200 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Toast for successful save */}
      {saved && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          Settings saved successfully!
        </div>
      )}
    </div>
  );
};

export default AdminSettings;