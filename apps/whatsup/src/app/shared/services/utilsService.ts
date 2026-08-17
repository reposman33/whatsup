import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public getFormattedDateTime(date: Date): string {
    const now = new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Europe/Amsterdam",
  })
  .format(date).toString()
  // verwijder slepende timezone string
  return now.slice(0, now.length-5)
  }

}
