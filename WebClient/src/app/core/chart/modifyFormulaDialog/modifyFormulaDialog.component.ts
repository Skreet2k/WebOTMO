import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Modal, CloseGuard, ModalComponent, DialogRef } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";

@Component({
    selector: "modify-formula-dialog",
    templateUrl: "./modifyFormulaDialog.component.html"
})
export class ModifyFormulaDialog implements CloseGuard, ModalComponent<BSModalContext> {
    private readonly context: BSModalContext;

    constructor(public dialog: DialogRef<BSModalContext>) {
        this.context = dialog.context;
        this.context.dialogClass = 'modal-dialog modal-hg';
        dialog.setCloseGuard(this);
    }

    beforeDismiss(): boolean {
        console.log('before Dismiss');
        return false;
    }

    beforeClose(): boolean {
        console.log('before Close');
        // provisional tweak because .modal-open is not removed from body after modal close
        return false;
    }

    close() {
        this.dialog.close();
    }

    dismiss() {
        this.dialog.dismiss();
    }
}