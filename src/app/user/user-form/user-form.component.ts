import { WorkExperience } from './../user.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/common/services/storage.service';
import { catchError, finalize, switchMap, tap, map, EMPTY } from 'rxjs';
import { DateUtil, MessageUtil, ResponseHandler } from 'src/app/common/models/common-util.model';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { uuidv4 } from '@firebase/util';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  img!: any;
  userId: string = '';
  isSaving = false;

  genders = ['Male', 'Female', 'Other'];
  educations = [
    { label: 'B.C.Sc', value: 'B.C.Sc' },
    { label: 'M.Sc', value: 'M.Sc' },
    { label: 'Ph.D', value: 'Ph.D' }
  ];
  hobbies = ['Reading', 'Swimming', 'Football', 'Movie', 'Music', 'Art'];

  constructor(
    private location: Location,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    private readonly messageSrv: MessageService,
    private readonly confirmSrv: ConfirmationService,
    private readonly storageSrv: StorageService,
    private readonly userSrv: UserService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      map(params => {
        this.userId = params['id'];
        if (this.userId) {
          return this.userSrv.findIdByUser(this.userId).then(data => this.initializeForm(data));
        }
        this.initializeForm();
        return EMPTY;
      }),
      catchError(error => ResponseHandler.errorHandler(this.messageSrv, error)),
    ).subscribe();
  }

  get profileImage() {
    return this.userForm.get('profileImage')?.value;
  }

  get hobbyControl(): FormControl {
    return this.userForm.get('hobbies') as FormControl;
  }

  get experiences(): FormArray {
    return this.userForm.get('experiences') as FormArray;
  }

  get disabledSaveBtn(): boolean {
    return this.userForm.invalid || this.isSaving;
  }

  addExperience() {
    this.experiences.push(this.initializeWorkExperience());
  }

  removeExperience(index: number) {
    this.confirmSrv.confirm({
      key: 'deleteConfirm',
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.experiences.removeAt(index);
        this.messageSrv.add({ severity: 'success', summary: 'Success', detail: 'Record removed from list. But you need to click save button to actually record remove.' });
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

  selectedFile($event: any) {
    const file = $event.target.files[0];
    if (file) {
      this.userForm.get('profileImageFile')?.setValue(file);
      this.userForm.get('profileImage')?.setValue(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)));
    }

  }

  save() {
    this.isSaving = true;
    const formValue = { ...this.userForm.value };
    const uuid = uuidv4();
    if (!formValue.id) formValue.id = uuid;

    this.storageSrv.uploadImage(formValue.profileImageFile, uuid).pipe(
      switchMap(profileUrl => {
        if (profileUrl || formValue.profileImageFile === null) formValue.profileImage = profileUrl;
        delete formValue.profileImageFile;

        const dob = formValue.dob;
        if (dob) { formValue.dob = DateUtil.covertDateToString(dob) }

        formValue.experiences.forEach((exp: any) => {
          const [startDate, endDate] = exp.duration;
          let dateStr;
          if (startDate) dateStr = DateUtil.covertDateToString(startDate);
          if (endDate) dateStr = `${dateStr},${DateUtil.covertDateToString(endDate)}`;
          exp.duration = dateStr;
        })

        return this.userSrv.saveUser(formValue);
      }),
      tap(() => {
        MessageUtil.sendMessage('Saved successfully');
        this.location.back();
      }),
      catchError(error => ResponseHandler.errorHandler(this.messageSrv, error)),
      finalize(() => this.isSaving = false)
    ).subscribe();
  }

  private initializeForm(initData?: User) {
    let dob: any = initData?.dob;
    if (dob) dob = DateUtil.covertStringToDate(dob);
    this.userForm = this.fb.group({
      id: initData?.id,
      name: [initData?.name, Validators.required],
      gender: [initData?.gender, Validators.required],
      dob: [dob, Validators.required],
      email: initData?.email,
      address: initData?.address,
      hobbies: [initData?.hobbies],
      education: [initData?.education, Validators.required],
      profileImage: initData?.profileImage,
      profileImageFile: '',
      experiences: this.fb.array(initData?.experiences?.map(exp => this.initializeWorkExperience(exp)) || [])
    })
  }

  private initializeWorkExperience(initData?: WorkExperience) {
    const duration = initData?.duration;
    let dateRange = [];
    if (duration) {
      const [startDate, endDate] = duration.split(',');
      if (startDate) dateRange[0] = DateUtil.covertStringToDate(startDate);
      if (endDate) dateRange[1] = DateUtil.covertStringToDate(endDate);
    }
    return this.fb.group({
      duration: [dateRange, Validators.required],
      description: [initData?.description, Validators.required]
    })
  }
}
