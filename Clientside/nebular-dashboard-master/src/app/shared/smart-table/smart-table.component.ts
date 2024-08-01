import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';

export interface Column {
  key: string;
  title: string;
}

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() itemsPerPage = 10;
  @Input() title = 'Data Management';
  @Input() createButtonText = 'CREATE';
  @Output() create = new EventEmitter<void>();
  @Output() updateRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();

  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['itemsPerPage']) {
      this.filterData();
      this.sortData();
      this.updatePagination();
    }
  }

  filterData(): void {
    if (this.searchTerm) {
      this.filteredData = this.data.filter(item =>
        Object.values(item).some(val =>
          val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredData = [...this.data];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  sortData(): void {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn!];
        const valueB = b[this.sortColumn!];
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onItemsPerPageChange(value: number): void {
    this.itemsPerPage = value;
    this.updatePagination();
  }

  onCreate(): void {
    this.create.emit();
  }

  onUpdate(row: any): void {
    this.updateRow.emit(row);
  }

  onDelete(row: any): void {
    this.deleteRow.emit(row);
  }

  onExport(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, this.title);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName.replace(/\s+/g, '_')}_${new Date().toISOString()}.xlsx`;
    link.click();
  }
}