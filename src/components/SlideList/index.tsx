import type { Slide } from '../../types';
import { GoPlus } from "react-icons/go";
import { FaTrash } from "react-icons/fa6";
import { Button } from '@mui/material';

interface SlideListProps {
  slides: Slide[];
  currentSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide: () => void;
  onRemoveSlide: (id: string) => void;
  isCreator: boolean;
  className?: string;
  isEditor: boolean
}

export default function SlideList({
  slides,
  currentSlideId,
  onSelectSlide,
  onAddSlide,
  onRemoveSlide,
  isCreator,
  className = '',
}: SlideListProps) {
  return (
    <div className={`${className} flex flex-col border-r border-gray-200 bg-white`}>
      <h2 className="font-semibold p-3 border-b border-gray-200">Slides</h2>
      <div className="flex-grow overflow-auto p-2 space-y-2">
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => onSelectSlide(slide.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${slide.id === currentSlideId
              ? 'bg-indigo-100 border border-indigo-300'
              : 'hover:bg-gray-100 border border-transparent'
              }`}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">{slide.title}</span>
              {isCreator && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSlide(slide.id);
                  }}

                  endIcon={<FaTrash className="text-red-500 hover:text-red-700 ml-2" />}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {isCreator && (
        <div className="m-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1">
          <GoPlus className='text-[20px]' />
          <button
            onClick={onAddSlide}
          >
            Add Slide
          </button>
        </div>
      )}
    </div>
  );
}