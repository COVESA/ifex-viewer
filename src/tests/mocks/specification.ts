import { IfexSpecificationItem } from '../../types';

export const simpleSpecificationMock: string = `
name: "TinyGalacticEmpireAPI"
description: "API for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 0
namespaces:
  - name: "GalacticEmpire"
    description: "Namespace for operations related to the Galactic Empire"
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
`;

export const specificationMockWithComplexDatatypes: string = `
name: "TinyGalacticEmpireAPI"
description: "API for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 0
namespaces:
  - name: "GalacticEmpire"
    description: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    namespaces:
      - name: "ImperialNavy"
        properties:
          - name: "Ships"
            datatype: "Battleship"
        structs:
        - name: "Battleship"
          description: "A struct representing a Battleship in the Imperial fleet"
          members:
            - name: "model"
              datatype: "string"
              description: "The model of the starship"
            - name: "weaponCapacity"
              datatype: "number"
              description: "The number of weapons the starship can carry"
            - name: "shipType"
              datatype: "Starship"
        typedefs:
          - name: "GalacticCoordinates"
            datatype: "SectorDetails"
            description: "Represents galactic coordinates for navigation and targeting"
    structs:
      - name: "Starship"
        description: "A struct representing a starship in the Imperial fleet"
        members:
          - name: "model"
            datatype: "string"
            description: "The model of the starship"
          - name: "hyperdriveRating"
            datatype: "number"
            description: "The rating of the starship's hyperdrive"
      - name: "SectorDetails"
        members:
          - name: "coordinates"
            datatype: "string"
    enumerations:
      - name: "Rank"
        datatype: "Starship"
        options:
          - name: "Private"
            value: "PRIVATE"
            description: "Lowest rank within the stormtrooper ranks"
          - name: "Sergeant"
            value: "SERGEANT"
            description: "A non-commissioned officer rank"
        description: "Enumeration of ranks within the Imperial Army"
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
          - name: "location"
            datatype: "GalacticCoordinates"
            description: "The ID of the destroyed Death Star"
    methods:
      - name: "recruitStormtrooper"
        description: "Recruits a new stormtrooper to the Imperial Army"
        input:
          - name: "name"
            datatype: "string"
            description: "Name of the recruit"
          - name: "planetOfOrigin"
            datatype: "GalacticCoordinates"
            description: "Planet where the recruit was born"
`;

export const simpleSpecificationMockWithValidationErrors: string = `
name: "TinyGalacticEmpireAPI"
description: "API for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 0
some_not_known_prop: "Hello"
namespaces:
  - name: "GalacticEmpire"
    description: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    events:
      - name: "DeathStarDestroyed"
        description: "Event triggered when a Death Star is destroyed"
        input:
          - name: "deathStarId"
            datatype: "string"
            description: "The ID of the destroyed Death Star"
            some_other_not_known_prop: "Hello"
          - name: "destroyedBy"
            datatype: "string"
            description: "The name of the entity responsible for the destruction"
`;

