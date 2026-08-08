![[Pasted image 20250716120723.png]]
**What is a Job in Kubernetes?**
A Job in Kubernetes ensures that a task runs to completion, unlike Deployments, which maintain a desired state of running pods.

*How does it work?*
**CronJob Controller Layer:**

CronJob Defined → A CronJob is scheduled with a time pattern like `* * * * *`

CronJob Controller → Reads the schedule and policies (e.g., concurrencyPolicy: Forbid).

Creates Job → When the schedule hits, the CronJob Controller spawns a Job resource.

 **Job Controller Layer:**

⚙️ Job Configuration →  The Job has settings like 
```
completions: 1
parallelism: 1
backoffLimit: 6
```


 **Job Controller →** Creates Pods based on the Job template and tracks their completions.

***Pod Layer:***

**Pod Creation →** Job Controller spawns a Pod to run the job.
**Run Containers →** Pod runs containers as per spec (restartPolicy: Never).
**Success Path →** If Pod finishes successfully, it's marked as Succeeded.
**Failure Path →** On failure, Pod is retried based on backoffLimit.
**Retry Logic →** If retries exhaust, the Pod is marked Failed, and the Job may retry or end.
