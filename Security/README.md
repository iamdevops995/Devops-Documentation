# Security

Practical controls for pipelines, clusters and cloud accounts.

> Sections below match the sidebar. Content is being filled in incrementally.

## Identity and Access

Least privilege, role assumption, short-lived credentials, break-glass accounts.

## Secrets Management

Where secrets should live, rotation, injection into pipelines and workloads,
what never belongs in a repository.

## Certificates and OpenSSL

Generating keys and CSRs, inspecting certificates and chains, converting formats,
checking expiry.

See also `Openssl_cmds` at the repository root.

## Image Scanning

Scanning container images for known vulnerabilities and failing builds on
severity thresholds.

See also `TrivyInstallation.txt` at the repository root.

## Pre-commit Secret Scanning

Blocking credentials before they reach history, and cleaning up when they slip
through.

See also `talisman installation` at the repository root.
