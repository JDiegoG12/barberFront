// src/core/models/dto/service.dto.ts

export interface ServiceResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  barberIds: string[]; 
  availabilityStatus: string; // Backend envía "Disponible" | "No Disponible"
  systemStatus: string;       // Backend envía "Activo" | "Inactivo"
}