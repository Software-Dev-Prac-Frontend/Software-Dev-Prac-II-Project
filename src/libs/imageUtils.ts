/**
 * Converts Google Drive sharing URL to direct download URL
 * From: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * To: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com')) {
    // Extract file ID from the URL
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  return url;
}

/**
 * Check if URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}
