import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPersonComponent } from './components/dashboard/add-person/add-person.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { NevigationComponent } from './components/navigation/nevigation.component';
import { SelectAppComponent } from './components/select-app/select-app.component';

const routes: Routes = [
  {path:'' , component:LoginComponent},
  
  {path:'selectApp',
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
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
