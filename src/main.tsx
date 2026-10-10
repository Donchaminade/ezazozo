import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {MotionPreferenceProvider} from './components/MotionPreference';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <MotionPreferenceProvider>
    <App />
  </MotionPreferenceProvider>
);
