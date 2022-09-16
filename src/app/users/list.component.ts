import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '../_services';
import { User } from '../_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    clientes!: User[];

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(clientes => this.clientes = clientes);
    }

    deleteUser(id: string) {
        const user = this.clientes.find(x => x.id === id);
        if (!user) return;
        user.isDeleting = true;
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.clientes = this.clientes.filter(x => x.id !== id));
    }
}