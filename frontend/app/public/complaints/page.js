// app/(public)/complaints/page.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FileComplaint() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Complaint submitted successfully! Your request ID: ${result.requestId}`);
        router.push('/');
      } else {
        alert('Error submitting complaint. Please try again.');
      }
    } catch (error) {
      alert('Error submitting complaint. Please try again.');
    }
  };

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
        <h1 style={{margin: '2rem 0'}}>Register a Complaint</h1>
        
        <form onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0 auto'}}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Road Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Issue Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn" style={{width: '100%'}}>
            Submit Complaint
          </button>
        </form>
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