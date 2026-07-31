# Kubernetes

Cluster operations, manifests and debugging notes.

> Sections below match the sidebar. Content is being filled in incrementally.

## Workloads

### Pods

Lifecycle, init containers, probes, restart policies, QoS classes.

### Deployments

Rolling updates, revision history, rollbacks, surge and unavailability settings.

### StatefulSets

Stable network identity, volume claim templates, ordered rollout.

### Jobs and CronJobs

Completions, parallelism, backoff limits, schedules, concurrency policy.

## Networking

### Services

ClusterIP, NodePort, LoadBalancer, headless services, endpoint slices.

### Ingress

Controllers, path types, TLS termination, annotations.

### Network Policies

Default deny, ingress and egress selectors, namespace isolation.

## Configuration

### ConfigMaps

Creation, mounting as files, environment variables, rollout on change.

### Secrets

Types, mounting, encryption at rest, external secret operators.

### Requests and Limits

CPU and memory sizing, OOMKilled diagnosis, LimitRange and ResourceQuota.

## Operations

### Helm

Charts, values, releases, upgrades, rollbacks, template debugging.

### RBAC

Roles, ClusterRoles, bindings, service accounts, least privilege patterns.

### Debugging Workloads

CrashLoopBackOff, ImagePullBackOff, pending pods, node pressure, events and logs.
