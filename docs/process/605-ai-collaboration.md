# AI Collaboration Guide

How to work with ChatGPT / Cursor effectively.

## Prompt Shape
Goal → Constraints → Inputs → Deliverables

## Practice
- **Paste context**: link or include relevant files.
- **Be explicit**: filenames, diffs, constraints.
- **Request diffs**: always ask for file-by-file patch format.

## Example
> Goal: extend schema with new field.  
> Constraints: must validate JSON Schema 2020-12.  
> Inputs: `/schemas/core.json`.  
> Deliverables: updated schema + example.  
