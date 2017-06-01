/// <reference path="../dt/index.d.ts" />

import * as $ from "jquery";
import "jquery.backstretch";
import "jquery.validation";
import {RabbitCMS} from "rabbitcms/backend";
import {Form} from "rabbitcms/form";

export function init(portlet: JQuery) {
    let imgPath = RabbitCMS.getAssetsPath() + '/img/bg/';
    let images = [imgPath + '1.jpg', imgPath + '2.jpg', imgPath + '3.jpg', imgPath + '4.jpg'];

    $.backstretch(images, {fade: 1000, duration: 8000});

    let form = $('form', portlet);

    new Form(form, {
        ajax: false,
        completeSubmit: (data) => {
            return true;
        }
    });
}