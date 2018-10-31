!function(s,m){"use strict";var a=m.$$minErr("$sanitize");var o,t=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,n=/([^\#-~ |!])/g,r=x("area,br,col,hr,img,wbr"),e=x("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),i=x("rp,rt"),l=m.extend({},i,e),c=m.extend({},e,x("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),d=m.extend({},i,x("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),u=x("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),h=x("script,style"),p=m.extend({},r,c,d,l),f=x("background,cite,href,longdesc,src,xlink:href"),g=x("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),b=x("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",!0),v=m.extend({},f,b,g);function x(e,t){var n,r={},i=e.split(",");for(n=0;n<i.length;n++)r[t?m.lowercase(i[n]):i[n]]=!0;return r}function y(e){for(var t={},n=0,r=e.length;n<r;n++){var i=e[n];t[i.name]=i.value}return t}function k(e){return e.replace(/&/g,"&amp;").replace(t,function(e){return"&#"+(1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320)+65536)+";"}).replace(n,function(e){return"&#"+e.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function w(e,a){var t=!1,o=m.bind(e,e.push);return{start:function(i,e){i=m.lowercase(i),!t&&h[i]&&(t=i),t||!0!==p[i]||(o("<"),o(i),m.forEach(e,function(e,t){var n=m.lowercase(t),r="img"===i&&"src"===n||"background"===n;!0!==v[n]||!0===f[n]&&!a(e,r)||(o(" "),o(t),o('="'),o(k(e)),o('"'))}),o(">"))},end:function(e){e=m.lowercase(e),t||!0!==p[e]||!0===r[e]||(o("</"),o(e),o(">")),e==t&&(t=!1)},chars:function(e){t||o(k(e))}}}function C(e){if(e.nodeType===s.Node.ELEMENT_NODE)for(var t=e.attributes,n=0,r=t.length;n<r;n++){var i=t[n],a=i.name.toLowerCase();"xmlns:ns1"!==a&&0!==a.lastIndexOf("ns1:",0)||(e.removeAttributeNode(i),n--,r--)}var o=e.firstChild;o&&C(o),(o=e.nextSibling)&&C(o)}!function(e){var t;if(!e.document||!e.document.implementation)throw a("noinert","Can't create an inert html document");var n=((t=e.document.implementation.createHTMLDocument("inert")).documentElement||t.getDocumentElement()).getElementsByTagName("body");if(1===n.length)o=n[0];else{var r=t.createElement("html");o=t.createElement("body"),r.appendChild(o),t.appendChild(r)}}(s),m.module("ngSanitize",[]).provider("$sanitize",function(){var t=!1;this.$get=["$$sanitizeUri",function(n){return t&&m.extend(p,u),function(e){var t=[];return function(e,t){null==e?e="":"string"!=typeof e&&(e=""+e),o.innerHTML=e;var n=5;do{if(0===n)throw a("uinput","Failed to sanitize html because the input is unstable");n--,s.document.documentMode&&C(o),e=o.innerHTML,o.innerHTML=e}while(e!==o.innerHTML);for(var r=o.firstChild;r;){switch(r.nodeType){case 1:t.start(r.nodeName.toLowerCase(),y(r.attributes));break;case 3:t.chars(r.textContent)}var i;if(!((i=r.firstChild)||(1==r.nodeType&&t.end(r.nodeName.toLowerCase()),i=r.nextSibling)))for(;null==i&&(r=r.parentNode)!==o;)i=r.nextSibling,1==r.nodeType&&t.end(r.nodeName.toLowerCase());r=i}for(;r=o.firstChild;)o.removeChild(r)}(e,w(t,function(e,t){return!/^unsafe:/.test(n(e,t))})),t.join("")}}],this.enableSvg=function(e){return m.isDefined(e)?(t=e,this):t}}),m.module("ngSanitize").filter("linky",["$sanitize",function(d){var u=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,h=/^mailto:/i,p=m.$$minErr("linky"),f=m.isString;return function(e,r,i){if(null==e||""===e)return e;if(!f(e))throw p("notstring","Expected string but received: {0}",e);for(var t,n,a,o=e,s=[];t=o.match(u);)n=t[0],t[2]||t[4]||(n=(t[3]?"http://":"mailto:")+n),a=t.index,l(o.substr(0,a)),c(n,t[0].replace(h,"")),o=o.substring(a+t[0].length);return l(o),d(s.join(""));function l(e){var t,n;e&&s.push((t=e,w(n=[],m.noop).chars(t),n.join("")))}function c(e,t){var n;if(s.push("<a "),m.isFunction(i)&&(i=i(e)),m.isObject(i))for(n in i)s.push(n+'="'+i[n]+'" ');else i={};!m.isDefined(r)||"target"in i||s.push('target="',r,'" '),s.push('href="',e.replace(/"/g,"&quot;"),'">'),l(t),s.push("</a>")}}}])}(window,window.angular);