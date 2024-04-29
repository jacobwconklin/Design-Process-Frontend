import {
    Button,
    Input,
    InputNumber,
    Radio,
    Select,
    SelectProps,
    Table,
} from 'antd';
import './SignUp.scss';
import { useContext, useEffect, useState } from 'react';
// import { postRequest } from '../../Utils/Api';
import { PlayerInformation, UserContextType } from '../../Utils/Types';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { getObjectFromStorage, saveObjectToStorage } from '../../Utils/Utils';

// SignUp
const SignUp = () => {

    // Scroll to top on entering page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
    const [stateEmail, setStateEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState<number | null>(0);
    const [employer, setEmployer] = useState('');
    const [team, setTeam] = useState('');
    const [title, setTitle] = useState('');

    // ethnicity is a multi select that is converted to a comma separated string
    const ethnicityOptions: SelectProps['options'] = [
        { value: 'American Indian or Alaska Native', label: 'American Indian or Alaska Native' },
        { value: 'Asian or Asian American', label: 'Asian or Asian American' },
        { value: 'Black or African American', label: 'Black or African American' },
        { value: 'Hispanic or Latino', label: 'Hispanic or Latino' },
        { value: 'Middle Eastern or North African', label: 'Middle Eastern or North African' },
        { value: 'Native Hawai\'ian or Other Pacific Islander', label: 'Native Hawai\'ian or Other Pacific Islander' },
        { value: 'White or European', label: 'White or European' },
        { value: 'Prefer not to say', label: 'Prefer not to say' },
    ]
    const [ethnicity, setEthnicity] = useState<string[]>([]);

    // // If user is an undergraduate or graduate college student open the college 
    // // questions to them
    // const [isCollegeStudent, setIsCollegeStudent] = useState(0);
    // // Begin only for college students
    // const [university, setUniversity] = useState('');
    // const [degreeProgram, setDegreeProgram] = useState('');
    // const [yearsInProgram, setYearsInProgram] = useState<null | number>(0);
    // // End only for college students

    /**
     * Information for Table for gathering Educational Background
     */
    const educationLevels = ["Highschool", "Bachelors", "Masters", "Doctorate"]

    const [educationalBackgroundCompleted, setEducationalBackgroundCompleted] = useState(Array(educationLevels.length + 1).fill(0));
    const [educationalBackgroundSubjectArea, setEducationalBackgroundSubjectArea] = useState(Array(educationLevels.length + 1).fill('N/A'));
    const [otherEducation, setOtherEducation] = useState('');

    // Create each row of table
    const getEducationalBackgroundDataSource = () => {
        const dataSourceArray = educationLevels.map((educationLevel, index) => {
            return {
                key: "Key: " + index,
                EducationLevel: <p>{educationLevel}</p>,
                Completed: <div>
                    <Radio.Group
                        onChange={(e) => {
                            const newEducationalBackgroundCompleted = [...educationalBackgroundCompleted];
                            newEducationalBackgroundCompleted[index] = e.target.value;
                            setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                        }}
                        value={educationalBackgroundCompleted[index]}>
                        <Radio value={0}>No</Radio>
                        <Radio value={1}>Yes</Radio>
                        <Radio value={2}>Current</Radio>
                    </Radio.Group>
                </div>,
                SubjectArea: <div>
                    <Input
                        value={educationalBackgroundSubjectArea[index]}
                        onChange={(e) => {
                            const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                            newEducationalBackgroundSubjectArea[index] = e.target.value;
                            setEducationalBackgroundSubjectArea((prev) => {
                                const newEducationalBackgroundSubjectArea = [...prev];
                                newEducationalBackgroundSubjectArea[index] = e.target.value;
                                return newEducationalBackgroundSubjectArea;
                            });
                        }}
                        maxLength={64}
                        disabled={educationalBackgroundCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: "Key: Other Education",
            EducationLevel: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherEducation}
                    onChange={(e) => setOtherEducation(e.target.value)}
                    maxLength={64}
                />
            </div>,
            Completed: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Radio.Group
                    onChange={(e) => {
                        const newEducationalBackgroundCompleted = [...educationalBackgroundCompleted];
                        newEducationalBackgroundCompleted[educationLevels.length] = e.target.value;
                        setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                    }}
                    value={educationalBackgroundCompleted[educationLevels.length]}>
                    <Radio value={0}>No</Radio>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={2}>Current</Radio>
                </Radio.Group>
            </div>,
            SubjectArea: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Input
                    value={educationalBackgroundSubjectArea[educationLevels.length]}
                    onChange={(e) => {
                        const newEducationalBackgroundSubjectArea = [...educationalBackgroundSubjectArea];
                        newEducationalBackgroundSubjectArea[educationLevels.length] = e.target.value;
                        setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
                    }}
                    maxLength={64}
                    disabled={educationalBackgroundCompleted[educationLevels.length] === 0}
                />
            </div>,

        })
        return dataSourceArray;
    }

    const educationalBackgroundColumns = [
        {
            title: 'Education',
            dataIndex: 'EducationLevel',
            key: 'Education Level',
            width: '25%'
        },
        {
            title: 'Completed',
            dataIndex: 'Completed',
            key: 'Completed',
            width: '25%'
        },
        {
            title: 'Subject Area \n (e.g., Chemistry) \n Please no acryonyms',
            dataIndex: 'SubjectArea',
            key: 'SubjectArea',
            width: '50%'
        },
    ];

    /**
     * Information for Table for gathering Technical Organization Background and years of specializations
     */
    const specializations = ["Aerodynamics", "Computer Science or Computer Engineering", "Electrical Engineering", 
        "Electromagnetics, EMI, EMC", "Environmental Testing", "Logistics and/or Supply Chains", "Manufacturing", 
        "Mechanical Design", "Operations Research", "Project or Program Management", "Systems (or Mission) Engineering",
        "Structural Analysis", "Threat Analysis"
    ];

    const [specializationCompleted, setSpecializationCompleted] = useState(Array(specializations.length + 1).fill(0));
    const [specializationYears, setSpecializationYears] = useState(Array(specializations.length + 1).fill(0));
    const [otherSpecialization, setOtherSpecialization] = useState('');


    // Create each row of table
    const getSpecializationDataSource = () => {

        const dataSourceArray = specializations.map((specialization, index) => {
            return {
                key: index,
                Specialization: <p>{specialization}</p>,
                Completed: <div>
                    <Radio.Group
                        onChange={(e) => {
                            const newSpecializationCompleted = [...specializationCompleted];
                            newSpecializationCompleted[index] = e.target.value;
                            setSpecializationCompleted(newSpecializationCompleted);
                        }}
                        value={specializationCompleted[index]}>
                        <Radio value={0}>No</Radio>
                        <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                </div>,
                Years: <div>
                    <InputNumber
                        value={specializationYears[index]}
                        min={0}
                        max={99}
                        onChange={(e) => {
                            const newSpecializationYears = [...specializationYears];
                            newSpecializationYears[index] = e;
                            setSpecializationYears(newSpecializationYears);
                        }}
                        disabled={specializationCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: specializations.length,
            Specialization: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherSpecialization}
                    onChange={(e) => setOtherSpecialization(e.target.value)}
                    maxLength={64}
                />
            </div>,
            Completed: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Radio.Group
                    onChange={(e) => {
                        const newSpecializationCompleted = [...specializationCompleted];
                        newSpecializationCompleted[specializations.length] = e.target.value;
                        setSpecializationCompleted(newSpecializationCompleted);
                    }}
                    value={specializationCompleted[specializations.length]}>
                    <Radio value={0}>No</Radio>
                    <Radio value={1}>Yes</Radio>
                </Radio.Group>
            </div>,
            Years: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <InputNumber
                    value={specializationYears[specializations.length]}
                    min={0}
                    max={99}
                    onChange={(e) => {
                        const newSpecializationYears = [...specializationYears];
                        newSpecializationYears[specializations.length] = e;;
                        setSpecializationYears(newSpecializationYears);
                    }}
                    disabled={specializationCompleted[specializations.length] === 0}
                />
            </div>,

        })
        return dataSourceArray;
    }

    const specializationColumns = [
        {
            title: 'Specialization',
            dataIndex: 'Specialization',
            key: 'Specialization',
            width: '30%'
        },
        {
            title: 'Have you worked or volunteered in this field?',
            dataIndex: 'Completed',
            key: 'Completed',
            width: '30%'
        },
        {
            title: 'Number of Years',
            dataIndex: 'Years',
            key: 'Years',
            width: '30%'
        },
    ];

    /**
     * End information for Table for gathering Specialization Background
     */
    

    /**
     * Information for Table for gathering Navy Agency years of work experience
     * Any shipyard, NAVSEA, PNAV, Pentagon, NSWC- Dahlgren Division, NSWC- Carderock Division, NSWC – Other (please specify),
     */
    const agencies = [
        "Any shipyard", "NAVSEA", "PNAV", "Pentagon", "NSWC - Dahlgren Division", "NSWC - Carderock Division", "NSWC - Other (please specify)"
    ];

    const [agenciesCompleted, setAgenciesCompleted] = useState(Array(agencies.length + 1).fill(0));
    const [agencyYears, setAgencyYears] = useState(Array(agencies.length + 1).fill(0));
    const [otherAgency, setOtherAgency] = useState('');


    // Create each row of table
    const getAgenciesDataSource = () => {

        const dataSourceArray = agencies.map((agency, index) => {
            return {
                key: index,
                Agency: <p>{agency}</p>,
                Completed: <div>
                    <Radio.Group
                        onChange={(e) => {
                            const newAgenciesCompleted = [...agenciesCompleted];
                            newAgenciesCompleted[index] = e.target.value;
                            setAgenciesCompleted(newAgenciesCompleted);
                        }}
                        value={agenciesCompleted[index]}>
                        <Radio value={0}>No</Radio>
                        <Radio value={1}>Yes</Radio>
                    </Radio.Group>
                </div>,
                Years: <div>
                    <InputNumber
                        value={agencyYears[index]}
                        min={0}
                        max={99}
                        onChange={(e) => {
                            const newAgencyYears = [...agencyYears];
                            newAgencyYears[index] = e;
                            setAgencyYears(newAgencyYears);
                        }}
                        disabled={agenciesCompleted[index] === 0}
                    />
                </div>,
            }
        });
        dataSourceArray.push({
            key: agencies.length,
            Agency: <div>
                <p>Other (Please Specify)</p>
                <Input
                    value={otherAgency}
                    onChange={(e) => setOtherAgency(e.target.value)}
                    maxLength={64}
                />
            </div>,
            Completed: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <Radio.Group
                    onChange={(e) => {
                        const newAgenciesCompleted = [...agenciesCompleted];
                        newAgenciesCompleted[agencies.length] = e.target.value;
                        setAgenciesCompleted(newAgenciesCompleted);
                    }}
                    value={agenciesCompleted[agencies.length]}>
                    <Radio value={0}>No</Radio>
                    <Radio value={1}>Yes</Radio>
                </Radio.Group>
            </div>,
            Years: <div>
                <p style={{ color: 'whitesmoke' }}> . </p>
                <InputNumber
                    value={agencyYears[agencies.length]}
                    min={0}
                    max={99}
                    onChange={(e) => {
                        const newAgencyYears = [...agencyYears];
                        newAgencyYears[agencies.length] = e;;
                        setAgencyYears(newAgencyYears);
                    }}
                    disabled={agenciesCompleted[agencies.length] === 0}
                />
            </div>,

        })
        return dataSourceArray;
    }

    const agencyColumns = [
        {
            title: 'Agency',
            dataIndex: 'Agency',
            key: 'Agency',
            width: '30%'
        },
        {
            title: 'Have you worked or volunteered in this field?',
            dataIndex: 'Completed',
            key: 'Completed',
            width: '30%'
        },
        {
            title: 'Number of Years',
            dataIndex: 'Years',
            key: 'Years',
            width: '30%'
        },
    ];

    // 7 point experience questions:
    const experienceQuestions = ["riskAnalysisExperience", "supplierExperience"];
    // how experience questions are presented to users:
    const experienceQuestionPrompts = [
        "How experienced are you with probabilistic reasoning and/or risk analysis?",
        "Do you have any experience with working with suppliers or contractors?"
    ];
    // values saved for experience questions:
    const [experienceValues, setExperienceValues] = useState<Array<null | number>>(Array(experienceQuestionPrompts.length).fill(null));

    // 7 point familiarity questions:
    const familiarityQuestions = [
        "projectContextFamiliarity",
        "navyPlatformFamiliarity",
        "designChangeCharacteristicsFamiliarity"
    ];
    // how experience questions are presented to users:
    const familiarityQuestionPrompts = [
        "How familiar are you with the context of this specific project?", 
        "How familiar are you with the Navy platform in this specific project?",
        "How familiar are you with the characteristics of the design change studied in this project?"
    ];
    // values saved for experience questions:
    const [familiarityValues, setFamiliarityValues] = useState<Array<null | number>>(Array(familiarityQuestionPrompts.length).fill(null));

    // disable submit button so it cannot be clicked more than once
    const [submitting, setSubmitting] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    // setIsHost, setSessionId, and setPlayerId can be retreived from context
    const { setIsAdmin, setEmail } = useContext(UserContext) as UserContextType;
    // take users to session screen on successful submit
    const navigate = useNavigate();

    // verify user can submit
    const canSubmit = () => {
        // check for invalid elements and scroll to top element that is invalid
        if (!stateEmail) {
            document.getElementById('Email')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!password) {
            document.getElementById('Password')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!gender) {
            document.getElementById('Gender')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!age) {
            document.getElementById('Age')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (ethnicity.length === 0) {
            document.getElementById('Ethnicity')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } else if (!employer) {
            document.getElementById('Employer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }  else if (!team) {
            document.getElementById('Team')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        }  else if (!title) {
            document.getElementById('Title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        } 


        // else if (isCollegeStudent && (!university || !degreeProgram || !yearsInProgram)) {
        //     document.getElementById('IsCollegeStudent')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     return false;
        // } 
        
        else {
            // check all 7 point experience questions
            for (let i = 0; i < experienceValues.length; i++) {
                if (experienceValues[i] === null) {
                    document.getElementById(experienceQuestions[i])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                }
            }
            // check all 7 point familiarity questions
            for (let i = 0; i < familiarityValues.length; i++) {
                if (familiarityValues[i] === null) {
                    document.getElementById(familiarityQuestions[i])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                }
            }
            return true;
        }
    }


    // Here local storage refers to both local and session storages.
    const [pulledFromLocalStorage, setPulledFromLocalStorage] = useState(false);

    // if user info in localStorage, pull it out
    useEffect(() => {
        if (!pulledFromLocalStorage) {
            const playerInformation = getObjectFromStorage('playerInformation');
            if (playerInformation) {
                // stored education and specialization names:
                const educationLevelsStored = ["bachelorsEducation", "mastersEducation", "doctorateEducation", "otherEducation"];

                const specializationsStored = [
                    "aerodynamicsSpecialization", "computerScienceSpecialization", "electricalEngineeringSpecialization",
                    "electromagneticsSpecialization", "environmentalTestingSpecialization", "logisticsSpecialization",
                    "manufacturingSpecialization", "mechanicalDesignSpecialization", "operationsResearchSpecialization",
                    "projectManagementSpecialization", "systemsEngineeringSpecialization", "structuralAnalysisSpecialization",
                    "threatAnalysisSpecialization", "otherSpecialization"
                ]

                const agenciesStored = [
                    "shipyardAgency", "navseaAgency", "pnavAgency", "pentagonAgency",
                    "nswcDahlgrenAgency", "nswcCarderockAgency", "otherAgency"
                ]

                const experienceQuestionsStored = ["riskAnalysisExperience", "supplierExperience"];

                const familiarityQuestionsStored = [
                    "projectContextFamiliarity", "navyPlatformFamiliarity", "designChangeCharacteristicsFamiliarity"
                ]

                setStateEmail(playerInformation.email);
                setPassword(playerInformation.password);
                setGender(playerInformation.gender);
                setAge(playerInformation.age);
                setEthnicity(playerInformation.ethnicity ? playerInformation.ethnicity.split(', ') : []);
                setEmployer(playerInformation.employer);
                setTeam(playerInformation.team);
                setTitle(playerInformation.title);

                // setIsCollegeStudent(playerInformation.isCollegeStudent);
                // if (playerInformation.university) setUniversity(playerInformation.university);
                // if (playerInformation.degreeProgram) setDegreeProgram(playerInformation.degreeProgram);
                // if (playerInformation.yearsInProgram) setYearsInProgram(playerInformation.yearsInProgram);
                const newEducationalBackgroundCompleted = Array(educationLevels.length + 1).fill(0);
                const newEducationalBackgroundSubjectArea = Array(educationLevels.length + 1).fill("N/A");
                educationLevelsStored.forEach((educationLevel, index) => {
                    if (playerInformation[educationLevel]) {
                        newEducationalBackgroundCompleted[index] = playerInformation[educationLevel].startsWith("Yes") ? 1 : 2;
                        newEducationalBackgroundSubjectArea[index]
                            = playerInformation[educationLevel].substring(playerInformation[educationLevel].indexOf(":") + 1);
                    } else {
                        newEducationalBackgroundCompleted[index] = 0;
                    }
                });
                setEducationalBackgroundCompleted(newEducationalBackgroundCompleted);
                setEducationalBackgroundSubjectArea(newEducationalBackgroundSubjectArea);
                if (playerInformation.otherEducationName) setOtherEducation(playerInformation.otherEducationName);

                specializationsStored.forEach((specialization, index) => {
                    if (playerInformation[specialization]) {
                        const newSpecializationCompleted = [...specializationCompleted];
                        newSpecializationCompleted[index] = true;
                        setSpecializationCompleted(newSpecializationCompleted);
                        const newSpecializationYears = [...specializationYears];
                        newSpecializationYears[index] = playerInformation[specialization];
                        setSpecializationYears(newSpecializationYears);
                    }
                });
                if (playerInformation.otherSpecializationName) setOtherSpecialization(playerInformation.otherSpecializationName);

                agenciesStored.forEach((agency, index) => {
                    if (playerInformation[agency]) {
                        const newAgenciesCompleted = [...agenciesCompleted];
                        newAgenciesCompleted[index] = true;
                        setAgenciesCompleted(newAgenciesCompleted);
                        const newAgencyYears = [...agencyYears];
                        newAgencyYears[index] = playerInformation[agency];
                        setAgencyYears(newAgencyYears);
                    }
                });
                if (playerInformation.otherNswcAgencyName) setOtherAgency (playerInformation.otherNswcAgencyName);

                const newExperienceValues = [...experienceValues];
                experienceQuestionsStored.forEach((experienceQuestion, index) => {
                    if (playerInformation[experienceQuestion]) {
                        newExperienceValues[index] = parseInt(playerInformation[experienceQuestion]);
                    }
                });
                setExperienceValues(newExperienceValues);

                const newFamiliarityValues = [...familiarityValues];
                familiarityQuestionsStored.forEach((familiarityQuestion, index) => {
                    if (playerInformation[familiarityQuestion]) {
                        newFamiliarityValues[index] = parseInt(playerInformation[familiarityQuestion]);
                    }
                });
                setFamiliarityValues(newFamiliarityValues);

                setPulledFromLocalStorage(true);
            }
        }
    }, [pulledFromLocalStorage, experienceValues, educationLevels.length, specializationCompleted, specializationYears, familiarityValues, agenciesCompleted, agencyYears]);

    const submit = async () => {
        // if successful give a happy message, otherwise let them know after an error from the backend
        try {
            setSubmitting(true);
            setAttemptedSubmit(true);
            if (canSubmit()) {
                // save player information
                const newPlayerInformation: PlayerInformation = {
                    
                    email: stateEmail,
                    password,
                    gender,
                    age,
                    ethnicity: ethnicity.join(', '), // convert array to string
                    employer,
                    team,
                    title,

                    // isCollegeStudent: isCollegeStudent,
                    // university,
                    // degreeProgram,
                    // yearsInProgram,

                    // TODO send as arrays
                    // All selected education values begin with "Yes:" or "Current:".
                    bachelorsEducation: educationalBackgroundCompleted[0] ?
                        ((educationalBackgroundCompleted[0] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[1]) : undefined,
                    mastersEducation: educationalBackgroundCompleted[1] ?
                        ((educationalBackgroundCompleted[1] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[1]) : undefined,
                    doctorateEducation: educationalBackgroundCompleted[2] ?
                        ((educationalBackgroundCompleted[2] === 1 ? "Yes:" : "Current:") + educationalBackgroundSubjectArea[2]) : undefined,
                    otherEducationName: educationalBackgroundCompleted[educationLevels.length] ? otherEducation : null,
                    otherEducation: educationalBackgroundCompleted[educationLevels.length]
                        ? ((educationalBackgroundCompleted[educationLevels.length] === 1 ? "Yes:" : "Current:")
                            + educationalBackgroundSubjectArea[educationLevels.length]) : undefined,

                    // aerospaceEngineeringSpecialization: specializationCompleted[0] ? specializationYears[0] : null,
                    // designSpecialization: specializationCompleted[1] ? specializationYears[1] : null,
                    // electricalEngineeringSpecialization: specializationCompleted[2] ? specializationYears[2] : null,
                    // industrialEngineeringSpecialization: specializationCompleted[3] ? specializationYears[3] : null,
                    // manufacturingSpecialization: specializationCompleted[4] ? specializationYears[4] : null,
                    // materialScienceSpecialization: specializationCompleted[5] ? specializationYears[5] : null,
                    // mechanicalEngineeringSpecialization: specializationCompleted[6] ? specializationYears[6] : null,
                    // projectManagementSpecialization: specializationCompleted[7] ? specializationYears[7] : null,
                    // roboticsSpecialization: specializationCompleted[8] ? specializationYears[8] : null,
                    // softwareSpecialization: specializationCompleted[9] ? specializationYears[9] : null,
                    // systemsEngineeringSpecialization: specializationCompleted[10] ? specializationYears[10] : null,
                    aerodynamicsSpecialization: specializationCompleted[0] ? specializationYears[0] : null,
                    computerScienceSpecialization: specializationCompleted[1] ? specializationYears[1] : null,
                    electricalEngineeringSpecialization: specializationCompleted[2] ? specializationYears[2] : null,
                    electromagneticsSpecialization: specializationCompleted[3] ? specializationYears[3] : null,
                    environmentalTestingSpecialization: specializationCompleted[4] ? specializationYears[4] : null,
                    logisticsSpecialization: specializationCompleted[5] ? specializationYears[5] : null,
                    manufacturingSpecialization: specializationCompleted[6] ? specializationYears[6] : null,
                    mechanicalDesignSpecialization: specializationCompleted[7] ? specializationYears[7] : null,
                    operationsResearchSpecialization: specializationCompleted[8] ? specializationYears[8] : null,
                    projectManagementSpecialization: specializationCompleted[9] ? specializationYears[9] : null,
                    systemsEngineeringSpecialization: specializationCompleted[10] ? specializationYears[10] : null,
                    structuralAnalysisSpecialization: specializationCompleted[11] ? specializationYears[11] : null,
                    threatAnalysisSpecialization: specializationCompleted[12] ? specializationYears[12] : null,
                    otherSpecializationName: specializationCompleted[specializations.length] ? otherSpecialization : null,
                    otherSpecialization: specializationCompleted[specializations.length]
                        ? specializationYears[specializations.length] : null,

                    //  Any shipyard, NAVSEA, PNAV, Pentagon, NSWC- Dahlgren Division, NSWC- Carderock Division, NSWC – Other (please specify),
                    shipyardAgency: agenciesCompleted[0] ? agencyYears[0] : null,
                    navseaAgency: agenciesCompleted[1] ? agencyYears[1] : null,
                    pnavAgency: agenciesCompleted[2] ? agencyYears[2] : null,
                    pentagonAgency: agenciesCompleted[3] ? agencyYears[3] : null,
                    nswcDahlgrenAgency: agenciesCompleted[4] ? agencyYears[4] : null,
                    nswcCarderockAgency: agenciesCompleted[5] ? agencyYears[5] : null,
                    otherNswcAgencyName: agenciesCompleted[agencies.length] ? otherAgency : null,
                    otherAgency: agenciesCompleted[agencies.length] ? agencyYears[agencies.length] : null,

                    // experience 7 pointers
                    riskAnalysisExperience: '' + experienceValues[0],
                    supplierExperience: '' + experienceValues[1],

                    // familiarity 7 pointers
                    projectContextFamiliarity: '' + familiarityValues[0],
                    navyPlatformFamiliarity: '' + familiarityValues[1],
                    designChangeCharacteristicsFamiliarity: '' + familiarityValues[2],
                }

                // Save to context whether a player is joining or hosting the session. The Player's unique playerId
                // will also need to be saved.

                // Save player information to localStorage to be able to retreive it if it is there on future starts
                saveObjectToStorage('playerInformation', newPlayerInformation);

                // submit player information to backend
                // const submitResult = await postRequest('player/host', JSON.stringify({ ...newPlayerBrief, ...newPlayerInformation }))
                const submitResult = { success: true, email: 'test', isAdmin: false }
                if (submitResult.success) {
                    setIsSuccessfullySubmitted(true);
                    setEmail(submitResult.email);
                    setIsAdmin(submitResult.isAdmin);
                    // save loginInformation to local storage
                    const loginInformation = { email: submitResult.email, isAdmin: submitResult.isAdmin }
                    saveObjectToStorage('loginInformation', loginInformation);
                    navigate('/activities');
                }
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            alert("Unable to submit form received the following error: " + (error as Error).message + " \n\nThe database or backend may be rebooting, please wait one minute and try again.");
            setSubmitting(false);
        }
    }

    return (
        <div className='SignUp ColumnFlex'>
            <div className='Bubble'>
                <h1>{"Register to be able to record activities."}</h1>
                {
                    isSuccessfullySubmitted ?
                        <div className='SuccessfulSubmit'>
                            <h3>Congratulations your form has successfully been submitted!</h3>
                            <img src='https://media.tenor.com/LEhC5W9BQBIAAAAj/svtl-transparent.gif' alt='Success' />
                        </div>
                        :
                        <div className='InputForm'>
                            <h3>All Asterisks are required</h3>
                            {/* <p className="FormTitle" id='Name' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Name
                            </p>
                            <Input
                                className={attemptedSubmit && !name ? "ErrorForm" : ""}
                                placeholder='Jane Doe'
                                maxLength={20}
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value && event.target.value.length > 20 ? event.target.value.substring(0, 20) : event.target.value);
                                }}
                            /> */}
                            <p className="FormTitle" id='Email' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Email
                            </p>
                            <Input
                                className={attemptedSubmit && !stateEmail ? "ErrorForm" : ""}
                                // TODO have a check to see if email is already taken
                                placeholder='example@email.com'
                                maxLength={100}
                                value={stateEmail}
                                onChange={(event) => {
                                    const trimString = event.target.value.trim();
                                    setStateEmail(trimString && trimString.length > 100 ? trimString.substring(0, 100) : trimString);
                                }}
                            />
                            <p className="FormTitle" id='Password' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Password
                            </p>
                            <Input.Password
                                className={attemptedSubmit && !password ? "ErrorForm" : ""}
                                placeholder='Your Password Here'
                                maxLength={100}
                                minLength={6}
                                value={password}
                                onChange={(event) => {
                                    const trimString = event.target.value.trim();
                                    setPassword(trimString && trimString.length > 100 ? trimString.substring(0, 100) : trimString);
                                }}
                            />
                            <p className='FormTitle' id='Gender' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                How do you Identify?
                            </p>
                            <Select
                                className={attemptedSubmit && !gender ? "ErrorForm" : ""}
                                defaultValue=""
                                value={gender}
                                options={[
                                    { value: '', label: '' },
                                    { value: 'Nonbinary', label: 'Nonbinary' },
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' },
                                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                                ]}
                                onChange={(newValue) => {
                                    setGender(newValue);
                                }}
                            />
                            <p className='FormTitle' id='Age' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                How old are you?
                            </p>
                            <InputNumber
                                className={attemptedSubmit && !age ? "ErrorForm" : ""}
                                min={1}
                                max={99}
                                value={age}
                                onChange={(e) => setAge(e)}
                                addonAfter="Years Old"
                            />
                            <p className='FormTitle' id='Ethnicity' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Ethnicity Identity (check all that apply):
                            </p>
                            <Select
                                className={attemptedSubmit && ethnicity.length === 0 ? "ErrorForm" : ""}
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                defaultValue={[]}
                                value={ethnicity}
                                onChange={(value: string[]) => {
                                    if (value.includes('Prefer not to say')) {
                                        setEthnicity(['Prefer not to say'])
                                    } else {
                                        setEthnicity(value)
                                    }
                                }}
                                options={ethnicityOptions}
                            />

                            <p className="FormTitle" id='Employer' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Which organization are you currently employed by?
                            </p>
                            <Input
                                className={attemptedSubmit && !employer ? "ErrorForm" : ""}
                                placeholder='Employer Name'
                                maxLength={100}
                                value={employer}
                                onChange={(event) => {
                                    const typedString = event.target.value;
                                    setEmployer(typedString && typedString.length > 100 ? typedString.substring(0, 100) : typedString);
                                }}
                            />
                            <p className="FormTitle" id='Team' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                In which team are you working for?
                            </p>
                            <Input
                                className={attemptedSubmit && !team ? "ErrorForm" : ""}
                                placeholder='Team Name'
                                maxLength={100}
                                value={team}
                                onChange={(event) => {
                                    const typedString = event.target.value;
                                    setTeam(typedString && typedString.length > 100 ? typedString.substring(0, 100) : typedString);
                                }}
                            />
                            <p className="FormTitle" id='Title' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                What is your official title?
                            </p>
                            <Input
                                className={attemptedSubmit && !title ? "ErrorForm" : ""}
                                placeholder='Your Title Here'
                                maxLength={100}
                                value={title}
                                onChange={(event) => {
                                    const typedString = event.target.value;
                                    setTitle(typedString && typedString.length > 100 ? typedString.substring(0, 100) : typedString);
                                }}
                            />


                            <div className='PageBreak'></div>

                            {/* <p className='FormTitle' id='IsCollegeStudent' >
                                <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                Are you currenlty a student in an undergraduate or graduate program?
                            </p>
                            <Radio.Group
                                value={isCollegeStudent}
                            >
                                <Radio value={0} onClick={() => { setIsCollegeStudent(0) }}>No</Radio>
                                <Radio value={1} onClick={() => { setIsCollegeStudent(1) }}>Yes</Radio>
                            </Radio.Group>
                            {
                                !!isCollegeStudent &&
                                <div className='IsCollegeStudent'>
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        University
                                    </p>
                                    <Input
                                        className={attemptedSubmit && isCollegeStudent && !university ? "ErrorForm" : ""}
                                        placeholder='Virginia Tech'
                                        maxLength={64}
                                        value={university}
                                        onChange={(event) => {
                                            setUniversity(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 64) : event.target.value);
                                        }}
                                    />
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        Degree Program
                                    </p>
                                    <Input
                                        className={attemptedSubmit && isCollegeStudent && !degreeProgram ? "ErrorForm" : ""}
                                        placeholder='Industrial Systems Engineering'
                                        maxLength={64}
                                        value={degreeProgram}
                                        onChange={(event) => {
                                            setDegreeProgram(event.target.value && event.target.value.length > 64 ? event.target.value.substring(0, 64) : event.target.value);
                                        }}
                                    />
                                    <p className='FormTitle' >
                                        <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                        Years in Program
                                    </p>
                                    <InputNumber
                                        className={attemptedSubmit && isCollegeStudent && !yearsInProgram ? "ErrorForm" : ""}
                                        min={1}
                                        max={99}
                                        value={yearsInProgram}
                                        onChange={(e) => setYearsInProgram(e)}
                                        addonAfter="Years"
                                    />
                                </div>
                            }

                            <div className='PageBreak'></div> */}

                            <p>Educational Background. Please fill in all of your degrees and / or certifications</p>
                            <Table
                                // key={"" + educationalBackgroundCompleted + educationalBackgroundSubjectArea + otherEducation}
                                dataSource={getEducationalBackgroundDataSource()}
                                columns={educationalBackgroundColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <p>
                                If you have ever worked in a technical organization, for each area of specialization,
                                indicate your number of years of experience.
                            </p>
                            <Table
                                dataSource={getSpecializationDataSource()}
                                columns={specializationColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <p>
                                Have you ever worked in any of the following Navy Agencies in a different capacity? Please check all that apply and indicate the number of years:
                            </p>
                            <Table
                                dataSource={getAgenciesDataSource()}
                                columns={agencyColumns}
                                pagination={false}
                            />

                            <div className='PageBreak'></div>

                            <h3>
                                For the following questions please answer how much experience you have in each of the following areas. With the left-most circle being the least experience and the right-most circle being the most experience.
                            </h3>

                            {
                                // show all experience questions
                                experienceValues.map((value, index) => (
                                    <div key={index + " value of: " + value}>
                                        <p id={experienceQuestions[index]}>
                                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                            {experienceQuestionPrompts[index]}
                                        </p>
                                        <div className={`ExpertiseGrid ${value === null
                                            && attemptedSubmit ? "ErrorForm" : ""}`}>
                                            <p>Outside my field of expertise</p>
                                            <p>.....</p>
                                            <p>.....</p>
                                            <p>At the boundary of my field of Expertise</p>
                                            <p>.....</p>
                                            <p>.....</p>
                                            <p>Inside my field of expertise</p>

                                            <Radio checked={value === 0} value={value === 0} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 0;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 1} value={value === 1} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 1;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 2} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 2;
                                                setExperienceValues(newValues);
                                            }}></Radio>
                                            <Radio checked={value === 3} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 3;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 4} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 4;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 5} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 5;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 6} onClick={() => {
                                                const newValues = [...experienceValues];
                                                newValues[index] = 6;
                                                setExperienceValues(newValues)
                                            }}></Radio>
                                        </div>
                                        <br />
                                    </div>
                                ))
                            }

{
                                // show all familiarity questions
                                familiarityValues.map((value, index) => (
                                    <div key={index + " value of: " + value}>
                                        <p id={familiarityQuestions[index]}>
                                            <span style={{ color: 'red', fontSize: 'large' }}>* </span>
                                            {familiarityQuestionPrompts[index]}
                                        </p>
                                        <div className={`ExpertiseGrid ${value === null
                                            && attemptedSubmit ? "ErrorForm" : ""}`}>
                                            <p>Not Familiar</p>
                                            <p>.....</p>
                                            <p>.....</p>
                                            <p>Somewhat Familiar</p>
                                            <p>.....</p>
                                            <p>.....</p>
                                            <p>Highly Familiar</p>

                                            <Radio checked={value === 0} value={value === 0} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 0;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 1} value={value === 1} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 1;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 2} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 2;
                                                setFamiliarityValues(newValues);
                                            }}></Radio>
                                            <Radio checked={value === 3} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 3;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 4} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 4;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 5} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 5;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                            <Radio checked={value === 6} onClick={() => {
                                                const newValues = [...familiarityValues];
                                                newValues[index] = 6;
                                                setFamiliarityValues(newValues)
                                            }}></Radio>
                                        </div>
                                        <br />
                                    </div>
                                ))
                            }

                            <div className='PageBreak'></div>
                            <br>
                            </br>
                            <div className='ButtonHolder'>
                                <Button
                                    disabled={submitting}
                                    onClick={submit}
                                >
                                    Submit
                                </Button>
                            </div>
                            <br></br>
                        </div>
                }
            </div>
        </div>
    )
}

export default SignUp;