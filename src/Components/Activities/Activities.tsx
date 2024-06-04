import { useContext, useEffect } from 'react';
import './Activities.scss';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import UserView from './UserView/UserView';
import { useNavigate } from 'react-router-dom';
import AdminView from './AdminView/AdminView';
import { clearObjectFromStorage, getObjectFromStorage } from '../../Utils/Utils';

// Activities handles differentiating between showing user and admin dashboards. 
const Activities = (props: {}) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { isAdmin, email, setEmail, setIsAdmin, setAuthToken } = useContext(UserContext) as UserContextType;

    const navigate = useNavigate();
    // return home if signed out 
    useEffect(() => {
        if (!email) {
          // first try to get login info from local storage, if not there or it's incomplete, clear storage and return home
          const loginInfo = getObjectFromStorage("loginInformation");
          if (loginInfo && loginInfo.email) {
            setIsAdmin(loginInfo.isAdmin);
            setAuthToken(loginInfo.authToken);
            setEmail(loginInfo.email);
          } else {
            clearObjectFromStorage("loginInformation")
            setIsAdmin(false);
            setAuthToken('');
            navigate('/');
          }
        }
      }, [navigate, email, setIsAdmin, setAuthToken, setEmail]);

  return (
    <div className="Activities">
        {
            isAdmin ? 
            <AdminView />
            :
            <UserView />
        }
    </div>
  );
};

export default Activities;