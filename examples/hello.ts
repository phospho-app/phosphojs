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

(async () => {
  const question = "What's the capital of Fashion ?";

  const myAgent = (query: string) => {
    // Here, you'd do complex stuff.
    // But for this example we'll just return the same answer every time.
    return "It's Paris of course.";
  };

  // Log events to phospho by passing strings directly
  phospho.log({
    input: question,
    output: myAgent(question),
  });

  // If you use an LLM, you can log the full queries and answers to Phospho
  const query = {
    model: "gpt-3.5-turbo",
    temperature: 0,
    // stream: true,
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
  };
  const result = openai.chat.completions.create({ ...query });

  // const answer = result.choices[0].message.content;

  // Pass the full query and result to phospho
  const loggedContent = await phospho.log({ input: question, output: result });

  // This will extract the input and output from the query and result
  console.log("The following content was logged to Phospho:");
  console.log(loggedContent);
})();
