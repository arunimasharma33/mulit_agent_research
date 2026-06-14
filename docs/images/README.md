# Demo Images

This directory contains screenshots and demo images for the Multi-Agent Research System documentation.

## Image Placeholders

Add the following images to this directory to complete the documentation:

### 1. `dashboard-demo.png`
**Purpose**: Main dashboard showing the research topic input form and pipeline progress visualization

**Suggested Content**:
- Research topic input field with sample text
- User interface with navigation
- Visual layout of the main interface

**Dimensions**: 1200x800px recommended

**Location in Docs**: Referenced in [README.md](../README.md#demo)

---

### 2. `research-results-demo.png`
**Purpose**: Display of generated research report with structured sections from the writer agent

**Suggested Content**:
- Full research report output
- Structured sections (Introduction, Findings, Conclusion, etc.)
- Text formatting and layout
- Report quality demonstration

**Dimensions**: 1200x900px recommended

**Location in Docs**: Referenced in [README.md](../README.md#demo)

---

### 3. `history-view-demo.png`
**Purpose**: User's previous research projects with quick access and detailed review options

**Suggested Content**:
- List of previous research projects
- Project metadata (topic, date created, etc.)
- Action buttons (view, delete, etc.)
- Search/filter functionality

**Dimensions**: 1200x700px recommended

**Location in Docs**: Referenced in [README.md](../README.md#demo)

---

### 4. `pipeline-progress-demo.png`
**Purpose**: Real-time visualization of each agent's progress during the research workflow

**Suggested Content**:
- Progress bars for each agent (Search, Reader, Writer, Critic)
- Status indicators (in progress, completed, etc.)
- Real-time updates visualization
- Timeline or step-by-step display

**Dimensions**: 1200x600px recommended

**Location in Docs**: Referenced in [README.md](../README.md#demo)

---

## Adding Images

### Step 1: Capture Screenshots
1. Run the application (`npm run dev` for frontend, `npm run dev:backend` for backend)
2. Navigate to each section mentioned above
3. Capture screenshots with good quality
4. Crop to relevant areas

### Step 2: Optimize Images
```bash
# Recommended tools
# - ImageMagick: convert, mogrify
# - TinyPNG: https://tinypng.com (online)
# - ImageOptim: https://imageoptim.com (macOS)

# Example with ImageMagick:
convert dashboard-demo.png -resize 1200x800 -quality 85 dashboard-demo.png
```

### Step 3: Save to Directory
- Place optimized images in this directory
- Use exact filenames listed above
- Ensure images are PNG format

### Step 4: Verify
- Check that images display correctly in [README.md](../README.md)
- Verify image quality and relevance
- Update alt text if needed

---

## Image Guidelines

### Quality Standards
- **Resolution**: Minimum 1000px width
- **Format**: PNG or JPEG
- **Size**: Optimized under 500KB per image
- **DPI**: 72 DPI (web resolution)
- **Color**: RGB mode

### Content Standards
- Clear, readable text
- Good contrast and lighting
- Actual application screenshots (not mockups)
- Recent version of the application
- Sample data that demonstrates features well

### Accessibility
- Meaningful alt text for each image
- High color contrast for visibility
- Descriptive captions
- Consider colorblind-friendly palettes

---

## Temporary Placeholders

Currently, [README.md](../README.md) references images with placeholder paths:
```markdown
![Main Dashboard](docs/images/dashboard-demo.png)
```

Once images are added:
1. Screenshots will automatically display in README
2. Documentation will be complete
3. Users can visualize the application before running it

---

## Alternative: Placeholder Images

If you want to use temporary placeholder images during development:

```bash
# Using ImageMagick to create placeholders:
convert -size 1200x800 xc:lightgray -pointsize 40 -draw "gravity center fill black text 0,0 'Dashboard Demo (Add Image Here)'" dashboard-demo.png
```

Or use online placeholder service:
- [Placeholder.com](https://placeholder.com/)
- [Lorem Picsum](https://picsum.photos/)
- [DummyImage](https://dummyimage.com/)

---

## Version Control

Images are typically:
- ✅ Committed to version control (if small)
- ❌ Stored in LFS if larger (over 50MB total)
- ❌ Excluded if generated (not needed in repo)

For large images, consider Git LFS:
```bash
git lfs install
git lfs track "*.png"
git add .gitattributes
```

---

## Questions?

Refer to:
- [README.md](../README.md) for documentation overview
- [DEVELOPMENT.md](../DEVELOPMENT.md) for running the application
- Image guidelines above

---

**Happy documenting!** 📸

Last updated: 2024-06-14
