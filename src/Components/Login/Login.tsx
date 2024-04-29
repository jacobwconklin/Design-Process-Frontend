import { Button, Input } from 'antd';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';

// Login
const Login = (props: {}) => {

    const navigate = useNavigate();

    const { setIsAdmin, setEmail, setAuthToken}  = useContext(UserContext) as UserContextType;

    const [stateEmail, setStateEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        // TODO- make API call to login
        // if successful, set context values and navigate to activities
        // if not, display error message
        const loginResult = {success: true, token: '1234', isAdmin: stateEmail ==='admin' ? true :  false};
        if (loginResult.success) {
            setIsAdmin(loginResult.isAdmin);
            setEmail(stateEmail);
            setAuthToken(loginResult.token);
            navigate('/activities');
        }
    }

  return (
    <div className="Login Top ColumnFlex">
        <div className='Bubble'>
            <h1>Login</h1>
            <p>Email:</p>
            <Input 
                placeholder='Your email here'
                value={stateEmail}
                onChange={(e) => setStateEmail(e.target.value)}
            />
            <br/>
            <p>Password:</p>
            <Input 
                placeholder='Your Password here'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <br/>
            <Button
                onClick={() => login()}
                disabled={!stateEmail.trim() || !password.trim()}
            >
                Log In
            </Button>
            <br/>
            <br/>
            <p>Don't have an account yet?</p>
            <Button
                onClick={() => navigate('/signup')}
            >Sign Up</Button>
        </div>
    </div>
  );
};

export default Login;