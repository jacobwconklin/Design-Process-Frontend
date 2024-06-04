import { Button, DatePicker, DatePickerProps, Switch, Table, TableColumnsType, Tooltip } from 'antd';
import './TimeView.scss';
import { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ExpandedUserTableInformation, MeasurementPeriod, UserContextType, UserMeasurementPeriod, UserTableInformation } from '../../../../Utils/Types';
import { postRequest } from '../../../../Utils/Api';
import { objectKeysFirstLetterToLowerCase } from '../../../../Utils/Utils';
import { UserContext } from '../../../../App';
import { QuestionCircleOutlined } from '@ant-design/icons';

// TimeView
const TimeView = (props: {
    selectUser: (user: UserTableInformation) => void
}) => {

    // TODO add filtering / searching to tables

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
            // build finalUserMeasurementPeriods to FIRST take in a list of ALL emails from BE. Use this master list of emails to start building the finalUserMeasurementPeriods array, which will also have joinedProjectDate and leftProjectDate attributes for the users (or not indicating they haven't left yet or they joined before I added that field to the db). 

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

    // get the appropriate cell class name and cell value based on the record
    const getCellInformation = (record: any, date: string): { className: string, value: string } => {
        // return an object with this signature:
        let cellInformation = { className: '', value: '' };
        // FIRST check if user does have a valid record for this date
        if (record[`${date}`].hours >= 0) {
            // user has a valid record for this date. Now check if it is below 
            // the number of expected hours. 
            if (record[`${date}`].hours < (dayjs(date).day() === 1 ? 24 : 16)) {
                cellInformation.className = 'LowHours';
                cellInformation.value = `${record[`${date}`].hours} ( -${(dayjs(date).day() === 1 ? 24 : 16) - record[`${date}`].hours} )`;
            } else {
                cellInformation.className = 'Valid';
                cellInformation.value = `${record[`${date}`].hours} hours`;
            }
        } else if (record?.joinedProjectDate && dayjs(date).isBefore(dayjs(record.joinedProjectDate))) {
            // SECOND check if date is before user joined the project
            cellInformation.className = 'BeforeJoin';
            cellInformation.value = 'Before Join';
        } else if (record?.leftProjectDate && dayjs(date).isAfter(dayjs(record.leftProjectDate))) {
            // THIRD check if date is after user left the project
            cellInformation.className = 'AfterLeave';
            cellInformation.value = 'Left Project';
        } else {
            // Otherwise, user has not submitted a record for this date and should have
            cellInformation.className = 'NoRecord';
            cellInformation.value = 'X';
        }
        return cellInformation;
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
                title: <div><p>Start Date: {date} </p> <p>{getDayOfWeekAndExpectedHoursMessage(date)}</p></div>,
                dataIndex: `period${date}`,
                key: `period${date}`,
                render: (text: any, record: any) => {
                    const cellInformation = getCellInformation(record, date);
                    return (
                        <div className={`DateCell ${cellInformation.className}`}>
                            {cellInformation.value}
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

            dataObject[`${date}`] = { hours: userHasThisDate ? userHasThisDate.totalDuration : -1 } // 
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
                <b>Click a + on the left to reveal more information about a user, and click any row in the table to show even more user details and actions below.</b>
                <div className='KeyBox'>
                    <Tooltip
                        title={"In the table below, A gray rectangle indicates the user was not part of the project at the time of the measurement period. The cell will either state Before Join if the period of time is before the user joined the project, or Left Project if the date is after the user already left. A red rectangle with an 'X' indicates the user has not submitted a report for the measurement period.  A yellow rectangle indicates that the user has submitted a report for the measurement period but they submitted activities with a total sum of hours less than the expected number of hours. A green rectangle indicates that the user has submitted a report for the measurement period. The number inside of a green or yellow rectangle is the total number of hours the user recorded across all activities in that measurement period. In a yellow rectangle the number of hours is followed by the number of hours the user is below the expected number of hours for that measurement period."}
                    >
                        <h3 className='TooltipHolder' >
                            Table Cell Key
                            <span> <QuestionCircleOutlined /> </span>
                        </h3>
                    </Tooltip>
                    <div className='KeysRow'>
                        <div className='OneKey'>
                            <p>Not on Project</p>
                            <div className='ColorBox Gray'></div>
                        </div>
                        <div className='OneKey'>
                            <p>Missing Record</p>
                            <div className='ColorBox Red'></div>
                        </div>
                        <div className='OneKey'>
                            <p>Lacking Hours</p>
                            <div className='ColorBox Yellow'></div>
                        </div>
                        <div className='OneKey'>
                            <p>Full Valid Record</p>
                            <div className='ColorBox Green'></div>
                        </div>

                    </div>
                </div>
                <br />
                <div className='HideUserToggle RowFlex'>
                    <p>Hide users who have left the project?</p>
                    <br />
                    <br />
                    <br />
                    <p>No</p>
                    <Switch
                        checked={hideUsersWhoLeftProject}
                        onChange={(checked) => setHideUsersWhoLeftProject(checked)}
                    />
                    <p>Yes</p>
                </div>
                <Tooltip
                    className='TooltipHolder'
                    title={`Currently showing the last 5 measurement periods that started before and including the measurement period that started on: ${lastMeasurementPeriodShowing.format('YYYY-MM-DD')}. Click the date picker to change that date, and see 5 measurement periods back from the date you select. Alternatively click the buttons below the date picker to move the date back or forward by one measurement period.`}
                >
                    <h3>
                        Latest Date Shown in Table
                        <span> <QuestionCircleOutlined /> </span>
                    </h3>
                </Tooltip>
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
                <div className='MoveDateButtons RowFlex'>
                    <Button
                        onClick={() => {
                            let dayToCheck = lastMeasurementPeriodShowing.subtract(1, 'day');
                            while (dayToCheck.day() !== 1 && dayToCheck.day() !== 4) {
                                dayToCheck = dayToCheck.subtract(1, 'day');
                            }
                            setLastMeasurementPeriodShowing(dayToCheck);
                        }}
                    >
                        Previous Period
                    </Button>
                    <Button
                        onClick={() => {
                            let dayToCheck = lastMeasurementPeriodShowing.add(1, 'day');
                            while (dayToCheck.day() !== 1 && dayToCheck.day() !== 4) {
                                dayToCheck = dayToCheck.add(1, 'day');
                            }
                            setLastMeasurementPeriodShowing(dayToCheck);
                        }}
                    >
                        Next Period
                    </Button>
                </div>
                <br />
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
                        onClick: event => { props.selectUser(record); }, // click row
                    };
                }}
            />
            <br />
        </div>
    );
};

export default TimeView;