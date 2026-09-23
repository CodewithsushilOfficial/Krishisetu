/**
 * scripts/kill-port.js
 * Runs before `npm run dev` (via "predev" hook).
 * Finds and kills any process holding port 5000 so nodemon starts clean.
 */

import { execSync } from 'child_process';

const PORT = process.env.PORT || 5000;

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: netstat to find PID, then taskkill
      const out = execSync(`netstat -aon`, { encoding: 'utf8' });
      const regex = new RegExp(`:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`);
      const match = out.match(regex);
      if (match) {
        execSync(`taskkill /F /PID ${match[1]}`, { stdio: 'ignore' });
        console.log(`[predev] Killed process PID ${match[1]} on port ${port}`);
      } else {
        console.log(`[predev] Port ${port} is free — starting fresh.`);
      }
    } else {
      // macOS / Linux: lsof
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
      if (out) {
        execSync(`kill -9 ${out}`, { stdio: 'ignore' });
        console.log(`[predev] Killed process PID ${out} on port ${port}`);
      } else {
        console.log(`[predev] Port ${port} is free — starting fresh.`);
      }
    }
  } catch {
    // Nothing listening on that port — perfectly fine
    console.log(`[predev] Port ${port} is free — starting fresh.`);
  }
}

killPort(PORT);
