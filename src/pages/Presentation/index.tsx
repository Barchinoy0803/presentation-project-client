import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { Presentation, Slide, TextBlock, User } from '../../types';
import SlideList from '../../components/SlideList';
import SlideEditor from '../../components/SlideEditor';
import UserList from '../../components/UserList';
// import { useParams } from 'react-router-dom'; 


// const socket = io('https://presentation-project-server.onrender.com');
const socket = io('http://localhost:3000');


const PresentationPage = () => {
  // const { presentationId } = useParams();
  const presentationId = "1"
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!presentationId) return;

    const defaultUserId = uuidv4();
    const newUser: User = {
      id: defaultUserId,
      nickname: 'User-' + defaultUserId.slice(0, 4), 
      role: 'editor',
      presentationId: presentationId,
    };

    setCurrentUser(newUser);
    socket.emit('join-presentation', { user: newUser, presentationId });

    socket.on('presentation-data', (data: Presentation) => {
      setPresentation(data);
      if (!currentSlideId && data.slides.length > 0) {
        setCurrentSlideId(data.slides[0].id);
      }
    });

    socket.on('presentation-update', (data: Presentation) => {
      setPresentation(data);
    });

    socket.on('user-role-changed', (updatedUser: User) => {
      setPresentation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        };
      });
      if (currentUser && updatedUser.id === currentUser.id) {
        setCurrentUser(updatedUser);
      }
    });

    return () => {
      socket.off('presentation-data');
      socket.off('presentation-update');
      socket.off('user-role-changed');
    };
  }, [presentationId]);

  if (!presentation || !currentUser) return <div className="p-4">Loading presentation...</div>;

  const currentSlide = presentation.slides.find((s) => s.id === currentSlideId);
  const isCreator = currentUser.id === presentation.creatorId;

  const updateBlock = (block: TextBlock) => {
    if (!currentSlide) return;
    const updatedSlides = presentation.slides.map((slide) =>
      slide.id === currentSlide.id
        ? { ...slide, blocks: slide.blocks.map((b) => (b.id === block.id ? block : b)) }
        : slide
    );
    const newPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(newPresentation);
    socket.emit('presentation-update', newPresentation);
  };

  const addBlock = () => {
    if (!currentSlide) return;
    const newBlock: TextBlock = {
      id: uuidv4(),
      content: 'New text block. **Markdown** supported!',
      x: 50,
      y: 50,
    };
    const updatedSlides = presentation.slides.map((slide) =>
      slide.id === currentSlide.id ? { ...slide, blocks: [...slide.blocks, newBlock] } : slide
    );
    const newPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(newPresentation);
    socket.emit('presentation-update', newPresentation);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      title: 'New Slide',
      blocks: [],
    };
    const newPresentation = { ...presentation, slides: [...presentation.slides, newSlide] };
    setPresentation(newPresentation);
    setCurrentSlideId(newSlide.id);
    socket.emit('presentation-update', newPresentation);
  };

  const removeSlide = (id: string) => {
    if (presentation.slides.length <= 1) return alert('Cannot delete the last slide');
    const newSlides = presentation.slides.filter((s) => s.id !== id);
    const newPresentation = { ...presentation, slides: newSlides };
    setPresentation(newPresentation);
    if (id === currentSlideId) setCurrentSlideId(newSlides[0].id);
    socket.emit('presentation-update', newPresentation);
  };

  const changeUserRole = (userId: string, newRole: 'editor' | 'viewer') => {
    if (!isCreator || !presentationId) return;
    socket.emit('change-user-role', {
      userId,
      newRole,
      presentationId, // ✅ Qo‘shildi
    });
  };

  return (
    <div className="flex h-screen">
      <SlideList
        slides={presentation.slides}
        currentSlideId={currentSlideId ?? ''}
        onSelectSlide={setCurrentSlideId}
        onAddSlide={addSlide}
        onRemoveSlide={removeSlide}
        isCreator={isCreator}
      />
      <main className="flex-grow bg-gray-50 p-4 relative flex flex-col">
        {currentSlide ? (
          <SlideEditor
            slide={currentSlide}
            isEditable={currentUser.role !== 'viewer'}
            onUpdateBlock={updateBlock}
            onAddBlock={addBlock}
          />
        ) : (
          <div>Select a slide</div>
        )}
      </main>
      <UserList
        users={presentation.users}
        currentUserId={currentUser.id}
        onChangeRole={changeUserRole}
        isCreator={isCreator}
      />
    </div>
  );
}

export default PresentationPage