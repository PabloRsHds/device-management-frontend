export interface DeviceAnalysisDto {
  name: string;
  deviceModel: string;
  minLimit: number;
  maxLimit: number;
  unit: string;
  updatedAt: string;
  createdAt: string;
  lastReadingMinLimit: number;
  lastReadingMaxLimit: number;
  lastReadingUpdateAt: string;
  analysisWorked: number,
  analysisFailed: number
}
