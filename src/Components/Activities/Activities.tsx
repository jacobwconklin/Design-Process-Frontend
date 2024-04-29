import { useContext, useEffect } from 'react';
import './Activities.scss';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import UserView from './UserView/UserView';
import { useNavigate } from 'react-router-dom';

// Activities handles differentiating between showing user and admin dashboards. 
const Activities = (props: {}) => {

    const { isAdmin, email } = useContext(UserContext) as UserContextType;

    const navigate = useNavigate();
    // return home if signed out (TODO also return home if token expired)
    useEffect(() => {
        if (!email) {
          navigate('/');
        }
      }, [navigate, email]);

    // TODO before pulling information for admin dashboard, verify with be that the user is an legitamte admin (maybe in admin file)

  return (
    <div className="Activities">
        {
            isAdmin ? 
            <>
                <h1>Admin Dashboard</h1>
            </>
            :
            <UserView />
        }
    </div>
  );
};

export default Activities;