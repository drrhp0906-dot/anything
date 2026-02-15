import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all folders or folders by question ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    const id = searchParams.get('id');

    // Get single folder by ID
    if (id) {
      const folder = await db.folder.findUnique({
        where: { id },
        include: {
          files: true,
          question: {
            select: { id: true, title: true }
          },
          _count: {
            select: { files: true }
          }
        }
      });

      if (!folder) {
        return NextResponse.json(
          { error: 'Folder not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(folder);
    }

    // Get folders by question ID
    if (questionId) {
      const folders = await db.folder.findMany({
        where: { questionId },
        include: {
          _count: {
            select: { files: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json(folders);
    }

    // Get all folders
    const folders = await db.folder.findMany({
      include: {
        question: {
          select: { id: true, title: true }
        },
        _count: {
          select: { files: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

// POST create a new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon, questionId } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    if (!questionId || typeof questionId !== 'string') {
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

    // Check if folder with same name already exists for this question
    const existingFolder = await db.folder.findFirst({
      where: { questionId, name: name.trim() }
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: 'A folder with this name already exists for this question' },
        { status: 400 }
      );
    }

    const folder = await db.folder.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || 'blue',
        icon: icon || 'folder',
        questionId
      },
      include: {
        _count: {
          select: { files: true }
        }
      }
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}

// PUT update a folder
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color, icon } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    const existingFolder = await db.folder.findUnique({
      where: { id }
    });

    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // If name is being changed, check for duplicates
    if (name && name !== existingFolder.name) {
      const duplicate = await db.folder.findFirst({
        where: { 
          questionId: existingFolder.questionId,
          name: name.trim(),
          id: { not: id }
        }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'A folder with this name already exists for this question' },
          { status: 400 }
        );
      }
    }

    const folder = await db.folder.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existingFolder.name,
        description: description !== undefined ? (description?.trim() || null) : existingFolder.description,
        color: color || existingFolder.color,
        icon: icon || existingFolder.icon
      }
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    );
  }
}

// DELETE a folder by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    // Check if folder exists
    const folder = await db.folder.findUnique({
      where: { id },
      include: { files: true }
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Delete associated files from filesystem
    for (const file of folder.files) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Delete the folder (cascade delete will handle files in DB)
    await db.folder.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    );
  }
}
