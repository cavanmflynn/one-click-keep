import Container from 'typedi';
import Vue, { PluginFunction } from 'vue';

/**
 * Decorates a TypeDI service and injects it into the `Vue` prototype as a plugin
 * NOTE: This decorator must be placed after TypeDI's `@Service` decorator.
 * @param pluginName The name of the plugin (accessible on the `Vue` prototype
 * at `Vue.$pluginName`)
 */
export function PluggableService(
  pluginName: string,
  reactive = false,
): ClassDecorator {
  return (target) => {
    const install: PluginFunction<void> = (VueInst) => {
      // Define getter as global property or instance property.
      Object.defineProperty(
        reactive ? VueInst : VueInst.prototype,
        `$${pluginName}`,
        {
          get: () => Container.get(target),
          configurable: true,
        },
      );

      // If the service should be reactive, define an instance getter pointing
      // to the reactive global.
      if (reactive) {
        Object.defineProperty(VueInst.prototype, `$${pluginName}`, {
          get: () => VueInst[`$${pluginName}`],
          configurable: true,
        });
      }
    };

    Vue.use(install);
  };
}
