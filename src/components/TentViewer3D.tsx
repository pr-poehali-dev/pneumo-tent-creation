import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const TentViewer3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0 });
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawTent = (rotX: number, rotY: number) => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const scale = 6.5;
      const tentWidth = 16 * scale;
      const tentLength = 32 * scale;
      const tentHeight = 8 * scale;

      const project = (x: number, y: number, z: number) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        let tempZ = z * cosY - x * sinY;
        const tempX = z * sinY + x * cosY;
        const tempY = y * cosX - tempZ * sinX;
        tempZ = y * sinX + tempZ * cosX;

        const perspective = 650;
        const scale = perspective / (perspective + tempZ);
        
        return {
          x: tempX * scale,
          y: tempY * scale,
          z: tempZ
        };
      };

      const numLongitudinalSections = 13;
      const numConcentricArcs = 9;
      
      for (let arcIdx = 0; arcIdx < numConcentricArcs; arcIdx++) {
        const radiusRatio = (arcIdx + 1) / numConcentricArcs;
        const arcHeight = -tentHeight * radiusRatio;
        const arcWidth = tentWidth * radiusRatio;
        
        for (let sectionIdx = 0; sectionIdx < numLongitudinalSections; sectionIdx++) {
          const xStart = -tentLength / 2 + (tentLength / (numLongitudinalSections - 1)) * sectionIdx;
          const xEnd = -tentLength / 2 + (tentLength / (numLongitudinalSections - 1)) * (sectionIdx + 1);
          
          if (sectionIdx >= numLongitudinalSections - 1) continue;
          
          const segments = 15;
          const points: Array<{x: number, y: number, z: number}> = [];
          
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const xPos = xStart + (xEnd - xStart) * t;
            const angle = -Math.PI / 2 + Math.PI * t;
            const zPos = Math.cos(angle) * (arcWidth / 2);
            const yPos = arcHeight + Math.sin(angle) * (arcWidth / 2) * 0.05;
            
            points.push(project(xPos, yPos, zPos));
          }
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          
          const brightness = 0.75 + radiusRatio * 0.25;
          const red = Math.floor(230 * brightness);
          const green = Math.floor(65 * brightness);
          const blue = Math.floor(45 * brightness);
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.85)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 140, 140, ${0.5 + radiusRatio * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      for (let sectionIdx = 0; sectionIdx <= numLongitudinalSections - 1; sectionIdx++) {
        const xPos = -tentLength / 2 + (tentLength / (numLongitudinalSections - 1)) * sectionIdx;
        const arcSegments = 20;
        
        for (let i = 0; i <= arcSegments; i++) {
          const t = i / arcSegments;
          const angle = -Math.PI / 2 + Math.PI * t;
          
          const startPoint = project(xPos, 0, Math.cos(angle) * (tentWidth / 2) * 0.1);
          const endPoint = project(xPos, -tentHeight, Math.cos(angle) * (tentWidth / 2));
          
          if (i < arcSegments) {
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.strokeStyle = 'rgba(255, 150, 150, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      for (let sectionIdx = 0; sectionIdx < numLongitudinalSections - 1; sectionIdx++) {
        const xPos = -tentLength / 2 + (tentLength / (numLongitudinalSections - 1)) * sectionIdx + (tentLength / (numLongitudinalSections - 1)) * 0.5;
        
        const topWindowY = -tentHeight * 0.85;
        const topWindow = project(xPos, topWindowY, 0);
        ctx.beginPath();
        ctx.arc(topWindow.x, topWindow.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const sidePositions = [-tentWidth * 0.35, tentWidth * 0.35];
        for (const zPos of sidePositions) {
          const midWindowY = -tentHeight * 0.5;
          const midWindow = project(xPos, midWindowY, zPos);
          ctx.beginPath();
          ctx.ellipse(midWindow.x, midWindow.y, 6, 14, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        const bottomPositions = [-tentWidth * 0.25, 0, tentWidth * 0.25];
        for (const zPos of bottomPositions) {
          const bottomWindowY = -tentHeight * 0.25;
          const bottomWindow = project(xPos, bottomWindowY, zPos);
          ctx.beginPath();
          ctx.arc(bottomWindow.x, bottomWindow.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const animate = () => {
      if (isRotating && !isDragging) {
        setRotation(prev => ({
          ...prev,
          y: prev.y + 0.005
        }));
      }
      drawTent(rotation.x, rotation.y);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rotation, isRotating, isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setIsRotating(false);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setRotation(prev => ({
      x: Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev.x + deltaY * 0.01)),
      y: prev.y + deltaX * 0.01
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const resetView = () => {
    setRotation({ x: 0.3, y: 0 });
    setIsRotating(true);
  };

  return (
    <Card className="glass-effect border-primary/30 overflow-hidden">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleRotation}
            className="glass-effect"
          >
            <Icon name={isRotating ? "Pause" : "Play"} size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={resetView}
            className="glass-effect"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 glass-effect px-4 py-2 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <Icon name="MousePointer2" size={14} className="inline mr-1" />
            Перетащите для вращения
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TentViewer3D;