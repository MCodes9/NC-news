# Northcoders News API

## Background

I have built an API for the purpose of accessing application data programmatically to mimic the building of a real world backend service (such as reddit). This API uses `Node.js`, `Express.js` and `PostgreSQL` and provides information to the front end application. 

Available endpoints listed below and can be found in the endpoints.json file and by following the link to the hosted version.

***REST APIs:***
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- POST /api/articles/:article_id/comments
- GET /api/users
- DELETE /api/comments/:comment_id

## Link to `Heroku` hosted version:
https://mm-be-nc-news.herokuapp.com/api/articles

## Set-up instructions:

***Installation requirements:***
- Node.js: v17.8.0 or later
- PostgreSQL: v12.10 or later

***Cloning the repository:***
Please follow the instructions below to clone the repository: 
```
$ mkdir <new-directory-name>
$ cd <new-directory-name>
$ git clone https://github.com/MCodes9/NC-news.git
```

### Dependencies: 
To install app and developer dependancies, please run the following command in the terminal: 
```
$ npm install

### Setup and seeding: 

**Dev & Test environments:**
After pulling this repo, in order to connect to the two databases locally, you will need to create two .env files: .env.test and .env.development. Use the following commands in the root directory:

In .env.development, type

```
PGDATABASE=nc_news
```

In .env.test, type

```
PGDATABASE=nc_news_test
```
The .env files will be automatically ignored in the .gitignore file.

**Database setup and seeding:**
Run the following commands to set up and seed the database: 
```
$ npm run setup-dbs
$ npm run seed 


##Testing:
I have used the `jest` framework to test whether the application runs as it is designed to run.



