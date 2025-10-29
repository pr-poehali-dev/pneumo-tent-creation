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

      const numArcs = 13;
      const arcSpacing = tentLength / (numArcs - 1);

      for (let arcIdx = 0; arcIdx < numArcs; arcIdx++) {
        const xPos = -tentLength / 2 + arcIdx * arcSpacing;
        const distFromCenter = Math.abs(xPos) / (tentLength / 2);
        const arcAngle = (1 - distFromCenter) * (Math.PI / 2.5);
        
        const numSegments = 30;
        const arcPoints = [];
        
        for (let i = 0; i <= numSegments; i++) {
          const t = i / numSegments;
          const angle = -arcAngle + (2 * arcAngle * t);
          
          const radius = tentWidth / 2;
          const zBase = Math.sin(angle) * radius;
          const yBase = -Math.cos(angle) * tentHeight;
          
          arcPoints.push(project(xPos, yBase, zBase));
        }

        const gradient = ctx.createLinearGradient(
          arcPoints[0].x, arcPoints[0].y,
          arcPoints[numSegments].x, arcPoints[numSegments].y
        );
        gradient.addColorStop(0, `rgba(230, 60, 40, ${0.75 + distFromCenter * 0.15})`);
        gradient.addColorStop(0.5, `rgba(250, 80, 50, ${0.85 + distFromCenter * 0.1})`);
        gradient.addColorStop(1, `rgba(230, 60, 40, ${0.75 + distFromCenter * 0.15})`);

        ctx.beginPath();
        ctx.moveTo(arcPoints[0].x, arcPoints[0].y);
        for (let i = 1; i < arcPoints.length; i++) {
          ctx.lineTo(arcPoints[i].x, arcPoints[i].y);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (arcIdx > 0 && arcIdx < numArcs - 1) {
          const topWindowAngle = 0;
          const topZ = Math.sin(topWindowAngle) * (tentWidth / 2);
          const topY = -Math.cos(topWindowAngle) * tentHeight * 0.9;
          const topProj = project(xPos, topY, topZ);
          
          ctx.beginPath();
          ctx.arc(topProj.x, topProj.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
          ctx.lineWidth = 2;
          ctx.stroke();

          const sideAngles = [-arcAngle * 0.6, arcAngle * 0.6];
          for (const sideAngle of sideAngles) {
            const sideZ = Math.sin(sideAngle) * (tentWidth / 2);
            const sideY = -Math.cos(sideAngle) * tentHeight * 0.7;
            const sideProj = project(xPos, sideY, sideZ);
            
            ctx.beginPath();
            ctx.ellipse(sideProj.x, sideProj.y, 8, 16, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          const bottomAngles = [-arcAngle * 0.4, 0, arcAngle * 0.4];
          for (const bottomAngle of bottomAngles) {
            const bottomZ = Math.sin(bottomAngle) * (tentWidth / 2);
            const bottomY = -Math.cos(bottomAngle) * tentHeight * 0.35;
            const bottomProj = project(xPos, bottomY, bottomZ);
            
            ctx.beginPath();
            ctx.arc(bottomProj.x, bottomProj.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      const fabricSegments = 20;
      for (let i = 0; i < numArcs - 1; i++) {
        const x1 = -tentLength / 2 + i * arcSpacing;
        const x2 = -tentLength / 2 + (i + 1) * arcSpacing;
        
        const distFromCenter1 = Math.abs(x1) / (tentLength / 2);
        const distFromCenter2 = Math.abs(x2) / (tentLength / 2);
        const arcAngle1 = (1 - distFromCenter1) * (Math.PI / 2.5);
        const arcAngle2 = (1 - distFromCenter2) * (Math.PI / 2.5);

        for (let j = 0; j < fabricSegments; j++) {
          const t1 = j / fabricSegments;
          const t2 = (j + 1) / fabricSegments;
          
          const angle1 = -arcAngle1 + (2 * arcAngle1 * t1);
          const angle2 = -arcAngle1 + (2 * arcAngle1 * t2);
          const angle3 = -arcAngle2 + (2 * arcAngle2 * t2);
          const angle4 = -arcAngle2 + (2 * arcAngle2 * t1);

          const p1 = project(x1, -Math.cos(angle1) * tentHeight, Math.sin(angle1) * (tentWidth / 2));
          const p2 = project(x1, -Math.cos(angle2) * tentHeight, Math.sin(angle2) * (tentWidth / 2));
          const p3 = project(x2, -Math.cos(angle3) * tentHeight, Math.sin(angle3) * (tentWidth / 2));
          const p4 = project(x2, -Math.cos(angle4) * tentHeight, Math.sin(angle4) * (tentWidth / 2));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          const avgDist = (distFromCenter1 + distFromCenter2) / 2;
          const brightness = 0.65 + (1 - avgDist) * 0.25;
          ctx.fillStyle = `rgba(${200 * brightness}, ${50 * brightness}, ${35 * brightness}, 0.4)`;
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(255, 150, 140, 0.2)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      const windowRows = [
        { zAngleFactor: 0, yHeightFactor: 0.9, radius: 6 },
        { zAngleFactor: 0.55, yHeightFactor: 0.7, radius: 8, ellipse: true },
        { zAngleFactor: -0.55, yHeightFactor: 0.7, radius: 8, ellipse: true },
        { zAngleFactor: 0.35, yHeightFactor: 0.4, radius: 5 },
        { zAngleFactor: -0.35, yHeightFactor: 0.4, radius: 5 },
        { zAngleFactor: 0, yHeightFactor: 0.4, radius: 5 }
      ];

      for (let arcIdx = 1; arcIdx < numArcs - 1; arcIdx++) {
        const xPos = -tentLength / 2 + arcIdx * arcSpacing;
        const distFromCenter = Math.abs(xPos) / (tentLength / 2);
        const arcAngle = (1 - distFromCenter) * (Math.PI / 2.5);

        for (const row of windowRows) {
          const angle = arcAngle * row.zAngleFactor;
          const zPos = Math.sin(angle) * (tentWidth / 2);
          const yPos = -Math.cos(angle) * tentHeight * row.yHeightFactor;
          const windowProj = project(xPos, yPos, zPos);

          ctx.beginPath();
          if (row.ellipse) {
            ctx.ellipse(windowProj.x, windowProj.y, row.radius, row.radius * 2, 0, 0, Math.PI * 2);
          } else {
            ctx.arc(windowProj.x, windowProj.y, row.radius, 0, Math.PI * 2);
          }
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
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