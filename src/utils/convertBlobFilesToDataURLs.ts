import type { FileUIPart } from 'ai';

/**
 * Converts FileUIPart array with blob URLs to data URLs
 */
export async function convertBlobFilesToDataURLs(
  files: FileUIPart[],
): Promise<FileUIPart[]> {
  return Promise.all(
    files.map(async (file) => {
      if (file.url.startsWith('blob:')) {
        const dataUrl = await blobToDataURL(file.url);
        return { ...file, url: dataUrl };
      }
      return file;
    }),
  );
}

/**
 * Converts a blob URL to a data URL
 */
async function blobToDataURL(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
