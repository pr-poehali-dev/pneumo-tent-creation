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

      const scale = 13;
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
      const numLongitudinal = 30;

      const getArcWidthScale = (xPos: number) => {
        const xNorm = xPos / (tentLength / 2);
        return Math.sqrt(1 - xNorm * xNorm);
      };

      for (let i = 0; i < numArcs - 1; i++) {
        const t1 = i / (numArcs - 1);
        const t2 = (i + 1) / (numArcs - 1);
        
        const xNorm1 = t1 * 2 - 1;
        const xNorm2 = t2 * 2 - 1;
        
        const x1 = xNorm1 * (tentLength / 2);
        const x2 = xNorm2 * (tentLength / 2);
        
        const widthScale1 = getArcWidthScale(x1);
        const widthScale2 = getArcWidthScale(x2);

        for (let j = 0; j < numLongitudinal; j++) {
          const angle1 = (j / numLongitudinal) * Math.PI;
          const angle2 = ((j + 1) / numLongitudinal) * Math.PI;

          const z1_1 = Math.cos(angle1) * (tentWidth / 2) * widthScale1;
          const y1 = -Math.sin(angle1) * tentHeight * widthScale1;

          const z2_1 = Math.cos(angle2) * (tentWidth / 2) * widthScale1;
          const y2 = -Math.sin(angle2) * tentHeight * widthScale1;

          const z1_2 = Math.cos(angle1) * (tentWidth / 2) * widthScale2;
          const y1_2 = -Math.sin(angle1) * tentHeight * widthScale2;

          const z2_2 = Math.cos(angle2) * (tentWidth / 2) * widthScale2;
          const y2_2 = -Math.sin(angle2) * tentHeight * widthScale2;

          const p1 = project(x1, y1, z1_1);
          const p2 = project(x1, y2, z2_1);
          const p3 = project(x2, y2_2, z2_2);
          const p4 = project(x2, y1_2, z1_2);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          const heightFactor = (Math.sin(angle1) + Math.sin(angle2)) / 2;
          const brightness = 0.7 + heightFactor * 0.25;
          const red = Math.floor(230 * brightness);
          const green = Math.floor(65 * brightness);
          const blue = Math.floor(45 * brightness);
          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.85)`;
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(255, 140, 130, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      for (let arcIdx = 0; arcIdx < numArcs; arcIdx++) {
        const t = arcIdx / (numArcs - 1);
        const xNorm = t * 2 - 1;
        const xPos = xNorm * (tentLength / 2);
        const widthScale = getArcWidthScale(xPos);
        
        const arcPoints = [];
        const numSegments = 40;
        
        for (let i = 0; i <= numSegments; i++) {
          const angle = (i / numSegments) * Math.PI;
          
          const zPos = Math.cos(angle) * (tentWidth / 2) * widthScale;
          const yPos = -Math.sin(angle) * tentHeight * widthScale;
          
          arcPoints.push(project(xPos, yPos, zPos));
        }

        ctx.beginPath();
        ctx.moveTo(arcPoints[0].x, arcPoints[0].y);
        for (let i = 1; i < arcPoints.length; i++) {
          ctx.lineTo(arcPoints[i].x, arcPoints[i].y);
        }
        ctx.strokeStyle = 'rgba(200, 50, 35, 0.9)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      const windowRows = [
        { angleRatio: 0.5, heightOffset: 0.95, width: 12, height: 12 },
        { angleRatio: 0.35, heightOffset: 0.8, width: 14, height: 28 },
        { angleRatio: 0.65, heightOffset: 0.8, width: 14, height: 28 },
        { angleRatio: 0.25, heightOffset: 0.5, width: 10, height: 10 },
        { angleRatio: 0.5, heightOffset: 0.5, width: 10, height: 10 },
        { angleRatio: 0.75, heightOffset: 0.5, width: 10, height: 10 }
      ];

      for (let sectionIdx = 0; sectionIdx < numArcs - 1; sectionIdx++) {
        const t = (sectionIdx + 0.5) / (numArcs - 1);
        const xNorm = t * 2 - 1;
        const xMid = xNorm * (tentLength / 2);
        const widthScale = getArcWidthScale(xMid);

        for (const win of windowRows) {
          const angle = Math.PI * win.angleRatio;
          const zCenter = Math.cos(angle) * (tentWidth / 2) * widthScale * 0.98;
          const yCenter = -Math.sin(angle) * tentHeight * widthScale * win.heightOffset;
          
          const normal = {
            x: 0,
            y: -Math.sin(angle),
            z: Math.cos(angle)
          };
          
          const tangentX = { x: 1, y: 0, z: 0 };
          const tangentY = {
            x: 0,
            y: -Math.cos(angle),
            z: -Math.sin(angle)
          };
          
          const corners = [
            { dx: -win.width / 2, dy: -win.height / 2 },
            { dx: win.width / 2, dy: -win.height / 2 },
            { dx: win.width / 2, dy: win.height / 2 },
            { dx: -win.width / 2, dy: win.height / 2 }
          ];
          
          const projectedCorners = corners.map(c => {
            const x = xMid + c.dx * tangentX.x + c.dy * tangentY.x;
            const y = yCenter + c.dx * tangentX.y + c.dy * tangentY.y;
            const z = zCenter + c.dx * tangentX.z + c.dy * tangentY.z;
            return project(x, y, z);
          });
          
          ctx.beginPath();
          ctx.moveTo(projectedCorners[0].x, projectedCorners[0].y);
          for (let i = 1; i < projectedCorners.length; i++) {
            ctx.lineTo(projectedCorners[i].x, projectedCorners[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(180, 220, 255, 0.7)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(100, 150, 200, 0.9)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      const entranceWidthRatio = 0.6;
      const entranceHeightRatio = 0.85;
      const entranceX = tentLength / 2;
      const widthScaleEntrance = getArcWidthScale(entranceX);
      
      const entranceSegments = 30;
      const entrancePoints = [];
      
      for (let i = 0; i <= entranceSegments; i++) {
        const t = i / entranceSegments;
        const angle = Math.PI * (0.5 - entranceWidthRatio / 2) + (Math.PI * entranceWidthRatio) * t;
        
        if (t === 0 || t === 1) {
          entrancePoints.push(project(
            entranceX,
            0,
            Math.cos(angle) * (tentWidth / 2) * widthScaleEntrance
          ));
        } else {
          entrancePoints.push(project(
            entranceX,
            -Math.sin(angle) * tentHeight * widthScaleEntrance * entranceHeightRatio,
            Math.cos(angle) * (tentWidth / 2) * widthScaleEntrance
          ));
        }
      }
      
      ctx.beginPath();
      ctx.moveTo(entrancePoints[0].x, entrancePoints[0].y);
      for (let i = 1; i < entrancePoints.length; i++) {
        ctx.lineTo(entrancePoints[i].x, entrancePoints[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(40, 40, 60, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 80, 100, 1)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      if (isRotating && !isDragging) {
        setRotation(prev => ({
          ...prev,
          y: prev.y + 0.0005
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