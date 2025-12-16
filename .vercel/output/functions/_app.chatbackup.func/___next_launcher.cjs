"use strict";

// src/vercel-request-context.ts
var SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
function getContext() {
  const fromSymbol = globalThis;
  return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
}

// src/next-request-context.ts
var import_async_hooks = require("async_hooks");
var name = "@next/request-context";
var NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for(name);
var INTERNAL_STORAGE_FIELD_SYMBOL = Symbol.for("internal.storage");
function getOrCreateContextSingleton() {
  const _globalThis = globalThis;
  if (!_globalThis[NEXT_REQUEST_CONTEXT_SYMBOL]) {
    const storage = new import_async_hooks.AsyncLocalStorage();
    const Context = {
      get: () => storage.getStore(),
      [INTERNAL_STORAGE_FIELD_SYMBOL]: storage
    };
    _globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = Context;
  }
  return _globalThis[NEXT_REQUEST_CONTEXT_SYMBOL];
}
var NextRequestContext = getOrCreateContextSingleton();
function withNextRequestContext(value, callback) {
  const storage = NextRequestContext[INTERNAL_STORAGE_FIELD_SYMBOL];
  return storage.run(value, callback);
}

// src/server-launcher.ts
process.chdir(__dirname);
var region = process.env.VERCEL_REGION || process.env.NOW_REGION;
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = region === "dev1" ? "development" : "production";
}
if (process.env.NODE_ENV !== "production" && region !== "dev1") {
  console.warn(
    `Warning: NODE_ENV was incorrectly set to "${process.env.NODE_ENV}", this value is being overridden to "production"`
  );
  process.env.NODE_ENV = "production";
}
// @preserve pre-next-server-target
var NextServer = require("next/dist/server/next-server.js").default;
// @preserve next-server-preload-target
const conf = {"env":{},"eslint":{"ignoreDuringBuilds":false},"typescript":{"ignoreBuildErrors":false,"tsconfigPath":"tsconfig.json"},"distDir":".next","cleanDistDir":true,"assetPrefix":"","configOrigin":"next.config.js","useFileSystemPublicRoutes":true,"generateEtags":true,"pageExtensions":["tsx","ts","jsx","js"],"poweredByHeader":false,"compress":false,"analyticsId":"","images":{"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","loaderFile":"","domains":[],"disableStaticImages":false,"minimumCacheTTL":60,"formats":["image/webp"],"dangerouslyAllowSVG":false,"contentSecurityPolicy":"script-src 'none'; frame-src 'none'; sandbox;","contentDispositionType":"inline","remotePatterns":[],"unoptimized":false},"devIndicators":{"buildActivity":true,"buildActivityPosition":"bottom-right"},"onDemandEntries":{"maxInactiveAge":60000,"pagesBufferLength":5},"amp":{"canonicalBase":""},"basePath":"","sassOptions":{},"trailingSlash":false,"i18n":null,"productionBrowserSourceMaps":false,"optimizeFonts":true,"excludeDefaultMomentLocales":true,"serverRuntimeConfig":{},"publicRuntimeConfig":{},"reactProductionProfiling":false,"reactStrictMode":true,"httpAgentOptions":{"keepAlive":true},"outputFileTracing":true,"staticPageGenerationTimeout":60,"swcMinify":true,"modularizeImports":{"@mui/icons-material":{"transform":"@mui/icons-material/{{member}}"},"date-fns":{"transform":"date-fns/{{member}}"},"lodash":{"transform":"lodash/{{member}}"},"lodash-es":{"transform":"lodash-es/{{member}}"},"ramda":{"transform":"ramda/es/{{member}}"},"react-bootstrap":{"transform":{"useAccordionButton":"modularize-import-loader?name=useAccordionButton&from=named&as=default!react-bootstrap/AccordionButton","*":"react-bootstrap/{{member}}"}},"antd":{"transform":"antd/lib/{{kebabCase member}}"},"ahooks":{"transform":{"createUpdateEffect":"modularize-import-loader?name=createUpdateEffect&from=named&as=default!ahooks/es/createUpdateEffect","*":"ahooks/es/{{member}}"}},"@ant-design/icons":{"transform":{"IconProvider":"modularize-import-loader?name=IconProvider&from=named&as=default!@ant-design/icons","createFromIconfontCN":"@ant-design/icons/es/components/IconFont","getTwoToneColor":"modularize-import-loader?name=getTwoToneColor&from=named&as=default!@ant-design/icons/es/components/twoTonePrimaryColor","setTwoToneColor":"modularize-import-loader?name=setTwoToneColor&from=named&as=default!@ant-design/icons/es/components/twoTonePrimaryColor","*":"@ant-design/icons/lib/icons/{{member}}"}},"next/server":{"transform":"next/dist/server/web/exports/{{ kebabCase member }}"}},"experimental":{"serverMinification":true,"serverSourceMaps":false,"caseSensitiveRoutes":false,"useDeploymentId":false,"useDeploymentIdServerActions":false,"clientRouterFilter":true,"clientRouterFilterRedirects":false,"fetchCacheKeyPrefix":"","middlewarePrefetch":"flexible","optimisticClientCache":true,"manualClientBasePath":false,"cpus":3,"memoryBasedWorkersCount":false,"isrFlushToDisk":true,"workerThreads":false,"optimizeCss":false,"nextScriptWorkers":false,"scrollRestoration":false,"externalDir":false,"disableOptimizedLoading":false,"gzipSize":true,"craCompat":false,"esmExternals":true,"isrMemoryCacheSize":52428800,"fullySpecified":false,"outputFileTracingRoot":"C:\\Users\\inder mohan singh\\divine99acres_web","swcTraceProfiling":false,"forceSwcTransforms":false,"largePageDataBytes":128000,"adjustFontFallbacks":false,"adjustFontFallbacksWithSizeAdjust":false,"typedRoutes":false,"instrumentationHook":false,"bundlePagesExternals":false,"optimizePackageImports":["lucide-react","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","recharts","@material-ui/core","react-use","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"],"trustHostHeader":true,"isExperimentalCompile":false},"configFileName":"next.config.js"};
var nextServer = new NextServer({
  conf,
  dir: ".",
  minimalMode: true,
  customServer: false
});
var serve = (handler) => async (req, res) => {
  const vercelContext = getContext();
  await withNextRequestContext({ waitUntil: vercelContext.waitUntil }, () => {
    // @preserve entryDirectory handler
    return handler(req, res);
  });
};
module.exports = serve(nextServer.getRequestHandler());
if ((conf.experimental?.ppr || conf.experimental?.cacheComponents) && "getRequestHandlerWithMetadata" in nextServer && typeof nextServer.getRequestHandlerWithMetadata === "function") {
  module.exports.getRequestHandlerWithMetadata = (metadata) => serve(nextServer.getRequestHandlerWithMetadata(metadata));
}
if (process.env.NEXT_PRIVATE_PRELOAD_ENTRIES) {
  module.exports.preload = nextServer.unstable_preloadEntries.bind(nextServer);
}
