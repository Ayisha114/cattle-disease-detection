# Contributing to Cattle Disease Detection System

First off, thank you for considering contributing to this project! 🎉

This project aims to help farmers detect cattle diseases early using AI technology. Every contribution helps make cattle healthcare more accessible.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## 📜 Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code.

**Our Standards:**
- Be respectful and inclusive
- Welcome newcomers
- Focus on what's best for the community
- Show empathy towards others

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** - Describe the issue briefly
- **Steps to reproduce** - How to trigger the bug
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - OS, Node version, etc.

**Example:**
```
Title: PDF download fails for reports with special characters

Steps to reproduce:
1. Create a report with disease name containing special characters
2. Click "Download PDF"
3. Error occurs

Expected: PDF downloads successfully
Actual: Error "Failed to generate PDF"

Environment: Ubuntu 22.04, Node 18.x
```

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Include:

- **Clear description** - What feature you want
- **Use case** - Why it's useful
- **Examples** - How it would work
- **Mockups** - If applicable

### 📝 Documentation Improvements

Documentation is crucial! You can help by:

- Fixing typos or unclear explanations
- Adding examples
- Translating to other languages
- Creating tutorials or guides

### 💻 Code Contributions

Ready to code? Great! Here's how:

1. **Find an issue** - Look for "good first issue" or "help wanted" labels
2. **Comment** - Let others know you're working on it
3. **Fork & Branch** - Create a feature branch
4. **Code** - Make your changes
5. **Test** - Ensure everything works
6. **Submit PR** - Create a pull request

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 14+
- MongoDB 4+
- Git

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cattle-disease-detection.git
   cd cattle-disease-detection
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Ayisha114/cattle-disease-detection.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

6. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

7. **Run the application**
   ```bash
   npm start
   ```

8. **Verify setup**
   - Open http://localhost:5000
   - Login should work
   - Upload should work (mock predictions)

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] All tests pass
- [ ] No console errors
- [ ] Tested on different screen sizes

### Creating a Pull Request

1. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   ```bash
   # Edit files
   git add .
   git commit -m "Add amazing feature"
   ```

3. **Keep your fork updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template
   - Submit!

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How did you test this?

## Screenshots
If applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

---

## 📏 Coding Standards

### JavaScript Style

```javascript
// ✅ Good
async function getUserReports(userId) {
  try {
    const reports = await Report.find({ user_id: userId });
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

// ❌ Bad
function getUserReports(userId,callback){
var reports=Report.find({user_id:userId})
callback(reports)
}
```

### Key Principles

1. **Use async/await** instead of callbacks
2. **Handle errors** properly with try-catch
3. **Use const/let** instead of var
4. **Add comments** for complex logic
5. **Keep functions small** and focused
6. **Use meaningful names** for variables

### File Organization

```
routes/
  ├── auth.js          # Authentication routes
  ├── upload.js        # Upload & prediction
  ├── reports.js       # Report management
  └── admin.js         # Admin dashboard

models/
  ├── User.js          # User schema
  └── Report.js        # Report schema

middleware/
  └── auth.js          # Authentication middleware
```

### API Response Format

```javascript
// Success response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

## 📝 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commits
feat(auth): add Google OAuth login
fix(upload): handle large image files correctly
docs(readme): update installation instructions
style(frontend): improve mobile responsiveness
refactor(reports): optimize PDF generation

# Bad commits
update stuff
fix bug
changes
asdf
```

### Detailed Example

```
feat(admin): add disease distribution chart

- Implement Chart.js doughnut chart
- Fetch disease statistics from API
- Add responsive design for mobile
- Update admin dashboard layout

Closes #123
```

---

## 🧪 Testing Guidelines

### Manual Testing

Before submitting PR, test:

1. **Authentication**
   - Google login works
   - Phone OTP works
   - Logout works

2. **Image Upload**
   - Can upload images
   - Validation works (file type, size)
   - Predictions display correctly

3. **Reports**
   - Can view reports
   - PDF download works
   - Report history loads

4. **Admin Dashboard**
   - Statistics display correctly
   - Charts render properly
   - Recent activity shows

5. **Mobile Responsive**
   - Test on different screen sizes
   - Navigation works on mobile
   - Forms are usable

### Test Checklist

```markdown
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile (Chrome)
- [ ] Tested on tablet
- [ ] No console errors
- [ ] No broken links
- [ ] Images load correctly
- [ ] Forms validate properly
- [ ] API responses correct
```

---

## 🎨 UI/UX Guidelines

### Design Principles

1. **Farmer-Friendly** - Simple, clear interface
2. **Mobile-First** - Works great on phones
3. **Accessible** - Easy to use for everyone
4. **Fast** - Quick loading and responses
5. **Consistent** - Same patterns throughout

### Color Scheme

```css
/* Primary Colors */
--blue-600: #2563eb;    /* Primary actions */
--green-600: #16a34a;   /* Success, healthy */
--red-600: #dc2626;     /* Errors, diseased */

/* Neutral Colors */
--gray-800: #1f2937;    /* Text */
--gray-600: #4b5563;    /* Secondary text */
--gray-300: #d1d5db;    /* Borders */
```

### Typography

- **Headings**: Bold, clear
- **Body**: Readable size (16px+)
- **Buttons**: Large, touch-friendly

---

## 🌍 Internationalization

Adding a new language?

1. **Add language option** in `public/index.html`
   ```html
   <option value="es">Español (Spanish)</option>
   ```

2. **Create translation file** (future enhancement)
   ```javascript
   // translations/es.js
   export default {
     'welcome': 'Bienvenido',
     'upload': 'Subir imagen',
     // ...
   }
   ```

---

## 📚 Resources

### Learning

- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/guide)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in documentation

---

## ❓ Questions?

- **GitHub Issues**: [Ask a question](https://github.com/Ayisha114/cattle-disease-detection/issues/new)
- **Discussions**: [Join discussion](https://github.com/Ayisha114/cattle-disease-detection/discussions)

---

## 🎉 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make cattle healthcare more accessible!

**Happy Contributing! 🚀**