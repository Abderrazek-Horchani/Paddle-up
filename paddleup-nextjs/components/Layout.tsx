import { useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return; // Ensure navbar element exists

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
          <Link href="/" legacyBehavior>
            <a className="navbar-brand">
              <img src="/images/logo type.svg" alt="PaddleUp" />
            </a>
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" legacyBehavior>
                  <a className="nav-link active" aria-current="page">
                    <i className="fas fa-home me-1"></i> Home
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/booking" legacyBehavior>
                  <a className="nav-link">
                    <i className="fas fa-calendar-check me-1"></i> Book Now
                  </a>
                </Link>
              </li>
              <li className="nav-item ms-lg-3">
                <a className="btn btn-primary" href="tel:+21627680745">
                  <i className="fas fa-phone me-1"></i> Call Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page content will be rendered here */}
      {children}
    </>
  );
}
