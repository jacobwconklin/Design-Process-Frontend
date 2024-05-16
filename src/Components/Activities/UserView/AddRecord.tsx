import { Button, DatePicker, Select, message } from 'antd';
import './AddRecord.scss';
import { useContext, useState } from 'react';
import { Activity, MeasurementPeriod, UserContextType } from '../../../Utils/Types';
import OneActivity from './OneActivity';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { UserContext } from '../../../App';
import { postRequest } from '../../../Utils/Api';

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


  const saveActivity = async () => {
    setLoading(true);
    setAttemptedSubmit(true);
    // loop through all activities checking if they have all the required fields,
    // if not make an error message pop up like the success message.
    let completedAllActivities = true;
    activities.forEach((activity) => {
      if (
        // TODO should have a key somewhere that says what activity tasks have what questions, and how many questions each has.
        !activity.duration || !activity.question1 || !activity.question2 ||
        (!activity.question3 && (activity.type !== tasks[0] && activity.type !== tasks[1])) ||
        (!activity.question4 && (activity.type !== tasks[0] && activity.type !== tasks[1] && activity.type !== tasks[2] && activity.type !== tasks[5])) ||
        !endDate || !startDate
      ) {
        completedAllActivities = false;
        console.log("Problem activity is: ", activity);
      }
    });
    // verify there is at least one valid activity
    if (activities.length === 0) {
      messageApi.open({
        type: 'error',
        content: 'Please add at least one activity',
      });
      setAttemptedSubmit(false);
      setLoading(false);
      return;
    } else if (!completedAllActivities) {
      messageApi.open({
        type: 'error',
        content: 'Please fill out all fields for all activities and Measurement Period',
      });
      setLoading(false);
      return;
    } else {
      // save all activities to the database
      const allActivities: Activity[] = []
      activities.forEach((activity) => {
        const newActivity: Activity = {
          type: activity.type,
          duration: activity.duration,
          question1: activity.question1,
          question2: activity.question2,
          question3: activity.question3,
          question4: activity.question4,
        }
        allActivities.push(newActivity);
      });
      // save the measurement period
      const newRecord: MeasurementPeriod = {
        startDate: startDate,
        endDate: endDate,
        email: email ? email : "",
        entered: new Date().toISOString(),
        totalDuration: getTotalHours(),
      }
      // save activities and measurement period to the database
      const result = await postRequest("navydp/saveNewMeasurementPeriod", JSON.stringify({
        activities: allActivities,
        ...newRecord
      }));
      if (result.success) {
        messageApi.open({
          type: 'success',
          content: 'Measurement Period and Activities Saved',
        });
        // clear the form
        setActivities([]);
        setAttemptedSubmit(false);
        setLoading(false);
      } else {
        console.error(result);
        messageApi.open({
          type: 'error',
          content: 'Error Saving Measurement Period and Activities',
        });
        setLoading(false);
      }
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
            className='AddActivitySelect'
            // dropdown for activity type
            defaultValue={''}
            value={''}
            options={activityTypes}
            onChange={(value): void => {
              // create new activity
              if (value) {
                setActivities([...activities, {
                  type: value,
                  duration: 0,
                  question1: '',
                  question2: '',
                  question3: '',
                  question4: '',
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
          disabled={loading}
        >
          Save All Activities for the Measurement Period
        </Button>
      </div>
    </div>
  );
};

export default AddRecord;