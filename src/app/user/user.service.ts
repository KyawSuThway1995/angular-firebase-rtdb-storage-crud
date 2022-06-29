import { User, UserResponse } from './user.model';
import { Injectable } from '@angular/core';
import { child, Database, DatabaseReference, equalTo, get, listVal, objectVal, orderByChild, query, ref, remove, update } from '@angular/fire/database';
import { map, Observable, iif, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly dbRef: DatabaseReference;

  constructor(private readonly db: Database) {
    this.dbRef = ref(db);
  }

  saveUser(user: User) {
    const saveValue: any = {};
    saveValue[`users/${user.id}`] = user;
    return update(this.dbRef, saveValue);
  }

  findIdByUser(id: string) {
    return get(child(this.dbRef, `users/${id}`))
      .then(snapshot => {
        const val = snapshot.val();
        if (val) {
          return { id, ...val }
        }
        return val;
      });
  }

  deleteById(id: string) {
    return remove(child(this.dbRef, `users/${id}`));
  }

  fetchAllUser() {
    return objectVal<UserResponse>(child(this.dbRef, 'users')).pipe(this.convertToUserResponse$);
  }

  searchByName(name: string) {
    return name ?
      listVal<UserResponse>(
        query(child(this.dbRef, 'users'), orderByChild('name'), equalTo(name))
        ).pipe(this.convertToUserResponse$) : this.fetchAllUser();
  }

  private convertToUserResponse$(input$: Observable<any>): Observable<Array<User>> {
    return input$.pipe(
      switchMap(resp => iif(() => !!resp, of(resp), of({}))),
      map(resp => Object.keys(resp).map(key => ({ ...resp[key], id: key, })))
    );
  }
}
