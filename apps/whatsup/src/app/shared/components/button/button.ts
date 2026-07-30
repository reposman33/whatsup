import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  isDisabled = input<boolean>(false)
}
