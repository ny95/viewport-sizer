/**
 * Type definitions for viewport-sizer
 */

/** Options for resizing the viewport */
export interface ResizeOptions {
    width?: number;
    height?: number;
}

/** Resize the viewport to specified dimensions */
export function resize(options?: ResizeOptions): void;
