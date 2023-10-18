import { Injectable } from '@angular/core';
import { Task } from 'src/app/models/tasks.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: string) {
    return this.webReqService.post('lists', {title});
  }

  updateList(listId: string, title: string) {
    return this.webReqService.patch(`lists/${listId}`, {title});
  }

  deleteList(listId: string) {
    return this.webReqService.delete(`lists/${listId}`);
  }

  getList() {
    return this.webReqService.get('lists');
  }
  
  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createTasks(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  updateTask(listId: string, taskId: string, title: string) {
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    })
  }
}
