import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { supabase } from '../../supabase.client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements AfterViewInit, OnDestroy {

  @ViewChild('preview', { static: true }) preview!: ElementRef<HTMLVideoElement>;

  reader = new BrowserQRCodeReader();
  controls: any = null;  // <-- important pour stop()
  scanning = true;
  message = '';

  ngAfterViewInit() {
    this.startScanner();
  }

  async startScanner() {
    this.reader
      .decodeFromVideoDevice(
        undefined,
        this.preview.nativeElement,
        async (result, err, controls) => {

          // enregistrer les contrôles si pas déjà fait
          if (controls && !this.controls) {
            this.controls = controls;
          }

          if (result && this.scanning) {
            this.scanning = false; // Bloquer les scans multiples

            const text = result.getText();
            const token = this.extractToken(text);

            if (!token) {
              this.message = "⚠️ QR code invalide";
              return;
            }

            await this.markAsUsed(token);
          }
        }
      )
      .catch((err) => console.error("Erreur scanner :", err));
  }

  extractToken(url: string): string | null {
    try {
      const params = new URL(url).searchParams;
      return params.get('token');
    } catch {
      return null; // si pas une vraie URL
    }
  }

  async markAsUsed(token: string) {
    // Vérifier si le token existe
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !data) {
      this.message = "❌ Token introuvable";
      return;
    }

    if (data.used) {
      this.message = "⚠️ Ce QR code a déjà été utilisé !";
      return;
    }

    // Mettre à jour l'invité
    const { error: updateError } = await supabase
      .from('invites')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token);

    if (updateError) {
      this.message = "❌ Erreur lors de la validation";
      return;
    }

    this.message = "✅ Entrée validée : " + data.pseudo;
  }

  ngOnDestroy() {
    if (this.controls) {
      this.controls.stop();  // <-- la SEULE bonne méthode
    }
  }

  restartScanner() {
  this.message = "";
  this.scanning = true;
  this.startScanner();
}

}
