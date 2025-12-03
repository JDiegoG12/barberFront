export interface BackendError {
  codigoError: string;
  mensaje: string;
  codigoHttp: number;
  url: string;
  metodo: string;
}