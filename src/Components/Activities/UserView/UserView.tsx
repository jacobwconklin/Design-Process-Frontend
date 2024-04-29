import { useState } from 'react';
import { Record } from '../../../Utils/Types';
import AddRecord from './AddRecord';
// import ExistingRecords from './ExistingRecords';
import './UserView.scss';
import { tempFakeUserRecords } from '../../../Utils/TempFakeData';

// UserView
const UserView = (props: {}) => {

    // will pull these from database, and re-pull after user adds a new record
    const [records, setRecords] = useState<Array<Record>>(tempFakeUserRecords);

    // TODO pull records from database with use effect

    const addRecord = (record: Record) => {
      // add record to local state so db doesn't have to be pulled in again (alternatively pull db again)
      setRecords([...records, record]);
    }

  return (
    <div className="UserView ColumnFlex">
      <h1>User View</h1>
      <AddRecord addRecord={addRecord} />
      {/* <ExistingRecords records={records} /> */}
    </div>
  );
};

export default UserView;
