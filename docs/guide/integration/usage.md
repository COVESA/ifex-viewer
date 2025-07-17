# Usage

The viewer can be used in every modern browser because it's built as a [Web Component](https://developer.mozilla.org/de/docs/Web/API/Web_components).

Therefore, it can be used like a regular html element.

```html
<ifex-viewer></ifex-viewer>
```

To display your specification files, you can pass it to the `specifications` property like so:

::: code-group

```html [index.html]
<ifex-viewer id="ifex-viewer"></ifex-viewer>
```

```ts [script.ts]
const viewer = document.querySelector('#ifex-viewer');

const mySpecifications = [
  {
    filename: 'my-api-specification.yml',
    content: `
        name: "GalacticEmpireAPI"
        description: "API for the operations and command structure of the Galactic Empire"
        major_version: 1
        minor_version: 0
        namespaces:
          - name: "GalacticEmpire"
            description: "Namespace for operations related to the Galactic Empire"
            methods:
              - name: "recruitStormtrooper"
                description: "Recruits a new stormtrooper to the Imperial Army"
                input:
                  - name: "name"
                    datatype: "string"
                    description: "Name of the recruit"
                  - name: "planetOfOrigin"
                    datatype: "string"
                    description: "Planet where the recruit was born"
                output:
                  - name: "stormtrooperId"
                    datatype: "string"
                    description: "The ID of the newly recruited stormtrooper"
        `,
  },
];

// Assign the specifications to the viewer
viewer.specifications = mySpecifications;
```

:::

The data provided in the `specifications` property should be an array of objects with the following structure:

```ts
interface IfexSpecificationItem {
  filename: string;
  content: string; // The yaml content of the specification
}
```

### Providing a height to the viewer

::: tip

This is key for a good user experience.

:::

It's important to provide the ifex viewer some height declaration in your application. Otherwise it will increase it's height
based on the currently visible nodes in the specification. This can lead to a bad user experience, especially if you have a lot of content.

Setting the height can be done as either a fixed height or a relative height, such as vh or a percentage.

::: code-group

```html [index.html]
<ifex-viewer id="ifex-viewer"></ifex-viewer>
```

```css [styles.css]
#ifex-viewer {
  display: block; /* Make sure the viewer is not an inline element otherwise height will have no effect */
  height: 100vh;
}
```

:::

## Usage in Vue.js

If you're using a framework like Vue.js you can directly pass all the specification layers to the web component like so:

```vue
<template>
  <ifex-viewer :specifications="specifications"></ifex-viewer>
</template>
<script setup>
import { ref } from 'vue';

const specifications = ref([
  {
    filename: 'my-api-specification.yml',
    content: `
        name: "GalacticEmpireAPI"
        description: "API for the operations and command structure of the Galactic Empire"
        major_version: 1
        minor_version: 0
        namespaces:
          - name: "GalacticEmpire"
            description: "Namespace for operations related to the Galactic Empire"
            methods:
              - name: "recruitStormtrooper"
                description: "Recruits a new stormtrooper to the Imperial Army"
                input:
                  - name: "name"
                    datatype: "string"
                    description: "Name of the recruit"
                  - name: "planetOfOrigin"
                    datatype: "string"
                    description: "Planet where the recruit was born"
                output:
                  - name: "stormtrooperId"
                    datatype: "string"
                    description: "The ID of the newly recruited stormtrooper"
              `,
  },
]);
</script>
```

## Configuration Properties

See the full list of configurable properties in the [API Documentation](../../api/index.md).

## Examples

There are also example apps available for the following frameworks:

- Angular: https://github.com/COVESA/ifex-viewer/tree/main/e2e/angular
- React: https://github.com/COVESA/ifex-viewer/tree/main/e2e/react
- Vue and Angular available here: https://github.com/COVESA/ifex-viewer/tree/main/e2e/vue
