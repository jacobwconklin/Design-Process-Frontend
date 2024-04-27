import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import './Router.scss';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;