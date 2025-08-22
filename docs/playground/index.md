---
layout: page
---

<script setup>
import Playground from './Playground.vue'
</script>

<div class="playground-page">

# Playground

Edit your IFEX API definition and see the API visualized in real-time. This playground provides a live environment for building and validating your APIs.

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
  padding: 0 24px; /* Same padding as navbar wrapper */
}

@media (min-width: 1440px) {
  .playground-page {
    padding: 0 8rem;
  }
}


.playground-page p {
  line-height: 28px;
  margin: 16px 0;
}
</style>
