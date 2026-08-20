/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { expect, test, type Page } from '@playwright/test';
import { fleetSizeMethodSlotContent, headlineSlotText, initialNodePathQueryName, slotQueryName } from './e2e-apps-setup';

type Platform = 'mac' | 'windows' | 'linux' | 'other';

const getPlatform = async (page: Page): Promise<Platform> =>
  page.evaluate(() => {
    const platform = ('userAgentData' in navigator ? (navigator.userAgentData as { platform: string }).platform : navigator.platform).toLowerCase();

    if (platform.includes('mac')) {
      return 'mac';
    } else if (platform.includes('win')) {
      return 'windows';
    } else if (platform.includes('linux')) {
      return 'linux';
    }

    return 'other';
  });

const setSearchShortcut = async (page: Page, shortcut: Record<string, string>) => {
  await page.locator('ifex-viewer').evaluate(
    (viewer, configuredShortcut) => {
      (viewer as HTMLElement & { searchShortcut?: Record<string, string> }).searchShortcut = configuredShortcut;
    },
    shortcut,
  );
};

test.describe('e2e ifex viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('events', () => {
    test('should listen to spec was loaded event successfully', async ({ page }) => {
      const specLoadedEventStatus = page.getByText('Spec loaded: true');
      await expect(specLoadedEventStatus).toBeVisible();
    });

    test('should listen to node was selected event successfully', async ({ page }) => {
      const label = 'coordinateAttack';
      const path = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack';

      await page.getByText(label).click();

      const selectedNode = page.getByText(`Selected node: ${path}`);
      await expect(selectedNode).toBeVisible();
    });

    test('should listen to copy to clipboard event successfully', async ({ page }) => {
      const label = 'deployTIEFighters';
      const path = 'GalacticEmpire.ImperialNavy.deployTIEFighters';

      await page.getByText(label).click();

      await page.getByTestId('copy-btn').click();

      const copiedEventPayloadType = page.getByText('Type: dotNotation');
      await expect(copiedEventPayloadType).toBeVisible();
      const copiedEventPayloadData = page.getByText(`Data: ${path}`);
      await expect(copiedEventPayloadData).toBeVisible();
    });
  });

  test('should initialize viewer with given node path', async ({ page }) => {
    const name = 'coordinateAttack';
    const path = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack';

    await page.goto(`/?${initialNodePathQueryName}=${path}`);

    const detailPageContainer = page.getByTestId('detail-page-container');
    await expect(detailPageContainer.getByText(name, { exact: true })).toBeVisible();
  });

  test('should render slots correctly', async ({ page }) => {
    const nodeLabel = 'coordinateAttack';

    await page.goto(`/?${slotQueryName}=true`);

    await page.getByText(nodeLabel).click();

    await expect(page.getByText(headlineSlotText)).toBeVisible();
    await expect(page.getByText(fleetSizeMethodSlotContent)).toBeVisible();
  });

  test.describe('navigation', () => {
    test('should navigate to a node via sidebar', async ({ page }) => {
      const label = 'recruitStormtrooper';

      await page.getByText(label).click();

      const detailPageContainer = page.getByTestId('detail-page-container');
      await expect(detailPageContainer.getByText(label, { exact: true })).toBeVisible();
    });

    test('should navigate to a node via breadcrumbs', async ({ page }) => {
      const coordinateAttackNodeLabel = 'coordinateAttack';
      const desiredNodeLabel = 'ImperialNavy';

      // Select a node first to be able to go back via breadcrumbs
      await page.getByText(coordinateAttackNodeLabel).click();

      const breadcrumbs = page.getByTestId('breadcrumbs');
      await breadcrumbs.getByText(desiredNodeLabel).click();

      const detailPageContainer = page.getByTestId('detail-page-container');
      await expect(detailPageContainer.getByText(desiredNodeLabel, { exact: true })).toBeVisible();
    });
  });

  test.describe('search', () => {
    test('should search and select search result', async ({ page }) => {
      const searchQuery = 'fleetSize';
      const nodeToSelect = 'coordinateAttack';

      await page.getByRole('searchbox').fill(searchQuery);

      await page.getByTestId('search-result-item').getByText(nodeToSelect).click();

      const detailPageContainer = page.getByTestId('detail-page-container');
      await expect(detailPageContainer.getByText(nodeToSelect, { exact: true })).toBeVisible();
    });

    test('should focus the search input with the default platform shortcut', async ({ page }) => {
      const platform = await getPlatform(page);
      const shortcut = platform === 'mac' ? 'Meta+G' : 'Control+G';
      const searchInput = page.getByRole('searchbox');

      await page.keyboard.press(shortcut);

      await expect(searchInput).toBeFocused();
    });

    test('should focus the search input with a configured single-key shortcut', async ({ page }) => {
      const searchInput = page.getByRole('searchbox');
      await setSearchShortcut(page, { mac: 'F', windows: 'F', linux: 'F', default: 'F' });

      await page.keyboard.press('F');

      await expect(searchInput).toBeFocused();
    });

    test('should focus the search input with a configured three-part shortcut', async ({ page }) => {
      const platform = await getPlatform(page);
      const shortcut = platform === 'mac' ? 'Meta+Alt+L' : 'Control+Alt+L';
      const searchInput = page.getByRole('searchbox');
      await setSearchShortcut(page, { mac: 'Meta+Alt+L', windows: 'Control+Alt+L', linux: 'Control+Alt+L', default: 'Control+Alt+L' });

      await page.keyboard.press(shortcut);

      await expect(searchInput).toBeFocused();
    });

    test('should fall back to the default platform shortcut for an invalid configured shortcut', async ({ page }) => {
      const platform = await getPlatform(page);
      const shortcut = platform === 'mac' ? 'Meta+G' : 'Control+G';
      const searchInput = page.getByRole('searchbox');
      await setSearchShortcut(page, { mac: 'Control+Shift', windows: 'Control+Shift', linux: 'Control+Shift', default: 'Control+Shift' });

      await page.keyboard.press(shortcut);

      await expect(searchInput).toBeFocused();
    });
  });
});
