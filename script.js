document.addEventListener('DOMContentLoaded', () => {

  /* --- Theme Toggle & LocalStorage Check --- */
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');

  // Check stored preference, default to dark
  if (storedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
      const isLight = document.documentElement.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  /* --- 1. Loader Overlay --- */
  const loaderOverlay = document.getElementById('loaderOverlay');
  window.addEventListener('load', () => {
    // Small delay for smooth transition
    setTimeout(() => {
      if (loaderOverlay) {
        loaderOverlay.classList.add('fade-out');
      }
    }, 600);
  });

  /* --- 2. Scroll Progress Bar --- */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrollPercentage}%`;
      }
    }
  });

  /* --- 3. Sticky Navbar & Shrink --- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('shrink');
      } else {
        navbar.classList.remove('shrink');
      }
    }
  });

  /* --- 4. Mobile Navigation Toggle --- */
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpened = mobileNavMenu.classList.contains('open');
      if (isOpened) {
        mobileNavMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileNavMenu.classList.add('open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- 5. Typing Text Effect --- */
  const typingTarget = document.getElementById('typingTarget');
  const phrases = [
    "Backend Systems",
    "API Development",
    "Database Engineering"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingTarget) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typingTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Handle end of typing a phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Brief pause before typing next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Init Typing Effect
  if (typingTarget) {
    typeEffect();
  }

  /* --- 6. Stats Counter Animation --- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1500; // Total duration in ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Easing out function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);

        stat.textContent = `${currentValue}+`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = `${target}+`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  /* --- 7. Skills Progress Bar Animation --- */
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  let skillsAnimated = false;

  function animateSkills() {
    progressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      bar.style.width = level;
    });
  }

  /* --- 8. Intersection Observer for Sections (Scroll Animations & Highlighting) --- */
  
  // Active nav highlighting observer options
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          if (href === activeId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // Scroll Animations Observer (Fades, Slides, etc.)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const scrollObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before entering viewport
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Trigger specific sub-animations
        if (entry.target.classList.contains('about-stats') && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
        }
        if (entry.target.classList.contains('skill-category-card') && !skillsAnimated) {
          skillsAnimated = true;
          animateSkills();
        }
        
        // Unobserve once animated
        observer.unobserve(entry.target);
      }
    });
  }, scrollObserverOptions);

  animateElements.forEach(elem => {
    scrollObserver.observe(elem);
  });

  /* --- 9. Contact Form Validation --- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Inputs
      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const subjectInput = document.getElementById('formSubject');
      const messageInput = document.getElementById('formMessage');

      // Error Targets
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const subjectError = document.getElementById('subjectError');
      const messageError = document.getElementById('messageError');

      let isValid = true;

      // Validate Name
      if (nameInput.value.trim() === '') {
        nameError.classList.add('active');
        nameInput.style.borderColor = 'var(--text-primary)';
        isValid = false;
      } else {
        nameError.classList.remove('active');
        nameInput.style.borderColor = '';
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.classList.add('active');
        emailInput.style.borderColor = 'var(--text-primary)';
        isValid = false;
      } else {
        emailError.classList.remove('active');
        emailInput.style.borderColor = '';
      }

      // Validate Subject
      if (subjectInput.value.trim() === '') {
        subjectError.classList.add('active');
        subjectInput.style.borderColor = 'var(--text-primary)';
        isValid = false;
      } else {
        subjectError.classList.remove('active');
        subjectInput.style.borderColor = '';
      }

      // Validate Message
      if (messageInput.value.trim() === '') {
        messageError.classList.add('active');
        messageInput.style.borderColor = 'var(--text-primary)';
        isValid = false;
      } else {
        messageError.classList.remove('active');
        messageInput.style.borderColor = '';
      }

      // Handle Submit Status
      if (isValid) {
        // Reset and show loading state
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        
        if (formStatus) {
          formStatus.className = "form-message-status";
          formStatus.textContent = "";
        }

        // Send request to Formspree action url
        const formAction = contactForm.getAttribute('action');
        const formData = new FormData(contactForm);

        fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;

          if (response.ok) {
            if (formStatus) {
              formStatus.classList.add('success');
              formStatus.textContent = "SUCCESS // MESSAGE HAS BEEN SENT SECURELY.";
            }
            contactForm.reset();
          } else {
            return response.json().then(data => {
              if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                throw new Error(data['errors'].map(error => error['message']).join(', '));
              } else {
                throw new Error('Form submission failed.');
              }
            });
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          if (formStatus) {
            formStatus.classList.add('error');
            formStatus.textContent = `ERROR // ${error.message.toUpperCase()}`;
          }
        });
      } else {
        if (formStatus) {
          formStatus.classList.add('error');
          formStatus.textContent = "ERROR // PLEASE RESOLVE HIGHLIGHTED FIELDS.";
        }
      }
    });
  }

  /* --- 10. Dynamic PDF Resume Generation --- */
  function downloadResumePDF() {
    // 1. Read details from the DOM
    const name = document.querySelector('.hero-name')?.innerText.trim().toUpperCase() || "GOHAR REHMAN";
    const title = document.querySelector('.hero-tagline')?.innerText.trim() || "Software Engineer";
    
    const email = document.querySelector('a[href^="mailto:"]')?.innerText.trim() || "goharrehmanfsd260@gmail.com";
    const linkedin = document.querySelector('a[href*="linkedin.com"]')?.innerText.trim() || "linkedin.com/in/iamgoharrehman";
    const website = document.querySelector('a[href*="github.com"]')?.innerText.trim() || "github.com/gohardev260";
    
    const summary = document.querySelector('.about-body')?.innerText.trim() || "";
    
    // Read skills
    let skillsString = "";
    const skillCards = document.querySelectorAll('.skill-category-card');
    skillCards.forEach(card => {
      const catName = card.querySelector('.skill-category-name')?.innerText.trim() || "";
      const skillNames = Array.from(card.querySelectorAll('.skill-name')).map(el => el.innerText.trim()).join(', ');
      if (catName && skillNames) {
        skillsString += `${catName}: ${skillNames}\n`;
      }
    });

    // Read experiences
    let experienceString = "";
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      const role = item.querySelector('.timeline-role')?.innerText.trim() || "";
      const date = item.querySelector('.timeline-date')?.innerText.trim() || "";
      const company = item.querySelector('.timeline-company')?.innerText.trim() || "";
      const desc = item.querySelector('.timeline-desc')?.innerText.trim() || "";
      
      if (role) {
        experienceString += `${role}  |  ${company}  (${date})\n${desc}\n`;
        const listItems = item.querySelectorAll('.timeline-detail-item');
        listItems.forEach(li => {
          experienceString += `- ${li.innerText.trim()}\n`;
        });
        experienceString += "\n";
      }
    });

    // Read education
    let educationString = "";
    const eduCards = document.querySelectorAll('.education-card');
    eduCards.forEach(card => {
      const school = card.querySelector('.education-school')?.innerText.trim() || "";
      const degree = card.querySelector('.education-degree')?.innerText.trim() || "";
      const year = card.querySelector('.education-year')?.innerText.trim() || "";
      if (school) {
        educationString += `${degree}\n${school}  (${year})\n\n`;
      }
    });

    // 2. Wrap text helper
    function wrapText(text, maxChars) {
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = "";
      
      words.forEach(word => {
        if ((currentLine + " " + word).trim().length <= maxChars) {
          currentLine = (currentLine + " " + word).trim();
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    }

    // 3. Keep Y position
    let currentY = 730;

    function drawText(text, x, size, font = "/F1", leading = 14, maxChars = 85) {
      let block = `BT\n${font} ${size} Tf\n${x} ${currentY} Td\n${leading} TL\n`;
      const lines = text.split('\n');
      let lineCount = 0;
      lines.forEach(line => {
        const wrapped = wrapText(line, maxChars);
        wrapped.forEach(l => {
          const escaped = l.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
          block += `(${escaped}) Tj T*\n`;
          lineCount++;
        });
      });
      block += "ET\n";
      currentY -= (lineCount * leading);
      return block;
    }

    // Compile content stream
    let content = "";
    
    // Header
    content += drawText(name, 54, 20, "/F2", 24);
    currentY -= 6;
    content += drawText(title, 54, 11, "/F1", 14);
    currentY -= 4;
    const contactLine = `Email: ${email}  |  LinkedIn: ${linkedin}  |  Website: ${website}`;
    content += drawText(contactLine, 54, 9, "/F1", 12);
    
    // Horizontal rule
    content += `54 ${currentY} m 558 ${currentY} l s\n`;
    currentY -= 20;

    // Professional Summary
    content += drawText("PROFESSIONAL SUMMARY", 54, 12, "/F2", 16);
    currentY -= 4;
    content += drawText(summary, 54, 10, "/F1", 14);
    currentY -= 15;

    // Technical Skills
    content += drawText("TECHNICAL SKILLS", 54, 12, "/F2", 16);
    currentY -= 4;
    content += drawText(skillsString, 54, 10, "/F1", 13);
    currentY -= 15;

    // Experience
    content += drawText("WORK EXPERIENCE", 54, 12, "/F2", 16);
    currentY -= 4;
    content += drawText(experienceString, 54, 10, "/F1", 13);
    currentY -= 15;

    // Education
    content += drawText("EDUCATION", 54, 12, "/F2", 16);
    currentY -= 4;
    content += drawText(educationString, 54, 10, "/F1", 13);

    // 4. Construct PDF objects
    const streamLen = content.length;
    const obj4 = `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${content}\nendstream\nendobj\n`;

    const objs = [
      "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n",
      obj4,
      "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
      "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n"
    ];

    const headerPdf = "%PDF-1.4\n";
    const offsets = [];
    let currentOffset = headerPdf.length;

    let pdfStr = headerPdf;
    for (let i = 0; i < objs.length; i++) {
      offsets.push(currentOffset);
      pdfStr += objs[i];
      currentOffset += objs[i].length;
    }

    const xrefStart = pdfStr.length;
    let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 0; i < offsets.length; i++) {
      xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }

    pdfStr += xref;

    const trailer = `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    pdfStr += trailer;

    // Convert to Uint8Array for binary compatibility
    const buf = new Uint8Array(pdfStr.length);
    for (let i = 0; i < pdfStr.length; i++) {
      buf[i] = pdfStr.charCodeAt(i);
    }

    const blob = new Blob([buf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Gohar_Rehman_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const downloadBtn = document.getElementById('downloadResumeBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadResumePDF();
    });
  }
});
