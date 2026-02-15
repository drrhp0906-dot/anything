import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Simple initialization data
const SUBJECTS_DATA = [
  {
    name: "Pathology",
    description: "Study of disease processes, their causes, and effects on the body"
  },
  {
    name: "Pharmacology", 
    description: "Study of drugs, their actions, uses, and adverse effects"
  },
  {
    name: "Microbiology",
    description: "Study of microorganisms causing human diseases"
  }
];

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return;
  
  try {
    // Ensure directories exist
    const dbDir = path.join(process.cwd(), 'db');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const backupsDir = path.join(process.cwd(), 'backups');
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    // Check if database has data
    const count = await prisma.subject.count();
    
    if (count === 0) {
      console.log('Database is empty. Initializing with default subjects...');
      
      for (const subject of SUBJECTS_DATA) {
        await prisma.subject.create({
          data: subject
        });
      }
      
      console.log('Database initialized with default subjects');
    }
    
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw - let the app continue
  }
}

export { prisma };
