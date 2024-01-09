export interface PhosphoInit {
  apiKey?: string;
  projectId?: string;
  tick?: number;
}

export interface LogContent {
  input: string | Promise<string> | object | null;
  output?: string | Promise<string> | object | null;
  sessionId?: string | null;
  taskId?: string | null;
  rawInput?: any;
  rawOutput?: any;
  // TODO: group those into "transformation"
  inputToStrFunction?: (input: any) => string;
  outputToStrFunction?: (output: any) => string;
  outputToTaskIdAndToLogFunction?: (output: any) => [string, boolean];
  concatenateRawOutputsIfTaskIdExists?: boolean;
  stream?: boolean;
  // Other data to log
  [key: string]: any;
}

export interface LogEvent {
  id: string;
  content: LogContent;
  toLog: boolean;
}

export interface UserFeedback {
  taskId: string;
  flag?: "success" | "failure";
  notes?: string;
  source?: string;
  rawFlag?: string;
  rawFlagToFlag?: (rawFlag: string) => "success" | "failure";
}
