/**
 * VEDAPEETAM — enhanced.js
 * Handles:
 *  1. Language tab switching (4 tabs)
 *  2. PDF viewer modal (click any book card / read button)
 */

(function () {
  "use strict";

  /* ─── TAB SWITCHING ─────────────────────────────────────── */
  const tabs        = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('[data-tab-content]');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = document.querySelector(tab.dataset.tabTarget);
      if (!target) return;

      tabContents.forEach(function (tc) { tc.classList.remove('active'); });
      tabs.forEach(function (t)        { t.classList.remove('active');  });

      tab.classList.add('active');
      target.classList.add('active');
    });
  });

  /* ─── PDF VIEWER ────────────────────────────────────────── */
  const modal      = document.getElementById('pdf-modal');
  const iframe     = document.getElementById('pdf-iframe');
  const openTabBtn = document.getElementById('pdf-open-tab');
  const titleEl    = document.getElementById('pdf-book-title');
  const closeBtn   = document.getElementById('pdf-close');
  const loading    = document.getElementById('pdf-loading');

  /**
   * openPDF(pdfPath, bookTitle)
   * Opens the modal with the given PDF path.
   * If no PDF exists yet, shows a friendly message.
   */
  function openPDF(pdfPath, bookTitle) {
    // Update title and "open in tab" link
    titleEl.textContent = bookTitle || 'Book Reader';
    openTabBtn.href     = pdfPath;

    // Show loading state
    loading.classList.remove('hidden');
    iframe.src = '';

    // Open modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Load PDF
    iframe.onload = function () {
      loading.classList.add('hidden');
    };
    iframe.onerror = function () {
      loading.innerHTML = '<p style="color:#8B0000;padding:20px;text-align:center;">Could not load PDF.<br>Please add the PDF file to the <strong>pdfs/</strong> folder.</p>';
    };

    // A small delay so modal animation plays first
    setTimeout(function () {
      iframe.src = pdfPath;
    }, 150);
  }

  function closePDF() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      iframe.src = '';
    }, 300);
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closePDF);
  }

  // Click outside container to close
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePDF();
    });
  }

  // ESC key to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePDF();
  });

  /* ─── BOOK CARD CLICK (any click on .book-card) ─────────── */
  document.addEventListener('click', function (e) {
    // "Read Now" / "Read" button inside a card
    const readBtn = e.target.closest('.read-book-btn');
    if (readBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card  = readBtn.closest('[data-pdf]');
      if (card) openPDF(card.dataset.pdf, card.dataset.title);
      return;
    }

    // Inline read button (Best Selling section)
    const inlineBtn = e.target.closest('.read-book-btn-inline');
    if (inlineBtn) {
      e.preventDefault();
      openPDF(inlineBtn.dataset.pdf, inlineBtn.dataset.title);
      return;
    }

    // Clicking the card itself (but NOT on a button inside)
    const card = e.target.closest('.book-card[data-pdf]');
    if (card && !e.target.closest('button, a')) {
      openPDF(card.dataset.pdf, card.dataset.title);
    }
  });

})();
