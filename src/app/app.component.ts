import {OnInit, Self} from '@angular/core';
import {Component} from '@angular/core';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {DestroyerService} from './destroer.service';
import {Answers, Stat, VotesService} from './votes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DestroyerService]
})
export class AppComponent implements OnInit {
  question = 'angularHW';
  selectedAnswer: number;
  answers: Answers[];
  stat: Stat;
  disable = false;

  constructor(@Self() private destroy$: DestroyerService,
              private votesService: VotesService) {
  }

  ngOnInit(): void {
    this.votesService.variants()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.question = value.question;
        this.answers = value.answers;
      });
    this.votesService.stat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.stat = value;
      });
  }

  vote(): void {
    if (this.selectedAnswer) {
      this.votesService.vote(this.selectedAnswer)
        .pipe(
          mergeMap(res => this.votesService.stat()),
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          this.stat = value;
          this.disable = true;
        });
    }
  }
}
