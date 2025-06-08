import { useState, useRef, useEffect } from 'react';
import type { TextBlock } from '../../types';
import ContentEditable, { type ContentEditableEvent } from 'react-contenteditable';
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
  onChangeContent,
  onDrag,
  onRemove,
  onFocus,
  isActive,
}: TextBlockComponentProps) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState({ x: block.x, y: block.y });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({ x: block.x, y: block.y });
  }, [block.x, block.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.stopPropagation();
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !dragStart) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
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
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragStart]);

const getStyle = () => ({
  position: 'absolute' as const,
  left: `${position.x}px`,
  top: `${position.y}px`,
  width: `${block.width}px`,
  minHeight: `${block.height}px`,
  padding: '8px',
  cursor: isEditable ? (dragging ? 'grabbing' : 'move') : 'default',
  outline: isActive ? '2px dashed #3b82f6' : 'none',
  backgroundColor: block.styles.backgroundColor || 'transparent',
  color: block.styles.color || '#000000',
  fontWeight: block.styles.bold ? 'bold' : 'normal',
  fontStyle: block.styles.italic ? 'italic' : 'normal',
  textDecoration: [
    block.styles.underline ? 'underline' : '',
    block.styles.strikethrough ? 'line-through' : '',
  ].filter(Boolean).join(' ') || 'none',
  textAlign: block.styles.textAlign || 'left',
  userSelect: (isEditable ? 'text' : 'none') as React.CSSProperties['userSelect'],
  whiteSpace: 'pre-wrap',
  borderRadius: 4,
  boxSizing: 'border-box' as const,
});

  const handleContentChange = (evt: ContentEditableEvent) => {
    onChangeContent(block.id, evt.target.value);
  };

  return (
    <div 
      style={getStyle()} 
      onMouseDown={handleMouseDown} 
      onClick={(e) => { e.stopPropagation(); onFocus(); }} 
      ref={ref}
    >
      {(isEditable && isActive) ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Remove block"
          className="absolute top-0 right-0 p-1 m-1 text-red-600 hover:text-red-800"
          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', zIndex: 10 }}
        >
          <MdClose />
        </button>
      ): (<></>)}
      <ContentEditable
        html={block.content}
        disabled={!isEditable}
        onChange={handleContentChange}
        onFocus={() => onFocus()}
        tagName="div"
        spellCheck={true}
        style={{
          outline: 'none',
          width: '100%',
          minHeight: '100%',
          cursor: isEditable ? 'text' : 'default',
          fontSize: '1rem',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
