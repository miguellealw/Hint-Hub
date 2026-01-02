import jsPDF from 'jspdf';
import { convert } from 'html-to-text';
import type { Hint } from '@prisma/client';

interface ExportToPDFOptions {
  collectionName: string;
  hints: Hint[];
  userName?: string | null;
}

export const exportCollectionToPDF = ({ collectionName, hints, userName }: ExportToPDFOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with automatic page breaks
  const addTextWithPageBreak = (text: string, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    const lines = doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5; // Line height
    }
  };

  // Add collection title
  addTextWithPageBreak(collectionName, 20, true);
  yPosition += 5;

  // Add created by user name
  if (userName) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Created by ${userName}`, margin, yPosition);
    yPosition += 15;
    doc.setTextColor(0);
  } else {
    yPosition += 10;
  }

  // Add each hint
  hints.forEach((hint, index) => {
    // Check if we need a new page before adding a hint
    if (yPosition > pageHeight - margin - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Add separator line
    if (index > 0) {
      doc.setDrawColor(200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }

    // Add hint title
    addTextWithPageBreak(`${index + 1}. ${hint.title}`, 14, true);
    yPosition += 5;

    // Convert HTML content to plain text and add it
    const plainTextContent = convert(hint.content, {
      wordwrap: 80,
      preserveNewlines: true,
    });

    addTextWithPageBreak(plainTextContent, 11, false);
    yPosition += 10;
  });

  // Add footer on the last page
  const totalPages = doc.getNumberOfPages();
  doc.setPage(totalPages);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100);
  const footerText = 'Created from Hint Hub';
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 15);

  // Save the PDF
  const fileName = `${collectionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_hints.pdf`;
  doc.save(fileName);
};
