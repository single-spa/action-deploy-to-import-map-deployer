# Contributing

## Testing

To test, you have to push to a branch and then use it from a different repo:

```yml
- name: Update Import Map
  uses: single-spa/action-deploy-to-import-map-deployer@branchName
```

## Release

Github actions are used via git tags. For non-breaking changes, use the following workflow:

```sh
git tag -f v1 $(git rev-parse HEAD)
git push
git push -f --tags
```
