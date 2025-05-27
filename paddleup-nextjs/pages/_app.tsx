import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Assuming you will install Font Awesome via npm
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
