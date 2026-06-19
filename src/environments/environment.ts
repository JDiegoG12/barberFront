// src/environments/environment.ts
export const environment = {
  production: false,

  // Cuando es true, la app NO llama al backend: los servicios sirven datos
  // simulados persistidos en localStorage (ver MockStore). Pon en false el día
  // que tengas el backend real corriendo.
  useMock: true,

  //URL base de la API Gateway
  apiUrl: 'http://localhost:8081',

  barberServiceUrl: 'http://localhost:8082',
  iphost: 'localhost'
};