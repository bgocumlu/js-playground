import { lazy } from 'react';

export interface Project {
  name: string;
  path: string;
  component: React.ComponentType;
  favicon?: string;
}

// Lazy load project components - they only load when accessed
const Wordle = lazy(() => import('@/projects/wordle/Wordle').then(m => ({ default: m.Wordle })));
const GeometricShooter = lazy(() => import('@/projects/geoshooter/GeometricShooter').then(m => ({ default: m.GeometricShooter })));

// Define your projects here - this is the only place you need to update when adding new projects
export const projects: Project[] = [
  {
    name: 'Wordle',
    path: '/wordle',
    component: Wordle,
    favicon: '/favicons/wordle.svg',
  },
  {
    name: 'Geometric Shooter',
    path: '/geoshooter',
    component: GeometricShooter,
    favicon: '/favicons/geoshooter.svg',
  },
];

export const getProjects = (): Project[] => projects;

export const getProjectByPath = (path: string): Project | undefined => {
  return projects.find(project => project.path === path);
};
