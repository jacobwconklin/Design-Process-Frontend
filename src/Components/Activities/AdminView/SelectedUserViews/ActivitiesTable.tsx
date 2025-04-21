import { Table } from 'antd';
import './ActivitiesTable.scss';
import { Activity, MeasurementPeriod, UserContextType } from '../../../../Utils/Types';
import { useContext, useEffect, useState } from 'react';
import { postRequest } from '../../../../Utils/Api';
import { objectKeysFirstLetterToLowerCase } from '../../../../Utils/Utils';
import { UserContext } from '../../../../App';

// ActivitiesTable
const ActivitiesTable = (props: {
    period: MeasurementPeriod
}) => {

    const {email, authToken} = useContext(UserContext) as UserContextType;

    // pull all activities for the given period in props
    const [activities, setActivities] = useState<Array<Activity>>([]);
    useEffect(() => {
        // get all Activities for the given period
        const pullActivities = async () => {
            const response = await postRequest('navydp/getActivityRecordsForPeriod', JSON.stringify({ 
                measurementPeriod: props.period.id, adminEmail: email, token: authToken
            }));
            if (response.success) {
                setActivities(response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)) as Array<Activity>);
            } else {
                console.error("Error getting all Activities for a measurement period", response);
            }
        }
        pullActivities();
    }, [authToken, email, props.period.id])

    const columns = [
        // {
        //     title: 'Number',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (text: any) => {
                if (text) {
                    return text + " hour" + (text === 1 ? "" : "s")
                } else {
                    return "N/A"
                }
            }
        },
    ];

    const tableData = activities.map((activity: any, index: number) => {
        return {
            key: index,
            id: activity.id,
            type: activity.type,
            duration: activity.duration,
        }
    })

    
    return (
        <div className="ActivitiesTable ColumnFlex Bubble">
            <h2>Activities For Measurment Period: </h2>
            <h2>From {props.period.startDate} To {props.period.endDate}</h2>
            <div className='TableInBubble'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={{
                        position: ['none', activities.length > 10 ? 'bottomCenter' : "none"],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                    }}
                />
            </div>
        </div>
    );
};

export default ActivitiesTable;