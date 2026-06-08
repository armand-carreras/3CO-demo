import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductHandlerService } from 'src/app/shared/services/product-handler.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {

  public wantMoreInfo: boolean = false;
  public selectedProduct!: Product;
  public user!: User;
  public categories = [
    { name: 'Appliances', icon: 'hardware-chip-outline' },
    { name: "Personal Care", icon: 'cosmetics' },
    { name: 'Industry', icon: 'construct-outline' },
    { name: 'Building', icon: 'business-outline' },
    { name: 'Furniture', icon: 'bed-outline' },
    { name: 'Resources', icon: 'globe-outline' },
    { name: 'Food', icon: 'fast-food-outline' },
    { name: 'Textiles', icon: 'shirt-outline' },
    { name: 'Transport', icon: 'bus-outline' },
    { name: 'Forest', icon: 'leaf-outline' },
    { name: "Various", icon: 'balloon-outline' }
  ];


  public productsLoaded: boolean = false;


  public isModalOpen: boolean = false;
  public selectedCategories: string[] = [];
  public products: Product[] = [];
  public page: number = 1;
  public totalPages: number = 0;
  public currentSearchQuery: string = '';


  private subscriptions: Subscription[] = [];



  constructor(private router: Router,
    private userService: UserService,
    private productServ: ProductHandlerService,
    private toastServ: ToastService,
    private alertController: AlertController,
    private authServ: AuthService,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.user = this.userService.getUserValue();
    //this.setToZero();
  }

  async ionViewWillEnter() {
    this.user = this.userService.getUserValue();
    //this.setToZero();
    this.page = 1;
    this.currentSearchQuery = '';
    this.selectedCategories = [];
    const response = await this.productServ.loadProducts(this.page, this.currentSearchQuery, this.selectedCategories);
    console.log('Initial load response:', response);
    this.products = this.productServ.getProducts;
    if (response) {
      this.totalPages = response.pages;
      console.log('Total pages set to:', this.totalPages);
    }

    this.productsLoaded = true;
    //this.orderByCategory(this.productServ.getProducts);
    //this.storeOriginalProducts();
  }

  ionViewWillLeave(): void {
    this.destroySubscriptions()
  }

  //Filter Dismissing
  onWillDismiss(event: Event) {
    this.isModalOpen = false;
    console.log('dismissing filter', JSON.stringify(event));
  }



  public getCategoryIcon(categoryName: string) {
    return this.categories.find(category => category.name === categoryName)?.icon;
  }


  //Filter select product categories
  public async applyFilters() {
    this.page = 1;
    const response = await this.productServ.loadProducts(this.page, this.currentSearchQuery, this.selectedCategories);
    if (response) {
      this.totalPages = response.pages;
    }
    this.products = this.productServ.getProducts;
    this.isModalOpen = false;
    this.changeDetectorRef.detectChanges();
  }

  public toggleFilter() {
    this.isModalOpen = !this.isModalOpen;
  }

  public async clearFilters() {
    this.selectedCategories = [];
    this.page = 1;
    const response = await this.productServ.loadProducts(this.page, this.currentSearchQuery, this.selectedCategories);
    if (response) {
      this.totalPages = response.pages;
    }
    this.products = this.productServ.getProducts;
  }

  public async loadMore(event: any) {
    console.log('LoadMore triggered. Current Page:', this.page, 'Total Pages:', this.totalPages, 'Query:', this.currentSearchQuery);
    this.page++;
    if (this.page <= this.totalPages) {
      console.log('Loading page:', this.page);
      await this.productServ.loadProducts(this.page, this.currentSearchQuery, this.selectedCategories);
      this.products = this.productServ.getProducts;
      console.log('Products updated. Count:', this.products.length);
    } else {
      console.log('Max pages reached or no total pages set.');
    }
    console.log('Completing infinite scroll event');
    event.target.complete();
  }

  // Toggle selection of items
  public toggleSelection(item: string) {
    const index = this.selectedCategories.indexOf(item);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(item);
    }
  }


  /* get isThereAnyProduct() {
    return Object.values(this.groupedProducts).some(products => products.length > 0);
  } */


  /* public isGroupCategoryEmpty(category: string) {
    return (this.groupedProducts && this.groupedProducts[category]?.length > 0) ? true : false;
  } */

  public goToProfile() {
    this.router.navigate(['/tabs/account']);
  }
  public goToMainPage() {
    this.router.navigate(['/tabs/product']);
  }
  public closeMoreInfo() {
    this.wantMoreInfo = false;
  }
  public postNewProduct() {
    if (!this.authServ.isUserGuest) {
      this.router.navigate(['/tabs/product/add-product']);
    } else {
      this.presentAlert();
    }
  }

  public async handleSearchBarInput(ev: any) {
    const query = ev.detail.value ? ev.detail.value.trim().toLowerCase() : '';
    console.log('Search query:', query);
    this.currentSearchQuery = query;
    this.page = 1;
    // Debouncing could be added here if needed, but for now we call directly on input change (or enter)
    // The previous implementation was client side filtering. Now we fetch from backend.

    // If we want to only search when user hits SEARCH button or types, we can check trigger
    // But typical ionic searchbar emits on input. User might want debounce.
    // For this task simply calling loadProducts with query.

    const response = await this.productServ.loadProducts(this.page, this.currentSearchQuery, this.selectedCategories);
    if (response) {
      this.totalPages = response.pages;
    }
    this.products = this.productServ.getProducts;
  }

  public showProductInfo(product: Product) {
    this.selectedProduct = product;
    this.wantMoreInfo = true;
  }


  /* private orderByCategory(products: Product[]) {
    products.forEach(product => {
      if (product.categories?.length) {
        const category = product.categories[0];
        if (this.groupedProducts[category]) {
          this.groupedProducts[category].push(product);
        }
      }
    });
  } */

  private destroySubscriptions() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private goToMigrate() {
    this.authServ.logoutUser();
    this.router.navigate(['/auth/migrate-user']);
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Become a user?',
      message: 'To benefit of all features from 3CO please register as user.',
      buttons: [{
        text: 'Migrate to User',
        handler: (() => {
          this.goToMigrate();
        })
      }],
    });

    await alert.present();
  }


  /* private storeOriginalProducts() {
    this.originalGroupedProducts = this.groupedProducts;
  } */



  /*  private setToZero() {
     this.groupedProducts = {
       'Electronics': [],
       'Cosmetics':[],
       'Industry':[],
       'Building':[],
       'Matresses': [],
       'Global': [],
       'Food': [],
       'Textile': [],
       'Chemicals': [],
       'Energy': [],
       'Other': []
     };
   } */




}
