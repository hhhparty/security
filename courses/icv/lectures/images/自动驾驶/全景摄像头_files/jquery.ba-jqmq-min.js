/*!
 * jQuery Message Queuing - v1.0 - 1/5/2010
 * http://benalman.com/projects/jquery-message-queuing-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,b){var a={delay:100,batch:1,queue:[]};$.jqmq=function(c){var k={},n=$.extend(true,{},a,c),f=n.queue,j=n.paused,m=[],g,d,i,l,e;k.add=function(p,o){return i([p],o)};k.addEach=i=function(o,p){if(o){d=false;f=p?o.concat(f):f.concat(o);j||e()}return l()};k.start=e=function(){j=false;if(l()&&!g&&!m.length){(function o(){var r=n.delay,q=n.batch,p=n.complete,s=n.callback;h();if(!l()){d=true;p&&p.call(k);return}m=f.splice(0,q);if(s&&s.call(k,q===1?m[0]:m)===true){f=m.concat(f);m=[]}if(typeof r==="number"&&r>=0){m=[];g=setTimeout(o,r)}})()}};k.next=function(p){var o=n.complete;if(p){f=m.concat(f)}m=[];if(l()){j||e()}else{if(!d){d=true;o&&o.call(k)}}};k.clear=function(){var o=f;h();f=[];d=true;m=[];return o};k.pause=function(){h();j=true};k.update=function(o){$.extend(n,o)};k.size=l=function(){return f.length};k.indexOf=function(o){return $.inArray(o,f)};function h(){g&&clearTimeout(g);g=b}j||e();return k};$.fn.jqmqAdd=function(d,c){d.add(this.get(),c);return this};$.fn.jqmqAddEach=function(d,c){d.addEach(this.get(),c);return this}})(jQuery);