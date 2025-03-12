import { Routes } from '@angular/router';
import {LayoutComponent} from "./layouts/layout/layout.component";
import {DynamicFormComponent} from "./dynamic-form/dynamic-form.component";
import {TestComponent} from "./pages/test/test.component";
import {ListComponent} from "./list/list.component";
import {WorkflowComponent} from "./workflow/workflow.component";

export const routes: Routes = [
  {
    path : '',
    component : LayoutComponent,
    children : [
      {
        path : 'form',
        component : DynamicFormComponent
      },
      {
        path : 'list',
        component : ListComponent
      },
      {
        path : 'Back',
        component : WorkflowComponent
      }
    ]
  }
];
