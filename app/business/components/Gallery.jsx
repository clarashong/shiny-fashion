'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';
import Image from 'next/image';

// Initialize Supabase client once
const supabase = createClient();

function Gallery({ filters = {} }) {
  const [images, setImages] = useState([]);
  const [bucketFiles, setBucketFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bucket files once when component mounts
  useEffect(() => {
    const fetchBucketFiles = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('catalog')
          .list('', {
            limit: 1000, // Adjust limit as needed
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) {
          console.error('Error fetching bucket files:', error);
          return;
        }

        setBucketFiles(data.map(file => file.name));
      } catch (error) {
        console.error('Error during bucket files fetching:', error);
      }
    };

    fetchBucketFiles();
  }, []); // Empty dependency array ensures this runs once

  // Fetch images whenever filters or bucketFiles change
  useEffect(() => {
    const fetchImages = async () => {
      // Only proceed if bucket files have been fetched
      if (bucketFiles.length === 0) return;

      setLoading(true);
      try {
        // Fetch all images from the database
        const { data, error } = await supabase.from('image_desc').select('*');

        if (error) {
          console.error('Error fetching images:', error);
          return;
        }

        console.log("Filters being used: ", filters)

        // Filter out images whose files do not exist in the bucket
        const validImages = data.filter(item => bucketFiles.includes(item.image_name));

       // Apply filters if any
let filteredImages = validImages;
if (Object.keys(filters).length > 0) {
  filteredImages = validImages.filter(item => {
    const description = item.image_description;

    // Check if product type matches first
    let isProductTypeMatch = false;
    if (filters.type && description.type) {
      if (filters.type.includes(description.type)) {
        isProductTypeMatch = true;
      }
    }

    // Count how many other filters match
    let matchCount = 0;
    Object.keys(filters).forEach(key => {
      if (key !== 'type' && filters[key] && filters[key].length > 0) {
        if (description[key] && Array.isArray(description[key])) {
          if (filters[key].some(filterValue => description[key].includes(filterValue))) {
            matchCount++;
          }
        }
      }
    });

    // Prioritization logic
    // 1. Product type must match
    // 2. Check if at least one other filter matches if product type matches
    // 3. Provide fallback options if no product type match but 2 other filters match
    if (isProductTypeMatch) {
      return matchCount > 0; // Product type match with at least one other filter
    } else {
      // Fallback option: If product type doesn't match, at least 2 other filters must match
      return matchCount >= 3;
    }
  });
}

        // Map images to include public URLs
        const imagesWithUrls = filteredImages.map(item => {
          const { data: fileData } = supabase.storage
            .from('catalog')
            .getPublicUrl(item.image_name);

          return {
            ...item,
            publicUrl: fileData.publicUrl
          };
        });

        setImages(imagesWithUrls);
      } catch (error) {
        console.error('Error during images fetching:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

  }, [filters, bucketFiles]); // Re-run when filters or bucketFiles change

  if (loading) {
    return <div>Loading...</div>;
  }

  if (images.length === 0) {
    return <div>No images found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square">
          <Image
            src={image.publicUrl}
            alt={image.image_name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
            <p className="text-sm truncate">{image.image_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
        