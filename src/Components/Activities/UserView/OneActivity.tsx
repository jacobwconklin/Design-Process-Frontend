import { useState } from 'react';
import './OneActivity.scss';
import { Activity } from '../../../Utils/Types';
import { InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { activityTypes, tasks } from '../../../Utils/Utils';

// OneActivity
const OneActivity = (props: {
    attemptedSubmit: boolean;
    activities: Activity[];
    setActivities: (setFunction: (activities: Activity[]) => Activity[]) => void;
    activityIndex: number;
}) => {

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
                    return "Please briefly specify the purpose of this analysis (to elicit requirements, to generate concepts, to compare solutions, to make a decision, to articulate an issue, to understand the implications of design changes, other (please specify)";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[1]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please specify about what you retrieved this knowledge (ship/platform data, system/payload data, subsystem data, mission data, operational/warfighter data, environmental/contextual data, other (please specify)?";
                case 2:
                    return "Please specify how you retrieved this knowledge (through mentors/managers not actively working on this project, by reverse engineering, through the literature, through reference projects, through an environmental test, through measurement of existing systems/subsystems, other please specify).";
                default:
                    return "";
            }
        } else if (props.activities[props.activityIndex].type === tasks[2]) {
            switch (subquestionNumber) {
                case 1:
                    return "Please briefly specify from which collaborator were you waiting for this information?";
                case 2:
                    return "Please briefly specify the nature of this new information (clarification, a missing requirement, an analysis result, a test or measurement result, stakeholder input, other (please specify))";
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
                    return "Please specify how this updated model is shared with peers (shared manually through a follow up communication task by me, through a written report or an information note, automatically communicated in our shared model,  other (please specify)";
                case 4:
                    return "Please assess your likelihood of repeating this task in the near future";
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
                    return "Please specify the mode of communication (make it a multiple option including email, teams meeting, in person meeting, data share, model share, technical report, other (please specify)).";
                case 3:
                    return "Please briefly specify for which task your colleagues needed this information for?";
                case 4:
                    return "Please roughly assess the completeness and sufficiency of this information in terms of enabling your colleagues to make progress in your next task?";
                default:
                    return "";
            }
        }
    }

    return (
        <div className="OneActivity ColumnFlex"
            style={{
                borderTop: props.activityIndex === 0 ? '1px solid black' : 'none'
            }}
        >
            <h3>Activity: {props.activityIndex + 1}</h3>
            <p>Change Activity Type</p>
            <Select
                // dropdown for activity type
                value={props.activities[props.activityIndex].type}
                options={activityTypes}
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
                    placeholder='Notes about activity ... '
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
                            placeholder='Notes about activity ... '
                            value={props.activities[props.activityIndex].question2}
                            onChange={(event) => {
                                updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question2");
                            }}
                        />
                        :
                        <Select

                        />
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
                        placeholder='Notes about activity ... '
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
                    <TextArea
                        style={{ maxWidth: '400px' }}
                        // input for notes
                        className={props.attemptedSubmit && !props.activities[props.activityIndex].question2 ? "ErrorForm" : ""}
                        autoSize={{ minRows: 3 }}
                        maxLength={240}
                        placeholder='Notes about activity ... '
                        value={props.activities[props.activityIndex].question2}
                        onChange={(event) => {
                            updateActivityField(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value, "question2");
                        }}
                    />
                </div>
            }


        </div>
    );
};

export default OneActivity;