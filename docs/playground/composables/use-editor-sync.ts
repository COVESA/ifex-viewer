/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { EditorState } from '@codemirror/state';
import { Ref } from 'vue';
import { Document as YAMLDocument } from 'yaml';

type EditorStateDoc = EditorState['doc'];

export const useEditorSync = (yamlSpecifications: Ref<YAMLDocument[]>) => {
  const getDotNotationPathOfSelectedNode = (state: EditorState): string => {
    const cursorPos = state.selection.main.head;
    const cursorLine = state.doc.lineAt(cursorPos).number;
    const cursorCol = cursorPos - state.doc.line(cursorLine).from + 1;

    for (const doc of yamlSpecifications.value) {
      const result = findNodeHierarchy(doc, cursorLine, cursorCol, state.doc);
      if (result.hierarchy.length > 0) {
        // Remove root-level name if it exists and is the first element in hierarchy
        const rootNameVal = getRootLevelName(doc);

        let filteredHierarchy = rootNameVal && result.hierarchy[0] === rootNameVal ? result.hierarchy.slice(1) : result.hierarchy;
        // Remove child elements using the context we found during traversal
        filteredHierarchy = removeMethodEventChildElements(filteredHierarchy, result.context);

        return filteredHierarchy.join('.');
      }
    }

    return '';
  };

  // Enhanced function to find both the hierarchy and context in a single traversal
  const findNodeHierarchy = (
    doc: YAMLDocument,
    targetLine: number,
    targetCol: number,
    editorDoc: EditorStateDoc,
  ): {
    hierarchy: string[]; // hierarchical representation of the spec doc like ['GalacticEmpire', 'DeathStarDestroyed', 'deathStarId'] -> used later for dot notation path
    context: string[]; // path of keys leading to the current node, e.g. ['namespaces', 'events', 'input'] -> used to filter out child elements
  } => {
    let bestMatch = null as { hierarchy: string[]; context: string[]; depth: number } | null;

    // Recursive function to traverse ALL nodes and find the deepest match
    const traverseNode = (node: any, currentHierarchy: string[] = [], currentContext: string[] = [], depth: number = 0): void => {
      if (!node) return;

      let updatedHierarchy = [...currentHierarchy];
      let updatedContext = [...currentContext];

      // If this node has a key, add it to the context path
      if (node.key?.value) {
        updatedContext.push(node.key.value);
      }

      // Check if this node has a 'name' property and add it to hierarchy
      if (node.items || node.value?.items) {
        const items = node.items || node.value.items;
        const nameItem = items?.find((item: any) => {
          return item.key && item.key.value === 'name';
        });

        if (nameItem?.value) {
          const nameValue = typeof nameItem.value === 'object' ? nameItem.value.value : nameItem.value;
          if (nameValue) {
            updatedHierarchy.push(nameValue);
          }
        }
      }

      // Check if this node contains our target position
      const nodeContainsTarget = node.range && isPositionInNodeRange(targetLine, targetCol, node, editorDoc);
      if (nodeContainsTarget && (!bestMatch || depth > bestMatch.depth)) {
        // This node contains the cursor and is deeper than our current best match
        bestMatch = {
          hierarchy: [...updatedHierarchy],
          context: [...updatedContext],
          depth: depth,
        };
      }

      // ALWAYS continue searching in child nodes
      // because the cursor might be in a deeper node than the current one
      if (node.items) {
        for (const item of node.items) {
          traverseNode(item, updatedHierarchy, updatedContext, depth + 1);
        }
      }

      if (!node.value) {
        return;
      }

      if (node.value.items) {
        for (const item of node.value.items) {
          traverseNode(item, updatedHierarchy, updatedContext, depth + 1);
        }
      }

      // Handle sequence items (arrays)
      if (Array.isArray(node.value)) {
        for (const item of node.value) {
          traverseNode(item, updatedHierarchy, updatedContext, depth + 1);
        }
      }

      // Handle other node types
      if (typeof node.value === 'object' && node.value.range) {
        traverseNode(node.value, updatedHierarchy, updatedContext, depth + 1);
      }
    };

    // Start traversal from the root
    traverseNode(doc.contents);

    // Return both hierarchy and context, or empty arrays if no match
    return bestMatch ? { hierarchy: bestMatch.hierarchy, context: bestMatch.context } : { hierarchy: [], context: [] };
  };

  // Helper function to check if a position is within a YAML node's range
  const isPositionInNodeRange = (targetLine: number, targetCol: number, node: { range: [number, number, number] }, editorDoc: EditorStateDoc): boolean => {
    // Range looks like this:
    // range?: [number, number, number]
    // The `[start, value-end, node-end]` character offsets for the part
    // of the source parsed into this node (undefined if not parsed).
    // The `value-end` and `node-end` positions are themselves not
    // included in their respective ranges.
    // See also https://eemeli.org/yaml/#stream-directives
    if (!node.range || node.range.length < 2) return false;

    const [startOffset, endOffset] = node.range;

    // Convert offsets to line/column positions
    const startPos = editorDoc.lineAt(startOffset);
    const startLine = startPos.number;
    const startCol = startOffset - startPos.from + 1;

    const endPos = editorDoc.lineAt(Math.min(endOffset, editorDoc.length));
    const endLine = endPos.number;
    const endCol = endOffset - endPos.from + 1;

    // Check if target position is within the node's range
    if (targetLine < startLine || targetLine > endLine) {
      return false; // Outside line range
    }

    if (targetLine === startLine && targetCol < startCol) {
      return false; // Same start line but before start column
    }

    if (targetLine === endLine && targetCol > endCol) {
      return false; // Same end line but after end column
    }

    // If none of the exclusion conditions are met, the position IS within range
    return true;
  };

  // Helper function to get the root-level name from a YAML document
  // Root level name is just the 'name: xyz' property at the top level of the document
  // compared to nested names (- name: xyz) within namespaces, methods, events, etc.
  const getRootLevelName = (doc: YAMLDocument): string | null => {
    if (!doc.contents) return null;

    // Check if the root is a mapping with items
    const contents = doc.contents as { items: any[] };
    if (contents.items) {
      const nameItem = contents.items.find((item: any) => {
        return item.key?.value === 'name';
      });

      if (nameItem?.value) {
        return typeof nameItem.value === 'object' ? nameItem.value.value : nameItem.value;
      }
    }

    return null;
  };

  // Function to remove child elements from hierarchy based on IFEX schema
  // e.g. input or output name shouldn't be included in the dot notation path
  const removeMethodEventChildElements = (hierarchy: string[], context: string[]): string[] => {
    if (hierarchy.length <= 1) return hierarchy;

    // If the cursor is within child elements that should be filtered out, remove the last element
    if (shouldFilterChildElement(context)) {
      return hierarchy.slice(0, -1);
    }

    return hierarchy;
  };

  // Function to check if the cursor is in a context where child elements should be filtered
  const shouldFilterChildElement = (contextPath: string[]): boolean => {
    // Define the child element types that should be filtered out for each parent type
    const filterRules = {
      // Method child elements
      methods: ['input', 'output', 'returns', 'errors'],
      // Event child elements
      events: ['input'],
      // Struct child elements
      structs: ['members'],
      // Enumeration child elements
      enumerations: ['options'],
      // Typedef doesn't have array children that need filtering (datatype/datatypes are direct properties)
      // Properties don't have array children that need filtering
      // Interfaces and Namespaces have arrays but those should be kept (methods, events, etc.)
    };

    // Look for patterns in the context path
    for (let i = 0; i < contextPath.length - 1; i++) {
      const current = contextPath[i];
      const next = contextPath[i + 1];

      // Check if we have a parent type followed by a child type that should be filtered
      if (filterRules[current as keyof typeof filterRules]?.includes(next)) {
        return true;
      }
    }

    return false;
  };

  return { getDotNotationPathOfSelectedNode };
};
