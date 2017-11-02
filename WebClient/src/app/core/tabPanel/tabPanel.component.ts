import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
 selector: 'tab-panel',
 changeDetection: ChangeDetectionStrategy.OnPush,
 templateUrl: './tabPanel.component.html'
})
export class TabPanelComponent {
    public tabs: Tab[];

    ngOnInit() {
        this.initializeTabs();
    }

    public addNewTab(): void {
        const newTabIndex = this.tabs.length + 1;
        this.tabs.push({
            title: `Dynamic Title ${newTabIndex}`,
            content: `Dynamic content ${newTabIndex}`,
            disabled:false,
            removable:true
        });
    }

    public removeTabHandler(tab: Tab): void {
        this.tabs.splice(this.tabs.length - 1, 0, tab);
    }

    private initializeTabs() {
        this.tabs = [
            { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
            { title: 'Dynamic Title 2', content: 'Dynamic content 2' },
            { title: 'Dynamic Title 3', content: 'Dynamic content 3' }
        ];
        const addNewTab  = { title: "New", content: `New`, onclick: () => this.addNewTab() };
        this.tabs.push(addNewTab);
    }
}

export type Tab = {
    title: string,
    content: string,
    disabled?: boolean,
    removable?: boolean,
    tab?: string,
    onclick?: Function
}