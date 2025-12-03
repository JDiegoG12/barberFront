import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Entornos
import { environment } from '../../../../environments/environment';

// Modelos de Vista (Frontend)
import { Barber, BarberAvailabilityStatus, BarberSystemStatus } from '../../models/views/barber.view.model';
import { Service } from '../../models/views/service.view.model'; // Para el método listServicesByBarber

// DTOs de Petición (Frontend -> Backend)
import { 
  CreateBarberRequestDTO, 
  UpdateBarberRequestDTO,
  AssignServicesToBarberRequestDTO 
} from '../../models/dto/barber-request.dto';
import { BarberResponseDTO } from '../../models/dto/barber.dto';
import { ServiceResponseDTO } from '../../models/dto/service.dto';


/**
 * Servicio encargado de gestionar la recuperación y manipulación de información de los barberos.
 * Conecta con el Microservicio de Barberos a través del API Gateway.
 */
@Injectable({
  providedIn: 'root'
})
export class BarberService {

  // Rutas base construidas según la configuración del Gateway
  private readonly publicBaseUrl = `${environment.apiUrl}/barberos/public`;
  private readonly adminBaseUrl = `${environment.apiUrl}/barberos/admin`;

  constructor(private http: HttpClient) { }

  // ==========================================
  // GESTIÓN DE BARBEROS (LECTURA - PÚBLICO/ADMIN)
  // ==========================================

  /**
   * Obtiene el listado completo de barberos.
   * En el backend, la ruta /admin/barbers devuelve todos, lo usamos para la gestión.
   * @returns Un Observable que emite un array de objetos 'Barber'.
   */
  getAllBarbers(): Observable<Barber[]> {
    const url = `${this.adminBaseUrl}/barbers`;
    return this.http.get<BarberResponseDTO[]>(url).pipe(
      map(dtos => dtos.map(dto => this.mapToBarber(dto)))
    );
  }

  /**
   * Obtiene la lista de barberos activos para el público (simulando una ruta pública que filtra).
   * Nota: Usaremos la ruta pública que proporcionaste, asumiendo que el backend filtra por 'Activo'/'contract: true'.
   * Si la intención es que el frontend filtre la lista completa, se usaría getAllBarbers y luego un filtro en el pipe.
   */
  getBarbers(): Observable<Barber[]> {
    // Si necesitas simular la ruta pública que el controlador no tiene, podrías usar getAllBarbers y filtrar.
    // Como el controlador no tiene un GET /public/barbers, asumimos que usas getAllBarbers y el backend maneja el permiso.
    // Dejo la implementación original (que se usaba para MOCK) apuntando a una ruta inexistente, o puedes usar getAllBarbers.
    // Usaremos getAllBarbers por la falta de una ruta pública específica que devuelva solo los activos.
    const url = `${this.publicBaseUrl}/barbers`;
    return this.http.get<BarberResponseDTO[]>(url).pipe(
      map(dtos => dtos.map(dto => this.mapToBarber(dto)))
    );
  }

  /**
   * Busca y recupera la información detallada de un barbero específico basado en su identificador.
   * (Endpoint 1: GET /public/barbers/{id})
   *
   * @param id - El identificador del barbero a buscar.
   * @returns Un Observable que emite el objeto 'Barber'.
   */
  getBarberById(id: string): Observable<Barber> {
    const url = `${this.publicBaseUrl}/barbers/${id}`;
    return this.http.get<BarberResponseDTO>(url).pipe(
      map(dto => this.mapToBarber(dto))
    );
  }

  /**
   * Lista los servicios que puede realizar un barbero específico.
   * (Endpoint 4: GET /admin/barbers/{barberId}/servicios)
   * * @param barberId ID del barbero.
   * @returns Observable con la lista de servicios.
   */
  listServicesByBarber(barberId: string): Observable<Service[]> {
    const url = `${this.publicBaseUrl}/barbers/${barberId}/servicios`;
    // Nota: Necesitarás un mapper para ServiceResponseDTO si Service[] es un View Model distinto a ServiceDTO.
    // Asumiendo que existe una estructura similar en ServiceService, uso un mapper temporal si no lo tienes aquí.
    return this.http.get<ServiceResponseDTO[]>(url).pipe(
      map(dtos => dtos.map(dto => this.mapToService(dto)))
    );
  }

  // ==========================================
  // GESTIÓN DE BARBEROS (ESCRITURA - ADMIN)
  // ==========================================

  /**
   * Crea un barbero en el sistema.
   * (Endpoint 2: POST /admin/barbers - multipart/form-data)
   * * Nota: Este endpoint usa 'multipart/form-data' debido al campo 'image'.
   * El DTO de solicitud se debe transformar a 'FormData'.
   * * @param request Datos de la nueva barbero.
   * @param image Archivo de imagen (opcional).
   * @returns Observable con el barbero creado.
   */
  createBarber(request: CreateBarberRequestDTO, image?: File): Observable<Barber> {
    const url = `${this.adminBaseUrl}/barbers`;
    const formData: FormData = this.buildBarberFormData(request, image);

    return this.http.post<BarberResponseDTO>(url, formData).pipe(
      map(dto => this.mapToBarber(dto))
    );
  }

  /**
   * Actualiza los datos de un barbero.
   * (Endpoint 3: PUT /admin/barbers/{id} - multipart/form-data)
   *
   * @param id ID del barbero a actualizar.
   * @param request DTO con los datos de actualización.
   * @param image Nueva foto de perfil (opcional).
   * @returns Observable con el barbero actualizado.
   */
  updateBarber(id: string, request: UpdateBarberRequestDTO, image?: File): Observable<Barber> {
    const url = `${this.adminBaseUrl}/barbers/${id}`;
    // Usamos el mismo builder de FormData, ya que los campos coinciden.
    const formData: FormData = this.buildBarberFormData(request, image);

    // En Angular, PUT con FormData puede requerir { headers: { 'Content-Type': 'multipart/form-data' } } 
    // pero el navegador/HttpClient lo suelen manejar automáticamente si pasas FormData.
    return this.http.put<BarberResponseDTO>(url, formData).pipe(
      map(dto => this.mapToBarber(dto))
    );
  }
  
