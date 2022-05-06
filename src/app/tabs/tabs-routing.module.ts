import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SplashPage } from '../pages/splash/splash.page';

const routes: Routes = [
  {
    path: 'splash',
    component: SplashPage
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../pages/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'calculator',
        loadChildren: () => import('../pages/calculator/calculator.module').then(m => m.CalculatorPageModule)
      },
      {
        path: 'treasury',
        loadChildren: () => import('../pages/treasury/treasury.module').then(m => m.TreasuryModule)
      },
      {
        path: 'options',
        loadChildren: () => import('../pages/options/options.module').then(m => m.OptionsPageModule)
      },
      {
        path: '',
        redirectTo: 'splash',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/splash',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
