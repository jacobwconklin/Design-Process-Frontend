import { DatePicker, DatePickerProps, Switch, Table, TableColumnsType } from 'antd';
import './TimeView.scss';
import { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ExpandedUserTableInformation, MeasurementPeriod, UserContextType, UserMeasurementPeriod, UserTableInformation } from '../../../../Utils/Types';
import { postRequest } from '../../../../Utils/Api';
import { objectKeysFirstLetterToLowerCase } from '../../../../Utils/Utils';
import { UserContext } from '../../../../App';

// TimeView
const TimeView = (props: {
    selectUser: (user: UserTableInformation) => void
}) => {

    // TODO improve look of table

    // TODO add info to headers such as day of week, expected hours, etc. 

    // TODO add filtering / searching to tables (Maybe combine tables into one?) -- check out nested antD table to nest "all user" table into chronological table. 

    // get admin credentials from context
    const { email, authToken } = useContext(UserContext) as UserContextType;

    // get startDate of current measurement period we are in right now
    const getCurrentPeriodStartDate = () => {
        // get the current date
        let currentPeriodStartDate = dayjs();
        // get the start of the current measurement period
        while (currentPeriodStartDate.day() !== 1 && currentPeriodStartDate.day() !== 4) {
            currentPeriodStartDate = currentPeriodStartDate.subtract(1, 'day');
        }
        return currentPeriodStartDate;
    }

    // Let users change this to show older measurement periods:
    const [lastMeasurementPeriodShowing, setLastMeasurementPeriodShowing] = useState<Dayjs>(getCurrentPeriodStartDate());

    // holds start dates as strings of the 5 previous measurement periods before lastMeasurementPeriodShowing
    const [previousMeasurementPeriodStartDates, setPreviousMeasurementPeriodStartDates] = useState<Array<string>>([]);

    // holds information about ALL users
    const [allUsers, setAllUsers] = useState<Array<UserTableInformation>>([]);

    // holds all measurement periods within range of the last 5 measurement periods as pulled from the db and sorted into users
    const [userMeasurementPeriods, setUserMeasurementPeriods] = useState<Array<UserMeasurementPeriod>>([]);

    // toggle to hide users who have left the project
    const [hideUsersWhoLeftProject, setHideUsersWhoLeftProject] = useState<boolean>(false);

    // use Effect that finds the 5 previous measurement periods before the one we are currently in to add to the table
    // will also pull all measurement periods within range of the last 5 measurement periods
    useEffect(() => {
        const pullUserMeasurementPeriods = async (earliestStartDate: string) => {
            // TODO redo building of finalUserMeasurementPeriods to FIRST take in a list of ALL emails from BE (that will come from the same response paload). Use this master list of emails to start building the finalUserMeasurementPeriods array, which will also have joinedProjectDate and leftProjectDate attributes for the users (or not indicating they haven't left yet or they joined before I added that field to the db). Then keep map below, except will not need the else clause adding users seen for the first time. 

            // first accept list of all users (including email, joinedProjectDate, and leftProjectDate, latest record start and end dates, total hours, and total measurement periods recorded) from the backend. Only need to do this once and can refer to it in the future

            let finalUserMeasurementPeriods: Array<UserMeasurementPeriod> = [];
            if (allUsers.length === 0) {
                // pull all users from BE
                const allUsersResponse = await postRequest('navydp/getAllUserRecords', JSON.stringify({ adminEmail: email, token: authToken }));
                if (allUsersResponse.success) {
                    setAllUsers(allUsersResponse.data.filter((user: UserTableInformation) => user.email !== 'admin'));
                    finalUserMeasurementPeriods = allUsersResponse.data.map((user: UserTableInformation) => ({ ...user, periods: [] }));
                }
                else {
                    console.error("Error getting all users", allUsersResponse);
                    return;
                }
            } else {
                // already pulled all users copy over to finalUserMeasurementPeriods
                finalUserMeasurementPeriods = allUsers.map((user: UserTableInformation) => ({ ...user, periods: [] }));
            }

            // filter out users who have left the project if the toggle is on
            if (hideUsersWhoLeftProject) {
                finalUserMeasurementPeriods = finalUserMeasurementPeriods.filter((user: UserTableInformation) => !user.leftProjectDate);
            }

            const response = await postRequest('navydp/getMeasurementPeriodsInRange', JSON.stringify({
                earliestStartDate,
                latestStartDate: lastMeasurementPeriodShowing.format('YYYY-MM-DD'),
                adminEmail: email,
                token: authToken
            }));
            if (response.success) {

                // then map over this list adding in measurement periods to their corresponding user to build the finalUserMeasurementPeriods array
                response.data.map((obj: any) => objectKeysFirstLetterToLowerCase(obj)).map((measurementPeriodRow: MeasurementPeriod) => {
                    // if email is already in there, just append the period to the userMeasurementPeriods array
                    if (finalUserMeasurementPeriods.find((userMeasurementPeriod: UserMeasurementPeriod) => userMeasurementPeriod.email
                        === measurementPeriodRow.email)) {
                        finalUserMeasurementPeriods.find((userMeasurementPeriod: UserMeasurementPeriod) => userMeasurementPeriod.email === measurementPeriodRow.email)?.periods.push(measurementPeriodRow);
                    } else {
                        // user not found, this is an error, ignore
                        console.error("User for this measurement period not found in finalUserMeasurementPeriods, this is an error", measurementPeriodRow);
                    }
                    return {};
                })
                setUserMeasurementPeriods(finalUserMeasurementPeriods);
            } else {
                console.error("Error getting all User Measurement Periods", response);
            }
        }

        let periodsToDisplay: Array<string> = [lastMeasurementPeriodShowing.format('YYYY-MM-DD')];
        let periodsFound = 1;
        let dayToCheck = lastMeasurementPeriodShowing.subtract(1, 'day');
        while (periodsFound < 5) {
            if (dayToCheck.day() === 1 || dayToCheck.day() === 4) {
                periodsToDisplay.push(
                    dayToCheck.format('YYYY-MM-DD'),
                    // below is neeed if we want an array of type: Array<MeasurementPeriod> , which is overkill
                    // endDate: dayToCheck.add(dayToCheck.day() === 1 ? 2 : 1, 'day').format('YYYY-MM-DD'),
                    // entered: "default",
                    // email: "default",
                    // totalDuration: 0,
                    // lastTime: false
                );
                periodsFound++;
                if (periodsFound === 5) {
                    // we have our last measurement period to show, now we can request the info from the backend.
                    pullUserMeasurementPeriods(dayToCheck.format('YYYY-MM-DD'));
                }
            }
            dayToCheck = dayToCheck.subtract(1, 'day');
        }
        setPreviousMeasurementPeriodStartDates(periodsToDisplay.reverse());

    }, [allUsers, authToken, email, lastMeasurementPeriodShowing, hideUsersWhoLeftProject])

    // Disable non Monday and Thursday dates as selectable start dates
    const disabledDates: DatePickerProps['disabledDate'] = (current: Dayjs) => {
        // return true if date is not a mon or thurs, or date hasn't happened yet, disabling all of those dates
        return current.isAfter(new Date()) || (current.day() !== 1 && current.day() !== 4); //current.isBefore('2024-05-01') || 
    };

    // returns a string with the day of the week and the expected hours for that measurement period
    const getDayOfWeekAndExpectedHoursMessage = (date: string): string => {
        const dayOfWeek = dayjs(date).format('dddd');
        const expectedHours = dayjs(date).day() === 1 ? 24 : 16;
        return `(${dayOfWeek}, ${expectedHours} hours expected)`;
    }

    const columns = [
        {
            title: 'User Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: any, record: any) => {
                return (
                    <div className='EmailCell'>
                        {record.email}
                    </div>
                );
            }
        },
        ...previousMeasurementPeriodStartDates.map((date: string, index: number) => {
            return {
                title: <div><p>Start Date: {date} </p> <p>{getDayOfWeekAndExpectedHoursMessage(date)}</p></div>, // TODO add more info here such as end date, day of week, hours expected, etc.
                dataIndex: `period${date}`,
                key: `period${date}`,
                render: (text: any, record: any) => {
                    // TODO for the class names will soon need a slightlymore sophisticated method that can also check if dates come after a 
                    // user indicated they left the project or before a user joined the project. 
                    return (
                        <div className={`DateCell ${record[`period${date}`].isLastTime ? 'LastTime' : (record[`period${date}`].hours >= 0 ? 'Regular' : 'NoRecord')}`}>
                            {record[`period${date}`].hours >= 0 ? record[`period${date}`].hours + ' hours' : 'X'}
                            {record[`period${date}`].isLastTime ? <span className='LastTimeTag'>Last Time</span> : null}
                        </div>
                    );
                }
            }
        })
    ];

    const tableData = userMeasurementPeriods.filter((ump: any) => ump.email !== 'admin').map((userMeasurementPeriod: UserMeasurementPeriod, index: number) => {
        let dataObject: any = {
            key: index,
            ...userMeasurementPeriod
        }
        previousMeasurementPeriodStartDates.forEach((date: string) => {
            const userHasThisDate = userMeasurementPeriod.periods.find((period: MeasurementPeriod) => period.startDate === date);
            const isLastTime = userHasThisDate ? userHasThisDate.lastTime : false;

            dataObject[`period${date}`] = { isLastTime, hours: userHasThisDate ? userHasThisDate.totalDuration : -1 } // 
        });
        return dataObject;
    });

    const expandedRowRender = (record: UserTableInformation) => {
        const columns: TableColumnsType<ExpandedUserTableInformation> = [
            /**
             * 
             * joinedProjectDate?: string;
             * leftProjectDate?: string;
             * lastRecordedPeriodStartDate: string;
             * lastRecordedPeriodEndDate: string;
             * numberOfPeriods: number;
             * totalHoursRecorded: number;
             */
            { title: 'Joined Project Date', dataIndex: 'joinedProjectDate', key: 'joinedProjectDate' },
            { title: 'Left Project Date', dataIndex: 'leftProjectDate', key: 'leftProjectDate' },
            { title: 'Last Recorded Period Start Date', dataIndex: 'lastRecordedPeriodStartDate', key: 'lastRecordedPeriodStartDate' },
            { title: 'Last Recorded Period End Date', dataIndex: 'lastRecordedPeriodEndDate', key: 'lastRecordedPeriodEndDate' },
            { title: 'Number of Periods', dataIndex: 'numberOfPeriods', key: 'numberOfPeriods' },
            { title: 'Total Hours Recorded', dataIndex: 'totalHoursRecorded', key: 'totalHoursRecorded' },
        ];

        // There will only be one row of data for each user,
        const data = [];
        data.push({
            key: record.email + 'expanded',
            joinedProjectDate: record.joinedProjectDate,
            leftProjectDate: record.leftProjectDate,
            lastRecordedPeriodStartDate: record.lastRecordedPeriodStartDate,
            lastRecordedPeriodEndDate: record.lastRecordedPeriodEndDate,
            numberOfPeriods: record.numberOfPeriods,
            totalHoursRecorded: record.totalHoursRecorded,
        });
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };


    return (
        <div className="TimeView">
            <div className='TimeViewInfo Bubble'>
                <h2>Measurement Periods in Chronological Order</h2>
                <h3>Click a + on the left to reveal more information about a user, and click any row in the table to show even more user details and actions below.</h3>
                <p>
                    In the table below, a red rectangle with an 'X' indicates the user has not submitted a report for the measurement period. A green rectangle indicates that the user has submitted a report for the measurement period. A yellow rectangle indicates that the user has submitted a report for the measurement period and it is the last time they will be submitting a report. The number inside of a green or yellow rectangle is the total number of hours the user recorded across all activities in that measurement period. 
                </p>
                <p className='SelectTimeMessage'>
                    Currentl showing the last 5 measurement periods that started before and including the measurement period that started on: {lastMeasurementPeriodShowing.format('YYYY-MM-DD')}.
                    Click the date picker to change that date, and see 5 measurement periods back from the date you select.
                </p>
                <br />
                <DatePicker
                    onChange={(date: Dayjs | null) => {
                        if (date) {
                            setLastMeasurementPeriodShowing(date);
                        }
                    }}
                    value={lastMeasurementPeriodShowing}
                    disabledDate={disabledDates}
                />
                <br />
                <br />
                <p>Hide users who have left the project?</p>
                <div className='HideUserToggle RowFlex'>
                    <p>No</p>
                    <Switch
                        checked={hideUsersWhoLeftProject}
                        onChange={(checked) => setHideUsersWhoLeftProject(checked)}
                    />
                    <p>Yes</p>
                </div>
            </div>
            <Table
                columns={columns}
                expandable={{ expandedRowRender }}
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
                        onClick: event => { console.log("Selected user: ", record); props.selectUser(record); }, // click row
                    };
                }}
            />
            <br />
        </div>
    );
};

export default TimeView;