import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/employee.model';

/**
 * Custom pipe to filter employees by department
 */
@Pipe({
    name: 'departmentFilter',
    standalone: true
})
export class DepartmentFilterPipe implements PipeTransform {
    transform(employees: Employee[], department: string): Employee[] {
        if (!employees || !department) {
            return employees;
        }
        return employees.filter(emp => emp.department === department);
    }
}
