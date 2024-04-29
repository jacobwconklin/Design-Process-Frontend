import { Table } from 'antd';
import './AllUserRecords.scss';
import { Record } from '../../../Utils/Types';

// AllUserRecords
// TODO- NOT a priority, focus rn is on adding new records 
const AllUserRecords = (props: {
    records: Array<Record>
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
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
        },
        {
            title: 'Date Entered',
            dataIndex: 'entered',
            key: 'entered',
        }
    ];

    const tableData = props.records.map((record: Record, index: number) => {
        return {
            key: index,
            email: record.email,
            type: record.type,
            duration: record.duration,
            notes: record.notes,
            entered: record.entered
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
                        position: ['none', props.records.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                />
            </div>
        </div>
    );
};

export default AllUserRecords;