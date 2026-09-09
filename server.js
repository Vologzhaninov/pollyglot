import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

app.post('/api/translate', async (req, res) => {
  const { language, userPrompt} = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are translator from English to ${language}.
            Do not write introductions or conclusions. 
            Give back only translation for user sentence.`
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_completion_tokens: 100,
      temperature: 0,
    });
    //res.json(`Hello from Express! ${process.env.AI_URL}, ${process.env.AI_MODEL}`);
    //res.json(`Hello from Express! ${language}, ${userPrompt}`);
    const translation = response.choices[0].message.content;
    console.log(translation);
    res.json({ translation });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: `It's not you, it's us. 
    Something went wrong on the server` })
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//node server.js