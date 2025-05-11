"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ModalType } from "@/types";
import { DASHBOARD_TABS } from "@/constants/dashboard";

interface DashboardContextType {
  // Active section/tab state
  activeTab: string;
  setActiveTab: (tab: string) => void;

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
  initialTab?: string;
}

export function DashboardProvider({
  children,
  initialTab = DASHBOARD_TABS.overview,
}: DashboardProviderProps) {
  // Active section state
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Modal state
  const [activeModal, setActiveModalState] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
