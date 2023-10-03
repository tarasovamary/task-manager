import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {

  lists: any;
  tasks: any;

  constructor(private taskService: TaskService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params)=>{
        console.log(params);
        this.taskService.getTasks(params['listId']).subscribe((tasks)=>{
          this.tasks = tasks;
        })
      }
    )

    this.taskService.getList().subscribe((lists) => {
      this.lists = lists;
    })
  }

}
