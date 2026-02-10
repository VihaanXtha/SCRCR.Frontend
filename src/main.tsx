import { StrictMode } from 'react' // Import StrictMode for highlighting potential problems
import { createRoot } from 'react-dom/client' // Import createRoot for React 18+ rendering
import './index.css' // Import global styles
import App from './App.tsx' // Import the main App component

// Find the root element in the HTML and render the React application into it
createRoot(document.getElementById('root')!).render(
  // StrictMode activates additional checks and warnings for its descendants
  <StrictMode>
    <App />
  </StrictMode>,
)
