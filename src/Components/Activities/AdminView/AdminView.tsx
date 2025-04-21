import { useContext, useState } from 'react';
import { MeasurementPeriod, UserContextType, UserInformation, UserTableInformation } from '../../../Utils/Types';
import './AdminView.scss';
import { postRequest } from '../../../Utils/Api';
import DetailedUserInfo from './SelectedUserViews/DetailedUserInfo';
import PeriodsTable from './SelectedUserViews/PeriodsTable';
import { objectKeysFirstLetterToLowerCase } from '../../../Utils/Utils';
import ActivitiesTable from './SelectedUserViews/ActivitiesTable';
import { UserContext } from '../../../App';
import TimeView from './TimeView/TimeView';
import ReminderEmail from '../../../Reusable/ReminderEmail';

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

  const { email, authToken } = useContext(UserContext) as UserContextType;

  // information about user admin has selected
  const [selectedUser, setSelectedUser] = useState<UserTableInformation | null>(null);

  // show reminder email modal
  const [showSendEmail, setShowSendEmail] = useState(false);

  // pull detailed information about a user
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserInformation | null>(null);
  const pullDetailedUserInfo = async (userEmail: string) => {
    const response = await postRequest('navydp/getUserDetails', JSON.stringify({ adminEmail: email, token: authToken, email: userEmail }));
    if (response.success) {
      setSelectedUserDetails(objectKeysFirstLetterToLowerCase(response.data) as UserInformation);
    } else {
      console.error("Error getting User Information", response);
    }
  }

  // pull all measurement periods for a given user
  const [userPeriods, setUserPeriods] = useState<Array<MeasurementPeriod>>([]);
  const pullAllMeasurementPeriodsForUser = async (userEmail: string) => {
    const response = await postRequest('navydp/getAllMeasurementPeriodsForUser', JSON.stringify({ adminEmail: email, token: authToken, email: userEmail }));
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

  return (
    <div className="AdminView ColumnFlex Top">
      <div className='Bubble'>
        <h1>Admin Dashboard</h1>
      </div>
      <div className='TimeViewHolder'>
        <TimeView
          selectUser={selectUser}
        /> 
      </div>
      <div className='AdminScreensHolder'>
        {
          selectedUser &&
          <DetailedUserInfo
            user={{ ...selectedUser, ...selectedUserDetails}}
            sendEmail={() => setShowSendEmail(true)} 
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
      {
        showSendEmail && selectedUser &&
        <ReminderEmail 
          email={selectedUser.email}
          close={() => setShowSendEmail(false)}
        />
      }
    </div>
  );
};

export default AdminView;
