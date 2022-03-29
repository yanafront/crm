export const registerComponentsGlobaly = (vm) => {
  try {
    // Require base component context
    const requireComponent = require.context(
      '../ui/base/',
      true,
      /[\w-]+\.vue$/
    );

    requireComponent.keys().forEach((filePath) => {
      // Get component config
      const componentConfig = requireComponent(filePath);
      // Get filename from the filePath
      const fileName = filePath.split('/').slice(-1)[0];
      // Remove file extension
      const componentName = fileName.replace(/\.\w+$/, '');
      // Register component globally
      vm.component(componentName, componentConfig.default || componentConfig);
    });
  } catch (err) {
    console.log('Base component registration failed');
    console.error(err);
  }
};
