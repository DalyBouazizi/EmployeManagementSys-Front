import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-filter.component.html',
    styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {
    @Output() searchChange = new EventEmitter<string>();
    @Output() departmentChange = new EventEmitter<string>();
    @Output() statusChange = new EventEmitter<string>();

    searchTerm: string = '';
    selectedDepartment: string = '';
    selectedStatus: string = '';

    departments: string[] = ['IT', 'HR', 'Sales', 'Marketing', 'Finance'];
    statuses: string[] = ['Active', 'On Leave', 'Inactive'];

    onSearchChange(): void {
        this.searchChange.emit(this.searchTerm);
    }

    onDepartmentChange(): void {
        this.departmentChange.emit(this.selectedDepartment);
    }

    onStatusChange(): void {
        this.statusChange.emit(this.selectedStatus);
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.selectedDepartment = '';
        this.selectedStatus = '';
        this.searchChange.emit('');
        this.departmentChange.emit('');
        this.statusChange.emit('');
    }
}
