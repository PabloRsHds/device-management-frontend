export interface Device {
  id: number;
  name: string;
  type: string;
  model?: string;
  serial?: string;
  registeredAt: string;
}
