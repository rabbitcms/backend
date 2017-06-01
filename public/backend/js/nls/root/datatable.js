define(["require", "exports"], function (require, exports) {
    "use strict";
    return {
        groupActions: "_TOTAL_ records selected:  ",
        ajaxRequestGeneralError: "Could not complete request. Please check your internet connection",
        dataTable: {
            // data tables spesific
            lengthMenu: "<span class='seperator'>|</span>View _MENU_ records",
            info: "<span class='seperator'>|</span>Found total _TOTAL_ records",
            infoEmpty: "<span class='seperator'>|</span>No records found to show",
            infoFiltered: "(Filtered from _MAX_ total entries)",
            emptyTable: "No data available in table",
            zeroRecords: "No matching records found",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Prev",
                page: "Page",
                pageOf: "of"
            },
            buttons: {
                colvis: 'Column visibility'
            }
        }
    };
});
//# sourceMappingURL=datatable.js.map