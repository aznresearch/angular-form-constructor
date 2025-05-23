import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../services/locale.service';

@Pipe({
  name: 'localized',
  pure: false
})
export class LocalizedPipe implements PipeTransform {
  constructor(private localeService: LocaleService) {}

  transform(value: string): string | null {
    const currentLocale = this.localeService.getCurrentLocale();
    const localizedValue = currentLocale[value];

    if (localizedValue === '_hide') {
      return null;
    }
    return localizedValue || `!!${value}!!`;
  }
}