export const specificationMock: string = `
name: "GalacticEmpireAPI"
description: "API for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 0
namespaces:
  - name: "GalacticEmpire"
    description: "Namespace for operations related to the Galactic Empire"
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
    methods:
      - name: "recruitStormtrooper"
        description: "Recruits a new stormtrooper to the Imperial Army"
        input:
          - name: "name"
            datatype: "string"
            description: "Name of the recruit"
          - name: "planetOfOrigin"
            datatype: "string"
            description: "Planet where the recruit was born"
        output:
          - name: "stormtrooperId"
            datatype: "string"
            description: "The ID of the newly recruited stormtrooper"
      - name: "deployStarfleet"
        description: "Deploys a starfleet to a specified location"
        input:
          - name: "destination"
            datatype: "string"
            description: "The target destination for the starfleet"
        errors:
          - datatype: "string"
            name: "InsufficientFundsError"
            description: "Raised when the Empire does not have enough resources to deploy the fleet"
    structs:
      - name: "Starship"
        description: "A struct representing a starship in the Imperial fleet"
        members:
          - name: "model"
            datatype: "string"
            description: "The model of the starship"
          - name: "weaponCapacity"
            datatype: "number"
            description: "The number of weapons the starship can carry"
          - name: "hyperdriveRating"
            datatype: "number"
            description: "The rating of the starship's hyperdrive"
    enumerations:
      - name: "Rank"
        datatype: "string"
        options:
          - name: "Private"
            value: "PRIVATE"
            description: "Lowest rank within the stormtrooper ranks"
          - name: "Sergeant"
            value: "SERGEANT"
            description: "A non-commissioned officer rank"
          - name: "General"
            value: "GENERAL"
            description: "High-ranking officer, commanding multiple regiments"
        description: "Enumeration of ranks within the Imperial Army"
    properties:
      - name: "emperor"
        datatype: "string"
        description: "The current Emperor of the Galactic Empire"
    namespaces:
      - name: "ImperialNavy"
        description: "Namespace for operations related to the Imperial Navy"
        major_version: 1
        minor_version: 0
        methods:
          - name: "deployTIEFighters"
            description: "Deploys TIE fighters to patrol a specified sector"
            input:
              - name: "sector"
                datatype: "string"
                description: "The sector to patrol"
              - name: "numberOfFighters"
                datatype: "number"
                description: "The number of TIE fighters to deploy"
            returns:
              - name: "missionSuccess"
                datatype: "boolean"
                description: "Indicates if the deployment was successful"
              - name: "remainingFighters"
                datatype: "number"
                description: "Number of TIE fighters remaining after deployment"
                arraysize: 1
            output:
              - name: "patrolStatus"
                datatype: "string"
                description: "Status of the TIE fighter deployment"
            errors:
              - name: "insufficientFighters"
                datatype: "boolean"
                description: "Indicates if there were not enough TIE fighters available for deployment"
              - name: "invalidSector"
                datatype: "string"
                description: "Error message if the specified sector is invalid"
              - name: "deploymentFailure"
                datatype: "string"
                description: "Detailed message about why the deployment failed"
                range: "Minor to Critical"
        interface:
          name: "FleetCommand"
          description: "Interface for commanding the Imperial Navy's fleet"
          major_version: 1
          minor_version: 0
          version_label: "v1.0"
          methods:
            - name: "coordinateAttack"
              description: "Coordinates an attack on a Rebel target"
              input:
                - name: "targetCoordinates"
                  datatype: "GalacticEmpire.ImperialNavy.AdvancedFleetCommand.GalacticCoordinates"
                  description: "The coordinates of the Rebel target"
                - name: "fleetSize"
                  datatype: "number"
                  description: "The size of the fleet to deploy"
              output:
                - name: "attackPlan"
                  datatype: "string"
                  description: "The planned attack strategy"
          typedefs:
            - name: "GalacticCoordinates"
              datatypes:
                - string
                - SectorDetails
              description: "Represents galactic coordinates for navigation and targeting"
          structs:
            - name: "SectorDetails"
              description: "Detailed information about a sector"
              members:
                - name: "sectorName"
                  datatype: "variant<string,number,CoordinatesWithAReallyLongNameHello>"
                  description: "The name of the sector"
                - name: "isControlled"
                  datatype: "boolean"
                  description: "Whether the sector is controlled by the Galactic Empire"
                - name: "population"
                  datatype: "number"
                  description: "The population of the sector"
`;

