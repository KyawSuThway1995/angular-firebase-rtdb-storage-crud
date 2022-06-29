import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserFormComponent } from "./user-form/user-form.component";
import { UserListComponent } from "./user-list/user-list.component";

const routes: Routes = [
    { path: '', component: UserListComponent, data: { title: 'User Management' } },
    { path: 'user-form', component: UserFormComponent, data: { title: 'User Form' }}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }