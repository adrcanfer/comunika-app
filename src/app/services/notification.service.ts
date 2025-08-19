import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { PermissionStatus, PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { PreferenceConstants } from '../utils/preferences.util';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private router: Router
  ) { }

  // Método encargado de gestionar los permisos y recuperar el token de Firebase
  async init() {
    //Comprobamos los permisos
    let permissionStatus: PermissionStatus = await PushNotifications.checkPermissions();

    if (permissionStatus.receive == "prompt") {
      permissionStatus = await PushNotifications.requestPermissions();
    }

    if (permissionStatus.receive == "denied") {
      console.error("No se ha permitido las notificaciones push");
      return;
    }

    if (permissionStatus.receive == "granted") {
      this.loadListeners();
      PushNotifications.register();
    }
  }

  // Método encargado de recuperar el token guardado en las preferencias
  async getSavedToken() {
    //Recupermos el token de las preferencias
    const { value } = await Preferences.get({ key: PreferenceConstants.pushToken });

    return value;
  }

  // Método auxiliar encargado de escuchar los listener de Firebase
  private async loadListeners() {
    await PushNotifications.addListener('registration', async (token: any) => {
      console.info('Registration token: ', token.value);
      await this.saveToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err: any) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', async (data: any) => {
      console.log("NOTIFICATION RECEIVED");
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', async (data: any) => {
      const sourceId = data.notification.data.sourceId;
      const eventId = data.notification.data.eventId;
      console.log("NOTIFICATION OPENED: " + eventId);
      this.router.navigateByUrl('/mobile/event/' + eventId);
    });
  }

  // Método para almacenar el token de Firebases
  private async saveToken(token: string) {
    await Preferences.set({ key: PreferenceConstants.pushToken, value: token });
  }

}
