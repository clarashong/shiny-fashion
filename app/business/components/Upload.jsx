'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '../../../utils/supabase/client';

function Upload() {
  const [uploading, setUploading] = useState(false);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const handleFileUpload = useCallback(async (files) => {
    if (!supabase) return;
    setUploading(true);

    for (const file of files) {
      const fileName = `${file.name}`;
      const { error } = await supabase.storage
        .from('catalog')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    alert('Upload complete!');
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
      <p>Drag and drop files here to upload</p>
      {uploading && <p>Uploading...</p>}
    </div>
  );
}

export default Upload;
