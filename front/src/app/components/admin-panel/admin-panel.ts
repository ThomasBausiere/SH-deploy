import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServicePublic } from '../../utils/services/api-service-public';
import { ApiServiceProtected } from '../../utils/services/api-service-protected';
import { AdminModal } from '../admin-modal/admin-modal';

type Tab = 'users' | 'skills' | 'boss' | 'toons';

interface UserRow { id: number; pseudo: string; email: string; }
interface SkillRow { id: number; name: string; }
interface BossRow  { id: number; name: string; }
interface ToonRow  { id: number; name: string; }

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminModal],
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css'],
})
export class AdminPanel implements OnInit {
  private apiPublic = inject(ApiServicePublic);
  private api = inject(ApiServiceProtected);
  private fb = inject(FormBuilder);

  tab = signal<Tab>('users');
  loading = signal(false);
  error = signal<string | null>(null);

  users: UserRow[] = [];
  skills: SkillRow[] = [];
  bosses: BossRow[] = [];
  toons: ToonRow[] = [];

  // état modales
  showViewModal = signal(false);
  showEditModal = signal(false);
  showCreateModal = signal(false);
  modalEntity: any = null;   // entité courante
  modalType: Tab = 'users';  // contexte courant

  // formulaires
  editForm!: FormGroup;
  createForm!: FormGroup;

  ngOnInit(): void {
    this.loadTab('users');
  }

  setTab(t: Tab) {
    if (this.tab() === t) return;
    this.tab.set(t);
    this.loadTab(t);
  }

  private loadTab(t: Tab) {
    this.loading.set(true);
    this.error.set(null);

    switch (t) {
      case 'users':
        this.api.listUsers().subscribe({
          next: (rows: any[]) => {
            // back renvoie un UserDto => {id, email, pseudo, role}
            this.users = rows.map(u => ({ id: u.id, pseudo: u.pseudo, email: u.email }));
            this.loading.set(false);
          },
          error: () => { this.error.set('Unable to load users'); this.loading.set(false); }
        });
        break;

      case 'skills':
        this.apiPublic.getSkills().subscribe({
          next: (rows: any[]) => {
            this.skills = rows.map(s => ({ id: s.id, name: s.name }));
            this.loading.set(false);
          },
          error: () => { this.error.set('Unable to load skills'); this.loading.set(false); }
        });
        break;

      case 'boss':
        this.api.listBosses().subscribe({
          next: (rows: any[]) => {
            this.bosses = rows.map(b => ({ id: b.id, name: b.name }));
            this.loading.set(false);
          },
          error: () => { this.error.set('Unable to load bosses'); this.loading.set(false); }
        });
        break;

      case 'toons':
        this.api.listAllToons().subscribe({
          next: (rows: any[]) => {
            this.toons = rows.map(tn => ({ id: tn.id, name: tn.name }));
            this.loading.set(false);
          },
          error: () => { this.error.set('Unable to load toons'); this.loading.set(false); }
        });
        break;
    }
  }

  // --------- OUVERTURE MODALES ---------
  onView(row: any, type: Tab) {
    this.modalEntity = row;
    this.modalType = type;
    this.showViewModal.set(true);
  }

  onEdit(row: any, type: Tab) {
    this.modalEntity = row;
    this.modalType = type;
    this.prepareEditForm();
    this.showEditModal.set(true);
  }

  onCreate(type: Tab) {
    this.modalEntity = null;
    this.modalType = type;
    this.prepareCreateForm();
    this.showCreateModal.set(true);
  }

  // --------- PREPARE FORMS ---------
  private prepareEditForm() {
    switch (this.modalType) {
      case 'users':
        this.editForm = this.fb.group({
          email: [this.modalEntity?.email ?? '', [Validators.required, Validators.email]],
          pseudo: [this.modalEntity?.pseudo ?? '', [Validators.required, Validators.minLength(2)]],
          
        });
        break;

      case 'skills':
        this.editForm = this.fb.group({
          name: [this.modalEntity?.name ?? '', [Validators.required, Validators.minLength(2)]],
        });
        break;

      case 'boss':
        this.editForm = this.fb.group({
          name: [this.modalEntity?.name ?? '', [Validators.required, Validators.minLength(2)]],
        });
        break;

      case 'toons':
        this.editForm = this.fb.group({
          name: [this.modalEntity?.name ?? '', [Validators.required, Validators.minLength(2)]],
        });
        break;
    }
  }

  private prepareCreateForm() {
    switch (this.modalType) {
      case 'skills':
        this.createForm = this.fb.group({
          name: ['', [Validators.required, Validators.minLength(2)]],
        });
        break;

      case 'boss':
        this.createForm = this.fb.group({
          name: ['', [Validators.required, Validators.minLength(2)]],
        });
        break;

      case 'toons':
        
        this.createForm = this.fb.group({
          userId: [null, [Validators.required]],
          name: ['', [Validators.required, Validators.minLength(2)]],
          profession: ['', [Validators.required]], 
        });
        break;

      case 'users':

        break;
    }
  }

  // --------- ACTIONS CONFIRM ---------
  confirmEdit() {
    if (!this.editForm?.valid) return;

    switch (this.modalType) {
      case 'users': {
        const { email, pseudo } = this.editForm.value;
        this.api.updateUser(this.modalEntity.id, { email, pseudo }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Update user failed'),
        });
        break;
      }

      case 'skills': {
        const { name } = this.editForm.value;
        this.api.updateSkill(this.modalEntity.id, { name }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Update skill failed'),
        });
        break;
      }

      case 'boss': {
        const { name } = this.editForm.value;
        this.api.updateBoss(this.modalEntity.id, { name }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Update boss failed'),
        });
        break;
      }

      case 'toons': {
        const { name } = this.editForm.value;
        this.api.renameToon(this.modalEntity.id, { name }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Update toon failed'),
        });
        break;
      }
    }
  }

  confirmCreate() {
    if (!this.createForm?.valid) return;

    switch (this.modalType) {
      case 'skills': {
        const { name } = this.createForm.value;
        this.api.createSkill({ name }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Create skill failed'),
        });
        break;
      }

      case 'boss': {
        const { name } = this.createForm.value;
        this.api.createBoss({ name }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Create boss failed'),
        });
        break;
      }

      case 'toons': {
        const { userId, name, profession } = this.createForm.value;
        this.api.createToonForUser(+userId, { name, profession }).subscribe({
          next: () => this.afterSuccess(),
          error: () => this.error.set('Create toon failed'),
        });
        break;
      }

     
    }
  }

  private afterSuccess() {
    this.closeModals(true);
  }

  // --------- FERMETURE ---------
  closeModals(refresh = false) {
    this.showViewModal.set(false);
    this.showEditModal.set(false);
    this.showCreateModal.set(false);
    this.modalEntity = null;
    if (refresh) this.loadTab(this.tab());
  }
}
