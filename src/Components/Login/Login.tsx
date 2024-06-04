import { Button, Input } from 'antd';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import { postRequest } from '../../Utils/Api';
import { saveObjectToStorage } from '../../Utils/Utils';

// Login
const Login = (props: {}) => {

    const navigate = useNavigate();

    const { setIsAdmin, setEmail, setAuthToken}  = useContext(UserContext) as UserContextType;

    const [stateEmail, setStateEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        // make API call to login
        // if successful, set context values and navigate to activities
        // if not, display error message
        // const loginResult = {success: true, token: '1234', isAdmin: stateEmail ==='admin' ? true :  false};
        try {
            const loginResult = await postRequest('navydp/checkLogin', JSON.stringify({email: stateEmail, password: password}))
            if (loginResult.success) {
                setIsAdmin(!!loginResult.token);
                setEmail(stateEmail);
                setAuthToken(loginResult.token);
                const loginInfo = {email: stateEmail, authToken: loginResult.token, isAdmin: !!loginResult.token};
                console.log(loginInfo)
                saveObjectToStorage('loginInformation', loginInfo);
                console.log('saved login info');
                
                setTimeout(() => {navigate('/activities');}, 1000)
            } else if (loginResult.error === 'Invalid Admin Credentials') {
                alert("Login Failed. Check Username and Password are Correct.")
            } else {
                console.error("Error logging in", loginResult);
                alert("Login Failed. Unable to Log In.")
            }
        } catch (error) {
            console.error("Error logging in", error);
        }
    }

  return (
    <div className="Login Top ColumnFlex">
        <div className='Bubble'>
            <h1>Admin Login</h1>
            <p>Username:</p>
            <Input 
                placeholder='Your username here'
                value={stateEmail}
                onChange={(e) => setStateEmail(e.target.value)}
            />
            <br/>
            <p>Password:</p>
            <Input.Password 
                placeholder='Your Password here'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={() => login()}
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
            <p>Not an Admin? Return home here</p>
            <Button
                onClick={() => navigate('/')}
            >Return Home</Button>
        </div>
    </div>
  );
};

export default Login;