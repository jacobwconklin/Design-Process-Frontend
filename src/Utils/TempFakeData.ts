import { Record } from "./Types"

// use to show taken emails
export const tempFakeEmails = [
    "john",
    "bob",
    "LostSinner117"
]

// hold a collection of records for a user
export const tempFakeUserRecords: Record[] = [
    {
        entered: "2021-09-01 2:08:47 PM",
        type: "updated design model",
        duration: 6,
        notes: "I did a thing"
    },
    {
        entered: "2021-09-01 2:08:47 PM",
        type: "retrieved information",
        duration: 3,
        notes: "I did another thing"
    },
    {
        entered: "2021-09-01 2:08:47 PM",
        type: "waited for X",
        duration: 2,
        notes: "took too long"
    },
    {
        entered: "2021-09-01 2:08:47 PM",
        type: "ran a simulation",
        duration: 4,
        notes: "fun activity"
    },
    {
        entered: "2021-09-01 2:08:47 PM",
        type: "Other",
        duration: 1,
        notes: "A really long description about the activity that goes on and on and on for as long as the text box allow which is close to 250 characters but not quite i think it is actually about 240 characters but it can obviously be more than 3 lines"
    }
]

// hold a fake collection of records the admin would see
export const tempFakeAdminRecords: Record[] = [
    {
        email: "john@gmail.com",
        entered: "2021-09-01 2:08:47 PM",
        type: "updated design model",
        duration: 6,
        notes: "I did a thing"
    },
    {
        email: "john@gmail.com",
        entered: "2021-09-01 2:08:47 PM",
        type: "retrieved information",
        duration: 3,
        notes: "I did another thing"
    },
    {
        email: "john@gmail.com",
        entered: "2021-09-01 2:08:47 PM",
        type: "waited for X",
        duration: 2,
        notes: "took too long"
    },
    {
        email: "john@gmail.com",
        entered: "2021-09-01 2:08:47 PM",
        type: "ran a simulation",
        duration: 4,
        notes: "fun activity"
    },
    {
        email: "john@gmail.com",
        entered: "2021-09-01 2:08:47 PM",
        type: "Other",
        duration: 1,
        notes: "A really long description about the activity that goes on and on and on for as long as the text box allow which is close to 250 characters but not quite i think it is actually about 240 characters but it can obviously be more than 3 lines"
    },
    {
        email: "jane@school.edu",
        entered: "2021-09-01 2:08:47 PM",
        type: "updated design model",
        duration: 6,
        notes: "I did sommething new"
    },
    {
        email: "jane@school.edu",
        entered: "2021-09-01 2:08:47 PM",
        type: "retrieved information",
        duration: 3,
        notes: "I did another thing"
    },
]