define(['jquery', 'bootbox', 'jquery.cookie'], function ($, bootbox) {
  "use strict"

  var _Body = $('body')
  var _this

  var _location = document.location.pathname
  var _pathname = _location.length > 1 ? _location.replace(/\/$/, '') : _location

  var onNavigate = []

  var RabbitCMS = function (options) {
    options = $.extend({
      prefix: '/',
    }, options)

    this.prefix = options.prefix || ''

    _this = this

    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': _TOKEN,
      },
    })

    window.onpopstate = function (e) {
      var link = (e.state && e.state.link && e.state.link !== '') ? e.state.link : _pathname

      _this.navigate(link, false)

      return false
    }

    _Body.on('click', '[rel="back"]', function (event) {
      var link = $(this).attr('href')

      if (!_this.canSubmit.check(event))
        return false

      if (history.state !== null)
        history.back()
      else
        _this.navigate(link)

      return false
    })

    _Body.on('click', '[rel="exec"]', (event) => {
      event.preventDefault()
      let self = $(event.currentTarget)
      this.exec(self.data('exec'), self)
    })

    _Body.on('show.bs.modal', '.modal[data-require-lazy]', (e) => {
      _this.loadModule($(e.currentTarget), false)
    })

    _Body.on('show.bs.tab', '.nav-tabs a[data-toggle="tab"]', (e) => {
      let portlet = $(e.currentTarget.hash)
      _this.loadModule(portlet, false)

      let link = `${location.pathname}${e.currentTarget.hash || ''}`
      history.replaceState({link: location.pathname}, null, link)
    })

    _Body.on('click', '[rel="ajax-portlet"]', function (event) {
      var self = $(this)
      var link = self.attr('href')

      if (!_this.canSubmit.check(event))
        return false

      _this.navigate(link)

      return false
    })

    var link = _pathname
    var portlet = $('.ajax-portlet:first')

    _this.cachePortlet(link, portlet, false, document.title, location.hash)
    _this.showPortlet(portlet, false, document.title)

    _this.loadModule(portlet)

    _this.uniform()
    _this.initSidebar()
  }

  RabbitCMS.prototype.getPrefix = function () {
    return this.prefix
  }

  RabbitCMS.prototype._cache = {}

  RabbitCMS.prototype._visiblePortlet = $()

  RabbitCMS.prototype.exec = function exec(module, ...args) {
    let tmp = module.split(':')
    require([tmp[0]], (module) => {
      if (tmp.length === 2)
        module[tmp[1]](...args)
      else
        module(...args)
    })
  }
  /* Portlets and Modals */
  RabbitCMS.prototype.loadModule = function (portlet, recurse) {
    let _module = portlet.data('require') || portlet.data('require-lazy')

    if (_module && !portlet.data('loaded')) {
      portlet.data('loaded', true)
      this.exec(_module, portlet)
    }

    if (recurse !== false) {
      let self = this
      $('[data-require]', portlet).each(function () {
        self.loadModule($(this), false)
      })
    }
  }

  RabbitCMS.prototype.onNavigate = function (cb) {
    onNavigate.push(cb)
  }

  RabbitCMS.prototype.navigate = function (link, pushState, prefix, force) {
    return new Promise((resolve, reject) => {
      if (prefix) {
        link = ('/' + this.prefix + '/' + link).replace(/\/{2,}/, '/')
      }
      link = link.length > 1 ? link.replace(/\/$/, '') : link
      pushState = (pushState === undefined) ? true : pushState

      if (!force && _this._cache[link] !== undefined) {
        var data = _this._cache[link],
          portlet = data.portlet

        _this.cachePortlet(link, portlet, pushState, data.title)
        _this.showPortlet(portlet, false, data.title)
        resolve(portlet)
      } else {
        _this.ajax(link, function (data, status, xhr) {
          var portlet = $(data),
            title = decodeURIComponent(xhr.getResponseHeader('X-Title') || '')

          _this.loadModule(portlet)

          $('.page-content').append(portlet)

          _this.cachePortlet(link, portlet, pushState, title)
          _this.showPortlet(portlet, force, title)
          resolve(portlet)
        })
      }
    })
  }

  RabbitCMS.prototype.cachePortlet = function (link, portlet, pushState, title, hash) {
    this._cache[link] = {portlet, title: title || 'Адміністрування'}

    onNavigate.forEach(function (cb) {
      cb(link)
    })

    if (pushState === false)
      history.replaceState({link: link, title: title}, null, `${link}${hash || ''}`)
    else
      history.pushState({link: link, title: title}, null, `${link}${hash || ''}`)

  }

  RabbitCMS.prototype.showPortlet = function (portlet, force, title) {
    if (this._visiblePortlet === portlet)
      return false

    document.title = title || 'Адміністрування'

    this._visiblePortlet.data('scroll', window.scrollY)

    $('.ajax-portlet:visible').removeClass('show')

    if (portlet.length)
      portlet.addClass('show')

    var _toRemove = _this._visiblePortlet
    $.map(this._cache, (data, link) => {
      if ((force || data.portlet == _toRemove) && data.portlet.data('permanent') === undefined) {
        _toRemove.remove()
        if (data.portlet === _toRemove) {
          delete this._cache[link]
        }
      }
    })

    if (location.hash) {
      portlet.find(`.nav-tabs a[data-toggle="tab"][href="${location.hash}"]`).tab('show')
    } else
      this.dangerMessage('Помилка. RabbitCMS.prototype.showPortlet')

    this._visiblePortlet = portlet
    this.canSubmit.init()
    this.scrollTo(void 0, portlet.data('scroll') || 0)
  }

  RabbitCMS.prototype.loadModalWindow = function (link, callback) {
    _this.ajax(link, function (data) {
      var modal = $(data)
      _this.loadModule(modal)
      $('.page-content').append(modal)

      _this.showModal(modal)

      if ($.isFunction(callback))
        callback(modal)
    })
  }

  RabbitCMS.prototype.showModal = function (modal) {
    $('.ajax-modal').each(function () {
      var self = $(this)

      if (self != modal && self.data('permanent') === undefined)
        self.remove()
    })

    if (modal.length)
      modal.modal()
    else
      this.dangerMessage('Помилка. RabbitCMS.prototype.showModal')
  }


  /* --- --- --- */


  RabbitCMS.prototype.uniform = function (selector) {
    selector = (selector) ? selector : $('input[type="checkbox"]:not(.toggle, .make-switch), input[type="radio"]:not(.toggle, .star, .make-switch)')

    if (selector.size() > 0) {
      $(selector).each(function () {
        $(this).uniform()
      })
    }
  }

  RabbitCMS.prototype.uniformUpdate = function (selector) {
    $.uniform.update(selector)
  }

  RabbitCMS.prototype.dangerMessage = function (message, container) {
    var options = {container: container, type: 'danger', message: message, icon: 'fa-warning'}
    this.message(options)
  }

  RabbitCMS.prototype.message = function (options) {
    options = $.extend(true, {
      container: '',
      place: 'prepend',
      type: 'success',
      message: '',
      close: true,
      reset: true,
      focus: true,
      timeout: 10,
      icon: '',
    }, options)

    var html = $('<div></div>').addClass('rabbit-alert alert alert-' + options.type + ' fade in')
    if (options.close)
      html.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>')

    if (options.icon !== '')
      html.append('<i class="fa-lg fa ' + options.icon + '"></i>  ')

    html.append(options.message)

    if (options.reset)
      $('.rabbit-alert').remove()

    var _container = (!options.container) ? _this._visiblePortlet.find('.portlet-body:first')
      : options.container

    if (options.place == 'append')
      _container.append(html)
    else
      _container.prepend(html)

    if (options.focus)
      this.scrollTo(html)

    if (options.timeout > 0) {
      setTimeout(function () {
        html.remove()
      }, options.timeout * 1000)
    }
  }

  RabbitCMS.prototype.scrollTo = function (element, offeset) {
    var position = (element && element.size() > 0) ? element.offset().top : (offeset || 0)

    if (element) {
      if (_Body.hasClass('page-header-fixed')) {
        position = position - $('.page-header').height()
      }
      position = position + (offeset ? offeset : -1 * element.height())
    }

    $('html, body').animate({scrollTop: position}, 'slow')
  }

  RabbitCMS.prototype.scrollTop = function () {
    this.scrollTo()
  }

  RabbitCMS.prototype.getViewPort = function () {
    var e = window
    var a = 'inner'

    if (!('innerWidth' in window)) {
      a = 'client'
      e = document.documentElement || document.body
    }

    return {width: e[a + 'Width'], height: e[a + 'Height']}
  }

  RabbitCMS.prototype.initSidebar = function () {
    if (Cookies && Cookies('sidebar_closed') === '1' && this.getViewPort().width >= 992) {
      _Body.addClass('page-sidebar-closed')
      $('.page-sidebar-menu').addClass('page-sidebar-menu-closed')
    }

    _Body.on('click', '.sidebar-toggler', function (e) {
      var sidebar = $('.page-sidebar')
      var sidebarMenu = $('.page-sidebar-menu')

      if (_Body.hasClass('page-sidebar-closed')) {
        _Body.removeClass('page-sidebar-closed')
        sidebarMenu.removeClass('page-sidebar-menu-closed')

        if (Cookies)
          Cookies('sidebar_closed', '0')
      } else {
        _Body.addClass('page-sidebar-closed')
        sidebarMenu.addClass('page-sidebar-menu-closed')

        if (_Body.hasClass('page-sidebar-fixed'))
          sidebarMenu.trigger('mouseleave')

        if (Cookies)
          Cookies('sidebar_closed', '1')
      }

      $(window).trigger('resize')
    })

    _Body.on('click', '.page-sidebar-menu > li > a', function (e) {
      var menu = $('.page-sidebar-menu')
      var subMenu = $(this).next('.sub-menu')
      var slideSpeed = parseInt(menu.data("slide-speed"))

      $('.open', menu).find('.arrow').removeClass('open')
      $('.open', menu).find('.sub-menu').slideUp(slideSpeed)
      $('.open', menu).removeClass('open')

      if (subMenu.is(":visible")) {
        $('.arrow', $(this)).removeClass('open')
        $(this).parent('li').removeClass('open')
        subMenu.slideUp(slideSpeed)
      } else {
        $('.arrow', $(this)).addClass('open')
        $(this).parent('li').addClass('open')
        subMenu.slideDown(slideSpeed)
      }

      e.preventDefault()
    })
  }

  RabbitCMS.prototype.blockUI = function (target) {
    var imgPath = '/modules/backend/img/loading-spinner-grey.gif'

    var html = $('<div></div>').addClass('loading-message loading-message-boxed')
    html.append('<img src="' + imgPath + '">')
    html.append('<span>&nbsp;&nbsp;' + ('Завантаження...') + '</span>')

    if (target) {
      var el = $(target)

      el.block({
        message: html,
        baseZ: 1000,
        centerY: (el.height() <= ($(window).height())),
        css: {top: '10%', border: '0', padding: '0', backgroundColor: 'none'},
        overlayCSS: {backgroundColor: '#000', opacity: 0.05, cursor: 'wait'},
      })
    } else {
      $.blockUI({
        message: html,
        baseZ: 1000,
        css: {border: '0', padding: '0', backgroundColor: 'none'},
        overlayCSS: {backgroundColor: '#000', opacity: 0.05, cursor: 'wait'},
      })
    }
  }

  RabbitCMS.prototype.unblockUI = function (target) {
    if (target) {
      $(target).unblock({
        onUnblock: function () {
          $(target).css({position: '', zoom: ''})
        },
      })
    } else
      $.unblockUI()
  }

  RabbitCMS.prototype.canSubmit = {
    init: function () {
      this.form = _this._visiblePortlet.find('form')
      this._match = false

      if (this.form.length)
        this.initData = $('.form-change', this.form).serialize()
    },
    check: function (event) {
      if (this.form.length)
        this.saveData = $('.form-change', this.form).serialize()

      if (this._match === true || !this.form.length || (this.initData === this.saveData))
        return true

      var form = this.form
      var self = this

      bootbox.dialog({
        message: '<h4>Дані було змінено. Зберегти внесені зміни?</h4>',
        closeButton: false,
        buttons: {
          save: {
            label: 'Зберегти',
            className: 'btn-sm btn-success btn-green',
            callback: function () {
              form.submit()
            },
          },
          cancel: {
            label: 'Не зберігати',
            className: 'btn-sm btn-danger',
            callback: function () {
              self._match = true
              $(event.target).trigger(event.type)
            },
          },
          close: {
            label: 'Закрити',
            className: 'btn-sm',
          },
        },
      })

      return false
    },
  }

  /* all ajax methods */
  RabbitCMS.prototype.submitForm = function (form, callback, method) {
    form = (form instanceof jQuery) ? form : $(form)
    let data = new FormData(form[0])
    method && data.append('_method', method)

    _this._ajax({
      url: form.attr('action'),
      method: 'POST',
      processData: false,
      contentType: false,
      data,
    }, function (data) {
      _this.canSubmit._match = true
      $('[rel="back"]:first', _this._visiblePortlet).trigger('click')

      if ($.isFunction(callback))
        callback(data)
    })
  }

  /**
   * @deprecated
   * @param link
   * @param callback
   * @return {*}
   */
  RabbitCMS.prototype.ajax = function (link, callback) {
    return this._ajax({url: link}, callback)
  }

  /**
   * @deprecated
   * @param link
   * @param data
   * @param callback
   * @return {*}
   */
  RabbitCMS.prototype.ajaxPost = function (link, data, callback) {
    var options = {url: link, method: 'POST', data: data}

    return this._ajax(options, callback)
  }

  RabbitCMS.prototype._ajax = function (options, callback, token) {
    var _this = this

    var settings = {
      success: function (data, status, jqXHR) {
        if ($.isFunction(callback))
          callback(data, status, jqXHR)

        _this.unblockUI()
      },
      complete: function (jqXHR) {
        if (jqXHR.status !== 200) {
          setTimeout(function () {
            switch (jqXHR.status) {
              case 202:
              case 418:
                _this.message(jqXHR.responseJSON)
                break
              case 404:
                _this.dangerMessage('Сторінку не знайдено')
                break
              case 403:
                _this.dangerMessage('Доступ заборонено. Зверніться до адміністратора')
                break
              case 401:
                location.reload(true)
                break
              case 422:
                var result = '<ul class="list-unstyled">'
                try {
                  $.each(jqXHR.responseJSON.errors, function (key, value) {
                    console.log(key, value)
                    result += '<li>' + value + '</li>'
                  })
                } catch (message) {
                  result = '<li>' + message + '</li>'
                }
                result += '</ul>'
                _this.message({type: 'danger', message: result})
                break
              case 503:
                var responseText = {}
                try {
                  responseText = $.parseJSON(jqXHR.responseText)
                } catch (message) {
                  responseText.message = message
                }
                _this.dangerMessage('Помилка ' + jqXHR.status + '. ' + responseText.message)
                break
              default:
                _this.dangerMessage('Помилка ' + jqXHR.status + '. ' + jqXHR.statusText)
            }
          }, 100)
        }

        _this.unblockUI()
      },
    }

    if (token === false) {
      settings.xhr = function xhr() {
        // Get new xhr object using default factory
        let xhr = jQuery.ajaxSettings.xhr()
        // Copy the browser's native setRequestHeader method
        let setRequestHeader = xhr.setRequestHeader
        // Replace with a wrapper
        xhr.setRequestHeader = function (name, value) {
          // Ignore the X-Requested-With header
          if (name === 'X-CSRF-TOKEN') return
          // Otherwise call the native setRequestHeader method
          // Note: setRequestHeader requires its 'this' to be the xhr object,
          // which is what 'this' is here when executed.
          setRequestHeader.call(this, name, value)
        }
        // pass it on to jQuery
        return xhr
      }
    }

    options = $.extend(true, settings, options)

    _this.blockUI()
    return $.ajax(options)
  }

  /* Dialogs */
  RabbitCMS.prototype.Dialogs = {
    onDelete: function (link, callback, method) {
      bootbox.dialog({
        message: '<h4>Ви впевнені, що хочете видалити цей запис?</h4>',
        closeButton: false,
        buttons: {
          yes: {
            label: 'Так',
            className: 'btn-sm btn-success',
            callback: function () {
              _this._ajax({url: link, method: method ?? 'POST'}, function () {
                if ($.isFunction(callback))
                  callback()
              })
            },
          },
          no: {
            label: 'Ні',
            className: 'btn-sm btn-danger',
          },
        },
      })
    },
    onConfirm: function (message, callback) {
      bootbox.dialog({
        message: '<h4>' + message + '</h4>',
        closeButton: false,
        buttons: {
          yes: {
            label: 'Так',
            className: 'btn-sm btn-success',
            callback: callback,
          },
          no: {
            label: 'Ні',
            className: 'btn-sm btn-danger',
          },
        },
      })
    },
  }


  /* Tools */
  RabbitCMS.prototype.Tools = {
    transliterate: function (string, spase) {

      spase = spase === undefined ? '-' : spase

      var text = $.trim(string.toLowerCase())
      var result = ''
      var char = ''

      var matrix = {
        'й': 'i', 'ц': 'c', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n',
        'г': 'g', 'ш': 'sh', 'щ': 'shch', 'з': 'z', 'х': 'h', 'ъ': '',
        'ф': 'f', 'ы': 'y', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r',
        'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'ё': 'e',
        'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't',
        'ь': '', 'б': 'b', 'ю': 'yu', 'ү': 'u', 'қ': 'k', 'ғ': 'g',
        'ә': 'e', 'ң': 'n', 'ұ': 'u', 'ө': 'o', 'Һ': 'h', 'һ': 'h',
        'і': 'i', 'ї': 'ji', 'є': 'je', 'ґ': 'g',
        ' ': spase, '_': spase, '`': '', '~': '', '!': '', '@': '',
        '#': '', '$': '', '%': '', '^': '', '&': '', '*': '',
        '(': '', ')': '', '-': spase, '=': '', '+': '', '[': '',
        ']': '', '\\': '', '|': '', '/': '', '.': '', ',': '',
        '{': '', '}': '', '\'': '', '"': '', ';': '', ':': '',
        '?': '', '<': '', '>': '', '№': '',
      }

      for (var i = 0; i < text.length; i++) {
        if (matrix[text[i]] != undefined) {
          if (char != matrix[text[i]] || char != spase) {
            result += matrix[text[i]]
            char = matrix[text[i]]
          }
        } else {
          result += text[i]
          char = text[i]
        }
      }

      return $.trim(result)
    },
  }


  /* MicroEvent */
  var MicroEvent = function (object) {
    Object.keys(object).forEach(function (key) {
      this[key] = object[key]
    }, this)
  }

  MicroEvent.prototype = {
    bind: function (event, fct) {
      this._events = this._events || {}
      this._events[event] = this._events[event] || []
      this._events[event].push(fct)
    },
    unbind: function (event, fct) {
      this._events = this._events || {}
      if (event in this._events === false) return
      this._events[event].splice(this._events[event].indexOf(fct), 1)
    },
    trigger: function (event /* , args... */) {
      this._events = this._events || {}
      if (event in this._events === false) return
      for (var i = 0; i < this._events[event].length; i++) {
        this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    },
  }

  RabbitCMS.prototype.MicroEvent = MicroEvent

  return RabbitCMS
})
