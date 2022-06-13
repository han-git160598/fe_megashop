import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private productService : ProductService) { }
  product : any = [];
  ngOnInit(): void {
    this.productService.getSingleProduct(1).subscribe( data => this.product );
     
  }

}
