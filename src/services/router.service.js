import router from '@/router';

export const routerSecureNavigation = (route, condition = true) => {
  const routeObject = router.resolve(route);

  if (
    routeObject &&
    condition &&
    router.currentRoute.fullPath !== routeObject.href
  ) {
    router.push(routeObject.location);
  }
};
