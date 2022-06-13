import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    cartData : any = [];
    cartTotal : number = 0;
    
    constructor(private CartService : CartService , private orderService : OrderService, private router : Router , private spinner : NgxSpinnerService) { }

    ngOnInit(): void {
        this.CartService.cartData$.subscribe(data => this.cartData = data  );
        this.CartService.cartTotal$.subscribe(total => this.cartTotal = total);
        
    }
    
    onCheckout(){
        this.spinner.show().then( p=> {
            this.CartService.checkoutCart(1)
        });
    }

}
