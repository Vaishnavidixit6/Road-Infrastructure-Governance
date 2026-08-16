// app/admin/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, we're using hardcoded credentials
    if (formData.username === 'admin' && formData.password === 'admin123') {
      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">ROADCHAIN</div>
          <nav className="nav">
            <Link href="/public">Home</Link>
            <Link href="/public/projects">Projects</Link>
            <Link href="/public/complaints">File Complaint</Link>
            <Link href="/public/complaints/R2025-0182">Track Complaint</Link>
            <Link href="/admin/login">Admin Login</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="login-container">
          <h1 style={{textAlign: 'center', marginBottom: '1.5rem'}}>Government Authority Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn" style={{width: '100%'}}>
              Login
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="logo">ROADCHAIN</div>
          <nav className="nav">
            <Link href="/public">Home</Link>
            <Link href="/public/projects">Projects</Link>
            <Link href="/public/complaints">File Complaint</Link>
            <Link href="/public/complaints/R2025-0182">Track Complaint</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}