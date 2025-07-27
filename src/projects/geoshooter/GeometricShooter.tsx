import { useEffect, useRef } from 'react';

// class Player {
//   x: number;
//   y: number;
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
// }

export function GeometricShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 5, y: 5 }]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const scale = window.devicePixelRatio || 1;
    const cellSize = 16;
    const gridSize = 20;
    const width = cellSize * gridSize;
    const height = cellSize * gridSize;

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(scale, scale);

    // Handle arrow key input
    const handleKey = (e: KeyboardEvent) => {
      const dir = directionRef.current;
      if (e.key === 'ArrowUp' && dir.y === 0) directionRef.current = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && dir.y === 0) directionRef.current = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && dir.x === 0) directionRef.current = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && dir.x === 0) directionRef.current = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKey);

    let lastTime = 0;
    const tickRate = 150; // ms per move

    function gameLoop(time: number) {
      if (time - lastTime > tickRate) {
        update();
        draw();
        lastTime = time;
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    }

    function update() {
      const dir = directionRef.current;
      const snake = snakeRef.current;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wrap around edges
      head.x = (head.x + gridSize) % gridSize;
      head.y = (head.y + gridSize) % gridSize;

      snake.unshift(head);
      snake.pop(); // no growth for now
    }

    function draw() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'lime';
      for (const segment of snakeRef.current) {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      }
    }

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(requestRef.current!);
    };
  }, []);

  return (
    <div className="viewport">
      <canvas ref={canvasRef} />
    </div>
  );
}