import { Button, DatePicker, DatePickerProps, Select, message } from 'antd';
import './AddRecord.scss';
import { useContext, useState } from 'react';
import { Activity, MeasurementPeriod, UserContextType } from '../../../Utils/Types';
import OneActivity from './OneActivity';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { UserContext } from '../../../App';
import { postRequest } from '../../../Utils/Api';
import dayjs from 'dayjs';

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
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };

  // Disabled 7 days from the selected date
  const disabled3DaysDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
      // if Monday is selected:
      if (from.day() === 1) {
        return current.diff(from, 'days') >= 3 || from.diff(current, 'days') >= 0;
      }
      // if Thursday is selected:
      else {
        return current.diff(from, 'days') >= 2 || from.diff(current, 'days') >= 0;
      }
    }

    // return true if date is not a mon or thurs, or date hasn't happened yet, disabling all of those dates
    return current.isBefore('2024-05-01') || current.isAfter(new Date()) || (current.day() !== 1 && current.day() !== 4);
  };


  const saveActivity = async () => {
    setLoading(true);
    setAttemptedSubmit(true);
    // loop through all activities checking if they have all the required fields,
    // if not make an error message pop up like the success message.
    if (!endDate || !startDate) {
      messageApi.open({
        type: 'error',
        content: 'Please select a start and end date for the measurement period',
      });
      setLoading(false);
      return;
    }
    let completedAllActivities = true;
    activities.forEach((activity) => {
      if (
        // TODO should have a key somewhere that clearly says what activity tasks have what questions, and how many questions each has.
        !activity.duration || !activity.question1 || !activity.question2 ||
        (!activity.question3 && (activity.type !== tasks[0] && activity.type !== tasks[1])) ||
        (!activity.question4 && (activity.type !== tasks[0] && activity.type !== tasks[1] && activity.type !== tasks[2] && activity.type !== tasks[5]))
      ) {
        completedAllActivities = false;
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
        content: 'Please fill out all fields for all activities',
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
        totalDuration: getTotalHours()
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
        setStartDate('');
        setEndDate('');
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
          Remember Measuring Periods are from Monday to Wednesday and from Thursday to Friday. There are typically 24 work hours between Monday and Wednesday and 16 work hours between Thursday and Friday. Please add all activities for the time period at the same time and then save them all at once. Continue to add more activities with the Select to Add a New Activity button at the bottom.
        </p>

        <br />
        <p>Select Dates of Measurement Period</p>
        <DatePicker.RangePicker
          className={attemptedSubmit && (!startDate || !endDate) ? "ErrorForm" : ""}
          onChange={onRangeChange}
          disabledDate={disabled3DaysDate}
        />
        {
          startDate && dayjs(startDate).day() === 1 &&
          <h3>Monday - Wednesday: 24 hours</h3>
        }
        {
          startDate && dayjs(startDate).day() === 4 &&
          <h3>Thursday - Friday: 16 hours</h3>
        }
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

      <div className='Bubble'>
        <h1>Activity Records</h1>
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
              setAttemptedSubmit(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddRecord;