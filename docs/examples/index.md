---
layout: page
---

<script setup>
import {specificationItemMock,specificationMockWithValidationErrors,specificationWithTwoDocs,customLayerSpecificationItemMock} from '../../src/tests/mocks/specification';
import { onMounted, ref } from 'vue';
import { useData } from 'vitepress';

const mounted = ref(false);
const { isDark } = useData();

onMounted(() => {
  import('../../dist/ifex-viewer.es.js').then(() => {
    mounted.value = true;
  });
});
</script>

# Examples

This page contains examples of different states and use cases of the IFEX Viewer.

## Basic Example

This example shows how it looks like when providing only one specification to the viewer.

<div v-if="mounted" >
    <ifex-viewer :specifications="[specificationItemMock]" :class="isDark ? 'ifex-viewer dark' :'ifex-viewer'"></ifex-viewer>
</div>

## With Validation Errors

This example shows how it looks like when providing a specification with validation errors.

<div v-if="mounted" >
    <ifex-viewer :specifications="[{ ...specificationItemMock, content: specificationMockWithValidationErrors }]" :class="isDark ? 'ifex-viewer dark' :'ifex-viewer'"></ifex-viewer>
</div>

## With Multiple Specifications

This example shows passing multiple specifications to the viewer, each representing one IFEX layer.

<div v-if="mounted" >
    <ifex-viewer :specifications="[{ ...specificationItemMock, content: specificationWithTwoDocs }, customLayerSpecificationItemMock]" :class="isDark ? 'ifex-viewer dark' :'ifex-viewer'"></ifex-viewer>
</div>

<style>
.ifex-viewer {
  display: block; 
  height: 500px;
  margin-bottom: 3rem;
}

.VPPage {
  padding: 0 24px;
}

@media (min-width: 768px) {
  .VPPage {
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .VPPage {
    width: calc(var(--vp-layout-max-width) - 64px);
    margin: 0 auto;
    padding: 0;
  }
}

.VPPage h1,.VPPage h2 {
  margin: 48px 0 16px;
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 32px;
}

.VPPage h1 {
  font-size: 32px;
}

.VPPage h2 {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 32px;
  font-size: 24px;
}

.VPPage p {
  line-height: 28px;
  margin: 16px 0;
}
</style>
