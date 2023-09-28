import { Component } from '@angular/core';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent {

  constructor(private taskService: TaskService) {

  }

  createNewList() {
    this.taskService.createList('Test title').subscribe((response: any) => {
      console.log(response);
    });
  }
}
