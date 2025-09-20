docker network create postgres-cluster


docker-compose -f docker-compose-db.yml up -d


Application (.env) URI:
DATABASE_URI=postgresql://postgres:postgres@postgres:5432/mydatabase

table app:-
postgresql://postgres:postgres@localhost:5432/mydatabase

** --- run this in main project**
npx drizzle-kit generate
npx drizzle-kit push 