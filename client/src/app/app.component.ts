import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './models/todo.model';
import { SignalRService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  items: Todo[];
  form: FormGroup;

  constructor(
    private readonly signalrService: SignalRService,
    private readonly http: HttpClient
  ) {
    signalrService.itemAdded.subscribe(item => this.items.push(item));
    signalrService.itemUpdated.subscribe(item => {
      this.items = this.items.filter(x => x.id !== item.id);
      this.items.push(item);
    });
  }

  ngOnInit() {
    this.http
      .get<Todo[]>('https://localhost:5001/api/todos/')
      .subscribe(items => {
        this.items = items;
      });

    this.form = new FormGroup({
      todoValue: new FormControl('', Validators.required)
    });
  }

  addTodo() {
    const toSend = { value: this.form.value.todoValue };

    this.http
      .post('https://localhost:5001/api/todos/', toSend)
      .subscribe(() => console.log('added'));

    this.form.reset();
  }

  markAsDone(item: Todo) {
    item.done = true;
    this.http
      .put('https://localhost:5001/api/todos/' + item.id, item)
      .subscribe(() => console.log('updated'));
  }
}
