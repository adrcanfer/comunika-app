import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Account } from 'src/app/model/account.model';
import { S3FileContent } from 'src/app/model/s3-file-content.model';
import { Transaction } from 'src/app/model/transaction.model';
import { UploadFileResponse } from 'src/app/model/upload-file-response.model';
import { AlertService } from 'src/app/services/alert.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FileService } from 'src/app/services/file.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { getPlanDetail, PlanDetail } from 'src/app/utils/plans';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements ViewWillEnter {

  account?: Account;
  planDetail?: PlanDetail;
  subscriptorsProgress: number = 0;
  notificationsProgress: number = 0;
  transactions?: Transaction[];
  constructor(
    private sourceService: SourceService,
    private spinnerService: SpinnerService,
    private alertService: AlertService,
    private dialogService: DialogService,
    private fileService: FileService,
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.getAccount();
    this.getTransactions();
  }

  getPlan() {
    return this.planDetail?.name;
  }

  getSubscriptorsProgress() {
    if(this.planDetail!.subscriptions != 'Ilimitado') {
      this.subscriptorsProgress = this.account!.subscriptors / this.planDetail!.subscriptions!;
    }
  }

  getNotificationsProgress() {
    if(this.planDetail!.notifications != 'Ilimitado') {
      this.notificationsProgress = this.account!.events / this.planDetail!.notifications;
    }
  }

  getTransactions() {
    this.spinnerService.showSpinner();
    this.paymentService.getTransactions()
      .then(data => this.transactions = data.transactions)
      .catch(e => console.error(e))
      .finally(() => this.spinnerService.closeSpinner());
  }

  async editName() {
    const content = await this.dialogService.openTextDialog("Nombre de la cuenta", this.account!.source.name);

    if (content !== null && content!.length > 3 && this.account!.source.name != content) {
      this.spinnerService.showSpinner();
      this.account!.source.name = content!;

      this.sourceService.putSource(this.account?.source!)
        .catch(e => console.error(e))
        .finally(() => {
          this.spinnerService.closeSpinner(); 
        });      
    }
  }

  editPicture(event: any) {
    const selectedFiles: any[] = event.target.files;
    const selectedFile: any = selectedFiles.length == 1 ? event.target.files[0] : undefined;

    if(selectedFile) {
      // Leemos el fichero
      const reader = new FileReader();

      reader.onloadend = () => {
        const uploadFileRequest: S3FileContent = {
          name: selectedFile.name,
          content: reader.result as string,
          contentType: selectedFile.type
        }

        //Subimos el fichero
        this.uploadFile(uploadFileRequest);
      }

      reader.readAsDataURL(selectedFile);
    }

  }

  updatePlan() {
    this.router.navigateByUrl("/web/select-plan/" + this.planDetail!.id);
  }

  openPortalSession() {
    this.spinnerService.showSpinner();
    this.paymentService.getPortalSessionUrl()
      .then((d) => window.open(d.sessionUrl, '_self'))
      .catch(e => console.error(e))
      .finally(() => this.spinnerService.closeSpinner());
  }

  downloadInvoice(url: string) {
    window.open(url, '_blank')
  }

  private getAccount() {
    this.spinnerService.showSpinner();
    this.sourceService.getAccount()
      .then((account: Account) => {
        this.account = account;
        this.planDetail = getPlanDetail(this.account?.source.plan!);
        this.getNotificationsProgress();
        this.getSubscriptorsProgress();
      }).catch(err => {
        console.error(err);
        this.alertService.showAlert("Error", "Se ha producido un error recuperando la información. Inténtelo de nuevo más tarde");
      }).finally(() => this.spinnerService.closeSpinner());
  }

  private uploadFile(uploadFileRequest: S3FileContent) {
    this.spinnerService.showSpinner();
    this.fileService.uploadFile(uploadFileRequest).then(
      (data: UploadFileResponse) => {
        const url = data.url;

        const oldIcon = this.account!.source.icon;
        //Guardamos la imagen del source
        this.updateSourcePicture(url);

        if(oldIcon) {
          this.deleteFile(oldIcon);
        }

      }).catch(e => {
        console.error(e);
        this.alertService.showAlert("Error", "Se ha producido un error subiendo la imagen. Inténtelo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());
  }

  private updateSourcePicture(url: string) {
    this.spinnerService.showSpinner();

    this.account!.source.icon = url;
    this.sourceService.putSource(this.account?.source!)
        .catch(e => console.error(e))
        .finally(() => {
          this.spinnerService.closeSpinner(); 
        }); 
  } 

  private async deleteFile(url: string) {
    const urlParts = url.split('/');
    const key = urlParts[urlParts.length - 1];

    this.spinnerService.showSpinner();
    this.fileService.deleteFile(key).then(() => {
      
    }).catch(e => {
      console.error(e);
    }).finally(() => this.spinnerService.closeSpinner());
  }

  

}
