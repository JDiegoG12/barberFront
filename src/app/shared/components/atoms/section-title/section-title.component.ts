import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss'
})
export class SectionTitleComponent {
  // 1. Usamos @Input() para que el componente padre pueda pasarle el título.
  @Input({ required: true }) title: string = '';
}