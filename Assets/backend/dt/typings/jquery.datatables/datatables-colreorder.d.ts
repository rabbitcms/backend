// Type definitions for JQuery DataTables ColReorder extension
// Project: http://datatables.net/extensions/colreorder

/// <reference path="../jquery/index.d.ts" />
/// <reference path="index.d.ts" />

declare namespace DataTables {
    export interface Settings {
        /**
         * ColReorder extension options
         */
        colReorder?: boolean | ColReorderSettings;
    }

    /**
     * ColReorder extension options
     */
    export interface ColReorderSettings {
        /**
         * Number of columns (counting from the left) to disallow reordering of
         */
        fixedColumnsLeft?: number;

        /**
         * Number of columns (counting from the right) to disallow reordering of
         */
        fixedColumnsRight?: number;

        /**
         * An array of integer values that define the order the columns should appear in
         */
        order?: Array<number>;

        /**
         * Defines whether to change the order of the columns during a drag operation
         */
        realtime?: boolean;
    }
}