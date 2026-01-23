import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateService } from '../../services/update/update.service';

@Component({
  selector: 'app-update',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {

  @Input() deviceModel: string = '';
  @Output() sendEventCloseModalUpdate = new EventEmitter<void>();

  openModalDeviceUpdate = false;

  updateForm!: FormGroup;

  formBuilder = inject(FormBuilder);
  service = inject(UpdateService);
  snackBar = inject(MatSnackBar);



  ngOnChanges(): void {
    // Toda a vez que o deviceModel se atualizar, preencher o formulario
    this.functionFillOutUpdateForm(this.deviceModel);
  }

  // ================== Update de dispositivos ==============================

  configurationUpdateForm() {
    this.updateForm = this.formBuilder.group({
      deviceModel: '',
      newName: null,
      newDeviceModel: null,
      newManufacturer: null,
      newLocation: null,
      newDescription: null
    });
  }

  handleUpdate() {
    this.service.updateDevice(this.deviceModel,this.updateForm.value).subscribe({
      next: (response) => {
        this.updateForm.reset();
        this.sendEventCloseModalUpdate.emit();

        this.snackBar.open('Device updated successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar-success']
        });
      }
    });
  }

  updates = [
    {id: 1, name: 'Device Name', active: false},
    {id: 2, name: 'Device Model', active: false},
    {id: 3, name: 'Manufacturer', active: false},
    {id: 4, name: 'Location', active: false},
    {id: 5, name: 'Description', active: false}
  ]

  functionToggleUpdate(id: number) {

    this.updates.forEach(update => {
      if (update.id === id) {
        update.active = !update.active;
      } else {
        update.active = false;
      }
    })
  }

  // Função onde eu pego os dados do dispositivo para preencher o formulario para facilitar a atualização
  functionFillOutUpdateForm(deviceModel: string) {

    this.configurationUpdateForm();

    this.service.getDeviceForUpdate(deviceModel).subscribe({
      next: (response) => {
        this.updateForm.patchValue({
          deviceModel: response.deviceModel,
          newName: response.name,
          newDeviceModel: response.deviceModel,
          newManufacturer: response.manufacturer,
          newLocation: response.location,
          newDescription: response.description
        });
      }
    });
  }

  closeModalDeviceUpdate() {
    this.sendEventCloseModalUpdate.emit();
    this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
    this.updates[0].active = false;
    this.updates[1].active = false;
    this.updates[2].active = false;
    this.updates[3].active = false;
    this.updates[4].active = false;
  }

  // ===============================================================
}
