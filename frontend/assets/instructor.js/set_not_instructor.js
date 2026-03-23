

function toast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, { position:'fixed', bottom:'22px', right:'22px', padding:'10px 18px', borderRadius:'8px', background:'#1a9e8f', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:'600', boxShadow:'0 4px 14px rgba(0,0,0,.15)', opacity:'0', transform:'translateY(10px)', transition:'all .25s', zIndex:'9999' });
  document.body.appendChild(t);
  
  requestAnimationFrame(function() { requestAnimationFrame(function() { t.style.opacity='1'; t.style.transform='translateY(0)'; }); });
  setTimeout(function() { t.style.opacity='0'; setTimeout(function() { t.remove(); }, 300); }, 2500);
}
const saveBtn = document.getElementById("btn-save");
const saveConfirmModal = document.getElementById("saveConfirmModal");
const cancelSaveBtn = document.getElementById("cancelSaveBtn");
const confirmSaveBtn = document.getElementById("confirmSaveBtn");

function openSaveModal() {
  saveConfirmModal.classList.add("show");
}

function closeSaveModal() {
  saveConfirmModal.classList.remove("show");
}

function saveChanges() {
  // Put your real save logic here
  setTimeout(function() { btn.textContent = '💾 Save Changes'; btn.style.background = ''; }, 2000);
  toast('Settings saved');
}

saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  openSaveModal();
});

cancelSaveBtn.addEventListener("click", function () {
  closeSaveModal();
});

confirmSaveBtn.addEventListener("click", function () {
  closeSaveModal();
  saveChanges();
});

// Optional: close when clicking outside the modal
saveConfirmModal.addEventListener("click", function (e) {
  if (e.target === saveConfirmModal) {
    closeSaveModal();
  }
});
document.getElementById("profileBtn").addEventListener("click", function () {
    window.location.href = "profile_instructor.html";
});
