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

      const scale = 7;
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

        const perspective = 600;
        const scale = perspective / (perspective + tempZ);
        
        return {
          x: tempX * scale,
          y: tempY * scale,
          z: tempZ
        };
      };

      const drawFanSegment = (xPos: number, segmentAngle: number, isLast: boolean = false) => {
        const baseY = 0;
        const numArcs = 8;
        
        for (let arcIdx = 0; arcIdx < numArcs; arcIdx++) {
          const heightRatio = (arcIdx + 1) / numArcs;
          const yPos = baseY - (tentHeight * heightRatio);
          const widthAtHeight = tentWidth * heightRatio;
          
          const startAngle = -Math.PI / 2;
          const endAngle = Math.PI / 2;
          const angleSegments = 20;
          
          const points: Array<{x: number, y: number, z: number}> = [];
          
          for (let i = 0; i <= angleSegments; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / angleSegments);
            const zOffset = Math.cos(angle) * (widthAtHeight / 2);
            const yOffset = yPos + Math.sin(angle) * (widthAtHeight / 2) * 0.15;
            
            points.push(project(xPos, yOffset, zOffset));
          }
          
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          
          const brightness = 0.7 + heightRatio * 0.3;
          ctx.strokeStyle = `rgba(${220 * brightness}, ${70 * brightness}, ${40 * brightness}, 0.9)`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        const topCap = [];
        const capSegments = 20;
        const capY = baseY - tentHeight;
        for (let i = 0; i <= capSegments; i++) {
          const angle = -Math.PI / 2 + (Math.PI * i / capSegments);
          const zOffset = Math.cos(angle) * (tentWidth / 2);
          const yOffset = capY + Math.sin(angle) * (tentWidth / 2) * 0.15;
          topCap.push(project(xPos, yOffset, zOffset));
        }
        
        ctx.beginPath();
        ctx.moveTo(topCap[0].x, topCap[0].y);
        for (let i = 1; i < topCap.length; i++) {
          ctx.lineTo(topCap[i].x, topCap[i].y);
        }
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.95)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        const windowY = baseY - tentHeight * 0.65;
        const windowPositions = [0, -tentWidth * 0.25, tentWidth * 0.25];
        
        for (const zPos of windowPositions) {
          const wPt = project(xPos, windowY, zPos);
          ctx.beginPath();
          ctx.ellipse(wPt.x, wPt.y, 8, 12, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      };

      const numSegments = 11;
      const segmentSpacing = tentLength / (numSegments - 1);
      
      for (let i = 0; i < numSegments; i++) {
        const xPos = -tentLength / 2 + segmentSpacing * i;
        const angle = (Math.PI / 6) * (i / (numSegments - 1));
        drawFanSegment(xPos, angle, i === numSegments - 1);
      }

      const baseLineLeft = [];
      const baseLineRight = [];
      for (let i = 0; i < numSegments; i++) {
        const xPos = -tentLength / 2 + segmentSpacing * i;
        baseLineLeft.push(project(xPos, 0, -tentWidth / 2));
        baseLineRight.push(project(xPos, 0, tentWidth / 2));
      }
      
      ctx.beginPath();
      ctx.moveTo(baseLineLeft[0].x, baseLineLeft[0].y);
      for (const pt of baseLineLeft) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(baseLineRight[0].x, baseLineRight[0].y);
      for (const pt of baseLineRight) {
        ctx.lineTo(pt.x, pt.y);
      }
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