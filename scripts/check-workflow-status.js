#!/usr/bin/env node

/**
 * GitHub Actions Workflow Status Checker
 * 
 * This script checks the status of GitHub Actions workflows
 * and provides a summary of recent runs.
 * 
 * Usage: node scripts/check-workflow-status.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'your-org';
const REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'pact-contract-testing';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Workflow names to check
const WORKFLOWS = [
  'PACT Contract Testing CI/CD',
  'Security and Compliance Scan',
  'Docker Build and Deploy'
];

/**
 * Make HTTP request to GitHub API
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'User-Agent': 'PACT-Workflow-Checker',
        'Accept': 'application/vnd.github.v3+json',
        ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
      },
      ...options
    };

    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Get workflow runs for a specific workflow
 */
async function getWorkflowRuns(workflowName) {
  try {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows`;
    const { data: workflows } = await makeRequest(url);
    
    const workflow = workflows.workflows.find(w => w.name === workflowName);
    if (!workflow) {
      console.log(`⚠️  Workflow "${workflowName}" not found`);
      return null;
    }

    const runsUrl = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${workflow.id}/runs?per_page=5`;
    const { data: runs } = await makeRequest(runsUrl);
    
    return {
      workflow: workflow.name,
      runs: runs.workflow_runs
    };
  } catch (error) {
    console.error(`❌ Error fetching workflow runs for "${workflowName}":`, error.message);
    return null;
  }
}

/**
 * Format workflow run status
 */
function formatRunStatus(run) {
  const status = run.status;
  const conclusion = run.conclusion;
  const emoji = {
    'completed': conclusion === 'success' ? '✅' : conclusion === 'failure' ? '❌' : '⚠️',
    'in_progress': '🔄',
    'queued': '⏳',
    'cancelled': '🚫'
  }[status] || '❓';

  const date = new Date(run.created_at).toLocaleDateString();
  const time = new Date(run.created_at).toLocaleTimeString();
  
  return `${emoji} ${run.head_branch} - ${conclusion || status} (${date} ${time})`;
}

/**
 * Generate workflow status report
 */
async function generateReport() {
  console.log('🔍 GitHub Actions Workflow Status Report');
  console.log('=====================================\n');

  if (!GITHUB_TOKEN) {
    console.log('⚠️  GITHUB_TOKEN not set. Some features may be limited.\n');
  }

  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}\n`);

  for (const workflowName of WORKFLOWS) {
    console.log(`📋 ${workflowName}`);
    console.log('-'.repeat(workflowName.length + 4));

    const workflowData = await getWorkflowRuns(workflowName);
    
    if (!workflowData) {
      console.log('   No data available\n');
      continue;
    }

    if (workflowData.runs.length === 0) {
      console.log('   No recent runs found\n');
      continue;
    }

    workflowData.runs.forEach(run => {
      console.log(`   ${formatRunStatus(run)}`);
    });

    console.log('');
  }

  // Summary
  console.log('📊 Summary');
  console.log('----------');
  console.log('• Check individual workflow runs for detailed logs');
  console.log('• Use GitHub Actions tab for real-time monitoring');
  console.log('• Configure notifications for failed runs');
  console.log('• Review artifacts for test results and logs\n');

  console.log('🔗 Useful Links:');
  console.log(`• Actions Dashboard: https://github.com/${REPO_OWNER}/${REPO_NAME}/actions`);
  console.log(`• Workflows: https://github.com/${REPO_OWNER}/${REPO_NAME}/actions/workflows`);
}

/**
 * Main execution
 */
async function main() {
  try {
    await generateReport();
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  getWorkflowRuns,
  generateReport
};
