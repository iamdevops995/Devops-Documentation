# Docker

Image building, container runtime and Compose notes.

> Sections below match the sidebar. Content is being filled in incrementally.

## Images

### Dockerfile

Instructions, layer caching, multi-stage builds, non-root users, healthchecks.

### Build Optimisation

Cache mounts, `.dockerignore`, base image choice, image size reduction.

### Registries

Tagging conventions, pushing and pulling, private registry authentication.

## Runtime

### Containers

Run flags, restart policies, resource limits, logs, exec and inspect.

### Volumes

Named volumes, bind mounts, tmpfs, backup and restore.

### Networks

Bridge, host and overlay drivers, DNS between containers, port publishing.

## Compose

Service definitions, dependencies, profiles, environment files, override files.

## Installation

Engine installation on Linux, post-install steps, containerd configuration.

See also the notes in `Docker Installation.txt` and `Containerd_installation` at
the repository root.
