/* 
========================================================================
   PUP OUS BSIT STUDENT PORTAL - Core Javascript Logic
   Handles: Nav menus, tickers, curriculum checklist, FAQs, tab switching
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Update menu icon if Lucide is loaded
      const icon = navToggle.querySelector('i');
      if (icon && typeof lucide !== 'undefined') {
        const isOpened = navLinks.classList.contains('active');
        icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
        lucide.createIcons();
      }
    });
  }

  // 2. Tab Switching (For Academics page year levels)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active from all buttons & contents
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active to current
        btn.classList.add('active');
        const targetEl = document.getElementById(targetTab);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });
  }

  // 3. Interactive Subject Checklist (Curriculum)
  const subjectCheckboxes = document.querySelectorAll('.checklist-table input[type="checkbox"]');
  
  if (subjectCheckboxes.length > 0) {
    // Load saved checklist status from localStorage
    subjectCheckboxes.forEach((checkbox, idx) => {
      const isChecked = localStorage.getItem(`bsit_subject_${idx}`) === 'true';
      checkbox.checked = isChecked;
      
      const row = checkbox.closest('tr');
      if (row) {
        if (isChecked) {
          row.classList.add('completed');
        } else {
          row.classList.remove('completed');
        }
      }
      
      // Add event listener for changes
      checkbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        localStorage.setItem(`bsit_subject_${idx}`, checked);
        
        if (row) {
          if (checked) {
            row.classList.add('completed');
          } else {
            row.classList.remove('completed');
          }
        }
        
        // Update curriculum progress metric if UI exists
        updateChecklistProgress();
      });
    });
    
    // Initial progress computation
    updateChecklistProgress();
  }

  function updateChecklistProgress() {
    const totalSubjects = subjectCheckboxes.length;
    const completedSubjects = Array.from(subjectCheckboxes).filter(cb => cb.checked).length;
    const progressText = document.getElementById('checklist-progress-text');
    const progressBar = document.getElementById('checklist-progress-bar');
    
    if (progressText && totalSubjects > 0) {
      const percentage = Math.round((completedSubjects / totalSubjects) * 100);
      progressText.textContent = `${completedSubjects} of ${totalSubjects} Completed (${percentage}%)`;
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
    }
  }

  // 4. Accordion Toggle (For FAQ page)
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Collapse all other items
          faqItems.forEach(i => i.classList.remove('active'));
          
          // Toggle current
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // 5. Search Filtering (For Announcements / News page)
  const searchInput = document.getElementById('advisory-search');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const advisoryCards = document.querySelectorAll('.advisory-card');

  if (advisoryCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    const filterAdvisories = () => {
      advisoryCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const text = card.querySelector('p').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        
        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        const matchesSearch = title.includes(searchQuery) || text.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterAdvisories();
      });
    }

    if (filterTabs.length > 0) {
      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          currentCategory = tab.getAttribute('data-filter');
          filterAdvisories();
        });
      });
    }
  }

  // 6. Simple Email Copy Utility (For Directory Page)
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  if (copyEmailBtns.length > 0) {
    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> Copied!';
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          setTimeout(() => {
            btn.innerHTML = originalText;
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }, 2000);
        });
      });
    });
  }
});
