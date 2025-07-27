import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { ProjectPage } from './components/ProjectPage';

// Get the base path for GitHub Pages
const basename = import.meta.env.PROD ? '/js-playground' : '';

export default function App() {
  return (
    <Router basename={basename}>
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:projectPath" element={<ProjectPage />} />
        </Routes>
      </main>
    </Router>
  );
}