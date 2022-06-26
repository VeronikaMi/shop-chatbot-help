import { Component, Input } from '@angular/core';

@Component({
  selector: 'trigger-list',
  templateUrl: './trigger-list.component.html',
  styleUrls: ['./trigger-list.component.scss'],
})
export class TriggerListComponent {
  @Input() productsList: any[];
}
