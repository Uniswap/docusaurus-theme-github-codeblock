"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeReducer = exports.parseReference = void 0;
const url_1 = require("url");
const react_1 = __importStar(require("react"));
const CodeBlock_1 = __importDefault(require("@theme-init/CodeBlock"));
const DEFAULT_LINK_TEXT = 'See full example on GitHub';
const initialFetchResultState = {
    code: 'loading...',
    error: null,
    loading: null,
};
const noteStyle = {
    fontSize: '.9em',
    fontWeight: 600,
    color: '#0E75DD',
    textAlign: 'center',
    paddingBottom: '13px',
    textDecoration: 'underline',
};
/**
 * parses GitHub reference
 * @param {string} ref url to github file
 */
function parseReference(ref) {
    const fullUrl = ref.slice(ref.indexOf('https'), -1);
    const [url, loc] = fullUrl.split('#');
    /**
     * webpack causes failures when it tries to render this page
     */
    const global = globalThis || {};
    if (!global.URL) {
        // @ts-ignore
        global.URL = url_1.URL;
    }
    const [org, repo, blob, branch, ...pathSeg] = new global.URL(url).pathname.split('/').slice(1);
    const [fromLine, toLine] = loc
        ? loc.split('-').map((lineNr) => parseInt(lineNr.slice(1), 10) - 1)
        : [0, Infinity];
    return {
        url: `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${pathSeg.join('/')}`,
        fromLine,
        toLine,
        title: pathSeg.join('/')
    };
}
exports.parseReference = parseReference;
async function fetchCode({ url, fromLine, toLine }, fetchResultStateDispatcher) {
    let res;
    try {
        res = await fetch(url);
    }
    catch (err) {
        return fetchResultStateDispatcher({ type: 'error', value: err });
    }
    if (res.status !== 200) {
        const error = await res.text();
        return fetchResultStateDispatcher({ type: 'error', value: error });
    }
    const body = (await res.text()).split('\n').slice(fromLine, (toLine || fromLine) + 1);
    const preceedingSpace = body.reduce((prev, line) => {
        if (line.length === 0) {
            return prev;
        }
        const spaces = line.match(/^\s+/);
        if (spaces) {
            return Math.min(prev, spaces[0].length);
        }
        return 0;
    }, Infinity);
    return fetchResultStateDispatcher({
        type: 'loaded',
        value: body.map((line) => line.slice(preceedingSpace)).join('\n')
    });
}
function codeReducer(prevState, { type, value }) {
    switch (type) {
        case 'reset': {
            return initialFetchResultState;
        }
        case 'loading': {
            return { ...prevState, loading: true };
        }
        case 'loaded': {
            return { ...prevState, code: value, loading: false };
        }
        case 'error': {
            return { ...prevState, error: value, loading: false };
        }
        default:
            return prevState;
    }
}
exports.codeReducer = codeReducer;
function ReferenceCode(props) {
    var _a, _b, _c, _d, _e, _f, _g;
    const [fetchResultState, fetchResultStateDispatcher] = react_1.useReducer(codeReducer, initialFetchResultState);
    const codeSnippetDetails = parseReference(props.children);
    if (fetchResultState.loading !== false) {
        fetchCode(codeSnippetDetails, fetchResultStateDispatcher);
    }
    const titleMatch = (_a = props.metastring) === null || _a === void 0 ? void 0 : _a.match(/title="(?<title>.*)"/);
    const refLinkMatch = (_b = props.metastring) === null || _b === void 0 ? void 0 : _b.match(/referenceLinkText="(?<referenceLinkText>.*)"/);
    const refLinkText = (_d = (_c = refLinkMatch === null || refLinkMatch === void 0 ? void 0 : refLinkMatch.groups) === null || _c === void 0 ? void 0 : _c.referenceLinkText) !== null && _d !== void 0 ? _d : DEFAULT_LINK_TEXT;
    const customStylingMatch = (_e = props.metastring) === null || _e === void 0 ? void 0 : _e.match(/customStyling/);
    const useCustomStyling = (customStylingMatch === null || customStylingMatch === void 0 ? void 0 : customStylingMatch.length) === 1;
    const noteStyling = (customStylingMatch === null || customStylingMatch === void 0 ? void 0 : customStylingMatch.length) === 1 ? {} : noteStyle;
    const customProps = {
        ...props,
        metastring: ((_f = titleMatch === null || titleMatch === void 0 ? void 0 : titleMatch.groups) === null || _f === void 0 ? void 0 : _f.title)
            ? ` title="${(_g = titleMatch === null || titleMatch === void 0 ? void 0 : titleMatch.groups) === null || _g === void 0 ? void 0 : _g.title}"`
            : ` title="${codeSnippetDetails.title}"`,
        children: initialFetchResultState.code,
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(CodeBlock_1.default, { ...customProps }, fetchResultState.code),
        react_1.default.createElement("div", { style: noteStyling, className: useCustomStyling ? 'github-codeblock-reference-link' : '' },
            react_1.default.createElement("a", { href: props.children, target: "_blank" }, refLinkText))));
}
exports.default = ReferenceCode;
//# sourceMappingURL=index.js.map