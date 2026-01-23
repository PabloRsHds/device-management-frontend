import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import { DeviceAnalysisDto } from '../../interfaces/analysis/DeviceAnalysisDto';
import { AnalysisService } from '../../services/analysis/analysis.service';
import { SensorsService } from '../../services/sensors/sensors.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-analysis',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './modal-analysis.component.html',
  styleUrl: './modal-analysis.component.css'

})
export class ModalAnalysisComponent {
  @Output() sendEventcloseModalAnalysis = new EventEmitter<void>();
  @Output() sendEventForDesactivateDevice = new EventEmitter<string>();
  @Input() deviceModal?: string;

  private service = inject(AnalysisService);
  private sensorService = inject(SensorsService);
  private snackBar = inject(MatSnackBar);
  public analysis!: DeviceAnalysisDto;

  ngOnInit(): void {
    this.initializeAnalysis();
  }

  initializeAnalysis() {
    if (this.deviceModal) {

      this.service.getDeviceAnalysisForModel(this.deviceModal).subscribe({
        next: (response) => {
          this.analysis = response;
          this.graphic();
        }
      });
    }
  }

  closeModalAnalysis() {
    this.sendEventcloseModalAnalysis.emit();
  }

  reloadAnalysis() {
    this.initializeAnalysis();
    this.graphic();
  }

  desactiveDevice(deviceModel: string) {
    this.changeStatusDevice(deviceModel);
    this.sendEventcloseModalAnalysis.emit();
  }

  changeStatusDevice(deviceModel: string) {
    this.sensorService.changeStatusSensor(deviceModel).subscribe({
      next: (response) => {

        if (response.status === 'ACTIVATED') {
          this.snackBar.open('Sensor turned ON', 'Close', {
          duration: 3000,
            panelClass: ['snackbar-success']
          });
        } else {
          this.snackBar.open('Sensor turned OFF', 'Close', {
          duration: 3000,
            panelClass: ['snackbar-danger']
        });
        }
      },
      error: () => {
        this.snackBar.open('Error changing sensor status', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });
  }

  // Graficos
  chartOptions: EChartsOption = {};

  graphic() {
    this.chartOptions = {
      color: ['#d4d4d4','#345991'],
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '10%',
        left: 'center'
      },
      series: [
        {
          name: 'Status Devices',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.analysis.analysisFailed || 0, name: 'Fail' },
            { value: this.analysis.analysisWorked || 0, name: 'Sucess' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
}

function provideEchartsCore(arg0: {
  echarts: () => Promise<typeof import("echarts/types/dist/echarts")>; // 🔑 AQUI está a correção
}): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}
