import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';

@Component({
    selector: 'app-employee-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, PhoneFormatPipe],
    templateUrl: './employee-detail.component.html',
    styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit {
    employee: Employee | null = null;
    loading: boolean = true;
    error: string = '';

    constructor(
        private route: ActivatedRoute,
        private employeeService: EmployeeService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadEmployee(+id);
        }
    }

    loadEmployee(id: number): void {
        this.loading = true;
        this.employeeService.getEmployeeById(id).subscribe({
            next: (employee) => {
                this.employee = employee;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load employee details';
                this.loading = false;
                console.error('Error loading employee:', error);
            }
        });
    }

    getStatusColor(): string {
        if (!this.employee) return 'bg-gray-100 text-gray-800';

        switch (this.employee.status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'On Leave':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}
