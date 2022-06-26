import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
// import { EventEmitter } from 'stream';
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'chat',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() darkBackground: Subject<boolean> = new Subject<boolean>();
  @Input('messages') messages: Message[] = [];
  @Input() productsList: any[] = [];
  @Output() productsListChange: EventEmitter<any[]> = new EventEmitter();
  public changeColor: boolean = false;
  private subscription: Subscription;
  private initialMessage: Message = {
    text: 'გამარჯობა, რით შემიძლია დაგეხმაროთ?',
    date: this.getTime(),
    userOwner: false,
    selectOptions: [],
  };

  public textInput: string = '';
  public showChatbot: boolean = false;
  public showMenu: boolean = false;
  public timestamp: string;

  @ViewChild('messagesContainer') container: ElementRef;

  constructor(private chatService: ChatbotService) {}

  public ngOnInit(): void {
    if (localStorage.getItem('history')) {
      this.messages = [...JSON.parse(localStorage.getItem('history'))];
    }

    this.subscription = this.darkBackground.subscribe((value) => {
      this.changeColor = value;
    });

    // this.getInitialMessage();
    this.messages = [this.initialMessage];
  }

  public ngAfterViewChecked(): void {
    this.scrollBottom();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onOptionSelect(id: number): void {
    this.messages.push({
      text: this.messages[0].selectOptions.find((el) => el.id === id).text,
      date: this.getTime(),
      userOwner: true,
    });

    setTimeout(
      () =>
        this.getResponse(
          this.messages[0].selectOptions.find((el) => el.id === id).text
        ),
      1000
    );

    localStorage.setItem('history', JSON.stringify(this.messages));
  }

  public sendMessage(): void {
    if (this.textInput.length > 0) {
      let newMessage = { text: this.textInput, date: '', userOwner: true };
      newMessage.date = this.getTime();
      this.messages.push(newMessage);
      localStorage.setItem('history', JSON.stringify(this.messages));
      setTimeout(() => this.getResponse(newMessage.text), 1000);
      this.textInput = '';
    }
  }

  public onChatbotClick(element: any): void {
    if (
      (element.classList.contains('collapse') &&
        !element.classList.contains('menu-item')) ||
      !this.showChatbot
    ) {
      this.showChatbot = !this.showChatbot;
      if (this.showMenu) {
        this.showMenu = false;
      }
      if (!this.timestamp) {
        this.timestamp = this.getTime(true);
      }
    } else {
      this.showMenu = !this.showMenu;
    }
  }

  public onDeleteHistory(): void {
    this.messages = [this.initialMessage];
    localStorage.clear();
  }

  public onKey(event: any): void {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
  }

  private getResponse(text: string): void {
  //   this.productsList = [
  //     {
  //    clothType: { name: "Pants", description: null, id: 1 },
  //    clothTypeId: 1,
  //    colorType: { name: "Black", description: null, id: 9 },
  //    colorTypeId: 9,
  //    description: "ყველაზე მაგარი ბრენდული შარვალი",
  //    id: 1,
  //    materialType: { name: "Cotton", description: null, id: 2 },
  //    materialTypeId: 2,
  //    name: "მასიმო დუტის შარვალი",
  //    price: 399.99,
  //    productPhoto: { path: "C:\\Users\\ramazi\\Desktop\\photos\\pants.jpg", data: null, id: 3 },
  //    productPhotoId: 3,
  //    sizeEuType: { value: 39, description: null, id: 39 },
  //    sizeEuTypeId: 39,
  //    sizeUsType: { value: "M", description: null, id: 38 },
  //    sizeUsTypeId: 38,
  //    userCart: null,
  //    userCartId: null,
  //  },
  //  ];
  //  this.productsListChange.emit(this.productsList);

    this.chatService.getResponse(text).subscribe((response: any) => {
      this.messages.push({
        text: response.responseMessage,
        date: this.getTime(),
        userOwner: false,
      });
      this.productsListChange.emit(response.products);
      localStorage.setItem('history', JSON.stringify(this.messages));
    });
    
  }

  // fix the container (scroll) - done
  // add list view - done
  // card design - done
  // change chatbot color
  // add attachment -  photo - send in formdata(binary)

//   Array [ {…} ]
// ​
// 0: Object { name: "მასიმო დუტის შარვალი", description: "ყველაზე მაგარი ბრენდული შარვალი", productPhotoId: 3, … }
// ​​
// clothType: Object { name: "Pants", description: null, id: 1 }
// ​​
// clothTypeId: 1
// ​​
// colorType: Object { name: "Black", description: null, id: 9 }
// ​​
// colorTypeId: 9
// ​​
// description: "ყველაზე მაგარი ბრენდული შარვალი"
// ​​
// id: 1
// ​​
// materialType: Object { name: "Cotton", description: null, id: 2 }
// ​​
// materialTypeId: 2
// ​​
// name: "მასიმო დუტის შარვალი"
// ​​
// price: 399.99
// ​​
// productPhoto: Object { path: "C:\\Users\\ramazi\\Desktop\\photos\\pants.jpg", data: null, id: 3 }
// ​​
// productPhotoId: 3
// ​​
// sizeEuType: Object { value: 39, description: null, id: 39 }
// ​​
// sizeEuTypeId: 39
// ​​
// sizeUsType: Object { value: "M", description: null, id: 38 }
// ​​
// sizeUsTypeId: 38
// ​​
// userCart: null
// ​​
// userCartId: null

  // private getInitialMessage(): void {
  //   this.chatService.getInitMessage().subscribe((response: string) => {
  //     this.initialMessage.text = response;
  //   });

    // this.chatService.getSelections().subscribe((response: string[]) => {
    //   this.initialMessage.selectOptions = response.map((el, index) => ({
    //     id: index + 1,
    //     text: el,
    //   }));
    // });
  // }

  private getTime(isMainTimestamp?: boolean): string {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    let timestamp = `${hours} : ${minutes}`;

    if (isMainTimestamp) {
      timestamp =
        `${date.getDate()} ${date.toLocaleString('default', {
          month: 'short',
        })}, ` + timestamp;
    }

    return timestamp;
  }

  private scrollBottom(): void {
    this.container.nativeElement.scrollTop =
      this.container.nativeElement.scrollHeight;
  }
}

export class Message {
  text: string;
  date: string;
  userOwner: boolean;
  selectOptions?: { id: number; text: string }[];
}
