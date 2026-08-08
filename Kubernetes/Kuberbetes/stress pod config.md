```
kind: Pod
apiVersion: v1
metadata:
    name: inres
spec:
     containers:
        - name: main
          image: polinux/stress
          command: ["stress"]
          args: ["--vm", "1", "--vm-bytes", "200M", "--vm-hang", "1"]
          resources:
            requests:
               memory: "100Mi"
            limits:
               memory: "200Mi"
```