import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  UserService,
  SalesUser
} from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  salesUsers: SalesUser[] = [];

  loading = false;
  submitting = false;

  errorMessage = '';
  successMessage = '';

  userForm;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {

    this.userForm = this.fb.group({

      name: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  ngOnInit(): void {

    this.loadSalesUsers();

  }

  loadSalesUsers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.userService
      .getSalesUsers()
      .subscribe({

        next: (response) => {

          this.salesUsers =
            response.users;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'GET SALES USERS ERROR:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to load sales employees';

          this.loading = false;

        }

      });

  }

  createSalesUser(): void {

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;

    }

    this.submitting = true;

    this.errorMessage = '';
    this.successMessage = '';

    const formValue =
      this.userForm.value;

    const userData = {

      name:
        formValue.name || '',

      email:
        formValue.email || '',

      password:
        formValue.password || ''

    };

    this.userService
      .createSalesUser(userData)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Sales user created:',
            response
          );

          this.successMessage =
            'Sales employee created successfully';

          this.userForm.reset();

          this.submitting = false;

          this.loadSalesUsers();

        },

        error: (error) => {

          console.error(
            'CREATE SALES USER ERROR:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to create sales employee';

          this.submitting = false;

        }

      });

  }

}