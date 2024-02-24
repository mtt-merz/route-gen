# Project structure

The following structure is highly inspired by the [app router](https://nextjs.org/docs/app/building-your-application/routing) structure of Next.js.

All the views are put into the `src/app` folder. The repository structure of this folder should mirror the routes specified in the router. For instance, if we have two routes `/menus` and `/menus/:menuID` we will have the following structure.

```
src/
 ├─ app/
 │   └─ menus/
 │       └─ :menuID/
 └─ ...
```

Each folder contains, in addition to the children routes folders, a bunch of files with a specific meaning.

| File         | Description                                                                           |
|--------------|---------------------------------------------------------------------------------------|
| page.tsx     | The actual content of the route view. It should be present in every accepted route.   |
| layout.tsx   | An optional layout component wrapping the route page and all the children ones        |

Additional files useful for that route, like components and graphql files, are put into separate folders. To differentiate them from the folders representing children routes, those additional folders start with an underscore.

Here an example of the resulting structure.

```
app\
├─ items\
│   └─ :itemID\
│       ├─ _components\...
│       ├─ _graphql\...
│       └─ page.tsx
├─ menus\
│   └─ :menuID\
│       ├─ _components\...
│       ├─ _graphql\...
│       └─ page.tsx
└─ merchants\
└─ :merchantID\
├─ items\
│   ├─ _components\...
│   ├─ _graphql\...
│   └─ page.tsx
├─ menus\
│   ├─ _components\...
│   ├─ _graphql\...
│   └─ page.tsx
└─ layout.tsx
```