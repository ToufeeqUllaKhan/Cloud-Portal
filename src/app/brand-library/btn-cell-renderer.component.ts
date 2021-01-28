import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: "child-cell",
  template: `
  <span>
  <button class="btn" type="button" style="cursor:pointer;background:none;border:none;" (click)="invokeParentMethod()">&nbsp;&nbsp;<u><strong>Edit</strong></u></button>
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

  Actions: boolean = false; role: any;

  public params: any;

  agInit(params: any): void {
    // this.role = localStorage.getItem('AccessRole');
    // if (this.role === 'Admin') {
    //   this.Actions = true
    //   $('#single_download').show();
    // }
    // else {
    //   this.Actions = false;
    //   $('#single_download').hide();
    // }
    this.params = params;
  }

  invokeParentMethod() {
    this.params.context.componentParent.methodFromParent(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}
