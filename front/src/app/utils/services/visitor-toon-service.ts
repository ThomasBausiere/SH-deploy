import { Injectable } from '@angular/core';

const KEY = 'visitorSkillIds';

@Injectable({ providedIn: 'root' })
export class VisitorToonService {
  getSkillIds(): number[] {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.map(Number).filter(n => !Number.isNaN(n)) : [];
    } catch {
      return [];
    }
  }

  has(skillId: number): boolean {
    return new Set(this.getSkillIds()).has(skillId);
  }

  add(skillId: number): number[] {
    const set = new Set(this.getSkillIds());
    set.add(skillId);
    const arr = [...set];
    localStorage.setItem(KEY, JSON.stringify(arr));
    return arr;
  }

  remove(skillId: number): number[] {
    const set = new Set(this.getSkillIds());
    set.delete(skillId);
    const arr = [...set];
    localStorage.setItem(KEY, JSON.stringify(arr));
    return arr;
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
