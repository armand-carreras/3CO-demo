import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  standalone: false,
})
export class SingleProductComponent implements OnInit {
  @Input() product!: Product;

  public categories = [
    { name: 'Electronics', icon: 'hardware-chip-outline' },
    { name: 'Cosmetics', icon: 'cosmetics' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Matresses', icon: 'bed-outline' },
    { name: 'Global', icon: 'globe-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Textile', icon: 'shirt-outline' },
    { name: 'Chemicals', icon: 'flask-outline' },
    { name: 'Energy', icon: 'flash-outline' },
    { name: 'Other', icon: 'balloon-outline' }
  ];

  constructor() { }

  ngOnInit() { }

  public getCategoryIcon(categoryName: string) {
    return this.categories.find(category => category.name === categoryName)?.icon;
  }

}
