import { useState } from 'react';
import { Activity, MeasurementPeriod } from '../../../Utils/Types';
import './AdminView.scss';
import { tempFakeAdminRecords } from '../../../Utils/TempFakeData';
import AllUserRecords from './AllUserRecords';

// AdminView
const AdminView = (props: {}) => {

    // will pull these from database, and re-pull after user adds a new record
    const [activities, setActivities] = useState<Array<MeasurementPeriod>>(tempFakeAdminRecords);

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
      {/* <AllUserRecords activities={activities} /> */}
    </div>
  );
};

export default AdminView;
