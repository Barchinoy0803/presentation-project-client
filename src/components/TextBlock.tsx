import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { TextBlock } from '../types';

interface TextBlockProps {
  block: TextBlock;
  isEditable: boolean;
  onChangeContent: (id: string, content: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

export default function TextBlock({ block, isEditable, onChangeContent, onDrag }: TextBlockProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(block.content);
  const ref = useRef<HTMLDivElement>(null);
  const dragData = useRef<{ offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    dragData.current = {
      offsetX: e.clientX - block.x,
      offsetY: e.clientY - block.y,
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragData.current) return;
    const newX = e.clientX - dragData.current.offsetX;
    const newY = e.clientY - dragData.current.offsetY;
    onDrag(block.id, newX, newY);
  };

  const handleMouseUp = () => {
    dragData.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    if (isEditable) setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    onChangeContent(block.id, content);
  };

  return (
    <div
      className="absolute cursor-move"
      style={{ left: block.x, top: block.y, minWidth: 150, minHeight: 80, maxWidth: 300 }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      ref={ref}
    >
      {editing ? (
        <textarea
          autoFocus
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full h-full p-1 border border-blue-400 rounded resize-none"
          style={{ fontFamily: 'inherit', fontSize: '14px' }}
        />
      ) : (
        <div className="p-2 bg-white border border-gray-300 rounded shadow-sm min-h-[80px] max-w-[300px] whitespace-pre-wrap break-words">
          <ReactMarkdown>{content}</ReactMarkdown>
          {isEditable && <small className="text-gray-400 italic text-xs">(double-click to edit)</small>}
        </div>
      )}
    </div>
  );
}
