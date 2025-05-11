import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define types for security features
interface SecurityLog {
  id: number | string;
  action:
    | "login"
    | "logout"
    | "password_change"
    | "profile_update"
    | "permission_change"
    | "security_alert";
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  location?: string;
  details?: string;
  userId: number | string;
}

interface SecurityAlert {
  id: number | string;
  type:
    | "suspicious_login"
    | "multiple_failed_attempts"
    | "unusual_location"
    | "permission_change"
    | "account_recovery";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  resolved: boolean;
  details: string;
  userId: number | string;
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // Number of previous passwords to check
  expiryDays: number; // Password expiry in days, 0 for never
}

// Mock data
const MOCK_SECURITY_LOGS: SecurityLog[] = [
  {
    id: 1,
    action: "login",
    timestamp: "2023-09-15T14:32:00",
    ip: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 116.0.5845.110",
    location: "Istanbul, Turkey",
    userId: 1,
  },
  {
    id: 2,
    action: "password_change",
    timestamp: "2023-09-10T09:45:00",
    ip: "192.168.1.1",
    device: "Desktop",
    browser: "Chrome 116.0.5845.110",
    location: "Istanbul, Turkey",
    userId: 1,
  },
  {
    id: 3,
    action: "profile_update",
    timestamp: "2023-09-05T16:20:00",
    ip: "192.168.1.1",
    device: "Mobile",
    browser: "Safari Mobile 16.5",
    location: "Ankara, Turkey",
    details: "Updated profile information",
    userId: 1,
  },
  {
    id: 4,
    action: "login",
    timestamp: "2023-09-03T11:15:00",
    ip: "192.168.1.100",
    device: "Tablet",
    browser: "Safari 16.5",
    location: "Ankara, Turkey",
    userId: 1,
  },
  {
    id: 5,
    action: "security_alert",
    timestamp: "2023-09-01T23:10:00",
    ip: "85.122.45.67",
    device: "Unknown",
    browser: "Unknown",
    location: "Sofia, Bulgaria",
    details: "Failed login attempt from unusual location",
    userId: 1,
  },
];

const MOCK_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 1,
    type: "unusual_location",
    severity: "high",
    timestamp: "2023-09-01T23:10:00",
    resolved: true,
    details:
      "Login attempt from Sofia, Bulgaria. This location does not match your usual login patterns.",
    userId: 1,
  },
  {
    id: 2,
    type: "multiple_failed_attempts",
    severity: "medium",
    timestamp: "2023-08-28T14:25:00",
    resolved: true,
    details: "5 failed login attempts in a short period of time.",
    userId: 1,
  },
  {
    id: 3,
    type: "permission_change",
    severity: "medium",
    timestamp: "2023-08-20T10:30:00",
    resolved: false,
    details: 'User role was changed from "standard" to "admin".',
    userId: 2,
  },
];

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 3,
  expiryDays: 90,
};

