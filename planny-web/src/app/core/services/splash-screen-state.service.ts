import { Injectable } from '@angular/core';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
@Injectable()
export class SplashScreenStateService {
   subject = new BehaviorSubject(true);
   subscribe(onNext): Subscription {
      return this.subject.subscribe(onNext);
   }
   stop() {
      this.subject.next(false);
   }
}