  /**
   * Desactiva el contrato de un barbero (Borrado Lógico).
   * (Endpoint 5: DELETE /admin/barbers/{id})
   * @param id ID del barbero a desactivar.
   * @returns Observable con el barbero actualizado (o el DTO devuelto por el backend).
   */
  deactivateContract(id: string): Observable<Barber> {
    const url = `${this.adminBaseUrl}/barbers/${id}`;
    // El backend devuelve el BarberDTO actualizado.
    return this.http.delete<BarberResponseDTO>(url).pipe(
      map(dto => this.mapToBarber(dto))
    );
  }

  /**
   * Cambia el estado de disponibilidad del barbero.
   * (Endpoint: PATCH /admin/barbers/{id}/availability)
   * @param id ID del barbero.
   * @param available Estado de disponibilidad (true/false).
   * @returns Observable con el barbero actualizado.
   */
  setAvailability(id: string, available: boolean): Observable<Barber> {
    const url = `${this.adminBaseUrl}/barbers/${id}/availability`;
    
    let params = new HttpParams();
    params = params.set('available', available.toString());

    // PATCH con Query Params. El body podría ser null/vacío.
    return this.http.patch<BarberResponseDTO>(url, null, { params }).pipe(
      map(dto => this.mapToBarber(dto))
    );
  }

  /**
   * Asigna múltiples servicios a un barbero.
   * (Endpoint 5: POST /admin/barbers/{barberId}/servicios)
   * @param barberId ID del barbero.
   * @param request DTO con la lista de IDs de servicios.
   * @returns Observable con la lista de servicios asignados.
   */
  assignServicesBulk(barberId: string, request: AssignServicesToBarberRequestDTO): Observable<Service[]> {
    const url = `${this.adminBaseUrl}/barbers/${barberId}/servicios`;
    // El backend recibe un objeto JSON con la lista de IDs de servicios.
    return this.http.post<ServiceResponseDTO[]>(url, request).pipe(
      map(dtos => dtos.map(dto => this.mapToService(dto)))
    );
  }

  // ==========================================
  // MAPPERS PRIVADOS Y HELPERS
  // ==========================================

  /**
   * Mapea un DTO de respuesta del backend a un View Model de frontend.
   * @param dto DTO de barbero.
   * @returns View Model de barbero.
   */
  private mapToBarber(dto: BarberResponseDTO): Barber {
    // ...
    const systemStatus: BarberSystemStatus = dto.contract ? 'Activo' : 'Inactivo';
    const availabilityStatus: BarberAvailabilityStatus = dto.availability ? 'Disponible' : 'No Disponible';
    
    // Obtener la URL base de tu backend
    const baseUrl = environment.barberServiceUrl; 

    // Construir la URL completa de la imagen si solo se proporciona la ruta relativa
    let photoUrl = dto.image;
    if (photoUrl && !photoUrl.startsWith('http')) {
        // Asumiendo que environment.apiUrl es 'http://localhost:8081' (o el Gateway)
        // y el DTO.image es 'uploads/nombre.png'
        photoUrl = `${baseUrl}/${photoUrl}`; 
    }

    return {
      id: dto.id,
      name: dto.name,
      lastName: dto.lastName,
      photoUrl: photoUrl, // <-- La URL completa se usará en el frontend
      bio: dto.description || '',
      serviceIds: [],
      availabilityStatus: availabilityStatus,
      systemStatus: systemStatus,
      schedule: [] 
    };
  }

  /**
   * Mapea un DTO de respuesta de servicio del backend a un View Model de frontend.
   * Se requiere para el método listServicesByBarber.
   * Nota: Este mapper es una suposición, se debe replicar la lógica de mapeo que uses en ServiceService.
   */
  private mapToService(dto: ServiceResponseDTO): Service {
    // Asumiendo que ServiceResponseDTO tiene las mismas propiedades que el View Model Service.
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      duration: dto.duration,
      categoryId: dto.categoryId,
      barberIds: dto.barberIds, 
      availabilityStatus: dto.availabilityStatus as any, // Conversión forzada si los tipos son distintos
      systemStatus: dto.systemStatus as any 
    };
  }


  /**
   * Helper para construir el objeto FormData requerido por los endpoints multipart/form-data.
   */
  private buildBarberFormData(request: CreateBarberRequestDTO | UpdateBarberRequestDTO, image?: File): FormData {
    const formData = new FormData();
    
    // Campos obligatorios/principales: Usamos el operador '!' para forzar el tipo a string.
    // Esto le dice a TypeScript que, aunque la interfaz de 'Update' lo permita, 
    // en tiempo de ejecución, estos valores no serán 'undefined' en este contexto.
    if (request.name) {
        formData.append('name', request.name);
    }
    if (request.email) {
        formData.append('email', request.email);
    }
    if (request.password) { 
        formData.append('password', request.password); 
    }

    // Campos opcionales (ya estaban bien): Solo se añaden si tienen un valor.
    if (request.lastName) {
      formData.append('lastName', request.lastName);
    }
    if (request.phone) {
      formData.append('phone', request.phone);
    }
    if (request.description) {
      formData.append('description', request.description);
    }
    
    // Campo de imagen
    if (image) {
      formData.append('image', image, image.name);
    }

    return formData;
  }

  
}

