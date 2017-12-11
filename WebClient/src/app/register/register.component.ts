import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: User = new User();
    isLoading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.isLoading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                    this.isLoading = false;
                },
                error => {
                    this.alertService.error(error._body);
                    this.isLoading = false;
                });
    }
}
