import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: "child-cell",
  template: `
  <span>
  <button class="btn" type="button" style="cursor:pointer;background:none;border:none;" [hidden]="!showbutton"  (click)="invokeParentMethod()">&nbsp;&nbsp;<u><strong>Edit</strong></u></button>
  <span>
  `,
  styles: [
    `
      .btn {
        line-height: 0.5;
      }
    `,
  ]
})
export class BtnCellRenderer implements ICellRendererAngularComp {

  showbutton: boolean = true; status: any;
  public params: any;
  agInit(params: any): void {
    this.params = params;
    if (this.params.value === 'Not Exported to Staging') {
      this.showbutton = true;
    }
    else if (this.params.value === 'Exported to Staging') {
      this.showbutton = false;
    }

  }

  invokeParentMethod() {
    this.params.context.componentParent.methodFromParent(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}
