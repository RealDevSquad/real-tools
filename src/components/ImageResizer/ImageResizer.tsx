import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPhoto, IconDownload } from '@tabler/icons-react';
import { FileUpload } from '../ui/file-upload';
import { useToast } from '../ui/toast';

export const ImageResizer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResizedUrl(null);
      const img = new Image();
      img.onload = () => {
        if (!width) setWidth(img.width);
        if (!height) setHeight(img.height);
      };
      img.src = URL.createObjectURL(files[0]);
    }
  };

  const handleResize = () => {
    if (!file || !width || !height) {
      showToast('Please select an image and set dimensions', 'error');
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(width);
      canvas.height = Number(height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, Number(width), Number(height));
        canvas.toBlob((blob) => {
          if (blob) {
            setResizedUrl(URL.createObjectURL(blob));
            showToast('Image resized successfully');
          }
        }, file.type);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!resizedUrl) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `resized_${file?.name || 'image'}`;
    a.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <IconPhoto className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Image Resizer
          </h1>
          <p className="text-muted-foreground">Resize images to specific dimensions</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-6">
          {!file ? (
            <FileUpload onChange={handleFileSelect} isProcessing={false} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setWidth(val);
                      if (maintainAspect && val && file) {
                        const img = new Image();
                        img.onload = () => {
                          const ratio = img.width / img.height;
                          setHeight(Math.round(Number(val) / ratio));
                        };
                        img.src = URL.createObjectURL(file);
                      }
                    }}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setHeight(val);
                      if (maintainAspect && val && file) {
                        const img = new Image();
                        img.onload = () => {
                          const ratio = img.width / img.height;
                          setWidth(Math.round(Number(val) * ratio));
                        };
                        img.src = URL.createObjectURL(file);
                      }
                    }}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Maintain aspect ratio</span>
              </label>

              <button
                onClick={handleResize}
                disabled={!width || !height}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Resize Image
              </button>

              {resizedUrl && (
                <div className="space-y-4">
                  <img src={resizedUrl} alt="Resized" className="w-full rounded-lg border border-border" />
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <IconDownload className="w-5 h-5" />
                    Download Resized Image
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
