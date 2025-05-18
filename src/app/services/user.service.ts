import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs'; // ✅ importar throwError

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  loginOrRegister(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap(users => {
        const user = users[0];
        if (user) {
          if (user.password === password) {
            return of(user); // Login bem-sucedido
          } else {
            return throwError(() => new Error('Senha incorreta')); // ✅ Corrigido
          }
        } else {
          // Criar novo usuário
          const newUser = { email, password };
          return this.http.post(this.apiUrl, newUser);
        }
      })
    );
  }
}
