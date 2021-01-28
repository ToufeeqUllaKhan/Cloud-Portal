import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: "child-cell",
  template: `
  <span>
  <button type="button" class="btn btn-primary btn-edit btn-download" (click)="invokeParentMethod()"><i class="fa fa-download" aria-hidden="true"></i></button>
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
export class CodesetDownloadCellRenderer implements ICellRendererAngularComp {

  Actions: boolean = false; role: any;

  public params: any;

  agInit(params: any): void {
    this.role = localStorage.getItem('AccessRole');
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

  public invokeParentMethod() {
    this.params.context.componentParent.methodFromParent_downloadcodeset(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}
