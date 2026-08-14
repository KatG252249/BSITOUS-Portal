/* 
========================================================================
   PUP OUS BSIT STUDENT PORTAL - Core Javascript Logic
   Handles: Nav menus, tickers, curriculum checklist, FAQs, tab switching,
            and dynamic content fetching from data.json
========================================================================
*/

document.addEventListener('DOMContentLoaded', async () => {
  // --- Centralized Data Store & Fallback (for offline/CORS file:// preview) ---
  let portalData = null;

  const fallbackData = {
    "alerts": [
      {
        "text": "Opening of Academic Year 2026-2027 will start on Aug. 17, 2026.",
        "link": "announcements.html",
        "linkLabel": "Read More",
        "icon": "alert-circle"
      },
      {
        "text": "Adjustment period will be held from Aug. 17 to Sept. 17, 2026.",
        "link": "index.html#key-dates",
        "linkLabel": "View Calendar",
        "icon": "calendar"
      },
      {
        "text": "\"The Source Code\" Issue #8 Org Newsletter is now downloadable.",
        "link": "announcements.html#newsletter",
        "linkLabel": "Get PDF",
        "icon": "book-open"
      }
    ],
    "featuredEvent": {
      "title": "Opening of the new academic year",
      "date": "August 17, 2026",
      "description": "The new academic year will start on this date."
    },
    "announcements": [
      {
        "id": "advisory-id-processing",
        "category": "academic",
        "tag": "Service Advisory",
        "date": "August 14, 2026",
        "title": "Guidelines for Rescheduled OUS Freshmen ID Processing (AY 2026-2027)",
        "content": "<p>Please be advised of the guidelines and options regarding the rescheduled ID processing for Open University System freshmen starting <strong>August 25, 2026 onwards</strong>:</p><ul><li><strong>Walk-in ID Processing:</strong> Process your ID only on the assigned date indicated on your rescheduled stub. Present your Route and Approval Sheet (RAS Form), Certificate of Registration (COR), and stub to staff/volunteers upon entry.</li><li><strong>Online ID Processing:</strong> Students who wish to process their ID online may send the required documents to <a href=\"mailto:studentsservices@pup.edu.ph\">studentsservices@pup.edu.ph</a>. Attach a scanned copy of your COR, a 2x2 ID picture (white background), and your e-signature. (For representative claims, submit an authorization letter).</li><li><strong>Claiming & Pick-up:</strong> You will be notified of your assigned ID printing or pick-up schedule. Present original RAS and COR upon claiming.</li><li><strong>Location & Schedule:</strong> ID picture-taking, printing, and claiming will take place at Room 204, Charlie Del Rosario Bldg., PUP Sta. Mesa from 8:00 AM to 8:00 PM, Tuesdays to Fridays.</li></ul>",
        "attachments": [
          {
            "text": "Email Student Services",
            "url": "mailto:studentsservices@pup.edu.ph",
            "icon": "mail",
            "isExternal": true
          }
        ]
      }
    ],
    "milestones": [
      {
        "date": "August 17, 2026",
        "title": "Start of Academic Year 2026-2027",
        "content": "Official start of classes and academic activities for the first semester of AY 2026-2027.",
        "icon": "book-open",
        "active": true
      },
      {
        "date": "August 17 - September 17, 2026",
        "title": "Schedule Adjustment Period",
        "content": "Submission of ACE Forms for schedule adjustments, course additions, and program section changes.",
        "icon": "calendar",
        "active": false
      }
    ]
  };

  // Fetch from data.json or fallback
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      portalData = await res.json();
    } else {
      throw new Error('Data fetch response not OK');
    }
  } catch (e) {
    console.warn("Could not load data.json (CORS restriction or network issue). Using built-in fallback data.", e);
    portalData = fallbackData;
  }

  // --- Dynamic Content Rendering ---

  // 1. Render Alert Tickers
  const tickerContainer = document.querySelector('.ticker-content');
  if (tickerContainer && portalData.alerts) {
    tickerContainer.innerHTML = portalData.alerts.map(alert => `
      <span class="ticker-item">
        <i data-lucide="${alert.icon}" style="width:14px; height:14px; margin-right:5px; vertical-align:middle;"></i>
        ${alert.text}
        <a href="${alert.link}">${alert.linkLabel}</a>
      </span>
    `).join('');
  }

  // 2. Render Homepage Milestones & Featured Event (Hero Badge)
  const heroBadgeContainer = document.querySelector('.hero-badge-body');
  if (heroBadgeContainer && portalData.featuredEvent) {
    heroBadgeContainer.innerHTML = `
      <strong>${portalData.featuredEvent.title}</strong>
      <span>${portalData.featuredEvent.date}</span>
      <p style="font-size:0.8rem; margin-top:0.5rem; opacity:0.8;">${portalData.featuredEvent.description}</p>
    `;
  }

  const timelineContainer = document.querySelector('.timeline');
  if (timelineContainer && portalData.milestones) {
    timelineContainer.innerHTML = portalData.milestones.map(m => `
      <div class="timeline-item ${m.active ? 'active' : ''}">
        <div class="timeline-badge">
          <i data-lucide="${m.icon}"></i>
        </div>
        <div class="timeline-content">
          <span class="timeline-date">${m.date}</span>
          <h3>${m.title}</h3>
          <p>${m.content}</p>
        </div>
      </div>
    `).join('');
  }

  // 3. Render Announcements Page Advisories
  const advisoriesContainer = document.querySelector('.advisories-list');
  if (advisoriesContainer && portalData.announcements) {
    advisoriesContainer.innerHTML = portalData.announcements.map(adv => {
      const attachmentsHTML = adv.attachments && adv.attachments.length > 0
        ? `<div class="advisory-attachments">
            ${adv.attachments.map(att => `
              <a href="${att.url}" class="attachment-link" ${att.isExternal ? 'target="_blank" rel="noopener"' : ''}>
                <i data-lucide="${att.icon}" style="width:14px; height:14px; ${att.icon === 'file-text' ? 'color:#ef4444;' : (att.icon === 'calendar' ? 'color:var(--color-royal);' : '')}"></i>
                ${att.text}
              </a>
            `).join('')}
           </div>`
        : '';

      return `
        <div class="advisory-card ${adv.category}" data-category="${adv.category}">
          <div class="advisory-meta">
            <span class="advisory-tag">${adv.tag}</span>
            <span class="advisory-date"><i data-lucide="calendar" style="width:14px; height:14px;"></i> ${adv.date}</span>
          </div>
          <h3>${adv.title}</h3>
          <div class="advisory-body-text">${adv.content}</div>
          ${attachmentsHTML}
        </div>
      `;
    }).join('');
  }

  // Initialize Lucide Icons after dynamic elements are loaded
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Interactive Features & Controls ---

  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
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
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const targetEl = document.getElementById(targetTab);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });
  }


  // 4. Accordion Toggle (For FAQ page)
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // 4b. Collapsible Categories Toggle (For FAQ page)
  const faqCategories = document.querySelectorAll('.faq-category');
  
  if (faqCategories.length > 0) {
    faqCategories.forEach(category => {
      const trigger = category.querySelector('.category-trigger');
      
      if (trigger) {
        trigger.addEventListener('click', () => {
          category.classList.toggle('active');
        });
      }
    });
  }

  // 5. Search Filtering (For Announcements / News page)
  const searchInput = document.getElementById('advisory-search');
  const filterTabs = document.querySelectorAll('.filter-tab');

  if (searchInput || filterTabs.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    const filterAdvisories = () => {
      const advisoryCards = document.querySelectorAll('.advisory-card');
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
