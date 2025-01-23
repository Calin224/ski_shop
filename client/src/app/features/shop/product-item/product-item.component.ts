import {Component, input} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [
    CurrencyPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatIcon,
    RouterLink
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  product = input<Product>();
}
