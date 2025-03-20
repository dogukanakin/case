'use client';

import { useState } from 'react';
import { Box, Button, FileInput, Group, Image, Text, Flex, Stack, Card, ThemeIcon } from '@mantine/core';
import { IconDownload, IconFile, IconPhoto, IconTrash, IconUpload, IconPaperclip } from '@tabler/icons-react';
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
    if (!imageUrl && !fileUrl) return null;
    
    return (
      <Stack gap="md" mt="xs">
        {/* Display the image thumbnail if exists */}
        {imageUrl && (
          <Card p="xs" withBorder radius="md">
            <Flex gap="xs" align="center" mb="xs">
              <ThemeIcon size="xs" color="blue" variant="light">
                <IconPhoto size={14} />
              </ThemeIcon>
              <Text size="xs" fw={500} color="dimmed">Image Attachment</Text>
            </Flex>
            <Image 
              src={getFullImageUrl(imageUrl)} 
              alt="Todo thumbnail" 
              width={200} 
              height={200} 
              radius="sm"
              fit="contain"
              className="border"
              mx="auto"
              style={{ width:300, height: 300, objectFit: 'contain' }}
            />
          </Card>
        )}

        {/* Display the PDF file download link if exists */}
        {fileUrl && fileName && (
          <Flex align="center" gap="xs">
            <ThemeIcon size="sm" color="blue" variant="light">
              <IconFile size={14} />
            </ThemeIcon>
            <Button 
              variant="subtle"
              size="xs"
              color="blue"
              leftSection={<IconPaperclip size={14} />}
              rightSection={<IconDownload size={14} />}
              onClick={() => handleFileDownload(fileUrl, fileName)}
              loading={isLoading}
            >
              <Text size="xs" className="truncate" style={{ maxWidth: '200px' }}>
                {fileName}
              </Text>
            </Button>
          </Flex>
        )}
      </Stack>
    );
  }

  // Edit mode
  return (
    <Stack gap="md">
      {/* Image Upload Section */}
      <Card withBorder p="sm" radius="md">
        <Stack gap="xs">
          <Flex align="center" gap="xs">
            <ThemeIcon size="sm" color="blue" variant="light">
              <IconPhoto size={16} />
            </ThemeIcon>
            <Text fw={500} size="sm">Image Upload</Text>
          </Flex>
          
          {imageUrl && !removeImage ? (
            <Box>
              <Flex justify="space-between" align="center" mb="xs">
                <Text size="xs" color="dimmed">Current Image</Text>
                <Button 
                  variant="subtle" 
                  color="red" 
                  size="xs" 
                  onClick={onRemoveImage}
                  leftSection={<IconTrash size={14} />}
                  disabled={disabled}
                >
                  Remove
                </Button>
              </Flex>
              <Image 
                src={getFullImageUrl(imageUrl)} 
                alt="Thumbnail" 
                width={200} 
                height={200} 
                fit="contain" 
                radius="sm"
                className="border"
                mx="auto"
                style={{ width: 200, height: 200, objectFit: 'contain' }}
              />
            </Box>
          ) : (
            <FileInput
              placeholder="Upload a new image"
              accept="image/png,image/jpeg,image/jpg"
              leftSection={<IconUpload size={16} />}
              onChange={onImageChange}
              clearable
              size="xs"
              disabled={disabled}
            />
          )}

          {removeImage && (
            <Text size="xs" color="red" fw={500}>
              Current image will be removed upon saving
            </Text>
          )}
        </Stack>
      </Card>

      {/* File Upload Section */}
      <Card withBorder p="sm" radius="md">
        <Stack gap="xs">
          <Flex align="center" gap="xs">
            <ThemeIcon size="sm" color="blue" variant="light">
              <IconFile size={16} />
            </ThemeIcon>
            <Text fw={500} size="sm">File Attachment</Text>
          </Flex>
          
          {fileUrl && fileName && !removeFile ? (
            <Box>
              <Flex justify="space-between" align="center" wrap="wrap" mb="xs">
                <Text size="xs" color="dimmed" style={{ maxWidth: 'calc(100% - 150px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fileName}
                </Text>
                <Group gap="xs">
                  <Button 
                    size="xs" 
                    variant="light" 
                    color="blue" 
                    onClick={() => handleFileDownload(fileUrl, fileName)}
                    leftSection={<IconDownload size={14} />}
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
                    leftSection={<IconTrash size={14} />}
                    disabled={disabled}
                  >
                    Remove
                  </Button>
                </Group>
              </Flex>
            </Box>
          ) : (
            <FileInput
              placeholder="Upload a new PDF file"
              accept="application/pdf"
              leftSection={<IconUpload size={16} />}
              onChange={onFileChange}
              clearable
              size="xs"
              disabled={disabled}
            />
          )}

          {removeFile && (
            <Text size="xs" color="red" fw={500}>
              Current file will be removed upon saving
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
} 