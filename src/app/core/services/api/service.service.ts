import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Entornos
import { environment } from '../../../../environments/environment';

// Modelos de Vista (Frontend)
import { Service, ServiceAvailabilityStatus, ServiceSystemStatus } from '../../models/views/service.view.model';
import { Category } from '../../models/views/category.view.model';

// DTOs de Respuesta (Backend -> Frontend)
import { ServiceResponseDTO } from '../../models/dto/service.dto';
import { CategoryResponseDTO } from '../../models/dto/category.dto';

// DTOs de Petición (Frontend -> Backend)
import { 
  CreateServiceRequestDTO, 
  UpdateServiceRequestDTO, 
  AssignBarbersRequestDTO, 
  CreateCategoryRequestDTO 
} from '../../models/dto/service-request.dto';

/**
 * Servicio encargado de la gestión integral del catálogo de servicios y sus categorías.
 * Conecta con el Microservicio de Servicios a través del API Gateway.
 * 
 * Implementa todos los endpoints (CRUD) definidos en el backend, separando
 * las rutas públicas de las administrativas.
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // Rutas base construidas según la configuración del Gateway
  // El Gateway redirige /servicios/** al microservicio
  private readonly publicBaseUrl = `${environment.apiUrl}/servicios/public`;
  private readonly adminBaseUrl = `${environment.apiUrl}/servicios/admin`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // GESTIÓN DE CATEGORÍAS
  // ==========================================

  /**
   * Obtiene el listado completo de categorías (Público).
   * @returns Observable con lista de ViewModels de categorías.
   */
  getCategories(): Observable<Category[]> {
    const url = `${this.publicBaseUrl}/categories`;
    return this.http.get<CategoryResponseDTO[]>(url).pipe(
      map(dtos => dtos.map(dto => this.mapToCategory(dto)))
    );
  }

  /**
   * Crea una nueva categoría (Admin).
   * @param request Datos de la nueva categoría.
   * @returns Observable con la categoría creada mapeada.
   */
  createCategory(request: CreateCategoryRequestDTO): Observable<Category> {
    const url = `${this.adminBaseUrl}/categories`;
    return this.http.post<CategoryResponseDTO>(url, request).pipe(
      map(dto => this.mapToCategory(dto))
    );
  }

  // ==========================================
  // GESTIÓN DE SERVICIOS (LECTURA)
  // ==========================================

  /**
   * Obtiene el catálogo de servicios (Público).
   * 
   * @param includeInactive Si es true, trae también los servicios inactivos (útil para admins, historial).
   * @returns Observable con la lista de servicios.
   */
  getServices(includeInactive: boolean = false): Observable<Service[]> {
    const url = `${this.publicBaseUrl}/services`;
    
    // Configuración de parámetros query (?includeInactive=true)
    let params = new HttpParams();
    if (includeInactive) {
      params = params.set('includeInactive', 'true');
    }

    return this.http.get<ServiceResponseDTO[]>(url, { params }).pipe(
      map(dtos => dtos.map(dto => this.mapToService(dto)))
    );
  }

  /**
   * Obtiene un servicio por su ID (Público).
   * @param id ID del servicio.
   */
  getServiceById(id: number): Observable<Service> {
    const url = `${this.publicBaseUrl}/services/${id}`;
    return this.http.get<ServiceResponseDTO>(url).pipe(
      map(dto => this.mapToService(dto))
    );
  }

  /**
   * Obtiene la lista de IDs de barberos asignados a un servicio (Público).
   * @param id ID del servicio.
   * @returns Observable con lista de IDs (Strings).
   */
  getBarbersByServiceId(id: number): Observable<string[]> {
    const url = `${this.publicBaseUrl}/services/${id}/barbers`;
    return this.http.get<string[]>(url);
  }

  // ==========================================
  // GESTIÓN DE SERVICIOS (ESCRITURA - ADMIN)
  // ==========================================

  /**
   * Crea un nuevo servicio en el sistema.
   * @param request DTO con los datos de creación.
   */
  createService(request: CreateServiceRequestDTO): Observable<Service> {
    const url = `${this.adminBaseUrl}/services`;
    return this.http.post<ServiceResponseDTO>(url, request).pipe(
      map(dto => this.mapToService(dto))
    );
  }

  /**
   * Actualiza la información básica y estado comercial de un servicio.
   * @param id ID del servicio a actualizar.
   * @param request DTO con los datos de actualización.
   */
  updateService(id: number, request: UpdateServiceRequestDTO): Observable<Service> {
    const url = `${this.adminBaseUrl}/services/${id}`;
    return this.http.put<ServiceResponseDTO>(url, request).pipe(
      map(dto => this.mapToService(dto))
    );
  }

  /**
   * Asigna o reemplaza la lista de barberos que realizan un servicio.
   * @param id ID del servicio.
   * @param request DTO que contiene la lista de IDs de barberos.
   */
  assignBarbers(id: number, request: AssignBarbersRequestDTO): Observable<Service> {
    const url = `${this.adminBaseUrl}/services/${id}/barbers`;
    return this.http.put<ServiceResponseDTO>(url, request).pipe(
      map(dto => this.mapToService(dto))
    );
  }

  /**
   * Elimina lógicamente (inactiva) un servicio.
   * @param id ID del servicio a eliminar.
   */
  deleteService(id: number): Observable<void> {
    const url = `${this.adminBaseUrl}/services/${id}`;
    return this.http.delete<void>(url);
  }

  // ==========================================
  // MAPPERS PRIVADOS
  // ==========================================

  private mapToService(dto: ServiceResponseDTO): Service {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      duration: dto.duration,
      categoryId: dto.categoryId,
      barberIds: dto.barberIds, 
      availabilityStatus: dto.availabilityStatus as ServiceAvailabilityStatus,
      systemStatus: dto.systemStatus as ServiceSystemStatus
    };
  }

  private mapToCategory(dto: CategoryResponseDTO): Category {
    return {
      id: dto.id,
      name: dto.name
    };
  }
}