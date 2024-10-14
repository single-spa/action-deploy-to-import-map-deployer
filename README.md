# action-deploy-to-import-map-deployer

Github action for deploying to import-map-deployer. Note that this action does not upload files to a CDN - it only calls import-map-deployer to update the import map. Uploading files to CDN should be done before using this Github action

## Usage

Add a `uses: single-spa/action-deploy-to-import-map-deployer@v1` step to your Github workflow

### Example PATCH service

[Example repo](https://github.com/react-microfrontends/api/blob/main/.github/workflows/build_and_deploy.yml)

```yml
- name: Update Import Map
  uses: single-spa/action-deploy-to-import-map-deployer@v1
  with:
    host: ${{ secrets.DEPLOYER_HOST }}
    username: ${{ secrets.DEPLOYER_USERNAME }}
    password: ${{ secrets.DEPLOYER_PASSWORD }}
    service-name: "@org-name/${{ github.event.repository.name }}"
    service-url: "https://react.microfrontends.app/${{ github.event.repository.name }}/${{ github.run_id }}/react-mf-${{ github.event.repository.name }}.js"
    service-integrity: sha256-example
```

### Example PATCH import-map

```yml
- name: Update Import Map
  uses: single-spa/action-deploy-to-import-map-deployer@v1
  with:
    host: ${{ secrets.DEPLOYER_HOST }}
    username: ${{ secrets.DEPLOYER_USERNAME }}
    password: ${{ secrets.DEPLOYER_PASSWORD }}
    import-map-path: app.importmap
```

## Inputs

See [action.yml](/action.yml) for a list of all required and optional inputs
