import { Select, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";
import { useState } from "react";


const SharedTask = (props: {
    attemptedSubmit: boolean,
    updateActivityField: (value: string | number, field: string) => void,
    activity: Activity,
}) => {
    
    const [q2SpecifiedOther, setQ2SpecifiedOther] = useState<string>("");

    return (
        <>
            {
                // Display prompts SPECIFIC to the selected activity type
                // all tasks have questons 1 and 2
            }
            <div className='Subquestion ColumnFlex'>
                <p>
                    Please specify from which collaborator(s) you shared this information with?
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
                    Please specify the mode of communication. Select all that apply.
                </p>

                <Select
                    // dropdown for question 2
                    className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    defaultValue={[]}
                    value={
                        props.activity.question2.includes("other:") ?
                            props.activity.question2.split(",").slice(0, -1) :
                            props.activity.question2.split(",")
                    }
                    options={
                        [
                            // email request, one-on-one TEAMs meeting or phone call, during a TEAMs meeting with more than one stakeholder, during a formal stakeholder meeting, other please specify
                            { label: "Email request", value: "email request" },
                            { label: "One-on-one TEAMs meeting or phone call", value: "one-on-one TEAMs meeting or phone call" },
                            { label: "During a TEAMs meeting with more than one stakeholder", value: "during a TEAMs meeting with more than one stakeholder" },
                            // during a formal meeting, an in person meeting, data share, model share, technical report,
                            { label: "During a formal stakeholder meeting", value: "during a formal stakeholder meeting"},
                            { label: "An in person meeting", value: "an in person meeting" },
                            { label: "Data share", value: "data share" },
                            { label: "Model share", value: "model share" },
                            { label: "Technical report", value: "technical report" },
                            { label: "Other", value: "other" }
                        ]
                    }
                    onChange={(value) => {
                        props.updateActivityField(value.join(","), "question2");
                    }}
                />
                {
                    // add text field for "other" option from select box
                    props.activity.question2.includes("other") &&
                    <div className='ColumnFlex'>
                        <p>Specify Other:</p>
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activity.question2 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={50}
                            placeholder='Type your answer here ...'
                            value={q2SpecifiedOther}
                            onChange={(event) => {
                                setQ2SpecifiedOther(event.target.value.substring(0, 50));
                                props.updateActivityField(event.target.value && event.target.value.length > 50 ?
                                    (   props.activity.question2.includes("other:") ?
                                            props.activity.question2.split(",").slice(0, -1) :
                                            props.activity.question2.split(",")) 
                                    + ", other:" + event.target.value.substring(0, 50) :
                                    (  props.activity.question2.includes("other:") ?
                                            props.activity.question2.split(",").slice(0, -1) :
                                            props.activity.question2.split(",")) 
                                    + ", other:" + event.target.value, "question2");
                            }}
                        />
                    </div>
                }
            </div>

            {/* Question 3, 4, and Information Scale are optonal depending on the chosen activity type. */}
            <div className='Subquestion ColumnFlex'>
                <p>
                    Please briefly specify for which task your colleagues needed this information for?
                </p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    className={props.attemptedSubmit && !props.activity.question3 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activity.question3}
                    onChange={(event) => {
                        props.updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question3");
                    }}
                />
            </div>

            <div className='Subquestion ColumnFlex'>
                <p>
                    Please roughly assess the completeness and sufficiency of this information in terms of enabling your colleagues to make progress in your next task?
                </p>

                <div className={`PointScaleBox ${!props.activity.question4
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
                                checked={props.activity.question4 === '' + (index + 1)}
                                value={props.activity.question4 === '' + (index + 1)}
                                onClick={() => {
                                    props.updateActivityField("" + (index + 1), "question4");
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

export default SharedTask;