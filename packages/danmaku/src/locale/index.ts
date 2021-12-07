import { createLocale } from "@lin-media/utils";

import zhLang from "./lang/zh.json";

import enLang from "./lang/en.json";

// export default createLocale({ zhLang, enLang });

function initLocale() {
  return createLocale({ zhLang, enLang });
}

export default initLocale;
