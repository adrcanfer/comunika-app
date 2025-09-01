import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, UserCredential, createUserWithEmailAndPassword, deleteUser, getAuth, indexedDBLocalPersistence, initializeAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app?: FirebaseApp;
  private auth?: Auth;


  constructor() {
    this.loadFirebaseConfig();
  }

  private loadFirebaseConfig() {
    const firebaseConfig = {
      apiKey: "AIzaSyC8aETGRNmVCaESVfe_Q1Ifj1F1lBY2d0Y",
      authDomain: "comunikame-app.firebaseapp.com",
      projectId: "comunikame-app",
      storageBucket: "comunikame-app.firebasestorage.app",
      messagingSenderId: "533384881431",
      appId: "1:533384881431:web:e8d14f8650c48d00b10352"
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.auth = this.loadAuth(this.app);
  }

  private loadAuth(app: FirebaseApp) {
    let auth;
    if (Capacitor.isNativePlatform()) {
      auth = initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
    } else {
      auth = getAuth(app);
    }
    return auth;
  }

  /* Auth */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth!, email, password);
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth!, email, password);
  }

  retrieve(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth!, email);
  }

  logout(): Promise<void> {
    return signOut(this.auth!);
  }

  async getLoggedUser(): Promise<string | undefined> {
    await this.auth!.authStateReady();

    if(this.auth!.currentUser) {
      return this.auth!.currentUser!.getIdToken();
    } else {
      return new Promise((resolve) => resolve(undefined));
    }
  }

  async getLoggedUserId(): Promise<string | undefined> {
    await this.auth!.authStateReady();
  
    if (this.auth!.currentUser) {
      return this.auth!.currentUser.uid;
    } else {
      return undefined;
    }
  }

  async deleteUser() {
    const user = this.auth!.currentUser;
    if (user) {
      await deleteUser(user);
    }
  }

}
