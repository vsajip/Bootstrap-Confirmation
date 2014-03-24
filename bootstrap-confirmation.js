/* ========================================================================
 * bootstrap-confirmation.js v2.0.0
 * https://github.com/mistic100/Bootstrap-Confirmation
 * ========================================================================
 * Copyright 2013 Nimit Suwannagate <ethaizone@hotmail.com>
 * Copyright 2014 Damien "Mistic" Sorel <http://www.strangeplanet.fr>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) {
  'use strict';

  // Confirmation extends popover.js
  if (!$.fn.popover) throw new Error('Confirmation requires popover.js');

  // CONFIRMATION PUBLIC CLASS DEFINITION
  // ===============================

  var eventBody = false;

  var Confirmation = function (element, options) {
    this.init('confirmation', element, options);

    var that = this;

    // get existing href and target
    if (this.$element.attr('href')) {
      this.options.href = this.$element.attr('href');
      this.$element.removeAttr('href');
      if (this.$element.attr('target')) {
        this.options.target = this.$element.attr('target');
      }
    }

    // cancel original event
    this.$element.on(that.options.trigger, function(e, ack) {
      if (!ack) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    });

    // trigger original event on confirm
    this.$element.on('confirmed.bs.confirmation', function(e) {
      $(this).trigger(that.options.trigger, [true]);
    });

    // manage singleton
    this.$element.on('show.bs.confirmation', function(e) {
      var o = that.options
      if (o.singleton) {
        $(o._all_selector).not(that.$element).confirmation('hide')
      }
    });

    // manage popout
    this.$element.on('shown.bs.confirmation', function(e) {
      var o = that.options;
      if (o.popout && !eventBody) {
        eventBody = $('body').on('click', function (e) {
          if ($(o._all_selector).is(e.target)) return;
          $(o._all_selector).confirmation('hide');

          $('body').off(e);
          eventBody = false;
        });
      }
    });
  }

  Confirmation.DEFAULTS = $.extend({}, $.fn.popover.Constructor.DEFAULTS, {
    placement: 'top',
    title: 'Are you sure?',
    href: false,
    popout: false,
    singleton: false,
    target: '_self',
    onConfirm: $.noop,
    onCancel: $.noop,
    btn: {
      ok: {
        class: 'btn-xs btn-primary',
        icon: 'glyphicon glyphicon-ok',
        label: 'Yes'
      },
      cancel: {
        class: 'btn-xs btn-default',
        icon: 'glyphicon glyphicon-remove',
        label: 'No'
      }
    },
    template:
      '<div class="popover confirmation">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content text-center">'+
          '<div class="btn-group">'+
            '<a class="btn" data-apply="confirmation"></a>'+
            '<a class="btn" data-dismiss="confirmation"></a>'+
          '</div>'+
        '</div>'+
      '</div>'
  });
  
  Confirmation.prototype = $.extend({}, $.fn.popover.Constructor.prototype);

  Confirmation.prototype.constructor = Confirmation;

  Confirmation.prototype.getDefaults = function () {
    return Confirmation.DEFAULTS;
  };

  Confirmation.prototype.setContent = function () {
    var that    = this;
    var $tip    = this.tip();
    var title   = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);

    // configure 'ok' button
    $tip.find('[data-apply="confirmation"]')
      .addClass(this.getBtnOkClass())
      .html(this.getBtnOkLabel())
      .prepend($('<i></i>').addClass(this.getBtnOkIcon()), ' ')
      .off('click')
      .one('click', function(e) {
        that.getOnConfirm.call(that).call(that.$element);
        that.$element.trigger('confirmed.bs.confirmation');
        that.leave(that);
      });

    // add href to confirm button if needed
    if (this.options.href) {
      $tip.find('[data-apply="confirmation"]').attr({
        href: this.options.href,
        target: this.options.target
      });
    }

    // configure 'cancel' button
    $tip.find('[data-dismiss="confirmation"]')
      .addClass(this.getBtnCancelClass())
      .html(this.getBtnCancelLabel())
      .prepend($('<i></i>').addClass(this.getBtnCancelIcon()), ' ')
      .off('click')
      .one('click', function(e) {
        that.getOnCancel.call(that).call(that.$element);
        that.$element.trigger('canceled.bs.confirmation');
        that.leave(that);
      })

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) {
      $tip.find('.popover-title').hide();
    }
  }


  // CONFIRMATION CONFIG GETTERS
  // ===============================

  Confirmation.prototype.getBtnOkClass = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-ok-class')
      || (typeof o.btn.ok.class == 'function' ? o.btn.ok.class.call($e[0]) : o.btn.ok.class);
  }

  Confirmation.prototype.getBtnOkIcon = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-ok-icon')
      || (typeof o.btn.ok.icon == 'function' ? o.btn.ok.icon.call($e[0]) : o.btn.ok.icon);
  }

  Confirmation.prototype.getBtnOkLabel = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-ok-label')
      || (typeof o.btn.ok.label == 'function' ? o.btn.ok.label.call($e[0]) : o.btn.ok.label);
  }

  Confirmation.prototype.getBtnCancelClass = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-cancel-class')
      || (typeof o.btn.cancel.class == 'function' ? o.btn.cancel.class.call($e[0]) : o.btn.cancel.class);
  }

  Confirmation.prototype.getBtnCancelIcon = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-cancel-icon')
      || (typeof o.btn.cancel.icon == 'function' ? o.btn.cancel.icon.call($e[0]) : o.btn.cancel.icon);
  }

  Confirmation.prototype.getBtnCancelLabel = function() {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-btn-cancel-label')
      || (typeof o.btn.cancel.label == 'function' ? o.btn.cancel.label.call($e[0]) : o.btn.cancel.label);
  }

  Confirmation.prototype.getOnConfirm = function() {
    var $e = this.$element;
    var o = this.options;

    if ($e.attr('data-onconfirm')) {
      return getFunctionFromString($e.attr('data-onconfirm'));
    }
    else {
      return o.onConfirm;
    }
  }

  Confirmation.prototype.getOnCancel = function() {
    var $e = this.$element;
    var o = this.options;

    if ($e.attr('data-oncancel')) {
      return getFunctionFromString($e.attr('data-oncancel'));
    }
    else {
      return o.onCancel;
    }
  }

  /*
   * Generates an anonymous function from a function name
   * function name may contain dots (.) to navigate through objects
   * root context is window
   */
  function getFunctionFromString(functionName) {
    var context = window;
    var namespaces = functionName.split(".");
    var func = namespaces.pop();

    for(var i=0; i<namespaces.length; i++) {
      context = context[namespaces[i]];
    }

    return function() {
      context[func].call(this);
    }
  }


  // CONFIRMATION PLUGIN DEFINITION
  // =========================

  var old = $.fn.confirmation;

  $.fn.confirmation = function (option) {
    var options = (typeof option == 'object' && option) || {};
    options._all_selector = this.selector;

    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.confirmation');

      if (!data && option == 'destroy') return;
      if (!data) $this.data('bs.confirmation', (data = new Confirmation(this, options)));
      if (typeof option == 'string') data[option]();
    })
  }

  $.fn.confirmation.Constructor = Confirmation;


  // CONFIRMATION NO CONFLICT
  // ===================

  $.fn.confirmation.noConflict = function () {
    $.fn.confirmation = old;
    return this;
  }

}(jQuery);