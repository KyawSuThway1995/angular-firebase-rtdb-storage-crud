import { UserRoutingModule } from './user-routing.module';
import { NgModule } from '@angular/core';
import { ShareModule } from './../common/modules/share.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserService } from './user.service';
import { NgControl } from '@angular/forms';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent
  ],
  imports: [
    ShareModule,
    UserRoutingModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
