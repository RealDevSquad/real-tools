import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Combine multiple PDF files into one PDF
 */
export async function combinePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Remove specific pages from a PDF
 * @param file - The PDF file
 * @param pagesToRemove - Array of page numbers to remove (1-indexed)
 * @returns New PDF blob with pages removed
 */
export async function removePagesFromPDF(file: File, pagesToRemove: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  // Convert 1-indexed to 0-indexed and filter valid pages
  const pagesToRemoveIndexed = pagesToRemove
    .map(page => page - 1)
    .filter(index => index >= 0 && index < totalPages);
  
  // Create new PDF with remaining pages
  const newPdf = await PDFDocument.create();
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i)
    .filter(index => !pagesToRemoveIndexed.includes(index));
  
  const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Extract specific pages from a PDF
 * @param file - The PDF file
 * @param pagesToExtract - Array of page numbers to extract (1-indexed)
 * @returns New PDF blob with extracted pages
 */
export async function extractPagesFromPDF(file: File, pagesToExtract: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();
  
  // Convert 1-indexed to 0-indexed and filter valid pages
  const pagesToExtractIndexed = pagesToExtract
    .map(page => page - 1)
    .filter(index => index >= 0 && index < totalPages)
    .sort((a, b) => a - b); // Sort to maintain page order
  
  // Create new PDF with extracted pages
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdf, pagesToExtractIndexed);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Get page count of a PDF
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}

export interface TextAnnotation {
  page: number; // 1-indexed
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
}

/**
 * Add text annotations/overlays to a PDF
 * This allows "editing" text by adding new text over existing content
 */
export async function addTextToPDF(file: File, annotations: TextAnnotation[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  
  annotations.forEach((annotation) => {
    const page = pdf.getPage(annotation.page - 1); // Convert to 0-indexed
    const { height } = page.getSize();
    
    // Convert Y coordinate (PDF uses bottom-left origin, we use top-left)
    const pdfY = height - annotation.y;
    
    page.drawText(annotation.text, {
      x: annotation.x,
      y: pdfY,
      size: annotation.fontSize || 12,
      font: helvetica,
      color: annotation.color ? rgb(annotation.color.r, annotation.color.g, annotation.color.b) : rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}
