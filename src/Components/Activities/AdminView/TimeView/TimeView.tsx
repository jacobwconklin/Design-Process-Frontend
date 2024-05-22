import { Table } from 'antd';
import './TimeView.scss';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { MeasurementPeriod, UserMeasurementPeriod } from '../../../../Utils/Types';
import { postRequest } from '../../../../Utils/Api';
import { objectKeysFirstLetterToLowerCase } from '../../../../Utils/Utils';

// TimeView
const TimeView = (props: {}) => {

    // get startDate of current measurement period we are in right now
    const getCurrentPeriodStartDate = () => {
        // get the current date
        let currentPeriodStartDate = dayjs();
        // get the start of the current measurement period
        while (currentPeriodStartDate.day() !== 1 || currentPeriodStartDate.day() !== 4) {
            currentPeriodStartDate = currentPeriodStartDate.subtract(1, 'day');
        }
        return currentPeriodStartDate;
    }

    // TODO Let users change this to show older measurement periods:
    const [lastMeasurementPeriodShowing, setLastMeasurementPeriodShowing] = useState<Dayjs>(getCurrentPeriodStartDate());

    // holds start dates as strings of the 5 previous measurement periods before lastMeasurementPeriodShowing
    const [previousMeasurementPeriodStartDates, setPreviousMeasurementPeriodStartDates] = useState<Array<string>>([]);
    // holds all measurement periods within range of the last 5 measurement periods as pulled from the db and sorted into users
    const [userMeasurementPeriods, setUserMeasurementPeriods] = useState<Array<UserMeasurementPeriod>>([]);

    // use Effect that finds the 5 previous measurement periods before the one we are currently in to add to the table
    // will also pull all measurement periods within range of the last 5 measurement periods
    // useEffect(() => {
    //     const pullUserMeasurementPeriods = async (earliestStartDate: string) => {
    //         const response = await postRequest('navydp/getMeasurementPeriodsInRange', JSON.stringify({ 
    //             earliestStartDate,
    //             latestStartDate: lastMeasurementPeriodShowing.format('YYYY-MM-DD') 
    //         }));
    //         if (response.success) {
    //             const finalUserMeasurementPeriods: Array<UserMeasurementPeriod> = [];
    //             response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)).map((measurementPeriodRow: MeasurementPeriod) => {
    //                 // if email is already in there, just append the period to the userMeasurementPeriods array
    //                 if (finalUserMeasurementPeriods.find((userMeasurementPeriod: UserMeasurementPeriod) => userMeasurementPeriod.email   
    //                 === measurementPeriodRow.email)) {
    //                     finalUserMeasurementPeriods.find((userMeasurementPeriod: UserMeasurementPeriod) => userMeasurementPeriod.email === measurementPeriodRow.email)?.periods.push(measurementPeriodRow);
    //                 } else {
    //                     // first time we are seeing this email, add it as a new UserMeasurementPeriod and don't forget to save this period as the first
    //                     finalUserMeasurementPeriods.push({
    //                         email: measurementPeriodRow.email,
    //                         periods: [measurementPeriodRow]
    //                     });
    //                 }
    //                 return {};
    //             })
    //             setUserMeasurementPeriods(finalUserMeasurementPeriods);
    //         } else {
    //             console.error("Error getting all User Measurement Periods", response);
    //         }
    //     }

    //     let dayToCheck = lastMeasurementPeriodShowing.subtract(1, 'day');
    //     let periodsToDisplay: Array<string> = [];
    //     let periodsFound = 0;
    //     while (periodsFound < 5) {
    //         if (dayToCheck.day() === 1 || dayToCheck.day() === 4) {
    //             periodsToDisplay.push(
    //                 dayToCheck.format('YYYY-MM-DD'),
    //                 // below is neeed if we want an array of type: Array<MeasurementPeriod> , which is overkill
    //                 // endDate: dayToCheck.add(dayToCheck.day() === 1 ? 2 : 1, 'day').format('YYYY-MM-DD'),
    //                 // entered: "default",
    //                 // email: "default",
    //                 // totalDuration: 0,
    //                 // lastTime: false
    //             );
    //             periodsFound++;
    //             if (periodsFound === 5) {
    //                 // we have our last measurement period to show, now we can request the info from the backend.
    //                 // pullUserMeasurementPeriods(dayToCheck.format('YYYY-MM-DD'));
    //             }
    //         }
    //         dayToCheck = dayToCheck.subtract(1, 'day');
    //     }
    //     console.log("prev periods build =", periodsToDisplay);
    //     setPreviousMeasurementPeriodStartDates(periodsToDisplay);

    // }, [lastMeasurementPeriodShowing])

    // TODO should have toggle to not display users who have indicated they are finsihed working on the project

    const columns = [
        {
            title: 'User Email',
            dataIndex: 'email',
            key: 'email',
        },
        ...previousMeasurementPeriodStartDates.map((date: string, index: number) => {
            return {
                title: `Start Date: ${date}`, // TODO add more info here such as end date, day of week, hours expected, etc.
                dataIndex: `period${date}`,
                key: `period${date}`,
            }
        })
    ];

    const tableData = userMeasurementPeriods.map((userMeasurementPeriod: UserMeasurementPeriod, index: number) => {
        let dataObject: any =  {
            key: index,
            email: userMeasurementPeriod.email,
        }
        previousMeasurementPeriodStartDates.forEach((date: string) => {
            const userHasThisDate = userMeasurementPeriod.periods.find((period: MeasurementPeriod) => period.startDate === date);
            const isLastTime = userHasThisDate ? userHasThisDate.lastTime : false;

            dataObject[`period${date}`] = {isLastTime, hours: userHasThisDate ? userHasThisDate.totalDuration : 0} // can hopefully render interesting colors and tags based on this information, WILL need a render in the columns
        });
        return dataObject;
    })


    return (
        <div className="TimeView Bubble">
            <h1>Measurement Periods in Chronological Order</h1>
            <Table 
                columns={columns} 
                dataSource={tableData} 
                pagination={{
                    position: ['none', userMeasurementPeriods.length > 10 ? 'bottomCenter' : "none"],
                    showSizeChanger: true,
                    defaultPageSize: 10,
                }}
                rowClassName={(record, index) => {
                    return 'ClickableRow';
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => { alert("Work in progress, you selected user: " + record.email) }, // click row
                    };
                }}
            />
        </div>
    );
};

export default TimeView;