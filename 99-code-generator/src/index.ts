#!/usr/bin/env node
import { program } from "commander";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

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

program.command;
