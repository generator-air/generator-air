const icon = require.context('./icon/', false, /\.svg$/);
const css = require.context('./css/', false, /\.less$/);

const importAll = (requireContext) =>
  requireContext.keys().forEach(requireContext);

importAll(icon);
importAll(css);
