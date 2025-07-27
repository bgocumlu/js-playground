import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getProjects } from '@/lib/projectDiscovery';
import { updateFavicon, updatePageTitle } from '@/lib/favicon';

export function Home() {
  const projects = getProjects();

  // Restore default favicon and title when on home page
  useEffect(() => {
    updateFavicon('/');
    updatePageTitle('');
  }, []);

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
