import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Types } from '../../enums/Types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public registerForm!: FormGroup;
  private snackBar = inject(MatSnackBar);
  types = Object.values(Types);
  private formBuilder = inject(FormBuilder);
  private service = inject(RegisterService);

  ngOnInit(){
    // Inicialização do formulário
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
  HandleRegistration() {
    this.service.registerDevice(this.registerForm.value).subscribe({
      next: (response) => {
        // Resetando o formulário
        this.registerForm.reset(
          {
            type: ''
          }
        );

        this.snackBar.open('Device registered successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar']
          });
      },
      error : (err: Error) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });
  }

}
