import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'card'
})
export class CardPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): unknown {
    if(value?.card){
      const {last4, exp_month, exp_year, brand, funding} = value.card;
      return `${brand}, **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}, ${funding}`;
    }else{
      return "Unknown card";
    }
  }

}
