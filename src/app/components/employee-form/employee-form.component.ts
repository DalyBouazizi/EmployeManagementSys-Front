import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { SharedDataService } from '../../services/shared-data.service';
import { Employee } from '../../models/employee.model';
import { DepartmentSelectorComponent } from '../department-selector/department-selector.component';

/**
 * Component for creating and editing employees with form validation
 */
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
        private employeeService: EmployeeService,
        private sharedDataService: SharedDataService
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

    /**
     * Initialize the reactive form with validators
     */
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

    /**
     * Load employee data for editing
     */
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

    /**
     * Submit form to create or update employee
     */
    onSubmit(): void {
        console.log('Form submitted');
        console.log('Form valid:', this.employeeForm.valid);
        console.log('Form value:', this.employeeForm.value);

        if (this.employeeForm.invalid) {
            console.log('Form is invalid, marking fields as touched');
            Object.keys(this.employeeForm.controls).forEach(key => {
                const control = this.employeeForm.get(key);
                if (control?.invalid) {
                    console.log(`${key} is invalid:`, control.errors);
                }
            });
            this.markFormGroupTouched(this.employeeForm);
            return;
        }

        this.submitting = true;
        const employeeData: Employee = this.employeeForm.value;
        console.log('Submitting employee data:', employeeData);

        if (this.isEditMode && this.employeeId) {
            // Update existing employee
            console.log('Update mode');
            this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
                next: () => {
                    console.log('Employee updated successfully');
                    this.router.navigate(['/employees', this.employeeId]);
                    this.submitting = false;
                },
                error: (error) => {
                    this.submitting = false;
                    console.error('Error updating employee:', error);
                }
            });
        } else {
            // Create new employee
            console.log('Create mode');
            this.employeeService.createEmployee(employeeData).subscribe({
                next: () => {
                    console.log('Employee created successfully');
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

    /**
     * Mark all form fields as touched to show validation errors
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Check if a field has an error and has been touched
     */
    hasError(fieldName: string, errorType: string): boolean {
        const field = this.employeeForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    /**
     * Check if a field is invalid and touched
     */
    isFieldInvalid(fieldName: string): boolean {
        const field = this.employeeForm.get(fieldName);
        return !!(field?.invalid && field?.touched);
    }
}
