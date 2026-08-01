import { hydrateRoot } from 'react-dom/client';
import { Home } from '../pages/home';

hydrateRoot(
  document.getElementById('root')!,

  <Home />,
);
