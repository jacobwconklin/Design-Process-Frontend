import { Button } from 'antd';
import './Home.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';

// Home
const Home = (props: {}) => {

  const navigate = useNavigate();
  const { email } = useContext(UserContext) as UserContextType;

  // if logged in take them to the dashboard
  useEffect(() => {
    if (email) {
      navigate('/activities');
    }
  }, [navigate, email]);

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
            onClick={() => navigate('/login')}
          >Log In</Button>
          <Button className="Button"
            onClick={() => navigate('/signup')}
          >Sign Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;