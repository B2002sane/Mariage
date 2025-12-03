import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor() {}

  // Lire une invitation avec son token
  async getInviteByToken(token: string) {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();
    return { data, error };
  }

  // Marquer l'invitation comme utilisée (seulement si vigile connecté)
  async validateInvite(token: string) {
    const { data, error } = await supabase
      .from('invites')
      .update({ used: true })
      .eq('token', token)
      .select()
      .single();
    return { data, error };
  }

  // Connexion du vigile
  async loginGuard(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  // Récupérer tous les invités (pour les vigiles)
  async getAllInvites() {
    const { data, error } = await supabase
      .from('invites')
      .select('*');
    return { data, error };
  }
}
