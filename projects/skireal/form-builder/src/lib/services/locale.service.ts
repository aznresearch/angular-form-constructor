import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private localeSubject = new BehaviorSubject<Record<string, string>>({});
  locale$ = this.localeSubject.asObservable();

  setLocale(locale: Record<string, string>) {
    this.localeSubject.next(locale);
  }

  getCurrentLocale(): Record<string, string> {
    return this.localeSubject.value;
  }
}
