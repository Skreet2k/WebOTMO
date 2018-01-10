import { Component, Input, ViewChild } from "@angular/core";
import { Modal, CloseGuard, ModalComponent, DialogRef } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { NgForm } from "@angular/forms";

@Component({
    selector: "prompt-modal-dialog",
    templateUrl: "./promptDialog.component.html"
})
export class PromptModalDialog implements ModalComponent<BSModalContext> {
    @ViewChild("form") public form: NgForm;
    public readonly context: PromptDialogContext;
    public promptText: string;

    constructor(public dialog: DialogRef<PromptDialogContext>) {
        this.context = dialog.context;
        this.promptText = this.context.promptText;
    }

    public close() {
        this.dialog.dismiss();
    }

    public submit() {
        this.dialog.close(this.promptText); 
    }
    
    public isValid() {
        return this.form.valid;
    }
}

export class PromptDialogContext extends BSModalContext {
    title: string;
    bodyContent: string;
    promptText: string
}