export const specificationMockWithValidationErrors = `
name: "GalacticEmpireAPI"
description: "API for the operations and command structure of the Galactic Empire"
major_version: 1
minor_version: 0
namespaces:
  - name: "GalacticEmpire"
    description1: "Namespace for operations related to the Galactic Empire"
    major_version: 1
    minor_version: 0
    versionlabel: "v1.0"
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
    methods:
      - name: "recruitStormtrooper"
        description: "Recruits a new stormtrooper to the Imperial Army"
        h: "Hello"
        input:
          - name: "name"
            datatype1: "string"
            description: "Name of the recruit"
          - name: "planetOfOrigin"
            datatype: "string"
            description: "Planet where the recruit was born"
        output:
          - name: "stormtrooperId"
            datatype: "string"
            description: "The ID of the newly recruited stormtrooper"
      - name: "deployStarfleet"
        description: "Deploys a starfleet to a specified location"
        input:
          - name: "destination"
            datatype: "string"
            additionalProp: "Hello"
            description: "The target destination for the starfleet"
        errors:
          - datatype: "string"
            name: "InsufficientFundsError"
            description: "Raised when the Empire does not have enough resources to deploy the fleet"
    structs:
      - name: "Starship"
        description: "A struct representing a starship in the Imperial fleet"
        members:
          - name: "model"
            datatype: "string"
            description: "The model of the starship"
          - name: "weaponCapacity"
            datatype: "number"
            description: "The number of weapons the starship can carry"
          - name: "hyperdriveRating"
            datatype: "number"
            description: "The rating of the starship's hyperdrive"
    enumerations:
      - name: "Rank"
        datatype: "string"
        options:
          - name: "Private"
            value: "PRIVATE"
            description: "Lowest rank within the stormtrooper ranks"
          - name: "Sergeant"
            value: "SERGEANT"
            description: "A non-commissioned officer rank"
          - name: "General"
            value: "GENERAL"
            description: "High-ranking officer, commanding multiple regiments"
        description: "Enumeration of ranks within the Imperial Army"
    properties:
      - name: "emperor"
        datatype: "string"
        description: "The current Emperor of the Galactic Empire"
    namespaces:
      - name: "ImperialNavy"
        description: "Namespace for operations related to the Imperial Navy"
        major_version: 1
        minor_version: 0
        methods:
          - name: "deployTIEFighters"
            description: "Deploys TIE fighters to patrol a specified sector"
            input:
              - name: "sector"
                datatype: "string"
                description: "The sector to patrol"
              - name: "numberOfFighters"
                datatype: "number"
                description: "The number of TIE fighters to deploy"
            output:
              - name: "patrolStatus"
                datatype: "string"
                description: "Status of the TIE fighter deployment"
        interface:
          name: "FleetCommand"
          description: "Interface for commanding the Imperial Navy's fleet"
          major_version: 1
          minor_version: 0
          version_label: "v1.0"
          methods:
            - name: "coordinateAttack"
              description: "Coordinates an attack on a Rebel target"
              input:
                - name: "targetCoordinates"
                  datatype: "GalacticCoordinates"
                  description: "The coordinates of the Rebel target"
                - name: "fleetSize"
                  datatype: "number"
                  description: "The size of the fleet to deploy"
              output:
                - name: "attackPlan"
                  datatype: "string"
                  description: "The planned attack strategy"
          typedefs:
            - name: "GalacticCoordinates"
              description: "Represents galactic coordinates for navigation and targeting"
    `;

export const specificationWithTwoDocs = `
${specificationMock}
---
${simpleSpecificationMock}
`;

export const specificationItemMock: IfexSpecificationItem = { filename: 'GalacticEmpireAPI', content: specificationMock };

