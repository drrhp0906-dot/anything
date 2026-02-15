import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Allowed file types
const ALLOWED_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/gif': ['.gif'],
};

// GET files by question ID, folder ID, or download a file
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const folderId = searchParams.get('folderId');
    const id = searchParams.get('id');
    const download = searchParams.get('download');

    // Download a specific file
    if (id && download === 'true') {
      const file = await db.file.findUnique({
        where: { id }
      });

      if (!file) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }

      if (!fs.existsSync(file.path)) {
        return NextResponse.json(
          { error: 'File not found on disk' },
          { status: 404 }
        );
      }

      const fileBuffer = fs.readFileSync(file.path);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': file.mimeType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
          'Content-Length': file.size.toString()
        }
      });
    }

    // Get single file info
    if (id) {
      const file = await db.file.findUnique({
        where: { id },
        include: {
          folder: {
            select: { id: true, name: true }
          }
        }
      });

      if (!file) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(file);
    }

    // Get files by folder ID
    if (folderId) {
      const files = await db.file.findMany({
        where: { folderId },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(files);
    }

    // Get files by question ID (can filter by root files or all files)
    if (questionId) {
      const rootOnly = searchParams.get('rootOnly') === 'true';
      
      const whereClause: { questionId: string; folderId?: null } = { questionId };
      if (rootOnly) {
        whereClause.folderId = null;
      }
      
      const files = await db.file.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(files);
    }

    // Get all files
    const files = await db.file.findMany({
      include: {
        question: {
          select: { id: true, title: true }
        },
        folder: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// POST upload a file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const questionId = formData.get('questionId') as string | null;
    const folderId = formData.get('folderId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await db.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // If folderId provided, check if folder exists and belongs to this question
    if (folderId) {
      const folder = await db.folder.findUnique({
        where: { id: folderId }
      });

      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        );
      }

      if (folder.questionId !== questionId) {
        return NextResponse.json(
          { error: 'Folder does not belong to this question' },
          { status: 400 }
        );
      }
    }

    // Validate file type
    const allowedMimeTypes = Object.keys(ALLOWED_TYPES);
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Allowed types: PDF, DOCX, images (PNG, JPG, JPEG, GIF), PPT/PPTX` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.name);
    const uniqueFileName = `${timestamp}-${randomString}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Save file metadata to database
    const fileRecord = await db.file.create({
      data: {
        name: uniqueFileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: filePath,
        questionId,
        folderId: folderId || null
      }
    });

    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// PUT update a file (move to folder)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, folderId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const existingFile = await db.file.findUnique({
      where: { id }
    });

    if (!existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // If folderId is provided, verify it exists and belongs to same question
    if (folderId !== undefined && folderId !== null) {
      const folder = await db.folder.findUnique({
        where: { id: folderId }
      });

      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        );
      }

      if (folder.questionId !== existingFile.questionId) {
        return NextResponse.json(
          { error: 'Folder does not belong to this question' },
          { status: 400 }
        );
      }
    }

    const updatedFile = await db.file.update({
      where: { id },
      data: {
        folderId: folderId === 'null' ? null : folderId
      }
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}

// DELETE a file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Get file info
    const file = await db.file.findUnique({
      where: { id }
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete file record from database
    await db.file.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
