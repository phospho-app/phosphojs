interface PhosphoInit {
    apiKey?: string;
    projectId?: string;
    tick?: number;
}
interface LogEvent {
    input: any;
    output?: any;
    sessionId?: string;
    taskId?: string;
    rawInput?: any;
    rawOutput?: any;
    inputToStrFunction?: any;
    outputToStrFunction?: any;
    outputToTaskIdAndToLogFunction?: any;
    concatenateRawOutputsIfTaskIdExists?: boolean;
    stream?: boolean;
    [key: string]: any;
}

declare class Phospho {
    apiKey: string;
    projectId: string;
    tick: number;
    context: any;
    private logQueue;
    constructor(context?: any);
    init({ apiKey, projectId, tick }?: PhosphoInit): void;
    log({ input, output, sessionId, taskId, rawInput, rawOutput, inputToStrFunction, outputToStrFunction, outputToTaskIdAndToLogFunction, concatenateRawOutputsIfTaskIdExists, stream, ...rest }: LogEvent): Promise<void>;
    sendBatch(): Promise<any>;
    private debouncedProcessQueue;
}

declare const phospho: Phospho;

export = phospho;
