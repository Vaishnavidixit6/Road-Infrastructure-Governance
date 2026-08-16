// app/api/projects/route.js
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

// Ensure file exists with default data
async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath);
  } catch (error) {
    // Create default projects data if file doesn't exist
    const defaultProjects = [
      {
        "id": "1",
        "name": "NH-48, Mumbai",
        "contractor": "ABC Ltd.",
        "status": "In Progress",
        "expectedCompletion": "2023-08-21"
      },
      {
        "id": "2",
        "name": "LBS Marg, Delhi",
        "contractor": "XYZ Pvt Ltd.",
        "status": "In Progress",
        "expectedCompletion": "2023-08-21"
      },
      {
        "id": "3",
        "name": "Shivajinagar, Pune",
        "contractor": "PQR Builders",
        "status": "Delayed",
        "expectedCompletion": "2023-08-30"
      }
    ];
    await fs.writeFile(filePath, JSON.stringify(defaultProjects, null, 2));
  }
}

// GET - Fetch all projects
export async function GET() {
  try {
    await ensureDirectoryExists(dataDirectory);
    const filePath = path.join(dataDirectory, 'projects.json');
    await ensureFileExists(filePath);
    
    const fileContents = await fs.readFile(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return new Response(JSON.stringify({ error: 'Unable to read projects data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST - Create new project or update existing project
export async function POST(request) {
  try {
    await ensureDirectoryExists(dataDirectory);
    const filePath = path.join(dataDirectory, 'projects.json');
    await ensureFileExists(filePath);
    
    const requestData = await request.json();
    const { action, id, updates, newProject } = requestData;
    
    // Read existing projects
    const fileContents = await fs.readFile(filePath, 'utf8');
    let projects = JSON.parse(fileContents);
    
    if (action === 'update' && id) {
      // Update existing project
      const projectIndex = projects.findIndex(project => project.id === id);
      
      if (projectIndex === -1) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Update the project
      projects[projectIndex] = { ...projects[projectIndex], ...updates };
      
      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        project: projects[projectIndex],
        action: 'update'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } 
    else if (action === 'create' && newProject) {
      // Create new project
      const newProjectWithId = {
        ...newProject,
        id: Date.now().toString(), // Simple ID generation
      };
      
      projects.push(newProjectWithId);
      
      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        project: newProjectWithId,
        action: 'create'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } 
    else {
      return new Response(JSON.stringify({ error: 'Invalid action or missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error processing project request:', error);
    return new Response(JSON.stringify({ error: 'Unable to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT - Alternative method for updates
export async function PUT(request) {
  try {
    await ensureDirectoryExists(dataDirectory);
    const filePath = path.join(dataDirectory, 'projects.json');
    await ensureFileExists(filePath);
    
    const { id, updates } = await request.json();
    
    // Read existing projects
    const fileContents = await fs.readFile(filePath, 'utf8');
    let projects = JSON.parse(fileContents);
    
    const projectIndex = projects.findIndex(project => project.id === id);
    
    if (projectIndex === -1) {
      return new Response(JSON.stringify({ error: 'Project not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Update the project
    projects[projectIndex] = { ...projects[projectIndex], ...updates };
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
    
    return new Response(JSON.stringify({ 
      success: true, 
      project: projects[projectIndex] 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({ error: 'Unable to update project' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}