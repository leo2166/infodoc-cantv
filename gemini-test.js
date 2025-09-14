
import { GoogleGenerativeAI } from "@google/genai";

// El cliente obtiene la clave de API de la variable de entorno `GOOGLE_API_KEY`
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Escribe una historia corta sobre un programador que descubre un nuevo lenguaje de programación mágico.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
