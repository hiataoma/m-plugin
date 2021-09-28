import xTable from './table/index.js'
import xTableCol from './table-column/index.js'
import sumFunction from './sumFunction/index.js'


const components = [xTable, xTableCol, sumFunction]
const install = function(vue) {
  /* istanbul ignore if */
  if (install.installed) return;
  /*eslint-disable*/
  components.map((component) => {
    vue.component(component.name, component);
  });
};
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export default {
  install,
  xTable,
  xTableCol
}