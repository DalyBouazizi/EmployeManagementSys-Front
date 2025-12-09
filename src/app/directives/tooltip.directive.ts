import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * Custom directive to show tooltips on hover
 * Usage: <button appTooltip [tooltipText]="'Click to edit'">Edit</button>
 */
@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective {
    @Input() tooltipText: string = '';
    private tooltipElement: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipText) return;
        this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hideTooltip();
    }

    @HostListener('click') onClick() {
        this.hideTooltip();
    }

    /**
     * Create and display tooltip
     */
    private showTooltip() {
        // Create tooltip element
        this.tooltipElement = this.renderer.createElement('span');
        const text = this.renderer.createText(this.tooltipText);
        this.renderer.appendChild(this.tooltipElement, text);

        // Style tooltip
        this.renderer.addClass(this.tooltipElement, 'tooltip');
        this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipElement, 'background-color', '#1f2937');
        this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
        this.renderer.setStyle(this.tooltipElement, 'padding', '6px 12px');
        this.renderer.setStyle(this.tooltipElement, 'border-radius', '6px');
        this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
        this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
        this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
        this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0,0,0,0.15)');

        // Position tooltip
        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const tooltipPos = {
            top: hostPos.top - 35,
            left: hostPos.left + hostPos.width / 2
        };

        this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPos.top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipPos.left}px`);
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');

        // Append to body
        this.renderer.appendChild(document.body, this.tooltipElement);
    }

    /**
     * Remove tooltip from DOM
     */
    private hideTooltip() {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }
}
