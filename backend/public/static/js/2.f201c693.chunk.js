(this.webpackJsonpbeatstore=this.webpackJsonpbeatstore||[]).push([[2],{355:function(e,t,a){"use strict";var n=a(0),c=a.n(n),r=(a(426),a(491)),i=a(492),s=a(501),l=a(506),o=a(472),m=a(22),u=a(24),d=a(25),p=a(91),b=a(12),E=a(427),g=a(15),f=function(e){var t=e.trackId,a=e.price,n=e.licenseType,r=e.setOpen,i=e.caption,s=e.desc,l=e.popup,o=e.licenseId,m=e.isInCart,p=Object(d.c)(),f=Object(g.g)();return c.a.createElement("button",{onClick:function(e){e.stopPropagation(),4===n?f.replace("/contact"):p(Object(b.a)({product:{beatId:t,licenseId:o}})),r()},className:"license-button-choice mp3-lease"},m&&m.licenseId._id.toString()===o?c.a.createElement("div",{className:"selected-in-cart"},c.a.createElement(u.a,{icon:E.faCheck})):null,c.a.createElement("div",{className:"license__choice-caption"},i),c.a.createElement("div",{className:"license__choice-price"},"$",a),c.a.createElement("div",{className:"license__choice-desc"},s),c.a.createElement("div",{className:"popup"},l))},_=function(e){var t=Object(d.d)((function(e){return e.licensesReducer})),a=t.isLoading,b=t.licenses,E=e.show,g=e.setOpen,_=Object(n.useMemo)((function(){return["mp3 lease","wav lease","track out lease","unlimited lease","exclusive"]}),[]),O=Object(n.useMemo)((function(){return["MP3","MP3 AND WAV","MP3, WAV AND TRACK STEMS","MP3, WAV AND TRACK STEMS","JUST CONTACT ME VIA CONTACT FORM OR USING EMAIL/INSTAGRAM"]}),[]),k=Object(n.useMemo)((function(){return["CLICK TO ADD IN YOUR CART","CLICK TO GO TO CONTACT PAGE"]}),[]),h=Object(n.useMemo)((function(){return"https://ass-server.northeurope.cloudapp.azure.com:80/api/"+e.track.imgUrl}),[e.track]);return a?c.a.createElement(p.a,null):c.a.createElement(c.a.Fragment,null,c.a.createElement(s.a,{open:E,transition:{animation:"zoom",duration:350}},c.a.createElement(l.a,{className:"license__main-modal-container",basic:!0,onOpen:function(e){e.stopPropagation(),g(!0)},onClose:function(e){e.stopPropagation(),g(!1)},open:!0,size:"small",centered:!0},c.a.createElement(l.a.Content,{onClick:function(e){e.stopPropagation()},className:"licenses-container",onBlur:function(e){e.stopPropagation()}},c.a.createElement("div",{className:"licenses-container"},c.a.createElement(r.a,{className:"track-description-container"},c.a.createElement(i.a,{xl:1,md:2,sm:2,className:"license__img-container"},c.a.createElement("img",{className:"license__img-main",src:h,alt:"track"})),c.a.createElement(i.a,{xl:6,md:4,sm:4,className:"license__beat_information"},c.a.createElement("div",{className:"license__beat-name"},c.a.createElement("span",{className:"license__green"},"Track name:")," ",e.track.title),c.a.createElement("div",{className:"license__author-name"},c.a.createElement("span",{className:"license__green"},"Producer:")," Cherries"),c.a.createElement("div",{className:"license__tags-container"},c.a.createElement("span",null,"Tags:")," ",e.track.tags.map((function(e,t){return c.a.createElement("span",{key:t,className:"tag"},"#",e,"\xa0")}))),c.a.createElement("div",{className:"license__bpm"},c.a.createElement("span",{className:"license_bpm-caption"},"BPM: ")," ",e.track.bpm))),c.a.createElement(r.a,null,c.a.createElement(i.a,{xl:3,md:4,sm:12},c.a.createElement(f,{licenseType:b[3].type,price:b[3].price,caption:b[3].label.toLowerCase(),desc:O[0],popup:k[0],setOpen:function(){g(!1)},isInCart:e.isInCart,licenseId:b[3].id,trackId:e.track.id})),c.a.createElement(i.a,{xl:3,md:4,sm:12},c.a.createElement(f,{licenseType:b[2].type,price:b[2].price,caption:b[2].label.toLowerCase(),desc:O[1],popup:k[0],setOpen:function(){g(!1)},isInCart:e.isInCart,licenseId:b[2].id,trackId:e.track.id})),c.a.createElement(i.a,{xl:3,md:4,sm:12},c.a.createElement(f,{licenseType:b[1].type,price:b[1].price,caption:b[1].label.toLowerCase(),desc:O[2],popup:k[0],setOpen:function(){g(!1)},isInCart:e.isInCart,licenseId:b[1].id,trackId:e.track.id})),c.a.createElement(i.a,{xl:3,md:6,sm:12},c.a.createElement(f,{licenseType:b[0].type,price:b[0].price,caption:b[0].label.toLowerCase(),desc:O[3],popup:k[0],setOpen:function(){g(!1)},isInCart:e.isInCart,licenseId:b[0].id,trackId:e.track.id})),c.a.createElement(i.a,{xl:12,md:6,sm:12},c.a.createElement(f,{licenseType:4,price:"~",caption:_[4],desc:O[4],popup:k[1],setOpen:function(){g(!1)}}))))),c.a.createElement(l.a.Actions,{onClick:function(e){return e.stopPropagation()}},c.a.createElement(o.a,{basic:!0,className:"license__choice-close-button",inverted:!0,onClick:function(e){e.stopPropagation(),g(!1)}},c.a.createElement("div",{className:"license__close-button-icon"},c.a.createElement(u.a,{icon:m.s})," Close"))))))};t.a=_},391:function(e,t,a){"use strict";var n=a(30),c=a(0),r=a.n(c),i=(a(432),a(24)),s=a(22),l=a(25),o=a(10),m=a(15);t.a=function(e){var t=e.isMain,a=void 0!==t&&t,u=Object(c.useState)(""),d=Object(n.a)(u,2),p=d[0],b=d[1],E=Object(l.c)(),g=Object(l.d)((function(e){return e.beatsReducer})).filter,f=Object(m.g)();return r.a.createElement("div",{className:"big-search"},r.a.createElement("h1",{className:"glitch","data-text":"Cherries By"},"Cherries By"),r.a.createElement("span",{className:"sub"},"BEATSTORE"),r.a.createElement("div",{className:"search"},r.a.createElement("input",{placeholder:"What type of track are you looking for?",id:"search",type:"search",autoComplete:"off",value:g.search,onChange:function(e){b(e.target.value),E(Object(o.m)(e.target.value)),a||E(Object(o.k)(void 0,Math.floor(window.innerHeight/65)))},onKeyPress:function(e){"Enter"===e.key&&a?f.push("/beats"):a||"Enter"!==e.key||E(Object(o.k)(void 0,Math.floor(window.innerHeight/65)))}}),r.a.createElement("button",{className:"search-magnifier-button",onClick:function(){b(g.search),p.length>0&&(a?f.push("/beats"):a||E(Object(o.k)(void 0,Math.floor(window.innerHeight/65))))}},r.a.createElement(i.a,{icon:s.l}))))}},393:function(e,t,a){"use strict";a(30),a(0).useEffect,a(0).useRef},399:function(e,t,a){"use strict";var n=a(30),c=a(0),r=a.n(c),i=(a(425),a(22)),s=a(24),l=a(355),o=a(505),m=a(25),u=a(12),d=a(56),p=a(15),b=a(10),E=r.a.memo((function(e){var t=e.track,a=(e.onSelected,e.index,e.id),E=(e.previousId,e.isPlaying),g=e.cartItems,f=Object(c.useState)(!1),_=Object(n.a)(f,2),O=_[0],k=_[1],h=Object(c.useState)(!1),C=Object(n.a)(h,2),N=C[0],I=C[1],v=Object(m.c)(),j=(Object(c.useContext)(d.a).state.audioInstance,Object(p.g)());Object(c.useEffect)((function(){t.id===a&&E?I(!0):(t.id,I(!1))}),[a,E]);var y=g.find((function(e){return e.beatId._id.toString()===t.id.toString()})),S=Object(c.useMemo)((function(){return"https://ass-server.northeurope.cloudapp.azure.com:80/api/"+t.imgUrl}),[t]);return Object(c.useEffect)((function(){console.log("render")})),r.a.createElement(o.a.Row,{className:"main-row-track ".concat(N?"selected_tr":null),onClick:function(e){e.stopPropagation(),t.id===a&&E?v(Object(u.d)()):t.id!==a?v(Object(u.b)(t.id)):t.id!==a||E||v(Object(u.c)())}},r.a.createElement(o.a.Cell,{className:"tracks__title"},r.a.createElement("div",{className:"track__td-img"},r.a.createElement("img",{className:"td-img-main",src:S,alt:"beat image"})),t.title),r.a.createElement(o.a.Cell,null,t.duration),r.a.createElement(o.a.Cell,null,t.bpm),r.a.createElement(o.a.Cell,{className:"tracks__scale"},t.scale),r.a.createElement(o.a.Cell,{className:"track__tags"},r.a.createElement("div",{className:"tags-container"},t.tags.map((function(e,t){return r.a.createElement("b",{key:t,className:"track__tag",onClick:function(e){e.stopPropagation(),v(Object(u.h)(e.target.innerText)),v(Object(b.k)(void 0,Math.floor(window.innerHeight/65))),j.push("/beats")}},"#",e)})))),r.a.createElement(o.a.Cell,{className:"tracks__button-buy"},r.a.createElement("button",{className:"track__to-cart-button ".concat(y?"in-cart-button":null),onClick:function(e){e.stopPropagation(),k(!0)}},y?"IN CART":r.a.createElement(r.a.Fragment,null,r.a.createElement(s.a,{icon:i.m})," ADD")),r.a.createElement(l.a,{key:t.id,isInCart:y,track:t,buttonClass:"cart_button",show:O,setOpen:k})))}),(function(e,t){var a=e.track.id;console.log(t.cartItems.some((function(e){return e.beatId._id.toString()===a.toString()}),e.cartItems.some((function(e){return e.beatId._id.toString()===a.toString()}))));var n=t.cartItems.find((function(e){return e.beatId._id.toString()===a.toString()})),c=e.cartItems.find((function(e){return e.beatId._id.toString()===a.toString()}));return(!n||!c||n.licenseId._id===c.licenseId._id)&&(t.cartItems.some((function(e){return e.beatId._id.toString()===a.toString()}))===e.cartItems.some((function(e){return e.beatId._id.toString()===a.toString()}))&&(a!==t.id&&a!==t.previousId))})),g=a(67),f=a(55),_=a(428);a(429),t.a=r.a.memo((function(e){var t=e.isMain,a=void 0===t||t,i=Object(c.useState)(null),s=Object(n.a)(i,2),l=s[0],p=s[1],O=Object(m.d)((function(e){return e.beatsReducer})),k=O.beatList,h=O.isLoading,C=O.error,N=O.hasMore,I=(O.skip,O.isFiltering),v=O.filter,j=Object(c.useContext)(d.a).state.audioInstance,y=Object(m.c)(),S=Object(m.d)((function(e){return e.audioReducer})),T=S.id,w=S.isPlaying,M=S.previousId,A=Object(m.d)((function(e){return e.userReducer})).cart.items,x=Object(c.useMemo)((function(){return Math.floor(window.innerHeight/65)}),[window.innerHeight]);Object(c.useEffect)((function(){return y(Object(b.e)()),I||y(Object(u.e)(x)),function(){y(a?Object(b.e)():Object(u.g)())}}),[]);var P=Object(c.useMemo)((function(){return k.map((function(e,t){return r.a.createElement(E,{index:t,key:e.id,track:e,onSelected:function(e){return p(e)},selectedId:l,id:T,isPlaying:w,previousId:M,cartItems:A})}))}),[k,T,A,w,M,I]);return C?r.a.createElement(g.a,null):j&&!I||a?I||0!==k.length||h||a||!(""!==v.search||v.bpm||v.genres||v.moods||v.tags)?r.a.createElement(_.a,{next:!a&&k.length>0?function(e){y(Object(u.e)(e))}:null,hasMore:N,loader:null,dataLength:k.length},r.a.createElement("div",{className:"tracks-table-main",onScroll:function(e){return console.log(e.target)}},r.a.createElement(o.a,{structured:!0,unstackable:!0},r.a.createElement(o.a.Header,null,r.a.createElement(o.a.Row,{className:"table-head"},r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text ",width:6,textAlign:"left"},r.a.createElement("div",{className:"track__td-img"}),"TITLE"),r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text",width:1},"TIME"),r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text",width:1},"BPM"),r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text tracks__scale",width:1},"SCALE"),r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text track__tags",width:5},"TAGS"),r.a.createElement(o.a.HeaderCell,{className:"tracks__gray-text",width:1}))),r.a.createElement(o.a.Body,{className:"table-body-main"},a?P.slice(0,10):P)),h&&r.a.createElement(f.a,null))):r.a.createElement("p",{className:"no-matches"},"Sorry, unfortunately we haven't found any beats matching your request..."):r.a.createElement(f.a,null)}))},425:function(e,t,a){},426:function(e,t,a){},429:function(e,t,a){},432:function(e,t,a){}}]);
//# sourceMappingURL=2.f201c693.chunk.js.map