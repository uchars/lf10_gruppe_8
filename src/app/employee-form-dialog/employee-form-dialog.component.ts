import {
  Component,
  Inject,
  Injectable,
  InjectionToken,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';
import { MatChipListbox } from '@angular/material/chips';
import { COMMA, E, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

const regexName = /^[^-\s]([a-zA-ZZäöüÄÖÜß_.\s-]){0,49}$/
const regexStreet = /^[^-\s]([a-zA-Z0-9ZäöüÄÖÜß_.\s-]){0,49}$/
const regexPostcode = /^\d{5}$/
const regexPhone = /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form-dialog.component.html',
  styleUrls: ['./employee-form-dialog.component.scss'],
})
export class EmployeeFormDialogComponent {
  employee: Employee;
  employeeExists: boolean = false;
  employeeReadonly: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  newSkill: string = '';
  chipList: MatChipListbox | undefined;
  saving: boolean = false;
  postcodeValid: boolean = false;
  employeeForm: FormGroup = new FormGroup({
    postcode: new FormControl('', [
      Validators.pattern(regexPostcode),
      Validators.required,
    ]),
    firstName: new FormControl('', [
      Validators.pattern(regexName),
      Validators.required,
    ]),
    lastName: new FormControl('', [
      Validators.pattern(regexName),
      Validators.required,
    ]),
    street: new FormControl('', [
      Validators.pattern(regexStreet),
      Validators.required,
    ]),
    phone: new FormControl('', [
      Validators.pattern(regexPhone),
      Validators.required,
    ]),
    city: new FormControl('', [
      Validators.pattern(regexName),
      Validators.required,
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data: any,
    private employeeService: EmployeeService
  ) {
    this.employee = data.employee;
    this.employeeReadonly = data.employeeReadonly;
    this.employeeExists = this.employee.id != undefined;
  }

  save() {
    this.saving = true;
    if (this.employeeExists && !this.employeeReadonly) {
      this.employeeService
        .updateEmployee(this.employee)
        .subscribe((editedEmployee) => {
          this.saving = false;
          this.dialogRef.close(editedEmployee);
        });
    } else {
      this.employeeService
        .addEmployee(this.employee)
        .subscribe((createdEmployee) => {
          this.saving = false;
          this.dialogRef.close(createdEmployee);
        });
    }
  }
}
