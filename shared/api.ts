/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for /api/explain
 */
export interface ExplainCodeRequest {
  code: string;
}

/**
 * Response type for /api/explain
 */
export interface ExplainCodeResponse {
  explanations: Array<{
    lineNumber: number;
    code: string;
    explanation: string;
  }>;
}
