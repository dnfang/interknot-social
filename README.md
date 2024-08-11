# Inter-Knot Social Network

A social network website made with [Angular 18](https://angular.dev/), [Spring Boot](https://spring.io/projects/spring-boot) and [PostgreSQL 16](https://www.postgresql.org/). This project was made as a proof of concept, bringing the social network aspects to a website format from the action role-playing game [Zenless Zone Zero](https://zenless.hoyoverse.com/en-us/) developed by [Hoyoverse](https://www.hoyoverse.com/en-us).

## Features
- News aggregation and forum network
- Commisions, enabling users to outsource tasks to the community
- Messaging system

![alt text](https://github.com/dnfang/interknot-social/blob/main/dashboard.png "Dashboard png")

  
![alt text](https://github.com/dnfang/interknot-social/blob/main/commissions.png "Commissions png")

  
![alt text](https://github.com/dnfang/interknot-social/blob/main/messages.png "Messages png")

## Development Setup

### Prerequisites
- [Node.js v18.9.1 or newer](https://nodejs.org/en/download/package-manager/current)
- [Angular 18 CLI](https://angular.dev/installation)
- [Java 17 or newer](https://www.oracle.com/au/java/technologies/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Setup Project
Clone the project
```
git clone git@github.com:dnfang/interknot-social.git
```

Create a database in PostgreSQL called `interknot`
```
CREATE DATABASE interknot;
```

Configure [application.properties](application.properties) located in `/backend/src/main/resources/` to the following. If you are hosting the database to a different configuration, change the properties to reflect your configuration.
```
spring.application.name=backend
spring.datasource.url=jdbc:postgresql://localhost:5432/interknot
spring.datasource.username=[username]
spring.datasource.password=[password]
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.error.include-message=always
```

Install the required modules by navigating to the root level of this project (where [package.json](package.json) is located)
```
npm install
```

Start the backend
```
cd backend
gradlew.bat bootRun
```

Start the frontend
```
ng serve
```

The frontend can be accessed at `http://localhost:4200/`.

## License
[MIT](https://opensource.org/licenses/MIT)

This project is not affiliated with [Zenless Zone Zero](https://zenless.hoyoverse.com/en-us/) or [Hoyoverse](https://www.hoyoverse.com/en-us).


