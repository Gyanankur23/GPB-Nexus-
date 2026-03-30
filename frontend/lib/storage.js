// lib/storage.js — unified localStorage data layer

class StorageManager {
  _get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  }
  _set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  // ── Roadmaps ──────────────────────────────
  async getAllRoadmaps() { return this._get('gpb_roadmaps', []); }
  async getRoadmap(id) {
    const all = await this.getAllRoadmaps();
    return all.find(r => r.id === id) || null;
  }
  async seedRoadmaps(roadmaps) { this._set('gpb_roadmaps', roadmaps); }

  // ── Quizzes ───────────────────────────────
  async getQuiz(id) {
    const all = this._get('gpb_quizzes', []);
    return all.find(q => q.id === id) || null;
  }
  async seedQuizzes(quizzes) { this._set('gpb_quizzes', quizzes); }

  // ── Quiz Attempts ─────────────────────────
  async addQuizAttempt(attempt) {
    const attempts = this._get('gpb_attempts', []);
    const record = { id: 'att_' + Date.now(), ...attempt, createdAt: new Date().toISOString() };
    attempts.push(record);
    this._set('gpb_attempts', attempts);
    return record;
  }
  async getQuizAttempts(userId) {
    return this._get('gpb_attempts', []).filter(a => a.userId === userId);
  }
  async getPassedAttempts(userId) {
    return (await this.getQuizAttempts(userId)).filter(a => a.passed === true);
  }
  async getBestAttempt(userId, roadmapId) {
    const attempts = (await this.getQuizAttempts(userId)).filter(a => a.roadmapId === roadmapId);
    if (!attempts.length) return null;
    return attempts.reduce((best, a) => a.score > best.score ? a : best, attempts[0]);
  }
  async getAttemptCount(userId, roadmapId) {
    return (await this.getQuizAttempts(userId)).filter(a => a.roadmapId === roadmapId).length;
  }

  // ── Certificates ──────────────────────────
  async saveCertificate(cert) {
    const certs = this._get('gpb_certificates', []);
    const existing = certs.findIndex(c => c.userId === cert.userId && c.roadmapId === cert.roadmapId);
    if (existing >= 0) { certs[existing] = { ...certs[existing], ...cert }; }
    else { certs.push({ id: 'cert_' + Date.now(), ...cert, issuedAt: new Date().toISOString() }); }
    this._set('gpb_certificates', certs);
  }
  async getCertificate(userId, roadmapId) {
    return this._get('gpb_certificates', []).find(c => c.userId === userId && c.roadmapId === roadmapId) || null;
  }
  async getUserCertificates(userId) {
    return this._get('gpb_certificates', []).filter(c => c.userId === userId);
  }

  // ── Init ──────────────────────────────────
  isSeeded() { return this._get('gpb_roadmaps', []).length > 0; }
}

const storage = new StorageManager();
export default storage;
