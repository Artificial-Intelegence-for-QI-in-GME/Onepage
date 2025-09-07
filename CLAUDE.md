# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains **LLM Prompts for UME/GME Medical Education**, a comprehensive web application featuring structured, specialty-aligned prompts designed for medical education excellence. The project includes both general medical education prompts and specialized IHI (Institute for Healthcare Improvement) quality improvement prompts.

## Architecture & Structure

### Core Application
- **index.html**: Main application entry point with dynamic card loading system
- **onepagerstyle.css**: Complete stylesheet with responsive design and card flip animations
- **cards/**: Directory containing 25+ modular HTML card components for medical education prompts
- **ihi/**: Directory structure for IHI quality improvement prompts (222 generated cards)

### IHI Prompt System
The repository includes a sophisticated system for managing Institute for Healthcare Improvement prompts:
- **ihi/ihi.json**: Master data file containing 74 healthcare quality improvement prompts with metadata
- **ihi/weak/**, **ihi/strong/**, **ihi/enhanced/**: Generated HTML cards (74 cards each, 222 total)
- **generate-cards.js**: Node.js script for converting JSON data to HTML cards

### Card Architecture
Cards follow a consistent flip-card structure:
```html
<div class="card" aria-expanded="false">
  <div class="card-inner">
    <div class="card-front">
      <h3>Title</h3>
      <p>Description</p>
      <button class="reveal-button">Reveal Prompt</button>
    </div>
    <div class="card-back">
      <div class="prompt-text">Content</div>
      <div class="card-footer">
        <button class="copy-button">Copy</button>
        <button class="back-button">Back</button>
      </div>
    </div>
  </div>
</div>
```

## Key Features & Functionality

### Dynamic Card Loading
- Main index.html dynamically loads card components from the cards/ directory
- Cards are fetched via JavaScript and inserted into a responsive grid layout
- Real-time search filtering and card flip animations

### IHI Prompt Variations
Each IHI prompt exists in three enhanced versions:
1. **Weak**: Basic prompt version
2. **Strong**: Enhanced IHI methodology prompt  
3. **Enhanced**: Comprehensive clinical framework prompt with regulatory compliance

### Responsive Design
- 3-column grid layout on desktop, responsive down to mobile
- Card aspect ratio maintained at 2:1
- Flip animations with perspective transforms

## Development Workflows

### Adding New Medical Education Cards
1. Create new HTML file in `/cards/` directory following existing card template
2. Add filename to `cardFiles` array in `index.html` (lines 62-84)
3. Test card flip functionality and copy button

### Regenerating IHI Cards
```bash
node generate-cards.js
```
This processes `ihi/ihi.json` and generates all 222 cards with proper HTML sanitization and file naming.

### File Naming Convention
IHI cards use format: `slide-{slide_number}-{sanitized-description}.html`

## Important Implementation Details

### Security
- All user content is HTML-escaped via `sanitizeHTML()` function in generate-cards.js
- XSS prevention through proper content sanitization

### Accessibility
- Cards include `aria-expanded` attributes for screen readers
- Keyboard navigation support (Escape key closes flipped cards)
- Semantic HTML structure

### Performance
- Cards loaded asynchronously to prevent blocking
- Efficient DOM manipulation for card filtering
- CSS transforms used for smooth animations

## Data Structure

### IHI JSON Format
```javascript
{
  "metadata": {
    "total_prompts": 74,
    "enhancement_method": "Multi-Path Anthropic API Simulation",
    "average_effectiveness_score": 8.7
  },
  "prompts": [
    {
      "slide_number": 332,
      "description": "Build a driver diagram for quality improvement",
      "weak_prompt": "Basic version",
      "strong_prompt": "IHI methodology version", 
      "enhanced_strong_prompt": "Comprehensive clinical framework",
      "effectiveness_score": 9.3
    }
  ]
}
```

## Claude Agents Available
- **prompt-optimizer**: For improving AI prompts using modern techniques
- **frontend-developer**: For UI/UX development and troubleshooting

## Project Status
- 222 IHI cards successfully generated (100% success rate)
- 25+ medical education card components active
- Responsive design fully implemented
- Search and filtering functionality operational

## Development Notes
- Always use absolute file paths in responses
- Prefer editing existing files over creating new ones
- HTML content must be properly escaped for security
- Card structure must match existing template for consistency
- Test card flip functionality after any structural changes