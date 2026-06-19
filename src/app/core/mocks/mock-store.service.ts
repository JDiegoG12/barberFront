import { Injectable } from '@angular/core';
import { Barber, DaySchedule } from '../models/views/barber.view.model';
import { Service } from '../models/views/service.view.model';
import { Category } from '../models/views/category.view.model';
import { Reservation, ReservationStatus } from '../models/views/reservation.view.model';
import { WorkShiftRequestDTO, DayOfWeekString } from '../models/dto/barber-request.dto';
import {
  MOCK_BARBERS,
  MOCK_SERVICES,
  MOCK_CATEGORIES,
  MOCK_RESERVATIONS,
  MOCK_USER_NAMES
} from './mock-data';

/** Forma serializable de una reserva (fechas como ISO string, sin objetos anidados). */
interface StoredReservation {
  id: number;
  clientId: string;
  barberId: string;
  serviceId: number;
  start: string;
  end: string;
  price: number;
  status: ReservationStatus;
}

const KEYS = {
  barbers: 'mock_barbers',
  services: 'mock_services',
  categories: 'mock_categories',
  reservations: 'mock_reservations',
  seeded: 'mock_seeded_v1'
} as const;

// Mapeo entre el número de día (Date.getDay) y el string del DTO de backend.
const DAY_NUM_TO_STR: Record<number, DayOfWeekString> = {
  0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY', 4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
};
const DAY_STR_TO_NUM: Record<DayOfWeekString, number> = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
};

/**
 * Almacén de datos simulado persistido en localStorage.
 *
 * Actúa como un "backend falso": se siembra una vez con los datos de mock-data.ts
 * y mantiene el estado entre recargas. Todos los servicios de API delegan aquí
 * cuando `environment.useMock` está activo.
 *
 * Devuelve valores planos (no Observables); son los servicios quienes los envuelven
 * con `of(...)` para mantener su firma pública.
 */
@Injectable({ providedIn: 'root' })
export class MockStore {

  constructor() {
    this.seedIfNeeded();
  }

  // ==========================================
  // SEMILLA / PERSISTENCIA
  // ==========================================

  private seedIfNeeded(): void {
    if (localStorage.getItem(KEYS.seeded)) {
      return;
    }
    this.write(KEYS.barbers, MOCK_BARBERS);
    this.write(KEYS.services, MOCK_SERVICES);
    this.write(KEYS.categories, MOCK_CATEGORIES);
    this.write(KEYS.reservations, MOCK_RESERVATIONS.map(r => this.toStored(r)));
    localStorage.setItem(KEYS.seeded, 'true');
  }

  /** Reinicia los datos a la semilla original (útil para demos). */
  reset(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    this.seedIfNeeded();
  }

