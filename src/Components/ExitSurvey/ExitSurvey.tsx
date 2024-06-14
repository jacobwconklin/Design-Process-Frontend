import { Button, Input } from 'antd';
import './ExitSurvey.scss';
import { useContext, useState } from 'react';
import { postRequest } from '../../Utils/Api';
import { UserContext } from '../../App';
import { UserContextType } from '../../Utils/Types';
import { FullScreenConfetti } from '../../Reusable/Confetti';

// ExitSurvey
const ExitSurvey = (props: {}) => {

    const { email } = useContext(UserContext) as UserContextType;

    // code section
    const [name, setName] = useState('');

    // set to true to show confetti
    const [showConfetti, setShowConfetti] = useState(false);

    // submit exit survey
    // TODO teach about try catch finally stuff. 
    const submitFunction = async () => {
        try {
            const responseFromBackend = await postRequest("/navydp/exitSurvey", JSON.stringify({
                "name": name,
                "email": email
            }))
            if (responseFromBackend.success) {
                // User finished exit survey. 
                alert("Thank you for submitting exit survey: " + responseFromBackend.message);
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                }, 5000);
            } else {
                alert("Error submitting survey");
            }
        } catch (error) {
            console.error("Error: ", error);
            alert("Error submitting exit survey");
        } 
    }

    // html section
  return (
    <div className="ExitSurvey">
        <div className='Bubble'>
            <h1>ExitSurvey</h1>
            <p className="FormTitle" id='Name' >
                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                Name
            </p>
            <Input
                placeholder='Type your name here'
                maxLength={100}
                value={name}
                onChange={(event) => {
                    // setName(event.target.value);
                    setName(event.target.value);
                }}
            />
            <Button 
                className='SubmitButton' 
                type="primary"
                onClick={() => {submitFunction()}}
                disabled={!name}
            >
                    Submit
            </Button>
        </div>
        {
            showConfetti &&
            <FullScreenConfetti />
        }
    </div>
  );
};

export default ExitSurvey;