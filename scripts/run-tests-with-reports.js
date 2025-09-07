#!/usr/bin/env node

const TestRunner = require('../utils/testRunner');
const path = require('path');

async function main() {
  const testRunner = new TestRunner();
  
  try {
    const result = await testRunner.runCompleteTestSuite();
    
    if (result.success) {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test suite failed with error:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
PACT Contract Testing Framework - Test Runner with Reports

Usage: node scripts/run-tests-with-reports.js [options]

Options:
  --help, -h     Show this help message
  --json         Output results as JSON
  --quiet        Suppress console output
  --no-reports   Skip report generation

Examples:
  node scripts/run-tests-with-reports.js
  node scripts/run-tests-with-reports.js --json
  node scripts/run-tests-with-reports.js --quiet
`);
  process.exit(0);
}

if (args.includes('--json')) {
  // Override console.log for JSON output
  const originalLog = console.log;
  console.log = () => {}; // Suppress regular output
  
  main().then(result => {
    originalLog(JSON.stringify(result.results, null, 2));
    process.exit(result.success ? 0 : 1);
  });
} else if (args.includes('--quiet')) {
  // Suppress most output
  const originalLog = console.log;
  console.log = (message) => {
    if (message.includes('🎉') || message.includes('❌') || message.includes('💥')) {
      originalLog(message);
    }
  };
  
  main();
} else {
  main();
}
