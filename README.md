# CommitLife

Track your life activities in the style of github commit history

## TODO
- [x] Fix dark mode / UI styling
- [x] Improve "Complete today" button, change button when already logged
- [x] Change commits of the past (click event that flips a past day)

- [x] Auth/Login
- [x] Production Database
- [ ] Push to vercel

- [ ] Instead of total activites show "x/ out of N days" ; or longest streak
- [ ] Make title of activities editable


## Sections

### Production Database
we are going to use xata (managed postgres)
1. create the database online
2. create .env and paste postgres connection string
3. update schema.prisma
4. ```pnpx prisma generate && pnpx prisma db push```
5.
