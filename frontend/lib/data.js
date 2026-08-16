// lib/data.js
import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

// Helper function to read JSON files
function readJSONFile(filename) {
  const filePath = path.join(dataDirectory, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper function to write JSON files
function writeJSONFile(filename, data) {
  const filePath = path.join(dataDirectory, filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Projects data functions
export function getProjects() {
  return readJSONFile('projects.json');
}

export function addProject(project) {
  const projects = getProjects();
  projects.push(project);
  writeJSONFile('projects.json', projects);
  return project;
}

export function updateProject(projectId, updates) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    writeJSONFile('projects.json', projects);
    return projects[index];
  }
  return null;
}

// Complaints data functions
export function getComplaints() {
  return readJSONFile('complaints.json');
}

export function getComplaint(id) {
  const complaints = getComplaints();
  return complaints.find(c => c.id === id);
}

export function addComplaint(complaint) {
  const complaints = getComplaints();
  complaints.push(complaint);
  writeJSONFile('complaints.json', complaints);
  return complaint;
}

export function updateComplaint(complaintId, updates) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    complaints[index] = { ...complaints[index], ...updates };
    writeJSONFile('complaints.json', complaints);
    return complaints[index];
  }
  return null;
}