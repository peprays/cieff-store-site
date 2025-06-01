import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DadosPessoais {
  id: string;
  userId: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Adicione esta linha se não existir
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {} // Adicione HttpClient se não existir

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

  // MÉTODOS ADICIONADOS PARA O CARRINHO:

  // Obtém os dados pessoais do usuário atual
  getCurrentUserData(): Observable<DadosPessoais | null> {
    const currentUser = this.currentUser;
    if (!currentUser) {
      return new Observable(observer => observer.next(null));
    }

    return this.http.get<DadosPessoais[]>(`${this.apiUrl}/dadosPessoais`)
      .pipe(
        map(dadosPessoais => {
          const userData = dadosPessoais.find(dados => dados.userId === currentUser.id);
          return userData || null;
        })
      );
  }
}