export const customLayerSpecificationMock = `
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
    methods:
      - name: "promoteStormtrooper"
        description: "Promotes a stormtrooper to a higher rank"
        input:
          - name: "stormtrooperId"
            datatype: "string"
            description: "The ID of the stormtrooper to be promoted"
          - name: "newRank"
            datatype: "Rank"
            description: "The new rank to be assigned to the stormtrooper"
        output:
          - name: "promotionStatus"
            datatype: "string"
            description: "The status of the promotion process"
      - name: "launchTIEBomber"
        description: "Launches a TIE bomber for a bombing run"
        input:
          - name: "targetCoordinates"
            datatype: "GalacticCoordinates"
            description: "The coordinates of the target"
            example: "12.345, 67.890"
          - name: "payload"
            datatype: "number"
            description: "The amount of payload to be dropped"
            default: 3
        output:
          - name: "missionStatus"
            datatype: "string"
            description: "The status of the bombing mission"
            types:
              - name: "Success"
                value: "SUCCESS"
                description: "The mission was successful"
              - name: "Failure"
                value: "FAILURE"
                description: "The mission failed"
    structs:
      - name: "RebelBase"
        description: "A struct representing a Rebel base"
        members:
          - name: "location"
            datatype: "GalacticCoordinates"
            description: "The coordinates of the Rebel base"
          - name: "defenseLevel"
            datatype: "number"
            description: "The defense level of the Rebel base"
          - name: "commander"
            datatype: "string"
            description: "The name of the base commander"
            example: "Luke Skywalker"
    enumerations:
      - name: "MissionStatus"
        datatype: "string"
        options:
          - name: "Pending"
            value: "PENDING"
            description: "Mission is pending"
            default: true
          - name: "InProgress"
            value: "IN_PROGRESS"
            description: "Mission is currently in progress"
          - name: "Completed"
            value: "COMPLETED"
            description: "Mission has been completed"
          - name: "Failed"
            value: "FAILED"
            description: "Mission has failed"
        description: "Enumeration of possible mission statuses"
    properties:
      - name: "currentFleetAdmiral"
        datatype: "string"
        description: "The current Fleet Admiral of the Galactic Empire"
      - name: "deathStarOperationalStatus"
        datatype: "string"
        description: "The operational status of the Death Star"
      - name: "imperialTreasuryBalance"
        datatype: "number"
        description: "The current balance of the Imperial Treasury"
      - name: "numberOfStormtroopers"
        datatype: "number"
        description: "The total number of stormtroopers in the Imperial Army"
      - name: "sithHolocronCount"
        datatype: "number"
        description: "The number of Sith holocrons in possession of the Empire"
      - name: "planetaryControlPercentage"
        datatype: "number"
        description: "The percentage of the galaxy under Imperial control"
      - name: "currentSithApprentice"
        datatype: "string"
        description: "The name of the current Sith apprentice"
      - name: "bountyHunterContracts"
        datatype: "array"
        description: "List of active bounty hunter contracts"
        items:
          - name: "contractId"
            datatype: "string"
            description: "The ID of the contract"
          - name: "targetName"
            datatype: "string"
            description: "The name of the target"
          - name: "bountyAmount"
            datatype: "number"
            description: "The bounty amount for the target"
    custom_fields:
      - name: "secretPlans"
        datatype: "string"
        description: "Encoded secret plans of the Empire"
      - name: "forceSensitiveIndividuals"
        datatype: "array"
        description: "List of known force-sensitive individuals"
        items:
          - name: "individualName"
            datatype: "string"
            description: "Name of the force-sensitive individual"
          - name: "midichlorianCount"
            datatype: "number"
            description: "Midichlorian count of the individual"
      - name: "galacticSenateInfluence"
        datatype: "number"
        description: "The level of influence the Empire has over the Galactic Senate"
      - name: "holonetBroadcasts"
        datatype: "array"
        description: "List of recent HoloNet broadcasts"
        items:
          - name: "broadcastId"
            datatype: "string"
            description: "The ID of the broadcast"
          - name: "content"
            datatype: "string"
            description: "Content of the broadcast"
          - name: "broadcastDate"
            datatype: "string"
            description: "Date of the broadcast"
      - name: "imperialSpyNetwork"
        datatype: "object"
        description: "Details about the Imperial spy network"
        fields:
          - name: "activeAgents"
            datatype: "number"
            description: "Number of active agents in the network"
          - name: "recentOperations"
            datatype: "array"
            description: "List of recent spy operations"
            items:
              - name: "operationId"
                datatype: "string"
                description: "ID of the operation"
              - name: "target"
                datatype: "string"
                description: "Target of the operation"
              - name: "status"
                datatype: "string"
                description: "Status of the operation"
      - name: "imperialPropaganda"
        datatype: "object"
        description: "Details about the Imperial propaganda efforts"
        fields:
          - name: "currentCampaign"
            datatype: "string"
            description: "Name of the current propaganda campaign"
          - name: "campaignReach"
            datatype: "number"
            description: "Estimated reach of the campaign"
          - name: "publicSentiment"
            datatype: "string"
            description: "Current public sentiment towards the Empire"
    namespaces:
      - name: "ImperialNavy"
        description: "Namespace for operations related to the Imperial Navy"
        major_version: 1
        minor_version: 1
        methods:
          - name: "upgradeStarship"
            description: "Upgrades a starship's capabilities"
            input:
              - name: "starshipId"
                datatype: "string"
                description: "The ID of the starship to be upgraded"
              - name: "upgradeType"
                datatype: "string"
                description: "The type of upgrade to be applied"
            output:
              - name: "upgradeStatus"
                datatype: "string"
                description: "The status of the upgrade process"
        interface:
          name: "AdvancedFleetCommand"
          description: "Advanced interface for commanding the Imperial Navy's fleet"
          major_version: 1
          minor_version: 1
          version_label: "v1.1"
          methods:
            - name: "initiateBlockade"
              description: "Initiates a blockade on a specified planet"
              input:
                - name: "planet"
                  datatype: "string"
                  description: "The name of the planet to blockade"
                - name: "blockadeDuration"
                  datatype: "number"
                  description: "The duration of the blockade in days"
              output:
                - name: "blockadeStatus"
                  datatype: "string"
                  description: "The status of the blockade operation"
          typedefs:
            - name: "PlanetaryCoordinates"
              datatype: "object"
              description: "Represents planetary coordinates for navigation and targeting"
  `;

export const customLayerSpecificationItemMock: IfexSpecificationItem = { filename: 'GalacticEmpireCustomAPI', content: customLayerSpecificationMock };
