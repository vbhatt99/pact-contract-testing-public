#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

class ServerManager {
  constructor() {
    this.servers = [];
    this.isShuttingDown = false;
  }

  startServer(name, port, scriptPath) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting ${name} on port ${port}...`);
      
      const server = spawn('node', [scriptPath], {
        env: { ...process.env, PORT: port },
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });

      server.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[${name}] ${output.trim()}`);
        
        // Check if server is ready
        if (output.includes('Provider server running on port') || 
            output.includes('Health check:')) {
          resolve(server);
        }
      });

      server.stderr.on('data', (data) => {
        console.error(`[${name} ERROR] ${data.toString().trim()}`);
      });

      server.on('error', (error) => {
        console.error(`[${name} ERROR] Failed to start:`, error);
        reject(error);
      });

      server.on('exit', (code) => {
        if (!this.isShuttingDown) {
          console.log(`[${name}] Server exited with code ${code}`);
        }
      });

      // Store server reference
      this.servers.push({ name, port, process: server });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!server.killed) {
          resolve(server);
        }
      }, 10000);
    });
  }

  async startAllServers() {
    console.log('🎯 Starting all required servers for testing...\n');

    try {
      // Start main provider server (handles both users and products)
      await this.startServer(
        'MainProvider', 
        3001, 
        path.join(__dirname, '../examples/provider/server.js')
      );

      // Wait a bit between server starts
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('\n✅ All servers started successfully!');
      console.log('📊 Server Status:');
      this.servers.forEach(server => {
        console.log(`   - ${server.name}: http://localhost:${server.port}`);
      });
      console.log('\n🔍 Health checks:');
      console.log('   - Main Provider: http://localhost:3001/health');
      console.log('   - Users API: http://localhost:3001/api/users');
      console.log('   - Products API: http://localhost:3001/api/products');

    } catch (error) {
      console.error('❌ Failed to start servers:', error);
      await this.shutdown();
      process.exit(1);
    }
  }

  async shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    console.log('\n🛑 Shutting down servers...');

    const shutdownPromises = this.servers.map(server => {
      return new Promise((resolve) => {
        console.log(`   Stopping ${server.name}...`);
        server.process.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (!server.process.killed) {
            server.process.kill('SIGKILL');
          }
          resolve();
        }, 5000);
      });
    });

    await Promise.all(shutdownPromises);
    console.log('✅ All servers stopped');
  }

  // Handle graceful shutdown
  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('\n🛑 Received shutdown signal...');
      this.shutdown().then(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGQUIT', shutdown);
  }
}

// Main execution
async function main() {
  const serverManager = new ServerManager();
  serverManager.setupGracefulShutdown();

  try {
    await serverManager.startAllServers();
    
    // Keep the process alive
    console.log('\n⏳ Servers are running. Press Ctrl+C to stop all servers.');
    
    // Keep process alive
    setInterval(() => {
      // Check if any server died unexpectedly
      serverManager.servers.forEach(server => {
        if (server.process.killed && !serverManager.isShuttingDown) {
          console.error(`❌ ${server.name} died unexpectedly!`);
          process.exit(1);
        }
      });
    }, 5000);

  } catch (error) {
    console.error('❌ Failed to start servers:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ServerManager;
