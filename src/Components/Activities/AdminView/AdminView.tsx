import { useState } from 'react';
import { Record } from '../../../Utils/Types';
import './AdminView.scss';
import { tempFakeAdminRecords } from '../../../Utils/TempFakeData';
import AllUserRecords from './AllUserRecords';
import { Button } from 'antd';

// AdminView
const AdminView = (props: {}) => {

    // will pull these from database, and re-pull after user adds a new record
    const [records, setRecords] = useState<Array<Record>>(tempFakeAdminRecords);

    // TODO pull records from database with use effect

  return (
    <div className="AdminView ColumnFlex">
      <h1>Admin View</h1>
      <div className='Bubble'>
        <h2>Actions</h2>
        <ul>
            <li>Show users who haven't entered a record in past x amount of time?</li>
            <li>Show users with fewest records?</li>
        </ul>
      </div>
      <AllUserRecords records={records} />
    </div>
  );
};

export default AdminView;
