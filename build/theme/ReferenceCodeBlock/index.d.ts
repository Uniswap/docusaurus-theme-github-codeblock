import type { ReferenceCodeBlockProps, GitHubReference, DispatchMessage } from '../types';
/**
 * parses GitHub reference
 * @param {string} ref url to github file
 */
export declare function parseReference(ref: string): GitHubReference;
export declare function codeReducer(prevState: any, { type, value }: DispatchMessage): any;
declare function ReferenceCode(props: ReferenceCodeBlockProps): JSX.Element;
export default ReferenceCode;
//# sourceMappingURL=index.d.ts.map