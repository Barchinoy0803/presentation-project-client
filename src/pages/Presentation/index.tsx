import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { Presentation, Slide, TextBlock, User } from '../../types';
import SlideList from '../../components/SlideList';
import SlideEditor from '../../components/SlideEditor';
import UserList from '../../components/UserList';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../service';

const socket = io('https://presentation-project-server.onrender.com');

const PresentationPage = () => {
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { userName } = useSelector((state: RootState) => state.presentation);

  useEffect(() => {
    socket.emit('join-presentation', {
      nickname: userName,
      presentationId,
    });
  }, [presentationId]);

  useEffect(() => {
    socket.on('presentation-data', (data: Presentation) => {
      setPresentation(data);
      const matchedUser = data.users.find((u) => u.nickname === userName);
      if (matchedUser) {
        setCurrentUser(matchedUser);
      }
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
  }, [currentSlideId, currentUser, userName]);

  if (!presentation || !currentUser) return <div className="p-4">Loading presentation...</div>;

  const currentSlide = presentation.slides.find((s) => s.id === currentSlideId);
  const isCreator = currentUser.id === presentation.creatorId;

  const updateBlock = (block: TextBlock) => {
    if (!currentSlide) return;
    const updatedSlide = {
      ...currentSlide,
      blocks: currentSlide.blocks.map((b) => (b.id === block.id ? block : b)),
    };
    socket.emit('update-slide', {
      presentationId: presentation.id,
      slide: updatedSlide,
    });
  };

  const addBlock = () => {
    if (!currentSlide) return;
    const newBlock: TextBlock = {
      id: uuidv4(),
      content: 'New text block. **Markdown** supported!',
      x: 50,
      y: 50,
    };
    const updatedSlide = {
      ...currentSlide,
      blocks: [...currentSlide.blocks, newBlock],
    };
    socket.emit('update-slide', {
      presentationId: presentation.id,
      slide: updatedSlide,
    });
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: uuidv4(),
      title: 'New Slide',
      blocks: [],
    };
    socket.emit('add-slide', {
      presentationId: presentation.id,
      slide: newSlide,
    });
  };

  const removeSlide = (id: string) => {
    socket.emit('remove-slide', {
      presentationId: presentation.id,
      slideId: id,
    });
  };

  const changeUserRole = (userId: string, newRole: 'editor' | 'viewer') => {
    if (!isCreator) return;
    socket.emit('change-user-role', {
      userId,
      newRole,
      presentationId: presentation.id,
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
        currentUserId={currentUser.id!}
        onChangeRole={changeUserRole}
        isCreator={isCreator}
      />
    </div>
  );
};

export default PresentationPage;
