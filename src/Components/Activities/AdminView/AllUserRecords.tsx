import { Table } from 'antd';
import './AllUserRecords.scss';
import { MeasurementPeriod } from '../../../Utils/Types';

// AllUserRecords
// TODO- NOT a priority, focus rn is on adding new records 
const AllUserRecords = (props: {
    periods: Array<MeasurementPeriod>
}) => {

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
    ];

    const tableData = props.periods.map((period: any, index: number) => {
        console.log(period);
        return {
            key: index,
            email: period.Email,
            startDate: period.StartDate,
            endDate: period.EndDate,
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
                        position: ['none', props.periods.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                />
            </div>
        </div>
    );
};

export default AllUserRecords;