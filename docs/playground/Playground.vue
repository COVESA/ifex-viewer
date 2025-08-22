<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import { IfexSpecificationItem } from '../../src/types';
import { simpleSpecificationMock } from '../../src/tests/mocks/specification';

const mounted = ref(false);
const { isDark } = useData();

onMounted(() => {
  import('../../dist/ifex-viewer.es.js').then(() => {
    mounted.value = true;
  });
});

const specificationVal = defineModel<string>({ default: simpleSpecificationMock });

// TODO: improve to support multiple files
const specification = computed<IfexSpecificationItem[]>(() => [{ filename: 'test.yml', content: specificationVal.value }]);
</script>

<template>
  <div class="playground-container">
    <!-- TODO: use lightweight code editor like CodeMirror -->
    <div class="editor"><textarea v-model="specificationVal"></textarea></div>
    <div v-if="mounted" class="ifex-viewer-playground-container">
      <ifex-viewer :specifications="specification" :class="isDark ? 'ifex-viewer-playground dark' : 'ifex-viewer-playground'"></ifex-viewer>
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 75vh;
  gap: 2rem;
}

.ifex-viewer-playground-container {
  height: 50vh;
}

.ifex-viewer-playground {
  display: block;
  height: 100%;
}

.editor {
  height: 50vh;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-input-border-color);
  padding: 0.25rem;
  box-sizing: border-box;
  border-radius: 0.375rem;
}

.editor textarea {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  resize: none;
  font-family: monospace;
}

@media (min-width: 1440px) {
  .playground-container {
    flex-direction: row;
  }

  .editor {
    width: 50%;
    height: 100%;
    max-height: 75vh;
  }

  .ifex-viewer-playground-container {
    width: 50%;
    height: 100%;
    max-height: 75vh;
  }
}
</style>
