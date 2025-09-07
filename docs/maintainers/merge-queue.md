# Merge queue

GitHub's merge queue serialises merges to `main` so each change lands with a green build.

## Enable on `main`
1. Navigate to **Settings → Branches** in the repository.
2. Add or edit the protection rule for `main`.
3. Check **Require a pull request before merging** and **Require merge queue**.
4. Under **Require status checks to pass**, add:
   - `CI`
   - `Cross-Platform CI`
   - `require changelog fragment`
5. Save the rule.

The queue will run the listed checks on each candidate commit and merge sequentially once they pass.
