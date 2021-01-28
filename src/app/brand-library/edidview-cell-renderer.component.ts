import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: 'child-cell',
  template: `
  <span>
  <button type="button" data-toggle="modal" data-target="#edidDataModal" class="btn btn-primary btn-edid btn-edid128" (click)="invokeParentMethod()"><i class="fa fa-eye" aria-hidden="true"></i></button>
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
export class EdidviewCellRenderer implements ICellRendererAngularComp {

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
    this.params.context.componentParent.methodFromParent_viewEdid(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}

