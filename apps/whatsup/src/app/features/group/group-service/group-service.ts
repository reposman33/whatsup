import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private router = inject(Router)
  addingNewGroup = signal<boolean>(false)

  closeNewGroupDialog(): void {
    this.addingNewGroup.set(false)
    this.router.navigateByUrl('')
  }
}
