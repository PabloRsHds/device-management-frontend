export interface RegisterDevice {
  name: string,
  type: string,
  deviceModel: string,
  description: string,
  manufacturer: string,
  minLimit: number,
  maxLimit: number,
  unit: string,
  location: string
}
