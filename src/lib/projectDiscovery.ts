export interface Project {
  name: string;
  path: string;
  component: React.ComponentType;
}

// Import all project components here
import { Wordle } from '../projects/wordle/Wordle';
import { GeometricShooter } from '../projects/geoshooter/GeometricShooter';

// Define your projects here - this is the only place you need to update when adding new projects
export const projects: Project[] = [
  {
    name: 'Wordle',
    path: '/wordle',
    component: Wordle,
  },
  {
    name: 'Geometric Shooter',
    path: '/geoshooter',
    component: GeometricShooter,
  },
];

export const getProjects = (): Project[] => projects;

export const getProjectByPath = (path: string): Project | undefined => {
  return projects.find(project => project.path === path);
};
