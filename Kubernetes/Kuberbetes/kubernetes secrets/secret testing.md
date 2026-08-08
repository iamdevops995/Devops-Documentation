
![[Pasted image 20250904081457.png]]

![[Pasted image 20250904081555.png]]


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-tomcat-app
  labels:
    app: my-tomcat-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-tomcat-app
  template:
    metadata:
      labels:
        app: my-tomcat-app
    spec:
      containers:
        - name: my-tomcat-app
          image: iamdevops995/tomcat-app:v1
          ports:
            - containerPort: 8080
          env:
            - name: JAVA_OPTS
              valueFrom:
                secretKeyRef:
                  name: java-opts-secret
                  key: JAVA_OPTS
```

**Secret as plain text:**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: java-opts-secret
type: Opaque
stringData:
  JAVA_OPTS: "-Xms512m -Xmx1024m -Dspring.profiles.active=prod"
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-tomcat-service
spec:
  type: NodePort
  selector:
    app: my-tomcat-app
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 30080
```

![[Pasted image 20250904081823.png]]

![[Pasted image 20250904081849.png]]

![[Pasted image 20250904081919.png]]
![[Pasted image 20250904082641.png]]

![[Pasted image 20250904082742.png]]


 **Secret data is printing in logs:**

![[Pasted image 20250904082104.png]]

#### **Creating secret as file:**

`tomcat:10.1-jdk17` image as base, so if we don’t have a server.xml in the repo. But inside the container, Tomcat ships its defaults under /usr/local/tomcat/conf/server.xml so whiile building the image I'm passing the below config value in Dockerfile

```
Add the following config on the Docker file to stop the args displaying in logs
RUN echo "org.apache.catalina.startup.VersionLoggerListener.level = OFF" >> /usr/local/tomcat/conf/logging.properties `
```


```Dockerfile
FROM maven:3.9.4 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM tomcat:10.1-jdk17

#RUN sed -i '/VersionLoggerListener/ s/enabled="true"/enabled="false"/' /usr/local/tomcat/conf/server.xml

RUN echo "org.apache.catalina.startup.VersionLoggerListener.level = OFF" >> /usr/local/tomcat/conf/logging.properties
RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/target/myapp.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
```


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-tomcat-app
  namespace: secret-testing
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-tomcat-app
  template:
    metadata:
      labels:
        app: my-tomcat-app
    spec:
      containers:
        - name: tomcat
          image: iamdevops995/tomcat-app:v4
          ports:
            - containerPort: 8080
          command: ["/bin/sh"]
          args:
            - -c
            - |
              export CATALINA_OPTS="$(cat /opt/java-opts/JAVA_OPTS)"
              echo "CATALINA_OPTS loaded from secret file"
              exec catalina.sh run
          volumeMounts:
            - name: java-opts-volume
              mountPath: /opt/java-opts
              readOnly: true
      volumes:
        - name: java-opts-volume
          secret:
            secretName: java-opts-secret
```


![[Pasted image 20250904221954.png]]

![[Pasted image 20250904221429.png]]
![[Pasted image 20250904222036.png]]

![[Pasted image 20250904221510.png]]

![[Pasted image 20250904222058.png]]

![[Pasted image 20250904221539.png]]
![[Pasted image 20250904223030.png]]
