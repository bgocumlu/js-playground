import { Link, useParams } from "react-router-dom";
import { getProjectByPath } from "../lib/projectDiscovery";

export function ProjectPage() {
  const { projectPath } = useParams<{ projectPath: string }>();
  const project = getProjectByPath(`/${projectPath}`);

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
      <ProjectComponent />
    </div>
  );
}
