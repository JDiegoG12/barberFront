import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Barber } from '../../../../core/models/views/barber.view.model';

@Component({
  selector: 'app-barber-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barber-card.component.html',
  styleUrl: './barber-card.component.scss'
})
export class BarberCardComponent {
  @Input({ required: true }) barber!: Barber;
}