import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const namesWithLinks = {
  "All Clothing": "https://www.aritzia.com/en/clothing/all-clothing",
  "Activewear": "https://www.aritzia.com/en/clothing/womens-workout-clothes",
  "Blazers & Suiting": "https://www.aritzia.com/en/clothing/suits-for-women",
  "Cardigans & Sweaters": "https://www.aritzia.com/en/clothing/sweaters",
  "Denim": "https://www.aritzia.com/en/clothing/jeans",
  "Dresses": "https://www.aritzia.com/en/clothing/dresses",
  "Intimates & Shapewear": "https://www.aritzia.com/en/clothing/intimates",
  "Jackets & Coats": "https://www.aritzia.com/en/clothing/coats-jackets",
  "Jumpsuits & Rompers": "https://www.aritzia.com/en/clothing/jumpsuits-rompers",
  "Knitwear": "https://www.aritzia.com/en/clothing/knitwear",
  "Leggings & Bike Shorts": "https://www.aritzia.com/en/clothing/leggings-and-bike-shorts",
  "Pants": "https://www.aritzia.com/en/clothing/pants",
  "Sale": "https://www.aritzia.com/en/clothing/sale-2",
  "Shirts & Blouses": "https://www.aritzia.com/en/clothing/blouses",
  "Shorts": "https://www.aritzia.com/en/clothing/shorts",
  "Skirts": "https://www.aritzia.com/en/clothing/skirts",
  "Sweatpants": "https://www.aritzia.com/en/clothing/sweatpants-1",
  "Sweatshirts & Hoodies": "https://www.aritzia.com/en/clothing/sweatshirts-2",
  "Sweats": "https://www.aritzia.com/en/clothing/sweatsuit-sets",
  "Tops & Bodysuits": "https://www.aritzia.com/en/clothing/tops",
  "T-Shirts": "https://www.aritzia.com/en/clothing/tshirts",
  "Vests": "https://www.aritzia.com/en/clothing/vests-4"
};

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

const colors = [
  "Beige",
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Grey",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Tan",
  "White",
  "Yellow"
];

const materials = [
  "Butter",
  "Barely-there, buttery soft sweat-wicking fabric that shapes to your body",
  "Cashmere",
  "Chiffon",
  "Contour",
  "Luxe, ultra-flattering fabric coveted for its smoothing effect and second-skin feel.",
  "Cotton",
  "Crepe",
  "Denim",
  "Flannel",
  "HomeStretch",
  "Body-hugging, stretchy ribbed fabric with a cottony soft feel.",
  "Jersey",
  "Lace",
  "Linen",
  "Mesh",
  "Modal",
  "Non-Wool Yarn",
  "Polar Fleece",
  "Poplin",
  "Ribbed",
  "Ripstop",
  "Satin",
  "Smooth, glossy fabric for evening time.",
  "Sculpt Knit",
  "Our signature figure-enhancing yarn. Holds you in all the right places to shape and sculpt your form.",
  "Seamless",
  "Our smooth-look, smooth-feel fabrics crafted for unbeatable comfort. In ribbed, smooth or Scrunchee.",
  "Silk",
  "Suiting",
  "Sweatfleece",
  "Tailored Outerwear",
  "Technical Outerwear",
  "Twill",
  "UnReal Leather",
  "Waffle Knit",
  "Waterproof Fabrics",
  "Wool",
  "Recycled Materials",
  "Responsible Cashmere",
  "Responsible Forestry",
  "Responsible Wool"
];

const necklines = [
  "Boatneck",
  "Collar",
  "Cowlneck",
  "Crewneck",
  "Halter",
  "Hoodie",
  "Mockneck",
  "Off Shoulder",
  "One Shoulder",
  "Scoopneck",
  "Strapless",
  "Squareneck",
  "Sweetheart",
  "Turtleneck",
  "V Neck",
  "Open"
];

const sleeveLengths = [
  "Strapless",
  "Sleeveless",
  "Short Sleeve",
  "3/4 Sleeve",
  "Long Sleeve"
];

