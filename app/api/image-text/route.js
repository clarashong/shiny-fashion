import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY
});

export async function POST(request) {
  try {
    // Get the image data from the request body
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert the image to base64
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Call OpenAI API to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What tags would you use to describe this image? Please provide a list 5 of relevant tags in a JSON format. Make sure you dont put any vague descriptions" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
          ],
        },
      ],
    });

    // Extract the tags from the OpenAI response
    const tags = JSON.parse(response.choices[0].message.content);

    return NextResponse.json(tags.tags);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
