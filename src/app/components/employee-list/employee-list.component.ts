import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { SharedDataService } from '../../services/shared-data.service';
import { Employee } from '../../models/employee.model';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { SearchFilterPipe } from '../../pipes/search-filter.pipe';
import { DepartmentFilterPipe } from '../../pipes/department-filter.pipe';
import { delay } from 'rxjs';

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        EmployeeCardComponent,
        SearchFilterComponent,
        SearchFilterPipe,
        DepartmentFilterPipe
    ],
    templateUrl: './employee-list.component.html',
    styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    filteredEmployees: Employee[] = [];
    loading: boolean = true;
    error: string = '';

    searchTerm: string = '';
    selectedDepartment: string = '';
    selectedStatus: string = '';

    constructor(
        private employeeService: EmployeeService,
        private sharedDataService: SharedDataService
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.loading = true;

        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
                this.applyFilters();
                this.sharedDataService.updateEmployeeCount(employees.length);
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load employees. Please make sure JSON Server is running.';
                this.loading = false;
                console.error('Error loading employees:', error);
            }
        });
    }

    onSearchChange(term: string): void {
        this.searchTerm = term;
        this.applyFilters();
    }

    onDepartmentChange(department: string): void {
        this.selectedDepartment = department;
        this.applyFilters();
    }

    onStatusChange(status: string): void {
        this.selectedStatus = status;
        this.applyFilters();
    }

    applyFilters(): void {
        let result = [...this.employees];

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(emp =>
                emp.firstName.toLowerCase().includes(term) ||
                emp.lastName.toLowerCase().includes(term) ||
                emp.email.toLowerCase().includes(term) ||
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term)
            );
        }

        if (this.selectedDepartment) {
            result = result.filter(emp => emp.department === this.selectedDepartment);
        }

        if (this.selectedStatus) {
            result = result.filter(emp => emp.status === this.selectedStatus);
        }

        this.filteredEmployees = result;
    }

    onDeleteEmployee(id: number): void {
        this.employeeService.deleteEmployee(id).subscribe({
            next: () => {
                this.loadEmployees();
            },
            error: (error) => {
                console.error('Error deleting employee:', error);
            }
        });
    }
}
