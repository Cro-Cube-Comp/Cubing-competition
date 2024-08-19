# Cubing competition

Easiest way to host competitions in solving Rubiks cubes

## Server

Path: `./backend`

### Requires

- Nodejs
 
- Bun ( you can get it by installing nodejs and running `npm install -g bun`)

### How to run

If this is first time running this server, run command `bun install`


Command to run the server: `bun start`

Program will give you instructions if some environment variables are missing

## Frontend 

Path: `/build` ( should change to `/frontend` soon)

### Task list

- [] Example

### How to run

This is a static website, so you just have ot host it

You can fork this github repo and github pages will host the website for free if it's a public repository

### Routes

- `/Login`: Page for logging in, it redirects to `/dashboard` if user is admin and `/` otherwise

- `/Register` Admin only page where admins create new users

- `/Scramble` Page where anyone can make Rubiks cube scrambles. It uses [scramble-display](https://github.com/cubing/scramble-display) element to display it

- `/rules` Page where anyone can check the rules of competitions

- `/posts` Admin only page where posts can be made, deleted and edited. Posts are display in `/` ( home page)

- `/dashboard` Admin only page where you can delete users and submit solves to users

- `/competitions` Page where anyone can check results of all locked ( done) competitions 

- `/competitions-dashboard` Admin only page where you can create, delete, edit and lock ( mark them as done) competitions. They show in `/competitions` when they are locked

- `advanced-dashboard` Admin only page where advanced users ( developers) or delegate of a competition can do important things, such as exporting results in excel or changing passwords for users