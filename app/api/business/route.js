import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const colors = [
  "Beige", "Black", "Blue", "Brown", "Green", "Grey", "Orange", "Pink", "Purple", "Red", "Tan", "White", "Yellow"
];

const materials = [
  "Cotton", "Linen", "Silk", "Wool", "Cashmere", "Polyester", "Nylon", "Spandex", "Leather", "Denim", "Velvet", "Satin"
];

const necklines = [
  "Crewneck", "V Neck", "Turtleneck", "Scoop Neck", "Boat Neck", "Cowl Neck", "Halter", "Off-Shoulder", "One-Shoulder"
];

const sleeveLengths = [
  "Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve", "Cap Sleeve"
];

const rises = [
  "Low Rise", "Mid Rise", "High Rise"
];

const legShapes = [
  "Straight", "Skinny", "Bootcut", "Flare", "Wide Leg", "Tapered", "Relaxed"
];
const names = [
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

  try {
    const response = await cohere.chat({
            message: `Given these categories:
  - Colors: ${JSON.stringify(colors)}
  - Materials: ${JSON.stringify(materials)}
  - Necklines: ${JSON.stringify(necklines)}
  - Sleeve Lengths: ${JSON.stringify(sleeveLengths)}
  - Rises: ${JSON.stringify(rises)}
  - Leg Shapes: ${JSON.stringify(legShapes)}
  - Types: ${JSON.stringify(names)}
  
And the search term "${search}":

Create a JSON object that includes:
  - colors: Up to 3 colors that loosely relate to "${search}". Include if they feel relevant.
  - materials: Up to 3 materials connected to "${search}". Add them if they fit the theme.
  - necklines: Up to 3 necklines that might be associated with "${search}". Include if there's a possible connection.
  - sleeveLengths: Up to 3 sleeve lengths that could match "${search}". Include if they seem relevant.
  - rises: Up to 3 rises that might fit "${search}". Include if they seem applicable.
  - legShapes: Up to 3 leg shapes that loosely relate to "${search}". Include if they fit.
  - Types: Up to 3Types that loosely relate to "${search}". Include if they fit.

Feel free to include properties even if they're not strictly tied to "${search}". Be flexible and open in selecting relevant options. If something seems like it could fit, go ahead and include it in the JSON object.
`,
model: "command-nightly", 
      response_format: {
        type: "json_object"
      }
    });

    const parsedData = JSON.parse(response.text);

    // Remove any empty arrays from the parsed data
    Object.keys(parsedData).forEach(key => {
      if (Array.isArray(parsedData[key]) && parsedData[key].length === 0) {
        delete parsedData[key];
      }
    });

    console.log(parsedData)
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
