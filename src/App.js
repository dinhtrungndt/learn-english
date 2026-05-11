import { Routers } from './routers';

// --- CSS Variables & Fonts ---
// We inject these styles globally for the application to map perfectly to the requested variables
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  @font-face {
    font-family: 'Feather Bold';
    src: url('https://db.onlinewebfonts.com/t/14936bb7a4b6575fd2eee80a3ab52cc2.woff2') format('woff2');
  }

  :root {
    --green: rgb(88, 204, 2);
    --green-hover: rgb(75, 178, 0);
    --green-shadow: #58A700; /* Adjusted for realistic 3D shadow based on primary green */
    --dark-blue: rgb(16, 15, 62);
    --blue: rgb(28, 176, 246);
    --gray-text: rgb(75, 75, 75);
    --gray-light: rgb(119, 119, 119);
    --border-color: rgb(229, 229, 229);
    --nav-text: rgb(175, 175, 175);
    --footer-green: #4EC604;
    --red: #FF4B4B;
    --orange: #FF9600;
    --golden: #FFC800;
  }

  body {
    font-family: 'Nunito', 'DIN Round Pro', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--gray-text);
    background-color: white;
    margin: 0;
    padding: 0;
  }

  .feather {
    font-family: 'Feather Bold', 'Nunito', sans-serif;
  }

  /* Custom tooltips and elements */
  .tooltip-arrow::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--dark-blue) transparent transparent transparent;
  }

  /* Grid Borders */
  .grid-panel {
    border-bottom: 1px solid var(--border-color);
  }
  @media (min-width: 901px) {
    .grid-panel {
      border-right: 1px solid var(--border-color);
    }
    .grid-panel:nth-child(even) {
      border-right: none;
    }
  }
`;

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <Routers />
    </>
  );
}
