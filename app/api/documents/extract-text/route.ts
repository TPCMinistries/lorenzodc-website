import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, fileType } = await request.json();

    if (!fileUrl || !fileType) {
      return NextResponse.json(
        { error: 'File URL and type are required' },
        { status: 400 }
      );
    }

    // Download the file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error('Failed to download file');
    }

    const buffer = await fileResponse.arrayBuffer();
    let extractedText = '';

    switch (fileType.toLowerCase()) {
      case 'txt':
      case 'md':
        extractedText = new TextDecoder().decode(buffer);
        break;

      case 'pdf':
        // For PDF extraction, we'll use a simple approach
        // In production, you'd use pdf-parse or similar
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(buffer);
          extractedText = data.text;
        } catch (error) {
          // Fallback: return a placeholder for now
          extractedText = 'PDF text extraction not yet implemented. Please use .txt or .md files for now.';
        }
        break;

      case 'docx':
        // For DOCX extraction, we'll use mammoth
        try {
          const mammoth = require('mammoth');
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value;
        } catch (error) {
          // Fallback: return a placeholder for now
          extractedText = 'DOCX text extraction not yet implemented. Please use .txt or .md files for now.';
        }
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported file type: ${fileType}` },
          { status: 400 }
        );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: extractedText });

  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from document' },
      { status: 500 }
    );
  }
}