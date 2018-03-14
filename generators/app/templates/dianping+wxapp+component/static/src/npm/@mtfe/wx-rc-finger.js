'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var finger = createCommonjsModule(function (module, exports) {
// 1.0.6
!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t=function(t){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(t)},e=function(t,e){return"string"==typeof t?t.charCodeAt(e):t instanceof Uint8Array?t[e]:0},n="undefined"!=typeof top&&top.btoa||function(n){for(var s=[],o=0,c=n.length,i=0,r=0;r<c;++r)3===(o+=1)&&(o=0), i=e(n,r), 0===o?s.push(t(63&(e(n,r-1)<<2|i>>6)),t(63&i)):1===o?s.push(t(i>>2&63)):s.push(t(63&(e(n,r-1)<<4|i>>4))), r===c-1&&o>0&&s.push(t(i<<(3-o<<1)&63));if(o)for(;o<3;)o+=1, s.push("=");return s.join("")},s={app:0},o={system:{}},c=function(){try{wx.getSetting&&wx.getSetting({success:function(t){t.authSetting&&t.authSetting["scope.userLocation"]&&function(){try{wx.getLocation({type:"wgs84",success:function(t){o.location=t;}});}catch(t){}}();}});}catch(t){}},i=function(t){try{wx.getSetting?wx.getSetting({success:function(e){e.authSetting&&e.authSetting["scope.userInfo"]?r(t):t&&t();},fail:function(){t&&t();}}):t&&t();}catch(e){t&&t();}},r=function(t){wx.getUserInfo({success:function(e){var n={};Object.assign(n,e.userInfo), n.nickName=encodeURIComponent(e.userInfo.nickName), o.userInfo=n, t&&t();},fail:function(){t&&t();}});};!function(){try{wx.getSystemInfo({success:function(t){Object.assign(o.system,t);}});}catch(t){}}(), function(){try{wx.getNetworkType({success:function(t){o.system.networkType=t.networkType;}}), wx.onNetworkStatusChange&&wx.onNetworkStatusChange(function(t){o.system.networkType=t.networkType;});}catch(t){}}(), function(){try{wx.onAccelerometerChange(function(t){o.system.accelerometer||(o.system.accelerometer=[]), o.system.accelerometer.length>20&&o.system.accelerometer.shift(), o.system.accelerometer.push({x:Number(t.x).toFixed(3),y:Number(t.y).toFixed(3),z:Number(t.z).toFixed(3)});}), wx.onCompassChange(function(t){o.system.compass||(o.system.compass=[]), o.system.compass.length>20&&o.system.compass.shift(), o.system.compass.push(Number(t.direction).toFixed(3));});}catch(t){}}(), i(), c();return{s:function(t){s.app=t;},g:function(t){o.app=s.app;var e="WX__1_";try{if(o.location||c(), o.userInfo){var r=JSON.stringify(o);e+=n(r), t&&t(e);}else i(function(){var s=JSON.stringify(o);e+=n(s), t&&t(e);});}catch(n){t&&t(e);}}}});
});

module.exports = finger;
