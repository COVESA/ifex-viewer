/**
 * SPDX-License-Identifier: Apache-2.0
 * SPDX-FileCopyrightText: © 2025 Mercedes-Benz Tech Innovation GmbH
 */

// TODO: lazy load components
import ApiDetailPage from './components/detail-pages/api-detail-page/ApiDetailPage.vue';
import GroupedDetailPage from './components/detail-pages/grouped-detail-page/GroupedDetailPage.vue';
import MethodDetailPage from './components/detail-pages/method-detail-page/MethodDetailPage.vue';
import EventDetailPage from './components/detail-pages/event-detail-page/EventDetailPage.vue';
import StructDetailPage from './components/detail-pages/struct-detail-page/StructDetailPage.vue';
import TypedefDetailPage from './components/detail-pages/typedef-detail-page/TypedefDetailPage.vue';
import PropertyDetailPage from './components/detail-pages/property-detail-page/PropertyDetailPage.vue';
import EnumerationDetailPage from './components/detail-pages/enumeration-detail-page/EnumerationDetailPage.vue';
import FallbackPage from './components/detail-pages/fallback-page/FallbackPage.vue';
import { IFEXTreeModelNode, NodeType } from './types/node';
import { computed, ComputedRef, ref } from 'vue';
import { findNodeById, getFullDotNotationPath } from './utils/tree/tree';
import { AST, Enumeration, Event, Interface, Method, Namespace, Property, Struct, Typedef } from './types/ifex-core.ts';
import { DetailPageBaseProps } from './components/detail-pages/shared/types.ts';

export type DetailPageType = Exclude<NodeType, 'wrapper'>;
export type DetailPageTypeWithFallback = Exclude<NodeType, 'wrapper'> | 'fallback';

interface CommonDetailPageProps extends DetailPageBaseProps {
  type: DetailPageTypeWithFallback;
}

interface DetailPage {
  component:
    | typeof MethodDetailPage
    | typeof EventDetailPage
    | typeof StructDetailPage
    | typeof EnumerationDetailPage
    | typeof ApiDetailPage
    | typeof GroupedDetailPage
    | typeof TypedefDetailPage
    | typeof PropertyDetailPage
    | typeof FallbackPage;
  key: string;
  props: CommonDetailPageProps & Record<string, unknown>;
}

export const useDetailPageSelection = (viewerModel: ComputedRef<IFEXTreeModelNode[]>, viewerModelWithoutApi: ComputedRef<IFEXTreeModelNode[]>) => {
  const selectedNode = ref<IFEXTreeModelNode | undefined>(undefined);

  const getDotNotationPath = () => {
    if (!selectedNode.value || selectedNode.value?.type === 'api') {
      return '';
    }

    // The dot notation path should start with the root namespace and not with the name of the api
    return getFullDotNotationPath(selectedNode.value.id, viewerModelWithoutApi.value);
  };

  const selectCoreLayer = () => (selectedNode.value = viewerModel.value[0]); // TODO: pass core layer into composable

  const changeSelection = (nodeId: string) => {
    selectedNode.value = findNodeById(nodeId, viewerModel.value);
  };

  const getChildrenDotNotationPaths = (
    currentSelectionType: DetailPageType,
    node: AST | Enumeration | Event | Interface | Method | Namespace | Struct | Property | Typedef,
    dotNotationFullPath: string,
  ) => {
    const childrenDotNotationFullPaths: string[] = [];

    if (currentSelectionType === 'method' || currentSelectionType === 'event') {
      for (const input of (node as Method | Event).input || []) {
        childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${input.name}`);
      }
    }

    if (currentSelectionType === 'method') {
      const currentMethod = node as Method;
      for (const output of currentMethod.output || []) {
        childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${output.name}`);
      }

      for (const returns of currentMethod.returns || []) {
        childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${returns.name}`);
      }

      for (const error of currentMethod.errors || []) {
        // TODO: how do we handle cases where no name is set? Don't offer a slot?
        if (error.name) {
          childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${error.name}`);
        }
      }
    }

    if (currentSelectionType === 'struct') {
      for (const member of (node as Struct).members || []) {
        childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${member.name}`);
      }
    }

    if (currentSelectionType === 'enumeration') {
      for (const option of (node as Enumeration).options || []) {
        childrenDotNotationFullPaths.push(`${dotNotationFullPath}.${option.name}`);
      }
    }

    return childrenDotNotationFullPaths;
  };

  const detailPage = computed<DetailPage>(() => {
    const currentSelectionType = selectedNode.value?.type as DetailPageType;

    if (currentSelectionType && selectedNode.value && viewerModel.value) {
      const dotNotationFullPath = getDotNotationPath();
      const { node, id, validationErrors } = selectedNode.value;

      const commonProps: CommonDetailPageProps = {
        type: currentSelectionType,
        dotNotationFullPath,
        validationErrors,
      };
      const key = id;

      const nodesWithChildrenDotNotationPaths: DetailPageType[] = ['method', 'event', 'struct', 'enumeration'];
      const hasChildrenDotNotationPaths = nodesWithChildrenDotNotationPaths.includes(currentSelectionType);

      if (hasChildrenDotNotationPaths) {
        commonProps.childrenDotNotationFullPaths = getChildrenDotNotationPaths(currentSelectionType, node, dotNotationFullPath);
      }

      const componentMap: Record<DetailPageType, DetailPage> = {
        api: {
          component: ApiDetailPage,
          key,
          props: {
            api: node,
            ...commonProps,
          },
        },
        namespace: {
          component: GroupedDetailPage,
          key,
          props: {
            data: node,
            ...commonProps,
          },
        },
        interface: {
          component: GroupedDetailPage,
          key,
          props: {
            data: node,
            ...commonProps,
          },
        },
        method: {
          component: MethodDetailPage,
          key,
          props: {
            method: node,
            ...commonProps,
          },
        },
        event: {
          component: EventDetailPage,
          key,
          props: {
            event: node,
            ...commonProps,
          },
        },
        struct: {
          component: StructDetailPage,
          key,
          props: {
            struct: node,
            ...commonProps,
          },
        },
        typedef: {
          component: TypedefDetailPage,
          key,
          props: {
            typedef: node,
            ...commonProps,
          },
        },
        property: {
          component: PropertyDetailPage,
          key,
          props: {
            propertyData: node,
            ...commonProps,
          },
        },
        enumeration: {
          component: EnumerationDetailPage,
          key,
          props: {
            enumeration: node,
            ...commonProps,
          },
        },
      };

      const selectedComponent = componentMap[currentSelectionType];
      if (selectedComponent) {
        return selectedComponent;
      }
    }

    return { component: FallbackPage, key: 'fallback', props: { type: 'fallback', dotNotationFullPath: '' } };
  });

  return { detailPage, selectCoreLayer, changeSelection, selectedNode };
};
