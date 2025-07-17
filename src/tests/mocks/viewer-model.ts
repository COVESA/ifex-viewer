import { ViewerModel } from '../../model/specification-model.ts';

export const viewerModelComplexDatatypesMock: ViewerModel = {
  mergeView: {
    id: '4f5d586b-deb2-48f9-ae1b-308553ee282a',
    node: {
      name: 'Merged document',
      description: 'API for the operations and command structure of the Galactic Empire',
      major_version: 1,
      minor_version: 0,
      namespaces: [
        {
          name: 'GalacticEmpire',
          description: 'Namespace for operations related to the Galactic Empire',
          major_version: 1,
          minor_version: 0,
          namespaces: [
            {
              name: 'ImperialNavy',
              structs: [
                {
                  name: 'Battleship',
                  description: 'A struct representing a Battleship in the Imperial fleet',
                  members: [
                    { name: 'model', datatype: 'string', description: 'The model of the starship' },
                    { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                  ],
                },
              ],
            },
          ],
          typedefs: [{ name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' }],
          structs: [
            {
              name: 'Starship',
              description: 'A struct representing a starship in the Imperial fleet',
              members: [
                { name: 'model', datatype: 'string', description: 'The model of the starship' },
                { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
              ],
            },
          ],
          enumerations: [
            {
              name: 'Rank',
              datatype: 'string',
              options: [
                { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
              ],
              description: 'Enumeration of ranks within the Imperial Army',
            },
          ],
          events: [
            {
              name: 'DeathStarDestroyed',
              description: 'Event triggered when a Death Star is destroyed',
              input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
            },
          ],
        },
      ],
    },
    type: 'api',
    children: [
      {
        id: 'a42ae4c7-0dda-4d64-99bf-8ed4125aebe6',
        type: 'namespace',
        children: [
          {
            id: '22aa8282-830d-4d98-a0c7-b87a0bb4de8c',
            type: 'namespace',
            children: [
              {
                id: '451d3594-05f5-4f22-8772-53eb115737ee',
                type: 'struct',
                node: {
                  name: 'Battleship',
                  description: 'A struct representing a Battleship in the Imperial fleet',
                  members: [
                    { name: 'model', datatype: 'string', description: 'The model of the starship' },
                    { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                  ],
                },
              },
            ],
            node: {
              name: 'ImperialNavy',
              structs: [
                {
                  name: 'Battleship',
                  description: 'A struct representing a Battleship in the Imperial fleet',
                  members: [
                    { name: 'model', datatype: 'string', description: 'The model of the starship' },
                    { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                  ],
                },
              ],
            },
          },
          {
            id: '6e67bcde-ce5d-4eaf-87e8-07ab1a04f71f',
            type: 'event',
            node: {
              name: 'DeathStarDestroyed',
              description: 'Event triggered when a Death Star is destroyed',
              input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
            },
          },
          {
            id: '2ac71167-8485-43e9-ac2b-7da1fffa9541',
            type: 'struct',
            node: {
              name: 'Starship',
              description: 'A struct representing a starship in the Imperial fleet',
              members: [
                { name: 'model', datatype: 'string', description: 'The model of the starship' },
                { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
              ],
            },
          },
          {
            id: 'e65ad303-26d4-43b3-8335-cae35794fe8b',
            type: 'enumeration',
            node: {
              name: 'Rank',
              datatype: 'string',
              options: [
                { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
              ],
              description: 'Enumeration of ranks within the Imperial Army',
            },
          },
          {
            id: '5986897e-edbe-4161-93a1-f89ba3edceaa',
            type: 'typedef',
            node: { name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' },
          },
        ],
        node: {
          name: 'GalacticEmpire',
          description: 'Namespace for operations related to the Galactic Empire',
          major_version: 1,
          minor_version: 0,
          namespaces: [
            {
              name: 'ImperialNavy',
              structs: [
                {
                  name: 'Battleship',
                  description: 'A struct representing a Battleship in the Imperial fleet',
                  members: [
                    { name: 'model', datatype: 'string', description: 'The model of the starship' },
                    { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                  ],
                },
              ],
            },
          ],
          typedefs: [{ name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' }],
          structs: [
            {
              name: 'Starship',
              description: 'A struct representing a starship in the Imperial fleet',
              members: [
                { name: 'model', datatype: 'string', description: 'The model of the starship' },
                { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
              ],
            },
          ],
          enumerations: [
            {
              name: 'Rank',
              datatype: 'string',
              options: [
                { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
              ],
              description: 'Enumeration of ranks within the Imperial Army',
            },
          ],
          events: [
            {
              name: 'DeathStarDestroyed',
              description: 'Event triggered when a Death Star is destroyed',
              input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
            },
          ],
        },
      },
    ],
  },
  layeredView: [
    {
      id: '0ae9208a-44bc-4db9-bfab-c503687da2be',
      node: {
        name: 'TinyGalacticEmpireAPI',
        description: 'API for the operations and command structure of the Galactic Empire',
        major_version: 1,
        minor_version: 0,
        namespaces: [
          {
            name: 'GalacticEmpire',
            description: 'Namespace for operations related to the Galactic Empire',
            major_version: 1,
            minor_version: 0,
            namespaces: [
              {
                name: 'ImperialNavy',
                structs: [
                  {
                    name: 'Battleship',
                    description: 'A struct representing a Battleship in the Imperial fleet',
                    members: [
                      { name: 'model', datatype: 'string', description: 'The model of the starship' },
                      { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                    ],
                  },
                ],
              },
            ],
            typedefs: [{ name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' }],
            structs: [
              {
                name: 'Starship',
                description: 'A struct representing a starship in the Imperial fleet',
                members: [
                  { name: 'model', datatype: 'string', description: 'The model of the starship' },
                  { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
                ],
              },
            ],
            enumerations: [
              {
                name: 'Rank',
                datatype: 'string',
                options: [
                  { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                  { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
                ],
                description: 'Enumeration of ranks within the Imperial Army',
              },
            ],
            events: [
              {
                name: 'DeathStarDestroyed',
                description: 'Event triggered when a Death Star is destroyed',
                input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
              },
            ],
          },
        ],
      },
      type: 'api',
      validationErrors: [],
      children: [
        {
          id: '8d9b6855-62b1-44e5-926b-3e074fe860bb',
          type: 'namespace',
          children: [
            {
              id: 'a451355a-ef2e-4bb6-9d62-a8c232caa612',
              type: 'namespace',
              children: [
                {
                  id: '21dfbe7c-0fa5-4c38-a563-becddbd804ba',
                  type: 'struct',
                  node: {
                    name: 'Battleship',
                    description: 'A struct representing a Battleship in the Imperial fleet',
                    members: [
                      { name: 'model', datatype: 'string', description: 'The model of the starship' },
                      { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                    ],
                  },
                },
              ],
              node: {
                name: 'ImperialNavy',
                structs: [
                  {
                    name: 'Battleship',
                    description: 'A struct representing a Battleship in the Imperial fleet',
                    members: [
                      { name: 'model', datatype: 'string', description: 'The model of the starship' },
                      { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                    ],
                  },
                ],
              },
            },
            {
              id: '34ec6f71-62e3-451f-bb4c-ca29865ee77d',
              type: 'event',
              node: {
                name: 'DeathStarDestroyed',
                description: 'Event triggered when a Death Star is destroyed',
                input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
              },
            },
            {
              id: '85a8002d-4884-4d0a-8434-d801fd17cc77',
              type: 'struct',
              node: {
                name: 'Starship',
                description: 'A struct representing a starship in the Imperial fleet',
                members: [
                  { name: 'model', datatype: 'string', description: 'The model of the starship' },
                  { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
                ],
              },
            },
            {
              id: 'a16581a4-8931-4339-ac69-1c65eab812ef',
              type: 'enumeration',
              node: {
                name: 'Rank',
                datatype: 'string',
                options: [
                  { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                  { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
                ],
                description: 'Enumeration of ranks within the Imperial Army',
              },
            },
            {
              id: 'be0acdff-126f-4621-90ee-535c32565ddf',
              type: 'typedef',
              node: { name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' },
            },
          ],
          node: {
            name: 'GalacticEmpire',
            description: 'Namespace for operations related to the Galactic Empire',
            major_version: 1,
            minor_version: 0,
            namespaces: [
              {
                name: 'ImperialNavy',
                structs: [
                  {
                    name: 'Battleship',
                    description: 'A struct representing a Battleship in the Imperial fleet',
                    members: [
                      { name: 'model', datatype: 'string', description: 'The model of the starship' },
                      { name: 'weaponCapacity', datatype: 'number', description: 'The number of weapons the starship can carry' },
                    ],
                  },
                ],
              },
            ],
            typedefs: [{ name: 'GalacticCoordinates', datatypes: ['string', 'SectorDetails'], description: 'Represents galactic coordinates for navigation and targeting' }],
            structs: [
              {
                name: 'Starship',
                description: 'A struct representing a starship in the Imperial fleet',
                members: [
                  { name: 'model', datatype: 'string', description: 'The model of the starship' },
                  { name: 'hyperdriveRating', datatype: 'number', description: "The rating of the starship's hyperdrive" },
                ],
              },
            ],
            enumerations: [
              {
                name: 'Rank',
                datatype: 'string',
                options: [
                  { name: 'Private', value: 'PRIVATE', description: 'Lowest rank within the stormtrooper ranks' },
                  { name: 'Sergeant', value: 'SERGEANT', description: 'A non-commissioned officer rank' },
                ],
                description: 'Enumeration of ranks within the Imperial Army',
              },
            ],
            events: [
              {
                name: 'DeathStarDestroyed',
                description: 'Event triggered when a Death Star is destroyed',
                input: [{ name: 'deathStarId', datatype: 'string', description: 'The ID of the destroyed Death Star' }],
              },
            ],
          },
        },
      ],
    },
  ],
};
