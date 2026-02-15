import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all marks or marks by system ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const systemId = searchParams.get('systemId');
    const id = searchParams.get('id');

    // Get single marks by ID
    if (id) {
      const marks = await db.marks.findUnique({
        where: { id },
        include: {
          system: {
            select: { id: true, name: true }
          },
          _count: {
            select: { questions: true }
          }
        }
      });

      if (!marks) {
        return NextResponse.json(
          { error: 'Marks not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(marks);
    }

    // Get marks by system ID
    if (systemId) {
      const marks = await db.marks.findMany({
        where: { systemId },
        include: {
          _count: {
            select: { questions: true }
          }
        },
        orderBy: { value: 'asc' }
      });
      return NextResponse.json(marks);
    }

    // Get all marks with system info
    const marks = await db.marks.findMany({
      include: {
        system: {
          select: { id: true, name: true, subjectId: true }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: [
        { value: 'asc' }
      ]
    });

    return NextResponse.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marks' },
      { status: 500 }
    );
  }
}

// POST create new marks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, description, systemId } = body;

    if (value === undefined || value === null || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Marks value is required and must be a number' },
        { status: 400 }
      );
    }

    if (!systemId || typeof systemId !== 'string') {
      return NextResponse.json(
        { error: 'System ID is required' },
        { status: 400 }
      );
    }

    // Check if system exists
    const system = await db.system.findUnique({
      where: { id: systemId }
    });

    if (!system) {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    // Check if marks with this value already exists for this system
    const existingMarks = await db.marks.findFirst({
      where: { systemId, value }
    });

    if (existingMarks) {
      return NextResponse.json(
        { error: `Marks with value ${value} already exists for this system` },
        { status: 400 }
      );
    }

    const marks = await db.marks.create({
      data: {
        value,
        description: description?.trim() || null,
        systemId
      },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    return NextResponse.json(marks, { status: 201 });
  } catch (error) {
    console.error('Error creating marks:', error);
    return NextResponse.json(
      { error: 'Failed to create marks' },
      { status: 500 }
    );
  }
}

// PUT update marks
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, value, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Marks ID is required' },
        { status: 400 }
      );
    }

    const existingMarks = await db.marks.findUnique({
      where: { id }
    });

    if (!existingMarks) {
      return NextResponse.json(
        { error: 'Marks not found' },
        { status: 404 }
      );
    }

    // If value is being changed, check for duplicates
    if (value !== undefined && value !== existingMarks.value) {
      const duplicate = await db.marks.findFirst({
        where: { 
          systemId: existingMarks.systemId,
          value,
          id: { not: id }
        }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `Marks with value ${value} already exists for this system` },
          { status: 400 }
        );
      }
    }

    const marks = await db.marks.update({
      where: { id },
      data: {
        value: value !== undefined ? value : existingMarks.value,
        description: description !== undefined ? (description?.trim() || null) : existingMarks.description
      }
    });

    return NextResponse.json(marks);
  } catch (error) {
    console.error('Error updating marks:', error);
    return NextResponse.json(
      { error: 'Failed to update marks' },
      { status: 500 }
    );
  }
}

// DELETE marks by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Marks ID is required' },
        { status: 400 }
      );
    }

    // Check if marks exists
    const marks = await db.marks.findUnique({
      where: { id }
    });

    if (!marks) {
      return NextResponse.json(
        { error: 'Marks not found' },
        { status: 404 }
      );
    }

    // Delete the marks (cascade delete will handle related questions and files)
    await db.marks.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Marks deleted successfully' });
  } catch (error) {
    console.error('Error deleting marks:', error);
    return NextResponse.json(
      { error: 'Failed to delete marks' },
      { status: 500 }
    );
  }
}
