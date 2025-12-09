import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

/**
 * Shared service for cross-component communication
 * Uses RxJS BehaviorSubjects to share state between components
 */
@Injectable({
    providedIn: 'root'
})
export class SharedDataService {
    // Selected employee for viewing/editing
    private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
    public selectedEmployee$: Observable<Employee | null> = this.selectedEmployeeSubject.asObservable();

    // Filter state for employee list
    private filterStateSubject = new BehaviorSubject<{
        searchTerm: string;
        department: string;
        status: string;
    }>({
        searchTerm: '',
        department: '',
        status: ''
    });
    public filterState$ = this.filterStateSubject.asObservable();

    constructor() { }

    /**
     * Set the selected employee
     * @param employee - Employee to select
     */
    setSelectedEmployee(employee: Employee | null): void {
        this.selectedEmployeeSubject.next(employee);
    }

    /**
     * Update filter state
     * @param filters - Filter criteria
     */
    updateFilters(filters: { searchTerm?: string; department?: string; status?: string }): void {
        const currentFilters = this.filterStateSubject.value;
        this.filterStateSubject.next({ ...currentFilters, ...filters });
    }

    /**
     * Clear all filters
     */
    clearFilters(): void {
        this.filterStateSubject.next({
            searchTerm: '',
            department: '',
            status: ''
        });
    }
}
