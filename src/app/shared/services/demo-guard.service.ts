import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DemoGuardService {

  constructor(private alertController: AlertController) { }

  /**
   * Shows a warning popup indicating the feature is not available in demo mode.
   * Call this method from any component to block demo-restricted functionality.
   */
  async showDemoWarning(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Demo Version',
      message: 'This feature is not available for demos',
      cssClass: 'demo-warning-alert',
      buttons: ['OK']
    });

    await alert.present();
  }
}
