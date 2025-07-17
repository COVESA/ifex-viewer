/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { expect, test } from '@playwright/test';
import { fleetSizeMethodSlotContent, headlineSlotText, initialNodePathQueryName, slotQueryName } from './e2e-apps-setup';

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
  });
});
