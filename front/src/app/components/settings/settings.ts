import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceProtected } from '../../utils/services/api-service-protected';
import { ApiServicePublic } from '../../utils/services/api-service-public';
import { Router } from '@angular/router';

type Mode = 'none' | 'change' | 'delete';

interface MeResponse {
  id: number;
  email: string;
  pseudo: string;
  role: 'USER' | 'ADMIN';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class Settings implements OnInit {
  private api = inject(ApiServiceProtected);
  private pub = inject(ApiServicePublic);
  private router = inject(Router);

  // données utilisateur
  user: { id: number; email: string; pseudo: string } | null = null;

  // état UI
  mode: Mode = 'none';
  loading = false;
  saving = false;
  deleting = false;

  // formulaire "change password"
  newPassword = '';
  confirmPassword = '';

  // messages
  errorMsg: string | null = null;
  successMsg: string | null = null;

  ngOnInit(): void {
    this.fetchMe();
  }

  // --- chargement de l'utilisateur courant ---
  private fetchMe(): void {
    this.loading = true;
    this.errorMsg = null;
    this.api.me().subscribe({
      next: (me: MeResponse) => {
        this.user = { id: me.id, email: me.email, pseudo: me.pseudo };
        this.loading = false;
      },
      error: () => {
        this.errorMsg = "Impossible de récupérer votre profil.";
        this.loading = false;
      },
    });
  }

  // --- actions d'ouverture/fermeture ---
  openChange(): void {
    this.clearMessages();
    this.mode = 'change';
  }

  openDelete(): void {
    this.clearMessages();
    this.mode = 'delete';
  }

  cancel(): void {
    this.mode = 'none';
    this.newPassword = '';
    this.confirmPassword = '';
    this.clearMessages();
  }

  private clearMessages(): void {
    this.errorMsg = null;
    this.successMsg = null;
  }

  // --- submit: changement de mot de passe  ---
  submitPassword(): void {
    if (!this.user) return;

    this.clearMessages();

    // validations simples côté front
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Veuillez remplir les deux champs mot de passe.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.saving = true;
    this.api.changeMyPassword(this.user.id, this.newPassword).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Mot de passe mis à jour avec succès.';
        this.newPassword = '';
        this.confirmPassword = '';
        this.mode = 'none';
      },
      error: (err) => {
        this.saving = false;
        if (err?.status === 400) {
          this.errorMsg = 'Mot de passe invalide.';
        } else if (err?.status === 403) {
          this.errorMsg = "Action non autorisée.";
        } else if (err?.status === 404) {
          this.errorMsg = "Utilisateur introuvable.";
        } else {
          this.errorMsg = "Une erreur est survenue lors de la mise à jour.";
        }
      },
    });
  }

  // --- suppression du compte ---
  confirmDelete(): void {
    if (!this.user) return;

    this.clearMessages();
    this.deleting = true;

    this.api.deleteMyAccount(this.user.id).subscribe({
      next: () => {
        this.deleting = false;
        this.pub.logout();
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.deleting = false;
        if (err?.status === 403) {
          this.errorMsg = "Action non autorisée.";
        } else if (err?.status === 404) {
          this.errorMsg = "Utilisateur introuvable.";
        } else {
          this.errorMsg = "Impossible de supprimer le compte pour le moment.";
        }
      },
    });
  }
}
