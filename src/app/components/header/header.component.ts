import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isMenuOpen = false;
    employeeCount: number = 0;
    private countSubscription?: Subscription;

    constructor(private sharedDataService: SharedDataService) { }

    ngOnInit(): void {
        this.countSubscription = this.sharedDataService.employeeCount$.subscribe(count => {
            this.employeeCount = count;
        });
    }

    ngOnDestroy(): void {
        this.countSubscription?.unsubscribe();
    }

    toggleMenu(): void {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
