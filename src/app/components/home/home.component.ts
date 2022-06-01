import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductModelServer, ServerResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products : ProductModelServer[] = [];
  count : number = 0;
  sub : Subscription[] = [];
  constructor(private ProductService : ProductService, private router :  Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.sub.push(
      this.ProductService.getAllProducts()
      .subscribe((res : ServerResponse) => {
        console.log(res);
        if (res) {
          this.products = res.products;
          this.count = res.count;
        }
      })
    )
  };

  selectedProduct(id: Number) {
    this.router.navigate(['product', id]).then();
  }

}
