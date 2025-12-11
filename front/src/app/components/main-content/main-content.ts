import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BossList } from '../boss-list/boss-list';
import { SearchBar, SkillFilters } from '../search-bar/search-bar';          
import { SkillsList } from '../skills-list/skills-list';
import { SkillType } from '../../utils/types/skill-type';
import { BossType } from '../../utils/types/boss-type';
import { ApiServicePublic } from '../../utils/services/api-service-public';
import { ApiServiceProtected } from '../../utils/services/api-service-protected'; 
import { ToonDetails } from "../toon-details/toon-details";
import { ToonLiveStateService } from '../../utils/services/toon-live-state-service';

@Component({
  selector: 'app-main-content',
  imports: [BossList, SearchBar, SkillsList, ToonDetails],
  templateUrl: './main-content.html',
  styleUrls: ['./main-content.css'],
})
export class MainContent implements OnInit, OnDestroy {
  viewMode: 'skill-detail' | 'boss-list' = 'skill-detail';

  // source complète
  skillsList: SkillType[] = [];
  // liste affichée (après search + filtres)
  displayedSkills: SkillType[] = [];

  bossList: BossType[] = [];
  idSkill = 0;

  // état de search / filtres
  searchText = '';
  filters: SkillFilters = { professions: [], campaigns: [], ownedMode: 'all' };

  // options pour la SearchBar
  professionOptions: string[] = [];
  campaignOptions: string[] = [];

  // owned (ids des skills du toon sélectionné)
  ownedIds = new Set<number>();

  private apiPublic = inject(ApiServicePublic);
  private apiProtected = inject(ApiServiceProtected);
  private live = inject(ToonLiveStateService);

  ngOnInit(): void {
    // 1) charger toutes les skills
    this.apiPublic.getSkills().subscribe({
      next: (allSkills) => {
        this.skillsList = allSkills ?? [];
        this.buildOptions(this.skillsList);
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });

    // 2) charger les bosses initiaux
    this.loadBosses(this.idSkill);

    // 3) charger les ownedIds du toon sélectionné (si présent)
    this.loadOwnedIdsFromSelectedToon();

    // 4) si le toon change dans un autre composant → maj ownedIds
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.onStorageChange);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.onStorageChange);
    }
  }

  // === handlers ===
  handleSearch(search: string): void {
    
    this.searchText = search ?? '';
    this.apiPublic.getSkillsBy(this.searchText).subscribe({
      next: (list) => {
        this.skillsList = list ?? [];
        this.buildOptions(this.skillsList);
        this.applyFilters();
      },
      error: console.error,
    });
  }

  handleFiltersChange(f: SkillFilters) {
    this.filters = f ?? { professions: [], campaigns: [], ownedMode: 'all' };
    this.applyFilters();
  }

  handleData(skillId: number): void {
    this.idSkill = skillId;
    this.loadBosses(skillId);
    this.viewMode = 'boss-list';
  }

  // === utils ===
  private buildOptions(all: SkillType[]) {
    const profs = new Set<string>();
    const camps = new Set<string>();
    for (const s of all) {
      if (s.profession) profs.add(s.profession);
      if (s.campaign) camps.add(s.campaign);
    }
    this.professionOptions = Array.from(profs).sort();
    this.campaignOptions  = Array.from(camps).sort();
  }

  private applyFilters() {
    const text = (this.searchText ?? '').trim().toLowerCase();
    const { professions, campaigns, ownedMode } = this.filters;

    this.displayedSkills = (this.skillsList ?? []).filter((s) => {
      // texte
      if (text) {
        const hay = `${s.name} ${s.description ?? ''} ${s.profession ?? ''} ${s.attribute ?? ''} ${s.campaign ?? ''}`.toLowerCase();
        if (!hay.includes(text)) return false;
      }
      // professions
      if (professions?.length && !professions.includes(s.profession)) return false;
      // campaigns
      if (campaigns?.length && !campaigns.includes(s.campaign)) return false;
      // owned
      if (ownedMode === 'ownedOnly' && !this.ownedIds.has(s.id)) return false;
      if (ownedMode === 'hideOwned' &&  this.ownedIds.has(s.id)) return false;

      return true;
    });
  }

  private loadBosses(skillId: number): void {
    this.apiPublic.getBosses(skillId).subscribe({
      next: (bosses) => (this.bossList = bosses),
      error: (err) => console.error(err),
    });
  }

  private loadOwnedIdsFromSelectedToon(): void {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem('selectedToonId') : null;
    const toonId = raw ? Number(raw) : null;
     this.live.setSelectedToon(toonId && !Number.isNaN(toonId) ? toonId : null);
    if (!toonId || Number.isNaN(toonId)) return;

    this.apiProtected.getToon(toonId).subscribe({
      next: (toon) => {
        const ids = (toon?.skills ?? []).map(s => s.id);
        this.ownedIds = new Set(ids);
        this.live.setOwnedCount(ids.length);
        this.applyFilters(); 
      },
      error: (err) => console.error('Failed to load toon for ownedIds', err),
    });
  }

  private onStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedToonId') {
      this.loadOwnedIdsFromSelectedToon();
    }
  };

  onOwnershipChange(e: { skillId: number; owned: boolean }) {
  if (e.owned) {
    this.ownedIds.add(e.skillId);
     this.live.incOwned();
  } else {
    this.ownedIds.delete(e.skillId);
    this.live.decOwned();  
  }
 
  this.applyFilters();
}
showBossList = false;

onToggleBossList(show: boolean) {
  this.showBossList = show;
}
}
