import { useNavigate } from 'react-router-dom';
import './NavHeader.scss';
import VerificationModal from '../Reusable/VerificationModal';
import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { UserContextType } from '../Utils/Types';
import { UserOutlined } from '@ant-design/icons';
import { clearObjectFromStorage } from '../Utils/Utils';
import { Button, Tooltip } from 'antd';
// import { postRequest } from '../Utils/Api';
// import { clearObjectFromStorage } from '../Utils/Utils';

// NavHeader
const NavHeader = () => {

    const navigate = useNavigate();
    const [showReturnHomeAndLogOutModal, setShowReturnHomeAndLogOutModal] = useState(false);
    const [showReturnHomeModal, setShowReturnHomeModal] = useState(false);
    const { email, setEmail, setAuthToken, setIsAdmin } = useContext(UserContext) as UserContextType;

    return (
        <div className='NavHeader top-font'>
            <div className='Blank'></div>
            <div
                className='HeaderContainer Clickable'
                onClick={() => {
                    if (email) {
                        setShowReturnHomeAndLogOutModal(true)
                    } else if (window.location.pathname !== '/') {
                        setShowReturnHomeModal(true)
                    } else {
                        window.location.reload();
                        window.scrollTo(0, 0);
                    }
                }}
            >
                <h1 className='Title'>Shefa was here</h1>
                {/*<img className='HeaderLogo' src={stselabGamesLogo} alt='Stselab games logo: a golfball in a gear' />*/}

            </div>
            
            <Tooltip title={email ? "Log Out" : "Log In" } placement="left">
                <Button
                    className='UserIconButton'
                    onClick={() => {
                        if (email) {
                            setShowReturnHomeAndLogOutModal(true)
                        } else {
                            navigate('/login');
                        }
                    }}
                >
                    <UserOutlined />
                </Button>
            </Tooltip>
            {/* <div className='UserIcon'>{ username ? username.substring(0, 1).toUpperCase() : "Log In"}</div> */}
            {
                // if player is in an ongoing session, will want to ask them if they are sure they want to return home as it will cause 
                // them to leave their session. Do this via the verification modal.
                showReturnHomeAndLogOutModal &&
                <VerificationModal
                    title='Would you like to log out?'
                    message='Logging out will require you to log back in next time you wish to record an activity. Are you sure you want to log out?'
                    confirm={() => {
                        // removes player if they navigate away from game
                        if (email) {
                            // TODO log out 
                            setEmail('');
                            setAuthToken('');
                            setIsAdmin(false);
                            clearObjectFromStorage('loginInformation');
                        }
                        navigate('/')
                    }}
                    cancel={() => setShowReturnHomeAndLogOutModal(false)}
                />
            }
            {
                // return home from pages not logged in (for now just sign in and login pages)
                showReturnHomeModal &&
                <VerificationModal
                    title='Return to Home Page?'
                    message='Information entered may be lost. Are you sure you want to return to the home page?'
                    confirm={() => {
                        // removes player if they navigate away from game
                        if (email) {
                            // TODO log out 
                            setEmail('');
                            setAuthToken('');
                            setIsAdmin(false);
                            clearObjectFromStorage('loginInformation');
                        }
                        navigate('/')
                    }}
                    cancel={() => setShowReturnHomeModal(false)}
                />
            }
        </div>
    )
}

export default NavHeader;