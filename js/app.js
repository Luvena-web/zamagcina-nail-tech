// Service Configuration
const services = {
    'manicure': {
        name: 'Standard Manicure',
        duration: 90,
        price: 100,
        type: 'nail'
    },
    'gel-overlay': {
        name: 'Gel Overlay',
        duration: 90,
        price: 70,
        type: 'nail'
    },
    'nail-art': {
        name: 'Nail Art',
        duration: 90,
        price: 115,
        type: 'nail'
    }
};

// Booked slots storage (in a real app, this would be in a database)
let bookedSlots = {
    // Format: 'YYYY-MM-DD': [{ start: '08:30', end: '10:00', service: '...', client: '...', phone: '...' }, ...]
};

// Load booked slots from localStorage
function loadBookedSlots() {
    const stored = localStorage.getItem('bookedSlots');
    if (stored) {
        bookedSlots = JSON.parse(stored);
    }
}

// Save booked slots to localStorage
function saveBookedSlots() {
    localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadBookedSlots();
    setupDatePicker();
    setupEventListeners();
});

// Setup date picker constraints
function setupDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    const today = new Date();
    
    // Set minimum date to today
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Set maximum date to 30 days from now
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    dateInput.setAttribute('max', maxDateStr);
}

// Setup event listeners
function setupEventListeners() {
    const serviceSelect = document.getElementById('serviceType');
    const dateInput = document.getElementById('appointmentDate');
    const bookingForm = document.getElementById('bookingForm');

    serviceSelect.addEventListener('change', handleServiceChange);
    dateInput.addEventListener('change', handleDateChange);
    bookingForm.addEventListener('submit', handleFormSubmit);

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const expanded = navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active', expanded);
    mobileMenuToggle.setAttribute('aria-expanded', expanded);
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}

// Handle service selection change
function handleServiceChange() {
    const serviceSelect = document.getElementById('serviceType');
    const selectedService = serviceSelect.value;
    const timeSlots = document.getElementById('timeSlots');

    // Clear time slots
    timeSlots.innerHTML = '<p class="info-text">Please select a date</p>';

    // Update summary
    updateSummary();
}

// Handle date change
function handleDateChange() {
    const dateInput = document.getElementById('appointmentDate');
    const serviceSelect = document.getElementById('serviceType');

    if (!dateInput.value || !serviceSelect.value) {
        document.getElementById('timeSlots').innerHTML = '<p class="info-text">Please select a service and date</p>';
        return;
    }

    generateTimeSlots();
}

// Generate available time slots
function generateTimeSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const serviceSelect = document.getElementById('serviceType');
    const selectedDate = dateInput.value;
    const selectedService = serviceSelect.value;

    if (!selectedDate || !selectedService) return;

    const service = services[selectedService];
    const duration = service.duration;

    // Operating hours: 06:30 to 16:30
    const startHour = 6;
    const startMinute = 30;
    const endHour = 16;
    const endMinute = 30;

    // Get booked slots for this date
    const dayBookedSlots = bookedSlots[selectedDate] || [];

    // Generate all possible slots (30-minute intervals)
    const slots = [];
    let currentTime = new Date(2000, 0, 1, startHour, startMinute);
    const endTime = new Date(2000, 0, 1, endHour, endMinute);

    while (currentTime <= endTime) {
        const timeStr = formatTime(currentTime);
        const slotEndTime = new Date(currentTime.getTime() + duration * 60000);

        // Check if slot end time is within operating hours
        if (slotEndTime > endTime) {
            break;
        }

        // Check if slot is available (not overlapping with booked slots)
        let isAvailable = true;
        for (let bookedSlot of dayBookedSlots) {
            const bookedStart = parseTime(bookedSlot.start);
            const bookedEnd = parseTime(bookedSlot.end);

            // Check for overlap - if ANY part of the requested slot overlaps with a booked slot
            if ((currentTime >= bookedStart && currentTime < bookedEnd) ||
                (slotEndTime > bookedStart && slotEndTime <= bookedEnd) ||
                (currentTime <= bookedStart && slotEndTime >= bookedEnd)) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            slots.push({
                time: timeStr,
                endTime: formatTime(slotEndTime)
            });
        }

        // Move to next 30-minute slot
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    // Render time slots
    renderTimeSlots(slots, selectedDate);
}

// Render time slot buttons
function renderTimeSlots(slots, selectedDate) {
    const timeSlotsContainer = document.getElementById('timeSlots');

    if (slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="info-text" style="grid-column: 1/-1;">No available slots for this date. Please select another date.</p>';
        return;
    }

    timeSlotsContainer.innerHTML = '';

    slots.forEach(slot => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'time-slot';
        button.textContent = slot.time;
        button.dataset.time = slot.time;
        button.dataset.endTime = slot.endTime;
        button.dataset.date = selectedDate;

        button.addEventListener('click', function(e) {
            e.preventDefault();
            selectTimeSlot(this);
        });

        timeSlotsContainer.appendChild(button);
    });
}

