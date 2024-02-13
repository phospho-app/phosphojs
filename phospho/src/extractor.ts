const detectStrFromInput = (input: any) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input === "object") {
    // OpenAI
    const inputMessages = input?.messages;
    if (inputMessages) {
      // Get last element
      const lastMessage = inputMessages[inputMessages.length - 1]?.content;
      if (lastMessage) {
        return lastMessage;
      }
    }

    // Log the full JSON
    return JSON.stringify(input);
  }

  return input.toString();
};

const detectStrFromOutput = (output) => {
  if (typeof output === "string") {
    return output;
  }
  if (typeof output === "object") {
    // OpenAI
    const choiceMessageContent = output?.choices[0]?.message?.content;
    if (choiceMessageContent !== undefined) return choiceMessageContent;
    const choiceDelta = output?.choices[0]?.delta;
    if (choiceDelta !== undefined) {
      const choiceDeltaContent = choiceDelta?.content;
      if (choiceDeltaContent !== undefined) return choiceDeltaContent;
      const choiceFinishReason = output?.choices[0]?.finish_reason;
      if (choiceFinishReason !== undefined) return ""; // Generation finished
    }

    return JSON.stringify(output);
  }
  return output.toString();
};

interface GetInputOutputResult {
  inputToLog: string;
  rawInputToLog: string | object | null;
  outputToLog: string | null;
  rawOutputToLog: string | object | null;
}

export const getInputOutput = ({
  input,
  output,
  rawInput,
  rawOutput,
  inputToStrFunction,
  outputToStrFunction,
}): GetInputOutputResult => {
  if (!inputToStrFunction) {
    inputToStrFunction = detectStrFromInput;
  }
  if (!outputToStrFunction) {
    outputToStrFunction = detectStrFromOutput;
  }

  let inputToLog: string = null;
  let rawInputToLog: string = null;
  let outputToLog: string = null;
  let rawOutputToLog: string = null;

  rawInputToLog = input;
  if (typeof input === "string") {
    inputToLog = input;
  } else {
    // Input is mandatory
    inputToLog = inputToStrFunction(input);
  }
  // if rawInput is specified, override
  if (rawInput) {
    rawInputToLog = rawInput;
  }

  rawOutputToLog = output;
  if (typeof output === "string") {
    outputToLog = output;
  } else if (output) {
    // Output is optional
    outputToLog = outputToStrFunction(output);
  }
  // if rawOutput is specified, override
  if (rawOutput) {
    rawOutputToLog = rawOutput;
  }

  return {
    inputToLog,
    rawInputToLog,
    outputToLog,
    rawOutputToLog,
  };
};
