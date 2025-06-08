import { 
  IconButton, 
  ToggleButton, 
  ToggleButtonGroup, 
  Tooltip,
  Popover
} from '@mui/material';
import type { Slide, TextBlock } from '../../types';
import TextBlockComponent from '../TextBlock';
import { MdOutlineTextFields } from "react-icons/md";
import { BiItalic } from "react-icons/bi";
import { PiTextAUnderlineBold } from "react-icons/pi";
import { 
  FaBold, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight,
} from "react-icons/fa";
import { LuStrikethrough } from "react-icons/lu";
import { RiFontColor } from "react-icons/ri";
import { BsPalette } from "react-icons/bs";
import { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

interface SlideEditorProps {
  slide: Slide;
  isEditable: boolean;
  isCreator: boolean;
  isEditor: boolean;
  onUpdateBlock: (block: TextBlock) => void;
  onAddBlock: () => void;
  onRemoveBlock: (blockId: string) => void;
}

export default function SlideEditor({ 
  slide, 
  isEditable, 
  onUpdateBlock, 
  onAddBlock, 
  onRemoveBlock, 
  isCreator, 
  isEditor 
}: SlideEditorProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [colorPickerTarget, setColorPickerTarget] = useState<'text' | 'background'>('text');
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  const bgButtonRef = useRef<HTMLButtonElement>(null);

  const activeBlock = activeBlockId ? slide.blocks.find(b => b.id === activeBlockId) : null;

  const handleDrag = (id: string, x: number, y: number) => {
    const block = slide.blocks.find((b) => b.id === id);
    if (!block) return;
    onUpdateBlock({ ...block, x, y });
  };

  const handleChangeContent = (id: string, content: string) => {
    const block = slide.blocks.find((b) => b.id === id);
    if (!block) return;
    onUpdateBlock({ ...block, content });
  };

  const handleBlockFocus = (id: string) => {
    setActiveBlockId(id);
  };

  const toggleTextStyle = (style: keyof TextBlock['styles']) => {
    if (!activeBlock) return;
    
    const newStyles = {
      ...activeBlock.styles,
      [style]: !activeBlock.styles[style]
    };
    
    onUpdateBlock({ ...activeBlock, styles: newStyles });
  };

  const setTextAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (!activeBlock) return;
    onUpdateBlock({ 
      ...activeBlock, 
      styles: { 
        ...activeBlock.styles, 
        textAlign: alignment 
      } 
    });
  };

  const openColorPicker = (target: 'text' | 'background', event: React.MouseEvent<HTMLElement>) => {
    setColorPickerTarget(target);
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorChange = (color: string) => {
    if (!activeBlock) return;
    
    const newStyles = { ...activeBlock.styles };
    if (colorPickerTarget === 'text') {
      newStyles.color = color;
    } else {
      newStyles.backgroundColor = color;
    }
    
    onUpdateBlock({ ...activeBlock, styles: newStyles });
  };

  const closeColorPicker = () => {
    setColorPickerAnchor(null);
  };

  return (
    <div className="flex-grow relative bg-white shadow-inner overflow-hidden rounded-lg">
      <div className='flex items-center justify-between p-3 border-b border-gray-300 bg-gray-100'>
        <h3 className="text-center font-semibold">
          {slide.title}
        </h3>
        {(isCreator || isEditor) && (
          <div className='flex items-center gap-1'>
            <ToggleButtonGroup size="small" exclusive>
              <Tooltip title="Bold (Ctrl+B)">
                <ToggleButton
                  value="bold"
                  selected={activeBlock?.styles?.bold || false}
                  onClick={() => toggleTextStyle('bold')}
                  disabled={!activeBlock}
                >
                  <FaBold />
                </ToggleButton>
              </Tooltip>
              
              <Tooltip title="Italic (Ctrl+I)">
                <ToggleButton
                  value="italic"
                  selected={activeBlock?.styles?.italic || false}
                  onClick={() => toggleTextStyle('italic')}
                  disabled={!activeBlock}
                >
                  <BiItalic />
                </ToggleButton>
              </Tooltip>
              
              <Tooltip title="Underline (Ctrl+U)">
                <ToggleButton
                  value="underline"
                  selected={activeBlock?.styles?.underline || false}
                  onClick={() => toggleTextStyle('underline')}
                  disabled={!activeBlock}
                >
                  <PiTextAUnderlineBold />
                </ToggleButton>
              </Tooltip>
              
              <Tooltip title="Strikethrough">
                <ToggleButton
                  value="strikethrough"
                  selected={activeBlock?.styles?.strikethrough || false}
                  onClick={() => toggleTextStyle('strikethrough')}
                  disabled={!activeBlock}
                >
                  <LuStrikethrough />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            
            <ToggleButtonGroup size="small" exclusive className="ml-2">
              <Tooltip title="Align Left">
                <ToggleButton
                  value="left"
                  selected={activeBlock?.styles?.textAlign === 'left'}
                  onClick={() => setTextAlignment('left')}
                  disabled={!activeBlock}
                >
                  <FaAlignLeft />
                </ToggleButton>
              </Tooltip>
              
              <Tooltip title="Align Center">
                <ToggleButton
                  value="center"
                  selected={activeBlock?.styles?.textAlign === 'center'}
                  onClick={() => setTextAlignment('center')}
                  disabled={!activeBlock}
                >
                  <FaAlignCenter />
                </ToggleButton>
              </Tooltip>
              
              <Tooltip title="Align Right">
                <ToggleButton
                  value="right"
                  selected={activeBlock?.styles?.textAlign === 'right'}
                  onClick={() => setTextAlignment('right')}
                  disabled={!activeBlock}
                >
                  <FaAlignRight />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            
            <Tooltip title="Text Color">
              <IconButton
                ref={colorButtonRef}
                onClick={(e) => openColorPicker('text', e)}
                disabled={!activeBlock}
              >
                <RiFontColor style={{ 
                  color: activeBlock?.styles?.color || '#000000' 
                }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Background Color">
              <IconButton
                ref={bgButtonRef}
                onClick={(e) => openColorPicker('background', e)}
                disabled={!activeBlock}
              >
                <BsPalette style={{
                  color: activeBlock?.styles?.backgroundColor || 'transparent'
                }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Add Text Block">
              <IconButton
                onClick={onAddBlock}
                disabled={!isEditable}
              >
                <MdOutlineTextFields />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
      
      <div className="w-full h-full relative shundayligicha topwiraylik">
        {slide?.blocks?.map((block) => (
          <TextBlockComponent
            key={block.id}
            block={block}
            isEditable={isEditable}
            onChangeContent={handleChangeContent}
            onDrag={handleDrag}
            onRemove={() => onRemoveBlock(block.id)}
            onFocus={() => handleBlockFocus(block.id)}
            isActive={activeBlockId === block.id}
          />
        ))}
      </div>
      
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={closeColorPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="p-4">
          <HexColorPicker
            color={
              colorPickerTarget === 'text'
                ? activeBlock?.styles?.color || '#000000'
                : activeBlock?.styles?.backgroundColor || '#FFFFFF'
            }
            onChange={handleColorChange}
          />
        </div>
      </Popover>
    </div>
  );
}