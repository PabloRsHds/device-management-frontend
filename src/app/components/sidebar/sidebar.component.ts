import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core'; // ← Adicione Output, EventEmitter

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Output() menuSelected = new EventEmitter<number>();

  buttons = [
    {id: 1, title: 'Add Device', pressed : false},
    {id: 2, title:'View all Devices', pressed: false},
    {id: 3, title:'Analysis of Devices', pressed: false}
  ];

  // Alterna botões da lista de configurações
  toggleButton(id: number) {
    let activeId: number = 0;

    this.buttons.forEach(button => {
      if (button.id === id) {
        button.pressed = !button.pressed;

        // Armazena o id do botão pressionado = true
        if (button.pressed) {
          activeId = button.id;
        }
      } else {
        button.pressed = false;
      }
    });

    // Se nenhum botão estiver pressionado, emite null
    this.menuSelected.emit(activeId);
  }
}
