import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public dialog: MatDialog) { }


  openPhoneLoginDialog() {
    const dialogRef = this.dialog.open(PhoneLoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialogs/dialog-1.html',
  styleUrls: ['./dialogs/dialogs.css']
})
export class DialogContentExampleDialogComponent { }


@Component({
  selector: 'app-phone-login',
  templateUrl: './dialogs/phone.html',
  styleUrls: ['./dialogs/dialogs.css']
})
export class PhoneLoginComponent {

}
