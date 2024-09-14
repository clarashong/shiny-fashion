import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const names = [
    "All Clothing",
    "Activewear",
    "Blazers & Suiting",
    "Cardigans & Sweaters",
    "Denim",
    "Dresses",
    "Intimates & Shapewear",
    "Jackets & Coats",
    "Jumpsuits & Rompers",
    "Knitwear",
    "Leggings & Bike Shorts",
    "Pants",
    "Sale",
    "Shirts & Blouses",
    "Shorts",
    "Skirts",
    "Sweatpants",
    "Sweatshirts & Hoodies",
    "Sweats",
    "Tops & Bodysuits",
    "T-Shirts",
    "Vests"
  ];  

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  console.log("running get req")

  try {
    const response = await cohere.chat({
      message: `Given the following list of clothing categories: ${JSON.stringify(names)}, 
                and the search term "${search}", return the 3 category names that are most 
                similar or relevant to the search term. Provide the result as a JSON array 
                of strings.`,
    //   connectors: [{ id: 'web-search' }],
    });
    console.log(response);

    return NextResponse.json(response.chatHistory[1].message);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
