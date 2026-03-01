import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Read and parse package.json
const pkgPath = resolve(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

// Increment patch version
const parts = pkg.version.split('.');
parts[2] = String(Number(parts[2]) + 1);
const newVersion = parts.join('.');

console.log(`Bumping version: ${pkg.version} → ${newVersion}`);

// Update package.json
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// Update src-tauri/tauri.conf.json
const tauriConfPath = resolve(root, 'src-tauri/tauri.conf.json');
const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

// Update src-tauri/Cargo.toml (replace version field in [package] section)
const cargoPath = resolve(root, 'src-tauri/Cargo.toml');
const cargo = readFileSync(cargoPath, 'utf8');
const updated = cargo.replace(
  /^(version\s*=\s*")[^"]+(")/m,
  `$1${newVersion}$2`
);
writeFileSync(cargoPath, updated);

console.log(`Updated: package.json, src-tauri/tauri.conf.json, src-tauri/Cargo.toml`);
