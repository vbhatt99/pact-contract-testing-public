const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'reports');
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  generateHTMLReport(testResults) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(this.reportsDir, `pact-test-report-${timestamp}.html`);
    
    const html = this.createHTMLTemplate(testResults);
    
    fs.writeFileSync(reportFile, html);
    return reportFile;
  }

  createHTMLTemplate(testResults) {
    const {
      summary,
      consumerTests,
      providerTests,
      securityAudit,
      apiTests,
      pactFiles,
      timestamp,
      duration
    } = testResults;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PACT Contract Testing Report</title>
    <style>
        ${this.getCSS()}
    </style>
</head>
<body>
    <div class="container">
        <header class="report-header">
            <h1>🧪 PACT Contract Testing Report</h1>
            <div class="report-meta">
                <span class="timestamp">Generated: ${timestamp}</span>
                <span class="duration">Duration: ${duration}</span>
            </div>
        </header>

        <div class="summary-section">
            <h2>📊 Test Summary</h2>
            <div class="summary-grid">
                <div class="summary-card ${summary.overall === 'PASS' ? 'success' : 'failure'}">
                    <div class="card-icon">${summary.overall === 'PASS' ? '✅' : '❌'}</div>
                    <div class="card-content">
                        <h3>Overall Status</h3>
                        <p class="status">${summary.overall}</p>
                    </div>
                </div>
                <div class="summary-card ${summary.consumer === 'PASS' ? 'success' : 'failure'}">
                    <div class="card-icon">${summary.consumer === 'PASS' ? '✅' : '❌'}</div>
                    <div class="card-content">
                        <h3>Consumer Tests</h3>
                        <p class="status">${summary.consumer}</p>
                        <p class="details">${summary.consumerDetails}</p>
                    </div>
                </div>
                <div class="summary-card ${summary.provider === 'PASS' ? 'success' : 'failure'}">
                    <div class="card-icon">${summary.provider === 'PASS' ? '✅' : '❌'}</div>
                    <div class="card-content">
                        <h3>Provider Tests</h3>
                        <p class="status">${summary.provider}</p>
                        <p class="details">${summary.providerDetails}</p>
                    </div>
                </div>
                <div class="summary-card ${summary.security === 'PASS' ? 'success' : 'warning'}">
                    <div class="card-icon">${summary.security === 'PASS' ? '✅' : '⚠️'}</div>
                    <div class="card-content">
                        <h3>Security Audit</h3>
                        <p class="status">${summary.security}</p>
                        <p class="details">${summary.securityDetails}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🔍 Consumer Tests (PACT Generation)</h2>
            <div class="test-results">
                ${this.renderTestResults(consumerTests)}
            </div>
        </div>

        <div class="section">
            <h2>🔍 Provider Verification Tests</h2>
            <div class="test-results">
                ${this.renderTestResults(providerTests)}
            </div>
        </div>

        <div class="section">
            <h2>🛡️ Security Audit Results</h2>
            <div class="security-results">
                ${this.renderSecurityResults(securityAudit)}
            </div>
        </div>

        <div class="section">
            <h2>🌐 API Endpoint Tests</h2>
            <div class="api-results">
                ${this.renderAPIResults(apiTests)}
            </div>
        </div>

        <div class="section">
            <h2>📄 Generated PACT Files</h2>
            <div class="pact-files">
                ${this.renderPactFiles(pactFiles)}
            </div>
        </div>

        <div class="section">
            <h2>📈 Test Statistics</h2>
            <div class="statistics">
                <div class="stat-item">
                    <span class="stat-label">Total Tests:</span>
                    <span class="stat-value">${summary.totalTests}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Passed:</span>
                    <span class="stat-value success">${summary.passedTests}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Failed:</span>
                    <span class="stat-value failure">${summary.failedTests}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Success Rate:</span>
                    <span class="stat-value">${summary.successRate}%</span>
                </div>
            </div>
        </div>

        <footer class="report-footer">
            <p>Generated by PACT Contract Testing Framework</p>
            <p>For educational and testing purposes only</p>
        </footer>
    </div>
</body>
</html>`;
  }

  renderTestResults(tests) {
    if (!tests || tests.length === 0) {
      return '<p class="no-results">No test results available</p>';
    }

    return tests.map(test => `
      <div class="test-item ${test.status === 'PASS' ? 'success' : 'failure'}">
        <div class="test-header">
          <span class="test-status">${test.status === 'PASS' ? '✅' : '❌'}</span>
          <span class="test-name">${test.name}</span>
          <span class="test-duration">${test.duration}ms</span>
        </div>
        ${test.error ? `<div class="test-error">${test.error}</div>` : ''}
        ${test.details ? `<div class="test-details">${test.details}</div>` : ''}
      </div>
    `).join('');
  }

  renderSecurityResults(security) {
    if (!security) {
      return '<p class="no-results">No security audit results available</p>';
    }

    return `
      <div class="security-item ${security.vulnerabilities === 0 ? 'success' : 'warning'}">
        <div class="security-header">
          <span class="security-status">${security.vulnerabilities === 0 ? '✅' : '⚠️'}</span>
          <span class="security-title">Vulnerability Scan</span>
        </div>
        <div class="security-details">
          <p><strong>Vulnerabilities Found:</strong> ${security.vulnerabilities}</p>
          <p><strong>Audit Level:</strong> ${security.auditLevel}</p>
          ${security.vulnerabilities > 0 ? `<p><strong>Status:</strong> <span class="warning">Review required</span></p>` : '<p><strong>Status:</strong> <span class="success">All clear</span></p>'}
        </div>
      </div>
    `;
  }

  renderAPIResults(apiTests) {
    if (!apiTests || apiTests.length === 0) {
      return '<p class="no-results">No API test results available</p>';
    }

    return apiTests.map(test => `
      <div class="api-item ${test.status === 'PASS' ? 'success' : 'failure'}">
        <div class="api-header">
          <span class="api-status">${test.status === 'PASS' ? '✅' : '❌'}</span>
          <span class="api-endpoint">${test.endpoint}</span>
        </div>
        <div class="api-details">
          <p><strong>Method:</strong> ${test.method}</p>
          <p><strong>Status Code:</strong> ${test.statusCode}</p>
          <p><strong>Response Time:</strong> ${test.responseTime}ms</p>
        </div>
      </div>
    `).join('');
  }

  renderPactFiles(pactFiles) {
    if (!pactFiles || pactFiles.length === 0) {
      return '<p class="no-results">No PACT files generated</p>';
    }

    return pactFiles.map(file => `
      <div class="pact-file">
        <div class="pact-header">
          <span class="pact-icon">📄</span>
          <span class="pact-name">${file.name}</span>
        </div>
        <div class="pact-details">
          <p><strong>Size:</strong> ${file.size} bytes</p>
          <p><strong>Interactions:</strong> ${file.interactions}</p>
          <p><strong>Generated:</strong> ${file.timestamp}</p>
        </div>
      </div>
    `).join('');
  }

  getCSS() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f8f9fa;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .report-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        text-align: center;
      }

      .report-header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
      }

      .report-meta {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 15px;
      }

      .report-meta span {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9em;
      }

      .summary-section {
        margin-bottom: 30px;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .summary-card {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
        border-left: 5px solid;
      }

      .summary-card.success {
        border-left-color: #28a745;
      }

      .summary-card.failure {
        border-left-color: #dc3545;
      }

      .summary-card.warning {
        border-left-color: #ffc107;
      }

      .card-icon {
        font-size: 2em;
      }

      .card-content h3 {
        margin-bottom: 5px;
        color: #333;
      }

      .status {
        font-weight: bold;
        font-size: 1.2em;
        margin-bottom: 5px;
      }

      .summary-card.success .status {
        color: #28a745;
      }

      .summary-card.failure .status {
        color: #dc3545;
      }

      .summary-card.warning .status {
        color: #ffc107;
      }

      .details {
        font-size: 0.9em;
        color: #666;
      }

      .section {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
      }

      .section h2 {
        color: #333;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e9ecef;
      }

      .test-results, .api-results, .pact-files {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .test-item, .api-item, .pact-file {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid;
      }

      .test-item.success, .api-item.success {
        border-left-color: #28a745;
      }

      .test-item.failure, .api-item.failure {
        border-left-color: #dc3545;
      }

      .test-header, .api-header, .pact-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .test-name, .api-endpoint, .pact-name {
        font-weight: bold;
        flex: 1;
      }

      .test-duration {
        color: #666;
        font-size: 0.9em;
      }

      .test-error {
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-family: monospace;
        font-size: 0.9em;
      }

      .test-details, .api-details, .pact-details {
        color: #666;
        font-size: 0.9em;
      }

      .security-item {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid;
      }

      .security-item.success {
        border-left-color: #28a745;
      }

      .security-item.warning {
        border-left-color: #ffc107;
      }

      .security-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }

      .security-title {
        font-weight: bold;
        font-size: 1.1em;
      }

      .security-details p {
        margin-bottom: 8px;
      }

      .statistics {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .stat-item {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
      }

      .stat-label {
        display: block;
        color: #666;
        font-size: 0.9em;
        margin-bottom: 5px;
      }

      .stat-value {
        font-size: 2em;
        font-weight: bold;
        color: #333;
      }

      .stat-value.success {
        color: #28a745;
      }

      .stat-value.failure {
        color: #dc3545;
      }

      .no-results {
        color: #666;
        font-style: italic;
        text-align: center;
        padding: 20px;
      }

      .report-footer {
        text-align: center;
        color: #666;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
      }

      .report-footer p {
        margin-bottom: 5px;
      }

      @media (max-width: 768px) {
        .container {
          padding: 10px;
        }

        .report-header h1 {
          font-size: 2em;
        }

        .report-meta {
          flex-direction: column;
          gap: 10px;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }

        .statistics {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;
  }

  generateJSONReport(testResults) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(this.reportsDir, `pact-test-report-${timestamp}.json`);
    
    fs.writeFileSync(reportFile, JSON.stringify(testResults, null, 2));
    return reportFile;
  }

  generateMarkdownReport(testResults) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(this.reportsDir, `pact-test-report-${timestamp}.md`);
    
    const markdown = this.createMarkdownTemplate(testResults);
    fs.writeFileSync(reportFile, markdown);
    return reportFile;
  }

  createMarkdownTemplate(testResults) {
    const {
      summary,
      consumerTests,
      providerTests,
      securityAudit,
      apiTests,
      pactFiles,
      timestamp,
      duration
    } = testResults;

    return `# 🧪 PACT Contract Testing Report

**Generated:** ${timestamp}  
**Duration:** ${duration}

## 📊 Test Summary

| Test Type | Status | Details |
|-----------|--------|---------|
| Overall | ${summary.overall} | ${summary.overall === 'PASS' ? 'All tests passed' : 'Some tests failed'} |
| Consumer Tests | ${summary.consumer} | ${summary.consumerDetails} |
| Provider Tests | ${summary.provider} | ${summary.providerDetails} |
| Security Audit | ${summary.security} | ${summary.securityDetails} |

## 🔍 Consumer Tests (PACT Generation)

${consumerTests.map(test => `
### ${test.name}
- **Status:** ${test.status}
- **Duration:** ${test.duration}ms
${test.error ? `- **Error:** ${test.error}` : ''}
${test.details ? `- **Details:** ${test.details}` : ''}
`).join('')}

## 🔍 Provider Verification Tests

${providerTests.map(test => `
### ${test.name}
- **Status:** ${test.status}
- **Duration:** ${test.duration}ms
${test.error ? `- **Error:** ${test.error}` : ''}
${test.details ? `- **Details:** ${test.details}` : ''}
`).join('')}

## 🛡️ Security Audit Results

- **Vulnerabilities Found:** ${securityAudit.vulnerabilities}
- **Audit Level:** ${securityAudit.auditLevel}
- **Status:** ${securityAudit.vulnerabilities === 0 ? 'All clear' : 'Review required'}

## 🌐 API Endpoint Tests

${apiTests.map(test => `
### ${test.endpoint}
- **Status:** ${test.status}
- **Method:** ${test.method}
- **Status Code:** ${test.statusCode}
- **Response Time:** ${test.responseTime}ms
`).join('')}

## 📄 Generated PACT Files

${pactFiles.map(file => `
### ${file.name}
- **Size:** ${file.size} bytes
- **Interactions:** ${file.interactions}
- **Generated:** ${file.timestamp}
`).join('')}

## 📈 Test Statistics

- **Total Tests:** ${summary.totalTests}
- **Passed:** ${summary.passedTests}
- **Failed:** ${summary.failedTests}
- **Success Rate:** ${summary.successRate}%

---

*Generated by PACT Contract Testing Framework*  
*For educational and testing purposes only*
`;
  }

  getLatestReport() {
    const files = fs.readdirSync(this.reportsDir)
      .filter(file => file.startsWith('pact-test-report-') && file.endsWith('.html'))
      .sort()
      .reverse();

    return files.length > 0 ? path.join(this.reportsDir, files[0]) : null;
  }

  listReports() {
    const files = fs.readdirSync(this.reportsDir)
      .filter(file => file.startsWith('pact-test-report-'))
      .sort()
      .reverse();

    return files.map(file => ({
      name: file,
      path: path.join(this.reportsDir, file),
      timestamp: fs.statSync(path.join(this.reportsDir, file)).mtime
    }));
  }
}

module.exports = ReportGenerator;
