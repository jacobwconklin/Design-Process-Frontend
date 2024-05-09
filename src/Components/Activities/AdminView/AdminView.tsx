import { useEffect, useState } from 'react';
import { MeasurementPeriod } from '../../../Utils/Types';
import './AdminView.scss';
import { tempFakeAdminRecords } from '../../../Utils/TempFakeData';
import AllUserRecords from './AllUserRecords';
import { getRequest } from '../../../Utils/Api';
import { Button } from 'antd';

// AdminView
// Brainstorming: 
/*
  I think AdminView should show two tables by default: 
  1) all users
  2) all measurement periods
  These will be sortable by key metrics such as, user with least responses, user with longest time since responding, measurement period with the least amount of total hours logged, type of measurement period, etc.
  Admins should be able to click on a user or measurement period to see more detailed information about them, such as all activities for a given measurement period, or all measurement periods for a given user (which can be clicked on to show all activities).
  pulling up a new user can also allow admin to send them a pre-written email about their lack of responses, to do some other action, etc.
  Maybe even add way for admins to flag specific users / measurement periods / activities so they can review / delete flagged items later?
*/
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
          <li>Clicking a Measurement Periods will show all activities in that period</li>
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
