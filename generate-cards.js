const fs = require('fs');
const path = require('path');

// Read and parse the IHI JSON data
function loadIHIData() {
  try {
    const jsonPath = './ihi/ihi.json';
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);
    return data.prompts;
  } catch (error) {
    console.error('Error loading IHI data:', error);
    process.exit(1);
  }
}

// Sanitize text for HTML display
function sanitizeHTML(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Create clean filename from description
function sanitizeFilename(description, slideNumber) {
  const cleaned = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Limit length and add slide number
  const truncated = cleaned.length > 50 ? cleaned.substring(0, 50) : cleaned;
  return `slide-${slideNumber}-${truncated}.html`;
}

// Generate HTML card using the exact template structure
function generateCard(prompt, promptText, promptType) {
  const title = prompt.description;
  const sanitizedPrompt = sanitizeHTML(promptText);
  const sanitizedTitle = sanitizeHTML(title);
  
  return `<div class="card" aria-expanded="false">
  <div class="card-inner">
    <div class="card-front">
      <h3>${sanitizedTitle}</h3>
      <p>${promptType === 'weak' ? 'Basic prompt version' : promptType === 'strong' ? 'Enhanced IHI methodology prompt' : 'Comprehensive clinical framework prompt'}</p>
      <button class="reveal-button">Reveal Prompt</button>
    </div>
    <div class="card-back">
      <div class="prompt-text" style="margin: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
${sanitizedPrompt}
      </div>
      <div class="card-footer">
        <button class="copy-button">Copy</button>
        <button class="back-button">Back</button>
      </div>
    </div>
  </div>
</div>
`;
}

// Generate a single card file
function generateCardFile(prompt, promptType) {
  // Handle the enhanced_strong_prompt field name correctly
  const promptFieldName = promptType === 'enhanced' ? 'enhanced_strong_prompt' : `${promptType}_prompt`;
  const promptText = prompt[promptFieldName];
  
  if (!promptText) {
    console.warn(`Missing ${promptFieldName} for slide ${prompt.slide_number}`);
    return null;
  }

  const filename = sanitizeFilename(prompt.description, prompt.slide_number);
  const cardHTML = generateCard(prompt, promptText, promptType);
  const outputDir = `./ihi/${promptType}`;
  const outputPath = path.join(outputDir, filename);

  try {
    fs.writeFileSync(outputPath, cardHTML, 'utf8');
    return { filename, success: true, path: outputPath };
  } catch (error) {
    console.error(`Error writing ${outputPath}:`, error);
    return { filename, success: false, error: error.message };
  }
}

// Main generation function
function generateAllCards() {
  const prompts = loadIHIData();
  const promptTypes = ['weak', 'strong', 'enhanced'];
  const results = {
    total: 0,
    success: 0,
    failed: 0,
    files: []
  };

  console.log(`Starting generation of ${prompts.length * promptTypes.length} cards...`);

  prompts.forEach((prompt, index) => {
    console.log(`Processing prompt ${index + 1}/${prompts.length}: Slide ${prompt.slide_number}`);
    
    promptTypes.forEach(type => {
      results.total++;
      const result = generateCardFile(prompt, type);
      
      if (result) {
        if (result.success) {
          results.success++;
          results.files.push(result.path);
          console.log(`  ✅ Generated ${type}: ${result.filename}`);
        } else {
          results.failed++;
          console.log(`  ❌ Failed ${type}: ${result.error}`);
        }
      } else {
        results.failed++;
        console.log(`  ❌ Skipped ${type}: Missing prompt text`);
      }
    });
  });

  console.log('\n📊 Generation Summary:');
  console.log(`Total cards processed: ${results.total}`);
  console.log(`Successfully generated: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${((results.success / results.total) * 100).toFixed(1)}%`);

  return results;
}

// Run the generation
if (require.main === module) {
  generateAllCards();
}

module.exports = { generateAllCards, generateCard, sanitizeHTML, sanitizeFilename };