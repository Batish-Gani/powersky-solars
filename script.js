const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.getElementById('year');
const calculatorForm = document.querySelector('.calculator');
const calcResult = document.getElementById('calc-result');
const liveChatButton = document.querySelector('.live-chat');

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

    calcResult.textContent = `Estimated savings: $${monthlySavings.toFixed(2)} / month (about $${annualSavings.toFixed(2)} annually).`;
  });
}

if (liveChatButton) {
  liveChatButton.addEventListener('click', () => {
    alert('Live chat is currently offline. Please message us on WhatsApp or submit the inquiry form.');
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
