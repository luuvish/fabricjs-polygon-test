import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function Home() {
  const solidSquareCanvasRef = useRef<HTMLCanvasElement>(null);
  const gradientSquareCanvasRef = useRef<HTMLCanvasElement>(null);
  const shadowedSquareCanvasRef = useRef<HTMLCanvasElement>(null);
  const solidPolygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const gradientPolygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const shadowedPolygonCanvasRef = useRef<HTMLCanvasElement>(null);
  const solidSquareFabricRef = useRef<fabric.Canvas | null>(null);
  const gradientSquareFabricRef = useRef<fabric.Canvas | null>(null);
  const shadowedSquareFabricRef = useRef<fabric.Canvas | null>(null);
  const solidPolygonFabricRef = useRef<fabric.Canvas | null>(null);
  const gradientPolygonFabricRef = useRef<fabric.Canvas | null>(null);
  const shadowedPolygonFabricRef = useRef<fabric.Canvas | null>(null);

  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const performanceTest: () => Promise<void> = async () => {
    setIsRunning(true);
    setResults([]);

    const movement = [
      { dx: 1, dy: 0, steps: 100 },   // Right
      { dx: 0, dy: 1, steps: 100 },   // Down
      { dx: -1, dy: 0, steps: 100 },  // Left
      { dx: 0, dy: -1, steps: 100 }   // Up
    ];

    const testCanvas = async (canvas: fabric.Canvas, name: string) => {
      const startTime = performance.now();
      const obj = canvas.getObjects()[0] as fabric.Group;
      
      for (const direction of movement) {
        for (let step = 0; step < direction.steps; step++) {
          obj.set({
            left: obj.left! + direction.dx,
            top: obj.top! + direction.dy
          });
          canvas.renderAll();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      const endTime = performance.now();
      setResults(prev => [...prev, `${name}: ${(endTime - startTime).toFixed(2)}ms`]);
    };

    if (!solidSquareFabricRef.current || !solidPolygonFabricRef.current) return;
    if (!gradientSquareFabricRef.current || !gradientPolygonFabricRef.current) return;
    if (!shadowedSquareFabricRef.current || !shadowedPolygonFabricRef.current) return;

    await testCanvas(solidSquareFabricRef.current, 'Solid Square');
    await testCanvas(gradientSquareFabricRef.current, 'Gradient Square');
    await testCanvas(shadowedSquareFabricRef.current, 'Shadowed Square');
    await testCanvas(solidPolygonFabricRef.current, 'Solid Polygon');
    await testCanvas(gradientPolygonFabricRef.current, 'Gradient Polygon');
    await testCanvas(shadowedPolygonFabricRef.current, 'Shadowed Polygon');
    setIsRunning(false);
  };

  useEffect(() => {
    if (!solidSquareCanvasRef.current || !solidPolygonCanvasRef.current) return;
    if (!gradientSquareCanvasRef.current || !gradientPolygonCanvasRef.current) return;
    if (!shadowedSquareCanvasRef.current || !shadowedPolygonCanvasRef.current) return;

    // Define basic configuration first
    const config = {
      canvas: {
        width: 400,
        height: 400,
        backgroundColor: '#f8f9fa'
      },
      container: {
        width: 350,
        height: 350
      },
      shape: {
        size: 30,
        gap: 5
      }
    };

    // Create fabric.Canvas instances
    solidSquareFabricRef.current = new fabric.Canvas(solidSquareCanvasRef.current, config.canvas);
    gradientSquareFabricRef.current = new fabric.Canvas(gradientSquareCanvasRef.current, config.canvas);
    shadowedSquareFabricRef.current = new fabric.Canvas(shadowedSquareCanvasRef.current, config.canvas);
    solidPolygonFabricRef.current = new fabric.Canvas(solidPolygonCanvasRef.current, config.canvas);
    gradientPolygonFabricRef.current = new fabric.Canvas(gradientPolygonCanvasRef.current, config.canvas);
    shadowedPolygonFabricRef.current = new fabric.Canvas(shadowedPolygonCanvasRef.current, config.canvas);

    // Calculate starting position
    const totalGap = config.shape.gap * 9;
    const startX = (config.canvas.width - config.container.width) / 2 + 
                   (config.container.width - (config.shape.size * 10 + totalGap)) / 2;
    const startY = (config.canvas.height - config.container.height) / 2 + 
                   (config.container.height - (config.shape.size * 10 + totalGap)) / 2;

    // Create container function
    const createContainer = () => new fabric.Rect({
      left: (config.canvas.width - config.container.width) / 2,
      top: (config.canvas.height - config.container.height) / 2,
      width: config.container.width,
      height: config.container.height,
      fill: 'transparent',
      stroke: '#ddd',
      selectable: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.1)',
        blur: 10,
        offsetX: 0,
        offsetY: 0
      })
    });

    // Create solid pattern function
    const createSolidPattern = (index: number) => {
      const patterns = [
        // Basic solid color
        `hsl(${(index * 37) % 360}, 80%, 60%)`,
        // Light color
        `hsl(${(index * 47) % 360}, 70%, 75%)`,
        // Dark color
        `hsl(${(index * 57) % 360}, 90%, 45%)`
      ];
      return patterns[index % patterns.length];
    };

    // Create gradient function
    const createGradient = (index: number) => {
      const gradientTypes = [
        // Linear gradient - diagonal
        new fabric.Gradient({
          type: 'linear',
          coords: {
            x1: 0,
            y1: 0,
            x2: config.shape.size,
            y2: config.shape.size,
          },
          colorStops: [
            { offset: 0, color: `hsl(${(index * 37) % 360}, 70%, 50%)` },
            { offset: 1, color: `hsl(${(index * 37 + 180) % 360}, 70%, 50%)` }
          ]
        }),
        // Radial gradient
        new fabric.Gradient({
          type: 'radial',
          coords: {
            x1: config.shape.size/2,
            y1: config.shape.size/2,
            r1: 0,
            x2: config.shape.size/2,
            y2: config.shape.size/2,
            r2: config.shape.size/2,
          },
          colorStops: [
            { offset: 0, color: `hsl(${(index * 47) % 360}, 80%, 60%)` },
            { offset: 1, color: `hsl(${(index * 47 + 120) % 360}, 80%, 40%)` }
          ]
        }),
        // Linear gradient - horizontal
        new fabric.Gradient({
          type: 'linear',
          coords: {
            x1: 0,
            y1: 0,
            x2: config.shape.size,
            y2: 0,
          },
          colorStops: [
            { offset: 0, color: `hsl(${(index * 57) % 360}, 90%, 55%)` },
            { offset: 0.5, color: `hsl(${(index * 57 + 90) % 360}, 90%, 55%)` },
            { offset: 1, color: `hsl(${(index * 57 + 180) % 360}, 90%, 55%)` }
          ]
        }),
      ];

      return gradientTypes[index % gradientTypes.length];
    };

    // Create solid squares
    const solidSquares = Array.from({ length: 100 }, (_, i) => new fabric.Rect({
      left: startX + (i % 10) * (config.shape.size + config.shape.gap),
      top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
      width: config.shape.size,
      height: config.shape.size,
      fill: `hsl(${(i * 37) % 360}, 80%, 60%)`
    }));

    // Create gradient squares
    const gradientSquares = Array.from({ length: 100 }, (_, i) => new fabric.Rect({
      left: startX + (i % 10) * (config.shape.size + config.shape.gap),
      top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
      width: config.shape.size,
      height: config.shape.size,
      fill: createGradient(i)  // Reuse the existing createGradient function
    }));

    // Create shadowed squares
    const shadowedSquares = Array.from({ length: 100 }, (_, i) => new fabric.Rect({
      left: startX + (i % 10) * (config.shape.size + config.shape.gap),
      top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
      width: config.shape.size,
      height: config.shape.size,
      fill: `hsl(${(i * 37) % 360}, 80%, 60%)`,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.2)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    }));

    // Define various polygon shapes
    const polygonShapes = [
      // Triangle
      [
        { x: config.shape.size/2, y: 0 },
        { x: config.shape.size, y: config.shape.size },
        { x: 0, y: config.shape.size }
      ],
      // Rhombus
      [
        { x: config.shape.size/2, y: 0 },
        { x: config.shape.size, y: config.shape.size/2 },
        { x: config.shape.size/2, y: config.shape.size },
        { x: 0, y: config.shape.size/2 }
      ],
      // Octagon
      Array.from({ length: 8 }, (_, i) => ({
        x: config.shape.size/2 + config.shape.size/2 * Math.cos(i * Math.PI/4),
        y: config.shape.size/2 + config.shape.size/2 * Math.sin(i * Math.PI/4)
      })),
      // Arrow
      [
        { x: 0, y: config.shape.size/2 },
        { x: config.shape.size*0.7, y: config.shape.size/2 },
        { x: config.shape.size*0.7, y: config.shape.size*0.2 },
        { x: config.shape.size, y: config.shape.size*0.5 },
        { x: config.shape.size*0.7, y: config.shape.size*0.8 },
        { x: config.shape.size*0.7, y: config.shape.size*0.5 }
      ],
      // Lightning
      [
        { x: config.shape.size*0.4, y: 0 },
        { x: config.shape.size*0.1, y: config.shape.size*0.5 },
        { x: config.shape.size*0.5, y: config.shape.size*0.5 },
        { x: config.shape.size*0.2, y: config.shape.size },
        { x: config.shape.size*0.9, y: config.shape.size*0.4 },
        { x: config.shape.size*0.5, y: config.shape.size*0.4 }
      ],
      // Cross
      [
        { x: config.shape.size*0.35, y: 0 },
        { x: config.shape.size*0.65, y: 0 },
        { x: config.shape.size*0.65, y: config.shape.size*0.35 },
        { x: config.shape.size, y: config.shape.size*0.35 },
        { x: config.shape.size, y: config.shape.size*0.65 },
        { x: config.shape.size*0.65, y: config.shape.size*0.65 },
        { x: config.shape.size*0.65, y: config.shape.size },
        { x: config.shape.size*0.35, y: config.shape.size },
        { x: config.shape.size*0.35, y: config.shape.size*0.65 },
        { x: 0, y: config.shape.size*0.65 },
        { x: 0, y: config.shape.size*0.35 },
        { x: config.shape.size*0.35, y: config.shape.size*0.35 }
      ],
      // 12-pointed star
      Array.from({ length: 24 }, (_, i) => ({
        x: config.shape.size/2 + (i % 2 ? config.shape.size/2 : config.shape.size/4) * 
           Math.cos(i * Math.PI/12),
        y: config.shape.size/2 + (i % 2 ? config.shape.size/2 : config.shape.size/4) * 
           Math.sin(i * Math.PI/12)
      })),
      // Heart
      [
        { x: config.shape.size*0.5, y: config.shape.size*0.25 },
        { x: config.shape.size*0.25, y: 0 },
        { x: 0, y: config.shape.size*0.25 },
        { x: 0, y: config.shape.size*0.5 },
        { x: config.shape.size*0.5, y: config.shape.size },
        { x: config.shape.size, y: config.shape.size*0.5 },
        { x: config.shape.size, y: config.shape.size*0.25 },
        { x: config.shape.size*0.75, y: 0 },
        { x: config.shape.size*0.5, y: config.shape.size*0.25 }
      ],
      // Butterfly
      [
        { x: config.shape.size*0.5, y: config.shape.size*0.2 },
        { x: config.shape.size*0.8, y: 0 },
        { x: config.shape.size, y: config.shape.size*0.3 },
        { x: config.shape.size*0.8, y: config.shape.size*0.5 },
        { x: config.shape.size, y: config.shape.size*0.7 },
        { x: config.shape.size*0.8, y: config.shape.size },
        { x: config.shape.size*0.5, y: config.shape.size*0.8 },
        { x: config.shape.size*0.2, y: config.shape.size },
        { x: 0, y: config.shape.size*0.7 },
        { x: config.shape.size*0.2, y: config.shape.size*0.5 },
        { x: 0, y: config.shape.size*0.3 },
        { x: config.shape.size*0.2, y: 0 }
      ],
      // Gear
      Array.from({ length: 16 }, (_, i) => ({
        x: config.shape.size/2 + (i % 2 ? config.shape.size/2 : config.shape.size/4) * 
           Math.cos(i * Math.PI/16),
        y: config.shape.size/2 + (i % 2 ? config.shape.size/2 : config.shape.size/4) * 
           Math.sin(i * Math.PI/16)
      }))
    ];

    // Create solid polygons (non-gradient version)
    const solidPolygons = Array.from({ length: 100 }, (_, i) => {
      const shapePoints = polygonShapes[i % polygonShapes.length];
      return new fabric.Polygon(shapePoints, {
        left: startX + (i % 10) * (config.shape.size + config.shape.gap),
        top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
        fill: `hsl(${(i * 37) % 360}, 80%, 60%)`,
        originX: 'left',
        originY: 'top',
      });
    });

    // Create polygons
    const gradientPolygons = Array.from({ length: 100 }, (_, i) => {
      const shapePoints = polygonShapes[i % polygonShapes.length];
      return new fabric.Polygon(shapePoints, {
        left: startX + (i % 10) * (config.shape.size + config.shape.gap),
        top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
        fill: i % 2 === 0 ? createGradient(i) : createSolidPattern(i),
        originX: 'left',
        originY: 'top',
      });
    });

    // Create shadowed polygons
    const shadowedPolygons = Array.from({ length: 100 }, (_, i) => {
      const shapePoints = polygonShapes[i % polygonShapes.length];
      return new fabric.Polygon(shapePoints, {
        left: startX + (i % 10) * (config.shape.size + config.shape.gap),
        top: startY + Math.floor(i / 10) * (config.shape.size + config.shape.gap),
        fill: `hsl(${(i * 37) % 360}, 80%, 60%)`,
        originX: 'left',
        originY: 'top',
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 5,
          offsetX: 2,
          offsetY: 2
        })
      });
    });

    // Create groups
    const solidSquareGroup = new fabric.Group([createContainer(), ...solidSquares], {
      left: 0,
      top: 0,
      selectable: false
    });

    const gradientSquareGroup = new fabric.Group([createContainer(), ...gradientSquares], {
      left: 0,
      top: 0,
      selectable: false
    });

    // Create groups
    const shadowedSquareGroup = new fabric.Group([createContainer(), ...shadowedSquares], {
      left: 0,
      top: 0,
      selectable: false
    });

    const solidPolygonGroup = new fabric.Group([createContainer(), ...solidPolygons], {
      left: 0,
      top: 0,
      selectable: false
    });

    const gradientPolygonGroup = new fabric.Group([createContainer(), ...gradientPolygons], {
      left: 0,
      top: 0,
      selectable: false
    });

    const shadowedPolygonGroup = new fabric.Group([createContainer(), ...shadowedPolygons], {
      left: 0,
      top: 0,
      selectable: false
    });

    // Add groups to canvas
    solidSquareFabricRef.current.add(solidSquareGroup);
    gradientSquareFabricRef.current.add(gradientSquareGroup);
    shadowedSquareFabricRef.current.add(shadowedSquareGroup);
    solidPolygonFabricRef.current.add(solidPolygonGroup);
    gradientPolygonFabricRef.current.add(gradientPolygonGroup);
    shadowedPolygonFabricRef.current.add(shadowedPolygonGroup);

    return () => {
      solidSquareFabricRef.current?.dispose();
      gradientSquareFabricRef.current?.dispose();
      shadowedSquareFabricRef.current?.dispose();
      solidPolygonFabricRef.current?.dispose();
      gradientPolygonFabricRef.current?.dispose();
      shadowedPolygonFabricRef.current?.dispose();
    };
  }, []);

  return (
    <div className="container">
      <h1 className="title">fabric.js Polygon Performance Test</h1>
      <div className="canvas-grid">
        {/* First row - Squares */}
        <div className="canvas-container">
          <canvas ref={solidSquareCanvasRef} />
          <p>Solid Square</p>
        </div>
        <div className="canvas-container">
          <canvas ref={gradientSquareCanvasRef} />
          <p>Gradient Square</p>
        </div>
        <div className="canvas-container">
          <canvas ref={shadowedSquareCanvasRef} />
          <p>Shadowed Square</p>
        </div>
        
        {/* Second row - Polygons */}
        <div className="canvas-container">
          <canvas ref={solidPolygonCanvasRef} />
          <p>Solid Polygon</p>
        </div>
        <div className="canvas-container">
          <canvas ref={gradientPolygonCanvasRef} />
          <p>Gradient Polygon</p>
        </div>
        <div className="canvas-container">
          <canvas ref={shadowedPolygonCanvasRef} />
          <p>Shadowed Polygon</p>
        </div>
      </div>
      <div className="control-panel">
        <button 
          onClick={performanceTest} 
          disabled={isRunning}
          className="test-button"
        >
          {isRunning ? 'Running Test...' : 'Start Performance Test'}
        </button>
      </div>
      <div className="results">
        {results.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div>
    </div>
  );
} 