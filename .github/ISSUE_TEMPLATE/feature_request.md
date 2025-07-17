name: Feature Request
description: Suggest a new feature or improvement for the IFEX Viewer.
labels: [enhancement]
title: "[Feature] <short description>"
body:
  - type: markdown
    attributes:
      value: |
        ## Suggest a Feature or Enhancement
        Please describe your idea to help us improve the IFEX Viewer.
  - type: input
    id: motivation
    attributes:
      label: Motivation
      description: Why is this feature important?
      placeholder: "Explain the problem or need."
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed Solution
      description: Describe your proposed solution or feature.
      placeholder: "Describe your idea."
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Have you considered any alternatives?
      placeholder: "List any alternative solutions."
    validations:
      required: false
  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Add any other context, screenshots, or references.
      placeholder: "Add context here."
    validations:
      required: false

