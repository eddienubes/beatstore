(this.webpackJsonpbeatstore=this.webpackJsonpbeatstore||[]).push([[14],{430:function(e,t,a){},431:function(e,t,a){},433:function(e,t,a){},503:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),l=a(399),o=(a(92),a(5),a(8),a(59)),r=a(30),i=a(493),s=(a(251),a(25)),u=(a(430),a(56),a(55),a(13),Object(i.a)((function(e){return{flexContainer:{display:"flex",flexWrap:"wrap",justifyContent:"center",paddingTop:"25%"}}})),a(93)),m=a(1),d=a(497),f=a(491),p=a(492),b=a(22),E=a(24),O=a(10),g=(a(431),a(391)),j=a(91);var N=function(){var e=Object(n.useState)(null),t=Object(r.a)(e,2),a=t[0],l=t[1],i=Object(s.c)(),N=Object(s.d)((function(e){return e.beatsReducer})),h=N.info,v=N.isLoadingInfo,k=Object(n.useState)({bpm:null,moods:null,genres:null,tags:null}),x=Object(r.a)(k,2),w=x[0],C=x[1];Object(n.useEffect)((function(){i(Object(O.i)())}),[]);var y=Object(n.useMemo)((function(){return["bpm","moods","genres","tags"]}),[]),A=Object(n.useMemo)((function(){return[[{key:"all1",text:"All BPM"}].concat(Object(o.a)(h.bpms.map((function(e){return{key:e,value:e,text:e}})))),[{key:"all2",text:"All moods"}].concat(Object(o.a)(h.moods.map((function(e,t){return{key:e+t,value:e,text:e}})))),[{key:"all3",text:"All genres"}].concat(Object(o.a)(h.genres.map((function(e,t){return{key:e+t,value:e,text:e}})))),[{key:"all4",text:"All tags"}].concat(Object(o.a)(h.tags.map((function(e,t){return{key:e+t,value:e,text:e}}))))]}),[h]),I=Object(r.a)(A,4),M=I[0],T=I[1],P=I[2],S=I[3],B=function(e,t){for(var a=Object(m.a)(Object(m.a)({},w),{},Object(u.a)({},y[t.tabIndex],t.value?t.value:null)),n=!1,c=0;c<y.length;c++)if(w[y[c]]!==a[y[c]]){n=!0;break}n&&(C((function(e){return a})),i(Object(O.k)(a,Math.floor(window.innerHeight/65))))};return v?c.a.createElement(j.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement(g.a,null),c.a.createElement("div",{className:"filter"},c.a.createElement(f.a,{lg:12,md:12,sm:12,className:"filter-row"},c.a.createElement(p.a,{xl:3,md:4,sm:4,className:"dropdown-col"},c.a.createElement(d.a,{tabIndex:0,onOpen:function(e){return l(1)},onClose:function(e){return l(null)},wrapSelection:!0,icon:c.a.createElement(E.a,{className:"icon",icon:1===a?b.c:b.a}),className:"dropdown-itself",placeholder:"All BPM",fluid:!0,selection:!0,options:M,onChange:B})),c.a.createElement(p.a,{xl:3,md:4,sm:4,className:"dropdown-col"},c.a.createElement(d.a,{tabIndex:1,onOpen:function(e){return l(2)},onClose:function(e){return l(null)},icon:c.a.createElement(E.a,{className:"icon",icon:2===a?b.c:b.a}),className:"dropdown-itself",placeholder:"All moods",fluid:!0,selection:!0,options:T,onChange:B})),c.a.createElement(p.a,{xl:3,md:4,sm:4,className:"dropdown-col"},c.a.createElement(d.a,{tabIndex:2,onOpen:function(e){return l(3)},onClose:function(e){return l(null)},icon:c.a.createElement(E.a,{className:"icon",icon:3===a?b.c:b.a}),className:"dropdown-itself",placeholder:"All genres",fluid:!0,selection:!0,options:P,onChange:B})),c.a.createElement(p.a,{xl:3,md:12,sm:12,className:"dropdown-col"},c.a.createElement(d.a,{tabIndex:3,onOpen:function(e){return l(4)},onClose:function(e){return l(null)},icon:c.a.createElement(E.a,{className:"icon",icon:4===a?b.c:b.a}),className:"dropdown-itself",placeholder:"All tags",fluid:!0,selection:!0,options:S,onChange:B})))))},h=a(72),v=(a(433),a(67)),k=a(12),x=a(355),w=a(15),C=(a(393),function(){var e=Object(n.useState)(null),t=Object(r.a)(e,2),a=t[0],l=t[1],o=Object(n.useState)(null),i=Object(r.a)(o,2),u=i[0],m=i[1],d=Object(s.d)((function(e){return e.audioReducer})),f=d.id,p=d.isPlaying,g=Object(n.useState)(!1),N=Object(r.a)(g,2),C=N[0],y=N[1],A=Object(s.c)(),I=Object(n.useState)(!1),M=Object(r.a)(I,2),T=M[0],P=M[1],S=Object(w.g)(),B=Object(w.i)().id;if(Object(n.useEffect)((function(){if(f&&S.push("/beats/".concat(f)),B){var e=new h.a;y(!0),e.getBeatById(B).then((function(e){var t=e.data;l(t.beat),y(!1)})).catch((function(e){y(!1),m(e)}))}}),[f,B]),!a)return null;if(u)return c.a.createElement(v.a,null);var R="http://ass-server.northeurope.cloudapp.azure.com:80/api/"+a.imgUrl,U=new Date(a.loadTime),D=U.getUTCMonth()+1,F=U.getUTCDate(),L=U.getUTCFullYear()+"/"+D+"/"+F;return c.a.createElement("div",{className:"current-track-container"},C?c.a.createElement(j.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement("div",{className:"img-container-featured"},c.a.createElement("img",{src:R,alt:"featured track image"})),c.a.createElement("div",{className:"content"},c.a.createElement("div",{className:"content-img-container-featured"},c.a.createElement("img",{src:R,alt:"featured track image"}),c.a.createElement("div",{className:"icon-play-container",onClick:function(e){e.stopPropagation(),a.id===f&&p?A(Object(k.d)()):a.id!==f?A(Object(k.b)(a.id)):a.id!==f||p||A(Object(k.c)())}},c.a.createElement(E.a,{className:"icon-play",icon:f===a.id&&p?b.h:b.j}))),c.a.createElement("div",{className:"info"},c.a.createElement("p",{className:"caption"},"CURRENTLY PLAYING TRACK"),c.a.createElement("p",{className:"caption"},"\ud83d\udd52 ",L),c.a.createElement("p",{className:"author"},"\u270d Cherries By"),c.a.createElement("p",{className:"title"},a.title),c.a.createElement("div",{className:"footer"},c.a.createElement("button",{className:"track__to-cart-button",onClick:function(e){e.stopPropagation(),P(!0)}},c.a.createElement(E.a,{icon:b.m})," ADD"),c.a.createElement(x.a,{key:a.id,track:a,buttonClass:"cart_button",show:T,setOpen:P}),c.a.createElement("div",{className:"tags-container"},a.tags.map((function(e,t){if(t<3)return c.a.createElement("p",{key:t+e+a.id,onClick:function(e){e.stopPropagation(),A(Object(k.h)(e.target.innerText)),A(Object(O.k)(void 0,Math.floor(window.innerHeight/65)))}},"#",e)}))))))))}),y=function(){return c.a.createElement(c.a.Fragment,null,c.a.createElement(N,null),c.a.createElement(C,null),c.a.createElement(l.a,{isMain:!1}))};t.default=y}}]);
//# sourceMappingURL=14.b7ed0baa.chunk.js.map