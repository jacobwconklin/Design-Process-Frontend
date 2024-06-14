import { Button, Input } from 'antd';
import './ExitSurvey.scss';
import { useState } from 'react';
import { postRequest } from '../../Utils/Api';

// let newVariable = 5;

// const t = "time"

// const sum = (number1: string, number2: any ) => {
//     return number1 + number2;
// }

// ExitSurvey
const ExitSurvey = (props: {}) => {


    // code section
    const [name, setName] = useState('');

    // submit exit survey
    // TODO teach about try catch finally stuff. 
    const submitFunction = async () => {
        const responseFromBackend = await postRequest("/navydp/exitSurvey", JSON.stringify({
            "name": name
        }))
        console.log(responseFromBackend);
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
                    console.log("User typed: ", event.target.value)
                    console.log("object is: ", event);
                    setName(event.target.value);
                }}
            />
            {/** Submit Button */}
            {
                // this can be a comment
                // truthy and falsey
                // falsey 
                //0, undefined, null, ''. "", false

                // truthy
                //[]


                // name &&
                // <Button className='SubmitButton' type="primary">
                //     Submit
                // </Button>
            }
            <Button 
                className='SubmitButton' 
                type="primary"
                onClick={() => {submitFunction()}}
                disabled={!name}
            >
                    Submit
            </Button>
        </div>
    </div>
  );
};

export default ExitSurvey;