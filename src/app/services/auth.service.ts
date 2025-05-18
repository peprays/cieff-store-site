
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  get currentUser() {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
