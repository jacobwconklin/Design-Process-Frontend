import './OneActivity.scss';
import { Activity } from '../../../Utils/Types';
import { Button, InputNumber, Radio, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { useState } from 'react';
import VerificationModal from '../../../Reusable/VerificationModal';

// OneActivity
const OneActivity = (props: {
    attemptedSubmit: boolean;
    activities: Activity[];
    setActivities: (setFunction: (activities: Activity[]) => Activity[]) => void;
    activityIndex: number;
}) => {

    const [showCheckBeforeDeleteModal, setShowCheckBeforeDeleteModal] = useState<boolean>(false);

    const updateActivityField = (value: any, field: string): void => {
        props.setActivities(currValue => {
            const newActivities: any = [...currValue];
            // if type is changed, reset everything
            if (field === "type") {
                newActivities[props.activityIndex] = {
                    type: value,
                    duration: 0,
                    question1: "",
                    question2: "",
                    question3: "",
                    informationScale: 0 // Make scale 1 - 7 so that a 0 is a non-answer
                }
            } else {
                newActivities[props.activityIndex][field as keyof Activity] = value;
            }
            return newActivities as Activity[];
        })
    }

    // get the correct subquestion prompt based on the selected activity type and the 
    // subquestion number
    const getSubquestion = (subquestionNumber: number): string => {
        if (props.activities[props.activityIndex].type === tasks[0]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please specify which mathematical or analytical model you used?";
                case 2:
                    return "Please briefly specify the purpose of this analysis.";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[1]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please specify about what you retrieved this knowledge. (ship/platform data, system/payload data, subsystem data, mission data, operational/warfighter data, environmental/contextual data, other (please specify)";
                case 2:
                    return "Please specify how you retrieved this knowledge.";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[2]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please briefly specify from which collaborator were you waiting for this information?";
                case 2:
                    return "Please briefly specify the nature of this new information.";
                case 3:
                    return "Please briefly specify for which task you needed this information for?";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[3]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please specify which model you updated?";
                case 2:
                    return "Please roughly specify the information you used to update this model?";
                case 3:
                    return "Please specify how this updated model is shared with peers?";
                case 4:
                    return "Please assess your likelihood of repeating this task in the near future.";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[4]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please specify from which collaborator (or analysis) you received this information from?";
                case 2:
                    return "Please briefly specify for which task you needed this information for?";
                case 3:
                    return "";
                case 4:
                    return "Please roughly assess the completeness and sufficiency of this information in terms of enabling you to make progress in your next task?";
                default:
                    return "";
            }
        } else {
            // (props.activities[props.activityIndex].type === tasks[5])
            switch (subquestionNumber) {
                case 1:
                    return "Please specify from which collaborator(s) you shared this information with?";
                case 2:
                    return "Please specify the mode of communication.";
                case 3:
                    return "Please briefly specify for which task your colleagues needed this information for?";
                case 4:
                    return "Please roughly assess the completeness and sufficiency of this information in terms of enabling your colleagues to make progress in your next task?";
                default:
                    return "";
            }
        }
    }

    // for the select box for question 2, get the options based on the selected activity type
    const getOptionsForQuestion2 = (activityType: string): { label: string, value: string }[] => {
        if (activityType === tasks[0]) {
            return [
                { label: "To elicit requirements", value: "to elicit requirements" },
                { label: "To generate concepts", value: "to generate concepts" },
                { label: "To compare solutions", value: "to compare solutions" },
                { label: "To make a decision", value: "to make a decision" },
                { label: "To articulate an issue", value: "to articulate an issue" },
                { label: "To understand the implications of design changes", value: "to understand the implications of design changes" },
                { label: "Other", value: "other" }
            ]
        } else if (activityType === tasks[1]) {
            return [
                { label: "Through mentors/managers not actively working on this project", value: "through mentors/managers not actively working on this project" },
                { label: "By reverse engineering", value: "by reverse engineering" },
                { label: "Through the literature", value: "through the literature" },
                { label: "Through reference projects", value: "through reference projects" },
                { label: "Through an environmental test", value: "through an environmental test" },
                { label: "Through measurement of existing systems/subsystems", value: "through measurement of existing systems/subsystems" },
                { label: "Other", value: "other" }
            ]
        } else if (activityType === tasks[2]) {
            return [
                { label: "Clarification", value: "clarification" },
                { label: "A missing requirement", value: "a missing requirement" },
                { label: "An analysis result", value: "an analysis result" },
                { label: "A test or measurement result", value: "a test or measurement result" },
                { label: "Stakeholder input", value: "stakeholder input" },
                { label: "Other", value: "other" }
            ]
        } else if (activityType === tasks[3]) {
            return [
                { label: "Shared manually through a follow up communication task by me", value: "shared manually through a follow up communication task by me" },
                { label: "Through a written report or an information note", value: "through a written report or an information note" },
                { label: "Automatically communicated in our shared model", value: "automatically communicated in our shared model" },
                { label: "Other", value: "other" }
            ]
        } else {
            // Skip 4 (it doesn't have a select box for question 2)
            // and go straight to 5
            return [
                { label: "Email", value: "email" },
                { label: "Teams meeting", value: "teams meeting" },
                { label: "In person meeting", value: "in person meeting" },
                { label: "Data share", value: "data share" },
                { label: "Model share", value: "model share" },
                { label: "Technical report", value: "technical report" },
                { label: "Other", value: "other" }
            ]
        }
    }

    return (
        <div className="OneActivity ColumnFlex"
            style={{
                borderTop: props.activityIndex === 0 ? '1px solid black' : 'none'
            }}
        >
            <div className='ActivityTitle RowFlex'>
                <h2>Activity #{props.activityIndex + 1}</h2>
                <Button
                    type='text'
                    danger
                    onClick={() => {
                        setShowCheckBeforeDeleteModal(true);
                    }}
                >
                    Delete Activity
                </Button>
            </div>
            <p>Change Activity Type</p>
            <Select
                // dropdown for activity type
                value={props.activities[props.activityIndex].type}
                options={activityTypes.slice(1)}
                onChange={(value) => {
                    updateActivityField(value, "type");
                }}
            />
            <p>Hours Spent on Activity</p>
            <InputNumber
                // input for duration in hours
                className={props.attemptedSubmit && !props.activities[props.activityIndex].duration ? "ErrorForm" : ""}
                min={1}
                max={100}
                value={props.activities[props.activityIndex].duration}
                onChange={(e) => updateActivityField(e ? e : 0, "duration")}
                addonAfter="Hours"
            />

            {
                // Now we are getting into it. Display prompts SPECIFIC to the selected activity type
                // all tasks have questons 1 and 2, so the text just has to be changed
            }

            <div className='Subquestion ColumnFlex'>
                <p>{getSubquestion(1)}</p>
                <TextArea
                    style={{ maxWidth: '400px' }}
                    // input for notes
                    className={props.attemptedSubmit && !props.activities[props.activityIndex].question1 ? "ErrorForm" : ""}
                    autoSize={{ minRows: 3 }}
                    maxLength={240}
                    placeholder='Type your answer here ...'
                    value={props.activities[props.activityIndex].question1}
                    onChange={(event) => {
                        updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question1");
                    }}
                />
            </div>

            <div className='Subquestion ColumnFlex'>
                <p>{getSubquestion(2)}</p>
                {
                    // question 2 may be a select or a text area depending on the activity type
                    // task at index 4 is the only one without a select for question 2
                    props.activities[props.activityIndex].type === tasks[4] ?
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activities[props.activityIndex].question2 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={240}
                            placeholder='Type your answer here ...'
                            value={props.activities[props.activityIndex].question2}
                            onChange={(event) => {
                                updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question2");
                            }}
                        />
                        :
                        <Select
                            // dropdown for question 2
                            className={props.attemptedSubmit && !props.activities[props.activityIndex].question2 ? "ErrorForm" : ""}
                            value={
                                props.activities[props.activityIndex].question2.startsWith("other") ?
                                "other" :
                                props.activities[props.activityIndex].question2
                            }
                            options={
                                getOptionsForQuestion2(props.activities[props.activityIndex].type)
                            }
                            onChange={(value) => {
                                updateActivityField(value, "question2");
                            }}
                        />
                }
                {
                    // add text field for "other" option from select box
                    props.activities[props.activityIndex].question2.startsWith("other") &&
                    props.activities[props.activityIndex].type !== tasks[4] &&
                    <div className='ColumnFlex'>
                        <p>Specify Other:</p>
                        <TextArea
                            style={{ maxWidth: '400px' }}
                            // input for notes
                            className={props.attemptedSubmit && !props.activities[props.activityIndex].question2 ? "ErrorForm" : ""}
                            autoSize={{ minRows: 3 }}
                            maxLength={230}
                            placeholder='Type your answer here ...'
                            value={props.activities[props.activityIndex].question2.substring(6)}
                            onChange={(event) => {
                                updateActivityField(event.target.value && event.target.value.length > 230 ? 
                                "other:" + event.target.value.substring(0, 230) : 
                                "other:" + event.target.value, "question2");
                            }}
                        />
                    </div>
                }
            </div>

            {/* Question 3 and Information Scale are optonal depending on the chosen activity type. */}
            {
                // show question 3 if:
                (props.activities[props.activityIndex].type === tasks[2] || props.activities[props.activityIndex].type === tasks[3] || props.activities[props.activityIndex].type === tasks[5]) &&
                <div className='Subquestion ColumnFlex'>
                    <p>{getSubquestion(3)}</p>
                    <TextArea
                        style={{ maxWidth: '400px' }}
                        // input for notes
                        className={props.attemptedSubmit && !props.activities[props.activityIndex].question3 ? "ErrorForm" : ""}
                        autoSize={{ minRows: 3 }}
                        maxLength={240}
                        placeholder='Type your answer here ...'
                        value={props.activities[props.activityIndex].question3}
                        onChange={(event) => {
                            updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question3");
                        }}
                    />
                </div>
            }

            {
                // show information scale if:
                (props.activities[props.activityIndex].type === tasks[3] || props.activities[props.activityIndex].type === tasks[4] || props.activities[props.activityIndex].type === tasks[5]) &&
                <div className='Subquestion ColumnFlex'>
                    <p>{getSubquestion(4)}</p>

                    <div className={`PointScaleBox ${!props.activities[props.activityIndex].pointScale
                        && props.attemptedSubmit ? "ErrorForm" : ""}`}>
                        <p>
                            {
                                props.activities[props.activityIndex].type === tasks[3] ?
                                "Highly Unlikely"
                                :
                                "Insufficient Information"
                            }
                        </p>
                        <p>.....</p>
                        <p>.....</p>
                        <p>
                            {
                                props.activities[props.activityIndex].type === tasks[3] ?
                                "Somewhat Likely"
                                :
                                "Adequate Information"
                            }
                        </p>
                        <p>.....</p>
                        <p>.....</p><p>
                            {
                                props.activities[props.activityIndex].type === tasks[3] ?
                                "Highly Likely"
                                :
                                "Perfect Information"
                            }
                        </p>

                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 1} 
                            value={props.activities[props.activityIndex].pointScale === 1} 
                            onClick={() => {
                                updateActivityField(1, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 2} 
                            value={props.activities[props.activityIndex].pointScale === 2} 
                            onClick={() => {
                                updateActivityField(2, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 3} 
                            value={props.activities[props.activityIndex].pointScale === 3} 
                            onClick={() => {
                                updateActivityField(3, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 4} 
                            value={props.activities[props.activityIndex].pointScale === 4} 
                            onClick={() => {
                                updateActivityField(4, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 5} 
                            value={props.activities[props.activityIndex].pointScale === 5} 
                            onClick={() => {
                                updateActivityField(5, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 6} 
                            value={props.activities[props.activityIndex].pointScale === 6} 
                            onClick={() => {
                                updateActivityField(6, "pointScale");
                            }}
                        />
                        <Radio 
                            checked={props.activities[props.activityIndex].pointScale === 7} 
                            value={props.activities[props.activityIndex].pointScale === 7} 
                            onClick={() => {
                                updateActivityField(7, "pointScale");
                            }}
                        />
                    </div>
                    <br />
                </div>
            }
            {
                showCheckBeforeDeleteModal && 
                <VerificationModal 
                    cancel={() => setShowCheckBeforeDeleteModal(false)}
                    confirm={() => {
                        props.setActivities(currValue => {
                            const newActivities = [...currValue];
                            newActivities.splice(props.activityIndex, 1);
                            return newActivities as Activity[];
                        });
                    }}
                    title='Delete Activity?'
                    message="Are you sure you want to delete this activity and all of the inputs provided?"
                />
            }
        </div>
    );
};

export default OneActivity;