import { Component, Input } from '@angular/core';

@Component({
  selector: 'trigger',
  templateUrl: './trigger-item.component.html',
  styleUrls: ['trigger-item.component.scss'],
})
export class TriggerItemComponent {
  @Input() product: any;
}
