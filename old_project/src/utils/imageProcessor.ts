/**
 * Removes metadata from an image file by re-encoding it via Canvas.
 * This process strips Exif, IPTC, and XMP data.
 */
export async function removeMetadata(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Create an offscreen canvas (or regular canvas)
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw the image onto the fresh canvas
      ctx.drawImage(img, 0, 0);

      // Export as a new Blob. Defaults to image/png or image/jpeg based on input if possible,
      // but let's stick to the original type or default to PNG if not supported.
      const mimeType = file.type === "image/jpeg" ? "image/jpeg" : "image/png";

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        mimeType,
        0.95, // High quality for JPEGs
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