  private read<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  private write<T>(key: string, value: T[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ==========================================
  // BARBEROS
  // ==========================================

  getAllBarbers(): Barber[] {
    return this.read<Barber>(KEYS.barbers);
  }

  getActiveBarbers(): Barber[] {
    return this.getAllBarbers().filter(b => b.systemStatus === 'Activo');
  }

  getBarberById(id: string): Barber | undefined {
    return this.getAllBarbers().find(b => b.id === id);
  }

  createBarber(data: { name: string; lastName?: string; bio?: string; photoUrl?: string }): Barber {
    const barbers = this.getAllBarbers();
    const newBarber: Barber = {
      id: `barber-${Date.now()}`,
      name: data.name,
      lastName: data.lastName ?? '',
      photoUrl: data.photoUrl || 'https://randomuser.me/api/portraits/men/0.jpg',
      bio: data.bio ?? '',
      serviceIds: [],
      availabilityStatus: 'Disponible',
      systemStatus: 'Activo',
      schedule: this.emptySchedule()
    };
    barbers.push(newBarber);
    this.write(KEYS.barbers, barbers);
    return newBarber;
  }

  updateBarber(id: string, data: { name?: string; lastName?: string; bio?: string; description?: string; photoUrl?: string }): Barber {
    const barbers = this.getAllBarbers();
    const barber = barbers.find(b => b.id === id);
    if (!barber) throw new Error(`Barbero ${id} no encontrado`);
    if (data.name !== undefined) barber.name = data.name;
    if (data.lastName !== undefined) barber.lastName = data.lastName;
    const bio = data.bio ?? data.description;
    if (bio !== undefined) barber.bio = bio;
    if (data.photoUrl) barber.photoUrl = data.photoUrl;
    this.write(KEYS.barbers, barbers);
    return barber;
  }

  deactivateBarber(id: string): Barber {
    const barbers = this.getAllBarbers();
    const barber = barbers.find(b => b.id === id);
    if (!barber) throw new Error(`Barbero ${id} no encontrado`);
    barber.systemStatus = 'Inactivo';
    this.write(KEYS.barbers, barbers);
    return barber;
  }

  setBarberAvailability(id: string, available: boolean): Barber {
    const barbers = this.getAllBarbers();
    const barber = barbers.find(b => b.id === id);
    if (!barber) throw new Error(`Barbero ${id} no encontrado`);
    barber.availabilityStatus = available ? 'Disponible' : 'No Disponible';
    this.write(KEYS.barbers, barbers);
    return barber;
  }

  /** Asigna una lista de servicios a un barbero (reemplaza la lista actual). */
  assignServicesToBarber(barberId: string, serviceIds: number[]): Service[] {
    const barbers = this.getAllBarbers();
    const barber = barbers.find(b => b.id === barberId);
    if (barber) {
      barber.serviceIds = [...serviceIds];
      this.write(KEYS.barbers, barbers);
    }
    // Sincronizar el lado de los servicios (barberIds)
    const services = this.read<Service>(KEYS.services);
    services.forEach(s => {
      const has = serviceIds.includes(s.id);
      const ids = new Set((s.barberIds || []).map(x => String(x)));
      if (has) ids.add(barberId); else ids.delete(barberId);
      s.barberIds = Array.from(ids);
    });
    this.write(KEYS.services, services);
    return services.filter(s => serviceIds.includes(s.id));
  }

  getServicesByBarber(barberId: string): Service[] {
    return this.read<Service>(KEYS.services)
      .filter(s => (s.barberIds || []).map(x => String(x)).includes(barberId));
  }

  // --- Horarios ---

  private emptySchedule(): DaySchedule[] {
    return [0, 1, 2, 3, 4, 5, 6].map(d => ({ dayOfWeek: d, shifts: [] }));
  }

  /** Persiste el horario semanal de un barbero a partir de la lista plana de turnos. */
  saveSchedule(shifts: WorkShiftRequestDTO[]): WorkShiftRequestDTO[] {
    if (!shifts || shifts.length === 0) return [];
    const barberId = shifts[0].barberId;
    const barbers = this.getAllBarbers();
    const barber = barbers.find(b => b.id === barberId);
    if (barber) {
      const schedule = this.emptySchedule();
      shifts.forEach(s => {
        const dayNum = DAY_STR_TO_NUM[s.dayOfWeek];
        const day = schedule.find(d => d.dayOfWeek === dayNum);
        day?.shifts.push({ start: s.startTime, end: s.endTime });
      });
      barber.schedule = schedule;
      this.write(KEYS.barbers, barbers);
    }
    return shifts;
  }

  getSchedule(barberId: string): WorkShiftRequestDTO[] {
    const barber = this.getBarberById(barberId);
    if (!barber) return [];
    const result: WorkShiftRequestDTO[] = [];
    barber.schedule.forEach(day => {
      day.shifts.forEach(shift => {
        result.push({
          dayOfWeek: DAY_NUM_TO_STR[day.dayOfWeek],
          startTime: shift.start,
          endTime: shift.end,
          barberId
        });
      });
    });
    return result;
  }

  // ==========================================
  // SERVICIOS Y CATEGORÍAS
  // ==========================================

  getCategories(): Category[] {
    return this.read<Category>(KEYS.categories);
  }

  createCategory(name: string): Category {
    const categories = this.getCategories();
    const newCategory: Category = { id: this.nextNumericId(categories), name };
    categories.push(newCategory);
    this.write(KEYS.categories, categories);
    return newCategory;
  }

  getServices(includeInactive = false): Service[] {
    const services = this.read<Service>(KEYS.services);
    return includeInactive ? services : services.filter(s => s.systemStatus === 'Activo');
  }

  getServiceById(id: number): Service | undefined {
    return this.read<Service>(KEYS.services).find(s => s.id === id);
  }

  getBarberIdsByService(id: number): string[] {
    const service = this.getServiceById(id);
    return service ? (service.barberIds || []).map(x => String(x)) : [];
  }

  createService(data: { name: string; description: string; price: number; duration: number; categoryId: number }): Service {
    const services = this.read<Service>(KEYS.services);
    const newService: Service = {
      id: this.nextNumericId(services),
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      categoryId: data.categoryId,
      barberIds: [],
      availabilityStatus: 'Disponible',
      systemStatus: 'Activo'
    };
    services.push(newService);
    this.write(KEYS.services, services);
    return newService;
  }

  updateService(id: number, data: { name: string; description: string; price: number; duration: number; categoryId: number; availabilityStatus?: 'Disponible' | 'No Disponible' }): Service {
    const services = this.read<Service>(KEYS.services);
    const service = services.find(s => s.id === id);
    if (!service) throw new Error(`Servicio ${id} no encontrado`);
    service.name = data.name;
    service.description = data.description;
    service.price = data.price;
    service.duration = data.duration;
    service.categoryId = data.categoryId;
    if (data.availabilityStatus) service.availabilityStatus = data.availabilityStatus;
    this.write(KEYS.services, services);
    return service;
  }

  assignBarbersToService(id: number, barberIds: string[]): Service {
    const services = this.read<Service>(KEYS.services);
    const service = services.find(s => s.id === id);
    if (!service) throw new Error(`Servicio ${id} no encontrado`);
    service.barberIds = [...barberIds];
    this.write(KEYS.services, services);
    // Sincronizar el lado de los barberos
    const barbers = this.getAllBarbers();
    barbers.forEach(b => {
      const has = barberIds.includes(b.id);
      const ids = new Set(b.serviceIds);
      if (has) ids.add(id); else ids.delete(id);
      b.serviceIds = Array.from(ids);
    });
    this.write(KEYS.barbers, barbers);
    return service;
  }

  deleteService(id: number): void {
    const services = this.read<Service>(KEYS.services);
    const service = services.find(s => s.id === id);
    if (service) {
      service.systemStatus = 'Inactivo';
      this.write(KEYS.services, services);
    }
  }

  // ==========================================
  // RESERVAS
  // ==========================================

  private toStored(r: Reservation): StoredReservation {
    return {
      id: r.id,
      clientId: r.clientId,
      barberId: r.barberId,
      serviceId: r.serviceId,
      start: new Date(r.start).toISOString(),
      end: new Date(r.end).toISOString(),
      price: r.price,
      status: r.status
    };
  }

  /** Convierte la reserva almacenada a modelo de vista, hidratando barbero y servicio. */
  private hydrate(s: StoredReservation): Reservation {
    return {
      id: s.id,
      clientId: s.clientId,
      barberId: s.barberId,
      serviceId: s.serviceId,
      start: new Date(s.start),
      end: new Date(s.end),
      price: s.price,
      status: s.status,
      barber: this.getBarberById(s.barberId),
      service: this.getServiceById(s.serviceId)
    };
  }

  private allReservations(): StoredReservation[] {
    return this.read<StoredReservation>(KEYS.reservations);
  }

  /** Todas las reservas hidratadas (usado por los reportes). */
  getAllReservations(): Reservation[] {
    return this.allReservations().map(r => this.hydrate(r));
  }

  getActiveReservationsByClient(clientId: string): Reservation[] {
    return this.allReservations()
      .filter(r => r.clientId === clientId && r.status !== 'Finalizada' && r.status !== 'Cancelada')
      .map(r => this.hydrate(r))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  getHistoryByClient(clientId: string): Reservation[] {
    return this.allReservations()
      .filter(r => r.clientId === clientId && (r.status === 'Finalizada' || r.status === 'Cancelada'))
      .map(r => this.hydrate(r))
      .sort((a, b) => b.start.getTime() - a.start.getTime());
  }

  getReservationsByBarber(barberId: string): Reservation[] {
    return this.allReservations()
      .filter(r => r.barberId === barberId)
      .map(r => this.hydrate(r))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  getReservationsByBarberAndDate(barberId: string, date: Date): Reservation[] {
    const target = new Date(date);
    return this.getReservationsByBarber(barberId).filter(r =>
      r.start.getFullYear() === target.getFullYear() &&
      r.start.getMonth() === target.getMonth() &&
      r.start.getDate() === target.getDate()
    );
  }

  createReservation(data: Partial<Reservation>): Reservation {
    const reservations = this.allReservations();
    const service = data.serviceId != null ? this.getServiceById(data.serviceId) : undefined;
    const start = new Date(data.start!);
    const end = data.end
      ? new Date(data.end)
      : new Date(start.getTime() + (service?.duration ?? 30) * 60000);

    const stored: StoredReservation = {
      id: this.nextNumericId(reservations),
      clientId: data.clientId!,
      barberId: data.barberId!,
      serviceId: data.serviceId!,
      start: start.toISOString(),
      end: end.toISOString(),
      price: data.price ?? service?.price ?? 0,
      status: 'En espera'
    };
    reservations.push(stored);
    this.write(KEYS.reservations, reservations);
    return this.hydrate(stored);
  }

  updateReservationStatus(id: number, status: ReservationStatus): Reservation {
    const reservations = this.allReservations();
    const r = reservations.find(x => x.id === id);
    if (!r) throw new Error(`Reserva ${id} no encontrada`);
    r.status = status;
    this.write(KEYS.reservations, reservations);
    return this.hydrate(r);
  }

  cancelReservation(id: number): Reservation {
    return this.updateReservationStatus(id, 'Cancelada');
  }

  rescheduleReservation(id: number, newStart: Date): Reservation {
    const reservations = this.allReservations();
    const r = reservations.find(x => x.id === id);
    if (!r) throw new Error(`Reserva ${id} no encontrada`);
    const durationMs = new Date(r.end).getTime() - new Date(r.start).getTime();
    const start = new Date(newStart);
    r.start = start.toISOString();
    r.end = new Date(start.getTime() + durationMs).toISOString();
    this.write(KEYS.reservations, reservations);
    return this.hydrate(r);
  }

  // ==========================================
  // USUARIOS
  // ==========================================

  getUserNames(ids: string[]): Map<string, { firstName: string; lastName: string; username: string }> {
    const map = new Map<string, { firstName: string; lastName: string; username: string }>();
    ids.forEach(id => {
      map.set(id, MOCK_USER_NAMES[id] ?? { firstName: 'Cliente', lastName: '', username: 'cliente' });
    });
    return map;
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private nextNumericId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }
}
