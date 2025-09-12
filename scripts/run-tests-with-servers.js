#!/usr/bin/env node

const { spawn } = require('child_process');
const ServerManager = require('./start-servers');
const path = require('path');

class TestRunner {
  constructor() {
    this.serverManager = new ServerManager();
    this.testResults = {
      consumer: { passed: 0, failed: 0, total: 0 },
      provider: { passed: 0, failed: 0, total: 0 },
      advanced: { passed: 0, failed: 0, total: 0 }
    };
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`\n🔧 Running: ${command} ${args.join(' ')}`);
      
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, code });
        } else {
          resolve({ success: false, code });
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runConsumerTests() {
    console.log('\n📋 Running Consumer Tests...');
    const result = await this.runCommand('npm', ['run', 'test:consumer']);
    
    if (result.success) {
      console.log('✅ Consumer tests passed');
      this.testResults.consumer.passed++;
    } else {
      console.log('❌ Consumer tests failed');
      this.testResults.consumer.failed++;
    }
    this.testResults.consumer.total++;
    
    return result.success;
  }

  async runProviderTests() {
    console.log('\n🔍 Running Provider Tests...');
    const result = await this.runCommand('node', ['scripts/run-provider-tests-with-server.js']);
    
    if (result.success) {
      console.log('✅ Provider tests passed');
      this.testResults.provider.passed++;
    } else {
      console.log('❌ Provider tests failed');
      this.testResults.provider.failed++;
    }
    this.testResults.provider.total++;
    
    return result.success;
  }

  async runAdvancedTests() {
    console.log('\n🚀 Running Advanced Tests...');
    const result = await this.runCommand('npm', ['run', 'test:advanced']);
    
    if (result.success) {
      console.log('✅ Advanced tests passed');
      this.testResults.advanced.passed++;
    } else {
      console.log('❌ Advanced tests failed');
      this.testResults.advanced.failed++;
    }
    this.testResults.advanced.total++;
    
    return result.success;
  }

  async runAllTests() {
    console.log('🎯 Starting Complete Test Suite with Servers...\n');
    
    try {
      // Start servers first
      await this.serverManager.startAllServers();
      
      // Wait for servers to be fully ready
      console.log('\n⏳ Waiting for servers to be ready...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Run tests in sequence
      const consumerSuccess = await this.runConsumerTests();
      const providerSuccess = await this.runProviderTests();
      const advancedSuccess = await this.runAdvancedTests();

      // Print summary
      this.printSummary();

      // Return overall success
      return consumerSuccess && providerSuccess;

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      return false;
    } finally {
      // Always shutdown servers
      await this.serverManager.shutdown();
    }
  }

  printSummary() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const categories = ['consumer', 'provider', 'advanced'];
    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;

    categories.forEach(category => {
      const results = this.testResults[category];
      const status = results.failed === 0 ? '✅' : '❌';
      console.log(`${status} ${category.toUpperCase()}: ${results.passed}/${results.total} passed`);
      
      totalPassed += results.passed;
      totalFailed += results.failed;
      totalTests += results.total;
    });

    console.log('========================');
    const overallStatus = totalFailed === 0 ? '✅' : '❌';
    console.log(`${overallStatus} OVERALL: ${totalPassed}/${totalTests} tests passed`);
    
    if (totalFailed > 0) {
      console.log(`❌ ${totalFailed} test(s) failed`);
    } else {
      console.log('🎉 All tests passed!');
    }
  }
}

// Main execution
async function main() {
  const testRunner = new TestRunner();
  
  try {
    const success = await testRunner.runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = TestRunner;
