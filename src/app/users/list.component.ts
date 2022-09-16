import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ClienteService } from '../_services';
import { Cliente } from '../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  clientes!: Cliente[];

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.clienteService
      .getAll()
      .pipe(first())
      .subscribe((clientes) => (this.clientes = clientes));
  }

  deleteUser(id: string) {
    const user = this.clientes.find((x) => x.id === id);
    if (!user) return;
    user.isDeleting = true;
    this.clienteService
      .delete(id)
      .pipe(first())
      .subscribe(
        () => (this.clientes = this.clientes.filter((x) => x.id !== id))
      );
  }
}
