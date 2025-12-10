import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
    selector: 'app-employee-card',
    standalone: true,
    imports: [CommonModule, RouterModule, PhoneFormatPipe, HighlightDirective, TooltipDirective],
    templateUrl: './employee-card.component.html',
    styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
    @Input() employee!: Employee;
    @Output() delete = new EventEmitter<number>();

    onDelete(): void {
        if (this.employee.id && confirm(`Are you sure you want to delete ${this.employee.firstName} ${this.employee.lastName}?`)) {
            this.delete.emit(this.employee.id);
        }
    }

    getStatusColor(): string {
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
