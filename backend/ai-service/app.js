import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
const PORT = 3006;

app.post("/ai-service/chatgpt", async (req, res) => {
  console.log("called");
  const { messages } = req.body;
  console.log(messages);
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    // messages: [{ role: "user", content: `${message}` }],
    messages: [...messages],
  });
  console.log(completion.data.choices[0].message);
  res.json({
    reply: completion.data.choices[0].message,
  });
});

app.listen(PORT, () => console.log("ai-service running on port: " + PORT));
