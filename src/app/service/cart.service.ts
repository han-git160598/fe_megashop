import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private URL_SERVER = environment.URL_API;

  private cartDataClient: CartModelPublic = {
    total : 0,
    prodData: [{
      incart : 0,
      id : 0,
    }]
  };

  private cartDataServer : CartModelServer = {
    total : 0,
    data : [{
        numInCart : 0, 
        product : Object(),
    }]
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer)


  constructor(  private http: HttpClient, 
                private productService: ProductService,
                private orderService: OrderService ) { }
  









}
