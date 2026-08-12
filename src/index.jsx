import { createRoot } from 'react-dom/client';
import App from './components/app';
import './font/google/fonts.css';
import './style.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
