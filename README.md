# eSports Arena API


## Description

**Arena eSports API** is an API developed with **NestJS** to manage tournaments and players on the Arena eSports platform. It allows you to register new players, create, update and delete tournaments, add players to tournaments, generate random pairings, record competition results and view detailed information about events and participants with filters, sorting and pagination.

## Characteristics

- **Player Management:** Register, update, and delete players.
- **Tournament Management:** Create, update, and delete tournaments.
- **Player Tournament Assignment:** Add and remove players from tournaments.
- **Random Matchmaking:** Create random matchups within a tournament.
- **Results Recording:** Record winner, loser, and scores for each match.
- **Results Query:** Filter by score, sort by ranking, and paginate results.
- **API Documentation:** Swagger interface for exploring and testing endpoints.

## Tabla de Contenidos

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Clone Repository](#clone-repository)
- [Install Dependencies](#install-dependencies)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Usage](#usage)
- [Run Server](#run-server)
- [Access API Documentation](#access-api-documentation)
- [Testing](#testing)
- [Technologies](#technologies)
- [Contribution](#contribution)
- [License](#license)
- [Contact](#contact)

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (for the database)

### Clone the Repository

```bash
git clone https://https://github.com/dalona/eSports-Arena
cd e-sports
```

Configuration
Environment Variables
The project uses environment variables to manage environment-specific and sensitive settings. Create a .env file in the root of the project based on the example file provided.

Create the .env file:`

Copy the example file and rename it:

bash
Copy code
cp .env.example .env
Set variables in .env:
Open the .env file and set the variables according to your environment:

env
Copy code
# Port on which the application will run
PORT=3000

# PostgreSQL database configuration
DB_USER=postgres.pznqqjbjacsknmyemtmf
DB_HOST=aws-0-us-west-1.pooler.supabase.com
DB_PASSWORD=eSports-Arena
DB_DATABASE=postgres
DB_PORT=6543
JWT_SECRET=eSports-Arena

# Swagger configuration (optional)
SWAGGER_PATH=api
Database configuration
Create the Database:
Make sure you have PostgreSQL installed and create a database called arena_esports (or whatever name you specified in .env):

sql
Copy English:code
CREATE DATABASE arena_esports;
Migrations (Optional):
If you use migrations to manage the database schema, run:

bash
Copy code
npm run typeorm migration:run
Note: Make sure you have TypeORM configured correctly in your project.

Usage
Running the Server
To start the server in development mode with Hot Reloading, use:

bash
Copy code
npm run start:dev
To start the server in production mode:

bash
Copy code
npm run build
npm run start:prod
The server will run on the port specified in the .env file (by default, 3000).

Accessing API Documentation
API documentation is available through Swagger. Once the server is up and running, go to:

bash
Copy code
http://localhost:3000/api
There you can explore and test the different API endpoints.

Testing
The project uses Jest to perform unit and end-to-end testing.

Run all tests:

bash
Copy code
npm run test
Run tests in observer mode:

bash
Copy code
npm run test:watch
Generate coverage report:

bash
Copy code
npm run test:cov