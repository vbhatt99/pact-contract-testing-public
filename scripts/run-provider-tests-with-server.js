#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

class ProviderTestRunner {
  constructor() {
    this.serverUrl = 'http://localhost:3001';
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`\n🔧 Running: ${command} ${args.join(' ')}`);
      
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PROVIDER_BASE_URL: this.serverUrl },
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

  async runProviderTests() {
    console.log('\n🔍 Running Provider Tests with External Server...');
    
    // Run only the simple user service test that doesn't start its own server
    const result = await this.runCommand('npx', [
      'jest', 
      'examples/provider/__tests__/simpleUserService.verification.test.js'
    ]);
    
    if (result.success) {
      console.log('✅ Provider tests passed');
      return true;
    } else {
      console.log('❌ Provider tests failed');
      return false;
    }
  }
}

// Main execution
async function main() {
  const testRunner = new ProviderTestRunner();
  
  try {
    const success = await testRunner.runProviderTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Provider test runner failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ProviderTestRunner;
