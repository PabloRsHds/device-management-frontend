import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { CrudService } from '../../service/crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {


  @Input() deviceModel: string = '';


  openModalDeviceUpdate = false;

  updateForm!: FormGroup;

  formBuilder = inject(FormBuilder);
  crudService = inject(CrudService);
  snackBar = inject(MatSnackBar);

  //Updates
  updateDeviceName = false;
  updateDeviceModel = false;
  updateManufacturer = false;
  updateLocation = false;
  updateDescription = false;
  //



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

  update() {
    this.crudService.update(this.deviceModel,this.updateForm.value).subscribe({
      next: (response) => {
        console.log('Device updated successfully:', response);
        this.updateForm.reset();
        this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
        //this.allDevices(); vê isso aqui
        this.snackBar.open('Device updated successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error) => {
        console.error('Error updated device:', error);
      }
    });

  }

  functionButtonUpdate(deviceModel: string) {

    this.configurationUpdateForm();

    this.crudService.findDeviceWithDeviceModel(deviceModel).subscribe({
      next: (response) => {
        this.updateForm.patchValue({
          deviceModel: response.deviceModel,
          newName: response.name,
          newDeviceModel: response.deviceModel,
          newManufacturer: response.manufacturer,
          newLocation: response.location,
          newDescription: response.description
        });
      },
      error: (error) => {
        console.error('Error updating device:', error);
      }
    });

    this.deviceModel = deviceModel;
    this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
  }

  closeModalDeviceUpdate() {
    this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
    this.updateDeviceName = false;
    this.updateDeviceModel = false;
    this.updateManufacturer = false;
    this.updateLocation = false;
    this.updateDescription = false;
  }

  // ===============================================================
}
