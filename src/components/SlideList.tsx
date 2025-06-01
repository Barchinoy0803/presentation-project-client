import type { Slide } from '../types.ts';

interface SlideListProps {
  slides: Slide[];
  currentSlideId: string;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onRemoveSlide: (id: string) => void;
  isCreator: boolean;
}

export default function SlideList({
  slides,
  currentSlideId,
  onSelectSlide,
  onAddSlide,
  onRemoveSlide,
  isCreator,
}: SlideListProps) {
  return (
    <div className="w-48 bg-gray-100 border-r border-gray-300 p-2 flex flex-col">
      <h2 className="font-semibold mb-2">Slides</h2>
      <div className="flex-grow overflow-auto">
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => onSelectSlide(slide.id)}
            className={`cursor-pointer p-2 rounded mb-1 ${
              slide.id === currentSlideId ? 'bg-blue-400 text-white' : 'hover:bg-blue-100'
            }`}
          >
            {slide.title}
            {isCreator && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSlide(slide.id);
                }}
                className="ml-2 text-red-600 hover:text-red-800"
                title="Delete Slide"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
      {isCreator && (
        <button
          onClick={onAddSlide}
          className="mt-2 py-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Slide
        </button>
      )}
    </div>
  );
}
