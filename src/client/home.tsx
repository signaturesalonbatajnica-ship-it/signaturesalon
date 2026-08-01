import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Home } from '../pages/home';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/work-sans';
import '@fontsource/homemade-apple';
import './index.css';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <Home />
  </StrictMode>,
);
