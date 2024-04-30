import { Button, DatePicker, InputNumber, Select, message } from 'antd';
import './AddRecord.scss';
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { Activity } from '../../../Utils/Types';
import OneActivity from './OneActivity';
import { activityTypes } from '../../../Utils/Utils';

// AddRecord adds an entire measurement period for the user with all of its new activities and ther details. It ensures
// the information is sent and saved to the database. 
const AddRecord = () => {

  // are they supposed to add as many as they want?

  const [activities, setActivities] = useState<Activity[]>([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  

  const saveActivity = () => {
    setAttemptedSubmit(true);
    // loop through all activities checking if they have all the required fields,
    // if not make an error message pop up like the success message.
    // if (!activityType || !duration || !notes) {
    //   return;
    // }

    // const newActivity: Activity = {
    //   entered: (new Date()).toISOString(),
    //   type: activityType,
    //   duration: duration,
    //   notes: notes
    // }
    // // save activity to the database
    messageApi.open({
      type: 'success',
      content: 'Measurement Period and Activities Saved',
    });
    // clear the form
    setActivities([]);
    setAttemptedSubmit(false);
    // props.addRecord(newRecord);
  }

  const getTotalHours = () => {
    return activities.reduce((acc, activity) => acc + activity.duration, 0);
  }

  return (
    <div className="AddRecord ColumnFlex">
      {contextHolder}
      <div className='Bubble'>
        <h2>Record All New Activities for the Measurement Period</h2>
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
        <DatePicker.RangePicker />
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