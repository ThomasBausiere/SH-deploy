import { Component, Inject, OnInit, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiServiceProtected } from '../../utils/services/api-service-protected';
import { ToonType } from '../../utils/types/toon-type';
import { ToonLiveStateService } from '../../utils/services/toon-live-state-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toon-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toon-details.html',
  styleUrl: './toon-details.css',
})
export class ToonDetails implements OnInit, OnDestroy {
  private api = inject(ApiServiceProtected);
  private live = inject(ToonLiveStateService);

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  loading = false;
  toon: ToonType | null = null;
  ownedCount = 0;
  readonly TOTAL = 300;

  private sub?: Subscription;

  ngOnInit(): void {
        if (!this.isBrowser) return;

    const raw = localStorage.getItem('selectedToonId');
    const id = raw ? Number(raw) : null;
    this.live.setSelectedToon(id && !Number.isNaN(id) ? id : null);

    this.sub = new Subscription();

    this.sub.add(
      this.live.selectedToonId$.subscribe((toonId) => {
        if (!toonId) {
          this.toon = null;
          this.ownedCount = 0;
          return;
        }
        this.loading = true;
        this.api.getToon(toonId).subscribe({
          next: (t) => {
            this.toon = t;
            const count = (t?.skills ?? []).length;
            this.ownedCount = count;
            this.live.setOwnedCount(count); // aligne le flux global
            this.loading = false;
          },
          error: () => {
            this.toon = null;
            this.ownedCount = 0;
            this.loading = false;
          },
        });
      })
    );

    this.sub.add(
      this.live.ownedCount$.subscribe((n) => {
        this.ownedCount = n ?? 0; // mise à jour en temps réel
      })
    );

    window.addEventListener('storage', this.onStorageChange);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
        if (this.isBrowser) {
      window.removeEventListener('storage', this.onStorageChange);
    }
  }

  private onStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedToonId') {
      const raw = localStorage.getItem('selectedToonId');
      const id = raw ? Number(raw) : null;
      this.live.setSelectedToon(id && !Number.isNaN(id) ? id : null);
    }
  };
}
