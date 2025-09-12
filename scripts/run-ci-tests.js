#!/usr/bin/env node

const { spawn } = require('child_process');
const ServerManager = require('./start-servers');

class CITestRunner {
  constructor() {
    this.serverManager = new ServerManager();
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
    console.log('\n📋 Running Consumer Tests (Generate PACT Contracts)...');
    const result = await this.runCommand('npm', ['run', 'test:consumer']);
    
    if (result.success) {
      console.log('✅ Consumer tests passed - PACT contracts generated');
    } else {
      console.log('❌ Consumer tests failed');
    }
    
    return result.success;
  }

  async runProviderTests() {
    console.log('\n🔍 Running Provider Tests (Verify PACT Contracts)...');
    const result = await this.runCommand('npm', ['run', 'test:provider']);
    
    if (result.success) {
      console.log('✅ Provider tests passed - PACT contracts verified');
    } else {
      console.log('❌ Provider tests failed');
    }
    
    return result.success;
  }

  async runAdvancedTests() {
    console.log('\n🚀 Running Advanced Integration Tests...');
    const result = await this.runCommand('npm', ['run', 'test:advanced']);
    
    if (result.success) {
      console.log('✅ Advanced tests passed');
    } else {
      console.log('❌ Advanced tests failed');
    }
    
    return result.success;
  }

  async runAllCITests() {
    console.log('🎯 Starting CI Test Suite...\n');
    
    try {
      // Step 1: Run consumer tests to generate PACT contracts
      const consumerSuccess = await this.runConsumerTests();
      if (!consumerSuccess) {
        console.log('❌ Consumer tests failed - stopping CI pipeline');
        return false;
      }

      // Step 2: Start servers for provider and advanced tests
      console.log('\n🚀 Starting test servers...');
      await this.serverManager.startAllServers();
      
      // Wait for servers to be ready
      console.log('\n⏳ Waiting for servers to be ready...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Step 3: Run provider tests (verify PACT contracts)
      const providerSuccess = await this.runProviderTests();
      
      // Step 4: Run advanced tests (integration tests)
      const advancedSuccess = await this.runAdvancedTests();

      // Print summary
      console.log('\n📊 CI Test Results Summary:');
      console.log('============================');
      console.log(`✅ Consumer Tests: ${consumerSuccess ? 'PASSED' : 'FAILED'}`);
      console.log(`✅ Provider Tests: ${providerSuccess ? 'PASSED' : 'FAILED'}`);
      console.log(`✅ Advanced Tests: ${advancedSuccess ? 'PASSED' : 'FAILED'}`);
      console.log('============================');
      
      const overallSuccess = consumerSuccess && providerSuccess;
      console.log(`🎯 Overall Result: ${overallSuccess ? 'PASSED' : 'FAILED'}`);

      return overallSuccess;

    } catch (error) {
      console.error('❌ CI test execution failed:', error);
      return false;
    } finally {
      // Always shutdown servers
      console.log('\n🛑 Shutting down test servers...');
      await this.serverManager.shutdown();
    }
  }
}

// Main execution
async function main() {
  const testRunner = new CITestRunner();
  
  try {
    const success = await testRunner.runAllCITests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ CI test runner failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CITestRunner;
