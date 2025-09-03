# API

## Properties

### `specifications: Array<IfexSpecificationItem>`

This property is used to pass all the IFEX specification layers to the viewer. The specification is an array of objects with the following structure:

```ts
interface IfexSpecificationItem {
  filename: string; // The name of the specification file (e.g. your-spec.yml). The filename is displayed as a label in the UI if no name is present in the specification document.
  content: string; // The content of the specification file in YAML format as a string.
}
```

### `layout: IfexViewerLayout`

This property is used to customize the layout of the viewer. The layout object has the following structure:

```ts
interface IfexViewerLayout {
  /**
   * Determines whether the side navigation is positioned on the left or right side of the viewer. Default is 'left'.
   * @default 'left'
   */
  sidenavPosition?: 'left' | 'right';
}
```

## Events

### `specloaded`

This event is emitted when the specification is parsed and rendered.

#### Example

::: code-group

```html [index.html]
<ifex-viewer id="viewer"></ifex-viewer>
```

```ts [script.ts]
const viewer = document.getElementById('viewer');
viewer.addEventListener('specloaded', () => console.log('Specification loaded'));
```

:::

### `clipboardcopiedsuccessful`

This event triggers when an element, such as a dot notation path, is copied to the clipboard. You can listen for this event to show custom notifications.

#### Event payload

```ts
interface ClipboardCopiedEvent {
  type: 'dotNotation' | 'validationError' | 'sourcecode';
  data: 'string';
}
```

### `nodeselected`

This event triggers when a node was selected in the sidenav.

#### Event payload

```ts
interface NodeSelectedEvent {
  path: string;
}
```

### `sidenavPositionChanged`

This event triggers when the position of the sidenav was changed.

#### Event payload

```ts
type SidebarPositionChangedEvent = 'left' | 'right';
```

## Methods

### `selectNode(path: string): void`

Selects a node (e.g. a method or event) in the sidenav of the viewer by the given path.

#### Params

- `path`: Path is the dot notation path starting from the root node (e.g. `GalacticEmpire.recruitStormtrooper`). Depending on your API structure, the dot notation path might not be unique.

#### Example

::: code-group

```html [index.html]
<ifex-viewer id="viewer" specifications="mySpecifications"></ifex-viewer>
```

```ts [script.ts]
const viewer = document.getElementById('viewer');
viewer.selectNode('GalacticEmpire.recruitStormtrooper');
```

:::

::: tip
It's recommended to listen to the `specloaded` event first to ensure that the specification is loaded before calling the `selectNode` method.
:::

## Slots

[Slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) are used to customize the viewer's content. The following slots are available:

### Headline of a detail page

**Slot name: `<dotNotationPath>-headline`**

This slot is used to customize the headline of a node. The slot name is the dot notation path (e.g. `root-namespace.nested-namespace.method-1-headline`) of the node in which the headline should be customized.

The slot content will only be shown if the currently visible node matches the given dot notation path.

::: warning
The dot notation path used in the slot names has to be in all lowercase.
:::

#### Example

```html
<template>
  <ifex-viewer>
    <p slot="galacticempire.recruitstormtrooper-headline">Some extra metadata in the headline.</p>
    <p slot="galacticempire.deploytieefighter-headline">Some other metadata in another headline.</p>
  </ifex-viewer>
</template>
```

### Argument and Error rows of a detail page (Methods, Events, Structs, Enumerations)

**Slot name: `<dotNotationPath>`**

::: warning
This slot is only available on pages containing arguments or errors. These are in general: Methods, Events, Structs and Enumerations.
:::

In these slots you can pass additional information about a specific argument or error. The slot name is the dot notation path (e.g. `root-namespace.nested-namespace.method-1.myInputProp`) to the respective argument or error.

The slot content will only be shown if the currently visible node with it's arguments and errors matches the given dot notation path.

::: warning
The dot notation path used in the slot names has to be in all lowercase.
:::

#### Example

```html
<template>
  <ifex-viewer>
    <p slot="galacticempire.recruitstormtrooper.name">Some extra metadata of this argument.</p>
    <p slot="galacticempire.recruitstormtrooper.planetoforigin">Some extra metadata of another argument.</p>
    <p slot="galacticempire.deploytieefighter.targetcoordinates">Call darth vader</p>
  </ifex-viewer>
</template>
```
