import {Component, OnInit, Self} from '@angular/core';
import {Answers, Stat, VotesService} from './votes.service';
import {DestroyerService} from '../destroer.service';
import {mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.css'],
  providers: [DestroyerService]
})
export class VotesComponent implements OnInit {
  question = 'angularHW';
  selectedAnswer: number = null;
  answers: Answers[];
  stat: Stat;
  disable = false;
  fileValue;

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
    if (this.selectedAnswer !== null) {
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

  getJSON(): void {
    this.votesService.stateFiles('application/json')
      .subscribe((v) => {
        this.fileValue = JSON.stringify(v);
      });
  }

  getHTML(): void {
    this.votesService.stateFiles('text/html')
      .subscribe((v) => {
        this.fileValue = v;
      });
  }

  getXML(): void {
    this.votesService.stateFiles('application/xml')
      .subscribe((v) => {
        this.fileValue = v;
      });
  }

}
