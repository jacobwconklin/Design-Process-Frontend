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
    password: string;
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
}

// Holds simpler information about a user to be displayed in the admin dashboard table
// All information for players obtained from the registration form
export interface UserTableInformation {
    email: string; // TODO if anonymitiy is desired, hide the email and use a unique ID
    
    // employer: string, TODO, could leave these, but won't for now
    // team: string;
    // title: string;

    // compiled by backend:
    lastRecordedPeriodStartDate: string;
    lastRecordedPeriodEndDate: string;
    numberOfPeriods: number;
    totalHoursRecorded: number;
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
    pointScale?: number;
}