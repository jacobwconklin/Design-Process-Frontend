import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import './Router.scss';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import Activities from './Components/Activities/Activities';

// Router
const Router = () => {

    return (
        <div className='Router'>
            <Routes>
                {/* example Route with query params <Route path="play/:type/:code?" element={<PlayScreen />} /> */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="activities" element={<Activities />} />
                <Route path="*" element={<Home />} />
            </ Routes>
        </div>
    )
}

export default Router;