import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector
} from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/components/shared/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private dialogComponentRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  open(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        ConfirmationDialogComponent
      );
      this.dialogComponentRef = factory.create(this.injector);

      this.dialogComponentRef.instance.message = message;
      this.dialogComponentRef.instance.confirm.subscribe((result: boolean) => {
        resolve(result);
        this.close();
      });

      this.appRef.attachView(this.dialogComponentRef.hostView);

      const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    });
  }

  close() {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}
