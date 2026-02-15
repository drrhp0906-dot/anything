import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all systems or systems by subject ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (subjectId) {
      const systems = await db.system.findMany({
        where: { subjectId },
        include: {
          _count: {
            select: { marks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(systems);
    }

    // Get all systems with subject info
    const systems = await db.system.findMany({
      include: {
        subject: {
          select: { id: true, name: true }
        },
        _count: {
          select: { marks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(systems);
  } catch (error) {
    console.error('Error fetching systems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch systems' },
      { status: 500 }
    );
  }
}

// POST create a new system
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, subjectId } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'System name is required' },
        { status: 400 }
      );
    }

    if (!subjectId || typeof subjectId !== 'string') {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    // Check if subject exists
    const subject = await db.subject.findUnique({
      where: { id: subjectId }
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    const system = await db.system.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        subjectId
      }
    });

    return NextResponse.json(system, { status: 201 });
  } catch (error) {
    console.error('Error creating system:', error);
    return NextResponse.json(
      { error: 'Failed to create system' },
      { status: 500 }
    );
  }
}

// DELETE a system by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'System ID is required' },
        { status: 400 }
      );
    }

    // Check if system exists
    const system = await db.system.findUnique({
      where: { id }
    });

    if (!system) {
      return NextResponse.json(
        { error: 'System not found' },
        { status: 404 }
      );
    }

    // Delete the system (cascade delete will handle related data)
    await db.system.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'System deleted successfully' });
  } catch (error) {
    console.error('Error deleting system:', error);
    return NextResponse.json(
      { error: 'Failed to delete system' },
      { status: 500 }
    );
  }
}
