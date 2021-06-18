const pageTemplate: TemplateGenerator = (containerName) => `
    import React from 'react';
    import ${containerName}Container from '../containers/${containerName}Container';

    <${containerName}Container />
`;

const containerTemplate: TemplateGenerator = (componentName) => `
    import React from 'react';
    import ${componentName}Component from '../containers/${componentName}Component';

    <${componentName}Component />
`;

const componentTemplate: TemplateGenerator = (componentName) =>
  `<>${componentName}</>`;
