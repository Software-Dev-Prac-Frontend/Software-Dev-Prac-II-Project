import { EventModel } from '@/models/Event.model';

/**
 * Validates event form data
 * @returns error message if validation fails, null otherwise
 */
export function validateEventForm(formData: {
  name: string;
  eventDate: string;
  venue: string;
  organizer: string;
  availableTicket: string;
}): string | null {
  if (!formData.name.trim()) {
    return 'Event name is required';
  }

  if (!formData.eventDate) {
    return 'Event date is required';
  }

  if (!isDateInFutureOrToday(formData.eventDate)) {
    return 'Event date cannot be in the past. Please select today or a future date.';
  }

  if (!formData.venue.trim()) {
    return 'Venue is required';
  }

  if (!formData.organizer.trim()) {
    return 'Organizer is required';
  }

  if (!isValidTicketCount(formData.availableTicket)) {
    return 'Available tickets must be a positive number';
  }

  return null;
}

/**
 * Check if date is today or in the future
 */
export function isDateInFutureOrToday(dateString: string): boolean {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

/**
 * Check if ticket count is valid
 */
export function isValidTicketCount(ticketCount: string): boolean {
  return !!ticketCount && !isNaN(Number(ticketCount)) && Number(ticketCount) > 0;
}

/**
 * Format date for display
 */
export function formatEventDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Get today's date in input format
 */
export function getTodayDateForInput(): string {
  return new Date().toISOString().split('T')[0];
}
