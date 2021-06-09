import { Component } from "@angular/core";

import { ICellRendererAngularComp } from "@ag-grid-community/angular";
declare let $: any;
@Component({
  selector: "child-cell",
  template: `
  <span>
  <button class="on" style="color:Green;" [hidden]="!ON">Download Flag ON</button>
  <button class="off" style="color:Black;" [hidden]="!OFF">Download Flag OFF</button>
  <span>
  `,
  styles: [
    `
      .on,.off {
        background:none;
        border:none;
        pointer-events:none;
        font-weight:Bold
      }
    `,
  ]
})
export class CheckBoxCellRenderer implements ICellRendererAngularComp {
  ON: boolean = true; OFF: boolean = false;
  public params: any;
  agInit(params: any): void {
    this.params = params;
    if ((this.params.value === 'Download Flag ON')) {
      this.ON = true;
      this.OFF = false;
    }
    else if ((this.params.value === 'Download Flag OFF')) {
      this.ON = false;
      this.OFF = true;
    }

  }

  invokeParentMethod() {
    this.params.context.componentParent.methodFromParent_status_codeset(this.params.node.data);
  }

  refresh(): boolean {
    return false;
  }
}
