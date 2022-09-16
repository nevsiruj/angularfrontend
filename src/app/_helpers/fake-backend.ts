import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const usersKey = 'angular-11-crud-example-users';
const usersJSON = localStorage.getItem(usersKey);
let clientes: any[] = usersJSON
  ? JSON.parse(usersJSON)
  : [
      {
        id: 1,
        nombre: 'Joe',
        apellido: 'Bloggs',
      },
    ];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/clientes') && method === 'GET':
          return getClientes();
        case url.match(/\/clientes\/\d+$/) && method === 'GET':
          return getClienteById();
        case url.endsWith('/clientes') && method === 'POST':
          return crearCliente();
        case url.match(/\/clientes\/\d+$/) && method === 'PUT':
          return updateCliente();
        case url.match(/\/clientes\/\d+$/) && method === 'DELETE':
          return deleteCliente();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function getClientes() {
      return ok(clientes.map((x) => basicDetails(x)));
    }

    function getClienteById() {
      const cliente = clientes.find((x) => x.id === idFromUrl());
      return ok(basicDetails(cliente));
    }

    function crearCliente() {
      const cliente = body;

      cliente.id = newUserId();
      delete cliente.confirmPassword;
      clientes.push(cliente);
      localStorage.setItem(usersKey, JSON.stringify(clientes));

      return ok();
    }

    function updateCliente() {
      let params = body;
      let cliente = clientes.find((x) => x.id === idFromUrl());

      // only update password if entered
      if (!params.password) {
        delete params.password;
      }

      // update and save user
      Object.assign(cliente, params);
      localStorage.setItem(usersKey, JSON.stringify(clientes));

      return ok();
    }

    function deleteCliente() {
      clientes = clientes.filter((x) => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(clientes));
      return ok();
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any) {
      return throwError({ error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function basicDetails(user: any) {
      const { id, title, nombre, apellido, direccion } = user;
      return { id, title, nombre, apellido, direccion };
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function newUserId() {
      return clientes.length ? Math.max(...clientes.map((x) => x.id)) + 1 : 1;
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
