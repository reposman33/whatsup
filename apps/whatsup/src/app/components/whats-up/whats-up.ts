import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'whatsUp',
  imports: [],
  templateUrl: './whats-up.html',
  styleUrl: './whats-up.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsUp {

}
