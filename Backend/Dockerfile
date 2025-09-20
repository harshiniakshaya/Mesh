# Stage 1: Build the application with Maven
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final, lightweight image
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy only the built .jar from the 'build' stage
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]