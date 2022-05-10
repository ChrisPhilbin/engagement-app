import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MenubarModule,
    InputTextModule,
    ButtonModule,
    PanelModule,
    CalendarModule,
    CardModule,
    ToggleButtonModule,
    OverlayPanelModule,
    FieldsetModule,
    ChipModule,
    ToastModule,
    AngularEditorModule,
  ],
})
export class SharedModule {}
