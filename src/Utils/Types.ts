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

// Holds information about measurement period (contains one or more activity records)
export interface MeasurementPeriod {
    email?: string;
    entered: string;
    startDate: string;
    endDate: string;
}

// holds information about a single activity record
export interface Activity {
    email?: string;
    type: string;
    duration: number;
    question1: string;
    question2: string;
    question3?: string;
    pointScale?: number;
}