/* ==========================================================================
   Aurelia Academy - Client-side Interactivity Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navigation Header Scroll Effect
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check on load

  // 2. Mobile Menu / Burger Menu Interaction
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');

  if (burgerMenu && navLinks) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside or on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if ('IntersectionObserver' in window && animateElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver isn't supported
    animateElements.forEach(element => {
      element.classList.add('appear');
    });
  }

  // 4. Academics Page - Level Tabs Logic
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Activate current tab button and corresponding panel
        btn.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // 5. Admissions Page - Tuition Fee Calculator
  const gradeSelect = document.getElementById('grade-level');
  const busService = document.getElementById('calc-bus');
  const mealService = document.getElementById('calc-meals');
  const careService = document.getElementById('calc-care');
  const priceDisplay = document.getElementById('calc-total-price');

  if (gradeSelect && priceDisplay) {
    const calculateTuition = () => {
      // Base Tuition Rates per Year
      const rates = {
        'early-years': 8500,
        'primary': 10500,
        'middle': 13000,
        'high': 16000
      };

      const selectedGrade = gradeSelect.value;
      let total = rates[selectedGrade] || 0;

      // Add-ons
      if (busService && busService.checked) total += 1200;
      if (mealService && mealService.checked) total += 950;
      if (careService && careService.checked) total += 1500;

      // Animate price display nicely
      animateValue(priceDisplay, parseInt(priceDisplay.innerText.replace(/[^0-9]/g, '')) || 0, total, 400);
    };

    // Event listeners
    gradeSelect.addEventListener('change', calculateTuition);
    [busService, mealService, careService].forEach(checkbox => {
      if (checkbox) checkbox.addEventListener('change', calculateTuition);
    });

    // Helper function to animate number updates
    function animateValue(obj, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `$${currentVal.toLocaleString()}`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }

  // 6. Contact Page - Accordion FAQs
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  if (faqTriggers.length > 0) {
    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.parentElement;
        const content = item.querySelector('.faq-content');
        const isActive = item.classList.contains('active');
        
        // Close all open FAQs
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-content').style.maxHeight = null;
        });

        // Toggle current FAQ
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // 7. Contact Form Validation and Mock Submit
  const contactForm = document.getElementById('inquiry-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous status
      formStatus.className = 'form-message';
      formStatus.innerText = '';

      // Get values
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const grade = document.getElementById('form-grade').value;
      const message = document.getElementById('form-message').value.trim();

      // Basic Validation
      if (!name || !email || !message) {
        formStatus.classList.add('error');
        formStatus.innerText = 'Please fill out all required fields (Name, Email, Message).';
        return;
      }

      // Email Format Check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.classList.add('error');
        formStatus.innerText = 'Please enter a valid email address.';
        return;
      }

      // Simulate API submit (Loading state transition)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        formStatus.classList.add('success');
        formStatus.innerText = `Thank you, ${name}! Your inquiry has been sent successfully. Our admissions team will contact you shortly.`;
        
        // Reset form
        contactForm.reset();
      }, 1500);
    });
  }

  // 8. Newsletter Signup Simulation
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput.value.trim();

      if (email) {
        alert(`Thank you for subscribing to our newsletter with: ${email}`);
        emailInput.value = '';
      }
    });
  }

  // 9. Campus Life Page - Dining Menu Day Tabs
  const menuDayButtons = document.querySelectorAll('.menu-day-btn');
  const menuPanels = document.querySelectorAll('.menu-panel');

  if (menuDayButtons.length > 0 && menuPanels.length > 0) {
    menuDayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetDay = btn.getAttribute('data-day');
        
        // Remove active class from all buttons and panels
        menuDayButtons.forEach(b => b.classList.remove('active'));
        menuPanels.forEach(p => p.classList.remove('active'));
        
        // Activate current button and matching panel
        btn.classList.add('active');
        const targetPanel = document.getElementById(targetDay);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }
});
