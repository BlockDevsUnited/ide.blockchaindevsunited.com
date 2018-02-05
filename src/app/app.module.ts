import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { CodemirrorModule } from 'ng2-codemirror';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent
  ],
  imports: [
    CodemirrorModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        'path': '',
        'component': IndexComponent
      }
    ]),
    NgxQRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
