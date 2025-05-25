import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Assuming you will install Font Awesome via npm

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
