import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DadosPessoaisService {
  private apiUrl = 'http://localhost:3000'; // URL do json-server

  constructor(private http: HttpClient) { }

  // Método para salvar ou atualizar dados do usuário
  saveUserDetails(dados: any): Observable<any> {
    // Primeiro verificamos se o usuário já tem dados cadastrados
    return this.getUserDetails(dados.userId).pipe(
      map(existingData => {
        if (existingData) {
          // Se já existir dados, atualizamos o registro existente
          return this.http.put(`${this.apiUrl}/dadosPessoais/${existingData.id}`, dados);
        } else {
          // Se não existir, criamos um novo registro
          return this.http.post(`${this.apiUrl}/dadosPessoais`, dados);
        }
      }),
      // Flatten o Observable aninhado retornado pelo map
      // @ts-ignore
      concatMap(obs => obs)
    );
  }

  // Método para buscar dados do usuário pelo userId
  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/dadosPessoais?userId=${userId}`).pipe(
      map(response => response && response.length > 0 ? response[0] : null),
      catchError(error => {
        console.error('Erro ao buscar dados de usuário:', error);
        return of(null);
      })
    );
  }
}
