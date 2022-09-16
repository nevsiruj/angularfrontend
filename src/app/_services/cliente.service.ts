import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Cliente } from '../_models';

// const baseUrl = `${environment.apiUrl}/clientes`;
const _baseUrl = `https://localhost:7136/api/Clientes`;

@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Cliente[]>(_baseUrl);
  }

  getById(id: string) {
    return this.http.get<Cliente>(`${_baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(_baseUrl, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${_baseUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${_baseUrl}/${id}`);
  }
}
