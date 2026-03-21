
// ===== CUSTOM CONFIRMATION MODAL =====
function showConfirmModal(title, message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'confirm-modal-overlay';
  modal.innerHTML = `
    <div class="confirm-modal">
      <div class="confirm-icon">✓</div>
      <h2 class="confirm-title">${title}</h2>
      <p class="confirm-message">${message}</p>
      <div class="confirm-buttons">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-confirm">Confirm</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const btnConfirm = modal.querySelector('.btn-confirm');
  const btnCancel = modal.querySelector('.btn-cancel');
  
  btnConfirm.addEventListener('click', function() {
    modal.remove();
    onConfirm();
  });
  
  btnCancel.addEventListener('click', function() {
    modal.remove();
  });
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Accept / Reject requests WITH CONFIRMATION
document.querySelectorAll('.btn-accept, .btn-reject').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var id = btn.getAttribute('data-id');
    var item = document.getElementById(id);
    var isAccept = btn.classList.contains('btn-accept');
    var studentName = btn.getAttribute('data-student');
    var projectName = btn.getAttribute('data-project');
    
    // Show custom confirmation modal
    var title = isAccept ? 'Confirm Application' : 'Confirm Rejection';
    var message = isAccept
      ? `The project leader will review ${studentName}'s profile and skills before accepting or declining your request.`
      : `Are you sure you want to REJECT ${studentName}'s request for ${projectName}?`;
    
    showConfirmModal(title, message, function() {
      item.style.opacity   = '0';
      item.style.transform = 'translateX(' + (isAccept ? '20px' : '-20px') + ')';

      setTimeout(function() {
        item.remove();
        showToast(isAccept ? '✓ Request accepted' : '✗ Request rejected', isAccept ? 'green' : 'red');
      }, 300);
    });
  });
});

document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});


// Availability toggle WITH CONFIRMATION
document.querySelectorAll('.toggle-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var group = btn.getAttribute('data-group');
    var val = btn.getAttribute('data-val');
    var groupName = group === 'tubitak' ? 'TÜBİTAK' : 'Teknofest';
    var statusText = val === 'available' ? '✓ Available' : '✗ Unavailable';
    
    // Show custom confirmation modal
    var message = `Are you sure you want to set ${groupName} to ${statusText}?`;
    
    showConfirmModal('Confirm Availability', message, function() {
      document.querySelectorAll('[data-group="' + group + '"]').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      showToast('✓ Availability updated to ' + statusText, 'green');
    });
  });
});

// View Requests button scrolls to requests card
document.getElementById('btn-view').addEventListener('click', function() {
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
});

// Toast
function showToast(msg, color) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '11px 20px', borderRadius: '8px',
    background: color === 'green' ? '#16a34a' : '#dc2626',
    color: '#fff', fontFamily: "'DM Sans',sans-serif",
    fontSize: '13px', fontWeight: '600',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    opacity: '0', transform: 'translateY(10px)',
    transition: 'all 0.25s', zIndex: '9999'
  });
  document.body.appendChild(t);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  });
  setTimeout(function() {
    t.style.opacity = '0';
    setTimeout(function() { t.remove(); }, 300);
  }, 2800);
}
