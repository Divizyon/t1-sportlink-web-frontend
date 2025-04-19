/**
 * Mock data for modals used in the application
 */

import { ModalType } from "@/types/dashboard";

// Modal display states (for development and testing)
export const MODAL_DISPLAY_STATES: Record<Exclude<ModalType, null>, boolean> = {
  event: false,
  newEvent: false,
  newNews: false,
  newAnnouncement: false,
  user: false,
  users: false,
  dailyEvents: false,
  activeUsers: false,
  totalParticipants: false,
  reportedUsers: false,
  reportedEvents: false,
  orgEvents: false,
};

// Default modal settings
export const DEFAULT_MODAL_SETTINGS = {
  closeOnOverlayClick: true,
  closeOnEsc: true,
  showCloseButton: true,
};
