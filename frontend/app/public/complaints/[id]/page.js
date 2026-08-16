// app/complaints/[id]/page.js
'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TrackComplaint() {
  const params = useParams();
  const complaintId = params.id;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(complaintId);

  useEffect(() => {
    if (complaintId) {
      fetchComplaint(complaintId);
    }
  }, [complaintId]);

  const fetchComplaint = async (id) => {
    try {
      setLoading(true);
      const response = await fetch('/api/complaints');
      const complaints = await response.json();
      const foundComplaint = complaints.find(c => c.id === id);
      
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setComplaint(null);
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchId) {
      fetchComplaint(searchId);
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
          <div style={{textAlign: 'center', padding: '2rem'}}>Loading complaint details...</div>
        </main>
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
        <h1 style={{margin: '2rem 0'}}>Track Complaint</h1>
        
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
          <div className="form-group">
            <label htmlFor="requestId">Enter Request ID</label>
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <input
                type="text"
                id="requestId"
                className="form-control"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g., R2025-0001"
              />
              <button className="btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
          
          {complaint ? (
            <>
              <h2>Complaint Status</h2>
              <div className="timeline">
                <div className={`timeline-step ${complaint.status === 'Received' ? 'active' : 'completed'}`}>
                  <div>Received</div>
                </div>
                <div className={`timeline-step ${complaint.status === 'Forwarded' ? 'active' : complaint.status === 'Resolved' || complaint.status === 'Under Review' ? 'completed' : ''}`}>
                  <div>Forwarded</div>
                </div>
                <div className={`timeline-step ${complaint.status === 'Under Review' ? 'active' : complaint.status === 'Resolved' ? 'completed' : ''}`}>
                  <div>Under Review</div>
                </div>
                <div className={`timeline-step ${complaint.status === 'Resolved' ? 'active' : ''}`}>
                  <div>Resolved</div>
                </div>
              </div>
              
              <h2>Complaint Details</h2>
              <div style={{background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px'}}>
                <p><strong>Request ID:</strong> {complaint.id}</p>
                <p><strong>Date Registered:</strong> {complaint.date}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Details:</strong> {complaint.details}</p>
                
                <h3 style={{marginTop: '1.5rem'}}>Timeline</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                  {complaint.timeline && complaint.timeline.map((event, index) => (
                    <li key={index} style={{padding: '0.5rem 0', borderBottom: index < complaint.timeline.length - 1 ? '1px solid #eee' : 'none'}}>
                      <strong>{event.date}</strong>: {event.status} - {event.description}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '8px'}}>
              <p>No complaint found with ID: {searchId}</p>
              <p>Please check your Request ID and try again.</p>
            </div>
          )}
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