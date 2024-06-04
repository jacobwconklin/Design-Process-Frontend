import { Table } from 'antd';
import './PeriodsTable.scss';
import { MeasurementPeriod } from '../../../../Utils/Types';

// PeriodsTable
const PeriodsTable = (props: {
    periods: Array<MeasurementPeriod>
    selectPeriod: (period: MeasurementPeriod) => void
}) => {

    const columns = [
        // {
        //     title: 'Order Recorded',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        // },
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
        {
            title: 'Total Duration',
            dataIndex: 'totalDuration',
            key: 'totalDuration',
            render: (text: any) => {
                if (text) {
                    return text + " hour" + (text === 1 ? "" : "s")
                } else {
                    return "N/A"
                }
            }
        },
        {
            title: 'Record Entered At',
            dataIndex: 'entered',
            key: 'entered',
        },
    ];

    const tableData = props.periods.map((period: MeasurementPeriod, index: number) => {
        return {
            key: index,
            id: period.id,
            email: period.email,
            startDate: period.startDate,
            endDate: period.endDate,
            totalDuration: period.totalDuration,
            entered: period.entered,
        }
    })


    return (
        <div className="PeriodsTable ColumnFlex Bubble">
            <h2>Measurement Periods Recorded by: </h2>
            <h2>{props.periods[0].email}</h2>
            <p>Click a Measurement Period to see the activities recorded</p>
            <div className='TableInBubble'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                        position: ['none', props.periods.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                    rowClassName={(record, index) => {
                        return 'ClickableRow';
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => { props.selectPeriod(record) }, // click row
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default PeriodsTable;