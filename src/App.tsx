// Update the import path below to the correct relative path based on your project structure.
// For example, if GeometricShooter.tsx is in src/projects/geoshooter:
import { Wordle } from "./projects/wordle/Wordle";

export default function App() {
  return (
    <main className="app">
      <h1>Wordle (ai)</h1>
      <Wordle />
    </main>
  );
}