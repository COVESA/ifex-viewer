/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { render, screen, within } from '@testing-library/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import App from './App.vue';
import { getTestOptions } from './tests/base-test-options';
import { customLayerSpecificationItemMock, specificationItemMock, specificationMockWithComplexDatatypes, specificationWithTwoDocs } from './tests/mocks/specification';
import { IfexViewerProps } from './types';
import * as specificationModel from './model/specification-model.ts';
import { ViewTabs } from './components/sidenav/types.ts';

type Slots = Record<string, any>;

const renderComponent = (props: IfexViewerProps, slots?: Slots) => {
  const { options, user } = getTestOptions({ usePinia: true });

  const { emitted, rerender } = render(App, { ...options, props, slots });

  return { user, emitted, rerender };
};

describe('App', () => {
  it('should error message when no specifications are given', async () => {
    const props: IfexViewerProps = { specifications: [], layout: { sidenavPosition: 'left' } };
    renderComponent({
      ...props,
    });

    expect(screen.getByText('No API specifications have been provided!')).toBeInTheDocument();
    expect(screen.queryByTestId('detail-page-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidenav')).not.toBeInTheDocument();
  });

  it('should be able to handle null values in specifications input', async () => {
    const props: IfexViewerProps = { specifications: [null as any, specificationItemMock], layout: { sidenavPosition: 'left' } };
    renderComponent({
      ...props,
    });

    expect(screen.queryByText('No specifications have been provided!')).not.toBeInTheDocument();
    expect(screen.getByTestId('detail-page-container')).toBeInTheDocument();
    expect(screen.getByTestId('sidenav')).toBeInTheDocument();
  });

  it('should render correct breadcrumbs for the selected node', async () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    const breadcrumbs = screen.getByTestId('breadcrumbs');

    expect(within(breadcrumbs).queryByText('GalacticEmpire')).not.toBeInTheDocument();
    expect(within(breadcrumbs).queryByText('ImperialNavy')).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText('ImperialNavy');
    await user.click(nodeToSelect);

    expect(within(breadcrumbs).getByText('GalacticEmpire')).toBeInTheDocument();
    expect(within(breadcrumbs).getByText('ImperialNavy')).toBeInTheDocument();
  });

  it('should emit specloaded event when parsing is done', () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { emitted } = renderComponent({
      ...props,
    });

    expect(emitted('specloaded')).toBeTruthy();
  });

  it('should render sidenav correctly with given specification', () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    renderComponent({
      ...props,
    });

    const sidenav = screen.getByTestId('sidenav');

    expect(within(sidenav).getByText('GalacticEmpire')).toBeInTheDocument();
    expect(within(sidenav).getByText('DeathStarDestroyed')).toBeInTheDocument();
    expect(within(sidenav).getByText('recruitStormtrooper')).toBeInTheDocument();
    expect(within(sidenav).getByText('deployStarfleet')).toBeInTheDocument();
    expect(within(sidenav).getByText('Starship')).toBeInTheDocument();
    expect(within(sidenav).getByText('Rank')).toBeInTheDocument();
    expect(within(sidenav).getByText('emperor')).toBeInTheDocument();
    expect(within(sidenav).getByText('ImperialNavy')).toBeInTheDocument();
    expect(within(sidenav).getByText('deployTIEFighters')).toBeInTheDocument();
    expect(within(sidenav).getByText('FleetCommand')).toBeInTheDocument();
    expect(within(sidenav).getByText('coordinateAttack')).toBeInTheDocument();
    expect(within(sidenav).getByText('GalacticCoordinates')).toBeInTheDocument();
  });

  it('should select api detail page initially', () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    renderComponent({
      ...props,
    });

    const detailPageContainer = screen.getByTestId('detail-page-container');

    expect(within(detailPageContainer).getByText('Merged document')).toBeInTheDocument();
    expect(within(detailPageContainer).getByText('API for the operations and command structure of the Galactic Empire')).toBeInTheDocument();
  });

  it('should select detail page via breadcrumbs correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    const nodeToSelect = screen.getByText('FleetCommand');
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText('FleetCommand')).toBeInTheDocument();

    const breadcrumbs = screen.getByTestId('breadcrumbs');
    const breadcrumbToSelect = within(breadcrumbs).getByText('ImperialNavy');
    await user.click(breadcrumbToSelect);

    expect(within(getDetailPageContainer()).getByText('ImperialNavy')).toBeInTheDocument();
  });

  it('should select event detail page correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const eventToSelect = 'DeathStarDestroyed';

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(eventToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(eventToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(eventToSelect)).toBeInTheDocument();
  });

  it('should select struct detail page correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const structToSelect = 'Starship';

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(structToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(structToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(structToSelect)).toBeInTheDocument();
  });

  it('should select typedef detail page correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const typedefToSelect = 'GalacticCoordinates';

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(typedefToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(typedefToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(typedefToSelect)).toBeInTheDocument();
  });

  it('should select property detail page correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const propertyToSelect = 'emperor';

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(propertyToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(propertyToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(propertyToSelect)).toBeInTheDocument();
  });

  it('should select enumeration detail page correctly', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const enumerationToSelect = 'Rank';

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(enumerationToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(enumerationToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(enumerationToSelect)).toBeInTheDocument();
  });

  it('should emit node selected event', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const eventToSelect = 'DeathStarDestroyed';
    const expectedDotNotationPath = `GalacticEmpire.${eventToSelect}`;

    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const { user, emitted } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(eventToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(eventToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(eventToSelect)).toBeInTheDocument();
    expect(emitted('nodeselected')).toEqual([[{ path: expectedDotNotationPath }]]);
  });

  it('should update viewer model when content of given specifications did change', async () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');

    const { rerender } = renderComponent({
      ...props,
    });

    await rerender({ specifications: [customLayerSpecificationItemMock] });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(2);
  });

  it('should update viewer model when filenames of given specifications did change', async () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');

    const { rerender } = renderComponent({
      ...props,
    });

    await rerender({ specifications: [{ filename: 'some-other-name.yml', content: specificationItemMock.content }] });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(2);
  });

  it('should NOT update viewer model when content of given specifications has no changes', async () => {
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');

    const { rerender } = renderComponent({
      ...props,
    });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(1);

    await rerender({ specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(1); // should still call only once
  });

  it('should NOT update viewer model when order of content of given specifications changes', async () => {
    const givenSpecifications = [specificationItemMock, { filename: 'two-docs.yml', content: specificationWithTwoDocs }];
    const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');

    const { rerender } = renderComponent({
      ...props,
    });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(1);

    await rerender({ specifications: givenSpecifications.reverse(), layout: { sidenavPosition: 'left' } }); // Reverse order of given specifications

    expect(getViewerModelSpy).toHaveBeenCalledTimes(1); // should still call only once
  });

  it('should keep currently selected node when given specifications did change and node still exists', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');
    const eventToSelect = 'DeathStarDestroyed';

    const { rerender, user, emitted } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(eventToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(eventToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(eventToSelect)).toBeInTheDocument();

    await rerender({ specifications: [{ filename: 'different.yml', content: specificationItemMock.content }], layout: { sidenavPosition: 'left' } });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(2);
    expect(within(getDetailPageContainer()).getByText(eventToSelect)).toBeInTheDocument();
    expect(emitted('specloaded')).toBeTruthy();
  });

  it('should NOT keep currently selected node when given specifications did change and node does not exist in new specification anymore', async () => {
    const getDetailPageContainer = () => screen.getByTestId('detail-page-container');
    const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };
    const getViewerModelSpy = vi.spyOn(specificationModel, 'getViewerModel');
    const eventToSelect = 'DeathStarDestroyed';

    const { rerender, user, emitted } = renderComponent({
      ...props,
    });

    expect(within(getDetailPageContainer()).queryByText(eventToSelect)).not.toBeInTheDocument();

    const nodeToSelect = screen.getByText(eventToSelect);
    await user.click(nodeToSelect);

    expect(within(getDetailPageContainer()).getByText(eventToSelect)).toBeInTheDocument();

    await rerender({
      specifications: [
        {
          filename: 'updated.yml',
          content: `
name: "GalacticEmpireCustomAPI"
description: "Custom layer for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 1
namespaces:
  - name: "GalacticEmpire"
    description: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 1
    events:
      - name: "RebelBaseDiscovered"
        description: "Event triggered when a Rebel base is discovered"
        input:
          - name: "baseLocation"
            datatype: "GalacticCoordinates"
            description: "The coordinates of the discovered Rebel base"
            example: "12.345, 67.891"
          - name: "discoveredBy"
            datatype: "string"
            description: "The name of the entity that discovered the base"
            example: "Darth Vader"
    `,
        },
      ],
      layout: { sidenavPosition: 'left' },
    });

    expect(getViewerModelSpy).toHaveBeenCalledTimes(2);
    expect(within(getDetailPageContainer()).queryByText(eventToSelect)).not.toBeInTheDocument();
    expect(within(getDetailPageContainer()).getByText('Merged document')).toBeInTheDocument();
    expect(emitted('specloaded')).toBeTruthy();
  });

  it('should show merge view as default view', async () => {
    const givenSpecifications = [specificationItemMock, { filename: 'two-docs.yml', content: specificationWithTwoDocs }];
    const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

    renderComponent({
      ...props,
    });

    const sidenav = screen.getByTestId('sidenav');
    expect(within(sidenav).getByText('Merged document')).toBeInTheDocument();
    expect(within(sidenav).queryByText('TinyGalacticEmpireAPI')).not.toBeInTheDocument();
    expect(within(sidenav).queryByText('GalacticEmpireAPI')).not.toBeInTheDocument();
  });

  it('should switch from merge view to layered view', async () => {
    const givenSpecifications = [specificationItemMock, { filename: 'two-docs.yml', content: specificationWithTwoDocs }];
    const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

    const { user } = renderComponent({
      ...props,
    });

    const sidenav = screen.getByTestId('sidenav');
    expect(within(sidenav).getByText('Merged document')).toBeInTheDocument();
    expect(within(sidenav).queryByText('TinyGalacticEmpireAPI')).not.toBeInTheDocument();
    expect(within(sidenav).queryByText('GalacticEmpireAPI')).not.toBeInTheDocument();

    await user.click(screen.getByText(ViewTabs.LAYERED_VIEW));

    expect(within(sidenav).queryByText('Merged document')).not.toBeInTheDocument();
    expect(within(sidenav).getByText('TinyGalacticEmpireAPI')).toBeInTheDocument();
    expect(within(sidenav).getAllByText('GalacticEmpireAPI')).toHaveLength(2);
  });

  it('should not show tabs when only one document is provided', () => {
    const givenSpecifications = [specificationItemMock];
    const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

    renderComponent({
      ...props,
    });

    // Reason for hiding tabs: Merged view and layered view are the same then
    const tabs = screen.queryByTestId('view-tabs');
    expect(tabs).not.toBeInTheDocument();
  });

  it('should change sidenav position on view column icon click in sidenav', async () => {
    const givenSpecifications = [specificationItemMock];
    const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

    const { user, emitted } = renderComponent({
      ...props,
    });

    expect(screen.getByTestId('view-left-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('view-right-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('ifex-viewer-container')).toHaveClass('flex-row');
    expect(screen.getByTestId('ifex-viewer-container')).not.toHaveClass('flex-row-reverse');
    expect(screen.getByTestId('sidenav')).toHaveClass('flex-row');
    expect(screen.getByTestId('sidenav')).not.toHaveClass('flex-row-reverse');

    await user.click(screen.getByTestId('btn-change-sidenav-position'));

    expect(screen.queryByTestId('view-left-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('view-right-icon')).toBeInTheDocument();
    expect(screen.getByTestId('ifex-viewer-container')).not.toHaveClass('flex-row');
    expect(screen.getByTestId('ifex-viewer-container')).toHaveClass('flex-row-reverse');
    expect(screen.getByTestId('sidenav')).not.toHaveClass('flex-row');
    expect(screen.getByTestId('sidenav')).toHaveClass('flex-row-reverse');

    expect(emitted('sidenavPositionChanged')[0]).toEqual(['right']);

    await user.click(screen.getByTestId('btn-change-sidenav-position'));

    expect(screen.getByTestId('view-left-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('view-right-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('ifex-viewer-container')).toHaveClass('flex-row');
    expect(screen.getByTestId('ifex-viewer-container')).not.toHaveClass('flex-row-reverse');
    expect(screen.getByTestId('sidenav')).toHaveClass('flex-row');
    expect(screen.getByTestId('sidenav')).not.toHaveClass('flex-row-reverse');

    expect(emitted('sidenavPositionChanged')[1]).toEqual(['left']);
    expect(emitted('sidenavPositionChanged')).toHaveLength(2); // Ensure sidenavPositionChanged event was emitted only twice
  });

  /**
   * We are using @vue/test-utils exclusively for this case because it cannot be tested with
   * testing-library. Generally, using defineExpose is considered an antipattern,
   * but it's the only method to expose functionality externally.
   * This feature is helpful for those integrating the web component
   * into their applications, and there is no alternative approach.
   */
  it('should select node from outside the web component', async () => {
    const { options } = getTestOptions({});

    const wrapper = mount(App, { props: { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } }, ...options });

    wrapper.vm.selectNode('GalacticEmpire.recruitStormtrooper');

    await nextTick();

    expect(wrapper.find('[data-testid="detail-page-container"]').find('h2').text()).toContain('recruitStormtrooper');
  });

  describe('slot capabilities', () => {
    describe('of property viewers', () => {
      it('should not render slot content in input property of a method when dot notation is NOT provided in lowercase', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack.fleetSize';
        const content = 'Darth Vader was here ...';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('coordinateAttack');
        await user.click(nodeToSelect);

        const inputPropertySlot = screen.queryByText(content);

        expect(inputPropertySlot).not.toBeInTheDocument();
      });

      it('should render slot content in input property of a method', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack.fleetSize'.toLowerCase();
        const content = 'Darth Vader was here ...';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('coordinateAttack');
        await user.click(nodeToSelect);

        const inputPropertySlot = screen.getByText(content);

        expect(inputPropertySlot).toBeInTheDocument();
      });

      it('should render slot content in output property of a method', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack.attackPlan'.toLowerCase();
        const content = 'Darth Vader wants to see you';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('coordinateAttack');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });

      it('should render slot content in returns property of a method', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.deployTIEFighters.remainingFighters'.toLowerCase();
        const content = 'Report to Darth Vader';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('deployTIEFighters');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });

      it('should render slot content in errors property of a method', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.deployTIEFighters.invalidSector'.toLowerCase();
        const content = 'Report to Darth Vader';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('deployTIEFighters');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });

      it('should render slot content in input property of an event', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.DeathStarDestroyed.deathStarId'.toLowerCase();
        const content = 'Copy Id';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('DeathStarDestroyed');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });

      it('should render slot content in member property of a struct', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.Starship.hyperdriveRating'.toLowerCase();
        const content = 'Increase acceleration';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('Starship');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });

      it('should render slot content in option property of an enumeration', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.Rank.General'.toLowerCase();
        const content = 'Rank up';
        const slots = {
          [dotNotation]: `<div>${content}</div>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('Rank');
        await user.click(nodeToSelect);

        const slotContent = screen.getByText(content);
        expect(slotContent).toBeInTheDocument();
      });
    });

    describe('of detail pages headline', () => {
      it('should not render slot content in headline when dot notation is NOT provided in lowercase', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy-headline';
        const content = 'Deploy fleet';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('ImperialNavy');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).queryByText(content);
        expect(headlineSlotContent).not.toBeInTheDocument();
      });

      it('should render slot content in headline of the namespace detail page', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy-headline'.toLowerCase();
        const content = 'Deploy fleet';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('ImperialNavy');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of the interface detail page', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.FleetCommand-headline'.toLowerCase();
        const content = 'Change command';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('FleetCommand');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of a method', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.DeathStarDestroyed-headline'.toLowerCase();
        const content = 'Build new one';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('DeathStarDestroyed');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of an event', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.recruitStormtrooper-headline'.toLowerCase();
        const content = 'Try out';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('recruitStormtrooper');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of an enumeration', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.Rank-headline'.toLowerCase();
        const content = 'Uprank all';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('Rank');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of a property', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.emperor-headline'.toLowerCase();
        const content = 'Depose';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('emperor');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of a struct', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.Starship-headline'.toLowerCase();
        const content = 'Start the engine';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('Starship');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });

      it('should render slot content in headline of a typedef', async () => {
        const props: IfexViewerProps = { specifications: [specificationItemMock], layout: { sidenavPosition: 'left' } };

        const dotNotation = 'GalacticEmpire.ImperialNavy.FleetCommand.GalacticCoordinates-headline'.toLowerCase();
        const content = 'Orbit';
        const slots = {
          [dotNotation]: `<button>${content}</button>`,
        };

        const { user } = renderComponent(
          {
            ...props,
          },
          slots,
        );

        const nodeToSelect = screen.getByText('GalacticCoordinates');
        await user.click(nodeToSelect);

        const headlineSlotContent = within(screen.getByTestId('headline')).getByText(content);
        expect(headlineSlotContent).toBeInTheDocument();
      });
    });
  });

  describe('linking of complex datatypes', () => {
    it('should select complex datatype node from enumeration detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('Rank')).not.toBeInTheDocument();

      await user.click(screen.getByText('Rank'));

      expect(within(getHeadline()).getByText('Rank')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Starship')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('detail-page-container')).getByText('Starship');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('Starship')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Rank')).not.toBeInTheDocument();
    });

    it('should select complex datatype node from typedef detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('GalacticCoordinates')).not.toBeInTheDocument();

      await user.click(screen.getByText('GalacticCoordinates'));

      expect(within(getHeadline()).getByText('GalacticCoordinates')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('SectorDetails')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('detail-page-container')).getByText('SectorDetails');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('SectorDetails')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('GalacticCoordinates')).not.toBeInTheDocument();
    });

    it('should select complex datatype node from property detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('Ships')).not.toBeInTheDocument();

      await user.click(screen.getByText('Ships'));

      expect(within(getHeadline()).getByText('Ships')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Battleship')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('detail-page-container')).getByText('Battleship');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('Battleship')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Ships')).not.toBeInTheDocument();
    });

    it('should select complex datatype node from method detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('recruitStormtrooper')).not.toBeInTheDocument();

      await user.click(screen.getByText('recruitStormtrooper'));

      expect(within(getHeadline()).getByText('recruitStormtrooper')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('GalacticCoordinates')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('property-viewer')).getByText('GalacticCoordinates');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('GalacticCoordinates')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('recruitStormtrooper')).not.toBeInTheDocument();
    });

    it('should select complex datatype node from event detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('DeathStarDestroyed')).not.toBeInTheDocument();

      await user.click(screen.getByText('DeathStarDestroyed'));

      expect(within(getHeadline()).getByText('DeathStarDestroyed')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('GalacticCoordinates')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('property-viewer')).getByText('GalacticCoordinates');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('GalacticCoordinates')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('DeathStarDestroyed')).not.toBeInTheDocument();
    });

    it('should select complex datatype node from struct detail page', async () => {
      const getHeadline = () => screen.getByTestId('headline-title');
      const givenSpecifications = [{ filename: 'complex-datatypes.yml', content: specificationMockWithComplexDatatypes }];
      const props: IfexViewerProps = { specifications: givenSpecifications, layout: { sidenavPosition: 'left' } };

      const { user } = renderComponent({
        ...props,
      });

      expect(within(getHeadline()).queryByText('Battleship')).not.toBeInTheDocument();

      await user.click(screen.getByText('Battleship'));

      expect(within(getHeadline()).getByText('Battleship')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Starship')).not.toBeInTheDocument();

      const complexDatatypeBadge = within(screen.getByTestId('property-viewer')).getByText('Starship');
      await user.click(complexDatatypeBadge);

      expect(within(getHeadline()).getByText('Starship')).toBeInTheDocument();
      expect(within(getHeadline()).queryByText('Battleship')).not.toBeInTheDocument();
    });
  });
});
