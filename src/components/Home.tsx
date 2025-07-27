import { Link } from 'react-router-dom';
import { getProjects } from '../lib/projectDiscovery';

export function Home() {
  const projects = getProjects();

  return (
    <div>
      <h1 className=''>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.path} className='mb-1'>
            <Link to={project.path} style={{ textDecoration: 'underline' }}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
