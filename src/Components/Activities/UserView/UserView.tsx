import AddRecord from './AddRecord';
import './UserView.scss';

// UserView
const UserView = (props: {}) => {

  return (
    <div className="UserView ColumnFlex Top">
      <AddRecord />
      {/* <ExistingRecords records={records} /> */}
    </div>
  );
};

export default UserView;
