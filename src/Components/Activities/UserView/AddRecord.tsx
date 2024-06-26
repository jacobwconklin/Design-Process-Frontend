import { Button, DatePicker, DatePickerProps, Select, message } from 'antd';
import './AddRecord.scss';
import { useContext, useState } from 'react';
import { Activity, MeasurementPeriod, UserContextType } from '../../../Utils/Types';
import OneActivity from './OneActivity';
import { activityTypes, tasks } from '../../../Utils/Utils';
import { UserContext } from '../../../App';
import { postRequest } from '../../../Utils/Api';
import dayjs, { Dayjs } from 'dayjs';
import ExitSurvey from '../../ExitSurvey/ExitSurvey';

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

  // Choices for handling a duplicate date are: overwrite existing measurement period, add to existing measurement period
  enum DuplicateDateDecision {
    NEW = 0,
    ADD = 1,
    OVERWRITE = 2,
  }

  // data for modals
  const [showDuplicateDateModal, setShowDuplicateDateModal] = useState<boolean>(false);

  const [showLeaveProjectModal, setShowLeaveProjectModal] = useState<boolean>(false);
  const [leaveProjectDate, setLeaveProjectDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));

  const { email } = useContext(UserContext) as UserContextType;

  const onRangeChange = (dates: null | any, dateStrings: string[]) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
    setLeaveProjectDate(dateStrings[1]);
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

  const saveToDatabase = async (duplicateDateDecision: DuplicateDateDecision) => {
    try {
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
        ...newRecord,
        duplicateDateDecision
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
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Error Saving Measurement Period and Activities',
      });
    } finally {
      setShowDuplicateDateModal(false);
    }
  }

  const attemptToSaveActivity = async () => {
    try {
      setLoading(true);
      setAttemptedSubmit(true);
      // loop through all activities checking if they have all the required fields,
      // if not make an error message pop up like the success message.
      console.log("Startdate and enddate are: ", startDate, endDate);
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
      }
      else {
        // check if there is already a measurement period for the selected dates
        const duplicateDateResult = await postRequest("navydp/checkDuplicateMeasurementPeriod", JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          email: email ? email : "",
        }));
        if (duplicateDateResult.isDuplicate) {
          setShowDuplicateDateModal(true);
          return;
        } else {
          await saveToDatabase(DuplicateDateDecision.NEW);
        }
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Error Verifying Measurement Period is not a Duplicate',
      });
    } finally { 
      setLoading(false);
    }
  }

  // saves to user table in database that they are leaving the project on the selected date
  const leaveProject = async () => {
    try {
      // save to database that user is leaving the project on the selected date
      const result = await postRequest("navydp/leaveProject", JSON.stringify({
        email: email ? email : "",
        leaveProjectDate: leaveProjectDate,
      }));
      if (result.success) {
        messageApi.open({
          type: 'success',
          content: 'Leave Project Date Saved',
        });
      } else {
        console.error(result);
        messageApi.open({
          type: 'error',
          content: 'Error Saving Leave Project Date',
        });
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Error Saving Leave Project Date',
      });
    } finally {
      setShowLeaveProjectModal(false);
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
          value={[startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]}
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
          onClick={() => attemptToSaveActivity()}
          type='primary'
          disabled={loading}
        >
          Save All Activities for the Measurement Period
        </Button>
        <br/>
        <div className='LeavingPromptAndButton RowFlex'>
          <p>
            Leaving the project soon? 
          </p>
          <Button
            onClick={() => setShowLeaveProjectModal(true)}
          >Click Here</Button>
        </div>
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

      {
        // Modals (AKA popups) go here so they are written on top of everything else. 
        // have one modal for people leaving the project and one for people submitting a duplicate date
        // Duplicate date modal (user chooses to overwrite existing measurement period, add to it, or cancel save)
        showDuplicateDateModal &&
        <div className='Modal DateModal'
          onClick={() => setShowDuplicateDateModal(false)}
        >
          <div className='ModalBody'
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Duplicate Date</h1>
            <p>You have already recorded a measurement period for the dates you have selected. What would you like to do?</p>
            <div className='ModalButtons'>
              <Button danger onClick={() => saveToDatabase(DuplicateDateDecision.OVERWRITE)}>Overwrite Existing Measurement Period</Button>
              <Button onClick={() => saveToDatabase(DuplicateDateDecision.ADD)}>Add Activities to Existing Measurement Period</Button>
              <Button type='primary' onClick={() => setShowDuplicateDateModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      }
      {
        // modal for people to leave the project (Exit survey could go here, in which case it could be a whole component or even page)
        // use selected end date as the date they are leaving the project, but give them a date picker to change that if they want
        showLeaveProjectModal &&
        <div className='Modal LeaveModal'
          onClick={() => setShowLeaveProjectModal(false)}
        >
          <div className='ModalBody'
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Leave Project</h1>
            <p>
              Please set the date to the correct date that you are leaving the project, then click confirm. You will still be able to enter records, but administrators will see that you have left the project on this date.
            </p>
            <DatePicker
              onChange={(date: Dayjs | null) => {
                if (date) {
                  setLeaveProjectDate(date.format('YYYY-MM-DD'));
                }
              }}
              value={leaveProjectDate ? dayjs(leaveProjectDate) : null}
            />
            {
              false && 
              <ExitSurvey />
            }
            <div className='ModalButtons'>
              <Button onClick={() => leaveProject()}>Confirm</Button>
              <Button type='primary' onClick={() => setShowLeaveProjectModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default AddRecord;