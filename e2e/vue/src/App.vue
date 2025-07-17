<template>
  <div class="container">Spec loaded: {{ specLoaded }}</div>

  <div class="container">Selected node: {{ selectedNodePath }}</div>

  <div class="container">
    Copied event data: <br />
    <span>Type: {{ clipboardCopiedEventPayload?.type ?? '' }} </span>
    <br />
    <span>Data: {{ clipboardCopiedEventPayload?.data ?? '' }} </span>
  </div>

  <ifex-viewer
    :specifications="specifications"
    @specloaded="onSpecLoaded"
    @nodeselected="onNodeSelected($event)"
    @clipboardcopiedsuccessful="onClipboardCopied($event)"
    ref="ifexViewer"
  >
    <template v-if="hasSlots">
      <div :slot="headlineSlotPath">{{ headlineSlotText }}</div>
      <div :slot="fleetSizeMethodSlotPath">{{ fleetSizeMethodSlotContent }}</div>
    </template>
  </ifex-viewer>
</template>

<script setup lang="ts">
import '../../../dist/ifex-viewer.es';
import { specificationItemMock } from '../../../src/tests/mocks/specification.ts';
import { ClipboardCopiedEvent } from '../../../src/types.ts';
import { onMounted, ref, useTemplateRef } from 'vue';
import { fleetSizeMethodSlotContent, fleetSizeMethodSlotPath, headlineSlotPath, headlineSlotText, initialNodePathQueryName, slotQueryName } from '../../e2e-apps-setup.ts';

const specifications = ref([specificationItemMock]);
const selectedNodePath = ref('');
const specLoaded = ref(false);
const clipboardCopiedEventPayload = ref<ClipboardCopiedEvent | null>(null);
const hasSlots = ref(false);

const onNodeSelected = (evt: CustomEvent) => {
  selectedNodePath.value = evt.detail[0].path;
};

const onSpecLoaded = () => {
  specLoaded.value = true;
};

const onClipboardCopied = (evt: CustomEvent) => {
  clipboardCopiedEventPayload.value = evt.detail[0];
};

const ifexViewerRef = useTemplateRef<HTMLElement>('ifexViewer');

onMounted(() => {
  // For this simple example app we don't need the vue router so
  // we are using the native browser methods to get the query parameters
  const queryParameters = new URLSearchParams(window.location.search);
  const initialNodePath = queryParameters.get(initialNodePathQueryName);
  if (initialNodePath) {
    (ifexViewerRef.value as any).selectNode(initialNodePath);
  }
  const hasSlotsQueryVal = queryParameters.get(slotQueryName);
  hasSlots.value = hasSlotsQueryVal === 'true';
});
</script>
