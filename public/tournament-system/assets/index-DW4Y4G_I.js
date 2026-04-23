(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const pp=()=>{};var gl={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qc=function(s){const e=[];let n=0;for(let r=0;r<s.length;r++){let i=s.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<s.length&&(s.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(s.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},fp=function(s){const e=[];let n=0,r=0;for(;n<s.length;){const i=s[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const o=s[n++];e[r++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){const o=s[n++],l=s[n++],c=s[n++],d=((i&7)<<18|(o&63)<<12|(l&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(d>>10)),e[r++]=String.fromCharCode(56320+(d&1023))}else{const o=s[n++],l=s[n++];e[r++]=String.fromCharCode((i&15)<<12|(o&63)<<6|l&63)}}return e.join("")},Yc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(s,e){if(!Array.isArray(s))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<s.length;i+=3){const o=s[i],l=i+1<s.length,c=l?s[i+1]:0,d=i+2<s.length,h=d?s[i+2]:0,f=o>>2,m=(o&3)<<4|c>>4;let b=(c&15)<<2|h>>6,v=h&63;d||(v=64,l||(b=64)),r.push(n[f],n[m],n[b],n[v])}return r.join("")},encodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(s):this.encodeByteArray(Qc(s),e)},decodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(s):fp(this.decodeStringToByteArray(s,e))},decodeStringToByteArray(s,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<s.length;){const o=n[s.charAt(i++)],c=i<s.length?n[s.charAt(i)]:0;++i;const h=i<s.length?n[s.charAt(i)]:64;++i;const m=i<s.length?n[s.charAt(i)]:64;if(++i,o==null||c==null||h==null||m==null)throw new gp;const b=o<<2|c>>4;if(r.push(b),h!==64){const v=c<<4&240|h>>2;if(r.push(v),m!==64){const T=h<<6&192|m;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let s=0;s<this.ENCODED_VALS.length;s++)this.byteToCharMap_[s]=this.ENCODED_VALS.charAt(s),this.charToByteMap_[this.byteToCharMap_[s]]=s,this.byteToCharMapWebSafe_[s]=this.ENCODED_VALS_WEBSAFE.charAt(s),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[s]]=s,s>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(s)]=s,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(s)]=s)}}};class gp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const mp=function(s){const e=Qc(s);return Yc.encodeByteArray(e,!0)},Jc=function(s){return mp(s).replace(/\./g,"")},Xc=function(s){try{return Yc.decodeString(s,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bp=()=>yp().__FIREBASE_DEFAULTS__,vp=()=>{if(typeof process>"u"||typeof gl>"u")return;const s=gl.__FIREBASE_DEFAULTS__;if(s)return JSON.parse(s)},xp=()=>{if(typeof document>"u")return;let s;try{s=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=s&&Xc(s[1]);return e&&JSON.parse(e)},Nr=()=>{try{return pp()||bp()||vp()||xp()}catch(s){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${s}`);return}},wp=s=>{var e,n;return(n=(e=Nr())==null?void 0:e.emulatorHosts)==null?void 0:n[s]},Zc=()=>{var s;return(s=Nr())==null?void 0:s.config},ed=s=>{var e;return(e=Nr())==null?void 0:e[`_${s}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ep(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ke())}function kp(){var e;const s=(e=Nr())==null?void 0:e.forceEnvironment;if(s==="node")return!0;if(s==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Ip(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Tp(){const s=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof s=="object"&&s.id!==void 0}function Sp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ap(){const s=ke();return s.indexOf("MSIE ")>=0||s.indexOf("Trident/")>=0}function Rp(){return!kp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Cp(){try{return typeof indexedDB=="object"}catch{return!1}}function Pp(){return new Promise((s,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),s(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var o;e(((o=i.error)==null?void 0:o.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dp="FirebaseError";class lt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Dp,Object.setPrototypeOf(this,lt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,vs.prototype.create)}}class vs{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,o=this.errors[e],l=o?Vp(o,r):"Error",c=`${this.serviceName}: ${l} (${i}).`;return new lt(i,c,r)}}function Vp(s,e){return s.replace(Mp,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Mp=/\{\$([^}]+)}/g;function Np(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}function Wt(s,e){if(s===e)return!0;const n=Object.keys(s),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const o=s[i],l=e[i];if(ml(o)&&ml(l)){if(!Wt(o,l))return!1}else if(o!==l)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function ml(s){return s!==null&&typeof s=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xs(s){const e=[];for(const[n,r]of Object.entries(s))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Lp(s,e){const n=new $p(s,e);return n.subscribe.bind(n)}class $p{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Op(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ci),i.error===void 0&&(i.error=Ci),i.complete===void 0&&(i.complete=Ci);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Op(s,e){if(typeof s!="object"||s===null)return!1;for(const n of e)if(n in s&&typeof s[n]=="function")return!0;return!1}function Ci(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(s){return s&&s._delegate?s._delegate:s}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ws(s){try{return(s.startsWith("http://")||s.startsWith("https://")?new URL(s).hostname:s).endsWith(".cloudworkstations.dev")}catch{return!1}}async function td(s){return(await fetch(s,{credentials:"include"})).ok}class Kt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new _p;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Bp(e))try{this.getOrInitializeService({instanceIdentifier:qt})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:i});r.resolve(o)}catch{}}}}clearInstance(e=qt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=qt){return this.instances.has(e)}getOptions(e=qt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[o,l]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);r===c&&l.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Up(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=qt){return this.component?this.component.multipleInstances?e:qt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Up(s){return s===qt?void 0:s}function Bp(s){return s.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Fp(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y;(function(s){s[s.DEBUG=0]="DEBUG",s[s.VERBOSE=1]="VERBOSE",s[s.INFO=2]="INFO",s[s.WARN=3]="WARN",s[s.ERROR=4]="ERROR",s[s.SILENT=5]="SILENT"})(Y||(Y={}));const zp={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},qp=Y.INFO,Hp={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},Gp=(s,e,...n)=>{if(e<s.logLevel)return;const r=new Date().toISOString(),i=Hp[e];if(i)console[i](`[${r}]  ${s.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class wo{constructor(e){this.name=e,this._logLevel=qp,this._logHandler=Gp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zp[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}const Wp=(s,e)=>e.some(n=>s instanceof n);let yl,bl;function Kp(){return yl||(yl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qp(){return bl||(bl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const nd=new WeakMap,Wi=new WeakMap,sd=new WeakMap,Pi=new WeakMap,_o=new WeakMap;function Yp(s){const e=new Promise((n,r)=>{const i=()=>{s.removeEventListener("success",o),s.removeEventListener("error",l)},o=()=>{n(Et(s.result)),i()},l=()=>{r(s.error),i()};s.addEventListener("success",o),s.addEventListener("error",l)});return e.then(n=>{n instanceof IDBCursor&&nd.set(n,s)}).catch(()=>{}),_o.set(e,s),e}function Jp(s){if(Wi.has(s))return;const e=new Promise((n,r)=>{const i=()=>{s.removeEventListener("complete",o),s.removeEventListener("error",l),s.removeEventListener("abort",l)},o=()=>{n(),i()},l=()=>{r(s.error||new DOMException("AbortError","AbortError")),i()};s.addEventListener("complete",o),s.addEventListener("error",l),s.addEventListener("abort",l)});Wi.set(s,e)}let Ki={get(s,e,n){if(s instanceof IDBTransaction){if(e==="done")return Wi.get(s);if(e==="objectStoreNames")return s.objectStoreNames||sd.get(s);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Et(s[e])},set(s,e,n){return s[e]=n,!0},has(s,e){return s instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in s}};function Xp(s){Ki=s(Ki)}function Zp(s){return s===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=s.call(Di(this),e,...n);return sd.set(r,e.sort?e.sort():[e]),Et(r)}:Qp().includes(s)?function(...e){return s.apply(Di(this),e),Et(nd.get(this))}:function(...e){return Et(s.apply(Di(this),e))}}function ef(s){return typeof s=="function"?Zp(s):(s instanceof IDBTransaction&&Jp(s),Wp(s,Kp())?new Proxy(s,Ki):s)}function Et(s){if(s instanceof IDBRequest)return Yp(s);if(Pi.has(s))return Pi.get(s);const e=ef(s);return e!==s&&(Pi.set(s,e),_o.set(e,s)),e}const Di=s=>_o.get(s);function tf(s,e,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){const l=indexedDB.open(s,e),c=Et(l);return r&&l.addEventListener("upgradeneeded",d=>{r(Et(l.result),d.oldVersion,d.newVersion,Et(l.transaction),d)}),n&&l.addEventListener("blocked",d=>n(d.oldVersion,d.newVersion,d)),c.then(d=>{o&&d.addEventListener("close",()=>o()),i&&d.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const nf=["get","getKey","getAll","getAllKeys","count"],sf=["put","add","delete","clear"],Vi=new Map;function vl(s,e){if(!(s instanceof IDBDatabase&&!(e in s)&&typeof e=="string"))return;if(Vi.get(e))return Vi.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=sf.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||nf.includes(n)))return;const o=async function(l,...c){const d=this.transaction(l,i?"readwrite":"readonly");let h=d.store;return r&&(h=h.index(c.shift())),(await Promise.all([h[n](...c),i&&d.done]))[0]};return Vi.set(e,o),o}Xp(s=>({...s,get:(e,n,r)=>vl(e,n)||s.get(e,n,r),has:(e,n)=>!!vl(e,n)||s.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(of(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function of(s){const e=s.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Qi="@firebase/app",xl="0.14.11";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st=new wo("@firebase/app"),af="@firebase/app-compat",lf="@firebase/analytics-compat",cf="@firebase/analytics",df="@firebase/app-check-compat",uf="@firebase/app-check",hf="@firebase/auth",pf="@firebase/auth-compat",ff="@firebase/database",gf="@firebase/data-connect",mf="@firebase/database-compat",yf="@firebase/functions",bf="@firebase/functions-compat",vf="@firebase/installations",xf="@firebase/installations-compat",wf="@firebase/messaging",_f="@firebase/messaging-compat",Ef="@firebase/performance",kf="@firebase/performance-compat",If="@firebase/remote-config",Tf="@firebase/remote-config-compat",Sf="@firebase/storage",Af="@firebase/storage-compat",Rf="@firebase/firestore",Cf="@firebase/ai",Pf="@firebase/firestore-compat",Df="firebase",Vf="12.12.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yi="[DEFAULT]",Mf={[Qi]:"fire-core",[af]:"fire-core-compat",[cf]:"fire-analytics",[lf]:"fire-analytics-compat",[uf]:"fire-app-check",[df]:"fire-app-check-compat",[hf]:"fire-auth",[pf]:"fire-auth-compat",[ff]:"fire-rtdb",[gf]:"fire-data-connect",[mf]:"fire-rtdb-compat",[yf]:"fire-fn",[bf]:"fire-fn-compat",[vf]:"fire-iid",[xf]:"fire-iid-compat",[wf]:"fire-fcm",[_f]:"fire-fcm-compat",[Ef]:"fire-perf",[kf]:"fire-perf-compat",[If]:"fire-rc",[Tf]:"fire-rc-compat",[Sf]:"fire-gcs",[Af]:"fire-gcs-compat",[Rf]:"fire-fst",[Pf]:"fire-fst-compat",[Cf]:"fire-vertex","fire-js":"fire-js",[Df]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pr=new Map,Nf=new Map,Ji=new Map;function wl(s,e){try{s.container.addComponent(e)}catch(n){st.debug(`Component ${e.name} failed to register with FirebaseApp ${s.name}`,n)}}function bn(s){const e=s.name;if(Ji.has(e))return st.debug(`There were multiple attempts to register component ${e}.`),!1;Ji.set(e,s);for(const n of pr.values())wl(n,s);for(const n of Nf.values())wl(n,s);return!0}function Eo(s,e){const n=s.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),s.container.getProvider(e)}function $e(s){return s==null?!1:s.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},kt=new vs("app","Firebase",Lf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $f{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Kt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw kt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn=Vf;function rd(s,e={}){let n=s;typeof e!="object"&&(e={name:e});const r={name:Yi,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw kt.create("bad-app-name",{appName:String(i)});if(n||(n=Zc()),!n)throw kt.create("no-options");const o=pr.get(i);if(o){if(Wt(n,o.options)&&Wt(r,o.config))return o;throw kt.create("duplicate-app",{appName:i})}const l=new jp(i);for(const d of Ji.values())l.addComponent(d);const c=new $f(n,r,l);return pr.set(i,c),c}function Of(s=Yi){const e=pr.get(s);if(!e&&s===Yi&&Zc())return rd();if(!e)throw kt.create("no-app",{appName:s});return e}function It(s,e,n){let r=Mf[s]??s;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),st.warn(l.join(" "));return}bn(new Kt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ff="firebase-heartbeat-database",Uf=1,cs="firebase-heartbeat-store";let Mi=null;function id(){return Mi||(Mi=tf(Ff,Uf,{upgrade:(s,e)=>{switch(e){case 0:try{s.createObjectStore(cs)}catch(n){console.warn(n)}}}}).catch(s=>{throw kt.create("idb-open",{originalErrorMessage:s.message})})),Mi}async function Bf(s){try{const n=(await id()).transaction(cs),r=await n.objectStore(cs).get(od(s));return await n.done,r}catch(e){if(e instanceof lt)st.warn(e.message);else{const n=kt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});st.warn(n.message)}}}async function _l(s,e){try{const r=(await id()).transaction(cs,"readwrite");await r.objectStore(cs).put(e,od(s)),await r.done}catch(n){if(n instanceof lt)st.warn(n.message);else{const r=kt.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});st.warn(r.message)}}}function od(s){return`${s.name}!${s.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf=1024,zf=30;class qf{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Gf(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=El();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(l=>l.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:i}),this._heartbeatsCache.heartbeats.length>zf){const l=Wf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){st.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=El(),{heartbeatsToSend:r,unsentEntries:i}=Hf(this._heartbeatsCache.heartbeats),o=Jc(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return st.warn(n),""}}}function El(){return new Date().toISOString().substring(0,10)}function Hf(s,e=jf){const n=[];let r=s.slice();for(const i of s){const o=n.find(l=>l.agent===i.agent);if(o){if(o.dates.push(i.date),kl(n)>e){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),kl(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Gf{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Cp()?Pp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Bf(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return _l(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return _l(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function kl(s){return Jc(JSON.stringify({version:2,heartbeats:s})).length}function Wf(s){if(s.length===0)return-1;let e=0,n=s[0].date;for(let r=1;r<s.length;r++)s[r].date<n&&(n=s[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kf(s){bn(new Kt("platform-logger",e=>new rf(e),"PRIVATE")),bn(new Kt("heartbeat",e=>new qf(e),"PRIVATE")),It(Qi,xl,s),It(Qi,xl,"esm2020"),It("fire-js","")}Kf("");var Qf="firebase",Yf="12.12.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */It(Qf,Yf,"app");var Il=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Tt,ad;(function(){var s;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,x){function _(){}_.prototype=x.prototype,E.F=x.prototype,E.prototype=new _,E.prototype.constructor=E,E.D=function(I,k,A){for(var w=Array(arguments.length-2),Ae=2;Ae<arguments.length;Ae++)w[Ae-2]=arguments[Ae];return x.prototype[k].apply(I,w)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,x,_){_||(_=0);const I=Array(16);if(typeof x=="string")for(var k=0;k<16;++k)I[k]=x.charCodeAt(_++)|x.charCodeAt(_++)<<8|x.charCodeAt(_++)<<16|x.charCodeAt(_++)<<24;else for(k=0;k<16;++k)I[k]=x[_++]|x[_++]<<8|x[_++]<<16|x[_++]<<24;x=E.g[0],_=E.g[1],k=E.g[2];let A=E.g[3],w;w=x+(A^_&(k^A))+I[0]+3614090360&4294967295,x=_+(w<<7&4294967295|w>>>25),w=A+(k^x&(_^k))+I[1]+3905402710&4294967295,A=x+(w<<12&4294967295|w>>>20),w=k+(_^A&(x^_))+I[2]+606105819&4294967295,k=A+(w<<17&4294967295|w>>>15),w=_+(x^k&(A^x))+I[3]+3250441966&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(A^_&(k^A))+I[4]+4118548399&4294967295,x=_+(w<<7&4294967295|w>>>25),w=A+(k^x&(_^k))+I[5]+1200080426&4294967295,A=x+(w<<12&4294967295|w>>>20),w=k+(_^A&(x^_))+I[6]+2821735955&4294967295,k=A+(w<<17&4294967295|w>>>15),w=_+(x^k&(A^x))+I[7]+4249261313&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(A^_&(k^A))+I[8]+1770035416&4294967295,x=_+(w<<7&4294967295|w>>>25),w=A+(k^x&(_^k))+I[9]+2336552879&4294967295,A=x+(w<<12&4294967295|w>>>20),w=k+(_^A&(x^_))+I[10]+4294925233&4294967295,k=A+(w<<17&4294967295|w>>>15),w=_+(x^k&(A^x))+I[11]+2304563134&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(A^_&(k^A))+I[12]+1804603682&4294967295,x=_+(w<<7&4294967295|w>>>25),w=A+(k^x&(_^k))+I[13]+4254626195&4294967295,A=x+(w<<12&4294967295|w>>>20),w=k+(_^A&(x^_))+I[14]+2792965006&4294967295,k=A+(w<<17&4294967295|w>>>15),w=_+(x^k&(A^x))+I[15]+1236535329&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(k^A&(_^k))+I[1]+4129170786&4294967295,x=_+(w<<5&4294967295|w>>>27),w=A+(_^k&(x^_))+I[6]+3225465664&4294967295,A=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(A^x))+I[11]+643717713&4294967295,k=A+(w<<14&4294967295|w>>>18),w=_+(A^x&(k^A))+I[0]+3921069994&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^A&(_^k))+I[5]+3593408605&4294967295,x=_+(w<<5&4294967295|w>>>27),w=A+(_^k&(x^_))+I[10]+38016083&4294967295,A=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(A^x))+I[15]+3634488961&4294967295,k=A+(w<<14&4294967295|w>>>18),w=_+(A^x&(k^A))+I[4]+3889429448&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^A&(_^k))+I[9]+568446438&4294967295,x=_+(w<<5&4294967295|w>>>27),w=A+(_^k&(x^_))+I[14]+3275163606&4294967295,A=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(A^x))+I[3]+4107603335&4294967295,k=A+(w<<14&4294967295|w>>>18),w=_+(A^x&(k^A))+I[8]+1163531501&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^A&(_^k))+I[13]+2850285829&4294967295,x=_+(w<<5&4294967295|w>>>27),w=A+(_^k&(x^_))+I[2]+4243563512&4294967295,A=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(A^x))+I[7]+1735328473&4294967295,k=A+(w<<14&4294967295|w>>>18),w=_+(A^x&(k^A))+I[12]+2368359562&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(_^k^A)+I[5]+4294588738&4294967295,x=_+(w<<4&4294967295|w>>>28),w=A+(x^_^k)+I[8]+2272392833&4294967295,A=x+(w<<11&4294967295|w>>>21),w=k+(A^x^_)+I[11]+1839030562&4294967295,k=A+(w<<16&4294967295|w>>>16),w=_+(k^A^x)+I[14]+4259657740&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^A)+I[1]+2763975236&4294967295,x=_+(w<<4&4294967295|w>>>28),w=A+(x^_^k)+I[4]+1272893353&4294967295,A=x+(w<<11&4294967295|w>>>21),w=k+(A^x^_)+I[7]+4139469664&4294967295,k=A+(w<<16&4294967295|w>>>16),w=_+(k^A^x)+I[10]+3200236656&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^A)+I[13]+681279174&4294967295,x=_+(w<<4&4294967295|w>>>28),w=A+(x^_^k)+I[0]+3936430074&4294967295,A=x+(w<<11&4294967295|w>>>21),w=k+(A^x^_)+I[3]+3572445317&4294967295,k=A+(w<<16&4294967295|w>>>16),w=_+(k^A^x)+I[6]+76029189&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^A)+I[9]+3654602809&4294967295,x=_+(w<<4&4294967295|w>>>28),w=A+(x^_^k)+I[12]+3873151461&4294967295,A=x+(w<<11&4294967295|w>>>21),w=k+(A^x^_)+I[15]+530742520&4294967295,k=A+(w<<16&4294967295|w>>>16),w=_+(k^A^x)+I[2]+3299628645&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(k^(_|~A))+I[0]+4096336452&4294967295,x=_+(w<<6&4294967295|w>>>26),w=A+(_^(x|~k))+I[7]+1126891415&4294967295,A=x+(w<<10&4294967295|w>>>22),w=k+(x^(A|~_))+I[14]+2878612391&4294967295,k=A+(w<<15&4294967295|w>>>17),w=_+(A^(k|~x))+I[5]+4237533241&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~A))+I[12]+1700485571&4294967295,x=_+(w<<6&4294967295|w>>>26),w=A+(_^(x|~k))+I[3]+2399980690&4294967295,A=x+(w<<10&4294967295|w>>>22),w=k+(x^(A|~_))+I[10]+4293915773&4294967295,k=A+(w<<15&4294967295|w>>>17),w=_+(A^(k|~x))+I[1]+2240044497&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~A))+I[8]+1873313359&4294967295,x=_+(w<<6&4294967295|w>>>26),w=A+(_^(x|~k))+I[15]+4264355552&4294967295,A=x+(w<<10&4294967295|w>>>22),w=k+(x^(A|~_))+I[6]+2734768916&4294967295,k=A+(w<<15&4294967295|w>>>17),w=_+(A^(k|~x))+I[13]+1309151649&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~A))+I[4]+4149444226&4294967295,x=_+(w<<6&4294967295|w>>>26),w=A+(_^(x|~k))+I[11]+3174756917&4294967295,A=x+(w<<10&4294967295|w>>>22),w=k+(x^(A|~_))+I[2]+718787259&4294967295,k=A+(w<<15&4294967295|w>>>17),w=_+(A^(k|~x))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+x&4294967295,E.g[1]=E.g[1]+(k+(w<<21&4294967295|w>>>11))&4294967295,E.g[2]=E.g[2]+k&4294967295,E.g[3]=E.g[3]+A&4294967295}r.prototype.v=function(E,x){x===void 0&&(x=E.length);const _=x-this.blockSize,I=this.C;let k=this.h,A=0;for(;A<x;){if(k==0)for(;A<=_;)i(this,E,A),A+=this.blockSize;if(typeof E=="string"){for(;A<x;)if(I[k++]=E.charCodeAt(A++),k==this.blockSize){i(this,I),k=0;break}}else for(;A<x;)if(I[k++]=E[A++],k==this.blockSize){i(this,I),k=0;break}}this.h=k,this.o+=x},r.prototype.A=function(){var E=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);E[0]=128;for(var x=1;x<E.length-8;++x)E[x]=0;x=this.o*8;for(var _=E.length-8;_<E.length;++_)E[_]=x&255,x/=256;for(this.v(E),E=Array(16),x=0,_=0;_<4;++_)for(let I=0;I<32;I+=8)E[x++]=this.g[_]>>>I&255;return E};function o(E,x){var _=c;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=x(E)}function l(E,x){this.h=x;const _=[];let I=!0;for(let k=E.length-1;k>=0;k--){const A=E[k]|0;I&&A==x||(_[k]=A,I=!1)}this.g=_}var c={};function d(E){return-128<=E&&E<128?o(E,function(x){return new l([x|0],x<0?-1:0)}):new l([E|0],E<0?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return m;if(E<0)return P(h(-E));const x=[];let _=1;for(let I=0;E>=_;I++)x[I]=E/_|0,_*=4294967296;return new l(x,0)}function f(E,x){if(E.length==0)throw Error("number format error: empty string");if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(E.charAt(0)=="-")return P(f(E.substring(1),x));if(E.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=h(Math.pow(x,8));let I=m;for(let A=0;A<E.length;A+=8){var k=Math.min(8,E.length-A);const w=parseInt(E.substring(A,A+k),x);k<8?(k=h(Math.pow(x,k)),I=I.j(k).add(h(w))):(I=I.j(_),I=I.add(h(w)))}return I}var m=d(0),b=d(1),v=d(16777216);s=l.prototype,s.m=function(){if(R(this))return-P(this).m();let E=0,x=1;for(let _=0;_<this.g.length;_++){const I=this.i(_);E+=(I>=0?I:4294967296+I)*x,x*=4294967296}return E},s.toString=function(E){if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(T(this))return"0";if(R(this))return"-"+P(this).toString(E);const x=h(Math.pow(E,6));var _=this;let I="";for(;;){const k=B(_,x).g;_=L(_,k.j(x));let A=((_.g.length>0?_.g[0]:_.h)>>>0).toString(E);if(_=k,T(_))return A+I;for(;A.length<6;)A="0"+A;I=A+I}},s.i=function(E){return E<0?0:E<this.g.length?this.g[E]:this.h};function T(E){if(E.h!=0)return!1;for(let x=0;x<E.g.length;x++)if(E.g[x]!=0)return!1;return!0}function R(E){return E.h==-1}s.l=function(E){return E=L(this,E),R(E)?-1:T(E)?0:1};function P(E){const x=E.g.length,_=[];for(let I=0;I<x;I++)_[I]=~E.g[I];return new l(_,~E.h).add(b)}s.abs=function(){return R(this)?P(this):this},s.add=function(E){const x=Math.max(this.g.length,E.g.length),_=[];let I=0;for(let k=0;k<=x;k++){let A=I+(this.i(k)&65535)+(E.i(k)&65535),w=(A>>>16)+(this.i(k)>>>16)+(E.i(k)>>>16);I=w>>>16,A&=65535,w&=65535,_[k]=w<<16|A}return new l(_,_[_.length-1]&-2147483648?-1:0)};function L(E,x){return E.add(P(x))}s.j=function(E){if(T(this)||T(E))return m;if(R(this))return R(E)?P(this).j(P(E)):P(P(this).j(E));if(R(E))return P(this.j(P(E)));if(this.l(v)<0&&E.l(v)<0)return h(this.m()*E.m());const x=this.g.length+E.g.length,_=[];for(var I=0;I<2*x;I++)_[I]=0;for(I=0;I<this.g.length;I++)for(let k=0;k<E.g.length;k++){const A=this.i(I)>>>16,w=this.i(I)&65535,Ae=E.i(k)>>>16,Ot=E.i(k)&65535;_[2*I+2*k]+=w*Ot,M(_,2*I+2*k),_[2*I+2*k+1]+=A*Ot,M(_,2*I+2*k+1),_[2*I+2*k+1]+=w*Ae,M(_,2*I+2*k+1),_[2*I+2*k+2]+=A*Ae,M(_,2*I+2*k+2)}for(E=0;E<x;E++)_[E]=_[2*E+1]<<16|_[2*E];for(E=x;E<2*x;E++)_[E]=0;return new l(_,0)};function M(E,x){for(;(E[x]&65535)!=E[x];)E[x+1]+=E[x]>>>16,E[x]&=65535,x++}function q(E,x){this.g=E,this.h=x}function B(E,x){if(T(x))throw Error("division by zero");if(T(E))return new q(m,m);if(R(E))return x=B(P(E),x),new q(P(x.g),P(x.h));if(R(x))return x=B(E,P(x)),new q(P(x.g),x.h);if(E.g.length>30){if(R(E)||R(x))throw Error("slowDivide_ only works with positive integers.");for(var _=b,I=x;I.l(E)<=0;)_=G(_),I=G(I);var k=Z(_,1),A=Z(I,1);for(I=Z(I,2),_=Z(_,2);!T(I);){var w=A.add(I);w.l(E)<=0&&(k=k.add(_),A=w),I=Z(I,1),_=Z(_,1)}return x=L(E,k.j(x)),new q(k,x)}for(k=m;E.l(x)>=0;){for(_=Math.max(1,Math.floor(E.m()/x.m())),I=Math.ceil(Math.log(_)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),A=h(_),w=A.j(x);R(w)||w.l(E)>0;)_-=I,A=h(_),w=A.j(x);T(A)&&(A=b),k=k.add(A),E=L(E,w)}return new q(k,E)}s.B=function(E){return B(this,E).h},s.and=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)&E.i(I);return new l(_,this.h&E.h)},s.or=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)|E.i(I);return new l(_,this.h|E.h)},s.xor=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)^E.i(I);return new l(_,this.h^E.h)};function G(E){const x=E.g.length+1,_=[];for(let I=0;I<x;I++)_[I]=E.i(I)<<1|E.i(I-1)>>>31;return new l(_,E.h)}function Z(E,x){const _=x>>5;x%=32;const I=E.g.length-_,k=[];for(let A=0;A<I;A++)k[A]=x>0?E.i(A+_)>>>x|E.i(A+_+1)<<32-x:E.i(A+_);return new l(k,E.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,ad=r,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=h,l.fromString=f,Tt=l}).apply(typeof Il<"u"?Il:typeof self<"u"?self:typeof window<"u"?window:{});var Ws=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ld,Jn,cd,nr,Xi,dd,ud,hd;(function(){var s,e=Object.defineProperty;function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ws=="object"&&Ws];for(var u=0;u<a.length;++u){var p=a[u];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function i(a,u){if(u)e:{var p=r;a=a.split(".");for(var y=0;y<a.length-1;y++){var S=a[y];if(!(S in p))break e;p=p[S]}a=a[a.length-1],y=p[a],u=u(y),u!=y&&u!=null&&e(p,a,{configurable:!0,writable:!0,value:u})}}i("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),i("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),i("Object.entries",function(a){return a||function(u){var p=[],y;for(y in u)Object.prototype.hasOwnProperty.call(u,y)&&p.push([y,u[y]]);return p}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,p){return a.call.apply(a.bind,arguments)}function h(a,u,p){return h=d,h.apply(null,arguments)}function f(a,u){var p=Array.prototype.slice.call(arguments,1);return function(){var y=p.slice();return y.push.apply(y,arguments),a.apply(this,y)}}function m(a,u){function p(){}p.prototype=u.prototype,a.Z=u.prototype,a.prototype=new p,a.prototype.constructor=a,a.Ob=function(y,S,C){for(var N=Array(arguments.length-2),Q=2;Q<arguments.length;Q++)N[Q-2]=arguments[Q];return u.prototype[S].apply(y,N)}}var b=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){const u=a.length;if(u>0){const p=Array(u);for(let y=0;y<u;y++)p[y]=a[y];return p}return[]}function T(a,u){for(let y=1;y<arguments.length;y++){const S=arguments[y];var p=typeof S;if(p=p!="object"?p:S?Array.isArray(S)?"array":p:"null",p=="array"||p=="object"&&typeof S.length=="number"){p=a.length||0;const C=S.length||0;a.length=p+C;for(let N=0;N<C;N++)a[p+N]=S[N]}else a.push(S)}}class R{constructor(u,p){this.i=u,this.j=p,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function P(a){l.setTimeout(()=>{throw a},0)}function L(){var a=E;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class M{constructor(){this.h=this.g=null}add(u,p){const y=q.get();y.set(u,p),this.h?this.h.next=y:this.g=y,this.h=y}}var q=new R(()=>new B,a=>a.reset());class B{constructor(){this.next=this.g=this.h=null}set(u,p){this.h=u,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let G,Z=!1,E=new M,x=()=>{const a=Promise.resolve(void 0);G=()=>{a.then(_)}};function _(){for(var a;a=L();){try{a.h.call(a.g)}catch(p){P(p)}var u=q;u.j(a),u.h<100&&(u.h++,a.next=u.g,u.g=a)}Z=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function k(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}k.prototype.h=function(){this.defaultPrevented=!0};var A=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const p=()=>{};l.addEventListener("test",p,u),l.removeEventListener("test",p,u)}catch{}return a})();function w(a){return/^[\s\xa0]*$/.test(a)}function Ae(a,u){k.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,u)}m(Ae,k),Ae.prototype.init=function(a,u){const p=this.type=a.type,y=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget,u||(p=="mouseover"?u=a.fromElement:p=="mouseout"&&(u=a.toElement)),this.relatedTarget=u,y?(this.clientX=y.clientX!==void 0?y.clientX:y.pageX,this.clientY=y.clientY!==void 0?y.clientY:y.pageY,this.screenX=y.screenX||0,this.screenY=y.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Ae.Z.h.call(this)},Ae.prototype.h=function(){Ae.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ot="closure_listenable_"+(Math.random()*1e6|0),Nh=0;function Lh(a,u,p,y,S){this.listener=a,this.proxy=null,this.src=u,this.type=p,this.capture=!!y,this.ha=S,this.key=++Nh,this.da=this.fa=!1}function Ds(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Vs(a,u,p){for(const y in a)u.call(p,a[y],y,a)}function $h(a,u){for(const p in a)u.call(void 0,a[p],p,a)}function fa(a){const u={};for(const p in a)u[p]=a[p];return u}const ga="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ma(a,u){let p,y;for(let S=1;S<arguments.length;S++){y=arguments[S];for(p in y)a[p]=y[p];for(let C=0;C<ga.length;C++)p=ga[C],Object.prototype.hasOwnProperty.call(y,p)&&(a[p]=y[p])}}function Ms(a){this.src=a,this.g={},this.h=0}Ms.prototype.add=function(a,u,p,y,S){const C=a.toString();a=this.g[C],a||(a=this.g[C]=[],this.h++);const N=ai(a,u,y,S);return N>-1?(u=a[N],p||(u.fa=!1)):(u=new Lh(u,this.src,C,!!y,S),u.fa=p,a.push(u)),u};function oi(a,u){const p=u.type;if(p in a.g){var y=a.g[p],S=Array.prototype.indexOf.call(y,u,void 0),C;(C=S>=0)&&Array.prototype.splice.call(y,S,1),C&&(Ds(u),a.g[p].length==0&&(delete a.g[p],a.h--))}}function ai(a,u,p,y){for(let S=0;S<a.length;++S){const C=a[S];if(!C.da&&C.listener==u&&C.capture==!!p&&C.ha==y)return S}return-1}var li="closure_lm_"+(Math.random()*1e6|0),ci={};function ya(a,u,p,y,S){if(Array.isArray(u)){for(let C=0;C<u.length;C++)ya(a,u[C],p,y,S);return null}return p=xa(p),a&&a[Ot]?a.J(u,p,c(y)?!!y.capture:!1,S):Oh(a,u,p,!1,y,S)}function Oh(a,u,p,y,S,C){if(!u)throw Error("Invalid event type");const N=c(S)?!!S.capture:!!S;let Q=ui(a);if(Q||(a[li]=Q=new Ms(a)),p=Q.add(u,p,y,N,C),p.proxy)return p;if(y=Fh(),p.proxy=y,y.src=a,y.listener=p,a.addEventListener)A||(S=N),S===void 0&&(S=!1),a.addEventListener(u.toString(),y,S);else if(a.attachEvent)a.attachEvent(va(u.toString()),y);else if(a.addListener&&a.removeListener)a.addListener(y);else throw Error("addEventListener and attachEvent are unavailable.");return p}function Fh(){function a(p){return u.call(a.src,a.listener,p)}const u=Uh;return a}function ba(a,u,p,y,S){if(Array.isArray(u))for(var C=0;C<u.length;C++)ba(a,u[C],p,y,S);else y=c(y)?!!y.capture:!!y,p=xa(p),a&&a[Ot]?(a=a.i,C=String(u).toString(),C in a.g&&(u=a.g[C],p=ai(u,p,y,S),p>-1&&(Ds(u[p]),Array.prototype.splice.call(u,p,1),u.length==0&&(delete a.g[C],a.h--)))):a&&(a=ui(a))&&(u=a.g[u.toString()],a=-1,u&&(a=ai(u,p,y,S)),(p=a>-1?u[a]:null)&&di(p))}function di(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Ot])oi(u.i,a);else{var p=a.type,y=a.proxy;u.removeEventListener?u.removeEventListener(p,y,a.capture):u.detachEvent?u.detachEvent(va(p),y):u.addListener&&u.removeListener&&u.removeListener(y),(p=ui(u))?(oi(p,a),p.h==0&&(p.src=null,u[li]=null)):Ds(a)}}}function va(a){return a in ci?ci[a]:ci[a]="on"+a}function Uh(a,u){if(a.da)a=!0;else{u=new Ae(u,this);const p=a.listener,y=a.ha||a.src;a.fa&&di(a),a=p.call(y,u)}return a}function ui(a){return a=a[li],a instanceof Ms?a:null}var hi="__closure_events_fn_"+(Math.random()*1e9>>>0);function xa(a){return typeof a=="function"?a:(a[hi]||(a[hi]=function(u){return a.handleEvent(u)}),a[hi])}function we(){I.call(this),this.i=new Ms(this),this.M=this,this.G=null}m(we,I),we.prototype[Ot]=!0,we.prototype.removeEventListener=function(a,u,p,y){ba(this,a,u,p,y)};function Ie(a,u){var p,y=a.G;if(y)for(p=[];y;y=y.G)p.push(y);if(a=a.M,y=u.type||u,typeof u=="string")u=new k(u,a);else if(u instanceof k)u.target=u.target||a;else{var S=u;u=new k(y,a),ma(u,S)}S=!0;let C,N;if(p)for(N=p.length-1;N>=0;N--)C=u.g=p[N],S=Ns(C,y,!0,u)&&S;if(C=u.g=a,S=Ns(C,y,!0,u)&&S,S=Ns(C,y,!1,u)&&S,p)for(N=0;N<p.length;N++)C=u.g=p[N],S=Ns(C,y,!1,u)&&S}we.prototype.N=function(){if(we.Z.N.call(this),this.i){var a=this.i;for(const u in a.g){const p=a.g[u];for(let y=0;y<p.length;y++)Ds(p[y]);delete a.g[u],a.h--}}this.G=null},we.prototype.J=function(a,u,p,y){return this.i.add(String(a),u,!1,p,y)},we.prototype.K=function(a,u,p,y){return this.i.add(String(a),u,!0,p,y)};function Ns(a,u,p,y){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();let S=!0;for(let C=0;C<u.length;++C){const N=u[C];if(N&&!N.da&&N.capture==p){const Q=N.listener,fe=N.ha||N.src;N.fa&&oi(a.i,N),S=Q.call(fe,y)!==!1&&S}}return S&&!y.defaultPrevented}function Bh(a,u){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:l.setTimeout(a,u||0)}function wa(a){a.g=Bh(()=>{a.g=null,a.i&&(a.i=!1,wa(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class jh extends I{constructor(u,p){super(),this.m=u,this.l=p,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:wa(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Mn(a){I.call(this),this.h=a,this.g={}}m(Mn,I);var _a=[];function Ea(a){Vs(a.g,function(u,p){this.g.hasOwnProperty(p)&&di(u)},a),a.g={}}Mn.prototype.N=function(){Mn.Z.N.call(this),Ea(this)},Mn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var pi=l.JSON.stringify,zh=l.JSON.parse,qh=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function ka(){}function Ia(){}var Nn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function fi(){k.call(this,"d")}m(fi,k);function gi(){k.call(this,"c")}m(gi,k);var Ft={},Ta=null;function Ls(){return Ta=Ta||new we}Ft.Ia="serverreachability";function Sa(a){k.call(this,Ft.Ia,a)}m(Sa,k);function Ln(a){const u=Ls();Ie(u,new Sa(u))}Ft.STAT_EVENT="statevent";function Aa(a,u){k.call(this,Ft.STAT_EVENT,a),this.stat=u}m(Aa,k);function Te(a){const u=Ls();Ie(u,new Aa(u,a))}Ft.Ja="timingevent";function Ra(a,u){k.call(this,Ft.Ja,a),this.size=u}m(Ra,k);function $n(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function On(){this.g=!0}On.prototype.ua=function(){this.g=!1};function Hh(a,u,p,y,S,C){a.info(function(){if(a.g)if(C){var N="",Q=C.split("&");for(let ne=0;ne<Q.length;ne++){var fe=Q[ne].split("=");if(fe.length>1){const me=fe[0];fe=fe[1];const ze=me.split("_");N=ze.length>=2&&ze[1]=="type"?N+(me+"="+fe+"&"):N+(me+"=redacted&")}}}else N=null;else N=C;return"XMLHTTP REQ ("+y+") [attempt "+S+"]: "+u+`
`+p+`
`+N})}function Gh(a,u,p,y,S,C,N){a.info(function(){return"XMLHTTP RESP ("+y+") [ attempt "+S+"]: "+u+`
`+p+`
`+C+" "+N})}function tn(a,u,p,y){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+Kh(a,p)+(y?" "+y:"")})}function Wh(a,u){a.info(function(){return"TIMEOUT: "+u})}On.prototype.info=function(){};function Kh(a,u){if(!a.g)return u;if(!u)return null;try{const C=JSON.parse(u);if(C){for(a=0;a<C.length;a++)if(Array.isArray(C[a])){var p=C[a];if(!(p.length<2)){var y=p[1];if(Array.isArray(y)&&!(y.length<1)){var S=y[0];if(S!="noop"&&S!="stop"&&S!="close")for(let N=1;N<y.length;N++)y[N]=""}}}}return pi(C)}catch{return u}}var $s={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ca={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Pa;function mi(){}m(mi,ka),mi.prototype.g=function(){return new XMLHttpRequest},Pa=new mi;function Fn(a){return encodeURIComponent(String(a))}function Qh(a){var u=1;a=a.split(":");const p=[];for(;u>0&&a.length;)p.push(a.shift()),u--;return a.length&&p.push(a.join(":")),p}function ct(a,u,p,y){this.j=a,this.i=u,this.l=p,this.S=y||1,this.V=new Mn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Da}function Da(){this.i=null,this.g="",this.h=!1}var Va={},yi={};function bi(a,u,p){a.M=1,a.A=Fs(je(u)),a.u=p,a.R=!0,Ma(a,null)}function Ma(a,u){a.F=Date.now(),Os(a),a.B=je(a.A);var p=a.B,y=a.S;Array.isArray(y)||(y=[String(y)]),Wa(p.i,"t",y),a.C=0,p=a.j.L,a.h=new Da,a.g=ul(a.j,p?u:null,!a.u),a.P>0&&(a.O=new jh(h(a.Y,a,a.g),a.P)),u=a.V,p=a.g,y=a.ba;var S="readystatechange";Array.isArray(S)||(S&&(_a[0]=S.toString()),S=_a);for(let C=0;C<S.length;C++){const N=ya(p,S[C],y||u.handleEvent,!1,u.h||u);if(!N)break;u.g[N.key]=N}u=a.J?fa(a.J):{},a.u?(a.v||(a.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,u)):(a.v="GET",a.g.ea(a.B,a.v,null,u)),Ln(),Hh(a.i,a.v,a.B,a.l,a.S,a.u)}ct.prototype.ba=function(a){a=a.target;const u=this.O;u&&ht(a)==3?u.j():this.Y(a)},ct.prototype.Y=function(a){try{if(a==this.g)e:{const Q=ht(this.g),fe=this.g.ya(),ne=this.g.ca();if(!(Q<3)&&(Q!=3||this.g&&(this.h.h||this.g.la()||el(this.g)))){this.K||Q!=4||fe==7||(fe==8||ne<=0?Ln(3):Ln(2)),vi(this);var u=this.g.ca();this.X=u;var p=Yh(this);if(this.o=u==200,Gh(this.i,this.v,this.B,this.l,this.S,Q,u),this.o){if(this.U&&!this.L){t:{if(this.g){var y,S=this.g;if((y=S.g?S.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!w(y)){var C=y;break t}}C=null}if(a=C)tn(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,xi(this,a);else{this.o=!1,this.m=3,Te(12),Ut(this),Un(this);break e}}if(this.R){a=!0;let me;for(;!this.K&&this.C<p.length;)if(me=Jh(this,p),me==yi){Q==4&&(this.m=4,Te(14),a=!1),tn(this.i,this.l,null,"[Incomplete Response]");break}else if(me==Va){this.m=4,Te(15),tn(this.i,this.l,p,"[Invalid Chunk]"),a=!1;break}else tn(this.i,this.l,me,null),xi(this,me);if(Na(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Q!=4||p.length!=0||this.h.h||(this.m=1,Te(16),a=!1),this.o=this.o&&a,!a)tn(this.i,this.l,p,"[Invalid Chunked Response]"),Ut(this),Un(this);else if(p.length>0&&!this.W){this.W=!0;var N=this.j;N.g==this&&N.aa&&!N.P&&(N.j.info("Great, no buffering proxy detected. Bytes received: "+p.length),Ai(N),N.P=!0,Te(11))}}else tn(this.i,this.l,p,null),xi(this,p);Q==4&&Ut(this),this.o&&!this.K&&(Q==4?al(this.j,this):(this.o=!1,Os(this)))}else up(this.g),u==400&&p.indexOf("Unknown SID")>0?(this.m=3,Te(12)):(this.m=0,Te(13)),Ut(this),Un(this)}}}catch{}finally{}};function Yh(a){if(!Na(a))return a.g.la();const u=el(a.g);if(u==="")return"";let p="";const y=u.length,S=ht(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return Ut(a),Un(a),"";a.h.i=new l.TextDecoder}for(let C=0;C<y;C++)a.h.h=!0,p+=a.h.i.decode(u[C],{stream:!(S&&C==y-1)});return u.length=0,a.h.g+=p,a.C=0,a.h.g}function Na(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function Jh(a,u){var p=a.C,y=u.indexOf(`
`,p);return y==-1?yi:(p=Number(u.substring(p,y)),isNaN(p)?Va:(y+=1,y+p>u.length?yi:(u=u.slice(y,y+p),a.C=y+p,u)))}ct.prototype.cancel=function(){this.K=!0,Ut(this)};function Os(a){a.T=Date.now()+a.H,La(a,a.H)}function La(a,u){if(a.D!=null)throw Error("WatchDog timer not null");a.D=$n(h(a.aa,a),u)}function vi(a){a.D&&(l.clearTimeout(a.D),a.D=null)}ct.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(Wh(this.i,this.B),this.M!=2&&(Ln(),Te(17)),Ut(this),this.m=2,Un(this)):La(this,this.T-a)};function Un(a){a.j.I==0||a.K||al(a.j,a)}function Ut(a){vi(a);var u=a.O;u&&typeof u.dispose=="function"&&u.dispose(),a.O=null,Ea(a.V),a.g&&(u=a.g,a.g=null,u.abort(),u.dispose())}function xi(a,u){try{var p=a.j;if(p.I!=0&&(p.g==a||wi(p.h,a))){if(!a.L&&wi(p.h,a)&&p.I==3){try{var y=p.Ba.g.parse(u)}catch{y=null}if(Array.isArray(y)&&y.length==3){var S=y;if(S[0]==0){e:if(!p.v){if(p.g)if(p.g.F+3e3<a.F)qs(p),js(p);else break e;Si(p),Te(18)}}else p.xa=S[1],0<p.xa-p.K&&S[2]<37500&&p.F&&p.A==0&&!p.C&&(p.C=$n(h(p.Va,p),6e3));Fa(p.h)<=1&&p.ta&&(p.ta=void 0)}else jt(p,11)}else if((a.L||p.g==a)&&qs(p),!w(u))for(S=p.Ba.g.parse(u),u=0;u<S.length;u++){let ne=S[u];const me=ne[0];if(!(me<=p.K))if(p.K=me,ne=ne[1],p.I==2)if(ne[0]=="c"){p.M=ne[1],p.ba=ne[2];const ze=ne[3];ze!=null&&(p.ka=ze,p.j.info("VER="+p.ka));const zt=ne[4];zt!=null&&(p.za=zt,p.j.info("SVER="+p.za));const pt=ne[5];pt!=null&&typeof pt=="number"&&pt>0&&(y=1.5*pt,p.O=y,p.j.info("backChannelRequestTimeoutMs_="+y)),y=p;const ft=a.g;if(ft){const Gs=ft.g?ft.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Gs){var C=y.h;C.g||Gs.indexOf("spdy")==-1&&Gs.indexOf("quic")==-1&&Gs.indexOf("h2")==-1||(C.j=C.l,C.g=new Set,C.h&&(_i(C,C.h),C.h=null))}if(y.G){const Ri=ft.g?ft.g.getResponseHeader("X-HTTP-Session-Id"):null;Ri&&(y.wa=Ri,re(y.J,y.G,Ri))}}p.I=3,p.l&&p.l.ra(),p.aa&&(p.T=Date.now()-a.F,p.j.info("Handshake RTT: "+p.T+"ms")),y=p;var N=a;if(y.na=dl(y,y.L?y.ba:null,y.W),N.L){Ua(y.h,N);var Q=N,fe=y.O;fe&&(Q.H=fe),Q.D&&(vi(Q),Os(Q)),y.g=N}else il(y);p.i.length>0&&zs(p)}else ne[0]!="stop"&&ne[0]!="close"||jt(p,7);else p.I==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?jt(p,7):Ti(p):ne[0]!="noop"&&p.l&&p.l.qa(ne),p.A=0)}}Ln(4)}catch{}}var Xh=class{constructor(a,u){this.g=a,this.map=u}};function $a(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Oa(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Fa(a){return a.h?1:a.g?a.g.size:0}function wi(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function _i(a,u){a.g?a.g.add(u):a.h=u}function Ua(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}$a.prototype.cancel=function(){if(this.i=Ba(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Ba(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const p of a.g.values())u=u.concat(p.G);return u}return v(a.i)}var ja=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Zh(a,u){if(a){a=a.split("&");for(let p=0;p<a.length;p++){const y=a[p].indexOf("=");let S,C=null;y>=0?(S=a[p].substring(0,y),C=a[p].substring(y+1)):S=a[p],u(S,C?decodeURIComponent(C.replace(/\+/g," ")):"")}}}function dt(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;a instanceof dt?(this.l=a.l,Bn(this,a.j),this.o=a.o,this.g=a.g,jn(this,a.u),this.h=a.h,Ei(this,Ka(a.i)),this.m=a.m):a&&(u=String(a).match(ja))?(this.l=!1,Bn(this,u[1]||"",!0),this.o=zn(u[2]||""),this.g=zn(u[3]||"",!0),jn(this,u[4]),this.h=zn(u[5]||"",!0),Ei(this,u[6]||"",!0),this.m=zn(u[7]||"")):(this.l=!1,this.i=new Hn(null,this.l))}dt.prototype.toString=function(){const a=[];var u=this.j;u&&a.push(qn(u,za,!0),":");var p=this.g;return(p||u=="file")&&(a.push("//"),(u=this.o)&&a.push(qn(u,za,!0),"@"),a.push(Fn(p).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.u,p!=null&&a.push(":",String(p))),(p=this.h)&&(this.g&&p.charAt(0)!="/"&&a.push("/"),a.push(qn(p,p.charAt(0)=="/"?np:tp,!0))),(p=this.i.toString())&&a.push("?",p),(p=this.m)&&a.push("#",qn(p,rp)),a.join("")},dt.prototype.resolve=function(a){const u=je(this);let p=!!a.j;p?Bn(u,a.j):p=!!a.o,p?u.o=a.o:p=!!a.g,p?u.g=a.g:p=a.u!=null;var y=a.h;if(p)jn(u,a.u);else if(p=!!a.h){if(y.charAt(0)!="/")if(this.g&&!this.h)y="/"+y;else{var S=u.h.lastIndexOf("/");S!=-1&&(y=u.h.slice(0,S+1)+y)}if(S=y,S==".."||S==".")y="";else if(S.indexOf("./")!=-1||S.indexOf("/.")!=-1){y=S.lastIndexOf("/",0)==0,S=S.split("/");const C=[];for(let N=0;N<S.length;){const Q=S[N++];Q=="."?y&&N==S.length&&C.push(""):Q==".."?((C.length>1||C.length==1&&C[0]!="")&&C.pop(),y&&N==S.length&&C.push("")):(C.push(Q),y=!0)}y=C.join("/")}else y=S}return p?u.h=y:p=a.i.toString()!=="",p?Ei(u,Ka(a.i)):p=!!a.m,p&&(u.m=a.m),u};function je(a){return new dt(a)}function Bn(a,u,p){a.j=p?zn(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function jn(a,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);a.u=u}else a.u=null}function Ei(a,u,p){u instanceof Hn?(a.i=u,ip(a.i,a.l)):(p||(u=qn(u,sp)),a.i=new Hn(u,a.l))}function re(a,u,p){a.i.set(u,p)}function Fs(a){return re(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function zn(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function qn(a,u,p){return typeof a=="string"?(a=encodeURI(a).replace(u,ep),p&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function ep(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var za=/[#\/\?@]/g,tp=/[#\?:]/g,np=/[#\?]/g,sp=/[#\?@]/g,rp=/#/g;function Hn(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function Bt(a){a.g||(a.g=new Map,a.h=0,a.i&&Zh(a.i,function(u,p){a.add(decodeURIComponent(u.replace(/\+/g," ")),p)}))}s=Hn.prototype,s.add=function(a,u){Bt(this),this.i=null,a=nn(this,a);let p=this.g.get(a);return p||this.g.set(a,p=[]),p.push(u),this.h+=1,this};function qa(a,u){Bt(a),u=nn(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Ha(a,u){return Bt(a),u=nn(a,u),a.g.has(u)}s.forEach=function(a,u){Bt(this),this.g.forEach(function(p,y){p.forEach(function(S){a.call(u,S,y,this)},this)},this)};function Ga(a,u){Bt(a);let p=[];if(typeof u=="string")Ha(a,u)&&(p=p.concat(a.g.get(nn(a,u))));else for(a=Array.from(a.g.values()),u=0;u<a.length;u++)p=p.concat(a[u]);return p}s.set=function(a,u){return Bt(this),this.i=null,a=nn(this,a),Ha(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},s.get=function(a,u){return a?(a=Ga(this,a),a.length>0?String(a[0]):u):u};function Wa(a,u,p){qa(a,u),p.length>0&&(a.i=null,a.g.set(nn(a,u),v(p)),a.h+=p.length)}s.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(let y=0;y<u.length;y++){var p=u[y];const S=Fn(p);p=Ga(this,p);for(let C=0;C<p.length;C++){let N=S;p[C]!==""&&(N+="="+Fn(p[C])),a.push(N)}}return this.i=a.join("&")};function Ka(a){const u=new Hn;return u.i=a.i,a.g&&(u.g=new Map(a.g),u.h=a.h),u}function nn(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function ip(a,u){u&&!a.j&&(Bt(a),a.i=null,a.g.forEach(function(p,y){const S=y.toLowerCase();y!=S&&(qa(this,y),Wa(this,S,p))},a)),a.j=u}function op(a,u){const p=new On;if(l.Image){const y=new Image;y.onload=f(ut,p,"TestLoadImage: loaded",!0,u,y),y.onerror=f(ut,p,"TestLoadImage: error",!1,u,y),y.onabort=f(ut,p,"TestLoadImage: abort",!1,u,y),y.ontimeout=f(ut,p,"TestLoadImage: timeout",!1,u,y),l.setTimeout(function(){y.ontimeout&&y.ontimeout()},1e4),y.src=a}else u(!1)}function ap(a,u){const p=new On,y=new AbortController,S=setTimeout(()=>{y.abort(),ut(p,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:y.signal}).then(C=>{clearTimeout(S),C.ok?ut(p,"TestPingServer: ok",!0,u):ut(p,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(S),ut(p,"TestPingServer: error",!1,u)})}function ut(a,u,p,y,S){try{S&&(S.onload=null,S.onerror=null,S.onabort=null,S.ontimeout=null),y(p)}catch{}}function lp(){this.g=new qh}function ki(a){this.i=a.Sb||null,this.h=a.ab||!1}m(ki,ka),ki.prototype.g=function(){return new Us(this.i,this.h)};function Us(a,u){we.call(this),this.H=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Us,we),s=Us.prototype,s.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=u,this.readyState=1,Wn(this)},s.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(u.body=a),(this.H||l).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},s.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Gn(this)),this.readyState=0},s.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Wn(this)),this.g&&(this.readyState=3,Wn(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Qa(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Qa(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}s.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?Gn(this):Wn(this),this.readyState==3&&Qa(this)}},s.Oa=function(a){this.g&&(this.response=this.responseText=a,Gn(this))},s.Na=function(a){this.g&&(this.response=a,Gn(this))},s.ga=function(){this.g&&Gn(this)};function Gn(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Wn(a)}s.setRequestHeader=function(a,u){this.A.append(a,u)},s.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},s.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var p=u.next();!p.done;)p=p.value,a.push(p[0]+": "+p[1]),p=u.next();return a.join(`\r
`)};function Wn(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Us.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Ya(a){let u="";return Vs(a,function(p,y){u+=y,u+=":",u+=p,u+=`\r
`}),u}function Ii(a,u,p){e:{for(y in p){var y=!1;break e}y=!0}y||(p=Ya(p),typeof a=="string"?p!=null&&Fn(p):re(a,u,p))}function ae(a){we.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(ae,we);var cp=/^https?$/i,dp=["POST","PUT"];s=ae.prototype,s.Fa=function(a){this.H=a},s.ea=function(a,u,p,y){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Pa.g(),this.g.onreadystatechange=b(h(this.Ca,this));try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(C){Ja(this,C);return}if(a=p||"",p=new Map(this.headers),y)if(Object.getPrototypeOf(y)===Object.prototype)for(var S in y)p.set(S,y[S]);else if(typeof y.keys=="function"&&typeof y.get=="function")for(const C of y.keys())p.set(C,y.get(C));else throw Error("Unknown input type for opt_headers: "+String(y));y=Array.from(p.keys()).find(C=>C.toLowerCase()=="content-type"),S=l.FormData&&a instanceof l.FormData,!(Array.prototype.indexOf.call(dp,u,void 0)>=0)||y||S||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[C,N]of p)this.g.setRequestHeader(C,N);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(C){Ja(this,C)}};function Ja(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.o=5,Xa(a),Bs(a)}function Xa(a){a.A||(a.A=!0,Ie(a,"complete"),Ie(a,"error"))}s.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Ie(this,"complete"),Ie(this,"abort"),Bs(this))},s.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Bs(this,!0)),ae.Z.N.call(this)},s.Ca=function(){this.u||(this.B||this.v||this.j?Za(this):this.Xa())},s.Xa=function(){Za(this)};function Za(a){if(a.h&&typeof o<"u"){if(a.v&&ht(a)==4)setTimeout(a.Ca.bind(a),0);else if(Ie(a,"readystatechange"),ht(a)==4){a.h=!1;try{const C=a.ca();e:switch(C){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var p;if(!(p=u)){var y;if(y=C===0){let N=String(a.D).match(ja)[1]||null;!N&&l.self&&l.self.location&&(N=l.self.location.protocol.slice(0,-1)),y=!cp.test(N?N.toLowerCase():"")}p=y}if(p)Ie(a,"complete"),Ie(a,"success");else{a.o=6;try{var S=ht(a)>2?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.ca()+"]",Xa(a)}}finally{Bs(a)}}}}function Bs(a,u){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const p=a.g;a.g=null,u||Ie(a,"ready");try{p.onreadystatechange=null}catch{}}}s.isActive=function(){return!!this.g};function ht(a){return a.g?a.g.readyState:0}s.ca=function(){try{return ht(this)>2?this.g.status:-1}catch{return-1}},s.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},s.La=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),zh(u)}};function el(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function up(a){const u={};a=(a.g&&ht(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let y=0;y<a.length;y++){if(w(a[y]))continue;var p=Qh(a[y]);const S=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const C=u[S]||[];u[S]=C,C.push(p)}$h(u,function(y){return y.join(", ")})}s.ya=function(){return this.o},s.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Kn(a,u,p){return p&&p.internalChannelParams&&p.internalChannelParams[a]||u}function tl(a){this.za=0,this.i=[],this.j=new On,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Kn("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Kn("baseRetryDelayMs",5e3,a),this.Za=Kn("retryDelaySeedMs",1e4,a),this.Ta=Kn("forwardChannelMaxRetries",2,a),this.va=Kn("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new $a(a&&a.concurrentRequestLimit),this.Ba=new lp,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}s=tl.prototype,s.ka=8,s.I=1,s.connect=function(a,u,p,y){Te(0),this.W=a,this.H=u||{},p&&y!==void 0&&(this.H.OSID=p,this.H.OAID=y),this.F=this.X,this.J=dl(this,null,this.W),zs(this)};function Ti(a){if(nl(a),a.I==3){var u=a.V++,p=je(a.J);if(re(p,"SID",a.M),re(p,"RID",u),re(p,"TYPE","terminate"),Qn(a,p),u=new ct(a,a.j,u),u.M=2,u.A=Fs(je(p)),p=!1,l.navigator&&l.navigator.sendBeacon)try{p=l.navigator.sendBeacon(u.A.toString(),"")}catch{}!p&&l.Image&&(new Image().src=u.A,p=!0),p||(u.g=ul(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Os(u)}cl(a)}function js(a){a.g&&(Ai(a),a.g.cancel(),a.g=null)}function nl(a){js(a),a.v&&(l.clearTimeout(a.v),a.v=null),qs(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&l.clearTimeout(a.m),a.m=null)}function zs(a){if(!Oa(a.h)&&!a.m){a.m=!0;var u=a.Ea;G||x(),Z||(G(),Z=!0),E.add(u,a),a.D=0}}function hp(a,u){return Fa(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=u.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=$n(h(a.Ea,a,u),ll(a,a.D)),a.D++,!0)}s.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const S=new ct(this,this.j,a);let C=this.o;if(this.U&&(C?(C=fa(C),ma(C,this.U)):C=this.U),this.u!==null||this.R||(S.J=C,C=null),this.S)e:{for(var u=0,p=0;p<this.i.length;p++){t:{var y=this.i[p];if("__data__"in y.map&&(y=y.map.__data__,typeof y=="string")){y=y.length;break t}y=void 0}if(y===void 0)break;if(u+=y,u>4096){u=p;break e}if(u===4096||p===this.i.length-1){u=p+1;break e}}u=1e3}else u=1e3;u=rl(this,S,u),p=je(this.J),re(p,"RID",a),re(p,"CVER",22),this.G&&re(p,"X-HTTP-Session-Id",this.G),Qn(this,p),C&&(this.R?u="headers="+Fn(Ya(C))+"&"+u:this.u&&Ii(p,this.u,C)),_i(this.h,S),this.Ra&&re(p,"TYPE","init"),this.S?(re(p,"$req",u),re(p,"SID","null"),S.U=!0,bi(S,p,null)):bi(S,p,u),this.I=2}}else this.I==3&&(a?sl(this,a):this.i.length==0||Oa(this.h)||sl(this))};function sl(a,u){var p;u?p=u.l:p=a.V++;const y=je(a.J);re(y,"SID",a.M),re(y,"RID",p),re(y,"AID",a.K),Qn(a,y),a.u&&a.o&&Ii(y,a.u,a.o),p=new ct(a,a.j,p,a.D+1),a.u===null&&(p.J=a.o),u&&(a.i=u.G.concat(a.i)),u=rl(a,p,1e3),p.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),_i(a.h,p),bi(p,y,u)}function Qn(a,u){a.H&&Vs(a.H,function(p,y){re(u,y,p)}),a.l&&Vs({},function(p,y){re(u,y,p)})}function rl(a,u,p){p=Math.min(a.i.length,p);const y=a.l?h(a.l.Ka,a.l,a):null;e:{var S=a.i;let Q=-1;for(;;){const fe=["count="+p];Q==-1?p>0?(Q=S[0].g,fe.push("ofs="+Q)):Q=0:fe.push("ofs="+Q);let ne=!0;for(let me=0;me<p;me++){var C=S[me].g;const ze=S[me].map;if(C-=Q,C<0)Q=Math.max(0,S[me].g-100),ne=!1;else try{C="req"+C+"_"||"";try{var N=ze instanceof Map?ze:Object.entries(ze);for(const[zt,pt]of N){let ft=pt;c(pt)&&(ft=pi(pt)),fe.push(C+zt+"="+encodeURIComponent(ft))}}catch(zt){throw fe.push(C+"type="+encodeURIComponent("_badmap")),zt}}catch{y&&y(ze)}}if(ne){N=fe.join("&");break e}}N=void 0}return a=a.i.splice(0,p),u.G=a,N}function il(a){if(!a.g&&!a.v){a.Y=1;var u=a.Da;G||x(),Z||(G(),Z=!0),E.add(u,a),a.A=0}}function Si(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=$n(h(a.Da,a),ll(a,a.A)),a.A++,!0)}s.Da=function(){if(this.v=null,ol(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=$n(h(this.Wa,this),a)}},s.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Te(10),js(this),ol(this))};function Ai(a){a.B!=null&&(l.clearTimeout(a.B),a.B=null)}function ol(a){a.g=new ct(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var u=je(a.na);re(u,"RID","rpc"),re(u,"SID",a.M),re(u,"AID",a.K),re(u,"CI",a.F?"0":"1"),!a.F&&a.ia&&re(u,"TO",a.ia),re(u,"TYPE","xmlhttp"),Qn(a,u),a.u&&a.o&&Ii(u,a.u,a.o),a.O&&(a.g.H=a.O);var p=a.g;a=a.ba,p.M=1,p.A=Fs(je(u)),p.u=null,p.R=!0,Ma(p,a)}s.Va=function(){this.C!=null&&(this.C=null,js(this),Si(this),Te(19))};function qs(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function al(a,u){var p=null;if(a.g==u){qs(a),Ai(a),a.g=null;var y=2}else if(wi(a.h,u))p=u.G,Ua(a.h,u),y=1;else return;if(a.I!=0){if(u.o)if(y==1){p=u.u?u.u.length:0,u=Date.now()-u.F;var S=a.D;y=Ls(),Ie(y,new Ra(y,p)),zs(a)}else il(a);else if(S=u.m,S==3||S==0&&u.X>0||!(y==1&&hp(a,u)||y==2&&Si(a)))switch(p&&p.length>0&&(u=a.h,u.i=u.i.concat(p)),S){case 1:jt(a,5);break;case 4:jt(a,10);break;case 3:jt(a,6);break;default:jt(a,2)}}}function ll(a,u){let p=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(p*=2),p*u}function jt(a,u){if(a.j.info("Error code "+u),u==2){var p=h(a.bb,a),y=a.Ua;const S=!y;y=new dt(y||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Bn(y,"https"),Fs(y),S?op(y.toString(),p):ap(y.toString(),p)}else Te(2);a.I=0,a.l&&a.l.pa(u),cl(a),nl(a)}s.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Te(2)):(this.j.info("Failed to ping google.com"),Te(1))};function cl(a){if(a.I=0,a.ja=[],a.l){const u=Ba(a.h);(u.length!=0||a.i.length!=0)&&(T(a.ja,u),T(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function dl(a,u,p){var y=p instanceof dt?je(p):new dt(p);if(y.g!="")u&&(y.g=u+"."+y.g),jn(y,y.u);else{var S=l.location;y=S.protocol,u=u?u+"."+S.hostname:S.hostname,S=+S.port;const C=new dt(null);y&&Bn(C,y),u&&(C.g=u),S&&jn(C,S),p&&(C.h=p),y=C}return p=a.G,u=a.wa,p&&u&&re(y,p,u),re(y,"VER",a.ka),Qn(a,y),y}function ul(a,u,p){if(u&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Aa&&!a.ma?new ae(new ki({ab:p})):new ae(a.ma),u.Fa(a.L),u}s.isActive=function(){return!!this.l&&this.l.isActive(this)};function hl(){}s=hl.prototype,s.ra=function(){},s.qa=function(){},s.pa=function(){},s.oa=function(){},s.isActive=function(){return!0},s.Ka=function(){};function Hs(){}Hs.prototype.g=function(a,u){return new De(a,u)};function De(a,u){we.call(this),this.g=new tl(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(a?a["X-WebChannel-Client-Profile"]=u.sa:a={"X-WebChannel-Client-Profile":u.sa}),this.g.U=a,(a=u&&u.Qb)&&!w(a)&&(this.g.u=a),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!w(u)&&(this.g.G=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new sn(this)}m(De,we),De.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},De.prototype.close=function(){Ti(this.g)},De.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var p={};p.__data__=a,a=p}else this.v&&(p={},p.__data__=pi(a),a=p);u.i.push(new Xh(u.Ya++,a)),u.I==3&&zs(u)},De.prototype.N=function(){this.g.l=null,delete this.j,Ti(this.g),delete this.g,De.Z.N.call(this)};function pl(a){fi.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const p in u){a=p;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}m(pl,fi);function fl(){gi.call(this),this.status=1}m(fl,gi);function sn(a){this.g=a}m(sn,hl),sn.prototype.ra=function(){Ie(this.g,"a")},sn.prototype.qa=function(a){Ie(this.g,new pl(a))},sn.prototype.pa=function(a){Ie(this.g,new fl)},sn.prototype.oa=function(){Ie(this.g,"b")},Hs.prototype.createWebChannel=Hs.prototype.g,De.prototype.send=De.prototype.o,De.prototype.open=De.prototype.m,De.prototype.close=De.prototype.close,hd=function(){return new Hs},ud=function(){return Ls()},dd=Ft,Xi={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},$s.NO_ERROR=0,$s.TIMEOUT=8,$s.HTTP_ERROR=6,nr=$s,Ca.COMPLETE="complete",cd=Ca,Ia.EventType=Nn,Nn.OPEN="a",Nn.CLOSE="b",Nn.ERROR="c",Nn.MESSAGE="d",we.prototype.listen=we.prototype.J,Jn=Ia,ae.prototype.listenOnce=ae.prototype.K,ae.prototype.getLastError=ae.prototype.Ha,ae.prototype.getLastErrorCode=ae.prototype.ya,ae.prototype.getStatus=ae.prototype.ca,ae.prototype.getResponseJson=ae.prototype.La,ae.prototype.getResponseText=ae.prototype.la,ae.prototype.send=ae.prototype.ea,ae.prototype.setWithCredentials=ae.prototype.Fa,ld=ae}).apply(typeof Ws<"u"?Ws:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Re.UNAUTHENTICATED=new Re(null),Re.GOOGLE_CREDENTIALS=new Re("google-credentials-uid"),Re.FIRST_PARTY=new Re("first-party-uid"),Re.MOCK_USER=new Re("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let An="12.12.0";function Jf(s){An=s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=new wo("@firebase/firestore");function an(){return Qt.logLevel}function O(s,...e){if(Qt.logLevel<=Y.DEBUG){const n=e.map(ko);Qt.debug(`Firestore (${An}): ${s}`,...n)}}function rt(s,...e){if(Qt.logLevel<=Y.ERROR){const n=e.map(ko);Qt.error(`Firestore (${An}): ${s}`,...n)}}function vn(s,...e){if(Qt.logLevel<=Y.WARN){const n=e.map(ko);Qt.warn(`Firestore (${An}): ${s}`,...n)}}function ko(s){if(typeof s=="string")return s;try{return(function(n){return JSON.stringify(n)})(s)}catch{return s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(s,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,pd(s,r,n)}function pd(s,e,n){let r=`FIRESTORE (${An}) INTERNAL ASSERTION FAILED: ${e} (ID: ${s.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw rt(r),new Error(r)}function te(s,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,s||pd(e,i,r)}function K(s,e){return s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends lt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(){this.promise=new Promise(((e,n)=>{this.resolve=e,this.reject=n}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xf{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Zf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable((()=>n(Re.UNAUTHENTICATED)))}shutdown(){}}class eg{constructor(e){this.t=e,this.currentUser=Re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){te(this.o===void 0,42304);let r=this.i;const i=d=>this.i!==r?(r=this.i,n(d)):Promise.resolve();let o=new nt;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new nt,e.enqueueRetryable((()=>i(this.currentUser)))};const l=()=>{const d=o;e.enqueueRetryable((async()=>{await d.promise,await i(this.currentUser)}))},c=d=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=d,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((d=>c(d))),setTimeout((()=>{if(!this.auth){const d=this.t.getImmediate({optional:!0});d?c(d):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new nt)}}),0),l()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then((r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(te(typeof r.accessToken=="string",31837,{l:r}),new Xf(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return te(e===null||typeof e=="string",2055,{h:e}),new Re(e)}}class tg{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=Re.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class ng{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new tg(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable((()=>n(Re.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Tl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class sg{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,$e(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){te(this.o===void 0,3512);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const l=o.token!==this.m;return this.m=o.token,O("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?n(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>r(o)))};const i=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>i(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?i(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Tl(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((n=>n?(te(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new Tl(n.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(s){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(s);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<s;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=rg(40);for(let o=0;o<i.length;++o)r.length<20&&i[o]<n&&(r+=e.charAt(i[o]%62))}return r}}function J(s,e){return s<e?-1:s>e?1:0}function Zi(s,e){const n=Math.min(s.length,e.length);for(let r=0;r<n;r++){const i=s.charAt(r),o=e.charAt(r);if(i!==o)return Ni(i)===Ni(o)?J(i,o):Ni(i)?1:-1}return J(s.length,e.length)}const ig=55296,og=57343;function Ni(s){const e=s.charCodeAt(0);return e>=ig&&e<=og}function xn(s,e,n){return s.length===e.length&&s.every(((r,i)=>n(r,e[i])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sl="__name__";class qe{constructor(e,n,r){n===void 0?n=0:n>e.length&&z(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&z(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return qe.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof qe?e.forEach((r=>{n.push(r)})):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const o=qe.compareSegments(e.get(i),n.get(i));if(o!==0)return o}return J(e.length,n.length)}static compareSegments(e,n){const r=qe.isNumericId(e),i=qe.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?qe.extractNumericId(e).compare(qe.extractNumericId(n)):Zi(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Tt.fromString(e.substring(4,e.length-2))}}class se extends qe{construct(e,n,r){return new se(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new $(D.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter((i=>i.length>0)))}return new se(n)}static emptyPath(){return new se([])}}const ag=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ve extends qe{construct(e,n,r){return new ve(e,n,r)}static isValidIdentifier(e){return ag.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ve.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Sl}static keyField(){return new ve([Sl])}static fromServerFormat(e){const n=[];let r="",i=0;const o=()=>{if(r.length===0)throw new $(D.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let l=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new $(D.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const d=e[i+1];if(d!=="\\"&&d!=="."&&d!=="`")throw new $(D.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=d,i+=2}else c==="`"?(l=!l,i++):c!=="."||l?(r+=c,i++):(o(),i++)}if(o(),l)throw new $(D.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ve(n)}static emptyPath(){return new ve([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e){this.path=e}static fromPath(e){return new U(se.fromString(e))}static fromName(e){return new U(se.fromString(e).popFirst(5))}static empty(){return new U(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return se.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new U(new se(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fd(s,e,n){if(!n)throw new $(D.INVALID_ARGUMENT,`Function ${s}() cannot be called with an empty ${e}.`)}function lg(s,e,n,r){if(e===!0&&r===!0)throw new $(D.INVALID_ARGUMENT,`${s} and ${n} cannot be used together.`)}function Al(s){if(!U.isDocumentKey(s))throw new $(D.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${s} has ${s.length}.`)}function Rl(s){if(U.isDocumentKey(s))throw new $(D.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${s} has ${s.length}.`)}function gd(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}function Lr(s){if(s===void 0)return"undefined";if(s===null)return"null";if(typeof s=="string")return s.length>20&&(s=`${s.substring(0,20)}...`),JSON.stringify(s);if(typeof s=="number"||typeof s=="boolean")return""+s;if(typeof s=="object"){if(s instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(s);return e?`a custom ${e} object`:"an object"}}return typeof s=="function"?"a function":z(12329,{type:typeof s})}function Xe(s,e){if("_delegate"in s&&(s=s._delegate),!(s instanceof e)){if(e.name===s.constructor.name)throw new $(D.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Lr(s);throw new $(D.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return s}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(s,e){const n={typeString:s};return e&&(n.value=e),n}function _s(s,e){if(!gd(s))throw new $(D.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in s)){n=`JSON missing required field: '${r}'`;break}const l=s[r];if(i&&typeof l!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(o!==void 0&&l!==o.value){n=`Expected '${r}' field to equal '${o.value}'`;break}}if(n)throw new $(D.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cl=-62135596800,Pl=1e6;class ie{static now(){return ie.fromMillis(Date.now())}static fromDate(e){return ie.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Pl);return new ie(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<Cl)throw new $(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Pl}_compareTo(e){return this.seconds===e.seconds?J(this.nanoseconds,e.nanoseconds):J(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ie._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(_s(e,ie._jsonSchema))return new ie(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Cl;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ie._jsonSchemaVersion="firestore/timestamp/1.0",ie._jsonSchema={type:pe("string",ie._jsonSchemaVersion),seconds:pe("number"),nanoseconds:pe("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{static fromTimestamp(e){return new W(e)}static min(){return new W(new ie(0,0))}static max(){return new W(new ie(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds=-1;function cg(s,e){const n=s.toTimestamp().seconds,r=s.toTimestamp().nanoseconds+1,i=W.fromTimestamp(r===1e9?new ie(n+1,0):new ie(n,r));return new Rt(i,U.empty(),e)}function dg(s){return new Rt(s.readTime,s.key,ds)}class Rt{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Rt(W.min(),U.empty(),ds)}static max(){return new Rt(W.max(),U.empty(),ds)}}function ug(s,e){let n=s.readTime.compareTo(e.readTime);return n!==0?n:(n=U.comparator(s.documentKey,e.documentKey),n!==0?n:J(s.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hg="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class pg{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rn(s){if(s.code!==D.FAILED_PRECONDITION||s.message!==hg)throw s;O("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)}),(n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)}))}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&z(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new V(((r,i)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,i)},this.catchCallback=o=>{this.wrapFailure(n,o).next(r,i)}}))}toPromise(){return new Promise(((e,n)=>{this.next(e,n)}))}wrapUserFunction(e){try{const n=e();return n instanceof V?n:V.resolve(n)}catch(n){return V.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction((()=>e(n))):V.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction((()=>e(n))):V.reject(n)}static resolve(e){return new V(((n,r)=>{n(e)}))}static reject(e){return new V(((n,r)=>{r(e)}))}static waitFor(e){return new V(((n,r)=>{let i=0,o=0,l=!1;e.forEach((c=>{++i,c.next((()=>{++o,l&&o===i&&n()}),(d=>r(d)))})),l=!0,o===i&&n()}))}static or(e){let n=V.resolve(!1);for(const r of e)n=n.next((i=>i?V.resolve(i):r()));return n}static forEach(e,n){const r=[];return e.forEach(((i,o)=>{r.push(n.call(this,i,o))})),this.waitFor(r)}static mapArray(e,n){return new V(((r,i)=>{const o=e.length,l=new Array(o);let c=0;for(let d=0;d<o;d++){const h=d;n(e[h]).next((f=>{l[h]=f,++c,c===o&&r(l)}),(f=>i(f)))}}))}static doWhile(e,n){return new V(((r,i)=>{const o=()=>{e()===!0?n().next((()=>{o()}),i):r()};o()}))}}function fg(s){const e=s.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Cn(s){return s.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $r{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>n.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}$r.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const To=-1;function Or(s){return s==null}function fr(s){return s===0&&1/s==-1/0}function gg(s){return typeof s=="number"&&Number.isInteger(s)&&!fr(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const md="";function mg(s){let e="";for(let n=0;n<s.length;n++)e.length>0&&(e=Dl(e)),e=yg(s.get(n),e);return Dl(e)}function yg(s,e){let n=e;const r=s.length;for(let i=0;i<r;i++){const o=s.charAt(i);switch(o){case"\0":n+="";break;case md:n+="";break;default:n+=o}}return n}function Dl(s){return s+md+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(s){let e=0;for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&e++;return e}function Lt(s,e){for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&e(n,s[n])}function yd(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,n){this.comparator=e,this.root=n||be.EMPTY}insert(e,n){return new oe(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,be.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,be.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((n,r)=>(e(n,r),!1)))}toString(){const e=[];return this.inorderTraversal(((n,r)=>(e.push(`${n}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ks(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ks(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ks(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ks(this.root,e,this.comparator,!0)}}class Ks{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=n?r(e.key,n):1,n&&i&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class be{constructor(e,n,r,i,o){this.key=e,this.value=n,this.color=r??be.RED,this.left=i??be.EMPTY,this.right=o??be.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,o){return new be(e??this.key,n??this.value,r??this.color,i??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const o=r(e,i.key);return i=o<0?i.copy(null,null,null,i.left.insert(e,n,r),null):o===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return be.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return be.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,be.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,be.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw z(43730,{key:this.key,value:this.value});if(this.right.isRed())throw z(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw z(27949);return e+(this.isRed()?0:1)}}be.EMPTY=null,be.RED=!0,be.BLACK=!1;be.EMPTY=new class{constructor(){this.size=0}get key(){throw z(57766)}get value(){throw z(16141)}get color(){throw z(16727)}get left(){throw z(29726)}get right(){throw z(36894)}copy(e,n,r,i,o){return this}insert(e,n,r){return new be(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((n,r)=>(e(n),!1)))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Ml(this.data.getIterator())}getIteratorFrom(e){return new Ml(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach((r=>{n=n.add(r)})),n}isEqual(e){if(!(e instanceof ge)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,o=r.getNext().key;if(this.comparator(i,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((n=>{e.push(n)})),e}toString(){const e=[];return this.forEach((n=>e.push(n))),"SortedSet("+e.toString()+")"}copy(e){const n=new ge(this.comparator);return n.data=e,n}}class Ml{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.fields=e,e.sort(ve.comparator)}static empty(){return new Ve([])}unionWith(e){let n=new ge(ve.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Ve(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return xn(this.fields,e.fields,((n,r)=>n.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.binaryString=e}static fromBase64String(e){const n=(function(i){try{return atob(i)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new bd("Invalid base64 string: "+o):o}})(e);return new xe(n)}static fromUint8Array(e){const n=(function(i){let o="";for(let l=0;l<i.length;++l)o+=String.fromCharCode(i[l]);return o})(e);return new xe(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(n){return btoa(n)})(this.binaryString)}toUint8Array(){return(function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return J(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}xe.EMPTY_BYTE_STRING=new xe("");const bg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ct(s){if(te(!!s,39018),typeof s=="string"){let e=0;const n=bg.exec(s);if(te(!!n,46558,{timestamp:s}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(s);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ce(s.seconds),nanos:ce(s.nanos)}}function ce(s){return typeof s=="number"?s:typeof s=="string"?Number(s):0}function Pt(s){return typeof s=="string"?xe.fromBase64String(s):xe.fromUint8Array(s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd="server_timestamp",xd="__type__",wd="__previous_value__",_d="__local_write_time__";function So(s){var n,r;return((r=(((n=s==null?void 0:s.mapValue)==null?void 0:n.fields)||{})[xd])==null?void 0:r.stringValue)===vd}function Fr(s){const e=s.mapValue.fields[wd];return So(e)?Fr(e):e}function us(s){const e=Ct(s.mapValue.fields[_d].timestampValue);return new ie(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vg{constructor(e,n,r,i,o,l,c,d,h,f,m){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=o,this.forceLongPolling=l,this.autoDetectLongPolling=c,this.longPollingOptions=d,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=m}}const gr="(default)";class hs{constructor(e,n){this.projectId=e,this.database=n||gr}static empty(){return new hs("","")}get isDefaultDatabase(){return this.database===gr}isEqual(e){return e instanceof hs&&e.projectId===this.projectId&&e.database===this.database}}function xg(s,e){if(!Object.prototype.hasOwnProperty.apply(s.options,["projectId"]))throw new $(D.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new hs(s.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed="__type__",wg="__max__",Qs={mapValue:{}},kd="__vector__",mr="value";function Dt(s){return"nullValue"in s?0:"booleanValue"in s?1:"integerValue"in s||"doubleValue"in s?2:"timestampValue"in s?3:"stringValue"in s?5:"bytesValue"in s?6:"referenceValue"in s?7:"geoPointValue"in s?8:"arrayValue"in s?9:"mapValue"in s?So(s)?4:Eg(s)?9007199254740991:_g(s)?10:11:z(28295,{value:s})}function Ze(s,e){if(s===e)return!0;const n=Dt(s);if(n!==Dt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return s.booleanValue===e.booleanValue;case 4:return us(s).isEqual(us(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const l=Ct(i.timestampValue),c=Ct(o.timestampValue);return l.seconds===c.seconds&&l.nanos===c.nanos})(s,e);case 5:return s.stringValue===e.stringValue;case 6:return(function(i,o){return Pt(i.bytesValue).isEqual(Pt(o.bytesValue))})(s,e);case 7:return s.referenceValue===e.referenceValue;case 8:return(function(i,o){return ce(i.geoPointValue.latitude)===ce(o.geoPointValue.latitude)&&ce(i.geoPointValue.longitude)===ce(o.geoPointValue.longitude)})(s,e);case 2:return(function(i,o){if("integerValue"in i&&"integerValue"in o)return ce(i.integerValue)===ce(o.integerValue);if("doubleValue"in i&&"doubleValue"in o){const l=ce(i.doubleValue),c=ce(o.doubleValue);return l===c?fr(l)===fr(c):isNaN(l)&&isNaN(c)}return!1})(s,e);case 9:return xn(s.arrayValue.values||[],e.arrayValue.values||[],Ze);case 10:case 11:return(function(i,o){const l=i.mapValue.fields||{},c=o.mapValue.fields||{};if(Vl(l)!==Vl(c))return!1;for(const d in l)if(l.hasOwnProperty(d)&&(c[d]===void 0||!Ze(l[d],c[d])))return!1;return!0})(s,e);default:return z(52216,{left:s})}}function ps(s,e){return(s.values||[]).find((n=>Ze(n,e)))!==void 0}function wn(s,e){if(s===e)return 0;const n=Dt(s),r=Dt(e);if(n!==r)return J(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return J(s.booleanValue,e.booleanValue);case 2:return(function(o,l){const c=ce(o.integerValue||o.doubleValue),d=ce(l.integerValue||l.doubleValue);return c<d?-1:c>d?1:c===d?0:isNaN(c)?isNaN(d)?0:-1:1})(s,e);case 3:return Nl(s.timestampValue,e.timestampValue);case 4:return Nl(us(s),us(e));case 5:return Zi(s.stringValue,e.stringValue);case 6:return(function(o,l){const c=Pt(o),d=Pt(l);return c.compareTo(d)})(s.bytesValue,e.bytesValue);case 7:return(function(o,l){const c=o.split("/"),d=l.split("/");for(let h=0;h<c.length&&h<d.length;h++){const f=J(c[h],d[h]);if(f!==0)return f}return J(c.length,d.length)})(s.referenceValue,e.referenceValue);case 8:return(function(o,l){const c=J(ce(o.latitude),ce(l.latitude));return c!==0?c:J(ce(o.longitude),ce(l.longitude))})(s.geoPointValue,e.geoPointValue);case 9:return Ll(s.arrayValue,e.arrayValue);case 10:return(function(o,l){var b,v,T,R;const c=o.fields||{},d=l.fields||{},h=(b=c[mr])==null?void 0:b.arrayValue,f=(v=d[mr])==null?void 0:v.arrayValue,m=J(((T=h==null?void 0:h.values)==null?void 0:T.length)||0,((R=f==null?void 0:f.values)==null?void 0:R.length)||0);return m!==0?m:Ll(h,f)})(s.mapValue,e.mapValue);case 11:return(function(o,l){if(o===Qs.mapValue&&l===Qs.mapValue)return 0;if(o===Qs.mapValue)return 1;if(l===Qs.mapValue)return-1;const c=o.fields||{},d=Object.keys(c),h=l.fields||{},f=Object.keys(h);d.sort(),f.sort();for(let m=0;m<d.length&&m<f.length;++m){const b=Zi(d[m],f[m]);if(b!==0)return b;const v=wn(c[d[m]],h[f[m]]);if(v!==0)return v}return J(d.length,f.length)})(s.mapValue,e.mapValue);default:throw z(23264,{he:n})}}function Nl(s,e){if(typeof s=="string"&&typeof e=="string"&&s.length===e.length)return J(s,e);const n=Ct(s),r=Ct(e),i=J(n.seconds,r.seconds);return i!==0?i:J(n.nanos,r.nanos)}function Ll(s,e){const n=s.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const o=wn(n[i],r[i]);if(o)return o}return J(n.length,r.length)}function _n(s){return eo(s)}function eo(s){return"nullValue"in s?"null":"booleanValue"in s?""+s.booleanValue:"integerValue"in s?""+s.integerValue:"doubleValue"in s?""+s.doubleValue:"timestampValue"in s?(function(n){const r=Ct(n);return`time(${r.seconds},${r.nanos})`})(s.timestampValue):"stringValue"in s?s.stringValue:"bytesValue"in s?(function(n){return Pt(n).toBase64()})(s.bytesValue):"referenceValue"in s?(function(n){return U.fromName(n).toString()})(s.referenceValue):"geoPointValue"in s?(function(n){return`geo(${n.latitude},${n.longitude})`})(s.geoPointValue):"arrayValue"in s?(function(n){let r="[",i=!0;for(const o of n.values||[])i?i=!1:r+=",",r+=eo(o);return r+"]"})(s.arrayValue):"mapValue"in s?(function(n){const r=Object.keys(n.fields||{}).sort();let i="{",o=!0;for(const l of r)o?o=!1:i+=",",i+=`${l}:${eo(n.fields[l])}`;return i+"}"})(s.mapValue):z(61005,{value:s})}function sr(s){switch(Dt(s)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Fr(s);return e?16+sr(e):16;case 5:return 2*s.stringValue.length;case 6:return Pt(s.bytesValue).approximateByteSize();case 7:return s.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((i,o)=>i+sr(o)),0)})(s.arrayValue);case 10:case 11:return(function(r){let i=0;return Lt(r.fields,((o,l)=>{i+=o.length+sr(l)})),i})(s.mapValue);default:throw z(13486,{value:s})}}function $l(s,e){return{referenceValue:`projects/${s.projectId}/databases/${s.database}/documents/${e.path.canonicalString()}`}}function to(s){return!!s&&"integerValue"in s}function Ao(s){return!!s&&"arrayValue"in s}function Ol(s){return!!s&&"nullValue"in s}function Fl(s){return!!s&&"doubleValue"in s&&isNaN(Number(s.doubleValue))}function rr(s){return!!s&&"mapValue"in s}function _g(s){var n,r;return((r=(((n=s==null?void 0:s.mapValue)==null?void 0:n.fields)||{})[Ed])==null?void 0:r.stringValue)===kd}function ts(s){if(s.geoPointValue)return{geoPointValue:{...s.geoPointValue}};if(s.timestampValue&&typeof s.timestampValue=="object")return{timestampValue:{...s.timestampValue}};if(s.mapValue){const e={mapValue:{fields:{}}};return Lt(s.mapValue.fields,((n,r)=>e.mapValue.fields[n]=ts(r))),e}if(s.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(s.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ts(s.arrayValue.values[n]);return e}return{...s}}function Eg(s){return(((s.mapValue||{}).fields||{}).__type__||{}).stringValue===wg}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.value=e}static empty(){return new Pe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!rr(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ts(n)}setAll(e){let n=ve.emptyPath(),r={},i=[];e.forEach(((l,c)=>{if(!n.isImmediateParentOf(c)){const d=this.getFieldsMap(n);this.applyChanges(d,r,i),r={},i=[],n=c.popLast()}l?r[c.lastSegment()]=ts(l):i.push(c.lastSegment())}));const o=this.getFieldsMap(n);this.applyChanges(o,r,i)}delete(e){const n=this.field(e.popLast());rr(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Ze(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];rr(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Lt(n,((i,o)=>e[i]=o));for(const i of r)delete e[i]}clone(){return new Pe(ts(this.value))}}function Id(s){const e=[];return Lt(s.fields,((n,r)=>{const i=new ve([n]);if(rr(r)){const o=Id(r.mapValue).fields;if(o.length===0)e.push(i);else for(const l of o)e.push(i.child(l))}else e.push(i)})),new Ve(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e,n,r,i,o,l,c){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=o,this.data=l,this.documentState=c}static newInvalidDocument(e){return new Ee(e,0,W.min(),W.min(),W.min(),Pe.empty(),0)}static newFoundDocument(e,n,r,i){return new Ee(e,1,n,W.min(),r,i,0)}static newNoDocument(e,n){return new Ee(e,2,n,W.min(),W.min(),Pe.empty(),0)}static newUnknownDocument(e,n){return new Ee(e,3,n,W.min(),W.min(),Pe.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(W.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Pe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Pe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=W.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ee&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ee(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e,n){this.position=e,this.inclusive=n}}function Ul(s,e,n){let r=0;for(let i=0;i<s.position.length;i++){const o=e[i],l=s.position[i];if(o.field.isKeyField()?r=U.comparator(U.fromName(l.referenceValue),n.key):r=wn(l,n.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Bl(s,e){if(s===null)return e===null;if(e===null||s.inclusive!==e.inclusive||s.position.length!==e.position.length)return!1;for(let n=0;n<s.position.length;n++)if(!Ze(s.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{constructor(e,n="asc"){this.field=e,this.dir=n}}function kg(s,e){return s.dir===e.dir&&s.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{}class he extends Td{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new Tg(e,n,r):n==="array-contains"?new Rg(e,r):n==="in"?new Cg(e,r):n==="not-in"?new Pg(e,r):n==="array-contains-any"?new Dg(e,r):new he(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new Sg(e,r):new Ag(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(wn(n,this.value)):n!==null&&Dt(this.value)===Dt(n)&&this.matchesComparison(wn(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return z(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ue extends Td{constructor(e,n){super(),this.filters=e,this.op=n,this.Pe=null}static create(e,n){return new Ue(e,n)}matches(e){return Sd(this)?this.filters.find((n=>!n.matches(e)))===void 0:this.filters.find((n=>n.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,n)=>e.concat(n.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Sd(s){return s.op==="and"}function Ad(s){return Ig(s)&&Sd(s)}function Ig(s){for(const e of s.filters)if(e instanceof Ue)return!1;return!0}function no(s){if(s instanceof he)return s.field.canonicalString()+s.op.toString()+_n(s.value);if(Ad(s))return s.filters.map((e=>no(e))).join(",");{const e=s.filters.map((n=>no(n))).join(",");return`${s.op}(${e})`}}function Rd(s,e){return s instanceof he?(function(r,i){return i instanceof he&&r.op===i.op&&r.field.isEqual(i.field)&&Ze(r.value,i.value)})(s,e):s instanceof Ue?(function(r,i){return i instanceof Ue&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce(((o,l,c)=>o&&Rd(l,i.filters[c])),!0):!1})(s,e):void z(19439)}function Cd(s){return s instanceof he?(function(n){return`${n.field.canonicalString()} ${n.op} ${_n(n.value)}`})(s):s instanceof Ue?(function(n){return n.op.toString()+" {"+n.getFilters().map(Cd).join(" ,")+"}"})(s):"Filter"}class Tg extends he{constructor(e,n,r){super(e,n,r),this.key=U.fromName(r.referenceValue)}matches(e){const n=U.comparator(e.key,this.key);return this.matchesComparison(n)}}class Sg extends he{constructor(e,n){super(e,"in",n),this.keys=Pd("in",n)}matches(e){return this.keys.some((n=>n.isEqual(e.key)))}}class Ag extends he{constructor(e,n){super(e,"not-in",n),this.keys=Pd("not-in",n)}matches(e){return!this.keys.some((n=>n.isEqual(e.key)))}}function Pd(s,e){var n;return(((n=e.arrayValue)==null?void 0:n.values)||[]).map((r=>U.fromName(r.referenceValue)))}class Rg extends he{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Ao(n)&&ps(n.arrayValue,this.value)}}class Cg extends he{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&ps(this.value.arrayValue,n)}}class Pg extends he{constructor(e,n){super(e,"not-in",n)}matches(e){if(ps(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!ps(this.value.arrayValue,n)}}class Dg extends he{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Ao(n)||!n.arrayValue.values)&&n.arrayValue.values.some((r=>ps(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vg{constructor(e,n=null,r=[],i=[],o=null,l=null,c=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=o,this.startAt=l,this.endAt=c,this.Te=null}}function jl(s,e=null,n=[],r=[],i=null,o=null,l=null){return new Vg(s,e,n,r,i,o,l)}function Ro(s){const e=K(s);if(e.Te===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map((r=>no(r))).join(","),n+="|ob:",n+=e.orderBy.map((r=>(function(o){return o.field.canonicalString()+o.dir})(r))).join(","),Or(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((r=>_n(r))).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((r=>_n(r))).join(",")),e.Te=n}return e.Te}function Co(s,e){if(s.limit!==e.limit||s.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<s.orderBy.length;n++)if(!kg(s.orderBy[n],e.orderBy[n]))return!1;if(s.filters.length!==e.filters.length)return!1;for(let n=0;n<s.filters.length;n++)if(!Rd(s.filters[n],e.filters[n]))return!1;return s.collectionGroup===e.collectionGroup&&!!s.path.isEqual(e.path)&&!!Bl(s.startAt,e.startAt)&&Bl(s.endAt,e.endAt)}function so(s){return U.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(e,n=null,r=[],i=[],o=null,l="F",c=null,d=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=o,this.limitType=l,this.startAt=c,this.endAt=d,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function Mg(s,e,n,r,i,o,l,c){return new Es(s,e,n,r,i,o,l,c)}function Po(s){return new Es(s)}function zl(s){return s.filters.length===0&&s.limit===null&&s.startAt==null&&s.endAt==null&&(s.explicitOrderBy.length===0||s.explicitOrderBy.length===1&&s.explicitOrderBy[0].field.isKeyField())}function Ng(s){return U.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}function Dd(s){return s.collectionGroup!==null}function ns(s){const e=K(s);if(e.Ee===null){e.Ee=[];const n=new Set;for(const o of e.explicitOrderBy)e.Ee.push(o),n.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let c=new ge(ve.comparator);return l.filters.forEach((d=>{d.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((o=>{n.has(o.canonicalString())||o.isKeyField()||e.Ee.push(new br(o,r))})),n.has(ve.keyField().canonicalString())||e.Ee.push(new br(ve.keyField(),r))}return e.Ee}function We(s){const e=K(s);return e.Ie||(e.Ie=Lg(e,ns(s))),e.Ie}function Lg(s,e){if(s.limitType==="F")return jl(s.path,s.collectionGroup,e,s.filters,s.limit,s.startAt,s.endAt);{e=e.map((i=>{const o=i.dir==="desc"?"asc":"desc";return new br(i.field,o)}));const n=s.endAt?new yr(s.endAt.position,s.endAt.inclusive):null,r=s.startAt?new yr(s.startAt.position,s.startAt.inclusive):null;return jl(s.path,s.collectionGroup,e,s.filters,s.limit,n,r)}}function ro(s,e){const n=s.filters.concat([e]);return new Es(s.path,s.collectionGroup,s.explicitOrderBy.slice(),n,s.limit,s.limitType,s.startAt,s.endAt)}function io(s,e,n){return new Es(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),e,n,s.startAt,s.endAt)}function Ur(s,e){return Co(We(s),We(e))&&s.limitType===e.limitType}function Vd(s){return`${Ro(We(s))}|lt:${s.limitType}`}function ln(s){return`Query(target=${(function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map((i=>Cd(i))).join(", ")}]`),Or(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map((i=>(function(l){return`${l.field.canonicalString()} (${l.dir})`})(i))).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map((i=>_n(i))).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map((i=>_n(i))).join(",")),`Target(${r})`})(We(s))}; limitType=${s.limitType})`}function Br(s,e){return e.isFoundDocument()&&(function(r,i){const o=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):U.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)})(s,e)&&(function(r,i){for(const o of ns(r))if(!o.field.isKeyField()&&i.data.field(o.field)===null)return!1;return!0})(s,e)&&(function(r,i){for(const o of r.filters)if(!o.matches(i))return!1;return!0})(s,e)&&(function(r,i){return!(r.startAt&&!(function(l,c,d){const h=Ul(l,c,d);return l.inclusive?h<=0:h<0})(r.startAt,ns(r),i)||r.endAt&&!(function(l,c,d){const h=Ul(l,c,d);return l.inclusive?h>=0:h>0})(r.endAt,ns(r),i))})(s,e)}function $g(s){return s.collectionGroup||(s.path.length%2==1?s.path.lastSegment():s.path.get(s.path.length-2))}function Md(s){return(e,n)=>{let r=!1;for(const i of ns(s)){const o=Og(i,e,n);if(o!==0)return o;r=r||i.field.isKeyField()}return 0}}function Og(s,e,n){const r=s.field.isKeyField()?U.comparator(e.key,n.key):(function(o,l,c){const d=l.data.field(o),h=c.data.field(o);return d!==null&&h!==null?wn(d,h):z(42886)})(s.field,e,n);switch(s.dir){case"asc":return r;case"desc":return-1*r;default:return z(19790,{direction:s.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,o]of r)if(this.equalsFn(i,e))return o}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return void(i[o]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Lt(this.inner,((n,r)=>{for(const[i,o]of r)e(i,o)}))}isEmpty(){return yd(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg=new oe(U.comparator);function it(){return Fg}const Nd=new oe(U.comparator);function Xn(...s){let e=Nd;for(const n of s)e=e.insert(n.key,n);return e}function Ld(s){let e=Nd;return s.forEach(((n,r)=>e=e.insert(n,r.overlayedDocument))),e}function Ht(){return ss()}function $d(){return ss()}function ss(){return new Xt((s=>s.toString()),((s,e)=>s.isEqual(e)))}const Ug=new oe(U.comparator),Bg=new ge(U.comparator);function X(...s){let e=Bg;for(const n of s)e=e.add(n);return e}const jg=new ge(J);function zg(){return jg}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(s,e){if(s.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:fr(e)?"-0":e}}function Od(s){return{integerValue:""+s}}function qg(s,e){return gg(e)?Od(e):Do(s,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jr{constructor(){this._=void 0}}function Hg(s,e,n){return s instanceof fs?(function(i,o){const l={fields:{[xd]:{stringValue:vd},[_d]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return o&&So(o)&&(o=Fr(o)),o&&(l.fields[wd]=o),{mapValue:l}})(n,e):s instanceof gs?Ud(s,e):s instanceof ms?Bd(s,e):(function(i,o){const l=Fd(i,o),c=ql(l)+ql(i.Ae);return to(l)&&to(i.Ae)?Od(c):Do(i.serializer,c)})(s,e)}function Gg(s,e,n){return s instanceof gs?Ud(s,e):s instanceof ms?Bd(s,e):n}function Fd(s,e){return s instanceof vr?(function(r){return to(r)||(function(o){return!!o&&"doubleValue"in o})(r)})(e)?e:{integerValue:0}:null}class fs extends jr{}class gs extends jr{constructor(e){super(),this.elements=e}}function Ud(s,e){const n=jd(e);for(const r of s.elements)n.some((i=>Ze(i,r)))||n.push(r);return{arrayValue:{values:n}}}class ms extends jr{constructor(e){super(),this.elements=e}}function Bd(s,e){let n=jd(e);for(const r of s.elements)n=n.filter((i=>!Ze(i,r)));return{arrayValue:{values:n}}}class vr extends jr{constructor(e,n){super(),this.serializer=e,this.Ae=n}}function ql(s){return ce(s.integerValue||s.doubleValue)}function jd(s){return Ao(s)&&s.arrayValue.values?s.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(e,n){this.field=e,this.transform=n}}function Kg(s,e){return s.field.isEqual(e.field)&&(function(r,i){return r instanceof gs&&i instanceof gs||r instanceof ms&&i instanceof ms?xn(r.elements,i.elements,Ze):r instanceof vr&&i instanceof vr?Ze(r.Ae,i.Ae):r instanceof fs&&i instanceof fs})(s.transform,e.transform)}class Qg{constructor(e,n){this.version=e,this.transformResults=n}}class Le{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new Le}static exists(e){return new Le(void 0,e)}static updateTime(e){return new Le(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ir(s,e){return s.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(s.updateTime):s.exists===void 0||s.exists===e.isFoundDocument()}class zr{}function zd(s,e){if(!s.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return s.isNoDocument()?new Vo(s.key,Le.none()):new ks(s.key,s.data,Le.none());{const n=s.data,r=Pe.empty();let i=new ge(ve.comparator);for(let o of e.fields)if(!i.has(o)){let l=n.field(o);l===null&&o.length>1&&(o=o.popLast(),l=n.field(o)),l===null?r.delete(o):r.set(o,l),i=i.add(o)}return new $t(s.key,r,new Ve(i.toArray()),Le.none())}}function Yg(s,e,n){s instanceof ks?(function(i,o,l){const c=i.value.clone(),d=Gl(i.fieldTransforms,o,l.transformResults);c.setAll(d),o.convertToFoundDocument(l.version,c).setHasCommittedMutations()})(s,e,n):s instanceof $t?(function(i,o,l){if(!ir(i.precondition,o))return void o.convertToUnknownDocument(l.version);const c=Gl(i.fieldTransforms,o,l.transformResults),d=o.data;d.setAll(qd(i)),d.setAll(c),o.convertToFoundDocument(l.version,d).setHasCommittedMutations()})(s,e,n):(function(i,o,l){o.convertToNoDocument(l.version).setHasCommittedMutations()})(0,e,n)}function rs(s,e,n,r){return s instanceof ks?(function(o,l,c,d){if(!ir(o.precondition,l))return c;const h=o.value.clone(),f=Wl(o.fieldTransforms,d,l);return h.setAll(f),l.convertToFoundDocument(l.version,h).setHasLocalMutations(),null})(s,e,n,r):s instanceof $t?(function(o,l,c,d){if(!ir(o.precondition,l))return c;const h=Wl(o.fieldTransforms,d,l),f=l.data;return f.setAll(qd(o)),f.setAll(h),l.convertToFoundDocument(l.version,f).setHasLocalMutations(),c===null?null:c.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((m=>m.field)))})(s,e,n,r):(function(o,l,c){return ir(o.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):c})(s,e,n)}function Jg(s,e){let n=null;for(const r of s.fieldTransforms){const i=e.data.field(r.field),o=Fd(r.transform,i||null);o!=null&&(n===null&&(n=Pe.empty()),n.set(r.field,o))}return n||null}function Hl(s,e){return s.type===e.type&&!!s.key.isEqual(e.key)&&!!s.precondition.isEqual(e.precondition)&&!!(function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&xn(r,i,((o,l)=>Kg(o,l)))})(s.fieldTransforms,e.fieldTransforms)&&(s.type===0?s.value.isEqual(e.value):s.type!==1||s.data.isEqual(e.data)&&s.fieldMask.isEqual(e.fieldMask))}class ks extends zr{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class $t extends zr{constructor(e,n,r,i,o=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function qd(s){const e=new Map;return s.fieldMask.fields.forEach((n=>{if(!n.isEmpty()){const r=s.data.field(n);e.set(n,r)}})),e}function Gl(s,e,n){const r=new Map;te(s.length===n.length,32656,{Ve:n.length,de:s.length});for(let i=0;i<n.length;i++){const o=s[i],l=o.transform,c=e.data.field(o.field);r.set(o.field,Gg(l,c,n[i]))}return r}function Wl(s,e,n){const r=new Map;for(const i of s){const o=i.transform,l=n.data.field(i.field);r.set(i.field,Hg(o,l,e))}return r}class Vo extends zr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Xg extends zr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zg{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const o=this.mutations[i];o.key.isEqual(e.key)&&Yg(o,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=rs(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=rs(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=$d();return this.mutations.forEach((i=>{const o=e.get(i.key),l=o.overlayedDocument;let c=this.applyToLocalView(l,o.mutatedFields);c=n.has(i.key)?null:c;const d=zd(l,c);d!==null&&r.set(i.key,d),l.isValidDocument()||l.convertToNoDocument(W.min())})),r}keys(){return this.mutations.reduce(((e,n)=>e.add(n.key)),X())}isEqual(e){return this.batchId===e.batchId&&xn(this.mutations,e.mutations,((n,r)=>Hl(n,r)))&&xn(this.baseMutations,e.baseMutations,((n,r)=>Hl(n,r)))}}class Mo{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){te(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let i=(function(){return Ug})();const o=e.mutations;for(let l=0;l<o.length;l++)i=i.insert(o[l].key,r[l].version);return new Mo(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class em{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tm{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ue,ee;function nm(s){switch(s){case D.OK:return z(64938);case D.CANCELLED:case D.UNKNOWN:case D.DEADLINE_EXCEEDED:case D.RESOURCE_EXHAUSTED:case D.INTERNAL:case D.UNAVAILABLE:case D.UNAUTHENTICATED:return!1;case D.INVALID_ARGUMENT:case D.NOT_FOUND:case D.ALREADY_EXISTS:case D.PERMISSION_DENIED:case D.FAILED_PRECONDITION:case D.ABORTED:case D.OUT_OF_RANGE:case D.UNIMPLEMENTED:case D.DATA_LOSS:return!0;default:return z(15467,{code:s})}}function Hd(s){if(s===void 0)return rt("GRPC error has no .code"),D.UNKNOWN;switch(s){case ue.OK:return D.OK;case ue.CANCELLED:return D.CANCELLED;case ue.UNKNOWN:return D.UNKNOWN;case ue.DEADLINE_EXCEEDED:return D.DEADLINE_EXCEEDED;case ue.RESOURCE_EXHAUSTED:return D.RESOURCE_EXHAUSTED;case ue.INTERNAL:return D.INTERNAL;case ue.UNAVAILABLE:return D.UNAVAILABLE;case ue.UNAUTHENTICATED:return D.UNAUTHENTICATED;case ue.INVALID_ARGUMENT:return D.INVALID_ARGUMENT;case ue.NOT_FOUND:return D.NOT_FOUND;case ue.ALREADY_EXISTS:return D.ALREADY_EXISTS;case ue.PERMISSION_DENIED:return D.PERMISSION_DENIED;case ue.FAILED_PRECONDITION:return D.FAILED_PRECONDITION;case ue.ABORTED:return D.ABORTED;case ue.OUT_OF_RANGE:return D.OUT_OF_RANGE;case ue.UNIMPLEMENTED:return D.UNIMPLEMENTED;case ue.DATA_LOSS:return D.DATA_LOSS;default:return z(39323,{code:s})}}(ee=ue||(ue={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sm(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rm=new Tt([4294967295,4294967295],0);function Kl(s){const e=sm().encode(s),n=new ad;return n.update(e),new Uint8Array(n.digest())}function Ql(s){const e=new DataView(s.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new Tt([n,r],0),new Tt([i,o],0)]}class No{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Zn(`Invalid padding: ${n}`);if(r<0)throw new Zn(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Zn(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Zn(`Invalid padding when bitmap length is 0: ${n}`);this.ge=8*e.length-n,this.pe=Tt.fromNumber(this.ge)}ye(e,n,r){let i=e.add(n.multiply(Tt.fromNumber(r)));return i.compare(rm)===1&&(i=new Tt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const n=Kl(e),[r,i]=Ql(n);for(let o=0;o<this.hashCount;o++){const l=this.ye(r,i,o);if(!this.we(l))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),l=new No(o,i,n);return r.forEach((c=>l.insert(c))),l}insert(e){if(this.ge===0)return;const n=Kl(e),[r,i]=Ql(n);for(let o=0;o<this.hashCount;o++){const l=this.ye(r,i,o);this.Se(l)}}Se(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Zn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e,n,r,i,o){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,Is.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new qr(W.min(),i,new oe(J),it(),X())}}class Is{constructor(e,n,r,i,o){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new Is(r,n,X(),X(),X())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class or{constructor(e,n,r,i){this.be=e,this.removedTargetIds=n,this.key=r,this.De=i}}class Gd{constructor(e,n){this.targetId=e,this.Ce=n}}class Wd{constructor(e,n,r=xe.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class Yl{constructor(){this.ve=0,this.Fe=Jl(),this.Me=xe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=X(),n=X(),r=X();return this.Fe.forEach(((i,o)=>{switch(o){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:z(38017,{changeType:o})}})),new Is(this.Me,this.xe,e,n,r)}qe(){this.Oe=!1,this.Fe=Jl()}Ke(e,n){this.Oe=!0,this.Fe=this.Fe.insert(e,n)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,te(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class im{constructor(e){this.Ge=e,this.ze=new Map,this.je=it(),this.Je=Ys(),this.He=Ys(),this.Ze=new oe(J)}Xe(e){for(const n of e.be)e.De&&e.De.isFoundDocument()?this.Ye(n,e.De):this.et(n,e.key,e.De);for(const n of e.removedTargetIds)this.et(n,e.key,e.De)}tt(e){this.forEachTarget(e,(n=>{const r=this.nt(n);switch(e.state){case 0:this.rt(n)&&r.Le(e.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(n);break;case 3:this.rt(n)&&(r.Qe(),r.Le(e.resumeToken));break;case 4:this.rt(n)&&(this.it(n),r.Le(e.resumeToken));break;default:z(56790,{state:e.state})}}))}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.ze.forEach(((r,i)=>{this.rt(i)&&n(i)}))}st(e){const n=e.targetId,r=e.Ce.count,i=this.ot(n);if(i){const o=i.target;if(so(o))if(r===0){const l=new U(o.path);this.et(n,l,Ee.newNoDocument(l,W.min()))}else te(r===1,20013,{expectedCount:r});else{const l=this._t(n);if(l!==r){const c=this.ut(e),d=c?this.ct(c,e,l):1;if(d!==0){this.it(n);const h=d===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,h)}}}}}ut(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:o=0}=n;let l,c;try{l=Pt(r).toUint8Array()}catch(d){if(d instanceof bd)return vn("Decoding the base64 bloom filter in existence filter failed ("+d.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw d}try{c=new No(l,i,o)}catch(d){return vn(d instanceof Zn?"BloomFilter error: ":"Applying bloom filter failed: ",d),null}return c.ge===0?null:c}ct(e,n,r){return n.Ce.count===r-this.Pt(e,n.targetId)?0:2}Pt(e,n){const r=this.Ge.getRemoteKeysForTarget(n);let i=0;return r.forEach((o=>{const l=this.Ge.ht(),c=`projects/${l.projectId}/databases/${l.database}/documents/${o.path.canonicalString()}`;e.mightContain(c)||(this.et(n,o,null),i++)})),i}Tt(e){const n=new Map;this.ze.forEach(((o,l)=>{const c=this.ot(l);if(c){if(o.current&&so(c.target)){const d=new U(c.target.path);this.Et(d).has(l)||this.It(l,d)||this.et(l,d,Ee.newNoDocument(d,e))}o.Be&&(n.set(l,o.ke()),o.qe())}}));let r=X();this.He.forEach(((o,l)=>{let c=!0;l.forEachWhile((d=>{const h=this.ot(d);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(o))})),this.je.forEach(((o,l)=>l.setReadTime(e)));const i=new qr(e,n,this.Ze,this.je,r);return this.je=it(),this.Je=Ys(),this.He=Ys(),this.Ze=new oe(J),i}Ye(e,n){if(!this.rt(e))return;const r=this.It(e,n.key)?2:0;this.nt(e).Ke(n.key,r),this.je=this.je.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(e)),this.He=this.He.insert(n.key,this.Rt(n.key).add(e))}et(e,n,r){if(!this.rt(e))return;const i=this.nt(e);this.It(e,n)?i.Ke(n,1):i.Ue(n),this.He=this.He.insert(n,this.Rt(n).delete(e)),this.He=this.He.insert(n,this.Rt(n).add(e)),r&&(this.je=this.je.insert(n,r))}removeTarget(e){this.ze.delete(e)}_t(e){const n=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let n=this.ze.get(e);return n||(n=new Yl,this.ze.set(e,n)),n}Rt(e){let n=this.He.get(e);return n||(n=new ge(J),this.He=this.He.insert(e,n)),n}Et(e){let n=this.Je.get(e);return n||(n=new ge(J),this.Je=this.Je.insert(e,n)),n}rt(e){const n=this.ot(e)!==null;return n||O("WatchChangeAggregator","Detected inactive target",e),n}ot(e){const n=this.ze.get(e);return n&&n.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Yl),this.Ge.getRemoteKeysForTarget(e).forEach((n=>{this.et(e,n,null)}))}It(e,n){return this.Ge.getRemoteKeysForTarget(e).has(n)}}function Ys(){return new oe(U.comparator)}function Jl(){return new oe(U.comparator)}const om={asc:"ASCENDING",desc:"DESCENDING"},am={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},lm={and:"AND",or:"OR"};class cm{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function oo(s,e){return s.useProto3Json||Or(e)?e:{value:e}}function xr(s,e){return s.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Kd(s,e){return s.useProto3Json?e.toBase64():e.toUint8Array()}function dm(s,e){return xr(s,e.toTimestamp())}function Ke(s){return te(!!s,49232),W.fromTimestamp((function(n){const r=Ct(n);return new ie(r.seconds,r.nanos)})(s))}function Lo(s,e){return ao(s,e).canonicalString()}function ao(s,e){const n=(function(i){return new se(["projects",i.projectId,"databases",i.database])})(s).child("documents");return e===void 0?n:n.child(e)}function Qd(s){const e=se.fromString(s);return te(eu(e),10190,{key:e.toString()}),e}function lo(s,e){return Lo(s.databaseId,e.path)}function Li(s,e){const n=Qd(e);if(n.get(1)!==s.databaseId.projectId)throw new $(D.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+s.databaseId.projectId);if(n.get(3)!==s.databaseId.database)throw new $(D.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+s.databaseId.database);return new U(Jd(n))}function Yd(s,e){return Lo(s.databaseId,e)}function um(s){const e=Qd(s);return e.length===4?se.emptyPath():Jd(e)}function co(s){return new se(["projects",s.databaseId.projectId,"databases",s.databaseId.database]).canonicalString()}function Jd(s){return te(s.length>4&&s.get(4)==="documents",29091,{key:s.toString()}),s.popFirst(5)}function Xl(s,e,n){return{name:lo(s,e),fields:n.value.mapValue.fields}}function hm(s,e){let n;if("targetChange"in e){e.targetChange;const r=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:z(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],o=(function(h,f){return h.useProto3Json?(te(f===void 0||typeof f=="string",58123),xe.fromBase64String(f||"")):(te(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),xe.fromUint8Array(f||new Uint8Array))})(s,e.targetChange.resumeToken),l=e.targetChange.cause,c=l&&(function(h){const f=h.code===void 0?D.UNKNOWN:Hd(h.code);return new $(f,h.message||"")})(l);n=new Wd(r,i,o,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Li(s,r.document.name),o=Ke(r.document.updateTime),l=r.document.createTime?Ke(r.document.createTime):W.min(),c=new Pe({mapValue:{fields:r.document.fields}}),d=Ee.newFoundDocument(i,o,l,c),h=r.targetIds||[],f=r.removedTargetIds||[];n=new or(h,f,d.key,d)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Li(s,r.document),o=r.readTime?Ke(r.readTime):W.min(),l=Ee.newNoDocument(i,o),c=r.removedTargetIds||[];n=new or([],c,l.key,l)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Li(s,r.document),o=r.removedTargetIds||[];n=new or([],o,i,null)}else{if(!("filter"in e))return z(11601,{Vt:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:o}=r,l=new tm(i,o),c=r.targetId;n=new Gd(c,l)}}return n}function pm(s,e){let n;if(e instanceof ks)n={update:Xl(s,e.key,e.value)};else if(e instanceof Vo)n={delete:lo(s,e.key)};else if(e instanceof $t)n={update:Xl(s,e.key,e.data),updateMask:_m(e.fieldMask)};else{if(!(e instanceof Xg))return z(16599,{dt:e.type});n={verify:lo(s,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map((r=>(function(o,l){const c=l.transform;if(c instanceof fs)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof gs)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ms)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof vr)return{fieldPath:l.field.canonicalString(),increment:c.Ae};throw z(20930,{transform:l.transform})})(0,r)))),e.precondition.isNone||(n.currentDocument=(function(i,o){return o.updateTime!==void 0?{updateTime:dm(i,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:z(27497)})(s,e.precondition)),n}function fm(s,e){return s&&s.length>0?(te(e!==void 0,14353),s.map((n=>(function(i,o){let l=i.updateTime?Ke(i.updateTime):Ke(o);return l.isEqual(W.min())&&(l=Ke(o)),new Qg(l,i.transformResults||[])})(n,e)))):[]}function gm(s,e){return{documents:[Yd(s,e.path)]}}function mm(s,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Yd(s,i);const o=(function(h){if(h.length!==0)return Zd(Ue.create(h,"and"))})(e.filters);o&&(n.structuredQuery.where=o);const l=(function(h){if(h.length!==0)return h.map((f=>(function(b){return{field:cn(b.field),direction:vm(b.dir)}})(f)))})(e.orderBy);l&&(n.structuredQuery.orderBy=l);const c=oo(s,e.limit);return c!==null&&(n.structuredQuery.limit=c),e.startAt&&(n.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(n.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{ft:n,parent:i}}function ym(s){let e=um(s.parent);const n=s.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){te(r===1,65062);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let o=[];n.where&&(o=(function(m){const b=Xd(m);return b instanceof Ue&&Ad(b)?b.getFilters():[b]})(n.where));let l=[];n.orderBy&&(l=(function(m){return m.map((b=>(function(T){return new br(dn(T.field),(function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(T.direction))})(b)))})(n.orderBy));let c=null;n.limit&&(c=(function(m){let b;return b=typeof m=="object"?m.value:m,Or(b)?null:b})(n.limit));let d=null;n.startAt&&(d=(function(m){const b=!!m.before,v=m.values||[];return new yr(v,b)})(n.startAt));let h=null;return n.endAt&&(h=(function(m){const b=!m.before,v=m.values||[];return new yr(v,b)})(n.endAt)),Mg(e,i,l,o,c,"F",d,h)}function bm(s,e){const n=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return z(28987,{purpose:i})}})(e.purpose);return n==null?null:{"goog-listen-tags":n}}function Xd(s){return s.unaryFilter!==void 0?(function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=dn(n.unaryFilter.field);return he.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=dn(n.unaryFilter.field);return he.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=dn(n.unaryFilter.field);return he.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=dn(n.unaryFilter.field);return he.create(l,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return z(61313);default:return z(60726)}})(s):s.fieldFilter!==void 0?(function(n){return he.create(dn(n.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return z(58110);default:return z(50506)}})(n.fieldFilter.op),n.fieldFilter.value)})(s):s.compositeFilter!==void 0?(function(n){return Ue.create(n.compositeFilter.filters.map((r=>Xd(r))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return z(1026)}})(n.compositeFilter.op))})(s):z(30097,{filter:s})}function vm(s){return om[s]}function xm(s){return am[s]}function wm(s){return lm[s]}function cn(s){return{fieldPath:s.canonicalString()}}function dn(s){return ve.fromServerFormat(s.fieldPath)}function Zd(s){return s instanceof he?(function(n){if(n.op==="=="){if(Fl(n.value))return{unaryFilter:{field:cn(n.field),op:"IS_NAN"}};if(Ol(n.value))return{unaryFilter:{field:cn(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Fl(n.value))return{unaryFilter:{field:cn(n.field),op:"IS_NOT_NAN"}};if(Ol(n.value))return{unaryFilter:{field:cn(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:cn(n.field),op:xm(n.op),value:n.value}}})(s):s instanceof Ue?(function(n){const r=n.getFilters().map((i=>Zd(i)));return r.length===1?r[0]:{compositeFilter:{op:wm(n.op),filters:r}}})(s):z(54877,{filter:s})}function _m(s){const e=[];return s.fields.forEach((n=>e.push(n.canonicalString()))),{fieldPaths:e}}function eu(s){return s.length>=4&&s.get(0)==="projects"&&s.get(2)==="databases"}function tu(s){return!!s&&typeof s._toProto=="function"&&s._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e,n,r,i,o=W.min(),l=W.min(),c=xe.EMPTY_BYTE_STRING,d=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=c,this.expectedCount=d}withSequenceNumber(e){return new _t(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new _t(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new _t(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new _t(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Em{constructor(e){this.yt=e}}function km(s){const e=ym({parent:s.parent,structuredQuery:s.structuredQuery});return s.limitType==="LAST"?io(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Im{constructor(){this.bn=new Tm}addToCollectionParentIndex(e,n){return this.bn.add(n),V.resolve()}getCollectionParents(e,n){return V.resolve(this.bn.getEntries(n))}addFieldIndex(e,n){return V.resolve()}deleteFieldIndex(e,n){return V.resolve()}deleteAllFieldIndexes(e){return V.resolve()}createTargetIndexes(e,n){return V.resolve()}getDocumentsMatchingTarget(e,n){return V.resolve(null)}getIndexType(e,n){return V.resolve(0)}getFieldIndexes(e,n){return V.resolve([])}getNextCollectionGroupToUpdate(e){return V.resolve(null)}getMinOffset(e,n){return V.resolve(Rt.min())}getMinOffsetFromCollectionGroup(e,n){return V.resolve(Rt.min())}updateCollectionGroup(e,n,r){return V.resolve()}updateIndexEntries(e,n){return V.resolve()}}class Tm{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new ge(se.comparator),o=!i.has(r);return this.index[n]=i.add(r),o}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new ge(se.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},nu=41943040;class Ce{static withCacheSize(e){return new Ce(e,Ce.DEFAULT_COLLECTION_PERCENTILE,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ce.DEFAULT_COLLECTION_PERCENTILE=10,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ce.DEFAULT=new Ce(nu,Ce.DEFAULT_COLLECTION_PERCENTILE,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ce.DISABLED=new Ce(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new En(0)}static ar(){return new En(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ec="LruGarbageCollector",su=1048576;function tc([s,e],[n,r]){const i=J(s,n);return i===0?J(e,r):i}class Sm{constructor(e){this.Pr=e,this.buffer=new ge(tc),this.Tr=0}Er(){return++this.Tr}Ir(e){const n=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();tc(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class Am{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){O(ec,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){Cn(n)?O(ec,"Ignoring IndexedDB error during garbage collection: ",n):await Rn(n)}await this.Ar(3e5)}))}}class Rm{constructor(e,n){this.Vr=e,this.params=n}calculateTargetCount(e,n){return this.Vr.dr(e).next((r=>Math.floor(n/100*r)))}nthSequenceNumber(e,n){if(n===0)return V.resolve($r.ce);const r=new Sm(n);return this.Vr.forEachTarget(e,(i=>r.Ir(i.sequenceNumber))).next((()=>this.Vr.mr(e,(i=>r.Ir(i))))).next((()=>r.maxValue))}removeTargets(e,n,r){return this.Vr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Vr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),V.resolve(Zl)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Zl):this.gr(e,n)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,n){let r,i,o,l,c,d,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,l=Date.now(),this.nthSequenceNumber(e,i)))).next((m=>(r=m,c=Date.now(),this.removeTargets(e,r,n)))).next((m=>(o=m,d=Date.now(),this.removeOrphanedDocuments(e,r)))).next((m=>(h=Date.now(),an()<=Y.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${l-f}ms
	Determined least recently used ${i} in `+(c-l)+`ms
	Removed ${o} targets in `+(d-c)+`ms
	Removed ${m} documents in `+(h-d)+`ms
Total Duration: ${h-f}ms`),V.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:o,documentsRemoved:m}))))}}function Cm(s,e){return new Rm(s,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pm{constructor(){this.changes=new Xt((e=>e.toString()),((e,n)=>e.isEqual(n))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Ee.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?V.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vm{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next((i=>(r=i,this.remoteDocumentCache.getEntry(e,n)))).next((i=>(r!==null&&rs(r.mutation,i,Ve.empty(),ie.now()),i)))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next((r=>this.getLocalViewOfDocuments(e,r,X()).next((()=>r))))}getLocalViewOfDocuments(e,n,r=X()){const i=Ht();return this.populateOverlays(e,i,n).next((()=>this.computeViews(e,n,i,r).next((o=>{let l=Xn();return o.forEach(((c,d)=>{l=l.insert(c,d.overlayedDocument)})),l}))))}getOverlayedDocuments(e,n){const r=Ht();return this.populateOverlays(e,r,n).next((()=>this.computeViews(e,n,r,X())))}populateOverlays(e,n,r){const i=[];return r.forEach((o=>{n.has(o)||i.push(o)})),this.documentOverlayCache.getOverlays(e,i).next((o=>{o.forEach(((l,c)=>{n.set(l,c)}))}))}computeViews(e,n,r,i){let o=it();const l=ss(),c=(function(){return ss()})();return n.forEach(((d,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof $t)?o=o.insert(h.key,h):f!==void 0?(l.set(h.key,f.mutation.getFieldMask()),rs(f.mutation,h,f.mutation.getFieldMask(),ie.now())):l.set(h.key,Ve.empty())})),this.recalculateAndSaveOverlays(e,o).next((d=>(d.forEach(((h,f)=>l.set(h,f))),n.forEach(((h,f)=>c.set(h,new Dm(f,l.get(h)??null)))),c)))}recalculateAndSaveOverlays(e,n){const r=ss();let i=new oe(((l,c)=>l-c)),o=X();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next((l=>{for(const c of l)c.keys().forEach((d=>{const h=n.get(d);if(h===null)return;let f=r.get(d)||Ve.empty();f=c.applyToLocalView(h,f),r.set(d,f);const m=(i.get(c.batchId)||X()).add(d);i=i.insert(c.batchId,m)}))})).next((()=>{const l=[],c=i.getReverseIterator();for(;c.hasNext();){const d=c.getNext(),h=d.key,f=d.value,m=$d();f.forEach((b=>{if(!o.has(b)){const v=zd(n.get(b),r.get(b));v!==null&&m.set(b,v),o=o.add(b)}})),l.push(this.documentOverlayCache.saveOverlays(e,h,m))}return V.waitFor(l)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,n,r,i){return Ng(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Dd(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next((o=>{const l=i-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-o.size):V.resolve(Ht());let c=ds,d=o;return l.next((h=>V.forEach(h,((f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),o.get(f)?V.resolve():this.remoteDocumentCache.getEntry(e,f).next((b=>{d=d.insert(f,b)}))))).next((()=>this.populateOverlays(e,h,o))).next((()=>this.computeViews(e,d,h,X()))).next((f=>({batchId:c,changes:Ld(f)})))))}))}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new U(n)).next((r=>{let i=Xn();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i}))}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const o=n.collectionGroup;let l=Xn();return this.indexManager.getCollectionParents(e,o).next((c=>V.forEach(c,(d=>{const h=(function(m,b){return new Es(b,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(n,d.child(o));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next((f=>{f.forEach(((m,b)=>{l=l.insert(m,b)}))}))})).next((()=>l))))}getDocumentsMatchingCollectionQuery(e,n,r,i){let o;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next((l=>(o=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,o,i)))).next((l=>{o.forEach(((d,h)=>{const f=h.getKey();l.get(f)===null&&(l=l.insert(f,Ee.newInvalidDocument(f)))}));let c=Xn();return l.forEach(((d,h)=>{const f=o.get(d);f!==void 0&&rs(f.mutation,h,Ve.empty(),ie.now()),Br(n,h)&&(c=c.insert(d,h))})),c}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,n){return V.resolve(this.Nr.get(n))}saveBundleMetadata(e,n){return this.Nr.set(n.id,(function(i){return{id:i.id,version:i.version,createTime:Ke(i.createTime)}})(n)),V.resolve()}getNamedQuery(e,n){return V.resolve(this.Br.get(n))}saveNamedQuery(e,n){return this.Br.set(n.name,(function(i){return{name:i.name,query:km(i.bundledQuery),readTime:Ke(i.readTime)}})(n)),V.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(){this.overlays=new oe(U.comparator),this.Lr=new Map}getOverlay(e,n){return V.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Ht();return V.forEach(n,(i=>this.getOverlay(e,i).next((o=>{o!==null&&r.set(i,o)})))).next((()=>r))}saveOverlays(e,n,r){return r.forEach(((i,o)=>{this.St(e,n,o)})),V.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Lr.get(r);return i!==void 0&&(i.forEach((o=>this.overlays=this.overlays.remove(o))),this.Lr.delete(r)),V.resolve()}getOverlaysForCollection(e,n,r){const i=Ht(),o=n.length+1,l=new U(n.child("")),c=this.overlays.getIteratorFrom(l);for(;c.hasNext();){const d=c.getNext().value,h=d.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===o&&d.largestBatchId>r&&i.set(d.getKey(),d)}return V.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let o=new oe(((h,f)=>h-f));const l=this.overlays.getIterator();for(;l.hasNext();){const h=l.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=o.get(h.largestBatchId);f===null&&(f=Ht(),o=o.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=Ht(),d=o.getIterator();for(;d.hasNext()&&(d.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=i)););return V.resolve(c)}St(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const l=this.Lr.get(i.largestBatchId).delete(r.key);this.Lr.set(i.largestBatchId,l)}this.overlays=this.overlays.insert(r.key,new em(n,r));let o=this.Lr.get(n);o===void 0&&(o=X(),this.Lr.set(n,o)),this.Lr.set(n,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(){this.sessionToken=xe.EMPTY_BYTE_STRING}getSessionToken(e){return V.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,V.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(){this.kr=new ge(ye.qr),this.Kr=new ge(ye.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,n){const r=new ye(e,n);this.kr=this.kr.add(r),this.Kr=this.Kr.add(r)}$r(e,n){e.forEach((r=>this.addReference(r,n)))}removeReference(e,n){this.Wr(new ye(e,n))}Qr(e,n){e.forEach((r=>this.removeReference(r,n)))}Gr(e){const n=new U(new se([])),r=new ye(n,e),i=new ye(n,e+1),o=[];return this.Kr.forEachInRange([r,i],(l=>{this.Wr(l),o.push(l.key)})),o}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const n=new U(new se([])),r=new ye(n,e),i=new ye(n,e+1);let o=X();return this.Kr.forEachInRange([r,i],(l=>{o=o.add(l.key)})),o}containsKey(e){const n=new ye(e,0),r=this.kr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class ye{constructor(e,n){this.key=e,this.Jr=n}static qr(e,n){return U.comparator(e.key,n.key)||J(e.Jr,n.Jr)}static Ur(e,n){return J(e.Jr,n.Jr)||U.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Yn=1,this.Hr=new ge(ye.qr)}checkEmpty(e){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const o=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new Zg(o,n,r,i);this.mutationQueue.push(l);for(const c of i)this.Hr=this.Hr.add(new ye(c.key,o)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return V.resolve(l)}lookupMutationBatch(e,n){return V.resolve(this.Zr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.Xr(r),o=i<0?0:i;return V.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?To:this.Yn-1)}getAllMutationBatches(e){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new ye(n,0),i=new ye(n,Number.POSITIVE_INFINITY),o=[];return this.Hr.forEachInRange([r,i],(l=>{const c=this.Zr(l.Jr);o.push(c)})),V.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new ge(J);return n.forEach((i=>{const o=new ye(i,0),l=new ye(i,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([o,l],(c=>{r=r.add(c.Jr)}))})),V.resolve(this.Yr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let o=r;U.isDocumentKey(o)||(o=o.child(""));const l=new ye(new U(o),0);let c=new ge(J);return this.Hr.forEachWhile((d=>{const h=d.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(c=c.add(d.Jr)),!0)}),l),V.resolve(this.Yr(c))}Yr(e){const n=[];return e.forEach((r=>{const i=this.Zr(r);i!==null&&n.push(i)})),n}removeMutationBatch(e,n){te(this.ei(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Hr;return V.forEach(n.mutations,(i=>{const o=new ye(i.key,n.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Hr=r}))}nr(e){}containsKey(e,n){const r=new ye(n,0),i=this.Hr.firstAfterOrEqual(r);return V.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,V.resolve()}ei(e,n){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const n=this.Xr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Om{constructor(e){this.ti=e,this.docs=(function(){return new oe(U.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),o=i?i.size:0,l=this.ti(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:l}),this.size+=l-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return V.resolve(r?r.document.mutableCopy():Ee.newInvalidDocument(n))}getEntries(e,n){let r=it();return n.forEach((i=>{const o=this.docs.get(i);r=r.insert(i,o?o.document.mutableCopy():Ee.newInvalidDocument(i))})),V.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let o=it();const l=n.path,c=new U(l.child("__id-9223372036854775808__")),d=this.docs.getIteratorFrom(c);for(;d.hasNext();){const{key:h,value:{document:f}}=d.getNext();if(!l.isPrefixOf(h.path))break;h.path.length>l.length+1||ug(dg(f),r)<=0||(i.has(f.key)||Br(n,f))&&(o=o.insert(f.key,f.mutableCopy()))}return V.resolve(o)}getAllFromCollectionGroup(e,n,r,i){z(9500)}ni(e,n){return V.forEach(this.docs,(r=>n(r)))}newChangeBuffer(e){return new Fm(this)}getSize(e){return V.resolve(this.size)}}class Fm extends Pm{constructor(e){super(),this.Mr=e}applyChanges(e){const n=[];return this.changes.forEach(((r,i)=>{i.isValidDocument()?n.push(this.Mr.addEntry(e,i)):this.Mr.removeEntry(r)})),V.waitFor(n)}getFromCache(e,n){return this.Mr.getEntry(e,n)}getAllFromCache(e,n){return this.Mr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e){this.persistence=e,this.ri=new Xt((n=>Ro(n)),Co),this.lastRemoteSnapshotVersion=W.min(),this.highestTargetId=0,this.ii=0,this.si=new $o,this.targetCount=0,this.oi=En._r()}forEachTarget(e,n){return this.ri.forEach(((r,i)=>n(i))),V.resolve()}getLastRemoteSnapshotVersion(e){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return V.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.ii&&(this.ii=n),V.resolve()}lr(e){this.ri.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.oi=new En(n),this.highestTargetId=n),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,n){return this.lr(n),this.targetCount+=1,V.resolve()}updateTargetData(e,n){return this.lr(n),V.resolve()}removeTargetData(e,n){return this.ri.delete(n.target),this.si.Gr(n.targetId),this.targetCount-=1,V.resolve()}removeTargets(e,n,r){let i=0;const o=[];return this.ri.forEach(((l,c)=>{c.sequenceNumber<=n&&r.get(c.targetId)===null&&(this.ri.delete(l),o.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)})),V.waitFor(o).next((()=>i))}getTargetCount(e){return V.resolve(this.targetCount)}getTargetData(e,n){const r=this.ri.get(n)||null;return V.resolve(r)}addMatchingKeys(e,n,r){return this.si.$r(n,r),V.resolve()}removeMatchingKeys(e,n,r){this.si.Qr(n,r);const i=this.persistence.referenceDelegate,o=[];return i&&n.forEach((l=>{o.push(i.markPotentiallyOrphaned(e,l))})),V.waitFor(o)}removeMatchingKeysForTargetId(e,n){return this.si.Gr(n),V.resolve()}getMatchingKeysForTargetId(e,n){const r=this.si.jr(n);return V.resolve(r)}containsKey(e,n){return V.resolve(this.si.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(e,n){this._i={},this.overlays={},this.ai=new $r(0),this.ui=!1,this.ui=!0,this.ci=new Lm,this.referenceDelegate=e(this),this.li=new Um(this),this.indexManager=new Im,this.remoteDocumentCache=(function(i){return new Om(i)})((r=>this.referenceDelegate.hi(r))),this.serializer=new Em(n),this.Pi=new Mm(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new Nm,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this._i[e.toKey()];return r||(r=new $m(n,this.referenceDelegate),this._i[e.toKey()]=r),r}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,n,r){O("MemoryPersistence","Starting transaction:",e);const i=new Bm(this.ai.next());return this.referenceDelegate.Ti(),r(i).next((o=>this.referenceDelegate.Ei(i).next((()=>o)))).toPromise().then((o=>(i.raiseOnCommittedEvent(),o)))}Ii(e,n){return V.or(Object.values(this._i).map((r=>()=>r.containsKey(e,n))))}}class Bm extends pg{constructor(e){super(),this.currentSequenceNumber=e}}class Oo{constructor(e){this.persistence=e,this.Ri=new $o,this.Ai=null}static Vi(e){return new Oo(e)}get di(){if(this.Ai)return this.Ai;throw z(60996)}addReference(e,n,r){return this.Ri.addReference(r,n),this.di.delete(r.toString()),V.resolve()}removeReference(e,n,r){return this.Ri.removeReference(r,n),this.di.add(r.toString()),V.resolve()}markPotentiallyOrphaned(e,n){return this.di.add(n.toString()),V.resolve()}removeTarget(e,n){this.Ri.Gr(n.targetId).forEach((i=>this.di.add(i.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next((i=>{i.forEach((o=>this.di.add(o.toString())))})).next((()=>r.removeTargetData(e,n)))}Ti(){this.Ai=new Set}Ei(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.di,(r=>{const i=U.fromPath(r);return this.mi(e,i).next((o=>{o||n.removeEntry(i,W.min())}))})).next((()=>(this.Ai=null,n.apply(e))))}updateLimboDocument(e,n){return this.mi(e,n).next((r=>{r?this.di.delete(n.toString()):this.di.add(n.toString())}))}hi(e){return 0}mi(e,n){return V.or([()=>V.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ii(e,n)])}}class wr{constructor(e,n){this.persistence=e,this.fi=new Xt((r=>mg(r.path)),((r,i)=>r.isEqual(i))),this.garbageCollector=Cm(this,n)}static Vi(e,n){return new wr(e,n)}Ti(){}Ei(e){return V.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}dr(e){const n=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>n.next((i=>r+i))))}pr(e){let n=0;return this.mr(e,(r=>{n++})).next((()=>n))}mr(e,n){return V.forEach(this.fi,((r,i)=>this.wr(e,r,i).next((o=>o?V.resolve():n(i)))))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),o=i.newChangeBuffer();return i.ni(e,(l=>this.wr(e,l,n).next((c=>{c||(r++,o.removeEntry(l,W.min()))})))).next((()=>o.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,n){return this.fi.set(n,e.currentSequenceNumber),V.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),V.resolve()}removeReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),V.resolve()}updateLimboDocument(e,n){return this.fi.set(n,e.currentSequenceNumber),V.resolve()}hi(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=sr(e.data.value)),n}wr(e,n,r){return V.or([()=>this.persistence.Ii(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.fi.get(n);return V.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Ts=r,this.Es=i}static Is(e,n){let r=X(),i=X();for(const o of n.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:i=i.add(o.doc.key)}return new Fo(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return Rp()?8:fg(ke())>0?6:4})()}initialize(e,n){this.fs=e,this.indexManager=n,this.Rs=!0}getDocumentsMatchingQuery(e,n,r,i){const o={result:null};return this.gs(e,n).next((l=>{o.result=l})).next((()=>{if(!o.result)return this.ps(e,n,i,r).next((l=>{o.result=l}))})).next((()=>{if(o.result)return;const l=new jm;return this.ys(e,n,l).next((c=>{if(o.result=c,this.As)return this.ws(e,n,l,c.size)}))})).next((()=>o.result))}ws(e,n,r,i){return r.documentReadCount<this.Vs?(an()<=Y.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",ln(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),V.resolve()):(an()<=Y.DEBUG&&O("QueryEngine","Query:",ln(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.ds*i?(an()<=Y.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",ln(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,We(n))):V.resolve())}gs(e,n){if(zl(n))return V.resolve(null);let r=We(n);return this.indexManager.getIndexType(e,r).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=io(n,null,"F"),r=We(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next((o=>{const l=X(...o);return this.fs.getDocuments(e,l).next((c=>this.indexManager.getMinOffset(e,r).next((d=>{const h=this.Ss(n,c);return this.bs(n,h,l,d.readTime)?this.gs(e,io(n,null,"F")):this.Ds(e,h,n,d)}))))})))))}ps(e,n,r,i){return zl(n)||i.isEqual(W.min())?V.resolve(null):this.fs.getDocuments(e,r).next((o=>{const l=this.Ss(n,o);return this.bs(n,l,r,i)?V.resolve(null):(an()<=Y.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),ln(n)),this.Ds(e,l,n,cg(i,ds)).next((c=>c)))}))}Ss(e,n){let r=new ge(Md(e));return n.forEach(((i,o)=>{Br(e,o)&&(r=r.add(o))})),r}bs(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const o=e.limitType==="F"?n.last():n.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(i)>0)}ys(e,n,r){return an()<=Y.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",ln(n)),this.fs.getDocumentsMatchingQuery(e,n,Rt.min(),r)}Ds(e,n,r,i){return this.fs.getDocumentsMatchingQuery(e,r,i).next((o=>(n.forEach((l=>{o=o.insert(l.key,l)})),o)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uo="LocalStore",qm=3e8;class Hm{constructor(e,n,r,i){this.persistence=e,this.Cs=n,this.serializer=i,this.vs=new oe(J),this.Fs=new Xt((o=>Ro(o)),Co),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(r)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Vm(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(n=>e.collect(n,this.vs)))}}function Gm(s,e,n,r){return new Hm(s,e,n,r)}async function iu(s,e){const n=K(s);return await n.persistence.runTransaction("Handle user change","readonly",(r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next((o=>(i=o,n.Os(e),n.mutationQueue.getAllMutationBatches(r)))).next((o=>{const l=[],c=[];let d=X();for(const h of i){l.push(h.batchId);for(const f of h.mutations)d=d.add(f.key)}for(const h of o){c.push(h.batchId);for(const f of h.mutations)d=d.add(f.key)}return n.localDocuments.getDocuments(r,d).next((h=>({Ns:h,removedBatchIds:l,addedBatchIds:c})))}))}))}function Wm(s,e){const n=K(s);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const i=e.batch.keys(),o=n.xs.newChangeBuffer({trackRemovals:!0});return(function(c,d,h,f){const m=h.batch,b=m.keys();let v=V.resolve();return b.forEach((T=>{v=v.next((()=>f.getEntry(d,T))).next((R=>{const P=h.docVersions.get(T);te(P!==null,48541),R.version.compareTo(P)<0&&(m.applyToRemoteDocument(R,h),R.isValidDocument()&&(R.setReadTime(h.commitVersion),f.addEntry(R)))}))})),v.next((()=>c.mutationQueue.removeMutationBatch(d,m)))})(n,r,e,o).next((()=>o.apply(r))).next((()=>n.mutationQueue.performConsistencyCheck(r))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let d=X();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(d=d.add(c.batch.mutations[h].key));return d})(e)))).next((()=>n.localDocuments.getDocuments(r,i)))}))}function ou(s){const e=K(s);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(n=>e.li.getLastRemoteSnapshotVersion(n)))}function Km(s,e){const n=K(s),r=e.snapshotVersion;let i=n.vs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const l=n.xs.newChangeBuffer({trackRemovals:!0});i=n.vs;const c=[];e.targetChanges.forEach(((f,m)=>{const b=i.get(m);if(!b)return;c.push(n.li.removeMatchingKeys(o,f.removedDocuments,m).next((()=>n.li.addMatchingKeys(o,f.addedDocuments,m))));let v=b.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(m)!==null?v=v.withResumeToken(xe.EMPTY_BYTE_STRING,W.min()).withLastLimboFreeSnapshotVersion(W.min()):f.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(f.resumeToken,r)),i=i.insert(m,v),(function(R,P,L){return R.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=qm?!0:L.addedDocuments.size+L.modifiedDocuments.size+L.removedDocuments.size>0})(b,v,f)&&c.push(n.li.updateTargetData(o,v))}));let d=it(),h=X();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(n.persistence.referenceDelegate.updateLimboDocument(o,f))})),c.push(Qm(o,l,e.documentUpdates).next((f=>{d=f.Bs,h=f.Ls}))),!r.isEqual(W.min())){const f=n.li.getLastRemoteSnapshotVersion(o).next((m=>n.li.setTargetsMetadata(o,o.currentSequenceNumber,r)));c.push(f)}return V.waitFor(c).next((()=>l.apply(o))).next((()=>n.localDocuments.getLocalViewOfDocuments(o,d,h))).next((()=>d))})).then((o=>(n.vs=i,o)))}function Qm(s,e,n){let r=X(),i=X();return n.forEach((o=>r=r.add(o))),e.getEntries(s,r).next((o=>{let l=it();return n.forEach(((c,d)=>{const h=o.get(c);d.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(c)),d.isNoDocument()&&d.version.isEqual(W.min())?(e.removeEntry(c,d.readTime),l=l.insert(c,d)):!h.isValidDocument()||d.version.compareTo(h.version)>0||d.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(d),l=l.insert(c,d)):O(Uo,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",d.version)})),{Bs:l,Ls:i}}))}function Ym(s,e){const n=K(s);return n.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=To),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Jm(s,e){const n=K(s);return n.persistence.runTransaction("Allocate target","readwrite",(r=>{let i;return n.li.getTargetData(r,e).next((o=>o?(i=o,V.resolve(i)):n.li.allocateTargetId(r).next((l=>(i=new _t(e,l,"TargetPurposeListen",r.currentSequenceNumber),n.li.addTargetData(r,i).next((()=>i)))))))})).then((r=>{const i=n.vs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.vs=n.vs.insert(r.targetId,r),n.Fs.set(e,r.targetId)),r}))}async function uo(s,e,n){const r=K(s),i=r.vs.get(e),o=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",o,(l=>r.persistence.referenceDelegate.removeTarget(l,i)))}catch(l){if(!Cn(l))throw l;O(Uo,`Failed to update sequence numbers for target ${e}: ${l}`)}r.vs=r.vs.remove(e),r.Fs.delete(i.target)}function nc(s,e,n){const r=K(s);let i=W.min(),o=X();return r.persistence.runTransaction("Execute query","readwrite",(l=>(function(d,h,f){const m=K(d),b=m.Fs.get(f);return b!==void 0?V.resolve(m.vs.get(b)):m.li.getTargetData(h,f)})(r,l,We(e)).next((c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(l,c.targetId).next((d=>{o=d}))})).next((()=>r.Cs.getDocumentsMatchingQuery(l,e,n?i:W.min(),n?o:X()))).next((c=>(Xm(r,$g(e),c),{documents:c,ks:o})))))}function Xm(s,e,n){let r=s.Ms.get(e)||W.min();n.forEach(((i,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)})),s.Ms.set(e,r)}class sc{constructor(){this.activeTargetIds=zg()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Zm{constructor(){this.vo=new sc,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,n,r){this.Fo[e]=n}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new sc,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e0{Mo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc="ConnectivityMonitor";class ic{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){O(rc,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){O(rc,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Js=null;function ho(){return Js===null?Js=(function(){return 268435456+Math.round(2147483648*Math.random())})():Js++,"0x"+Js.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $i="RestConnection",t0={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class n0{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.$o=this.databaseId.database===gr?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,n,r,i,o){const l=ho(),c=this.Qo(e,n.toUriEncodedString());O($i,`Sending RPC '${e}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(d,i,o);const{host:h}=new URL(c),f=ws(h);return this.zo(e,c,d,r,f).then((m=>(O($i,`Received RPC '${e}' ${l}: `,m),m)),(m=>{throw vn($i,`RPC '${e}' ${l} failed with error: `,m,"url: ",c,"request:",r),m}))}jo(e,n,r,i,o,l){return this.Wo(e,n,r,i,o)}Go(e,n,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+An})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach(((i,o)=>e[o]=i)),r&&r.headers.forEach(((i,o)=>e[o]=i))}Qo(e,n){const r=t0[e];let i=`${this.Ko}/v1/${n}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s0{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _e="WebChannelConnection",Yn=(s,e,n)=>{s.listen(e,(r=>{try{n(r)}catch(i){setTimeout((()=>{throw i}),0)}}))};class hn extends n0{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!hn.c_){const e=ud();Yn(e,dd.STAT_EVENT,(n=>{n.stat===Xi.PROXY?O(_e,"STAT_EVENT: detected buffering proxy"):n.stat===Xi.NOPROXY&&O(_e,"STAT_EVENT: detected no buffering proxy")})),hn.c_=!0}}zo(e,n,r,i,o){const l=ho();return new Promise(((c,d)=>{const h=new ld;h.setWithCredentials(!0),h.listenOnce(cd.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case nr.NO_ERROR:const m=h.getResponseJson();O(_e,`XHR for RPC '${e}' ${l} received:`,JSON.stringify(m)),c(m);break;case nr.TIMEOUT:O(_e,`RPC '${e}' ${l} timed out`),d(new $(D.DEADLINE_EXCEEDED,"Request time out"));break;case nr.HTTP_ERROR:const b=h.getStatus();if(O(_e,`RPC '${e}' ${l} failed with status:`,b,"response text:",h.getResponseText()),b>0){let v=h.getResponseJson();Array.isArray(v)&&(v=v[0]);const T=v==null?void 0:v.error;if(T&&T.status&&T.message){const R=(function(L){const M=L.toLowerCase().replace(/_/g,"-");return Object.values(D).indexOf(M)>=0?M:D.UNKNOWN})(T.status);d(new $(R,T.message))}else d(new $(D.UNKNOWN,"Server responded with status "+h.getStatus()))}else d(new $(D.UNAVAILABLE,"Connection failed."));break;default:z(9055,{l_:e,streamId:l,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{O(_e,`RPC '${e}' ${l} completed.`)}}));const f=JSON.stringify(i);O(_e,`RPC '${e}' ${l} sending request:`,i),h.send(n,"POST",f,r,15)}))}T_(e,n,r){const i=ho(),o=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Go(c.initMessageHeaders,n,r),c.encodeInitMessageHeaders=!0;const h=o.join("");O(_e,`Creating RPC '${e}' stream ${i}: ${h}`,c);const f=l.createWebChannel(h,c);this.E_(f);let m=!1,b=!1;const v=new s0({Jo:T=>{b?O(_e,`Not sending because RPC '${e}' stream ${i} is closed:`,T):(m||(O(_e,`Opening RPC '${e}' stream ${i} transport.`),f.open(),m=!0),O(_e,`RPC '${e}' stream ${i} sending:`,T),f.send(T))},Ho:()=>f.close()});return Yn(f,Jn.EventType.OPEN,(()=>{b||(O(_e,`RPC '${e}' stream ${i} transport opened.`),v.i_())})),Yn(f,Jn.EventType.CLOSE,(()=>{b||(b=!0,O(_e,`RPC '${e}' stream ${i} transport closed`),v.o_(),this.I_(f))})),Yn(f,Jn.EventType.ERROR,(T=>{b||(b=!0,vn(_e,`RPC '${e}' stream ${i} transport errored. Name:`,T.name,"Message:",T.message),v.o_(new $(D.UNAVAILABLE,"The operation could not be completed")))})),Yn(f,Jn.EventType.MESSAGE,(T=>{var R;if(!b){const P=T.data[0];te(!!P,16349);const L=P,M=(L==null?void 0:L.error)||((R=L[0])==null?void 0:R.error);if(M){O(_e,`RPC '${e}' stream ${i} received error:`,M);const q=M.status;let B=(function(E){const x=ue[E];if(x!==void 0)return Hd(x)})(q),G=M.message;q==="NOT_FOUND"&&G.includes("database")&&G.includes("does not exist")&&G.includes(this.databaseId.database)&&vn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),B===void 0&&(B=D.INTERNAL,G="Unknown error status: "+q+" with message "+M.message),b=!0,v.o_(new $(B,G)),f.close()}else O(_e,`RPC '${e}' stream ${i} received:`,P),v.__(P)}})),hn.u_(),setTimeout((()=>{v.s_()}),0),v}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter((n=>n===e))}Go(e,n,r){super.Go(e,n,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return hd()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r0(s){return new hn(s)}function Oi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hr(s){return new cm(s,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hn.c_=!1;class au{constructor(e,n,r=1e3,i=1.5,o=6e4){this.Ci=e,this.timerId=n,this.R_=r,this.A_=i,this.V_=o,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const n=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),i=Math.max(0,n-r);i>0&&O("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.d_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,i,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="PersistentStream";class lu{constructor(e,n,r,i,o,l,c,d){this.Ci=e,this.S_=r,this.b_=i,this.connection=o,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=c,this.listener=d,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new au(e,n)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():n&&n.code===D.RESOURCE_EXHAUSTED?(rt(n.toString()),rt("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):n&&n.code===D.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(n)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),n=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,i])=>{this.D_===n&&this.G_(r,i)}),(r=>{e((()=>{const i=new $(D.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(i)}))}))}G_(e,n){const r=this.Q_(this.D_);this.stream=this.j_(e,n),this.stream.Zo((()=>{r((()=>this.listener.Zo()))})),this.stream.Yo((()=>{r((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((i=>{r((()=>this.z_(i)))})),this.stream.onMessage((i=>{r((()=>++this.F_==1?this.J_(i):this.onNext(i)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return O(oc,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return n=>{this.Ci.enqueueAndForget((()=>this.D_===e?n():(O(oc,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class i0 extends lu{constructor(e,n,r,i,o,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,l),this.serializer=o}j_(e,n){return this.connection.T_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const n=hm(this.serializer,e),r=(function(o){if(!("targetChange"in o))return W.min();const l=o.targetChange;return l.targetIds&&l.targetIds.length?W.min():l.readTime?Ke(l.readTime):W.min()})(e);return this.listener.H_(n,r)}Z_(e){const n={};n.database=co(this.serializer),n.addTarget=(function(o,l){let c;const d=l.target;if(c=so(d)?{documents:gm(o,d)}:{query:mm(o,d).ft},c.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){c.resumeToken=Kd(o,l.resumeToken);const h=oo(o,l.expectedCount);h!==null&&(c.expectedCount=h)}else if(l.snapshotVersion.compareTo(W.min())>0){c.readTime=xr(o,l.snapshotVersion.toTimestamp());const h=oo(o,l.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const r=bm(this.serializer,e);r&&(n.labels=r),this.q_(n)}X_(e){const n={};n.database=co(this.serializer),n.removeTarget=e,this.q_(n)}}class o0 extends lu{constructor(e,n,r,i,o,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,l),this.serializer=o}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,n){return this.connection.T_("Write",e,n)}J_(e){return te(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,te(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){te(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const n=fm(e.writeResults,e.commitTime),r=Ke(e.commitTime);return this.listener.na(r,n)}ra(){const e={};e.database=co(this.serializer),this.q_(e)}ea(e){const n={streamToken:this.lastStreamToken,writes:e.map((r=>pm(this.serializer,r)))};this.q_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a0{}class l0 extends a0{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ia=!1}sa(){if(this.ia)throw new $(D.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Wo(e,ao(n,r),i,o,l))).catch((o=>{throw o.name==="FirebaseError"?(o.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(D.UNKNOWN,o.toString())}))}jo(e,n,r,i,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,c])=>this.connection.jo(e,ao(n,r),i,l,c,o))).catch((l=>{throw l.name==="FirebaseError"?(l.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new $(D.UNKNOWN,l.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function c0(s,e,n,r){return new l0(s,e,n,r)}class d0{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(rt(n),this.aa=!1):O("OnlineStateTracker",n)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="RemoteStore";class u0{constructor(e,n,r,i,o){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=o,this.Aa.Mo((l=>{r.enqueueAndForget((async()=>{Zt(this)&&(O(Yt,"Restarting streams for network reachability change."),await(async function(d){const h=K(d);h.Ia.add(4),await Ts(h),h.Va.set("Unknown"),h.Ia.delete(4),await Gr(h)})(this))}))})),this.Va=new d0(r,i)}}async function Gr(s){if(Zt(s))for(const e of s.Ra)await e(!0)}async function Ts(s){for(const e of s.Ra)await e(!1)}function cu(s,e){const n=K(s);n.Ea.has(e.targetId)||(n.Ea.set(e.targetId,e),qo(n)?zo(n):Pn(n).O_()&&jo(n,e))}function Bo(s,e){const n=K(s),r=Pn(n);n.Ea.delete(e),r.O_()&&du(n,e),n.Ea.size===0&&(r.O_()?r.L_():Zt(n)&&n.Va.set("Unknown"))}function jo(s,e){if(s.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(W.min())>0){const n=s.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Pn(s).Z_(e)}function du(s,e){s.da.$e(e),Pn(s).X_(e)}function zo(s){s.da=new im({getRemoteKeysForTarget:e=>s.remoteSyncer.getRemoteKeysForTarget(e),At:e=>s.Ea.get(e)||null,ht:()=>s.datastore.serializer.databaseId}),Pn(s).start(),s.Va.ua()}function qo(s){return Zt(s)&&!Pn(s).x_()&&s.Ea.size>0}function Zt(s){return K(s).Ia.size===0}function uu(s){s.da=void 0}async function h0(s){s.Va.set("Online")}async function p0(s){s.Ea.forEach(((e,n)=>{jo(s,e)}))}async function f0(s,e){uu(s),qo(s)?(s.Va.ha(e),zo(s)):s.Va.set("Unknown")}async function g0(s,e,n){if(s.Va.set("Online"),e instanceof Wd&&e.state===2&&e.cause)try{await(async function(i,o){const l=o.cause;for(const c of o.targetIds)i.Ea.has(c)&&(await i.remoteSyncer.rejectListen(c,l),i.Ea.delete(c),i.da.removeTarget(c))})(s,e)}catch(r){O(Yt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await _r(s,r)}else if(e instanceof or?s.da.Xe(e):e instanceof Gd?s.da.st(e):s.da.tt(e),!n.isEqual(W.min()))try{const r=await ou(s.localStore);n.compareTo(r)>=0&&await(function(o,l){const c=o.da.Tt(l);return c.targetChanges.forEach(((d,h)=>{if(d.resumeToken.approximateByteSize()>0){const f=o.Ea.get(h);f&&o.Ea.set(h,f.withResumeToken(d.resumeToken,l))}})),c.targetMismatches.forEach(((d,h)=>{const f=o.Ea.get(d);if(!f)return;o.Ea.set(d,f.withResumeToken(xe.EMPTY_BYTE_STRING,f.snapshotVersion)),du(o,d);const m=new _t(f.target,d,h,f.sequenceNumber);jo(o,m)})),o.remoteSyncer.applyRemoteEvent(c)})(s,n)}catch(r){O(Yt,"Failed to raise snapshot:",r),await _r(s,r)}}async function _r(s,e,n){if(!Cn(e))throw e;s.Ia.add(1),await Ts(s),s.Va.set("Offline"),n||(n=()=>ou(s.localStore)),s.asyncQueue.enqueueRetryable((async()=>{O(Yt,"Retrying IndexedDB access"),await n(),s.Ia.delete(1),await Gr(s)}))}function hu(s,e){return e().catch((n=>_r(s,n,e)))}async function Wr(s){const e=K(s),n=Vt(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:To;for(;m0(e);)try{const i=await Ym(e.localStore,r);if(i===null){e.Ta.length===0&&n.L_();break}r=i.batchId,y0(e,i)}catch(i){await _r(e,i)}pu(e)&&fu(e)}function m0(s){return Zt(s)&&s.Ta.length<10}function y0(s,e){s.Ta.push(e);const n=Vt(s);n.O_()&&n.Y_&&n.ea(e.mutations)}function pu(s){return Zt(s)&&!Vt(s).x_()&&s.Ta.length>0}function fu(s){Vt(s).start()}async function b0(s){Vt(s).ra()}async function v0(s){const e=Vt(s);for(const n of s.Ta)e.ea(n.mutations)}async function x0(s,e,n){const r=s.Ta.shift(),i=Mo.from(r,e,n);await hu(s,(()=>s.remoteSyncer.applySuccessfulWrite(i))),await Wr(s)}async function w0(s,e){e&&Vt(s).Y_&&await(async function(r,i){if((function(l){return nm(l)&&l!==D.ABORTED})(i.code)){const o=r.Ta.shift();Vt(r).B_(),await hu(r,(()=>r.remoteSyncer.rejectFailedWrite(o.batchId,i))),await Wr(r)}})(s,e),pu(s)&&fu(s)}async function ac(s,e){const n=K(s);n.asyncQueue.verifyOperationInProgress(),O(Yt,"RemoteStore received new credentials");const r=Zt(n);n.Ia.add(3),await Ts(n),r&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ia.delete(3),await Gr(n)}async function _0(s,e){const n=K(s);e?(n.Ia.delete(2),await Gr(n)):e||(n.Ia.add(2),await Ts(n),n.Va.set("Unknown"))}function Pn(s){return s.ma||(s.ma=(function(n,r,i){const o=K(n);return o.sa(),new i0(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,i)})(s.datastore,s.asyncQueue,{Zo:h0.bind(null,s),Yo:p0.bind(null,s),t_:f0.bind(null,s),H_:g0.bind(null,s)}),s.Ra.push((async e=>{e?(s.ma.B_(),qo(s)?zo(s):s.Va.set("Unknown")):(await s.ma.stop(),uu(s))}))),s.ma}function Vt(s){return s.fa||(s.fa=(function(n,r,i){const o=K(n);return o.sa(),new o0(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,i)})(s.datastore,s.asyncQueue,{Zo:()=>Promise.resolve(),Yo:b0.bind(null,s),t_:w0.bind(null,s),ta:v0.bind(null,s),na:x0.bind(null,s)}),s.Ra.push((async e=>{e?(s.fa.B_(),await Wr(s)):(await s.fa.stop(),s.Ta.length>0&&(O(Yt,`Stopping write stream with ${s.Ta.length} pending writes`),s.Ta=[]))}))),s.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,n,r,i,o){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=o,this.deferred=new nt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,o){const l=Date.now()+r,c=new Ho(e,n,l,i,o);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(D.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Go(s,e){if(rt("AsyncQueue",`${e}: ${s}`),Cn(s))return new $(D.UNAVAILABLE,`${e}: ${s}`);throw s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{static emptySet(e){return new pn(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||U.comparator(n.key,r.key):(n,r)=>U.comparator(n.key,r.key),this.keyedMap=Xn(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((n,r)=>(e(n),!1)))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof pn)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,o=r.getNext().key;if(!i.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((n=>{e.push(n.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new pn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(){this.ga=new oe(U.comparator)}track(e){const n=e.doc.key,r=this.ga.get(n);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(n,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(n):e.type===1&&r.type===2?this.ga=this.ga.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):z(63341,{Vt:e,pa:r}):this.ga=this.ga.insert(n,e)}ya(){const e=[];return this.ga.inorderTraversal(((n,r)=>{e.push(r)})),e}}class kn{constructor(e,n,r,i,o,l,c,d,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=o,this.fromCache=l,this.syncStateChanged=c,this.excludesMetadataChanges=d,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,o){const l=[];return n.forEach((c=>{l.push({type:0,doc:c})})),new kn(e,n,pn.emptySet(n),l,r,i,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Ur(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E0{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class k0{constructor(){this.queries=cc(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,r){const i=K(n),o=i.queries;i.queries=cc(),o.forEach(((l,c)=>{for(const d of c.Sa)d.onError(r)}))})(this,new $(D.ABORTED,"Firestore shutting down"))}}function cc(){return new Xt((s=>Vd(s)),Ur)}async function gu(s,e){const n=K(s);let r=3;const i=e.query;let o=n.queries.get(i);o?!o.ba()&&e.Da()&&(r=2):(o=new E0,r=e.Da()?0:1);try{switch(r){case 0:o.wa=await n.onListen(i,!0);break;case 1:o.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(l){const c=Go(l,`Initialization of query '${ln(e.query)}' failed`);return void e.onError(c)}n.queries.set(i,o),o.Sa.push(e),e.va(n.onlineState),o.wa&&e.Fa(o.wa)&&Wo(n)}async function mu(s,e){const n=K(s),r=e.query;let i=3;const o=n.queries.get(r);if(o){const l=o.Sa.indexOf(e);l>=0&&(o.Sa.splice(l,1),o.Sa.length===0?i=e.Da()?0:1:!o.ba()&&e.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function I0(s,e){const n=K(s);let r=!1;for(const i of e){const o=i.query,l=n.queries.get(o);if(l){for(const c of l.Sa)c.Fa(i)&&(r=!0);l.wa=i}}r&&Wo(n)}function T0(s,e,n){const r=K(s),i=r.queries.get(e);if(i)for(const o of i.Sa)o.onError(n);r.queries.delete(e)}function Wo(s){s.Ca.forEach((e=>{e.next()}))}var po,dc;(dc=po||(po={})).Ma="default",dc.Cache="cache";class yu{constructor(e,n,r){this.query=e,this.xa=n,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new kn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),n=!0):this.La(e,this.onlineState)&&(this.ka(e),n=!0),this.Na=e,n}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let n=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),n=!0),n}La(e,n){if(!e.fromCache||!this.Da())return!0;const r=n!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const n=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}ka(e){e=kn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==po.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(e){this.key=e}}class vu{constructor(e){this.key=e}}class S0{constructor(e,n){this.query=e,this.Za=n,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=X(),this.mutatedKeys=X(),this.eu=Md(e),this.tu=new pn(this.eu)}get nu(){return this.Za}ru(e,n){const r=n?n.iu:new lc,i=n?n.tu:this.tu;let o=n?n.mutatedKeys:this.mutatedKeys,l=i,c=!1;const d=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,m)=>{const b=i.get(f),v=Br(this.query,m)?m:null,T=!!b&&this.mutatedKeys.has(b.key),R=!!v&&(v.hasLocalMutations||this.mutatedKeys.has(v.key)&&v.hasCommittedMutations);let P=!1;b&&v?b.data.isEqual(v.data)?T!==R&&(r.track({type:3,doc:v}),P=!0):this.su(b,v)||(r.track({type:2,doc:v}),P=!0,(d&&this.eu(v,d)>0||h&&this.eu(v,h)<0)&&(c=!0)):!b&&v?(r.track({type:0,doc:v}),P=!0):b&&!v&&(r.track({type:1,doc:b}),P=!0,(d||h)&&(c=!0)),P&&(v?(l=l.add(v),o=R?o.add(f):o.delete(f)):(l=l.delete(f),o=o.delete(f)))})),this.query.limit!==null)for(;l.size>this.query.limit;){const f=this.query.limitType==="F"?l.last():l.first();l=l.delete(f.key),o=o.delete(f.key),r.track({type:1,doc:f})}return{tu:l,iu:r,bs:c,mutatedKeys:o}}su(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const l=e.iu.ya();l.sort(((f,m)=>(function(v,T){const R=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return z(20277,{Vt:P})}};return R(v)-R(T)})(f.type,m.type)||this.eu(f.doc,m.doc))),this.ou(r),i=i??!1;const c=n&&!i?this._u():[],d=this.Ya.size===0&&this.current&&!i?1:0,h=d!==this.Xa;return this.Xa=d,l.length!==0||h?{snapshot:new kn(this.query,e.tu,o,l,e.mutatedKeys,d===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:c}:{au:c}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new lc,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((n=>this.Za=this.Za.add(n))),e.modifiedDocuments.forEach((n=>{})),e.removedDocuments.forEach((n=>this.Za=this.Za.delete(n))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=X(),this.tu.forEach((r=>{this.uu(r.key)&&(this.Ya=this.Ya.add(r.key))}));const n=[];return e.forEach((r=>{this.Ya.has(r)||n.push(new vu(r))})),this.Ya.forEach((r=>{e.has(r)||n.push(new bu(r))})),n}cu(e){this.Za=e.ks,this.Ya=X();const n=this.ru(e.documents);return this.applyChanges(n,!0)}lu(){return kn.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Ko="SyncEngine";class A0{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class R0{constructor(e){this.key=e,this.hu=!1}}class C0{constructor(e,n,r,i,o,l){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=o,this.maxConcurrentLimboResolutions=l,this.Pu={},this.Tu=new Xt((c=>Vd(c)),Ur),this.Eu=new Map,this.Iu=new Set,this.Ru=new oe(U.comparator),this.Au=new Map,this.Vu=new $o,this.du={},this.mu=new Map,this.fu=En.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function P0(s,e,n=!0){const r=Iu(s);let i;const o=r.Tu.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),i=o.view.lu()):i=await xu(r,e,n,!0),i}async function D0(s,e){const n=Iu(s);await xu(n,e,!0,!1)}async function xu(s,e,n,r){const i=await Jm(s.localStore,We(e)),o=i.targetId,l=s.sharedClientState.addLocalQueryTarget(o,n);let c;return r&&(c=await V0(s,e,o,l==="current",i.resumeToken)),s.isPrimaryClient&&n&&cu(s.remoteStore,i),c}async function V0(s,e,n,r,i){s.pu=(m,b,v)=>(async function(R,P,L,M){let q=P.view.ru(L);q.bs&&(q=await nc(R.localStore,P.query,!1).then((({documents:E})=>P.view.ru(E,q))));const B=M&&M.targetChanges.get(P.targetId),G=M&&M.targetMismatches.get(P.targetId)!=null,Z=P.view.applyChanges(q,R.isPrimaryClient,B,G);return hc(R,P.targetId,Z.au),Z.snapshot})(s,m,b,v);const o=await nc(s.localStore,e,!0),l=new S0(e,o.ks),c=l.ru(o.documents),d=Is.createSynthesizedTargetChangeForCurrentChange(n,r&&s.onlineState!=="Offline",i),h=l.applyChanges(c,s.isPrimaryClient,d);hc(s,n,h.au);const f=new A0(e,n,l);return s.Tu.set(e,f),s.Eu.has(n)?s.Eu.get(n).push(e):s.Eu.set(n,[e]),h.snapshot}async function M0(s,e,n){const r=K(s),i=r.Tu.get(e),o=r.Eu.get(i.targetId);if(o.length>1)return r.Eu.set(i.targetId,o.filter((l=>!Ur(l,e)))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await uo(r.localStore,i.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Bo(r.remoteStore,i.targetId),fo(r,i.targetId)})).catch(Rn)):(fo(r,i.targetId),await uo(r.localStore,i.targetId,!0))}async function N0(s,e){const n=K(s),r=n.Tu.get(e),i=n.Eu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Bo(n.remoteStore,r.targetId))}async function L0(s,e,n){const r=z0(s);try{const i=await(function(l,c){const d=K(l),h=ie.now(),f=c.reduce(((v,T)=>v.add(T.key)),X());let m,b;return d.persistence.runTransaction("Locally write mutations","readwrite",(v=>{let T=it(),R=X();return d.xs.getEntries(v,f).next((P=>{T=P,T.forEach(((L,M)=>{M.isValidDocument()||(R=R.add(L))}))})).next((()=>d.localDocuments.getOverlayedDocuments(v,T))).next((P=>{m=P;const L=[];for(const M of c){const q=Jg(M,m.get(M.key).overlayedDocument);q!=null&&L.push(new $t(M.key,q,Id(q.value.mapValue),Le.exists(!0)))}return d.mutationQueue.addMutationBatch(v,h,L,c)})).next((P=>{b=P;const L=P.applyToLocalDocumentSet(m,R);return d.documentOverlayCache.saveOverlays(v,P.batchId,L)}))})).then((()=>({batchId:b.batchId,changes:Ld(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),(function(l,c,d){let h=l.du[l.currentUser.toKey()];h||(h=new oe(J)),h=h.insert(c,d),l.du[l.currentUser.toKey()]=h})(r,i.batchId,n),await Ss(r,i.changes),await Wr(r.remoteStore)}catch(i){const o=Go(i,"Failed to persist write");n.reject(o)}}async function wu(s,e){const n=K(s);try{const r=await Km(n.localStore,e);e.targetChanges.forEach(((i,o)=>{const l=n.Au.get(o);l&&(te(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?l.hu=!0:i.modifiedDocuments.size>0?te(l.hu,14607):i.removedDocuments.size>0&&(te(l.hu,42227),l.hu=!1))})),await Ss(n,r,e)}catch(r){await Rn(r)}}function uc(s,e,n){const r=K(s);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Tu.forEach(((o,l)=>{const c=l.view.va(e);c.snapshot&&i.push(c.snapshot)})),(function(l,c){const d=K(l);d.onlineState=c;let h=!1;d.queries.forEach(((f,m)=>{for(const b of m.Sa)b.va(c)&&(h=!0)})),h&&Wo(d)})(r.eventManager,e),i.length&&r.Pu.H_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function $0(s,e,n){const r=K(s);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Au.get(e),o=i&&i.key;if(o){let l=new oe(U.comparator);l=l.insert(o,Ee.newNoDocument(o,W.min()));const c=X().add(o),d=new qr(W.min(),new Map,new oe(J),l,c);await wu(r,d),r.Ru=r.Ru.remove(o),r.Au.delete(e),Qo(r)}else await uo(r.localStore,e,!1).then((()=>fo(r,e,n))).catch(Rn)}async function O0(s,e){const n=K(s),r=e.batch.batchId;try{const i=await Wm(n.localStore,e);Eu(n,r,null),_u(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Ss(n,i)}catch(i){await Rn(i)}}async function F0(s,e,n){const r=K(s);try{const i=await(function(l,c){const d=K(l);return d.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return d.mutationQueue.lookupMutationBatch(h,c).next((m=>(te(m!==null,37113),f=m.keys(),d.mutationQueue.removeMutationBatch(h,m)))).next((()=>d.mutationQueue.performConsistencyCheck(h))).next((()=>d.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>d.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>d.localDocuments.getDocuments(h,f)))}))})(r.localStore,e);Eu(r,e,n),_u(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Ss(r,i)}catch(i){await Rn(i)}}function _u(s,e){(s.mu.get(e)||[]).forEach((n=>{n.resolve()})),s.mu.delete(e)}function Eu(s,e,n){const r=K(s);let i=r.du[r.currentUser.toKey()];if(i){const o=i.get(e);o&&(n?o.reject(n):o.resolve(),i=i.remove(e)),r.du[r.currentUser.toKey()]=i}}function fo(s,e,n=null){s.sharedClientState.removeLocalQueryTarget(e);for(const r of s.Eu.get(e))s.Tu.delete(r),n&&s.Pu.yu(r,n);s.Eu.delete(e),s.isPrimaryClient&&s.Vu.Gr(e).forEach((r=>{s.Vu.containsKey(r)||ku(s,r)}))}function ku(s,e){s.Iu.delete(e.path.canonicalString());const n=s.Ru.get(e);n!==null&&(Bo(s.remoteStore,n),s.Ru=s.Ru.remove(e),s.Au.delete(n),Qo(s))}function hc(s,e,n){for(const r of n)r instanceof bu?(s.Vu.addReference(r.key,e),U0(s,r)):r instanceof vu?(O(Ko,"Document no longer in limbo: "+r.key),s.Vu.removeReference(r.key,e),s.Vu.containsKey(r.key)||ku(s,r.key)):z(19791,{wu:r})}function U0(s,e){const n=e.key,r=n.path.canonicalString();s.Ru.get(n)||s.Iu.has(r)||(O(Ko,"New document in limbo: "+n),s.Iu.add(r),Qo(s))}function Qo(s){for(;s.Iu.size>0&&s.Ru.size<s.maxConcurrentLimboResolutions;){const e=s.Iu.values().next().value;s.Iu.delete(e);const n=new U(se.fromString(e)),r=s.fu.next();s.Au.set(r,new R0(n)),s.Ru=s.Ru.insert(n,r),cu(s.remoteStore,new _t(We(Po(n.path)),r,"TargetPurposeLimboResolution",$r.ce))}}async function Ss(s,e,n){const r=K(s),i=[],o=[],l=[];r.Tu.isEmpty()||(r.Tu.forEach(((c,d)=>{l.push(r.pu(d,e,n).then((h=>{var f;if((h||n)&&r.isPrimaryClient){const m=h?!h.fromCache:(f=n==null?void 0:n.targetChanges.get(d.targetId))==null?void 0:f.current;r.sharedClientState.updateQueryState(d.targetId,m?"current":"not-current")}if(h){i.push(h);const m=Fo.Is(d.targetId,h);o.push(m)}})))})),await Promise.all(l),r.Pu.H_(i),await(async function(d,h){const f=K(d);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>V.forEach(h,(b=>V.forEach(b.Ts,(v=>f.persistence.referenceDelegate.addReference(m,b.targetId,v))).next((()=>V.forEach(b.Es,(v=>f.persistence.referenceDelegate.removeReference(m,b.targetId,v)))))))))}catch(m){if(!Cn(m))throw m;O(Uo,"Failed to update sequence numbers: "+m)}for(const m of h){const b=m.targetId;if(!m.fromCache){const v=f.vs.get(b),T=v.snapshotVersion,R=v.withLastLimboFreeSnapshotVersion(T);f.vs=f.vs.insert(b,R)}}})(r.localStore,o))}async function B0(s,e){const n=K(s);if(!n.currentUser.isEqual(e)){O(Ko,"User change. New user:",e.toKey());const r=await iu(n.localStore,e);n.currentUser=e,(function(o,l){o.mu.forEach((c=>{c.forEach((d=>{d.reject(new $(D.CANCELLED,l))}))})),o.mu.clear()})(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ss(n,r.Ns)}}function j0(s,e){const n=K(s),r=n.Au.get(e);if(r&&r.hu)return X().add(r.key);{let i=X();const o=n.Eu.get(e);if(!o)return i;for(const l of o){const c=n.Tu.get(l);i=i.unionWith(c.view.nu)}return i}}function Iu(s){const e=K(s);return e.remoteStore.remoteSyncer.applyRemoteEvent=wu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=j0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=$0.bind(null,e),e.Pu.H_=I0.bind(null,e.eventManager),e.Pu.yu=T0.bind(null,e.eventManager),e}function z0(s){const e=K(s);return e.remoteStore.remoteSyncer.applySuccessfulWrite=O0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=F0.bind(null,e),e}class Er{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Hr(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,n){return null}Mu(e,n){return null}vu(e){return Gm(this.persistence,new zm,e.initialUser,this.serializer)}Cu(e){return new ru(Oo.Vi,this.serializer)}Du(e){return new Zm}async terminate(){var e,n;(e=this.gcScheduler)==null||e.stop(),(n=this.indexBackfillerScheduler)==null||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Er.provider={build:()=>new Er};class q0 extends Er{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,n){te(this.persistence.referenceDelegate instanceof wr,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Am(r,e.asyncQueue,n)}Cu(e){const n=this.cacheSizeBytes!==void 0?Ce.withCacheSize(this.cacheSizeBytes):Ce.DEFAULT;return new ru((r=>wr.Vi(r,n)),this.serializer)}}class go{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>uc(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=B0.bind(null,this.syncEngine),await _0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new k0})()}createDatastore(e){const n=Hr(e.databaseInfo.databaseId),r=r0(e.databaseInfo);return c0(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return(function(r,i,o,l,c){return new u0(r,i,o,l,c)})(this.localStore,this.datastore,e.asyncQueue,(n=>uc(this.syncEngine,n,0)),(function(){return ic.v()?new ic:new e0})())}createSyncEngine(e,n){return(function(i,o,l,c,d,h,f){const m=new C0(i,o,l,c,d,h);return f&&(m.gu=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await(async function(i){const o=K(i);O(Yt,"RemoteStore shutting down."),o.Ia.add(5),await Ts(o),o.Aa.shutdown(),o.Va.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(n=this.eventManager)==null||n.terminate()}}go.provider={build:()=>new go};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):rt("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,n){setTimeout((()=>{this.muted||e(n)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mt="FirestoreClient";class H0{constructor(e,n,r,i,o){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this._databaseInfo=i,this.user=Re.UNAUTHENTICATED,this.clientId=Io.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,(async l=>{O(Mt,"Received user=",l.uid),await this.authCredentialListener(l),this.user=l})),this.appCheckCredentials.start(r,(l=>(O(Mt,"Received new app check token=",l),this.appCheckCredentialListener(l,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new nt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Go(n,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Fi(s,e){s.asyncQueue.verifyOperationInProgress(),O(Mt,"Initializing OfflineComponentProvider");const n=s.configuration;await e.initialize(n);let r=n.initialUser;s.setCredentialChangeListener((async i=>{r.isEqual(i)||(await iu(e.localStore,i),r=i)})),e.persistence.setDatabaseDeletedListener((()=>s.terminate())),s._offlineComponents=e}async function pc(s,e){s.asyncQueue.verifyOperationInProgress();const n=await G0(s);O(Mt,"Initializing OnlineComponentProvider"),await e.initialize(n,s.configuration),s.setCredentialChangeListener((r=>ac(e.remoteStore,r))),s.setAppCheckTokenChangeListener(((r,i)=>ac(e.remoteStore,i))),s._onlineComponents=e}async function G0(s){if(!s._offlineComponents)if(s._uninitializedComponentsProvider){O(Mt,"Using user provided OfflineComponentProvider");try{await Fi(s,s._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!(function(i){return i.name==="FirebaseError"?i.code===D.FAILED_PRECONDITION||i.code===D.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(n))throw n;vn("Error using user provided cache. Falling back to memory cache: "+n),await Fi(s,new Er)}}else O(Mt,"Using default OfflineComponentProvider"),await Fi(s,new q0(void 0));return s._offlineComponents}async function Su(s){return s._onlineComponents||(s._uninitializedComponentsProvider?(O(Mt,"Using user provided OnlineComponentProvider"),await pc(s,s._uninitializedComponentsProvider._online)):(O(Mt,"Using default OnlineComponentProvider"),await pc(s,new go))),s._onlineComponents}function W0(s){return Su(s).then((e=>e.syncEngine))}async function Au(s){const e=await Su(s),n=e.eventManager;return n.onListen=P0.bind(null,e.syncEngine),n.onUnlisten=M0.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=D0.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=N0.bind(null,e.syncEngine),n}function K0(s,e,n={}){const r=new nt;return s.asyncQueue.enqueueAndForget((async()=>(function(o,l,c,d,h){const f=new Tu({next:b=>{f.Nu(),l.enqueueAndForget((()=>mu(o,m)));const v=b.docs.has(c);!v&&b.fromCache?h.reject(new $(D.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&b.fromCache&&d&&d.source==="server"?h.reject(new $(D.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(b)},error:b=>h.reject(b)}),m=new yu(Po(c.path),f,{includeMetadataChanges:!0,qa:!0});return gu(o,m)})(await Au(s),s.asyncQueue,e,n,r))),r.promise}function Q0(s,e,n={}){const r=new nt;return s.asyncQueue.enqueueAndForget((async()=>(function(o,l,c,d,h){const f=new Tu({next:b=>{f.Nu(),l.enqueueAndForget((()=>mu(o,m))),b.fromCache&&d.source==="server"?h.reject(new $(D.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(b)},error:b=>h.reject(b)}),m=new yu(c,f,{includeMetadataChanges:!0,qa:!0});return gu(o,m)})(await Au(s),s.asyncQueue,e,n,r))),r.promise}function Y0(s,e){const n=new nt;return s.asyncQueue.enqueueAndForget((async()=>L0(await W0(s),e,n))),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ru(s){const e={};return s.timeoutSeconds!==void 0&&(e.timeoutSeconds=s.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J0="ComponentProvider",fc=new Map;function X0(s,e,n,r,i){return new vg(s,e,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,Ru(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z0="firestore.googleapis.com",gc=!0;class mc{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new $(D.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Z0,this.ssl=gc}else this.host=e.host,this.ssl=e.ssl??gc;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=nu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<su)throw new $(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}lg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ru(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Yo{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new mc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(D.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(D.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new mc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Zf;switch(r.type){case"firstParty":return new ng(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new $(D.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(n){const r=fc.get(n);r&&(O(J0,"Removing Datastore"),fc.delete(n),r.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Dn(this.firestore,e,this._query)}}class de{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new St(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new de(this.firestore,e,this._key)}toJSON(){return{type:de._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(_s(n,de._jsonSchema))return new de(e,r||null,new U(se.fromString(n.referencePath)))}}de._jsonSchemaVersion="firestore/documentReference/1.0",de._jsonSchema={type:pe("string",de._jsonSchemaVersion),referencePath:pe("string")};class St extends Dn{constructor(e,n,r){super(e,n,Po(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new de(this.firestore,null,new U(e))}withConverter(e){return new St(this.firestore,e,this._path)}}function Jo(s,e,...n){if(s=Se(s),fd("collection","path",e),s instanceof Yo){const r=se.fromString(e,...n);return Rl(r),new St(s,null,r)}{if(!(s instanceof de||s instanceof St))throw new $(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=s._path.child(se.fromString(e,...n));return Rl(r),new St(s.firestore,null,r)}}function Ge(s,e,...n){if(s=Se(s),arguments.length===1&&(e=Io.newId()),fd("doc","path",e),s instanceof Yo){const r=se.fromString(e,...n);return Al(r),new de(s,null,new U(r))}{if(!(s instanceof de||s instanceof St))throw new $(D.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=s._path.child(se.fromString(e,...n));return Al(r),new de(s.firestore,s instanceof St?s.converter:null,new U(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yc="AsyncQueue";class bc{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new au(this,"async_queue_retry"),this._c=()=>{const r=Oi();r&&O(yc,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const n=Oi();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const n=Oi();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const n=new nt;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise))).then((()=>n.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Cn(e))throw e;O(yc,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const n=this.ac.then((()=>(this.rc=!0,e().catch((r=>{throw this.nc=r,this.rc=!1,rt("INTERNAL UNHANDLED ERROR: ",vc(r)),r})).then((r=>(this.rc=!1,r))))));return this.ac=n,n}enqueueAfterDelay(e,n,r){this.uc(),this.oc.indexOf(e)>-1&&(n=0);const i=Ho.createAndSchedule(this,e,n,r,(o=>this.hc(o)));return this.tc.push(i),i}uc(){this.nc&&z(47125,{Pc:vc(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const n of this.tc)if(n.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((n,r)=>n.targetTimeMs-r.targetTimeMs));for(const n of this.tc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const n=this.tc.indexOf(e);this.tc.splice(n,1)}}function vc(s){let e=s.message||"";return s.stack&&(e=s.stack.includes(s.message)?s.stack:s.message+`
`+s.stack),e}class en extends Yo{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new bc,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new bc(e),this._firestoreClient=void 0,await e}}}function ey(s,e,n){n||(n=gr);const r=Eo(s,"firestore");if(r.isInitialized(n)){const i=r.getImmediate({identifier:n}),o=r.getOptions(n);if(Wt(o,e))return i;throw new $(D.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new $(D.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<su)throw new $(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&ws(e.host)&&td(e.host),r.initialize({options:e,instanceIdentifier:n})}function Xo(s){if(s._terminated)throw new $(D.FAILED_PRECONDITION,"The client has already been terminated.");return s._firestoreClient||ty(s),s._firestoreClient}function ty(s){var r,i,o,l;const e=s._freezeSettings(),n=X0(s._databaseId,((r=s._app)==null?void 0:r.options.appId)||"",s._persistenceKey,(i=s._app)==null?void 0:i.options.apiKey,e);s._componentsProvider||(o=e.localCache)!=null&&o._offlineComponentProvider&&((l=e.localCache)!=null&&l._onlineComponentProvider)&&(s._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),s._firestoreClient=new H0(s._authCredentials,s._appCheckCredentials,s._queue,n,s._componentsProvider&&(function(d){const h=d==null?void 0:d._online.build();return{_offline:d==null?void 0:d._offline.build(h),_online:h}})(s._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Me(xe.fromBase64String(e))}catch(n){throw new $(D.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Me(xe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Me._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(_s(e,Me._jsonSchema))return Me.fromBase64String(e.bytes)}}Me._jsonSchemaVersion="firestore/bytes/1.0",Me._jsonSchema={type:pe("string",Me._jsonSchemaVersion),bytes:pe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(D.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ve(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(D.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(D.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return J(this._lat,e._lat)||J(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Qe._jsonSchemaVersion}}static fromJSON(e){if(_s(e,Qe._jsonSchema))return new Qe(e.latitude,e.longitude)}}Qe._jsonSchemaVersion="firestore/geoPoint/1.0",Qe._jsonSchema={type:pe("string",Qe._jsonSchemaVersion),latitude:pe("number"),longitude:pe("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this._values=(e||[]).map((n=>n))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,i){if(r.length!==i.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==i[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Fe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(_s(e,Fe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((n=>typeof n=="number")))return new Fe(e.vectorValues);throw new $(D.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Fe._jsonSchemaVersion="firestore/vectorValue/1.0",Fe._jsonSchema={type:pe("string",Fe._jsonSchemaVersion),vectorValues:pe("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ny=/^__.*__$/;class sy{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new $t(e,this.data,this.fieldMask,n,this.fieldTransforms):new ks(e,this.data,n,this.fieldTransforms)}}class Cu{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new $t(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Pu(s){switch(s){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw z(40011,{dataSource:s})}}class ea{constructor(e,n,r,i,o,l){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=l||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new ea({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.mc(e),r}fc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.Ac(),r}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return kr(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((n=>e.isPrefixOf(n)))!==void 0||this.fieldTransforms.find((n=>e.isPrefixOf(n.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(Pu(this.dataSource)&&ny.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class ry{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Hr(e)}I(e,n,r,i=!1){return new ea({dataSource:e,methodName:n,targetDoc:r,path:ve.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Qr(s){const e=s._freezeSettings(),n=Hr(s._databaseId);return new ry(s._databaseId,!!e.ignoreUndefinedProperties,n)}function Du(s,e,n,r,i,o={}){const l=s.I(o.merge||o.mergeFields?2:0,e,n,i);na("Data must be an object, but it was:",l,r);const c=Vu(r,l);let d,h;if(o.merge)d=new Ve(l.fieldMask),h=l.fieldTransforms;else if(o.mergeFields){const f=[];for(const m of o.mergeFields){const b=In(e,m,n);if(!l.contains(b))throw new $(D.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);Lu(f,b)||f.push(b)}d=new Ve(f),h=l.fieldTransforms.filter((m=>d.covers(m.field)))}else d=null,h=l.fieldTransforms;return new sy(new Pe(c),d,h)}class Yr extends Kr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.yc(`${this._methodName}() can only appear at the top level of your update data`):e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Yr}}class ta extends Kr{_toFieldTransform(e){return new Wg(e.path,new fs)}isEqual(e){return e instanceof ta}}function iy(s,e,n,r){const i=s.I(1,e,n);na("Data must be an object, but it was:",i,r);const o=[],l=Pe.empty();Lt(r,((d,h)=>{const f=Nu(e,d,n);h=Se(h);const m=i.fc(f);if(h instanceof Yr)o.push(f);else{const b=As(h,m);b!=null&&(o.push(f),l.set(f,b))}}));const c=new Ve(o);return new Cu(l,c,i.fieldTransforms)}function oy(s,e,n,r,i,o){const l=s.I(1,e,n),c=[In(e,r,n)],d=[i];if(o.length%2!=0)throw new $(D.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let b=0;b<o.length;b+=2)c.push(In(e,o[b])),d.push(o[b+1]);const h=[],f=Pe.empty();for(let b=c.length-1;b>=0;--b)if(!Lu(h,c[b])){const v=c[b];let T=d[b];T=Se(T);const R=l.fc(v);if(T instanceof Yr)h.push(v);else{const P=As(T,R);P!=null&&(h.push(v),f.set(v,P))}}const m=new Ve(h);return new Cu(f,m,l.fieldTransforms)}function ay(s,e,n,r=!1){return As(n,s.I(r?4:3,e))}function As(s,e){if(Mu(s=Se(s)))return na("Unsupported field value:",e,s),Vu(s,e);if(s instanceof Kr)return(function(r,i){if(!Pu(i.dataSource))throw i.yc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.yc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(s,e),null;if(s===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),s instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return(function(r,i){const o=[];let l=0;for(const c of r){let d=As(c,i.gc(l));d==null&&(d={nullValue:"NULL_VALUE"}),o.push(d),l++}return{arrayValue:{values:o}}})(s,e)}return(function(r,i){if((r=Se(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return qg(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=ie.fromDate(r);return{timestampValue:xr(i.serializer,o)}}if(r instanceof ie){const o=new ie(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:xr(i.serializer,o)}}if(r instanceof Qe)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Me)return{bytesValue:Kd(i.serializer,r._byteString)};if(r instanceof de){const o=i.databaseId,l=r.firestore._databaseId;if(!l.isEqual(o))throw i.yc(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Lo(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Fe)return(function(l,c){const d=l instanceof Fe?l.toArray():l;return{mapValue:{fields:{[Ed]:{stringValue:kd},[mr]:{arrayValue:{values:d.map((f=>{if(typeof f!="number")throw c.yc("VectorValues must only contain numeric values.");return Do(c.serializer,f)}))}}}}}})(r,i);if(tu(r))return r._toProto(i.serializer);throw i.yc(`Unsupported field value: ${Lr(r)}`)})(s,e)}function Vu(s,e){const n={};return yd(s)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Lt(s,((r,i)=>{const o=As(i,e.dc(r));o!=null&&(n[r]=o)})),{mapValue:{fields:n}}}function Mu(s){return!(typeof s!="object"||s===null||s instanceof Array||s instanceof Date||s instanceof ie||s instanceof Qe||s instanceof Me||s instanceof de||s instanceof Kr||s instanceof Fe||tu(s))}function na(s,e,n){if(!Mu(n)||!gd(n)){const r=Lr(n);throw r==="an object"?e.yc(s+" a custom object"):e.yc(s+" "+r)}}function In(s,e,n){if((e=Se(e))instanceof Zo)return e._internalPath;if(typeof e=="string")return Nu(s,e);throw kr("Field path arguments must be of type string or ",s,!1,void 0,n)}const ly=new RegExp("[~\\*/\\[\\]]");function Nu(s,e,n){if(e.search(ly)>=0)throw kr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,s,!1,void 0,n);try{return new Zo(...e.split("."))._internalPath}catch{throw kr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,s,!1,void 0,n)}}function kr(s,e,n,r,i){const o=r&&!r.isEmpty(),l=i!==void 0;let c=`Function ${e}() called with invalid data`;n&&(c+=" (via `toFirestore()`)"),c+=". ";let d="";return(o||l)&&(d+=" (found",o&&(d+=` in field ${r}`),l&&(d+=` in document ${i}`),d+=")"),new $(D.INVALID_ARGUMENT,c+s+d)}function Lu(s,e){return s.some((n=>n.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{convertValue(e,n="none"){switch(Dt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Pt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw z(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Lt(e,((i,o)=>{r[i]=this.convertValue(o,n)})),r}convertVectorValue(e){var r,i,o;const n=(o=(i=(r=e.fields)==null?void 0:r[mr].arrayValue)==null?void 0:i.values)==null?void 0:o.map((l=>ce(l.doubleValue)));return new Fe(n)}convertGeoPoint(e){return new Qe(ce(e.latitude),ce(e.longitude))}convertArray(e,n){return(e.values||[]).map((r=>this.convertValue(r,n)))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Fr(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(us(e));default:return null}}convertTimestamp(e){const n=Ct(e);return new ie(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=se.fromString(e);te(eu(r),9688,{name:e});const i=new hs(r.get(1),r.get(3)),o=new U(r.popFirst(5));return i.isEqual(n)||rt(`Document ${o} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),o}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u extends cy{constructor(e){super(),this.firestore=e}convertBytes(e){return new Me(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new de(this.firestore,null,n)}}function Jr(){return new ta("serverTimestamp")}const xc="@firebase/firestore",wc="4.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ou{constructor(e,n,r,i,o){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new de(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new dy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const n=this._document.data.field(In("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class dy extends Ou{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uy(s){if(s.limitType==="L"&&s.explicitOrderBy.length===0)throw new $(D.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class sa{}class hy extends sa{}function py(s,e,...n){let r=[];e instanceof sa&&r.push(e),r=r.concat(n),(function(o){const l=o.filter((d=>d instanceof ra)).length,c=o.filter((d=>d instanceof Xr)).length;if(l>1||l>0&&c>0)throw new $(D.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const i of r)s=i._apply(s);return s}class Xr extends hy{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new Xr(e,n,r)}_apply(e){const n=this._parse(e);return Fu(e._query,n),new Dn(e.firestore,e.converter,ro(e._query,n))}_parse(e){const n=Qr(e.firestore);return(function(o,l,c,d,h,f,m){let b;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new $(D.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Ec(m,f);const T=[];for(const R of m)T.push(_c(d,o,R));b={arrayValue:{values:T}}}else b=_c(d,o,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Ec(m,f),b=ay(c,l,m,f==="in"||f==="not-in");return he.create(h,f,b)})(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function fy(s,e,n){const r=e,i=In("where",s);return Xr._create(i,r,n)}class ra extends sa{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new ra(e,n)}_parse(e){const n=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return n.length===1?n[0]:Ue.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:((function(i,o){let l=i;const c=o.getFlattenedFilters();for(const d of c)Fu(l,d),l=ro(l,d)})(e._query,n),new Dn(e.firestore,e.converter,ro(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function _c(s,e,n){if(typeof(n=Se(n))=="string"){if(n==="")throw new $(D.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Dd(e)&&n.indexOf("/")!==-1)throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(se.fromString(n));if(!U.isDocumentKey(r))throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return $l(s,new U(r))}if(n instanceof de)return $l(s,n._key);throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Lr(n)}.`)}function Ec(s,e){if(!Array.isArray(s)||s.length===0)throw new $(D.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Fu(s,e){const n=(function(i,o){for(const l of i)for(const c of l.getFlattenedFilters())if(o.indexOf(c.op)>=0)return c.op;return null})(s.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(n!==null)throw n===e.op?new $(D.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(D.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}function Uu(s,e,n){let r;return r=s?s.toFirestore(e):e,r}class es{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Gt extends Ou{constructor(e,n,r,i,o,l){super(e,n,r,i,l),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new ar(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(In("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new $(D.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=Gt._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}Gt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Gt._jsonSchema={type:pe("string",Gt._jsonSchemaVersion),bundleSource:pe("string","DocumentSnapshot"),bundleName:pe("string"),bundle:pe("string")};class ar extends Gt{data(e={}){return super.data(e)}}class fn{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new es(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach((n=>e.push(n))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach((r=>{e.call(n,new ar(this._firestore,this._userDataWriter,r.key,r,new es(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(D.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=(function(i,o){if(i._snapshot.oldDocs.isEmpty()){let l=0;return i._snapshot.docChanges.map((c=>{const d=new ar(i._firestore,i._userDataWriter,c.doc.key,c.doc,new es(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:d,oldIndex:-1,newIndex:l++}}))}{let l=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((c=>o||c.type!==3)).map((c=>{const d=new ar(i._firestore,i._userDataWriter,c.doc.key,c.doc,new es(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return c.type!==0&&(h=l.indexOf(c.doc.key),l=l.delete(c.doc.key)),c.type!==1&&(l=l.add(c.doc),f=l.indexOf(c.doc.key)),{type:gy(c.type),doc:d,oldIndex:h,newIndex:f}}))}})(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new $(D.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=fn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Io.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach((o=>{o._document!==null&&(n.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),i.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function gy(s){switch(s){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return z(61501,{type:s})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */fn._jsonSchemaVersion="firestore/querySnapshot/1.0",fn._jsonSchema={type:pe("string",fn._jsonSchemaVersion),bundleSource:pe("string","QuerySnapshot"),bundleName:pe("string"),bundle:pe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lr(s){s=Xe(s,de);const e=Xe(s.firestore,en),n=Xo(e);return K0(n,s._key).then((r=>yy(e,s,r)))}function Bu(s){s=Xe(s,Dn);const e=Xe(s.firestore,en),n=Xo(e),r=new $u(e);return uy(s._query),Q0(n,s._query).then((i=>new fn(e,r,s,i)))}function Zr(s,e,n){s=Xe(s,de);const r=Xe(s.firestore,en),i=Uu(s.converter,e),o=Qr(r);return ei(r,[Du(o,"setDoc",s._key,i,s.converter!==null,n).toMutation(s._key,Le.none())])}function mo(s,e,n,...r){s=Xe(s,de);const i=Xe(s.firestore,en),o=Qr(i);let l;return l=typeof(e=Se(e))=="string"||e instanceof Zo?oy(o,"updateDoc",s._key,e,n,r):iy(o,"updateDoc",s._key,e),ei(i,[l.toMutation(s._key,Le.exists(!0))])}function ju(s){return ei(Xe(s.firestore,en),[new Vo(s._key,Le.none())])}function my(s,e){const n=Xe(s.firestore,en),r=Ge(s),i=Uu(s.converter,e),o=Qr(s.firestore);return ei(n,[Du(o,"addDoc",r._key,i,s.converter!==null,{}).toMutation(r._key,Le.exists(!1))]).then((()=>r))}function ei(s,e){const n=Xo(s);return Y0(n,e)}function yy(s,e,n){const r=n.docs.get(e._key),i=new $u(s);return new Gt(s,i,e._key,r,new es(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){Jf(Sn),bn(new Kt("firestore",((r,{instanceIdentifier:i,options:o})=>{const l=r.getProvider("app").getImmediate(),c=new en(new eg(r.getProvider("auth-internal")),new sg(l,r.getProvider("app-check-internal")),xg(l,i),l);return o={useFetchStreams:n,...o},c._setSettings(o),c}),"PUBLIC").setMultipleInstances(!0)),It(xc,wc,e),It(xc,wc,"esm2020")})();function zu(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const by=zu,qu=new vs("auth","Firebase",zu());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir=new wo("@firebase/auth");function vy(s,...e){Ir.logLevel<=Y.WARN&&Ir.warn(`Auth (${Sn}): ${s}`,...e)}function cr(s,...e){Ir.logLevel<=Y.ERROR&&Ir.error(`Auth (${Sn}): ${s}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(s,...e){throw ia(s,...e)}function Ye(s,...e){return ia(s,...e)}function Hu(s,e,n){const r={...by(),[e]:n};return new vs("auth","Firebase",r).create(e,{appName:s.name})}function At(s){return Hu(s,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ia(s,...e){if(typeof s!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=s.name),s._errorFactory.create(n,...r)}return qu.create(s,...e)}function H(s,e,...n){if(!s)throw ia(e,...n)}function et(s){const e="INTERNAL ASSERTION FAILED: "+s;throw cr(e),new Error(e)}function at(s,e){s||et(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yo(){var s;return typeof self<"u"&&((s=self.location)==null?void 0:s.href)||""}function xy(){return kc()==="http:"||kc()==="https:"}function kc(){var s;return typeof self<"u"&&((s=self.location)==null?void 0:s.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(xy()||Tp()||"connection"in navigator)?navigator.onLine:!0}function _y(){if(typeof navigator>"u")return null;const s=navigator;return s.languages&&s.languages[0]||s.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rs{constructor(e,n){this.shortDelay=e,this.longDelay=n,at(n>e,"Short delay should be less than long delay!"),this.isMobile=Ep()||Sp()}get(){return wy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oa(s,e){at(s.emulator,"Emulator should always be set here");const{url:n}=s.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;et("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;et("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;et("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ey={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Iy=new Rs(3e4,6e4);function ti(s,e){return s.tenantId&&!e.tenantId?{...e,tenantId:s.tenantId}:e}async function Vn(s,e,n,r,i={}){return Wu(s,i,async()=>{let o={},l={};r&&(e==="GET"?l=r:o={body:JSON.stringify(r)});const c=xs({key:s.config.apiKey,...l}).slice(1),d=await s._getAdditionalHeaders();d["Content-Type"]="application/json",s.languageCode&&(d["X-Firebase-Locale"]=s.languageCode);const h={method:e,headers:d,...o};return Ip()||(h.referrerPolicy="no-referrer"),s.emulatorConfig&&ws(s.emulatorConfig.host)&&(h.credentials="include"),Gu.fetch()(await Qu(s,s.config.apiHost,n,c),h)})}async function Wu(s,e,n){s._canInitEmulator=!1;const r={...Ey,...e};try{const i=new Ty(s),o=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const l=await o.json();if("needConfirmation"in l)throw Xs(s,"account-exists-with-different-credential",l);if(o.ok&&!("errorMessage"in l))return l;{const c=o.ok?l.errorMessage:l.error.message,[d,h]=c.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw Xs(s,"credential-already-in-use",l);if(d==="EMAIL_EXISTS")throw Xs(s,"email-already-in-use",l);if(d==="USER_DISABLED")throw Xs(s,"user-disabled",l);const f=r[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Hu(s,f,h);ot(s,f)}}catch(i){if(i instanceof lt)throw i;ot(s,"network-request-failed",{message:String(i)})}}async function Ku(s,e,n,r,i={}){const o=await Vn(s,e,n,r,i);return"mfaPendingCredential"in o&&ot(s,"multi-factor-auth-required",{_serverResponse:o}),o}async function Qu(s,e,n,r){const i=`${e}${n}?${r}`,o=s,l=o.config.emulator?oa(s.config,i):`${s.config.apiScheme}://${i}`;return ky.includes(n)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(l).toString():l}class Ty{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Ye(this.auth,"network-request-failed")),Iy.get())})}}function Xs(s,e,n){const r={appName:s.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Ye(s,e,r);return i.customData._tokenResponse=n,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sy(s,e){return Vn(s,"POST","/v1/accounts:delete",e)}async function Tr(s,e){return Vn(s,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function is(s){if(s)try{const e=new Date(Number(s));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ay(s,e=!1){const n=Se(s),r=await n.getIdToken(e),i=aa(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const o=typeof i.firebase=="object"?i.firebase:void 0,l=o==null?void 0:o.sign_in_provider;return{claims:i,token:r,authTime:is(Ui(i.auth_time)),issuedAtTime:is(Ui(i.iat)),expirationTime:is(Ui(i.exp)),signInProvider:l||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function Ui(s){return Number(s)*1e3}function aa(s){const[e,n,r]=s.split(".");if(e===void 0||n===void 0||r===void 0)return cr("JWT malformed, contained fewer than 3 sections"),null;try{const i=Xc(n);return i?JSON.parse(i):(cr("Failed to decode base64 JWT payload"),null)}catch(i){return cr("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ic(s){const e=aa(s);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ys(s,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof lt&&Ry(r)&&s.auth.currentUser===s&&await s.auth.signOut(),r}}function Ry({code:s}){return s==="auth/user-disabled"||s==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=is(this.lastLoginAt),this.creationTime=is(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sr(s){var m;const e=s.auth,n=await s.getIdToken(),r=await ys(s,Tr(e,{idToken:n}));H(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];s._notifyReloadListener(i);const o=(m=i.providerUserInfo)!=null&&m.length?Yu(i.providerUserInfo):[],l=Dy(s.providerData,o),c=s.isAnonymous,d=!(s.email&&i.passwordHash)&&!(l!=null&&l.length),h=c?d:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new bo(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(s,f)}async function Py(s){const e=Se(s);await Sr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Dy(s,e){return[...s.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Yu(s){return s.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vy(s,e){const n=await Wu(s,{},async()=>{const r=xs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:o}=s.config,l=await Qu(s,i,"/v1/token",`key=${o}`),c=await s._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const d={method:"POST",headers:c,body:r};return s.emulatorConfig&&ws(s.emulatorConfig.host)&&(d.credentials="include"),Gu.fetch()(l,d)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function My(s,e){return Vn(s,"POST","/v2/accounts:revokeToken",ti(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ic(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=Ic(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:o}=await Vy(e,n);this.updateTokensAndExpiration(r,i,Number(o))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:o}=n,l=new gn;return r&&(H(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),l.accessToken=i),o&&(H(typeof o=="number","internal-error",{appName:e}),l.expirationTime=o),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new gn,this.toJSON())}_performRefresh(){return et("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gt(s,e){H(typeof s=="string"||typeof s>"u","internal-error",{appName:e})}class Oe{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Cy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new bo(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await ys(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Ay(this,e)}reload(){return Py(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Oe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Sr(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if($e(this.auth.app))return Promise.reject(At(this.auth));const e=await this.getIdToken();return await ys(this,Sy(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,o=n.phoneNumber??void 0,l=n.photoURL??void 0,c=n.tenantId??void 0,d=n._redirectEventId??void 0,h=n.createdAt??void 0,f=n.lastLoginAt??void 0,{uid:m,emailVerified:b,isAnonymous:v,providerData:T,stsTokenManager:R}=n;H(m&&R,e,"internal-error");const P=gn.fromJSON(this.name,R);H(typeof m=="string",e,"internal-error"),gt(r,e.name),gt(i,e.name),H(typeof b=="boolean",e,"internal-error"),H(typeof v=="boolean",e,"internal-error"),gt(o,e.name),gt(l,e.name),gt(c,e.name),gt(d,e.name),gt(h,e.name),gt(f,e.name);const L=new Oe({uid:m,auth:e,email:i,emailVerified:b,displayName:r,isAnonymous:v,photoURL:l,phoneNumber:o,tenantId:c,stsTokenManager:P,createdAt:h,lastLoginAt:f});return T&&Array.isArray(T)&&(L.providerData=T.map(M=>({...M}))),d&&(L._redirectEventId=d),L}static async _fromIdTokenResponse(e,n,r=!1){const i=new gn;i.updateFromServerResponse(n);const o=new Oe({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Sr(o),o}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const o=i.providerUserInfo!==void 0?Yu(i.providerUserInfo):[],l=!(i.email&&i.passwordHash)&&!(o!=null&&o.length),c=new gn;c.updateFromIdToken(r);const d=new Oe({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:l}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new bo(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(o!=null&&o.length)};return Object.assign(d,h),d}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tc=new Map;function tt(s){at(s instanceof Function,"Expected a class definition");let e=Tc.get(s);return e?(at(e instanceof s,"Instance stored in cache mismatched with class"),e):(e=new s,Tc.set(s,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ju{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ju.type="NONE";const Sc=Ju;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dr(s,e,n){return`firebase:${s}:${e}:${n}`}class mn{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:o}=this.auth;this.fullUserKey=dr(this.userKey,i.apiKey,o),this.fullPersistenceKey=dr("persistence",i.apiKey,o),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Tr(this.auth,{idToken:e}).catch(()=>{});return n?Oe._fromGetAccountInfoResponse(this.auth,n,e):null}return Oe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new mn(tt(Sc),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let o=i[0]||tt(Sc);const l=dr(r,e.config.apiKey,e.name);let c=null;for(const h of n)try{const f=await h._get(l);if(f){let m;if(typeof f=="string"){const b=await Tr(e,{idToken:f}).catch(()=>{});if(!b)break;m=await Oe._fromGetAccountInfoResponse(e,b,f)}else m=Oe._fromJSON(e,f);h!==o&&(c=m),o=h;break}}catch{}const d=i.filter(h=>h._shouldAllowMigration);return!o._shouldAllowMigration||!d.length?new mn(o,e,r):(o=d[0],c&&await o._set(l,c.toJSON()),await Promise.all(n.map(async h=>{if(h!==o)try{await h._remove(l)}catch{}})),new mn(o,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ac(s){const e=s.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(th(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Xu(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(sh(e))return"Blackberry";if(rh(e))return"Webos";if(Zu(e))return"Safari";if((e.includes("chrome/")||eh(e))&&!e.includes("edge/"))return"Chrome";if(nh(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=s.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Xu(s=ke()){return/firefox\//i.test(s)}function Zu(s=ke()){const e=s.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function eh(s=ke()){return/crios\//i.test(s)}function th(s=ke()){return/iemobile/i.test(s)}function nh(s=ke()){return/android/i.test(s)}function sh(s=ke()){return/blackberry/i.test(s)}function rh(s=ke()){return/webos/i.test(s)}function la(s=ke()){return/iphone|ipad|ipod/i.test(s)||/macintosh/i.test(s)&&/mobile/i.test(s)}function Ny(s=ke()){var e;return la(s)&&!!((e=window.navigator)!=null&&e.standalone)}function Ly(){return Ap()&&document.documentMode===10}function ih(s=ke()){return la(s)||nh(s)||rh(s)||sh(s)||/windows phone/i.test(s)||th(s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oh(s,e=[]){let n;switch(s){case"Browser":n=Ac(ke());break;case"Worker":n=`${Ac(ke())}-${s}`;break;default:n=s}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Sn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $y{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=o=>new Promise((l,c)=>{try{const d=e(o);l(d)}catch(d){c(d)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oy(s,e={}){return Vn(s,"GET","/v2/passwordPolicy",ti(s,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fy=6;class Uy{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Fy,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Rc(this),this.idTokenSubscription=new Rc(this),this.beforeStateQueue=new $y(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=qu,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=tt(n)),this._initializationPromise=this.queue(async()=>{var r,i,o;if(!this._deleted&&(this.persistenceManager=await mn.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((o=this.currentUser)==null?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Tr(this,{idToken:e}),r=await Oe._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var o;if($e(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(o=this.redirectUser)==null?void 0:o._redirectEventId,c=r==null?void 0:r._redirectEventId,d=await this.tryRedirectSignIn(e);(!l||l===c)&&(d!=null&&d.user)&&(r=d.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(l){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Sr(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=_y()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if($e(this.app))return Promise.reject(At(this));const n=e?Se(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return $e(this.app)?Promise.reject(At(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return $e(this.app)?Promise.reject(At(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(tt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Oy(this),n=new Uy(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new vs("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await My(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&tt(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await mn.create(this,[tt(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const o=typeof n=="function"?n:n.next.bind(n);let l=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(c,this,"internal-error"),c.then(()=>{l||o(this.currentUser)}),typeof n=="function"){const d=e.addObserver(n,r,i);return()=>{l=!0,d()}}else{const d=e.addObserver(n);return()=>{l=!0,d()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=oh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if($e(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&vy(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ni(s){return Se(s)}class Rc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Lp(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ca={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function jy(s){ca=s}function zy(s){return ca.loadJS(s)}function qy(){return ca.gapiScript}function Hy(s){return`__${s}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gy(s,e){const n=Eo(s,"auth");if(n.isInitialized()){const i=n.getImmediate(),o=n.getOptions();if(Wt(o,e??{}))return i;ot(i,"already-initialized")}return n.initialize({options:e})}function Wy(s,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(tt);e!=null&&e.errorMap&&s._updateErrorMap(e.errorMap),s._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function Ky(s,e,n){const r=ni(s);H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,o=ah(e),{host:l,port:c}=Qy(e),d=c===null?"":`:${c}`,h={url:`${o}//${l}${d}/`},f=Object.freeze({host:l,port:c,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){H(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),H(Wt(h,r.config.emulator)&&Wt(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,ws(l)?td(`${o}//${l}${d}`):Yy()}function ah(s){const e=s.indexOf(":");return e<0?"":s.substr(0,e+1)}function Qy(s){const e=ah(s),n=/(\/\/)?([^?#/]+)/.exec(s.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const o=i[1];return{host:o,port:Cc(r.substr(o.length+1))}}else{const[o,l]=r.split(":");return{host:o,port:Cc(l)}}}function Cc(s){if(!s)return null;const e=Number(s);return isNaN(e)?null:e}function Yy(){function s(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",s):s())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return et("not implemented")}_getIdTokenResponse(e){return et("not implemented")}_linkToIdToken(e,n){return et("not implemented")}_getReauthenticationResolver(e){return et("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yn(s,e){return Ku(s,"POST","/v1/accounts:signInWithIdp",ti(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jy="http://localhost";class Jt extends lh{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Jt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ot("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...o}=n;if(!r||!i)return null;const l=new Jt(r,i);return l.idToken=o.idToken||void 0,l.accessToken=o.accessToken||void 0,l.secret=o.secret,l.nonce=o.nonce,l.pendingToken=o.pendingToken||null,l}_getIdTokenResponse(e){const n=this.buildRequest();return yn(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,yn(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,yn(e,n)}buildRequest(){const e={requestUri:Jy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=xs(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs extends ch{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt extends Cs{constructor(){super("facebook.com")}static credential(e){return Jt._fromParams({providerId:bt.PROVIDER_ID,signInMethod:bt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bt.credentialFromTaggedObject(e)}static credentialFromError(e){return bt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bt.credential(e.oauthAccessToken)}catch{return null}}}bt.FACEBOOK_SIGN_IN_METHOD="facebook.com";bt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt extends Cs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Jt._fromParams({providerId:vt.PROVIDER_ID,signInMethod:vt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return vt.credentialFromTaggedObject(e)}static credentialFromError(e){return vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return vt.credential(n,r)}catch{return null}}}vt.GOOGLE_SIGN_IN_METHOD="google.com";vt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt extends Cs{constructor(){super("github.com")}static credential(e){return Jt._fromParams({providerId:xt.PROVIDER_ID,signInMethod:xt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xt.credentialFromTaggedObject(e)}static credentialFromError(e){return xt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xt.credential(e.oauthAccessToken)}catch{return null}}}xt.GITHUB_SIGN_IN_METHOD="github.com";xt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt extends Cs{constructor(){super("twitter.com")}static credential(e,n){return Jt._fromParams({providerId:wt.PROVIDER_ID,signInMethod:wt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return wt.credentialFromTaggedObject(e)}static credentialFromError(e){return wt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return wt.credential(n,r)}catch{return null}}}wt.TWITTER_SIGN_IN_METHOD="twitter.com";wt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xy(s,e){return Ku(s,"POST","/v1/accounts:signUp",ti(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const o=await Oe._fromIdTokenResponse(e,r,i),l=Pc(r);return new Nt({user:o,providerId:l,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Pc(r);return new Nt({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Pc(s){return s.providerId?s.providerId:"phoneNumber"in s?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zy(s){var i;if($e(s.app))return Promise.reject(At(s));const e=ni(s);if(await e._initializationPromise,(i=e.currentUser)!=null&&i.isAnonymous)return new Nt({user:e.currentUser,providerId:null,operationType:"signIn"});const n=await Xy(e,{returnSecureToken:!0}),r=await Nt._fromIdTokenResponse(e,"signIn",n,!0);return await e._updateCurrentUser(r.user),r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar extends lt{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Ar.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Ar(e,n,r,i)}}function dh(s,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(s):n._getIdTokenResponse(s)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Ar._fromErrorAndOperation(s,o,e,r):o})}async function eb(s,e,n=!1){const r=await ys(s,e._linkToIdToken(s.auth,await s.getIdToken()),n);return Nt._forOperation(s,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tb(s,e,n=!1){const{auth:r}=s;if($e(r.app))return Promise.reject(At(r));const i="reauthenticate";try{const o=await ys(s,dh(r,i,e,s),n);H(o.idToken,r,"internal-error");const l=aa(o.idToken);H(l,r,"internal-error");const{sub:c}=l;return H(s.uid===c,r,"user-mismatch"),Nt._forOperation(s,i,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&ot(r,"user-mismatch"),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nb(s,e,n=!1){if($e(s.app))return Promise.reject(At(s));const r="signIn",i=await dh(s,r,e),o=await Nt._fromIdTokenResponse(s,r,i);return n||await s._updateCurrentUser(o.user),o}function sb(s,e,n,r){return Se(s).onIdTokenChanged(e,n,r)}function rb(s,e,n){return Se(s).beforeAuthStateChanged(e,n)}const Rr="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Rr,"1"),this.storage.removeItem(Rr),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ib=1e3,ob=10;class hh extends uh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ih(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((l,c,d)=>{this.notifyListeners(l,d)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const l=this.storage.getItem(r);!n&&this.localCache[r]===l||this.notifyListeners(r,l)},o=this.storage.getItem(r);Ly()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,ob):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},ib)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}hh.type="LOCAL";const ab=hh;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ph extends uh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}ph.type="SESSION";const fh=ph;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lb(s){return Promise.all(s.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new si(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:o}=n.data,l=this.handlersMap[i];if(!(l!=null&&l.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(l).map(async h=>h(n.origin,o)),d=await lb(c);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:d})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}si.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(s="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return s+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cb{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let o,l;return new Promise((c,d)=>{const h=da("",20);i.port1.start();const f=setTimeout(()=>{d(new Error("unsupported_event"))},r);l={messageChannel:i,onMessage(m){const b=m;if(b.data.eventId===h)switch(b.data.status){case"ack":clearTimeout(f),o=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),c(b.data.response);break;default:clearTimeout(f),clearTimeout(o),d(new Error("invalid_response"));break}}},this.handlers.add(l),i.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Je(){return window}function db(s){Je().location.href=s}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gh(){return typeof Je().WorkerGlobalScope<"u"&&typeof Je().importScripts=="function"}async function ub(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function hb(){var s;return((s=navigator==null?void 0:navigator.serviceWorker)==null?void 0:s.controller)||null}function pb(){return gh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mh="firebaseLocalStorageDb",fb=1,Cr="firebaseLocalStorage",yh="fbase_key";class Ps{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ri(s,e){return s.transaction([Cr],e?"readwrite":"readonly").objectStore(Cr)}function gb(){const s=indexedDB.deleteDatabase(mh);return new Ps(s).toPromise()}function vo(){const s=indexedDB.open(mh,fb);return new Promise((e,n)=>{s.addEventListener("error",()=>{n(s.error)}),s.addEventListener("upgradeneeded",()=>{const r=s.result;try{r.createObjectStore(Cr,{keyPath:yh})}catch(i){n(i)}}),s.addEventListener("success",async()=>{const r=s.result;r.objectStoreNames.contains(Cr)?e(r):(r.close(),await gb(),e(await vo()))})})}async function Dc(s,e,n){const r=ri(s,!0).put({[yh]:e,value:n});return new Ps(r).toPromise()}async function mb(s,e){const n=ri(s,!1).get(e),r=await new Ps(n).toPromise();return r===void 0?null:r.value}function Vc(s,e){const n=ri(s,!0).delete(e);return new Ps(n).toPromise()}const yb=800,bb=3;class bh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await vo(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>bb)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return gh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=si._getInstance(pb()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await ub(),!this.activeServiceWorker)return;this.sender=new cb(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||hb()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await vo();return await Dc(e,Rr,"1"),await Vc(e,Rr),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Dc(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>mb(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Vc(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const o=ri(i,!1).getAll();return new Ps(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:o}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(o)&&(this.notifyListeners(i,o),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),yb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}bh.type="LOCAL";const vb=bh;new Rs(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xb(s,e){return e?tt(e):(H(s._popupRedirectResolver,s,"argument-error"),s._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua extends lh{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return yn(e,this._buildIdpRequest())}_linkToIdToken(e,n){return yn(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return yn(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function wb(s){return nb(s.auth,new ua(s),s.bypassAuthState)}function _b(s){const{auth:e,user:n}=s;return H(n,e,"internal-error"),tb(n,new ua(s),s.bypassAuthState)}async function Eb(s){const{auth:e,user:n}=s;return H(n,e,"internal-error"),eb(n,new ua(s),s.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{constructor(e,n,r,i,o=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:o,error:l,type:c}=e;if(l){this.reject(l);return}const d={auth:this.auth,requestUri:n,sessionId:r,tenantId:o||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(d))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return wb;case"linkViaPopup":case"linkViaRedirect":return Eb;case"reauthViaPopup":case"reauthViaRedirect":return _b;default:ot(this.auth,"internal-error")}}resolve(e){at(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){at(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kb=new Rs(2e3,1e4);class un extends vh{constructor(e,n,r,i,o){super(e,n,i,o),this.provider=r,this.authWindow=null,this.pollId=null,un.currentPopupAction&&un.currentPopupAction.cancel(),un.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){at(this.filter.length===1,"Popup operations only handle one event");const e=da();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ye(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Ye(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,un.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ye(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,kb.get())};e()}}un.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ib="pendingRedirect",ur=new Map;class Tb extends vh{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=ur.get(this.auth._key());if(!e){try{const r=await Sb(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}ur.set(this.auth._key(),e)}return this.bypassAuthState||ur.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Sb(s,e){const n=Cb(e),r=Rb(s);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function Ab(s,e){ur.set(s._key(),e)}function Rb(s){return tt(s._redirectPersistence)}function Cb(s){return dr(Ib,s.config.apiKey,s.name)}async function Pb(s,e,n=!1){if($e(s.app))return Promise.reject(At(s));const r=ni(s),i=xb(r,e),l=await new Tb(r,i,n).execute();return l&&!n&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Db=600*1e3;class Vb{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Mb(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!xh(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Ye(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Db&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mc(e))}saveEventToCache(e){this.cachedEventUids.add(Mc(e)),this.lastProcessedEventTime=Date.now()}}function Mc(s){return[s.type,s.eventId,s.sessionId,s.tenantId].filter(e=>e).join("-")}function xh({type:s,error:e}){return s==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Mb(s){switch(s.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return xh(s);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nb(s,e={}){return Vn(s,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,$b=/^https?/;async function Ob(s){if(s.config.emulator)return;const{authorizedDomains:e}=await Nb(s);for(const n of e)try{if(Fb(n))return}catch{}ot(s,"unauthorized-domain")}function Fb(s){const e=yo(),{protocol:n,hostname:r}=new URL(e);if(s.startsWith("chrome-extension://")){const l=new URL(s);return l.hostname===""&&r===""?n==="chrome-extension:"&&s.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&l.hostname===r}if(!$b.test(n))return!1;if(Lb.test(s))return r===s;const i=s.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ub=new Rs(3e4,6e4);function Nc(){const s=Je().___jsl;if(s!=null&&s.H){for(const e of Object.keys(s.H))if(s.H[e].r=s.H[e].r||[],s.H[e].L=s.H[e].L||[],s.H[e].r=[...s.H[e].L],s.CP)for(let n=0;n<s.CP.length;n++)s.CP[n]=null}}function Bb(s){return new Promise((e,n)=>{var i,o,l;function r(){Nc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Nc(),n(Ye(s,"network-request-failed"))},timeout:Ub.get()})}if((o=(i=Je().gapi)==null?void 0:i.iframes)!=null&&o.Iframe)e(gapi.iframes.getContext());else if((l=Je().gapi)!=null&&l.load)r();else{const c=Hy("iframefcb");return Je()[c]=()=>{gapi.load?r():n(Ye(s,"network-request-failed"))},zy(`${qy()}?onload=${c}`).catch(d=>n(d))}}).catch(e=>{throw hr=null,e})}let hr=null;function jb(s){return hr=hr||Bb(s),hr}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zb=new Rs(5e3,15e3),qb="__/auth/iframe",Hb="emulator/auth/iframe",Gb={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Wb=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Kb(s){const e=s.config;H(e.authDomain,s,"auth-domain-config-required");const n=e.emulator?oa(e,Hb):`https://${s.config.authDomain}/${qb}`,r={apiKey:e.apiKey,appName:s.name,v:Sn},i=Wb.get(s.config.apiHost);i&&(r.eid=i);const o=s._getFrameworks();return o.length&&(r.fw=o.join(",")),`${n}?${xs(r).slice(1)}`}async function Qb(s){const e=await jb(s),n=Je().gapi;return H(n,s,"internal-error"),e.open({where:document.body,url:Kb(s),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Gb,dontclear:!0},r=>new Promise(async(i,o)=>{await r.restyle({setHideOnLeave:!1});const l=Ye(s,"network-request-failed"),c=Je().setTimeout(()=>{o(l)},zb.get());function d(){Je().clearTimeout(c),i(r)}r.ping(d).then(d,()=>{o(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yb={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Jb=500,Xb=600,Zb="_blank",ev="http://localhost";class Lc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function tv(s,e,n,r=Jb,i=Xb){const o=Math.max((window.screen.availHeight-i)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const d={...Yb,width:r.toString(),height:i.toString(),top:o,left:l},h=ke().toLowerCase();n&&(c=eh(h)?Zb:n),Xu(h)&&(e=e||ev,d.scrollbars="yes");const f=Object.entries(d).reduce((b,[v,T])=>`${b}${v}=${T},`,"");if(Ny(h)&&c!=="_self")return nv(e||"",c),new Lc(null);const m=window.open(e||"",c,f);H(m,s,"popup-blocked");try{m.focus()}catch{}return new Lc(m)}function nv(s,e){const n=document.createElement("a");n.href=s,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv="__/auth/handler",rv="emulator/auth/handler",iv=encodeURIComponent("fac");async function $c(s,e,n,r,i,o){H(s.config.authDomain,s,"auth-domain-config-required"),H(s.config.apiKey,s,"invalid-api-key");const l={apiKey:s.config.apiKey,appName:s.name,authType:n,redirectUrl:r,v:Sn,eventId:i};if(e instanceof ch){e.setDefaultLanguage(s.languageCode),l.providerId=e.providerId||"",Np(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))l[f]=m}if(e instanceof Cs){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(l.scopes=f.join(","))}s.tenantId&&(l.tid=s.tenantId);const c=l;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const d=await s._getAppCheckToken(),h=d?`#${iv}=${encodeURIComponent(d)}`:"";return`${ov(s)}?${xs(c).slice(1)}${h}`}function ov({config:s}){return s.emulator?oa(s,rv):`https://${s.authDomain}/${sv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi="webStorageSupport";class av{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=fh,this._completeRedirectFn=Pb,this._overrideRedirectResult=Ab}async _openPopup(e,n,r,i){var l;at((l=this.eventManagers[e._key()])==null?void 0:l.manager,"_initialize() not called before _openPopup()");const o=await $c(e,n,r,yo(),i);return tv(e,o,da())}async _openRedirect(e,n,r,i){await this._originValidation(e);const o=await $c(e,n,r,yo(),i);return db(o),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:o}=this.eventManagers[n];return i?Promise.resolve(i):(at(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await Qb(e),r=new Vb(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Bi,{type:Bi},i=>{var l;const o=(l=i==null?void 0:i[0])==null?void 0:l[Bi];o!==void 0&&n(!!o),ot(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Ob(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return ih()||Zu()||la()}}const lv=av;var Oc="@firebase/auth",Fc="1.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dv(s){switch(s){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function uv(s){bn(new Kt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:l,authDomain:c}=r.options;H(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const d={apiKey:l,authDomain:c,clientPlatform:s,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:oh(s)},h=new By(r,i,o,d);return Wy(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),bn(new Kt("auth-internal",e=>{const n=ni(e.getProvider("auth").getImmediate());return(r=>new cv(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),It(Oc,Fc,dv(s)),It(Oc,Fc,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=300,pv=ed("authIdTokenMaxAge")||hv;let Uc=null;const fv=s=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>pv)return;const i=n==null?void 0:n.token;Uc!==i&&(Uc=i,await fetch(s,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function gv(s=Of()){const e=Eo(s,"auth");if(e.isInitialized())return e.getImmediate();const n=Gy(s,{popupRedirectResolver:lv,persistence:[vb,ab,fh]}),r=ed("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const l=fv(o.toString());rb(n,l,()=>l(n.currentUser)),sb(n,c=>l(c))}}const i=wp("auth");return i&&Ky(n,`http://${i}`),n}function mv(){var s;return((s=document.getElementsByTagName("head"))==null?void 0:s[0])??document}jy({loadJS(s){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",s),r.onload=e,r.onerror=i=>{const o=Ye("internal-error");o.customData=i,n(o)},r.type="text/javascript",r.charset="UTF-8",mv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});uv("Browser");const wh={projectId:"gen-lang-client-0833655128",appId:"1:681326869225:web:cada6ac531e1ded3b1ce78",apiKey:"AIzaSyAWyge6N-FseAcfTDNUN5P51j88PYQW-ms",authDomain:"gen-lang-client-0833655128.firebaseapp.com",firestoreDatabaseId:"ai-studio-cb688270-9194-4388-8b0d-99a18b09beb1",storageBucket:"gen-lang-client-0833655128.firebasestorage.app",messagingSenderId:"681326869225",measurementId:""},_h=rd(wh),yv=gv(_h),Ne=ey(_h,{experimentalForceLongPolling:!0},wh.firestoreDatabaseId);Zy(yv).catch(s=>console.error("Anonymous auth failed:",s));function Pr(){return Math.random().toString(36).slice(2,9)}function ha(s,e=1,n="league",r=0){const i=[...s];i.length%2!==0&&i.push({id:"__bye__",name:"BYE"});const l=i.length,c=l-1,d=l/2,h=[];for(let f=0;f<e;f++){const m=f%2===1,b=[i[0],...i.slice(1)];for(let v=0;v<c;v++){const T=v+1+r+f*c,R=[];for(let P=0;P<d;P++){const L=b[P],M=b[l-1-P];L.id==="__bye__"||M.id==="__bye__"||R.push(m?{homeId:M.id,awayId:L.id}:{homeId:L.id,awayId:M.id})}R.forEach(P=>{h.push({id:`fix-${Pr()}`,homeId:P.homeId,awayId:P.awayId,homeScore:null,awayScore:null,status:"upcoming",round:T,stage:n,date:null,venue:null,time:null})}),b.splice(1,0,b.pop())}}return h}function bv(s,e=1,n=1){let r=1;for(;r<s.length;)r*=2;const i=[...s],o=new Array(r).fill(null),l=Eh(r);i.forEach((b,v)=>{l[v]!==void 0&&(o[l[v]]=b)});const c=[],d=r/2;for(let b=0;b<d;b++){const v=o[b*2],T=o[b*2+1];if(!(!v&&!T)&&v&&T)for(let R=0;R<n;R++)c.push({id:`ko-r${e}-m${b}-l${R}-${Pr()}`,homeId:R===0?v.id:T.id,awayId:R===0?T.id:v.id,homeScore:null,awayScore:null,status:"upcoming",round:e+R,matchIndex:b,stage:"knockout",leg:R+1,date:null,venue:null,time:null})}let h=d,f=e+n;for(;h>1;){h/=2;for(let b=0;b<h;b++)for(let v=0;v<n;v++)c.push({id:`ko-r${f}-m${b}-l${v}-${Pr()}`,homeId:null,awayId:null,homeScore:null,awayScore:null,status:"upcoming",round:f+v,matchIndex:b,stage:"knockout",leg:v+1,date:null,venue:null,time:null});f+=n}const m=e+n;for(let b=0;b<d;b++){const v=o[b*2],T=o[b*2+1];if(!v||!T){const R=v||T;if(!R)continue;const P=Math.floor(b/2),L=b%2===0?"homeId":"awayId",M=c.find(q=>q.round===m&&q.matchIndex===P&&q.leg===1);M&&(M[L]=R.id)}}return c}function Eh(s){if(s===1)return[0];const e=Eh(s/2),n=new Array(s);return e.forEach((r,i)=>{n[i*2]=r,n[i*2+1]=s-1-r}),n}function vv(s,e=4){const n=[...s].sort(()=>Math.random()-.5),r=Math.ceil(n.length/e),i=[],o=[];for(let l=0;l<r;l++){const c=n.slice(l*e,(l+1)*e);i.push({id:l,name:String.fromCharCode(65+l),teamIds:c.map(h=>h.id)}),ha(c,1,"groups",0).forEach(h=>{h.groupId=l,o.push(h)})}return{groups:i,fixtures:o}}function xv(s,e,n,r=1,i="league"){const o=ha(s,r,i,0),l=[];for(let c=1;c<=n;c++){const d=(e[c]||[]).filter(m=>m.homeId&&m.awayId),h=new Set(d.flatMap(m=>[m.homeId,m.awayId])),f=o.filter(m=>m.round===c&&!h.has(m.homeId)&&!h.has(m.awayId));d.forEach(m=>{l.push({id:`fix-${Pr()}`,homeId:m.homeId,awayId:m.awayId,homeScore:null,awayScore:null,status:"upcoming",round:c,stage:i,date:m.date||null,venue:m.venue||null,time:m.time||null,pinned:!0})}),f.forEach(m=>{m.round=c,l.push(m)})}return l}function wv(s){const e=[],n={};return s.forEach(r=>{n[r.round]||(n[r.round]=[]),n[r.round].push(r)}),Object.entries(n).forEach(([r,i])=>{const o=new Set;i.forEach(l=>{l.homeId&&o.has(l.homeId)&&e.push(`Round ${r}: team ${l.homeId} plays twice`),l.awayId&&o.has(l.awayId)&&e.push(`Round ${r}: team ${l.awayId} plays twice`),l.homeId&&o.add(l.homeId),l.awayId&&o.add(l.awayId)})}),e}console.log("[KickOff] main.js is initializing...");function Bc(s){const e=document.createElement("div");e.className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300",e.innerHTML=`
    <div class="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-3xl flex flex-col p-10 space-y-8">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">Link Club Player</h3>
        <button id="close-selection" class="p-4 bg-slate-950 rounded-2xl text-slate-500">${F.reset}</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[60vh] pr-4 custom-scrollbar">
        ${g.dashboardPlayers.length===0?'<p class="col-span-2 text-center text-slate-500 py-10">No club players synced. Ensure dashboard is open.</p>':g.dashboardPlayers.map(r=>`
          <button class="player-select-btn p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 transition-all text-left group" data-player-id="${r.id}">
            <img src="${r.image}" class="w-12 h-12 rounded-xl object-cover border border-slate-800" />
            <div>
              <p class="font-black text-slate-200 text-sm group-hover:text-indigo-400">${r.name}</p>
              <p class="text-[9px] font-black text-slate-600 uppercase">#${r.number} • OVR ${r.ovr}</p>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelectorAll(".player-select-btn").forEach(r=>{r.addEventListener("click",()=>{s(r.dataset.playerId),e.remove()})}),e.addEventListener("click",r=>{r.target===e&&e.remove()});const n=document.getElementById("close-selection");n&&n.addEventListener("click",()=>e.remove())}window.onerror=function(s,e,n,r,i){alert("GLOBAL ERROR: "+s+`
Line: `+n)};window.addEventListener("unhandledrejection",function(s){alert("PROMISE REJECTION: "+s.reason)});console.log("KickOff + Firebase Initialized");async function os(s){const e=new TextEncoder().encode(s),n=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(n)).map(r=>r.toString(16).padStart(2,"0")).join("")}const ii="kickoff_session_v2";async function Dr(s){if(g.user)try{await my(Jo(Ne,"activityLog"),{action:s,performedBy:g.user.username,role:g.user.role,timestamp:Jr()})}catch(e){console.warn("Activity log failed:",e)}}if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("[PWA] Service Worker Registered"),setInterval(()=>{e.update()},1e3*60*60)}).catch(e=>{console.error("[PWA] Registration Failed:",e)})});let s=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{s||(s=!0,console.log("[PWA] New controller detected, refreshing page..."),window.location.reload())})}const F={home:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',more:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',trophy:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',dashboard:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',fixtures:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',standings:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h5"/></svg>',teams:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',bracket:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 15 6 18 9"/><path d="M6 21 9 18 6 15"/><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M15 6h6"/><path d="M15 18h6"/></svg>',reset:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',league:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/></svg>',knockout:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M21 6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3"/></svg>',group:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',arrowLeft:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7M5 12h14"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',boot:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h2l3-4h1a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 12V8"/><path d="M8 12V8"/></svg>',medal:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',archive:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',sword:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',fire:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',share:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',certificate:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/><path d="M9 13.71V11"/><path d="M15 13.71V11"/><path d="M12 8V5"/><path d="M12 3V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>'},kh="1.0",Ih="kickoff_tournaments_v1",_v="kickoff_tournaments_backup",Ev=new URLSearchParams(window.location.search),kv=Ev.get("admin")==="true",g={tournaments:[],tournament:null,user:{username:"ADMIN",role:"superadmin",loggedIn:!0,loginTime:Date.now()},view:"home",theme:localStorage.getItem("kickoff_theme")||"dark",mobileStandingsMode:localStorage.getItem("mobile_standings_mode")||"compact",activeRound:1,activeBottomSheet:null,isMobile:window.innerWidth<768,onboarding:{step:0,selectedFormat:null},standingsFilter:"overall",timelineRound:null,loginError:null,isLoading:!1,isAdmin:kv,dashboardPlayers:[]};window.addEventListener("message",s=>{console.log("[TournamentSystem] Received message:",s.data),s.data.type==="PLAYERS_LIST"&&(g.dashboardPlayers=s.data.players,g.view==="standings"&&g.activeBottomSheet&&j())});window.parent!==window&&window.parent.postMessage({type:"REQUEST_PLAYERS"},"*");window.addEventListener("resize",()=>{const s=window.innerWidth<768;s!==g.isMobile&&(g.isMobile=s,j())});let ji=null;async function le(s=!1){try{if(g.tournament){const n=g.tournaments.findIndex(r=>r.id===g.tournament.id);n!==-1?g.tournaments[n]=g.tournament:g.tournaments.push(g.tournament)}const e=JSON.stringify({version:kh,tournaments:g.tournaments});if(localStorage.setItem(Ih,e),localStorage.setItem("kickoff_theme",g.theme),s&&localStorage.setItem(_v,e),!g.tournament||!g.user)return;ji&&clearTimeout(ji),ji=setTimeout(async()=>{var n;try{await Zr(Ge(Ne,"tournaments",g.tournament.id),{...g.tournament,updatedAt:Jr(),updatedBy:((n=g.user)==null?void 0:n.username)||"system"}),console.log("[Firestore] Synced:",g.tournament.name)}catch(r){r.code==="resource-exhausted"?console.warn("[Firestore] Quota exhausted — retry soon"):console.error("[Firestore] Sync error:",r)}},1500)}catch(e){console.error("Save failed:",e)}}async function Iv(){if(g.user)try{const s=await Bu(Jo(Ne,"tournaments"));g.tournaments=s.docs.map(e=>({id:e.id,...e.data()})),localStorage.setItem(Ih,JSON.stringify({version:kh,tournaments:g.tournaments}))}catch(s){console.error("Firestore sync failed:",s)}}async function Tv(s){try{await ju(Ge(Ne,"tournaments",s))}catch(e){console.error("Delete failed:",e)}}async function Sv(){try{const s=py(Jo(Ne,"users"),fy("role","==","superadmin"));if((await Bu(s)).empty){const n=await os("admin123");await Zr(Ge(Ne,"users","admin"),{username:"admin",password:n,role:"superadmin",isActive:!0,createdAt:Jr(),loginAttempts:0})}}catch(s){console.warn("Admin check failed:",s)}}function Av(){document.documentElement.classList.toggle("light-mode",g.theme==="light"),document.documentElement.classList.toggle("dark",g.theme==="dark"),document.body.style.background="#050508",document.body.style.color="#f1f5f9"}function Th(){g.theme=g.theme==="dark"?"light":"dark",le(),j()}let Vr=!1;async function j(){console.log("[KickOff] Render called. View:",g.view);try{const s=document.getElementById("root");if(!s){console.error("[KickOff] Root element not found!");return}if(Av(),!g.user){s.innerHTML=`
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:#475569;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">Initializing Security Protocols...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;try{await Sv()}catch(e){console.warn("[KickOff] Admin check failed, proceeding to login anyway:",e)}Cv(s);return}if(!Vr){s.innerHTML=`
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem">
        <img src="/logo.png" style="width:72px;height:72px;border-radius:16px;box-shadow:0 0 40px rgba(59,130,246,0.5),0 0 80px rgba(124,58,237,0.2);animation:pulse 2s infinite">
        <div style="text-align:center">
          <h3 style="font-size:1.1rem;font-weight:900;color:#f1f5f9;text-transform:uppercase;letter-spacing:0.05em">Connecting to Firestore</h3>
          <p style="font-size:0.65rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.2em;margin-top:0.25rem">Loading tournament data...</p>
        </div>
        <div style="width:200px;height:3px;background:#0f0f1a;border-radius:99px;overflow:hidden">
          <div style="height:100%;background:linear-gradient(90deg,#3b82f6,#7c3aed);animation:slide 1.5s ease-in-out infinite"></div>
        </div>
      </div>
      <style>
        @keyframes slide { 0%{width:0%;margin-left:0} 50%{width:100%;margin-left:0} 100%{width:0%;margin-left:100%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 40px rgba(59,130,246,0.5)} 50%{box-shadow:0 0 60px rgba(124,58,237,0.6)} }
      </style>
    `,Vr=!0,await Iv(),j();return}g.onboarding.step>0?Dv(s):g.tournament?g.tournament.status==="setup_teams"||g.tournament.status==="onboarding_summary"?Ov(s):Gv(s):Pv(s)}catch(s){alert("RENDER ERROR: "+s.message+`
`+s.stack),console.error(s)}}async function Rv(s,e){g.loginError=null;const n=document.getElementById("login-btn");n&&(n.disabled=!0,n.textContent="Verifying...");try{const r=Ge(Ne,"users",s),i=await lr(r);if(!i.exists()){g.loginError="Invalid username or password.",j();return}const o=i.data();if(o.lockedUntil&&o.lockedUntil.toDate()>new Date){const c=Math.ceil((o.lockedUntil.toDate()-new Date)/6e4);g.loginError=`Account locked. Try again in ${c} minute(s).`,j();return}if(!o.isActive){g.loginError="Account deactivated. Contact administrator.",j();return}const l=await os(e);if(o.password===l){await mo(r,{loginAttempts:0,lockedUntil:null,lastLogin:Jr()});const c={username:o.username,role:o.role,loggedIn:!0,loginTime:Date.now()};localStorage.setItem(ii,JSON.stringify(c)),g.user=c,await Dr("User logged in"),j()}else{const c=(o.loginAttempts||0)+1,d={loginAttempts:c};c>=5?(d.lockedUntil=new Date(Date.now()+900*1e3),g.loginError="Too many failed attempts. Locked for 15 minutes."):g.loginError="Invalid username or password.",await mo(r,d),j()}}catch(r){console.error(r),g.loginError="Authentication error. Check your connection.",j()}}function Cv(s){s.innerHTML=`
    <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;padding:1.5rem;position:relative;overflow:hidden">
      <!-- BG orbs -->
      <div style="position:absolute;top:-10%;right:-10%;width:40%;height:40%;background:radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%);pointer-events:none"></div>
      <div style="position:absolute;bottom:-10%;left:-5%;width:35%;height:35%;background:radial-gradient(circle,rgba(124,58,237,0.09),transparent 70%);pointer-events:none"></div>

      <div style="width:100%;max-width:400px;z-index:1">
        <!-- Card -->
        <div style="background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:2.5rem;box-shadow:0 40px 80px rgba(0,0,0,0.7)">
          <!-- Logo + Title -->
          <div style="text-align:center;margin-bottom:2rem">
            <img src="/logo.png" alt="KickOff" style="width:80px;height:80px;border-radius:1.25rem;object-fit:cover;box-shadow:0 0 30px rgba(59,130,246,0.5),0 0 60px rgba(124,58,237,0.2);margin:0 auto 1.25rem">
            <h1 style="font-size:1.5rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;text-transform:uppercase">KickOff</h1>
            <p style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.3em;margin-top:0.25rem">Tournament Manager</p>
          </div>

          <form id="login-form" style="display:flex;flex-direction:column;gap:1rem">
            <div>
              <label style="display:block;font-size:0.6rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:0.5rem">Username</label>
              <input id="login-username" type="text" required placeholder="Enter username" autocomplete="username"
                style="width:100%;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.875rem;padding:0.875rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label style="display:block;font-size:0.6rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:0.5rem">Password</label>
              <div style="position:relative">
                <input id="login-password" type="password" required placeholder="Enter password" autocomplete="current-password"
                  style="width:100%;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.875rem;padding:0.875rem 1rem;padding-right:3rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                  onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
                <button type="button" id="toggle-pw" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#475569;cursor:pointer;font-size:1rem">👁️</button>
              </div>
            </div>
            ${g.loginError?`<p style="font-size:0.75rem;font-weight:700;color:#f87171;text-align:center;padding:0.5rem 0">${g.loginError}</p>`:""}
            <button id="login-btn" type="submit" style="width:100%;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;padding:1rem;border-radius:0.875rem;border:none;cursor:pointer;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;box-shadow:0 8px 24px rgba(59,130,246,0.3),0 0 40px rgba(124,58,237,0.15);margin-top:0.5rem">
              Sign In &rarr;
            </button>
          </form>
        </div>
        <p style="text-align:center;margin-top:1.5rem;font-size:0.6rem;font-weight:900;color:#1e1e32;text-transform:uppercase;letter-spacing:0.3em">Secured with Firebase &bull; v2.1</p>
      </div>
    </div>
  `,document.getElementById("toggle-pw").addEventListener("click",()=>{const e=document.getElementById("login-password");e.type=e.type==="password"?"text":"password"}),document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault(),await Rv(document.getElementById("login-username").value.trim(),document.getElementById("login-password").value)})}function Pv(s){const e=g.tournaments.filter(l=>!l.archived),n=g.tournaments.filter(l=>l.archived);g.isMobile?s.innerHTML=`
      <div class="min-h-screen p-5 pb-24 safe-area-pb" style="background:#050508">
        <header class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="KickOff Logo" style="width:44px;height:44px;border-radius:12px;object-fit:cover;box-shadow:0 0 20px rgba(59,130,246,0.5),0 0 40px rgba(124,58,237,0.2)">
            <div>
              <h1 class="text-xl font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</h1>
              <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${g.isAdmin?"Control Center":"Official Hub"}</p>
            </div>
          </div>
          <button id="theme-toggle" class="p-3 rounded-xl border transition-all" style="background:#0f0f1a;border-color:#1e1e32;color:#94a3b8">
            ${F.sun}
          </button>
        </header>

        <section class="space-y-6">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#475569">Active (${e.length})</h2>
            <div class="space-y-4">
              ${e.length===0?`
                <div class="rounded-2xl p-10 text-center border" style="background:#0f0f1a;border-color:#1e1e32;color:#334155;font-style:italic;font-size:0.75rem">
                  No tournaments yet — create your first one below
                </div>
              `:e.map(l=>jc(l)).join("")}
            </div>
          </div>

          ${n.length>0?`
            <div class="pt-6">
              <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#334155">Archived</h2>
              <div class="space-y-3 opacity-50">
                ${n.map(l=>jc(l)).join("")}
              </div>
            </div>
          `:""}
        </section>

        ${g.isAdmin?`
        <button id="new-tournament-btn" class="fixed bottom-8 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 active:scale-90 transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 10px 40px rgba(59,130,246,0.45),0 0 60px rgba(124,58,237,0.2)">
          ${F.plus}
        </button>
        `:""}
      </div>
    `:s.innerHTML=`
      <div class="min-h-screen p-6 md:p-12 lg:p-20 relative overflow-hidden" style="background:#050508">
        <!-- QV Background Orbs -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute" style="top:-15%;right:-10%;width:50%;height:50%;background:radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)"></div>
          <div class="absolute" style="bottom:-10%;left:-5%;width:40%;height:40%;background:radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)"></div>
          <div class="absolute inset-0" style="background:radial-gradient(ellipse at 50% 0%,rgba(59,130,246,0.04) 0%,transparent 60%)"></div>
        </div>

        <div class="max-w-7xl mx-auto space-y-16 relative z-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div class="flex items-center gap-6">
               <img src="/logo.png" alt="KickOff" style="width:80px;height:80px;border-radius:20px;object-fit:cover;box-shadow:0 0 30px rgba(59,130,246,0.5),0 0 80px rgba(124,58,237,0.2),0 20px 40px rgba(0,0,0,0.4)">
               <div class="space-y-3">
                 ${g.isAdmin?`
                 <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
                   <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.8)"></span>
                   Command Center Active
                 </div>
                 `:""}
                 <h1 class="text-5xl font-black tracking-tighter" style="background:linear-gradient(135deg,#f1f5f9 30%,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${g.isAdmin?"Your Tournaments":"Official Tournaments"}</h1>
                 <p class="font-bold tracking-[0.3em] uppercase text-xs" style="color:#475569">${g.isAdmin?"Manage multiple disciplines":"Live Competition Center"}</p>
               </div>
             </div>
             <div class="flex items-center gap-4">
               ${g.isAdmin?`
               <button id="new-tournament-btn" class="flex items-center gap-4 font-black px-10 py-5 rounded-2xl transition-all group" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 8px 32px rgba(59,130,246,0.35),0 0 60px rgba(124,58,237,0.15);color:white">
                 <span class="group-hover:rotate-90 transition-transform duration-300">${F.plus}</span>
                 <span class="uppercase tracking-widest text-sm">New Tournament</span>
               </button>
               `:""}
             </div>
          </div>

          ${e.length===0?`
            <div class="rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed" style="background:rgba(15,15,26,0.5);border-color:#1e1e32">
              <div class="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto" style="background:#0a0a12;border:1px solid #1e1e32;color:#334155">
                ${F.trophy}
              </div>
              <div class="space-y-3">
                <h3 class="text-2xl font-black" style="color:#475569">No active tournaments</h3>
                <p class="text-sm font-medium" style="color:#334155">${g.isAdmin?"Create your first tournament to get started.":"Waiting for the next season to begin..."}</p>
              </div>
              ${g.isAdmin?`
              <button id="new-tournament-btn-empty" class="px-10 py-4 rounded-2xl font-black text-sm transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 8px 32px rgba(59,130,246,0.3)">Create Tournament</button>
              `:""}
            </div>
          `:`
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${e.map(l=>zc(l)).join("")}
            </div>
          `}

          ${n.length>0?`
            <div class="pt-20 space-y-8" style="border-top:1px solid #0f0f1a">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-black uppercase tracking-widest" style="color:#334155">Archived</h2>
                <div class="flex-1" style="height:1px;background:#0f0f1a"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                ${n.map(l=>zc(l)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `;const r=document.getElementById("new-tournament-btn");r&&r.addEventListener("click",()=>{if(g.tournaments.length>=10){alert("Maximum 10 tournaments reached. Delete old ones to create new.");return}g.onboarding.step=1,j()});const i=document.getElementById("new-tournament-btn-empty");i&&i.addEventListener("click",()=>{g.onboarding.step=1,j()});const o=document.getElementById("theme-toggle");o&&o.addEventListener("click",Th),s.querySelectorAll(".open-tournament").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.id;g.tournament=g.tournaments.find(d=>d.id===c),g.view="dashboard",j()})}),s.querySelectorAll(".next-season-btn").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation(),pa(l.dataset.id)})}),s.querySelectorAll(".view-champion-btn").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id;g.tournament=g.tournaments.find(h=>h.id===d),g.view="champion",j()})}),s.querySelectorAll(".archive-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id,h=g.tournaments.find(f=>f.id===d);h&&(h.archived=!h.archived,le(),j())})}),s.querySelectorAll(".delete-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id;Sh(d)})}),s.querySelectorAll(".duplicate-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id,h=g.tournaments.find(v=>v.id===d);if(g.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}const f=JSON.parse(JSON.stringify(h));f.id=`t-${Date.now()}`,f.archived=!1;let m=`${h.name} (Copy)`,b=1;for(;g.tournaments.some(v=>v.name.toLowerCase()===m.toLowerCase());)m=`${h.name} (Copy ${++b})`;f.name=m,f.fixtures=h.fixtures.map(v=>({...v,homeScore:null,awayScore:null,status:"upcoming"})),f.status="active",g.tournaments.push(f),le(),j()})})}function Sh(s){const e=g.tournaments.find(r=>r.id===s);if(!e)return;const n=document.createElement("div");n.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.9);backdrop-filter:blur(16px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem",n.innerHTML=`
    <div style="background:#0f0f1a;width:100%;max-width:420px;border-radius:2rem;padding:3rem;border:1px solid #1e1e32;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,0.8)">
      <div style="width:5rem;height:5rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:1.5rem;display:flex;align-items:center;justify-content:center;color:#f87171;margin:0 auto 1.5rem">
        ${F.trash}
      </div>
      <h3 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;margin-bottom:1rem;letter-spacing:-0.02em">Delete Tournament?</h3>
      <p style="color:#64748b;font-size:0.875rem;line-height:1.6;margin-bottom:2rem">
        Are you sure you want to delete <strong style="color:#f1f5f9">${e.name}</strong>?
        All teams, fixtures, and results will be permanently erased.
      </p>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        <button id="confirm-delete" style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:white;font-weight:900;padding:1rem;border-radius:1rem;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;font-size:0.7rem;box-shadow:0 4px 20px rgba(220,38,38,0.3)">Delete Permanently</button>
        <button id="cancel-delete" style="background:#0a0a12;color:#475569;font-weight:900;padding:1rem;border-radius:1rem;border:1px solid #1e1e32;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;font-size:0.7rem">Cancel</button>
      </div>
    </div>
  `,document.body.appendChild(n),document.getElementById("confirm-delete").addEventListener("click",async()=>{var i;const r=e.name;g.tournaments=g.tournaments.filter(o=>o.id!==s);try{await Tv(s),await Dr(`Deleted tournament: ${r}`)}catch(o){console.error("Firestore delete failed:",o)}le(),n.remove(),((i=g.tournament)==null?void 0:i.id)===s&&(g.tournament=null,g.view="home"),j(),as(`${r} deleted`)}),document.getElementById("cancel-delete").addEventListener("click",()=>{n.remove()})}function as(s){const e=document.createElement("div");e.style.cssText="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));border:1px solid rgba(96,165,250,0.3);color:#93c5fd;font-weight:900;padding:0.875rem 2rem;border-radius:1rem;box-shadow:0 8px 32px rgba(59,130,246,0.2),0 0 60px rgba(124,58,237,0.1);z-index:200;pointer-events:none;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;backdrop-filter:blur(12px);animation:float-up 0.3s ease forwards",e.innerText=s,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transition="opacity 0.3s",setTimeout(()=>e.remove(),300)},3e3)}function jc(s){const e=s.fixtures.filter(c=>c.status==="completed").length,n=s.fixtures.length,r=n>0?e/n*100:0,i=F[s.type==="groups"?"group":s.type==="knockout"?"knockout":"league"],o=Ah(s),l=o?o.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):null;return`
    <div data-id="${s.id}" class="open-tournament rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all" style="background:#0f0f1a;border:1px solid #1e1e32">
       <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style="background:#050508;border:1px solid #1e1e32;color:#60a5fa">
         ${s.logo?`<img src="${s.logo}" class="w-full h-full object-cover">`:i}
       </div>
       <div class="flex-1 min-w-0">
         <div class="flex items-center justify-between">
           <h3 class="font-black tracking-tight uppercase truncate" style="color:#f1f5f9">${s.name}</h3>
           ${l?`<span class="text-[8px] font-black px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest ml-2">${l}</span>`:""}
         </div>
         <div class="flex items-center gap-2 mt-1">
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#60a5fa">${s.type.replace("_"," ")}</span>
           <span style="color:#1e293b;font-size:9px">•</span>
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${Math.round(r)}%</span>
         </div>
         <div class="mt-2 rounded-full overflow-hidden" style="height:2px;background:#0a0a12">
           <div class="h-full" style="width:${r}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 6px rgba(59,130,246,0.5)"></div>
         </div>
       </div>
       <span style="color:#1e293b">›</span>
    </div>
  `}function Ah(s){if(!s.scheduling||!s.scheduling.matchDays||s.scheduling.matchDays.length===0)return null;const e={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6},n=s.scheduling.matchDays.map(i=>e[i]),r=new Date;r.setHours(0,0,0,0);for(let i=0;i<14;i++){let o=new Date(r);if(o.setDate(r.getDate()+i),n.includes(o.getDay()))return o}return null}function zc(s){const e=s.fixtures.filter(d=>d.status==="completed").length,n=s.fixtures.length,r=n>0?e/n*100:0;let i,o;s.archived?(o="Archived",i="background:#0a0a12;color:#475569;border-color:#1e1e32"):e===n&&n>0?(o="Completed",i="background:rgba(16,185,129,0.08);color:#34d399;border-color:rgba(16,185,129,0.2)"):e>0?(o="Live",i="background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25)"):(o="Upcoming",i="background:#0a0a12;color:#475569;border-color:#1e1e32");const l={round_robin:"Round Robin",knockout:"Knockout",league:"Full League",groups:"Group+KO"},c=F[s.type==="groups"?"group":s.type==="knockout"?"knockout":"league"];return`
    <div class="rounded-[2rem] p-8 flex flex-col justify-between h-[420px] transition-all group relative overflow-hidden" style="background:#0f0f1a;border:1px solid #1e1e32;box-shadow:0 20px 60px rgba(0,0,0,0.5)" onmouseover="this.style.borderColor='rgba(59,130,246,0.25)'" onmouseout="this.style.borderColor='#1e1e32'">
      ${s.archived?'<div class="absolute inset-0 pointer-events-none" style="background:rgba(5,5,8,0.3)"></div>':""}
      <!-- gradient progress bar bottom -->
      <div class="absolute inset-x-0 bottom-0 overflow-hidden" style="height:2px;background:#0a0a12">
        <div class="h-full transition-all duration-1000" style="width:${r}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>
      </div>
      <!-- Subtle orb glow on hover -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="background:radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)"></div>

      <div class="space-y-5 relative z-10">
        <div class="flex items-center justify-between">
           <div class="flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest" style="${i}">
             ${o}
           </div>
           ${g.isAdmin?`
            <div class="flex gap-2">
              <button data-id="${s.id}" class="archive-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="${s.archived?"Restore":"Archive"}" onmouseover="this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.archive}</button>
              <button data-id="${s.id}" class="duplicate-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Duplicate" onmouseover="this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.copy}</button>
              <button data-id="${s.id}" class="delete-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Delete" onmouseover="this.style.color='#f87171';this.style.borderColor='rgba(239,68,68,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.trash}</button>
            </div>
            `:""}
        </div>
        <div class="flex items-center gap-4">
          ${s.logo?`<img src="${s.logo}" class="w-14 h-14 rounded-xl object-contain p-1 border" style="background:#0a0a12;border-color:#1e1e32">`:`
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background:#0a0a12;border:1px solid #1e1e32;color:#60a5fa">${c}</div>
          `}
          <div>
            <h3 class="text-xl font-black tracking-tight mb-1 line-clamp-1 transition-all" style="color:#f1f5f9">${s.name}</h3>
            <p class="text-[10px] font-black uppercase tracking-widest" style="color:#475569">${l[s.type]||s.type} &bull; ${s.teams.length} Teams &bull; S${s.season||1}</p>
            ${(()=>{const d=Ah(s);return d?`<p class="mt-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
                Next Matchday: ${d.toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short"})}
              </p>`:""})()}
          </div>
        </div>
      </div>
      
      <div class="space-y-4 relative z-10">
        <div class="flex items-center justify-between">
           <div>
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Progress</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${Math.round(r)}%</p>
           </div>
           <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Matches</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${e}/${n}</p>
           </div>
        </div>
        <button data-id="${s.id}" class="open-tournament w-full font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
          ${s.archived?"View Archive &rarr;":"Open Tournament &rarr;"}
        </button>
        ${e===n&&n>0?`
          <div class="flex gap-2">
            <button data-id="${s.id}" class="view-champion-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 4px 20px rgba(59,130,246,0.3)">
               Champions
            </button>
            <button data-id="${s.id}" class="next-season-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
               Next Season &rarr;
            </button>
          </div>
        `:""}
      </div>
    </div>
  `}function Dv(s){g.onboarding.step===1?Vv(s):g.onboarding.step===2&&Nv(s)}function Vv(s){const e=[{id:"round_robin",name:"Round Robin",icon:F.league,desc:"Small local competition. Every team plays everyone once.",color:"text-indigo-400"},{id:"knockout",name:"Knockout",icon:F.knockout,desc:"High stakes drama. Win or go home sudden-death.",color:"text-red-400"},{id:"groups",name:"Group + KO",icon:F.group,desc:"World Cup format. Group stage followed by brackets.",color:"text-emerald-400"},{id:"league",name:"Full League",icon:F.league,desc:"Double round robin. The ultimate consistency test.",color:"text-yellow-400"}];g.isMobile?(s.innerHTML=`
      <div class="min-h-screen bg-slate-950 p-6 flex flex-col">
        <header class="mb-10 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Phase 1/2</div>
          <h1 class="text-3xl font-black text-slate-100 tracking-tighter uppercase">Select Format</h1>
        </header>

        <div class="space-y-4 flex-1">
          ${e.map(r=>`
            <button data-format="${r.id}" class="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left active:bg-slate-800 flex items-center gap-5 transition-all">
              <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center ${r.color} flex-shrink-0 shadow-inner">
                ${r.icon}
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black text-slate-100 tracking-tight uppercase">${r.name}</h3>
                <p class="text-xs text-slate-500 leading-tight">${r.desc}</p>
              </div>
            </button>
          `).join("")}
        </div>
        
        <button id="cancel-onboarding" class="mt-8 w-full py-5 text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em]">Abort Mission</button>
      </div>
    `,document.getElementById("cancel-onboarding").addEventListener("click",()=>{g.onboarding.step=0,j()})):s.innerHTML=`
      <div class="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden">
        <button id="cancel-onboarding-desktop" class="absolute top-8 left-8 md:top-10 md:left-10 text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] flex items-center gap-2 group z-50">
          <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
          <span>Cancel</span>
        </button>
        <!-- Animated Background Accents -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full"></div>
        </div>

        <div class="max-w-6xl w-full space-y-16 relative z-10">
          <div class="text-center space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
              Construction Phase
            </div>
            <h1 class="text-6xl font-black text-slate-100 tracking-tighter sm:text-7xl uppercase">Select Format</h1>
            <p class="text-slate-500 font-medium tracking-[0.3em] uppercase text-xs">Architect your competition</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${e.map(r=>`
              <button data-format="${r.id}" class="format-card bg-slate-900 border border-slate-800 p-8 rounded-[3rem] text-left hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group flex flex-col justify-between h-[420px] shadow-3xl relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all duration-500"></div>
                
                <div class="space-y-8 relative z-10">
                  <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center ${r.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                    ${r.icon}
                  </div>
                  <div class="space-y-3">
                    <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${r.name}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed font-medium">${r.desc}</p>
                  </div>
                </div>

                <div class="pt-6 mt-auto relative z-10">
                   <div class="flex items-center justify-between mb-4">
                      <span class="text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Efficiency</span>
                      <span class="text-[10px] font-mono text-slate-700 group-hover:text-slate-400 transition-colors">v1.2.0</span>
                   </div>
                   <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                      <div class="h-full bg-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                   </div>
                </div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;const n=document.getElementById("cancel-onboarding-desktop");n&&n.addEventListener("click",()=>{g.onboarding.step=0,j()}),s.querySelectorAll("[data-format]").forEach(r=>{r.addEventListener("click",()=>{g.onboarding.selectedFormat=r.dataset.format,g.onboarding.step=2,j()})})}function Mv(s){return new Promise((e,n)=>{const r=new FileReader;r.readAsDataURL(s),r.onload=()=>e(r.result),r.onerror=i=>n(i)})}function Nv(s){const e=g.onboarding.selectedFormat,n=e==="groups",r=e==="league";s.innerHTML=`
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-5 md:p-10 overflow-hidden">
      <!-- Animated Background Accents -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div class="w-full max-w-xl bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-8 md:p-12 border border-slate-800 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button id="back-btn" class="absolute top-8 left-8 md:top-10 md:left-10 text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] flex items-center gap-2 group">
          <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
          <span>Back</span>
        </button>
        
        <div class="mt-10 md:mt-12 text-center mb-10 md:mb-12">
           <div id="logo-preview-container" class="w-20 h-20 md:w-24 md:h-24 bg-slate-950 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto mb-6 border border-slate-800 shadow-inner relative overflow-hidden group">
             <div id="logo-placeholder">${F[e==="groups"?"group":e==="knockout"?"knockout":"league"]}</div>
             <img id="logo-preview" class="absolute inset-0 w-full h-full object-contain hidden" style="background: transparent;">
             <label for="logo-upload" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">${F.plus}</span>
             </label>
             <input type="file" id="logo-upload" class="hidden" accept="image/*">
           </div>
           <h1 class="text-3xl md:text-4xl font-black text-slate-100 tracking-tighter mb-2 uppercase">Provision Specs</h1>
           <p class="text-slate-500 text-[9px] font-black tracking-[0.3em] uppercase">${e.replace("_"," ")} Engine</p>
        </div>
        
        <form id="config-form" class="space-y-6 md:space-y-8">
          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Atmospheric Title</label>
            <input type="text" name="name" required class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-100 placeholder:text-slate-800 shadow-inner" placeholder="E.g. Champions League 2026">
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Genesis Date</label>
            <input type="date" name="startDate" required class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner">
          </div>

          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Squad Volume</label>
              <input type="number" name="teamCount" id="teamCountInput" value="8" min="2" max="64" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black font-mono shadow-inner">
            </div>
            
            ${n?`
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Density (Sq/G)</label>
                <select name="groupSize" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                  <option value="3">3 Squads</option>
                  <option value="4" selected>4 Squads</option>
                  <option value="5">5 Squads</option>
                </select>
              </div>
            `:`
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Match Intensity</label>
                <select name="legs" class="w-full px-6 py-4 md:px-7 md:py-5 bg-slate-950 border border-slate-800 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                  <option value="1">Single Leg</option>
                  <option value="2" ${r?"selected":""}>Home & Away</option>
                </select>
              </div>
            `}
          </div>

          ${r?`
            <div class="grid grid-cols-3 gap-3">
               <div class="space-y-1">
                <label class="text-[8px] font-black text-emerald-500 uppercase tracking-widest pl-2">Europe</label>
                <input type="number" name="continentalSpots" value="4" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
               <div class="space-y-1">
                <label class="text-[8px] font-black text-indigo-500 uppercase tracking-widest pl-2">Promo</label>
                <input type="number" name="promoSpots" value="0" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
              <div class="space-y-1">
                <label class="text-[8px] font-black text-red-500 uppercase tracking-widest pl-2">Releg.</label>
                <input type="number" name="relegationSpots" value="3" min="0" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-red-500 outline-none text-slate-100 font-black font-mono text-center">
              </div>
            </div>
          `:""}

          <div class="space-y-6 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800/50 shadow-inner">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-indigo-600/10 rounded-xl text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
              </div>
              <span class="text-[10px] font-black text-slate-100 uppercase tracking-[0.2em]">Matchday Scheduling</span>
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Days per Matchday</label>
              <select name="daysPerMatchday" id="daysPerMatchday" class="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-100 font-black shadow-inner appearance-none">
                ${[1,2,3,4,5,6,7].map(h=>`<option value="${h}" ${h===1?"selected":""}>${h} Day${h>1?"s":""}</option>`).join("")}
              </select>
            </div>

            <div class="space-y-3">
              <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-2">Operational Days</label>
              <div class="grid grid-cols-4 sm:grid-cols-7 gap-2" id="matchdays-selector">
                ${["Fri","Sat","Sun","Mon","Tue","Wed","Thu"].map(h=>`
                  <div class="relative">
                    <input type="checkbox" name="matchDays" value="${h}" id="day-${h}" class="peer hidden" ${h==="Fri"||h==="Sat"?"checked":""}>
                    <label for="day-${h}" class="flex items-center justify-center py-3 rounded-xl border border-slate-800 bg-slate-950 text-[10px] font-black text-slate-600 uppercase tracking-tighter cursor-pointer transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                      ${h}
                    </label>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <div id="est-matches" class="bg-slate-950 p-5 rounded-2xl md:rounded-[2rem] border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400">
                ${F.fixtures}
              </div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Schedule Capacity</span>
            </div>
            <span id="matchCountLabel" class="text-slate-100 font-black font-mono text-lg tracking-tighter italic">-- Matches</span>
          </div>

          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-indigo-900/40 text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 group active:scale-95">
            <span>Provision Unit</span>
            <span class="group-hover:translate-x-2 transition-transform">${F.star}</span>
          </button>
        </form>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{g.onboarding.step=1,j()});const i=document.getElementById("config-form"),o=document.getElementById("matchCountLabel"),l=document.getElementById("teamCountInput"),c=()=>{var b;const h=parseInt(l.value)||0,f=e;let m=0;if(f==="round_robin"||f==="league"){const v=parseInt(((b=i.elements.legs)==null?void 0:b.value)||(f==="league"?2:1));m=h*(h-1)/2*v}else if(f==="knockout"){const v=parseInt(i.elements.legs.value);m=(h-1)*v}else if(f==="groups"){const v=parseInt(i.elements.groupSize.value),T=Math.ceil(h/v),R=v*(v-1)/2;m=T*R+(T*2-1)}o.innerText=`${Math.floor(m)} Matches`};i.addEventListener("input",c),c();let d=null;document.getElementById("logo-upload").addEventListener("change",async h=>{const f=h.target.files[0];if(f){if(f.size>2*1024*1024){alert("Maximum size 2MB allowed.");return}d=await Mv(f);const m=document.getElementById("logo-preview"),b=document.getElementById("logo-placeholder");m.src=d,m.classList.remove("hidden"),b.classList.add("hidden")}}),document.getElementById("back-btn").addEventListener("click",()=>{g.onboarding.step=1,j()}),i.addEventListener("submit",h=>{h.preventDefault();const f=new FormData(h.target);$v({name:f.get("name"),startDate:f.get("startDate"),type:e,logo:d,teamCount:parseInt(f.get("teamCount")),legs:parseInt(f.get("legs")||(e==="league"?2:1)),groupSize:parseInt(f.get("groupSize")||0),promoSpots:parseInt(f.get("promoSpots")||0),relegationSpots:parseInt(f.get("relegationSpots")||0),continentalSpots:parseInt(f.get("continentalSpots")||0),scheduling:{daysPerMatchday:parseInt(f.get("daysPerMatchday")),matchDays:Array.from(h.target.querySelectorAll('input[name="matchDays"]:checked')).map(m=>m.value)}})})}function Rh(s){const e=new Date(s);let n=new Date(2026,3,17);if(e>=n)for(;;){let r=new Date(n);if(r.setMonth(r.getMonth()+9),r.setDate(r.getDate()-1),e<=r){const i=n.getFullYear(),o=r.getFullYear();return{name:i===o?`${i} Season`:`${i}/${o}`,start:n,end:r}}if(n.setMonth(n.getMonth()+9),n.getFullYear()>2100)break}else for(;;){let r=new Date(n);n=new Date(n),n.setMonth(n.getMonth()-9);let i=new Date(r);if(i.setDate(i.getDate()-1),e>=n&&e<=i){const o=n.getFullYear(),l=i.getFullYear();return{name:o===l?`${o} Season`:`${o}/${l}`,start:n,end:i}}if(n.getFullYear()<2020)break}return{name:"Legacy",start:null,end:null}}function Lv(){return Rh(new Date).name}async function $v(s){const e=Lv();if(g.tournaments.find(o=>o.name.toLowerCase()===s.name.toLowerCase()&&(o.season===e||!o.season))){alert(`A tournament named "${s.name}" already exists in the ${e} season.`);return}const r=`t-${Date.now()}`,i={id:r,...s,season:e,teams:Array.from({length:s.teamCount},(o,l)=>({id:l,name:`Team ${l+1}`,players:[]})),fixtures:[],standings:[],groups:[],currentStage:s.type==="groups"?"groups":s.type,status:"setup_teams",createdAt:Date.now()};g.tournament=i,g.onboarding.step=0;try{await Zr(Ge(Ne,"tournaments",r),{id:r,name:s.name,season:e,createdAt:Date.now()}),console.log("[KickOff] Tournament synced to Firestore ranking system")}catch(o){console.error("[KickOff] Firestore sync failed:",o)}le(),j()}function Ov(s){s.innerHTML=`
    <div class="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <main class="flex-1 p-6 md:p-10 lg:p-16 overflow-auto">
        <div id="view-container"></div>
      </main>
    </div>
  `;const e=document.getElementById("view-container");g.tournament.status==="setup_teams"?Fv(e):g.tournament.status==="onboarding_summary"&&Uv(e)}function Fv(s){const e=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#f97316","#14b8a6","#3b82f6"];s.innerHTML=`
     <div class="max-w-5xl mx-auto space-y-12">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-6">
          <button id="back-to-config-btn" style="position:relative; z-index:9999;" onclick="console.log('Raw click fired!')" class="hidden md:flex text-slate-600 hover:text-indigo-400 transition-all uppercase text-[9px] font-black tracking-[0.2em] items-center gap-2 group cursor-pointer">
            <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
            <span>Back</span>
          </button>
          <div class="space-y-1">
            <div class="flex items-center gap-4">
              <button id="back-to-config-btn-mobile" class="md:hidden text-slate-600 hover:text-indigo-400 transition-all text-xl font-black">&larr;</button>
              <h3 class="text-2xl md:text-4xl font-black tracking-tight">Roster Registry</h3>
            </div>
            <p class="text-slate-500 font-medium tracking-widest uppercase text-[10px] md:text-xs">Assign identities and warpaint to your competitors</p>
          </div>
        </div>
        <button id="generate-fixtures-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl shadow-indigo-900/40 flex items-center gap-4 group">
          <span>Generate Fixtures</span>
          <span class="group-hover:translate-x-1 transition-transform border-l border-white/20 pl-4 ml-4">${F.fixtures}</span>
        </button>
      </div>
      
      <div id="team-inputs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        ${g.tournament.teams.map((o,l)=>`
          <div class="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-all flex items-center gap-4 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-700 relative overflow-hidden">
               <input type="color" data-color-id="${o.id}" value="${e[l%e.length]}" class="absolute inset-0 w-full h-full border-none p-0 cursor-pointer opacity-0">
               <div id="team-img-container-${o.id}" class="absolute inset-0 ${o.image?"":"hidden"}">
                 <img src="${o.image||""}" class="w-full h-full object-cover">
               </div>
               <div style="background-color: ${e[l%e.length]}" class="w-6 h-6 rounded-full shadow-inner team-color-dot" data-dot-id="${o.id}"></div>
            </div>
            <div class="flex-1">
               <label class="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Squad Name</label>
               <input type="text" data-team-id="${o.id}" value="${o.name}" list="club-players" class="team-name-input w-full bg-transparent border-none focus:ring-0 text-lg font-black text-slate-100 placeholder:text-slate-800" placeholder="Type name for suggestions...">
            </div>
          </div>
        `).join("")}
      </div>

      <datalist id="club-players">
        ${g.dashboardPlayers.map(o=>`<option value="${o.name}">${o.ovr} OVR • #${o.number}</option>`).join("")}
      </datalist>
    </div>
  `,document.querySelectorAll(".team-name-input").forEach(o=>{o.addEventListener("input",l=>{const c=l.target.value.trim(),d=g.dashboardPlayers.find(b=>b.name.toLowerCase()===c.toLowerCase()),h=parseInt(l.target.dataset.teamId),f=g.tournament.teams.find(b=>b.id===h),m=document.getElementById(`team-img-container-${h}`);d?(f.playerId=d.id,f.image=d.image,m&&(m.querySelector("img").src=d.image,m.classList.remove("hidden"))):(f.playerId=null,f.image=null,m&&m.classList.add("hidden"))})}),document.querySelectorAll('input[type="color"]').forEach(o=>{o.addEventListener("input",l=>{const c=l.target.dataset.colorId,d=document.querySelector(`.team-color-dot[data-dot-id="${c}"]`);d&&(d.style.backgroundColor=l.target.value)})});const n=()=>{if(console.log("Back button clicked!"),!!g.tournament)try{g.tournaments=g.tournaments.filter(o=>o&&o.id!==g.tournament.id),g.tournament=null,g.onboarding.step=2,le(),j()}catch(o){console.error(o),alert("Error going back: "+o.message)}},r=document.getElementById("back-to-config-btn");r&&r.addEventListener("click",n);const i=document.getElementById("back-to-config-btn-mobile");i&&i.addEventListener("click",n),document.getElementById("generate-fixtures-btn").addEventListener("click",()=>{document.querySelectorAll(".team-name-input").forEach(o=>{const l=parseInt(o.dataset.teamId),c=document.querySelector(`input[data-color-id="${l}"]`);g.tournament.teams[l].name=o.value||`Team ${l+1}`,g.tournament.teams[l].color=c?c.value:"#6366f1"}),le(),zv()})}function Uv(s){const{fixtures:e}=g.tournament,n=Math.max(...e.map(r=>r.round),0);s.innerHTML=`
    <div class="min-h-screen flex items-center justify-center -mt-20">
      <div class="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-3xl p-12 border border-slate-800 text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
          ${F.trophy}
        </div>
        <h2 class="text-3xl font-black text-slate-100 mb-4 tracking-tighter">Season Manifested</h2>
        <p class="text-slate-400 mb-10 text-sm font-medium">The schedule engine has successfully mapped the competition path.</p>
        <div class="grid grid-cols-2 gap-4 mb-10">
          <div class="bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Matches</p>
             <p class="text-2xl font-black text-slate-100 font-mono">${e.length}</p>
          </div>
          <div class="bg-slate-950 p-4 rounded-3xl border border-slate-800">
             <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Rounds</p>
             <p class="text-2xl font-black text-slate-100 font-mono">${n}</p>
          </div>
        </div>
        <button id="begin-ops-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/20">
          Begin Operations &rarr;
        </button>
      </div>
    </div>
  `,document.getElementById("begin-ops-btn").addEventListener("click",()=>{g.tournament.status="active",le(),j()})}function Bv(s="auto",e={}){const{type:n,teams:r,legs:i=1,groupSize:o=4}=g.tournament;if(n==="round_robin"||n==="league")if(s==="semi"){const c=r.length%2===0?r.length:r.length+1;g.tournament.fixtures=xv(r,e,(c-1)*i,i,n)}else g.tournament.fixtures=ha(r,i,n);else if(n==="knockout")g.tournament.fixtures=bv(r,1,i);else if(n==="groups"){const{groups:c,fixtures:d}=vv(r,o);g.tournament.groups=c,g.tournament.fixtures=d}const l=wv(g.tournament.fixtures);l.length&&console.warn("[FixtureEngine]",l)}function jv(s,e=1,n=1){let r=1;for(;r<s.length;)r*=2;const i=r,o=[],l=[...s].sort(()=>Math.random()-.5),c=(f,m,b,v,T)=>({id:`ko-r${f}-m${m}-l${b}`,homeId:v,awayId:v===null?null:T,homeScore:null,awayScore:null,status:"upcoming",round:f+b,matchIndex:m,stage:"knockout",leg:b+1});for(let f=0;f<i/2;f++){const m=l[f*2]||null,b=l[f*2+1]||null;if(m&&b)for(let v=0;v<n;v++)o.push(c(e,f,v,v===0?m.id:b.id,v===0?b.id:m.id))}let d=i/2,h=e+n;for(;d>1;){d/=2;for(let f=0;f<d;f++)for(let m=0;m<n;m++)o.push(c(h,f,m,null,null));h+=n}if(i>s.length){const f=e+n;for(let m=0;m<i/2;m++){const b=l[m*2]||null,v=l[m*2+1]||null;if(!b||!v){const T=b||v,R=Math.floor(m/2),P=m%2===0?"homeId":"awayId",L=o.find(M=>M.round===f&&M.matchIndex===R);L&&(L[P]=T.id)}}}return o}function zv(){const s=document.createElement("div");s.id="fixture-wizard",s.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto";const{type:e,teams:n,legs:r=1}=g.tournament,i=e==="knockout",o=e==="groups",l=!i&&!o;s.innerHTML=`
    <div style="width:100%;max-width:620px;background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:${g.isMobile?"1.25rem":"2.5rem"};box-shadow:0 40px 80px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
      <div style="margin-bottom:2rem">
        <div style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.25em;margin-bottom:0.4rem">Fixture Engine v2</div>
        <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;margin:0">Choose Generation Mode</h2>
        <p style="font-size:0.75rem;color:#475569;margin-top:0.5rem">${n.length} teams · ${e.replace("_"," ")}${l?` · ${r} leg${r>1?"s":""}`:""}</p>
      </div>
      <div id="mode-tabs" style="display:grid;grid-template-columns:${g.isMobile?"1fr":i||o?"1fr 1fr":"repeat(3,1fr)"};gap:0.75rem;margin-bottom:1.5rem">
        <button class="wiz-mode" data-mode="auto" style="padding:1rem;border-radius:1rem;border:2px solid #3b82f6;background:rgba(59,130,246,0.1);cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">⚡</div>
          <div style="font-size:0.7rem;font-weight:900;color:#60a5fa;text-transform:uppercase;letter-spacing:0.1em">Auto</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Full algorithm</div>
        </button>
        ${l?`<button class="wiz-mode" data-mode="semi" style="padding:1rem;border-radius:1rem;border:2px solid #1e1e32;background:#0a0a12;cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">🎛️</div>
          <div style="font-size:0.7rem;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Semi-Auto</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Pin key matches</div>
        </button>`:""}
        <button class="wiz-mode" data-mode="manual" style="padding:1rem;border-radius:1rem;border:2px solid #1e1e32;background:#0a0a12;cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">✍️</div>
          <div style="font-size:0.7rem;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Full Manual</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Every fixture</div>
        </button>
      </div>
      <div id="wiz-panel" style="min-height:140px"></div>
      <div style="display:flex;gap:0.75rem;margin-top:1.5rem">
        <button id="wiz-cancel" style="flex:1;padding:0.875rem;border-radius:0.875rem;border:1px solid #1e1e32;background:#0a0a12;color:#475569;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer">Cancel</button>
        <button id="wiz-confirm" style="flex:2;padding:0.875rem;border-radius:0.875rem;border:none;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,0.3)">Generate Fixtures →</button>
      </div>
    </div>
  `,document.body.appendChild(s);let c="auto";const d={};let h=[];function f(v){c=v,s.querySelectorAll(".wiz-mode").forEach(T=>{const R=T.dataset.mode===v;T.style.border=R?"2px solid #3b82f6":"2px solid #1e1e32",T.style.background=R?"rgba(59,130,246,0.1)":"#0a0a12";const P=T.querySelector("div:nth-child(2)");P&&(P.style.color=R?"#60a5fa":"#94a3b8")}),m(v)}function m(v){const T=document.getElementById("wiz-panel");if(v==="auto"){const R=l?'<strong style="color:#60a5fa">Berger Circle</strong> round-robin — every team plays exactly once per matchday. Home/away alternates each leg. Odd teams get a fair BYE rotation.':i?`<strong style="color:#60a5fa">Seeded bracket</strong> — teams placed 1–${n.length} in optimal positions. BYE teams auto-advance. Subsequent rounds pre-generated as empty slots.`:'<strong style="color:#60a5fa">Randomised group draw</strong> then Berger round-robin within each group.';T.innerHTML=`
        <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:1.25rem">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.7;margin:0">${R}</p>
          <div style="margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:0.65rem;color:#60a5fa;font-weight:900">
            ✓ No team plays twice on the same matchday &nbsp;|&nbsp; ✓ Validated before saving
          </div>
        </div>`}else if(v==="semi"){const P=((n.length%2===0?n.length:n.length+1)-1)*r,L=Math.min(P,8),M=n.map(G=>`<option value="${G.id}">${G.name}</option>`).join(""),q=Math.floor(n.length/2);let B="";for(let G=1;G<=L;G++){let Z="";for(let E=0;E<q;E++)Z+=`
            <div style="display:grid;grid-template-columns:1fr 0.4rem 1fr;gap:0.5rem;align-items:center;margin-top:0.4rem">
              <select data-round="${G}" data-match="${E}" data-side="home" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Home</option>${M}
              </select>
              <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
              <select data-round="${G}" data-match="${E}" data-side="away" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Away</option>${M}
              </select>
            </div>`;B+=`<div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem;margin-bottom:0.5rem">
          <span style="font-size:0.6rem;font-weight:900;color:#334155;white-space:nowrap;display:block;margin-bottom:0.2rem">MD ${G}</span>
          ${Z}
        </div>`}T.innerHTML=`
        <p style="font-size:0.72rem;color:#475569;margin:0 0 0.75rem">Optionally pin matches per matchday (Max ${q}). Leave blank to let the algorithm decide.</p>
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:300px;overflow-y:auto">${B}</div>
        <p style="font-size:0.6rem;color:#334155;margin-top:0.5rem">Showing ${L} of ${P} matchdays. Algorithm fills all unpinned slots automatically.</p>`,T.querySelectorAll(".sp").forEach(G=>{G.addEventListener("change",()=>{const Z=parseInt(G.dataset.round),E=parseInt(G.dataset.match);d[Z]||(d[Z]=[]),d[Z][E]||(d[Z][E]={}),d[Z][E][G.dataset.side==="home"?"homeId":"awayId"]=G.value?parseInt(G.value):null})})}else b(T)}function b(v){const T=n.map(R=>`<option value="${R.id}">${R.name}</option>`).join("");v.innerHTML=`
      <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:0.875rem;margin-bottom:0.625rem">
        <div style="display:grid;grid-template-columns:1fr 0.3fr 1fr 52px 36px;gap:0.4rem;align-items:center">
          <select id="m-home" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Home</option>${T}</select>
          <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
          <select id="m-away" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Away</option>${T}</select>
          <input id="m-round" type="number" min="1" placeholder="MD" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none;text-align:center;width:100%">
          <button id="m-add" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);border:none;color:white;font-weight:900;font-size:1rem;border-radius:0.5rem;cursor:pointer;height:100%;width:100%">＋</button>
        </div>
        <p id="m-err" style="font-size:0.65rem;color:#f87171;margin-top:0.4rem;display:none"></p>
      </div>
      <div style="font-size:0.65rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">${h.length} fixture${h.length!==1?"s":""} added</div>
      <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:0.35rem">
        ${h.length===0?'<p style="font-size:0.72rem;color:#334155;text-align:center;padding:1rem 0">No fixtures yet — add some above.</p>':h.map((R,P)=>{var q,B;const L=((q=n.find(G=>G.id===R.homeId))==null?void 0:q.name)||"?",M=((B=n.find(G=>G.id===R.awayId))==null?void 0:B.name)||"?";return`<div style="display:flex;align-items:center;justify-content:space-between;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.625rem;padding:0.45rem 0.75rem">
                <span style="font-size:0.75rem;color:#94a3b8"><strong style="color:#60a5fa">MD${R.round}</strong>  ${L} <span style="color:#334155">vs</span> ${M}</span>
                <button data-del="${P}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:0.9rem;padding:0 0.25rem">✕</button>
              </div>`}).join("")}
      </div>`,document.getElementById("m-add").addEventListener("click",()=>{const R=parseInt(document.getElementById("m-home").value),P=parseInt(document.getElementById("m-away").value),L=parseInt(document.getElementById("m-round").value),M=document.getElementById("m-err");if(M.style.display="none",!R||!P){M.textContent="Select both teams.",M.style.display="block";return}if(R===P){M.textContent="Home and away must differ.",M.style.display="block";return}if(!L||L<1){M.textContent="Enter a valid matchday (≥1).",M.style.display="block";return}if(h.filter(B=>B.round===L).some(B=>B.homeId===R||B.awayId===R||B.homeId===P||B.awayId===P)){M.textContent="A team already plays on this matchday!",M.style.display="block";return}h.push({id:`man-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,homeId:R,awayId:P,round:L,homeScore:null,awayScore:null,status:"upcoming",stage:i?"knockout":e,date:null,venue:null}),b(v)}),v.querySelectorAll("[data-del]").forEach(R=>{R.addEventListener("click",()=>{h.splice(parseInt(R.dataset.del),1),b(v)})})}s.querySelectorAll(".wiz-mode").forEach(v=>v.addEventListener("click",()=>f(v.dataset.mode))),m("auto"),document.getElementById("wiz-confirm").addEventListener("click",()=>{if(c==="manual"){if(h.length===0){as("Add at least one fixture first.");return}g.tournament.fixtures=h}else Bv(c,d);g.tournament.status="onboarding_summary",le(),s.remove(),j()}),document.getElementById("wiz-cancel").addEventListener("click",()=>s.remove())}function qv(){return`
    <header class="backdrop-blur-xl border-b p-3 sticky top-0 z-50 flex items-center justify-between no-print" style="background:rgba(10,10,18,0.92);border-color:#1e1e32">
      <div class="flex items-center gap-2.5 overflow-hidden" ${g.isAdmin?'id="mobile-switcher-btn"':""}>
        <img src="/logo.png" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(59,130,246,0.4),0 0 24px rgba(124,58,237,0.15);flex-shrink:0">
        <div class="overflow-hidden">
          <div class="text-[8px] font-black uppercase tracking-widest" style="color:#475569">Tournament</div>
          <h2 class="text-sm font-black truncate tracking-tighter uppercase" style="color:#f1f5f9">${g.tournament.name}</h2>
        </div>
        ${g.isAdmin?`<span class="ml-1" style="color:#334155">${F.menu}</span>`:""}
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle-mobile" class="p-2 rounded-xl border transition-all active:scale-95" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
          ${g.theme==="dark"?F.sun:F.moon}
        </button>
      </div>
    </header>
  `}function Hv(){return`
    <nav class="fixed bottom-0 inset-x-0 grid grid-cols-5 safe-area-pb z-50 no-print" style="background:rgba(10,10,18,0.95);border-top:1px solid #1e1e32;backdrop-filter:blur(20px);box-shadow:0 -10px 40px rgba(0,0,0,0.6)">
       ${[{id:"dashboard",label:"Home",icon:F.home},{id:"fixtures",label:"Matches",icon:F.fixtures},{id:"standings",label:"Stats",icon:F.standings},{id:"teams",label:"Squads",icon:F.teams},{id:"more",label:"More",icon:F.more}].map(e=>{const n=g.view===e.id||e.id==="more"&&["scorers","bracket","awards","summary"].includes(g.view);return`
           <button data-nav="${e.id}" class="flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90" style="color:${n?"#60a5fa":"#475569"}">
             <span class="w-5 h-5">${e.icon}</span>
             <span class="text-[8px] font-black uppercase tracking-widest" style="opacity:${n?1:.5}">${e.label}</span>
             ${n?'<span class="absolute bottom-0 w-8 h-0.5 rounded-full" style="background:linear-gradient(90deg,#3b82f6,#7c3aed)"></span>':""}
           </button>
         `}).join("")}
    </nav>
  `}function xo(s,e=!1){const n=document.getElementById("bottom-sheet-container"),r=e?"custom":s;if(g.activeBottomSheet===r&&!e){g.activeBottomSheet=null,n.innerHTML="";return}g.activeBottomSheet=r;let i="";e?i=s:r==="more"?i=`
      <div class="space-y-3 p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">More Options</h4>
          <span class="text-slate-700 font-mono text-[9px] uppercase">v2.1</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button data-view-mobile="scorers" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${F.boot}</span>
             <span class="text-xs font-black uppercase tracking-tight">Top Scorers</span>
          </button>
          <button data-view-mobile="bracket" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${F.bracket}</span>
             <span class="text-xs font-black uppercase tracking-tight">Knockout Stage</span>
          </button>
          <button data-view-mobile="history" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${F.certificate}</span>
             <span class="text-xs font-black uppercase tracking-tight">League History</span>
          </button>
          ${g.isAdmin?`
          <button data-view-mobile="summary" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${F.trophy}</span>
             <span class="text-xs font-black uppercase tracking-tight">Tournament Report</span>
          </button>
          <button data-view-mobile="awards" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${F.medal}</span>
             <span class="text-xs font-black uppercase tracking-tight">Special Awards</span>
          </button>
          <button data-view-mobile="settings" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800 col-span-2">
             <span class="p-3 rounded-xl" style="background:rgba(59,130,246,0.1);color:#60a5fa">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
             </span>
             <span class="text-xs font-black uppercase tracking-tight">Account Settings &amp; Credentials</span>
          </button>
          `:""}
        </div>
        ${g.isAdmin?`
        <div class="h-px bg-slate-800/50 my-3"></div>
        <button id="logout-btn" class="w-full flex items-center justify-center gap-4 p-5 rounded-2xl border font-black uppercase text-[10px] tracking-[0.2em] transition-all" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2);color:#f87171">
           ${F.trash} Sign Out
        </button>
        `:""}
      </div>
    `:r==="switcher"&&(i=`
      <div class="space-y-6 p-8">
        <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Tournament Registry</h4>
        <div class="space-y-3 max-h-[50vh] overflow-auto">
          ${g.tournaments.map(o=>`
            <button data-switch="${o.id}" class="w-full p-6 bg-slate-950 border ${g.tournament.id===o.id?"border-indigo-500 bg-indigo-500/5":"border-slate-800"} rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98]">
               <div class="flex flex-col items-start">
                 <span class="font-black text-sm uppercase tracking-tighter ${g.tournament.id===o.id?"text-indigo-400":"text-slate-100"}">${o.name}</span>
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${o.type} &bull; ${o.teams.length} Teams</span>
               </div>
               ${g.tournament.id===o.id?'<span class="text-indigo-500 text-xs">●</span>':""}
            </button>
          `).join("")}
        </div>
        <button id="exit-tournament" class="w-full p-6 bg-slate-800 rounded-[2rem] text-slate-300 font-black uppercase text-[10px] tracking-widest border border-slate-700 shadow-xl">
           EXIT TO COMMAND CENTER &rarr;
        </button>
      </div>
    `),n.innerHTML=`
    <div id="bs-backdrop" class="fixed inset-0 z-[90]" style="background:rgba(5,5,8,0.85);backdrop-filter:blur(12px)"></div>
    <div id="bs-body" class="fixed inset-x-0 bottom-0 rounded-t-[3rem] z-[100] pb-10 safe-area-pb max-h-[90vh] overflow-auto" style="background:#0f0f1a;border-top:1px solid #2a2a48;box-shadow:0 -40px 80px rgba(0,0,0,0.8)">
       <div class="w-12 h-1 rounded-full mx-auto mt-6 mb-4" style="background:#1e1e32"></div>
       ${i}
    </div>
  `,document.getElementById("bs-backdrop").addEventListener("click",()=>{g.activeBottomSheet=null,n.innerHTML=""}),r==="more"?(document.querySelectorAll("[data-view-mobile]").forEach(o=>o.addEventListener("click",()=>{g.view=o.dataset.viewMobile,g.activeBottomSheet=null,n.innerHTML="",j()})),document.getElementById("logout-btn").addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(ii),g.user=null,g.tournament=null,g.tournaments=[],Vr=!1,g.activeBottomSheet=null,n.innerHTML="",j())})):r==="switcher"&&(document.querySelectorAll("[data-switch]").forEach(o=>o.addEventListener("click",()=>{g.tournament=g.tournaments.find(l=>l.id===o.dataset.switch),g.view="dashboard",g.activeBottomSheet=null,n.innerHTML="",j()})),document.getElementById("exit-tournament").addEventListener("click",()=>{g.tournament=null,g.view="home",g.activeBottomSheet=null,n.innerHTML="",j()}))}function Gv(s){var n;const e=g.tournament.archived;g.isMobile?s.innerHTML=`
      <div class="flex flex-col min-h-screen" style="background:#050508;color:#f1f5f9">
        ${qv()}
        <main id="main-content" class="flex-1 p-5 pb-32 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div id="view-container"></div>
        </main>
        ${Hv()}
        <div id="bottom-sheet-container"></div>
      </div>
    `:s.innerHTML=`
      <div class="flex flex-col md:flex-row min-h-screen" style="background:#050508;color:#f1f5f9">
        <aside class="w-full md:w-64 flex flex-col z-20 sticky top-0 md:h-screen" style="background:#0a0a12;border-right:1px solid #1e1e32">
          <!-- Logo -->
          <div class="flex items-center gap-3 p-5 mb-6" style="border-bottom:1px solid #1e1e32">
            <img src="/logo.png" alt="KickOff" style="width:40px;height:40px;border-radius:10px;object-fit:cover;box-shadow:0 0 16px rgba(59,130,246,0.4),0 0 32px rgba(124,58,237,0.15)">
            <div>
              <div class="text-base font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</div>
              <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Tournaments</div>
            </div>
          </div>

          <nav class="flex-1 px-4 space-y-1">
            ${g.isAdmin?`
            <button id="back-to-home" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm mb-4" style="color:#475569" onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'">
              <span class="w-4 h-4">${F.arrowLeft}</span>
              <span>All Tournaments</span>
            </button>
            <div class="mb-4" style="height:1px;background:#1e1e32"></div>
            `:""}
            ${mt("dashboard","Dashboard",F.dashboard)}
            ${mt("fixtures","Fixtures",F.fixtures)}
            ${mt("standings","Standings",F.standings)}
            ${mt("scorers","Top Scorers",F.boot)}
            ${mt("teams","Teams",F.teams)}
            ${g.isAdmin&&(g.tournament.type==="knockout"||g.tournament.type==="groups")?mt("bracket","Bracket",F.bracket):""}
            ${mt("history","League History",F.certificate)}
            ${g.isAdmin?`
            <div style="height:1px;background:#1e1e32;margin:0.5rem 0"></div>
            ${mt("settings","Account Settings",'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>')}
            `:""}
          </nav>

          ${g.isAdmin?`
          <div class="p-4 mx-4 mb-6 rounded-xl" style="background:#0f0f1a;border:1px solid #1e1e32">
            <p class="text-[8px] font-black uppercase tracking-widest mb-2" style="color:#334155">Status</p>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full ${e?"":"pulse-dot"}" style="background:${e?"#475569":"#3b82f6"};box-shadow:${e?"none":"0 0 6px rgba(59,130,246,0.7)"}"></div>
              <span class="text-[10px] font-black uppercase tracking-widest" style="color:${e?"#475569":"#60a5fa"}">${e?"Archived":"Active"}</span>
            </div>
          </div>
          <div class="px-4 mb-2">
            <button id="new-btn-sidebar" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all" style="background:rgba(59,130,246,0.08);color:#60a5fa;border:1px solid rgba(59,130,246,0.15)" onmouseover="this.style.background='linear-gradient(135deg,#3b82f6,#7c3aed)';this.style.color='white';this.style.borderColor='transparent'" onmouseout="this.style.background='rgba(59,130,246,0.08)';this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.15)'">
               <span class="w-4 h-4">${F.plus}</span>
               <span>New Tournament</span>
            </button>
          </div>
          <div class="px-4 pb-4">
            <div class="flex items-center justify-between px-3 py-2.5 rounded-xl" style="background:#0a0a12;border:1px solid #1e1e32">
              <div>
                <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Signed in as</div>
                <div class="text-xs font-black uppercase" style="color:#60a5fa">${((n=g.user)==null?void 0:n.username)||"user"}</div>
              </div>
              <button id="logout-btn-sidebar" class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" style="background:rgba(239,68,68,0.08);color:#f87171;border:1px solid rgba(239,68,68,0.15)" onmouseover="this.style.background='rgba(239,68,68,0.2)'" onmouseout="this.style.background='rgba(239,68,68,0.08)'">
                Sign Out
              </button>
            </div>
          </div>
          `:""}
        </aside>
        <main id="main-content" class="flex-1 p-6 md:p-10 overflow-auto">
          <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style="color:#334155">
                  <span>Tournaments</span>
                  <span style="color:#1e1e32">/</span>
                  <span style="color:#60a5fa">${g.tournament.name}</span>
                  ${e?'<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase" style="background:#0f0f1a;color:#475569;border:1px solid #1e1e32">READ ONLY</span>':""}
                </div>
                <h2 class="text-3xl font-black tracking-tight capitalize" style="color:#f1f5f9">${g.view}</h2>
             </div>
             <nav class="flex gap-1 p-1 rounded-xl border no-print" style="background:#0a0a12;border-color:#1e1e32">
                ${["dashboard","fixtures","standings","scorers"].map(r=>`
                  <button data-view="${r}" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" style="${g.view===r?"background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 2px 12px rgba(59,130,246,0.3)":"color:#475569"}" ${g.view!==r?`onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'"`:""}>
                    ${r==="scorers"?"Scorers":r.charAt(0).toUpperCase()+r.slice(1)}
                  </button>
                `).join("")}
             </nav>
          </header>
          <div id="view-container"></div>
        </main>
      </div>
    `,Wv(),Kv()}function Wv(){if(g.isMobile){document.querySelectorAll("[data-nav]").forEach(n=>n.addEventListener("click",()=>{const r=n.dataset.nav;r==="more"?xo("more"):(g.view=r,j())}));const s=document.getElementById("mobile-switcher-btn");s&&s.addEventListener("click",()=>xo("switcher"));const e=document.getElementById("theme-toggle-mobile");e&&e.addEventListener("click",Th)}else{document.querySelectorAll("[data-view]").forEach(r=>r.addEventListener("click",()=>{g.view=r.dataset.view,j()}));const s=document.getElementById("back-to-home");s&&s.addEventListener("click",()=>{g.tournament=null,g.view="home",j()});const e=document.getElementById("new-btn-sidebar");e&&e.addEventListener("click",()=>{if(g.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}g.tournament=null,g.onboarding.step=1,j()});const n=document.getElementById("logout-btn-sidebar");n&&n.addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(ii),g.user=null,g.tournament=null,g.tournaments=[],Vr=!1,j())})}}function mt(s,e,n){const r=g.view===s;return`<button data-view="${s}" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm" style="${r?"background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));color:#60a5fa;border:1px solid rgba(59,130,246,0.2)":"color:#475569;border:1px solid transparent"}" ${r?"":`onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'"`}><span class="w-4 h-4 flex-shrink-0">${n}</span><span>${e}</span></button>`}function Kv(){const s=document.getElementById("view-container");switch(g.view){case"dashboard":Jv(s);break;case"fixtures":Ch(s);break;case"standings":yt(s);break;case"scorers":Yv(s);break;case"teams":sx(s);break;case"bracket":Mh(s);break;case"h2h":nx(s);break;case"summary":lx(s);break;case"history":cx(s);break;case"champion":ax(s);break;case"awards":dx(s);break;case"settings":Qv(s);break}}function Qv(s){var i,o;const e='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',n='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';s.innerHTML=`
    <div class="max-w-lg mx-auto space-y-8 pb-24 md:pb-8">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-black tracking-tight" style="color:#f1f5f9">Account Settings</h2>
        <p class="text-xs font-bold mt-1 uppercase tracking-widest" style="color:#475569">Manage your admin credentials</p>
      </div>

      <!-- Current User Info -->
      <div class="rounded-2xl p-5 flex items-center gap-4" style="background:#0f0f1a;border:1px solid #1e1e32">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#3b82f6,#7c3aed)">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest mb-0.5" style="color:#334155">Signed in as</p>
          <p class="font-black text-base uppercase" style="color:#60a5fa">${(i=g.user)==null?void 0:i.username}</p>
          <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${((o=g.user)==null?void 0:o.role)||"admin"}</p>
        </div>
      </div>

      <!-- Change Username -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#60a5fa">${n}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Change Username</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <form id="change-username-form" class="space-y-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">New Username</label>
              <input id="new-username" type="text" placeholder="Enter new username" autocomplete="off"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Current Password (to confirm)</label>
              <input id="confirm-pw-for-username" type="password" placeholder="Enter current password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <p id="username-msg" class="text-xs font-bold" style="color:#f87171;display:none"></p>
            <button type="submit" style="background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));color:#60a5fa;border:1px solid rgba(59,130,246,0.25);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
              onmouseover="this.style.background='linear-gradient(135deg,#3b82f6,#7c3aed)';this.style.color='white';this.style.borderColor='transparent'"
              onmouseout="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.25)'">
              Update Username
            </button>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#a78bfa">${e}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Change Password</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <form id="change-password-form" class="space-y-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Current Password</label>
              <input id="current-password" type="password" placeholder="Enter current password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">New Password</label>
              <input id="new-password" type="password" placeholder="At least 6 characters"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-2" style="color:#475569">Confirm New Password</label>
              <input id="confirm-new-password" type="password" placeholder="Repeat new password"
                style="width:100%;background:#050508;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem 1rem;color:#f1f5f9;font-size:0.875rem;outline:none;box-sizing:border-box"
                onfocus="this.style.borderColor='rgba(59,130,246,0.5)'" onblur="this.style.borderColor='#1e1e32'">
            </div>
            <p id="password-msg" class="text-xs font-bold" style="color:#f87171;display:none"></p>
            <button type="submit" style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15));color:#a78bfa;border:1px solid rgba(124,58,237,0.25);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
              onmouseover="this.style.background='linear-gradient(135deg,#7c3aed,#3b82f6)';this.style.color='white';this.style.borderColor='transparent'"
              onmouseout="this.style.background='linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.15))';this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.25)'">
              Update Password
            </button>
          </form>
        </div>
      </div>

      <!-- Scheduling Settings (Admin Only) -->
      ${g.isAdmin?`
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#60a5fa"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg></span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#94a3b8">Matchday Scheduling</span>
        </div>
        <div class="p-5 space-y-6" style="background:#0a0a12">
          <form id="update-scheduling-form" class="space-y-6">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-3" style="color:#475569">Days per Matchday</label>
              <select name="daysPerMatchday" class="w-full bg:#050508 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold outline-none" style="background:#050508">
                ${[1,2,3,4,5,6,7].map(l=>{var c;return`<option value="${l}" ${((c=t.scheduling)==null?void 0:c.daysPerMatchday)===l?"selected":""}>${l} Day${l>1?"s":""}</option>`}).join("")}
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest mb-3" style="color:#475569">Operational Days</label>
              <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                ${["Fri","Sat","Sun","Mon","Tue","Wed","Thu"].map(l=>{var d,h;const c=(h=(d=t.scheduling)==null?void 0:d.matchDays)==null?void 0:h.includes(l);return`
                  <div class="relative">
                    <input type="checkbox" name="matchDays" value="${l}" id="set-day-${l}" class="peer hidden" ${c?"checked":""}>
                    <label for="set-day-${l}" class="flex items-center justify-center py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-[9px] font-black text-slate-600 uppercase cursor-pointer transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-transparent">
                      ${l}
                    </label>
                  </div>`}).join("")}
              </div>
            </div>
            <button type="submit" class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Save Schedule</button>
          </form>
        </div>
      </div>
      `:""}

      ${g.isAdmin?`
      <!-- Danger Zone -->
      <div class="rounded-2xl overflow-hidden mt-12" style="border:1px solid rgba(239,68,68,0.2)">
        <div class="px-5 py-4 flex items-center gap-3" style="background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.2)">
          <span style="color:#f87171">${F.trash}</span>
          <span class="text-xs font-black uppercase tracking-widest" style="color:#f87171">Danger Zone</span>
        </div>
        <div class="p-5" style="background:#0a0a12">
          <p class="text-xs font-bold mb-4 text-slate-400">Permanently delete this tournament and all its data. This action cannot be undone.</p>
          <button id="delete-tournament-btn-settings" style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.3);padding:0.7rem 1.5rem;border-radius:0.75rem;font-weight:900;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;width:100%;transition:all 0.2s"
            onmouseover="this.style.background='#ef4444';this.style.color='white'"
            onmouseout="this.style.background='rgba(239,68,68,0.1)';this.style.color='#f87171'">
            Delete Tournament
          </button>
        </div>
      </div>
      `:""}
    </div>
  `,g.isAdmin&&document.getElementById("update-scheduling-form").addEventListener("submit",l=>{l.preventDefault();const c=new FormData(l.target);t.scheduling={daysPerMatchday:parseInt(c.get("daysPerMatchday")),matchDays:Array.from(l.target.querySelectorAll('input[name="matchDays"]:checked')).map(d=>d.value)},le(),as("Schedule updated"),j()}),document.getElementById("change-username-form").addEventListener("submit",async l=>{l.preventDefault();const c=document.getElementById("username-msg"),d=document.getElementById("new-username").value.trim(),h=document.getElementById("confirm-pw-for-username").value;if(c.style.display="none",!d||d.length<3){c.textContent="Username must be at least 3 characters.",c.style.display="block";return}if(d===g.user.username){c.textContent="New username is the same as current.",c.style.display="block";return}try{const f=Ge(Ne,"users",g.user.username),m=await lr(f);if(!m.exists()){c.textContent="User not found.",c.style.display="block";return}const b=m.data(),v=await os(h);if(b.password!==v){c.textContent="Incorrect current password.",c.style.color="#f87171",c.style.display="block";return}if((await lr(Ge(Ne,"users",d))).exists()){c.textContent="That username is already taken.",c.style.color="#f87171",c.style.display="block";return}await Zr(Ge(Ne,"users",d),{...b,username:d}),await ju(f);const R={...g.user,username:d,loginTime:Date.now()};localStorage.setItem(ii,JSON.stringify(R)),g.user=R,await Dr(`Username changed to: ${d}`),as("Username updated successfully!"),c.style.color="#34d399",c.textContent="✓ Username updated. You are now signed in as "+d,c.style.display="block",document.getElementById("new-username").value="",document.getElementById("confirm-pw-for-username").value="",j()}catch(f){console.error(f),c.textContent="Error: "+(f.message||"Update failed."),c.style.color="#f87171",c.style.display="block"}}),document.getElementById("change-password-form").addEventListener("submit",async l=>{l.preventDefault();const c=document.getElementById("password-msg"),d=document.getElementById("current-password").value,h=document.getElementById("new-password").value,f=document.getElementById("confirm-new-password").value;if(c.style.display="none",h.length<6){c.textContent="New password must be at least 6 characters.",c.style.color="#f87171",c.style.display="block";return}if(h!==f){c.textContent="New passwords do not match.",c.style.color="#f87171",c.style.display="block";return}try{const m=Ge(Ne,"users",g.user.username),b=await lr(m);if(!b.exists()){c.textContent="User not found.",c.style.display="block";return}const v=b.data(),T=await os(d);if(v.password!==T){c.textContent="Current password is incorrect.",c.style.color="#f87171",c.style.display="block";return}const R=await os(h);await mo(m,{password:R,loginAttempts:0}),await Dr("Password changed"),as("Password updated successfully!"),c.style.color="#34d399",c.textContent="✓ Password changed. Keep it safe!",c.style.display="block",document.getElementById("current-password").value="",document.getElementById("new-password").value="",document.getElementById("confirm-new-password").value=""}catch(m){console.error(m),c.textContent="Error: "+(m.message||"Update failed."),c.style.color="#f87171",c.style.display="block"}});const r=document.getElementById("delete-tournament-btn-settings");r&&r.addEventListener("click",()=>{Sh(g.tournament.id)})}function yt(s){const e=g.tournament.type==="groups",n=Math.max(...g.tournament.fixtures.map(d=>d.round),1);g.timelineRound===null&&(g.timelineRound=n);const r=`
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 no-print">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matchday Timeline</h4>
          <p class="text-xl font-black text-indigo-400 font-mono">MD ${g.timelineRound} / ${n}</p>
        </div>
        <div class="flex-1 flex items-center gap-4">
          <input type="range" id="timeline-slider" min="1" max="${n}" value="${g.timelineRound}" 
            class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
          <div class="flex gap-2">
            <button id="timeline-prev" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&larr;</button>
            <button id="timeline-next" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&rarr;</button>
          </div>
        </div>
        <button id="timeline-reset" class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Latest</button>
      </div>
    </div>
  `;if(g.isMobile){s.innerHTML=`
      <div class="space-y-6">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Engine Output</h3>
          <div class="flex items-center gap-2 no-print">
            <button id="export-pdf-btn-mobile" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-2 rounded-lg active:scale-95 transition-all">PDF</button>
            <div class="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button id="view-mode-compact" class="p-2.5 rounded-lg ${g.mobileStandingsMode==="compact"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${F.league}
              </button>
              <button id="view-mode-cards" class="p-2.5 rounded-lg ${g.mobileStandingsMode==="cards"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${F.group}
              </button>
            </div>
          </div>
        </header>

        ${r}

        <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print overflow-x-auto no-scrollbar mb-4">
          ${["overall","home","away","cleansheets"].map(h=>`
            <button data-filter="${h}" class="flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${g.standingsFilter===h?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}">
              ${h==="cleansheets"?"Clean":h}
            </button>
          `).join("")}
        </div>

        <div id="standings-content" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${ls(!1,null,g.timelineRound)}
        </div>
      </div>
    `;const d=s.querySelector("#export-pdf-btn-mobile");d&&d.addEventListener("click",Wc),s.querySelector("#view-mode-compact").addEventListener("click",()=>{g.mobileStandingsMode="compact",localStorage.setItem("mobile_standings_mode","compact"),yt(s)}),s.querySelector("#view-mode-cards").addEventListener("click",()=>{g.mobileStandingsMode="cards",localStorage.setItem("mobile_standings_mode","cards"),yt(s)})}else{const d=`
      <div class="flex flex-wrap gap-4 no-print justify-end transition-all">
        <button id="print-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">🖨️</span> Print
        </button>
        <button id="export-img-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📷</span> Image
        </button>
        <button id="export-pdf-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> PDF
        </button>
      </div>
    `,h=`
      <div class="print-header">
        <h1>${g.tournament.name}</h1>
        <p>Tournament Standings • ${g.standingsFilter.toUpperCase()} View • Matchday ${g.timelineRound} • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `,f=`
      <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print self-start">
        ${["overall","home","away","cleansheets"].map(T=>`
          <button data-filter="${T}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${g.standingsFilter===T?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}" style="${g.standingsFilter===T?"box-shadow:0 4px 12px rgba(79,70,229,0.3)":""}">
            ${T==="cleansheets"?"Clean Sheets":T}
          </button>
        `).join("")}
      </div>
    `;e?s.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${f}
           ${d}
        </div>
        ${r}
        ${h}
        <div id="standings-content" class="grid grid-cols-1 xl:grid-cols-2 gap-12">
          ${g.tournament.groups.map(T=>`
            <div class="space-y-6">
              <h4 class="text-xl font-black text-slate-100 flex items-center gap-4">
                <span class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm tracking-tighter">${T.name}</span>
                Group ${T.name}
              </h4>
              ${ls(!1,T.id,g.timelineRound)}
            </div>
          `).join("")}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `:s.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${f}
           ${d}
        </div>
        ${r}
        ${h}
        <div id="standings-content">
          ${ls(!1,null,g.timelineRound)}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;const m=s.querySelector("#print-btn");m&&m.addEventListener("click",()=>window.print());const b=s.querySelector("#export-img-btn");b&&b.addEventListener("click",ix);const v=s.querySelector("#export-pdf-btn");v&&v.addEventListener("click",Wc)}const i=document.getElementById("timeline-slider");i&&i.addEventListener("input",d=>{g.timelineRound=parseInt(d.target.value),yt(s)});const o=document.getElementById("timeline-prev");o&&o.addEventListener("click",()=>{g.timelineRound>1&&(g.timelineRound--,yt(s))});const l=document.getElementById("timeline-next");l&&l.addEventListener("click",()=>{g.timelineRound<n&&(g.timelineRound++,yt(s))});const c=document.getElementById("timeline-reset");c&&c.addEventListener("click",()=>{g.timelineRound=n,yt(s)}),s.querySelectorAll("[data-filter]").forEach(d=>{d.addEventListener("click",()=>{g.standingsFilter=d.dataset.filter,yt(s)})}),s.querySelectorAll(".team-detail-btn").forEach(d=>{d.addEventListener("click",()=>He(d.dataset.teamId))})}function Yv(s){const e=Tn();if(g.isMobile)s.innerHTML=`
      <div class="space-y-4 animate-in fade-in duration-500 pb-20">
        <div>
          <h3 class="text-3xl font-black tracking-tight text-slate-100">Top Scorers</h3>
          <p class="text-slate-500 font-medium tracking-widest uppercase text-xs mt-1">Full Leaderboard & Fantasy Performance</p>
        </div>
        ${e.map((n,r)=>{const i=r===0?"🥇":r===1?"🥈":r===2?"🥉":null;return`
            <div class="${r<3?"bg-indigo-600/10 border-indigo-500/20":"bg-slate-900 border-slate-800"} border rounded-[2rem] p-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-all">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-xs font-black text-slate-700 border border-slate-800">
                    ${n.name.substring(0,2).toUpperCase()}
                  </div>
                  ${i?`<span class="absolute -top-1 -right-1 text-base animate-bounce">${i}</span>`:""}
                </div>
                <div>
                  <h4 class="font-black text-slate-100 uppercase tracking-tight text-sm">${n.name}</h4>
                  <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest team-detail-btn cursor-pointer" data-team-id="${n.teamId}">View Stats</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-black text-slate-100 italic tracking-tighter leading-none">${n.fantasyPoints}</div>
                <div class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Fantasy Pts</div>
                <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${n.goals} Goals • ${n.matchesCount} Matches</div>
              </div>
            </div>
          `}).join("")}
        ${e.length===0?'<div class="text-center py-20 text-slate-700 italic uppercase tracking-[0.2em] font-black text-xs">No records detected</div>':""}
      </div>
    `;else{const n=e.slice(0,3),r=e.slice(3),i=[{label:"🥇",bg:"bg-yellow-500/10",border:"border-yellow-500/20",text:"text-yellow-500"},{label:"🥈",bg:"bg-slate-300/10",border:"border-slate-300/20",text:"text-slate-300"},{label:"🥉",bg:"bg-orange-500/10",border:"border-orange-500/20",text:"text-orange-500"}];s.innerHTML=`
      <div class="space-y-16 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${n.map((o,l)=>{const c=i[l];return`
              <div class="${c.bg} ${c.border} border rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                 <div class="absolute top-6 right-8 text-4xl">${c.label}</div>
                 <div class="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-slate-800 border border-slate-800">
                   ${o.name.substring(0,2).toUpperCase()}
                 </div>
                 <div class="space-y-2">
                   <h3 class="text-2xl font-black text-slate-100">${o.name}</h3>
                   <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-indigo-400 team-detail-btn" data-team-id="${o.teamId}">Team Profile</p>
                 </div>
                 <div class="grid grid-cols-2 w-full gap-4 pt-4 border-t border-slate-800/30">
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Fantasy Points</p>
                     <p class="text-3xl font-black ${c.text} font-mono">${o.fantasyPoints}</p>
                   </div>
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Goals / Matches</p>
                     <p class="text-xl font-black text-slate-100 font-mono">${o.goals} / ${o.matchesCount}</p>
                   </div>
                 </div>
              </div>
            `}).join("")}
          ${n.length===0?'<div class="md:col-span-3 text-center py-20 text-slate-700 italic">No goal records detected in the current deployment.</div>':""}
        </div>

        ${r.length>0?`
          <div class="bg-slate-900 rounded-[3rem] border border-slate-800 p-10 shadow-3xl">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
                  <th class="pb-6 pl-4">Rank</th>
                  <th class="pb-6">Team Name</th>
                  <th class="pb-6 text-center">Form Summary</th>
                  <th class="pb-6 text-right pr-6">Fantasy Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${r.map((o,l)=>`
                  <tr class="group">
                    <td class="py-6 pl-4 font-mono font-black text-slate-600">${l+4}</td>
                    <td class="py-6 font-black text-slate-200">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-700">${o.name.substring(0,2).toUpperCase()}</div>
                        ${o.name}
                      </div>
                    </td>
                    <td class="py-6 text-center font-mono text-slate-500">${o.goals} G / ${o.matchesCount} M</td>
                    <td class="py-6 text-right pr-6 font-black text-2xl text-indigo-400 font-mono tracking-tighter">${o.fantasyPoints}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `:""}
      </div>
    `}s.querySelectorAll(".team-detail-btn").forEach(n=>{n.addEventListener("click",()=>He(n.dataset.teamId))})}function Jv(s){const e=g.tournament.fixtures,n=e.filter(c=>c.status==="completed").slice(-3).reverse(),r=e.filter(c=>c.status==="upcoming").slice(0,3),i=g.tournament.type==="groups"&&g.tournament.currentStage==="groups"&&e.filter(c=>c.stage==="groups"&&c.status!=="completed").length===0,l=Tn()[0]||null;g.isMobile?s.innerHTML=`
      <div class="space-y-8 pb-32 animate-in fade-in duration-700">
        <!-- Hero Section -->
        <div class="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${F.trophy}</div>
          <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 italic">Tournament Active</p>
          <h3 class="text-white font-black text-2xl leading-none tracking-tighter uppercase mb-6">${g.tournament.name}</h3>
          <button data-view="fixtures" class="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
            ${F.league} Manage Schedule
          </button>
        </div>

        <!-- Mini Stats -->
        <div class="grid grid-cols-2 gap-4">
          ${zi("Matches",e.length,"text-indigo-400")}
          ${zi("Played",e.filter(c=>c.status==="completed").length,"text-emerald-400")}
          ${zi("Goals",e.reduce((c,d)=>c+(d.homeScore||0)+(d.awayScore||0),0),"text-slate-400")}
        </div>

        ${i?'<div class="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-lg font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white w-full py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}

        <!-- Recent Activity -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
            <button data-view="fixtures" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">View All</button>
          </div>
          <div class="space-y-3">
            ${n.length?n.map(c=>qi(c)).join(""):'<div class="p-10 border border-slate-800 rounded-[2rem] text-center text-slate-600 italic text-xs uppercase font-black">No recent matches</div>'}
          </div>
        </section>

        <!-- Top Scoring Team Snapshot -->
        ${l?`
          <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between" data-view="scorers">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-sm font-black text-indigo-400 border border-slate-800 shadow-inner overflow-hidden">
                 ${l.image?`<img src="${l.image}" class="w-full h-full object-cover">`:l.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h4 class="font-black text-slate-100 uppercase tracking-tight text-xs">Top Scorer</h4>
                <p class="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">${l.name}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black text-indigo-400 font-mono italic">${l.goals}</span>
              <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">GLS</span>
            </div>
          </div>
        `:""}



        <!-- Form Progression Chart (Top 5 Teams) -->
        <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl">
           <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Title Race Momentum</h3>
           <div class="h-48 w-full"><canvas id="formChartMobileDashboard"></canvas></div>
        </section>

        <!-- Simplified Standings Snapshot -->
        <section class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 overflow-hidden">
           <div class="flex items-center justify-between mb-6">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classification Snapshot</h3>
              <button data-view="standings" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Full List &rarr;</button>
           </div>
           ${ls(!0)}
        </section>

        <!-- Biggest Win Snapshot -->
        ${(()=>{const c=bs();if(!c)return"";const d=g.tournament.teams.find(f=>f.id===c.homeId),h=g.tournament.teams.find(f=>f.id===c.awayId);return!d||!h?"":`
            <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Record: Biggest Win</h3>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 flex items-center justify-end gap-2">
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${d.name}</p>
                  ${d.image?`<img src="${d.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                </div>
                <div class="px-5 py-2 bg-indigo-600 rounded-xl font-black font-mono text-white shadow-lg shadow-indigo-900/40 whitespace-nowrap">
                  ${c.homeScore} - ${c.awayScore}
                </div>
                <div class="flex-1 flex items-center gap-2">
                  ${h.image?`<img src="${h.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${h.name}</p>
                </div>
              </div>
            </div>
          `})()}
      </div>
    `:s.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          ${Zs("Matches",e.length,"text-indigo-400")}
          ${Zs("Played",e.filter(c=>c.status==="completed").length,"text-emerald-400")}
          ${Zs("Teams",g.tournament.teams.length,"text-slate-400")}
          ${Zs("Goals",e.reduce((c,d)=>c+(d.homeScore||0)+(d.awayScore||0),0),"text-yellow-400")}
        </div>
        
        <div class="lg:col-span-4 bg-indigo-600 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${F.trophy}</div>
          <h3 class="text-white font-black text-xl leading-tight">System Online</h3>
          <button data-view="fixtures" class="bg-white text-indigo-600 font-black py-4 rounded-2xl mt-6 uppercase text-[10px] tracking-widest relative z-10 hover:bg-slate-100 transition-colors">Manage Schedule</button>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-8 space-y-8">
          ${i?'<div class="bg-indigo-600/10 p-10 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-2xl font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Recent Activity</h3>
              <div class="space-y-4">${n.length?n.map(c=>qi(c)).join(""):'<p class="text-slate-600 italic">No matches detected.</p>'}</div>
            </section>
            
            <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Next Engagements</h3>
              <div class="space-y-4">${r.length?r.map(c=>qi(c)).join(""):'<p class="text-slate-600 italic">Season complete.</p>'}</div>
            </section>
          </div>
  
          <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800">
             <div class="flex items-center justify-between mb-8">
               <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Analytics</h3>
               <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-[9px] font-black text-slate-600 uppercase">Title Race Progression</span>
                  </div>
               </div>
             </div>
             <div class="h-64 w-full">
               <canvas id="formChartDesktopDashboard"></canvas>
             </div>
          </section>

          <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 overflow-visible">
             <div class="flex items-center justify-between mb-8">
                <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistical Rank</h3>
                <button data-view="standings" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Full Standings &rarr;</button>
             </div>
             ${ls(!0)}
          </section>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-4 space-y-8">
          ${l?`
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-3xl">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top Scorer</span>
                <span class="text-2xl">🥇</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-center text-2xl font-black text-indigo-400 shadow-inner overflow-hidden">
                  ${l.image?`<img src="${l.image}" class="w-full h-full object-cover">`:l.name.substring(0,2).toUpperCase()}
                </div>
                <div class="space-y-1">
                  <h4 class="text-2xl font-black text-slate-100 tracking-tighter uppercase">${l.name}</h4>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${l.matchesCount} Matches Played</p>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                  <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Scored</p>
                  <p class="text-4xl font-black text-indigo-400 font-mono italic">${l.goals}</p>
                </div>
              </div>
              <button data-view="scorers" class="w-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest">Full Stats Registry</button>
            </div>
          `:`
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-center space-y-4">
              <div class="text-slate-800 mx-auto">${F.boot}</div>
              <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest">Competitive data pending</p>
            </div>
          `}
  
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Records</h4>
            <div class="space-y-4">
              ${(()=>{const c=bs();if(!c)return'<p class="text-xs text-slate-600 italic">No records established.</p>';const d=g.tournament.teams.find(f=>f.id===c.homeId),h=g.tournament.teams.find(f=>f.id===c.awayId);return!d||!h?"":`
                  <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Biggest Margin of Victory</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        ${d.image?`<img src="${d.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${d.name}</span>
                      </div>
                      <span class="font-black font-mono text-indigo-400 mx-3">${c.homeScore} - ${c.awayScore}</span>
                      <div class="flex items-center justify-end gap-2 text-right">
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${h.name}</span>
                        ${h.image?`<img src="${h.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                      </div>
                    </div>
                  </div>
                `})()}
            </div>
          </div>
          

          
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming Discipline</h4>
            <div class="space-y-4">
              ${g.tournament.teams.slice(0,4).map(c=>`
                 <div class="flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 p-2 rounded-xl transition-all team-detail-btn" data-team-id="${c.id}">
                   <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600">${c.name.substring(0,2).toUpperCase()}</div>
                     <span class="font-bold text-slate-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-32">${c.name}</span>
                   </div>
                   <div class="text-xs font-black text-indigo-400/50 group-hover:text-indigo-400">DETAIL</div>
                 </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `,document.getElementById("adv-ko")&&document.getElementById("adv-ko").addEventListener("click",Zv),s.querySelectorAll("[data-view]").forEach(c=>c.addEventListener("click",()=>{g.view=c.dataset.view,j()})),s.querySelectorAll(".team-detail-btn").forEach(c=>{c.addEventListener("click",()=>He(c.dataset.teamId))}),setTimeout(()=>{try{if(typeof Chart>"u"){console.warn("[KickOff] Chart.js not loaded yet.");return}g.isMobile?qc("formChartMobileDashboard"):qc("formChartDesktopDashboard")}catch(c){console.error("[KickOff] Dashboard Charts Error:",c)}},100)}function qc(s){if(typeof Chart>"u")return;const e=document.getElementById(s);if(!e)return;const n=e.getContext("2d"),r=Be().slice(0,5),i=Array.from(new Set(g.tournament.fixtures.map(c=>c.round))).sort((c,d)=>c-d);Array.from(new Set(g.tournament.fixtures.filter(c=>c.status==="completed").map(c=>c.round))).sort((c,d)=>c-d);const o=r.map((c,d)=>{let h=0;const f=[0],m=g.tournament.fixtures.filter(v=>v.status==="completed"&&(v.homeId===c.id||v.awayId===c.id));i.forEach(v=>{const T=m.find(R=>R.round===v);if(T){const R=T.homeId===c.id;T.homeScore===T.awayScore?h+=1:(R&&T.homeScore>T.awayScore||!R&&T.awayScore>T.homeScore)&&(h+=3)}f.push(h)});const b=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899"];return{label:c.name,data:f,borderColor:b[d%b.length],backgroundColor:b[d%b.length]+"10",borderWidth:3,pointRadius:0,pointHoverRadius:4,tension:.4,fill:d===0}}),l=Chart.getChart(e);l&&l.destroy(),new Chart(n,{type:"line",data:{labels:["0",...i.map(c=>`${c}`)],datasets:o},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!g.isMobile,position:"bottom",labels:{color:"#475569",font:{size:9,weight:"700"},usePointStyle:!0,boxWidth:6}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:11,weight:"bold"}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}}}}})}function Zs(s,e,n){const i={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399","text-slate-400":"#94a3b8","text-yellow-400":"#facc15"}[n]||"#60a5fa";return`<div class="rounded-2xl p-6" style="background:#0f0f1a;border:1px solid #1e1e32"><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#475569">${s}</p><p class="text-3xl font-black font-mono" style="color:${i}">${e}</p></div>`}function zi(s,e,n){const i={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399"}[n]||"#60a5fa";return`<div class="p-5 rounded-2xl text-center" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)"><p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#475569">${s}</p><p class="text-2xl font-black font-mono leading-none" style="color:${i}">${e}</p></div>`}function qi(s){const e=g.tournament.teams.find(l=>l.id===s.homeId)||{name:"?"},n=g.tournament.teams.find(l=>l.id===s.awayId)||{name:"?"},r=s.status==="upcoming"?"VS":`${s.homeScore}–${s.awayScore}`,i=e.image?`<img src="${e.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"",o=n.image?`<img src="${n.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"";return`<div class="p-4 rounded-xl flex items-center justify-between transition-all" style="background:#0a0a12;border:1px solid #1e1e32">
    <div class="flex-1 flex items-center justify-end gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${e.id}">
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${e.name}</span>
      ${i}
    </div>
    <div class="mx-4 px-4 py-1.5 rounded-lg font-black font-mono text-sm" style="background:#0f0f1a;color:#60a5fa;border:1px solid #1e1e32">${r}</div>
    <div class="flex-1 flex items-center gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${n.id}">
      ${o}
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${n.name}</span>
    </div>
  </div>`}function Ch(s){const e=g.tournament.fixtures,n=g.tournament.type==="league"||g.tournament.type==="groups",r=Array.from(new Set(e.map(o=>o.round))).sort((o,l)=>o-l);g.isMobile?(r.includes(g.activeRound)||(g.activeRound=r[0]||1),s.innerHTML=`
      <div class="space-y-6">
        <div class="flex items-center justify-between no-print mb-2">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Management</h3>
          <button id="export-fixtures-btn" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Export PDF</button>
        </div>

        <!-- Horizontal Round Tabs -->
        <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth snap-x">
          ${r.map(o=>`
            <button data-round="${o}" class="flex-shrink-0 snap-start px-6 py-3 rounded-2xl border ${g.activeRound===o?"bg-indigo-600 border-indigo-500 text-white shadow-lg":"bg-slate-900 border-slate-800 text-slate-500"} transition-all active:scale-95">
              <span class="text-[10px] font-black uppercase tracking-widest">${n?"MW":"RD"} ${o}</span>
            </button>
          `).join("")}
        </div>

        <div id="fixtures-content" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${(()=>{const o=bs();return e.filter(l=>l.round===g.activeRound).map(l=>Hc(l,o&&o.id===l.id)).join("")})()}
           ${e.length===0?'<p class="text-center py-20 text-slate-700 italic">No fixtures generated yet.</p>':""}
        </div>
      </div>
    `,s.querySelectorAll("[data-round]").forEach(o=>o.addEventListener("click",()=>{g.activeRound=parseInt(o.dataset.round),Ch(s)}))):s.innerHTML=`
      <div class="flex justify-end mb-8 no-print">
        <button id="export-fixtures-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> Export Fixtures PDF
        </button>
      </div>
      <div id="fixtures-content" class="space-y-16">
        ${(()=>{const o=bs();return r.map(l=>`
            <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="flex items-center gap-4">
                 <div class="h-8 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                 <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">${g.tournament.type==="league"||g.tournament.type==="groups"&&g.tournament.currentStage==="groups"?"Matchweek":"Round"} ${l}</h5>
                 <div class="flex-1 h-px bg-slate-800/50"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${e.filter(c=>c.round===l).map(c=>Hc(c,o&&o.id===c.id)).join("")}
              </div>
            </div>
          `).join("")})()}
      </div>
    `;const i=s.querySelector("#export-fixtures-btn");i&&i.addEventListener("click",ox),s.querySelectorAll(".score-input").forEach(o=>o.addEventListener("change",l=>{Ph(l.target.closest("[data-match-id]").dataset.matchId,l.target.dataset.type,l.target.value)})),s.querySelectorAll(".status-toggle").forEach(o=>o.addEventListener("click",l=>Dh(l.currentTarget.closest("[data-match-id]").dataset.matchId)))}function Hc(s,e=!1){const n=g.tournament.teams.find(d=>d.id===s.homeId)||{name:"TBD"},r=g.tournament.teams.find(d=>d.id===s.awayId)||{name:"TBD"},i=s.status==="completed",o=g.tournament.archived,l=g.isMobile,c=e?"border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50":"border-slate-800 shadow-xl";return`
    <div data-match-id="${s.id}" class="${l?"bg-slate-900 rounded-[2.5rem] p-8":"bg-slate-900 rounded-[2rem] p-6"} border ${c} transition-all flex flex-col justify-between h-full group ${o?"grayscale-[0.5] opacity-90":""}">
       <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${i?"bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]":"bg-slate-700"}"></span>
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${s.status}</span>
            ${e?'<span class="text-[8px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 ml-2">Record Win</span>':""}
          </div>
          ${o?"":`
            <button class="status-toggle p-3 md:p-2 bg-slate-950 md:bg-transparent border border-slate-800 md:border-none rounded-xl text-slate-700 hover:text-indigo-400 transition-all active:scale-90">
              ${F.fixtures}
            </button>
          `}
       </div>
       <div class="${l?"space-y-6":"space-y-4"}">
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${l?"text-base":"text-sm"} truncate uppercase tracking-tighter">${n.name}</span>
            <input type="number" data-type="home" value="${s.homeScore??""}" placeholder="-" ${o?"disabled":""} class="score-input ${l?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${l?"text-base":"text-sm"} truncate uppercase tracking-tighter">${r.name}</span>
            <input type="number" data-type="away" value="${s.awayScore??""}" placeholder="-" ${o?"disabled":""} class="score-input ${l?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
       </div>
       
       <div class="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <input type="date" value="${s.date||""}" class="match-date-input bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none hover:text-indigo-400 transition-colors" ${o?"disabled":""}>
       </div>
    </div>
  `}function Ph(s,e,n,r=null){let i=g.tournament;r&&(i=g.tournaments.find(l=>l.name===r)||g.tournament);const o=i.fixtures.find(l=>l.id===s);o&&(o[`${e}Score`]=n===""?null:parseInt(n),le(!0))}function Dh(s,e=null){let n=g.tournament;e&&(n=g.tournaments.find(i=>i.name===e)||g.tournament);const r=n.fixtures.find(i=>i.id===s);if(!r||r.homeScore===null||r.awayScore===null){alert("Results must be entered before marking as complete.");return}if(r.status=r.status==="completed"?"upcoming":"completed",r.stage==="knockout"&&r.status==="completed"&&Xv(r),r.status==="completed"&&window.parent!==window){const i=n.teams.find(l=>l.id===r.homeId),o=n.teams.find(l=>l.id===r.awayId);window.parent.postMessage({type:"MATCH_COMPLETED",match:{p1Id:(i==null?void 0:i.playerId)||null,p1Score:r.homeScore,p2Id:(o==null?void 0:o.playerId)||null,p2Score:r.awayScore,tournament:n.name}},"*")}le(!0),r.status==="completed"&&rx(),j()}function Xv(s){const e=s.homeScore>s.awayScore?s.homeId:s.awayId,n=s.round+(g.tournament.legs||1),r=Math.floor(s.matchIndex/2),i=s.matchIndex%2===0?"homeId":"awayId",o=g.tournament.fixtures.find(l=>l.round===n&&l.matchIndex===r&&l.stage==="knockout");o&&(o[i]=e,le())}function Zv(){const s=[];g.tournament.groups.forEach((r,i)=>{const o=Be(r.id);s.push({groupId:i,rank:1,team:g.tournament.teams.find(l=>l.id===o[0].id)}),s.push({groupId:i,rank:2,team:g.tournament.teams.find(l=>l.id===o[1].id)})});const e=[];for(let r=0;r<s.length;r+=4)s[r]&&s[r+3]&&e.push(s[r].team,s[r+3].team),s[r+1]&&s[r+2]&&e.push(s[r+2].team,s[r+1].team);const n=jv(e,Math.max(...g.tournament.fixtures.map(r=>r.round))+1,g.tournament.legs||1);g.tournament.fixtures.push(...n),g.tournament.currentStage="knockout",g.view="bracket",le(),j()}function Mr(s){return g.tournament.fixtures.filter(n=>n.status==="completed"&&(n.homeId===s||n.awayId===s)).sort((n,r)=>n.round-r.round).slice(-5).map(n=>{const r=n.homeId===s,i=r?n.homeScore:n.awayScore,o=r?n.awayScore:n.homeScore;return i>o?"W":i<o?"L":"D"})}function Tn(){const s={},e=Be();return g.tournament.teams.forEach(n=>{const r=e.find(i=>i.id===n.id)||{w:0,d:0,cs:0};s[n.id]={name:n.name,teamId:n.id,teamName:n.name,image:n.image||null,goals:0,assists:0,matchesPlayed:new Set,fantasyPoints:r.w*5+r.d*2+r.cs*6}}),g.tournament.fixtures.forEach(n=>{n.status==="completed"&&(s[n.homeId]&&(s[n.homeId].goals+=n.homeScore||0,s[n.homeId].matchesPlayed.add(n.id),s[n.homeId].fantasyPoints+=(n.homeScore||0)*4),s[n.awayId]&&(s[n.awayId].goals+=n.awayScore||0,s[n.awayId].matchesPlayed.add(n.id),s[n.awayId].fantasyPoints+=(n.awayScore||0)*4))}),Object.values(s).map(n=>{const r=n.matchesPlayed.size;return{...n,matchesCount:r}}).sort((n,r)=>r.fantasyPoints-n.fantasyPoints||r.goals-n.goals)}function ls(s,e=null,n=999){let r=Be(e,n);const i=g.standingsFilter||"overall";i==="home"?r.sort((f,m)=>m.home.pts-f.home.pts||m.home.gf-m.home.ga-(f.home.gf-f.home.ga)||m.home.gf-f.home.gf):i==="away"?r.sort((f,m)=>m.away.pts-f.away.pts||m.away.gf-m.away.ga-(f.away.gf-f.away.ga)||m.away.gf-f.away.gf):i==="cleansheets"&&r.sort((f,m)=>m.cs-f.cs||f.ga-m.ga||m.pts-f.pts);const o=(g.tournament.type==="league"||g.tournament.type==="round_robin")&&e===null,l=g.tournament.promoSpots||0,c=g.tournament.relegationSpots||0,d=g.tournament.continentalSpots||0;if(g.isMobile)if(g.mobileStandingsMode==="compact"){let f=`
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Pos</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Team</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">P</th>
      `;return i==="cleansheets"?f+='<th class="p-4 font-black text-emerald-400 uppercase tracking-widest text-center">CS</th>':f+=`
          <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
          <th class="p-4 font-black text-indigo-400 uppercase tracking-widest text-center">Pts</th>
        `,`
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left font-mono text-[11px] border-separate border-spacing-0">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-800">
                  ${f}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${r.map((m,b)=>{const v=o&&b<d,T=o&&b>=r.length-c,R=o&&b>=d&&b<d+l;let P="text-slate-600";v?P="text-emerald-400":R?P="text-indigo-400":T&&(P="text-red-500/60");const L=i==="home"?m.home:i==="away"?m.away:m,M=L.gf-L.ga;return`
                    <tr class="active:bg-slate-800 transition-all team-detail-btn cursor-pointer" data-team-id="${m.id}">
                      <td class="p-4"><span class="font-black ${P}">${(b+1).toString().padStart(2,"0")}</span></td>
                      <td class="p-4 font-black text-slate-200 uppercase truncate max-w-[120px]">${m.name}</td>
                      <td class="p-4 text-center font-bold text-slate-400">${L.p}</td>
                      ${i==="cleansheets"?`
                        <td class="p-4 text-center font-black text-emerald-400 italic">${L.cs}</td>
                      `:`
                        <td class="p-4 text-center font-bold ${M>=0?"text-emerald-500/70":"text-red-500/70"}">${M>0?"+":""}${M}</td>
                        <td class="p-4 text-center font-black text-indigo-400 text-sm italic">${L.pts}</td>
                      `}
                    </tr>
                  `}).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `}else return`
        <div class="space-y-4">
          ${r.map((f,m)=>{const b=Mr(f.id),v=o&&m<d,T=o&&m>=r.length-c,R=o&&m>=d&&m<d+l;let P="border-slate-800";v?P="border-emerald-500/30 bg-emerald-500/5":R?P="border-indigo-500/30 bg-indigo-500/5":T&&(P="border-red-500/30 bg-red-500/5");const L=i==="home"?f.home:i==="away"?f.away:f;return`
              <div class="team-detail-btn bg-slate-900 border ${P} rounded-[2rem] p-6 flex items-center justify-between shadow-xl active:scale-95 transition-all" data-team-id="${f.id}">
                <div class="flex items-center gap-5">
                  <span class="text-3xl font-black text-slate-800 italic leading-none">${m+1}</span>
                  <div>
                    <h4 class="font-black text-slate-100 uppercase tracking-tight text-lg">${f.name}</h4>
                    <div class="flex gap-1.5 mt-2">
                      ${b.map(M=>`<span class="w-1.5 h-1.5 rounded-full ${M==="W"?"bg-emerald-500":M==="D"?"bg-slate-600":"bg-red-500"}"></span>`).join("")}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-black ${i==="cleansheets"?"text-emerald-400":"text-indigo-400"} leading-none italic tracking-tighter">${i==="cleansheets"?L.cs:L.pts}</div>
                  <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">${i==="cleansheets"?"Clean Sheets":"Classification Pts"}</div>
                </div>
              </div>
            `}).join("")}
        </div>
      `;let h="";return i==="cleansheets"?h=`
      <th class="pb-2 pl-4">Pos</th>
      <th class="pb-2">Squad Operative</th>
      <th class="pb-2 text-center">Played</th>
      <th class="pb-2 text-center">GA</th>
      <th class="pb-2 text-center text-emerald-400">Clean Sheets</th>
      <th class="pb-2 text-center">Ratio</th>
    `:h=`
      <th class="pb-2 pl-4">Pos</th>
      <th class="pb-2">Squad Operative</th>
      <th class="pb-2 text-center">P</th>
      <th class="pb-2 text-center">W</th>
      <th class="pb-2 text-center">D</th>
      <th class="pb-2 text-center">L</th>
      <th class="pb-2 text-center">GF</th>
      <th class="pb-2 text-center">GA</th>
      <th class="pb-2 text-center">GD</th>
      <th class="pb-2 text-center font-black text-indigo-400">Pts</th>
      <th class="pb-2 text-center">Form</th>
    `,`
    <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 ${s?"overflow-visible":"overflow-x-auto"} shadow-2xl relative">
      <table class="w-full text-left text-xs border-separate border-spacing-y-3 min-w-[800px] lg:min-w-0">
        <thead>
          <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
            ${h}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/20">
          ${r.map((f,m)=>{const b=o&&m<d,v=o&&m>=d&&m<d+l,T=o&&m>=r.length-c;let R="";b?R="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]":v?R="bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]":T&&(R="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]");const P=i==="home"?f.home:i==="away"?f.away:f,L=P.gf-P.ga,M=L>0?"+":"",q=L>0?"text-emerald-400":L<0?"text-red-400":"text-slate-600",B=Mr(f.id);let G="";if(i==="cleansheets"){const Z=P.p>0?(P.cs/P.p).toFixed(2):"0.00";G=`
                <td class="py-4 text-center font-mono text-slate-500">${P.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.ga}</td>
                <td class="py-4 text-center"><span class="font-black font-mono text-emerald-400 italic text-sm">${P.cs}</span></td>
                <td class="py-4 text-center text-slate-500 font-mono">${Z}</td>
              `}else G=`
                <td class="py-4 text-center font-mono text-slate-500 font-bold">${P.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.w}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.d}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.l}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.gf}</td>
                <td class="py-4 text-center font-mono text-slate-500">${P.ga}</td>
                <td class="py-4 text-center font-mono font-black ${q}">${M}${L}</td>
                <td class="py-4 text-center font-black text-slate-100 text-base tracking-tighter shadow-indigo-500/10">${P.pts}</td>
              `;return`<tr class="bg-slate-950/40 group relative transition-all cursor-default scale-100 hover:scale-[1.01]">
              <td class="py-4 pl-4 rounded-l-3xl relative overflow-hidden">
                ${R?`<div class="absolute inset-y-2 left-0 w-1.5 ${R} rounded-r-full"></div>`:""}
                <span class="font-mono font-black ${b?"text-emerald-400":v?"text-indigo-400":T?"text-red-500/60":"text-slate-600"}">
                    ${(m+1).toString().padStart(2,"0")}
                </span>
              </td>
              <td class="py-4 font-black text-slate-200 truncate max-w-[150px] transition-colors group-hover:text-white cursor-pointer hover:underline team-detail-btn" data-team-id="${f.id}">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600 group-hover:border-indigo-500/30">
                    ${f.name.substring(0,2).toUpperCase()}
                  </div>
                  ${f.name}
                </div>
              </td>
              ${G}
              <td class="py-4 pr-6 rounded-r-3xl">
                ${i==="overall"?`
                <div class="flex items-center justify-center gap-1">
                  ${B.map(Z=>`<span data-result="${Z}" class="w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-black ${Z==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":Z==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"} form-badge-print"><span class="form-badge-bg">${Z}</span></span>`).join("")}
                  ${B.length===0?'<span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">-</span>':""}
                </div>
                `:""}
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
  `}function ex(s,e,n){const r=document.createElement("div");r.className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200",r.innerHTML=`
    <div class="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-2xl p-6 relative">
      <h3 class="text-lg font-black text-slate-100 uppercase tracking-tighter mb-4">${s}</h3>
      <input type="text" id="edit-modal-input" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6" value="${e||""}" autocomplete="off">
      <div class="flex gap-3">
        <button id="edit-modal-cancel" class="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
        <button id="edit-modal-save" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30">Save Data</button>
      </div>
    </div>
  `,document.body.appendChild(r);const i=r.querySelector("#edit-modal-input");i.focus(),i.setSelectionRange(0,i.value.length);const o=()=>r.remove();r.querySelector("#edit-modal-cancel").addEventListener("click",o),r.querySelector("#edit-modal-save").addEventListener("click",()=>{n(i.value),o()}),i.addEventListener("keydown",l=>{l.key==="Enter"&&(n(i.value),o()),l.key==="Escape"&&o()})}function He(s){var f,m;const e=b=>{b.querySelectorAll(".global-score-input").forEach(v=>v.addEventListener("change",T=>{const R=T.target.closest("[data-match-id]");Ph(R.dataset.matchId,T.target.dataset.type,T.target.value,R.dataset.tournament)})),b.querySelectorAll(".global-status-toggle").forEach(v=>v.addEventListener("click",T=>{const R=T.target.closest("[data-match-id]");Dh(R.dataset.matchId,R.dataset.tournament),He(s)}))},n=g.tournament.teams.find(b=>b.id===parseInt(s));if(!n)return;const r=Be().find(b=>b.id===n.id)||{p:0,w:0,d:0,l:0,gd:0,home:{},away:{}},i=Mr(n.id),o=[];g.tournaments.forEach(b=>{const v=b.teams.find(T=>T.name===n.name||n.playerId&&T.playerId===n.playerId);v&&b.fixtures.filter(T=>T.status==="completed"&&(T.homeId===v.id||T.awayId===v.id)).forEach(T=>{o.push({...T,tournamentName:b.name,teamInMatch:v})})});const l=o.sort((b,v)=>new Date(v.date||0)-new Date(b.date||0));if(g.isMobile){const b=`
      <div class="p-6 space-y-10 selection:bg-indigo-500/30">
        <header class="flex items-center gap-4">
           <button id="mobile-team-back-btn" class="md:hidden text-slate-600 hover:text-indigo-400 transition-all text-2xl font-black shrink-0">&larr;</button>
           <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-400">
             ${n.name.substring(0,2).toUpperCase()}
           </div>
           <div>
             <div class="flex items-center gap-2">
               <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${n.name}</h3>
               <button class="edit-team-name-btn text-slate-500 hover:text-indigo-400 p-1 active:scale-95 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-1.5 mt-1">
               ${i.map(v=>`<span class="w-2 h-2 rounded-full ${v==="W"?"bg-emerald-500":v==="L"?"bg-red-500":"bg-slate-700"}"></span>`).join("")}
               <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Recent Form</span>
             </div>
           </div>
        </header>

        <div class="grid grid-cols-5 gap-2">
           ${on("P",r.p)}
           ${on("W",r.w)}
           ${on("D",r.d)}
           ${on("L",r.l)}
           ${on("FP",((f=Tn().find(v=>v.teamId===n.id))==null?void 0:f.fantasyPoints)||0)}
           ${on("GD",r.gd)}
        </div>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Home vs Away</h4>
           <div class="grid grid-cols-2 gap-4">
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Home</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${r.home.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${r.home.gf} GF</span>
               </div>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">Away</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${r.away.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${r.away.gf} GF</span>
               </div>
             </div>
           </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Form Evolution</h4>
           <div class="h-40 w-full mb-8"><canvas id="formChartMobile"></canvas></div>
        </section>

        <section class="space-y-6">
           <div class="flex items-center justify-between">
             <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Squad Roster</h4>
             ${g.isAdmin?'<button id="link-player-btn-mobile" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">Link Club Player</button>':""}
           </div>
           <div id="roster-container-mobile" class="space-y-3">
             ${n.playerId?(()=>{const v=g.dashboardPlayers.find(T=>T.id===n.playerId);return v?`
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src="${v.image}" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="text-xs font-black text-slate-200 uppercase">${v.name}</p>
                        <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest">#${v.number} • ${v.device}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-black text-indigo-400 font-mono">${v.ovr}</p>
                      <p class="text-[7px] font-black text-slate-600 uppercase tracking-tighter">Rating</p>
                    </div>
                 </div>
               `:'<p class="text-slate-700 italic text-center py-6 text-xs">Linked player not found in sync</p>'})():'<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No club player linked</p>'}
           </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Match History</h4>
           <div class="space-y-3">
               ${l.map(v=>{const T=v.homeId===v.teamInMatch.id,R=T?v.awayId:v.homeId,L=(g.tournaments.find(G=>G.name===v.tournamentName)||g.tournament).teams.find(G=>G.id===R)||{name:"Unknown"},M=T?v.homeScore>v.awayScore:v.awayScore>v.homeScore,q=v.homeScore===v.awayScore,B=v.status==="completed";return`
                   <div data-match-id="${v.id}" data-tournament="${v.tournamentName}" class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="flex flex-col items-center gap-1">
                           <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] ${M?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":q?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-500"}">
                             ${M?"W":q?"D":"L"}
                           </div>
                           ${g.isAdmin?`<button class="global-status-toggle p-1 text-slate-600 hover:text-indigo-400 transition-colors text-xs">${B?"✅":"⏳"}</button>`:""}
                        </div>
                        <div>
                          <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">${L.name}</div>
                          <div class="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${v.tournamentName}</div>
                        </div>
                      </div>
                      <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                        ${g.isAdmin?`
                          <input type="number" data-type="${T?"home":"away"}" value="${T?v.homeScore??"":v.awayScore??""}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-indigo-400 outline-none">
                          <span class="text-slate-700">-</span>
                          <input type="number" data-type="${T?"away":"home"}" value="${T?v.awayScore??"":v.homeScore??""}" class="global-score-input w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500 outline-none">
                        `:`
                          <span>${v.homeScore}</span>
                          <span class="text-slate-700">-</span>
                          <span>${v.awayScore}</span>
                        `}
                      </div>
                   </div>
                 `}).join("")}
             ${l.length===0?'<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No data recorded</p>':""}
           </div>
        </section>
      </div>
    `;xo(b,!0),setTimeout(()=>Kc(n.id,"formChartMobile"),100),e(document.getElementById("bottom-sheet-container"));return}const c=document.createElement("div");c.id="team-detail-modal",c.className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300",c.innerHTML=`
    <div class="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-slate-800 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-10 duration-500">
      <header class="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div class="flex items-center gap-8">
           <div class="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-indigo-400">
             ${n.name.substring(0,2).toUpperCase()}
           </div>
           <div class="space-y-2">
             <div class="flex items-center gap-3">
               <h3 class="text-4xl font-black text-slate-100 tracking-tighter">${n.name}</h3>
               <button class="edit-team-name-btn bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-xl transition-colors active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-4">
               <div class="flex gap-1">
                 ${i.map(b=>`<span class="w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-black ${b==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":b==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"}">${b}</span>`).join("")}
               </div>
               <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Recent Performance</span>
             </div>
           </div>
        </div>
        <button id="close-modal" class="p-4 bg-slate-950 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all">${F.reset}</button>
      </header>
      
      <div class="flex-1 overflow-auto p-10 space-y-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
           ${rn("Played",r.p)}
           ${rn("Wins",r.w)}
           ${rn("Draws",r.d)}
           ${rn("Losses",r.l)}
           ${rn("Fantasy Pts",((m=Tn().find(b=>b.teamId===n.id))==null?void 0:m.fantasyPoints)||0)}
           ${rn("GD",(r.gd>0?"+":"")+r.gd)}
        </div>

        <section class="space-y-8">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Performance: Home vs Away</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Home Base</span>
                <span class="text-xs font-black text-slate-600">${r.home.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${r.home.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${r.home.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${r.home.cs}</p></div>
              </div>
            </div>
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Away Frontier</span>
                <span class="text-xs font-black text-slate-600">${r.away.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${r.away.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${r.away.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${r.away.cs}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Form Evolution</h4>
           <div class="h-64 w-full mb-10"><canvas id="formChartDesktop"></canvas></div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Historical Archive</h4>
           <div class="space-y-3">
               ${l.map(b=>{const v=b.homeId===b.teamInMatch.id,R=(g.tournaments.find(B=>B.name===b.tournamentName)||g.tournament).teams.find(B=>B.id===(v?b.awayId:b.homeId))||{name:"Unknown"},P=v?b.homeScore>b.awayScore:b.awayScore>b.homeScore,L=b.homeScore===b.awayScore,M=P?"W":L?"D":"L",q=b.status==="completed";return`
                   <div data-match-id="${b.id}" data-tournament="${b.tournamentName}" class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                      <div class="flex items-center gap-6">
                        <div class="text-[10px] font-mono text-slate-700">${b.date||"TBD"}</div>
                        <div>
                          <div class="font-black text-slate-200">${R.name}</div>
                          <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">${b.tournamentName}</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-8">
                         <div class="font-black font-mono text-xl text-slate-100 flex items-center gap-3">
                           ${g.isAdmin?`
                             <input type="number" data-type="${v?"home":"away"}" value="${v?b.homeScore??"":b.awayScore??""}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none">
                             <span class="text-slate-700">-</span>
                             <input type="number" data-type="${v?"away":"home"}" value="${v?b.awayScore??"":b.homeScore??""}" class="global-score-input w-14 h-12 bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-slate-500 outline-none">
                           `:`
                             <span>${b.homeScore}</span>
                             <span class="text-slate-700">-</span>
                             <span>${b.awayScore}</span>
                           `}
                         </div>
                         <div class="flex flex-col items-center gap-1">
                            <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm ${P?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":L?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-500"}">
                              ${M}
                            </div>
                            ${g.isAdmin?`<button class="global-status-toggle text-[10px] hover:text-indigo-400 transition-colors uppercase font-black tracking-widest mt-1">${q?"Undo":"Complete"}</button>`:""}
                         </div>
                      </div>
                   </div>
                 `}).join("")}
             ${l.length===0?'<p class="text-slate-600 italic text-center py-10">No matches recorded for this deployment.</p>':""}
           </div>
        </section>
      </div>
    </div>
    </div>
  `,document.body.appendChild(c),c.addEventListener("click",b=>{b.target===c&&c.remove()}),document.getElementById("close-modal").addEventListener("click",()=>c.remove()),setTimeout(()=>Kc(n.id,g.isMobile?"formChartMobile":"formChartDesktop"),100),e(document.getElementById("team-detail-modal"));const d=g.isMobile?document.getElementById("bottom-sheet"):c;n.players||(n.players=[]);const h=b=>{var T,R,P,L;(T=b.querySelector(".edit-team-name-btn"))==null||T.addEventListener("click",()=>{const M=prompt("Enter new squad name:",n.name);M&&M.trim()&&(n.name=M.trim(),le(),j(),g.isMobile||c.remove(),He(s))}),(R=b.querySelector(".add-player-btn"))==null||R.remove(),(P=b.querySelector("#link-player-btn"))==null||P.addEventListener("click",()=>{Bc(M=>{n.playerId=M,le(),g.isMobile||c.remove(),He(s)})}),(L=b.querySelector("#link-player-btn-mobile"))==null||L.addEventListener("click",()=>{Bc(M=>{n.playerId=M,le(),He(s)})});const v=b.querySelector("#mobile-team-back-btn");v&&v.addEventListener("click",()=>{g.view="standings",j()}),b.querySelectorAll(".edit-player-btn").forEach(M=>{M.addEventListener("click",()=>{const q=parseInt(M.dataset.idx);ex("Edit player name:",n.players[q],B=>{B&&B.trim()&&(n.players[q]=B.trim(),le(),!g.isMobile&&c&&c.remove(),He(s))})})}),b.querySelectorAll(".del-player-btn").forEach(M=>{M.addEventListener("click",()=>{if(confirm("Remove this player?")){const q=parseInt(M.dataset.idx);n.players.splice(q,1),le(),g.isMobile||c.remove(),He(s)}})})};g.isMobile?setTimeout(()=>h(d),50):h(c)}function rn(s,e){return`<div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1"><p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${s}</p><p class="text-2xl font-black text-slate-100 font-mono">${e}</p></div>`}function on(s,e){return`<div class="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-center space-y-0.5"><p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">${s}</p><p class="text-sm font-black text-slate-100 font-mono leading-none">${e}</p></div>`}function Be(s=null,e=999){let n=g.tournament.teams;if(s!==null){const o=g.tournament.groups.find(l=>l.id===s)||g.tournament.groups[s];o&&o.teamIds&&(n=g.tournament.teams.filter(l=>o.teamIds.includes(l.id)))}const r=n.map(o=>({id:o.id,name:o.name,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0,home:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},away:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},cs:0})),i=g.tournament.fixtures;return i.filter(o=>o.status==="completed"&&o.round<=e&&(s===null||o.groupId===s)&&(o.stage==="groups"||o.stage==="league"||o.stage==="round_robin"||!o.stage)).forEach(o=>{const l=r.find(d=>d.id===o.homeId),c=r.find(d=>d.id===o.awayId);l&&c&&(l.p++,c.p++,l.gf+=o.homeScore,l.ga+=o.awayScore,c.gf+=o.awayScore,c.ga+=o.homeScore,l.home.p++,l.home.gf+=o.homeScore,l.home.ga+=o.awayScore,c.away.p++,c.away.gf+=o.awayScore,c.away.ga+=o.homeScore,o.awayScore===0&&(l.cs++,l.home.cs++),o.homeScore===0&&(c.cs++,c.away.cs++),o.homeScore>o.awayScore?(l.w++,l.pts+=3,c.l++,l.home.w++,l.home.pts+=3,c.away.l++):o.homeScore<o.awayScore?(c.w++,c.pts+=3,l.l++,c.away.w++,c.away.pts+=3,l.home.l++):(l.d++,c.d++,l.pts++,c.pts++,l.home.d++,l.home.pts++,c.away.d++,c.away.pts++))}),r.forEach(o=>o.gd=o.gf-o.ga),r.sort((o,l)=>{if(l.pts!==o.pts)return l.pts-o.pts;if(l.gd!==o.gd)return l.gd-o.gd;if(l.gf!==o.gf)return l.gf-o.gf;const c=i.filter(d=>d.status==="completed"&&(d.homeId===o.id&&d.awayId===l.id||d.homeId===l.id&&d.awayId===o.id));if(c.length>0){let d=0,h=0;if(c.forEach(f=>{f.homeId===o.id?f.homeScore>f.awayScore?d+=3:f.homeScore<f.awayScore?h+=3:(d++,h++):f.homeScore>f.awayScore?h+=3:f.homeScore<f.awayScore?d+=3:(h++,d++)}),h!==d)return h-d}return o.name.localeCompare(l.name)})}function tx(){const s=Be();if(s.length===0)return{bestAttack:null,bestDefence:null,biggestWin:null};const e=[...s].sort((i,o)=>o.gf-i.gf||i.p-o.p)[0],n=[...s].sort((i,o)=>i.ga-o.ga||i.p-o.p)[0],r=bs();return{bestAttack:e,bestDefence:n,biggestWin:r}}function bs(){const s=g.tournament.fixtures.filter(e=>e.status==="completed");return s.length===0?null:[...s].sort((e,n)=>{const r=Math.abs(e.homeScore-e.awayScore),i=Math.abs(n.homeScore-n.awayScore);return i!==r?i-r:n.homeScore+n.awayScore-(e.homeScore+e.awayScore)})[0]}function er(s,e){const n=g.tournament.fixtures.filter(h=>h.status==="completed"&&(h.homeId===s&&h.awayId===e||h.homeId===e&&h.awayId===s)).sort((h,f)=>new Date(f.date||0)-new Date(h.date||0));let r=0,i=0,o=0,l=0,c=0;const d=n.map(h=>{const f=h.homeId===s,m=f?h.homeScore:h.awayScore,b=f?h.awayScore:h.homeScore;l+=m,c+=b;let v="D";return m>b?(r++,v="W"):b>m?(i++,v="L"):o++,{...h,aScore:m,bScore:b,result:v}});return{aWins:r,bWins:i,draws:o,aGoals:l,bGoals:c,history:d}}function nx(s){var o,l;const e=g.tournament.teams;let n=(o=e[0])==null?void 0:o.id,r=(l=e[1])==null?void 0:l.id;const i=()=>{if(n===void 0||r===void 0)return;const c=er(n,r),d=e.find(m=>m.id===n),h=e.find(m=>m.id===r),f=document.getElementById("h2h-analysis");f.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-50"></div>
            <div class="relative z-10 flex items-center justify-between gap-8">
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${d.color||"#4f46e5"}">
                  ${d.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${d.name}</h3>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/40 font-black italic text-xl">VS</div>
              </div>
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${h.color||"#10b981"}">
                  ${h.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${h.name}</h3>
              </div>
            </div>

            <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 border-t border-slate-800/50">
               <div class="space-y-6">
                 <div class="grid grid-cols-3 gap-6">
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-emerald-400 font-mono">${c.aWins}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Draws</p>
                      <p class="text-3xl font-black text-slate-400 font-mono">${c.draws}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-indigo-400 font-mono">${c.bWins}</p>
                    </div>
                 </div>
                 <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 text-center">Conflict Outcome Distribution</p>
                    <div class="h-48 flex justify-center"><canvas id="h2hChart"></canvas></div>
                 </div>
               </div>
               <div class="space-y-6">
                  <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${d.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${c.aGoals}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${h.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${c.bGoals}</p>
                    </div>
                  </div>
                  <div class="p-6 bg-slate-950 rounded-2xl border border-slate-800 h-64">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Strategic Momentum Comparison</p>
                    <div class="h-48 w-full"><canvas id="h2hProgressionChart"></canvas></div>
                  </div>
               </div>
            </div>
          </div>

          <div class="space-y-6">
            <h4 class="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">Conflict Logs</h4>
            <div class="space-y-3">
              ${c.history.map(m=>`
                <div class="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-all">
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-500 font-mono">RD ${m.round}</span>
                    <span class="text-sm font-bold text-slate-300">${new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <p class="text-xs font-black text-slate-200">${d.name}</p>
                    </div>
                    <div class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-black font-mono text-indigo-400">
                      ${m.aScore} - ${m.bScore}
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-black text-slate-200">${h.name}</p>
                    </div>
                  </div>
                </div>
              `).join("")}
              ${c.history.length===0?'<div class="p-12 text-center text-slate-600 italic">No historical data between these squadrons.</div>':""}
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-6">
             <h3 class="text-lg font-black text-slate-100 tracking-tight">Aggregated Logistics</h3>
             <div class="space-y-4">
                <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                   <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Total Combined Goals</p>
                   <p class="text-2xl font-black text-indigo-400 font-mono">${c.aGoals+c.bGoals}</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${d.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${c.aGoals}</p>
                  </div>
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${h.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${c.bGoals}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    `};s.innerHTML=`
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl">
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Primary Squadron</label>
           <select id="team-a-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${e.map(c=>`<option value="${c.id}" ${c.id===n?"selected":""}>${c.name}</option>`).join("")}
           </select>
        </div>
        <div class="flex items-center justify-center p-4">
           <span class="text-2xl opacity-20">⚔️</span>
        </div>
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Secondary Squadron</label>
           <select id="team-b-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${e.map(c=>`<option value="${c.id}" ${c.id===r?"selected":""}>${c.name}</option>`).join("")}
           </select>
        </div>
      </div>

      <div id="h2h-analysis"></div>
    </div>
  `,document.getElementById("team-a-select").addEventListener("change",c=>{n=parseInt(c.target.value),i(),setTimeout(()=>{Hi(er(n,r)),Gi(n,r)},100)}),document.getElementById("team-b-select").addEventListener("change",c=>{r=parseInt(c.target.value),i(),setTimeout(()=>{Hi(er(n,r)),Gi(n,r)},100)}),i(),setTimeout(()=>{Hi(er(n,r)),Gi(n,r)},100)}function sx(s){g.isMobile?s.innerHTML=`
      <div class="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tight">Factions</h3>
            <p class="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Technical Logs Active</p>
          </div>
          <button id="h2h-view-btn" class="bg-indigo-600 active:scale-95 text-white font-black p-4 rounded-2xl transition-all shadow-lg flex items-center justify-center">
            ⚔️
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          ${g.tournament.teams.map(e=>`
            <div class="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col items-center text-center group active:scale-95 transition-all cursor-pointer relative overflow-hidden team-detail-btn" data-team-id="${e.id}">
              <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl mb-4 flex items-center justify-center relative shadow-inner overflow-hidden">
                 <div class="w-full h-full" style="background-color: ${e.color||"#4f46e5"}"></div>
                 <span class="absolute text-lg font-black text-white/20">${e.name.substring(0,2).toUpperCase()}</span>
              </div>
              <h4 class="text-[10px] font-black text-slate-100 uppercase tracking-widest break-all line-clamp-1">${e.name}</h4>
            </div>
          `).join("")}
        </div>
      </div>
    `:s.innerHTML=`
      <div class="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="flex items-center justify-between">
           <div class="space-y-1">
             <h3 class="text-4xl font-black text-slate-100 uppercase tracking-tighter">Faction Registry</h3>
             <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Historical and technical logs for all squads</p>
           </div>
           <button id="h2h-view-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-5 rounded-3xl transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3 group">
             <span class="group-hover:rotate-12 transition-transform">⚔️</span>
             <span class="text-xs uppercase tracking-[0.2em]">Head to Head Analysis</span>
           </button>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          ${g.tournament.teams.map(e=>`
            <div class="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden team-detail-btn" data-team-id="${e.id}">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2rem] mb-6 flex items-center justify-center relative shadow-inner overflow-hidden">
                 <div class="w-full h-full" style="background-color: ${e.color||"#4f46e5"}"></div>
                 <span class="absolute text-2xl font-black text-white/20">${e.name.substring(0,2).toUpperCase()}</span>
              </div>
              <h4 class="text-xl font-black text-slate-100 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">${e.name}</h4>
            </div>
          `).join("")}
        </div>
      </div>
    `,document.getElementById("h2h-view-btn").addEventListener("click",()=>{g.view="h2h",j()}),s.querySelectorAll(".team-detail-btn").forEach(e=>{e.addEventListener("click",()=>He(e.dataset.teamId))})}function Vh(s="#4f46e5"){const n=Date.now()+4e3,r={startVelocity:30,spread:360,ticks:60,zIndex:1e4},i=(l,c)=>Math.random()*(c-l)+l,o=setInterval(function(){const l=n-Date.now();if(l<=0)return clearInterval(o);const c=50*(l/4e3);confetti({...r,particleCount:c,origin:{x:i(.1,.3),y:Math.random()-.2},colors:[s,"#ffffff","#fbbf24"]}),confetti({...r,particleCount:c,origin:{x:i(.7,.9),y:Math.random()-.2},colors:[s,"#ffffff","#fbbf24"]})},250)}function rx(){const s=g.tournament.fixtures.filter(n=>n.status==="completed").length,e=g.tournament.fixtures.length;s===e&&e>0&&g.tournament.status!=="completed"&&(g.tournament.status="completed",le(),g.view="champion",j(),setTimeout(()=>{var n;return Vh((n=g.tournament.teams[0])==null?void 0:n.color)},500))}function Mh(s){const e=g.tournament.fixtures.filter(r=>r.stage==="knockout");if(!e.length){s.innerHTML='<div class="h-96 flex flex-col items-center justify-center text-slate-600 italic font-black uppercase tracking-widest gap-4"><span class="text-4xl opacity-20">📂</span>Knockout phase has not started yet.</div>';return}const n=Array.from(new Set(e.map(r=>r.round))).sort((r,i)=>r-i);g.isMobile?(s.innerHTML=`
      <div class="space-y-8 animate-in fade-in duration-500 pb-20">
        <div class="flex overflow-x-auto gap-3 no-scrollbar px-2 snap-x">
          ${n.map(r=>`
            <button class="round-tab shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all snap-center ${g.activeRound===r?"bg-indigo-600 text-white shadow-lg shadow-indigo-900/40":"bg-slate-900 text-slate-500 border border-slate-800"}" data-round="${r}">
              Round ${r}
            </button>
          `).join("")}
        </div>

        <div id="bracket-matches" class="space-y-6">
           ${e.filter(r=>r.round===g.activeRound&&(r.leg===1||!r.leg)).map(r=>Gc(r)).join("")}
        </div>
      </div>
    `,s.querySelectorAll(".round-tab").forEach(r=>{r.addEventListener("click",()=>{g.activeRound=parseInt(r.dataset.round),Mh(s)})})):s.innerHTML=`<div class="flex gap-20 overflow-x-auto pb-10 no-scrollbar select-none">${n.map(r=>`<div class="flex flex-col justify-around gap-12 min-w-[280px]">
      <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Round ${r}</h5>
      ${e.filter(i=>i.round===r&&(i.leg===1||!i.leg)).map(i=>Gc(i)).join("")}
    </div>`).join("")}</div>`}function Gc(s){const e=g.tournament.teams.find(r=>r.id===s.homeId)||{name:"?"},n=g.tournament.teams.find(r=>r.id===s.awayId)||{name:"?"};return g.isMobile?`
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl flex flex-col gap-4 active:scale-[0.98] transition-all">
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${e.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${e.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${s.homeScore??"-"}</span>
         </div>
         <div class="h-px bg-slate-800/30"></div>
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${n.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${n.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${s.awayScore??"-"}</span>
         </div>
      </div>
    `:`<div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${e.name}</span><span class="font-mono text-xs font-black text-indigo-400">${s.homeScore??"-"}</span></div><div class="h-px bg-slate-800/50"></div><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${n.name}</span><span class="font-mono text-xs font-black text-indigo-400">${s.awayScore??"-"}</span></div></div>`}async function ix(){const s=document.getElementById("standings-content");if(!s)return;const e=document.createElement("div");e.className="bg-slate-950 p-12 text-slate-100 font-sans",e.style.width="1200px",e.innerHTML=`
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter">${g.tournament.name}</h1>
      <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">League Standings</p>
    </div>
    ${s.innerHTML}
    <div class="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
      Exported on ${new Date().toLocaleDateString()} • Tournament Management Engine
    </div>
  `,document.body.appendChild(e);try{const n=await html2canvas(e,{backgroundColor:"#020617",scale:2,useCORS:!0,logging:!1}),r=document.createElement("a");r.download=`${g.tournament.name.replace(/\s+/g,"_")}_Standings.png`,r.href=n.toDataURL("image/png"),r.click()}catch(n){console.error("Snapshot failed:",n)}finally{document.body.removeChild(e)}}async function Wc(){const{jsPDF:s}=window.jspdf,e=new s,n=g.tournament.name.replace(/\s+/g,"_");e.setFontSize(22),e.setTextColor(30,41,59),e.text(g.tournament.name,14,20),e.setFontSize(10),e.setTextColor(100,116,139);const r=g.tournament.type.charAt(0).toUpperCase()+g.tournament.type.slice(1);e.text(`${r} Status Report`,14,28);const o=Be().map((d,h)=>{const f=Mr(d.id).join(" "),m=d.gd>0?"+":"";return[h+1,d.name,d.p,d.w,d.d,d.l,d.gf,d.ga,`${m}${d.gd}`,d.pts,f]});e.autoTable({head:[["Pos","Team","MP","W","D","L","GF","GA","GD","Pts","Form"]],body:o,startY:35,theme:"striped",headStyles:{fillColor:[79,70,229],textColor:[255,255,255],fontStyle:"bold"},styles:{fontSize:8,cellPadding:2},columnStyles:{0:{halign:"center"},1:{fontStyle:"bold"},2:{halign:"center"},3:{halign:"center"},4:{halign:"center"},5:{halign:"center"},6:{halign:"center"},7:{halign:"center"},8:{halign:"center"},9:{halign:"center",fontStyle:"bold"},10:{halign:"center"}}});const l=Tn();if(l.length>0){const d=e.lastAutoTable.finalY+15;e.setFontSize(14),e.setTextColor(30,41,59),e.text("Top Scorer Registry",14,d);const h=l.slice(0,10).map((f,m)=>[m+1,f.name,f.teamName,f.matchesCount,f.assists,f.goals]);e.autoTable({head:[["Rank","Player","Squad","MP","Assists","Goals"]],body:h,startY:d+5,theme:"grid",headStyles:{fillColor:[15,23,42],textColor:[255,255,255]},styles:{fontSize:8}})}const c=e.internal.getNumberOfPages();for(let d=1;d<=c;d++)e.setPage(d),e.setFontSize(8),e.setTextColor(148,163,184),e.text(`Generated on ${new Date().toLocaleString()} • KickOff Tournament Manager`,14,e.internal.pageSize.height-10);e.save(`${n}_Standings.pdf`)}async function ox(){const{jsPDF:s}=window.jspdf,e=new s,n=g.tournament.name.replace(/\s+/g,"_"),r=g.tournament.fixtures,i=[5,5,8],o=[15,15,26],l=[59,130,246],c=[124,58,237],d=[241,245,249],h=[148,163,184],f=[30,30,50],m=()=>{e.setFillColor(...i),e.rect(0,0,e.internal.pageSize.width,e.internal.pageSize.height,"F")};m(),e.setFillColor(...o),e.rect(0,0,e.internal.pageSize.width,40,"F"),e.setFillColor(...l),e.rect(0,40,e.internal.pageSize.width/2,2,"F"),e.setFillColor(...c),e.rect(e.internal.pageSize.width/2,40,e.internal.pageSize.width/2,2,"F"),e.setTextColor(...d),e.setFontSize(26),e.setFont("helvetica","bold"),e.text(g.tournament.name.toUpperCase(),14,25),e.setTextColor(...l),e.setFontSize(11),e.setFont("helvetica","bold"),e.text("OFFICIAL FIXTURE SCHEDULE",14,34);const b=Array.from(new Set(r.map(R=>R.round))).sort((R,P)=>R-P);let v=55;b.forEach(R=>{const L=r.filter(B=>B.round===R).map(B=>{const G=g.tournament.teams.find(x=>x.id===B.homeId)||{name:"?"},Z=g.tournament.teams.find(x=>x.id===B.awayId)||{name:"?"},E=B.status==="completed"?`${B.homeScore} - ${B.awayScore}`:"vs";return[B.date?new Date(B.date).toLocaleDateString():"TBD",G.name.toUpperCase(),E,Z.name.toUpperCase(),B.status==="completed"?"FT":B.status==="live"?"LIVE":""]}),q=g.tournament.type==="league"||g.tournament.type==="round_robin"?`MATCHWEEK ${R}`:`ROUND ${R}`;v>260&&(e.addPage(),m(),v=20),e.setFillColor(...o),e.roundedRect(14,v,e.internal.pageSize.width-28,12,2,2,"F"),e.setTextColor(...d),e.setFontSize(11),e.setFont("helvetica","bold"),e.text(q,20,v+8),e.autoTable({body:L,startY:v+14,theme:"grid",styles:{fillColor:i,textColor:d,lineColor:f,lineWidth:.1,fontSize:10,cellPadding:5,font:"helvetica"},alternateRowStyles:{fillColor:[10,10,16]},columnStyles:{0:{halign:"center",textColor:h,cellWidth:35,fontStyle:"bold"},1:{halign:"right",fontStyle:"bold",cellWidth:55,textColor:d},2:{halign:"center",fontStyle:"bold",cellWidth:20,textColor:l},3:{halign:"left",fontStyle:"bold",cellWidth:55,textColor:d},4:{halign:"center",textColor:c,fontStyle:"bold"}},didDrawPage:function(B){B.pageNumber>1&&B.cursor.y===B.settings.margin.top&&m()}}),v=e.lastAutoTable.finalY+15});const T=e.internal.getNumberOfPages();for(let R=1;R<=T;R++){e.setPage(R),e.setTextColor(...h),e.setFontSize(8),e.setFont("helvetica","normal");const P=`Generated by Quantum Vortex Engine • ${new Date().toLocaleDateString()} • Page ${R} of ${T}`;e.text(P,e.internal.pageSize.width/2,e.internal.pageSize.height-10,{align:"center"})}e.save(`${n}_Fixtures.pdf`)}function ax(s){const n=Be()[0],r=(n==null?void 0:n.color)||"#fbbf24";s.innerHTML=`
    <div class="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-1000">
      <div class="max-w-4xl w-full text-center space-y-12">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
          <div class="relative p-12 bg-slate-900 border-4 border-indigo-500/30 rounded-[4rem] shadow-2xl">
            <div class="text-9xl mb-8 animate-bounce">${F.trophy}</div>
            <h1 class="text-2xl font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">CHAMPION</h1>
            <h2 class="text-7xl font-black text-white uppercase tracking-tighter shadow-indigo-500/20" style="color: ${r}">${n?n.name:"Unknown"}</h2>
          </div>
        </div>

        <div class="space-y-6">
           <h3 class="text-xl font-bold text-slate-400 capitalize">${g.tournament.name}</h3>
            <div class="flex items-center justify-center gap-6">
              <button id="view-standings-final" class="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl border border-slate-800 transition-all uppercase text-[10px] tracking-widest">Full Standings</button>
              <button id="summary-report-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase text-[10px] tracking-widest">Tournament Summary</button>
              <button id="next-season-champion" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase text-[10px] tracking-widest">Start Season ${(g.tournament.season||1)+1}</button>
              <button id="celebrate-btn" class="bg-slate-950 text-slate-400 px-6 py-4 rounded-xl font-bold border border-slate-800 uppercase text-[10px] tracking-[0.2em]">Celebrate Again 🎉</button>
            </div>
        </div>

        <button id="close-champion" class="text-slate-600 hover:text-slate-100 font-bold uppercase text-[9px] tracking-widest transition-colors mt-20">Skip Recognition Screen &rarr;</button>
      </div>
    </div>
  `,document.getElementById("view-standings-final").addEventListener("click",()=>{g.view="standings",j()}),document.getElementById("summary-report-btn").addEventListener("click",()=>{g.view="summary",j()}),document.getElementById("celebrate-btn").addEventListener("click",()=>Vh(r)),document.getElementById("close-champion").addEventListener("click",()=>{g.view="dashboard",j()});const i=document.getElementById("next-season-champion");i&&i.addEventListener("click",()=>pa(g.tournament.id))}function pa(s){const e=g.tournaments.find(i=>i.id===s);if(!e)return;const n=e.teams.map(i=>({...i,players:[...i.players||[]]})),r={...e,id:`t-${Date.now()}`,season:(e.season||1)+1,leagueId:e.leagueId||e.id,teams:n,fixtures:[],groups:[],status:"setup_teams",currentStage:e.type==="groups"?"groups":null,createdAt:new Date().toISOString()};g.tournaments.push(r),g.tournament=r,g.onboarding.step=0,g.view="dashboard",le(),j()}function lx(s){var b,v,T,R;const e=Be(),n=e[0],r=e[1],i=e[2],o=tx(),c=Tn()[0],d=g.tournament.fixtures,h=d.reduce((P,L)=>P+(L.homeScore||0)+(L.awayScore||0),0),f=(h/d.length||0).toFixed(1);s.innerHTML=`
    <div class="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-12">
        <div class="space-y-4">
          <h1 class="text-5xl font-black text-slate-100 uppercase tracking-tighter">Mission Summary</h1>
          <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">${g.tournament.name} • Final Logistics Report</p>
        </div>
        <button id="export-summary-pdf" class="bg-slate-900 border border-slate-800 text-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:border-indigo-500/50 transition-all flex items-center gap-3">
          ${F.certificate} Export Official Report (PDF)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
             <div class="absolute top-0 right-0 p-8 text-indigo-500/10 scale-150 transform rotate-12">${F.trophy}</div>
             <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Podium Recognition</h4>
             <div class="space-y-8 relative z-10">
                <div class="flex items-end gap-6 h-64">
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[70%]">
                         <span class="text-3xl">🥈</span>
                         <span class="text-xs font-black text-slate-400 uppercase text-center">${(r==null?void 0:r.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-10 rounded-b-xl flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">Runner Up</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-indigo-600/10 rounded-t-3xl border-t border-x border-indigo-500/30 flex flex-col items-center justify-center p-6 space-y-4 h-full relative">
                         <div class="absolute -top-4 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl">1</div>
                         <span class="text-5xl animate-bounce">🏆</span>
                         <span class="text-lg font-black text-white uppercase text-center">${(n==null?void 0:n.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-indigo-600 h-14 rounded-b-xl flex items-center justify-center text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-900/40">Champion</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[50%]">
                         <span class="text-2xl">🥉</span>
                         <span class="text-[10px] font-black text-slate-500 uppercase text-center">${(i==null?void 0:i.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-8 rounded-b-lg flex items-center justify-center text-[9px] font-black text-slate-600 uppercase">3rd Place</div>
                   </div>
                </div>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-8">
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Logged</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${h}</h5>
                <p class="text-[10px] font-bold text-indigo-400 italic font-mono">${f} Per Engagement</p>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Match Count</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${d.length}</h5>
                <p class="text-[10px] font-bold text-slate-500 italic font-mono">100% Success Rate</p>
             </div>
           </div>
        </div>

        <div class="space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8">
              <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Special Awards</h4>
              <div class="space-y-8">
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl">${F.boot}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Golden Boot</p>
                       <p class="font-black text-slate-100 capitalize">${(c==null?void 0:c.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-amber-500 font-mono uppercase tracking-widest">${(c==null?void 0:c.goals)||0} Goals</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-red-400/10 text-red-500 rounded-2xl">${F.sword}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Attack</p>
                       <p class="font-black text-slate-100 capitalize">${((b=o.bestAttack)==null?void 0:b.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-red-400 font-mono uppercase tracking-widest">${((v=o.bestAttack)==null?void 0:v.gf)||0} Goals Scored</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-blue-400/10 text-blue-500 rounded-2xl">${F.shield}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Defence</p>
                       <p class="font-black text-slate-100 capitalize">${((T=o.bestDefence)==null?void 0:T.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-blue-400 font-mono uppercase tracking-widest">${((R=o.bestDefence)==null?void 0:R.ga)||0} Conceded</p>
                    </div>
                 </div>
              </div>
           </div>
           <button id="view-manual-awards" class="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-100 py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all">Select Bonus Awards &rarr;</button>
        </div>
      </div>
      <div class="pt-20 text-center">
         <button id="next-season-summary" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-emerald-900/40 uppercase tracking-widest text-sm">Deploy Season ${(g.tournament.season||1)+1} &rarr;</button>
      </div>
    </div>
  `,document.getElementById("export-summary-pdf").addEventListener("click",ux),document.getElementById("view-manual-awards").addEventListener("click",()=>{g.view="awards",j()});const m=document.getElementById("next-season-summary");m&&m.addEventListener("click",()=>pa(g.tournament.id))}function cx(s){const e=g.tournament.leagueId||g.tournament.id,n=g.tournaments.filter(r=>r.leagueId===e||r.id===e).sort((r,i)=>(r.season||1)-(i.season||1));s.innerHTML=`
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-10">
        <div>
          <h2 class="text-4xl font-black text-slate-100 uppercase tracking-tighter">Hall of Immortals</h2>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Chronological Registry of League Dominance</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Total Seasons</span>
              <span class="text-xl font-black text-indigo-400 font-mono">${n.length}</span>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        ${n.map(r=>{const i=g.tournament;g.tournament=r;const o=Be(),l=o[0],c=o[1],d=r.fixtures.filter(m=>m.status==="completed").length,h=r.fixtures.length,f=i.id===r.id;return g.tournament=i,`
            <div class="bg-slate-900 border ${f?"border-indigo-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]":"border-slate-800"} rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-slate-900/80">
               <div class="flex items-center gap-8 flex-1">
                   <div class="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center border border-slate-800 p-2 text-center">
                     <span class="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Season</span>
                     <span class="text-[10px] font-black text-slate-100 font-mono leading-tight">${r.season||Rh(new Date(r.createdAt)).name}</span>
                  </div>
                  <div>
                     <h3 class="text-xl font-black text-slate-100 uppercase tracking-tight mb-2">${r.name}</h3>
                     <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">${r.type.replace("_"," ")}</span>
                        <span class="text-slate-800 text-xs">•</span>
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${d}/${h} Matches Played</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-12">
                  <div class="text-center">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Champion</p>
                     <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">${l?"🏆":"---"}</span>
                        <span class="font-black text-white uppercase text-xs tracking-tight truncate max-w-[120px]">${(l==null?void 0:l.name)||"In Progress"}</span>
                     </div>
                  </div>
                  <div class="text-center opacity-60">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Runner Up</p>
                     <div class="flex flex-col items-center">
                        <span class="text-xl mb-1">${c?"🥈":"---"}</span>
                        <span class="font-bold text-slate-400 uppercase text-[10px] tracking-tight truncate max-w-[120px]">${(c==null?void 0:c.name)||"---"}</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-3">
                  <button data-goto="${r.id}" class="px-6 py-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-100 uppercase tracking-widest transition-all">
                     Inspect Registry
                  </button>
                  ${f?`
                    <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active</div>
                  `:""}
               </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,s.querySelectorAll("[data-goto]").forEach(r=>{r.addEventListener("click",()=>{const i=r.dataset.goto;g.tournament=g.tournaments.find(o=>o.id===i),g.view="dashboard",j()})})}function dx(s){g.tournament.manualAwards=g.tournament.manualAwards||{},s.innerHTML=`
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div class="text-center space-y-4">
         <h2 class="text-5xl font-black text-white uppercase tracking-tighter">Honorable Recognition</h2>
         <p class="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Select and honor the top operatives and teams manually</p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${tr("Team of Tournament","player-ot")}
          ${tr("Fair Play Award","fair-play")}
          ${tr("Best Manager","best-manager")}
          ${tr("Goal of the Mission","goal-om")}
       </div>

       <div class="pt-20 text-center">
         <button id="back-to-summary" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Consolidate Summary Registry</button>
       </div>
    </div>
  `,s.querySelectorAll(".award-input").forEach(e=>{e.addEventListener("input",n=>{g.tournament.manualAwards[n.target.dataset.key]=n.target.value,le()})}),document.getElementById("back-to-summary").addEventListener("click",()=>{g.view="summary",j()})}function tr(s,e){return`
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
       <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${s}</h4>
       <input type="text" placeholder="Team Name..." class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all award-input" data-key="${e}" value="${g.tournament.manualAwards[e]||""}">
    </div>
  `}function ux(){const{jsPDF:s}=window.jspdf,e=new s;e.setFontSize(28),e.text("OFFICIAL TOURNAMENT SUMMARY",14,25),e.setFontSize(14),e.text(g.tournament.name,14,35);const r=Be().map((i,o)=>[o+1,i.name,i.p,i.w,i.d,i.l,i.gf,i.ga,i.pts]);e.autoTable({startY:50,head:[["Pos","Squad","MP","W","D","L","GF","GA","Pts"]],body:r,theme:"grid"}),e.save(`${g.tournament.name}_Final_Report.pdf`)}try{console.log("[KickOff] Script execution reaching bottom. Triggering initial render."),document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{console.log("[KickOff] DOMContentLoaded triggered."),j()}):j()}catch(s){alert("CRITICAL STARTUP ERROR: "+s.message),console.error(s)}function Hi(s){if(typeof Chart>"u")return;const e=document.getElementById("h2hChart");if(!e)return;const n=e.getContext("2d"),r=Chart.getChart(e);r&&r.destroy(),new Chart(n,{type:"doughnut",data:{labels:["Squad A Wins","Stalemate","Squad B Wins"],datasets:[{data:[s.aWins,s.draws,s.bWins],backgroundColor:["#10b981","#475569","#6366f1"],hoverBackgroundColor:["#34d399","#64748b","#818cf8"],borderWidth:0,hoverOffset:15,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:12,weight:"bold"}}}}})}function Gi(s,e){if(typeof Chart>"u")return;const n=document.getElementById("h2hProgressionChart");if(!n)return;const r=n.getContext("2d"),i=g.tournament.teams.find(h=>h.id===s),o=g.tournament.teams.find(h=>h.id===e),l=Array.from(new Set(g.tournament.fixtures.map(h=>h.round))).sort((h,f)=>h-f),c=h=>{let f=0;const m=[0],b=g.tournament.fixtures.filter(v=>v.status==="completed"&&(v.homeId===h||v.awayId===h));return l.forEach(v=>{const T=b.find(R=>R.round===v);if(T){const R=T.homeId===h;T.homeScore===T.awayScore?f+=1:(R&&T.homeScore>T.awayScore||!R&&T.awayScore>T.homeScore)&&(f+=3)}m.push(f)}),m},d=Chart.getChart(n);d&&d.destroy(),new Chart(r,{type:"line",data:{labels:["0",...l.map(h=>`${h}`)],datasets:[{label:i.name,data:c(s),borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:3,tension:.4,pointRadius:2},{label:o.name,data:c(e),borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",borderWidth:3,tension:.4,pointRadius:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:"#475569",font:{size:9,weight:"bold"},usePointStyle:!0}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)"},ticks:{color:"#475569",font:{size:9}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9}}}}}})}function Kc(s,e){if(typeof Chart>"u")return;const n=document.getElementById(e);if(!n)return;const r=n.getContext("2d"),i=g.tournament.fixtures.filter(d=>d.status==="completed"&&(d.homeId===s||d.awayId===s)),o=Array.from(new Set(g.tournament.fixtures.map(d=>d.round))).sort((d,h)=>d-h);let l=0;const c=[0];o.forEach(d=>{const h=i.find(f=>f.round===d);if(h){const f=h.homeId===s;h.homeScore===h.awayScore?l+=1:(f&&h.homeScore>h.awayScore||!f&&h.awayScore>h.homeScore)&&(l+=3)}c.push(l)}),new Chart(r,{type:"line",data:{labels:["Start",...o.map(d=>`RD ${d}`)],datasets:[{label:"Points",data:c,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",fill:!0,tension:.4,borderWidth:3,pointBackgroundColor:"#6366f1",pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#475569"}},x:{grid:{display:!1},ticks:{color:"#475569"}}}}})}
