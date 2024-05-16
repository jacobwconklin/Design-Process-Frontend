import { Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";


const AnalysisTask = (props: {
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
                    Please specify which mathematical or analytical model you used?
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
                    Please briefly specify the purpose of this analysis.
                </p>

                <Select
                    // dropdown for question 2
                    className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                    value={
                        props.activity.question2.startsWith("other") ?
                            "other" :
                            props.activity.question2
                    }
                    options={
                        [
                            { label: "To elicit requirements", value: "to elicit requirements" },
                            { label: "To generate concepts", value: "to generate concepts" },
                            { label: "To compare solutions", value: "to compare solutions" },
                            { label: "To make a decision", value: "to make a decision" },
                            { label: "To articulate an issue", value: "to articulate an issue" },
                            { label: "To understand the implications of design changes", value: "to understand the implications of design changes" },
                            { label: "Other", value: "other" }
                        ]
                    }
                    onChange={(value) => {
                        props.updateActivityField(value, "question2");
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

        </>
    )
}

export default AnalysisTask;