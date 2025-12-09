import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

/**
 * Nested component for department selection
 * Implements ControlValueAccessor to work with reactive forms
 */
@Component({
    selector: 'app-department-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './department-selector.component.html',
    styleUrl: './department-selector.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DepartmentSelectorComponent),
            multi: true
        }
    ]
})
export class DepartmentSelectorComponent implements OnInit, ControlValueAccessor {
    @Input() label: string = 'Department';
    @Input() required: boolean = false;

    departments: Department[] = [];
    value: string = '';
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    constructor(private departmentService: DepartmentService) { }

    ngOnInit(): void {
        this.loadDepartments();
    }

    /**
     * Load departments from service
     */
    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                console.error('Error loading departments:', error);
            }
        });
    }

    // ControlValueAccessor implementation
    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Handle value change from select element
     */
    onValueChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        if (target) {
            this.value = target.value;
            this.onChange(this.value);
            this.onTouched();
        }
    }
}
