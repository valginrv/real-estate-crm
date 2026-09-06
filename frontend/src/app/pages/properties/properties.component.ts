import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  UnitService,
  Unit
} from '../../core/services/unit.service';

import {
  ProjectService,
  Project
} from '../../core/services/project.service';

import {
  BuildingService,
  Building
} from '../../core/services/building.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {

  // =========================
  // Projects
  // =========================

  projects: Project[] = [];

  loading = false;
  errorMessage = '';

  projectForm;

  isEditMode = false;
  selectedProjectId = '';

  units: Unit[] = [];

selectedBuilding: Building | null = null;

unitLoading = false;
unitError = '';

unitForm;

  // =========================
  // Buildings
  // =========================

  buildings: Building[] = [];

  selectedProject: Project | null = null;

  buildingLoading = false;
  buildingError = '';

  buildingForm;


  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private unitService: UnitService
  ) {

    // Project form
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });

    this.unitForm = this.fb.group({
  unitNumber: ['', Validators.required],
  type: ['1BHK', Validators.required],
  price: [0, [Validators.required, Validators.min(1)]]
});


    // Building form
    this.buildingForm = this.fb.group({
      name: ['', Validators.required]
    });

  }


  ngOnInit(): void {
    this.loadProjects();
  }


  // =====================================================
  // PROJECTS
  // =====================================================

  loadProjects(): void {

    this.loading = true;
    this.errorMessage = '';

    this.projectService.getProjects().subscribe({

      next: (response) => {

        this.projects = response.projects;

        this.loading = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          error.error?.message ||
          'Failed to load projects';

        this.loading = false;
      }

    });

  }


  // =====================================================
  // CREATE / UPDATE PROJECT
  // =====================================================

  createProject(): void {

    if (this.projectForm.invalid) {

      this.projectForm.markAllAsTouched();

      return;
    }


    const formValue = this.projectForm.value;


    const projectData = {

      name: formValue.name || '',

      location: formValue.location || '',

      description: formValue.description || ''

    };


    // UPDATE
    if (this.isEditMode) {

      this.projectService
        .updateProject(
          this.selectedProjectId,
          projectData
        )
        .subscribe({

          next: () => {

            this.closeProjectModal();

            this.loadProjects();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              error.error?.message ||
              'Failed to update project';

          }

        });

    }

    // CREATE
    else {

      this.projectService
        .createProject(projectData)
        .subscribe({

          next: () => {

            this.closeProjectModal();

            this.loadProjects();

          },

          error: (error) => {

            console.error(error);

            this.errorMessage =
              error.error?.message ||
              'Failed to create project';

          }

        });

    }

  }


  // =====================================================
  // EDIT PROJECT
  // =====================================================

  editProject(project: Project): void {

    this.isEditMode = true;

    this.selectedProjectId = project._id;


    this.projectForm.patchValue({

      name: project.name,

      location: project.location,

      description: project.description || ''

    });


    const button = document.querySelector(
      '[data-bs-target="#addProjectModal"]'
    ) as HTMLElement;


    button?.click();

  }


  // =====================================================
  // DELETE PROJECT
  // =====================================================

  deleteProject(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this project?'
    );


    if (!confirmed) {
      return;
    }


    this.projectService
      .deleteProject(id)
      .subscribe({

        next: () => {

          this.loadProjects();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error.error?.message ||
            'Failed to delete project';

        }

      });

  }


  // =====================================================
  // CLOSE PROJECT MODAL
  // =====================================================

  closeProjectModal(): void {

    this.projectForm.reset();


    this.isEditMode = false;

    this.selectedProjectId = '';


    const modalElement =
      document.getElementById('addProjectModal');


    if (modalElement) {

      const closeButton =
        modalElement.querySelector(
          '[data-bs-dismiss="modal"]'
        ) as HTMLElement;


      closeButton?.click();

    }

  }


  // =====================================================
  // BUILDINGS
  // =====================================================

  viewBuildings(project: Project): void {

    this.selectedProject = project;

    this.buildings = [];

    this.buildingError = '';

    this.loadBuildings(project._id);

  }


  loadBuildings(projectId: string): void {

    this.buildingLoading = true;

    this.buildingError = '';


    this.buildingService
      .getBuildings(projectId)
      .subscribe({

        next: (response) => {

          this.buildings = response.buildings;

          this.buildingLoading = false;

        },

        error: (error) => {

          console.error(error);

          this.buildingError =
            error.error?.message ||
            'Failed to load buildings';

          this.buildingLoading = false;

        }

      });

  }


  // =====================================================
  // CREATE BUILDING
  // =====================================================

  createBuilding(): void {

    if (!this.selectedProject) {

      this.buildingError =
        'Please select a project';

      return;
    }


    if (this.buildingForm.invalid) {

      this.buildingForm.markAllAsTouched();

      return;
    }


    const formValue =
      this.buildingForm.value;


    const buildingData = {

      projectId: this.selectedProject._id,

      name: formValue.name || ''

    };


    this.buildingService
      .createBuilding(buildingData)
      .subscribe({

        next: () => {

          this.closeBuildingModal();


          // Refresh buildings
          this.loadBuildings(
            this.selectedProject!._id
          );

        },

        error: (error) => {

          console.error(error);

          this.buildingError =
            error.error?.message ||
            'Failed to create building';

        }

      });

  }

  viewUnits(building: Building): void {

  this.selectedBuilding = building;

  this.units = [];

  this.unitError = '';

  this.loadUnits(building._id);
}

loadUnits(buildingId: string): void {

  this.unitLoading = true;

  this.unitError = '';

  this.unitService
    .getUnits(buildingId)
    .subscribe({

      next: (response) => {

        this.units = response.units;

        this.unitLoading = false;
      },

      error: (error) => {

        console.error(error);

        this.unitError =
          error.error?.message ||
          'Failed to load units';

        this.unitLoading = false;
      }

    });
}

createUnit(): void {

  if (!this.selectedBuilding) {
    return;
  }

  if (this.unitForm.invalid) {

    this.unitForm.markAllAsTouched();

    return;
  }

  const formValue =
    this.unitForm.value;

  const unitData = {

    buildingId:
      this.selectedBuilding._id,

    unitNumber:
      formValue.unitNumber || '',

    type:
      formValue.type || '1BHK',

    price:
      Number(formValue.price) || 0
  };


  this.unitService
    .createUnit(unitData)
    .subscribe({

      next: () => {

        this.closeUnitModal();

        this.loadUnits(
          this.selectedBuilding!._id
        );
      },

      error: (error) => {

        console.error(error);

        this.unitError =
          error.error?.message ||
          'Failed to create unit';
      }

    });
}


closeUnitModal(): void {

  this.unitForm.reset({
    type: '1BHK',
    price: 0
  });

  const modalElement =
    document.getElementById(
      'addUnitModal'
    );

  if (modalElement) {

    const closeButton =
      modalElement.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;

    closeButton?.click();
  }
}


  // =====================================================
  // CLOSE BUILDING MODAL
  // =====================================================

  closeBuildingModal(): void {

    this.buildingForm.reset();


    const modalElement =
      document.getElementById(
        'addBuildingModal'
      );


    if (modalElement) {

      const closeButton =
        modalElement.querySelector(
          '[data-bs-dismiss="modal"]'
        ) as HTMLElement;


      closeButton?.click();

    }

  }

}