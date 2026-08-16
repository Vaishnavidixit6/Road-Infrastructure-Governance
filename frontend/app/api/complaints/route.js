// app/api/complaints/route.js
import { promises as fs } from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

// Ensure directory exists
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Ensure file exists with empty array
async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
}

// GET - Fetch all complaints
export async function GET() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const filePath = path.join(dataDirectory, 'complaints.json');
    await ensureFileExists(filePath);
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    const complaints = JSON.parse(fileContents);
    
    return new Response(JSON.stringify(complaints), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading complaints:', error);
    return new Response(JSON.stringify({ error: 'Unable to read complaints data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST - Create new complaint or update existing complaint
export async function POST(request) {
  try {
    await ensureDirectoryExists(dataDirectory);
    const filePath = path.join(dataDirectory, 'complaints.json');
    await ensureFileExists(filePath);
    
    const requestData = await request.json();
    const { action, id, updates, ...complaintData } = requestData;
    
    // Read existing complaints
    const fileContents = await fs.readFile(filePath, 'utf8');
    let complaints = JSON.parse(fileContents);
    
    if (action === 'update' && id) {
      // Update existing complaint
      const complaintIndex = complaints.findIndex(complaint => complaint.id === id);
      
      if (complaintIndex === -1) {
        return new Response(JSON.stringify({ error: 'Complaint not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Update the complaint
      complaints[complaintIndex] = { ...complaints[complaintIndex], ...updates };
      
      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(complaints, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        complaint: complaints[complaintIndex],
        action: 'update'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } 
    else if (!action) {
      // Create new complaint (from public form)
      const year = new Date().getFullYear();
      const nextId = complaints.length + 1;
      const requestId = `R${year}-${String(nextId).padStart(4, '0')}`;
      
      const currentDate = new Date().toISOString().split('T')[0];
      
      const complaintToAdd = {
        id: requestId,
        date: currentDate,
        status: 'Received',
        timeline: [
          { 
            date: currentDate, 
            status: 'Received', 
            description: 'Complaint registered' 
          }
        ],
        details: complaintData.description || '',
        name: complaintData.name || '',
        email: complaintData.email || '',
        phone: complaintData.phone || '',
        location: complaintData.location || ''
      };
      
      complaints.push(complaintToAdd);
      
      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(complaints, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        requestId,
        complaint: complaintToAdd 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } 
    else {
      return new Response(JSON.stringify({ error: 'Invalid action or missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error processing complaint request:', error);
    return new Response(JSON.stringify({ error: 'Unable to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}