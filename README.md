# KlickWay Athletics Website

A responsive website for KlickWay Athletics, a fitness and training facility. This project is a recreation of the original website with enhancements.

## Live Demo

Visit the live website: [KlickWay Athletics](https://oppknox.github.io/KlickWayAthletics/)

## Features

- Fully responsive design that works on all devices
- Dark theme with red accents
- Mobile-friendly navigation with dropdown menus
- Interactive elements including accordions and form validation
- Scroll animations for enhanced user experience
- Newsletter signup form with validation
- FAQ section with expandable answers
- Custom fonts using web fonts (Ethnocentric, IBM Plex Sans, Orbitron)

## Technologies Used

- HTML5
- CSS3 (with CSS variables and Flexbox/Grid layouts)
- JavaScript (vanilla, no frameworks)
- Font Awesome for icons
- Custom web fonts
- GitHub Pages for hosting

## Project Structure

```
KlickWayAthletics/
├── css/
│   ├── styles.css        # Main stylesheet
│   ├── responsive.css    # Responsive design styles
│   └── fonts.css         # Custom font definitions
├── fonts/                # Web font files
│   ├── Ethnocentric_Bold.woff2
│   ├── ethnocentric_rg.woff2
│   ├── IBMPlexSans-*.woff2
│   └── Orbitron-Bold_1.woff2
├── js/
│   ├── main.js           # Main JavaScript functionality
│   └── form-validation.js # Form validation logic
├── img/                  # Image assets and tools
│   ├── placeholder.html  # Tool to generate placeholder images
│   ├── logo-generator.html # Tool to generate a logo
│   └── various image files
├── index.html            # Home page
├── about.html            # About page
├── contact.html          # Contact page
├── locations.html        # Locations page
└── contest-prep.html     # Contest prep page
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser to view the website

## GitHub Pages Setup

This website is hosted on GitHub Pages. The live version is available at [https://oppknox.github.io/KlickWayAthletics/](https://oppknox.github.io/KlickWayAthletics/).

To set up GitHub Pages for your fork of this repository:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the "main" branch
5. Click "Save"
6. Your site will be published at `https://[your-username].github.io/KlickWayAthletics/`

## Image Generation Tools

This project includes two HTML-based tools to help with image generation:

### Placeholder Image Generator

Located at `img/placeholder.html`, this tool allows you to create custom placeholder images for the website. You can:

- Set custom dimensions
- Choose background and text colors
- Add custom text
- Save the generated image for use in the website

### Logo Generator

Located at `img/logo-generator.html`, this tool helps you create a custom logo for the website. You can:

- Customize the logo text and subtext
- Choose which part of the text to highlight in the accent color
- Adjust font size
- Toggle the icon visibility
- Customize colors
- Save the generated logo for use in the website

## Enhancements

The following enhancements have been made to the original website:

1. **Improved Performance**
   - Optimized CSS with variables for consistent styling
   - Efficient JavaScript with event delegation where appropriate
   - Custom web fonts for unique typography

2. **Better User Experience**
   - Added scroll animations to engage users
   - Improved form validation with real-time feedback
   - Form auto-save using localStorage to prevent data loss

3. **Accessibility Improvements**
   - Semantic HTML structure
   - Proper ARIA attributes for interactive elements
   - Sufficient color contrast for readability

4. **Mobile Optimization**
   - Fully responsive design with breakpoints for all device sizes
   - Touch-friendly navigation
   - Optimized layout for different screen orientations

## Browser Compatibility

This website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is for demonstration purposes only.

## Credits

- Font Awesome for icons
- Custom web fonts (Ethnocentric, IBM Plex Sans, Orbitron)
- Original design inspiration from the KlickWay Athletics website
