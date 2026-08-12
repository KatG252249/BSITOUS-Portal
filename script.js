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
        "id": "advisory-1",
        "category": "urgent",
        "tag": "Urgent Update",
        "date": "August 12, 2026",
        "title": "Extension of Subject Add/Drop Period (ACE Form Submissions)",
        "content": "Please be advised that the submission of ACE Forms for schedule adjustments has been extended. Ensure all prerequisites are verified by your year-level student representatives before submitting to the Program Chair's office. Forms submitted without rep verification signatures will not be processed.",
        "attachments": [
          {
            "text": "PUP OUS Official Forms Page",
            "url": "https://www.pup.edu.ph/ous/forms",
            "icon": "file-text",
            "isExternal": true
          },
          {
            "text": "Book Advisor Sign-off",
            "url": "services.html#booking",
            "icon": "calendar",
            "isExternal": false
          }
        ]
      },
      {
        "id": "advisory-2",
        "category": "academic",
        "tag": "Academic Notice",
        "date": "August 8, 2026",
        "title": "Online LMS Credential Activation for First Year Students",
        "content": "All newly enrolled first-year BSIT students must activate their Open Distance Learning (ODL) LMS credentials. Verification emails containing temporary login details have been sent to your registered personal email addresses. Contact the ICT support representative if you have not received your account by August 15.",
        "attachments": [
          {
            "text": "Go to LMS Portal (odl.pup.edu.ph)",
            "url": "https://odl.pup.edu.ph",
            "icon": "external-link",
            "isExternal": true
          }
        ]
      },
      {
        "id": "advisory-3",
        "category": "org",
        "tag": "Student Org",
        "date": "August 5, 2026",
        "title": "BSIT Student Assembly: Tech Convergence 2026",
        "content": "The PUP OUS BSIT Student Organization invites all year levels to join the annual General Assembly. We will discuss program policies, online learning tips, and introduce this year's student representatives. Zoom credentials and links will be shared in your respective year-level chats.",
        "attachments": []
      },
      {
        "id": "advisory-4",
        "category": "academic",
        "tag": "Academic Notice",
        "date": "July 30, 2026",
        "title": "List of Available Bridging Courses for Non-IT Shifters",
        "content": "For students who shifted or transitioned into the BSIT program from non-IT fields, the evaluation list of recommended bridging courses is now uploaded. Please check your SIS and coordinate with the department evaluator for approval of courses before registration.",
        "attachments": [
          {
            "text": "Bridging FAQ",
            "url": "faq.html",
            "icon": "help-circle",
            "isExternal": false
          }
        ]
      }
    ],
    "milestones": [
      {
        "date": "August 1 - 25, 2026",
        "title": "Enrollment and Subject Registrations",
        "content": "Online registration via SIS. Late registration and manual adjustment of schedules (ACE forms) can be submitted for review. Direct coordination with student representatives for bridging queries is highly encouraged.",
        "icon": "user-check",
        "active": true
      },
      {
        "date": "September 28 - 30, 2026",
        "title": "Midterm Examination Week",
        "content": "Scheduled online testing and submission of major project milestones. Make sure to check the specific schedules assigned by professors for synchronously proctored assessments.",
        "icon": "pen-tool",
        "active": false
      },
      {
        "date": "November 14, 2026",
        "title": "Grade Finalization & Project Defenses",
        "content": "Final project evaluations, Capstone mock defenses, and grade reporting by the faculty. Ensure all outstanding compliance records and lab submissions are uploaded to the LMS.",
        "icon": "file-check-2",
        "active": false
      },
      {
        "date": "November 28, 2026",
        "title": "Clearance & Graduation Application",
        "content": "Submission of completion grades and administrative clearance sign-offs with the program chair for graduating students. Start of preparation for next semester curriculum advisories.",
        "icon": "award",
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
          <p>${adv.content}</p>
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

  // 3. Interactive Subject Checklist (Curriculum)
  const subjectCheckboxes = document.querySelectorAll('.checklist-table input[type="checkbox"]');
  
  if (subjectCheckboxes.length > 0) {
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
        updateChecklistProgress();
      });
    });
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
          faqItems.forEach(i => i.classList.remove('active'));
          
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
