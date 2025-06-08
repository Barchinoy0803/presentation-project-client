import { useState, useRef, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TextBlock } from '../../types';
import { MdClose } from 'react-icons/md';

interface TextBlockComponentProps {
  block: TextBlock;
  isEditable: boolean;
  isActive: boolean;
  onChangeContent: (id: string, content: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onRemove: () => void;
  onFocus: () => void;
}

export default function TextBlockComponent({
  block,
  isEditable,
  isActive,
  onChangeContent,
  onDrag,
  onRemove,
  onFocus,
}: TextBlockComponentProps) {
  const [position, setPosition] = useState({ x: block.x, y: block.y });
  const [size, setSize] = useState({ width: block.width, height: block.height });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: block.x, y: block.y });
    setSize({ width: block.width, height: block.height });
  }, [block.x, block.y, block.width, block.height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    if ((e.target as HTMLElement).closest('.react-resizable-handle')) return;
    e.stopPropagation();

    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    onFocus();
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !dragStart) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      onDrag(block.id, position.x, position.y);
    }
  };
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragStart]);

  const handleResize = (_: React.SyntheticEvent, data: { size: { width: number; height: number } }) => {
    setSize(data.size);
  };
  const handleResizeStop = () => {
    onChangeContent(block.id, block.content);
  };

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    padding: 8,
    cursor: dragging ? 'grabbing' : 'move',
    outline: isActive ? '2px dashed #3b82f6' : 'none',
    backgroundColor: block.styles.backgroundColor || 'transparent',
    color: block.styles.color || '#000',
    fontWeight: block.styles.bold ? 'bold' : undefined,
    fontStyle: block.styles.italic ? 'italic' : undefined,
    textDecoration: [
      block.styles.underline && 'underline',
      block.styles.strikethrough && 'line-through'
    ].filter(Boolean).join(' ') || 'none',
    textAlign: block.styles.textAlign || 'left',
    userSelect: 'none' as const,
    boxSizing: 'border-box' as const,
  };

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      resizeHandles={['se']}
    >
      <div style={style} onMouseDown={handleMouseDown}>
        {isEditable && isActive && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            style={{ position: 'absolute', top: 4, right: 4 }}
          >
            <MdClose />
          </button>
        )}
        <div
          ref={contentRef}
          contentEditable={isEditable}
          suppressContentEditableWarning
          onInput={(e) => {
            onChangeContent(block.id, (e.target as HTMLDivElement).innerHTML);
          }}
          style={{ width: '100%', height: '100%', overflow: 'auto', outline: 'none', cursor: 'text' }}
        >
          {block.content}
        </div>
      </div>
    </Resizable>
  );
}
