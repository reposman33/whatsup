import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../environment';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { catchError, map, of, timeout, TimeoutError } from 'rxjs';

interface TranslateResponse {
  responseData: {translatedText: string}
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private http = inject(HttpClient)


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

  async translateText(textToTranslate: string, sourceLang: string, targetLang: string): Promise<string> {  

    return firstValueFrom(this.http.get<TranslateResponse>(`${AppConfig.translateUrl}?q=${textToTranslate}&langpair=${sourceLang}|${targetLang}`)
    .pipe(
      map((response) => {
        const translated = response.responseData.translatedText
        if(translated.toUpperCase().includes('IS AN INVALID TARGET LANGUAGE')) {
          return `${textToTranslate}\n\n[Tekst kon niet vertaald worden: ${targetLang} is onbekende doeltaal]`
        }
        if(translated.toUpperCase().includes('QUERY LENGTH LIMIT EXCEEDED')) {
          return `${textToTranslate}\n\n[Tekst kon niet vertaald worden: maximum lengte is 500 karakters]`
        }
        return translated
      } ),
      timeout(8000),
      catchError((err: unknown) => {
        if(err instanceof TimeoutError) {
          return of(`${textToTranslate}\n\n[Tekst kon niet vertaald worden: timeoutError]`)
        }
        if(err instanceof HttpErrorResponse) {
          const reden = err.status === 0 ? 'Geen verbinding met vertaalservice' : `serverfout: ${err.message}`
          return of(`${textToTranslate}\n\n[${reden}]`)
        }
          return of(textToTranslate);
      }),

  ))
}
}
