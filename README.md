# Route-Gen

Route-Gen is a Node.js package designed to streamline the routes definition process in React.
It automatically generates routes for [React Router](https://reactrouter.com/en/main) (v6), depending on the file
structure of your project.

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

This command will analyze the project structure (see [Project Structure](#project-structure)) and generate routes accordingly.
After that, wrap your project entrypoint in a `RouteProvider` tag, providing the generated routes as follows.

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
    <RouterProvider router={router}/>
);
```

## Project Structure

Route-Gen relies on a specific project structure to generate routes correctly. The structure is highly inspired by
the [App Router](https://nextjs.org/docs/getting-started/project-structure) of Next.js.

###  Use folders to represents routes

All pages should be put into a parent folder called `pages`.
Here, the folder structure will mirror the generated routes.
For instance, if we plan to have two routes `/books` and `/books/:bookID` we should create the following structure.

```
pages/
  └─ books/
      └─ :bookID/
```

#### Static routes

**Static** routes are the classic routes, like the `/books` one in the previous example, where the route name is fixed in time.
In this case, the folder name exactly mirror the name of the generated route.

#### Dynamic routes

On the other hand, **dynamic** routes are routes that can have a different value depending on the rendered element.
Following the React Router convention, their folder name should have the `:` char as prefix, like the `/books/:bookID` route in the previous example.

### Use files to represent elements 

Each rendered route contains a bunch of elements with a specific meaning

| Element  | Description                                                                  | Required |
|----------|------------------------------------------------------------------------------|----------|
| `page`   | The content of the route view. It should be present in every accepted route. | False    |
| `layout` | The layout wrapping the route page, if any, and its children routes.         | False    |

Each element should be put in a different file, and <u>the name of the file should mirror the name of the component</u>.
To make the generator understand that a file represents a specific element we should end its name with the element name.

For instance, consider the `/books` route of the previous example, and imagine it has both page and layout components.
The resulting structure should be the following.

```
pages/
  └─ books/
      ├─ :bookID/...
      ├─ BooksPage.tsx
      └─ BooksLayout.tsx
```

### Utility folders

A common need of React developers is to split a big component in several sub-components, for better readability and maintainability, that are usually put inside a `components` folder.

Since in our convention each folder would represent a different route, we add the concept of **utility folders**, that is folders not considered in the generated routes tree.
To differentiate them from traditional ones, their name should have the `_` char as prefix.

By enriching the previous examples, the resulting structure is something like that.

```
pages/
  └─ books/
      ├─ _components/...
      ├─ :bookID/...
      ├─ BooksPage.tsx
      └─ BooksLayout.tsx
```

### Structure Example

Here an example of the resulting structure.

```
pages/
  ├─ items/
  │   └─ :itemID/
  │       ├─ _components/...
  │       ├─ _graphql/...
  │       └─ RootPage.tsx
  ├─ menus/
  │   └─ :menuID/
  │       ├─ _components/...
  │       ├─ _graphql/...
  │       └─ RootPage.tsx
  └─ merchants/
      ├─ :merchantID/
      │   ├─ _components/...
      │   ├─ _graphql/...
      │   └─ RootPage.tsx
      ├─ menus/
      │   ├─ _components/...
      │   ├─ _graphql/...
      │   └─ RootPage.tsx
      └─ ItemDetailLayout.tsx
```

## Configuration

To customize Route-Gen's behavior, create a `route-gen.json` file in the root of your project.
Here, you can specify the root of the `pages` directory, which serves as the starting point for generated routes and
where the generated routes will be placed.

Here's the default configuration:

```json
{
  "root": "./src"
}
```

## License

Route-Gen is [MIT Licensed](./LICENSE).