export function useSecurity(userId: number | string) {
  const { toast } = useToast();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(
    DEFAULT_PASSWORD_POLICY
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);

  // Fetch security data
  useEffect(() => {
    const fetchSecurityData = async () => {
      setLoading(true);
      try {
        // In a real application, these would be API calls
        // const logsResponse = await fetch(`/api/security/logs?userId=${userId}`);
        // const logsData = await logsResponse.json();
        // setSecurityLogs(logsData);

        // const alertsResponse = await fetch(`/api/security/alerts?userId=${userId}`);
        // const alertsData = await alertsResponse.json();
        // setSecurityAlerts(alertsData);

        // const policyResponse = await fetch('/api/security/password-policy');
        // const policyData = await policyResponse.json();
        // setPasswordPolicy(policyData);

        // const twoFactorResponse = await fetch(`/api/security/two-factor-status?userId=${userId}`);
        // const twoFactorData = await twoFactorResponse.json();
        // setTwoFactorEnabled(twoFactorData.enabled);

        // Using mock data for now
        setSecurityLogs(
          MOCK_SECURITY_LOGS.filter((log) => log.userId === userId)
        );
        setSecurityAlerts(
          MOCK_SECURITY_ALERTS.filter((alert) => alert.userId === userId)
        );
        setTwoFactorEnabled(false);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching security data:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch security data")
        );
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, [userId]);

  // Get recent security logs
  const recentLogs = useMemo(() => {
    return [...securityLogs].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [securityLogs]);

  // Get active security alerts (unresolved)
  const activeAlerts = useMemo(() => {
    return securityAlerts.filter((alert) => !alert.resolved);
  }, [securityAlerts]);

  // Check if password meets policy requirements
  const checkPasswordStrength = (
    password: string
  ): {
    meetsRequirements: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    // Check length
    if (password.length >= passwordPolicy.minLength) {
      score += 20;
    } else {
      feedback.push(
        `Password must be at least ${passwordPolicy.minLength} characters long`
      );
    }

    // Check uppercase
    if (passwordPolicy.requireUppercase && /[A-Z]/.test(password)) {
      score += 20;
    } else if (passwordPolicy.requireUppercase) {
      feedback.push("Password must contain at least one uppercase letter");
    }

    // Check lowercase
    if (passwordPolicy.requireLowercase && /[a-z]/.test(password)) {
      score += 20;
    } else if (passwordPolicy.requireLowercase) {
      feedback.push("Password must contain at least one lowercase letter");
    }

    // Check numbers
    if (passwordPolicy.requireNumbers && /\d/.test(password)) {
      score += 20;
    } else if (passwordPolicy.requireNumbers) {
      feedback.push("Password must contain at least one number");
    }

    // Check special characters
    if (passwordPolicy.requireSpecialChars && /[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else if (passwordPolicy.requireSpecialChars) {
      feedback.push("Password must contain at least one special character");
    }

    return {
      meetsRequirements: feedback.length === 0,
      score,
      feedback,
    };
  };

  // Toggle two-factor authentication
  const toggleTwoFactor = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const newStatus = !twoFactorEnabled;

      // In a real application, this would be an API call
      // await fetch(`/api/security/two-factor`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     enabled: newStatus
      //   })
      // });

      // Update local state
      setTwoFactorEnabled(newStatus);
      setLoading(false);

      toast({
        title: "İki Faktörlü Doğrulama",
        description: newStatus
          ? "İki faktörlü doğrulama başarıyla etkinleştirildi"
          : "İki faktörlü doğrulama devre dışı bırakıldı",
      });

      return true;
    } catch (err) {
      console.error("Error toggling two-factor authentication:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to toggle two-factor authentication")
      );
      setLoading(false);

      toast({
        title: "Hata",
        description: "İki faktörlü doğrulama ayarı değiştirilemedi",
        variant: "destructive",
      });

      return false;
    }
  };

  // Change password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);

    // Check if new password meets requirements
    const passwordCheck = checkPasswordStrength(newPassword);
    if (!passwordCheck.meetsRequirements) {
      toast({
        title: "Güçlü Şifre Gerekli",
        description: passwordCheck.feedback.join(". "),
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }

    try {
      // In a real application, this would be an API call
      // await fetch(`/api/security/change-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     currentPassword,
      //     newPassword
      //   })
      // });

      // Add to security logs
      const newLog: SecurityLog = {
        id: Date.now(),
        action: "password_change",
        timestamp: new Date().toISOString(),
        ip: "192.168.1.1", // In a real app, this would be detected
        device: "Desktop", // In a real app, this would be detected
        browser: "Chrome", // In a real app, this would be detected
        userId,
      };

      setSecurityLogs((prev) => [newLog, ...prev]);
      setLoading(false);

      toast({
        title: "Şifre Değiştirildi",
        description: "Şifreniz başarıyla değiştirildi",
      });

      return true;
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to change password")
      );
      setLoading(false);

      toast({
        title: "Hata",
        description: "Şifre değiştirilemedi",
        variant: "destructive",
      });

      return false;
    }
  };

  // Resolve a security alert
  const resolveAlert = async (alertId: number | string): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/security/alerts/${alertId}/resolve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId })
      // });

      // Update local state
      setSecurityAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );

      setLoading(false);

      toast({
        title: "Uyarı Çözüldü",
        description: "Güvenlik uyarısı çözüldü olarak işaretlendi",
      });

      return true;
    } catch (err) {
      console.error("Error resolving security alert:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to resolve security alert")
      );
      setLoading(false);

      toast({
        title: "Hata",
        description: "Güvenlik uyarısı çözülemedi",
        variant: "destructive",
      });

      return false;
    }
  };

  // Update password policy (admin only)
  const updatePasswordPolicy = async (
    newPolicy: PasswordPolicy
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // await fetch(`/api/security/password-policy`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPolicy)
      // });

      // Update local state
      setPasswordPolicy(newPolicy);
      setLoading(false);

      toast({
        title: "Şifre Politikası Güncellendi",
        description: "Şifre politikası başarıyla güncellendi",
      });

      return true;
    } catch (err) {
      console.error("Error updating password policy:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update password policy")
      );
      setLoading(false);

      toast({
        title: "Hata",
        description: "Şifre politikası güncellenemedi",
        variant: "destructive",
      });

      return false;
    }
  };

  return {
    securityLogs,
    recentLogs,
    securityAlerts,
    activeAlerts,
    passwordPolicy,
    twoFactorEnabled,
    loading,
    error,
    checkPasswordStrength,
    toggleTwoFactor,
    changePassword,
    resolveAlert,
    updatePasswordPolicy,
  };
}
