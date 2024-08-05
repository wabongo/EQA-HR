import { NgModule } from '@angular/core';
import { NbAlertModule, NbCardModule, NbIconModule, NbMenuModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    TranslateModule,
    NbCardModule,
    NbAlertModule,
    NbIconModule,
    NbSelectModule,
    SharedModule,
    // NbTabsetModule

    ],
  declarations: [
    PagesComponent,
    HomeComponent,
  ],
})
export class PagesModule {
}
