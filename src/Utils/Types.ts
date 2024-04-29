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

    // Education levels: "HighSchool", "Associates", "Bachelors", "Masters", "Professional (MBA, JD, MD)", "Doctorate", "Other"
    highschoolEducation?: string;
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
     * Any shipyard, NAVSEA, PNAV, Pentagon, NSWC- Dahlgren Division, NSWC- Carderock Division, NSWC – Other (please specify),
     */
    shipyardAgency?: number;
    navseaAgency?: number;
    nswcDahlgrenAgency?: number;
    nswcCarderockAgency?: number;
    pnavAgency?: number;
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

export interface Record {
    email?: string;
    entered: string;
    type: string;
    duration: number;
    notes: string;
}