import AddRecord from './AddRecord';
import './UserView.scss';

// UserView
const UserView = (props: {}) => {

  return (
    <div className="UserView ColumnFlex">
      <h1>User View</h1>
      <AddRecord />
      {/* <ExistingRecords records={records} /> */}
    </div>
  );
};

export default UserView;
