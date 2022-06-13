import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {

    message: string = '';
    orderId: number = 0;
    products: any ;
    cartTotal : number = 0 ;

    constructor( private router:Router, private orderService : OrderService ) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as {
            message : string ,
            products : ProductResponseModel[],
            total : number ,
            orderId : number ,
        }
 
        this.message    = state.message ;
        this.products   = state.products ;
        this.orderId    = state.orderId ;
        this.cartTotal  = state.total;
    }

   

    ngOnInit(): void {
        
    }

}

interface ProductResponseModel {
    id : number ;
    title : string ;
    description : string ;
    price : number ;
    quantityOrdered: number ;
    image: string ; 
}