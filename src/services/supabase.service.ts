import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class SupabaseService {
    private supabase: SupabaseClient;
  
    constructor() {
      this.supabase = createClient(
        environment.supabaseUrl, 
        environment.supabaseKey
      );
    }

  // Authentifizierung
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async getCurrentUser() {
    return (await this.supabase.auth.getUser()).data.user;
  }

  // Kategorien-Methoden
  async getCategories() {
    const user = await this.getCurrentUser();
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return data;
  }

  async createCategory(category: any) {
    const user = await this.getCurrentUser();
    const { data, error } = await this.supabase
      .from('categories')
      .insert({ ...category, user_id: user?.id })
      .select();

    if (error) throw error;
    return data;
  }

  // Habits-Methoden
  async getHabits(): Promise<any[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        console.error('Benutzer nicht angemeldet');
        // Optional: Automatische Weiterleitung zur Anmeldung
        this.redirectToLogin();
        return [];
      }
  
      const { data, error } = await this.supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);
  
      if (error) {
        console.error('Supabase-Fehler:', error);
        return [];
      }
  
      return data || [];
    } catch (error) {
      console.error('Unerwarteter Fehler:', error);
      return [];
    }
  }

  private redirectToLogin() {
    // Implementieren Sie die Logik zur Weiterleitung zum Login
    // z.B. this.router.navigate(['/login'])
  }

  async getHabitEntries(habitId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('habit_entries')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Fehler beim Laden der Habit-Einträge:', error);
      throw error;
    }

    return data || [];
  }

  async createHabit(habitData: any) {
    try {
      // Holen Sie den aktuellen Benutzer
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Benutzer nicht angemeldet');
      }

      // Vollständige Habit-Daten mit Benutzer-ID
      const completeHabitData = {
        ...habitData,
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      // In Supabase speichern
      const { data, error } = await this.supabase
        .from('habits')
        .insert(completeHabitData)
        .select(); // Gibt die erstellte Gewohnheit zurück

      if (error) {
        console.error('Fehler beim Erstellen der Gewohnheit:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Fehler in createHabit:', error);
      throw error;
    }
  }

  async updateHabit(habitId: string, updates: any) {
    const { data, error } = await this.supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .select();

    if (error) throw error;
    return data;
  }

  // Habit Entries-Methoden
  async createHabitEntry(entry: any) {
    const user = await this.getCurrentUser();
    const { data, error } = await this.supabase
      .from('habit_entries')
      .insert({ ...entry, user_id: user?.id })
      .select();

    if (error) throw error;
    return data;
  }

  async deleteHabitEntry(entryId: string) {
    const { data, error } = await this.supabase
      .from('habit_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Fehler beim Löschen des Habit-Eintrags:', error);
      throw error;
    }

    return data;
  }

  // Notifications-Methoden
  async getNotifications() {
    const user = await this.getCurrentUser();
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_read', false);

    if (error) throw error;
    return data;
  }
}