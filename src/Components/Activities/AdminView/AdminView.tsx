import { useEffect, useState } from 'react';
import { MeasurementPeriod } from '../../../Utils/Types';
import './AdminView.scss';
import { tempFakeAdminRecords } from '../../../Utils/TempFakeData';
import AllUserRecords from './AllUserRecords';
import { getRequest } from '../../../Utils/Api';
import { Button } from 'antd';

// AdminView
const AdminView = (props: {}) => {

  // will pull these from database, and re-pull after user adds a new record
  const [periods, setPeriods] = useState<Array<MeasurementPeriod>>(tempFakeAdminRecords);
  useEffect(() => {
    // get all Measurement Period records from the db
    const pullPeriods = async () => {
      const response = await getRequest('navydp/getAllMeasurementPeriods');
      if (response.success) {
        setPeriods(response.data);
      } else {
        console.error("Error getting all Measurement Periods", response);
      }
    }
    pullPeriods();
  }, [])

  // Pull activities for a given Measurement Period when chosen by user... TODO 


  // TODO pull records from database with use effect
  // TODO let admin click a measurement period to see all activities and total hours logged for it. 

  return (
    <div className="AdminView ColumnFlex Top">
      <div className='Bubble'>
        <h2>Admin Dashboard</h2>
        <Button
          onClick={async () => {
            const response = await getRequest('navydp/getAllMeasurementPeriods');
            console.log("Response from getting all Measurement Periods", response);
            if (response.success) {
              setPeriods(response.data);
            } else {
              console.error("Error getting all Measurement Periods", response);
            }
          }}
        >
          Refresh Data
        </Button>
        <p>Will add functionality such as:</p>
        <ul>
          <li>Clicking a Measurement Periods will show all activities</li>
          <li>Could show all activities or measurement periods for a given user</li>
          <li>Sort users by least responses or longest time since responding</li>
          <li>etc.</li>
        </ul>
      </div>
      <AllUserRecords periods={periods} />
    </div>
  );
};

export default AdminView;
