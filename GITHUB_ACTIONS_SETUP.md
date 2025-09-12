# GitHub Actions Setup Guide

## 🚀 Quick Setup

This repository includes simple GitHub Actions workflows for automated PACT contract testing.

## 📁 Workflows Included

### 1. PACT Contract Testing (`pact-ci.yml`)
- **Triggers**: Push to main, Pull requests to main
- **What it does**:
  - Installs dependencies
  - Runs consumer tests (PACT generation)
  - Uploads PACT contracts as artifacts
- **Duration**: ~2-3 minutes

### 2. GitHub Pages Deployment (`pages.yml`)
- **Triggers**: Push to main branch
- **What it does**:
  - Runs tests and generates reports
  - Publishes reports to GitHub Pages
- **Duration**: ~3-4 minutes

## 🛠️ Setup Instructions

### Step 1: Enable GitHub Pages
1. Go to your repository **Settings**
2. Navigate to **Pages** section
3. Set **Source** to "GitHub Actions"
4. Save the configuration

### Step 2: Push Your Code
```bash
git add .
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### Step 3: Check Actions
1. Go to **Actions** tab in your repository
2. Watch the workflows run
3. Check **Artifacts** for PACT contracts
4. Visit your GitHub Pages URL for reports

## 📊 What You Get

### Automated Testing
- ✅ Consumer tests run on every push/PR
- ✅ PACT contracts generated automatically
- ✅ Test artifacts saved for 7 days

### GitHub Pages Reports
- ✅ Test reports published automatically
- ✅ Public access to test results
- ✅ Historical test data

## 🔧 Customization

### Modify Test Commands
Edit `.github/workflows/pact-ci.yml`:
```yaml
- name: Run consumer tests
  run: npm run test:consumer  # Change this command
```

### Add More Tests
Edit `.github/workflows/pact-ci.yml`:
```yaml
- name: Run provider tests
  run: npm run test:provider
```

### Change Node Version
Edit both workflow files:
```yaml
node-version: '20'  # Change from '18' to '20'
```

## 🎯 Benefits

1. **Automated Testing**: Tests run automatically on code changes
2. **PACT Contracts**: Generated contracts are saved as artifacts
3. **Public Reports**: Test results are published to GitHub Pages
4. **Simple Setup**: Just push code and it works
5. **Educational Value**: Perfect for learning CI/CD with PACT

## 🆘 Troubleshooting

### Workflow Fails
- Check the **Actions** tab for error details
- Ensure all dependencies are in `package.json`
- Verify test commands work locally

### GitHub Pages Not Working
- Check repository **Settings > Pages**
- Ensure **Source** is set to "GitHub Actions"
- Wait a few minutes after first push

### PACT Contracts Not Generated
- Check if `pacts/` directory exists
- Verify consumer tests are passing
- Look at workflow logs for errors

## 📚 Next Steps

1. **Run Tests Locally**: `npm run test:consumer`
2. **Push to GitHub**: Watch Actions run
3. **Check Reports**: Visit your GitHub Pages URL
4. **Customize**: Modify workflows for your needs

---

**Happy Testing! 🧪✨**
