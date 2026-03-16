// ── NOTIFICATIONS SHARED ──────────────────────────────
// يشتغل تلقائياً في أي صفحة فيها bellBtn + notif-dropdown

document.addEventListener('DOMContentLoaded', function () {

  var bell     = document.getElementById('bellBtn');
  var dropdown = document.getElementById('notif-dropdown');

  if (!bell || !dropdown) return; // لو الصفحة ما فيها الأيقونة

  // فتح / إغلاق عند الضغط على الجرس
  bell.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // إغلاق عند الضغط خارج الـ dropdown
  document.addEventListener('click', function () {
    dropdown.classList.remove('open');
  });

  // منع الإغلاق عند الضغط داخل الـ dropdown
  dropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });

});
