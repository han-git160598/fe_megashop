import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';
import { ProductModelServer } from '../models/product.model'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  sub : Subscription[] = [];
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
        product:  {
            id: 0,
            name: '',
            category: '',
            description: '',
            price: 0,
            quantity: 0,
            image: '',
        },
        numInCart : 0, 
        }]
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(  private http: HttpClient, 
                private productService: ProductService,
                private orderService: OrderService,
                private router: Router, 
                private toast : ToastrService,
                private spinner : NgxSpinnerService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);
    
    let info : CartModelPublic = JSON.parse(localStorage.getItem('cart') || '[]');

    if( Array.isArray(info) && info.length > 0 ) {

        this.cartDataClient = info;
    
        this.cartDataClient.prodData.forEach( p => {
            this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => { 
            if(this.cartDataServer.data[0].numInCart === 0) {
                this.cartDataServer.data[0].numInCart = p.incart;
                this.cartDataServer.data[0].product = actualProdInfo;

                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
                this.cartDataServer.data.push({
                numInCart: p.incart,
                product : actualProdInfo,
                });
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({...this.cartDataServer});
            })
        })
    }


    
  }
  

 
    AddToCart(id : number, quantity ?:number){
        this.productService.getSingleProduct(id).subscribe( res => {
        // if cart empty
            if(this.cartDataServer.total === 0) 
            {
                this.cartDataServer.data[0].product = res ;
                this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1 ;
                this.CalculateTotal();
                this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
                this.cartDataClient.prodData[0].id = res.id;
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartData$.next({...this.cartDataServer});
                //toast notification
                this.toast.success(`{$res.name} added to the cart`, 'Product Added', { 
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass : 'toast-top-right',
                })

            } else {
                let index = this.cartDataServer.data.findIndex(p => p.product.id === res.id);
                if(index !== -1 ) {
                    if(quantity !== undefined && quantity  <= res.quantity) {
                        this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < res.quantity ? quantity : res.quantity ; 
                    } else {
                        this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < res.quantity ? this.cartDataServer.data[index].numInCart ++ : res.quantity ; 
                    }
                    this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
                    this.toast.info(`{$res.name} quantity update in the cart`, 'Product Update', { 
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass : 'toast-top-right',
                    })
                } else {
                    this.cartDataServer.data.push({
                        numInCart : 1 ,
                        product : res, 
                    });
                    this.cartDataClient.prodData.push({
                        incart : 1,
                        id: res.id,
                    });
                    
                    this.toast.success(`{$res.name} added to the cart`, 'Product Added', { 
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass : 'toast-top-right',
                    })

                    
                    this.cartDataClient.total = this.cartDataServer.total;
                    localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    this.cartData$.next({...this.cartDataServer});
                }
            }

        });

    }

    updateCartItems(index :number, increase : boolean){
        let data = this.cartDataServer.data[index];

        if(increase){
            data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
            this.cartDataClient.prodData[index].incart = data.numInCart ;

            this.cartDataClient.total = this.cartDataServer.total ;
            localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataServer})
        } else {
            data.numInCart--;
            if(data.numInCart < 1){
                this.cartData$.next({...this.cartDataServer});
            } else {
                this.cartData$.next({...this.cartDataServer});
                this.cartDataClient.prodData[index].incart = data.numInCart;

                this.cartDataClient.total = this.cartDataServer.total ;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
        }
  }

    deleteProducInCart(index: number) {
        if(window.confirm('Are you sure you want to remove the item ?')) {
            this.cartDataServer.data.slice(index, 1);
            this.cartDataClient.prodData.splice(index, 1);

            this.cartDataClient.total = this.cartDataServer.total;
            
            if(this.cartDataClient.total === 0 ) {
                this.cartDataClient = { total: 0 , prodData : [{ incart :0 , id :0}]};
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            }

            if(this.cartDataServer.total === 0) {
                this.cartDataServer =   {total : 0 ,  data : [{
                                                    product:  {
                                                    id: 0,
                                                    name: '',
                                                    category: '',
                                                    description: '',
                                                    price: 0,
                                                    quantity: 0,
                                                    image: '',
                                                    },
                                                    numInCart : 0, 
                                                }]
                                        }
                this.cartData$.next({...this.cartDataServer});
            } else {
                this.cartData$.next({...this.cartDataServer});
            }
            
        } else {
            return ;
        }
    }   


    private CalculateTotal() {
        let total = 0 ;
        this.cartDataServer.data.forEach( p => {
            const {numInCart} = p;
            const {price} = p.product

            total += numInCart *price ;
        });
        this.cartDataServer.total = total ;
        this.cartTotal$.next(this.cartDataServer.total);

    }

    checkoutCart(userId: number ){
        this.http.post(`${this.URL_SERVER}/orders/payment`, null)
        .subscribe((res : any ) => {
            if(res) {
                this.resetServerData();
                this.http.post(`${this.URL_SERVER}/order/new`, {
                    userId: userId,
                    products: this.cartDataClient.prodData
                }).subscribe( (data : any ) =>{
                    this.orderService.getSingleOrder(data.order_id).then(res => {
                        if(data.success) {
                            const navigationExtras: NavigationExtras  =  {
                                state : {
                                    messsage: data.message,
                                    products: res,
                                    orderId: data.order_id,
                                    total: this.cartDataClient.total
                                }
                            }; 
                            this.spinner.hide().then();
                            this.router.navigate(['/thankyou'], navigationExtras).then( p => {
                                this.cartDataClient = { total : 0 , prodData: [{incart : 0 , id :0 }]};
                                this.cartTotal$.next(0);
                                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                            })
                        }
                    });
                });
            } else {
                this.spinner.hide().then();
                this.router.navigateByUrl('/checkout').then();
                this.toast.error(`Sorry, failed to the book the order`, 'Order Status', { 
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass : 'toast-top-right',
                })
            }
            
        });

    }

    private resetServerData() {
        this.cartDataServer =   {
                                    total : 0,
                                    data : [{
                                            product:  {
                                                id: 0,
                                                name: '',
                                                category: '',
                                                description: '',
                                                price: 0,
                                                quantity: 0,
                                                image: '',
                                            },
                                            numInCart : 0, 
                                            }]
                                };
                                
        this.cartData$.next({...this.cartDataServer});


    }
  

}


interface OrderResponse  {
    order_id: number;
    success: boolean;
    message: string;
    products: [{
        id: string,
        numInCart: string,
    }]; 
}

