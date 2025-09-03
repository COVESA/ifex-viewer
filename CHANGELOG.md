# IFEX Viewer Changelog

## v1.2.0 (2025-09-03)

### Features

- Selected nodes are kept open when specification input files are updated and node still exists ([#33](https://github.com/COVESA/ifex-viewer/pull/33))
- Sidenav position is now configurable via property `layout.sidenavPosition`. Default value is `left` ([#34](https://github.com/COVESA/ifex-viewer/pull/34))
- Sidenav position can be changed by the user via a button in the header ([#34](https://github.com/COVESA/ifex-viewer/pull/34))

## Bug Fixes

- Fix to prevent sharing pinia state between multiple viewer instances on the same page ([#37](https://github.com/COVESA/ifex-viewer/pull/37))
- Improved responsiveness of `ErrorNotification` component ([#37](https://github.com/COVESA/ifex-viewer/pull/37))

## v1.1.0 (2025-08-20)

### Features

- Updated the IFEX logo ([#15](https://github.com/COVESA/ifex-viewer/pull/15))
- Resolve complex datatype linking by supporting AST path resolution ([#17](https://github.com/COVESA/ifex-viewer/pull/17))
- Upgraded dependencies ([#16](https://github.com/COVESA/ifex-viewer/pull/16),[#18](https://github.com/COVESA/ifex-viewer/pull/18) & [#19](https://github.com/COVESA/ifex-viewer/pull/19))

## v1.0.0 (2025-07-15)

Welcome to the initial release of the IFEX Viewer, a powerful web component designed to visualize API specifications created with the Interface Exchange Framework (IFEX).

### Features

- **Core IDL Support**: Implemented support for the IFEX Core IDL, allowing the viewer to render all elements specified in the IFEX Core IDL.
- **Web Component**: Developed the viewer as a web component, enabling easy integration into various frameworks.
- **IFEX Layer Support**: Supports viewing different ifex layers, like custom and deployment layers.
- **Validation and Error Visualization**: The viewer validates the Core Layer based on the IFEX Core IDL and visualizes any validation errors directly in the UI, enhancing the developer experience when working with your IFEX API specifications.

This release marks the beginning of a robust tool designed to simplify and enhance the visualization of API specifications within the IFEX framework. Enjoy exploring and integrating the IFEX Viewer into your projects!
