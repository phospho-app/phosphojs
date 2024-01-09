// OpenAI Chat Example

import phospho from "../src";
import OpenAI from "openai";
import "dotenv/config";

// Initialize Phospho
phospho.init({
  apiKey: process.env.PHOSPHO_API_KEY,
  projectId: process.env.PHOSPHO_PROJECT_ID,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * This is the minimal example of logging to Phospho.
 */
const simpleLog = async () => {
  const question = "What's the capital of Fashion ?";

  const myAgent = (query) => {
    // Here, you'd do complex stuff.
    // But for this example we'll just return the same answer every time.
    return "It's Paris of course.";
  };

  // Log events to phospho by passing strings directly
  phospho.log({
    input: question,
    output: myAgent(question),
  });
};

/**
 * This example shows how to log OpenAI Chat completions to Phospho.
 * Phospho extracts the input and output from the OpenAI Chat query.
 */
const extractLog = async () => {
  // If you pass full OpenAI queries and results to Phospho, it will extract the input and output for you.
  const question = "What's the capital of Fashion ?";
  const query = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    seed: 123,
    messages: [
      {
        role: "system",
        content:
          "You are an helpful frog who gives life advice to people. You say *ribbit* at the end of each sentence and make other frog noises in between. You answer shortly in less than 50 words.",
      },
      {
        role: "user",
        content: question,
      },
    ],
    stream: false,
  };
  const result = openai.chat.completions.create(query);
  const loggedContent = await phospho.log({ input: query, output: result });

  // Look at the fields "input" and "output" in the logged content
  // Original fields are in "raw_input" and "raw_output"
  console.log("The following content was logged to Phospho:", loggedContent);
};

/**
 * This example shows how to stream OpenAI Chat completions to Phospho.
 * Phospho combines the streamed outputs.
 */
const logStream = async () => {
  // This should also work with streaming
  const question = "What's the capital of Fashion ?";
  const query = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    seed: 123,
    messages: [
      {
        role: "system",
        content:
          "You are an helpful frog who gives life advice to people. You say *ribbit* at the end of each sentence and make other frog noises in between. You answer shortly in less than 50 words.",
      },
      {
        role: "user",
        content: question,
      },
    ],
    stream: true,
  };
  const streamedResult = await openai.chat.completions.create(query);

  phospho.log({ input: query, output: streamedResult, stream: true });

  for await (const chunk of streamedResult) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
};

// Main function
(async () => {
  // await simpleLog();
  // await extractLog();
  await logStream();
})();
