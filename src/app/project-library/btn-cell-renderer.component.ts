import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: "child-cell",
  template: `
  <span>
  <button class="btn" type="button" style="cursor:pointer;background:none;border:none;" [hidden]="!showbutton" (click)="invokeParentMethod()">&nbsp;&nbsp;<u><strong>Edit</strong></u></button>
  <button class="btn" type="button" style="cursor:pointer;background:none;border:none;" (click)="invokeParentMethod_unlink()">&nbsp;&nbsp;<u><strong>Unlink</strong></u></button>
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
  }

  invokeParentMethod() {
    this.params.context.componentParent.methodFromParent_edit(this.params.node.data);
  }

  invokeParentMethod_unlink() {
    this.params.context.componentParent.methodFromParent_unlink(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}
