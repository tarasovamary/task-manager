import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {

  constructor(private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router) { }

  taskId!: string;
  listId!: string;
    
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params)=>{
          this.listId = params['listId'];
          this.taskId = params['taskId'];
      }
    )
  }

  updateTask(title: string) {
    this.taskService.updateTask(this.listId, this.taskId, title).subscribe(() => {
      this.router.navigate(['/lists', this.listId]);
      })
  }
}
