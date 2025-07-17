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
</style>
