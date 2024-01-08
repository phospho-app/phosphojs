export interface PhosphoInit {
    apiKey?: string
    projectId?: string
    tick?: number
}

export interface LogEvent {
    // Phython code:
    // input: Union[RawDataType, str],
    // output: Optional[Union[RawDataType, str, Iterable[RawDataType]]] = None,
    // session_id: Optional[str] = None,
    // task_id: Optional[str] = None,
    // raw_input: Optional[RawDataType] = None,
    // raw_output: Optional[RawDataType] = None,
    // # todo: group those into "transformation"
    // input_to_str_function: Optional[Callable[[Any], str]] = None,
    // output_to_str_function: Optional[Callable[[Any], str]] = None,
    // output_to_task_id_and_to_log_function: Optional[
    //     Callable[[Any], Tuple[Optional[str], bool]]
    // ] = None,
    // concatenate_raw_outputs_if_task_id_exists: bool = True,
    // stream: bool = False,

    input: any
    output?: any
    sessionId?: string
    taskId?: string
    rawInput?: any
    rawOutput?: any
    inputToStrFunction?: any
    outputToStrFunction?: any
    outputToTaskIdAndToLogFunction?: any
    concatenateRawOutputsIfTaskIdExists?: boolean
    stream?: boolean
    [key: string]: any
}