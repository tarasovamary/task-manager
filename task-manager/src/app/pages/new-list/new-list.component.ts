import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent {

  constructor(private taskService: TaskService, 
              private router: Router) {}

createList(title: string) {
  this.taskService.createList(title).subscribe((list: any) => {
    console.log(list);
    this.router.navigate(['/lists', list._id]);
  });
}
}
