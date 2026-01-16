import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { CrudService } from '../../service/crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;

  formBuilder = inject(FormBuilder);
  service = inject(CrudService);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.configurationForm();
  }

  //============= Registrar dispositivo ==================

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
    this.service.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.registerForm.reset(
          {
            type: '',
            unit: ''
          }
        );
        //this.allDevices(); resolver essa parada aqui
        this.snackBar.open(response, 'Close', {
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

  // ================= Configuração dos tipos de dispositivos ===================
  types: string[] = [
    'GAS_SENSOR',
    'THERMISTOR',
    'THERMOCOUPLE',
    'DISTANCE_SENSOR',
    'TEMPERATURE_SENSOR',
    'HUMIDITY_SENSOR',
    'AMBIENT_LIGHT_SENSOR',
    'TOF_SENSOR',
    'STRAIN_GAUGE',
    'CO2_SENSOR',
    'TURBIDITY_SENSOR',
    'UV_SENSOR',
    'ULTRASONIC_SENSOR',
    'PROXIMITY_SENSOR',
    'LOAD_CELL',
    'PH_SENSOR',
    'LIGHT_SENSOR',
    'MAGNETOMETER',
    'GYROSCOPE',
    'FLAME_SENSOR',
    'VIBRATION_SENSOR',
    'MICROPHONE',
    'FLOW_SENSOR',
    'CO_SENSOR',
    'FORCE_SENSOR',
    'VOC_SENSOR',
    'IMU',
    'PRESSURE_SENSOR',
    'WATER_LEVEL_SENSOR',
    'PIR_SENSOR',
    'SOUND_SENSOR',
    'AIR_QUALITY_SENSOR',
    'MOTION_SENSOR',
    'SMOKE_SENSOR',
    'ACCELEROMETER',
    'LIDAR_SENSOR'
  ];
  // =============================================================

}
