import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment/locale/fr';

@Pipe({
  name: 'Date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    moment.locale('fr');
    return moment(value).format('DD/MM/YYYY HH:mm');
  }
}
