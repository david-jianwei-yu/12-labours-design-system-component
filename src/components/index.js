import Vue from "vue";
import ElementUI from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import SvgIcon from "vue-svgicon";

import "@/assets/styles.scss";

import BreadcrumbTrail from "./BreadcrumbTrail";
import ContentOverviewCard from "./ContentOverviewCard";
import TwelveLaboursHeader from "./TwelveLaboursHeader";
import TwelveLaboursFooter from "./TwelveLaboursFooter";
import TabNav from "./TabNav";
import Pagination from "./Pagination";
import PaginationMenu from "./PaginationMenu";
import Tooltip from "./Tooltip";
import MultilineText from "./MultilineText";
import CarouselCard from "./CarouselCard";
import Dashboard from "./Dashboard";

import "@/assets/icons";

const Components = {
  BreadcrumbTrail,
  ContentOverviewCard,
  TwelveLaboursHeader,
  TwelveLaboursFooter,
  TabNav,
  Pagination,
  PaginationMenu,
  Tooltip,
  MultilineText,
  CarouselCard,
  Dashboard
};

Object.keys(Components).forEach((component) => {
  Vue.component(component, Components[component]);
});

locale.use(lang);

ElementUI.install(Vue);

Vue.use(SvgIcon, {
  defaultWidth: "1rem",
  defaultHeight: "1rem",
});

export default {
  ElementUI,
  ...Components,
};
