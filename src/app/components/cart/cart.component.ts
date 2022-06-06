import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/service/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  
    cartData : any = [];
    CartTotal : number = 0;
    subTotal: Number = 0;
    constructor(public  Carservice : CartService) { }

    ngOnInit(): void {
        this.Carservice.cartData$.subscribe( data =>{ this.cartData = data });
        this.Carservice.cartTotal$.subscribe( total => this.CartTotal = total);
    }

    changeQuantity(index: number, increaseQuantity: boolean) {
        this.Carservice.updateCartItems(index, increaseQuantity);
    }


}
