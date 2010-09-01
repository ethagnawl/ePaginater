(function ($) {
    $.fn.ePaginater = function (options) {
        var config = {
            active: this.css('color'),
            color: $('body').find('a').eq(0).css('color'),    
            point_break:160
        };
        $.fn.chop = function () {
            return this.get(0).innerHTML.split(' ');
        }
        $.fn.css_bg = function (add) {
            return this.css('background-color', add ? config.active : '')
        }
        $.fn.css_f = function (add) {
            return this.css('color', add ? '#666' : config.color)
        }        
        if (this.chop().length > config.point_break){
            //  MyBuilder
            var MyBuilder={make:function(node,id,attributes,classname,text,childs){element=document.createElement(node);if(id){element.id=id;}if(attributes){for(var key in attributes){if(attributes.hasOwnProperty(key)){element.setAttribute([key],attributes[key]);}}}if(classname){typeof classname==='object'?element.className=classname.join(' '): element.className=classname;}if(text){element.appendChild(document.createTextNode(text));}if(childs){if(!childs.length){element.appendChild(childs);}else{for(var i=0;i<childs.length;i++){element.appendChild(childs[i]);}}}return element;}}
                ,   a = 'a' 
                ,   count = 0
                ,   div = 'div'
                ,   $elem
                ,   elems = []
                ,   id = 0
                ,   inner = []
                ,   js_link = { href:'javascript:void(0);' }
                ,   li = 'li'
                ,   lis = []
                ,   master_arr = []
                ,   mouseover 
                ,   $nav = '.nav-dots'
                ,   on = 'on'
                ,   on_class = '.on'
                ,   p = 'p'
                ,   page = 'page'
                ,   $wrapper = this
                ,   jam = function (arr) {
                        return arr.join(' ');
                    }
                ,   insert_pag = function () {
                        var $page = $(MyBuilder.make(div, 'page_'+id));
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
                            var new_p = (inner.slice(0)).slice(slice_point)
                                ,   slice_point = +- ((this_length + count) - config.point_break)
                            ;
                            $that.text(jam(inner.slice(0, config.point_break - count)));
                            elems.push($that);
                            insert_pag();
                            count = new_p.length;
                            elems.push($(MyBuilder.make(p, '', '', '', jam(new_p))));
                        }
                        if (i + 1 === master_arr.length) insert_pag();
                    }
            ;
            $wrapper.find(p).each( function (i) {
                paginater_loop($(this), i);
            });
            if ($wrapper.find(div).size() > 1) {
                $(MyBuilder.make('ul', '', '', $nav.split('.')[1], '', [MyBuilder.make(li, '', '', '', '', MyBuilder.make(a, 'pag_prev', js_link, '', '< previous')), MyBuilder.make(li, '', '', '', '', MyBuilder.make(a, 'pag_next', js_link, '', 'next >'))])).appendTo(this);
                $nav = $($nav)
                for (i = 0; i < this.find(div).length; i++) {
                    lis.push($(MyBuilder.make(li, '', '', '', '', MyBuilder.make(a, 'dot_'+i, js_link, '', i+1))).data(page, true));
                }
            }
            $.each(lis, function () {
                $nav.children().last().before(this);
            });
            $nav.find(li).css({'float':'left', 'margin-right': '4px'})    
            $nav.find(a).css({'border': '1px solid #eee', 'color': config.color, 'padding': '4px'});
            $(lis[0]).find(a).addClass(on).css('color', '#666');
            $('#page_0').addClass(on).show();
            $nav.find(a).hover(
                function() {
                    mouseover = true;
                    $elem = $nav.find(on_class).parent();
                    if (this.id === 'pag_prev' || this.id === 'pag_next') {
                            if (this.id === 'pag_prev' && $elem.prev().data(page)){
                                $(this).css_bg('add');
                                $elem.prev().find(a).css_bg('add');
                            }    
                            if (this.id === 'pag_next' && $elem.next().data(page)){
                                $(this).css_bg('add');
                                $elem.next().find(a).css_bg('add');
                            }                         
                    } else {
                            if ($(this).attr('class') !== 'on'){
                                $(this).css_bg('add');
                            }                    
                    }
                },
                function () {
                    $elem = $nav.find(on_class).parent();
                    mouseover = false; 
                    $(this).css_bg();
                    if (this.id === 'pag_prev' && $elem.prev().data(page)) $elem.prev().find(a).css_bg();
                    if (this.id === 'pag_next' && $elem.next().data(page)) $elem.next().find(a).css_bg();
                }            
            );
            $nav.find(a).click( function () {
                var scroll_back = $nav.find(on_class).parent().prev().data(page)
                    ,   scroll_fwd = $nav.find(on_class).parent().next().data(page)
                    ,   pag_click = function(that){
                            $(document.getElementById('page_'+that.split('_')[1])).addClass(on).show();                                
                    }
                    ,   scroll = function (direction) {
                            $nav.find(on_class).removeClass(on).css('color', config.color);
                            $wrapper.find(on_class).removeClass(on_class).hide();
                            $(document.getElementById(direction)).addClass(on).css_f('add').css_bg();
                            pag_click(direction);
                    }
                ;
                if (this.id === 'pag_prev') {
                    if (scroll_back){
                        scroll($nav.find(on_class).parent().prev().find(a).attr('id'));
                        if (mouseover) $nav.find(on_class).parent().prev().find(a).css_bg('add');
                        if ($nav.find(on_class).parent().index() === 1) $('#pag_prev').css_bg();
                    }
                } else if (this.id === 'pag_next') {
                    if (scroll_fwd){
                        scroll($nav.find(on_class).parent().next().find(a).attr('id'));
                        if (mouseover) $nav.find(on_class).parent().next().find(a).css_bg('add');
                        if ($nav.find(on_class).parent().next().is(':last-child')) $('#pag_next').css_bg();
                    } else {
                        $('#pag_next').css_bg();
                    }
                } else {
                    $nav.find(on_class).removeClass(on).css_f();
                    $wrapper.find(on_class).hide();
                    $(this).addClass(on).css_f('add').css_bg();
                    pag_click(this.id);
                }
            });
            if($.fn.ellipsify){
                $wrapper.find(div).not(':last').each( function () {
                    $(this).find(p).ellipsify({
                        count: config.point_break - 1,
                    });
                });
            }
        }    
    	return this;
	};
})(jQuery);
