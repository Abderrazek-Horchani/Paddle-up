import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>PaddleUp | Kayak & Surf Rentals in Kelibia</title>
         {/* The rest of the head content like meta tags and favicon can be in _app.js or Layout if common */}
      </Head>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center py-5">
          <h1>Kayak & Surfboard Rentals in Kelibia</h1>
          <p className="lead">Adventure starts here – with free lemon juice! 🍋</p>
          <Link href="/booking" legacyBehavior>
            <a className="btn btn-primary btn-lg">Book Now</a>
          </Link>
          <a href="tel:+21627680745" className="btn btn-outline-light btn-lg ms-2">
            <i className="fas fa-phone"></i> Call Us
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-4">
        <div className="container">
          <div className="row g-4">
            {/* Contact Information */}
            <div className="col-12 col-md-4">
              <div className="contact-info">
                <h3 className="h5 mb-4">Contact Information</h3>
                <div className="contact-details">
                  <div className="contact-item mb-4">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h4 className="h6 mb-1">Location</h4>
                      <p className="mb-0">Kelibia Beach, Nabeul, Tunisia</p>
                    </div>
                  </div>
                  <div className="contact-item mb-4">
                    <div className="contact-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="contact-text">
                      <h4 className="h6 mb-1">Phone</h4>
                      <a href="tel:+21627680745" className="text-decoration-none">
                        +216 27 680 745
                      </a>
                    </div>
                  </div>
                  <div className="contact-item mb-4">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">
                      <h4 className="h6 mb-1">Email</h4>
                      <a href="mailto:info@paddleup.tn" className="text-decoration-none">
                        info@paddleup.tn
                      </a>
                    </div>
                  </div>
                </div>

                <div className="social-section mt-4">
                  <h4 className="h6 mb-3">Follow Us</h4>
                  <div className="social-links">
                    <a
                      href="https://www.instagram.com/paddleup.kelibia"
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61575933540971"
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      href="https://www.tiktok.com/@paddleup0"
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-tiktok"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="col-12 col-md-4">
              <div className="map-container">
                <h3 className="h5 mb-3">Our Location</h3>
                <div className="map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.1234567890123!2d11.123456!3d36.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDA3JzI0LjQiTiAxMcKwMDcnMjQuNCJF!5e0!3m2!1sen!2stn!4v1234567890!5m2!1sen!2stn"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-12 col-md-4">
              <div className="contact-form">
                <h3 className="h5 mb-3">Send us a Message</h3>
                <form>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Your Phone"
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
