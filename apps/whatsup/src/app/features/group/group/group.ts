import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../../core';

@Component({
  selector: 'group',
  imports: [],
  templateUrl: './group.html',
  styleUrl: './group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent {
  id = input<string>('');
  naam = input<string>('');
  description = input<string>('')

  private storageService = inject(StorageService)
  
  handleSelectGroup(groupId: string) {
    // toon de contacten in de group
    this.storageService.getContactsByGroup(groupId)
  }
}
