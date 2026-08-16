// app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState({});
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    contractor: '',
    status: 'Planning',
    expectedCompletion: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadData();
    }
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load projects
      const projectsResponse = await fetch('/api/projects');
      if (!projectsResponse.ok) throw new Error('Failed to load projects');
      const projectsData = await projectsResponse.json();
      setProjects(projectsData);
      
      // Load complaints
      const complaintsResponse = await fetch('/api/complaints');
      if (!complaintsResponse.ok) throw new Error('Failed to load complaints');
      const complaintsData = await complaintsResponse.json();
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const updateProject = async (projectId, updates) => {
    try {
      setUpdateStatus(prev => ({ ...prev, [projectId]: 'updating' }));
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'update', id: projectId, updates }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setProjects(projects.map(project => 
          project.id === projectId ? result.project : project
        ));
        setUpdateStatus(prev => ({ ...prev, [projectId]: 'success' }));
        setTimeout(() => setUpdateStatus(prev => ({ ...prev, [projectId]: '' })), 2000);
      } else {
        setUpdateStatus(prev => ({ ...prev, [projectId]: 'error' }));
        alert('Error updating project: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setUpdateStatus(prev => ({ ...prev, [projectId]: 'error' }));
      alert('Error updating project: ' + error.message);
      console.error('Update error:', error);
    }
  };

  const createProject = async () => {
    try {
      setUpdateStatus(prev => ({ ...prev, 'new': 'updating' }));
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create', newProject }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add new project to local state
        setProjects([...projects, result.project]);
        setNewProject({
          name: '',
          contractor: '',
          status: 'Planning',
          expectedCompletion: ''
        });
        setShowAddProject(false);
        setUpdateStatus(prev => ({ ...prev, 'new': 'success' }));
        setTimeout(() => setUpdateStatus(prev => ({ ...prev, 'new': '' })), 2000);
      } else {
        setUpdateStatus(prev => ({ ...prev, 'new': 'error' }));
        alert('Error creating project: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setUpdateStatus(prev => ({ ...prev, 'new': 'error' }));
      alert('Error creating project: ' + error.message);
      console.error('Create error:', error);
    }
  };

  const updateComplaint = async (complaintId, updates) => {
    try {
      setUpdateStatus(prev => ({ ...prev, [complaintId]: 'updating' }));
      
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'update', id: complaintId, updates }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setComplaints(complaints.map(complaint => 
          complaint.id === complaintId ? result.complaint : complaint
        ));
        setUpdateStatus(prev => ({ ...prev, [complaintId]: 'success' }));
        setTimeout(() => setUpdateStatus(prev => ({ ...prev, [complaintId]: '' })), 2000);
      } else {
        setUpdateStatus(prev => ({ ...prev, [complaintId]: 'error' }));
        alert('Error updating complaint: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setUpdateStatus(prev => ({ ...prev, [complaintId]: 'error' }));
      alert('Error updating complaint: ' + error.message);
      console.error('Update error:', error);
    }
  };

  const handleProjectFieldChange = (projectId, field, value) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, [field]: value } : project
    ));
  };

  const handleComplaintFieldChange = (complaintId, field, value) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === complaintId ? { ...complaint, [field]: value } : complaint
    ));
  };

  const handleNewProjectChange = (field, value) => {
    setNewProject({
      ...newProject,
      [field]: value
    });
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div>
        <header className="header">
          <div className="container header-content">
            <div className="logo">ROADCHAIN ADMIN</div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
                Logout
              </button>
            </nav>
          </div>
        </header>
        <main className="container">
          <div style={{textAlign: 'center', padding: '2rem'}}>Loading data...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">ROADCHAIN ADMIN</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <h1 style={{margin: '2rem 0'}}>Admin Dashboard</h1>
        
        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
          <button 
            className={`btn ${activeTab === 'projects' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('projects')}
          >
            Manage Projects
          </button>
          <button 
            className={`btn ${activeTab === 'complaints' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('complaints')}
          >
            Manage Complaints
          </button>
        </div>
        
        {activeTab === 'projects' && (
          <div className="dashboard-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2>Road Projects</h2>
              <button className="btn" onClick={() => setShowAddProject(!showAddProject)}>
                {showAddProject ? 'Cancel' : 'Add New Project'}
              </button>
            </div>

            {showAddProject && (
              <div style={{background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
                <h3>Add New Project</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => handleNewProjectChange('name', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contractor</label>
                    <input
                      type="text"
                      value={newProject.contractor}
                      onChange={(e) => handleNewProjectChange('contractor', e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={newProject.status}
                      onChange={(e) => handleNewProjectChange('status', e.target.value)}
                      className="form-control"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Expected Completion</label>
                    <input 
                      type="date" 
                      value={newProject.expectedCompletion} 
                      onChange={(e) => handleNewProjectChange('expectedCompletion', e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <button 
                  className="btn" 
                  style={{marginTop: '1rem'}}
                  onClick={createProject}
                  disabled={updateStatus['new'] === 'updating'}
                >
                  {updateStatus['new'] === 'updating' ? 'Creating...' : 
                   updateStatus['new'] === 'success' ? '✓ Created' :
                   updateStatus['new'] === 'error' ? '✗ Error' : 'Create Project'}
                </button>
              </div>
            )}

            <button className="btn" style={{marginBottom: '1rem'}} onClick={loadData}>
              Refresh Data
            </button>
            
            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Contractor</th>
                    <th>Status</th>
                    <th>Expected Completion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => handleProjectFieldChange(project.id, 'name', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem', width: '100%'}}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={project.contractor}
                          onChange={(e) => handleProjectFieldChange(project.id, 'contractor', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem', width: '100%'}}
                        />
                      </td>
                      <td>
                        <select 
                          value={project.status}
                          onChange={(e) => handleProjectFieldChange(project.id, 'status', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem'}}
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Delayed">Delayed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="date" 
                          value={project.expectedCompletion} 
                          onChange={(e) => handleProjectFieldChange(project.id, 'expectedCompletion', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem'}}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn" 
                          style={{padding: '0.25rem 0.5rem'}}
                          onClick={() => updateProject(project.id, {
                            name: project.name,
                            contractor: project.contractor,
                            status: project.status,
                            expectedCompletion: project.expectedCompletion
                          })}
                          disabled={updateStatus[project.id] === 'updating'}
                        >
                          {updateStatus[project.id] === 'updating' ? 'Updating...' : 
                           updateStatus[project.id] === 'success' ? '✓ Updated' :
                           updateStatus[project.id] === 'error' ? '✗ Error' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'complaints' && (
          <div className="dashboard-container">
            <h2>Complaints</h2>
            <button className="btn" style={{marginBottom: '1rem'}} onClick={loadData}>
              Refresh Data
            </button>
            
            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td>{complaint.id}</td>
                      <td>{complaint.date}</td>
                      <td>
                        <select 
                          value={complaint.status}
                          onChange={(e) => handleComplaintFieldChange(complaint.id, 'status', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem'}}
                        >
                          <option value="Received">Received</option>
                          <option value="Forwarded">Forwarded</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td>
                        <textarea
                          value={complaint.details}
                          onChange={(e) => handleComplaintFieldChange(complaint.id, 'details', e.target.value)}
                          style={{border: '1px solid #ddd', padding: '0.25rem', width: '100%', minHeight: '60px'}}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn" 
                          style={{padding: '0.25rem 0.5rem'}}
                          onClick={() => updateComplaint(complaint.id, {
                            status: complaint.status,
                            details: complaint.details
                          })}
                          disabled={updateStatus[complaint.id] === 'updating'}
                        >
                          {updateStatus[complaint.id] === 'updating' ? 'Updating...' : 
                           updateStatus[complaint.id] === 'success' ? '✓ Updated' :
                           updateStatus[complaint.id] === 'error' ? '✗ Error' : 'Update'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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