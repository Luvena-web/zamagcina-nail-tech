# Crossroads Nail Artistry - Website

A professional, fully-functional website for a nail salon and weave service provider in Crossroads, Cape Town. The website features a modern design, service menu with pricing in South African Rands, portfolio gallery, and an interactive appointment booking system.

## Features

### 1. **Professional Brand Identity**
- Modern, minimalist logo featuring a stylized nail silhouette and protea flower
- Rose gold and charcoal grey color palette representing Cape Town heritage
- Responsive design that works on desktop, tablet, and mobile devices

### 2. **Comprehensive Service Menu**
- **Nail Services:**
  - Standard Manicure (30 min) - R 150
  - Gel Overlay (45 min) - R 280
  - Acrylic Full Set (60 min) - R 350
  - Soft Gel Extensions (60 min) - R 320
  - Gel Removal (20 min) - R 80
  - Nail Art Add-ons (R 50 per nail)

- **Weave Services:**
  - Sew-In Weave Full Head (180 min) - R 450
  - Sew-In Weave Half Head (120 min) - R 300
  - Weave Removal (90 min) - R 150
  - Weave Touch-Up (60 min) - R 200
  - Box Braids (240 min) - R 500
  - Cornrows (120 min) - R 250

### 3. **Portfolio Gallery**
- Showcase of nail art and weave work
- Professional photography with soft-focus aesthetic
- Responsive gallery layout

### 4. **Interactive Appointment Booking System**
- **Service Selection:** Choose from nail or weave services
- **Nail Art Customization:** Select number of nails for custom nail art designs
- **Date Selection:** Book up to 30 days in advance
- **Smart Time Slot Management:**
  - Operating hours: 06:30 AM to 04:30 PM
  - 30-minute time slot intervals
  - Automatic duration calculation based on service type
  - Real-time slot availability checking
  - Prevents double-booking by tracking booked slots

- **Client Information:** Collect name, WhatsApp number, and optional email
- **Booking Summary:** Real-time price calculation and booking details preview
- **WhatsApp Integration:** Send booking confirmation directly to WhatsApp

### 5. **Contact Information**
- Location details (Crossroads, Cape Town)
- Operating hours (Monday-Saturday, 06:30 AM - 04:30 PM)
- WhatsApp and email contact options

## File Structure

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   └── app.js             # JavaScript for booking system and interactivity
├── images/
│   ├── logo.png           # Brand logo
│   └── portfolio-hero.png  # Portfolio showcase image
├── data/
│   └── (booked slots stored in browser localStorage)
└── README.md              # This file
```

## How to Use

### 1. **Local Setup**
Simply open `index.html` in a web browser. No server or installation required!

```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using Python's built-in server (recommended for testing)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### 2. **Making an Appointment**
1. Navigate to the "Book Now" section
2. Select a service from the dropdown menu
3. If booking a nail service, optionally select nail art designs (R 50 per nail)
4. Choose your preferred date (up to 30 days in advance)
5. Select an available time slot (30-minute intervals from 06:30 to 16:30)
6. Enter your name and WhatsApp number
7. Review the booking summary with total price
8. Click "Confirm Booking via WhatsApp"
9. You'll be redirected to WhatsApp to confirm the appointment

### 3. **Customizing the Website**

#### Update WhatsApp Number
In `js/app.js`, find the `generateWhatsAppMessage` function and update:
```javascript
const whatsappUrl = `https://wa.me/27XXXXXXXXX?text=${encodeURIComponent(message)}`;
```
Replace `27XXXXXXXXX` with your actual WhatsApp number (country code + number without spaces or symbols).

#### Update Contact Information
In `index.html`, update the contact section with your actual details:
```html
<div class="contact-item">
    <h3>Contact</h3>
    <p><strong>WhatsApp:</strong> <a href="https://wa.me/27XXXXXXXXX" target="_blank">Message us</a></p>
    <p><strong>Email:</strong> <a href="mailto:your-email@example.com">your-email@example.com</a></p>
</div>
```

#### Modify Pricing
Edit the `services` object in `js/app.js`:
```javascript
'manicure': {
    name: 'Standard Manicure',
    duration: 30,      // Duration in minutes
    price: 150,        // Price in Rands
    type: 'nail'
}
```

#### Change Colors
Update the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #c9184a;      /* Main color */
    --secondary-color: #d4a574;    /* Accent color */
    --accent-color: #2d3142;       /* Dark accent */
    --rose-gold: #b76e79;          /* Rose gold */
    --charcoal: #2d2d2d;           /* Charcoal */
    /* ... more colors ... */
}
```

## Booking System Details

### How Slots Work
- The system generates 30-minute time slots from 06:30 to 16:30
- Each service has a specific duration (e.g., Acrylic Full Set = 60 minutes)
- The system automatically calculates when the next available slot is based on service duration
- Booked slots are stored in the browser's localStorage and persist across sessions

### Slot Availability Logic
1. User selects a service with a specific duration
2. System generates all possible 30-minute slots for the selected date
3. For each slot, the system checks if the entire service duration is available
4. If any part of the time slot is already booked, the slot is marked as unavailable
5. Only slots with complete availability are shown to the user

### Managing Bookings
Booked slots are stored in browser localStorage. To clear all bookings:
1. Open browser Developer Tools (F12)
2. Go to Application → Local Storage
3. Find and delete the `bookedSlots` entry

## Technical Details

### Technologies Used
- **HTML5:** Semantic markup and form structure
- **CSS3:** Modern styling with CSS Grid, Flexbox, and gradients
- **JavaScript (ES6+):** Interactive booking system, slot management, and WhatsApp integration
- **LocalStorage API:** Client-side booking data persistence

### Browser Compatibility
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design
- Desktop (1200px+): Full multi-column layout
- Tablet (768px - 1199px): Optimized grid layouts
- Mobile (480px - 767px): Single-column layout
- Small mobile (<480px): Compact mobile-first design

## Deployment Options

### 1. **GitHub Pages** (Free, Recommended)
```bash
# Create a GitHub repository
# Push the files to the repository
# Go to Settings → Pages → Select main branch
# Your site will be live at https://username.github.io/repo-name
```

### 2. **Netlify** (Free)
```bash
# Drag and drop the folder to Netlify
# Or connect your GitHub repository
# Site will be live immediately
```

### 3. **Vercel** (Free)
```bash
# Connect your GitHub repository to Vercel
# Automatic deployment on every push
```

### 4. **Traditional Web Hosting**
- Upload files via FTP to your web hosting provider
- Ensure the hosting supports static HTML/CSS/JS

## Future Enhancements

Potential features to add:
- Backend database for persistent booking storage
- Email/SMS notifications for confirmations
- Payment integration (Stripe, PayFast)
- Admin dashboard to manage bookings
- Customer reviews and ratings
- Service packages and discounts
- Staff scheduling and management
- Automated reminder system

## Support

For questions or customization needs, contact the developer or refer to the inline code comments.

## License

This website is created for Crossroads Nail Artistry. All rights reserved.

---

**Created with ❤️ for Crossroads Nail Artistry**  
*Local talent, premium quality in Cape Town*
