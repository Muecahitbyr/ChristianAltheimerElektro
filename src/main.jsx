import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ElectricHeroScene from './ElectricHeroScene.jsx';

const container = document.getElementById('hero-root');

createRoot(container).render(
  <StrictMode>
    <ElectricHeroScene />
  </StrictMode>
);
