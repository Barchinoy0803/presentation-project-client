import type { Slide, TextBlock } from '../../types';
import TextBlockComponent from '../TextBlock';

interface SlideEditorProps {
  slide: Slide;
  isEditable: boolean;
  onUpdateBlock: (block: TextBlock) => void;
  onAddBlock: () => void;
}

export default function SlideEditor({ slide, isEditable, onUpdateBlock, onAddBlock }: SlideEditorProps) {
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
    <div className="flex-grow relative bg-white shadow-inner overflow-hidden">
      <h3 className="text-center font-semibold py-2 border-b border-gray-300">{slide.title}</h3>
      <button
        onClick={onAddBlock}
        disabled={!isEditable}
        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        + Add Text Block
      </button>
      <div className="w-full h-full relative">
        {slide.blocks.map((block) => (
          <TextBlockComponent
            key={block.id}
            block={block}
            isEditable={isEditable}
            onChangeContent={handleChangeContent}
            onDrag={handleDrag}
          />
        ))}
      </div>
    </div>
  );
}
