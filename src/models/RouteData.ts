export type RouteData = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | RouteElement;
  children?: undefined | Array<RouteData>;
};

export type RouteElement = {
  name: string;
  path: string;
};
