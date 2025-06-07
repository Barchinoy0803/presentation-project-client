import { useState, useRef } from 'react';
import type { TextBlock } from '../../types';

interface TextBlockProps {
  block: TextBlock;
  isEditable: boolean;
  onChangeContent: (id: string, content: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onRemove?: () => void;
}

export default function TextBlock({
  block,
  isEditable,
  onChangeContent,
  onDrag,
  onResize,
  onRemove,
}: TextBlockProps) {
  const [editing, setEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragData = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable || editing) return;
    dragData.current = { offsetX: e.clientX - block.x, offsetY: e.clientY - block.y };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragData.current) return;
    onDrag(block.id, e.clientX - dragData.current.offsetX, e.clientY - dragData.current.offsetY);
  };

  const handleMouseUp = () => {
    dragData.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    if (isEditable) setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    const newText = contentRef.current?.innerText || '';
    onChangeContent(block.id, newText);
  };

  const resizeRef = useRef<HTMLDivElement>(null);
  const resizing = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizing.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: block.width || 200,
      startH: block.height || 100,
    };
    window.addEventListener('mousemove', resizeMove);
    window.addEventListener('mouseup', stopResize);
  };

  const resizeMove = (e: MouseEvent) => {
    if (!resizing.current) return;
    const newWidth = resizing.current.startW + (e.clientX - resizing.current.startX);
    const newHeight = resizing.current.startH + (e.clientY - resizing.current.startY);
    onResize?.(block.id, newWidth, newHeight);
  };

  const stopResize = () => {
    resizing.current = null;
    window.removeEventListener('mousemove', resizeMove);
    window.removeEventListener('mouseup', stopResize);
  };

  return (
    <div
      className="absolute border border-blue-400"
      style={{
        left: block.x,
        top: block.y,
        width: block.width || 200,
        height: block.height || 100,
        cursor: editing ? 'text' : 'move',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative h-full w-full bg-white shadow-sm">
        <div
          ref={contentRef}
          className="w-full h-full p-2 outline-none overflow-auto"
          contentEditable={isEditable && editing}
          suppressContentEditableWarning
          onBlur={handleBlur}
        >
          {block.content}
        </div>

        {isEditable && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
          >
            ×
          </button>
        )}

        {isEditable && (
          <div
            ref={resizeRef}
            onMouseDown={startResize}
            className="absolute w-3 h-3 bg-blue-500 bottom-0 right-0 cursor-se-resize z-10"
          />
        )}
      </div>
    </div>
  );
}
