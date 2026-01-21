import { TestStatus } from "../../enums/TestStatus";

export interface TestResult {

  status: TestStatus;
  timestamp: string;
  details: string;
}
