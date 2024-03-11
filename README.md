# Route-Gen

Route-Gen is a Node.js package designed to streamline the routes definition process in React. 
It automatically generates routes for [React Router](https://reactrouter.com/en/main) (v6), depending on the file structure of your project.

## Installation

You can easily install Route-Gen with `npm`:

```bash
npm install --save-dev @m-mrz/route-gen
```

## Usage

Once Route-Gen is installed, you can trigger the routes generation by running the following command:

```bash
route-gen
```

This command will analyze the project structure and generate routes accordingly (see [Project Structure](#project-structure)).
Then, wrap your project entrypoint in a `RouteProvider` tag, providing the generated routes as follows.

```typescript jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { routes } from "../routes"

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
```

## Project Structure

Route-Gen relies on a specific project structure to generate routes correctly. The structure is highly inspired by the [App Router](https://nextjs.org/docs/getting-started/project-structure) of Next.js.

All views should be put into a configurable root folder, by default `src/pages`.
Here, the folder structure mirrors the routes specified in the router.
For instance, if we have two routes `/books` and `/books/:bookID` we will have the following structure.


```
/
 └─ books/
     └─ :bookID/
```

In addition to the children routes folders, each route folder can have a bunch of files with a specific meaning.

| File         | Description                                                                           |
|--------------|---------------------------------------------------------------------------------------|
| page.tsx     | The content of the route view. It should be present in every accepted route.          |
| layout.tsx   | An optional layout component wrapping the route page and its children routes.         |

Additional files related to the route, such as components, are placed in separate folders. To differentiate them from the children routes, those additional folders start with an underscore.

Here an example of the resulting structure.

```
/
├─ items/
│   └─ :itemID/
│       ├─ _components/...
│       ├─ _graphql/...
│       └─ page.tsx
├─ menus/
│   └─ :menuID/
│       ├─ _components/...
│       ├─ _graphql/...
│       └─ page.tsx
└─ merchants/
    ├─ :merchantID/
    │   ├─ _components/...
    │   ├─ _graphql/...
    │   └─ page.tsx
    ├─ menus/
    │   ├─ _components/...
    │   ├─ _graphql/...
    │   └─ page.tsx
    └─ layout.tsx
```

## Configuration

To customize Route-Gen's behavior, create a `route-gen.json` file in the root of your project.
Here, you can specify the root of the routes directory, which serves as the starting point for generated routes and where the generated routes will be placed.

Here's the default configuration:

```json
{
  "root": "src/pages"
}
```

## License

Route-Gen is [MIT Licensed](./LICENSE).


