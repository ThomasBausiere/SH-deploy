import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { SkillType } from '../../utils/types/skill-type';
import { ApiServicePublic } from '../../utils/services/api-service-public';
import { ApiServiceProtected } from '../../utils/services/api-service-protected';
import { ToonType } from '../../utils/types/toon-type';
import { ToonLiveStateService } from '../../utils/services/toon-live-state-service';
import { VisitorToonService } from '../../utils/services/visitor-toon-service';
import { BossType } from '../../utils/types/boss-type';

@Component({
  selector: 'app-skills-list',
  imports: [],
  templateUrl: './skills-list.html',
  styleUrl: './skills-list.css',
  standalone: true,
})
export class SkillsList implements OnInit {
  @Input() skillsList!: SkillType[];

  @Output() toggleBossList = new EventEmitter<boolean>();
  @Output() showBossEvent = new EventEmitter<number>();
  @Output() ownershipChange = new EventEmitter<{
    skillId: number;
    owned: boolean;
  }>();

  apipublic = inject(ApiServicePublic);
  apiProtected = inject(ApiServiceProtected);
  live = inject(ToonLiveStateService);
  visitor = inject(VisitorToonService);


  selectedToonId: number | null = null;

  ownedSkillIds = new Set<number>();
  loadingSkillIds = new Set<number>();

  ngOnInit(): void {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('selectedToonId')
        : null;
    this.selectedToonId = raw ? Number(raw) : null;
    if (!this.token) {
      const ids = this.visitor.getSkillIds();
      this.ownedSkillIds = new Set(ids);
      this.live.setOwnedCount(ids.length);
      return;
    }
    if (this.selectedToonId && !Number.isNaN(this.selectedToonId)) {
      this.loadToonSkills(this.selectedToonId);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.onStorageChange);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.onStorageChange);
    }
  }

  private onStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedToonId') {
      const raw = localStorage.getItem('selectedToonId');
      const id = raw ? Number(raw) : null;
      this.selectedToonId = id;
      if (id && !Number.isNaN(id)) {
        this.loadToonSkills(id);
      } else {
        if (!this.token) {
          const ids = this.visitor.getSkillIds();
          this.ownedSkillIds = new Set(ids);
          this.live.setOwnedCount(ids.length);
        } else {
          this.ownedSkillIds.clear();
          this.live.setOwnedCount(0);
        }
      }
    }
  };

  private loadToonSkills(toonId: number) {
    this.apiProtected.getToon(toonId).subscribe({
      next: (toon: ToonType) => {
        const ids = (toon?.skills ?? []).map((s) => s.id);
        this.ownedSkillIds = new Set(ids);
        this.live.setOwnedCount(ids.length);
      },
      error: (err) =>
        console.error('Impossible de charger le Toon sélectionné', err),
    });
  }

  hasSkill(skillId: number): boolean {
    return this.ownedSkillIds.has(skillId);
  }

  /** handler checkbox */
  onToggleSkill(skill: SkillType, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    // ✅ VISITOR MODE (pas de token) : on bosse en local
    if (!this.token) {
      if (this.loadingSkillIds.has(skill.id)) return;
      this.loadingSkillIds.add(skill.id);
      const done = () => this.loadingSkillIds.delete(skill.id);

      if (checked) {
        this.ownedSkillIds.add(skill.id);
        const ids = this.visitor.add(skill.id);
        this.live.setOwnedCount(ids.length);
        this.ownershipChange.emit({ skillId: skill.id, owned: true });
        done();
      } else {
        this.ownedSkillIds.delete(skill.id);
        const ids = this.visitor.remove(skill.id);
        this.live.setOwnedCount(ids.length);
        this.ownershipChange.emit({ skillId: skill.id, owned: false });
        done();
      }
      return;
    }

    if (!this.selectedToonId) {
      console.warn('Aucun Toon sélectionné dans la session.');
      return;
    }
    // if (!this.token) {
    //   console.warn('Utilisateur non authentifié.');
    //   return;
    // }
    if (this.loadingSkillIds.has(skill.id)) return;

    this.loadingSkillIds.add(skill.id);
    const done = () => this.loadingSkillIds.delete(skill.id);

    if (checked) {
      this.addSkillToToon(skill.id, done);
    } else {
      this.removeSkillFromToon(skill.id, done);
    }
  }

  /** ADD */
  private addSkillToToon(skillId: number, finalize: () => void): void {
    if (!this.selectedToonId) {
      finalize();
      return;
    }

    this.ownedSkillIds.add(skillId);

    this.apiProtected.addSkillToon(this.selectedToonId, skillId).subscribe({
      next: () => {

        this.ownershipChange.emit({ skillId, owned: true })
        this.live.incOwned();
        finalize();
      },
      error: (err) => {
        console.error('Ajout skill échoué', err);
        this.ownedSkillIds.delete(skillId);
        finalize();
      },
    });
  }

  private removeSkillFromToon(skillId: number, finalize: () => void): void {
    if (!this.selectedToonId) {
      finalize();
      return;
    }

    const had = this.ownedSkillIds.delete(skillId);

    this.apiProtected.removeSkillToon(this.selectedToonId, skillId).subscribe({
      next: () => {
        this.ownershipChange.emit({ skillId, owned: false })
        this.live.decOwned();
        finalize();
      },
      error: (err) => {
        console.error('Suppression skill échouée', err);
        if (had) this.ownedSkillIds.add(skillId);
        finalize();
      },
    });
  }
  listsBoss(id: number): void {
    this.showBossEvent.emit(id);
    this.toggleBossList.emit(true);
  }

  get token(): string | null {
    return this.apipublic.getToken();
  }
}
