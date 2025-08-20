/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import * as uuid from 'uuid';
import { ViewerModel } from '../../model/specification-model.ts';
import { IfexSpecificationItem } from '../../types.ts';
import { useViewerModelStore } from './viewer-model.store.ts';
import { ViewTabs } from '../../components/sidenav/types.ts';

vi.mock('uuid');

describe('useViewerModel', () => {
  let uuidSpy: MockInstance;

  beforeEach(() => {
    setActivePinia(createPinia());
    uuidSpy = vi.spyOn(uuid, 'v4');
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create viewer model when setting specifications', () => {
    uuidSpy.mockReturnValue('uuid');
    const given: IfexSpecificationItem[] = [
      {
        filename: 'core-layer.yml',
        content: `
name: "Galactic Empire Core Layer"
namespaces:
  - name: "GalacticEmpire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const expected: ViewerModel = {
      mergeView: {
        id: 'uuid',
        node: {
          name: 'Merged document',
          namespaces: [
            {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
          ],
        },
        type: 'api',
        children: [
          {
            id: 'uuid',
            node: {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
            type: 'namespace',
            children: [
              {
                id: 'uuid',
                node: {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
                type: 'event',
              },
            ],
          },
        ],
      },
      layeredView: [
        {
          id: 'uuid',
          node: {
            name: 'Galactic Empire Core Layer',
            namespaces: [
              {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
            ],
          },
          type: 'api',
          children: [
            {
              id: 'uuid',
              node: {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
              type: 'namespace',
              children: [
                {
                  id: 'uuid',
                  node: {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                  type: 'event',
                },
              ],
            },
          ],
          validationErrors: [],
        },
      ],
    };

    const store = useViewerModelStore();

    store.setSpecifications(given);

    const result = store.viewerModel;

    expect(result).toEqual(expected);
  });

  it('should be able to handle empty specifications', () => {
    const given: IfexSpecificationItem[] = [];
    const expected: ViewerModel = {
      mergeView: null,
      layeredView: [],
    };

    const store = useViewerModelStore();

    store.setSpecifications(given);

    const result = store.viewerModel;

    expect(result).toEqual(expected);
  });

  it('should return layered view', () => {
    uuidSpy.mockReturnValue('uuid');
    const given: IfexSpecificationItem[] = [
      {
        filename: 'core-layer.yml',
        content: `
name: "Galactic Empire Core Layer"
namespaces:
  - name: "GalacticEmpire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const viewerModel: ViewerModel = {
      mergeView: {
        id: 'uuid',
        node: {
          name: 'Merged document',
          namespaces: [
            {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
          ],
        },
        type: 'api',
        children: [
          {
            id: 'uuid',
            node: {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
            type: 'namespace',
            children: [
              {
                id: 'uuid',
                node: {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
                type: 'event',
              },
            ],
          },
        ],
      },
      layeredView: [
        {
          id: 'uuid',
          node: {
            name: 'Galactic Empire Core Layer',
            namespaces: [
              {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
            ],
          },
          type: 'api',
          children: [
            {
              id: 'uuid',
              node: {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
              type: 'namespace',
              children: [
                {
                  id: 'uuid',
                  node: {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                  type: 'event',
                },
              ],
            },
          ],
          validationErrors: [],
        },
      ],
    };

    const store = useViewerModelStore();
    store.setSpecifications(given);

    store.changeSelectedView(ViewTabs.LAYERED_VIEW);

    const result = store.activeView;

    expect(result).toEqual(viewerModel.layeredView);
  });

  it('should return merged view', () => {
    uuidSpy.mockReturnValue('uuid');
    const given: IfexSpecificationItem[] = [
      {
        filename: 'core-layer.yml',
        content: `
name: "Galactic Empire Core Layer"
namespaces:
  - name: "GalacticEmpire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
    `,
      },
    ];

    const viewerModel: ViewerModel = {
      mergeView: {
        id: 'uuid',
        node: {
          name: 'Merged document',
          namespaces: [
            {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
          ],
        },
        type: 'api',
        children: [
          {
            id: 'uuid',
            node: {
              name: 'GalacticEmpire',
              major_version: 1,
              minor_version: 0,
              events: [
                {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
              ],
            },
            type: 'namespace',
            children: [
              {
                id: 'uuid',
                node: {
                  name: 'DeathStarDestroyed',
                  description: 'Event triggered when a Death Star is destroyed',
                  input: [
                    { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                    { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                  ],
                },
                type: 'event',
              },
            ],
          },
        ],
      },
      layeredView: [
        {
          id: 'uuid',
          node: {
            name: 'Galactic Empire Core Layer',
            namespaces: [
              {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
            ],
          },
          type: 'api',
          children: [
            {
              id: 'uuid',
              node: {
                name: 'GalacticEmpire',
                major_version: 1,
                minor_version: 0,
                events: [
                  {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                ],
              },
              type: 'namespace',
              children: [
                {
                  id: 'uuid',
                  node: {
                    name: 'DeathStarDestroyed',
                    description: 'Event triggered when a Death Star is destroyed',
                    input: [
                      { name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' },
                      { name: 'destroyedBy', datatype: 'string', description: 'The name of the entity responsible for the destruction' },
                    ],
                  },
                  type: 'event',
                },
              ],
            },
          ],
          validationErrors: [],
        },
      ],
    };

    const store = useViewerModelStore();
    store.setSpecifications(given);

    store.changeSelectedView(ViewTabs.MERGE_VIEW);

    const result = store.activeView;

    expect(result).toEqual([viewerModel.mergeView]);
  });
});