// Select a time slot
function selectTimeSlot(button) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked button
    button.classList.add('selected');

    // Update summary
    updateSummary();
}

// Format time to HH:MM
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Parse time string to Date object
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    return date;
}

// Update booking summary
function updateSummary() {
    const serviceSelect = document.getElementById('serviceType');
    const dateInput = document.getElementById('appointmentDate');
    const selectedTimeSlot = document.querySelector('.time-slot.selected');

    let totalPrice = 0;
    let serviceName = '-';
    let duration = 0;

    if (serviceSelect.value) {
        const service = services[serviceSelect.value];
        serviceName = service.name;
        totalPrice = service.price;
        duration = service.duration;
    }

    // Format date
    let dateStr = '-';
    if (dateInput.value) {
        const date = new Date(dateInput.value + 'T00:00:00');
        dateStr = date.toLocaleDateString('en-ZA', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Format time
    let timeStr = '-';
    if (selectedTimeSlot) {
        timeStr = selectedTimeSlot.dataset.time;
    }

    // Update summary elements
    document.getElementById('summaryService').textContent = serviceName;
    document.getElementById('summaryDate').textContent = dateStr;
    document.getElementById('summaryTime').textContent = timeStr;
    document.getElementById('summaryDuration').textContent = duration > 0 ? `${duration} minutes` : '-';
    document.getElementById('summaryPrice').textContent = totalPrice > 0 ? `R ${totalPrice}` : '-';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const serviceSelect = document.getElementById('serviceType');
    const dateInput = document.getElementById('appointmentDate');
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;

    // Validation
    if (!serviceSelect.value) {
        showAlert('Please select a service', 'error');
        return;
    }

    if (!dateInput.value) {
        showAlert('Please select a date', 'error');
        return;
    }

    if (!selectedTimeSlot) {
        showAlert('Please select a time slot', 'error');
        return;
    }

    if (!clientName.trim()) {
        showAlert('Please enter your name', 'error');
        return;
    }

    if (!clientPhone.trim()) {
        showAlert('Please enter your WhatsApp number', 'error');
        return;
    }

    // Book the appointment
    bookAppointment(serviceSelect.value, dateInput.value, selectedTimeSlot, clientName, clientPhone);
}

// Book appointment
function bookAppointment(serviceId, date, timeSlot, clientName, clientPhone) {
    const service = services[serviceId];
    const startTime = timeSlot.dataset.time;
    const endTime = timeSlot.dataset.endTime;

    // Add to booked slots
    if (!bookedSlots[date]) {
        bookedSlots[date] = [];
    }

    bookedSlots[date].push({
        start: startTime,
        end: endTime,
        service: service.name,
        client: clientName,
        phone: clientPhone
    });

    // Save to localStorage
    saveBookedSlots();

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(service, date, startTime, clientName, clientPhone);

    // Redirect to WhatsApp - Updated with correct number
    const whatsappUrl = `https://wa.me/27795224217?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;

    // Show success message
    showAlert(`Booking confirmed! You'll be redirected to WhatsApp to confirm your appointment.`, 'success');

    // Reset form after a short delay
    setTimeout(() => {
        document.getElementById('bookingForm').reset();
        document.getElementById('timeSlots').innerHTML = '<p class="info-text">Please select a service and date</p>';
        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        updateSummary();
    }, 2000);
}

// Generate WhatsApp message
function generateWhatsAppMessage(service, date, time, clientName, clientPhone) {
    const dateObj = new Date(date + 'T00:00:00');
    const dateStr = dateObj.toLocaleDateString('en-ZA', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    let message = `Hi! I'd like to book an appointment.\n\n`;
    message += `*Service:* ${service.name}\n`;
    message += `*Date:* ${dateStr}\n`;
    message += `*Time:* ${time}\n`;
    message += `*Duration:* ${service.duration} minutes\n`;
    message += `*Price:* R ${service.price}\n`;
    message += `*Name:* ${clientName}\n`;
    message += `*Phone:* ${clientPhone}\n\n`;
    message += `Please confirm my booking. Thank you!`;

    return message;
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const bookingContainer = document.querySelector('.booking-container');
    bookingContainer.insertBefore(alertDiv, bookingContainer.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Check for booked slots on page load and update UI
function checkAndUpdateBookedSlots() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput.value) {
        generateTimeSlots();
    }
}

// Reload booked slots every minute to reflect real-time changes
setInterval(() => {
    loadBookedSlots();
    checkAndUpdateBookedSlots();
}, 60000);
