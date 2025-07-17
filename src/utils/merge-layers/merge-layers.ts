/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

type MergedDocument = { [key: string]: any };

/**
 * Merge multiple IFEX documents into one document.
 * It takes the order of the documents into account. The last document has the highest priority
 * and overwrites values from the previous documents.
 * @param docs
 */
export const mergeDocuments = (...docs: Record<string, unknown>[]): [MergedDocument | null, Error | null] => {
  const mergedMap: Record<string, unknown> = {};
  if (docs.length === 0) {
    return [mergedMap, null];
  }

  for (const overlayDoc of docs) {
    for (const [key, overlayValue] of Object.entries(overlayDoc)) {
      const baseValue = mergedMap[key];
      const exists = baseValue !== undefined;

      if (!exists) {
        mergedMap[key] = overlayValue;
        continue;
      }

      if (isObject(baseValue) && isObject(overlayValue)) {
        const [merged, err] = mergeDocuments(baseValue, overlayValue);
        if (err) {
          return [null, err];
        }
        mergedMap[key] = merged;
        continue;
      }

      // An array in a yaml document
      // E.g. a list of properties under a name attribute
      // users:
      // - name: prop1
      //   value: 1
      // - name: prop2
      //   value: 2
      if (Array.isArray(baseValue) && Array.isArray(overlayValue)) {
        const [merged, err] = mergeArrays(baseValue, overlayValue);
        if (err) {
          return [null, new Error(`cannot merge lower and higher layer slice: ${err.message}`)];
        }
        mergedMap[key] = merged;
        continue;
      }

      mergedMap[key] = overlayValue;
    }
  }

  return [mergedMap, null];
};

const mergeArrays = (baseDoc: unknown[], overlayDoc: unknown[]): [unknown[] | null, Error | null] => {
  const baseMaps: { [key: string]: MergedDocument } = {};

  const baseIsStringArray = baseDoc.every(item => typeof item === 'string');
  const overlayIsStringArray = overlayDoc.every(item => typeof item === 'string');
  if (baseIsStringArray && overlayIsStringArray) {
    const uniqueValues = new Set([...baseDoc, ...overlayDoc]);
    const mergedArray = [...uniqueValues];
    return [mergedArray, null];
  }

  for (const value of baseDoc) {
    const [objectValue, isMap, name] = getNameAttribute(value);
    if (isMap && objectValue) {
      baseMaps[name] = objectValue;
    }
  }

  if (Object.keys(baseMaps).length > 0 && Object.keys(baseMaps).length !== baseDoc.length) {
    return [null, new Error('base layer does not seem to have consistent usage of name attribute')];
  }

  const overlayMaps: { [key: string]: MergedDocument } = {};
  for (const value of overlayDoc) {
    const [objectValue, isMap, name] = getNameAttribute(value);
    if (isMap && objectValue) {
      overlayMaps[name] = objectValue;
    }
  }

  if (Object.keys(baseMaps).length === 0 && Object.keys(overlayMaps).length === 0) {
    return [overlayDoc, null];
  }

  if (Object.keys(overlayMaps).length > 0 && Object.keys(overlayMaps).length !== overlayDoc.length) {
    return [null, new Error('overlay layer does not seem to have consistent usage of name attribute')];
  }

  for (const [name, overlayMap] of Object.entries(overlayMaps)) {
    if (baseMaps[name]) {
      const [mergedDoc, err] = mergeDocuments(baseMaps[name], overlayMap);
      if (err) {
        return [null, new Error(`cannot merge documents: ${err.message}`)];
      }
      if (!mergedDoc) {
        return [null, new Error(`merged document is null`)];
      }
      baseMaps[name] = mergedDoc;
    } else {
      baseMaps[name] = overlayMap;
    }
  }

  const result: unknown[] = [];
  for (const value of Object.values(baseMaps)) {
    result.push(value);
  }
  return [result, null];
};

/**
 * Check if the given value is an object with a name attribute.
 * The name attribute declares a block (e.g. a namespace or method) in IFEX.
 * @param value The value to check
 * @returns [object, isMap, name] where object is the object with the name attribute,
 *                                isMap is true if the value is an object with a name attribute,
 *                                and name is the value of the name attribute
 */
const getNameAttribute = (value: unknown): [MergedDocument | null, boolean, string] => {
  if (typeof value !== 'object' || value === null) {
    return [null, false, ''];
  }

  const valueMap = value as MergedDocument;
  if (!valueMap.hasOwnProperty('name')) {
    return [null, false, ''];
  }

  const nameValue = valueMap['name'];
  if (typeof nameValue === 'string') {
    return [valueMap, true, nameValue];
  }

  return [null, false, ''];
};

const isObject = (value: unknown): value is MergedDocument => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
