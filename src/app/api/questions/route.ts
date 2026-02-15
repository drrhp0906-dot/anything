import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Calculate importance score based on repeat count, years, and global importance
function calculateImportanceScore(
  repeatCount: number,
  yearsAppeared: string,
  globalImportance: number
): number {
  const currentYear = new Date().getFullYear();
  
  // Parse years
  const years = yearsAppeared
    .split(',')
    .map(y => parseInt(y.trim(), 10))
    .filter(y => !isNaN(y) && y > 1900 && y <= currentYear);
  
  // Calculate recency score (questions from past 5 years weighted higher)
  const recentYears = years.filter(y => y >= currentYear - 5);
  const recencyScore = recentYears.length * 15; // 15 points per recent appearance
  
  // Calculate frequency score
  const frequencyScore = Math.min(repeatCount * 10, 40); // Max 40 points for frequency
  
  // Global importance weight (0-100 scaled to 0-30 points)
  const globalScore = (globalImportance / 100) * 30;
  
  // Calculate year spread bonus (questions appearing across multiple years)
  const uniqueYears = new Set(years);
  const spreadScore = Math.min(uniqueYears.size * 5, 20); // Max 20 points for spread
  
  // Total score (max possible ~105, normalized to 100)
  const totalScore = Math.min(recencyScore + frequencyScore + globalScore + spreadScore, 100);
  
  return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
}

// GET all questions or questions by marks ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marksId = searchParams.get('marksId');
    const id = searchParams.get('id');
    const subjectId = searchParams.get('subjectId');
    const featured = searchParams.get('featured');

    // Get featured questions for a subject (top 30 by calculated score)
    if (subjectId && featured === 'true') {
      const questions = await db.question.findMany({
        where: {
          marks: {
            system: {
              subjectId: subjectId
            }
          }
        },
        include: {
          marks: {
            select: { 
              id: true, 
              value: true, 
              systemId: true,
              system: {
                select: {
                  name: true,
                  subjectId: true
                }
              }
            }
          },
          _count: {
            select: { files: true }
          }
        },
        orderBy: [
          { calculatedScore: 'desc' },
          { repeatCount: 'desc' }
        ],
        take: 30
      });
      
      return NextResponse.json(questions);
    }

    // Get single question by ID
    if (id) {
      const question = await db.question.findUnique({
        where: { id },
        include: {
          files: true,
          marks: {
            select: { id: true, value: true, systemId: true }
          }
        }
      });

      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(question);
    }

    // Get questions by marks ID
    if (marksId) {
      const questions = await db.question.findMany({
        where: { marksId },
        include: {
          _count: {
            select: { files: true }
          }
        },
        orderBy: [
          { calculatedScore: 'desc' },
          { createdAt: 'desc' }
        ]
      });
      return NextResponse.json(questions);
    }

    // Get all questions with marks info
    const questions = await db.question.findMany({
      include: {
        marks: {
          select: { id: true, value: true, systemId: true }
        },
        _count: {
          select: { files: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST create a new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      content, 
      terminologies, 
      marksId,
      repeatCount = 1,
      yearsAppeared = '',
      globalImportance = 50
    } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Question title is required' },
        { status: 400 }
      );
    }

    if (!marksId || typeof marksId !== 'string') {
      return NextResponse.json(
        { error: 'Marks ID is required' },
        { status: 400 }
      );
    }

    // Check if marks exists
    const marks = await db.marks.findUnique({
      where: { id: marksId }
    });

    if (!marks) {
      return NextResponse.json(
        { error: 'Marks not found' },
        { status: 404 }
      );
    }

    // Calculate importance score
    const calculatedScore = calculateImportanceScore(
      repeatCount,
      yearsAppeared,
      globalImportance
    );

    // Get last appeared year from years string
    const years = yearsAppeared
      .split(',')
      .map(y => parseInt(y.trim(), 10))
      .filter(y => !isNaN(y));
    const lastAppearedYear = years.length > 0 ? Math.max(...years) : null;

    const question = await db.question.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        terminologies: terminologies?.trim() || null,
        marksId,
        repeatCount,
        yearsAppeared,
        lastAppearedYear,
        globalImportance,
        calculatedScore
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

// PUT update a question
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      title, 
      content, 
      terminologies,
      repeatCount,
      yearsAppeared,
      globalImportance
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const existingQuestion = await db.question.findUnique({
      where: { id }
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content?.trim() || null;
    if (terminologies !== undefined) updateData.terminologies = terminologies?.trim() || null;
    
    if (repeatCount !== undefined) updateData.repeatCount = repeatCount;
    if (yearsAppeared !== undefined) {
      updateData.yearsAppeared = yearsAppeared;
      // Update last appeared year
      const years = yearsAppeared
        .split(',')
        .map((y: string) => parseInt(y.trim(), 10))
        .filter((y: number) => !isNaN(y));
      updateData.lastAppearedYear = years.length > 0 ? Math.max(...years) : null;
    }
    if (globalImportance !== undefined) updateData.globalImportance = globalImportance;

    // Recalculate importance score if relevant fields changed
    if (repeatCount !== undefined || yearsAppeared !== undefined || globalImportance !== undefined) {
      updateData.calculatedScore = calculateImportanceScore(
        repeatCount ?? existingQuestion.repeatCount,
        yearsAppeared ?? existingQuestion.yearsAppeared,
        globalImportance ?? existingQuestion.globalImportance
      );
    }

    const question = await db.question.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE a question by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await db.question.findUnique({
      where: { id },
      include: { files: true }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Delete associated files from filesystem
    for (const file of question.files) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Delete the question (cascade delete will handle files in DB)
    await db.question.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
