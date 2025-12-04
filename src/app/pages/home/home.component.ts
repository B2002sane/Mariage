import { Component, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import QRCode from 'qrcode';
import { CommonModule } from '@angular/common';
import { supabase } from '../../supabase.client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewChecked {

  token: string | null = null;
  inviteData: any = null;
  private qrGenerated = false;

  constructor(private route: ActivatedRoute) {
    // Récupérer le token depuis l'URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.loadInvite();
    }
  }

  async loadInvite() {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('token', this.token)
      .single(); // récupère un seul enregistrement

    if (error) {
      console.error('Erreur Supabase :', error);
      return;
    }

    this.inviteData = data;
  }

  ngAfterViewChecked() {
    // Générer le QR code après que le canvas soit rendu
    if (this.inviteData && !this.qrGenerated) {
      const canvas = document.getElementById('inviteCanvas');
      if (canvas) {
        QRCode.toCanvas(
          canvas,
          `https://mouhamed-aminata.netlify.app/invite?token=${this.token}`,
          { width: 400 },
          (err) => { if (err) console.error(err); }
        );
        this.qrGenerated = true;
      }
    }
  }
}
