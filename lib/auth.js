// lib/auth.js — localStorage-based auth, zero dependencies

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    if (typeof window !== 'undefined') this._hydrate();
  }

  _hydrate() {
    try {
      const raw = localStorage.getItem('gpb_user');
      if (raw) this.currentUser = JSON.parse(raw);
    } catch {}
  }

  _validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  _getUsers() {
    try { return JSON.parse(localStorage.getItem('gpb_users') || '[]'); } catch { return []; }
  }

  _saveUsers(users) {
    localStorage.setItem('gpb_users', JSON.stringify(users));
  }

  _setSession(user) {
    this.currentUser = user;
    if (typeof window !== 'undefined') localStorage.setItem('gpb_user', JSON.stringify(user));
    this._notify();
  }

  _notify() {
    this.listeners.forEach(fn => { try { fn(this.currentUser); } catch {} });
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => { this.listeners = this.listeners.filter(f => f !== callback); };
  }

  getCurrentUser() { return this.currentUser; }
  isAuthenticated() { return !!this.currentUser; }

  async register(email, password, name) {
    if (!this._validateEmail(email)) throw new Error('Invalid email address');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const users = this._getUsers();
    if (users.find(u => u.email === email)) throw new Error('Account already exists with this email');
    const user = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      email,
      name: (name || '').trim() || email.split('@')[0],
      password: btoa(unescape(encodeURIComponent(email + '::' + password))),
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    this._saveUsers(users);
    const session = { id: user.id, email: user.email, name: user.name, plan: user.plan, createdAt: user.createdAt };
    this._setSession(session);
    return session;
  }

  async login(email, password) {
    if (!this._validateEmail(email)) throw new Error('Invalid email address');
    const users = this._getUsers();
    const hash = btoa(unescape(encodeURIComponent(email + '::' + password)));
    const user = users.find(u => u.email === email && u.password === hash);
    if (!user) throw new Error('Invalid email or password');
    const session = { id: user.id, email: user.email, name: user.name, plan: user.plan, createdAt: user.createdAt };
    this._setSession(session);
    return session;
  }

  async logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') localStorage.removeItem('gpb_user');
    this._notify();
  }

  async updateProfile(updates) {
    if (!this.currentUser) throw new Error('Not authenticated');
    const users = this._getUsers();
    const idx = users.findIndex(u => u.id === this.currentUser.id);
    if (idx !== -1 && updates.name) users[idx].name = updates.name.trim();
    this._saveUsers(users);
    const session = { ...this.currentUser, name: updates.name || this.currentUser.name };
    this._setSession(session);
    return session;
  }
}

const auth = new AuthManager();
export default auth;
