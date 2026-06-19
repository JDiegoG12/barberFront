import { Barber } from "../models/views/barber.view.model";
import { Service } from "../models/views/service.view.model";
import { Category } from "../models/views/category.view.model";
import { Reservation } from "../models/views/reservation.view.model";

/**
 * Datos semilla (mock) usados cuando `environment.useMock` está activo.
 *
 * Estos objetos se cargan UNA sola vez en localStorage a través de MockStore;
 * a partir de ahí, todas las operaciones (crear/editar/reservar) se hacen sobre
 * la copia persistida, de modo que los cambios sobreviven a recargas de página.
 *
 * IDs alineados con el login simulado (AuthService):
 *  - Barbero logueado  -> id 'barber-1'
 *  - Cliente logueado  -> id 'client-1'
 */

// IDs estables de los usuarios simulados (deben coincidir con AuthService.MOCK_USERS)
export const LOGGED_BARBER_ID = 'barber-1';
export const LOGGED_CLIENT_ID = 'client-1';

// --- CATEGORÍAS ---
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Combos' },
  { id: 2, name: 'Cortes de Cabello' },
  { id: 3, name: 'Cuidado de Barba' },
  { id: 4, name: 'Cuidado Facial' },
  { id: 5, name: 'Tratamiento Capilar' }
];

// --- HELPER: HORARIO ESTÁNDAR ---
const STANDARD_SCHEDULE = [
  { dayOfWeek: 1, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Lun
  { dayOfWeek: 2, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Mar
  { dayOfWeek: 3, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Mié
  { dayOfWeek: 4, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Jue
  { dayOfWeek: 5, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '19:00' }] }, // Vie
  { dayOfWeek: 6, shifts: [{ start: '08:00', end: '14:00' }] }, // Sáb
  { dayOfWeek: 0, shifts: [] } // Dom (libre)
];

// --- BARBEROS ---
export const MOCK_BARBERS: Barber[] = [
  {
    id: '1',
    name: 'Carlos',
    lastName: 'Rojas',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Maestro de la tijera clásica con más de 10 años de experiencia.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 102, 107, 201, 202],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: '2',
    name: 'Miguel',
    lastName: 'Pérez',
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Experto en tendencias urbanas y degradados modernos.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 103, 105, 203, 204],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: '3',
    name: 'Andrés',
    lastName: 'Gómez',
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    bio: 'Especialista en diseño y arreglo de barbas largas.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [102, 106, 107, 202],
    schedule: STANDARD_SCHEDULE
  },
  {
    // Barbero correspondiente al usuario logueado como BARBER (ver AuthService)
    id: LOGGED_BARBER_ID,
    name: 'David',
    lastName: 'Vela',
    photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Paciencia y precisión, especialista en cortes para niños.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 105, 201, 207],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: '5',
    name: 'Sofía',
    lastName: 'Méndez',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Cuidado capilar profundo y tratamientos faciales.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [104, 103, 204],
    schedule: STANDARD_SCHEDULE
  }
];

