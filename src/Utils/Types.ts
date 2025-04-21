export interface UserContextType {
    isAdmin: Boolean;
    setIsAdmin: (isAdmin: boolean) => void;
    email: string | null;
    setEmail: (email: string) => void;
    authToken: string | null;
    setAuthToken: (authToken: string) => void;
}

// All information for players obtained from the registration form
export interface UserInformation {
    email: string;
    password?: string;
    gender: string;
    age: null | number;
    ethnicity: string;
    employer: string,
    team: string;
    title: string;

    // isCollegeStudent: number;
    // university?: string;
    // degreeProgram?: string;
    // yearsInProgram?: null | number;

    // Education levels:  "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate", "Other"
    bachelorsEducation?: string;
    mastersEducation?: string;
    doctorateEducation?: string;
    otherEducationName?: string | null;
    otherEducation?: string;

    /**
     * "Aerodynamics", "Computer Science or Computer Engineering", "Electrical Engineering", 
        "Electromagnetics, EMI, EMC", "Environmental Testing", "Logistics and/or Supply Chains", "Manufacturing", 
        "Mechanical Design", "Operations Research", "Project or Program Management", "Systems (or Mission) Engineering",
        "Structural Analysis", "Threat Analysis"
     */
    aerodynamicsSpecialization?: number;
    computerScienceSpecialization?: number;
    electricalEngineeringSpecialization?: number;
    electromagneticsSpecialization?: number;
    environmentalTestingSpecialization?: number;
    logisticsSpecialization?: number;
    manufacturingSpecialization?: number;
    mechanicalDesignSpecialization?: number;
    operationsResearchSpecialization?: number;
    projectManagementSpecialization?: number;
    systemsEngineeringSpecialization?: number;
    structuralAnalysisSpecialization?: number;
    threatAnalysisSpecialization?: number;
    otherSpecializationName?: string | null;
    otherSpecialization?: number;

    /**
     * Any shipyard, NAVSEA, OPNAV, Pentagon, NSWC- Dahlgren Division, NSWC- Carderock Division, NSWC – Other (please specify),
     */
    shipyardAgency?: number;
    navseaAgency?: number;
    nswcDahlgrenAgency?: number;
    nswcCarderockAgency?: number;
    opnavAgency?: number;
    pentagonAgency?: number;
    otherNswcAgencyName?: string | null;
    otherAgency?: number;

    // experience:
    riskAnalysisExperience: null | number | string;
    supplierExperience: null | number | string;

    // familiarity:
    projectContextFamiliarity: null | number | string;
    navyPlatformFamiliarity: null | number | string;
    designChangeCharacteristicsFamiliarity: null | number | string;

    // admin dash fields
    joinedProjectDate?: string;
    leftProjectDate?: string;
}

// Holds information about measurement period (contains one or more activity records)
export interface MeasurementPeriod {
    id?: number;
    email: string;
    entered: string;
    startDate: string;
    endDate: string;
    totalDuration: number;
}

// holds information about a single activity record
export interface Activity {
    type: string;
    duration: number;
    question1: string;
    question2: string;
    question3?: string;
    question4?: string;
}

// a group of measurement periods for a single user in a range to show on admin dashboard
export interface UserMeasurementPeriod {
    // from user table
    email: string;
    joinedProjectDate?: string;
    leftProjectDate?: string;

    // compiled by backend
    lastRecordedPeriodStartDate: string;
    lastRecordedPeriodEndDate: string;
    numberOfPeriods: number;
    totalHoursRecorded: number;

    // sent from backend and compiled by frontend
    periods: Array<MeasurementPeriod>;
}

// Holds simpler information about a user to be displayed in the admin dashboard table
// All information for players obtained from the registration form
export interface UserTableInformation {
    email: string;

    joinedProjectDate?: string;
    leftProjectDate?: string;

    // compiled by backend:
    lastRecordedPeriodStartDate: string;
    lastRecordedPeriodEndDate: string;
    numberOfPeriods: number;
    totalHoursRecorded: number;
}


// Holds simpler information about a user to be displayed in the admin dashboard table
// All information for players obtained from the registration form
export interface ExpandedUserTableInformation {
    joinedProjectDate?: string;
    leftProjectDate?: string;

    // compiled by backend:
    lastRecordedPeriodStartDate: string;
    lastRecordedPeriodEndDate: string;
    numberOfPeriods: number;
    totalHoursRecorded: number;
}