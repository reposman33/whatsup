import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';

type ButtonAction = (arg?: any) => void

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  onClick = output<void>()
  isDisabled = input<boolean>(false)

}
