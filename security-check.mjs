import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const files=[];
function walk(dir){for(const n of fs.readdirSync(dir)){if(['node_modules','dist'].includes(n))continue;const p=path.join(dir,n),s=fs.statSync(p);if(s.isDirectory())walk(p);else files.push(p)}}
walk(root);
const source=files.filter(f=>/\.(ts|js|json|yml|yaml|dart)$/.test(f)).map(f=>fs.readFileSync(f,'utf8')).join('\n');
const failures=[];
for(const pattern of [/console\.log\([^\n]*(?:otp|pin|password|token|secret)/i, /PAYSTACK_SECRET_KEY\s*[:=]\s*["']sk_live_/i, /(?:password|pin|otp|secret)\s*[:=]\s*["'][^"']{4,}["']/i]) if(pattern.test(source)) failures.push(`Sensitive literal pattern detected: ${pattern}`);
if(fs.existsSync(path.join(root,'.env'))) failures.push('.env exists in source tree; production secrets must use a secret manager');
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Security static check passed: ${files.length} files inspected.`);
