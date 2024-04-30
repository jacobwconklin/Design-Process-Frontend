import { Table } from 'antd';
import './AllUserRecords.scss';
import { Activity } from '../../../Utils/Types';

// AllUserRecords
// TODO- NOT a priority, focus rn is on adding new records 
const AllUserRecords = (props: {
    activities: Array<Activity>
}) => {

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Activity Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Duration in Hours',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Question 1',
            dataIndex: 'q1',
            key: 'q1',
        },
        {
            title: 'Question 2',
            dataIndex: 'q2',
            key: 'q2',
        }
    ];

    const tableData = props.activities.map((record: Activity, index: number) => {
        return {
            key: index,
            email: record.email,
            type: record.type,
            duration: record.duration,
            q1: record.question1,
            q2: record.question2
        }
    })


    return (
        <div className="AllUserRecords ColumnFlex">
            <h1>AllUserRecords</h1>
            <div className='RecordTable'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                        position: ['none', props.activities.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                />
            </div>
        </div>
    );
};

export default AllUserRecords;