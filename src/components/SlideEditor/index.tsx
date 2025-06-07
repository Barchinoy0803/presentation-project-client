import type { Slide, TextBlock } from '../../types';
import TextBlockComponent from '../TextBlock';

interface SlideEditorProps {
  slide: Slide;
  isEditable: boolean;
  onUpdateBlock: (block: TextBlock) => void;
  onAddBlock: () => void;
  onRemoveBlock: (blockId: string) => void;
}

export default function SlideEditor({ slide, isEditable, onUpdateBlock, onAddBlock, onRemoveBlock }: SlideEditorProps) {
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
      <h3 className="text-center font-semibold py-2 border-b border-gray-300 bg-gray-100">
        {slide.title}
      </h3>
      <button
        onClick={onAddBlock}
        disabled={!isEditable}
        className="absolute top-3 right-3 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 shadow-md"
      >
        +
      </button>
      <div className="w-full h-full relative">
        {slide.blocks.map((block) => (
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