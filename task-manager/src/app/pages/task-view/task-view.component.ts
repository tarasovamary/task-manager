import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/tasks.model';

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
        if(params['listId']) {
          this.taskService.getTasks(params['listId']).subscribe((tasks)=>{
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }
       
      }
    )

    this.taskService.getList().subscribe((lists) => {
      this.lists = lists;
    })
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe(()=>{
      task.completed = !task.completed;
    })
  }

}
