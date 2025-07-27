import { Link, useParams } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { getProjectByPath } from "@/lib/projectDiscovery";
import { updateFavicon, updatePageTitle } from "@/lib/favicon";

export function ProjectPage() {
  const { projectPath } = useParams<{ projectPath: string }>();
  const project = getProjectByPath(`/${projectPath}`);

  // Update favicon and title when project changes
  useEffect(() => {
    if (project) {
      updateFavicon(project.path);
      updatePageTitle(project.name);
    }
    
    // Cleanup: restore default favicon when component unmounts
    return () => {
      updateFavicon('/');
      updatePageTitle('');
    };
  }, [project]);

  if (!project) {
    return (
      <div>
        <h1>Project not found</h1>
        <Link to="/" style={{ textDecoration: "underline" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const ProjectComponent = project.component;

  return (
    <div>
      <nav>
        <Link to="/" style={{ textDecoration: "underline" }}>
          ← Back to Home
        </Link>
      </nav>
      <h1>{project.name}</h1>
      <Suspense fallback={<div>Loading project...</div>}>
        <ProjectComponent />
      </Suspense>
    </div>
  );
}
