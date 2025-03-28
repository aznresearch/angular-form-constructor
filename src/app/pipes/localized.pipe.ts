import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../services/locale.service';

@Pipe({
  name: 'localized',
  pure: false
})
export class LocalizedPipe implements PipeTransform {
  constructor(private localeService: LocaleService) {}

  transform(value: string): string {
    const currentLocale = this.localeService.getCurrentLocale();
    return currentLocale[value] || value;
  }
}
