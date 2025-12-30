import { TestStatus } from "./TestStatus";

export interface TestResult {

  status: TestStatus;
  timestamp: string;
  details: string;
}
