import {Component, OnInit, ViewChild} from '@angular/core';
import { Employee } from '../Employee';
import { EmployeeService } from '../employee.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeEditDialogComponent } from '../employee-edit-dialog/employee-edit-dialog.component';
import { EmployeeCreateDialogComponent } from '../employee-create-dialog/employee-create-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  dataSource = new MatTableDataSource<Employee>(this.employees);
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'street',
    'postcode',
    'city',
    'phone',
    'actions',
  ];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {

  }

  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
      this.dataSource = new MatTableDataSource<Employee>(this.employees);
      this.dataSource.sort = this.sort;
    });
    this.dataSource.filterPredicate = function (record, filter) {
      return true;
    };
  }

  filterEmployee(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    console.log(filterValue);
    this.dataSource.filter = filterValue;
  }

  createEmployee() {
    let dialogRef = this.dialog.open(EmployeeCreateDialogComponent);
    // TODO: find a better way to update after change
    dialogRef.afterClosed().subscribe((newEmployee) => {
      if (newEmployee) {
        this.employees.push(newEmployee);
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
      }
    });
  }

  editEmployee(employee: Employee) {
    console.log(`${JSON.stringify(employee)}`);
    this.dialog.open(EmployeeEditDialogComponent, { data: employee });
  }

  deleteEmployee(employee: Employee) {
    // TODO: handle this in service
    if (employee.id) {
      this.employeeService.deleteEmployee(employee.id).subscribe(() => {
        // remove employee from the array
        this.employees = this.employees.filter((emp) => emp.id !== employee.id);
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        if (this.employees.length === 0) {
          console.log('No data to show');
        }
      });
    }
  }
}
