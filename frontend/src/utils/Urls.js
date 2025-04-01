const productionStatus = import.meta.env.VITE_PRODUCTION_STATUS;
export  const BackendUrl = productionStatus === "false" ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL_PROD;
export const FrontendUrl = productionStatus === "false" ? import.meta.env.VITE_FRONTEND_URL : import.meta.env.VITE_FRONTEND_URL_PROD;