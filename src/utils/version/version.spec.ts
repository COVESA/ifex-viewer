/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { describe, expect, it } from 'vitest';
import { getVersion } from './version';

describe('version', () => {
  it('should return version with major and minor version', () => {
    const majorVersion = 1;
    const minorVersion = 5;
    const expected = `v${majorVersion}.${minorVersion}`;

    const result = getVersion(majorVersion, minorVersion);

    expect(result).toEqual(expected);
  });

  it('should return version with major and minor version as 0', () => {
    const majorVersion = 1;
    const minorVersion = 0;
    const expected = `v${majorVersion}.${minorVersion}`;

    const result = getVersion(majorVersion, minorVersion);

    expect(result).toEqual(expected);
  });

  it('should return version with major and minor version as 0 when no minor version is provided', () => {
    const majorVersion = 1;

    const expected = `v${majorVersion}.0`;

    const result = getVersion(majorVersion);

    expect(result).toEqual(expected);
  });

  it('should return version with major as 0 when no major version is provided and given minor version', () => {
    const majorVersion = undefined;
    const minorVersion = 1;

    const expected = `v0.${minorVersion}`;

    const result = getVersion(majorVersion, minorVersion);

    expect(result).toEqual(expected);
  });

  it('should return empty string if no versions are provided', () => {
    const result = getVersion();

    expect(result).toBe('');
  });
});
