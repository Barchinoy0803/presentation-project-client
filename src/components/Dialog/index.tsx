import { useState, memo, type FormEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../service';
import { setPresentationDialog, setUserName } from '../../service/features/presentation.slice';
import { DIALOGTYPE } from '../../types';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreatePresentationMutation } from '../../service/api/presentation.api';

const PresentationDialog = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [title, setTitle] = useState('');

    const { presentationDialog: { isOpen, type, presentationId } } = useSelector((state: RootState) => state.presentation);
    
    const [createPresentation] = useCreatePresentationMutation()

    const handleClose = () => {
        dispatch(setPresentationDialog({ isOpen: false, type: DIALOGTYPE.NEW }));
    };

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (type === DIALOGTYPE.NEW) {
            const { data } = await createPresentation({username, title})
            navigate(`/presentation/${data.presentationId}`)
        } else {
            navigate(`/presentation/${presentationId}`)
        }
        dispatch(setUserName(username))
        handleClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle>
                {type === DIALOGTYPE.NEW ? 'Create new presentation' : 'Enter to the presentation'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="flex flex-col w-[400px] gap-5 mt-3">
                    <TextField
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        label="Username"
                        variant="outlined"
                        required
                    />
                    {type === DIALOGTYPE.NEW && (
                        <TextField
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            label="Presentation name"
                            variant="outlined"
                            required
                        />
                    )}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {type === DIALOGTYPE.NEW ? 'Create' : 'Enter'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(PresentationDialog);
