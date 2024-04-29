import { Button, InputNumber, Select } from 'antd';
import './AddRecord.scss';
import { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';

// AddRecord
const AddRecord = (props: {}) => {

  // are they supposed to add as many as they want?

  const [activityType, setActivityType] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  const activityTypes = [
    { value: '', label: '' },
    { value: 'updated design model', label: 'updated design model' },
    { value: 'retrieved information', label: 'retrieved information' },
    { value: 'waited for X', label: 'waited for X' },
    { value: 'ran a simulation', label: 'ran a simulation ' },
    { value: 'Other', label: 'Other' },
  ]

  const saveRecord = () => {
    setAttemptedSubmit(true);
    if (!activityType || !duration || !notes) {
      return;
    }
    // save record to the database
    alert('Record Saved');
    // clear the form
    setActivityType('');
    setDuration(0);
    setNotes('');
    setAttemptedSubmit(false);
  }

  return (
    <div className="AddRecord ColumnFlex">
      <div className='Bubble'>
        <h2>Record a New Activity</h2>
        <p>Activity Type</p>
        <Select
          // dropdown for activity type
          className={attemptedSubmit && !activityType ? "ErrorForm" : ""}
          defaultValue={''}
          value={activityType}
          options={activityTypes}
          onChange={(value) => setActivityType(value)}
        />
        <p>Time Spent on Activity</p>
        <InputNumber
          // input for duration in hours
          className={attemptedSubmit && !duration ? "ErrorForm" : ""}
          min={1}
          max={10000}
          value={duration}
          onChange={(e) => setDuration(e ? e : 0)}
          addonAfter="Hours"
        />
        <p>Brief Description of Activity</p>
        <TextArea
          style={{maxWidth: '400px'}}
          // input for notes
          className={attemptedSubmit && !notes ? "ErrorForm" : ""}
          autoSize={{ minRows: 3 }}
          maxLength={240}
          placeholder='Notes about activity ... '
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value && event.target.value.length > 240 ? event.target.value.substring(0, 240) : event.target.value);
        }}
        />
        <br/>
        <Button
          onClick={() => saveRecord()}
        >
          Save Record
        </Button>
      </div>
    </div>
  );
};

export default AddRecord;