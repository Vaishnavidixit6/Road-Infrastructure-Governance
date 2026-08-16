// app/public/page.js
import Link from 'next/link';

export default function Home() {
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
        <section className="hero">
          <h1>Transparent Road Governance for All</h1>
          <div className="cta-buttons">
            <Link href="/public/projects" className="btn">View Road Projects</Link>
            <Link href="/public/complaints" className="btn btn-secondary">Register a Complaint</Link>
          </div>
        </section>

        <section>
          <h2>Road Projects</h2>
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Contractor</th>
                  <th>Expected Completion</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NH-48, Mumbai</td>
                  <td>ABC Ltd.</td>
                  <td>21 Aug. 2023</td>
                </tr>
                <tr>
                  <td>LBS Marg, Delhi</td>
                  <td>XYZ Pvt Ltd.</td>
                  <td>21 Aug. 2023</td>
                </tr>
                <tr>
                  <td>Shivajinagar, Pune</td>
                  <td>PQR Builders</td>
                  <td>30 Aug. 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <Link href="/public/projects" className="btn">View all projects</Link>
          </div>
        </section>
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