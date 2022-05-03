import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
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
        path: 'treasury',
        loadChildren: () => import('../pages/treasury/treasury.module').then(m => m.TreasuryPageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../pages/stats/stats.module').then(m => m.StatsModule)
      },
      {
        path: 'options',
        loadChildren: () => import('../pages/options/options.module').then(m => m.OptionsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
