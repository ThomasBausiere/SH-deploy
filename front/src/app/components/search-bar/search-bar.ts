import { Component, EventEmitter, Output, Input, HostListener, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

export type OwnedMode = 'all' | 'ownedOnly' | 'hideOwned';

export type SkillFilters = {
  professions: string[];
  campaigns: string[];
  ownedMode: OwnedMode;
};

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  constructor(private el: ElementRef) {}

  
  search_control = new FormControl<string>('', { nonNullable: true });
  @Output() search = new EventEmitter<string>();

  @Output() filtersChange = new EventEmitter<SkillFilters>();

  @Input() professionOptions: string[] = [];
  @Input() campaignOptions: string[] = [];

  open = false;
  selectedProfessions = new Set<string>();
  selectedCampaigns = new Set<string>();
  ownedMode: OwnedMode = 'all';

  ngOnInit() {
    this.search_control.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        map((v) => v?.trim() ?? '')
      )
      .subscribe((v) => this.search.emit(v));
  }

  toggleFilters(): void {
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!this.open) return;
    const target = e.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) this.open = false;
  }

  toggleProfession(p: string) {
    this.selectedProfessions.has(p) ? this.selectedProfessions.delete(p) : this.selectedProfessions.add(p);
    this.emitFilters();
  }
  toggleCampaign(c: string) {
    this.selectedCampaigns.has(c) ? this.selectedCampaigns.delete(c) : this.selectedCampaigns.add(c);
    this.emitFilters();
  }
  setOwnedMode(mode: OwnedMode) {
    this.ownedMode = mode;
    this.emitFilters();
  }
  clearFilters() {
    this.selectedProfessions.clear();
    this.selectedCampaigns.clear();
    this.ownedMode = 'all';
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChange.emit({
      professions: Array.from(this.selectedProfessions),
      campaigns: Array.from(this.selectedCampaigns),
      ownedMode: this.ownedMode,
    });
  }

  searchSkill(): void {
    this.search.emit(this.search_control.value.trim());
  }
}
