import { Button, DatePicker, Select, message } from 'antd';
import './AddRecord.scss';
import { useContext, useState } from 'react';
import { Activity, MeasurementPeriod, UserContextType } from '../../../Utils/Types';
import OneActivity from './OneActivity';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { UserContext } from '../../../App';

// AddRecord adds an entire measurement period for the user with all of its new activities and ther details. It ensures
// the information is sent and saved to the database. 
const AddRecord = () => {

  // are they supposed to add as many as they want?

  const [activities, setActivities] = useState<Activity[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [messageApi, contextHolder] = message.useMessage();

  const { email } = useContext(UserContext) as UserContextType;

  const onRangeChange = (dates: null | any, dateStrings: string[]) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    }
  };
  

  const saveActivity = () => {
    setLoading(true);
    setAttemptedSubmit(true);
    // loop through all activities checking if they have all the required fields,
    // if not make an error message pop up like the success message.
    let completedAllActivities = true;
    activities.forEach((activity) => {
      if (
        !activity.duration || !activity.question1 || !activity.question2 || 
        (!activity.question3 && (activity.type === tasks[2] || activity.type === tasks[3] || activity.type === tasks[5])) || 
        (!activity.pointScale && (activity.type === tasks[3] || activity.type === tasks[4] || activity.type === tasks[5])) ||
        !endDate || !startDate
      ) {
        completedAllActivities = false;
      }
    });
    if (!completedAllActivities) {
      messageApi.open({
        type: 'error',
        content: 'Please fill out all fields for all activities and Measurement Period',
      });
      setLoading(false);
      return;
    } else {
      // save all activities to the database
      activities.forEach((activity) => {
        const newActivity: Activity = {
          type: activity.type,
          duration: activity.duration,
          question1: activity.question1,
          question2: activity.question2,
          question3: activity.question3,
          pointScale: activity.pointScale,
        }
        // save activity to the database

      });
      // save the measurement period to the database
      const newRecord: MeasurementPeriod = {
        startDate: startDate,
        endDate: endDate,
        email: email ? email : undefined,
        entered: new Date().toISOString(),
      }
      // save the measurement period to the database

      messageApi.open({
        type: 'success',
        content: 'Measurement Period and Activities Saved',
      });
      // clear the form
      setActivities([]);
      setAttemptedSubmit(false);
      setLoading(false);
    }
  }

  const getTotalHours = () => {
    return activities.reduce((acc, activity) => acc + activity.duration, 0);
  }

  return (
    <div className="AddRecord ColumnFlex">
      {contextHolder}
      <div className='Bubble'>
        <h1>Record All New Activities for the Measurement Period</h1>
        <p>
          Remember Measuring Periods are from Monday to Wednesday and from Thursday to Friday. There are typically 24 work hours between Monday and Wednesday and 16 work hours between Thursday and Friday.
        </p>
        <div className='MeasurementPeriodContainer ColumnFlex'>
          {
            activities.map((activity, index) => (
              <OneActivity
                key={index}
                attemptedSubmit={attemptedSubmit}
                activities={activities}
                setActivities={setActivities}
                activityIndex={index}
              />
            ))
          }
          <br />
          {
            // Leave this at the bottom so users can continually add a new activity
          }
          <p>Select to Add a New Activity</p>
          <Select
            // dropdown for activity type
            defaultValue={''}
            value={''}
            options={activityTypes}
            onChange={(value) => {
              // create new activity
              if (value) {
                setActivities([...activities, {
                  type: value,
                  duration: 0,
                  question1: '',
                  question2: '',
                  question3: '',
                  pointScale: 0,
                }]);
              }
            }}
          />
        </div>
        <br />
        <p>Select Dates of Measurement Period</p>
        <DatePicker.RangePicker
          className={attemptedSubmit && (!startDate || !endDate) ? "ErrorForm" : ""}
          onChange={onRangeChange}
        />
        <h3>Total Hours Recorded: {getTotalHours()}</h3>
        <Button
          style={{ minHeight: '50px' }}
          onClick={() => saveActivity()}
          type='primary'
        >
          Save All Activities for the Measurement Period
        </Button>
      </div>
    </div>
  );
};

export default AddRecord;