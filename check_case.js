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
      if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('d:/laragon/www/portofolio/src');
const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;

let foundMismatch = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith('.')) {
      let absolutePath = path.resolve(path.dirname(file), importPath);
      try {
        const basename = path.basename(importPath);
        const dirname = path.dirname(absolutePath);
        if (!fs.existsSync(dirname)) {
           continue;
        }
        const actualFiles = fs.readdirSync(dirname);
        const exactMatch = actualFiles.find(f => f === basename || f === basename + '.js' || f === basename + '.jsx' || f === basename + '.css' || f === basename + '.png' || f === basename + '.jpg' || f === basename + '.webp' || f === basename + '.svg');
        const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === basename.toLowerCase() || f.toLowerCase() === basename.toLowerCase() + '.js' || f.toLowerCase() === basename.toLowerCase() + '.jsx' || f.toLowerCase() === basename.toLowerCase() + '.css' || f.toLowerCase() === basename.toLowerCase() + '.png' || f.toLowerCase() === basename.toLowerCase() + '.jpg' || f.toLowerCase() === basename.toLowerCase() + '.webp' || f.toLowerCase() === basename.toLowerCase() + '.svg');
        
        if (caseInsensitiveMatch && !exactMatch) {
           console.log('MISMATCH:', importPath, 'should be', caseInsensitiveMatch, 'in file:', file);
           foundMismatch = true;
        }
      } catch (e) {
      }
    }
  }
});
if (!foundMismatch) console.log('No mismatches found.');
