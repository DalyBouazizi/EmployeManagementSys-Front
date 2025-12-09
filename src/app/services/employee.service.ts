import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

/**
 * Service for managing employee data
 * Handles all HTTP operations for employees
 */
@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = 'http://localhost:3000/employees';

    constructor(private http: HttpClient) { }

    /**
     * Get all employees
     * @returns Observable of employee array
     */
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    /**
     * Get employee by ID
     * @param id - Employee ID
     * @returns Observable of employee
     */
    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new employee
     * @param employee - Employee data
     * @returns Observable of created employee
     */
    createEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee);
    }

    /**
     * Update existing employee
     * @param id - Employee ID
     * @param employee - Updated employee data
     * @returns Observable of updated employee
     */
    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
    }

    /**
     * Delete employee
     * @param id - Employee ID
     * @returns Observable of void
     */
    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Search employees by term
     * @param term - Search term
     * @returns Observable of matching employees
     */
    searchEmployees(term: string): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}?q=${term}`);
    }
}
