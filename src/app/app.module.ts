import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './chatbot/message/message.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotService } from './chatbot.service';
import { TriggerListComponent } from './components/shared/trigger-list/trigger-list.component';
import { TriggerItemComponent } from './components/shared/trigger-list/trigger-item/trigger-item.component';
import { HeaderComponent } from './components/shared/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    ChatbotComponent,
    TriggerListComponent,
    TriggerItemComponent,
    HeaderComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [ChatbotService],
  bootstrap: [AppComponent],
})
export class AppModule {}
