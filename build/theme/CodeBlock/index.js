"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ReferenceCodeBlock_1 = __importDefault(require("../ReferenceCodeBlock"));
const CodeBlock_1 = __importDefault(require("@theme-init/CodeBlock"));
const componentWrapper = (Component) => {
    const WrappedComponent = (props) => {
        if (props.reference) {
            return (react_1.default.createElement(ReferenceCodeBlock_1.default, { ...props }));
        }
        return react_1.default.createElement(CodeBlock_1.default, { ...props });
    };
    return WrappedComponent;
};
module.exports = componentWrapper(CodeBlock_1.default);
//# sourceMappingURL=index.js.map