import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements ViewWillEnter{

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      public: new FormControl(true, [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ionViewWillEnter(): void {
    this.form.reset();
    this.form.controls['confirmPassword'].addValidators(this.passwordMatchValidator);
  }

  signup() {
    if(this.form.valid) {
      
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
}
