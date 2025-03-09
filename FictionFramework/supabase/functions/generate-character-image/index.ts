// @deno-types="https://raw.githubusercontent.com/lucacasonato/edge-runtime-types/main/globals.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
const MODEL_VERSION = "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";

serve(async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Start the image generation
    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          prompt,
          negative_prompt: "cartoon, illustration, painting, drawing, blurry, deformed, disfigured, mutated",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!startResponse.ok) {
      const error = await startResponse.json();
      throw new Error(`Failed to start generation: ${JSON.stringify(error)}`);
    }

    const startJson = await startResponse.json();
    const predictionId = startJson.id;

    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (!imageUrl && attempts < maxAttempts) {
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!pollResponse.ok) {
        const error = await pollResponse.json();
        throw new Error(`Failed to poll generation: ${JSON.stringify(error)}`);
      }

      const pollJson = await pollResponse.json();

      if (pollJson.status === "succeeded") {
        imageUrl = pollJson.output[0];
        break;
      } else if (pollJson.status === "failed") {
        throw new Error("Image generation failed");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!imageUrl) {
      throw new Error("Timeout waiting for image generation");
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});