import {Component, inject} from '@angular/core';
import {ShopService} from '../../../core/services/shop.service';
import {MatDivider} from '@angular/material/divider';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-filters-diaglog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule
  ],
  templateUrl: './filters-diaglog.component.html',
  styleUrl: './filters-diaglog.component.scss'
})
export class FiltersDiaglogComponent {
  shopService = inject(ShopService);
  private dialogRef = inject(MatDialogRef<FiltersDiaglogComponent>);
  data = inject(MAT_DIALOG_DATA);

  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;

  applyFilters(){
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes,
    });
  }
}
