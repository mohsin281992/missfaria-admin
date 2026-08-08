import { execSync } from 'child_process';

try {
  console.log('Staging changes...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('Committing changes...');
  execSync('git commit -m "List Modules and Marketing items directly under Categories in left sidebar in sequence"', { stdio: 'inherit' });
  console.log('Pushing to origin main...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('Successfully published!');
} catch (err) {
  console.error('Publish error:', err.message);
}
