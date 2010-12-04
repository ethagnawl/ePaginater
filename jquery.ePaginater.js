/*!
*   ePaginater jQuery Plugin
*   V0.9
*   ethagnawl@gmail.com
*   http://ethagnawl.com/ePaginater
*   Copyright 2010, Pete Doherty
*   Date: 09/04/2010 21:19:34 (EST)
*
*   ePaginater is distributed under the terms of the GNU General Public License.
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
*   GNU General Public License for more details.
*
*   http://www.gnu.org/licenses/gpl.txt
*/

( function ($) {
    $.fn.ePaginater = function (options) {
        var config = {
            active: this.css('color') || '#666',
            color: $('body').find('a').eq(0).css('color') || '#228fdd',    
            point_break:160
        };
        $.fn.chop = function () {
            return this.get(0).innerHTML.split(' ');
        };
        $.fn.css_bg = function (add) {
            return this.css('background-color', add ? config.active : '')
        };
        $.fn.css_f = function (add) {
            return this.css('color', add ? '#666' : config.color)
        };        
        if (this.chop().length > config.point_break){
            //  eBuilder
            var eBuilder = function eBuilder(e,id,a,c,t,ch){var el=document.createElement(e);if(id){el.id=id}if(a){for(var key in a){if(a.hasOwnProperty(key)){el.setAttribute([key],a[key])}}}if(c){el.className=typeof c==='object'&&c.constructor===Array?c.join(' '):c}if(t){el.appendChild(document.createTextNode(t))}if(ch){if(!ch.length){el.appendChild(ch)}else{for(var i=0;i<ch.length;i+=1){el.appendChild(ch[i])}}}return el}
                ,   a = 'a'
                ,   button = 'button'
                ,   add = 'add'
                ,   count = 0
                ,   div = 'div'
                ,   $elem
                ,   elems = []
                ,   id = 0
                ,   inner = []
                ,   li = 'li'
                ,   lis = []
                ,   master_arr = []
                ,   mouseover 
                ,   $nav = '.nav-dots'
                ,   on = 'on'
                ,   on_class = '.on'
                ,   p = 'p'
                ,   page = 'page'
                ,   pag_prev =  'pag_prev'
                ,   pag_next = 'pag_next'
                ,   $wrapper = this
                ,   jam = function (arr) {
                        return arr.join(' ');
                    }
                ,   insert_pag = function () {
                        var $page = $(eBuilder(div, 'page_'+id));
                        $.each(elems, function () {
                            this.appendTo($page);    
                        });
                        $page.appendTo($wrapper);
                        id++;
                        elems.length = 0;    
                    }
                ,   paginater_loop = function ($that, i) {
                        var this_length = $that.chop().length
                            ,   pl_count = this_length + count
                        ;
                        inner = $that.chop();
                        if (pl_count < config.point_break || pl_count === config.point_break) {
                            elems.push($that);
                            count += this_length;
                        } else {
                            var slice_point = +- ((this_length + count) - config.point_break)
                                ,   new_p = (inner.slice(0)).slice(slice_point)
                            ;
                            $that.text(jam(inner.slice(0, config.point_break - count)));
                            elems.push($that);
                            insert_pag();
                            count = new_p.length;
                            elems.push($(eBuilder(p, '', '', '', jam(new_p))));
                        }
                        if (i + 1 === master_arr.length) {
                            insert_pag();
                        }
                    }
            ;
            $wrapper.find(p).each( function (i) {
                paginater_loop($(this), i);
            });
            if ($wrapper.find(div).size() > 1) {
                $(eBuilder('ul', '', '', $nav.split('.')[1], '', [eBuilder(li, '', '', '', '', eBuilder(button, pag_prev, 0, '', '< previous')), eBuilder(li, '', '', '', '', eBuilder(button, pag_next, 0, '', 'next >'))])).appendTo(this);
                $nav = $($nav);
                for (i = 0; i < this.find(div).length; i++) {
                    lis.push($(eBuilder(li, '', '', '', '', eBuilder(button, 'dot_'+i, 0, '', i+1))).data(page, true));
                }
            }
            $.each(lis, function () {
                $nav.children().last().before(this);
            });
            $nav.find(li).css({float: 'left', 'margin-right': '4px'}); 
            $nav.find(button).css({border: '1px solid #eee', color: config.color, padding: '4px'});
            $(lis[0]).find(button).addClass(on).css_f(add);
            $(document.getElementById('page_0')).addClass(on).show();
            $nav.find(button).hover(
                function () {
                    var $this = $(this);
                    mouseover = true;
                    $elem = $nav.find(on_class).parent();
                    if (this.id === pag_prev || this.id === pag_next) {
                        if (this.id === pag_prev && $elem.prev().data(page)){
                            $this.css_bg(add);
                            $elem.prev().find(button).css_bg(add);
                        }    
                        if (this.id === pag_next && $elem.next().data(page)){
                            $this.css_bg(add);
                            $elem.next().find(button).css_bg(add);
                        }                         
                    } else {
                        if ($this.attr('class') !== on) {
                            $this.css_bg(add);
                        }
                    }
                },
                function () {
                    $elem = $nav.find(on_class).parent();
                    mouseover = false; 
                    $(this).css_bg();
                    if (this.id === pag_prev && $elem.prev().data(page)) {
                        $elem.prev().find(button).css_bg();
                    }
                    if (this.id === pag_next && $elem.next().data(page)) {
                        $elem.next().find(button).css_bg();
                    }
                }            
            );
            $nav.find(button).click( function () {
                var scroll_back = $nav.find(on_class).parent().prev().data(page)
                    ,   scroll_fwd = $nav.find(on_class).parent().next().data(page)
                    ,   pag_click = function (that) {
                            $(document.getElementById('page_'+that.split('_')[1])).addClass(on).show();                                
                    }
                    ,   scroll = function (direction) {
                            $nav.find(on_class).removeClass(on).css('color', config.color);
                            $wrapper.find(on_class).removeClass(on_class).hide();
                            $(document.getElementById(direction)).addClass(on).css_f(add).css_bg();
                            pag_click(direction);
                    }
                ;
                if (this.id === pag_prev) {
                    if (scroll_back) {
                        scroll($nav.find(on_class).parent().prev().find(button).attr('id'));
                        if (mouseover) {
                            $nav.find(on_class).parent().prev().find(button).css_bg(add);
                        }
                        if ($nav.find(on_class).parent().index() === 1) {
                            $(document.getElementById(pag_prev)).css_bg();
                        }
                    }
                } else if (this.id === pag_next) {
                    if (scroll_fwd) {
                        scroll($nav.find(on_class).parent().next().find(button).attr('id'));
                        if (mouseover) {
                            $nav.find(on_class).parent().next().find(button).css_bg(add);
                        }
                        if ($nav.find(on_class).parent().next().is(':last-child')) {
                            $(document.getElementById(pag_next)).css_bg();
                        }
                    } else {
                        $(document.getElementById(pag_next)).css_bg();
                    }
                } else {
                    $nav.find(on_class).removeClass(on).css_f();
                    $wrapper.find(on_class).hide();
                    $(this).addClass(on).css_f(add).css_bg();
                    pag_click(this.id);
                }
            });
            if($.fn.ellipsify){
                $wrapper.find(div).not(':last').each( function () {
                    $(this).find(p).ellipsify({
                        count: config.point_break - 1
                    });
                });
            }
        }    
        return this;
	};
})(jQuery);