const rises = [
  "Low",
  "Mid",
  "High",
  "Super-High"
];

const legShapes = [
  "Barrel",
  "Bootcut",
  "Carrot",
  "Flare",
  "Jogger",
  "Skinny",
  "Straight",
  "Wide"
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getFirstClothingItemDetails(url) {
  console.log("Trying url:", url);
  try {
    // Set up headers to mimic a browser request
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      }
    });

    const $ = cheerio.load(data);

    // Check if there are no search results
    const noResultsMessage = $('.js-search__no-results').text().trim();
    if (noResultsMessage) {
      return {
        message: 'No products match these filters. Try removing one or switching to a new category.'
      };
    }

    // Extract the first clothing item details
    const firstItem = $('.ar-product-tile__main').first();
    if (!firstItem.length) {
      return {
        message: 'No product items found on the page.'
      };
    }

    // Get the link
    const link = firstItem.find('.ar-product-tile__title a').attr('href');
    const image = firstItem.find('.ar-product-tile__image img').attr('src');
    const title = firstItem.find('.ar-product-tile__title').text().trim();

    if (!link || !image || !title) {
      return {
        message: 'Unable to extract product details from the page.'
      };
    }

    return {
      title,
      link: `https://www.aritzia.com${link}`,
      image
    };
  } catch (error) {
    console.error('Error fetching clothing item details:', error);
    return {
      message: `Error occurred for ${url}: ${error.message}`
    };
  }
}

function generateAritziaLinks(data) {
  const links = Object.keys(data).map(category => {
    const categoryData = data[category];
    
    // Get random color and material from the available options
    const randomColor = categoryData.colors[Math.floor(Math.random() * categoryData.colors.length)];
    const randomMaterial = categoryData.materials[Math.floor(Math.random() * categoryData.materials.length)];
    
    // Construct the link
    const link = `${namesWithLinks[category]}/${randomColor.toLowerCase()}+${randomMaterial.toLowerCase().replace(/ /g, '')}`;
    
    return {
      category,
      link
    };
  });

  return links;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const response = await cohere.chat({
      message: `Given the following categories:
                - Names: ${JSON.stringify(names)}
                - Colors: ${JSON.stringify(colors)}
                - Materials: ${JSON.stringify(materials)}
                - Necklines: ${JSON.stringify(necklines)}
                - Sleeve Lengths: ${JSON.stringify(sleeveLengths)}
                - Rises: ${JSON.stringify(rises)}
                - Leg Shapes: ${JSON.stringify(legShapes)}
                
                And the search term "${search}":
                
                Generate a JSON object where each key is one of the 5 most relevant names from ${JSON.stringify(names)} to "${search}". 
                For each name, include the following properties as subcategories:
                  - colors: An array of the 3 most relevant colors to "${search}".
                  - materials: An array of the 3 most relevant materials to "${search}".
                  - necklines: An array of the 3 most relevant necklines to "${search}".
                  - sleeve_lengths: An array of the 3 most relevant sleeve lengths to "${search}".
                  - rises: An array of the 3 most relevant rises to "${search}". (Include only if applicable)
                  - leg_shapes: An array of the 3 most relevant leg shapes to "${search}". (Include only if applicable)`,
      model: "command-nightly",
      response_format: {
        type: "json_object"
      }
    });

    const parsedData = JSON.parse(response.text);
    const generatedLinks = generateAritziaLinks(parsedData);
    
    const detailedResults = [];
    for (const { category, link } of generatedLinks) {
      const details = await getFirstClothingItemDetails(link);
      detailedResults.push({ category, link, ...details });
      await delay(2000); // Wait for 2 seconds before the next request
    }

    const responseData = {
      categories: parsedData,
      results: detailedResults.map(result => ({
        category: result.category,
        link: result.link,
        details: result.message ? { error: result.message } : {
          title: result.title,
          productLink: result.link,
          image: result.image
        }
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}
