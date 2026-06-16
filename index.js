// React Native entry point.
//
// Tất cả global polyfill (DOMException, AbortController, Performance API) được
// nạp TRƯỚC mọi module qua Metro serializer.getPolyfills — xem
// polyfill-top-level.js + metro.config.js. Vì vậy file này chỉ cần khởi động
// expo-router, không lặp lại polyfill ở đây nữa.
require('expo-router/entry');
