import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DepartmentSelectorComponent } from '../department-selector/department-selector.component';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, DepartmentSelectorComponent],
    templateUrl: './employee-form.component.html',
    styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
    employeeForm!: FormGroup;
    isEditMode: boolean = false;
    employeeId: number | null = null;
    loading: boolean = false;
    submitting: boolean = false;

    statuses = ['Active', 'On Leave', 'Inactive'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.employeeId = +id;
            this.loadEmployee(this.employeeId);
        }
    }

    initForm(): void {
        this.employeeForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            department: ['', Validators.required],
            position: ['', [Validators.required, Validators.minLength(2)]],
            salary: ['', [Validators.required, Validators.min(0)]],
            hireDate: ['', Validators.required],
            status: ['Active', Validators.required],
            avatar: ['']
        });
    }

    loadEmployee(id: number): void {
        this.loading = true;
        this.employeeService.getEmployeeById(id).subscribe({
            next: (employee) => {
                this.employeeForm.patchValue(employee);
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error loading employee:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            this.markFormGroupTouched(this.employeeForm);
            return;
        }

        this.submitting = true;
        const employeeData: Employee = this.employeeForm.value;

        if (this.isEditMode && this.employeeId) {
            this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
                next: () => {
                    this.router.navigate(['/employees', this.employeeId]);
                    this.submitting = false;
                },
                error: (error) => {
                    this.submitting = false;
                    console.error('Error updating employee:', error);
                }
            });
        } else {
            this.employeeService.createEmployee(employeeData).subscribe({
                next: () => {
                    this.router.navigate(['/employees']);
                    this.submitting = false;
                },
                error: (error) => {
                    this.submitting = false;
                    console.error('Error creating employee:', error);
                }
            });
        }
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.employeeForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.employeeForm.get(fieldName);
        return !!(field?.invalid && field?.touched);
    }
}
