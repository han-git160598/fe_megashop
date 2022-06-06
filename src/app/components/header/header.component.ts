import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  CartData : CartModelServer = Object(); 
  CartTotal : number = 0;

  constructor(private CartService : CartService) { }

  ngOnInit(): void {
    
    this.CartService.cartTotal$.subscribe( total =>{ this.CartTotal = total });
    this.CartService.cartData$.subscribe( data => this.CartData = data);
  }
  deleteProducInCart(index : number) {
    this.CartService.deleteProducInCart(index);
  }
}
