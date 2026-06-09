import { spawn } from 'child_process';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// Use process.cwd() which npm sets correctly, avoiding path resolution issues
const projectRoot = process.cwd();

// Find vite binary using absolute path
const vitePath = resolve(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

if (!existsSync(vitePath)) {
  console.error('Vite not found. Please run npm install first.');
  console.error('Looking for:', vitePath);
  process.exit(1);
}

const args = process.argv.slice(2);
const viteProcess = spawn('node', [vitePath, ...args], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (error) => {
  console.error('Error starting Vite:', error);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  process.exit(code || 0);
});

