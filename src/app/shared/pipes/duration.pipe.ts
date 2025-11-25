import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe de utilidad para formatear duraciones de tiempo.
 * Convierte un valor numérico (minutos) en una cadena de texto legible por el usuario,
 * dividiendo el tiempo en horas y minutos según corresponda.
 *
 * @example
 * // Uso en plantilla HTML:
 * {{ 90 | duration }} // Salida: "1h 30min"
 * {{ 60 | duration }} // Salida: "1h"
 * {{ 45 | duration }} // Salida: "45 min"
 */
@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  /**
   * Transforma el valor de entrada en un string formateado.
   *
   * @param value - La duración en minutos (número entero).
   * @returns Una cadena formateada (ej. "1h 30min", "45 min") o "0 min" si el valor es inválido.
   */
  transform(value: number): string {
    if (!value || isNaN(value)) {
      return '0 min';
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0) {
      // Ej: 60 -> "1h", 90 -> "1h 30min"
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }

    // Ej: 30 -> "30 min"
    return `${minutes} min`;
  }

}