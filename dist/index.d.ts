interface PhosphoInit {
    apiKey?: string;
    projectId?: string;
    tick?: number;
}
interface LogContent {
    input: string | Promise<string> | object | null;
    output?: string | Promise<string> | object | null;
    sessionId?: string | null;
    taskId?: string | null;
    rawInput?: any;
    rawOutput?: any;
    inputToStrFunction?: (input: any) => string;
    outputToStrFunction?: (output: any) => string;
    outputToTaskIdAndToLogFunction?: (output: any) => [string, boolean];
    concatenateRawOutputsIfTaskIdExists?: boolean;
    stream?: boolean;
    [key: string]: any;
}
interface LogEvent {
    id: string;
    content: LogContent;
    toLog: boolean;
}
interface UserFeedback {
    taskId: string;
    flag?: "success" | "failure";
    notes?: string;
    source?: string;
    rawFlag?: string;
    rawFlagToFlag?: (rawFlag: string) => "success" | "failure";
}

declare class Phospho {
    apiKey: string;
    projectId: string;
    tick: number;
    context: any;
    logQueue: Map<string, LogEvent>;
    latestTaskId: string | null;
    latestSessionId: string | null;
    constructor(context?: any);
    init({ apiKey, projectId, tick }?: PhosphoInit): void;
    /**
     * Generate a new session id
     */
    newSession(): string;
    /**
     * Generate a new task id
     */
    newTask(): string;
    _log(input: any, output: any, sessionId: any, taskId: any, rawInput: any, rawOutput: any, inputToStrFunction: any, outputToStrFunction: any, concatenateRawOutputsIfTaskIdExists: any, toLog: any, ...rest: any[]): Promise<{
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): any;
        push(...items: any[]): number;
        concat(...items: ConcatArray<any>[]): any[];
        concat(...items: any[]): any[];
        join(separator?: string): string;
        reverse(): any[];
        shift(): any;
        slice(start?: number, end?: number): any[];
        sort(compareFn?: (a: any, b: any) => number): any[];
        splice(start: number, deleteCount?: number): any[];
        splice(start: number, deleteCount: number, ...items: any[]): any[];
        unshift(...items: any[]): number;
        indexOf(searchElement: any, fromIndex?: number): number;
        lastIndexOf(searchElement: any, fromIndex?: number): number;
        every<S extends any>(predicate: (value: any, index: number, array: any[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any): U[];
        filter<S_1 extends any>(predicate: (value: any, index: number, array: any[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): any[];
        reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any): any;
        reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: any, currentIndex: number, array: any[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any): any;
        reduceRight(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: any, currentIndex: number, array: any[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends any>(predicate: (value: any, index: number, obj: any[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: any, index: number, obj: any[]) => unknown, thisArg?: any): any;
        findIndex(predicate: (value: any, index: number, obj: any[]) => unknown, thisArg?: any): number;
        fill(value: any, start?: number, end?: number): any[];
        copyWithin(target: number, start: number, end?: number): any[];
        entries(): IterableIterator<[number, any]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<any>;
        includes(searchElement: any, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: any, index: number, array: any[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): any;
        findLast<S_3 extends any>(predicate: (value: any, index: number, array: any[]) => value is S_3, thisArg?: any): S_3;
        findLast(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): any;
        findLastIndex(predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): number;
        toReversed(): any[];
        toSorted(compareFn?: (a: any, b: any) => number): any[];
        toSpliced(start: number, deleteCount: number, ...items: any[]): any[];
        toSpliced(start: number, deleteCount?: number): any[];
        with(index: number, value: any): any[];
        [Symbol.iterator](): IterableIterator<any>;
        [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
        client_created_at: number;
        project_id: string;
        session_id: any;
        task_id: any;
        input: string;
        raw_input: string | object;
        raw_input_type_name: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        output: string;
        raw_output: string | object;
        raw_output_type_name: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    }>;
    /**
     * Phospho's main all-purpose logging endpoint, with support for streaming.
  
      Usage:
      ```
      phospho.log(input="input", output="output")
      ```
  
      By default, phospho will try to interpret a string representation from `input` and `output`.
      For example, OpenAI API calls. Arguments passed as `input` and `output` are then stored
      in `rawInput` and `rawOutput`, unless those are specified.
  
      You can customize this behaviour using `inputToStrFunction` and `outputToStrFunction`.
  
      `sessionId` is used to group logs together. For example, a single conversation.
  
      `taskId` is used to identify a single task. For example, a single message in a conversation.
      This is useful to log user feedback on a specific task (see phospho.userFeedback).
  
      `stream` is used to log a stream of data. For example, a generator. If `stream=True`, then
      `phospho.log` returns a generator that also logs every individual output. See `phospho.wrap`
      for more details.
  
      Every other keyword parameters in `...rest` will be added to the log content and stored.
  
     * @param input The input to the task
     * @param output The output of the task
     * @param sessionId The session id
     * @param taskId The task id
     * @param rawInput The raw input
     * @param rawOutput The raw output
     * @param inputToStrFunction A function to convert the input to a string
     * @param outputToStrFunction A function to convert the output to a string
     * @param outputToTaskIdAndToLogFunction A function to convert the output to a task id and a boolean indicating whether to log the output. Useful for streaming.
     * @param concatenateRawOutputsIfTaskIdExists Whether to concatenate the raw outputs if a task id exists
     * @param stream Enable compatibility with streaming input
     * @param rest Any other data to log
     * @returns The logged event, including the taskId.
     */
    log({ input, output, sessionId, taskId, rawInput, rawOutput, inputToStrFunction, outputToStrFunction, concatenateRawOutputsIfTaskIdExists, stream, ...rest }: LogContent): Promise<void>;
    /**
     * Send a batch of log events to Phospho
     */
    sendBatch(): Promise<void>;
    private debouncedProcessQueue;
    wrap: (fn: any) => (...args: any[]) => Promise<void>;
    /**
     * Flag a task already logged to phospho as a `success` or a `failure`. This is useful to collect human feedback.
     *
     * Note: Feedback can be directly logged with `phospho.log` by passing `flag` as a keyword argument.
     *
     * @param taskId The task id. Get the taskId from the returned value of phospho.log, use phospho.newTask to generate a new task id, or use pospho.latestTaskId
     * @param flag The flag to set, either `success` or `failure`
     * @param notes Optional notes to add to the task. For example, the reason for the flag.
     * @param source Optional source of the flag. For example, the name of the user who flagged the task.
     * @param rawFlag Optional raw flag. If flag is not specified, rawFlag is used to determine the flag. For example, if rawFlag is "👍", then flag is "success".
     * @param rawFlagToFlag Optional function to convert rawFlag to flag. By default, "success", "👍", "🙂", "😀" are set to be "success"
     * @returns The updated task
     */
    userFeedback: ({ taskId, flag, notes, source, rawFlag, rawFlagToFlag, }: UserFeedback) => Promise<any>;
}

declare const phospho: Phospho;

export = phospho;
