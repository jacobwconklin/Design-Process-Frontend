import { Button } from 'antd';
import './DetailedUserInfo.scss';
import { useState } from 'react';

// DetailedUserInfo
// add to this component actions the admin can take towards the user such as deleting, sending them a reminder email, etc. 
const DetailedUserInfo = (props: {
    user: any,
    sendEmail: () => void;
}) => {

    const [hideInfo, setHideInfo] = useState(false);

    return (
        <div className="DetailedUserInfo Bubble">
            <h2>Details for User:</h2>
            <h2>{props.user.email}</h2>
            <div className='UserActions RowFlex'>
                <Button
                    onClick={props.sendEmail}
                >
                    Send Reminder Email
                </Button>
                <Button
                    danger
                >
                    Delete User
                </Button>
                <Button
                    onClick={() => setHideInfo(!hideInfo)}
                >
                    {hideInfo ? 'Show' : 'Hide'} Information
                </Button>
            </div>
            {
                !hideInfo &&
                <div className='ColumnFlex UserDetailsBox'>
                    <div className='ColumnFlex UserDetails'>
                        <p>Email: {props.user.email}</p>
                        <p>Employer: {props.user.employer}</p>
                        <p>Team: {props.user.team}</p>
                        <p>Title: {props.user.title}</p>
                        <p>Last Recorded Measurement Period Start Date: {props.user.lastRecordedPeriodStartDate}</p>
                        <p>Last Recorded Measurement Period End Date: {props.user.lastRecordedPeriodEndDate}</p>
                        <p>Number of Measurement Periods Recorded: {props.user.numberOfPeriods}</p>
                        <p>Total Hours Recorded: {props.user.totalHoursRecorded}</p>
                    </div>
                </div>
            }
        </div>
    );
};

export default DetailedUserInfo;