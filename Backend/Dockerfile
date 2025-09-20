# Stage 1: The Builder
FROM maven:3.9.7-sapmachine-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests   # or -Dmaven.test.skip=true if you still have test compilation issues

# Stage 2: The Runner (use same Java version)
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
