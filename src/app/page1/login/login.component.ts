import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { CrudService } from '../../service/crud.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!: FormGroup
  service = inject(CrudService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  ngOnInit(){
    this.configurationFormLogin();
  }

  configurationFormLogin() {

    this.formLogin = this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }

  login(){
    this.service.login(this.formLogin.value).subscribe({
      next: (response) => {
        this.snackBar.open('Login realizado com sucesso!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar-success']
        });
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['device/home']);
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
          panelClass : ['snackbar-danger']
        });
      }
    })
  }
}
