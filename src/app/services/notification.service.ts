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
    await PushNotifications.addListener('registration', (token: any) => {
      console.info('Registration token: ', token.value);
      this.saveToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err: any) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', async (data: any) => {
      const notification = {
        title: data.data.title,
        content: data.data.content,
        creationDate: data.data.timestamp
      }

      console.log("NOTIFICATION RECEIVED: " + notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', async (data: any) => {
      const notification = {
        title: data.notification.data.title,
        content: data.notification.data.content,
        sendingDate: data.notification.data.timestamp
      }

      console.log("NOTIFICATION RECEIVED: " + notification);

      //TODO this.router.navigateByUrl('notifications');
    });
  }

  // Método para almacenar el token de Firebase
  private async saveToken(token: string) {
    await Preferences.set({ key: PreferenceConstants.pushToken, value: token });
  }

}
