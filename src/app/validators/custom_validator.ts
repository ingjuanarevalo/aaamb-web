import { FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';

export class CustomValidator {
  static validateDueDate: any = (form: FormGroup) => {
    const dueDate = form.get('dueDate');
    if (!dueDate) return null;

    if (dueDate.value && dueDate.value <= DateTime.now()) {
      dueDate.setErrors({ dueDateIsBeforeNow: true });
      return { dueDateIsBeforeNow: true };
    } else {
      return null;
    }
  };

  static validateEndDate: any = (form: FormGroup) => {
    const startDate = form.get('startDate');
    const endDate = form.get('endDate');
    if (!startDate || !endDate) return null;

    if (startDate.value && endDate.value && endDate.value < startDate.value) {
      endDate.setErrors({ endDateIsBefore: true });
      return { endDateIsBefore: true };
    } else {
      return null;
    }
  };
}
