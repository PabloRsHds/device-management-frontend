export interface DeviceAnalysisDto {
  name: string;
  type: string;
  description: string;
  deviceModel: string;
  manufacturer: string;
  status: string;
  location: string;
  unit: string;
  minLimit: number;
  maxLimit: number;
  lastReadingMinLimit: number;
  lastReadingMaxLimit: number;
  lastReadingUpdateAt: string;
  updatedAt: string;
  createdAt: string;
}
