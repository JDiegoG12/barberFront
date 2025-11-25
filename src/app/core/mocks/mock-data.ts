import { Barber } from "../models/views/barber.view.model";
import { Service } from "../models/views/service.view.model";
import { Category } from "../models/views/category.view.model";
import { User } from "../models/views/user.view.model";
import { Reservation } from "../models/views/reservation.view.model";

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

// --- BARBEROS (5 Barberos para variedad) ---
export const MOCK_BARBERS: Barber[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: 'Andrés',
    lastName: 'Gómez',
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    bio: 'Especialista en barbas largas.',
    availabilityStatus: 'Disponible', 
    systemStatus: 'Activo', // Lo activé para que salga en listas
    serviceIds: [102, 106, 202, 107],
    schedule: STANDARD_SCHEDULE
  },
  {
    id: 4,
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
    id: 5,
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

// --- SERVICIOS (Expandido para probar carrusel) ---
export const MOCK_SERVICES: Service[] = [
  // CATEGORÍA 2: CORTES DE CABELLO
  { id: 101, name: 'Corte Clásico', description: 'Tijera y máquina.', price: 25000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 2, 4] },
  { id: 105, name: 'Corte Fade', description: 'Degradado moderno.', price: 30000, duration: 45, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [2, 4] },
  { id: 201, name: 'Corte Niño', description: 'Para menores de 10 años.', price: 20000, duration: 30, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 4] },
  { id: 203, name: 'Rapado Total', description: 'Máquina al cero o uno.', price: 15000, duration: 15, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [2, 4] },
  { id: 205, name: 'Diseño Freestyle', description: 'Líneas y figuras.', price: 45000, duration: 60, categoryId: 2, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [2] },

  // CATEGORÍA 3: CUIDADO FACIAL
  { id: 102, name: 'Arreglo Barba', description: 'Perfilado y toalla caliente.', price: 15000, duration: 20, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 3] },
  { id: 106, name: 'Cejas', description: 'Limpieza con navaja.', price: 10000, duration: 10, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 2, 3, 5] },
  { id: 202, name: 'Barba Express', description: 'Solo máquina.', price: 8000, duration: 10, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 3, 4] },
  { id: 206, name: 'Exfoliación Facial', description: 'Limpieza profunda.', price: 30000, duration: 20, categoryId: 3, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [3, 5] },

  // CATEGORÍA 1: COMBOS
  { id: 107, name: 'Combo Completo', description: 'Corte + Barba + Cejas.', price: 45000, duration: 60, categoryId: 1, availabilityStatus: 'No Disponible', systemStatus: 'Activo', barberIds: [1, 3] },
  { id: 207, name: 'Combo Padre e Hijo', description: 'Dos cortes clásicos.', price: 40000, duration: 60, categoryId: 1, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1, 4] },
  { id: 208, name: 'Día de Novio', description: 'Servicio premium pre-boda.', price: 120000, duration: 120, categoryId: 1, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [1] },

  // CATEGORÍA 5: OTROS
  { id: 103, name: 'Tinte Fantasía', description: 'Colores vibrantes.', price: 80000, duration: 90, categoryId: 5, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [2, 5] },
  { id: 204, name: 'Canas (Camuflaje)', description: 'Tinte natural.', price: 60000, duration: 45, categoryId: 5, availabilityStatus: 'Disponible', systemStatus: 'Activo', barberIds: [2, 5] },

  // CATEGORÍA 4: TRATAMIENTOS (Prueba No Disponible)
  { id: 104, name: 'Hidratación Profunda', description: 'Tratamiento intensivo.', price: 50000, duration: 45, categoryId: 4, availabilityStatus: 'No Disponible', systemStatus: 'Activo', barberIds: [] },
  { id: 209, name: 'Keratina', description: 'Alisado permanente.', price: 150000, duration: 180, categoryId: 4, availabilityStatus: 'No Disponible', systemStatus: 'Activo', barberIds: [] },
];

// --- USUARIO ---
export const MOCK_CLIENT_USER: User = {
  id: 1,
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '3001234567',
  role: 'CLIENT'
};

// --- FECHAS ---
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

// --- RESERVAS ---
export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1001, clientId: 1, barberId: 1, serviceId: 101, 
    start: new Date(yesterday.setHours(10, 0, 0)), end: new Date(yesterday.setHours(10, 30, 0)), 
    price: 25000, status: 'Finalizada',
    barber: MOCK_BARBERS.find(b => b.id === 1), service: MOCK_SERVICES.find(s => s.id === 101)
  },
  {
    id: 1002, clientId: 1, barberId: 2, serviceId: 103, 
    start: new Date(tomorrow.setHours(14, 0, 0)), end: new Date(tomorrow.setHours(15, 30, 0)), 
    price: 80000, status: 'En espera',
    barber: MOCK_BARBERS.find(b => b.id === 2), service: MOCK_SERVICES.find(s => s.id === 103)
  },
  {
    id: 1003, clientId: 1, barberId: 1, serviceId: 102, 
    start: new Date(today.setHours(18, 0, 0)), end: new Date(today.setHours(18, 20, 0)), 
    price: 15000, status: 'Cancelada',
    barber: MOCK_BARBERS.find(b => b.id === 1), service: MOCK_SERVICES.find(s => s.id === 102)
  }
];