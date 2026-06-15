document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     MOBILE MENU TOGGLE (Simple implementation)
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#070a13';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      }
    });
  }

  /* ==========================================================================
     HERO CANVAS GEOMETRIC ANIMATION
     ========================================================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 15000)); // Adaptive count
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 180 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2.5 + 1.5;
        this.baseColor = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(139, 92, 246, 0.4)';
      }

      update() {
        // Reverse directions on boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse effect (gentle attraction/push)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Resize event listener
    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    // Track mouse coordinates over canvas
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw mathematical coordinate helper lines in background of hero (subtle)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Create nice neon cyan to purple connection lines
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${alpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     INTERACTIVE CALCULATOR LOGIC
     ========================================================================== */
  const calcTypes = document.querySelectorAll('[data-type]');
  const calcLevels = document.querySelectorAll('[data-level]');
  const frequencySlider = document.getElementById('frequency-slider');
  const frequencyVal = document.getElementById('frequency-val');
  const totalPriceDisp = document.getElementById('total-price');
  const hoursTextDisp = document.getElementById('hours-text');
  const calcCtaBtn = document.getElementById('calc-cta-btn');

  // Pricing definition
  const sessionRates = {
    '1on1': {
      gimnaziu: 120,
      liceu: 130
    },
    grup: {
      gimnaziu: 100,
      liceu: 100
    }
  };
  const sessionDuration = 1.5; // 90 minutes = 1.5 hours

  let selectedType = '1on1';
  let selectedLevel = 'gimnaziu';
  let selectedFrequency = 2;

  function calculatePrice() {
    // 1 session is 1.5 hours (90 minutes)
    // Monthly hours = frequency per week * 1.5 hours * 4 weeks
    const sessionsPerMonth = selectedFrequency * 4;
    const hoursPerMonth = sessionsPerMonth * sessionDuration;
    const ratePerSession = sessionRates[selectedType][selectedLevel];
    const totalPrice = sessionsPerMonth * ratePerSession;

    // Update UI
    totalPriceDisp.textContent = totalPrice;
    hoursTextDisp.textContent = `${hoursPerMonth} ore de pregătire efectivă lunar`;
    frequencyVal.textContent = selectedFrequency;
  }

  // Toggle selection styles and state
  calcTypes.forEach(opt => {
    opt.addEventListener('click', () => {
      calcTypes.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedType = opt.dataset.type;
      calculatePrice();
    });
  });

  calcLevels.forEach(opt => {
    opt.addEventListener('click', () => {
      calcLevels.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedLevel = opt.dataset.level;
      calculatePrice();
    });
  });

  if (frequencySlider) {
    frequencySlider.addEventListener('input', (e) => {
      selectedFrequency = parseInt(e.target.value);
      calculatePrice();
    });
  }

  // Initial calculation run
  if (totalPriceDisp) {
    calculatePrice();
  }

  // Bind service selection buttons in the services section to contact form
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const service = btn.dataset.service;
      const formService = document.getElementById('form-service');
      if (formService) {
        formService.value = service;
        // Trigger style adjustment for select focus
        formService.dispatchEvent(new Event('change'));
      }
    });
  });

  // Dynamic booking from calculator CTA
  if (calcCtaBtn) {
    calcCtaBtn.addEventListener('click', (e) => {
      const formService = document.getElementById('form-service');
      const formLevel = document.getElementById('form-level');
      
      if (formService) {
        formService.value = selectedType;
        formService.dispatchEvent(new Event('change'));
      }
      if (formLevel) {
        formLevel.value = selectedLevel;
        formLevel.dispatchEvent(new Event('change'));
      }
    });
  }

  /* ==========================================================================
     MATH SANDBOX LOGIC
     ========================================================================== */
  const sliderAmp = document.getElementById('slider-amp');
  const sliderFreq = document.getElementById('slider-freq');
  const sliderPhase = document.getElementById('slider-phase');

  const ampVal = document.getElementById('amp-val');
  const freqMathVal = document.getElementById('freq-math-val');
  const phaseVal = document.getElementById('phase-val');

  const eqA = document.getElementById('eq-a');
  const eqW = document.getElementById('eq-w');
  const eqP = document.getElementById('eq-p');

  const graphCurve = document.getElementById('graph-curve');
  const trackingDot = document.getElementById('tracking-dot');

  let amp = 40;
  let freq = 0.05; // internally mapped from slider value
  let phase = 0; // internally in degrees
  let timeOffset = 0; // for animating dot/wave slightly

  function updateGraph() {
    const width = 500;
    const height = 400;
    const originY = height / 2; // 200
    const originX = width / 2;  // 250

    // Build SVG Path
    let pathData = '';
    
    // Generate points along the graph from X = 0 to 500
    for (let x = 0; x <= width; x++) {
      // Scale phase to radians
      const phaseRad = (phase * Math.PI) / 180;
      
      // Calculate mathematical x relative to center
      const relX = x - originX;
      
      // Function formula: y = A * sin(w * x + phase)
      const mathY = amp * Math.sin(freq * relX + phaseRad);
      
      // Map back to screen Y coordinate (SVG 0,0 is top-left, so invert Y)
      const screenY = originY - mathY;

      if (x === 0) {
        pathData += `M ${x} ${screenY}`;
      } else {
        pathData += ` L ${x} ${screenY}`;
      }
    }

    if (graphCurve) {
      graphCurve.setAttribute('d', pathData);
    }
  }

  // Slider interaction events
  if (sliderAmp) {
    sliderAmp.addEventListener('input', (e) => {
      amp = parseInt(e.target.value);
      ampVal.textContent = amp;
      eqA.textContent = amp;
      updateGraph();
    });
  }

  if (sliderFreq) {
    sliderFreq.addEventListener('input', (e) => {
      const sliderVal = parseInt(e.target.value);
      freq = sliderVal * 0.01;
      const formattedFreq = freq.toFixed(2);
      freqMathVal.textContent = formattedFreq;
      eqW.textContent = formattedFreq;
      updateGraph();
    });
  }

  if (sliderPhase) {
    sliderPhase.addEventListener('input', (e) => {
      phase = parseInt(e.target.value);
      phaseVal.textContent = phase + '°';
      eqP.textContent = phase > 0 ? `+ ${phase}°` : `${phase}°`;
      updateGraph();
    });
  }

  // Animate the tracking dot along the sine wave
  let dotAngle = 0;
  function animateTrackingDot() {
    if (trackingDot) {
      dotAngle += 0.02;
      const originX = 250;
      const originY = 200;
      
      // Let the dot slide back and forth on X axis from x = 50 to 450
      const xOffset = 200 * Math.sin(dotAngle);
      const dotX = originX + xOffset;

      const phaseRad = (phase * Math.PI) / 180;
      const dotY = originY - amp * Math.sin(freq * xOffset + phaseRad);

      trackingDot.setAttribute('cx', dotX);
      trackingDot.setAttribute('cy', dotY);
    }
    requestAnimationFrame(animateTrackingDot);
  }

  // Run graph initialization
  if (graphCurve) {
    updateGraph();
    animateTrackingDot();
  }

  /* ==========================================================================
     TESTIMONIALS SLIDER LOGIC
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const btnPrev = document.getElementById('prev-testimonial');
  const btnNext = document.getElementById('next-testimonial');
  
  let currentSlide = 0;
  let slideInterval;

  function updateSlides() {
    if (!track) return;
    
    // Slide left/right by translating track
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active state classes
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  if (btnNext) btnNext.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  if (btnPrev) btnPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.dataset.index);
      updateSlides();
      resetAutoplay();
    });
  });

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  if (track && slides.length > 0) {
    startAutoplay();
  }

  /* ==========================================================================
     FAQ ACCORDION LOGIC
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close all other FAQ items (Accordion style)
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        // Set max-height to its full scroll height for smooth dynamic transition
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM & VALIDATION LOGIC
     ========================================================================== */
  const form = document.getElementById('booking-form');
  const statusMsg = document.getElementById('form-status-msg');

  // Trigger floating label logic on load (for browser autofill)
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    // If input is select and option is prefilled, make sure label fits
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        if (input.value) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const level = document.getElementById('form-level').value;
      const service = document.getElementById('form-service').value;
      const terms = document.getElementById('form-terms').checked;

      // Status clear
      statusMsg.className = 'form-status';
      statusMsg.textContent = '';
      statusMsg.style.display = 'none';

      // Validation
      if (!name || !phone || !level || !service) {
        statusMsg.classList.add('error');
        statusMsg.textContent = 'Te rugăm să completezi toate câmpurile obligatorii.';
        statusMsg.style.display = 'block';
        return;
      }

      if (phone.length < 9) {
        statusMsg.classList.add('error');
        statusMsg.textContent = 'Te rugăm să introduci un număr de telefon valid.';
        statusMsg.style.display = 'block';
        return;
      }

      if (!terms) {
        statusMsg.classList.add('error');
        statusMsg.textContent = 'Trebuie să fii de acord cu Politica de Confidențialitate.';
        statusMsg.style.display = 'block';
        return;
      }

      // Save booking in local database
      const newBooking = {
        name,
        phone,
        level,
        service,
        message: document.getElementById('form-message').value.trim(),
        slot: selectedSlot ? document.querySelector(`[data-key="${selectedSlot}"]`).dataset.day + ' (' + document.querySelector(`[data-key="${selectedSlot}"]`).dataset.slot + ')' : 'Neselectat',
        slotKey: selectedSlot || null,
        timestamp: new Date().toLocaleString('ro-RO')
      };

      bookings.push(newBooking);
      localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));

      if (selectedSlot) {
        calendarSlots[selectedSlot] = 'booked';
        localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
        selectedSlot = null;
        updateSelectedSlotIndicator(null);
      }

      renderCalendars();
      updateAdminBookingsTable();

      // Email Sending Logic
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.textContent = 'Se trimite...';
      submitBtn.disabled = true;

      const payload = {
        Nume: newBooking.name,
        Telefon: newBooking.phone,
        Nivel: newBooking.level === 'gimnaziu' ? 'Gimnaziu' : 'Liceu',
        Format: newBooking.service === '1on1' ? 'Solo (1 la 1)' : (newBooking.service === 'grup' ? 'Grup' : 'Nesigur'),
        Slot_Selectat: newBooking.slot,
        Mesaj: newBooking.message || 'Fără mesaj'
      };

      fetch('https://formsubmit.co/ajax/sigma.math.ro@gmail.com', {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        statusMsg.classList.add('success');
        statusMsg.textContent = 'Solicitarea a fost trimisă cu succes! Vei fi contactat în scurt timp.';
        statusMsg.style.display = 'block';
        form.reset();
        if (window.lucide) window.lucide.createIcons();
      })
      .catch(error => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        console.error('Error sending email:', error);
        
        // Even if email fails, local saving succeeded
        statusMsg.classList.add('success');
        statusMsg.textContent = 'Solicitarea a fost înregistrată, deși notificarea prin email a întâmpinat o problemă.';
        statusMsg.style.display = 'block';
        form.reset();
        if (window.lucide) window.lucide.createIcons();
      });

      inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
          input.classList.remove('has-value');
        }
      });
    });
  }

  /* ==========================================================================
     WEEKLY CALENDAR & ADMIN DASHBOARD LOGIC
     ========================================================================== */
  const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];
  const timeSlots = [
    '09:00 - 10:30',
    '10:30 - 12:00',
    '12:00 - 13:30',
    '13:30 - 15:00',
    '15:00 - 16:30',
    '16:30 - 18:00',
    '18:00 - 19:30'
  ];

  let calendarSlots = JSON.parse(localStorage.getItem('sigmamath_calendar_slots')) || {};
  let bookings = JSON.parse(localStorage.getItem('sigmamath_bookings')) || [];
  let selectedSlot = null;
  let activeAllocationBookingIdx = null; // Stores booking index to allocate slot to
  let activeTab = 'requests'; // 'requests' (Cereri Noi) or 'established' (Ore Consacrate)

  const publicGrid = document.getElementById('weekly-calendar-grid');
  const adminGrid = document.getElementById('admin-calendar-grid');

  // Allocation Banner Elements
  const allocationBanner = document.getElementById('admin-allocation-banner');
  const allocationName = document.getElementById('admin-allocation-name');
  const cancelAllocationBtn = document.getElementById('cancel-allocation-btn');

  // Slot Management Modal Elements
  const slotModal = document.getElementById('slot-modal');
  const closeSlotModalBtn = document.getElementById('close-slot-modal-btn');
  const slotModalTitle = document.getElementById('slot-modal-title');
  const slotModalSubtitle = document.getElementById('slot-modal-subtitle');
  const slotStateFree = document.getElementById('slot-state-free');
  const slotStateBooked = document.getElementById('slot-state-booked');
  
  const btnBlockGeneric = document.getElementById('btn-block-generic');
  const btnShowManualRegister = document.getElementById('btn-show-manual-register');
  const manualRegisterForm = document.getElementById('manual-register-form');
  
  const bookedSlotDetails = document.getElementById('booked-slot-details');
  const btnReleaseToRequests = document.getElementById('btn-release-to-requests');
  const btnDeleteBookingCompletely = document.getElementById('btn-delete-booking-completely');

  let currentModalSlotKey = null;
  let currentModalDay = null;
  let currentModalSlotTime = null;

  // Create Selected Slot dynamic form indicator
  const selectedSlotText = document.createElement('div');
  selectedSlotText.id = 'selected-slot-indicator';
  selectedSlotText.style.display = 'none';
  selectedSlotText.style.background = 'rgba(139, 92, 246, 0.1)';
  selectedSlotText.style.border = '1px solid var(--accent)';
  selectedSlotText.style.padding = '1rem 1.25rem';
  selectedSlotText.style.borderRadius = '12px';
  selectedSlotText.style.fontWeight = '500';
  selectedSlotText.style.color = 'white';
  selectedSlotText.style.marginBottom = '1.75rem';
  selectedSlotText.innerHTML = `Interval selectat pentru programare: <span id="selected-slot-text" style="color: var(--secondary); font-weight: 700;"></span>`;

  if (form) {
    const formTermsLabel = form.querySelector('.form-checkbox-label');
    if (formTermsLabel) {
      form.insertBefore(selectedSlotText, formTermsLabel);
    }
  }

  function updateSelectedSlotIndicator(slotString) {
    const textSpan = document.getElementById('selected-slot-text');
    if (slotString) {
      if (textSpan) textSpan.textContent = slotString;
      selectedSlotText.style.display = 'block';
    } else {
      selectedSlotText.style.display = 'none';
    }
  }

  function updateAllocationBanner() {
    if (!allocationBanner || !allocationName) return;
    if (activeAllocationBookingIdx !== null && bookings[activeAllocationBookingIdx]) {
      allocationName.textContent = bookings[activeAllocationBookingIdx].name;
      allocationBanner.style.display = 'flex';
    } else {
      allocationBanner.style.display = 'none';
    }
  }

  if (cancelAllocationBtn) {
    cancelAllocationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeAllocationBookingIdx = null;
      updateAllocationBanner();
      updateAdminBookingsTable();
    });
  }

  // Calendar Grid Renderer
  function renderGrid(gridElement, isAdmin) {
    if (!gridElement) return;
    gridElement.innerHTML = '';

    // Header Time Cell
    const timeHeader = document.createElement('div');
    timeHeader.className = 'calendar-time-col-header';
    timeHeader.textContent = 'Ora';
    gridElement.appendChild(timeHeader);

    // Header Day Cells
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-grid-header';
      dayHeader.textContent = day;
      gridElement.appendChild(dayHeader);
    });

    // Generate Rows
    timeSlots.forEach((slot, slotIdx) => {
      // Time Column Cell
      const timeCell = document.createElement('div');
      timeCell.className = 'calendar-time-cell';
      timeCell.textContent = slot;
      gridElement.appendChild(timeCell);

      // Day Column Slots
      days.forEach(day => {
        const slotKey = `${day}_${slotIdx}`;
        const slotBookings = bookings.filter(b => b.slotKey === slotKey);
        
        let status = calendarSlots[slotKey] || 'available';
        let displayText = status === 'available' ? 'Liber' : 'Ocupat';
        let slotType = 'free';

        if (isAdmin) {
          if (slotBookings.length > 0) {
            status = 'booked'; // force booked visually if there are bookings
            const isGroup = slotBookings.every(b => b.service === 'grup');
            if (isGroup) {
              slotType = 'group';
              displayText = `Grup: ${slotBookings.length}`;
            } else {
              slotType = 'solo';
              displayText = 'Solo (1-1)';
            }
          } else if (status === 'booked') {
            slotType = 'generic';
            displayText = 'Blocat Generic';
          }
        }

        const slotDiv = document.createElement('div');
        slotDiv.className = `calendar-slot ${status}`;
        if (isAdmin && slotType === 'group') {
          // Special styling for group slots in admin to distinguish them
          slotDiv.style.background = 'rgba(139, 92, 246, 0.15)';
          slotDiv.style.border = '1px solid rgba(139, 92, 246, 0.3)';
        } else if (isAdmin && slotType === 'solo') {
          slotDiv.style.background = 'rgba(239, 68, 68, 0.1)';
          slotDiv.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        }
        
        if (!isAdmin && selectedSlot === slotKey) {
          slotDiv.classList.add('selected');
        }

        slotDiv.dataset.key = slotKey;
        slotDiv.dataset.day = day;
        slotDiv.dataset.slot = slot;
        slotDiv.dataset.type = slotType;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'slot-time-text';
        timeSpan.textContent = slot;
        slotDiv.appendChild(timeSpan);

        const statusSpan = document.createElement('span');
        statusSpan.className = 'slot-status-text';
        statusSpan.textContent = displayText;
        if (isAdmin && slotType === 'group') statusSpan.style.color = '#c084fc';
        if (isAdmin && slotType === 'solo') statusSpan.style.color = '#f87171';
        slotDiv.appendChild(statusSpan);

        // Click interaction
        if (isAdmin) {
          slotDiv.addEventListener('click', () => {
            // Check if slot allocation is in progress
            if (activeAllocationBookingIdx !== null) {
              const booking = bookings[activeAllocationBookingIdx];
              
              if (slotType === 'solo' || slotType === 'generic') {
                alert('Acest slot este rezervat pentru o sesiune Solo sau este blocat generic. Nu poți adăuga elevi aici.');
                return;
              }
              
              if (slotType === 'group' && booking.service !== 'grup') {
                alert('Acest slot este deja o sesiune de Grup. Elevul curent nu a solicitat pregătire de grup, alege un slot liber.');
                return;
              }

              // Free up previous slot if there was one
              if (booking.slotKey) {
                const othersInOldSlot = bookings.filter(b => b.slotKey === booking.slotKey && b !== booking);
                if (othersInOldSlot.length === 0) {
                  delete calendarSlots[booking.slotKey];
                }
              }

              // Allocate new slot details
              booking.slotKey = slotKey;
              booking.slot = `${day} (${slot})`;
              calendarSlots[slotKey] = 'booked';

              // Save to database
              localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
              localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));

              // Reset allocation
              activeAllocationBookingIdx = null;
              updateAllocationBanner();

              // Switch to Established tab automatically to see the confirmed session
              activeTab = 'established';
              const tabRequestsBtn = document.getElementById('tab-requests-btn');
              const tabEstablishedBtn = document.getElementById('tab-established-btn');
              if (tabRequestsBtn && tabEstablishedBtn) {
                tabEstablishedBtn.classList.add('active');
                tabRequestsBtn.classList.remove('active');
              }

              renderCalendars();
              updateAdminBookingsTable();
            } else {
              // Open Slot Manager Modal for manual blocking / booking
              openSlotModal(slotKey, day, slot);
            }
          });
        } else {
          if (status === 'available') {
            slotDiv.addEventListener('click', () => {
              if (selectedSlot === slotKey) {
                selectedSlot = null;
                updateSelectedSlotIndicator(null);
              } else {
                selectedSlot = slotKey;
                updateSelectedSlotIndicator(`${day} (${slot})`);
              }
              renderCalendars();
            });
          }
        }

        gridElement.appendChild(slotDiv);
      });
    });
  }

  function renderCalendars() {
    renderGrid(publicGrid, false);
    renderGrid(adminGrid, true);
  }

  // ==========================================================================
  // SLOT MANAGEMENT MODAL FUNCTIONS
  // ==========================================================================
  function openSlotModal(slotKey, day, slot) {
    if (!slotModal) return;
    
    currentModalSlotKey = slotKey;
    currentModalDay = day;
    currentModalSlotTime = slot;
    
    if (slotModalSubtitle) {
      slotModalSubtitle.textContent = `${day} (${slot})`;
    }
    
    // Reset manual form inside modal
    if (manualRegisterForm) {
      manualRegisterForm.style.display = 'none';
      manualRegisterForm.reset();
      const levelInput = document.getElementById('manual-level');
      const serviceInput = document.getElementById('manual-service');
      if (levelInput) levelInput.disabled = false;
      if (serviceInput) serviceInput.disabled = false;
    }
    
    const status = calendarSlots[slotKey] || 'available';
    
    if (status === 'available') {
      slotStateFree.style.display = 'block';
      slotStateBooked.style.display = 'none';
      if (document.getElementById('btn-block-generic')) {
         document.getElementById('btn-block-generic').style.display = 'flex';
      }
    } else {
      slotStateFree.style.display = 'none';
      slotStateBooked.style.display = 'block';
      
      const slotBookings = bookings.map((b, i) => ({ ...b, originalIdx: i })).filter(b => b.slotKey === slotKey);
      const bookedSlotDetails = document.getElementById('booked-slot-details');
      const bookedSlotGlobalActions = document.getElementById('booked-slot-global-actions');
      
      if (bookedSlotDetails && bookedSlotGlobalActions) {
        bookedSlotDetails.innerHTML = '';
        bookedSlotGlobalActions.innerHTML = '';
        
        if (slotBookings.length > 0) {
          const isGroup = slotBookings.every(b => b.service === 'grup');
          
          slotBookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.cssText = 'padding: 1.25rem; background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.06); border-radius: 12px; text-align: left; position: relative;';
            
            card.innerHTML = `
              <h4 style="color: white; margin-bottom: 0.75rem; border-bottom: 1px dashed var(--border-light); padding-bottom: 0.5rem; font-size: 1.05rem;">
                ${booking.name} <span style="font-size: 0.75rem; color: var(--secondary); margin-left: 0.5rem; padding: 0.15rem 0.4rem; border: 1px solid var(--secondary); border-radius: 4px;">${booking.service === '1on1' ? 'Solo' : 'Grup'}</span>
              </h4>
              <div class="detail-row"><span class="detail-label">Telefon:</span><span class="detail-value">${booking.phone}</span></div>
              <div class="detail-row"><span class="detail-label">Nivel:</span><span class="detail-value">${booking.level === 'gimnaziu' ? 'Gimnaziu' : 'Liceu'}</span></div>
              <div class="detail-row"><span class="detail-label">Mesaj:</span><span class="detail-value">${booking.message || 'Fără mesaj'}</span></div>
              
              <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary release-btn" data-idx="${booking.originalIdx}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem; border-color: var(--secondary); color: var(--secondary);">Eliberează (În Cereri Noi)</button>
                <button class="btn btn-secondary btn-danger delete-btn" data-idx="${booking.originalIdx}" style="flex: 1; font-size: 0.75rem; padding: 0.5rem;">Șterge (Nealocat)</button>
              </div>
            `;
            bookedSlotDetails.appendChild(card);
          });
          
          // Attach listeners
          bookedSlotDetails.querySelectorAll('.release-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt(e.target.dataset.idx, 10);
              bookings[idx].slotKey = null;
              bookings[idx].slot = 'Neselectat';
              localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
              
              const remaining = bookings.filter(b => b.slotKey === slotKey);
              if (remaining.length === 0) delete calendarSlots[slotKey];
              localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
              
              if (remaining.length === 0) closeSlotModal(); else openSlotModal(slotKey, day, slot);
              renderCalendars();
              updateAdminBookingsTable();
            });
          });
          
          bookedSlotDetails.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt(e.target.dataset.idx, 10);
              bookings[idx].slotKey = null;
              bookings[idx].slot = 'Neselectat';
              bookings[idx].unallocated = true;
              localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
              
              const remaining = bookings.filter(b => b.slotKey === slotKey);
              if (remaining.length === 0) delete calendarSlots[slotKey];
              localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
              
              if (remaining.length === 0) closeSlotModal(); else openSlotModal(slotKey, day, slot);
              renderCalendars();
              updateAdminBookingsTable();
            });
          });
          
          if (isGroup) {
            bookedSlotGlobalActions.innerHTML = `
              <button class="btn btn-primary" id="btn-add-to-group" style="width: 100%; padding: 0.75rem; font-size: 0.9rem;">
                Adaugă elev manual în grup
              </button>
            `;
            document.getElementById('btn-add-to-group').addEventListener('click', () => {
              slotStateBooked.style.display = 'none';
              slotStateFree.style.display = 'block';
              if (document.getElementById('btn-block-generic')) {
                 document.getElementById('btn-block-generic').style.display = 'none';
              }
              manualRegisterForm.style.display = 'block';
              
              // Pre-fill and lock based on existing group
              const firstStudent = slotBookings[0];
              const levelInput = document.getElementById('manual-level');
              const serviceInput = document.getElementById('manual-service');
              
              if (levelInput) {
                levelInput.value = firstStudent.level;
                levelInput.disabled = true;
              }
              if (serviceInput) {
                serviceInput.value = 'grup';
                serviceInput.disabled = true;
              }
            });
          }
        } else {
          // Locked generically
          bookedSlotDetails.innerHTML = `
            <div class="glass-card" style="padding: 1.5rem; background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.06); border-radius: 12px; text-align: left;">
              <div style="color:var(--text-muted); font-style:italic;">
                Acest slot este blocat generic (de ex. timp personal). Nu există date de elev asociate.
              </div>
            </div>
          `;
          bookedSlotGlobalActions.innerHTML = `
            <button class="btn btn-secondary" id="btn-unblock-generic" style="font-size: 0.9rem; width: 100%; border-color: var(--secondary); color: var(--secondary);">
              Deblochează Slot
            </button>
          `;
          document.getElementById('btn-unblock-generic').addEventListener('click', () => {
             delete calendarSlots[slotKey];
             localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
             closeSlotModal();
             renderCalendars();
          });
        }
      }
    }
    
    slotModal.style.display = 'flex';
  }

  function closeSlotModal() {
    if (slotModal) {
      slotModal.style.display = 'none';
    }
    currentModalSlotKey = null;
    currentModalDay = null;
    currentModalSlotTime = null;
  }

  if (closeSlotModalBtn) {
    closeSlotModalBtn.addEventListener('click', closeSlotModal);
  }

  // Action: Block Generic
  if (btnBlockGeneric) {
    btnBlockGeneric.addEventListener('click', () => {
      if (!currentModalSlotKey) return;
      
      calendarSlots[currentModalSlotKey] = 'booked';
      localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
      
      closeSlotModal();
      renderCalendars();
    });
  }

  // Action: Toggle Manual Register Form
  if (btnShowManualRegister && manualRegisterForm) {
    btnShowManualRegister.addEventListener('click', () => {
      manualRegisterForm.style.display = 'block';
    });
  }

  // Action: Submit Manual Registration Form
  if (manualRegisterForm) {
    manualRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!currentModalSlotKey) return;
      
      const name = document.getElementById('manual-name').value.trim();
      const phone = document.getElementById('manual-phone').value.trim();
      const level = document.getElementById('manual-level').value;
      const service = document.getElementById('manual-service').value;
      
      const newBooking = {
        name,
        phone,
        level,
        service,
        message: 'Adăugat manual din panoul administrativ.',
        slot: `${currentModalDay} (${currentModalSlotTime})`,
        slotKey: currentModalSlotKey,
        timestamp: new Date().toLocaleString('ro-RO')
      };
      
      bookings.push(newBooking);
      localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
      
      calendarSlots[currentModalSlotKey] = 'booked';
      localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
      
      // Automatically switch to established tab to see the final booking
      activeTab = 'established';
      const tabRequestsBtn = document.getElementById('tab-requests-btn');
      const tabEstablishedBtn = document.getElementById('tab-established-btn');
      if (tabRequestsBtn && tabEstablishedBtn) {
        tabEstablishedBtn.classList.add('active');
        tabRequestsBtn.classList.remove('active');
      }

      closeSlotModal();
      renderCalendars();
      updateAdminBookingsTable();
    });
  }

  // Action: Release slot to Requests (Move booking to Requests tab)
  if (btnReleaseToRequests) {
    btnReleaseToRequests.addEventListener('click', () => {
      if (!currentModalSlotKey) return;
      
      const idx = bookings.findIndex(b => b.slotKey === currentModalSlotKey);
      if (idx !== -1) {
        // Free up slot details in booking
        bookings[idx].slotKey = null;
        bookings[idx].slot = 'Neselectat';
        localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
      }
      
      // Free up slot in calendar
      delete calendarSlots[currentModalSlotKey];
      localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
      
      // Switch back to requests tab
      activeTab = 'requests';
      const tabRequestsBtn = document.getElementById('tab-requests-btn');
      const tabEstablishedBtn = document.getElementById('tab-established-btn');
      if (tabRequestsBtn && tabEstablishedBtn) {
        tabRequestsBtn.classList.add('active');
        tabEstablishedBtn.classList.remove('active');
      }

      closeSlotModal();
      renderCalendars();
      updateAdminBookingsTable();
    });
  }

  // Action: Delete Booking Completely
  if (btnDeleteBookingCompletely) {
    btnDeleteBookingCompletely.addEventListener('click', () => {
      if (!currentModalSlotKey) return;
      
      const idx = bookings.findIndex(b => b.slotKey === currentModalSlotKey);
      if (idx !== -1) {
        bookings[idx].slotKey = null;
        bookings[idx].slot = 'Neselectat';
        bookings[idx].unallocated = true;
        localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));
      }
      
      // Free up slot in calendar
      delete calendarSlots[currentModalSlotKey];
      localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
      
      closeSlotModal();
      renderCalendars();
      updateAdminBookingsTable();
    });
  }


  // ==========================================================================
  // ADMIN PORTAL AUTH & ACTION HANDLERS
  // ==========================================================================
  const adminLoginLink = document.getElementById('admin-login-link');
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.getElementById('close-login-btn');
  const adminLoginForm = document.getElementById('admin-login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');

  const dashboardModal = document.getElementById('dashboard-modal');
  const closeDashboardBtn = document.getElementById('close-dashboard-btn');
  const logoutBtn = document.getElementById('logout-btn');

  const bookingsTableBody = document.getElementById('bookings-table-body');
  const bookingsCountBadge = document.getElementById('bookings-count');
  const noBookingsMsg = document.getElementById('no-bookings-msg');

  const tabRequestsBtn = document.getElementById('tab-requests-btn');
  const tabEstablishedBtn = document.getElementById('tab-established-btn');
  const tabUnallocatedBtn = document.getElementById('tab-unallocated-btn');

  function switchTab(tabName) {
    activeTab = tabName;
    if (tabRequestsBtn) tabRequestsBtn.classList.toggle('active', tabName === 'requests');
    if (tabEstablishedBtn) tabEstablishedBtn.classList.toggle('active', tabName === 'established');
    if (tabUnallocatedBtn) tabUnallocatedBtn.classList.toggle('active', tabName === 'unallocated');
    activeAllocationBookingIdx = null; // cancel allocation when switching tabs
    updateAllocationBanner();
    updateAdminBookingsTable();
  }

  if (tabRequestsBtn) tabRequestsBtn.addEventListener('click', () => switchTab('requests'));
  if (tabEstablishedBtn) tabEstablishedBtn.addEventListener('click', () => switchTab('established'));
  if (tabUnallocatedBtn) tabUnallocatedBtn.addEventListener('click', () => switchTab('unallocated'));

  if (adminLoginLink) {
    adminLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'flex';
      loginErrorMsg.style.display = 'none';
      adminLoginForm.reset();
    });
  }

  function closeAllAdminModals() {
    loginModal.style.display = 'none';
    dashboardModal.style.display = 'none';
    closeSlotModal();
    activeAllocationBookingIdx = null;
    updateAllocationBanner();
  }

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', closeAllAdminModals);
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;

      if (email === 'sigma.math.ro@gmail.com' && password === 'mamaligacucapac') {
        loginModal.style.display = 'none';
        dashboardModal.style.display = 'flex';
        activeAllocationBookingIdx = null;
        updateAllocationBanner();
        
        // Reset tab default
        activeTab = 'requests';
        if (tabRequestsBtn) tabRequestsBtn.classList.add('active');
        if (tabEstablishedBtn) tabEstablishedBtn.classList.remove('active');
        if (tabUnallocatedBtn) tabUnallocatedBtn.classList.remove('active');

        renderCalendars();
        updateAdminBookingsTable();
      } else {
        loginErrorMsg.textContent = 'Email sau parolă administrativă incorectă.';
        loginErrorMsg.style.display = 'block';
      }
    });
  }

  if (closeDashboardBtn) {
    closeDashboardBtn.addEventListener('click', closeAllAdminModals);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', closeAllAdminModals);
  }

  window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === dashboardModal || e.target === slotModal) {
      closeAllAdminModals();
    }
  });

  function updateAdminBookingsTable() {
    if (!bookingsTableBody) return;

    bookingsTableBody.innerHTML = '';
    
    // Filter bookings based on activeTab
    const filteredBookings = bookings.map((b, originalIdx) => ({ ...b, originalIdx }))
      .filter(b => {
        if (activeTab === 'requests') return b.slotKey === null && !b.unallocated;
        if (activeTab === 'established') return b.slotKey !== null;
        if (activeTab === 'unallocated') return b.slotKey === null && b.unallocated === true;
        return false;
      });

    // Update dynamic counter badge
    if (activeTab === 'requests') {
      bookingsCountBadge.textContent = `${filteredBookings.length} cereri noi`;
      noBookingsMsg.textContent = 'Nu există cereri noi înregistrate.';
    } else if (activeTab === 'established') {
      bookingsCountBadge.textContent = `${filteredBookings.length} ore consacrate`;
      noBookingsMsg.textContent = 'Nu există programări stabilite în orar.';
    } else {
      bookingsCountBadge.textContent = `${filteredBookings.length} persoane nealocate`;
      noBookingsMsg.textContent = 'Nu există persoane în secțiunea nealocate.';
    }

    if (filteredBookings.length === 0) {
      noBookingsMsg.style.display = 'block';
      return;
    } else {
      noBookingsMsg.style.display = 'none';
    }

    filteredBookings.forEach((booking) => {
      const idx = booking.originalIdx;
      const tr = document.createElement('tr');
      
      // Make row clickable to open slot modal
      if (booking.slotKey) {
        tr.style.cursor = 'pointer';
        tr.title = 'Click pentru a vedea toți elevii din acest slot';
        tr.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') return;
          const parts = booking.slotKey.split('_');
          const day = parts[0];
          const slotMatch = booking.slot.match(/\((.*?)\)/);
          const slotText = slotMatch ? slotMatch[1] : '';
          openSlotModal(booking.slotKey, day, slotText);
        });
      }

      // Highlight row if currently allocating slot
      if (activeAllocationBookingIdx === idx) {
        tr.style.background = 'rgba(0, 242, 254, 0.05)';
        tr.style.borderColor = 'var(--secondary)';
      }

      const nameTd = document.createElement('td');
      nameTd.className = 'booking-name-cell';
      nameTd.textContent = booking.name;
      tr.appendChild(nameTd);

      const levelTd = document.createElement('td');
      levelTd.textContent = booking.level === 'gimnaziu' ? 'Gimnaziu (V-VIII)' : 'Liceu (IX-XII)';
      tr.appendChild(levelTd);

      const serviceTd = document.createElement('td');
      serviceTd.textContent = booking.service === '1on1' ? 'Solo (1-1)' : (booking.service === 'grup' ? 'Grup' : 'Nesigur');
      tr.appendChild(serviceTd);

      // Highlight cell slot value clearly
      const slotTd = document.createElement('td');
      slotTd.className = 'booking-slot-cell';
      if (booking.slotKey) {
        slotTd.innerHTML = `<span style="background: rgba(0, 242, 254, 0.08); border: 1px solid var(--secondary); padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: var(--secondary);">${booking.slot}</span>`;
      } else {
        slotTd.innerHTML = `<span style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-light); padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; color: var(--text-muted);">${booking.slot}</span>`;
      }
      tr.appendChild(slotTd);

      const contactTd = document.createElement('td');
      contactTd.className = 'booking-contact-cell';
      contactTd.innerHTML = `Tel: ${booking.phone}<br>${booking.message && booking.message !== 'Adăugat manual din panoul administrativ.' ? '<span style="font-size:0.75rem; color:var(--text-muted);">' + booking.message + '</span>' : ''}`;
      tr.appendChild(contactTd);

      const actionTd = document.createElement('td');
      actionTd.style.whiteSpace = 'nowrap';

      // Allocate/Change Slot Button (Only show for tab requests, or allow changes)
      const allocateBtn = document.createElement('button');
      allocateBtn.style.border = '1px solid var(--secondary)';
      allocateBtn.style.background = 'rgba(0, 242, 254, 0.05)';
      allocateBtn.style.color = 'var(--secondary)';
      allocateBtn.style.padding = '0.35rem 0.75rem';
      allocateBtn.style.fontSize = '0.75rem';
      allocateBtn.style.borderRadius = '6px';
      allocateBtn.style.cursor = 'pointer';
      allocateBtn.style.transition = 'all var(--transition-fast)';
      allocateBtn.style.marginRight = '0.5rem';
      allocateBtn.textContent = booking.slotKey ? 'Schimbă Slot' : 'Alocă Slot';

      allocateBtn.addEventListener('click', () => {
        activeAllocationBookingIdx = idx;
        updateAllocationBanner();
        updateAdminBookingsTable();
      });
      actionTd.appendChild(allocateBtn);

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-danger';
      deleteBtn.textContent = activeTab === 'unallocated' ? 'Șterge Definitiv' : 'Șterge';
      deleteBtn.addEventListener('click', () => {
        if (activeTab === 'unallocated') {
          // Permanently delete
          bookings.splice(idx, 1);
        } else {
          // Soft delete to unallocated
          if (booking.slotKey && calendarSlots[booking.slotKey] === 'booked') {
            delete calendarSlots[booking.slotKey];
            localStorage.setItem('sigmamath_calendar_slots', JSON.stringify(calendarSlots));
          }
          bookings[idx].slotKey = null;
          bookings[idx].slot = 'Neselectat';
          bookings[idx].unallocated = true;
        }

        localStorage.setItem('sigmamath_bookings', JSON.stringify(bookings));

        // Reset allocation state if active allocation was deleted
        if (activeAllocationBookingIdx === idx) {
          activeAllocationBookingIdx = null;
          updateAllocationBanner();
        } else if (activeTab === 'unallocated' && activeAllocationBookingIdx > idx) {
          activeAllocationBookingIdx--;
        }

        renderCalendars();
        updateAdminBookingsTable();
      });

      actionTd.appendChild(deleteBtn);
      tr.appendChild(actionTd);

      bookingsTableBody.appendChild(tr);
    });
  }

  // Initial loads
  renderCalendars();
  updateAdminBookingsTable();
});
