import { useEffect, useState } from 'react';
import { MeasurementPeriod, UserInformation, UserTableInformation } from '../../../Utils/Types';
import './AdminView.scss';
import AllUserRecords from './AllUserRecords';
import { getRequest, postRequest } from '../../../Utils/Api';
import { Button } from 'antd';
import DetailedUserInfo from './DetailedUserInfo';
import PeriodsTable from './PeriodsTable';
import { objectKeysFirstLetterToLowerCase } from '../../../Utils/Utils';
import ActivitiesTable from './ActivitiesTable';

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
  // Below code pulls ALL measurement periods:
  // const [periods, setPeriods] = useState<Array<MeasurementPeriod>>(tempFakeAdminRecords);
  // useEffect(() => {
  //   // get all Measurement Period records from the db
  //   const pullPeriods = async () => {
  //     const response = await getRequest('navydp/getAllMeasurementPeriods');
  //     if (response.success) {
  //       setPeriods(response.data);
  //     } else {
  //       console.error("Error getting all Measurement Periods", response);
  //     }
  //   }
  //   pullPeriods();
  // }, [])

  // pulls and holds all users
  const [allUsers, setAllUsers] = useState<Array<UserTableInformation>>([]);
  useEffect(() => {
    // get all Measurement Period records from the db
    const pullAllUsers = async () => {
      const response = await getRequest('navydp/getAllUserRecords');
      if (response.success) {
        setAllUsers(response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)) as Array<UserTableInformation>);
      } else {
        console.error("Error getting all User Information", response);
      }
    }
    pullAllUsers();
  }, [])

  // information about user admin has selected
  const [selectedUser, setSelectedUser] = useState<UserTableInformation | null>(null);

  // pull detailed information about a user
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserInformation | null>(null);
  const pullDetailedUserInfo = async (email: string) => {
    const response = await postRequest('navydp/getUserDetails', JSON.stringify({ email }));
    if (response.success) {
      setSelectedUserDetails(objectKeysFirstLetterToLowerCase(response.data) as UserInformation);
    } else {
      console.error("Error getting User Information", response);
    }
  }

  // pull all measurement periods for a given user
  const [userPeriods, setUserPeriods] = useState<Array<MeasurementPeriod>>([]);
  const pullAllMeasurementPeriodsForUser = async (email: string) => {
    const response = await postRequest('navydp/getAllMeasurementPeriodsForUser', JSON.stringify({ email }));
    if (response.success) {
      setUserPeriods(response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)) as Array<MeasurementPeriod>);
    } else {
      console.error("Error getting all Measurement Periods for User", response);
    }
  }

  // set selected user and pull their details and measurement periods
  const selectUser = async (user: UserTableInformation) => {
    setSelectedPeriod(null);
    setSelectedUser(user);
    pullDetailedUserInfo(user.email);
    pullAllMeasurementPeriodsForUser(user.email);
  }

  // Pull activities for a given Measurement Period when chosen by admin
  const [selectedPeriod, setSelectedPeriod] = useState<MeasurementPeriod | null>(null);

  // TODO may add selectActivity to show all details about answers to a single activity

  return (
    <div className="AdminView ColumnFlex Top">
      <div className='Bubble'>
        <h1>Admin Dashboard</h1>
        <div className='AdminDashButtons RowFlex'>
          <Button
            onClick={async () => {
              setSelectedPeriod(null);
              setSelectedUserDetails(null);
              setSelectedUser(null);
              setUserPeriods([]);
              const response = await getRequest('navydp/getAllUserRecords');
              if (response.success) {
                setAllUsers(response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)) as Array<UserTableInformation>);
              } else {
                console.error("Error getting all User Records", response);
              }
            }}
          >
            Refresh
          </Button>

        </div>
      </div>
      <div className='AdminScreensHolder'>
        <AllUserRecords
          users={allUsers}
          selectUser={selectUser}
        />
        {
          selectedUser &&
          <DetailedUserInfo
            user={{ ...selectedUser, ...selectedUserDetails }}
          />
        }
        {
          userPeriods.length > 0 &&
          <PeriodsTable
            periods={userPeriods}
            selectPeriod={setSelectedPeriod}
          />
        }
        {
          selectedPeriod &&
          <ActivitiesTable
            period={selectedPeriod}
          />
        }
      </div>
    </div>
  );
};

export default AdminView;
