(function ($) {
    var toggle = '[data-toggle="dropmenu"]';

    var DropMenu = function (element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, $.fn.dropmenu.defaults, options, this.$element.data(), this.$element.data('options'));
        this._init();
    }

    DropMenu.prototype = {
        _init: function () {
            this.$element.parent().addClass('dropmenu');
            var header =
                '<div class="dropmenu-header">' +
                '   <span class="dropmenu-title">title</span>' +
                '   <span class="octicon octicon-x header-close" role="button"  aria-label="Close"></span>' +
                '</div>';

            var filter =
                '<div class="dropmenu-filters">' +
                '<div class="dropmenu-filter">' +
                '<input type="text" class="filter-input" placeholder="please input content">' +
                '</div></div>';
            var items = '<div class="dropmenu-items">';
            for (var i = 0; i < this.options.data.length; i++) {
                items += '<div class="dropmenu-item">';
                items += '<span class="item-icon"><span class="' + this.options.data[i].icon + '"></span></span>'
                items += '<span class="item-content"><div class="item-lable">' + this.options.data[i].text + '</div></span>'
                items += '</div>'
            }
            items += '</div>'
            this.$element.parent().append('<div class="dropmenu-panel">' + header + filter + items + '</div>');

            //设置样式
            this._setStyle();
            //注册事件
            this._onListener();
            return this;
        },
        _toggle: function (e) {
            var $this = $(this);
            var $parent = $this.parent();
            var isopen = $parent.hasClass('open');
            DropMenu.prototype._closeMenu(e);
            if (!isopen) {
                if (e.isDefaultPrevented()) return
                $this.trigger('focus').attr('aria-expanded', 'true').addClass('active');
                $parent.toggleClass('open');
            }
            return this;
        },
        _setStyle: function () {
            var $parent = this.$element.parent();
            $parent.find('.dropmenu-panel').width(this.options.width).addClass(this.options.position);
            $parent.find('.dropmenu-title').text(this.options.title);
            $parent.find('.item-content').css({'padding': this.options.padding});
            if (this.options.display == 'selection') {
                if (this.options.showFilter) {
                    $parent.find('.dropmenu-filters').show();
                }
                else {
                    $parent.find('.dropmenu-filters').hide();
                }

                if (this.options.showHeader) {
                    $parent.find('.dropmenu-header').show();
                    //$parent.find('.dropmenu-panel').
                }
                else {
                    $parent.find('.dropmenu-header').hide();
                }
                $parent.find('.dropmenu-item:last-child').css({
                    'border-bottom': 'none',
                    'border-radius': '0 0 4px 4px'
                })

            }

            if (this.options.display == 'navigation') {
                $parent.find('.dropmenu-filters').hide();
                $parent.find('.dropmenu-header').hide();
                $parent.find('.dropmenu-items').css({'padding': '5px 0'})
            }

            if (this.options.fontWeight) {
                $parent.find('.item-lable').css({'font-weight': 'bold'})
            }
            else {
                $parent.find('.item-lable').css({'font-weight': 'normal'})
            }

            if (this.options.showBorder) {
                $parent.find('.dropmenu-item').addClass('dropmenu-item-border');
            }
            else {
                $parent.find('.dropmenu-item').removeClass('dropmenu-item-border');
            }

            if (this.options.showCaret && this.options.position == 'left') {
                $parent.find('.dropmenu-panel').addClass('dropmenu-panel-caret dropmenu-panel-caret-left');
            }
            else if (this.options.showCaret && this.options.position == 'right') {
                $parent.find('.dropmenu-panel').addClass('dropmenu-panel-caret dropmenu-panel-caret-right');
            }
            else {
                $parent.find('.dropmenu-panel').removeClass('dropmenu-panel-caret dropmenu-panel-caret-left dropmenu-panel-caret-right');
            }
            $parent.find('.item-lable').css({'font-size': this.options.fontSize})
            return this;
        },
        _closeMenu: function (e) {
            $(toggle).each(function () {
                var $this = $(this);
                var $parent = $this.parent();
                if (!$parent.hasClass('open')) return;
                //if (e.isDefaultPrevented()) return;

                $this.attr('aria-expanded', 'false').removeClass('active');
                $parent.removeClass('open');
            });
            //清除选中痕迹
            $('.dropmenu-item').each(function () {
                $(this).removeClass('dropmenu-item-selected')
            });
        },
        _closeMenu2: function (e) {
            if ($(e.target).parents(".dropmenu").length > 0
                && !$(e.target).hasClass('header-close')
                && $(e.target).parents(".dropmenu-items").length == 0) {
                return;
            }
            DropMenu.prototype._closeMenu(e);
        },
        _mouseHover: function () {
            var $this = $(this);
            var selected = $('.dropmenu-item').hasClass('dropmenu-item-selected');
            if (selected) {
                $('.dropmenu-item').removeClass('dropmenu-item-selected')
            }
            $this.addClass('dropmenu-item-selected')
        },
        _onListener: function () {
            $('.dropmenu-item').hover(this._mouseHover);
            $(this.$element).on('click.wei.dropmenu', this._toggle)
        }
    }

    var old = $.fn.dropmenu;

    $.fn.dropmenu = function (options, eventArgs) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('dropmenu');

            //检查事件
            if (typeof options == 'string') {
                if (!data) $this.data('dropmenu', (data = new DropMenu(this)));
                if (typeof data[options] != 'undefined') data[options](eventArgs);
            }
            //检查方法
            else {
                if (!data) $this.data('dropmenu', (data = new DropMenu(this, typeof options == 'object' && options)));
            }
        });
    };

    $.fn.dropmenu.defaults = {
        width: '300px',
        title: '标题',
        data: [],
        fontWeight: true,
        fontSize: '12px',
        position: 'left',
        display: 'simple',//complex
        padding: '8px',
        showCaret: false,
        showBorder: true,
        showFilter: false,
        showHeader: true
    };

    $.fn.dropmenu.Constructor = DropMenu;

    $.fn.dropmenu.noConflict = function () {
        $.fn.dropmenu = old;
        return this;
    }

    $(document)
        .on('click.wei.dropmenu', DropMenu.prototype._closeMenu2);
})
(jQuery);
