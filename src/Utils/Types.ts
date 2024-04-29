export interface UserContextType {
    isAdmin: Boolean;
    setIsAdmin: (isAdmin: boolean) => void;
    email: string | null;
    setEmail: (email: string) => void;
    authToken: string | null;
    setAuthToken: (authToken: string) => void;
}

// All information for players obtained from the registration form
export interface PlayerInformation {
    id?: string;
    name: string;
    email: string;
    password: string;
    participationReason: string;
    gender: string;
    age: null | number;
    residence: string;
    ethnicity: string;

    isCollegeStudent: number;
    university?: string;
    degreeProgram?: string;
    yearsInProgram?: null | number;

    // Education levels: "HighSchool", "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate", "Other"
    highschoolEducation?: string;
    bachelorsEducation?: string;
    mastersEducation?: string;
    doctorateEducation?: string;
    otherEducationName?: string | null;
    otherEducation?: string;

    riskAnalysisExperience: null | number | string;
    supplierExperience: null | number | string;
    proposalOrStatementOfWorkExperience: null | number | string;
    bidsForRequestsExperience: null | number | string;
    systemArchitectureExperience: null | number | string;
    golfExperience: null | number | string;
    systemsEngineeringExpertise: null | number | string;
    statementOfWorkExpertise: null | number | string;
}