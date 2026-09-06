import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LeadService,
  Lead
} from '../../core/services/lead.service';

import {
  UnitService,
  Unit
} from '../../core/services/unit.service';

import {
  BookingService,
  Booking
} from '../../core/services/booking.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './bookings.component.html'
})
export class BookingsComponent implements OnInit {

  leads: Lead[] = [];
  selectedUnitPrice: number = 0;
  units: Unit[] = [];

  bookings: Booking[] = [];

  loading = false;

  errorMessage = '';

  bookingForm;


  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private unitService: UnitService,
    private bookingService: BookingService
  ) {

    this.bookingForm = this.fb.group({

      leadId: [
        '',
        Validators.required
      ],

      unitId: [
        '',
        Validators.required
      ],

      bookingAmount: [
        0,
        [
          Validators.required,
          Validators.min(1)
        ]
      ]

    });

  }


  ngOnInit(): void {

    this.loadLeads();

    this.loadAvailableUnits();

    this.loadBookings();

  }


  onUnitChange(): void {

    const unitId =
      this.bookingForm.get('unitId')?.value;

    const selectedUnit =
      this.units.find(unit => unit._id === unitId);

    if (selectedUnit) {
      this.selectedUnitPrice = selectedUnit.price;
    } else {
      this.selectedUnitPrice = 0;
    }
  }

  // =========================
  // LOAD LEADS
  // =========================

  loadLeads(): void {

    this.leadService
      .getLeads()
      .subscribe({

        next: (response) => {

          this.leads = response.leads;

        },

        error: (error) => {

          console.error(error);

        }

      });

  }


  // =========================
  // LOAD BOOKINGS
  // =========================

  loadBookings(): void {

    this.loading = true;

    this.bookingService
      .getBookings()
      .subscribe({

        next: (response) => {

          this.bookings =
            response.bookings;

          this.loading = false;

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error.error?.message ||
            'Failed to load bookings';

          this.loading = false;

        }

      });

  }


  // =========================
  // CREATE BOOKING
  // =========================

  createBooking(): void {

    if (this.bookingForm.invalid) {

      this.bookingForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.bookingForm.value;


    const bookingData = {

      leadId:
        formValue.leadId || '',

      unitId:
        formValue.unitId || '',

      bookingAmount:
        Number(formValue.bookingAmount) || 0

    };


    this.bookingService
      .createBooking(bookingData)
      .subscribe({

        next: () => {

          this.bookingForm.reset({
            bookingAmount: 0
          });

          this.loadBookings();

          this.loadLeads();

          this.loadAvailableUnits();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error.error?.message ||
            'Failed to create booking';

        }

      });

  }

  loadAvailableUnits(): void {

    this.unitService
      .getUnits('', 'Available')
      .subscribe({

        next: (response) => {

          this.units = response.units;

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

}