import { Component, AfterViewChecked } from '@angular/core';
import { supabase } from '../../supabase.client';
import QRCode from 'qrcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements AfterViewChecked {


    invites: any[] = [];
    private qrcodesGenerated = false;
  
    constructor() {
      this.loadInvites();
    }
  
    async loadInvites() {
      const { data, error } = await supabase.from('invites').select('*');
      if (error) { console.error(error); return; }
      this.invites = data;
    }
  
    ngAfterViewChecked() {
      // Attendre que invites soit chargé et que les canvas soient rendus
      if (this.invites.length && !this.qrcodesGenerated) {
  
        this.invites.forEach(invite => {
          const canvas = document.getElementById('canvas' + invite.invite_number);
  
          if (canvas) {
            QRCode.toCanvas(
              canvas,
              `https://mouhamed-aminata.netlify.app/invite?token=${invite.token}`,
              { width: 150 },
              (err) => { if (err) console.error(err); }
            );
          }
        });
  
        this.qrcodesGenerated = true; // éviter de générer plusieurs fois
      }
    }

}
