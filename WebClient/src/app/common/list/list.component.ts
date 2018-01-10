import { Component, Input } from "@angular/core";
import * as _ from "lodash";

@Component({
    selector: "list",
    templateUrl: "./list.component.html"
})
export class ListComponent {  
    @Input() model: ListModel;

    constructor() {
    }

    public onItemClicked(item: ListItem) {
        if (this.model.selectable) {
            _.forEach(this.model.items, item => {
                item.active = false
            });
            item.active = true;
        }
        item.onClickAction();
    }
}

export class ListModel {
    constructor(
        public title: string,
        public items: ListItem[],
        public loading = false,
        public selectable = false,
    ) {
    }
}

export interface ListItem {
    name: string,
    description?: string, 
    onClickAction?: Function,
    active?: boolean
}