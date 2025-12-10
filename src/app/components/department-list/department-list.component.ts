import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
    selector: 'app-department-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './department-list.component.html',
    styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    departmentForm!: FormGroup;
    loading: boolean = true;
    showForm: boolean = false;
    isEditMode: boolean = false;
    editingId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private departmentService: DepartmentService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadDepartments();
    }

    initForm(): void {
        this.departmentForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', Validators.required],
            manager: ['', Validators.required]
        });
    }

    loadDepartments(): void {
        this.loading = true;
        this.departmentService.getDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error loading departments:', error);
            }
        });
    }

    showAddForm(): void {
        this.isEditMode = false;
        this.editingId = null;
        this.departmentForm.reset();
        this.showForm = true;
    }

    editDepartment(department: Department): void {
        this.isEditMode = true;
        this.editingId = department.id!;
        this.departmentForm.patchValue(department);
        this.showForm = true;
    }

    cancelForm(): void {
        this.showForm = false;
        this.departmentForm.reset();
        this.isEditMode = false;
        this.editingId = null;
    }

    onSubmit(): void {
        if (this.departmentForm.invalid) {
            Object.keys(this.departmentForm.controls).forEach(key => {
                this.departmentForm.get(key)?.markAsTouched();
            });
            return;
        }

        const departmentData: Department = this.departmentForm.value;

        if (this.isEditMode && this.editingId) {
            this.departmentService.updateDepartment(this.editingId, departmentData).subscribe({
                next: () => {
                    this.loadDepartments();
                    this.cancelForm();
                },
                error: (error) => {
                    console.error('Error updating department:', error);
                }
            });
        } else {
            this.departmentService.createDepartment(departmentData).subscribe({
                next: () => {
                    this.loadDepartments();
                    this.cancelForm();
                },
                error: (error) => {
                    console.error('Error creating department:', error);
                }
            });
        }
    }

    deleteDepartment(id: number, name: string): void {
        if (confirm(`Are you sure you want to delete ${name} department?`)) {
            this.departmentService.deleteDepartment(id).subscribe({
                next: () => {
                    this.loadDepartments();
                },
                error: (error) => {
                    console.error('Error deleting department:', error);
                }
            });
        }
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.departmentForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.departmentForm.get(fieldName);
        return !!(field?.invalid && field?.touched);
    }
}
