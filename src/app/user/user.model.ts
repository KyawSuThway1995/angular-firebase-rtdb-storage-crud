export interface UserResponse {
    [key: string]: User
}

export interface User {
    id: string;
    name: string;
    gender: string;
    dob: Date;
    email: string;
    address: string;
    hobbies: Array<string>;
    education: string;
    profileImage: string;
    experiences: Array<WorkExperience>;
}

export interface WorkExperience {
    duration: string;
    description: string;
}
