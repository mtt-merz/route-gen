# Route-Gen

Route-Gen is a Node package designed to streamline the process of generating routes for React Router based on the file structure of your project. By following a specific project structure, Route-Gen automatically generates route configurations, allowing for easier navigation within your React application.

## Installation

You can install Route-Gen using npm or pnpm:

```bash
npm install @m-mrz/route-gen
```

```bash
pnpm install @m-mrz/route-gen
```

## Usage

Once Route-Gen is installed, you can start the routes generation by running the following command:

```bash
route-gen
```

This command will analyze the project structure and generate routes accordingly.

## Project Structure

Route-Gen relies on a specific project structure to generate routes correctly. The structure is inspired by the routing structure of Next.js.

All views should be put in the `src/app` folder. The folder structure within `src/app` mirrors the routes specified in the router. For instance, if we have two routes `/menus` and `/menus/:menuID` we will have the following structure.


```
app/
 └─ menus/
     └─ :menuID/
```

Each folder contains, in addition to the children routes folders, a bunch of files with a specific meaning.

| File         | Description                                                                           |
|--------------|---------------------------------------------------------------------------------------|
| page.tsx     | The content of the route view. It should be present in every accepted route.          |
| layout.tsx   | An optional layout component wrapping the route page and its children routes.         |

Additional files related to the route, such as components and GraphQL files, are placed in separate folders. To differentiate them from the folders representing children routes, those additional folders start with an underscore.

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


Here an example of the resulting structure.

## Configuration


To customize Route-Gen's behavior, create a `route-gen.json` file in the root of your project.
Here, developers can specify the root of the routes directory, which serves as the starting point for generated routes and where the generated routes will be placed.

Here's the default configuration:

```json
{
  "root": "src/app"
}
```