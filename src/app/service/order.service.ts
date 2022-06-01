import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  products : any[] = [];
  private URL_SERVER = environment.URL_API;
  constructor(private http : HttpClient, private productService: ProductService) { }

  getSingleOrder(OrderId: number) {
    return this.http.get<productResponseModel[]>(this.URL_SERVER + '/orders' + OrderId ).toPromise();
  }






}

interface productResponseModel {
  id: number;
  title: string;
  description : string;
  price:string;
  quantityOdered: number; 
}
