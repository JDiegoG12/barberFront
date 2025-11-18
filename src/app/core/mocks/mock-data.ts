import { Barber } from "../models/views/barber.view.model";
import { Service } from "../models/views/service.view.model";

// --- DATOS SIMULADOS DE SERVICIOS ---
export const MOCK_SERVICES: Service[] = [
  {
    id: 101,
    name: 'Corte de Cabello Clásico',
    description: 'Corte a tijera y máquina, finalizando con un peinado tradicional.',
    price: 25000,
    duration: 30,
    category: 'Cortes',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    barberIds: [1, 2] // Realizado por Carlos y Miguel
  },
  {
    id: 102,
    name: 'Arreglo de Barba Premium',
    description: 'Diseño, recorte, perfilado con navaja y aplicación de aceites esenciales.',
    price: 15000,
    duration: 20,
    category: 'Barbas',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    barberIds: [1, 3] // Realizado por Carlos y Andrés
  },
  {
    id: 103,
    name: 'Tinte de Fantasía',
    description: 'Aplicación de colores vibrantes. Requiere evaluación previa.',
    price: 80000,
    duration: 90,
    category: 'Coloración',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    barberIds: [2] // Solo realizado por Miguel
  },
  {
    id: 104,
    name: 'Tratamiento Capilar',
    description: 'Hidratación profunda para revitalizar el cabello.',
    price: 50000,
    duration: 45,
    category: 'Tratamientos',
    availabilityStatus: 'No Disponible', // No tiene barberos activos asignados
    systemStatus: 'Activo',
    barberIds: []
  },
];

// --- DATOS SIMULADOS DE BARBEROS ---
export const MOCK_BARBERS: Barber[] = [
  {
    id: 1,
    name: 'Carlos',
    lastName: 'Rojas',
    specialties: ['Corte Clásico', 'Afeitado Tradicional'],
    photoUrl: 'https://picsum.photos/seed/mikesmith/400/400',
    bio: 'Con más de 10 años de experiencia, Carlos es un maestro de la tijera y la navaja.',
    availabilityStatus: 'Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 102] // Carlos hace Corte Clásico y Arreglo de Barba
  },
  {
    id: 2,
    name: 'Miguel',
    lastName: 'Pérez',
    specialties: ['Corte Moderno', 'Coloración'],
    photoUrl: 'https://picsum.photos/seed/chrisw/400/400',
    bio: 'Especialista en tendencias actuales y estilos atrevidos.',
    availabilityStatus: 'No Disponible',
    systemStatus: 'Activo',
    serviceIds: [101, 103] // Miguel hace Corte Clásico y Tinte
  },
  {
    id: 3,
    name: 'Andrés',
    lastName: 'Gómez',
    specialties: ['Diseño de Barba'],
    photoUrl: 'assets/images/barber3.jpg',
    bio: 'Experto en el cuidado y diseño de la barba.',
    availabilityStatus: 'No Disponible',
    systemStatus: 'Inactivo', // Barbero "eliminado"
    serviceIds: [102]
  }
];