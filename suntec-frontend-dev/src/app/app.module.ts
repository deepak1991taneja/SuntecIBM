import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTableExporterModule } from 'mat-table-exporter';
import 'hammerjs';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {  MatSidenavModule } from  '@angular/material/sidenav';
import {  MatListModule } from  '@angular/material/list';
import { NevigationComponent } from './components/navigation/nevigation.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AddPersonComponent } from './components/dashboard/add-person/add-person.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SelectAppComponent } from './components/select-app/select-app.component';
import { MaterialElevationDirective } from './components/select-app/material-elevation.directive';
import { AppSettingComponent } from './components/app-setting/app-setting.component';
import { AccountDialogComponent, SettingDashboardComponent } from './components/app-setting/setting-dashboard/setting-dashboard.component';
import { BuildingDialogComponent, BuildingManagementComponent } from './components/app-setting/building-management/building-management.component';
import { FloorDialogComponent, FloorManagementComponent } from './components/app-setting/floor-management/floor-management.component';
import {FrTabletDialogComponent, FrTabletComponent } from './components/app-setting/fr-tablet/fr-tablet.component';
@NgModule({
  declarations: [ 
    AppComponent,
    LoginComponent,
    SignUpComponent,
    DashboardComponent,
    NevigationComponent,
    AddPersonComponent,
    SelectAppComponent,
    MaterialElevationDirective,
    AppSettingComponent,
    SettingDashboardComponent,
    AccountDialogComponent,
    BuildingManagementComponent,
    BuildingDialogComponent,
    FloorManagementComponent,
    FloorDialogComponent,
    FrTabletComponent,
    FrTabletDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MaterialFileInputModule,
    MatGridListModule,
    MatMenuModule,
    MatSelectModule,
    LayoutModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatTableExporterModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
