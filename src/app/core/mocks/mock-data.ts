import { Barber } from "../models/views/barber.view.model";
import { Service } from "../models/views/service.view.model";
import { Category } from "../models/views/category.view.model";
import { User } from "../models/views/user.view.model";
import { Reservation } from "../models/views/reservation.view.model";

// --- ID REAL DE KEYCLOAK (Para que haga match automático) ---
const BARBER_UUID = "49c9003a-8403-4462-a2a6-5d99f5081598";

// --- CATEGORÍAS ---
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Combos' },
  { id: 2, name: 'Cortes de Cabello' },
  { id: 3, name: 'Cuidado Facial' },
  { id: 4, name: 'Tratamiento Capilar' },
  { id: 5, name: 'Otros' }
];

// --- HELPER: HORARIO ESTÁNDAR ---
const STANDARD_SCHEDULE = [
  { dayOfWeek: 1, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Lun
  { dayOfWeek: 2, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Mar
  { dayOfWeek: 3, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Mié
  { dayOfWeek: 4, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] }, // Jue
  { dayOfWeek: 5, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '19:00' }] }, // Vie
  { dayOfWeek: 6, shifts: [{ start: '08:00', end: '14:00' }] }, // Sáb
  { dayOfWeek: 0, shifts: [] } // Dom
];

// --- BARBEROS ---
export const MOCK_BARBERS: Barber[] = [
  {
    id: "1",
    name: 'Carlos',
    lastName: 'Rojas',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Maestro de la tijera clásica.',
    availabilityStatus: 'No Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 102, 107, 201, 202],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: "2",
    name: 'Miguel',
    lastName: 'Pérez',
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Experto en tendencias urbanas.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 103, 105, 203, 204],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: "3",
    name: 'Andrés',
    lastName: 'Gómez',
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    bio: 'Especialista en barbas largas.',
    availabilityStatus: 'Disponible', 
    systemStatus: 'Activo',
    serviceIds: [102, 106, 202, 107],
    schedule: STANDARD_SCHEDULE
  },
  {
    // === AQUÍ ESTÁ EL CAMBIO CLAVE ===
    // Reemplazamos el ID "4" por el UUID real de tu usuario Keycloak
    id: BARBER_UUID, 
    name: 'David',
    lastName: 'Vela',
    photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Paciencia y precisión para los más pequeños.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 105, 201],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: "5",
    name: 'Sofía',
    lastName: 'Méndez',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Cuidado capilar profundo.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [104, 103, 204],
    schedule: STANDARD_SCHEDULE
  }
];

// --- SERVICIOS ---
// Nota: Actualicé los barberIds donde antes decía "4", ahora dice BARBER_UUID
export const MOCK_SERVICES: Service[] = [
  { id: 101, name: 'Corte Clásico', description: 'Tijera y máquina.', price: 25000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ["1", "2", BARBER_UUID] },
  { id: 105, name: 'Corte Fade', description: 'Degradado moderno.', price: 30000, duration: 45, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ["2", BARBER_UUID] },
  { id: 201, name: 'Corte Niño', description: 'Para menores de 10 años.', price: 20000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ["1", BARBER_UUID] },
  // ... resto de servicios iguales ...
  { id: 202, name: 'Barba Express', description: 'Solo máquina.', price: 8000, duration: 10, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ["1", "3", BARBER_UUID] },
  { id: 207, name: 'Combo Padre e Hijo', description: 'Dos cortes clásicos.', price: 40000, duration: 60, categoryId: 1, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: ["1", BARBER_UUID] },
  // ...
];
export const MOCK_CLIENT_USER: User = {
  id: "1",
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '3001234567',
  role: 'CLIENT'
};

// --- FECHAS DINÁMICAS PARA PRUEBAS ---
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

// --- RESERVAS ---
export const MOCK_RESERVATIONS: Reservation[] = [
  // Reservas originales de ejemplo...
  {
    id: 1001, clientId: "1", barberId: "1", serviceId: 101, 
    start: new Date(yesterday.setHours(10, 0, 0)), end: new Date(yesterday.setHours(10, 30, 0)), 
    price: 25000, status: 'Finalizada',
    barber: MOCK_BARBERS.find(b => b.id === "1"), service: MOCK_SERVICES.find(s => s.id === 101)
  },
  
  // === NUEVAS RESERVAS PARA DAVID VELA (El usuario logueado) ===
  // Reserva 1: Para HOY a las 9:00 AM
  {
    id: 2001, clientId: "1", barberId: BARBER_UUID, serviceId: 101,
    start: new Date(new Date().setHours(9, 0, 0, 0)), 
    end: new Date(new Date().setHours(9, 30, 0, 0)),
    price: 25000, status: 'En espera',
    barber: MOCK_BARBERS.find(b => b.id === BARBER_UUID), service: MOCK_SERVICES.find(s => s.id === 101)
  },
  // Reserva 2: Para HOY a las 11:00 AM
  {
    id: 2002, clientId: "1", barberId: BARBER_UUID, serviceId: 201,
    start: new Date(new Date().setHours(11, 0, 0, 0)), 
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    price: 20000, status: 'En proceso',
    barber: MOCK_BARBERS.find(b => b.id === BARBER_UUID), service: MOCK_SERVICES.find(s => s.id === 201)
  },
   // Reserva 3: Para HOY a las 04:00 PM
   {
    id: 2003, clientId: "1", barberId: BARBER_UUID, serviceId: 207,
    start: new Date(new Date().setHours(16, 0, 0, 0)), 
    end: new Date(new Date().setHours(17, 0, 0, 0)),
    price: 30000, status: 'En espera',
    barber: MOCK_BARBERS.find(b => b.id === BARBER_UUID), service: MOCK_SERVICES.find(s => s.id === 207)
  },
  // Reserva 4: Para MAÑANA
  {
    id: 2004, clientId: "99", barberId: BARBER_UUID, serviceId: 101,
    start: new Date(tomorrow.setHours(10, 0, 0, 0)), 
    end: new Date(tomorrow.setHours(10, 30, 0, 0)),
    price: 25000, status: 'En espera',
    barber: MOCK_BARBERS.find(b => b.id === BARBER_UUID), service: MOCK_SERVICES.find(s => s.id === 101)
  }
];