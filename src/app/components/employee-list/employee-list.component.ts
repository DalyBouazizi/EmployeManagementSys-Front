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

/**
 * Main component to display employee list with search and filter
 */
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

    // Filter state
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

    /**
     * Load all employees from service
     */
    loadEmployees(): void {
        this.loading = true;

        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
                this.applyFilters();
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load employees. Please make sure JSON Server is running.';
                this.loading = false;
                console.error('Error loading employees:', error);
            }
        });
    }

    /**
     * Handle search term changes
     */
    onSearchChange(term: string): void {
        this.searchTerm = term;
        this.applyFilters();
    }

    /**
     * Handle department filter changes
     */
    onDepartmentChange(department: string): void {
        this.selectedDepartment = department;
        this.applyFilters();
    }

    /**
     * Handle status filter changes
     */
    onStatusChange(status: string): void {
        this.selectedStatus = status;
        this.applyFilters();
    }

    /**
     * Apply all filters to employee list
     */
    applyFilters(): void {
        let result = [...this.employees];

        // Apply search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(emp =>
                emp.firstName.toLowerCase().includes(term) ||
                emp.lastName.toLowerCase().includes(term) ||
                emp.email.toLowerCase().includes(term) ||
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term)
            );
        }

        // Apply department filter
        if (this.selectedDepartment) {
            result = result.filter(emp => emp.department === this.selectedDepartment);
        }

        // Apply status filter
        if (this.selectedStatus) {
            result = result.filter(emp => emp.status === this.selectedStatus);
        }

        this.filteredEmployees = result;
    }

    /**
     * Handle employee deletion
     */
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
