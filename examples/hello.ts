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

async function FrogAssistant(query: string) {
  // TODO : Add a way to directly log the full request to phospho
  const result = await openai.chat.completions.create({
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
        content: query,
      },
    ],
  });
  return result.choices[0].message.content;
}

(async () => {
  const question = "What's the meaning of life?";
  const answer = await FrogAssistant(question);

  // This is how you log to Phospho
  const loggedContent = phospho.log({ input: question, output: answer });

  console.log("The following content was logged to Phospho:");
  console.log(loggedContent);
})();
