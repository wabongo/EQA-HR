import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    console.log('Page Change Event Emitted:', page);
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }

  isPageActive(page: number): boolean {
    return page === this.currentPage;
  }
}