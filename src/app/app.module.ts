import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  // ...existing code...
  imports: [
    // ...existing code...
    HttpClientModule
  ],

  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }
  ]
  // ...existing code...
})
export class AppModule { }