// Query names used by the e2e apps.
export const slotQueryName = 'hasSlots';
export const initialNodePathQueryName = 'initialNodePath';

// Slot paths used by the e2e apps.
const slotPath = 'GalacticEmpire.ImperialNavy.FleetCommand.coordinateAttack'.toLowerCase();
export const headlineSlotPath = `${slotPath}-headline`;
export const headlineSlotText = 'Darth Vader was here';
export const fleetSizeMethodSlotContent = 'Bigger is better';
export const fleetSizeMethodSlotPath = `${slotPath}.fleetsize`;

/**
 * Port used by all the e2e apps.
 */
export const e2eAppPort = 4200;
