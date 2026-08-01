import { hydrateRoot } from 'react-dom/client';
import { About } from '../pages/about';

hydrateRoot(
  document.getElementById('root')!,
    <About />
);
