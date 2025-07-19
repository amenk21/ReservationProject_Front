import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { UserListComponent } from './pages/utilisateur/user-list/user-list.component';
import { FilialeListComponent } from './pages/filiale-list/filiale-list.component';
import { CountUpModule } from 'ngx-countup';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
     CountUpModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserListComponent,
    FilialeListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
