document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin(['student']);
  if (!user) return;

  // Avatar initials
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const parts = user.full_name.trim().split(' ');
    avatar.textContent = parts.length >= 2 ? parts[0][0] + parts[parts.length-1][0] : parts[0].slice(0,2);
  }

  const list = document.getElementById('annList');

  // ── Category → filter key + badge mapping ───────────────────
  function categoryInfo(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('teknofest')) return { f: 'teknofest', badge: `<span class="badge b-teknofest">TEKNOFEST</span>`, emoji: '🚀' };
    if (n.includes('tubitak'))   return { f: 'tubitak',   badge: `<span class="badge b-tubitak">TÜBİTAK</span>`,   emoji: '🔬' };
    if (n.includes('course'))    return { f: 'platform',  badge: '',                                                emoji: '📚' };
    return { f: 'platform', badge: '', emoji: '⬡' };
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days > 13)  return `${Math.floor(days/7)} weeks ago`;
    if (days >= 1)  return `${days} day${days>1?'s':''} ago`;
    if (hours >= 1) return `${hours} hour${hours>1?'s':''} ago`;
    return `${mins} min ago`;
  }

  // ── Load announcements ───────────────────────────────────────
  async function loadAnnouncements() {
    list.innerHTML = `<div style="padding:40px;text-align:center;color:var(--t3)">Loading…</div>`;
    try {
      const anns = await Announcements.getAll();

      if (!anns.length) {
        list.innerHTML = `
          <div style="padding:60px;text-align:center;color:var(--t3)">
            <div style="font-size:2.5rem;margin-bottom:10px">📢</div>
            <h3>No announcements yet</h3>
            <p>Check back later for platform updates and news.</p>
          </div>`;
        return;
      }

      list.innerHTML = anns.map((a, i) => {
        const { f, badge, emoji } = categoryInfo(a.category_name);
        const dateFormatted = new Date(a.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const ago = timeAgo(a.published_at);
        const hasDeadline = a.deadline;
        const deadlineStr = hasDeadline
          ? new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
          : null;

        // Mark first two as unread visually
        const unreadClass = i < 2 ? ' unread' : '';
        const unreadDot   = i < 2 ? '<div class="unread-dot"></div>' : '';

        return `
          <div class="ann-card${unreadClass} au" data-f="${f}${hasDeadline ? ' deadline' : ''}">
            <div class="ann-head">
              <div class="ann-head-l">
                <div class="ann-emoji">${emoji}</div>
                <div class="ann-meta">
                  <h4>${a.title}</h4>
                  <div class="ann-info">
                    ${badge}${badge ? ' · ' : ''}${deadlineStr ? `Deadline: ${deadlineStr} · ` : ''}${dateFormatted} · ${ago}
                  </div>
                </div>
              </div>
              ${unreadDot}
            </div>
            <p class="ann-body">${a.description}</p>
            ${a.posted_by ? `<div class="ann-tags"><span class="chip">📌 ${a.posted_by}</span></div>` : ''}
          </div>`;
      }).join('');

      // Mark as read on click
      list.querySelectorAll('.ann-card').forEach(card => {
        card.addEventListener('click', () => {
          card.classList.remove('unread');
          card.querySelector('.unread-dot')?.remove();
        });
      });

    } catch(err) {
      list.innerHTML = `<div style="padding:20px;color:var(--red)">Error loading announcements: ${err.message}</div>`;
    }
  }

  // ── Filter buttons ───────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.f;
      document.querySelectorAll('.ann-card').forEach(card => {
        card.style.display = f === 'all' || card.dataset.f.includes(f) ? '' : 'none';
      });
    });
  });

  // ── Sidebar & notifications ───────────────────────────────────
  const burg = document.getElementById('burg'), sb = document.getElementById('sb');
  burg?.addEventListener('click', () => sb?.classList.toggle('open'));
  const nBtn = document.getElementById('nBtn'), nPanel = document.getElementById('nPanel');
  nBtn?.addEventListener('click', e => { e.stopPropagation(); nPanel?.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (sb?.classList.contains('open') && !sb.contains(e.target) && e.target !== burg) sb.classList.remove('open');
    if (nPanel && !nPanel.contains(e.target) && e.target !== nBtn) nPanel.classList.remove('open');
  });

  // ── Initial load ──────────────────────────────────────────────
  loadAnnouncements();
});