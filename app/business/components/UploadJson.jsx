'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '../../../utils/supabase/client';

function UploadJson() {
  const [uploading, setUploading] = useState(false);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const validateAndParseJson = (jsonData) => {
    for (const [filename, data] of Object.entries(jsonData)) {
      if (typeof data !== 'object' || data === null) return false;
      if (!data.imageLink || !data.siteLink) return false;
      if (!Array.isArray(data.colors) || !Array.isArray(data.materials)) return false;
    }
    return true;
  };

  const handleFileUpload = useCallback(async (files) => {
    if (!supabase || files.length !== 1) return;
    setUploading(true);

    const file = files[0];
    if (file.type !== 'application/json') {
      alert('Please upload a JSON file.');
      setUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        if (!validateAndParseJson(jsonData)) {
          alert('Invalid JSON format. Please check your file and try again.');
          setUploading(false);
          return;
        }

        for (const [filename, data] of Object.entries(jsonData)) {
          const { error } = await supabase
            .from('image_desc')
            .insert([
              {
                image_name: filename,
                image_description: data
              }
            ])
            .select();

          if (error) {
            console.error('Error uploading data:', error);
          }
        }

        alert('Upload complete!');
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error parsing JSON. Please check your file and try again.');
      }
      setUploading(false);
    };

    reader.readAsText(file);
  }, [supabase]);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'white',
        color: 'black'
      }}
    >
      <p>Drag and drop a JSON file here to upload</p>
      <input
        type="file"
        accept=".json"
        onChange={(e) => handleFileUpload(e.target.files)}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <label htmlFor="fileInput" style={{ cursor: 'pointer', textDecoration: 'underline', color: 'black' }}>
        Or click here to select a file
      </label>
      {uploading && <p style={{ color: 'black' }}>Uploading...</p>}
    </div>
  );
}

export default UploadJson;
