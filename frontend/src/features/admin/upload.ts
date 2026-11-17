import { MAX_IMAGE_BYTES, type AllowedImageType } from '@jomel/shared';
import { signImageUpload } from './api';

const MAX_DIMENSION = 1920;
/** Raw files above this are rejected before decoding (protects the tab's memory). */
const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

export interface CompressedImage {
  blob: Blob;
  type: AllowedImageType;
  width: number;
  height: number;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Downscales to ≤ 1920px on the long edge and re-encodes to WebP (JPEG where the browser
 * cannot encode WebP), stepping quality down until the file fits under 5 MB.
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > MAX_SOURCE_BYTES)
    throw new Error('That image is too large (max 30 MB before compression).');

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('This image format could not be read by your browser.');
  });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image processing is not available in this browser.');
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const type of ['image/webp', 'image/jpeg'] as const) {
    for (const quality of [0.86, 0.78, 0.68, 0.58]) {
      const blob = await canvasToBlob(canvas, type, quality);
      // Browsers that can't encode WebP silently return PNG — skip to JPEG in that case.
      if (!blob || blob.type !== type) break;
      if (blob.size <= MAX_IMAGE_BYTES) return { blob, type, width, height };
    }
  }
  throw new Error('The image is still larger than 5 MB after compression. Try a smaller image.');
}

/**
 * Gets a signed upload URL from the API (server picks the object name), then PUTs the file
 * straight to Supabase Storage with progress reporting. Returns the storage path.
 */
export async function uploadProjectImage(
  image: CompressedImage,
  onProgress: (fraction: number) => void,
  signal?: AbortSignal,
): Promise<{ path: string; publicUrl: string }> {
  const signed = await signImageUpload({ contentType: image.type, size: image.blob.size });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signed.signedUrl);
    xhr.setRequestHeader('Content-Type', image.type);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', 'max-age=31536000');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () => reject(new Error('Upload failed — check your connection.'));
    xhr.onabort = () => reject(new DOMException('Upload cancelled', 'AbortError'));
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(image.blob);
  });

  onProgress(1);
  return { path: signed.path, publicUrl: signed.publicUrl };
}
