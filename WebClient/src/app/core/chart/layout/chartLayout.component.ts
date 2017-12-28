import { Component } from "@angular/core";
import { ChartTabCollectionProviderService } from "../chartTabCollectionProvider.service";

@Component({
    selector: "chart-layout",
    templateUrl: "./chartLayout.component.html"
})
export class ChartLayoutComponent {
    constructor(private readonly chartTabCollectionProviderService: ChartTabCollectionProviderService) {
    }

    public get activeTab() {
        return this.chartTabCollectionProviderService.getActiveTab();
    }

    public isTabCollectionEmpty(): boolean {
        return this.activeTab == null
    }
}