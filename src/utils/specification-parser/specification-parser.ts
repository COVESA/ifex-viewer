/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

import { IfexSpecificationItem, ParsedIfexSpecificationItem } from '../../types.ts';
import YAML, { Document } from 'yaml';

export const parseSpecifications = (specifications: IfexSpecificationItem[]): ParsedIfexSpecificationItem[] => {
  const parsedSpecifications: ParsedIfexSpecificationItem[] = [];

  for (const specification of specifications) {
    try {
      const normalizedFilename = removeYamlFileEnding(specification.filename);
      const parsedSpecificationContent: Document[] = YAML.parseAllDocuments(specification.content);
      const parsedSpecificationDocuments = parsedSpecificationContent.map(
        (spec, index): ParsedIfexSpecificationItem => ({
          filename:
            index > 0
              ? `${normalizedFilename} (${index + 1})` // +1 because we want to start with 1
              : normalizedFilename,
          content: spec.toJSON(),
        }),
      );

      parsedSpecifications.push(...parsedSpecificationDocuments);
    } catch (error) {
      throw Error(`Error parsing ${specification.filename}: ${error}`);
    }
  }

  return parsedSpecifications;
};

const removeYamlFileEnding = (filename: string): string => {
  return filename.replace(/\.(yml|yaml)$/, '');
};
