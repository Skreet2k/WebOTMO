import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ChartCollectionProviderService, Tab } from "../chartTabCollectionProvider.service";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { ModifyFormulaDialog } from "../modifyFormulaDialog/modifyFormulaDialog.component";
import * as _ from "lodash";

@Component({
    selector: "chart-sidebar",
    templateUrl: "./chartSidebar.component.html"
})
export class ChartSidebarComponent implements OnChanges {  
    @Input() activeTab: Tab;

    public buttons: FormulaButton[];

    constructor(
        private readonly chartTabCollectionProviderService: ChartCollectionProviderService,
        private readonly modal: Modal) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["activeTab"] != null) {
            this.buttons = [];
            if (this.activeTab != null) {
                _.forEach(this.activeTab.data, (dataEntry) => {
                    this.buttons.push({ title: dataEntry.label, id: dataEntry.id });
                });
            }
        }
    }

    public toggleFormulaVisibility(entry: FormulaButton) {
        const formulaToChange = _.find(this.activeTab.data, dataEntry => dataEntry.id === entry.id);
        if (formulaToChange != null) {
            formulaToChange.hidden = !formulaToChange.hidden;
            this.chartTabCollectionProviderService.notifyActiveTabContentChanged();
        }
    }

    public removeFormula(entry: FormulaButton) {
        _.remove(this.buttons, button => button.id === entry.id);
        this.chartTabCollectionProviderService.removeActiveFormula(entry.id);
    }

    public editFormula(entry: FormulaButton) {
    }

    public addFormula() {
        const dialog = this.modal.open(ModifyFormulaDialog, overlayConfigFactory({}, BSModalContext));

        dialog.result.then(resultPromise => {
            return resultPromise.result
              .then(
                 result => console.log('confirm', result),
                 () => console.log('decline', 'result')
              );
          });
    }
}

export type FormulaButton = {
    title: string,
    id: string
}