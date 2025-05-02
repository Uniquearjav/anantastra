'use client'

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export default function SVGConverter() {
  const [svgContent, setSvgContent] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('svg')) {
      setError('Please upload an SVG file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setSvgContent(content);
      
      // Create SVG preview
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const objectUrl = URL.createObjectURL(blob);
      setPreviewSrc(objectUrl);
      
      // Extract dimensions from SVG
      extractSvgDimensions(content);
      setError('');
    };
    reader.readAsText(file);
  };

  const extractSvgDimensions = (svgContent) => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      if (svgElement) {
        let width = svgElement.getAttribute('width');
        let height = svgElement.getAttribute('height');
        
        // If width/height aren't explicit attributes, try viewBox
        if (!width || !height) {
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            width = width || vbWidth;
            height = height || vbHeight;
          }
        }
        
        // Remove px, pt, etc. if present
        width = parseFloat(width);
        height = parseFloat(height);
        
        setSvgDimensions({
          width: isNaN(width) ? 300 : width,
          height: isNaN(height) ? 300 : height
        });
      }
    } catch (err) {
      console.error("Error parsing SVG dimensions:", err);
      setSvgDimensions({ width: 300, height: 300 });
    }
  };

  const convertSvgToImage = () => {
    if (!svgContent) {
      setError('Please upload an SVG file first');
      return;
    }

    try {
      setError('');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size based on SVG dimensions and scale
      const width = svgDimensions.width * scale;
      const height = svgDimensions.height * scale;
      canvas.width = width;
      canvas.height = height;
      
      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to desired format
        let mimeType;
        let fileExtension;
        
        switch (outputFormat) {
          case 'png':
            mimeType = 'image/png';
            fileExtension = 'png';
            break;
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            fileExtension = 'jpg';
            break;
          case 'webp':
            mimeType = 'image/webp';
            fileExtension = 'webp';
            break;
          default:
            mimeType = 'image/png';
            fileExtension = 'png';
        }
        
        // Generate image data URL
        const dataURL = canvas.toDataURL(mimeType, quality / 100);
        
        // Create download link
        const link = downloadLinkRef.current;
        link.href = dataURL;
        link.download = `converted-image.${fileExtension}`;
        link.click();
      };
      
      // Set source of image to SVG content
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(blob);
    } catch (err) {
      setError('Error converting image: ' + err.message);
      console.error('Conversion error:', err);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let foundSvg = false;
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            const blob = await clipboardItem.getType('text/plain');
            const text = await blob.text();
            
            // Very basic check if text looks like SVG
            if (text.trim().startsWith('<svg') || text.includes('xmlns="http://www.w3.org/2000/svg"')) {
              setSvgContent(text);
              
              // Create SVG preview
              const svgBlob = new Blob([text], { type: 'image/svg+xml' });
              const objectUrl = URL.createObjectURL(svgBlob);
              setPreviewSrc(objectUrl);
              
              extractSvgDimensions(text);
              setError('');
              foundSvg = true;
              break;
            }
          }
        }
        if (foundSvg) break;
      }
      
      if (!foundSvg) {
        setError('No SVG content found in clipboard');
      }
    } catch (err) {
      setError('Failed to access clipboard: ' + err.message);
      console.error('Clipboard error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">SVG Converter</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Convert your SVG files to PNG, JPEG, or WebP format with customizable quality and size.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload SVG File
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="flex-1"
              />
              <Button 
                onClick={handlePaste} 
                variant="outline" 
                className="whitespace-nowrap"
              >
                Paste from Clipboard
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {previewSrc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <img 
                  src={previewSrc} 
                  alt="SVG Preview" 
                  className="max-w-full max-h-80 object-contain" 
                />
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Dimensions: {svgDimensions.width} x {svgDimensions.height}px
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <div className="flex flex-wrap gap-2">
                {['png', 'jpg', 'webp'].map(format => (
                  <Button
                    key={format}
                    onClick={() => setOutputFormat(format)}
                    variant={outputFormat === format ? 'default' : 'outline'}
                    className="uppercase"
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {quality}%
              </label>
              <Slider
                defaultValue={[90]}
                min={10}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={values => setQuality(values[0])}
                disabled={outputFormat === 'png'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scale: {scale.toFixed(1)}x
            </label>
            <Slider
              defaultValue={[1]}
              min={0.1}
              max={5}
              step={0.1}
              value={[scale]}
              onValueChange={values => setScale(values[0])}
            />
          </div>

          <Button 
            onClick={convertSvgToImage} 
            className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            disabled={!svgContent}
          >
            Convert & Download
          </Button>
        </div>
      </div>

      {/* Hidden canvas for image conversion */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <a ref={downloadLinkRef} style={{ display: 'none' }} />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How to Use</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Upload an SVG file using the file input or paste from clipboard</li>
          <li>Select your desired output format (PNG, JPG, WebP)</li>
          <li>Adjust the quality (for JPG and WebP) and scale as needed</li>
          <li>Click the "Convert & Download" button to process and download your converted image</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">About This Tool</h2>
        <div className="prose prose-blue dark:prose-invert">
          <p>
            This SVG converter allows you to transform vector SVG files into raster image formats.
            The conversion happens entirely in your browser - your files are never uploaded to any server,
            ensuring your data remains private.
          </p>
          <h3>Features</h3>
          <ul>
            <li>Convert SVG to PNG, JPG/JPEG, or WebP format</li>
            <li>Adjust output quality for JPG and WebP</li>
            <li>Scale the output image up or down</li>
            <li>Private, browser-based conversion (no server uploads)</li>
            <li>Support for clipboard pasting</li>
          </ul>
          <h3>When to Use</h3>
          <ul>
            <li>When you need to use SVG content in applications that don't support SVG</li>
            <li>For creating raster versions of logos or icons</li>
            <li>When sharing images with people who might not have SVG viewers</li>
            <li>For using vector graphics in documents or presentations that require raster formats</li>
          </ul>
        </div>
      </div>
    </div>
  );
}