// API endpoints for event management
export const EVENT_API = {
  BASE_URL: 'http://localhost:5000/api/v1/events',
  GET_ALL: () => 'http://localhost:5000/api/v1/events',
  CREATE: () => 'http://localhost:5000/api/v1/events',
  UPDATE: (id: string) => `http://localhost:5000/api/v1/events/${id}`,
  DELETE: (id: string) => `http://localhost:5000/api/v1/events/${id}`,
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_EVENTS: 'Failed to fetch events',
  SAVE_EVENT: 'Failed to save event',
  DELETE_EVENT: 'Failed to delete event',
  NAME_REQUIRED: 'Event name is required',
  DATE_REQUIRED: 'Event date is required',
  DATE_IN_PAST: 'Event date cannot be in the past. Please select today or a future date.',
  VENUE_REQUIRED: 'Venue is required',
  ORGANIZER_REQUIRED: 'Organizer is required',
  TICKETS_INVALID: 'Available tickets must be a positive number',
};

// Form field names
export const FORM_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  EVENT_DATE: 'eventDate',
  VENUE: 'venue',
  ORGANIZER: 'organizer',
  AVAILABLE_TICKET: 'availableTicket',
  POSTER_PICTURE: 'posterPicture',
} as const;

// Table headers
export const TABLE_HEADERS = [
  { label: 'Event Name', key: 'name' },
  { label: 'Date', key: 'date' },
  { label: 'Venue', key: 'venue' },
  { label: 'Organizer', key: 'organizer' },
  { label: 'Available Tickets', key: 'availableTicket' },
  { label: 'Actions', key: 'actions', align: 'right' as const },
];
