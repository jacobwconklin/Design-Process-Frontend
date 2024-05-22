import { Table } from 'antd';
import './AllUserRecords.scss';
import { UserTableInformation } from '../../../../Utils/Types';

// AllUserRecords
// TODO- NOT a priority, focus rn is on adding new records 
const AllUserRecords = (props: {
    users: Array<UserTableInformation>
    selectUser: (user: UserTableInformation) => void
}) => {

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Latest Record Start Date',
            dataIndex: 'lastRecordedPeriodStartDate',
            key: 'lastRecordedPeriodStartDate',
        },
        {
            title: 'Latest Record End Date',
            dataIndex: 'lastRecordedPeriodEndDate',
            key: 'lastRecordedPeriodEndDate',
        },
        {
            title: 'Total Hours Recorded',
            dataIndex: 'totalHoursRecorded',
            key: 'totalHoursRecorded',
        },
        {
            title: 'Number of Measurement Periods',
            dataIndex: 'numberOfPeriods',
            key: 'numberOfPeriods',
        }
    ];

    const tableData = props.users.map((user: UserTableInformation, index: number) => {
        return {
            key: index,
            email: user.email,
            lastRecordedPeriodStartDate: user.lastRecordedPeriodStartDate,
            lastRecordedPeriodEndDate: user.lastRecordedPeriodEndDate,
            totalHoursRecorded: user.totalHoursRecorded,
            numberOfPeriods: user.numberOfPeriods
        }
    })


    return (
        <div className="AllUserRecords ColumnFlex Bubble">
            <h2>All Users</h2>
            <p>Click a user row to show more information</p>
            <div className='TableInBubble'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                        position: ['none', props.users.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                    rowClassName={(record, index) => {
                        return 'ClickableRow';
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => { props.selectUser(record) }, // click row
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default AllUserRecords;