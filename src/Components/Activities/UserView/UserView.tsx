import AddRecord from './AddRecord';
import ExistingRecords from './ExistingRecords';
import './UserView.scss';

// UserView
const UserView = (props: {}) => {
  return (
    <div className="UserView ColumnFlex">
      <h1>UserView</h1>
      <AddRecord />
      <ExistingRecords />
    </div>
  );
};

export default UserView;