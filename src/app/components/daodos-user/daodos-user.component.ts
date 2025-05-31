// dados-pessoais.component.ts
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DadosPessoaisService } from '../../services/dados-pessoais.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dados-pessoais',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './daodos-user.component.html',
  styleUrls: ['./daodos-user.component.scss']
})
export class DadosPessoaisComponent implements OnInit {
  dadosForm: FormGroup;
  dadosSalvos: any = null;
  mensagem = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dadosService: DadosPessoaisService,
    private authService: AuthService
  ) {
    this.dadosForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      ddd: ['', Validators.required],
      telefone: ['', Validators.required],
      dia: ['', Validators.required],
      mes: ['', Validators.required],
      ano: ['', Validators.required],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['']
    });
  }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(): void {
    // Verificar se o usuário está logado
    if (!this.authService.currentUser?.id) {
      this.mensagem = 'Usuário não está logado';
      return;
    }

    this.isLoading = true;

    // Buscar dados do usuário pelo ID
    this.dadosService.getUserDetails(this.authService.currentUser.id).subscribe({
      next: (dados) => {
        if (dados) {
          this.preencherFormulario(dados);
          this.dadosSalvos = dados;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário', err);
        this.mensagem = 'Erro ao carregar dados do usuário';
        this.isLoading = false;
      }
    });
  }

  preencherFormulario(dados: any): void {
    // Extrair DDD e telefone do formato "(XX) XXXXXXXX"
    let ddd = '';
    let telefone = '';

    if (dados.telefone) {
      const telMatch = dados.telefone.match(/\((\d{2})\)\s*(\d+)/);
      if (telMatch) {
        ddd = telMatch[1];
        telefone = telMatch[2];
      }
    }

    // Extrair dia, mês e ano do formato "DD/MM/AAAA"
    let dia = '';
    let mes = '';
    let ano = '';

    if (dados.dataNascimento) {
      const dataMatch = dados.dataNascimento.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (dataMatch) {
        dia = dataMatch[1];
        mes = dataMatch[2];
        ano = dataMatch[3];
      }
    }

    // Atualizar o formulário com os dados existentes
    this.dadosForm.patchValue({
      nome: dados.nome || '',
      cpf: dados.cpf || '',
      ddd: ddd,
      telefone: telefone,
      dia: dia,
      mes: mes,
      ano: ano,
      cep: dados.cep || '',
      rua: dados.rua || '',
      numero: dados.numero || '',
      complemento: dados.complemento || ''
    });
  }

  onSubmit() {
    if (!this.authService.currentUser?.id) {
      this.mensagem = 'Usuário não está logado';
      return;
    }

    const form = this.dadosForm.value;
    const dados = {
      userId: this.authService.currentUser.id,
      nome: form.nome,
      cpf: form.cpf,
      telefone: `(${form.ddd}) ${form.telefone}`,
      dataNascimento: `${form.dia}/${form.mes}/${form.ano}`,
      cep: form.cep,
      rua: form.rua,
      numero: form.numero,
      complemento: form.complemento
    };

    this.dadosService.saveUserDetails(dados).subscribe({
      next: (res) => {
        this.dadosSalvos = res;
        this.mensagem = 'Dados salvos com sucesso!';
      },
      error: () => {
        this.mensagem = 'Erro ao salvar os dados';
      }
    });
  }
}
