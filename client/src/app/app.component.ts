import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './models/todo.model';
import { SignalService } from './services/signal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `.inactive {
        color: gray;
    }`
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  form: FormGroup;
  items: Todo[];

  constructor(
    private readonly signalrService: SignalService,
    private readonly http: HttpClient
  ) {
    signalrService.itemAdded.subscribe(item => this.items.push(item));
    signalrService.itemUpdated.subscribe(item => {
      this.items = this.items.filter(x => x.id !== item.id);
      this.items.push(item);
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      todoValue: new FormControl('', Validators.required)
    });

    this.http
      .get('https://localhost:5001/api/todos/')
      .subscribe((response: Todo[]) => {
        this.items = response;
      });
  }

  addTodo() {
    const toSend = { value: this.form.value.todoValue };
    this.http
      .post('https://localhost:5001/api/todos/', toSend)
      .subscribe(() => {
        console.log('added');
      });
    this.form.reset();
  }

  markAsDone(item: Todo) {
    item.done = true;
    this.http
      .put('https://localhost:5001/api/todos/' + item.id, item)
      .subscribe(() => {
        console.log('updated');
      });
  }
}
