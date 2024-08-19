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