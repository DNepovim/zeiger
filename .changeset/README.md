# Changesets

This directory contains changeset files that describe changes to be released.

## Creating a Changeset

To create a new changeset, run:

```bash
pnpm changeset
```

This will:

1. Ask which packages you want to include
2. Ask what type of change (patch, minor, major)
3. Ask for a description of the change
4. Create a changeset file in this directory

## Versioning

After creating changeset files, run:

```bash
pnpm changeset:version
```

This will:

1. Consume all changeset files
2. Update package versions based on the changesets
3. Update CHANGELOG.md files
4. Delete the consumed changeset files

## Workflow

1. Make your code changes
2. Run `pnpm changeset` to create a changeset file
3. Commit the changeset file along with your code changes
4. When ready to release, run `pnpm changeset:version`
5. Review and commit the version bumps and changelogs
6. Run `pnpm changeset:release` to publish
