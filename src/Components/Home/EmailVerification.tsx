import { useContext, useState } from 'react';
import './EmailVerification.scss';
import { Button, Input } from 'antd';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import { isValidEmail, saveObjectToStorage } from '../../Utils/Utils';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../../Utils/Api';

// EmailVerification
const EmailVerification = (props: {
    exit: () => void;
    fromHeader?: boolean;
}) => {


    const { setEmail, setAuthToken, setIsAdmin } = useContext(UserContext) as UserContextType;

    const [emailVerificationResult, setEmailVerificationResult] = useState<string | null>(null);
    const [userInputEmail, setUserInputEmail] = useState('');

    const navigate = useNavigate();

    const verifyEmail = async () => {
        // send email to backend to verify
        // if email is verified, set email in context and local storage
        try {

            const result = await postRequest('navydp/verifyEmail', JSON.stringify({ email: userInputEmail }));

            if (result.success) {
                const loginInfo = {email: userInputEmail, authToken: '', isAdmin: false};
                setEmail(userInputEmail);
                setAuthToken('');
                setIsAdmin(false);
                saveObjectToStorage('loginInformation', loginInfo);
                navigate('/activities');
                props.exit();
            } else {
                setEmailVerificationResult('Email not found. Please check your email is entered correctly or sign up for a new account.');
            }
        } catch (err) {
            console.error(err);
            setEmailVerificationResult('Error verifying email. Please re-enter your email and try again.');
        }
    }

    return (
        <div className="EmailVerification"
            style={{
                top: props.fromHeader ? '-10px' : '0px',
                left: props.fromHeader ? '-10px' : '0px',
            }}
        >
            <div className='ModalBody'>

            <h2>Verify Your Email to Log In</h2>
            <p>
                If you have previosly signed up for an account, please enter your email and click confirm to verify your email is registered and record a new activity. If you have not signed up before, please click the sign up button to create an account.
            </p>
            <Input
                className='EmailInput'
                placeholder="Enter your email"
                onChange={(e) => {
                    setUserInputEmail(e.target.value);
                }}
                onPressEnter={() => { 
                    if (isValidEmail(userInputEmail)) {
                        verifyEmail() 
                    }
                }}
            />
            <br />
            {
                // if emailVerificationResult is null, verification hasn't happened yet
                emailVerificationResult &&
                <b className='EmailError'>
                    {emailVerificationResult}
                </b>
            }
            <br />
            <div className='ModalButtons'>
                <Button
                    onClick={() => { props.exit() }}
                    danger
                >
                    Exit
                </Button>

                <Button
                    onClick={() => { verifyEmail() }}
                    type='primary'
                    disabled={!isValidEmail(userInputEmail)}
                >
                    Confirm
                </Button>
                <Button
                    onClick={() => { navigate("/signup") }}
                >
                    Sign Up
                </Button>

            </div>
            </div>
        </div>
    );
};

export default EmailVerification;