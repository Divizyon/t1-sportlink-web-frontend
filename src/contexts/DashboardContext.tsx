"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ModalType } from "@/types";
import { DASHBOARD_TABS } from "@/mockups";
import { DashboardTabValue } from "@/types";

interface DashboardContextType {
  // Active section/tab state
  activeTab: DashboardTabValue;
  setActiveTab: (tab: DashboardTabValue) => void;

  // Selected categories for filtering
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;

  // Modal state management
  activeModal: ModalType;
  setActiveModal: (modal: ModalType, entityData?: any) => void;
  closeModal: () => void;
  modalData: any;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  showSidebar: boolean;
  toggleSidebar: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
}

interface DashboardProviderProps {
  children: ReactNode;
  initialTab?: DashboardTabValue;
}

export function DashboardProvider({
  children,
  initialTab = DASHBOARD_TABS.overview,
}: DashboardProviderProps) {
  // Active section state
  const [activeTab, setActiveTab] = useState<DashboardTabValue>(initialTab);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Modal state
  const [activeModal, setActiveModalState] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(true);

  // Set active modal with associated data
  const setActiveModal = (modal: ModalType, entityData: any = null) => {
    setActiveModalState(modal);
    setModalData(entityData);
  };

  // Close modal and reset data
  const closeModal = () => {
    setActiveModalState(null);
    setModalData(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const value = {
    activeTab,
    setActiveTab,
    selectedCategories,
    setSelectedCategories,
    activeModal,
    setActiveModal,
    closeModal,
    modalData,
    isLoading,
    setIsLoading,
    searchQuery,
    setSearchQuery,
    showSidebar,
    toggleSidebar,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
