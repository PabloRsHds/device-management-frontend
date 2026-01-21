import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { MatSnackBar } from '@angular/material/snack-bar';
import { Types } from '../../enums/Types';
import { RegisterService } from '../../services/register/register.service';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // pegando os tipos
  types = Object.values(Types);
  // criando formulário
  registerForm!: FormGroup;
  // Usado para criar o formulário
  formBuilder = inject(FormBuilder);
  service = inject(RegisterService);
  snackBar = inject(MatSnackBar);

  @Output() reloadTableDevices = new EventEmitter<void>();

  ngOnInit(): void {
    this.configurationForm();
  }

  //Criando formulário
  configurationForm() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      deviceModel: ['', Validators.required],
      description: ['', Validators.required],
      manufacturer: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // Função de registro
  register() {
    this.service.submitRegistration(this.registerForm.value).subscribe({
      next: (response) => {
        this.registerForm.reset(
          {
            type: '',
            unit: ''
          }
        );
        this.reloadTableDevices.emit();
        this.snackBar.open('Device registered successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      }
    });
  }

  // ===============================================================

}
