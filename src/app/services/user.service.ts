import { Injectable } from '@angular/core';
import { USERS } from './mock-users';
declare var amplify: any;

// Don't forget the parentheses! Neglecting them leads to an error that's difficult to diagnose.
@Injectable()
export class UserService {
  getUsers() {
    return Promise.resolve(USERS);
  }

  autheticateUser(name: string, password: string) {
    return this.getUsers().then(users => {
      for (let u of users) {
        if (u.username === name && u.password === password) {
          amplify.store('loggedUser', JSON.stringify(u));
          amplify.store('loggedIn', 'true');
          return Promise.resolve(u);
        }
      }
      amplify.store('loggedUser', null);
      amplify.store('loggedIn', 'false');
      throw 'invalid user credentials';
    });
  }

  getLoggedUser() {
    let user = amplify.store('loggedUser');
    if (user === undefined) {
      amplify.store('loggedUser', null);
      amplify.store('loggedIn', 'false');
      user = null;
    }
    return JSON.parse(user);
  }

  logout() {
    amplify.store('loggedUser', null);
    amplify.store('loggedIn', 'false');
  }
}
