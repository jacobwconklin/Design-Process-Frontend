import { Button } from 'antd';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import EmailVerification from './EmailVerification';
import { getObjectFromStorage } from '../../Utils/Utils';

// Home
const Home = (props: {}) => {

  const navigate = useNavigate();
  const { email, setEmail, setIsAdmin, setAuthToken } = useContext(UserContext) as UserContextType;

  const [showUserEmailVerification, setShowUserEmailVerification] = useState(false);

  // if logged in take them to the correct dashboard
  useEffect(() => {
    if (email) {
      navigate('/activities');
    } else {
      // check local storage for email
      const loginInformation = getObjectFromStorage('loginInformation');
      if (loginInformation?.email) {
        setEmail(loginInformation.email);
        setIsAdmin(loginInformation.isAdmin);
        setAuthToken(loginInformation.authToken);
        navigate('/activities');
      }
    }
  }, [navigate, email, setEmail, setIsAdmin, setAuthToken]);

  return (
    <div className="Home ColumnFlex">
      <div className='Bubble'>
        <p>
          Dear Sir or Madam, welcome to the design process documentation survey conducted by the Socio-technical Systems Engineering Lab (STSELab) at Virginia Tech and the Naval Surface Warfare Center Dahlgren Division.
        </p>
        <p>
          The purpose of this research is to understand and document team collaboration dynamics during post-production design change projects in complex naval systems.
        </p>
        <p>
          As part of this project, you will be asked to fill out an onboarding survey and bi-weekly periodic updates over the course of the project about information exchange and analytical model usage. We will use the findings help identify current inefficiencies and extract insights for how digital transformation could help designers when navigating tightly coupled design problems in a mission-effective manner.
        </p>
        <p>
          Please note that all the information collected in this study will be held confidential and not be used for performance evaluation.
        </p>
        <br />
        <h3>Log in or Sign up to begin recording activities:</h3>
        <div className="ButtonHolder RowFlex">
          <Button className="Button"
            onClick={() => {
              // If user already had an email saved in context, they already would have been moved to the user view
              setShowUserEmailVerification(true);
            }}
          >Log In</Button>
          <Button className="Button"
            onClick={() => navigate('/signup')}
          >Sign Up</Button>
          <Button className="Button"
            type='link'
            onClick={() => navigate('/login')}
          >Admin Login</Button>
        </div>
      </div>
      {
        // have users input their email, then check if the email is in the database, if it is send them to user view, if it is not,
        // prompt them to sign up
        showUserEmailVerification &&
        <EmailVerification 
          exit={() => setShowUserEmailVerification(false)}
        />
      }
    </div>
  );
};

export default Home;