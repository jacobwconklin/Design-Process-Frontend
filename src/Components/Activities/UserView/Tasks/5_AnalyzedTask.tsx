import { Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";


const AnalyzedTask = (props: {
    attemptedSubmit: boolean,
    updateActivityField: (value: string | number, field: string) => void,
    activity: Activity,
}) => {

    return (
        <>
            {
                // Display prompts SPECIFIC to the selected activity type
                // all tasks have questons 1 and 2
            }
            <div className='Subquestion ColumnFlex'>
                <p>
                    Please specify from which collaborator (or analysis) you received this information from?
                </p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    // props.activity comes from props.activity in OneActivity.tsx
                    className={props.attemptedSubmit && !props.activity.question1 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activity.question1}
                    onChange={(event) => {
                        props.updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question1");
                    }}
                />
            </div>

            <div className='Subquestion ColumnFlex'>
                <p>
                    Please briefly specify for which task you needed this information for?
                </p>

                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    // props.activity comes from props.activity in OneActivity.tsx
                    className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activity.question2}
                    onChange={(event) => {
                        props.updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question2");
                    }}
                />
                {
                    // add text field for "other" option from select box
                    props.activity.question2.startsWith("other") &&
                    <div className='ColumnFlex'>
                        <p>Specify Other:</p>
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={230}
                            placeholder='Type your answer here ...'
                            value={props.activity.question2.substring(6)}
                            onChange={(event) => {
                                props.updateActivityField(event.target.value && event.target.value.length > 230 ?
                                    "other:" + event.target.value.substring(0, 230) :
                                    "other:" + event.target.value, "question2");
                            }}
                        />
                    </div>
                }
            </div>

            {/* Question 3, 4, and Information Scale are optonal depending on the chosen activity type. */}

            <div className='Subquestion ColumnFlex'>
                <p>
                    Please roughly assess the completeness and sufficiency of this information in terms of enabling you to make progress in your next task?
                </p>

                <div className={`PointScaleBox ${!props.activity.question3
                    && props.attemptedSubmit ? "ErrorForm" : ""}`}>
                    <p>
                        Insufficient Information
                    </p>
                    <p>.....</p>
                    <p>.....</p>
                    <p>
                        Adequate Information
                    </p>
                    <p>.....</p>
                    <p>.....</p>
                    <p>
                        Perfect Information
                    </p>

                    {
                        Array(7).fill(null).map((x, index) => (
                            <Radio
                                key={index}
                                checked={props.activity.question3 === '' + (index + 1)}
                                value={props.activity.question3 === '' + (index + 1)}
                                onClick={() => {
                                    console.log("" + (index + 1));
                                    console.log(props.activity.question3);
                                    props.updateActivityField("" + (index + 1), "question3");
                                }}
                            />
                        ))
                    }
                </div>
                <br />
            </div >

        </>
    )
}

export default AnalyzedTask;