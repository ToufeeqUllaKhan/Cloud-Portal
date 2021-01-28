import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: 'child-cell',
  template: `
  <span>
  <button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-remarks" (click)="invokeParentMethod()"><i class="fa fa-eye" aria-hidden="true"></i></button>
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
export class RemarksViewCellRenderer implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  public invokeParentMethod() {
    this.params.context.componentParent.methodFromParent_viewRemarks(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}

