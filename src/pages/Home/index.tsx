import { Button } from '@mui/material'
import { memo } from 'react'
import { useGetPresentationsQuery } from '../../service/api/presentation.api'

const Home = () => {
    const { data } = useGetPresentationsQuery({})
    console.log(data);
    
    return (
        <div className='container mx-auto'>

            <Button variant='contained' >Ncew presentation</Button>
        </div>
    )
}

export default memo(Home)
