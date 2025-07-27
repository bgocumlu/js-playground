import { getProjectByPath } from './projectDiscovery';

// Favicon management utility
export interface FaviconConfig {
  href: string;
  type?: string;
}

export function updateFavicon(projectPath: string): void {
  let faviconHref = '/vite.svg'; // default
  
  if (projectPath !== '/') {
    const project = getProjectByPath(projectPath);
    if (project?.favicon) {
      faviconHref = project.favicon;
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
