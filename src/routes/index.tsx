import { memo } from 'react'
import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import PresentationPage from '../pages/Presentation'

const MainRouter = () => {
    return (
        useRoutes([
            {
                path: '/', element: <Home />
            },
            {
                path: '/presentation/:presentationId', element: <PresentationPage/>
            }
        ])
    )
}

export default memo(MainRouter)
