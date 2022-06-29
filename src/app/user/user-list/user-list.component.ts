import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Observable, tap, fromEvent, firstValueFrom, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MessageUtil, ResponseHandler } from 'src/app/common/models/common-util.model';
import { StorageService } from 'src/app/common/services/storage.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, AfterViewInit {
  users$!: Observable<Array<User>>;
  actionMenu: Array<MenuItem> = [];
  editUser!: User;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageSrv: MessageService,
    private readonly confirmSrv: ConfirmationService,
    private readonly userSrv: UserService,
    private readonly storageSrv: StorageService
  ) { }

  ngOnInit(): void {
    this.actionMenu = [
      {
        label: 'Edit',
        command: _ => this.router.navigate(['user-form'], { relativeTo: this.route, queryParams: { id: this.editUser.id } })
      },
      {
        label: 'Delete',
        command: _ => this.deleteUser()
      },
    ];
    this.loadData();
  }

  ngAfterViewInit(): void {
    firstValueFrom(MessageUtil.message$).then(message => {
      if (message) {
        this.messageSrv.add({ severity: 'success', summary: 'Success', detail: message });
        MessageUtil.sendMessage(null);
      }
    });
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map(() => this.searchInput.nativeElement.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(value => this.users$ = this.userSrv.searchByName(value))
    ).subscribe();
  }

  private deleteUser() {
    this.confirmSrv.confirm({
      key: 'deleteConfirm',
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userSrv.deleteById(this.editUser.id).catch(error => ResponseHandler.errorHandler(this.messageSrv, error))
          .then(() => this.storageSrv.deleteImage(this.editUser.id)).catch(error => ResponseHandler.errorHandler(this.messageSrv, error)).catch(error => ResponseHandler.errorHandler(this.messageSrv, error))
          .then(() => {
            this.loadData();
            this.messageSrv.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully' })
          })
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageSrv.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageSrv.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  private loadData() {
    this.users$ = this.userSrv.fetchAllUser();
  }
}
