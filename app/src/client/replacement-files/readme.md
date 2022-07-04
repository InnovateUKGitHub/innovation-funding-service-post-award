# Replacement Files

In some cases the server side has different needs from a file than client side.
e.g.`apiClient` is different server side from client side
`dev-logger` is different too as it accesses environment variables on the server

In other cases it may be needed just to avoid any pollution of the bundled client with anything on the server.

The files in here are to be swapped for the matching named file at the webpack build stage using a `new NormalModuleReplacementPlugin` in the `webpack.client.js` file;