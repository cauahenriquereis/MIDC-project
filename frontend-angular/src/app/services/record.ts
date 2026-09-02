import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroCreate {
  nome: string;
  departamento: string;
  data_referencia: string;
  quantidade_entregas: number;
  observacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private apiUrl = 'http://localhost:8001/records';

  constructor(private http: HttpClient) { }

  criarRegistro(data: RegistroCreate): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}