import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { ProjectPage } from './components/ProjectPage';

export default function App() {
  return (
    <Router>
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:projectPath" element={<ProjectPage />} />
        </Routes>
      </main>
    </Router>
  );
}