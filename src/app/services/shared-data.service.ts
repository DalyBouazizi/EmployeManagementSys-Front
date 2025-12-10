import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedDataService {
    private employeeCountSubject = new BehaviorSubject<number>(0);
    public employeeCount$: Observable<number> = this.employeeCountSubject.asObservable();

    constructor() { }

    updateEmployeeCount(count: number): void {
        this.employeeCountSubject.next(count);
    }
}
