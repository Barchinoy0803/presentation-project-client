import { useState, useRef, useEffect } from 'react';
import type { TextBlock } from '../../types';
import ContentEditable, { type ContentEditableEvent } from 'react-contenteditable';

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
  onFocus
}: TextBlockComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const contentEditableRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (evt: ContentEditableEvent) => {
    onChangeContent(block.id, evt.target.value);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setStartPos({
        x: e.clientX - block.x,
        y: e.clientY - block.y
      });
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isEditable) return;
    
    onDrag(
      block.id,
      e.clientX - startPos.x,
      e.clientY - startPos.y
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startPos]);

  useEffect(() => {
    if (isActive && contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  }, [isActive]);

  const getStyle = () => ({
    position: 'absolute' as const,
    left: `${block.x}px`,
    top: `${block.y}px`,
    width: `${block.width}px`,
    minHeight: `${block.height}px`,
    padding: '8px',
    cursor: isEditable ? 'move' : 'default',
    outline: isActive ? '2px dashed #3b82f6' : 'none',
    backgroundColor: block.styles.backgroundColor || 'transparent',
    color: block.styles.color || '#000000',
    fontWeight: block.styles.bold ? 'bold' : 'normal',
    fontStyle: block.styles.italic ? 'italic' : 'normal',
    textDecoration: [
      block.styles.underline ? 'underline' : '',
      block.styles.strikethrough ? 'line-through' : ''
    ].join(' '),
    textAlign: block.styles.textAlign || 'left'
  });

  return (
    <div
      ref={blockRef}
      style={getStyle()}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      <ContentEditable
        innerRef={contentEditableRef}
        html={block.content}
        disabled={!isEditable}
        onChange={handleContentChange}
        tagName="div"
        style={{
          width: '100%',
          height: '100%',
          outline: 'none'
        }}
      />
    </div>
  );
}