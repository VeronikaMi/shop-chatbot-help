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
  
  private subscription: Subscription;
  private initialMessage: Message = {
    text: 'გამარჯობა, რით შემიძლია დაგეხმაროთ?',
    date: this.getTime(),
    userOwner: false,
  };

  public selectedFile: ImageSnippet=new ImageSnippet();
  public textInput: string = '';
  public showChatbot: boolean = false;
  public timestamp: string;

  @ViewChild('messagesContainer') container: ElementRef;

  constructor(private chatService: ChatbotService) {}

  public ngOnInit(): void {
    if (localStorage.getItem('history')) {
      this.messages = [...JSON.parse(localStorage.getItem('history'))];
    }

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
      if (!this.timestamp) {
        this.timestamp = this.getTime(true);
      }
    } 
  }

  public onKey(event: any): void {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
  }

  private getResponse(text: string): void {
    // for testing - to be deleted
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

  processFile(imageInput: any,e:any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      let newMessage:Message = { text: '', date: this.getTime(), userOwner: true, img:this.selectedFile.src };
      this.messages.push(newMessage);
      localStorage.setItem('history', JSON.stringify(this.messages));

      this.chatService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
        console.log("uploaded successfully")
        //change product list
        },
        (err) => {
        console.log("failed to upload")
        })
    });

    reader.readAsDataURL(file);
    this.selectedFile = new ImageSnippet();
  }

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
  img?:string;
}

class ImageSnippet {
  constructor(public src?: string, public file?: File) {}
}
