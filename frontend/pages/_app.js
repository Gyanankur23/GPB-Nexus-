import '../styles/globals.css';
import { ThemeProvider } from '../lib/theme';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
