import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private URL_SERVER = environment.URL_API;

  constructor(private http: HttpClient ) { }
  
  getAllProducts(numberOfResult = 10) : Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.URL_SERVER + 'products',{
      params: {
        limit:numberOfResult.toString()
      }
    });
  }

  getSingleProduct(id : number) : Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.URL_SERVER + 'products' + id);
  }

  getProductsFromCategory(catName : string) : Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.URL_SERVER + 'product/category' + catName);   
  }


}

















