import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './guards/can-activate.guard';
import { HomeComponent } from './main/home/home.component';
import { TreeComponent } from './main/tree/tree.component'


const homeChildrens: Routes = [{
  path: 'tree/:id/:memberId', component: TreeComponent, canActivate: [CanActivateGuard]
}]
const routes: Routes = [
  {path: '', component: HomeComponent, children: homeChildrens}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
