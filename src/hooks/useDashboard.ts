import { useState, useCallback, useEffect } from "react";
import { DashboardTabValue, ModalType, Event, User, Report } from "@/types";
import { DASHBOARD_TABS } from "@/constants/dashboard";
import { useToast } from "@/components/ui/use-toast";

interface DashboardState {
  activeTab: DashboardTabValue;
  activeModal: ModalType;
  selectedEvent: Event | null;
  selectedUser: User | null;
  selectedReport: Report | null;
  isLoading: boolean;
}

export function useDashboard(initialState: Partial<DashboardState> = {}) {
  const { toast } = useToast();

  // Dashboard state
  const [activeTab, setActiveTab] = useState<DashboardTabValue>(
    initialState.activeTab || DASHBOARD_TABS.overview
  );
  const [activeModal, setActiveModal] = useState<ModalType>(
    initialState.activeModal || null
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    initialState.selectedEvent || null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(
    initialState.selectedUser || null
  );
  const [selectedReport, setSelectedReport] = useState<Report | null>(
    initialState.selectedReport || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    initialState.isLoading || false
  );

  // Handle tab changes
  const handleTabChange = useCallback((tab: DashboardTabValue) => {
    setActiveTab(tab);
  }, []);

  // Open a modal with the selected entity
  const openModal = useCallback((type: ModalType, entityData: any = null) => {
    switch (type) {
      case "event":
      case "newEvent":
      case "dailyEvents":
      case "orgEvents":
        setSelectedEvent(entityData);
        break;
      case "user":
      case "users":
      case "activeUsers":
      case "totalParticipants":
        setSelectedUser(entityData);
        break;
      case "reportedUsers":
      case "reportedEvents":
        setSelectedReport(entityData);
        break;
    }
    setActiveModal(type);
  }, []);

  // Close any open modal
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedEvent(null);
    setSelectedUser(null);
    setSelectedReport(null);
  }, []);

  // Show success toast
  const showSuccessToast = useCallback(
    (title: string, description: string) => {
      toast({
        title,
        description,
      });
    },
    [toast]
  );

  // Show error toast
  const showErrorToast = useCallback(
    (title: string, description: string) => {
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
    [toast]
  );

  // Handle form submissions
  const handleFormSubmit = useCallback(
    (formType: string, data: any) => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);

        // Success handling based on form type
        switch (formType) {
          case "newEvent":
            showSuccessToast(
              "Etkinlik Oluşturuldu",
              `${data.title} etkinliği başarıyla oluşturuldu.`
            );
            break;
          case "editEvent":
            showSuccessToast(
              "Etkinlik Güncellendi",
              `${data.title} etkinliği başarıyla güncellendi.`
            );
            break;
          case "updateReport":
            showSuccessToast(
              "Rapor Güncellendi",
              "Rapor durumu başarıyla güncellendi."
            );
            break;
          default:
            showSuccessToast(
              "İşlem Tamamlandı",
              "İşleminiz başarıyla tamamlandı."
            );
        }

        // Close modal after successful form submission
        closeModal();
      }, 800); // Simulate API delay
    },
    [closeModal, showSuccessToast]
  );

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Sync with URL query parameters on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get("tab");

    if (
      tabParam &&
      Object.values(DASHBOARD_TABS).includes(tabParam as DashboardTabValue)
    ) {
      setActiveTab(tabParam as DashboardTabValue);
    }
  }, []);

  return {
    // State
    activeTab,
    activeModal,
    selectedEvent,
    selectedUser,
    selectedReport,
    isLoading,

    // Actions
    setActiveTab: handleTabChange,
    openModal,
    closeModal,
    setSelectedEvent,
    setSelectedUser,
    setSelectedReport,
    setLoading,
    handleFormSubmit,
    showSuccessToast,
    showErrorToast,
  };
}
