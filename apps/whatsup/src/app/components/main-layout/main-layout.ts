import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mainLayout',
  imports: [],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {

}
