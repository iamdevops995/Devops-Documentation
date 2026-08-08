# Kubernetes Gateway API

## Overview

The **Kubernetes Gateway API** is a next‑generation networking API
designed to improve and eventually replace the traditional Kubernetes
Ingress resource. It provides a more expressive, extensible, and
role‑oriented way to manage traffic routing in Kubernetes clusters.

The API is developed by the Kubernetes SIG Network community and focuses
on standardizing how external and internal traffic enters Kubernetes
clusters.

------------------------------------------------------------------------

## Why Gateway API?

Traditional **Ingress** has several limitations:

-   Limited routing capabilities
-   Controller‑specific annotations
-   Difficult multi‑team ownership
-   Hard to extend for advanced networking

The **Gateway API** solves these issues by introducing structured
resources and role‑based responsibilities.

------------------------------------------------------------------------

## Key Concepts

### 1. GatewayClass

Defines the controller that will implement the Gateway.

``` yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: nginx.org/gateway-controller
```

------------------------------------------------------------------------

### 2. Gateway

Represents the entry point into the Kubernetes cluster.

``` yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: web-gateway
spec:
  gatewayClassName: nginx
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

------------------------------------------------------------------------

### 3. HTTPRoute

Defines how HTTP traffic should be routed to backend services.

``` yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: web-route
spec:
  parentRefs:
  - name: web-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: web-service
      port: 80
```

------------------------------------------------------------------------

## Supported Route Types

  Route Type   Protocol

| HTTPRoute | HTTP / HTTPS    |
| --------- | --------------- |
| TCPRoute  | TCP             |
| UDPRoute  | UDP             |
| TLSRoute  | TLS passthrough |

------------------------------------------------------------------------

## Architecture Flow

Client → Load Balancer → Gateway → Route → Service → Pods

------------------------------------------------------------------------

## Gateway API vs Ingress                             

| **Featur**e      | **Ingres**s         | **Gateway** API |
| ---------------- | ------------------- | --------------- |
| Routing          | Basic               | Advanced        |
| Role Separation  | No                  | Yes             |
| Protocol Support | Mostly HTTP         | HTTP, TCP, UDP  |
| Extensibility    | Limited             | High            |
| Standardization  | Controller specific | Standard API    |

------------------------------------------------------------------------

## Example Use Cases

-   Canary deployments
-   Multi‑team clusters
-   Service mesh integration
-   Advanced traffic routing

------------------------------------------------------------------------

## Summary

The **Kubernetes Gateway API** provides a modern, flexible, and scalable
approach to managing network traffic in Kubernetes environments.
