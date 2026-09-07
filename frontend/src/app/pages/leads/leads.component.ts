import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LeadService,
  Lead
} from '../../core/services/lead.service';

import {
  UserService,
  SalesUser
} from '../../core/services/user.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leads.component.html'
})
export class LeadsComponent implements OnInit {

  // =========================
  // DATA
  // =========================

  leads: Lead[] = [];

  salesUsers: SalesUser[] = [];

  selectedLead: Lead | null = null;


  // =========================
  // EDIT
  // =========================

  isEditMode = false;

  selectedLeadId = '';


  // =========================
  // SEARCH / FILTER
  // =========================

  search = '';

  selectedStage = '';


  // =========================
  // LOADING / ERROR
  // =========================

  loading = false;

  errorMessage = '';


  // =========================
  // FORM
  // =========================

  leadForm;


  // =========================
  // STAGES
  // =========================

  stages = [
    'New',
    'Contacted',
    'Site Visit',
    'Interested',
    'Negotiation',
    'Booked',
    'Lost'
  ];


  constructor(
    private leadService: LeadService,
    private fb: FormBuilder,
    private userService: UserService
  ) {

    this.leadForm = this.fb.group({

      name: [
        '',
        Validators.required
      ],

      phone: [
        '',
        Validators.required
      ],

      email: [
        ''
      ],

      assignedTo: [
        ''
      ],

      source: [
        ''
      ],

      stage: [
        'New',
        Validators.required
      ],

      notes: [
        ''
      ],

      followUpDate: [
        ''
      ]

    });

  }


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadLeads();

    this.loadSalesUsers();

  }


  // =========================
  // LOAD LEADS
  // =========================

  loadLeads(): void {

    this.loading = true;

    this.errorMessage = '';

    this.leadService
      .getLeads(
        this.search,
        this.selectedStage
      )
      .subscribe({

        next: (response) => {

          this.leads = response.leads;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'GET LEADS ERROR:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to load leads';

          this.loading = false;

        }

      });

  }


  // =========================
  // LOAD SALES USERS
  // =========================

  loadSalesUsers(): void {

    this.userService
      .getSalesUsers()
      .subscribe({

        next: (response) => {

          this.salesUsers =
            response.users;

        },

        error: (error) => {

          console.error(
            'GET SALES USERS ERROR:',
            error
          );

        }

      });

  }


  // =========================
  // SEARCH
  // =========================

  searchLeads(): void {

    this.loadLeads();

  }


  // =========================
  // STAGE FILTER
  // =========================

  filterByStage(): void {

    this.loadLeads();

  }


  // =========================
  // CREATE / UPDATE LEAD
  // =========================

  createLead(): void {

    if (this.leadForm.invalid) {

      this.leadForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.leadForm.value;


    const leadData: any = {
      name: formValue.name || '',
      phone: formValue.phone || '',
      email: formValue.email || '',
      source: formValue.source || '',
      stage: formValue.stage || 'New',
      notes: formValue.notes || '',
      followUpDate: formValue.followUpDate || null
    };

    if (formValue.assignedTo) {
      leadData.assignedTo = formValue.assignedTo;
    } else if (this.isEditMode) {
      leadData.assignedTo = null;   // explicitly unassign during edit
    }

    // =========================
    // UPDATE
    // =========================

    if (this.isEditMode) {

      this.leadService
        .updateLead(
          this.selectedLeadId,
          leadData
        )
        .subscribe({

          next: () => {

            console.log(
              'Lead updated successfully'
            );

            this.closeLeadModal();

            this.loadLeads();

          },

          error: (error) => {

            console.error(
              'UPDATE LEAD ERROR:',
              error
            );

            this.errorMessage =
              error.error?.message ||
              'Failed to update lead';

          }

        });

      return;
    }


    // =========================
    // CREATE
    // =========================

    this.leadService
      .createLead(leadData)
      .subscribe({

        next: () => {

          console.log(
            'Lead created successfully'
          );

          this.closeLeadModal();

          this.loadLeads();

        },

        error: (error) => {

          console.error(
            'CREATE LEAD ERROR:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to create lead';

        }

      });

  }


  // =========================
  // EDIT LEAD
  // =========================

  editLead(lead: Lead): void {

    this.isEditMode = true;
    this.selectedLeadId = lead._id;

    const patchAndOpen = () => {
      this.leadForm.patchValue({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        assignedTo: lead.assignedTo?._id || '',
        source: lead.source || '',
        stage: lead.stage,
        notes: lead.notes || '',
        followUpDate: lead.followUpDate
          ? lead.followUpDate.substring(0, 10)
          : ''
      });

      const button = document.querySelector(
        '[data-bs-target="#addLeadModal"]'
      ) as HTMLElement;

      button?.click();
    };

    // salesUsers innும் load aagalna, aduthu load pannitu patch pannunga
    if (this.salesUsers.length === 0) {
      this.userService.getSalesUsers().subscribe({
        next: (response) => {
          this.salesUsers = response.users;
          patchAndOpen();
        },
        error: () => patchAndOpen()   // fail aana kூda modal open pannிடலாம்
      });
    } else {
      patchAndOpen();
    }
  }

  deleteLead(lead: Lead): void {

    if (!confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
      return;
    }

    this.leadService.deleteLead(lead._id).subscribe({

      next: (response) => {

        console.log('Lead deleted successfully:', response);

        this.loadLeads();

      },

      error: (error) => {

        console.error('DELETE LEAD ERROR:', error);

        this.errorMessage =
          error.error?.message || 'Failed to delete lead';

      }

    });
  }
  // =========================
  // VIEW LEAD
  // =========================

  viewLead(lead: Lead): void {

    this.leadService
      .getLeadById(lead._id)
      .subscribe({

        next: (response) => {

          this.selectedLead = response;

          const button =
            document.getElementById(
              'viewLeadButton'
            ) as HTMLElement;

          button?.click();
        },

        error: (error) => {

          console.error(
            'GET LEAD ERROR:',
            error
          );

          this.errorMessage =
            error.error?.message ||
            'Failed to load lead details';
        }

      });
  }


  // =========================
  // CLOSE MODAL
  // =========================

  closeLeadModal(): void {

    this.leadForm.reset({

      name: '',

      phone: '',

      email: '',

      assignedTo: '',

      source: '',

      stage: 'New',

      notes: '',

      followUpDate: ''

    });


    this.isEditMode = false;

    this.selectedLeadId = '';

  }


  // =========================
  // CLEAR FILTER
  // =========================

  clearFilters(): void {

    this.search = '';

    this.selectedStage = '';

    this.loadLeads();

  }

}