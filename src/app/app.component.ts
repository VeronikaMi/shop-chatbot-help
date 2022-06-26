import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public products:any[]=[
    // {
    //   clothType: { name: "Pants", description: null, id: 1 },
    //   clothTypeId: 1,
    //   colorType: { name: "Black", description: null, id: 9 },
    //   colorTypeId: 9,
    //   description: "ყველაზე მაგარი ბრენდული შარვალი",
    //   id: 1,
    //   materialType: { name: "Cotton", description: null, id: 2 },
    //   materialTypeId: 2,
    //   name: "მასიმო დუტის შარვალი",
    //   price: 399.99,
    //   productPhoto: { path: "C:\\Users\\ramazi\\Desktop\\photos\\pants.jpg", data: null, id: 3 },
    //   productPhotoId: 3,
    //   sizeEuType: { value: 39, description: null, id: 39 },
    //   sizeEuTypeId: 39,
    //   sizeUsType: { value: "M", description: null, id: 38 },
    //   sizeUsTypeId: 38,
    //   userCart: null,
    //   userCartId: null,
    // },
    // {
    //   clothType: { name: "Pants", description: null, id: 1 },
    //   clothTypeId: 1,
    //   colorType: { name: "Black", description: null, id: 9 },
    //   colorTypeId: 9,
    //   description: "ყველაზე მაგარი ბრენდული შარვალი",
    //   id: 1,
    //   materialType: { name: "Cotton", description: null, id: 2 },
    //   materialTypeId: 2,
    //   name: "მასიმო დუტის შარვალი",
    //   price: 399.99,
    //   productPhoto: { path: "C:\\Users\\ramazi\\Desktop\\photos\\pants.jpg", data: null, id: 3 },
    //   productPhotoId: 3,
    //   sizeEuType: { value: 39, description: null, id: 39 },
    //   sizeEuTypeId: 39,
    //   sizeUsType: { value: "M", description: null, id: 38 },
    //   sizeUsTypeId: 38,
    //   userCart: null,
    //   userCartId: null,
    // },
  ];
  public darkBackground: Subject<boolean> = new Subject<boolean>();

  constructor(private el: ElementRef, private render: Renderer2) {}

  ngOnInit() {
    this.render.listen('window', 'scroll', () => {
      const rect = this.el.nativeElement.getBoundingClientRect().bottom;
      if (document.documentElement.clientHeight + 300 > rect) {
        this.darkBackground.next(true);
      } else {
        this.darkBackground.next(false);
      }
    });
  }
}
