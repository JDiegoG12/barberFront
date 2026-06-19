import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Inyectamos nuestro servicio de temas.
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Inicialización global si es necesaria
  }
}