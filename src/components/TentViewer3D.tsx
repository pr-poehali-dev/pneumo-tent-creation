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

      const scale = 8;
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

        const perspective = 500;
        const scale = perspective / (perspective + tempZ);
        
        return {
          x: tempX * scale,
          y: tempY * scale,
          z: tempZ
        };
      };

      const drawArc = (startX: number, startY: number, startZ: number, 
                       endX: number, endY: number, endZ: number, 
                       segments: number, height: number, color: string) => {
        ctx.beginPath();
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = startX + (endX - startX) * t;
          const y = startY - Math.sin(t * Math.PI) * height;
          const z = startZ + (endZ - startZ) * t;
          points.push(project(x, y, z));
        }

        points.sort((a, b) => b.z - a.z);
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      };

      const drawWindow = (x: number, y: number, z: number, size: number) => {
        const p = project(x, y, z);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      const tentHalfWidth = tentWidth / 2;
      const tentHalfLength = tentLength / 2;

      const gradient = ctx.createLinearGradient(-tentHalfLength, -tentHeight, tentHalfLength, 0);
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
      gradient.addColorStop(0.5, 'rgba(220, 70, 40, 0.9)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.8)');

      for (let i = 0; i < 11; i++) {
        const x = -tentHalfLength + (tentLength / 10) * i;
        drawArc(
          x, 0, -tentHalfWidth,
          x, 0, tentHalfWidth,
          20, tentHeight, gradient
        );
      }

      const sideGradient = ctx.createLinearGradient(-tentHalfWidth, 0, tentHalfWidth, 0);
      sideGradient.addColorStop(0, 'rgba(249, 115, 22, 0.6)');
      sideGradient.addColorStop(0.5, 'rgba(220, 70, 40, 0.7)');
      sideGradient.addColorStop(1, 'rgba(249, 115, 22, 0.6)');

      drawArc(
        -tentHalfLength, 0, -tentHalfWidth,
        -tentHalfLength, 0, tentHalfWidth,
        20, tentHeight, sideGradient
      );

      drawArc(
        tentHalfLength, 0, -tentHalfWidth,
        tentHalfLength, 0, tentHalfWidth,
        20, tentHeight, sideGradient
      );

      for (let i = 0; i < 10; i++) {
        const x = -tentHalfLength + (tentLength / 10) * i + tentLength / 20;
        for (let j = 0; j < 3; j++) {
          const z = -tentHalfWidth / 2 + (tentHalfWidth / 2) * j;
          const yOffset = -tentHeight * 0.7;
          drawWindow(x, yOffset, z, 6);
        }
      }

      const frontEntrance = [
        project(-tentHalfLength, 0, -tentHalfWidth / 3),
        project(-tentHalfLength, 0, tentHalfWidth / 3),
        project(-tentHalfLength, -tentHeight * 0.5, tentHalfWidth / 3),
        project(-tentHalfLength, -tentHeight * 0.5, -tentHalfWidth / 3)
      ];

      ctx.beginPath();
      ctx.moveTo(frontEntrance[0].x, frontEntrance[0].y);
      frontEntrance.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

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
