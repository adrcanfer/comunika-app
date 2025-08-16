import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from 'src/app/model/event.model';

@Component({
  selector: 'app-event-entry',
  templateUrl: './event-entry.component.html',
  styleUrls: ['./event-entry.component.scss'],
  standalone: false
})
export class EventEntryComponent  implements OnInit {

  @Input() event!: Event;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  showDetail() {
    this.event.read++;
    this.router.navigateByUrl(`/mobile/event/${this.event.id}`);
  }

  stripHtmlTagsAndExtractText(htmlString: string) {
    if (!htmlString || typeof htmlString !== 'string') {
      return '';
    }
  
    let cleanedString = htmlString;
  
    // Paso 1: Reemplazar las etiquetas <a> con solo su texto interno.
    // Captura el texto entre <a> y </a>.
    cleanedString = cleanedString.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
  
    // Paso 2: Eliminar cualquier otra etiqueta HTML restante.
    // Reemplaza cualquier etiqueta HTML (<...>) con un string vacío.
    cleanedString = cleanedString.replace(/<[^>]*>/g, '');
  
    // Paso 3: Limpiar espacios extra (opcional pero recomendado).
    // Esto elimina múltiples espacios en blanco, saltos de línea, etc.
    cleanedString = cleanedString.replace(/\s+/g, ' ').trim();
  
    return cleanedString;
  }

}
