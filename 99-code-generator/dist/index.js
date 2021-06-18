#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var pageTemplate = function (containerName) { return "\n    import React from 'react';\n    import " + containerName + "Container from '../containers/" + containerName + "Container';\n\n    <" + containerName + "Container />\n"; };
var containerTemplate = function (componentName) { return "\n    import React from 'react';\n    import " + componentName + "Component from '../containers/" + componentName + "Component';\n\n    <" + componentName + "Component />\n"; };
var componentTemplate = function (componentName) {
    return "<>" + componentName + "</>";
};
commander_1.program.command;
