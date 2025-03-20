'use client';

import { useState } from 'react';
import { Box, Button, FileInput, Group, Image, Text } from '@mantine/core';
import { IconDownload, IconFile, IconPhoto, IconTrash, IconUpload } from '@tabler/icons-react';
import { UPLOADS_URL } from '@/lib/config';

interface TodoFilesProps {
  imageUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  onImageChange?: (file: File | null) => void;
  onFileChange?: (file: File | null) => void;
  onRemoveImage?: () => void;
  onRemoveFile?: () => void;
  removeImage?: boolean;
  removeFile?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function TodoFiles({
  imageUrl,
  fileUrl,
  fileName,
  onImageChange,
  onFileChange,
  onRemoveImage,
  onRemoveFile,
  removeImage = false,
  removeFile = false,
  disabled = false,
  readOnly = false
}: TodoFilesProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to ensure image URLs are correctly formed
  const getFullImageUrl = (url: string | undefined | null) => {
    if (!url) return '';
    
    // If the URL already starts with http, it's already a full URL
    if (url.startsWith('http')) {
      return url;
    }
    
    // If URL starts with /uploads, remove the leading slash
    const normalizedUrl = url.startsWith('/uploads/') 
      ? url.substring(8) 
      : url.startsWith('uploads/') 
        ? url.substring(7) 
        : url;
    
    return `${UPLOADS_URL}/${normalizedUrl}`;
  };

  // Function to handle file download
  const handleFileDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Set loading state to show download is in progress
      setIsLoading(true);
      
      // Get the full URL
      const url = getFullImageUrl(fileUrl);
      
      // Fetch the file as a blob
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a link element
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName; // This is important for forcing download
      a.style.display = 'none';
      
      // Append to the document
      document.body.appendChild(a);
      
      // Trigger click
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Read-only mode (for display only)
  if (readOnly) {
    return (
      <>
        {/* Display the image thumbnail if exists */}
        {imageUrl && (
          <div className="mt-3" style={{ maxWidth: '200px' }}>
            <Image 
              src={getFullImageUrl(imageUrl)} 
              alt="Todo thumbnail" 
              width={200} 
              height={200} 
              radius="sm"
              fit="contain"
              className="border"
              style={{ width: 'auto' }}
            />
          </div>
        )}

        {/* Display the PDF file download link if exists */}
        {fileUrl && fileName && (
          <Button 
            variant="subtle"
            size="xs"
            color="blue"
            leftSection={<IconFile size={16} />}
            rightSection={<IconDownload size={14} />}
            onClick={() => handleFileDownload(fileUrl, fileName)}
            className="mt-3 px-2"
            loading={isLoading}
          >
            <span className="truncate">{fileName}</span>
          </Button>
        )}
      </>
    );
  }

  // Edit mode
  return (
    <>
      {/* Image Upload Section */}
      <Box className="border p-3 rounded">
        <Text fw={500} mb="xs" size="sm"><IconPhoto size={16} className="inline mr-2" />Image Upload</Text>
        
        {imageUrl && !removeImage ? (
          <Box className="mb-3">
            <Group justify="space-between" mb="xs">
              <Text size="xs">Current Image:</Text>
              <Button 
                variant="subtle" 
                color="red" 
                size="xs" 
                onClick={onRemoveImage}
                leftSection={<IconTrash size={12} />}
                disabled={disabled}
              >
                Remove
              </Button>
            </Group>
            <div style={{ maxWidth: '200px' }}>
              <Image src={getFullImageUrl(imageUrl)} alt="Thumbnail" width={200} height={200} fit="contain" style={{ width: 'auto' }} />
            </div>
          </Box>
        ) : (
          <FileInput
            placeholder="Upload a new image"
            accept="image/png,image/jpeg,image/jpg"
            leftSection={<IconUpload size={16} />}
            onChange={onImageChange}
            clearable
            size="xs"
            className="mb-2"
            disabled={disabled}
          />
        )}

        {removeImage && (
          <Text size="xs" color="red" mb="xs">
            Current image will be removed upon saving
          </Text>
        )}
      </Box>

      {/* File Upload Section */}
      <Box className="border p-3 rounded">
        <Text fw={500} mb="xs" size="sm"><IconFile size={16} className="inline mr-2" />File Attachment</Text>
        
        {fileUrl && fileName && !removeFile ? (
          <Box className="mb-3">
            <Group justify="space-between" mb="xs">
              <Text size="xs">Current File: {fileName}</Text>
              <Group gap={8}>
                <Button 
                  size="xs" 
                  variant="subtle" 
                  color="blue" 
                  onClick={() => handleFileDownload(fileUrl, fileName)}
                  leftSection={<IconDownload size={12} />}
                  loading={isLoading}
                  disabled={disabled}
                >
                  Download
                </Button>
                <Button 
                  variant="subtle" 
                  color="red" 
                  size="xs" 
                  onClick={onRemoveFile}
                  leftSection={<IconTrash size={12} />}
                  disabled={disabled}
                >
                  Remove
                </Button>
              </Group>
            </Group>
          </Box>
        ) : (
          <FileInput
            placeholder="Upload a new PDF file"
            accept="application/pdf"
            leftSection={<IconUpload size={16} />}
            onChange={onFileChange}
            clearable
            size="xs"
            className="mb-2"
            disabled={disabled}
          />
        )}

        {removeFile && (
          <Text size="xs" color="red" mb="xs">
            Current file will be removed upon saving
          </Text>
        )}
      </Box>
    </>
  );
} 