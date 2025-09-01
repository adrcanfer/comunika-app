import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loginError?: string;

  constructor(
    private spinnerService: SpinnerService,
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    
  }

  login() {
    if (this.form.valid) {
      this.spinnerService.showSpinner();

      this.firebaseService.login(this.form.value['email'].trim(), this.form.value['password'].trim())
        .then(async (res) => {
          this.form.get('email')!.reset();
          this.form.get('password')!.reset();
  
          this.loginError = undefined;
          this.router.navigateByUrl('web/my-events');
        })
        .catch(async (res) => {
          this.loginError = this.translateAuthError(res.code);
          this.form.get('password')!.reset();
        }).finally(() => this.spinnerService.closeSpinner());
    } else {
      this.form.markAllAsTouched();
    }
  }

  private translateAuthError(code: string) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Usuario o contraseña inválida';
      case 'auth/user-disabled':
        return 'La cuenta se encuentra deshabilitada';
      default:
        return code;
    }
  }

}
