import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteService } from '../../services/delete/delete.service';

@Component({
  selector: 'app-delete-device',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './delete-device.component.html',
  styleUrl: './delete-device.component.css'
})
export class DeleteDeviceComponent {

  public deleteForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  public openModalDeviceDelete: boolean = false;
  private snackBar = inject(MatSnackBar);

  private service = inject(DeleteService);

  @Input() deviceModel?:string;
  @Output() sendEventCloseModalDeviceDelete = new EventEmitter<void>();


  closeModalDeviceDelete() {
    this.sendEventCloseModalDeviceDelete.emit();
  }

  // ================= Delete de dispositivos ==============================

  ngOnInit(){
    this.configurationDeleteForm();
  }

  // Criando formulário
  configurationDeleteForm() {
    this.deleteForm = this.formBuilder.group({
      deviceModel: ''
    });
  }

  // Função de exclusão
  delete() {

    this.deleteForm.patchValue({
      deviceModel: this.deviceModel
    });

    this.service.deleteDevice(this.deleteForm.value.deviceModel).subscribe({
      next: (response) => {

        this.sendEventCloseModalDeviceDelete.emit();
        this.snackBar.open('Device deleted successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      }
    });
  }

  // ======================================================================
}
