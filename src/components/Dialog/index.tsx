import { useState, memo, type FormEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../service';
import { setPresentationData, setPresentationDialog } from '../../service/features/presentation.slice';
import { DIALOGTYPE, type User } from '../../types';
import { TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const PresentationDialog = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [usernameValue, setUsernameValue] = useState('');
    const [titleValue, setTitleValue] = useState('');

    const { presentationDialog: { isOpen, type } } = useSelector((state: RootState) => state.presentationDialog);


    const handleClose = () => {
        dispatch(setPresentationDialog({ isOpen: false, type: DIALOGTYPE.NEW }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userId = uuidv4();

        const newUser: User = {
            id: userId,
            nickname: usernameValue,
            role: 'editor',
        };

        dispatch(setPresentationData({user: newUser, title: titleValue}))


        navigate("/presentation/new")

        handleClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle>
                {type === DIALOGTYPE.NEW ? 'Create new presentation' : 'Update presentation'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} className="flex flex-col w-[400px] gap-5 mt-3">
                    <TextField
                        onChange={(e) => setUsernameValue(e.target.value)}
                        value={usernameValue}
                        label="Username"
                        variant="outlined"
                        required
                    />
                    {type === DIALOGTYPE.NEW && (
                        <TextField
                            onChange={(e) => setTitleValue(e.target.value)}
                            value={titleValue}
                            label="Presentation name"
                            variant="outlined"
                            required
                        />
                    )}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {type === DIALOGTYPE.NEW ? 'Create' : 'Update'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(PresentationDialog);
