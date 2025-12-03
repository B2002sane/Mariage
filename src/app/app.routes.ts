import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { QrcodeComponent } from './pages/qrcode/qrcode.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'qrcode', component: QrcodeComponent }
];
