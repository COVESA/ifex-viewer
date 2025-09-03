---
layout: page
---

<script setup>
import Playground from './Playground.vue'
</script>

<div class="playground-page">

# Playground

The Playground allows you to edit your IFEX API and visualize them in real-time. It features syntax highlighting, error validation, and support for multiple document layers. The editor provides a live preview of your API structure, ensuring accurate and efficient API design.

::: tip
To create multiple specification documents, separate each document with three dashes (`---`).
:::

<Playground />

</div>

<style>
.playground-page h1 {
  margin: 48px 0 16px;
  padding-top: 24px;
  letter-spacing: -0.02em;
  line-height: 32px;
  font-size: 32px;
}

.playground-page {
  padding: 4px 24px; /* Same padding as navbar wrapper */
}

.playground-page p {
  line-height: 28px;
  margin: 16px 0;
}

.custom-block-title {
  margin: 0 !important;
}

@media (min-width: 1440px) {
  .playground-page {
    padding: 2px 8rem;
  }
}
</style>
