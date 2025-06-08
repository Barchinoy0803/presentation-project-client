import { IconButton } from '@mui/material';
import type { Slide, TextBlock } from '../../types';
import TextBlockComponent from '../TextBlock';
import { MdOutlineTextFields } from "react-icons/md";
import { BiItalic } from "react-icons/bi";
import { PiTextAUnderlineBold } from "react-icons/pi";
import { FaBold } from "react-icons/fa";

interface SlideEditorProps {
  slide: Slide;
  isEditable: boolean;
  isCreator: boolean;
  isEditor: boolean;
  onUpdateBlock: (block: TextBlock) => void;
  onAddBlock: () => void;
  onRemoveBlock: (blockId: string) => void;
}

export default function SlideEditor({ slide, isEditable, onUpdateBlock, onAddBlock, onRemoveBlock, isCreator, isEditor }: SlideEditorProps) {
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

  return (
    <div className="flex-grow relative bg-white shadow-inner overflow-hidden rounded-lg">
      <div className='flex  items-center justify-between p-3 border-b border-gray-300 bg-gray-100'>
        <h3 className="text-center font-semibold ">
          {slide.title}
        </h3>
        {
          (isCreator || isEditor) &&
          <div className='flex items-center gap-1'>
            <IconButton>
              <FaBold />
            </IconButton>
            <IconButton>
              <PiTextAUnderlineBold />
            </IconButton>
            <IconButton>
              <BiItalic />
            </IconButton>
            <IconButton
              onClick={onAddBlock}
              disabled={!isEditable}
            >
              <MdOutlineTextFields />
            </IconButton>
          </div>
        }
      </div>
      <div className="w-full h-full relative">
        {slide?.blocks?.map((block) => (
          <TextBlockComponent
            key={block.id}
            block={block}
            isEditable={isEditable}
            onChangeContent={handleChangeContent}
            onDrag={handleDrag}
            onRemove={() => onRemoveBlock(block.id)}
          />
        ))}
      </div>
    </div>
  );
}
