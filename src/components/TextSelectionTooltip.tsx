
import { useState, useEffect, useCallback, useRef } from "react";
import BeeIcon from "./BeeIcon";

interface TextSelectionTooltipProps {
  onAskBee: (text: string) => void;
}

const TextSelectionTooltip = ({ onAskBee }: TextSelectionTooltipProps) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const tooltipRef = useRef<HTMLButtonElement>(null);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 2 && text.length < 500) {
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setSelectedText(text);
        setShow(true);
      }
    } else {
      // Small delay to allow clicking the tooltip
      setTimeout(() => {
        if (!tooltipRef.current?.matches(":hover")) {
          setShow(false);
        }
      }, 200);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [handleSelection]);

  if (!show) return null;

  return (
    <button
      ref={tooltipRef}
      onClick={() => {
        onAskBee(`What does "${selectedText}" mean?`);
        setShow(false);
        window.getSelection()?.removeAllRanges();
      }}
      className="fixed z-[100] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-medium shadow-lg hover:bg-amber-600 transition-all duration-200 animate-scale-in cursor-pointer"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <BeeIcon className="w-4 h-4" />
      Ask Bee
    </button>
  );
};

export default TextSelectionTooltip;
