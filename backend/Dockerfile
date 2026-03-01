# ===== Build stage =====
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper + pom first (better caching)
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

# Copy source and build
COPY src src
RUN ./mvnw -DskipTests package

# ===== Run stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]