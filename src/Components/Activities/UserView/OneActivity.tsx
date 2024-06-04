import './OneActivity.scss';
import { Activity } from '../../../Utils/Types';
import { Button, InputNumber, Select } from 'antd';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { useState } from 'react';
import VerificationModal from '../../../Reusable/VerificationModal';
import AnalysisTask from './Tasks/0_AnalysisTask';
import RetrievalTask from './Tasks/1_RetrievalTask';
import WaitedTask from './Tasks/2_WaitedTask';
import UpdatedTask from './Tasks/3_UpdatedTask';
import ObtainedTask from './Tasks/4_ObtainedTask';
import AnalyzedTask from './Tasks/5_AnalyzedTask';
import SharedTask from './Tasks/6_SharedTask';

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
                props.activities[props.activityIndex].type === tasks[0] &&
                <AnalysisTask
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[1] &&
                <RetrievalTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[2] &&
                <WaitedTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[3] &&
                <UpdatedTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[4] &&
                <ObtainedTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[5] &&
                <AnalyzedTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
            }
            {
                props.activities[props.activityIndex].type === tasks[6] &&
                <SharedTask 
                    activity={props.activities[props.activityIndex]}
                    updateActivityField={updateActivityField}
                    attemptedSubmit={props.attemptedSubmit}
                />
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