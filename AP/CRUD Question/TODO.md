# TODO List - CRUD Question Fixes

## Issues Found in src/server.js

### Critical Fixes
- [ ] Fix typo: `primsaclient` → `PrismaClient`
- [ ] Fix variable declaration: `primsa` → `prisma` with `PrismaClient()`
- [ ] Fix typo: `lenght` → `length`
- [ ] Fix syntax error: `Prisma.post(create({` → `prisma.post.create({`
- [ ] Fix assignment: `take - Math.min(...)` → `take = Math.min(...)`
- [ ] Complete the incomplete `where.createAt.gte` code
- [ ] Add missing closing braces for the GET `/posts` endpoint

### Feature Completion
- [ ] Complete GET `/posts` endpoint with:
  - Date filtering (fromDate, toDate)
  - Pagination (skip, take)
  - Sorting (sortBy, order)
- [ ] Add GET `/posts/:id` endpoint (read single post)
- [ ] Add PUT `/posts/:id` endpoint (update post)
- [ ] Add DELETE `/posts/:id` endpoint (delete post)

### Validation & Error Handling
- [ ] Add proper input validation
- [ ] Add error handling for all endpoints

