define(['require', 'exports', 'jquery'], function (require, exports, $) {
  'use strict'
  //Ukrainian phone number.
  $.validator.addMethod('phoneUA', function (a, b) {
    a = a.replace(/(?!^\+)\D/g, '')
    return this.optional(b) || a.length > 8 && a.match(/^(\+?380|0)?[345679]\d\d{3}\d{2}\d{2}$/)
  })
  let language = $('html').prop('lang')
  $.extend($.validator.messages, {
    'phoneUA': language === 'ru'
      ? 'Пожалуйста, введите правильный номер телефона.'
      : 'Будь ласка, введіть правильний номер телефону.',
    'notEqualTo': language === 'ru'
      ? 'Пожалуйста, введите другое значение.'
      : 'Будь ласка, введіть інше значення.',
  })

  function check($form, check) {
    let data = $form.data('form')
    return data && data.split(/\s+/).includes(check)
  }

  function find(object, str, def = null) {
    return object && object.hasOwnProperty(str) ? object[str] : def
  }

  function forms($form, ajax, callback, checkSend = () => true) {
    callback = callback || (() => undefined)
    if (ajax instanceof Function) {
      callback = ajax
      ajax = false
    }
    let lock = false, validator = $form.validate({
      ignore: '',
      highlight(element) {
        $(element).closest('.form-group').addClass('has-error')
      },
      unhighlight(element) {
        $(element).closest('.form-group').removeClass('has-error')
      },
      errorPlacement(error, element) {
        let group = element.closest('.input-group')
        error.insertAfter(group.length ? group : element)
      },
      submitHandler(form) {
        if (lock)
          return
          if (check($form, 'ajax') || ajax !== false) {
            (async () => {
              if (!await checkSend(form)) {
                return
              }
              $.ajax($.extend(true, {
                method: $form.attr('method'),
                url: $form.attr('action'),
                beforeSend() {
                  lock = true
                  RabbitCMS.blockUI($form)
                },
                success(data, status, xhr) {
                  lock = false
                  RabbitCMS.unblockUI($form)
                  if (check($form, 'hide')) {
                    $form.closest('.modal').modal('hide')
                  }
                  if (check($form, 'reset')) {
                    form.reset()
                  }
                  if (check($form, 'back') && history.state !== null) {
                    history.back()
                  }
                  if (check($form, 'redirect')) {
                    setTimeout(() => {
                      RabbitCMS.navigate(data.location)
                    }, 300)
                  }
                  if (xhr.status === 202) {
                    RabbitCMS.message({
                      type: data.type,
                      message: data.message,
                    })
                  }
                  callback(null, data)
                },
                error(response) {
                  lock = false
                  RabbitCMS.unblockUI($form)
                  if (response.status === 422) {
                    let rawErrors = response.responseJSON.errors
                    try {
                      validator.showErrors(Object.keys(rawErrors)
                        .reduce((errors, key) => (Object.assign(Object.assign({}, errors), { [key.split('.').map((v, i) => i === 0 ? v : `[${v}]`).join('')]: rawErrors[key][0] })), {}))
                    } catch (e) {
                    }
                  } else if (response.status === 418) {
                    RabbitCMS.message({
                      type: response.responseJSON.type,
                      message: response.responseJSON.message,
                    })
                  }
                  callback(response.responseJSON)
                },
              }, $form.attr('enctype') === 'multipart/form-data'
                ? {
                  data: new FormData(form),
                  processData: false,
                  contentType: false,
                }
                : {
                  data: $form.serialize(),
                }))
            })()

            return false
          } else {
            if (!checkSend(form)) {
              return false
            }
            form.submit()
          }
      },
    })
  }

  forms.depend = function depend(select, restore = true, onUpdate = () => {
  }) {
    $(select).each(function (i, el) {
      let $select = $(el), cache = {}, $depend = $($select.data('depends')), options = $('[data-depends-id]', $select),
        value = $depend.val(), update = function () {
          cache[value] = $select.val()
          value = $depend.val()
          let count = 0
          options.each((idx, option) => {
            const depends = option.getAttribute('data-depends-id') || ''
            const visible = depends.split(',').indexOf(value) >= 0
            $(option).toggle(visible)
            if (visible)
              count++
          })
          $select.val(restore ? cache[value] : undefined).trigger('change')
          onUpdate($select, count)
        }
      $depend.on('change', update)
      $depend && update()
    })
  }
  forms.delete = (options) => new Promise((resolve, reject) => {
    require('bootbox').dialog({
      message: '<h4>Ви впевнені, що хочете видалити цей запис?</h4>',
      closeButton: false,
      buttons: {
        yes: {
          label: 'Так',
          className: 'btn-sm green',
          callback: () => resolve(RabbitCMS._ajax(options)),
        },
        no: {
          label: 'Ні',
          className: 'btn-sm red',
          callback: () => reject(),
        },
      },
    })
  })
  forms.fill = (form, data) => {
    form.find('input[name],textarea[name],select[name]').each((idx, el) => {
      let $el = $(el), matches = $el.attr('name').match(/^(.*?)(\[(.*)\])?$/), val = find(data, matches[1])
      if (matches[3]) {
        val = find(val, matches[3])
      }
      switch ($el.attr('type')) {
        case 'checkbox':
          $el.prop('checked', !!val)
          break
        case 'radio':
          if ($el.attr('value') == val)
            $el.prop('checked', true)
          break
        default:
          if (typeof (val) === typeof (true)) {
            $el.val(val ? '1' : '0')
          } else {
            $el.val(val)
          }
      }
    })
  }
  return forms
})
