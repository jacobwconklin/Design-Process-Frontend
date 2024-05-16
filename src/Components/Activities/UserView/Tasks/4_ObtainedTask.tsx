import { Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";
import { useState } from "react";


const ObtainedTask = (props: {
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
                    Please specify about what you retrieved this knowledge. 
                </p>
                <Select
                    // dropdown for question 1
                    className={props.attemptedSubmit && !props.activity.question1 ? "ErrorForm" : ""}
                    value={
                        props.activity.question1.startsWith("other") ?
                            "other" :
                            props.activity.question1
                    }
                    options={
                        [
                            // ship/platform data, system/payload data, subsystem data, mission data, operational/warfighter data, environmental/contextual data, other
                            { label: "Ship/Platform Data", value: "ship/platform data" },
                            { label: "System/Payload Data", value: "system/payload data" },
                            { label: "Subsystem Data", value: "subsystem data" },
                            { label: "Mission Data", value: "mission data" },
                            { label: "Operational/Warfighter Data", value: "operational/warfighter data" },
                            { label: "Environmental/Contextual Data", value: "environmental/contextual data" },
                            { label: "Other", value: "other" }
                        ]
                    }
                    onChange={(value) => {
                        props.updateActivityField(value, "question1");
                    }}
                />
                {
                    // add text field for "other" option from select box
                    props.activity.question1.startsWith("other") &&
                    <div className='ColumnFlex'>
                        <p>Specify Other:</p>
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activity.question1 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={230}
                            placeholder='Type your answer here ...'
                            value={props.activity.question1.substring(6)}
                            onChange={(event) => {
                                props.updateActivityField(event.target.value && event.target.value.length > 230 ?
                                    "other:" + event.target.value.substring(0, 230) :
                                    "other:" + event.target.value, "question1");
                            }}
                        />
                    </div>
                }
            </div>

            <div className='Subquestion ColumnFlex'>
                <p>
                    Please specify how you retrieved this knowledge. Select all that apply.
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
                            { label: "Shared manually through a follow up communication task by me", value: "shared manually through a follow up communication task by me" },
                            { label: "Through a written report or an information note", value: "through a written report or an information note" },
                            { label: "Automatically communicated in our shared model", value: "automatically communicated in our shared model" },
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
                    Please specify from whom you obtained this knowledge.
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
                    Did you need to request the sponsor to provide funding to the providing organization for this knowledge?
                </p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    className={props.attemptedSubmit && !props.activity.question4 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activity.question4}
                    onChange={(event) => {
                        props.updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question4");
                    }}
                />
            </div>

        </>
    )
}

export default ObtainedTask;