/* Static passcode gate, shared by both adapters.
   This is a UI lock, not a security boundary — the comparison runs in the
   visitor's browser. See supabase/open-writes.sql for what that implies. */
const KEY = 'salinas.admin.session';
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'salinas';

const staff = { user: { email: 'staff' } };

export const gate = {
  async getSession() {
    try {
      return sessionStorage.getItem(KEY) ? staff : null;
    } catch {
      return null;
    }
  },
  async signIn({ password }) {
    if (password !== PASSCODE) throw new Error('Wrong passcode.');
    sessionStorage.setItem(KEY, '1');
    return staff;
  },
  async signOut() {
    sessionStorage.removeItem(KEY);
  }
};
