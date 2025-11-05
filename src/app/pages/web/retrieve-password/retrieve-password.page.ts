import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-retrieve-password',
  templateUrl: './retrieve-password.page.html',
  styleUrls: ['./retrieve-password.page.scss'],
  standalone: false
})
export class RetrievePasswordPage implements ViewWillEnter {

  form: FormGroup;
  error?: string;
  showExplanationMessage: boolean = false;

  constructor(
    private spinnerService: SpinnerService,
    private firebaseService: FirebaseService
  ) { 
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  
  ionViewWillEnter(): void {
    this.form.reset();
  }

  async retrieve() {
    if(this.form.valid) {
          this.spinnerService.showSpinner();

          this.firebaseService.retrieve(this.form.value['email'].trim())
            .then(() => {
              this.showExplanationMessage = true;
            })
            .catch(async (res) => {
              this.error = this.translateAuthError(res.code);
            })
            .finally(() => this.spinnerService.closeSpinner());
    
        } else {
          this.form.markAllAsTouched();
        }
  }

  private translateAuthError(code: string) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'El correo no ha sido encontrado';
      case 'auth/user-disabled':
        return 'La cuenta se encuentra deshabilitada';
      default:
        return "Se ha producido un error: " + code;
    }
  }

}
