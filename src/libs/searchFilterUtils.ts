import { EventModel } from '@/models/Event.model';
import { Ticket } from '@/models/Ticket.model';
import dayjs from 'dayjs';

// Event search and filter
export const searchEventsByNameVenueOrganizer = (events: EventModel[], searchTerm: string): EventModel[] => {
  const term = searchTerm.toLowerCase();
  return events.filter(event =>
    event.name.toLowerCase().includes(term) ||
    event.venue.toLowerCase().includes(term) ||
    event.organizer.toLowerCase().includes(term)
  );
};

export const filterEventsByDate = (events: EventModel[], dateFilter: 'all' | 'upcoming' | 'past'): EventModel[] => {
  const today = dayjs().startOf('day');
  
  switch (dateFilter) {
    case 'upcoming':
      return events.filter(event => dayjs(event.eventDate).isAfter(today) || dayjs(event.eventDate).isSame(today));
    case 'past':
      return events.filter(event => dayjs(event.eventDate).isBefore(today));
    case 'all':
    default:
      return events;
  }
};

export const filterEventsByDateRange = (events: EventModel[], startDate: string | null, endDate: string | null): EventModel[] => {
  if (!startDate && !endDate) {
    return events;
  }

  return events.filter(event => {
    const eventDate = dayjs(event.eventDate);
    let isInRange = true;

    if (startDate) {
      isInRange = isInRange && (eventDate.isAfter(dayjs(startDate)) || eventDate.isSame(dayjs(startDate), 'day'));
    }

    if (endDate) {
      isInRange = isInRange && (eventDate.isBefore(dayjs(endDate)) || eventDate.isSame(dayjs(endDate), 'day'));
    }

    return isInRange;
  });
};

export const filterEventsByTicketAvailability = (events: EventModel[], availabilityFilter: 'all' | 'available' | 'soldout'): EventModel[] => {
  switch (availabilityFilter) {
    case 'available':
      return events.filter(event => event.availableTicket > 0);
    case 'soldout':
      return events.filter(event => event.availableTicket === 0);
    case 'all':
    default:
      return events;
  }
};

// Reservation search and filter
export const searchReservations = (reservations: Ticket[], searchTerm: string): Ticket[] => {
  const term = searchTerm.toLowerCase();
  return reservations.filter(reservation =>
    (typeof reservation.user === 'string' && reservation.user.toLowerCase().includes(term)) ||
    reservation.event?.name?.toLowerCase().includes(term) ||
    reservation.event?.venue?.toLowerCase().includes(term)
  );
};

export const filterReservationsByDateRange = (reservations: Ticket[], dateFilter: 'all' | 'today' | 'week' | 'month'): Ticket[] => {
  const today = dayjs();
  
  switch (dateFilter) {
    case 'today':
      return reservations.filter(res =>
        dayjs(res.event?.eventDate).isSame(today, 'day')
      );
    case 'week':
      return reservations.filter(res =>
        dayjs(res.event?.eventDate).isAfter(today.subtract(7, 'day')) &&
        dayjs(res.event?.eventDate).isBefore(today.add(7, 'day'))
      );
    case 'month':
      return reservations.filter(res =>
        dayjs(res.event?.eventDate).isAfter(today.subtract(30, 'day')) &&
        dayjs(res.event?.eventDate).isBefore(today.add(30, 'day'))
      );
    case 'all':
    default:
      return reservations;
  }
};

export const filterReservationsByEventDateRange = (
  reservations: Ticket[],
  startDate: string | null,
  endDate: string | null
): Ticket[] => {
  if (!startDate && !endDate) {
    return reservations;
  }

  return reservations.filter(reservation => {
    const eventDate = dayjs(reservation.event?.eventDate);
    let isInRange = true;

    if (startDate) {
      isInRange = isInRange && (eventDate.isAfter(dayjs(startDate)) || eventDate.isSame(dayjs(startDate), 'day'));
    }

    if (endDate) {
      isInRange = isInRange && (eventDate.isBefore(dayjs(endDate)) || eventDate.isSame(dayjs(endDate), 'day'));
    }

    return isInRange;
  });
};

export const filterReservationsByRequestedDateRange = (
  reservations: Ticket[],
  startDate: string | null,
  endDate: string | null
): Ticket[] => {
  if (!startDate && !endDate) {
    return reservations;
  }

  return reservations.filter(reservation => {
    const requestedDate = dayjs(reservation.createdAt);
    let isInRange = true;

    if (startDate) {
      isInRange = isInRange && (requestedDate.isAfter(dayjs(startDate)) || requestedDate.isSame(dayjs(startDate), 'day'));
    }

    if (endDate) {
      isInRange = isInRange && (requestedDate.isBefore(dayjs(endDate)) || requestedDate.isSame(dayjs(endDate), 'day'));
    }

    return isInRange;
  });
};

export const filterReservationsByTicketAmount = (
  reservations: Ticket[],
  minAmount: number | null,
  maxAmount: number | null
): Ticket[] => {
  return reservations.filter(reservation => {
    let isInRange = true;

    if (minAmount !== null) {
      isInRange = isInRange && reservation.ticketAmount >= minAmount;
    }

    if (maxAmount !== null) {
      isInRange = isInRange && reservation.ticketAmount <= maxAmount;
    }

    return isInRange;
  });
};