// --- SERVICIOS ---
export const MOCK_SERVICES: Service[] = [
  { id: 101, name: 'Corte Clásico', description: 'Corte a tijera y máquina con acabado tradicional.', price: 25000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['1', '2', LOGGED_BARBER_ID] },
  { id: 102, name: 'Corte + Barba', description: 'Corte de cabello y perfilado de barba.', price: 38000, duration: 50, categoryId: 1, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['1', '3'] },
  { id: 103, name: 'Corte Mujer', description: 'Corte y estilizado para cabello largo.', price: 35000, duration: 45, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['2', '5'] },
  { id: 104, name: 'Tinte Capilar', description: 'Aplicación de color profesional.', price: 60000, duration: 90, categoryId: 5, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['5'] },
  { id: 105, name: 'Corte Fade', description: 'Degradado moderno de precisión.', price: 30000, duration: 45, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['2', LOGGED_BARBER_ID] },
  { id: 106, name: 'Arreglo de Barba', description: 'Perfilado, recorte y toalla caliente.', price: 18000, duration: 25, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['3'] },
  { id: 107, name: 'Afeitado Clásico', description: 'Afeitado a navaja con espuma caliente.', price: 22000, duration: 30, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['1', '3'] },
  { id: 201, name: 'Corte Niño', description: 'Corte para menores de 10 años.', price: 20000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['1', LOGGED_BARBER_ID] },
  { id: 202, name: 'Barba Express', description: 'Recorte rápido a máquina.', price: 8000, duration: 10, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['1', '3'] },
  { id: 203, name: 'Mascarilla Facial', description: 'Limpieza e hidratación facial.', price: 28000, duration: 30, categoryId: 4, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['2'] },
  { id: 204, name: 'Cejas', description: 'Perfilado de cejas.', price: 10000, duration: 15, categoryId: 4, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ['2', '5'] },
  { id: 207, name: 'Combo Padre e Hijo', description: 'Dos cortes clásicos (adulto + niño).', price: 40000, duration: 60, categoryId: 1, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [LOGGED_BARBER_ID] }
];

// --- FECHAS DINÁMICAS PARA LAS RESERVAS DE EJEMPLO ---
const atTime = (offsetDays: number, hour: number, minute: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
};

// --- RESERVAS ---
// Nota: el campo barber/service se hidrata dinámicamente en MockStore al leer,
// por lo que aquí sólo definimos los IDs y los datos propios de la reserva.
export const MOCK_RESERVATIONS: Reservation[] = [
  // Historial del cliente logueado (ayer, finalizada)
  {
    id: 1001, clientId: LOGGED_CLIENT_ID, barberId: '1', serviceId: 101,
    start: atTime(-1, 10, 0), end: atTime(-1, 10, 30),
    price: 25000, status: 'Finalizada'
  },
  // Próximas citas del cliente logueado (hoy, con el barbero logueado)
  {
    id: 2001, clientId: LOGGED_CLIENT_ID, barberId: LOGGED_BARBER_ID, serviceId: 101,
    start: atTime(0, 9, 0), end: atTime(0, 9, 30),
    price: 25000, status: 'En espera'
  },
  {
    id: 2002, clientId: LOGGED_CLIENT_ID, barberId: LOGGED_BARBER_ID, serviceId: 201,
    start: atTime(0, 11, 0), end: atTime(0, 11, 30),
    price: 20000, status: 'En proceso'
  },
  // Cita futura del cliente logueado (mañana, otro barbero)
  {
    id: 2003, clientId: LOGGED_CLIENT_ID, barberId: '2', serviceId: 105,
    start: atTime(1, 15, 0), end: atTime(1, 15, 45),
    price: 30000, status: 'En espera'
  },
  // Citas de OTROS clientes con el barbero logueado (para llenar su agenda)
  {
    id: 3001, clientId: 'client-2', barberId: LOGGED_BARBER_ID, serviceId: 207,
    start: atTime(0, 16, 0), end: atTime(0, 17, 0),
    price: 40000, status: 'En espera'
  },
  {
    id: 3002, clientId: 'client-3', barberId: LOGGED_BARBER_ID, serviceId: 105,
    start: atTime(1, 10, 0), end: atTime(1, 10, 45),
    price: 30000, status: 'En espera'
  }
];

// --- USUARIOS (para resolver nombres de clientes en la agenda del barbero) ---
export const MOCK_USER_NAMES: Record<string, { firstName: string; lastName: string; username: string }> = {
  'client-1': { firstName: 'Cliente', lastName: 'Demo', username: 'cliente' },
  'client-2': { firstName: 'Laura', lastName: 'Martínez', username: 'lmartinez' },
  'client-3': { firstName: 'Pedro', lastName: 'Sánchez', username: 'psanchez' }
};
