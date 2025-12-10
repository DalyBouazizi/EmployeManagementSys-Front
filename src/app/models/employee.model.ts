export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    avatar?: string;
}
