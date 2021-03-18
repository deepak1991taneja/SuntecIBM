import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSettingComponent } from './components/app-setting/app-setting.component';
import { BuildingManagementComponent } from './components/app-setting/building-management/building-management.component';
import { CompanyManagementComponent } from './components/app-setting/company-management/company-management.component';
import { DoorManagementComponent } from './components/app-setting/door-management/door-management.component';
import { FloorManagementComponent } from './components/app-setting/floor-management/floor-management.component';
import { FrTabletComponent } from './components/app-setting/fr-tablet/fr-tablet.component';
import { SettingDashboardComponent } from './components/app-setting/setting-dashboard/setting-dashboard.component';
import { AcsServerSettingComponent } from './components/app-setting/setting-management/acs-server-setting/acs-server-setting.component';
import { AddPersonComponent } from './components/dashboard/add-person/add-person.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NevigationComponent } from './components/navigation/nevigation.component';
import { SelectAppComponent } from './components/select-app/select-app.component';


const routes: Routes = [
  {path:'' , component:LoginComponent},
  
  {path:'app-select',
    component: SelectAppComponent,},

  {path:'navigation' ,
   component:NevigationComponent,
   children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard',
    },
    {
      path:'dashboard' , 
      component:DashboardComponent
  },
  {
    path:'add-person' , 
    component:AddPersonComponent
}
   ]
  },

  /// setting screen
  {path:'app-setting' ,
  component:AppSettingComponent,
  children: [
   {
     path: '',
     pathMatch: 'full',
     redirectTo: 'dashboard',
   },
   {
     path:'dashboard' , 
     component:SettingDashboardComponent
 },
 {
   path:'building-management' , 
   component:BuildingManagementComponent
},
{
  path:'floor-management' , 
  component:FloorManagementComponent
},
{
  path:'fr-tablet' , 
  component:FrTabletComponent
},
{
  path:'door-management' , 
  component:DoorManagementComponent
},
{
  path:'company-management' , 
  component:CompanyManagementComponent

},
{
  path:'acs-server' , 
  component:AcsServerSettingComponent

}
  ]
 },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
