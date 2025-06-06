import { useEffect, useState, useCallback, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SlideList from '../../components/SlideList';
import SlideEditor from '../../components/SlideEditor';
import UserList from '../../components/UserList';
import type { Presentation, TextBlock, User, Slide } from '../../types';
import type { RootState } from '../../service';
import debounce from 'lodash/debounce';

const socket: Socket = io('https://presentation-project-server.onrender.com');

const PresentationPage = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const { userName } = useSelector((s: RootState) => s.presentation);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (presentationId && userName) {
      socket.emit('join-presentation', { nickname: userName, presentationId });
    }

    return () => {
      socket.off('presentation-data');
      socket.off('slide-added');
      socket.off('block-updated');
      socket.off('block-added');
      socket.off('block-removed');
      socket.off('slide-removed');
      socket.off('user-role-changed');
      socket.off('slide-navigated');
    };
  }, [presentationId, userName]);

  const currentSlide = useMemo(() => {
    if (!presentation || !currentSlideId) return null;
    return presentation.slides.find(s => s.id === currentSlideId) || null;
  }, [presentation, currentSlideId]);

  const isCreator = useMemo(() => {
    return currentUser?.id === presentation?.creatorId;
  }, [currentUser, presentation]);

  useEffect(() => {
    const onPresentationData = (data: Presentation) => {
      setPresentation(data);
      const me = data.users.find(u => u.nickname === userName);
      if (me) setCurrentUser(me);
      if (!currentSlideId && data.slides.length > 0) {
        setCurrentSlideId(data.slides[0].id);
      }
    };

    const onSlideAdded = (slide: Slide) => {
      setPresentation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          slides: [...prev.slides, slide],
        };
      });
    };

    const onBlockUpdated = ({ slideId, block }: { slideId: string; block: TextBlock }) => {
      if (slideId !== currentSlideId) return;
      setPresentation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          slides: prev.slides.map(slide => 
            slide.id === slideId
              ? {
                  ...slide,
                  blocks: slide.blocks.map(b => b.id === block.id ? block : b),
                }
              : slide
          ),
        };
      });
    };

    const onBlockAdded = ({ slideId, block }: { slideId: string; block: TextBlock }) => {
      setPresentation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          slides: prev.slides.map(slide => 
            slide.id === slideId
              ? {
                  ...slide,
                  blocks: [...slide.blocks, block],
                }
              : slide
          ),
        };
      });
    };

    const onBlockRemoved = ({ slideId, blockId }: { slideId: string; blockId: string }) => {
      setPresentation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          slides: prev.slides.map(slide => 
            slide.id === slideId
              ? {
                  ...slide,
                  blocks: slide.blocks.filter(b => b.id !== blockId),
                }
              : slide
          ),
        };
      });
    };

    const onSlideRemoved = (slideId: string) => {
      setPresentation(prev => {
        if (!prev) return prev;
        const newSlides = prev.slides.filter(s => s.id !== slideId);
        return {
          ...prev,
          slides: newSlides,
        };
      });
    };

    const onUserRoleChanged = (user: User) => {
      setPresentation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map(u => u.id === user.id ? user : u),
        };
      });
      if (currentUser?.id === user.id) {
        setCurrentUser(user);
      }
    };

    const onSlideNavigated = (slideId: string) => {
      setCurrentSlideId(slideId);
    };

    socket.on('presentation-data', onPresentationData);
    socket.on('slide-added', onSlideAdded);
    socket.on('block-updated', onBlockUpdated);
    socket.on('block-added', onBlockAdded);
    socket.on('block-removed', onBlockRemoved);
    socket.on('slide-removed', onSlideRemoved);
    socket.on('user-role-changed', onUserRoleChanged);
    socket.on('slide-navigated', onSlideNavigated);

    return () => {
      socket.off('presentation-data', onPresentationData);
      socket.off('slide-added', onSlideAdded);
      socket.off('block-updated', onBlockUpdated);
      socket.off('block-added', onBlockAdded);
      socket.off('block-removed', onBlockRemoved);
      socket.off('slide-removed', onSlideRemoved);
      socket.off('user-role-changed', onUserRoleChanged);
      socket.off('slide-navigated', onSlideNavigated);
    };
  }, [currentSlideId, currentUser?.id, userName]);

  const debouncedUpdateBlock = useCallback(
    debounce((block: TextBlock) => {
      if (!currentSlide) return;
      socket.emit('update-block', {
        presentationId: presentation?.id,
        block,
        slideId: currentSlide.id,
      });
    }, 100),
    [currentSlide, presentation?.id]
  );

  const updateBlock = (block: TextBlock) => {
    if (!currentSlide) return;
    
    setPresentation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        slides: prev.slides.map(slide => 
          slide.id === currentSlide.id
            ? {
                ...slide,
                blocks: slide.blocks.map(b => b.id === block.id ? block : b),
              }
            : slide
        ),
      };
    });

    debouncedUpdateBlock(block);
  };

  const addBlock = () => {
    if (!currentSlide) return;
    const newBlock: TextBlock = {
      id: uuidv4(),
      content: 'New Text',
      x: 50,
      y: 50,
    };
    socket.emit('add-block', {
      presentationId: presentation?.id,
      block: newBlock,
      slideId: currentSlide.id,
    });
  };

  const removeBlock = (blockId: string) => {
    if (!currentSlide) return;
    socket.emit('remove-block', {
      presentationId: presentation?.id,
      blockId,
      slideId: currentSlide.id,
    });
  };

  const addSlide = () => {
    const newSlide = {
      id: uuidv4(),
      title: 'New Slide',
      blocks: [],
    };
    socket.emit('add-slide', {
      presentationId: presentation?.id,
      slide: newSlide,
    });
  };

  const removeSlide = (slideId: string) => {
    socket.emit('remove-slide', {
      presentationId: presentation?.id,
      slideId,
    });
  };

  const changeUserRole = (userId: string, newRole: 'EDITOR' | 'VIEWER') => {
    if (!isCreator) return;
    socket.emit('change-user-role', {
      userId,
      newRole,
      presentationId: presentation?.id,
    });
  };

  const navigateToSlide = (slideId: string) => {
    setCurrentSlideId(slideId);
    if (isCreator) {
      socket.emit('navigate-slide', {
        presentationId: presentation?.id,
        slideId,
      });
    }
  };

  if (!presentation || !currentUser) {
    return <div className="p-4">Loading presentation...</div>;
  }

  return (
    <div className="flex h-screen">
      <SlideList
        slides={presentation.slides}
        currentSlideId={currentSlideId}
        onSelectSlide={navigateToSlide}
        onAddSlide={addSlide}
        onRemoveSlide={removeSlide}
        isCreator={isCreator}
      />
      <main className="flex-grow bg-gray-50 p-4 flex flex-col">
        {currentSlide ? (
          <SlideEditor
            slide={currentSlide}
            isEditable={currentUser.role !== 'VIEWER'}
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