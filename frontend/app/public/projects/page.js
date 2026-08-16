// app/(public)/projects/page.js
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const projectsData = await response.json();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <header className="header">
          <div className="container header-content">
            <div className="logo">ROADCHAIN</div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/complaints">File Complaint</Link>
              <Link href="/complaints/R2025-0182">Track Complaint</Link>
              <Link href="/admin/login">Admin Login</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <h1 style={{margin: '2rem 0'}}>Road Projects</h1>
          <div style={{textAlign: 'center', padding: '2rem'}}>Loading projects...</div>
        </main>

        <footer className="footer">
          <div className="container footer-content">
            <div className="logo">ROADCHAIN</div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/complaints">File Complaint</Link>
              <Link href="/complaints/R2025-0182">Track Complaint</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="header">
          <div className="container header-content">
            <div className="logo">ROADCHAIN</div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/complaints">File Complaint</Link>
              <Link href="/complaints/R2025-0182">Track Complaint</Link>
              <Link href="/admin/login">Admin Login</Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <h1 style={{margin: '2rem 0'}}>Road Projects</h1>
          <div style={{textAlign: 'center', padding: '2rem', color: 'red'}}>
            {error}
            <button 
              onClick={fetchProjects} 
              style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
              className="btn"
            >
              Try Again
            </button>
          </div>
        </main>

        <footer className="footer">
          <div className="container footer-content">
            <div className="logo">ROADCHAIN</div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/complaints">File Complaint</Link>
              <Link href="/complaints/R2025-0182">Track Complaint</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">ROADCHAIN</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/complaints">File Complaint</Link>
            <Link href="/complaints/R2025-0182">Track Complaint</Link>
            <Link href="/admin/login">Admin Login</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <h1 style={{margin: '2rem 0'}}>Road Projects</h1>
        
        {projects.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            No projects found.
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Contractor</th>
                  <th>Status</th>
                  <th>Expected Completion</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.contractor}</td>
                    <td>
                      <span className={`status-badge status-${project.status?.toLowerCase().replace(' ', '-') || 'planning'}`}>
                        {project.status || 'Planning'}
                      </span>
                    </td>
                    <td>
                      {project.expectedCompletion ? (
                        new Date(project.expectedCompletion).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      ) : (
                        'Not specified'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="logo">ROADCHAIN</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/complaints">File Complaint</Link>
            <Link href="/complaints/R2025-0182">Track Complaint</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}