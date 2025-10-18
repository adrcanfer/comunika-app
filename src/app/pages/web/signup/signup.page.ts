import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Source } from 'src/app/model/source.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements ViewWillEnter{

  form: FormGroup;
  public: boolean = true;
  loginError?: string;

  constructor(
    private spinnerService: SpinnerService,
    private firebaseService: FirebaseService,
    private sourceService: SourceService,
    private router: Router
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ionViewWillEnter(): void {
    this.form.reset();
    this.form.controls['confirmPassword'].addValidators(this.passwordMatchValidator);
  }

  async signup() {
    if(this.form.valid) {
      this.spinnerService.showSpinner();

      try {
        //Registramos al usuario
        await this.firebaseService.register(this.form.value['email'].trim(), this.form.value['password'].trim());

        //Nos logamos
        await this.firebaseService.login(this.form.value['email'].trim(), this.form.value['password'].trim());
      } catch (e: any) {
        this.loginError = this.translateAuthError(e.code);
        console.error(e);
        this.spinnerService.closeSpinner();
        return;
      }

      //Creamos el source
      const source: Source = {
          name: this.form.controls['name'].value,
          email: this.form.controls['email'].value,
          public: this.public,
      }

      this.sourceService.postSource(source)
        .then(() => {
          this.form.get('name')!.reset();
          this.form.get('email')!.reset();
          this.form.get('password')!.reset();
          this.form.get('confirmPassword')!.reset();
          this.public = true;
  
          this.loginError = undefined;
          this.router.navigateByUrl('web/select-plan');
        }).catch(async (e) => {
          console.error(e); 
          this.loginError="Se ha producido un error. Por favor, inténtelo de nuevo más tarde.";
          await this.firebaseService.deleteUser();
        }).finally(() => this.spinnerService.closeSpinner());
      
    } else {
      this.form.markAllAsTouched();
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null { 
    const form: FormGroup = control.parent as FormGroup; 
    const password = form.controls["password"].value; 
    const confirmPassword = control.value; 
    
    return password && confirmPassword && password !== confirmPassword ? { 'passwordMismatch': true } : null; 
  
  };

  private translateAuthError(code: string) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El correo usado ya se encuentra en uso';
      default:
        return code;
    }
  }
}
