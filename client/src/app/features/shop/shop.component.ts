import {Component, inject, OnInit} from '@angular/core';
import {ShopService} from '../../core/services/shop.service';
import {Product} from '../../shared/models/product';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CurrencyPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {FiltersDiaglogComponent} from './filters-diaglog/filters-diaglog.component';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {ShopParams} from '../../shared/models/shopParams';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Pagination} from '../../shared/models/pagination';
import {FormsModule} from '@angular/forms';
import {ProductItemComponent} from './product-item/product-item.component';

@Component({
  selector: 'app-shop',
  imports: [MatCardModule, MatButtonModule, MatIcon, MatMenuTrigger, MatMenu, MatSelectionList, MatListOption, MatPaginator, FormsModule, ProductItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;

  sortOptions = [
    {name: 'Alphabetical', value: "alphabetical"},
    {name: 'Price: Low-High', value: "priceAsc"},
    {name: 'Price: High-Low', value: "priceDesc"},
  ]

  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response;
      },
      error: (error) => console.log(error)
    });
  }

  onSortChange(event: MatSelectionListChange) { // set the sort and PageNumber to the shopParams
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  onSearchChange() { // set the search in the shopParams
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDiaglogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });

    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.getProducts();
        }
      }
    });
  }

  handlePageEvent(event: PageEvent) { // set the pageNumber and pageSize
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }
}
