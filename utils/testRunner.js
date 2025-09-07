const ReportGenerator = require('./reportGenerator');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.reportGenerator = new ReportGenerator();
    this.startTime = Date.now();
    this.testResults = {
      summary: {
        overall: 'PASS',
        consumer: 'PASS',
        provider: 'PASS',
        security: 'PASS',
        consumerDetails: '',
        providerDetails: '',
        securityDetails: '',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        successRate: 0
      },
      consumerTests: [],
      providerTests: [],
      securityAudit: null,
      apiTests: [],
      pactFiles: [],
      timestamp: new Date().toISOString(),
      duration: 0
    };
  }

  async runConsumerTests() {
    console.log('🧪 Running consumer tests...');
    const startTime = Date.now();
    
    try {
      const output = execSync('npm run test:simple', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      const tests = this.parseJestOutput(output);
      
      this.testResults.consumerTests = tests;
      this.testResults.summary.consumerDetails = `${tests.filter(t => t.status === 'PASS').length}/${tests.length} tests passed`;
      
      if (tests.some(t => t.status === 'FAIL')) {
        this.testResults.summary.consumer = 'FAIL';
        this.testResults.summary.overall = 'FAIL';
      }
      
      console.log(`✅ Consumer tests completed in ${duration}ms`);
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.consumerTests.push({
        name: 'Consumer Tests',
        status: 'FAIL',
        duration: duration,
        error: error.message
      });
      this.testResults.summary.consumer = 'FAIL';
      this.testResults.summary.overall = 'FAIL';
      console.log(`❌ Consumer tests failed: ${error.message}`);
      return false;
    }
  }

  async startProvider() {
    console.log('🚀 Starting provider server...');
    
    try {
      // Kill any existing process on port 3001
      try {
        execSync('lsof -ti:3001 | xargs kill -9', { stdio: 'ignore' });
        await this.sleep(2000);
      } catch (e) {
        // Port not in use, continue
      }
      
      // Start provider in background
      const providerProcess = execSync('npm run start:provider', { 
        stdio: 'pipe',
        detached: true
      });
      
      // Wait for provider to start
      for (let i = 0; i < 30; i++) {
        try {
          execSync('curl -f http://localhost:3001/health', { stdio: 'ignore' });
          console.log('✅ Provider is running and healthy');
          return true;
        } catch (e) {
          await this.sleep(2000);
        }
      }
      
      throw new Error('Provider failed to start within 60 seconds');
    } catch (error) {
      console.log(`❌ Provider startup failed: ${error.message}`);
      return false;
    }
  }

  async runProviderTests() {
    console.log('🔍 Running provider verification tests...');
    const startTime = Date.now();
    
    try {
      const output = execSync('npm run test:verification', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      const tests = this.parseJestOutput(output);
      
      this.testResults.providerTests = tests;
      this.testResults.summary.providerDetails = `${tests.filter(t => t.status === 'PASS').length}/${tests.length} tests passed`;
      
      if (tests.some(t => t.status === 'FAIL')) {
        this.testResults.summary.provider = 'FAIL';
        this.testResults.summary.overall = 'FAIL';
      }
      
      console.log(`✅ Provider tests completed in ${duration}ms`);
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.providerTests.push({
        name: 'Provider Verification',
        status: 'FAIL',
        duration: duration,
        error: error.message
      });
      this.testResults.summary.provider = 'FAIL';
      this.testResults.summary.overall = 'FAIL';
      console.log(`❌ Provider tests failed: ${error.message}`);
      return false;
    }
  }

  async runAPITests() {
    console.log('🌐 Testing API endpoints...');
    const apiTests = [];
    
    const endpoints = [
      { name: 'Health Check', url: 'http://localhost:3001/health', method: 'GET' },
      { name: 'Get All Users', url: 'http://localhost:3001/api/users', method: 'GET' },
      { name: 'Get User by ID', url: 'http://localhost:3001/api/users/1', method: 'GET' },
      { name: 'Get Non-existent User', url: 'http://localhost:3001/api/users/999', method: 'GET' }
    ];
    
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const output = execSync(`curl -s -w "%{http_code}" -o /dev/null "${endpoint.url}"`, { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        
        const duration = Date.now() - startTime;
        const statusCode = parseInt(output.trim());
        const status = statusCode >= 200 && statusCode < 400 ? 'PASS' : 'FAIL';
        
        apiTests.push({
          endpoint: endpoint.name,
          method: endpoint.method,
          status: status,
          statusCode: statusCode,
          responseTime: duration
        });
        
        console.log(`${status === 'PASS' ? '✅' : '❌'} ${endpoint.name}: ${statusCode} (${duration}ms)`);
      } catch (error) {
        const duration = Date.now() - startTime;
        apiTests.push({
          endpoint: endpoint.name,
          method: endpoint.method,
          status: 'FAIL',
          statusCode: 0,
          responseTime: duration
        });
        console.log(`❌ ${endpoint.name}: Failed (${duration}ms)`);
      }
    }
    
    this.testResults.apiTests = apiTests;
    return apiTests.every(test => test.status === 'PASS');
  }

  async runSecurityAudit() {
    console.log('🛡️ Running security audit...');
    const startTime = Date.now();
    
    try {
      const output = execSync('npm run security:audit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const duration = Date.now() - startTime;
      const vulnerabilities = this.parseSecurityOutput(output);
      
      this.testResults.securityAudit = {
        vulnerabilities: vulnerabilities,
        auditLevel: 'moderate',
        duration: duration
      };
      
      this.testResults.summary.securityDetails = `${vulnerabilities} vulnerabilities found`;
      
      if (vulnerabilities > 0) {
        this.testResults.summary.security = 'WARNING';
      }
      
      console.log(`✅ Security audit completed: ${vulnerabilities} vulnerabilities found`);
      return true;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.securityAudit = {
        vulnerabilities: -1,
        auditLevel: 'moderate',
        duration: duration,
        error: error.message
      };
      this.testResults.summary.security = 'FAIL';
      this.testResults.summary.securityDetails = 'Audit failed';
      console.log(`❌ Security audit failed: ${error.message}`);
      return false;
    }
  }

  async checkPactFiles() {
    console.log('📄 Checking generated PACT files...');
    const pactDir = path.join(process.cwd(), 'pacts');
    const pactFiles = [];
    
    if (fs.existsSync(pactDir)) {
      const files = fs.readdirSync(pactDir)
        .filter(file => file.endsWith('.json'));
      
      for (const file of files) {
        const filePath = path.join(pactDir, file);
        const stats = fs.statSync(filePath);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        pactFiles.push({
          name: file,
          size: stats.size,
          interactions: content.interactions ? content.interactions.length : 0,
          timestamp: stats.mtime.toISOString()
        });
      }
    }
    
    this.testResults.pactFiles = pactFiles;
    console.log(`✅ Found ${pactFiles.length} PACT files`);
    return pactFiles.length > 0;
  }

  async runCompleteTestSuite() {
    console.log('🚀 Starting complete PACT test suite...');
    
    // Setup
    execSync('npm run ci:setup', { stdio: 'inherit' });
    
    // Run consumer tests
    await this.runConsumerTests();
    
    // Start provider
    const providerStarted = await this.startProvider();
    if (!providerStarted) {
      console.log('❌ Provider failed to start, skipping provider tests');
    } else {
      // Run provider tests
      await this.runProviderTests();
      
      // Run API tests
      await this.runAPITests();
    }
    
    // Run security audit
    await this.runSecurityAudit();
    
    // Check PACT files
    await this.checkPactFiles();
    
    // Calculate summary
    this.calculateSummary();
    
    // Generate reports
    const reports = await this.generateReports();
    
    // Cleanup
    try {
      execSync('lsof -ti:3001 | xargs kill -9', { stdio: 'ignore' });
    } catch (e) {
      // Ignore cleanup errors
    }
    
    this.testResults.duration = Date.now() - this.startTime;
    
    console.log('🎉 Test suite completed!');
    console.log(`📊 Overall Status: ${this.testResults.summary.overall}`);
    console.log(`⏱️  Total Duration: ${this.testResults.duration}ms`);
    console.log(`📄 Reports generated: ${reports.join(', ')}`);
    
    return {
      success: this.testResults.summary.overall === 'PASS',
      results: this.testResults,
      reports: reports
    };
  }

  calculateSummary() {
    const allTests = [
      ...this.testResults.consumerTests,
      ...this.testResults.providerTests
    ];
    
    this.testResults.summary.totalTests = allTests.length;
    this.testResults.summary.passedTests = allTests.filter(t => t.status === 'PASS').length;
    this.testResults.summary.failedTests = allTests.filter(t => t.status === 'FAIL').length;
    this.testResults.summary.successRate = allTests.length > 0 
      ? Math.round((this.testResults.summary.passedTests / allTests.length) * 100)
      : 0;
  }

  async generateReports() {
    const reports = [];
    
    try {
      const htmlReport = this.reportGenerator.generateHTMLReport(this.testResults);
      reports.push(htmlReport);
      console.log(`📄 HTML report generated: ${htmlReport}`);
    } catch (error) {
      console.log(`❌ Failed to generate HTML report: ${error.message}`);
    }
    
    try {
      const jsonReport = this.reportGenerator.generateJSONReport(this.testResults);
      reports.push(jsonReport);
      console.log(`📄 JSON report generated: ${jsonReport}`);
    } catch (error) {
      console.log(`❌ Failed to generate JSON report: ${error.message}`);
    }
    
    try {
      const markdownReport = this.reportGenerator.generateMarkdownReport(this.testResults);
      reports.push(markdownReport);
      console.log(`📄 Markdown report generated: ${markdownReport}`);
    } catch (error) {
      console.log(`❌ Failed to generate Markdown report: ${error.message}`);
    }
    
    return reports;
  }

  parseJestOutput(output) {
    const tests = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('✓') || line.includes('✗')) {
        const match = line.match(/([✓✗])\s+(.+?)\s+\((\d+)\s*ms\)/);
        if (match) {
          tests.push({
            name: match[2].trim(),
            status: match[1] === '✓' ? 'PASS' : 'FAIL',
            duration: parseInt(match[3])
          });
        }
      }
    }
    
    return tests;
  }

  parseSecurityOutput(output) {
    const match = output.match(/found (\d+) vulnerabilities/);
    return match ? parseInt(match[1]) : 0;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = TestRunner;
