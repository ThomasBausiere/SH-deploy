import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { ApiServicePublic } from '../../utils/services/api-service-public';
import { AuthStateService } from '../../utils/services/auth-state-service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit, OnDestroy {
  private apiPublic = inject(ApiServicePublic);
  private auth = inject(AuthStateService);

  private sub = new Subscription();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @Input() menuOpen = false;

  isLogged = false;
  isAdmin = false;
  isBrowser = false;

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // SSR safe : pas de subscription / window si pas browser
    if (!this.isBrowser) return;

    // 1) on s’abonne à l’état auth (réactif)
    this.sub.add(
      this.auth.state$.subscribe((s) => {
        this.isLogged = s.isLogged;
        this.isAdmin = s.isAdmin;
      })
    );

    // 2) optionnel mais utile : force un refresh au chargement du composant
    // (si AuthStateService le fait déjà dans son constructor, tu peux enlever)
    this.auth.refresh?.();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout() {
    // centralise la logique (token + state)
    if (this.isBrowser) {
      this.auth.logout?.();
      // fallback si ton AuthStateService n’a pas logout()
      if (!this.auth.logout) this.apiPublic.logout();
    } else {
      this.apiPublic.logout();
    }

    this.closeMenuMobile();
  }

  get token(): string | null {
    return this.apiPublic.getToken();
  }

  closeMenuMobile() {
    // important: pas de window côté SSR
    if (!this.isBrowser) return;

    if (window.innerWidth <= 720) {
      this.menuOpen = false;
    }
  }
}
