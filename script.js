const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.getElementById('year');
const calculatorForm = document.querySelector('.calculator');
const calcResult = document.getElementById('calc-result');

// ── Enquiry Modal ─────────────────────────────────────────────────────────────
const enquiryModal   = document.getElementById('enquiry-modal');
const modalClose     = document.getElementById('modal-close');
const modalGotoForm  = document.getElementById('modal-goto-form');
const enquireBtns    = document.querySelectorAll('.enquire-btn');

function openModal() {
  enquiryModal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  enquiryModal.hidden = true;
  document.body.style.overflow = '';
}

if (enquiryModal) {
  enquireBtns.forEach((btn) => btn.addEventListener('click', openModal));

  modalClose.addEventListener('click', closeModal);

  // Click outside card closes modal
  enquiryModal.addEventListener('click', (e) => {
    if (e.target === enquiryModal) closeModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !enquiryModal.hidden) closeModal();
  });

  // "Fill the Form" → close modal + scroll to contact section
  modalGotoForm.addEventListener('click', () => {
    closeModal();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    });
  });
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (calculatorForm && calcResult) {
  calculatorForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const billValue = Number(document.getElementById('monthly-bill').value);
    const sunHours = Number(document.getElementById('sun-hours').value);

    if (!billValue || !sunHours || billValue < 0 || sunHours <= 0) {
      calcResult.textContent = 'Please enter valid numbers to estimate your savings.';
      return;
    }

    const estimatedCoverage = Math.min(0.82, 0.11 * sunHours);
    const monthlySavings = billValue * estimatedCoverage;
    const annualSavings = monthlySavings * 12;
    const inrFormatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    });

    calcResult.textContent = `Estimated savings: ${inrFormatter.format(monthlySavings)} / month (about ${inrFormatter.format(annualSavings)} annually).`;
  });
}


// ── Contact Form → Web3Forms ──────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');
const submitBtn   = document.getElementById('submit-btn');
const btnText     = document.getElementById('btn-text');
const btnLoader   = document.getElementById('btn-loader');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    formStatus.textContent  = '';
    formStatus.className    = '';

    const formData = new FormData(contactForm);
    const data     = Object.fromEntries(formData);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = '✅ Thank you! Your inquiry has been sent. We will get back to you shortly.';
        formStatus.className   = 'form-success';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      formStatus.textContent = '❌ Sorry, something went wrong. Please try again or email us directly at thepowersky77@gmail.com';
      formStatus.className   = 'form-error';
    } finally {
      submitBtn.disabled      = false;
      btnText.style.display   = 'inline';
      btnLoader.style.display = 'none';
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealElements.length) {
  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// ── Gallery Slideshow ─────────────────────────────────────────────────────────
const galleryTrack = document.getElementById('gallery-track');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryDotsContainer = document.getElementById('gallery-dots');

if (galleryTrack && galleryPrev && galleryNext && galleryDotsContainer) {
  const slides = galleryTrack.querySelectorAll('.gallery-slide');
  const slideCount = slides.length;
  let currentIndex = 0;

  // Create pagination dots
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('gallery-dot');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    galleryDotsContainer.appendChild(dot);
  });

  const dots = galleryDotsContainer.querySelectorAll('.gallery-dot');

  function updateDots(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  function goToSlide(index) {
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    
    // Calculate scroll position
    const slideWidth = galleryTrack.clientWidth;
    galleryTrack.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
    
    currentIndex = index;
    updateDots(index);
  }

  galleryPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
  galleryNext.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Sync active dot on manual scroll or swipe
  let scrollTimeout;
  galleryTrack.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPosition = galleryTrack.scrollLeft;
      const slideWidth = galleryTrack.clientWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slideCount) {
        currentIndex = newIndex;
        updateDots(currentIndex);
      }
    }, 50);
  });

  // Auto-play
  let autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000);

  // Pause on hover or touch
  const galleryTile = document.querySelector('.gallery-tile');
  if (galleryTile) {
    const pausePlay = () => clearInterval(autoPlayInterval);
    const resumePlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000);
    };

    galleryTile.addEventListener('mouseenter', pausePlay);
    galleryTile.addEventListener('mouseleave', resumePlay);
    galleryTile.addEventListener('touchstart', pausePlay, { passive: true });
    galleryTile.addEventListener('touchend', resumePlay, { passive: true });
  }
}
