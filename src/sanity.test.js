import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (file) => readFileSync(resolve(import.meta.dirname, '..', file), 'utf8');
const pkg = JSON.parse(read('package.json'));

describe('supply chain hardening', () => {
  it('.npmrc disables install scripts and enforces a minimum release age', () => {
    const npmrc = read('.npmrc');
    expect(npmrc).toMatch(/^ignore-scripts=true$/m);
    expect(npmrc).toMatch(/^min-release-age=([3-9]|\d{2,})$/m);
  });

  it('pins every dependency to an exact version', () => {
    const ranges = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })
      .filter(([, version]) => !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version));
    expect(ranges).toEqual([]);
  });

  it('has a lockfile', () => {
    expect(existsSync(resolve(import.meta.dirname, '..', 'package-lock.json'))).toBe(true);
  });

  it('configures dependabot cooldowns (3 days, 7 for major)', () => {
    const dependabot = read('.github/dependabot.yml');
    expect(dependabot).toMatch(/default-days: 3/);
    expect(dependabot).toMatch(/semver-major-days: 7/);
  });
});

describe('legacy WebView invariants', () => {
  it('keeps the old-Android browserslist entries', () => {
    expect(pkg.browserslist).toContain('Chrome >= 45');
    expect(pkg.browserslist).toContain('Android >= 4.4');
  });

  it('keeps terser as the minifier', () => {
    expect(read('vite.config.js')).toMatch(/minify:\s*'terser'/);
  });

  it('does not depend directly on @dsplay/template-utils', () => {
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('@dsplay/template-utils');
  });
});

describe('package identity', () => {
  it('has a kebab-case name with the dsplay- prefix', () => {
    expect(pkg.name).toMatch(/^dsplay-[a-z0-9-]+$/);
  });
});
