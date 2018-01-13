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
        if (this.model.clickable && !item.disabled) {
            item.onClickAction();
            if (this.model.selectable) {
                _.forEach(this.model.items, item => {
                    item.active = false
                });
                item.active = true;
            }
        }
    }

    public getItemCssClasses(item: ListItem) {
        if (item.disabled) {
            return "disabled";
        }
        return (this.model.clickable ? "list-group-item-action " : "") 
            + (item.active ? "active" : "");
    }
}

export class ListModel {
    constructor(
        public title: string,
        public items: ListItem[],
        public loading = false,
        public selectable = false,
        public clickable = true,
    ) {
    }
}

export class ListItem {
    constructor(
        public name: string,
        public description?: string, 
        public onClickAction?: Function,
        public active = false,
        public disabled = false
    ) {
    }
}