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
      const tentLength = 32 * scale;
      const tentWidth = 16 * scale;
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

      const ellipsoidPoint = (xNorm: number, zNorm: number) => {
        const x = xNorm * tentLength / 2;
        const z = zNorm * tentWidth / 2;
        
        const xSq = (xNorm * xNorm);
        const zSq = (zNorm * zNorm);
        const sum = xSq + zSq;
        
        if (sum > 1) return { x, y: 0, z };
        
        const yNorm = Math.sqrt(1 - sum);
        const y = -yNorm * tentHeight;
        
        return { x, y, z };
      };

      const numLongitudinal = 13;
      const numLatitudinal = 10;

      for (let i = 0; i < numLongitudinal - 1; i++) {
        for (let j = 0; j < numLatitudinal; j++) {
          const xNorm1 = -1 + (2 * i) / (numLongitudinal - 1);
          const xNorm2 = -1 + (2 * (i + 1)) / (numLongitudinal - 1);
          const zNorm1 = -1 + (2 * j) / numLatitudinal;
          const zNorm2 = -1 + (2 * (j + 1)) / numLatitudinal;

          const p1 = ellipsoidPoint(xNorm1, zNorm1);
          const p2 = ellipsoidPoint(xNorm2, zNorm1);
          const p3 = ellipsoidPoint(xNorm2, zNorm2);
          const p4 = ellipsoidPoint(xNorm1, zNorm2);

          const proj1 = project(p1.x, p1.y, p1.z);
          const proj2 = project(p2.x, p2.y, p2.z);
          const proj3 = project(p3.x, p3.y, p3.z);
          const proj4 = project(p4.x, p4.y, p4.z);

          const avgZ = (proj1.z + proj2.z + proj3.z + proj4.z) / 4;
          const heightFactor = Math.abs(p1.y + p2.y + p3.y + p4.y) / (4 * tentHeight);
          
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.lineTo(proj3.x, proj3.y);
          ctx.lineTo(proj4.x, proj4.y);
          ctx.closePath();

          const brightness = 0.7 + heightFactor * 0.3 + (avgZ > 0 ? 0.1 : 0);
          const red = Math.floor(230 * brightness);
          const green = Math.floor(60 * brightness);
          const blue = Math.floor(40 * brightness);
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.9)`;
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 130, 120, 0.6)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      for (let i = 0; i <= numLongitudinal - 1; i++) {
        const xNorm = -1 + (2 * i) / (numLongitudinal - 1);
        
        const arcPoints = [];
        for (let j = 0; j <= numLatitudinal; j++) {
          const zNorm = -1 + (2 * j) / numLatitudinal;
          const p = ellipsoidPoint(xNorm, zNorm);
          arcPoints.push(project(p.x, p.y, p.z));
        }

        ctx.beginPath();
        ctx.moveTo(arcPoints[0].x, arcPoints[0].y);
        for (let k = 1; k < arcPoints.length; k++) {
          ctx.lineTo(arcPoints[k].x, arcPoints[k].y);
        }
        ctx.strokeStyle = 'rgba(255, 140, 130, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      for (let i = 1; i < numLongitudinal - 1; i++) {
        const xNorm = -1 + (2 * i) / (numLongitudinal - 1);
        
        const topWindow = ellipsoidPoint(xNorm, 0);
        const topProj = project(topWindow.x, topWindow.y * 0.9, topWindow.z);
        ctx.beginPath();
        ctx.arc(topProj.x, topProj.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const sideWindows = [-0.6, 0.6];
        for (const zNorm of sideWindows) {
          const sideWindow = ellipsoidPoint(xNorm, zNorm);
          const sideProj = project(sideWindow.x, sideWindow.y * 0.85, sideWindow.z);
          ctx.beginPath();
          ctx.ellipse(sideProj.x, sideProj.y, 7, 15, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        const bottomWindows = [-0.4, 0, 0.4];
        for (const zNorm of bottomWindows) {
          const bottomWindow = ellipsoidPoint(xNorm, zNorm);
          const bottomProj = project(bottomWindow.x, bottomWindow.y * 0.5, bottomWindow.z);
          ctx.beginPath();
          ctx.arc(bottomProj.x, bottomProj.y, 4, 0, Math.PI * 2);
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