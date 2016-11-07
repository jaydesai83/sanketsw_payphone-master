import {CONSTANTS} from './shared';
import {Component, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Router} from '@angular/router';
import { AuditService } from './services/audit.service';
import { UserService } from './services/user.service';


declare var Modena: any;


@Component({
  selector: 'as-main-app',
  templateUrl: 'app/app.html',
  directives: [/* NavbarComponent, */ ROUTER_DIRECTIVES],
  providers: [AuditService, UserService]
})
export class AppComponent implements AfterViewInit {

  public appBrand: string;

  constructor(private router: Router,
    private auditService: AuditService,
    private userService: UserService) {
    this.appBrand = CONSTANTS.MAIN.APP.BRAND;

  }

  userLoggedIn(): boolean {
    return this.userService.getLoggedUser() != null;
  }

  ngAfterViewInit() {
    Modena.init();
  }

  cleanup() {
    this.auditService.clear();
    this.router.navigate(['/']);
  }

  logout() {
    this.userService.logout();
    console.log('user logged out ');
    this.router.navigate(['/']);
  }
}
