<a name="readme-top"></a>

<!--
*** Based on the Best-README-Template: https://github.com/othneildrew/Best-README-Template.
-->

<br />

<div align="center">
  <img src="docs/public/logo.svg" alt="TabMate Logo" width="200"/>
  <h1 align="center">Interface Exchange Framework (IFEX) Viewer</h1>
    
  <p align="center">
    The IFEX Viewer is a web component designed to display API specifications created with the Interface Exchange Framework (<a href="https://github.com/COVESA/ifex">IFEX</a>) and is capable of rendering all elements specified in the <a href="https://covesa.github.io/ifex/specification/">IFEX Core IDL</a>.<br/>
    <br />
    <a href="https://covesa.github.io/ifex-viewer/">View Documentation</a>
    .
    <a href="https://covesa.github.io/ifex-viewer/playground/">Try it out</a>
    ·
    <a href="https://github.com/COVESA/ifex-viewer/issues/new?template=bug_report.yml">Report Bug</a>
    ·
    <a href="https://github.com/COVESA/ifex-viewer/issues/new?template=feature_request.yml">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

**Features:**

- IFEX Core IDL viewer: Supports and visualizes all properties provided by the IFEX Core IDL
- Easy usage: You can simply use the ifex viewer in any framework because it's a web component.
- Supports multiple files: You can pass multiple files to the viewer and it will render them all.
- Supports custom and deployment layers: You can define custom layers and deployment layers in your specification and the viewer will render them.

**Coming soon:**

- Customizability: Style the ifex viewer for your indidivdual needs
- Internationalization: Provides different languages

> [!TIP]
> Quickly prototype and validate your IFEX API definitions by using the [Playground](https://covesa.github.io/ifex-viewer/playground/).

![Product Name Screen Shot][product-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Vue](https://vuejs.org/)
- [tailwindcss](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)

_Source code has been tested solely for our own use cases, which might differ from yours._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Please follow the instructions below to make the library work in your project.

### Prerequisites

You need the following software installed to be able to use this library:

- [Node](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

### Installation

```shell
npm i @covesa/ifex-viewer
# or
yarn add @covesa/ifex-viewer
# or
pnpm add @covesa/ifex-viewer
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The viewer can be used in every modern browser because it's built as Web Component. You can use it in your project like a regular html element.

```html
<body>
    <ifex-viewer id="viewer"></ifex-viewer>
</body>
<script>
  const viewer = document.getElementById('viewer');
  viewer.specifications = [{
      filename: 'my-api-specification.yml',
      content:`
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
      `
  }];
<script>
```

For more info about all the configuration options check out the documentation [here](https://covesa.github.io/ifex-viewer/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Visualize deployment layers
- [ ] Editable IFEX Spec
- [ ] VSCode Plugin for visualizing IFEX APIs right inside your IDE

<!-- See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the Apache License 2.0. See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

See [`MAINTAINERS.md`](./MAINTAINERS.md) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: /.github/product-screenshot.png
