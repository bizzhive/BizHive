import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

const SignaturePad = ({ onSave }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#111827";
  }, []);

  const getPoint = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) {
        return null;
      }

      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getPoint(event);

    if (!context || !point) {
      return;
    }

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getPoint(event);

    if (!context || !point) {
      return;
    }

    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) {
      return;
    }

    setIsDrawing(false);

    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    onSave("");
  };

  return (
    <div className="relative overflow-hidden rounded-md border bg-white">
      <canvas
        ref={canvasRef}
        className="h-[200px] w-full touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={clear}
        title="Clear Signature"
      >
        <Eraser className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SignaturePad;
