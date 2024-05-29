import { Button, Spin } from "antd";
import './ReminderEmail.scss';
import { useState } from "react";
import { postRequest } from "../Utils/Api";
import TextArea from "antd/es/input/TextArea";
import { LoadingOutlined } from "@ant-design/icons";

// a space to create and send a reminder email for the admin to send to a given user
const ReminderEmail = (props: {
    email: string;
    close: () => void;
}) => {

    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false); // if the email was sent successfully

    // default message:
    const defaultMessage = 'This is a reminder to please fill out the Design Process Survey for each measurement period while you are working on the project. Measurement periods are from Monday to Wednesday and from Thursday to Friday. Log in and fill out the survey here: https://design-process-survey.azurewebsites.net. Thank you.'
    const [contents, setContents] = useState(defaultMessage); // this will be the contents of the email to be sent

    const sendEmail = async () => {
        setSending(true);
        try {
            // backend will send email through admin email
            const response = await postRequest('sendEmail', JSON.stringify({ email: props.email, message: contents }));
            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    props.close();
                }, 4000);
            } else {
                console.error("Error sending email", response);
                alert("Unable to send email")
            }
        } catch (error) {
            console.error("Error sending email", error);
            alert("Unable to send email")
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="ReminderEmail ColumnFlex">
            <div className="ModalBody">
                <h2>Send Reminder Email to:</h2>
                <h3>{props.email}</h3>
                <h3>Message Contents:</h3>
                <TextArea
                    autoSize={{ minRows: 10 }}
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                />
                <br />
                <br />
                <div className="ModalButtons">
                    <Button
                        onClick={props.close}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={sendEmail}
                    >
                        Send
                    </Button>
                </div>
                <br />
                {
                    sending && !success &&
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                }
                {
                    success &&
                    <>
                        <h3>Email Sent!</h3>
                        <p>This window will automatically close. </p>
                    </>
                }
            </div>
        </div>
    )
}

export default ReminderEmail;