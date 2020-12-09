import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ForwordGuard implements CanActivate {
  constructor(private route: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): | boolean {
    {
      if (localStorage.getItem('user')) {
        return true;
      } else {
        this.route.navigate(['/']);
        return false;
      }
    }
  }
}
