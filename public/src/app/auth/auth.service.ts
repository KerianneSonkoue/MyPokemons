import { Injectable } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}

  private get auth() {
    return this.supabaseService.client.auth;
  }

  register(email: string, password: string, username: string): Observable<any> {
    return from(
      this.auth.signUp({ email, password, options: { data: { username } } })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (data.user) {
          this.supabaseService.client.from('users').insert({
            id: data.user.id,
            email,
            username,
            created_at: new Date().toISOString()
          }).then();
        }
        return data;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(
      this.auth.signInWithPassword({ email, password })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }

  isLoggedIn(): Observable<boolean> {
    return from(this.auth.getSession()).pipe(
      map(({ data }) => !!data.session)
    );
  }

  getCurrentUser(): Observable<any> {
    return from(this.auth.getUser()).pipe(
      map(({ data }) => data.user)
    );
  }
}
