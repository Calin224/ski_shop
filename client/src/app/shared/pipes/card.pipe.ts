import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentSummary } from '../models/order';

@Pipe({
  name: 'card'
})
export class CardPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'] | PaymentSummary, ...args: unknown[]): unknown {
    if(value && 'card' in value){
      const {last4, exp_month, exp_year, brand, funding} = (value as ConfirmationToken['payment_method_preview']).card!;
      return `${brand}, **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}, ${funding}`;
    } else if(value && 'last4' in value){
      const {last4, expMonth, expYear, brand} = value as PaymentSummary;
      return `${brand}, **** **** **** ${last4}, Exp: ${expMonth}/${expYear}`;
    } else{
      return "Unknown card";
    }
  }

}
