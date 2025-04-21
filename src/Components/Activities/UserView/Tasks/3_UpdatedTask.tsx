import { Select, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";


const UpdatedTask = (props: {
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
                    Please specify which model you updated ?
                </p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
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
                    Please roughly specify the information you used to update this model?
                </p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activity.question2}
                    onChange={(event) => {
                        props.updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question2");
                    }}
                />
            </div>

            {/* Question 3, 4, and Information Scale are optonal depending on the chosen activity type. */}

            <div className='Subquestion ColumnFlex'>
                <p>
                    Please assess your likelihood of repeating this task in the near future.
                </p>

                <div className={`PointScaleBox ${!props.activity.question3
                    && props.attemptedSubmit ? "ErrorForm" : ""}`}>
                    <p>
                        Highly Unlikely
                    </p>
                    <p>.....</p>
                    <p>.....</p>
                    <p>
                        Somewhat Likely
                    </p>
                    <p>.....</p>
                    <p>.....</p>
                    <p>
                        Highly Likely
                    </p>

                    {
                        Array(7).fill(null).map((x, index) => (
                            <Radio
                                key={index}
                                checked={props.activity.question3 === '' + (index + 1)}
                                value={props.activity.question3 === '' + (index + 1)}
                                onClick={() => {
                                    props.updateActivityField("" + (index + 1), "question3");
                                }}
                            />
                        ))
                    }
                </div>
                <br />
            </div >


            <div className='Subquestion ColumnFlex'>
                <p>
                    Please specify how this updated model is shared with peers.
                </p>

                <Select
                    // dropdown for question 4
                    className={props.attemptedSubmit && !props.activity.question4 ? "ErrorForm" : ""}
                    value={
                        props.activity.question4 && props.activity.question4.startsWith("other") ?
                            "other" :
                            props.activity.question4
                    }
                    options={
                        [
                            { label: "Shared manually through a follow up communication task by me", value: "shared manually through a follow up communication task by me" },
                            { label: "Through a written report or an information note", value: "through a written report or an information note" },
                            { label: "Automatically communicated in our shared model", value: "automatically communicated in our shared model" },
                            { label: "Other", value: "other" }
                        ]
                    }
                    onChange={(value) => {
                        props.updateActivityField(value, "question4");
                    }}
                />
                {
                    // add text field for "other" option from select box
                    props.activity.question4?.startsWith("other") &&
                    <div className='ColumnFlex'>
                        <p>Specify Other:</p>
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activity.question4 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={230}
                            placeholder='Type your answer here ...'
                            value={props.activity.question4.substring(6)}
                            onChange={(event) => {
                                props.updateActivityField(event.target.value && event.target.value.length > 230 ?
                                    "other:" + event.target.value.substring(0, 230) :
                                    "other:" + event.target.value, "question4");
                            }}
                        />
                    </div>
                }
            </div>

        </>
    )
}

export default UpdatedTask;