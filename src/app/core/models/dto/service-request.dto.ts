// src/core/models/dto/service-request.dto.ts

export interface CreateCategoryRequestDTO {
  name: string;
}

export interface CreateServiceRequestDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
}

export interface UpdateServiceRequestDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  availabilityStatus: 'Disponible' | 'No Disponible'; // Debe coincidir con el regex del backend
}

export interface AssignBarbersRequestDTO {
  barberIds: string[];
}