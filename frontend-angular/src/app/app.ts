import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from './services/record'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  form: FormGroup;
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(private fb: FormBuilder, private recordService: RecordService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      data_referencia: ['', [Validators.required]],
      quantidade_entregas: [0, [Validators.required, Validators.min(0)]],
      observacao: ['']
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios corretamente!';
      return;
    }

    this.recordService.criarRegistro(this.form.value).subscribe({
      next: (res) => {
        this.mensagemSucesso = 'Registro cadastrado com sucesso!';
        this.mensagemErro = '';
        this.form.reset({ quantidade_entregas: 0 });
      },
      error: (err) => {
        this.mensagemErro = 'Erro ao enviar os dados para a API.';
        this.mensagemSucesso = '';
      }
    });
  }
}