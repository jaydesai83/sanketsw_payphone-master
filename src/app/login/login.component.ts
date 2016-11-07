import {Component, OnInit} from '@angular/core';
import {Button, InputText, Password, Messages, Message} from 'primeng/primeng';
import {Router} from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { AuditService } from '../services/audit.service';
declare var amplify: any;



@Component({
  selector: 'as-login',
  templateUrl: 'app/login/login.html',
  styleUrls: [
    'app/login/login.css'
  ],
  directives: [Button, InputText, Password, Messages],
  providers: [UserService, AuditService]
})

export class LoginComponent implements OnInit {

  name: string;
  password: string;

  msgs: Message[] = [];

  constructor(private router: Router, private userService: UserService, private auditService: AuditService) {
  }

  ngOnInit() {
    if (this.userService.getLoggedUser() != null) {
      this.navigateToLandingPage(this.userService.getLoggedUser());
    }
  }

  navigateToLandingPage(user: User) {
    this.router.navigate(['/report']);
  }

  showError(summary: string, detail: string) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: summary, detail: detail });
  }

  login() {
    this.userService.autheticateUser(this.name, this.password).then(
      user => {
        console.log('user logged in ' + this.name);
        this.navigateToLandingPage(user);
      },
      error => {
        console.log(error);
        this.showError('Authetication failed', error);
      });
  }


}
