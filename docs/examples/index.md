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

<div class="examples-page">

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

</div>

<style>
.examples-page .ifex-viewer {
  display: block; 
  height: 500px;
  margin-bottom: 3rem;
}

.examples-page {
  padding: 0 24px; /* Same padding as navbar wrapper */
}

@media (min-width: 768px) {
  .examples-page {
    padding: 0 32px;
  }
}

@media (min-width: 1440px) {
  .examples-page {
    width: calc(var(--vp-layout-max-width) - 64px);
    margin: 0 auto;
    padding: 0;
  }
}

.examples-page h1,.examples-page h2 {
  margin: 48px 0 16px;
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 32px;
}

.examples-page h1 {
  font-size: 32px;
}

.examples-page h2 {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 32px;
  font-size: 24px;
}

.examples-page p {
  line-height: 28px;
  margin: 16px 0;
}
</style>
