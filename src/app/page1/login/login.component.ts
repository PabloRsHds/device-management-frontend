import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../services/login/login.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!: FormGroup
  private service = inject(LoginService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  showPassword = false;

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
