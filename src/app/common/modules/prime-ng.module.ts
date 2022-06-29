import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    DropdownModule,
    RadioButtonModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    MenuModule
  ],
  exports: [
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    DropdownModule,
    RadioButtonModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    MenuModule
  ]
})
export class PrimeNgModule { }
