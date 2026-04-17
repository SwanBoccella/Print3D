// ============================================================
// CONTATTI JS — FAQ Accordion
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const faqBtns = document.querySelectorAll('[data-faq]');

  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // Open first by default
  const firstFaq = document.querySelector('.faq-item');
  if (firstFaq) firstFaq.classList.add('open');

});
