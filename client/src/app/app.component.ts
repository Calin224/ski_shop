import { Component } from "@angular/core";
import { HeaderComponent } from "./layout/header/header.component";
import { ShopComponent } from "./features/shop/shop.component";
import {RouterOutlet} from '@angular/router';

@Component({
  selector: "app-root",
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})

export class AppComponent{
  title = 'SKINET';
}
