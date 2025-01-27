import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const emptyCartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const snackService = inject(SnackbarService);

  if(!cartService.cart() || cartService.itemCount() === 0){
    snackService.error("The cart is empty!");
    router.navigateByUrl('/cart');
    return false;
  }

  return true;
};
