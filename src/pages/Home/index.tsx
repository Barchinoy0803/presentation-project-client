import { Box, Button } from '@mui/material'
import { memo } from 'react'
import { useGetPresentationsQuery } from '../../service/api/presentation.api'
import PresentationDialog from "../../components/Dialog"
import { useDispatch } from 'react-redux'
import { DIALOGTYPE, type Presentation, } from '../../types'
import { setPresentationDialog } from '../../service/features/presentation.slice'

const Home = () => {
    const { data } = useGetPresentationsQuery({})
    const dispatch = useDispatch()

    const handleOpenDialog = (isNew: boolean, presentationId?: string) => {
        dispatch(setPresentationDialog({
            isOpen: true, type: isNew ? DIALOGTYPE.NEW : DIALOGTYPE.EXIST,
            presentationId,
        }))
    }

    return (
        <>
            <div className='container mx-auto mt-5 flex gap-5 justify-end'>
                <Button onClick={() => handleOpenDialog(true)} variant='contained' >New presentation</Button>
                <PresentationDialog />
            </div>
            <div className='container mx-auto grid grid-cols-5 gap-5 h-[300px] mt-[30px]'>
                {
                    data?.map((item: Presentation) => (
                        <Box onClick={() => handleOpenDialog(false, item.id)} key={item.id} className='flex flex-col gap-1 shadow-lg p-3 rounded-[10px] cursor-pointer'>
                            <img className='h-[200px]' src="" alt="" />
                            <p className='text-[20px]'>{item.title}</p>
                            {
                                item?.users?.map((user) => (
                                    <div className='flex gap-2' key={user.id}>
                                        <strong>{user.nickname}</strong>
                                        <p>({user.role})</p>
                                    </div>
                                ))
                            }
                        </Box>
                    ))
                }
            </div>
        </>
    )
}

export default memo(Home)
