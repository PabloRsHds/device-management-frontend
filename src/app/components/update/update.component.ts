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

  //Updates
  updateDeviceName = false;
  updateDeviceModel = false;
  updateManufacturer = false;
  updateLocation = false;
  updateDescription = false;
  //

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
    this.updateDeviceName = false;
    this.updateDeviceModel = false;
    this.updateManufacturer = false;
    this.updateLocation = false;
    this.updateDescription = false;
  }

  // ===============================================================
}
