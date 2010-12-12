/*!
*   ePaginater jQuery Plugin
*   V0.9.9
*   ethagnawl@gmail.com
*   http://ethagnawl.com/ePaginater
*   Copyright 2010, Pete Doherty
*   Date: 12/10/2010 21:19:34 (EST)
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
            point_break: 160
        };
        if (options) {
            $.extend(config, options);
        }
        Array.prototype.jam = function jam() {
            return this.join(' ');
        };
        Object.prototype.chop = function chop () {
            return this.get(0).innerHTML.split(' ');
        };
        if (this.chop().length > config.point_break) {

            //  eBuilder - https://github.com/ethagnawl/eBuilder 
            function eBuilder(e,id,a,c,t,ch){var el=document.createElement(e);if(id){el.id=id;}if(a){for(var key in a){if(a.hasOwnProperty(key)){el.setAttribute([key],a[key]);}}}if(c){el.className=typeof c==='object'&&c.constructor===Array?c.join(' '):c;}if(t){el.appendChild(document.createTextNode(t));}if(ch){if(!ch.length){el.appendChild(ch);}else{for(var i=0;i<ch.length;i+=1){el.appendChild(ch[i]);}}}return el;}

            function insert_pag() {
                var $page = $(eBuilder(div, 'page_' + id));
                $.each(elems, function () {
                    this.appendTo($page);    
                });
                $page.appendTo($wrapper);
                id += 1;
                elems.length = 0;
            }

            function paginater_loop($that, i, el) {
                var this_length = $that.chop().length
                    ,   pl_count = this_length + count
                ;
                inner = $that.chop();
                if (pl_count < config.point_break || pl_count === config.point_break) {
                    elems[elems.length] = $that;
                    count += this_length;
                } else {
                    var slice_point = (this_length + count) - config.point_break
                        ,   new_el = inner.slice(config.point_break - count)
                    ;
                    $that.text(inner.slice(0, config.point_break - count).jam());
                    elems[elems.length] = $that;
                    insert_pag();
                    count = new_el.length;
                    if (count > config.point_break) {
                        while (new_el.length > config.point_break) {
                            var newer_el = new_p.splice(0, config.point_break).jam();
                            elems[elems.length] = $(eBuilder(el, 0, 0, 0, newer_el));
                            insert_pag();                        
                        }
                    }
                    elems[elems.length] = $(eBuilder(el, 0, 0, 0, new_el.jam()));
                }
                if (i + 1 === master_arr.length) {
                    insert_pag();
                }
            }

            function pag_click(that) {
                $(document.getElementById('page_'+that.split('_')[1])).addClass(on);
            }

            function scroll(direction) {
                $wrapper.find(on_class).removeClass(on);
                $(document.getElementById(direction)).addClass(on);
                pag_click(direction);
            }                    

            var button = 'button'
                ,   count = 0
                ,   directional = 'directional'
                ,   directional_class = '.' + directional                
                ,   div = 'div'
                ,   $elem
                ,   elems = []
                ,   els = 'p'
                ,   i
                ,   id = 0
                ,   inner = []
                ,   li = 'li'
                ,   lis = []
                ,   master_arr = []
                ,   mouseover 
                ,   nav_id = 'ePaginater_nav'
                ,   $nav
                ,   off = 'off'
                ,   off_class = '.' + off
                ,   on = 'on'
                ,   on_class = '.' + on
                ,   p = 'p'
                ,   page = 'page'
                ,   pag_prev =  'pag_prev'
                ,   pag_next = 'pag_next'
                ,   $wrapper = this
            ;

            $wrapper.children().each( function (i) {
                paginater_loop($(this), i, this.nodeName);
            });
            
            if ($wrapper.find(div).size() > 1) {
                $(eBuilder('ul', nav_id, 0, 0, 0, [
                    eBuilder(li, 0, 0, 0, 0, 
                        eBuilder(button, pag_prev, 0, directional, '< previous')
                    ), 
                    eBuilder(li, 0, 0, 0, 0, 
                        eBuilder(button, pag_next, 0, directional, 'next >')
                    )
                ])).appendTo(this);
                $nav = $(document.getElementById(nav_id));
                for (i = 0; i < this.find(div).length; i += 1) {
                    lis[lis.length] = $(eBuilder(li, 0, 0, 0, 0, eBuilder(button, 'dot_'+i, 0, 0, i+1))).data(page, true);
                }
            }
            
            $.each(lis, function () {
                $nav.children().last().before(this);
            });
            
            $(lis[0]).find(button).addClass(on);
            
            $(document.getElementById('page_0')).addClass(on);
            
            $(directional_class).hover(
            function () {
                if ($(this).hasClass(directional)) {
                    mouseover = true;
                    $elem = $nav.find(on_class).parent();
                    if ((this.id === pag_prev && $elem.prev().data(page) === undefined) || (this.id === pag_next && $elem.next().data(page) === undefined)) {
                        $(this).addClass(off);
                    }           
                }
            },
            function () {
                if ($(this).hasClass(directional)) {
                    mouseover = false; 
                    $elem = $nav.find(on_class).parent();
                    if ((this.id === pag_prev && $elem.prev().data(page) === undefined) || (this.id === pag_next && $elem.next().data(page) === undefined)) {
                        $(this).removeClass(off);                    
                    }
                }
            });
            
            $nav.delegate(button, 'click', function () {
                var id = this.id
                    ,   scroll_back = $nav.find(on_class).parent().prev().data(page)
                    ,   scroll_fwd = $nav.find(on_class).parent().next().data(page)
                ;
                if (id === pag_prev && scroll_back) {
                    scroll($nav.find(on_class).parent().prev().find(button).attr('id'));
                    if (mouseover) {
                        
                    }
                    if ($nav.find(on_class).parent().index() === 1) {

                    }
                } else if (id === pag_next && scroll_fwd) {
                    scroll($nav.find(on_class).parent().next().find(button).attr('id'));
                    if (mouseover) {

                    }
                    if ($nav.find(on_class).parent().next().is(':last-child')) {

                    }
                } else if ((id === pag_prev && !scroll_back) || (id === pag_next && !scroll_fwd)) {
                    // set mouseover to false and add .off
                    return false;
                } else {
                    $wrapper.find(on_class).removeClass(on);
                    $(this).addClass(on);
                    pag_click(id);
                }
            });
            
            if ($.fn.ellipsify) {
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
