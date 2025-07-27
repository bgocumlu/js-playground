import { getProjectByPath } from './projectDiscovery';

// Favicon management utility
export interface FaviconConfig {
  href: string;
  type?: string;
}

// Get the base path for GitHub Pages
const getBasePath = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' 
    : '/js-playground';
};

export function updateFavicon(projectPath: string): void {
  const basePath = getBasePath();
  let faviconHref = `${basePath}/vite.svg`; // default
  
  if (projectPath !== '/') {
    const project = getProjectByPath(projectPath);
    if (project?.favicon) {
      faviconHref = `${basePath}${project.favicon}`;
    }
  }
  
  // Remove existing favicon
  const existingFavicon = document.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    existingFavicon.remove();
  }
  
  // Add new favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = faviconHref;
  
  document.head.appendChild(link);
}

export function updatePageTitle(projectName: string): void {
  document.title = projectName ? `${projectName}` : 'Home';
}
