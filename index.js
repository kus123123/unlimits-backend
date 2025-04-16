import express from 'express';
import { InferenceClient } from '@huggingface/inference';
import { config } from 'dotenv';
import cors from 'cors';
config(); // Load .env if you're using one
console.log(process.env.HUGGING_FACE_KEY);

const app = express();
app.use(cors(
  
)); // Enable CORS for all routes
const port = 3001;

// Hugging Face client setup
const client = new InferenceClient(process.env.HUGGING_FACE_KEY);

console.log(process.env.HUGGING_FACE_KEY);

// Middleware
app.use(express.json());

app.get('/api/generateimage', async (req, res) => {
  const  prompt = req.query.prompt;
  const quality  = parseInt(req.query.quality) || 5
  if (quality < 1 || quality > 10) {
    return res.status(400).json({ error: 'Quality must be between 1 and 10' });
  }
    console.log(prompt);

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const image = await client.textToImage({
      provider: "fal-ai",
      model: "HiDream-ai/HiDream-I1-Full",
      inputs: prompt,
      parameters: { num_inference_steps: quality },
    });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error('Image generation failed:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`🚀 Server is live at http://localhost:${port}`);
});
