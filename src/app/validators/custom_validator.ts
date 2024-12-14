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
}
