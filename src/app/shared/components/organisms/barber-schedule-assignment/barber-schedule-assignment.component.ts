// En /shared/components/organisms/barber-schedule-assignment/barber-schedule-assignment.component.ts

import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

// Componentes y DTOs
import { PrimaryButtonComponent } from '../../atoms/primary-button/primary-button.component';
import { WorkShiftRequestDTO, DayOfWeekString } from '../../../../core/models/dto/barber-request.dto'; 

interface DayConfig {
  name: string;
  label: string;
  dayOfWeek: DayOfWeekString;
}

@Component({
  selector: 'app-barber-schedule-assignment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimaryButtonComponent],
  templateUrl: './barber-schedule-assignment.component.html',
  styleUrls: ['./barber-schedule-assignment.component.scss']
})
export class BarberScheduleAssignmentComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input({ required: true }) barberId!: string;
  @Output() onSave = new EventEmitter<WorkShiftRequestDTO[]>();
  @Output() onCancel = new EventEmitter<void>();

  isLoading: boolean = false;
  scheduleForm!: FormGroup;

  daysOfWeek: DayConfig[] = [
    { name: 'monday', label: 'Lunes', dayOfWeek: 'MONDAY' },
    { name: 'tuesday', label: 'Martes', dayOfWeek: 'TUESDAY' },
    { name: 'wednesday', label: 'Miércoles', dayOfWeek: 'WEDNESDAY' },
    { name: 'thursday', label: 'Jueves', dayOfWeek: 'THURSDAY' },
    { name: 'friday', label: 'Viernes', dayOfWeek: 'FRIDAY' },
    { name: 'saturday', label: 'Sábado', dayOfWeek: 'SATURDAY' },
    { name: 'sunday', label: 'Domingo', dayOfWeek: 'SUNDAY' },
  ];

  ngOnInit(): void {
    this.initializeForm();
    // En modo edición, aquí cargarías el horario existente con getBarberSchedule
  }

  private initializeForm(): void {
    const formGroups: { [key: string]: FormGroup } = {};
    this.daysOfWeek.forEach(day => {
      formGroups[day.name] = this.fb.group({
        // FormArray para manejar múltiples turnos por día
        shifts: this.fb.array([]) 
      });
    });
    this.scheduleForm = this.fb.group(formGroups);
  }

  getShifts(dayName: string): FormArray {
    return this.scheduleForm.get(dayName)?.get('shifts') as FormArray;
  }

  createShiftGroup(): FormGroup {
    return this.fb.group({
      // Los inputs de tipo 'time' Angular los mapea como strings "HH:mm"
      startTime: ['09:00', Validators.required], 
      endTime: ['17:00', Validators.required]
    });
  }

  addShift(dayName: string): void {
    const shiftsArray = this.getShifts(dayName);
    shiftsArray.push(this.createShiftGroup());
  }

  removeShift(dayName: string, index: number): void {
    this.getShifts(dayName).removeAt(index);
  }

  clearShifts(dayName: string): void {
    this.getShifts(dayName).clear();
  }

  saveSchedule(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const allShifts: WorkShiftRequestDTO[] = [];
    const formValue = this.scheduleForm.value;

    this.daysOfWeek.forEach(dayConfig => {
      const shiftsArray = formValue[dayConfig.name].shifts;
      
      shiftsArray.forEach((shift: { startTime: string, endTime: string }) => {
        allShifts.push({
          dayOfWeek: dayConfig.dayOfWeek,
          startTime: shift.startTime,
          endTime: shift.endTime,
          barberId: this.barberId, // Clave: Asignar el ID del barbero
        } as WorkShiftRequestDTO);
      });
    });

    // Enviar al componente padre para que lo guarde a través del servicio
    this.onSave.emit(allShifts);
  }

}