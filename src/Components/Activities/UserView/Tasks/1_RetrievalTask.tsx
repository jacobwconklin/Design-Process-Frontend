import { Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Activity } from "../../../../Utils/Types";
import { useState } from "react";


const RetrievalTask = (props: {
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
                            { label: "Ship/platform data", value: "ship/platform data" },
                            { label: "System/payload data", value: "system/payload data" },
                            { label: "Subsystem data", value: "subsystem data" },
                            { label: "Mission data", value: "mission data" },
                            { label: "Operational/warfighter data", value: "operational/warfighter data" },
                            { label: "Environmental/contextual data", value: "environmental/contextual data" },
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
                            { label: "Through mentors/managers not actively working on this project", value: "through mentors/managers not actively working on this project" },
                            { label: "By reverse engineering", value: "by reverse engineering" },
                            { label: "Through the literature", value: "through the literature" },
                            { label: "Through reference projects", value: "through reference projects" },
                            { label: "Through an environmental test", value: "through an environmental test" },
                            { label: "Through measurement of existing systems/subsystems", value: "through measurement of existing systems/subsystems" },
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

        </>
    )
}

export default RetrievalTask;