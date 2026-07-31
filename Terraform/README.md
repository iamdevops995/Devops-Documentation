# Terraform

Infrastructure as code notes, module patterns and state handling.

> Sections below match the sidebar. Content is being filled in incrementally.

## Language

### Providers

Required providers, version constraints, aliases, multiple regions.

### Resources and Data Sources

Meta-arguments, `count` vs `for_each`, lifecycle rules, dependencies.

### Variables and Outputs

Types, validation, defaults, sensitive values, output composition.

## State

### Remote Backends

S3 with DynamoDB locking, Azure Storage, GCS, migration between backends.

### State Commands

`state list`, `state mv`, `state rm`, `import`, drift detection.

## Modules

Structure, inputs and outputs, versioning, registry vs local sources, composition.

## Installation

CLI installation and version management.

See also `Terraform/Installation` in the repository.
