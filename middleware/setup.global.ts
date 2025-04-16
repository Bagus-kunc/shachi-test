export default defineNuxtRouteMiddleware((to, from) => {
  const allowPaths = ['spin']

  console.log(to.name)

  if (allowPaths.some((path) => !to.path.includes(path)) && to.name !== 'top') {
    return abortNavigation()
  }
})
