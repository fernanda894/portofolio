import { lazy } from "react";
import { PROJECT_META_BY_SLUG } from "../data/projectMeta";

const PROJECT_DETAIL_COMPONENTS = {
  "luxury-restaurant": lazy(() => import("./LuxuryRestaurantDetail")),
  "diabetes-classification": lazy(() => import("./DiabetesClassificationDetail")),
  leadsup: lazy(() => import("./LeadsUpDetail")),

  // GANTI INI
  "smk-negeri-2-karanganyar": lazy(() => import("./PolsekRembangDetail")),

  floodsegmen: lazy(() => import("./FloodSegmenDetail")),
  qmeal: lazy(() => import("./QMealDetail")),
  lostandfound: lazy(() => import("./LostAndFoundDetail")),
  imageclas: lazy(() => import("./ImageClasDetail")),
  "financial-assistant-bot": lazy(() => import("./FinancialAssistantDetail")),
};

export function getProjectRouteConfig(slug) {
  const metadata = PROJECT_META_BY_SLUG[slug];
  if (!metadata) return null;

  return {
    ...metadata,
    Component: PROJECT_DETAIL_COMPONENTS[slug],
  };
}