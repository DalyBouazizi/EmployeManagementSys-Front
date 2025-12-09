import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';

/**
 * Service for managing department data
 * Handles all HTTP operations for departments
 */
@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private apiUrl = 'http://localhost:3000/departments';

    constructor(private http: HttpClient) { }

    /**
     * Get all departments
     * @returns Observable of department array
     */
    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.apiUrl);
    }

    /**
     * Get department by ID
     * @param id - Department ID
     * @returns Observable of department
     */
    getDepartmentById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new department
     * @param department - Department data
     * @returns Observable of created department
     */
    createDepartment(department: Department): Observable<Department> {
        return this.http.post<Department>(this.apiUrl, department);
    }

    /**
     * Update existing department
     * @param id - Department ID
     * @param department - Updated department data
     * @returns Observable of updated department
     */
    updateDepartment(id: number, department: Department): Observable<Department> {
        return this.http.put<Department>(`${this.apiUrl}/${id}`, department);
    }

    /**
     * Delete department
     * @param id - Department ID
     * @returns Observable of void
     */
    deleteDepartment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
