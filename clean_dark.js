const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('d:/laragon/www/portofolio/src');
files.forEach(file => {
  if (file.includes('HeroSection.jsx') || file.includes('Navbar.jsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/dark:[^\s"'\`]+/g, '');
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed', file);
  }
});
console.log('DONE');
