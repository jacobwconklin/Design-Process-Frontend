import { Button, Input } from 'antd';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import { postRequest } from '../../Utils/Api';

// Login
const Login = (props: {}) => {

    const navigate = useNavigate();

    const { setIsAdmin, setEmail, setAuthToken}  = useContext(UserContext) as UserContextType;

    const [stateEmail, setStateEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        // TODO- make API call to login
        // if successful, set context values and navigate to activities
        // if not, display error message
        // const loginResult = {success: true, token: '1234', isAdmin: stateEmail ==='admin' ? true :  false};
        try {
            const loginResult = await postRequest('navydp/checkLogin', JSON.stringify({email: stateEmail, password: password}))
            if (loginResult.success) {
                setIsAdmin(stateEmail ==='admin');
                setEmail(stateEmail);
                setAuthToken('TODO');
                navigate('/activities');
            } else if (loginResult.error === 'User not found') {
                alert("Login Failed. Check Username and Password are Correct.")
            } else {
                console.error("Error logging in", loginResult);
            }
        } catch (error) {
            console.error("Error logging in", error);
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
            <Input.Password 
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