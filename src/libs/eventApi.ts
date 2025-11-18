import { EventModel } from '@/models/Event.model';
import { EVENT_API } from './eventConstants';

export interface FetchEventsResponse {
  success: boolean;
  count: number;
  data: EventModel[];
}

/**
 * Fetch all events
 */
export async function fetchAllEvents(): Promise<EventModel[]> {
  const response = await fetch(EVENT_API.GET_ALL());
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json() as FetchEventsResponse;
  return data.data || [];
}

/**
 * Create a new event
 */
export async function createEvent(
  formData: Omit<EventModel, '_id'>,
  token: string | null
): Promise<EventModel> {
  const response = await fetch(EVENT_API.CREATE(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save event');
  }

  return response.json();
}

/**
 * Update an existing event
 */
export async function updateEvent(
  id: string,
  formData: Omit<EventModel, '_id'>,
  token: string | null
): Promise<EventModel> {
  const response = await fetch(EVENT_API.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save event');
  }

  return response.json();
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string, token: string | null): Promise<void> {
  const response = await fetch(EVENT_API.DELETE(id), {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
}
