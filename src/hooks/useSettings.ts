import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Settings types
interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "tr" | "en";
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    shareActivity: boolean;
    showProfile: boolean;
    allowMessages: boolean;
  };
  display: {
    compactView: boolean;
    showEventImages: boolean;
    dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  };
}

type BooleanDisplaySetting = "compactView" | "showEventImages";

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "tr",
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  privacy: {
    shareActivity: true,
    showProfile: true,
    allowMessages: true,
  },
  display: {
    compactView: false,
    showEventImages: true,
    dateFormat: "DD/MM/YYYY",
  },
};

export function useSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Load settings from localStorage or API
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // In a production app, you might fetch from an API
        // const response = await fetch('/api/settings');
        // const data = await response.json();
        // setSettings(data);

        // For now, we'll use localStorage
        const savedSettings = localStorage.getItem("app_settings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading settings:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load settings")
        );
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save all settings
  const saveSettings = async (newSettings: AppSettings) => {
    setSaving(true);
    try {
      // In a production app, you might save to an API
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newSettings)
      // });

      // For now, we'll use localStorage
      localStorage.setItem("app_settings", JSON.stringify(newSettings));

      setSettings(newSettings);
      setSaving(false);

      toast({
        title: "Ayarlar Kaydedildi",
        description: "Ayarlarınız başarıyla güncellendi.",
      });

      return true;
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to save settings")
      );
      setSaving(false);

      toast({
        title: "Ayarlar Kaydedilemedi",
        description: "Bir hata oluştu.",
        variant: "destructive",
      });

      return false;
    }
  };

  // Update specific setting
  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };

    return saveSettings(newSettings);
  };

  // Update notification setting
  const updateNotificationSetting = async (
    key: keyof AppSettings["notifications"],
    value: boolean
  ) => {
    const newNotifications = {
      ...settings.notifications,
      [key]: value,
    };

    return updateSetting("notifications", newNotifications);
  };

  // Update privacy setting
  const updatePrivacySetting = async (
    key: keyof AppSettings["privacy"],
    value: boolean
  ) => {
    const newPrivacy = {
      ...settings.privacy,
      [key]: value,
    };

    return updateSetting("privacy", newPrivacy);
  };

  // Update display setting
  const updateDisplaySetting = async (
    key: keyof AppSettings["display"],
    value: any
  ) => {
    const newDisplay = {
      ...settings.display,
      [key]: value,
    };

    return updateSetting("display", newDisplay);
  };

  // Reset to default settings
  const resetSettings = async () => {
    return saveSettings(DEFAULT_SETTINGS);
  };

  // Set theme
  const setTheme = async (theme: "light" | "dark" | "system") => {
    return updateSetting("theme", theme);
  };

  // Set language
  const setLanguage = async (language: "tr" | "en") => {
    return updateSetting("language", language);
  };

  // Toggle notification setting
  const toggleNotification = async (
    type: keyof AppSettings["notifications"]
  ) => {
    return updateNotificationSetting(type, !settings.notifications[type]);
  };

  // Toggle privacy setting
  const togglePrivacy = async (type: keyof AppSettings["privacy"]) => {
    return updatePrivacySetting(type, !settings.privacy[type]);
  };

  // Toggle display setting
  const toggleDisplay = async (type: BooleanDisplaySetting) => {
    return updateDisplaySetting(type, !settings.display[type]);
  };

  // Set date format
  const setDateFormat = async (
    format: AppSettings["display"]["dateFormat"]
  ) => {
    return updateDisplaySetting("dateFormat", format);
  };

  return {
    settings,
    loading,
    saving,
    error,
    saveSettings,
    updateSetting,
    updateNotificationSetting,
    updatePrivacySetting,
    updateDisplaySetting,
    resetSettings,
    setTheme,
    setLanguage,
    toggleNotification,
    togglePrivacy,
    toggleDisplay,
    setDateFormat,
  };
}
