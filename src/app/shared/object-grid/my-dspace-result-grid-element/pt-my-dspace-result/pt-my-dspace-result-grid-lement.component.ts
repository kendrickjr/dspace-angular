import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { PoolTaskDataService } from '../../../../core/tasks/pool-task-data.service';
import { Router } from '@angular/router';
import { MyDSpaceResultGridElementComponent } from '../my-dspace-result-grid-element.component';

@Component({
  selector: 'ds-pooltask-my-dspace-result-grid-element',
  styleUrls: ['../my-dspace-result-grid-element.component.scss'],
  templateUrl: './pt-my-dspace-result-grid-element.component.html',
})

@renderElementsFor(PoolTaskMyDSpaceResult, ViewMode.Grid)
@renderElementsFor(PoolTask, ViewMode.Grid)
export class PoolTaskMyDSpaceResultGridElementComponent extends MyDSpaceResultGridElementComponent<PoolTaskMyDSpaceResult, PoolTask> {
  public workFlow: Workflowitem;
  public processingClaim = false;
  // public submitter: Eperson;
  // public user: Eperson;

  constructor(// private store: Store<AppState>,
    private ptDataService: PoolTaskDataService,
    private router: Router,
    @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  ngOnInit() {
    this.initItem(this.dso.workflowitem as Observable<RemoteData<Workflowitem[]>>);
  }

  initItem(wfiObs: Observable<RemoteData<Workflowitem[]>>) {
    wfiObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.workFlow = rd.payload[0];
      });
  }

  claim() {
    // const body = {
    //   submit_take_task: true
    // };
    this.processingClaim = true;
    this.ptDataService.claimTask(this.dso.id).subscribe((res) => {
      this.processingClaim = false;
      this.reload();
    });
  }

  reload() {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    this.router.navigate([this.router.url]);
  }

}
