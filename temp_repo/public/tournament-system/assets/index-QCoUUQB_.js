(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const xp=()=>{};var El={};/**
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
 */const rd=function(s){const e=[];let n=0;for(let r=0;r<s.length;r++){let i=s.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<s.length&&(s.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(s.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},wp=function(s){const e=[];let n=0,r=0;for(;n<s.length;){const i=s[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const o=s[n++];e[r++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){const o=s[n++],l=s[n++],c=s[n++],d=((i&7)<<18|(o&63)<<12|(l&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(d>>10)),e[r++]=String.fromCharCode(56320+(d&1023))}else{const o=s[n++],l=s[n++];e[r++]=String.fromCharCode((i&15)<<12|(o&63)<<6|l&63)}}return e.join("")},id={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(s,e){if(!Array.isArray(s))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<s.length;i+=3){const o=s[i],l=i+1<s.length,c=l?s[i+1]:0,d=i+2<s.length,h=d?s[i+2]:0,f=o>>2,g=(o&3)<<4|c>>4;let b=(c&15)<<2|h>>6,v=h&63;d||(v=64,l||(b=64)),r.push(n[f],n[g],n[b],n[v])}return r.join("")},encodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(s):this.encodeByteArray(rd(s),e)},decodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(s):wp(this.decodeStringToByteArray(s,e))},decodeStringToByteArray(s,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<s.length;){const o=n[s.charAt(i++)],c=i<s.length?n[s.charAt(i)]:0;++i;const h=i<s.length?n[s.charAt(i)]:64;++i;const g=i<s.length?n[s.charAt(i)]:64;if(++i,o==null||c==null||h==null||g==null)throw new _p;const b=o<<2|c>>4;if(r.push(b),h!==64){const v=c<<4&240|h>>2;if(r.push(v),g!==64){const T=h<<6&192|g;r.push(T)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let s=0;s<this.ENCODED_VALS.length;s++)this.byteToCharMap_[s]=this.ENCODED_VALS.charAt(s),this.charToByteMap_[this.byteToCharMap_[s]]=s,this.byteToCharMapWebSafe_[s]=this.ENCODED_VALS_WEBSAFE.charAt(s),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[s]]=s,s>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(s)]=s,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(s)]=s)}}};class _p extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ep=function(s){const e=rd(s);return id.encodeByteArray(e,!0)},od=function(s){return Ep(s).replace(/\./g,"")},ad=function(s){try{return id.decodeString(s,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function kp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Ip=()=>kp().__FIREBASE_DEFAULTS__,Tp=()=>{if(typeof process>"u"||typeof El>"u")return;const s=El.__FIREBASE_DEFAULTS__;if(s)return JSON.parse(s)},Ap=()=>{if(typeof document>"u")return;let s;try{s=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=s&&ad(s[1]);return e&&JSON.parse(e)},$r=()=>{try{return xp()||Ip()||Tp()||Ap()}catch(s){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${s}`);return}},Sp=s=>{var e,n;return(n=(e=$r())==null?void 0:e.emulatorHosts)==null?void 0:n[s]},ld=()=>{var s;return(s=$r())==null?void 0:s.config},cd=s=>{var e;return(e=$r())==null?void 0:e[`_${s}`]};/**
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
 */class Rp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
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
 */function ke(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Cp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ke())}function Pp(){var e;const s=(e=$r())==null?void 0:e.forceEnvironment;if(s==="node")return!0;if(s==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Dp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Vp(){const s=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof s=="object"&&s.id!==void 0}function Np(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Mp(){const s=ke();return s.indexOf("MSIE ")>=0||s.indexOf("Trident/")>=0}function Lp(){return!Pp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function $p(){try{return typeof indexedDB=="object"}catch{return!1}}function Op(){return new Promise((s,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),s(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var o;e(((o=i.error)==null?void 0:o.message)||"")}}catch(n){e(n)}})}/**
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
 */const Fp="FirebaseError";class dt extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Fp,Object.setPrototypeOf(this,dt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_s.prototype.create)}}class _s{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,o=this.errors[e],l=o?Up(o,r):"Error",c=`${this.serviceName}: ${l} (${i}).`;return new dt(i,c,r)}}function Up(s,e){return s.replace(Bp,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Bp=/\{\$([^}]+)}/g;function jp(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}function Yt(s,e){if(s===e)return!0;const n=Object.keys(s),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const o=s[i],l=e[i];if(kl(o)&&kl(l)){if(!Yt(o,l))return!1}else if(o!==l)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function kl(s){return s!==null&&typeof s=="object"}/**
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
 */function Es(s){const e=[];for(const[n,r]of Object.entries(s))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function zp(s,e){const n=new qp(s,e);return n.subscribe.bind(n)}class qp{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");Hp(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Ni),i.error===void 0&&(i.error=Ni),i.complete===void 0&&(i.complete=Ni);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Hp(s,e){if(typeof s!="object"||s===null)return!1;for(const n of e)if(n in s&&typeof s[n]=="function")return!0;return!1}function Ni(){}/**
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
 */function Ie(s){return s&&s._delegate?s._delegate:s}/**
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
 */function ks(s){try{return(s.startsWith("http://")||s.startsWith("https://")?new URL(s).hostname:s).endsWith(".cloudworkstations.dev")}catch{return!1}}async function dd(s){return(await fetch(s,{credentials:"include"})).ok}class Jt{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Gt="[DEFAULT]";/**
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
 */class Gp{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new Rp;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Kp(e))try{this.getOrInitializeService({instanceIdentifier:Gt})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:i});r.resolve(o)}catch{}}}}clearInstance(e=Gt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gt){return this.instances.has(e)}getOptions(e=Gt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[o,l]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);r===c&&l.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&e(o,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Wp(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Gt){return this.component?this.component.multipleInstances?e:Gt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wp(s){return s===Gt?void 0:s}function Kp(s){return s.instantiationMode==="EAGER"}/**
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
 */class Qp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Gp(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Y;(function(s){s[s.DEBUG=0]="DEBUG",s[s.VERBOSE=1]="VERBOSE",s[s.INFO=2]="INFO",s[s.WARN=3]="WARN",s[s.ERROR=4]="ERROR",s[s.SILENT=5]="SILENT"})(Y||(Y={}));const Yp={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},Jp=Y.INFO,Xp={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},Zp=(s,e,...n)=>{if(e<s.logLevel)return;const r=new Date().toISOString(),i=Xp[e];if(i)console[i](`[${r}]  ${s.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Io{constructor(e){this.name=e,this._logLevel=Jp,this._logHandler=Zp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Yp[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}const ef=(s,e)=>e.some(n=>s instanceof n);let Il,Tl;function tf(){return Il||(Il=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function nf(){return Tl||(Tl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ud=new WeakMap,Ji=new WeakMap,hd=new WeakMap,Mi=new WeakMap,To=new WeakMap;function sf(s){const e=new Promise((n,r)=>{const i=()=>{s.removeEventListener("success",o),s.removeEventListener("error",l)},o=()=>{n(kt(s.result)),i()},l=()=>{r(s.error),i()};s.addEventListener("success",o),s.addEventListener("error",l)});return e.then(n=>{n instanceof IDBCursor&&ud.set(n,s)}).catch(()=>{}),To.set(e,s),e}function rf(s){if(Ji.has(s))return;const e=new Promise((n,r)=>{const i=()=>{s.removeEventListener("complete",o),s.removeEventListener("error",l),s.removeEventListener("abort",l)},o=()=>{n(),i()},l=()=>{r(s.error||new DOMException("AbortError","AbortError")),i()};s.addEventListener("complete",o),s.addEventListener("error",l),s.addEventListener("abort",l)});Ji.set(s,e)}let Xi={get(s,e,n){if(s instanceof IDBTransaction){if(e==="done")return Ji.get(s);if(e==="objectStoreNames")return s.objectStoreNames||hd.get(s);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return kt(s[e])},set(s,e,n){return s[e]=n,!0},has(s,e){return s instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in s}};function of(s){Xi=s(Xi)}function af(s){return s===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=s.call(Li(this),e,...n);return hd.set(r,e.sort?e.sort():[e]),kt(r)}:nf().includes(s)?function(...e){return s.apply(Li(this),e),kt(ud.get(this))}:function(...e){return kt(s.apply(Li(this),e))}}function lf(s){return typeof s=="function"?af(s):(s instanceof IDBTransaction&&rf(s),ef(s,tf())?new Proxy(s,Xi):s)}function kt(s){if(s instanceof IDBRequest)return sf(s);if(Mi.has(s))return Mi.get(s);const e=lf(s);return e!==s&&(Mi.set(s,e),To.set(e,s)),e}const Li=s=>To.get(s);function cf(s,e,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){const l=indexedDB.open(s,e),c=kt(l);return r&&l.addEventListener("upgradeneeded",d=>{r(kt(l.result),d.oldVersion,d.newVersion,kt(l.transaction),d)}),n&&l.addEventListener("blocked",d=>n(d.oldVersion,d.newVersion,d)),c.then(d=>{o&&d.addEventListener("close",()=>o()),i&&d.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const df=["get","getKey","getAll","getAllKeys","count"],uf=["put","add","delete","clear"],$i=new Map;function Al(s,e){if(!(s instanceof IDBDatabase&&!(e in s)&&typeof e=="string"))return;if($i.get(e))return $i.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=uf.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||df.includes(n)))return;const o=async function(l,...c){const d=this.transaction(l,i?"readwrite":"readonly");let h=d.store;return r&&(h=h.index(c.shift())),(await Promise.all([h[n](...c),i&&d.done]))[0]};return $i.set(e,o),o}of(s=>({...s,get:(e,n,r)=>Al(e,n)||s.get(e,n,r),has:(e,n)=>!!Al(e,n)||s.has(e,n)}));/**
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
 */class hf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(pf(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function pf(s){const e=s.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Zi="@firebase/app",Sl="0.14.11";/**
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
 */const rt=new Io("@firebase/app"),ff="@firebase/app-compat",mf="@firebase/analytics-compat",gf="@firebase/analytics",yf="@firebase/app-check-compat",bf="@firebase/app-check",vf="@firebase/auth",xf="@firebase/auth-compat",wf="@firebase/database",_f="@firebase/data-connect",Ef="@firebase/database-compat",kf="@firebase/functions",If="@firebase/functions-compat",Tf="@firebase/installations",Af="@firebase/installations-compat",Sf="@firebase/messaging",Rf="@firebase/messaging-compat",Cf="@firebase/performance",Pf="@firebase/performance-compat",Df="@firebase/remote-config",Vf="@firebase/remote-config-compat",Nf="@firebase/storage",Mf="@firebase/storage-compat",Lf="@firebase/firestore",$f="@firebase/ai",Of="@firebase/firestore-compat",Ff="firebase",Uf="12.12.0";/**
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
 */const eo="[DEFAULT]",Bf={[Zi]:"fire-core",[ff]:"fire-core-compat",[gf]:"fire-analytics",[mf]:"fire-analytics-compat",[bf]:"fire-app-check",[yf]:"fire-app-check-compat",[vf]:"fire-auth",[xf]:"fire-auth-compat",[wf]:"fire-rtdb",[_f]:"fire-data-connect",[Ef]:"fire-rtdb-compat",[kf]:"fire-fn",[If]:"fire-fn-compat",[Tf]:"fire-iid",[Af]:"fire-iid-compat",[Sf]:"fire-fcm",[Rf]:"fire-fcm-compat",[Cf]:"fire-perf",[Pf]:"fire-perf-compat",[Df]:"fire-rc",[Vf]:"fire-rc-compat",[Nf]:"fire-gcs",[Mf]:"fire-gcs-compat",[Lf]:"fire-fst",[Of]:"fire-fst-compat",[$f]:"fire-vertex","fire-js":"fire-js",[Ff]:"fire-js-all"};/**
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
 */const mr=new Map,jf=new Map,to=new Map;function Rl(s,e){try{s.container.addComponent(e)}catch(n){rt.debug(`Component ${e.name} failed to register with FirebaseApp ${s.name}`,n)}}function xn(s){const e=s.name;if(to.has(e))return rt.debug(`There were multiple attempts to register component ${e}.`),!1;to.set(e,s);for(const n of mr.values())Rl(n,s);for(const n of jf.values())Rl(n,s);return!0}function Ao(s,e){const n=s.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),s.container.getProvider(e)}function Oe(s){return s==null?!1:s.settings!==void 0}/**
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
 */const zf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},It=new _s("app","Firebase",zf);/**
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
 */class qf{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Jt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw It.create("app-deleted",{appName:this._name})}}/**
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
 */const Sn=Uf;function pd(s,e={}){let n=s;typeof e!="object"&&(e={name:e});const r={name:eo,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw It.create("bad-app-name",{appName:String(i)});if(n||(n=ld()),!n)throw It.create("no-options");const o=mr.get(i);if(o){if(Yt(n,o.options)&&Yt(r,o.config))return o;throw It.create("duplicate-app",{appName:i})}const l=new Qp(i);for(const d of to.values())l.addComponent(d);const c=new qf(n,r,l);return mr.set(i,c),c}function Hf(s=eo){const e=mr.get(s);if(!e&&s===eo&&ld())return pd();if(!e)throw It.create("no-app",{appName:s});return e}function Tt(s,e,n){let r=Bf[s]??s;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),rt.warn(l.join(" "));return}xn(new Jt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const Gf="firebase-heartbeat-database",Wf=1,ds="firebase-heartbeat-store";let Oi=null;function fd(){return Oi||(Oi=cf(Gf,Wf,{upgrade:(s,e)=>{switch(e){case 0:try{s.createObjectStore(ds)}catch(n){console.warn(n)}}}}).catch(s=>{throw It.create("idb-open",{originalErrorMessage:s.message})})),Oi}async function Kf(s){try{const n=(await fd()).transaction(ds),r=await n.objectStore(ds).get(md(s));return await n.done,r}catch(e){if(e instanceof dt)rt.warn(e.message);else{const n=It.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});rt.warn(n.message)}}}async function Cl(s,e){try{const r=(await fd()).transaction(ds,"readwrite");await r.objectStore(ds).put(e,md(s)),await r.done}catch(n){if(n instanceof dt)rt.warn(n.message);else{const r=It.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});rt.warn(r.message)}}}function md(s){return`${s.name}!${s.options.appId}`}/**
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
 */const Qf=1024,Yf=30;class Jf{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Zf(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Pl();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(l=>l.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:i}),this._heartbeatsCache.heartbeats.length>Yf){const l=em(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){rt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Pl(),{heartbeatsToSend:r,unsentEntries:i}=Xf(this._heartbeatsCache.heartbeats),o=od(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return rt.warn(n),""}}}function Pl(){return new Date().toISOString().substring(0,10)}function Xf(s,e=Qf){const n=[];let r=s.slice();for(const i of s){const o=n.find(l=>l.agent===i.agent);if(o){if(o.dates.push(i.date),Dl(n)>e){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Dl(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Zf{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $p()?Op().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Kf(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Cl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Dl(s){return od(JSON.stringify({version:2,heartbeats:s})).length}function em(s){if(s.length===0)return-1;let e=0,n=s[0].date;for(let r=1;r<s.length;r++)s[r].date<n&&(n=s[r].date,e=r);return e}/**
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
 */function tm(s){xn(new Jt("platform-logger",e=>new hf(e),"PRIVATE")),xn(new Jt("heartbeat",e=>new Jf(e),"PRIVATE")),Tt(Zi,Sl,s),Tt(Zi,Sl,"esm2020"),Tt("fire-js","")}tm("");var nm="firebase",sm="12.12.1";/**
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
 */Tt(nm,sm,"app");var Vl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var At,gd;(function(){var s;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,x){function _(){}_.prototype=x.prototype,E.F=x.prototype,E.prototype=new _,E.prototype.constructor=E,E.D=function(I,k,S){for(var w=Array(arguments.length-2),Se=2;Se<arguments.length;Se++)w[Se-2]=arguments[Se];return x.prototype[k].apply(I,w)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,x,_){_||(_=0);const I=Array(16);if(typeof x=="string")for(var k=0;k<16;++k)I[k]=x.charCodeAt(_++)|x.charCodeAt(_++)<<8|x.charCodeAt(_++)<<16|x.charCodeAt(_++)<<24;else for(k=0;k<16;++k)I[k]=x[_++]|x[_++]<<8|x[_++]<<16|x[_++]<<24;x=E.g[0],_=E.g[1],k=E.g[2];let S=E.g[3],w;w=x+(S^_&(k^S))+I[0]+3614090360&4294967295,x=_+(w<<7&4294967295|w>>>25),w=S+(k^x&(_^k))+I[1]+3905402710&4294967295,S=x+(w<<12&4294967295|w>>>20),w=k+(_^S&(x^_))+I[2]+606105819&4294967295,k=S+(w<<17&4294967295|w>>>15),w=_+(x^k&(S^x))+I[3]+3250441966&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(S^_&(k^S))+I[4]+4118548399&4294967295,x=_+(w<<7&4294967295|w>>>25),w=S+(k^x&(_^k))+I[5]+1200080426&4294967295,S=x+(w<<12&4294967295|w>>>20),w=k+(_^S&(x^_))+I[6]+2821735955&4294967295,k=S+(w<<17&4294967295|w>>>15),w=_+(x^k&(S^x))+I[7]+4249261313&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(S^_&(k^S))+I[8]+1770035416&4294967295,x=_+(w<<7&4294967295|w>>>25),w=S+(k^x&(_^k))+I[9]+2336552879&4294967295,S=x+(w<<12&4294967295|w>>>20),w=k+(_^S&(x^_))+I[10]+4294925233&4294967295,k=S+(w<<17&4294967295|w>>>15),w=_+(x^k&(S^x))+I[11]+2304563134&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(S^_&(k^S))+I[12]+1804603682&4294967295,x=_+(w<<7&4294967295|w>>>25),w=S+(k^x&(_^k))+I[13]+4254626195&4294967295,S=x+(w<<12&4294967295|w>>>20),w=k+(_^S&(x^_))+I[14]+2792965006&4294967295,k=S+(w<<17&4294967295|w>>>15),w=_+(x^k&(S^x))+I[15]+1236535329&4294967295,_=k+(w<<22&4294967295|w>>>10),w=x+(k^S&(_^k))+I[1]+4129170786&4294967295,x=_+(w<<5&4294967295|w>>>27),w=S+(_^k&(x^_))+I[6]+3225465664&4294967295,S=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(S^x))+I[11]+643717713&4294967295,k=S+(w<<14&4294967295|w>>>18),w=_+(S^x&(k^S))+I[0]+3921069994&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^S&(_^k))+I[5]+3593408605&4294967295,x=_+(w<<5&4294967295|w>>>27),w=S+(_^k&(x^_))+I[10]+38016083&4294967295,S=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(S^x))+I[15]+3634488961&4294967295,k=S+(w<<14&4294967295|w>>>18),w=_+(S^x&(k^S))+I[4]+3889429448&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^S&(_^k))+I[9]+568446438&4294967295,x=_+(w<<5&4294967295|w>>>27),w=S+(_^k&(x^_))+I[14]+3275163606&4294967295,S=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(S^x))+I[3]+4107603335&4294967295,k=S+(w<<14&4294967295|w>>>18),w=_+(S^x&(k^S))+I[8]+1163531501&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(k^S&(_^k))+I[13]+2850285829&4294967295,x=_+(w<<5&4294967295|w>>>27),w=S+(_^k&(x^_))+I[2]+4243563512&4294967295,S=x+(w<<9&4294967295|w>>>23),w=k+(x^_&(S^x))+I[7]+1735328473&4294967295,k=S+(w<<14&4294967295|w>>>18),w=_+(S^x&(k^S))+I[12]+2368359562&4294967295,_=k+(w<<20&4294967295|w>>>12),w=x+(_^k^S)+I[5]+4294588738&4294967295,x=_+(w<<4&4294967295|w>>>28),w=S+(x^_^k)+I[8]+2272392833&4294967295,S=x+(w<<11&4294967295|w>>>21),w=k+(S^x^_)+I[11]+1839030562&4294967295,k=S+(w<<16&4294967295|w>>>16),w=_+(k^S^x)+I[14]+4259657740&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^S)+I[1]+2763975236&4294967295,x=_+(w<<4&4294967295|w>>>28),w=S+(x^_^k)+I[4]+1272893353&4294967295,S=x+(w<<11&4294967295|w>>>21),w=k+(S^x^_)+I[7]+4139469664&4294967295,k=S+(w<<16&4294967295|w>>>16),w=_+(k^S^x)+I[10]+3200236656&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^S)+I[13]+681279174&4294967295,x=_+(w<<4&4294967295|w>>>28),w=S+(x^_^k)+I[0]+3936430074&4294967295,S=x+(w<<11&4294967295|w>>>21),w=k+(S^x^_)+I[3]+3572445317&4294967295,k=S+(w<<16&4294967295|w>>>16),w=_+(k^S^x)+I[6]+76029189&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(_^k^S)+I[9]+3654602809&4294967295,x=_+(w<<4&4294967295|w>>>28),w=S+(x^_^k)+I[12]+3873151461&4294967295,S=x+(w<<11&4294967295|w>>>21),w=k+(S^x^_)+I[15]+530742520&4294967295,k=S+(w<<16&4294967295|w>>>16),w=_+(k^S^x)+I[2]+3299628645&4294967295,_=k+(w<<23&4294967295|w>>>9),w=x+(k^(_|~S))+I[0]+4096336452&4294967295,x=_+(w<<6&4294967295|w>>>26),w=S+(_^(x|~k))+I[7]+1126891415&4294967295,S=x+(w<<10&4294967295|w>>>22),w=k+(x^(S|~_))+I[14]+2878612391&4294967295,k=S+(w<<15&4294967295|w>>>17),w=_+(S^(k|~x))+I[5]+4237533241&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~S))+I[12]+1700485571&4294967295,x=_+(w<<6&4294967295|w>>>26),w=S+(_^(x|~k))+I[3]+2399980690&4294967295,S=x+(w<<10&4294967295|w>>>22),w=k+(x^(S|~_))+I[10]+4293915773&4294967295,k=S+(w<<15&4294967295|w>>>17),w=_+(S^(k|~x))+I[1]+2240044497&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~S))+I[8]+1873313359&4294967295,x=_+(w<<6&4294967295|w>>>26),w=S+(_^(x|~k))+I[15]+4264355552&4294967295,S=x+(w<<10&4294967295|w>>>22),w=k+(x^(S|~_))+I[6]+2734768916&4294967295,k=S+(w<<15&4294967295|w>>>17),w=_+(S^(k|~x))+I[13]+1309151649&4294967295,_=k+(w<<21&4294967295|w>>>11),w=x+(k^(_|~S))+I[4]+4149444226&4294967295,x=_+(w<<6&4294967295|w>>>26),w=S+(_^(x|~k))+I[11]+3174756917&4294967295,S=x+(w<<10&4294967295|w>>>22),w=k+(x^(S|~_))+I[2]+718787259&4294967295,k=S+(w<<15&4294967295|w>>>17),w=_+(S^(k|~x))+I[9]+3951481745&4294967295,E.g[0]=E.g[0]+x&4294967295,E.g[1]=E.g[1]+(k+(w<<21&4294967295|w>>>11))&4294967295,E.g[2]=E.g[2]+k&4294967295,E.g[3]=E.g[3]+S&4294967295}r.prototype.v=function(E,x){x===void 0&&(x=E.length);const _=x-this.blockSize,I=this.C;let k=this.h,S=0;for(;S<x;){if(k==0)for(;S<=_;)i(this,E,S),S+=this.blockSize;if(typeof E=="string"){for(;S<x;)if(I[k++]=E.charCodeAt(S++),k==this.blockSize){i(this,I),k=0;break}}else for(;S<x;)if(I[k++]=E[S++],k==this.blockSize){i(this,I),k=0;break}}this.h=k,this.o+=x},r.prototype.A=function(){var E=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);E[0]=128;for(var x=1;x<E.length-8;++x)E[x]=0;x=this.o*8;for(var _=E.length-8;_<E.length;++_)E[_]=x&255,x/=256;for(this.v(E),E=Array(16),x=0,_=0;_<4;++_)for(let I=0;I<32;I+=8)E[x++]=this.g[_]>>>I&255;return E};function o(E,x){var _=c;return Object.prototype.hasOwnProperty.call(_,E)?_[E]:_[E]=x(E)}function l(E,x){this.h=x;const _=[];let I=!0;for(let k=E.length-1;k>=0;k--){const S=E[k]|0;I&&S==x||(_[k]=S,I=!1)}this.g=_}var c={};function d(E){return-128<=E&&E<128?o(E,function(x){return new l([x|0],x<0?-1:0)}):new l([E|0],E<0?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return g;if(E<0)return P(h(-E));const x=[];let _=1;for(let I=0;E>=_;I++)x[I]=E/_|0,_*=4294967296;return new l(x,0)}function f(E,x){if(E.length==0)throw Error("number format error: empty string");if(x=x||10,x<2||36<x)throw Error("radix out of range: "+x);if(E.charAt(0)=="-")return P(f(E.substring(1),x));if(E.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=h(Math.pow(x,8));let I=g;for(let S=0;S<E.length;S+=8){var k=Math.min(8,E.length-S);const w=parseInt(E.substring(S,S+k),x);k<8?(k=h(Math.pow(x,k)),I=I.j(k).add(h(w))):(I=I.j(_),I=I.add(h(w)))}return I}var g=d(0),b=d(1),v=d(16777216);s=l.prototype,s.m=function(){if(R(this))return-P(this).m();let E=0,x=1;for(let _=0;_<this.g.length;_++){const I=this.i(_);E+=(I>=0?I:4294967296+I)*x,x*=4294967296}return E},s.toString=function(E){if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(T(this))return"0";if(R(this))return"-"+P(this).toString(E);const x=h(Math.pow(E,6));var _=this;let I="";for(;;){const k=j(_,x).g;_=L(_,k.j(x));let S=((_.g.length>0?_.g[0]:_.h)>>>0).toString(E);if(_=k,T(_))return S+I;for(;S.length<6;)S="0"+S;I=S+I}},s.i=function(E){return E<0?0:E<this.g.length?this.g[E]:this.h};function T(E){if(E.h!=0)return!1;for(let x=0;x<E.g.length;x++)if(E.g[x]!=0)return!1;return!0}function R(E){return E.h==-1}s.l=function(E){return E=L(this,E),R(E)?-1:T(E)?0:1};function P(E){const x=E.g.length,_=[];for(let I=0;I<x;I++)_[I]=~E.g[I];return new l(_,~E.h).add(b)}s.abs=function(){return R(this)?P(this):this},s.add=function(E){const x=Math.max(this.g.length,E.g.length),_=[];let I=0;for(let k=0;k<=x;k++){let S=I+(this.i(k)&65535)+(E.i(k)&65535),w=(S>>>16)+(this.i(k)>>>16)+(E.i(k)>>>16);I=w>>>16,S&=65535,w&=65535,_[k]=w<<16|S}return new l(_,_[_.length-1]&-2147483648?-1:0)};function L(E,x){return E.add(P(x))}s.j=function(E){if(T(this)||T(E))return g;if(R(this))return R(E)?P(this).j(P(E)):P(P(this).j(E));if(R(E))return P(this.j(P(E)));if(this.l(v)<0&&E.l(v)<0)return h(this.m()*E.m());const x=this.g.length+E.g.length,_=[];for(var I=0;I<2*x;I++)_[I]=0;for(I=0;I<this.g.length;I++)for(let k=0;k<E.g.length;k++){const S=this.i(I)>>>16,w=this.i(I)&65535,Se=E.i(k)>>>16,Ut=E.i(k)&65535;_[2*I+2*k]+=w*Ut,N(_,2*I+2*k),_[2*I+2*k+1]+=S*Ut,N(_,2*I+2*k+1),_[2*I+2*k+1]+=w*Se,N(_,2*I+2*k+1),_[2*I+2*k+2]+=S*Se,N(_,2*I+2*k+2)}for(E=0;E<x;E++)_[E]=_[2*E+1]<<16|_[2*E];for(E=x;E<2*x;E++)_[E]=0;return new l(_,0)};function N(E,x){for(;(E[x]&65535)!=E[x];)E[x+1]+=E[x]>>>16,E[x]&=65535,x++}function q(E,x){this.g=E,this.h=x}function j(E,x){if(T(x))throw Error("division by zero");if(T(E))return new q(g,g);if(R(E))return x=j(P(E),x),new q(P(x.g),P(x.h));if(R(x))return x=j(E,P(x)),new q(P(x.g),x.h);if(E.g.length>30){if(R(E)||R(x))throw Error("slowDivide_ only works with positive integers.");for(var _=b,I=x;I.l(E)<=0;)_=G(_),I=G(I);var k=Z(_,1),S=Z(I,1);for(I=Z(I,2),_=Z(_,2);!T(I);){var w=S.add(I);w.l(E)<=0&&(k=k.add(_),S=w),I=Z(I,1),_=Z(_,1)}return x=L(E,k.j(x)),new q(k,x)}for(k=g;E.l(x)>=0;){for(_=Math.max(1,Math.floor(E.m()/x.m())),I=Math.ceil(Math.log(_)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),S=h(_),w=S.j(x);R(w)||w.l(E)>0;)_-=I,S=h(_),w=S.j(x);T(S)&&(S=b),k=k.add(S),E=L(E,w)}return new q(k,E)}s.B=function(E){return j(this,E).h},s.and=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)&E.i(I);return new l(_,this.h&E.h)},s.or=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)|E.i(I);return new l(_,this.h|E.h)},s.xor=function(E){const x=Math.max(this.g.length,E.g.length),_=[];for(let I=0;I<x;I++)_[I]=this.i(I)^E.i(I);return new l(_,this.h^E.h)};function G(E){const x=E.g.length+1,_=[];for(let I=0;I<x;I++)_[I]=E.i(I)<<1|E.i(I-1)>>>31;return new l(_,E.h)}function Z(E,x){const _=x>>5;x%=32;const I=E.g.length-_,k=[];for(let S=0;S<I;S++)k[S]=x>0?E.i(S+_)>>>x|E.i(S+_+1)<<32-x:E.i(S+_);return new l(k,E.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,gd=r,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=h,l.fromString=f,At=l}).apply(typeof Vl<"u"?Vl:typeof self<"u"?self:typeof window<"u"?window:{});var Qs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var yd,Xn,bd,rr,no,vd,xd,wd;(function(){var s,e=Object.defineProperty;function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Qs=="object"&&Qs];for(var u=0;u<a.length;++u){var p=a[u];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var r=n(this);function i(a,u){if(u)e:{var p=r;a=a.split(".");for(var y=0;y<a.length-1;y++){var A=a[y];if(!(A in p))break e;p=p[A]}a=a[a.length-1],y=p[a],u=u(y),u!=y&&u!=null&&e(p,a,{configurable:!0,writable:!0,value:u})}}i("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),i("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),i("Object.entries",function(a){return a||function(u){var p=[],y;for(y in u)Object.prototype.hasOwnProperty.call(u,y)&&p.push([y,u[y]]);return p}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var u=typeof a;return u=="object"&&a!=null||u=="function"}function d(a,u,p){return a.call.apply(a.bind,arguments)}function h(a,u,p){return h=d,h.apply(null,arguments)}function f(a,u){var p=Array.prototype.slice.call(arguments,1);return function(){var y=p.slice();return y.push.apply(y,arguments),a.apply(this,y)}}function g(a,u){function p(){}p.prototype=u.prototype,a.Z=u.prototype,a.prototype=new p,a.prototype.constructor=a,a.Ob=function(y,A,C){for(var M=Array(arguments.length-2),Q=2;Q<arguments.length;Q++)M[Q-2]=arguments[Q];return u.prototype[A].apply(y,M)}}var b=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function v(a){const u=a.length;if(u>0){const p=Array(u);for(let y=0;y<u;y++)p[y]=a[y];return p}return[]}function T(a,u){for(let y=1;y<arguments.length;y++){const A=arguments[y];var p=typeof A;if(p=p!="object"?p:A?Array.isArray(A)?"array":p:"null",p=="array"||p=="object"&&typeof A.length=="number"){p=a.length||0;const C=A.length||0;a.length=p+C;for(let M=0;M<C;M++)a[p+M]=A[M]}else a.push(A)}}class R{constructor(u,p){this.i=u,this.j=p,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function P(a){l.setTimeout(()=>{throw a},0)}function L(){var a=E;let u=null;return a.g&&(u=a.g,a.g=a.g.next,a.g||(a.h=null),u.next=null),u}class N{constructor(){this.h=this.g=null}add(u,p){const y=q.get();y.set(u,p),this.h?this.h.next=y:this.g=y,this.h=y}}var q=new R(()=>new j,a=>a.reset());class j{constructor(){this.next=this.g=this.h=null}set(u,p){this.h=u,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let G,Z=!1,E=new N,x=()=>{const a=Promise.resolve(void 0);G=()=>{a.then(_)}};function _(){for(var a;a=L();){try{a.h.call(a.g)}catch(p){P(p)}var u=q;u.j(a),u.h<100&&(u.h++,a.next=u.g,u.g=a)}Z=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function k(a,u){this.type=a,this.g=this.target=u,this.defaultPrevented=!1}k.prototype.h=function(){this.defaultPrevented=!0};var S=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,u=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const p=()=>{};l.addEventListener("test",p,u),l.removeEventListener("test",p,u)}catch{}return a})();function w(a){return/^[\s\xa0]*$/.test(a)}function Se(a,u){k.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,u)}g(Se,k),Se.prototype.init=function(a,u){const p=this.type=a.type,y=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=u,u=a.relatedTarget,u||(p=="mouseover"?u=a.fromElement:p=="mouseout"&&(u=a.toElement)),this.relatedTarget=u,y?(this.clientX=y.clientX!==void 0?y.clientX:y.pageX,this.clientY=y.clientY!==void 0?y.clientY:y.pageY,this.screenX=y.screenX||0,this.screenY=y.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Se.Z.h.call(this)},Se.prototype.h=function(){Se.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ut="closure_listenable_"+(Math.random()*1e6|0),jh=0;function zh(a,u,p,y,A){this.listener=a,this.proxy=null,this.src=u,this.type=p,this.capture=!!y,this.ha=A,this.key=++jh,this.da=this.fa=!1}function Ns(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Ms(a,u,p){for(const y in a)u.call(p,a[y],y,a)}function qh(a,u){for(const p in a)u.call(void 0,a[p],p,a)}function _a(a){const u={};for(const p in a)u[p]=a[p];return u}const Ea="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ka(a,u){let p,y;for(let A=1;A<arguments.length;A++){y=arguments[A];for(p in y)a[p]=y[p];for(let C=0;C<Ea.length;C++)p=Ea[C],Object.prototype.hasOwnProperty.call(y,p)&&(a[p]=y[p])}}function Ls(a){this.src=a,this.g={},this.h=0}Ls.prototype.add=function(a,u,p,y,A){const C=a.toString();a=this.g[C],a||(a=this.g[C]=[],this.h++);const M=ui(a,u,y,A);return M>-1?(u=a[M],p||(u.fa=!1)):(u=new zh(u,this.src,C,!!y,A),u.fa=p,a.push(u)),u};function di(a,u){const p=u.type;if(p in a.g){var y=a.g[p],A=Array.prototype.indexOf.call(y,u,void 0),C;(C=A>=0)&&Array.prototype.splice.call(y,A,1),C&&(Ns(u),a.g[p].length==0&&(delete a.g[p],a.h--))}}function ui(a,u,p,y){for(let A=0;A<a.length;++A){const C=a[A];if(!C.da&&C.listener==u&&C.capture==!!p&&C.ha==y)return A}return-1}var hi="closure_lm_"+(Math.random()*1e6|0),pi={};function Ia(a,u,p,y,A){if(Array.isArray(u)){for(let C=0;C<u.length;C++)Ia(a,u[C],p,y,A);return null}return p=Sa(p),a&&a[Ut]?a.J(u,p,c(y)?!!y.capture:!1,A):Hh(a,u,p,!1,y,A)}function Hh(a,u,p,y,A,C){if(!u)throw Error("Invalid event type");const M=c(A)?!!A.capture:!!A;let Q=mi(a);if(Q||(a[hi]=Q=new Ls(a)),p=Q.add(u,p,y,M,C),p.proxy)return p;if(y=Gh(),p.proxy=y,y.src=a,y.listener=p,a.addEventListener)S||(A=M),A===void 0&&(A=!1),a.addEventListener(u.toString(),y,A);else if(a.attachEvent)a.attachEvent(Aa(u.toString()),y);else if(a.addListener&&a.removeListener)a.addListener(y);else throw Error("addEventListener and attachEvent are unavailable.");return p}function Gh(){function a(p){return u.call(a.src,a.listener,p)}const u=Wh;return a}function Ta(a,u,p,y,A){if(Array.isArray(u))for(var C=0;C<u.length;C++)Ta(a,u[C],p,y,A);else y=c(y)?!!y.capture:!!y,p=Sa(p),a&&a[Ut]?(a=a.i,C=String(u).toString(),C in a.g&&(u=a.g[C],p=ui(u,p,y,A),p>-1&&(Ns(u[p]),Array.prototype.splice.call(u,p,1),u.length==0&&(delete a.g[C],a.h--)))):a&&(a=mi(a))&&(u=a.g[u.toString()],a=-1,u&&(a=ui(u,p,y,A)),(p=a>-1?u[a]:null)&&fi(p))}function fi(a){if(typeof a!="number"&&a&&!a.da){var u=a.src;if(u&&u[Ut])di(u.i,a);else{var p=a.type,y=a.proxy;u.removeEventListener?u.removeEventListener(p,y,a.capture):u.detachEvent?u.detachEvent(Aa(p),y):u.addListener&&u.removeListener&&u.removeListener(y),(p=mi(u))?(di(p,a),p.h==0&&(p.src=null,u[hi]=null)):Ns(a)}}}function Aa(a){return a in pi?pi[a]:pi[a]="on"+a}function Wh(a,u){if(a.da)a=!0;else{u=new Se(u,this);const p=a.listener,y=a.ha||a.src;a.fa&&fi(a),a=p.call(y,u)}return a}function mi(a){return a=a[hi],a instanceof Ls?a:null}var gi="__closure_events_fn_"+(Math.random()*1e9>>>0);function Sa(a){return typeof a=="function"?a:(a[gi]||(a[gi]=function(u){return a.handleEvent(u)}),a[gi])}function we(){I.call(this),this.i=new Ls(this),this.M=this,this.G=null}g(we,I),we.prototype[Ut]=!0,we.prototype.removeEventListener=function(a,u,p,y){Ta(this,a,u,p,y)};function Te(a,u){var p,y=a.G;if(y)for(p=[];y;y=y.G)p.push(y);if(a=a.M,y=u.type||u,typeof u=="string")u=new k(u,a);else if(u instanceof k)u.target=u.target||a;else{var A=u;u=new k(y,a),ka(u,A)}A=!0;let C,M;if(p)for(M=p.length-1;M>=0;M--)C=u.g=p[M],A=$s(C,y,!0,u)&&A;if(C=u.g=a,A=$s(C,y,!0,u)&&A,A=$s(C,y,!1,u)&&A,p)for(M=0;M<p.length;M++)C=u.g=p[M],A=$s(C,y,!1,u)&&A}we.prototype.N=function(){if(we.Z.N.call(this),this.i){var a=this.i;for(const u in a.g){const p=a.g[u];for(let y=0;y<p.length;y++)Ns(p[y]);delete a.g[u],a.h--}}this.G=null},we.prototype.J=function(a,u,p,y){return this.i.add(String(a),u,!1,p,y)},we.prototype.K=function(a,u,p,y){return this.i.add(String(a),u,!0,p,y)};function $s(a,u,p,y){if(u=a.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let C=0;C<u.length;++C){const M=u[C];if(M&&!M.da&&M.capture==p){const Q=M.listener,fe=M.ha||M.src;M.fa&&di(a.i,M),A=Q.call(fe,y)!==!1&&A}}return A&&!y.defaultPrevented}function Kh(a,u){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:l.setTimeout(a,u||0)}function Ra(a){a.g=Kh(()=>{a.g=null,a.i&&(a.i=!1,Ra(a))},a.l);const u=a.h;a.h=null,a.m.apply(null,u)}class Qh extends I{constructor(u,p){super(),this.m=u,this.l=p,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Ra(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Mn(a){I.call(this),this.h=a,this.g={}}g(Mn,I);var Ca=[];function Pa(a){Ms(a.g,function(u,p){this.g.hasOwnProperty(p)&&fi(u)},a),a.g={}}Mn.prototype.N=function(){Mn.Z.N.call(this),Pa(this)},Mn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var yi=l.JSON.stringify,Yh=l.JSON.parse,Jh=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function Da(){}function Va(){}var Ln={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function bi(){k.call(this,"d")}g(bi,k);function vi(){k.call(this,"c")}g(vi,k);var Bt={},Na=null;function Os(){return Na=Na||new we}Bt.Ia="serverreachability";function Ma(a){k.call(this,Bt.Ia,a)}g(Ma,k);function $n(a){const u=Os();Te(u,new Ma(u))}Bt.STAT_EVENT="statevent";function La(a,u){k.call(this,Bt.STAT_EVENT,a),this.stat=u}g(La,k);function Ae(a){const u=Os();Te(u,new La(u,a))}Bt.Ja="timingevent";function $a(a,u){k.call(this,Bt.Ja,a),this.size=u}g($a,k);function On(a,u){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},u)}function Fn(){this.g=!0}Fn.prototype.ua=function(){this.g=!1};function Xh(a,u,p,y,A,C){a.info(function(){if(a.g)if(C){var M="",Q=C.split("&");for(let ne=0;ne<Q.length;ne++){var fe=Q[ne].split("=");if(fe.length>1){const ge=fe[0];fe=fe[1];const qe=ge.split("_");M=qe.length>=2&&qe[1]=="type"?M+(ge+"="+fe+"&"):M+(ge+"=redacted&")}}}else M=null;else M=C;return"XMLHTTP REQ ("+y+") [attempt "+A+"]: "+u+`
`+p+`
`+M})}function Zh(a,u,p,y,A,C,M){a.info(function(){return"XMLHTTP RESP ("+y+") [ attempt "+A+"]: "+u+`
`+p+`
`+C+" "+M})}function rn(a,u,p,y){a.info(function(){return"XMLHTTP TEXT ("+u+"): "+tp(a,p)+(y?" "+y:"")})}function ep(a,u){a.info(function(){return"TIMEOUT: "+u})}Fn.prototype.info=function(){};function tp(a,u){if(!a.g)return u;if(!u)return null;try{const C=JSON.parse(u);if(C){for(a=0;a<C.length;a++)if(Array.isArray(C[a])){var p=C[a];if(!(p.length<2)){var y=p[1];if(Array.isArray(y)&&!(y.length<1)){var A=y[0];if(A!="noop"&&A!="stop"&&A!="close")for(let M=1;M<y.length;M++)y[M]=""}}}}return yi(C)}catch{return u}}var Fs={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Oa={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Fa;function xi(){}g(xi,Da),xi.prototype.g=function(){return new XMLHttpRequest},Fa=new xi;function Un(a){return encodeURIComponent(String(a))}function np(a){var u=1;a=a.split(":");const p=[];for(;u>0&&a.length;)p.push(a.shift()),u--;return a.length&&p.push(a.join(":")),p}function ut(a,u,p,y){this.j=a,this.i=u,this.l=p,this.S=y||1,this.V=new Mn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ua}function Ua(){this.i=null,this.g="",this.h=!1}var Ba={},wi={};function _i(a,u,p){a.M=1,a.A=Bs(ze(u)),a.u=p,a.R=!0,ja(a,null)}function ja(a,u){a.F=Date.now(),Us(a),a.B=ze(a.A);var p=a.B,y=a.S;Array.isArray(y)||(y=[String(y)]),tl(p.i,"t",y),a.C=0,p=a.j.L,a.h=new Ua,a.g=vl(a.j,p?u:null,!a.u),a.P>0&&(a.O=new Qh(h(a.Y,a,a.g),a.P)),u=a.V,p=a.g,y=a.ba;var A="readystatechange";Array.isArray(A)||(A&&(Ca[0]=A.toString()),A=Ca);for(let C=0;C<A.length;C++){const M=Ia(p,A[C],y||u.handleEvent,!1,u.h||u);if(!M)break;u.g[M.key]=M}u=a.J?_a(a.J):{},a.u?(a.v||(a.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,u)):(a.v="GET",a.g.ea(a.B,a.v,null,u)),$n(),Xh(a.i,a.v,a.B,a.l,a.S,a.u)}ut.prototype.ba=function(a){a=a.target;const u=this.O;u&&ft(a)==3?u.j():this.Y(a)},ut.prototype.Y=function(a){try{if(a==this.g)e:{const Q=ft(this.g),fe=this.g.ya(),ne=this.g.ca();if(!(Q<3)&&(Q!=3||this.g&&(this.h.h||this.g.la()||ll(this.g)))){this.K||Q!=4||fe==7||(fe==8||ne<=0?$n(3):$n(2)),Ei(this);var u=this.g.ca();this.X=u;var p=sp(this);if(this.o=u==200,Zh(this.i,this.v,this.B,this.l,this.S,Q,u),this.o){if(this.U&&!this.L){t:{if(this.g){var y,A=this.g;if((y=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!w(y)){var C=y;break t}}C=null}if(a=C)rn(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,ki(this,a);else{this.o=!1,this.m=3,Ae(12),jt(this),Bn(this);break e}}if(this.R){a=!0;let ge;for(;!this.K&&this.C<p.length;)if(ge=rp(this,p),ge==wi){Q==4&&(this.m=4,Ae(14),a=!1),rn(this.i,this.l,null,"[Incomplete Response]");break}else if(ge==Ba){this.m=4,Ae(15),rn(this.i,this.l,p,"[Invalid Chunk]"),a=!1;break}else rn(this.i,this.l,ge,null),ki(this,ge);if(za(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Q!=4||p.length!=0||this.h.h||(this.m=1,Ae(16),a=!1),this.o=this.o&&a,!a)rn(this.i,this.l,p,"[Invalid Chunked Response]"),jt(this),Bn(this);else if(p.length>0&&!this.W){this.W=!0;var M=this.j;M.g==this&&M.aa&&!M.P&&(M.j.info("Great, no buffering proxy detected. Bytes received: "+p.length),Di(M),M.P=!0,Ae(11))}}else rn(this.i,this.l,p,null),ki(this,p);Q==4&&jt(this),this.o&&!this.K&&(Q==4?ml(this.j,this):(this.o=!1,Us(this)))}else bp(this.g),u==400&&p.indexOf("Unknown SID")>0?(this.m=3,Ae(12)):(this.m=0,Ae(13)),jt(this),Bn(this)}}}catch{}finally{}};function sp(a){if(!za(a))return a.g.la();const u=ll(a.g);if(u==="")return"";let p="";const y=u.length,A=ft(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return jt(a),Bn(a),"";a.h.i=new l.TextDecoder}for(let C=0;C<y;C++)a.h.h=!0,p+=a.h.i.decode(u[C],{stream:!(A&&C==y-1)});return u.length=0,a.h.g+=p,a.C=0,a.h.g}function za(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function rp(a,u){var p=a.C,y=u.indexOf(`
`,p);return y==-1?wi:(p=Number(u.substring(p,y)),isNaN(p)?Ba:(y+=1,y+p>u.length?wi:(u=u.slice(y,y+p),a.C=y+p,u)))}ut.prototype.cancel=function(){this.K=!0,jt(this)};function Us(a){a.T=Date.now()+a.H,qa(a,a.H)}function qa(a,u){if(a.D!=null)throw Error("WatchDog timer not null");a.D=On(h(a.aa,a),u)}function Ei(a){a.D&&(l.clearTimeout(a.D),a.D=null)}ut.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(ep(this.i,this.B),this.M!=2&&($n(),Ae(17)),jt(this),this.m=2,Bn(this)):qa(this,this.T-a)};function Bn(a){a.j.I==0||a.K||ml(a.j,a)}function jt(a){Ei(a);var u=a.O;u&&typeof u.dispose=="function"&&u.dispose(),a.O=null,Pa(a.V),a.g&&(u=a.g,a.g=null,u.abort(),u.dispose())}function ki(a,u){try{var p=a.j;if(p.I!=0&&(p.g==a||Ii(p.h,a))){if(!a.L&&Ii(p.h,a)&&p.I==3){try{var y=p.Ba.g.parse(u)}catch{y=null}if(Array.isArray(y)&&y.length==3){var A=y;if(A[0]==0){e:if(!p.v){if(p.g)if(p.g.F+3e3<a.F)Gs(p),qs(p);else break e;Pi(p),Ae(18)}}else p.xa=A[1],0<p.xa-p.K&&A[2]<37500&&p.F&&p.A==0&&!p.C&&(p.C=On(h(p.Va,p),6e3));Wa(p.h)<=1&&p.ta&&(p.ta=void 0)}else qt(p,11)}else if((a.L||p.g==a)&&Gs(p),!w(u))for(A=p.Ba.g.parse(u),u=0;u<A.length;u++){let ne=A[u];const ge=ne[0];if(!(ge<=p.K))if(p.K=ge,ne=ne[1],p.I==2)if(ne[0]=="c"){p.M=ne[1],p.ba=ne[2];const qe=ne[3];qe!=null&&(p.ka=qe,p.j.info("VER="+p.ka));const Ht=ne[4];Ht!=null&&(p.za=Ht,p.j.info("SVER="+p.za));const mt=ne[5];mt!=null&&typeof mt=="number"&&mt>0&&(y=1.5*mt,p.O=y,p.j.info("backChannelRequestTimeoutMs_="+y)),y=p;const gt=a.g;if(gt){const Ks=gt.g?gt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ks){var C=y.h;C.g||Ks.indexOf("spdy")==-1&&Ks.indexOf("quic")==-1&&Ks.indexOf("h2")==-1||(C.j=C.l,C.g=new Set,C.h&&(Ti(C,C.h),C.h=null))}if(y.G){const Vi=gt.g?gt.g.getResponseHeader("X-HTTP-Session-Id"):null;Vi&&(y.wa=Vi,re(y.J,y.G,Vi))}}p.I=3,p.l&&p.l.ra(),p.aa&&(p.T=Date.now()-a.F,p.j.info("Handshake RTT: "+p.T+"ms")),y=p;var M=a;if(y.na=bl(y,y.L?y.ba:null,y.W),M.L){Ka(y.h,M);var Q=M,fe=y.O;fe&&(Q.H=fe),Q.D&&(Ei(Q),Us(Q)),y.g=M}else pl(y);p.i.length>0&&Hs(p)}else ne[0]!="stop"&&ne[0]!="close"||qt(p,7);else p.I==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?qt(p,7):Ci(p):ne[0]!="noop"&&p.l&&p.l.qa(ne),p.A=0)}}$n(4)}catch{}}var ip=class{constructor(a,u){this.g=a,this.map=u}};function Ha(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Ga(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Wa(a){return a.h?1:a.g?a.g.size:0}function Ii(a,u){return a.h?a.h==u:a.g?a.g.has(u):!1}function Ti(a,u){a.g?a.g.add(u):a.h=u}function Ka(a,u){a.h&&a.h==u?a.h=null:a.g&&a.g.has(u)&&a.g.delete(u)}Ha.prototype.cancel=function(){if(this.i=Qa(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Qa(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let u=a.i;for(const p of a.g.values())u=u.concat(p.G);return u}return v(a.i)}var Ya=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function op(a,u){if(a){a=a.split("&");for(let p=0;p<a.length;p++){const y=a[p].indexOf("=");let A,C=null;y>=0?(A=a[p].substring(0,y),C=a[p].substring(y+1)):A=a[p],u(A,C?decodeURIComponent(C.replace(/\+/g," ")):"")}}}function ht(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;a instanceof ht?(this.l=a.l,jn(this,a.j),this.o=a.o,this.g=a.g,zn(this,a.u),this.h=a.h,Ai(this,nl(a.i)),this.m=a.m):a&&(u=String(a).match(Ya))?(this.l=!1,jn(this,u[1]||"",!0),this.o=qn(u[2]||""),this.g=qn(u[3]||"",!0),zn(this,u[4]),this.h=qn(u[5]||"",!0),Ai(this,u[6]||"",!0),this.m=qn(u[7]||"")):(this.l=!1,this.i=new Gn(null,this.l))}ht.prototype.toString=function(){const a=[];var u=this.j;u&&a.push(Hn(u,Ja,!0),":");var p=this.g;return(p||u=="file")&&(a.push("//"),(u=this.o)&&a.push(Hn(u,Ja,!0),"@"),a.push(Un(p).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.u,p!=null&&a.push(":",String(p))),(p=this.h)&&(this.g&&p.charAt(0)!="/"&&a.push("/"),a.push(Hn(p,p.charAt(0)=="/"?cp:lp,!0))),(p=this.i.toString())&&a.push("?",p),(p=this.m)&&a.push("#",Hn(p,up)),a.join("")},ht.prototype.resolve=function(a){const u=ze(this);let p=!!a.j;p?jn(u,a.j):p=!!a.o,p?u.o=a.o:p=!!a.g,p?u.g=a.g:p=a.u!=null;var y=a.h;if(p)zn(u,a.u);else if(p=!!a.h){if(y.charAt(0)!="/")if(this.g&&!this.h)y="/"+y;else{var A=u.h.lastIndexOf("/");A!=-1&&(y=u.h.slice(0,A+1)+y)}if(A=y,A==".."||A==".")y="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){y=A.lastIndexOf("/",0)==0,A=A.split("/");const C=[];for(let M=0;M<A.length;){const Q=A[M++];Q=="."?y&&M==A.length&&C.push(""):Q==".."?((C.length>1||C.length==1&&C[0]!="")&&C.pop(),y&&M==A.length&&C.push("")):(C.push(Q),y=!0)}y=C.join("/")}else y=A}return p?u.h=y:p=a.i.toString()!=="",p?Ai(u,nl(a.i)):p=!!a.m,p&&(u.m=a.m),u};function ze(a){return new ht(a)}function jn(a,u,p){a.j=p?qn(u,!0):u,a.j&&(a.j=a.j.replace(/:$/,""))}function zn(a,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);a.u=u}else a.u=null}function Ai(a,u,p){u instanceof Gn?(a.i=u,hp(a.i,a.l)):(p||(u=Hn(u,dp)),a.i=new Gn(u,a.l))}function re(a,u,p){a.i.set(u,p)}function Bs(a){return re(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function qn(a,u){return a?u?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Hn(a,u,p){return typeof a=="string"?(a=encodeURI(a).replace(u,ap),p&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function ap(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Ja=/[#\/\?@]/g,lp=/[#\?:]/g,cp=/[#\?]/g,dp=/[#\?@]/g,up=/#/g;function Gn(a,u){this.h=this.g=null,this.i=a||null,this.j=!!u}function zt(a){a.g||(a.g=new Map,a.h=0,a.i&&op(a.i,function(u,p){a.add(decodeURIComponent(u.replace(/\+/g," ")),p)}))}s=Gn.prototype,s.add=function(a,u){zt(this),this.i=null,a=on(this,a);let p=this.g.get(a);return p||this.g.set(a,p=[]),p.push(u),this.h+=1,this};function Xa(a,u){zt(a),u=on(a,u),a.g.has(u)&&(a.i=null,a.h-=a.g.get(u).length,a.g.delete(u))}function Za(a,u){return zt(a),u=on(a,u),a.g.has(u)}s.forEach=function(a,u){zt(this),this.g.forEach(function(p,y){p.forEach(function(A){a.call(u,A,y,this)},this)},this)};function el(a,u){zt(a);let p=[];if(typeof u=="string")Za(a,u)&&(p=p.concat(a.g.get(on(a,u))));else for(a=Array.from(a.g.values()),u=0;u<a.length;u++)p=p.concat(a[u]);return p}s.set=function(a,u){return zt(this),this.i=null,a=on(this,a),Za(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[u]),this.h+=1,this},s.get=function(a,u){return a?(a=el(this,a),a.length>0?String(a[0]):u):u};function tl(a,u,p){Xa(a,u),p.length>0&&(a.i=null,a.g.set(on(a,u),v(p)),a.h+=p.length)}s.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],u=Array.from(this.g.keys());for(let y=0;y<u.length;y++){var p=u[y];const A=Un(p);p=el(this,p);for(let C=0;C<p.length;C++){let M=A;p[C]!==""&&(M+="="+Un(p[C])),a.push(M)}}return this.i=a.join("&")};function nl(a){const u=new Gn;return u.i=a.i,a.g&&(u.g=new Map(a.g),u.h=a.h),u}function on(a,u){return u=String(u),a.j&&(u=u.toLowerCase()),u}function hp(a,u){u&&!a.j&&(zt(a),a.i=null,a.g.forEach(function(p,y){const A=y.toLowerCase();y!=A&&(Xa(this,y),tl(this,A,p))},a)),a.j=u}function pp(a,u){const p=new Fn;if(l.Image){const y=new Image;y.onload=f(pt,p,"TestLoadImage: loaded",!0,u,y),y.onerror=f(pt,p,"TestLoadImage: error",!1,u,y),y.onabort=f(pt,p,"TestLoadImage: abort",!1,u,y),y.ontimeout=f(pt,p,"TestLoadImage: timeout",!1,u,y),l.setTimeout(function(){y.ontimeout&&y.ontimeout()},1e4),y.src=a}else u(!1)}function fp(a,u){const p=new Fn,y=new AbortController,A=setTimeout(()=>{y.abort(),pt(p,"TestPingServer: timeout",!1,u)},1e4);fetch(a,{signal:y.signal}).then(C=>{clearTimeout(A),C.ok?pt(p,"TestPingServer: ok",!0,u):pt(p,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),pt(p,"TestPingServer: error",!1,u)})}function pt(a,u,p,y,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),y(p)}catch{}}function mp(){this.g=new Jh}function Si(a){this.i=a.Sb||null,this.h=a.ab||!1}g(Si,Da),Si.prototype.g=function(){return new js(this.i,this.h)};function js(a,u){we.call(this),this.H=a,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}g(js,we),s=js.prototype,s.open=function(a,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=u,this.readyState=1,Kn(this)},s.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(u.body=a),(this.H||l).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},s.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Wn(this)),this.readyState=0},s.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Kn(this)),this.g&&(this.readyState=3,Kn(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;sl(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function sl(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}s.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var u=a.value?a.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!a.done}))&&(this.response=this.responseText+=u)}a.done?Wn(this):Kn(this),this.readyState==3&&sl(this)}},s.Oa=function(a){this.g&&(this.response=this.responseText=a,Wn(this))},s.Na=function(a){this.g&&(this.response=a,Wn(this))},s.ga=function(){this.g&&Wn(this)};function Wn(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Kn(a)}s.setRequestHeader=function(a,u){this.A.append(a,u)},s.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},s.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],u=this.h.entries();for(var p=u.next();!p.done;)p=p.value,a.push(p[0]+": "+p[1]),p=u.next();return a.join(`\r
`)};function Kn(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(js.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function rl(a){let u="";return Ms(a,function(p,y){u+=y,u+=":",u+=p,u+=`\r
`}),u}function Ri(a,u,p){e:{for(y in p){var y=!1;break e}y=!0}y||(p=rl(p),typeof a=="string"?p!=null&&Un(p):re(a,u,p))}function ae(a){we.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}g(ae,we);var gp=/^https?$/i,yp=["POST","PUT"];s=ae.prototype,s.Fa=function(a){this.H=a},s.ea=function(a,u,p,y){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);u=u?u.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Fa.g(),this.g.onreadystatechange=b(h(this.Ca,this));try{this.B=!0,this.g.open(u,String(a),!0),this.B=!1}catch(C){il(this,C);return}if(a=p||"",p=new Map(this.headers),y)if(Object.getPrototypeOf(y)===Object.prototype)for(var A in y)p.set(A,y[A]);else if(typeof y.keys=="function"&&typeof y.get=="function")for(const C of y.keys())p.set(C,y.get(C));else throw Error("Unknown input type for opt_headers: "+String(y));y=Array.from(p.keys()).find(C=>C.toLowerCase()=="content-type"),A=l.FormData&&a instanceof l.FormData,!(Array.prototype.indexOf.call(yp,u,void 0)>=0)||y||A||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[C,M]of p)this.g.setRequestHeader(C,M);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(C){il(this,C)}};function il(a,u){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=u,a.o=5,ol(a),zs(a)}function ol(a){a.A||(a.A=!0,Te(a,"complete"),Te(a,"error"))}s.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Te(this,"complete"),Te(this,"abort"),zs(this))},s.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zs(this,!0)),ae.Z.N.call(this)},s.Ca=function(){this.u||(this.B||this.v||this.j?al(this):this.Xa())},s.Xa=function(){al(this)};function al(a){if(a.h&&typeof o<"u"){if(a.v&&ft(a)==4)setTimeout(a.Ca.bind(a),0);else if(Te(a,"readystatechange"),ft(a)==4){a.h=!1;try{const C=a.ca();e:switch(C){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var p;if(!(p=u)){var y;if(y=C===0){let M=String(a.D).match(Ya)[1]||null;!M&&l.self&&l.self.location&&(M=l.self.location.protocol.slice(0,-1)),y=!gp.test(M?M.toLowerCase():"")}p=y}if(p)Te(a,"complete"),Te(a,"success");else{a.o=6;try{var A=ft(a)>2?a.g.statusText:""}catch{A=""}a.l=A+" ["+a.ca()+"]",ol(a)}}finally{zs(a)}}}}function zs(a,u){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const p=a.g;a.g=null,u||Te(a,"ready");try{p.onreadystatechange=null}catch{}}}s.isActive=function(){return!!this.g};function ft(a){return a.g?a.g.readyState:0}s.ca=function(){try{return ft(this)>2?this.g.status:-1}catch{return-1}},s.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},s.La=function(a){if(this.g){var u=this.g.responseText;return a&&u.indexOf(a)==0&&(u=u.substring(a.length)),Yh(u)}};function ll(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function bp(a){const u={};a=(a.g&&ft(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let y=0;y<a.length;y++){if(w(a[y]))continue;var p=np(a[y]);const A=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const C=u[A]||[];u[A]=C,C.push(p)}qh(u,function(y){return y.join(", ")})}s.ya=function(){return this.o},s.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Qn(a,u,p){return p&&p.internalChannelParams&&p.internalChannelParams[a]||u}function cl(a){this.za=0,this.i=[],this.j=new Fn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Qn("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Qn("baseRetryDelayMs",5e3,a),this.Za=Qn("retryDelaySeedMs",1e4,a),this.Ta=Qn("forwardChannelMaxRetries",2,a),this.va=Qn("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Ha(a&&a.concurrentRequestLimit),this.Ba=new mp,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}s=cl.prototype,s.ka=8,s.I=1,s.connect=function(a,u,p,y){Ae(0),this.W=a,this.H=u||{},p&&y!==void 0&&(this.H.OSID=p,this.H.OAID=y),this.F=this.X,this.J=bl(this,null,this.W),Hs(this)};function Ci(a){if(dl(a),a.I==3){var u=a.V++,p=ze(a.J);if(re(p,"SID",a.M),re(p,"RID",u),re(p,"TYPE","terminate"),Yn(a,p),u=new ut(a,a.j,u),u.M=2,u.A=Bs(ze(p)),p=!1,l.navigator&&l.navigator.sendBeacon)try{p=l.navigator.sendBeacon(u.A.toString(),"")}catch{}!p&&l.Image&&(new Image().src=u.A,p=!0),p||(u.g=vl(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Us(u)}yl(a)}function qs(a){a.g&&(Di(a),a.g.cancel(),a.g=null)}function dl(a){qs(a),a.v&&(l.clearTimeout(a.v),a.v=null),Gs(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&l.clearTimeout(a.m),a.m=null)}function Hs(a){if(!Ga(a.h)&&!a.m){a.m=!0;var u=a.Ea;G||x(),Z||(G(),Z=!0),E.add(u,a),a.D=0}}function vp(a,u){return Wa(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=u.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=On(h(a.Ea,a,u),gl(a,a.D)),a.D++,!0)}s.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const A=new ut(this,this.j,a);let C=this.o;if(this.U&&(C?(C=_a(C),ka(C,this.U)):C=this.U),this.u!==null||this.R||(A.J=C,C=null),this.S)e:{for(var u=0,p=0;p<this.i.length;p++){t:{var y=this.i[p];if("__data__"in y.map&&(y=y.map.__data__,typeof y=="string")){y=y.length;break t}y=void 0}if(y===void 0)break;if(u+=y,u>4096){u=p;break e}if(u===4096||p===this.i.length-1){u=p+1;break e}}u=1e3}else u=1e3;u=hl(this,A,u),p=ze(this.J),re(p,"RID",a),re(p,"CVER",22),this.G&&re(p,"X-HTTP-Session-Id",this.G),Yn(this,p),C&&(this.R?u="headers="+Un(rl(C))+"&"+u:this.u&&Ri(p,this.u,C)),Ti(this.h,A),this.Ra&&re(p,"TYPE","init"),this.S?(re(p,"$req",u),re(p,"SID","null"),A.U=!0,_i(A,p,null)):_i(A,p,u),this.I=2}}else this.I==3&&(a?ul(this,a):this.i.length==0||Ga(this.h)||ul(this))};function ul(a,u){var p;u?p=u.l:p=a.V++;const y=ze(a.J);re(y,"SID",a.M),re(y,"RID",p),re(y,"AID",a.K),Yn(a,y),a.u&&a.o&&Ri(y,a.u,a.o),p=new ut(a,a.j,p,a.D+1),a.u===null&&(p.J=a.o),u&&(a.i=u.G.concat(a.i)),u=hl(a,p,1e3),p.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Ti(a.h,p),_i(p,y,u)}function Yn(a,u){a.H&&Ms(a.H,function(p,y){re(u,y,p)}),a.l&&Ms({},function(p,y){re(u,y,p)})}function hl(a,u,p){p=Math.min(a.i.length,p);const y=a.l?h(a.l.Ka,a.l,a):null;e:{var A=a.i;let Q=-1;for(;;){const fe=["count="+p];Q==-1?p>0?(Q=A[0].g,fe.push("ofs="+Q)):Q=0:fe.push("ofs="+Q);let ne=!0;for(let ge=0;ge<p;ge++){var C=A[ge].g;const qe=A[ge].map;if(C-=Q,C<0)Q=Math.max(0,A[ge].g-100),ne=!1;else try{C="req"+C+"_"||"";try{var M=qe instanceof Map?qe:Object.entries(qe);for(const[Ht,mt]of M){let gt=mt;c(mt)&&(gt=yi(mt)),fe.push(C+Ht+"="+encodeURIComponent(gt))}}catch(Ht){throw fe.push(C+"type="+encodeURIComponent("_badmap")),Ht}}catch{y&&y(qe)}}if(ne){M=fe.join("&");break e}}M=void 0}return a=a.i.splice(0,p),u.G=a,M}function pl(a){if(!a.g&&!a.v){a.Y=1;var u=a.Da;G||x(),Z||(G(),Z=!0),E.add(u,a),a.A=0}}function Pi(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=On(h(a.Da,a),gl(a,a.A)),a.A++,!0)}s.Da=function(){if(this.v=null,fl(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=On(h(this.Wa,this),a)}},s.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Ae(10),qs(this),fl(this))};function Di(a){a.B!=null&&(l.clearTimeout(a.B),a.B=null)}function fl(a){a.g=new ut(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var u=ze(a.na);re(u,"RID","rpc"),re(u,"SID",a.M),re(u,"AID",a.K),re(u,"CI",a.F?"0":"1"),!a.F&&a.ia&&re(u,"TO",a.ia),re(u,"TYPE","xmlhttp"),Yn(a,u),a.u&&a.o&&Ri(u,a.u,a.o),a.O&&(a.g.H=a.O);var p=a.g;a=a.ba,p.M=1,p.A=Bs(ze(u)),p.u=null,p.R=!0,ja(p,a)}s.Va=function(){this.C!=null&&(this.C=null,qs(this),Pi(this),Ae(19))};function Gs(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function ml(a,u){var p=null;if(a.g==u){Gs(a),Di(a),a.g=null;var y=2}else if(Ii(a.h,u))p=u.G,Ka(a.h,u),y=1;else return;if(a.I!=0){if(u.o)if(y==1){p=u.u?u.u.length:0,u=Date.now()-u.F;var A=a.D;y=Os(),Te(y,new $a(y,p)),Hs(a)}else pl(a);else if(A=u.m,A==3||A==0&&u.X>0||!(y==1&&vp(a,u)||y==2&&Pi(a)))switch(p&&p.length>0&&(u=a.h,u.i=u.i.concat(p)),A){case 1:qt(a,5);break;case 4:qt(a,10);break;case 3:qt(a,6);break;default:qt(a,2)}}}function gl(a,u){let p=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(p*=2),p*u}function qt(a,u){if(a.j.info("Error code "+u),u==2){var p=h(a.bb,a),y=a.Ua;const A=!y;y=new ht(y||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||jn(y,"https"),Bs(y),A?pp(y.toString(),p):fp(y.toString(),p)}else Ae(2);a.I=0,a.l&&a.l.pa(u),yl(a),dl(a)}s.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Ae(2)):(this.j.info("Failed to ping google.com"),Ae(1))};function yl(a){if(a.I=0,a.ja=[],a.l){const u=Qa(a.h);(u.length!=0||a.i.length!=0)&&(T(a.ja,u),T(a.ja,a.i),a.h.i.length=0,v(a.i),a.i.length=0),a.l.oa()}}function bl(a,u,p){var y=p instanceof ht?ze(p):new ht(p);if(y.g!="")u&&(y.g=u+"."+y.g),zn(y,y.u);else{var A=l.location;y=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const C=new ht(null);y&&jn(C,y),u&&(C.g=u),A&&zn(C,A),p&&(C.h=p),y=C}return p=a.G,u=a.wa,p&&u&&re(y,p,u),re(y,"VER",a.ka),Yn(a,y),y}function vl(a,u,p){if(u&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=a.Aa&&!a.ma?new ae(new Si({ab:p})):new ae(a.ma),u.Fa(a.L),u}s.isActive=function(){return!!this.l&&this.l.isActive(this)};function xl(){}s=xl.prototype,s.ra=function(){},s.qa=function(){},s.pa=function(){},s.oa=function(){},s.isActive=function(){return!0},s.Ka=function(){};function Ws(){}Ws.prototype.g=function(a,u){return new De(a,u)};function De(a,u){we.call(this),this.g=new cl(u),this.l=a,this.h=u&&u.messageUrlParams||null,a=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(a?a["X-WebChannel-Content-Type"]=u.messageContentType:a={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(a?a["X-WebChannel-Client-Profile"]=u.sa:a={"X-WebChannel-Client-Profile":u.sa}),this.g.U=a,(a=u&&u.Qb)&&!w(a)&&(this.g.u=a),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!w(u)&&(this.g.G=u,a=this.h,a!==null&&u in a&&(a=this.h,u in a&&delete a[u])),this.j=new an(this)}g(De,we),De.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},De.prototype.close=function(){Ci(this.g)},De.prototype.o=function(a){var u=this.g;if(typeof a=="string"){var p={};p.__data__=a,a=p}else this.v&&(p={},p.__data__=yi(a),a=p);u.i.push(new ip(u.Ya++,a)),u.I==3&&Hs(u)},De.prototype.N=function(){this.g.l=null,delete this.j,Ci(this.g),delete this.g,De.Z.N.call(this)};function wl(a){bi.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var u=a.__sm__;if(u){e:{for(const p in u){a=p;break e}a=void 0}(this.i=a)&&(a=this.i,u=u!==null&&a in u?u[a]:void 0),this.data=u}else this.data=a}g(wl,bi);function _l(){vi.call(this),this.status=1}g(_l,vi);function an(a){this.g=a}g(an,xl),an.prototype.ra=function(){Te(this.g,"a")},an.prototype.qa=function(a){Te(this.g,new wl(a))},an.prototype.pa=function(a){Te(this.g,new _l)},an.prototype.oa=function(){Te(this.g,"b")},Ws.prototype.createWebChannel=Ws.prototype.g,De.prototype.send=De.prototype.o,De.prototype.open=De.prototype.m,De.prototype.close=De.prototype.close,wd=function(){return new Ws},xd=function(){return Os()},vd=Bt,no={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Fs.NO_ERROR=0,Fs.TIMEOUT=8,Fs.HTTP_ERROR=6,rr=Fs,Oa.COMPLETE="complete",bd=Oa,Va.EventType=Ln,Ln.OPEN="a",Ln.CLOSE="b",Ln.ERROR="c",Ln.MESSAGE="d",we.prototype.listen=we.prototype.J,Xn=Va,ae.prototype.listenOnce=ae.prototype.K,ae.prototype.getLastError=ae.prototype.Ha,ae.prototype.getLastErrorCode=ae.prototype.ya,ae.prototype.getStatus=ae.prototype.ca,ae.prototype.getResponseJson=ae.prototype.La,ae.prototype.getResponseText=ae.prototype.la,ae.prototype.send=ae.prototype.ea,ae.prototype.setWithCredentials=ae.prototype.Fa,yd=ae}).apply(typeof Qs<"u"?Qs:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */let Rn="12.12.0";function rm(s){Rn=s}/**
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
 */const Xt=new Io("@firebase/firestore");function dn(){return Xt.logLevel}function O(s,...e){if(Xt.logLevel<=Y.DEBUG){const n=e.map(So);Xt.debug(`Firestore (${Rn}): ${s}`,...n)}}function it(s,...e){if(Xt.logLevel<=Y.ERROR){const n=e.map(So);Xt.error(`Firestore (${Rn}): ${s}`,...n)}}function wn(s,...e){if(Xt.logLevel<=Y.WARN){const n=e.map(So);Xt.warn(`Firestore (${Rn}): ${s}`,...n)}}function So(s){if(typeof s=="string")return s;try{return(function(n){return JSON.stringify(n)})(s)}catch{return s}}/**
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
 */function z(s,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,_d(s,r,n)}function _d(s,e,n){let r=`FIRESTORE (${Rn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${s.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw it(r),new Error(r)}function te(s,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,s||_d(e,i,r)}function K(s,e){return s}/**
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
 */const D={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends dt{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class st{constructor(){this.promise=new Promise(((e,n)=>{this.resolve=e,this.reject=n}))}}/**
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
 */class im{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class om{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable((()=>n(Re.UNAUTHENTICATED)))}shutdown(){}}class am{constructor(e){this.t=e,this.currentUser=Re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){te(this.o===void 0,42304);let r=this.i;const i=d=>this.i!==r?(r=this.i,n(d)):Promise.resolve();let o=new st;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new st,e.enqueueRetryable((()=>i(this.currentUser)))};const l=()=>{const d=o;e.enqueueRetryable((async()=>{await d.promise,await i(this.currentUser)}))},c=d=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=d,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((d=>c(d))),setTimeout((()=>{if(!this.auth){const d=this.t.getImmediate({optional:!0});d?c(d):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new st)}}),0),l()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then((r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(te(typeof r.accessToken=="string",31837,{l:r}),new im(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return te(e===null||typeof e=="string",2055,{h:e}),new Re(e)}}class lm{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=Re.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class cm{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new lm(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable((()=>n(Re.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Nl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class dm{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Oe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){te(this.o===void 0,3512);const r=o=>{o.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const l=o.token!==this.m;return this.m=o.token,O("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?n(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>r(o)))};const i=o=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>i(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?i(o):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Nl(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((n=>n?(te(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new Nl(n.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function um(s){const e=typeof self<"u"&&(self.crypto||self.msCrypto),n=new Uint8Array(s);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<s;r++)n[r]=Math.floor(256*Math.random());return n}/**
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
 */class Ro{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=um(40);for(let o=0;o<i.length;++o)r.length<20&&i[o]<n&&(r+=e.charAt(i[o]%62))}return r}}function J(s,e){return s<e?-1:s>e?1:0}function so(s,e){const n=Math.min(s.length,e.length);for(let r=0;r<n;r++){const i=s.charAt(r),o=e.charAt(r);if(i!==o)return Fi(i)===Fi(o)?J(i,o):Fi(i)?1:-1}return J(s.length,e.length)}const hm=55296,pm=57343;function Fi(s){const e=s.charCodeAt(0);return e>=hm&&e<=pm}function _n(s,e,n){return s.length===e.length&&s.every(((r,i)=>n(r,e[i])))}/**
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
 */const Ml="__name__";class He{constructor(e,n,r){n===void 0?n=0:n>e.length&&z(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&z(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return He.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof He?e.forEach((r=>{n.push(r)})):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const o=He.compareSegments(e.get(i),n.get(i));if(o!==0)return o}return J(e.length,n.length)}static compareSegments(e,n){const r=He.isNumericId(e),i=He.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?He.extractNumericId(e).compare(He.extractNumericId(n)):so(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return At.fromString(e.substring(4,e.length-2))}}class se extends He{construct(e,n,r){return new se(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new $(D.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter((i=>i.length>0)))}return new se(n)}static emptyPath(){return new se([])}}const fm=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ve extends He{construct(e,n,r){return new ve(e,n,r)}static isValidIdentifier(e){return fm.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ve.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ml}static keyField(){return new ve([Ml])}static fromServerFormat(e){const n=[];let r="",i=0;const o=()=>{if(r.length===0)throw new $(D.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let l=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new $(D.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const d=e[i+1];if(d!=="\\"&&d!=="."&&d!=="`")throw new $(D.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=d,i+=2}else c==="`"?(l=!l,i++):c!=="."||l?(r+=c,i++):(o(),i++)}if(o(),l)throw new $(D.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ve(n)}static emptyPath(){return new ve([])}}/**
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
 */class B{constructor(e){this.path=e}static fromPath(e){return new B(se.fromString(e))}static fromName(e){return new B(se.fromString(e).popFirst(5))}static empty(){return new B(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return se.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new B(new se(e.slice()))}}/**
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
 */function Ed(s,e,n){if(!n)throw new $(D.INVALID_ARGUMENT,`Function ${s}() cannot be called with an empty ${e}.`)}function mm(s,e,n,r){if(e===!0&&r===!0)throw new $(D.INVALID_ARGUMENT,`${s} and ${n} cannot be used together.`)}function Ll(s){if(!B.isDocumentKey(s))throw new $(D.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${s} has ${s.length}.`)}function $l(s){if(B.isDocumentKey(s))throw new $(D.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${s} has ${s.length}.`)}function kd(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}function Or(s){if(s===void 0)return"undefined";if(s===null)return"null";if(typeof s=="string")return s.length>20&&(s=`${s.substring(0,20)}...`),JSON.stringify(s);if(typeof s=="number"||typeof s=="boolean")return""+s;if(typeof s=="object"){if(s instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(s);return e?`a custom ${e} object`:"an object"}}return typeof s=="function"?"a function":z(12329,{type:typeof s})}function Ne(s,e){if("_delegate"in s&&(s=s._delegate),!(s instanceof e)){if(e.name===s.constructor.name)throw new $(D.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Or(s);throw new $(D.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return s}/**
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
 */function pe(s,e){const n={typeString:s};return e&&(n.value=e),n}function Is(s,e){if(!kd(s))throw new $(D.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in s)){n=`JSON missing required field: '${r}'`;break}const l=s[r];if(i&&typeof l!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(o!==void 0&&l!==o.value){n=`Expected '${r}' field to equal '${o.value}'`;break}}if(n)throw new $(D.INVALID_ARGUMENT,n);return!0}/**
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
 */const Ol=-62135596800,Fl=1e6;class ie{static now(){return ie.fromMillis(Date.now())}static fromDate(e){return ie.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Fl);return new ie(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new $(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new $(D.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<Ol)throw new $(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(D.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Fl}_compareTo(e){return this.seconds===e.seconds?J(this.nanoseconds,e.nanoseconds):J(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ie._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Is(e,ie._jsonSchema))return new ie(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ol;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ie._jsonSchemaVersion="firestore/timestamp/1.0",ie._jsonSchema={type:pe("string",ie._jsonSchemaVersion),seconds:pe("number"),nanoseconds:pe("number")};/**
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
 */const us=-1;function gm(s,e){const n=s.toTimestamp().seconds,r=s.toTimestamp().nanoseconds+1,i=W.fromTimestamp(r===1e9?new ie(n+1,0):new ie(n,r));return new Ct(i,B.empty(),e)}function ym(s){return new Ct(s.readTime,s.key,us)}class Ct{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Ct(W.min(),B.empty(),us)}static max(){return new Ct(W.max(),B.empty(),us)}}function bm(s,e){let n=s.readTime.compareTo(e.readTime);return n!==0?n:(n=B.comparator(s.documentKey,e.documentKey),n!==0?n:J(s.largestBatchId,e.largestBatchId))}/**
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
 */const vm="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class xm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function Cn(s){if(s.code!==D.FAILED_PRECONDITION||s.message!==vm)throw s;O("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class V{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)}),(n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)}))}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&z(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new V(((r,i)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,i)},this.catchCallback=o=>{this.wrapFailure(n,o).next(r,i)}}))}toPromise(){return new Promise(((e,n)=>{this.next(e,n)}))}wrapUserFunction(e){try{const n=e();return n instanceof V?n:V.resolve(n)}catch(n){return V.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction((()=>e(n))):V.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction((()=>e(n))):V.reject(n)}static resolve(e){return new V(((n,r)=>{n(e)}))}static reject(e){return new V(((n,r)=>{r(e)}))}static waitFor(e){return new V(((n,r)=>{let i=0,o=0,l=!1;e.forEach((c=>{++i,c.next((()=>{++o,l&&o===i&&n()}),(d=>r(d)))})),l=!0,o===i&&n()}))}static or(e){let n=V.resolve(!1);for(const r of e)n=n.next((i=>i?V.resolve(i):r()));return n}static forEach(e,n){const r=[];return e.forEach(((i,o)=>{r.push(n.call(this,i,o))})),this.waitFor(r)}static mapArray(e,n){return new V(((r,i)=>{const o=e.length,l=new Array(o);let c=0;for(let d=0;d<o;d++){const h=d;n(e[h]).next((f=>{l[h]=f,++c,c===o&&r(l)}),(f=>i(f)))}}))}static doWhile(e,n){return new V(((r,i)=>{const o=()=>{e()===!0?n().next((()=>{o()}),i):r()};o()}))}}function wm(s){const e=s.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Pn(s){return s.name==="IndexedDbTransactionError"}/**
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
 */class Fr{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>n.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Fr.ce=-1;/**
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
 */const Co=-1;function Ur(s){return s==null}function gr(s){return s===0&&1/s==-1/0}function _m(s){return typeof s=="number"&&Number.isInteger(s)&&!gr(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER}/**
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
 */const Id="";function Em(s){let e="";for(let n=0;n<s.length;n++)e.length>0&&(e=Ul(e)),e=km(s.get(n),e);return Ul(e)}function km(s,e){let n=e;const r=s.length;for(let i=0;i<r;i++){const o=s.charAt(i);switch(o){case"\0":n+="";break;case Id:n+="";break;default:n+=o}}return n}function Ul(s){return s+Id+""}/**
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
 */function Bl(s){let e=0;for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&e++;return e}function $t(s,e){for(const n in s)Object.prototype.hasOwnProperty.call(s,n)&&e(n,s[n])}function Td(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}/**
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
 */class oe{constructor(e,n){this.comparator=e,this.root=n||be.EMPTY}insert(e,n){return new oe(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,be.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,be.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((n,r)=>(e(n,r),!1)))}toString(){const e=[];return this.inorderTraversal(((n,r)=>(e.push(`${n}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ys(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ys(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ys(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ys(this.root,e,this.comparator,!0)}}class Ys{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=n?r(e.key,n):1,n&&i&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class be{constructor(e,n,r,i,o){this.key=e,this.value=n,this.color=r??be.RED,this.left=i??be.EMPTY,this.right=o??be.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,o){return new be(e??this.key,n??this.value,r??this.color,i??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const o=r(e,i.key);return i=o<0?i.copy(null,null,null,i.left.insert(e,n,r),null):o===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return be.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return be.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,be.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,be.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw z(43730,{key:this.key,value:this.value});if(this.right.isRed())throw z(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw z(27949);return e+(this.isRed()?0:1)}}be.EMPTY=null,be.RED=!0,be.BLACK=!1;be.EMPTY=new class{constructor(){this.size=0}get key(){throw z(57766)}get value(){throw z(16141)}get color(){throw z(16727)}get left(){throw z(29726)}get right(){throw z(36894)}copy(e,n,r,i,o){return this}insert(e,n,r){return new be(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class me{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((n,r)=>(e(n),!1)))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new jl(this.data.getIterator())}getIteratorFrom(e){return new jl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach((r=>{n=n.add(r)})),n}isEqual(e){if(!(e instanceof me)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,o=r.getNext().key;if(this.comparator(i,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((n=>{e.push(n)})),e}toString(){const e=[];return this.forEach((n=>e.push(n))),"SortedSet("+e.toString()+")"}copy(e){const n=new me(this.comparator);return n.data=e,n}}class jl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Ve{constructor(e){this.fields=e,e.sort(ve.comparator)}static empty(){return new Ve([])}unionWith(e){let n=new me(ve.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new Ve(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return _n(this.fields,e.fields,((n,r)=>n.isEqual(r)))}}/**
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
 */class Ad extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class xe{constructor(e){this.binaryString=e}static fromBase64String(e){const n=(function(i){try{return atob(i)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Ad("Invalid base64 string: "+o):o}})(e);return new xe(n)}static fromUint8Array(e){const n=(function(i){let o="";for(let l=0;l<i.length;++l)o+=String.fromCharCode(i[l]);return o})(e);return new xe(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(n){return btoa(n)})(this.binaryString)}toUint8Array(){return(function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return J(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}xe.EMPTY_BYTE_STRING=new xe("");const Im=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Pt(s){if(te(!!s,39018),typeof s=="string"){let e=0;const n=Im.exec(s);if(te(!!n,46558,{timestamp:s}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(s);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:de(s.seconds),nanos:de(s.nanos)}}function de(s){return typeof s=="number"?s:typeof s=="string"?Number(s):0}function Dt(s){return typeof s=="string"?xe.fromBase64String(s):xe.fromUint8Array(s)}/**
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
 */const Sd="server_timestamp",Rd="__type__",Cd="__previous_value__",Pd="__local_write_time__";function Po(s){var n,r;return((r=(((n=s==null?void 0:s.mapValue)==null?void 0:n.fields)||{})[Rd])==null?void 0:r.stringValue)===Sd}function Br(s){const e=s.mapValue.fields[Cd];return Po(e)?Br(e):e}function hs(s){const e=Pt(s.mapValue.fields[Pd].timestampValue);return new ie(e.seconds,e.nanos)}/**
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
 */class Tm{constructor(e,n,r,i,o,l,c,d,h,f,g){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=o,this.forceLongPolling=l,this.autoDetectLongPolling=c,this.longPollingOptions=d,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=g}}const yr="(default)";class ps{constructor(e,n){this.projectId=e,this.database=n||yr}static empty(){return new ps("","")}get isDefaultDatabase(){return this.database===yr}isEqual(e){return e instanceof ps&&e.projectId===this.projectId&&e.database===this.database}}function Am(s,e){if(!Object.prototype.hasOwnProperty.apply(s.options,["projectId"]))throw new $(D.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ps(s.options.projectId,e)}/**
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
 */const Dd="__type__",Sm="__max__",Js={mapValue:{}},Vd="__vector__",br="value";function Vt(s){return"nullValue"in s?0:"booleanValue"in s?1:"integerValue"in s||"doubleValue"in s?2:"timestampValue"in s?3:"stringValue"in s?5:"bytesValue"in s?6:"referenceValue"in s?7:"geoPointValue"in s?8:"arrayValue"in s?9:"mapValue"in s?Po(s)?4:Cm(s)?9007199254740991:Rm(s)?10:11:z(28295,{value:s})}function Ze(s,e){if(s===e)return!0;const n=Vt(s);if(n!==Vt(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return s.booleanValue===e.booleanValue;case 4:return hs(s).isEqual(hs(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const l=Pt(i.timestampValue),c=Pt(o.timestampValue);return l.seconds===c.seconds&&l.nanos===c.nanos})(s,e);case 5:return s.stringValue===e.stringValue;case 6:return(function(i,o){return Dt(i.bytesValue).isEqual(Dt(o.bytesValue))})(s,e);case 7:return s.referenceValue===e.referenceValue;case 8:return(function(i,o){return de(i.geoPointValue.latitude)===de(o.geoPointValue.latitude)&&de(i.geoPointValue.longitude)===de(o.geoPointValue.longitude)})(s,e);case 2:return(function(i,o){if("integerValue"in i&&"integerValue"in o)return de(i.integerValue)===de(o.integerValue);if("doubleValue"in i&&"doubleValue"in o){const l=de(i.doubleValue),c=de(o.doubleValue);return l===c?gr(l)===gr(c):isNaN(l)&&isNaN(c)}return!1})(s,e);case 9:return _n(s.arrayValue.values||[],e.arrayValue.values||[],Ze);case 10:case 11:return(function(i,o){const l=i.mapValue.fields||{},c=o.mapValue.fields||{};if(Bl(l)!==Bl(c))return!1;for(const d in l)if(l.hasOwnProperty(d)&&(c[d]===void 0||!Ze(l[d],c[d])))return!1;return!0})(s,e);default:return z(52216,{left:s})}}function fs(s,e){return(s.values||[]).find((n=>Ze(n,e)))!==void 0}function En(s,e){if(s===e)return 0;const n=Vt(s),r=Vt(e);if(n!==r)return J(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return J(s.booleanValue,e.booleanValue);case 2:return(function(o,l){const c=de(o.integerValue||o.doubleValue),d=de(l.integerValue||l.doubleValue);return c<d?-1:c>d?1:c===d?0:isNaN(c)?isNaN(d)?0:-1:1})(s,e);case 3:return zl(s.timestampValue,e.timestampValue);case 4:return zl(hs(s),hs(e));case 5:return so(s.stringValue,e.stringValue);case 6:return(function(o,l){const c=Dt(o),d=Dt(l);return c.compareTo(d)})(s.bytesValue,e.bytesValue);case 7:return(function(o,l){const c=o.split("/"),d=l.split("/");for(let h=0;h<c.length&&h<d.length;h++){const f=J(c[h],d[h]);if(f!==0)return f}return J(c.length,d.length)})(s.referenceValue,e.referenceValue);case 8:return(function(o,l){const c=J(de(o.latitude),de(l.latitude));return c!==0?c:J(de(o.longitude),de(l.longitude))})(s.geoPointValue,e.geoPointValue);case 9:return ql(s.arrayValue,e.arrayValue);case 10:return(function(o,l){var b,v,T,R;const c=o.fields||{},d=l.fields||{},h=(b=c[br])==null?void 0:b.arrayValue,f=(v=d[br])==null?void 0:v.arrayValue,g=J(((T=h==null?void 0:h.values)==null?void 0:T.length)||0,((R=f==null?void 0:f.values)==null?void 0:R.length)||0);return g!==0?g:ql(h,f)})(s.mapValue,e.mapValue);case 11:return(function(o,l){if(o===Js.mapValue&&l===Js.mapValue)return 0;if(o===Js.mapValue)return 1;if(l===Js.mapValue)return-1;const c=o.fields||{},d=Object.keys(c),h=l.fields||{},f=Object.keys(h);d.sort(),f.sort();for(let g=0;g<d.length&&g<f.length;++g){const b=so(d[g],f[g]);if(b!==0)return b;const v=En(c[d[g]],h[f[g]]);if(v!==0)return v}return J(d.length,f.length)})(s.mapValue,e.mapValue);default:throw z(23264,{he:n})}}function zl(s,e){if(typeof s=="string"&&typeof e=="string"&&s.length===e.length)return J(s,e);const n=Pt(s),r=Pt(e),i=J(n.seconds,r.seconds);return i!==0?i:J(n.nanos,r.nanos)}function ql(s,e){const n=s.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const o=En(n[i],r[i]);if(o)return o}return J(n.length,r.length)}function kn(s){return ro(s)}function ro(s){return"nullValue"in s?"null":"booleanValue"in s?""+s.booleanValue:"integerValue"in s?""+s.integerValue:"doubleValue"in s?""+s.doubleValue:"timestampValue"in s?(function(n){const r=Pt(n);return`time(${r.seconds},${r.nanos})`})(s.timestampValue):"stringValue"in s?s.stringValue:"bytesValue"in s?(function(n){return Dt(n).toBase64()})(s.bytesValue):"referenceValue"in s?(function(n){return B.fromName(n).toString()})(s.referenceValue):"geoPointValue"in s?(function(n){return`geo(${n.latitude},${n.longitude})`})(s.geoPointValue):"arrayValue"in s?(function(n){let r="[",i=!0;for(const o of n.values||[])i?i=!1:r+=",",r+=ro(o);return r+"]"})(s.arrayValue):"mapValue"in s?(function(n){const r=Object.keys(n.fields||{}).sort();let i="{",o=!0;for(const l of r)o?o=!1:i+=",",i+=`${l}:${ro(n.fields[l])}`;return i+"}"})(s.mapValue):z(61005,{value:s})}function ir(s){switch(Vt(s)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Br(s);return e?16+ir(e):16;case 5:return 2*s.stringValue.length;case 6:return Dt(s.bytesValue).approximateByteSize();case 7:return s.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((i,o)=>i+ir(o)),0)})(s.arrayValue);case 10:case 11:return(function(r){let i=0;return $t(r.fields,((o,l)=>{i+=o.length+ir(l)})),i})(s.mapValue);default:throw z(13486,{value:s})}}function Hl(s,e){return{referenceValue:`projects/${s.projectId}/databases/${s.database}/documents/${e.path.canonicalString()}`}}function io(s){return!!s&&"integerValue"in s}function Do(s){return!!s&&"arrayValue"in s}function Gl(s){return!!s&&"nullValue"in s}function Wl(s){return!!s&&"doubleValue"in s&&isNaN(Number(s.doubleValue))}function or(s){return!!s&&"mapValue"in s}function Rm(s){var n,r;return((r=(((n=s==null?void 0:s.mapValue)==null?void 0:n.fields)||{})[Dd])==null?void 0:r.stringValue)===Vd}function ns(s){if(s.geoPointValue)return{geoPointValue:{...s.geoPointValue}};if(s.timestampValue&&typeof s.timestampValue=="object")return{timestampValue:{...s.timestampValue}};if(s.mapValue){const e={mapValue:{fields:{}}};return $t(s.mapValue.fields,((n,r)=>e.mapValue.fields[n]=ns(r))),e}if(s.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(s.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=ns(s.arrayValue.values[n]);return e}return{...s}}function Cm(s){return(((s.mapValue||{}).fields||{}).__type__||{}).stringValue===Sm}/**
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
 */class Pe{constructor(e){this.value=e}static empty(){return new Pe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!or(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=ns(n)}setAll(e){let n=ve.emptyPath(),r={},i=[];e.forEach(((l,c)=>{if(!n.isImmediateParentOf(c)){const d=this.getFieldsMap(n);this.applyChanges(d,r,i),r={},i=[],n=c.popLast()}l?r[c.lastSegment()]=ns(l):i.push(c.lastSegment())}));const o=this.getFieldsMap(n);this.applyChanges(o,r,i)}delete(e){const n=this.field(e.popLast());or(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Ze(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];or(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){$t(n,((i,o)=>e[i]=o));for(const i of r)delete e[i]}clone(){return new Pe(ns(this.value))}}function Nd(s){const e=[];return $t(s.fields,((n,r)=>{const i=new ve([n]);if(or(r)){const o=Nd(r.mapValue).fields;if(o.length===0)e.push(i);else for(const l of o)e.push(i.child(l))}else e.push(i)})),new Ve(e)}/**
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
 */class vr{constructor(e,n){this.position=e,this.inclusive=n}}function Kl(s,e,n){let r=0;for(let i=0;i<s.position.length;i++){const o=e[i],l=s.position[i];if(o.field.isKeyField()?r=B.comparator(B.fromName(l.referenceValue),n.key):r=En(l,n.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Ql(s,e){if(s===null)return e===null;if(e===null||s.inclusive!==e.inclusive||s.position.length!==e.position.length)return!1;for(let n=0;n<s.position.length;n++)if(!Ze(s.position[n],e.position[n]))return!1;return!0}/**
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
 */class ms{constructor(e,n="asc"){this.field=e,this.dir=n}}function Pm(s,e){return s.dir===e.dir&&s.field.isEqual(e.field)}/**
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
 */class Md{}class he extends Md{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new Vm(e,n,r):n==="array-contains"?new Lm(e,r):n==="in"?new $m(e,r):n==="not-in"?new Om(e,r):n==="array-contains-any"?new Fm(e,r):new he(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new Nm(e,r):new Mm(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(En(n,this.value)):n!==null&&Vt(this.value)===Vt(n)&&this.matchesComparison(En(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return z(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Be extends Md{constructor(e,n){super(),this.filters=e,this.op=n,this.Pe=null}static create(e,n){return new Be(e,n)}matches(e){return Ld(this)?this.filters.find((n=>!n.matches(e)))===void 0:this.filters.find((n=>n.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,n)=>e.concat(n.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Ld(s){return s.op==="and"}function $d(s){return Dm(s)&&Ld(s)}function Dm(s){for(const e of s.filters)if(e instanceof Be)return!1;return!0}function oo(s){if(s instanceof he)return s.field.canonicalString()+s.op.toString()+kn(s.value);if($d(s))return s.filters.map((e=>oo(e))).join(",");{const e=s.filters.map((n=>oo(n))).join(",");return`${s.op}(${e})`}}function Od(s,e){return s instanceof he?(function(r,i){return i instanceof he&&r.op===i.op&&r.field.isEqual(i.field)&&Ze(r.value,i.value)})(s,e):s instanceof Be?(function(r,i){return i instanceof Be&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce(((o,l,c)=>o&&Od(l,i.filters[c])),!0):!1})(s,e):void z(19439)}function Fd(s){return s instanceof he?(function(n){return`${n.field.canonicalString()} ${n.op} ${kn(n.value)}`})(s):s instanceof Be?(function(n){return n.op.toString()+" {"+n.getFilters().map(Fd).join(" ,")+"}"})(s):"Filter"}class Vm extends he{constructor(e,n,r){super(e,n,r),this.key=B.fromName(r.referenceValue)}matches(e){const n=B.comparator(e.key,this.key);return this.matchesComparison(n)}}class Nm extends he{constructor(e,n){super(e,"in",n),this.keys=Ud("in",n)}matches(e){return this.keys.some((n=>n.isEqual(e.key)))}}class Mm extends he{constructor(e,n){super(e,"not-in",n),this.keys=Ud("not-in",n)}matches(e){return!this.keys.some((n=>n.isEqual(e.key)))}}function Ud(s,e){var n;return(((n=e.arrayValue)==null?void 0:n.values)||[]).map((r=>B.fromName(r.referenceValue)))}class Lm extends he{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Do(n)&&fs(n.arrayValue,this.value)}}class $m extends he{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&fs(this.value.arrayValue,n)}}class Om extends he{constructor(e,n){super(e,"not-in",n)}matches(e){if(fs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!fs(this.value.arrayValue,n)}}class Fm extends he{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Do(n)||!n.arrayValue.values)&&n.arrayValue.values.some((r=>fs(this.value.arrayValue,r)))}}/**
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
 */class Um{constructor(e,n=null,r=[],i=[],o=null,l=null,c=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=o,this.startAt=l,this.endAt=c,this.Te=null}}function Yl(s,e=null,n=[],r=[],i=null,o=null,l=null){return new Um(s,e,n,r,i,o,l)}function Vo(s){const e=K(s);if(e.Te===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map((r=>oo(r))).join(","),n+="|ob:",n+=e.orderBy.map((r=>(function(o){return o.field.canonicalString()+o.dir})(r))).join(","),Ur(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((r=>kn(r))).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((r=>kn(r))).join(",")),e.Te=n}return e.Te}function No(s,e){if(s.limit!==e.limit||s.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<s.orderBy.length;n++)if(!Pm(s.orderBy[n],e.orderBy[n]))return!1;if(s.filters.length!==e.filters.length)return!1;for(let n=0;n<s.filters.length;n++)if(!Od(s.filters[n],e.filters[n]))return!1;return s.collectionGroup===e.collectionGroup&&!!s.path.isEqual(e.path)&&!!Ql(s.startAt,e.startAt)&&Ql(s.endAt,e.endAt)}function ao(s){return B.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}/**
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
 */class Dn{constructor(e,n=null,r=[],i=[],o=null,l="F",c=null,d=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=o,this.limitType=l,this.startAt=c,this.endAt=d,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function Bm(s,e,n,r,i,o,l,c){return new Dn(s,e,n,r,i,o,l,c)}function jr(s){return new Dn(s)}function Jl(s){return s.filters.length===0&&s.limit===null&&s.startAt==null&&s.endAt==null&&(s.explicitOrderBy.length===0||s.explicitOrderBy.length===1&&s.explicitOrderBy[0].field.isKeyField())}function jm(s){return B.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}function Bd(s){return s.collectionGroup!==null}function ss(s){const e=K(s);if(e.Ee===null){e.Ee=[];const n=new Set;for(const o of e.explicitOrderBy)e.Ee.push(o),n.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(l){let c=new me(ve.comparator);return l.filters.forEach((d=>{d.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((o=>{n.has(o.canonicalString())||o.isKeyField()||e.Ee.push(new ms(o,r))})),n.has(ve.keyField().canonicalString())||e.Ee.push(new ms(ve.keyField(),r))}return e.Ee}function Ke(s){const e=K(s);return e.Ie||(e.Ie=zm(e,ss(s))),e.Ie}function zm(s,e){if(s.limitType==="F")return Yl(s.path,s.collectionGroup,e,s.filters,s.limit,s.startAt,s.endAt);{e=e.map((i=>{const o=i.dir==="desc"?"asc":"desc";return new ms(i.field,o)}));const n=s.endAt?new vr(s.endAt.position,s.endAt.inclusive):null,r=s.startAt?new vr(s.startAt.position,s.startAt.inclusive):null;return Yl(s.path,s.collectionGroup,e,s.filters,s.limit,n,r)}}function lo(s,e){const n=s.filters.concat([e]);return new Dn(s.path,s.collectionGroup,s.explicitOrderBy.slice(),n,s.limit,s.limitType,s.startAt,s.endAt)}function qm(s,e){const n=s.explicitOrderBy.concat([e]);return new Dn(s.path,s.collectionGroup,n,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}function co(s,e,n){return new Dn(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),e,n,s.startAt,s.endAt)}function zr(s,e){return No(Ke(s),Ke(e))&&s.limitType===e.limitType}function jd(s){return`${Vo(Ke(s))}|lt:${s.limitType}`}function un(s){return`Query(target=${(function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map((i=>Fd(i))).join(", ")}]`),Ur(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map((i=>(function(l){return`${l.field.canonicalString()} (${l.dir})`})(i))).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map((i=>kn(i))).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map((i=>kn(i))).join(",")),`Target(${r})`})(Ke(s))}; limitType=${s.limitType})`}function qr(s,e){return e.isFoundDocument()&&(function(r,i){const o=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):B.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)})(s,e)&&(function(r,i){for(const o of ss(r))if(!o.field.isKeyField()&&i.data.field(o.field)===null)return!1;return!0})(s,e)&&(function(r,i){for(const o of r.filters)if(!o.matches(i))return!1;return!0})(s,e)&&(function(r,i){return!(r.startAt&&!(function(l,c,d){const h=Kl(l,c,d);return l.inclusive?h<=0:h<0})(r.startAt,ss(r),i)||r.endAt&&!(function(l,c,d){const h=Kl(l,c,d);return l.inclusive?h>=0:h>0})(r.endAt,ss(r),i))})(s,e)}function Hm(s){return s.collectionGroup||(s.path.length%2==1?s.path.lastSegment():s.path.get(s.path.length-2))}function zd(s){return(e,n)=>{let r=!1;for(const i of ss(s)){const o=Gm(i,e,n);if(o!==0)return o;r=r||i.field.isKeyField()}return 0}}function Gm(s,e,n){const r=s.field.isKeyField()?B.comparator(e.key,n.key):(function(o,l,c){const d=l.data.field(o),h=c.data.field(o);return d!==null&&h!==null?En(d,h):z(42886)})(s.field,e,n);switch(s.dir){case"asc":return r;case"desc":return-1*r;default:return z(19790,{direction:s.dir})}}/**
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
 */class nn{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,o]of r)if(this.equalsFn(i,e))return o}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let o=0;o<i.length;o++)if(this.equalsFn(i[o][0],e))return void(i[o]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){$t(this.inner,((n,r)=>{for(const[i,o]of r)e(i,o)}))}isEmpty(){return Td(this.inner)}size(){return this.innerSize}}/**
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
 */const Wm=new oe(B.comparator);function ot(){return Wm}const qd=new oe(B.comparator);function Zn(...s){let e=qd;for(const n of s)e=e.insert(n.key,n);return e}function Hd(s){let e=qd;return s.forEach(((n,r)=>e=e.insert(n,r.overlayedDocument))),e}function Wt(){return rs()}function Gd(){return rs()}function rs(){return new nn((s=>s.toString()),((s,e)=>s.isEqual(e)))}const Km=new oe(B.comparator),Qm=new me(B.comparator);function X(...s){let e=Qm;for(const n of s)e=e.add(n);return e}const Ym=new me(J);function Jm(){return Ym}/**
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
 */function Mo(s,e){if(s.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:gr(e)?"-0":e}}function Wd(s){return{integerValue:""+s}}function Xm(s,e){return _m(e)?Wd(e):Mo(s,e)}/**
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
 */class Hr{constructor(){this._=void 0}}function Zm(s,e,n){return s instanceof gs?(function(i,o){const l={fields:{[Rd]:{stringValue:Sd},[Pd]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return o&&Po(o)&&(o=Br(o)),o&&(l.fields[Cd]=o),{mapValue:l}})(n,e):s instanceof ys?Qd(s,e):s instanceof bs?Yd(s,e):(function(i,o){const l=Kd(i,o),c=Xl(l)+Xl(i.Ae);return io(l)&&io(i.Ae)?Wd(c):Mo(i.serializer,c)})(s,e)}function eg(s,e,n){return s instanceof ys?Qd(s,e):s instanceof bs?Yd(s,e):n}function Kd(s,e){return s instanceof xr?(function(r){return io(r)||(function(o){return!!o&&"doubleValue"in o})(r)})(e)?e:{integerValue:0}:null}class gs extends Hr{}class ys extends Hr{constructor(e){super(),this.elements=e}}function Qd(s,e){const n=Jd(e);for(const r of s.elements)n.some((i=>Ze(i,r)))||n.push(r);return{arrayValue:{values:n}}}class bs extends Hr{constructor(e){super(),this.elements=e}}function Yd(s,e){let n=Jd(e);for(const r of s.elements)n=n.filter((i=>!Ze(i,r)));return{arrayValue:{values:n}}}class xr extends Hr{constructor(e,n){super(),this.serializer=e,this.Ae=n}}function Xl(s){return de(s.integerValue||s.doubleValue)}function Jd(s){return Do(s)&&s.arrayValue.values?s.arrayValue.values.slice():[]}/**
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
 */class tg{constructor(e,n){this.field=e,this.transform=n}}function ng(s,e){return s.field.isEqual(e.field)&&(function(r,i){return r instanceof ys&&i instanceof ys||r instanceof bs&&i instanceof bs?_n(r.elements,i.elements,Ze):r instanceof xr&&i instanceof xr?Ze(r.Ae,i.Ae):r instanceof gs&&i instanceof gs})(s.transform,e.transform)}class sg{constructor(e,n){this.version=e,this.transformResults=n}}class $e{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new $e}static exists(e){return new $e(void 0,e)}static updateTime(e){return new $e(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ar(s,e){return s.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(s.updateTime):s.exists===void 0||s.exists===e.isFoundDocument()}class Gr{}function Xd(s,e){if(!s.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return s.isNoDocument()?new Lo(s.key,$e.none()):new Ts(s.key,s.data,$e.none());{const n=s.data,r=Pe.empty();let i=new me(ve.comparator);for(let o of e.fields)if(!i.has(o)){let l=n.field(o);l===null&&o.length>1&&(o=o.popLast(),l=n.field(o)),l===null?r.delete(o):r.set(o,l),i=i.add(o)}return new Ot(s.key,r,new Ve(i.toArray()),$e.none())}}function rg(s,e,n){s instanceof Ts?(function(i,o,l){const c=i.value.clone(),d=ec(i.fieldTransforms,o,l.transformResults);c.setAll(d),o.convertToFoundDocument(l.version,c).setHasCommittedMutations()})(s,e,n):s instanceof Ot?(function(i,o,l){if(!ar(i.precondition,o))return void o.convertToUnknownDocument(l.version);const c=ec(i.fieldTransforms,o,l.transformResults),d=o.data;d.setAll(Zd(i)),d.setAll(c),o.convertToFoundDocument(l.version,d).setHasCommittedMutations()})(s,e,n):(function(i,o,l){o.convertToNoDocument(l.version).setHasCommittedMutations()})(0,e,n)}function is(s,e,n,r){return s instanceof Ts?(function(o,l,c,d){if(!ar(o.precondition,l))return c;const h=o.value.clone(),f=tc(o.fieldTransforms,d,l);return h.setAll(f),l.convertToFoundDocument(l.version,h).setHasLocalMutations(),null})(s,e,n,r):s instanceof Ot?(function(o,l,c,d){if(!ar(o.precondition,l))return c;const h=tc(o.fieldTransforms,d,l),f=l.data;return f.setAll(Zd(o)),f.setAll(h),l.convertToFoundDocument(l.version,f).setHasLocalMutations(),c===null?null:c.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((g=>g.field)))})(s,e,n,r):(function(o,l,c){return ar(o.precondition,l)?(l.convertToNoDocument(l.version).setHasLocalMutations(),null):c})(s,e,n)}function ig(s,e){let n=null;for(const r of s.fieldTransforms){const i=e.data.field(r.field),o=Kd(r.transform,i||null);o!=null&&(n===null&&(n=Pe.empty()),n.set(r.field,o))}return n||null}function Zl(s,e){return s.type===e.type&&!!s.key.isEqual(e.key)&&!!s.precondition.isEqual(e.precondition)&&!!(function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&_n(r,i,((o,l)=>ng(o,l)))})(s.fieldTransforms,e.fieldTransforms)&&(s.type===0?s.value.isEqual(e.value):s.type!==1||s.data.isEqual(e.data)&&s.fieldMask.isEqual(e.fieldMask))}class Ts extends Gr{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ot extends Gr{constructor(e,n,r,i,o=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Zd(s){const e=new Map;return s.fieldMask.fields.forEach((n=>{if(!n.isEmpty()){const r=s.data.field(n);e.set(n,r)}})),e}function ec(s,e,n){const r=new Map;te(s.length===n.length,32656,{Ve:n.length,de:s.length});for(let i=0;i<n.length;i++){const o=s[i],l=o.transform,c=e.data.field(o.field);r.set(o.field,eg(l,c,n[i]))}return r}function tc(s,e,n){const r=new Map;for(const i of s){const o=i.transform,l=n.data.field(i.field);r.set(i.field,Zm(o,l,e))}return r}class Lo extends Gr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class og extends Gr{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class ag{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const o=this.mutations[i];o.key.isEqual(e.key)&&rg(o,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=is(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=is(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=Gd();return this.mutations.forEach((i=>{const o=e.get(i.key),l=o.overlayedDocument;let c=this.applyToLocalView(l,o.mutatedFields);c=n.has(i.key)?null:c;const d=Xd(l,c);d!==null&&r.set(i.key,d),l.isValidDocument()||l.convertToNoDocument(W.min())})),r}keys(){return this.mutations.reduce(((e,n)=>e.add(n.key)),X())}isEqual(e){return this.batchId===e.batchId&&_n(this.mutations,e.mutations,((n,r)=>Zl(n,r)))&&_n(this.baseMutations,e.baseMutations,((n,r)=>Zl(n,r)))}}class $o{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){te(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let i=(function(){return Km})();const o=e.mutations;for(let l=0;l<o.length;l++)i=i.insert(o[l].key,r[l].version);return new $o(e,n,r,i)}}/**
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
 */class lg{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class cg{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
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
 */var ue,ee;function dg(s){switch(s){case D.OK:return z(64938);case D.CANCELLED:case D.UNKNOWN:case D.DEADLINE_EXCEEDED:case D.RESOURCE_EXHAUSTED:case D.INTERNAL:case D.UNAVAILABLE:case D.UNAUTHENTICATED:return!1;case D.INVALID_ARGUMENT:case D.NOT_FOUND:case D.ALREADY_EXISTS:case D.PERMISSION_DENIED:case D.FAILED_PRECONDITION:case D.ABORTED:case D.OUT_OF_RANGE:case D.UNIMPLEMENTED:case D.DATA_LOSS:return!0;default:return z(15467,{code:s})}}function eu(s){if(s===void 0)return it("GRPC error has no .code"),D.UNKNOWN;switch(s){case ue.OK:return D.OK;case ue.CANCELLED:return D.CANCELLED;case ue.UNKNOWN:return D.UNKNOWN;case ue.DEADLINE_EXCEEDED:return D.DEADLINE_EXCEEDED;case ue.RESOURCE_EXHAUSTED:return D.RESOURCE_EXHAUSTED;case ue.INTERNAL:return D.INTERNAL;case ue.UNAVAILABLE:return D.UNAVAILABLE;case ue.UNAUTHENTICATED:return D.UNAUTHENTICATED;case ue.INVALID_ARGUMENT:return D.INVALID_ARGUMENT;case ue.NOT_FOUND:return D.NOT_FOUND;case ue.ALREADY_EXISTS:return D.ALREADY_EXISTS;case ue.PERMISSION_DENIED:return D.PERMISSION_DENIED;case ue.FAILED_PRECONDITION:return D.FAILED_PRECONDITION;case ue.ABORTED:return D.ABORTED;case ue.OUT_OF_RANGE:return D.OUT_OF_RANGE;case ue.UNIMPLEMENTED:return D.UNIMPLEMENTED;case ue.DATA_LOSS:return D.DATA_LOSS;default:return z(39323,{code:s})}}(ee=ue||(ue={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function ug(){return new TextEncoder}/**
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
 */const hg=new At([4294967295,4294967295],0);function nc(s){const e=ug().encode(s),n=new gd;return n.update(e),new Uint8Array(n.digest())}function sc(s){const e=new DataView(s.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new At([n,r],0),new At([i,o],0)]}class Oo{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new es(`Invalid padding: ${n}`);if(r<0)throw new es(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new es(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new es(`Invalid padding when bitmap length is 0: ${n}`);this.ge=8*e.length-n,this.pe=At.fromNumber(this.ge)}ye(e,n,r){let i=e.add(n.multiply(At.fromNumber(r)));return i.compare(hg)===1&&(i=new At([i.getBits(0),i.getBits(1)],0)),i.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const n=nc(e),[r,i]=sc(n);for(let o=0;o<this.hashCount;o++){const l=this.ye(r,i,o);if(!this.we(l))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),l=new Oo(o,i,n);return r.forEach((c=>l.insert(c))),l}insert(e){if(this.ge===0)return;const n=nc(e),[r,i]=sc(n);for(let o=0;o<this.hashCount;o++){const l=this.ye(r,i,o);this.Se(l)}}Se(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class es extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Wr{constructor(e,n,r,i,o){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,As.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new Wr(W.min(),i,new oe(J),ot(),X())}}class As{constructor(e,n,r,i,o){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new As(r,n,X(),X(),X())}}/**
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
 */class lr{constructor(e,n,r,i){this.be=e,this.removedTargetIds=n,this.key=r,this.De=i}}class tu{constructor(e,n){this.targetId=e,this.Ce=n}}class nu{constructor(e,n,r=xe.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class rc{constructor(){this.ve=0,this.Fe=ic(),this.Me=xe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=X(),n=X(),r=X();return this.Fe.forEach(((i,o)=>{switch(o){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:z(38017,{changeType:o})}})),new As(this.Me,this.xe,e,n,r)}qe(){this.Oe=!1,this.Fe=ic()}Ke(e,n){this.Oe=!0,this.Fe=this.Fe.insert(e,n)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,te(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class pg{constructor(e){this.Ge=e,this.ze=new Map,this.je=ot(),this.Je=Xs(),this.He=Xs(),this.Ze=new oe(J)}Xe(e){for(const n of e.be)e.De&&e.De.isFoundDocument()?this.Ye(n,e.De):this.et(n,e.key,e.De);for(const n of e.removedTargetIds)this.et(n,e.key,e.De)}tt(e){this.forEachTarget(e,(n=>{const r=this.nt(n);switch(e.state){case 0:this.rt(n)&&r.Le(e.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(n);break;case 3:this.rt(n)&&(r.Qe(),r.Le(e.resumeToken));break;case 4:this.rt(n)&&(this.it(n),r.Le(e.resumeToken));break;default:z(56790,{state:e.state})}}))}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.ze.forEach(((r,i)=>{this.rt(i)&&n(i)}))}st(e){const n=e.targetId,r=e.Ce.count,i=this.ot(n);if(i){const o=i.target;if(ao(o))if(r===0){const l=new B(o.path);this.et(n,l,Ee.newNoDocument(l,W.min()))}else te(r===1,20013,{expectedCount:r});else{const l=this._t(n);if(l!==r){const c=this.ut(e),d=c?this.ct(c,e,l):1;if(d!==0){this.it(n);const h=d===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,h)}}}}}ut(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:o=0}=n;let l,c;try{l=Dt(r).toUint8Array()}catch(d){if(d instanceof Ad)return wn("Decoding the base64 bloom filter in existence filter failed ("+d.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw d}try{c=new Oo(l,i,o)}catch(d){return wn(d instanceof es?"BloomFilter error: ":"Applying bloom filter failed: ",d),null}return c.ge===0?null:c}ct(e,n,r){return n.Ce.count===r-this.Pt(e,n.targetId)?0:2}Pt(e,n){const r=this.Ge.getRemoteKeysForTarget(n);let i=0;return r.forEach((o=>{const l=this.Ge.ht(),c=`projects/${l.projectId}/databases/${l.database}/documents/${o.path.canonicalString()}`;e.mightContain(c)||(this.et(n,o,null),i++)})),i}Tt(e){const n=new Map;this.ze.forEach(((o,l)=>{const c=this.ot(l);if(c){if(o.current&&ao(c.target)){const d=new B(c.target.path);this.Et(d).has(l)||this.It(l,d)||this.et(l,d,Ee.newNoDocument(d,e))}o.Be&&(n.set(l,o.ke()),o.qe())}}));let r=X();this.He.forEach(((o,l)=>{let c=!0;l.forEachWhile((d=>{const h=this.ot(d);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(o))})),this.je.forEach(((o,l)=>l.setReadTime(e)));const i=new Wr(e,n,this.Ze,this.je,r);return this.je=ot(),this.Je=Xs(),this.He=Xs(),this.Ze=new oe(J),i}Ye(e,n){if(!this.rt(e))return;const r=this.It(e,n.key)?2:0;this.nt(e).Ke(n.key,r),this.je=this.je.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(e)),this.He=this.He.insert(n.key,this.Rt(n.key).add(e))}et(e,n,r){if(!this.rt(e))return;const i=this.nt(e);this.It(e,n)?i.Ke(n,1):i.Ue(n),this.He=this.He.insert(n,this.Rt(n).delete(e)),this.He=this.He.insert(n,this.Rt(n).add(e)),r&&(this.je=this.je.insert(n,r))}removeTarget(e){this.ze.delete(e)}_t(e){const n=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let n=this.ze.get(e);return n||(n=new rc,this.ze.set(e,n)),n}Rt(e){let n=this.He.get(e);return n||(n=new me(J),this.He=this.He.insert(e,n)),n}Et(e){let n=this.Je.get(e);return n||(n=new me(J),this.Je=this.Je.insert(e,n)),n}rt(e){const n=this.ot(e)!==null;return n||O("WatchChangeAggregator","Detected inactive target",e),n}ot(e){const n=this.ze.get(e);return n&&n.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new rc),this.Ge.getRemoteKeysForTarget(e).forEach((n=>{this.et(e,n,null)}))}It(e,n){return this.Ge.getRemoteKeysForTarget(e).has(n)}}function Xs(){return new oe(B.comparator)}function ic(){return new oe(B.comparator)}const fg={asc:"ASCENDING",desc:"DESCENDING"},mg={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gg={and:"AND",or:"OR"};class yg{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function uo(s,e){return s.useProto3Json||Ur(e)?e:{value:e}}function wr(s,e){return s.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function su(s,e){return s.useProto3Json?e.toBase64():e.toUint8Array()}function bg(s,e){return wr(s,e.toTimestamp())}function Qe(s){return te(!!s,49232),W.fromTimestamp((function(n){const r=Pt(n);return new ie(r.seconds,r.nanos)})(s))}function Fo(s,e){return ho(s,e).canonicalString()}function ho(s,e){const n=(function(i){return new se(["projects",i.projectId,"databases",i.database])})(s).child("documents");return e===void 0?n:n.child(e)}function ru(s){const e=se.fromString(s);return te(cu(e),10190,{key:e.toString()}),e}function po(s,e){return Fo(s.databaseId,e.path)}function Ui(s,e){const n=ru(e);if(n.get(1)!==s.databaseId.projectId)throw new $(D.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+s.databaseId.projectId);if(n.get(3)!==s.databaseId.database)throw new $(D.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+s.databaseId.database);return new B(ou(n))}function iu(s,e){return Fo(s.databaseId,e)}function vg(s){const e=ru(s);return e.length===4?se.emptyPath():ou(e)}function fo(s){return new se(["projects",s.databaseId.projectId,"databases",s.databaseId.database]).canonicalString()}function ou(s){return te(s.length>4&&s.get(4)==="documents",29091,{key:s.toString()}),s.popFirst(5)}function oc(s,e,n){return{name:po(s,e),fields:n.value.mapValue.fields}}function xg(s,e){let n;if("targetChange"in e){e.targetChange;const r=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:z(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],o=(function(h,f){return h.useProto3Json?(te(f===void 0||typeof f=="string",58123),xe.fromBase64String(f||"")):(te(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),xe.fromUint8Array(f||new Uint8Array))})(s,e.targetChange.resumeToken),l=e.targetChange.cause,c=l&&(function(h){const f=h.code===void 0?D.UNKNOWN:eu(h.code);return new $(f,h.message||"")})(l);n=new nu(r,i,o,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Ui(s,r.document.name),o=Qe(r.document.updateTime),l=r.document.createTime?Qe(r.document.createTime):W.min(),c=new Pe({mapValue:{fields:r.document.fields}}),d=Ee.newFoundDocument(i,o,l,c),h=r.targetIds||[],f=r.removedTargetIds||[];n=new lr(h,f,d.key,d)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Ui(s,r.document),o=r.readTime?Qe(r.readTime):W.min(),l=Ee.newNoDocument(i,o),c=r.removedTargetIds||[];n=new lr([],c,l.key,l)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Ui(s,r.document),o=r.removedTargetIds||[];n=new lr([],o,i,null)}else{if(!("filter"in e))return z(11601,{Vt:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:o}=r,l=new cg(i,o),c=r.targetId;n=new tu(c,l)}}return n}function wg(s,e){let n;if(e instanceof Ts)n={update:oc(s,e.key,e.value)};else if(e instanceof Lo)n={delete:po(s,e.key)};else if(e instanceof Ot)n={update:oc(s,e.key,e.data),updateMask:Cg(e.fieldMask)};else{if(!(e instanceof og))return z(16599,{dt:e.type});n={verify:po(s,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map((r=>(function(o,l){const c=l.transform;if(c instanceof gs)return{fieldPath:l.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof ys)return{fieldPath:l.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof bs)return{fieldPath:l.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof xr)return{fieldPath:l.field.canonicalString(),increment:c.Ae};throw z(20930,{transform:l.transform})})(0,r)))),e.precondition.isNone||(n.currentDocument=(function(i,o){return o.updateTime!==void 0?{updateTime:bg(i,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:z(27497)})(s,e.precondition)),n}function _g(s,e){return s&&s.length>0?(te(e!==void 0,14353),s.map((n=>(function(i,o){let l=i.updateTime?Qe(i.updateTime):Qe(o);return l.isEqual(W.min())&&(l=Qe(o)),new sg(l,i.transformResults||[])})(n,e)))):[]}function Eg(s,e){return{documents:[iu(s,e.path)]}}function kg(s,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=iu(s,i);const o=(function(h){if(h.length!==0)return lu(Be.create(h,"and"))})(e.filters);o&&(n.structuredQuery.where=o);const l=(function(h){if(h.length!==0)return h.map((f=>(function(b){return{field:hn(b.field),direction:Ag(b.dir)}})(f)))})(e.orderBy);l&&(n.structuredQuery.orderBy=l);const c=uo(s,e.limit);return c!==null&&(n.structuredQuery.limit=c),e.startAt&&(n.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(n.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{ft:n,parent:i}}function Ig(s){let e=vg(s.parent);const n=s.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){te(r===1,65062);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let o=[];n.where&&(o=(function(g){const b=au(g);return b instanceof Be&&$d(b)?b.getFilters():[b]})(n.where));let l=[];n.orderBy&&(l=(function(g){return g.map((b=>(function(T){return new ms(pn(T.field),(function(P){switch(P){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(T.direction))})(b)))})(n.orderBy));let c=null;n.limit&&(c=(function(g){let b;return b=typeof g=="object"?g.value:g,Ur(b)?null:b})(n.limit));let d=null;n.startAt&&(d=(function(g){const b=!!g.before,v=g.values||[];return new vr(v,b)})(n.startAt));let h=null;return n.endAt&&(h=(function(g){const b=!g.before,v=g.values||[];return new vr(v,b)})(n.endAt)),Bm(e,i,l,o,c,"F",d,h)}function Tg(s,e){const n=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return z(28987,{purpose:i})}})(e.purpose);return n==null?null:{"goog-listen-tags":n}}function au(s){return s.unaryFilter!==void 0?(function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=pn(n.unaryFilter.field);return he.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=pn(n.unaryFilter.field);return he.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=pn(n.unaryFilter.field);return he.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const l=pn(n.unaryFilter.field);return he.create(l,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return z(61313);default:return z(60726)}})(s):s.fieldFilter!==void 0?(function(n){return he.create(pn(n.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return z(58110);default:return z(50506)}})(n.fieldFilter.op),n.fieldFilter.value)})(s):s.compositeFilter!==void 0?(function(n){return Be.create(n.compositeFilter.filters.map((r=>au(r))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return z(1026)}})(n.compositeFilter.op))})(s):z(30097,{filter:s})}function Ag(s){return fg[s]}function Sg(s){return mg[s]}function Rg(s){return gg[s]}function hn(s){return{fieldPath:s.canonicalString()}}function pn(s){return ve.fromServerFormat(s.fieldPath)}function lu(s){return s instanceof he?(function(n){if(n.op==="=="){if(Wl(n.value))return{unaryFilter:{field:hn(n.field),op:"IS_NAN"}};if(Gl(n.value))return{unaryFilter:{field:hn(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Wl(n.value))return{unaryFilter:{field:hn(n.field),op:"IS_NOT_NAN"}};if(Gl(n.value))return{unaryFilter:{field:hn(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:hn(n.field),op:Sg(n.op),value:n.value}}})(s):s instanceof Be?(function(n){const r=n.getFilters().map((i=>lu(i)));return r.length===1?r[0]:{compositeFilter:{op:Rg(n.op),filters:r}}})(s):z(54877,{filter:s})}function Cg(s){const e=[];return s.fields.forEach((n=>e.push(n.canonicalString()))),{fieldPaths:e}}function cu(s){return s.length>=4&&s.get(0)==="projects"&&s.get(2)==="databases"}function du(s){return!!s&&typeof s._toProto=="function"&&s._protoValueType==="ProtoValue"}/**
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
 */class Et{constructor(e,n,r,i,o=W.min(),l=W.min(),c=xe.EMPTY_BYTE_STRING,d=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=l,this.resumeToken=c,this.expectedCount=d}withSequenceNumber(e){return new Et(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new Et(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Et(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Et(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class Pg{constructor(e){this.yt=e}}function Dg(s){const e=Ig({parent:s.parent,structuredQuery:s.structuredQuery});return s.limitType==="LAST"?co(e,e.limit,"L"):e}/**
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
 */class Vg{constructor(){this.bn=new Ng}addToCollectionParentIndex(e,n){return this.bn.add(n),V.resolve()}getCollectionParents(e,n){return V.resolve(this.bn.getEntries(n))}addFieldIndex(e,n){return V.resolve()}deleteFieldIndex(e,n){return V.resolve()}deleteAllFieldIndexes(e){return V.resolve()}createTargetIndexes(e,n){return V.resolve()}getDocumentsMatchingTarget(e,n){return V.resolve(null)}getIndexType(e,n){return V.resolve(0)}getFieldIndexes(e,n){return V.resolve([])}getNextCollectionGroupToUpdate(e){return V.resolve(null)}getMinOffset(e,n){return V.resolve(Ct.min())}getMinOffsetFromCollectionGroup(e,n){return V.resolve(Ct.min())}updateCollectionGroup(e,n,r){return V.resolve()}updateIndexEntries(e,n){return V.resolve()}}class Ng{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new me(se.comparator),o=!i.has(r);return this.index[n]=i.add(r),o}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new me(se.comparator)).toArray()}}/**
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
 */const ac={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},uu=41943040;class Ce{static withCacheSize(e){return new Ce(e,Ce.DEFAULT_COLLECTION_PERCENTILE,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
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
 */Ce.DEFAULT_COLLECTION_PERCENTILE=10,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ce.DEFAULT=new Ce(uu,Ce.DEFAULT_COLLECTION_PERCENTILE,Ce.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ce.DISABLED=new Ce(-1,0,0);/**
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
 */class In{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new In(0)}static ar(){return new In(-1)}}/**
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
 */const lc="LruGarbageCollector",hu=1048576;function cc([s,e],[n,r]){const i=J(s,n);return i===0?J(e,r):i}class Mg{constructor(e){this.Pr=e,this.buffer=new me(cc),this.Tr=0}Er(){return++this.Tr}Ir(e){const n=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();cc(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class Lg{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){O(lc,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){Pn(n)?O(lc,"Ignoring IndexedDB error during garbage collection: ",n):await Cn(n)}await this.Ar(3e5)}))}}class $g{constructor(e,n){this.Vr=e,this.params=n}calculateTargetCount(e,n){return this.Vr.dr(e).next((r=>Math.floor(n/100*r)))}nthSequenceNumber(e,n){if(n===0)return V.resolve(Fr.ce);const r=new Mg(n);return this.Vr.forEachTarget(e,(i=>r.Ir(i.sequenceNumber))).next((()=>this.Vr.mr(e,(i=>r.Ir(i))))).next((()=>r.maxValue))}removeTargets(e,n,r){return this.Vr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Vr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),V.resolve(ac)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),ac):this.gr(e,n)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,n){let r,i,o,l,c,d,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((g=>(g>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),i=this.params.maximumSequenceNumbersToCollect):i=g,l=Date.now(),this.nthSequenceNumber(e,i)))).next((g=>(r=g,c=Date.now(),this.removeTargets(e,r,n)))).next((g=>(o=g,d=Date.now(),this.removeOrphanedDocuments(e,r)))).next((g=>(h=Date.now(),dn()<=Y.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${l-f}ms
	Determined least recently used ${i} in `+(c-l)+`ms
	Removed ${o} targets in `+(d-c)+`ms
	Removed ${g} documents in `+(h-d)+`ms
Total Duration: ${h-f}ms`),V.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:o,documentsRemoved:g}))))}}function Og(s,e){return new $g(s,e)}/**
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
 */class Fg{constructor(){this.changes=new nn((e=>e.toString()),((e,n)=>e.isEqual(n))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Ee.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?V.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Ug{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
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
 */class Bg{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next((i=>(r=i,this.remoteDocumentCache.getEntry(e,n)))).next((i=>(r!==null&&is(r.mutation,i,Ve.empty(),ie.now()),i)))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next((r=>this.getLocalViewOfDocuments(e,r,X()).next((()=>r))))}getLocalViewOfDocuments(e,n,r=X()){const i=Wt();return this.populateOverlays(e,i,n).next((()=>this.computeViews(e,n,i,r).next((o=>{let l=Zn();return o.forEach(((c,d)=>{l=l.insert(c,d.overlayedDocument)})),l}))))}getOverlayedDocuments(e,n){const r=Wt();return this.populateOverlays(e,r,n).next((()=>this.computeViews(e,n,r,X())))}populateOverlays(e,n,r){const i=[];return r.forEach((o=>{n.has(o)||i.push(o)})),this.documentOverlayCache.getOverlays(e,i).next((o=>{o.forEach(((l,c)=>{n.set(l,c)}))}))}computeViews(e,n,r,i){let o=ot();const l=rs(),c=(function(){return rs()})();return n.forEach(((d,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof Ot)?o=o.insert(h.key,h):f!==void 0?(l.set(h.key,f.mutation.getFieldMask()),is(f.mutation,h,f.mutation.getFieldMask(),ie.now())):l.set(h.key,Ve.empty())})),this.recalculateAndSaveOverlays(e,o).next((d=>(d.forEach(((h,f)=>l.set(h,f))),n.forEach(((h,f)=>c.set(h,new Ug(f,l.get(h)??null)))),c)))}recalculateAndSaveOverlays(e,n){const r=rs();let i=new oe(((l,c)=>l-c)),o=X();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next((l=>{for(const c of l)c.keys().forEach((d=>{const h=n.get(d);if(h===null)return;let f=r.get(d)||Ve.empty();f=c.applyToLocalView(h,f),r.set(d,f);const g=(i.get(c.batchId)||X()).add(d);i=i.insert(c.batchId,g)}))})).next((()=>{const l=[],c=i.getReverseIterator();for(;c.hasNext();){const d=c.getNext(),h=d.key,f=d.value,g=Gd();f.forEach((b=>{if(!o.has(b)){const v=Xd(n.get(b),r.get(b));v!==null&&g.set(b,v),o=o.add(b)}})),l.push(this.documentOverlayCache.saveOverlays(e,h,g))}return V.waitFor(l)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,n,r,i){return jm(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):Bd(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next((o=>{const l=i-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-o.size):V.resolve(Wt());let c=us,d=o;return l.next((h=>V.forEach(h,((f,g)=>(c<g.largestBatchId&&(c=g.largestBatchId),o.get(f)?V.resolve():this.remoteDocumentCache.getEntry(e,f).next((b=>{d=d.insert(f,b)}))))).next((()=>this.populateOverlays(e,h,o))).next((()=>this.computeViews(e,d,h,X()))).next((f=>({batchId:c,changes:Hd(f)})))))}))}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new B(n)).next((r=>{let i=Zn();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i}))}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const o=n.collectionGroup;let l=Zn();return this.indexManager.getCollectionParents(e,o).next((c=>V.forEach(c,(d=>{const h=(function(g,b){return new Dn(b,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)})(n,d.child(o));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next((f=>{f.forEach(((g,b)=>{l=l.insert(g,b)}))}))})).next((()=>l))))}getDocumentsMatchingCollectionQuery(e,n,r,i){let o;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next((l=>(o=l,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,o,i)))).next((l=>{o.forEach(((d,h)=>{const f=h.getKey();l.get(f)===null&&(l=l.insert(f,Ee.newInvalidDocument(f)))}));let c=Zn();return l.forEach(((d,h)=>{const f=o.get(d);f!==void 0&&is(f.mutation,h,Ve.empty(),ie.now()),qr(n,h)&&(c=c.insert(d,h))})),c}))}}/**
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
 */class jg{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,n){return V.resolve(this.Nr.get(n))}saveBundleMetadata(e,n){return this.Nr.set(n.id,(function(i){return{id:i.id,version:i.version,createTime:Qe(i.createTime)}})(n)),V.resolve()}getNamedQuery(e,n){return V.resolve(this.Br.get(n))}saveNamedQuery(e,n){return this.Br.set(n.name,(function(i){return{name:i.name,query:Dg(i.bundledQuery),readTime:Qe(i.readTime)}})(n)),V.resolve()}}/**
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
 */class zg{constructor(){this.overlays=new oe(B.comparator),this.Lr=new Map}getOverlay(e,n){return V.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Wt();return V.forEach(n,(i=>this.getOverlay(e,i).next((o=>{o!==null&&r.set(i,o)})))).next((()=>r))}saveOverlays(e,n,r){return r.forEach(((i,o)=>{this.St(e,n,o)})),V.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Lr.get(r);return i!==void 0&&(i.forEach((o=>this.overlays=this.overlays.remove(o))),this.Lr.delete(r)),V.resolve()}getOverlaysForCollection(e,n,r){const i=Wt(),o=n.length+1,l=new B(n.child("")),c=this.overlays.getIteratorFrom(l);for(;c.hasNext();){const d=c.getNext().value,h=d.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===o&&d.largestBatchId>r&&i.set(d.getKey(),d)}return V.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let o=new oe(((h,f)=>h-f));const l=this.overlays.getIterator();for(;l.hasNext();){const h=l.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=o.get(h.largestBatchId);f===null&&(f=Wt(),o=o.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=Wt(),d=o.getIterator();for(;d.hasNext()&&(d.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=i)););return V.resolve(c)}St(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const l=this.Lr.get(i.largestBatchId).delete(r.key);this.Lr.set(i.largestBatchId,l)}this.overlays=this.overlays.insert(r.key,new lg(n,r));let o=this.Lr.get(n);o===void 0&&(o=X(),this.Lr.set(n,o)),this.Lr.set(n,o.add(r.key))}}/**
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
 */class qg{constructor(){this.sessionToken=xe.EMPTY_BYTE_STRING}getSessionToken(e){return V.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,V.resolve()}}/**
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
 */class Uo{constructor(){this.kr=new me(ye.qr),this.Kr=new me(ye.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,n){const r=new ye(e,n);this.kr=this.kr.add(r),this.Kr=this.Kr.add(r)}$r(e,n){e.forEach((r=>this.addReference(r,n)))}removeReference(e,n){this.Wr(new ye(e,n))}Qr(e,n){e.forEach((r=>this.removeReference(r,n)))}Gr(e){const n=new B(new se([])),r=new ye(n,e),i=new ye(n,e+1),o=[];return this.Kr.forEachInRange([r,i],(l=>{this.Wr(l),o.push(l.key)})),o}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const n=new B(new se([])),r=new ye(n,e),i=new ye(n,e+1);let o=X();return this.Kr.forEachInRange([r,i],(l=>{o=o.add(l.key)})),o}containsKey(e){const n=new ye(e,0),r=this.kr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class ye{constructor(e,n){this.key=e,this.Jr=n}static qr(e,n){return B.comparator(e.key,n.key)||J(e.Jr,n.Jr)}static Ur(e,n){return J(e.Jr,n.Jr)||B.comparator(e.key,n.key)}}/**
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
 */class Hg{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Yn=1,this.Hr=new me(ye.qr)}checkEmpty(e){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const o=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const l=new ag(o,n,r,i);this.mutationQueue.push(l);for(const c of i)this.Hr=this.Hr.add(new ye(c.key,o)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return V.resolve(l)}lookupMutationBatch(e,n){return V.resolve(this.Zr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.Xr(r),o=i<0?0:i;return V.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?Co:this.Yn-1)}getAllMutationBatches(e){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new ye(n,0),i=new ye(n,Number.POSITIVE_INFINITY),o=[];return this.Hr.forEachInRange([r,i],(l=>{const c=this.Zr(l.Jr);o.push(c)})),V.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new me(J);return n.forEach((i=>{const o=new ye(i,0),l=new ye(i,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([o,l],(c=>{r=r.add(c.Jr)}))})),V.resolve(this.Yr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let o=r;B.isDocumentKey(o)||(o=o.child(""));const l=new ye(new B(o),0);let c=new me(J);return this.Hr.forEachWhile((d=>{const h=d.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(c=c.add(d.Jr)),!0)}),l),V.resolve(this.Yr(c))}Yr(e){const n=[];return e.forEach((r=>{const i=this.Zr(r);i!==null&&n.push(i)})),n}removeMutationBatch(e,n){te(this.ei(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Hr;return V.forEach(n.mutations,(i=>{const o=new ye(i.key,n.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Hr=r}))}nr(e){}containsKey(e,n){const r=new ye(n,0),i=this.Hr.firstAfterOrEqual(r);return V.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,V.resolve()}ei(e,n){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const n=this.Xr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
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
 */class Gg{constructor(e){this.ti=e,this.docs=(function(){return new oe(B.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),o=i?i.size:0,l=this.ti(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:l}),this.size+=l-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return V.resolve(r?r.document.mutableCopy():Ee.newInvalidDocument(n))}getEntries(e,n){let r=ot();return n.forEach((i=>{const o=this.docs.get(i);r=r.insert(i,o?o.document.mutableCopy():Ee.newInvalidDocument(i))})),V.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let o=ot();const l=n.path,c=new B(l.child("__id-9223372036854775808__")),d=this.docs.getIteratorFrom(c);for(;d.hasNext();){const{key:h,value:{document:f}}=d.getNext();if(!l.isPrefixOf(h.path))break;h.path.length>l.length+1||bm(ym(f),r)<=0||(i.has(f.key)||qr(n,f))&&(o=o.insert(f.key,f.mutableCopy()))}return V.resolve(o)}getAllFromCollectionGroup(e,n,r,i){z(9500)}ni(e,n){return V.forEach(this.docs,(r=>n(r)))}newChangeBuffer(e){return new Wg(this)}getSize(e){return V.resolve(this.size)}}class Wg extends Fg{constructor(e){super(),this.Mr=e}applyChanges(e){const n=[];return this.changes.forEach(((r,i)=>{i.isValidDocument()?n.push(this.Mr.addEntry(e,i)):this.Mr.removeEntry(r)})),V.waitFor(n)}getFromCache(e,n){return this.Mr.getEntry(e,n)}getAllFromCache(e,n){return this.Mr.getEntries(e,n)}}/**
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
 */class Kg{constructor(e){this.persistence=e,this.ri=new nn((n=>Vo(n)),No),this.lastRemoteSnapshotVersion=W.min(),this.highestTargetId=0,this.ii=0,this.si=new Uo,this.targetCount=0,this.oi=In._r()}forEachTarget(e,n){return this.ri.forEach(((r,i)=>n(i))),V.resolve()}getLastRemoteSnapshotVersion(e){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return V.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.ii&&(this.ii=n),V.resolve()}lr(e){this.ri.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.oi=new In(n),this.highestTargetId=n),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,n){return this.lr(n),this.targetCount+=1,V.resolve()}updateTargetData(e,n){return this.lr(n),V.resolve()}removeTargetData(e,n){return this.ri.delete(n.target),this.si.Gr(n.targetId),this.targetCount-=1,V.resolve()}removeTargets(e,n,r){let i=0;const o=[];return this.ri.forEach(((l,c)=>{c.sequenceNumber<=n&&r.get(c.targetId)===null&&(this.ri.delete(l),o.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)})),V.waitFor(o).next((()=>i))}getTargetCount(e){return V.resolve(this.targetCount)}getTargetData(e,n){const r=this.ri.get(n)||null;return V.resolve(r)}addMatchingKeys(e,n,r){return this.si.$r(n,r),V.resolve()}removeMatchingKeys(e,n,r){this.si.Qr(n,r);const i=this.persistence.referenceDelegate,o=[];return i&&n.forEach((l=>{o.push(i.markPotentiallyOrphaned(e,l))})),V.waitFor(o)}removeMatchingKeysForTargetId(e,n){return this.si.Gr(n),V.resolve()}getMatchingKeysForTargetId(e,n){const r=this.si.jr(n);return V.resolve(r)}containsKey(e,n){return V.resolve(this.si.containsKey(n))}}/**
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
 */class pu{constructor(e,n){this._i={},this.overlays={},this.ai=new Fr(0),this.ui=!1,this.ui=!0,this.ci=new qg,this.referenceDelegate=e(this),this.li=new Kg(this),this.indexManager=new Vg,this.remoteDocumentCache=(function(i){return new Gg(i)})((r=>this.referenceDelegate.hi(r))),this.serializer=new Pg(n),this.Pi=new jg(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new zg,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this._i[e.toKey()];return r||(r=new Hg(n,this.referenceDelegate),this._i[e.toKey()]=r),r}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,n,r){O("MemoryPersistence","Starting transaction:",e);const i=new Qg(this.ai.next());return this.referenceDelegate.Ti(),r(i).next((o=>this.referenceDelegate.Ei(i).next((()=>o)))).toPromise().then((o=>(i.raiseOnCommittedEvent(),o)))}Ii(e,n){return V.or(Object.values(this._i).map((r=>()=>r.containsKey(e,n))))}}class Qg extends xm{constructor(e){super(),this.currentSequenceNumber=e}}class Bo{constructor(e){this.persistence=e,this.Ri=new Uo,this.Ai=null}static Vi(e){return new Bo(e)}get di(){if(this.Ai)return this.Ai;throw z(60996)}addReference(e,n,r){return this.Ri.addReference(r,n),this.di.delete(r.toString()),V.resolve()}removeReference(e,n,r){return this.Ri.removeReference(r,n),this.di.add(r.toString()),V.resolve()}markPotentiallyOrphaned(e,n){return this.di.add(n.toString()),V.resolve()}removeTarget(e,n){this.Ri.Gr(n.targetId).forEach((i=>this.di.add(i.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next((i=>{i.forEach((o=>this.di.add(o.toString())))})).next((()=>r.removeTargetData(e,n)))}Ti(){this.Ai=new Set}Ei(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.di,(r=>{const i=B.fromPath(r);return this.mi(e,i).next((o=>{o||n.removeEntry(i,W.min())}))})).next((()=>(this.Ai=null,n.apply(e))))}updateLimboDocument(e,n){return this.mi(e,n).next((r=>{r?this.di.delete(n.toString()):this.di.add(n.toString())}))}hi(e){return 0}mi(e,n){return V.or([()=>V.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ii(e,n)])}}class _r{constructor(e,n){this.persistence=e,this.fi=new nn((r=>Em(r.path)),((r,i)=>r.isEqual(i))),this.garbageCollector=Og(this,n)}static Vi(e,n){return new _r(e,n)}Ti(){}Ei(e){return V.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}dr(e){const n=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>n.next((i=>r+i))))}pr(e){let n=0;return this.mr(e,(r=>{n++})).next((()=>n))}mr(e,n){return V.forEach(this.fi,((r,i)=>this.wr(e,r,i).next((o=>o?V.resolve():n(i)))))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),o=i.newChangeBuffer();return i.ni(e,(l=>this.wr(e,l,n).next((c=>{c||(r++,o.removeEntry(l,W.min()))})))).next((()=>o.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,n){return this.fi.set(n,e.currentSequenceNumber),V.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),V.resolve()}removeReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),V.resolve()}updateLimboDocument(e,n){return this.fi.set(n,e.currentSequenceNumber),V.resolve()}hi(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=ir(e.data.value)),n}wr(e,n,r){return V.or([()=>this.persistence.Ii(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.fi.get(n);return V.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class jo{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Ts=r,this.Es=i}static Is(e,n){let r=X(),i=X();for(const o of n.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:i=i.add(o.doc.key)}return new jo(e,n.fromCache,r,i)}}/**
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
 */class Yg{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Jg{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return Lp()?8:wm(ke())>0?6:4})()}initialize(e,n){this.fs=e,this.indexManager=n,this.Rs=!0}getDocumentsMatchingQuery(e,n,r,i){const o={result:null};return this.gs(e,n).next((l=>{o.result=l})).next((()=>{if(!o.result)return this.ps(e,n,i,r).next((l=>{o.result=l}))})).next((()=>{if(o.result)return;const l=new Yg;return this.ys(e,n,l).next((c=>{if(o.result=c,this.As)return this.ws(e,n,l,c.size)}))})).next((()=>o.result))}ws(e,n,r,i){return r.documentReadCount<this.Vs?(dn()<=Y.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",un(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),V.resolve()):(dn()<=Y.DEBUG&&O("QueryEngine","Query:",un(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.ds*i?(dn()<=Y.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",un(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ke(n))):V.resolve())}gs(e,n){if(Jl(n))return V.resolve(null);let r=Ke(n);return this.indexManager.getIndexType(e,r).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=co(n,null,"F"),r=Ke(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next((o=>{const l=X(...o);return this.fs.getDocuments(e,l).next((c=>this.indexManager.getMinOffset(e,r).next((d=>{const h=this.Ss(n,c);return this.bs(n,h,l,d.readTime)?this.gs(e,co(n,null,"F")):this.Ds(e,h,n,d)}))))})))))}ps(e,n,r,i){return Jl(n)||i.isEqual(W.min())?V.resolve(null):this.fs.getDocuments(e,r).next((o=>{const l=this.Ss(n,o);return this.bs(n,l,r,i)?V.resolve(null):(dn()<=Y.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),un(n)),this.Ds(e,l,n,gm(i,us)).next((c=>c)))}))}Ss(e,n){let r=new me(zd(e));return n.forEach(((i,o)=>{qr(e,o)&&(r=r.add(o))})),r}bs(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const o=e.limitType==="F"?n.last():n.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(i)>0)}ys(e,n,r){return dn()<=Y.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",un(n)),this.fs.getDocumentsMatchingQuery(e,n,Ct.min(),r)}Ds(e,n,r,i){return this.fs.getDocumentsMatchingQuery(e,r,i).next((o=>(n.forEach((l=>{o=o.insert(l.key,l)})),o)))}}/**
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
 */const zo="LocalStore",Xg=3e8;class Zg{constructor(e,n,r,i){this.persistence=e,this.Cs=n,this.serializer=i,this.vs=new oe(J),this.Fs=new nn((o=>Vo(o)),No),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(r)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Bg(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(n=>e.collect(n,this.vs)))}}function e0(s,e,n,r){return new Zg(s,e,n,r)}async function fu(s,e){const n=K(s);return await n.persistence.runTransaction("Handle user change","readonly",(r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next((o=>(i=o,n.Os(e),n.mutationQueue.getAllMutationBatches(r)))).next((o=>{const l=[],c=[];let d=X();for(const h of i){l.push(h.batchId);for(const f of h.mutations)d=d.add(f.key)}for(const h of o){c.push(h.batchId);for(const f of h.mutations)d=d.add(f.key)}return n.localDocuments.getDocuments(r,d).next((h=>({Ns:h,removedBatchIds:l,addedBatchIds:c})))}))}))}function t0(s,e){const n=K(s);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const i=e.batch.keys(),o=n.xs.newChangeBuffer({trackRemovals:!0});return(function(c,d,h,f){const g=h.batch,b=g.keys();let v=V.resolve();return b.forEach((T=>{v=v.next((()=>f.getEntry(d,T))).next((R=>{const P=h.docVersions.get(T);te(P!==null,48541),R.version.compareTo(P)<0&&(g.applyToRemoteDocument(R,h),R.isValidDocument()&&(R.setReadTime(h.commitVersion),f.addEntry(R)))}))})),v.next((()=>c.mutationQueue.removeMutationBatch(d,g)))})(n,r,e,o).next((()=>o.apply(r))).next((()=>n.mutationQueue.performConsistencyCheck(r))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let d=X();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(d=d.add(c.batch.mutations[h].key));return d})(e)))).next((()=>n.localDocuments.getDocuments(r,i)))}))}function mu(s){const e=K(s);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(n=>e.li.getLastRemoteSnapshotVersion(n)))}function n0(s,e){const n=K(s),r=e.snapshotVersion;let i=n.vs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const l=n.xs.newChangeBuffer({trackRemovals:!0});i=n.vs;const c=[];e.targetChanges.forEach(((f,g)=>{const b=i.get(g);if(!b)return;c.push(n.li.removeMatchingKeys(o,f.removedDocuments,g).next((()=>n.li.addMatchingKeys(o,f.addedDocuments,g))));let v=b.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(g)!==null?v=v.withResumeToken(xe.EMPTY_BYTE_STRING,W.min()).withLastLimboFreeSnapshotVersion(W.min()):f.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(f.resumeToken,r)),i=i.insert(g,v),(function(R,P,L){return R.resumeToken.approximateByteSize()===0||P.snapshotVersion.toMicroseconds()-R.snapshotVersion.toMicroseconds()>=Xg?!0:L.addedDocuments.size+L.modifiedDocuments.size+L.removedDocuments.size>0})(b,v,f)&&c.push(n.li.updateTargetData(o,v))}));let d=ot(),h=X();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(n.persistence.referenceDelegate.updateLimboDocument(o,f))})),c.push(s0(o,l,e.documentUpdates).next((f=>{d=f.Bs,h=f.Ls}))),!r.isEqual(W.min())){const f=n.li.getLastRemoteSnapshotVersion(o).next((g=>n.li.setTargetsMetadata(o,o.currentSequenceNumber,r)));c.push(f)}return V.waitFor(c).next((()=>l.apply(o))).next((()=>n.localDocuments.getLocalViewOfDocuments(o,d,h))).next((()=>d))})).then((o=>(n.vs=i,o)))}function s0(s,e,n){let r=X(),i=X();return n.forEach((o=>r=r.add(o))),e.getEntries(s,r).next((o=>{let l=ot();return n.forEach(((c,d)=>{const h=o.get(c);d.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(c)),d.isNoDocument()&&d.version.isEqual(W.min())?(e.removeEntry(c,d.readTime),l=l.insert(c,d)):!h.isValidDocument()||d.version.compareTo(h.version)>0||d.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(d),l=l.insert(c,d)):O(zo,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",d.version)})),{Bs:l,Ls:i}}))}function r0(s,e){const n=K(s);return n.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Co),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function i0(s,e){const n=K(s);return n.persistence.runTransaction("Allocate target","readwrite",(r=>{let i;return n.li.getTargetData(r,e).next((o=>o?(i=o,V.resolve(i)):n.li.allocateTargetId(r).next((l=>(i=new Et(e,l,"TargetPurposeListen",r.currentSequenceNumber),n.li.addTargetData(r,i).next((()=>i)))))))})).then((r=>{const i=n.vs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.vs=n.vs.insert(r.targetId,r),n.Fs.set(e,r.targetId)),r}))}async function mo(s,e,n){const r=K(s),i=r.vs.get(e),o=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",o,(l=>r.persistence.referenceDelegate.removeTarget(l,i)))}catch(l){if(!Pn(l))throw l;O(zo,`Failed to update sequence numbers for target ${e}: ${l}`)}r.vs=r.vs.remove(e),r.Fs.delete(i.target)}function dc(s,e,n){const r=K(s);let i=W.min(),o=X();return r.persistence.runTransaction("Execute query","readwrite",(l=>(function(d,h,f){const g=K(d),b=g.Fs.get(f);return b!==void 0?V.resolve(g.vs.get(b)):g.li.getTargetData(h,f)})(r,l,Ke(e)).next((c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(l,c.targetId).next((d=>{o=d}))})).next((()=>r.Cs.getDocumentsMatchingQuery(l,e,n?i:W.min(),n?o:X()))).next((c=>(o0(r,Hm(e),c),{documents:c,ks:o})))))}function o0(s,e,n){let r=s.Ms.get(e)||W.min();n.forEach(((i,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)})),s.Ms.set(e,r)}class uc{constructor(){this.activeTargetIds=Jm()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class a0{constructor(){this.vo=new uc,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,n,r){this.Fo[e]=n}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new uc,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class l0{Mo(e){}shutdown(){}}/**
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
 */const hc="ConnectivityMonitor";class pc{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){O(hc,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){O(hc,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Zs=null;function go(){return Zs===null?Zs=(function(){return 268435456+Math.round(2147483648*Math.random())})():Zs++,"0x"+Zs.toString(16)}/**
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
 */const Bi="RestConnection",c0={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class d0{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.$o=this.databaseId.database===yr?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,n,r,i,o){const l=go(),c=this.Qo(e,n.toUriEncodedString());O(Bi,`Sending RPC '${e}' ${l}:`,c,r);const d={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(d,i,o);const{host:h}=new URL(c),f=ks(h);return this.zo(e,c,d,r,f).then((g=>(O(Bi,`Received RPC '${e}' ${l}: `,g),g)),(g=>{throw wn(Bi,`RPC '${e}' ${l} failed with error: `,g,"url: ",c,"request:",r),g}))}jo(e,n,r,i,o,l){return this.Wo(e,n,r,i,o)}Go(e,n,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Rn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach(((i,o)=>e[o]=i)),r&&r.headers.forEach(((i,o)=>e[o]=i))}Qo(e,n){const r=c0[e];let i=`${this.Ko}/v1/${n}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}}/**
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
 */class u0{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
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
 */const _e="WebChannelConnection",Jn=(s,e,n)=>{s.listen(e,(r=>{try{n(r)}catch(i){setTimeout((()=>{throw i}),0)}}))};class mn extends d0{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!mn.c_){const e=xd();Jn(e,vd.STAT_EVENT,(n=>{n.stat===no.PROXY?O(_e,"STAT_EVENT: detected buffering proxy"):n.stat===no.NOPROXY&&O(_e,"STAT_EVENT: detected no buffering proxy")})),mn.c_=!0}}zo(e,n,r,i,o){const l=go();return new Promise(((c,d)=>{const h=new yd;h.setWithCredentials(!0),h.listenOnce(bd.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case rr.NO_ERROR:const g=h.getResponseJson();O(_e,`XHR for RPC '${e}' ${l} received:`,JSON.stringify(g)),c(g);break;case rr.TIMEOUT:O(_e,`RPC '${e}' ${l} timed out`),d(new $(D.DEADLINE_EXCEEDED,"Request time out"));break;case rr.HTTP_ERROR:const b=h.getStatus();if(O(_e,`RPC '${e}' ${l} failed with status:`,b,"response text:",h.getResponseText()),b>0){let v=h.getResponseJson();Array.isArray(v)&&(v=v[0]);const T=v==null?void 0:v.error;if(T&&T.status&&T.message){const R=(function(L){const N=L.toLowerCase().replace(/_/g,"-");return Object.values(D).indexOf(N)>=0?N:D.UNKNOWN})(T.status);d(new $(R,T.message))}else d(new $(D.UNKNOWN,"Server responded with status "+h.getStatus()))}else d(new $(D.UNAVAILABLE,"Connection failed."));break;default:z(9055,{l_:e,streamId:l,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{O(_e,`RPC '${e}' ${l} completed.`)}}));const f=JSON.stringify(i);O(_e,`RPC '${e}' ${l} sending request:`,i),h.send(n,"POST",f,r,15)}))}T_(e,n,r){const i=go(),o=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],l=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(c.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Go(c.initMessageHeaders,n,r),c.encodeInitMessageHeaders=!0;const h=o.join("");O(_e,`Creating RPC '${e}' stream ${i}: ${h}`,c);const f=l.createWebChannel(h,c);this.E_(f);let g=!1,b=!1;const v=new u0({Jo:T=>{b?O(_e,`Not sending because RPC '${e}' stream ${i} is closed:`,T):(g||(O(_e,`Opening RPC '${e}' stream ${i} transport.`),f.open(),g=!0),O(_e,`RPC '${e}' stream ${i} sending:`,T),f.send(T))},Ho:()=>f.close()});return Jn(f,Xn.EventType.OPEN,(()=>{b||(O(_e,`RPC '${e}' stream ${i} transport opened.`),v.i_())})),Jn(f,Xn.EventType.CLOSE,(()=>{b||(b=!0,O(_e,`RPC '${e}' stream ${i} transport closed`),v.o_(),this.I_(f))})),Jn(f,Xn.EventType.ERROR,(T=>{b||(b=!0,wn(_e,`RPC '${e}' stream ${i} transport errored. Name:`,T.name,"Message:",T.message),v.o_(new $(D.UNAVAILABLE,"The operation could not be completed")))})),Jn(f,Xn.EventType.MESSAGE,(T=>{var R;if(!b){const P=T.data[0];te(!!P,16349);const L=P,N=(L==null?void 0:L.error)||((R=L[0])==null?void 0:R.error);if(N){O(_e,`RPC '${e}' stream ${i} received error:`,N);const q=N.status;let j=(function(E){const x=ue[E];if(x!==void 0)return eu(x)})(q),G=N.message;q==="NOT_FOUND"&&G.includes("database")&&G.includes("does not exist")&&G.includes(this.databaseId.database)&&wn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),j===void 0&&(j=D.INTERNAL,G="Unknown error status: "+q+" with message "+N.message),b=!0,v.o_(new $(j,G)),f.close()}else O(_e,`RPC '${e}' stream ${i} received:`,P),v.__(P)}})),mn.u_(),setTimeout((()=>{v.s_()}),0),v}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter((n=>n===e))}Go(e,n,r){super.Go(e,n,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return wd()}}/**
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
 */function h0(s){return new mn(s)}function ji(){return typeof document<"u"?document:null}/**
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
 */function Kr(s){return new yg(s,!0)}/**
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
 */mn.c_=!1;class gu{constructor(e,n,r=1e3,i=1.5,o=6e4){this.Ci=e,this.timerId=n,this.R_=r,this.A_=i,this.V_=o,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const n=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),i=Math.max(0,n-r);i>0&&O("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.d_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,i,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */const fc="PersistentStream";class yu{constructor(e,n,r,i,o,l,c,d){this.Ci=e,this.S_=r,this.b_=i,this.connection=o,this.authCredentialsProvider=l,this.appCheckCredentialsProvider=c,this.listener=d,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new gu(e,n)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():n&&n.code===D.RESOURCE_EXHAUSTED?(it(n.toString()),it("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):n&&n.code===D.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(n)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),n=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,i])=>{this.D_===n&&this.G_(r,i)}),(r=>{e((()=>{const i=new $(D.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(i)}))}))}G_(e,n){const r=this.Q_(this.D_);this.stream=this.j_(e,n),this.stream.Zo((()=>{r((()=>this.listener.Zo()))})),this.stream.Yo((()=>{r((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((i=>{r((()=>this.z_(i)))})),this.stream.onMessage((i=>{r((()=>++this.F_==1?this.J_(i):this.onNext(i)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return O(fc,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return n=>{this.Ci.enqueueAndForget((()=>this.D_===e?n():(O(fc,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class p0 extends yu{constructor(e,n,r,i,o,l){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,l),this.serializer=o}j_(e,n){return this.connection.T_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const n=xg(this.serializer,e),r=(function(o){if(!("targetChange"in o))return W.min();const l=o.targetChange;return l.targetIds&&l.targetIds.length?W.min():l.readTime?Qe(l.readTime):W.min()})(e);return this.listener.H_(n,r)}Z_(e){const n={};n.database=fo(this.serializer),n.addTarget=(function(o,l){let c;const d=l.target;if(c=ao(d)?{documents:Eg(o,d)}:{query:kg(o,d).ft},c.targetId=l.targetId,l.resumeToken.approximateByteSize()>0){c.resumeToken=su(o,l.resumeToken);const h=uo(o,l.expectedCount);h!==null&&(c.expectedCount=h)}else if(l.snapshotVersion.compareTo(W.min())>0){c.readTime=wr(o,l.snapshotVersion.toTimestamp());const h=uo(o,l.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const r=Tg(this.serializer,e);r&&(n.labels=r),this.q_(n)}X_(e){const n={};n.database=fo(this.serializer),n.removeTarget=e,this.q_(n)}}class f0 extends yu{constructor(e,n,r,i,o,l){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,l),this.serializer=o}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,n){return this.connection.T_("Write",e,n)}J_(e){return te(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,te(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){te(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const n=_g(e.writeResults,e.commitTime),r=Qe(e.commitTime);return this.listener.na(r,n)}ra(){const e={};e.database=fo(this.serializer),this.q_(e)}ea(e){const n={streamToken:this.lastStreamToken,writes:e.map((r=>wg(this.serializer,r)))};this.q_(n)}}/**
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
 */class m0{}class g0 extends m0{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ia=!1}sa(){if(this.ia)throw new $(D.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Wo(e,ho(n,r),i,o,l))).catch((o=>{throw o.name==="FirebaseError"?(o.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(D.UNKNOWN,o.toString())}))}jo(e,n,r,i,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,c])=>this.connection.jo(e,ho(n,r),i,l,c,o))).catch((l=>{throw l.name==="FirebaseError"?(l.code===D.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new $(D.UNKNOWN,l.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function y0(s,e,n,r){return new g0(s,e,n,r)}class b0{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(it(n),this.aa=!1):O("OnlineStateTracker",n)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const Zt="RemoteStore";class v0{constructor(e,n,r,i,o){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=o,this.Aa.Mo((l=>{r.enqueueAndForget((async()=>{sn(this)&&(O(Zt,"Restarting streams for network reachability change."),await(async function(d){const h=K(d);h.Ia.add(4),await Ss(h),h.Va.set("Unknown"),h.Ia.delete(4),await Qr(h)})(this))}))})),this.Va=new b0(r,i)}}async function Qr(s){if(sn(s))for(const e of s.Ra)await e(!0)}async function Ss(s){for(const e of s.Ra)await e(!1)}function bu(s,e){const n=K(s);n.Ea.has(e.targetId)||(n.Ea.set(e.targetId,e),Wo(n)?Go(n):Vn(n).O_()&&Ho(n,e))}function qo(s,e){const n=K(s),r=Vn(n);n.Ea.delete(e),r.O_()&&vu(n,e),n.Ea.size===0&&(r.O_()?r.L_():sn(n)&&n.Va.set("Unknown"))}function Ho(s,e){if(s.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(W.min())>0){const n=s.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Vn(s).Z_(e)}function vu(s,e){s.da.$e(e),Vn(s).X_(e)}function Go(s){s.da=new pg({getRemoteKeysForTarget:e=>s.remoteSyncer.getRemoteKeysForTarget(e),At:e=>s.Ea.get(e)||null,ht:()=>s.datastore.serializer.databaseId}),Vn(s).start(),s.Va.ua()}function Wo(s){return sn(s)&&!Vn(s).x_()&&s.Ea.size>0}function sn(s){return K(s).Ia.size===0}function xu(s){s.da=void 0}async function x0(s){s.Va.set("Online")}async function w0(s){s.Ea.forEach(((e,n)=>{Ho(s,e)}))}async function _0(s,e){xu(s),Wo(s)?(s.Va.ha(e),Go(s)):s.Va.set("Unknown")}async function E0(s,e,n){if(s.Va.set("Online"),e instanceof nu&&e.state===2&&e.cause)try{await(async function(i,o){const l=o.cause;for(const c of o.targetIds)i.Ea.has(c)&&(await i.remoteSyncer.rejectListen(c,l),i.Ea.delete(c),i.da.removeTarget(c))})(s,e)}catch(r){O(Zt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Er(s,r)}else if(e instanceof lr?s.da.Xe(e):e instanceof tu?s.da.st(e):s.da.tt(e),!n.isEqual(W.min()))try{const r=await mu(s.localStore);n.compareTo(r)>=0&&await(function(o,l){const c=o.da.Tt(l);return c.targetChanges.forEach(((d,h)=>{if(d.resumeToken.approximateByteSize()>0){const f=o.Ea.get(h);f&&o.Ea.set(h,f.withResumeToken(d.resumeToken,l))}})),c.targetMismatches.forEach(((d,h)=>{const f=o.Ea.get(d);if(!f)return;o.Ea.set(d,f.withResumeToken(xe.EMPTY_BYTE_STRING,f.snapshotVersion)),vu(o,d);const g=new Et(f.target,d,h,f.sequenceNumber);Ho(o,g)})),o.remoteSyncer.applyRemoteEvent(c)})(s,n)}catch(r){O(Zt,"Failed to raise snapshot:",r),await Er(s,r)}}async function Er(s,e,n){if(!Pn(e))throw e;s.Ia.add(1),await Ss(s),s.Va.set("Offline"),n||(n=()=>mu(s.localStore)),s.asyncQueue.enqueueRetryable((async()=>{O(Zt,"Retrying IndexedDB access"),await n(),s.Ia.delete(1),await Qr(s)}))}function wu(s,e){return e().catch((n=>Er(s,n,e)))}async function Yr(s){const e=K(s),n=Nt(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:Co;for(;k0(e);)try{const i=await r0(e.localStore,r);if(i===null){e.Ta.length===0&&n.L_();break}r=i.batchId,I0(e,i)}catch(i){await Er(e,i)}_u(e)&&Eu(e)}function k0(s){return sn(s)&&s.Ta.length<10}function I0(s,e){s.Ta.push(e);const n=Nt(s);n.O_()&&n.Y_&&n.ea(e.mutations)}function _u(s){return sn(s)&&!Nt(s).x_()&&s.Ta.length>0}function Eu(s){Nt(s).start()}async function T0(s){Nt(s).ra()}async function A0(s){const e=Nt(s);for(const n of s.Ta)e.ea(n.mutations)}async function S0(s,e,n){const r=s.Ta.shift(),i=$o.from(r,e,n);await wu(s,(()=>s.remoteSyncer.applySuccessfulWrite(i))),await Yr(s)}async function R0(s,e){e&&Nt(s).Y_&&await(async function(r,i){if((function(l){return dg(l)&&l!==D.ABORTED})(i.code)){const o=r.Ta.shift();Nt(r).B_(),await wu(r,(()=>r.remoteSyncer.rejectFailedWrite(o.batchId,i))),await Yr(r)}})(s,e),_u(s)&&Eu(s)}async function mc(s,e){const n=K(s);n.asyncQueue.verifyOperationInProgress(),O(Zt,"RemoteStore received new credentials");const r=sn(n);n.Ia.add(3),await Ss(n),r&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ia.delete(3),await Qr(n)}async function C0(s,e){const n=K(s);e?(n.Ia.delete(2),await Qr(n)):e||(n.Ia.add(2),await Ss(n),n.Va.set("Unknown"))}function Vn(s){return s.ma||(s.ma=(function(n,r,i){const o=K(n);return o.sa(),new p0(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,i)})(s.datastore,s.asyncQueue,{Zo:x0.bind(null,s),Yo:w0.bind(null,s),t_:_0.bind(null,s),H_:E0.bind(null,s)}),s.Ra.push((async e=>{e?(s.ma.B_(),Wo(s)?Go(s):s.Va.set("Unknown")):(await s.ma.stop(),xu(s))}))),s.ma}function Nt(s){return s.fa||(s.fa=(function(n,r,i){const o=K(n);return o.sa(),new f0(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,i)})(s.datastore,s.asyncQueue,{Zo:()=>Promise.resolve(),Yo:T0.bind(null,s),t_:R0.bind(null,s),ta:A0.bind(null,s),na:S0.bind(null,s)}),s.Ra.push((async e=>{e?(s.fa.B_(),await Yr(s)):(await s.fa.stop(),s.Ta.length>0&&(O(Zt,`Stopping write stream with ${s.Ta.length} pending writes`),s.Ta=[]))}))),s.fa}/**
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
 */class Ko{constructor(e,n,r,i,o){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=o,this.deferred=new st,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,o){const l=Date.now()+r,c=new Ko(e,n,l,i,o);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(D.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Qo(s,e){if(it("AsyncQueue",`${e}: ${s}`),Pn(s))return new $(D.UNAVAILABLE,`${e}: ${s}`);throw s}/**
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
 */class gn{static emptySet(e){return new gn(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||B.comparator(n.key,r.key):(n,r)=>B.comparator(n.key,r.key),this.keyedMap=Zn(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((n,r)=>(e(n),!1)))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof gn)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,o=r.getNext().key;if(!i.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((n=>{e.push(n.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new gn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
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
 */class gc{constructor(){this.ga=new oe(B.comparator)}track(e){const n=e.doc.key,r=this.ga.get(n);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(n,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(n):e.type===1&&r.type===2?this.ga=this.ga.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):z(63341,{Vt:e,pa:r}):this.ga=this.ga.insert(n,e)}ya(){const e=[];return this.ga.inorderTraversal(((n,r)=>{e.push(r)})),e}}class Tn{constructor(e,n,r,i,o,l,c,d,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=o,this.fromCache=l,this.syncStateChanged=c,this.excludesMetadataChanges=d,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,o){const l=[];return n.forEach((c=>{l.push({type:0,doc:c})})),new Tn(e,n,gn.emptySet(n),l,r,i,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&zr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
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
 */class P0{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class D0{constructor(){this.queries=yc(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,r){const i=K(n),o=i.queries;i.queries=yc(),o.forEach(((l,c)=>{for(const d of c.Sa)d.onError(r)}))})(this,new $(D.ABORTED,"Firestore shutting down"))}}function yc(){return new nn((s=>jd(s)),zr)}async function Yo(s,e){const n=K(s);let r=3;const i=e.query;let o=n.queries.get(i);o?!o.ba()&&e.Da()&&(r=2):(o=new P0,r=e.Da()?0:1);try{switch(r){case 0:o.wa=await n.onListen(i,!0);break;case 1:o.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(l){const c=Qo(l,`Initialization of query '${un(e.query)}' failed`);return void e.onError(c)}n.queries.set(i,o),o.Sa.push(e),e.va(n.onlineState),o.wa&&e.Fa(o.wa)&&Xo(n)}async function Jo(s,e){const n=K(s),r=e.query;let i=3;const o=n.queries.get(r);if(o){const l=o.Sa.indexOf(e);l>=0&&(o.Sa.splice(l,1),o.Sa.length===0?i=e.Da()?0:1:!o.ba()&&e.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function V0(s,e){const n=K(s);let r=!1;for(const i of e){const o=i.query,l=n.queries.get(o);if(l){for(const c of l.Sa)c.Fa(i)&&(r=!0);l.wa=i}}r&&Xo(n)}function N0(s,e,n){const r=K(s),i=r.queries.get(e);if(i)for(const o of i.Sa)o.onError(n);r.queries.delete(e)}function Xo(s){s.Ca.forEach((e=>{e.next()}))}var yo,bc;(bc=yo||(yo={})).Ma="default",bc.Cache="cache";class Zo{constructor(e,n,r){this.query=e,this.xa=n,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Tn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),n=!0):this.La(e,this.onlineState)&&(this.ka(e),n=!0),this.Na=e,n}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let n=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),n=!0),n}La(e,n){if(!e.fromCache||!this.Da())return!0;const r=n!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const n=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}ka(e){e=Tn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==yo.Cache}}/**
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
 */class ku{constructor(e){this.key=e}}class Iu{constructor(e){this.key=e}}class M0{constructor(e,n){this.query=e,this.Za=n,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=X(),this.mutatedKeys=X(),this.eu=zd(e),this.tu=new gn(this.eu)}get nu(){return this.Za}ru(e,n){const r=n?n.iu:new gc,i=n?n.tu:this.tu;let o=n?n.mutatedKeys:this.mutatedKeys,l=i,c=!1;const d=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,g)=>{const b=i.get(f),v=qr(this.query,g)?g:null,T=!!b&&this.mutatedKeys.has(b.key),R=!!v&&(v.hasLocalMutations||this.mutatedKeys.has(v.key)&&v.hasCommittedMutations);let P=!1;b&&v?b.data.isEqual(v.data)?T!==R&&(r.track({type:3,doc:v}),P=!0):this.su(b,v)||(r.track({type:2,doc:v}),P=!0,(d&&this.eu(v,d)>0||h&&this.eu(v,h)<0)&&(c=!0)):!b&&v?(r.track({type:0,doc:v}),P=!0):b&&!v&&(r.track({type:1,doc:b}),P=!0,(d||h)&&(c=!0)),P&&(v?(l=l.add(v),o=R?o.add(f):o.delete(f)):(l=l.delete(f),o=o.delete(f)))})),this.query.limit!==null)for(;l.size>this.query.limit;){const f=this.query.limitType==="F"?l.last():l.first();l=l.delete(f.key),o=o.delete(f.key),r.track({type:1,doc:f})}return{tu:l,iu:r,bs:c,mutatedKeys:o}}su(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const l=e.iu.ya();l.sort(((f,g)=>(function(v,T){const R=P=>{switch(P){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return z(20277,{Vt:P})}};return R(v)-R(T)})(f.type,g.type)||this.eu(f.doc,g.doc))),this.ou(r),i=i??!1;const c=n&&!i?this._u():[],d=this.Ya.size===0&&this.current&&!i?1:0,h=d!==this.Xa;return this.Xa=d,l.length!==0||h?{snapshot:new Tn(this.query,e.tu,o,l,e.mutatedKeys,d===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:c}:{au:c}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new gc,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((n=>this.Za=this.Za.add(n))),e.modifiedDocuments.forEach((n=>{})),e.removedDocuments.forEach((n=>this.Za=this.Za.delete(n))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=X(),this.tu.forEach((r=>{this.uu(r.key)&&(this.Ya=this.Ya.add(r.key))}));const n=[];return e.forEach((r=>{this.Ya.has(r)||n.push(new Iu(r))})),this.Ya.forEach((r=>{e.has(r)||n.push(new ku(r))})),n}cu(e){this.Za=e.ks,this.Ya=X();const n=this.ru(e.documents);return this.applyChanges(n,!0)}lu(){return Tn.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const ea="SyncEngine";class L0{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class $0{constructor(e){this.key=e,this.hu=!1}}class O0{constructor(e,n,r,i,o,l){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=o,this.maxConcurrentLimboResolutions=l,this.Pu={},this.Tu=new nn((c=>jd(c)),zr),this.Eu=new Map,this.Iu=new Set,this.Ru=new oe(B.comparator),this.Au=new Map,this.Vu=new Uo,this.du={},this.mu=new Map,this.fu=In.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function F0(s,e,n=!0){const r=Pu(s);let i;const o=r.Tu.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),i=o.view.lu()):i=await Tu(r,e,n,!0),i}async function U0(s,e){const n=Pu(s);await Tu(n,e,!0,!1)}async function Tu(s,e,n,r){const i=await i0(s.localStore,Ke(e)),o=i.targetId,l=s.sharedClientState.addLocalQueryTarget(o,n);let c;return r&&(c=await B0(s,e,o,l==="current",i.resumeToken)),s.isPrimaryClient&&n&&bu(s.remoteStore,i),c}async function B0(s,e,n,r,i){s.pu=(g,b,v)=>(async function(R,P,L,N){let q=P.view.ru(L);q.bs&&(q=await dc(R.localStore,P.query,!1).then((({documents:E})=>P.view.ru(E,q))));const j=N&&N.targetChanges.get(P.targetId),G=N&&N.targetMismatches.get(P.targetId)!=null,Z=P.view.applyChanges(q,R.isPrimaryClient,j,G);return xc(R,P.targetId,Z.au),Z.snapshot})(s,g,b,v);const o=await dc(s.localStore,e,!0),l=new M0(e,o.ks),c=l.ru(o.documents),d=As.createSynthesizedTargetChangeForCurrentChange(n,r&&s.onlineState!=="Offline",i),h=l.applyChanges(c,s.isPrimaryClient,d);xc(s,n,h.au);const f=new L0(e,n,l);return s.Tu.set(e,f),s.Eu.has(n)?s.Eu.get(n).push(e):s.Eu.set(n,[e]),h.snapshot}async function j0(s,e,n){const r=K(s),i=r.Tu.get(e),o=r.Eu.get(i.targetId);if(o.length>1)return r.Eu.set(i.targetId,o.filter((l=>!zr(l,e)))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await mo(r.localStore,i.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(i.targetId),n&&qo(r.remoteStore,i.targetId),bo(r,i.targetId)})).catch(Cn)):(bo(r,i.targetId),await mo(r.localStore,i.targetId,!0))}async function z0(s,e){const n=K(s),r=n.Tu.get(e),i=n.Eu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),qo(n.remoteStore,r.targetId))}async function q0(s,e,n){const r=J0(s);try{const i=await(function(l,c){const d=K(l),h=ie.now(),f=c.reduce(((v,T)=>v.add(T.key)),X());let g,b;return d.persistence.runTransaction("Locally write mutations","readwrite",(v=>{let T=ot(),R=X();return d.xs.getEntries(v,f).next((P=>{T=P,T.forEach(((L,N)=>{N.isValidDocument()||(R=R.add(L))}))})).next((()=>d.localDocuments.getOverlayedDocuments(v,T))).next((P=>{g=P;const L=[];for(const N of c){const q=ig(N,g.get(N.key).overlayedDocument);q!=null&&L.push(new Ot(N.key,q,Nd(q.value.mapValue),$e.exists(!0)))}return d.mutationQueue.addMutationBatch(v,h,L,c)})).next((P=>{b=P;const L=P.applyToLocalDocumentSet(g,R);return d.documentOverlayCache.saveOverlays(v,P.batchId,L)}))})).then((()=>({batchId:b.batchId,changes:Hd(g)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),(function(l,c,d){let h=l.du[l.currentUser.toKey()];h||(h=new oe(J)),h=h.insert(c,d),l.du[l.currentUser.toKey()]=h})(r,i.batchId,n),await Rs(r,i.changes),await Yr(r.remoteStore)}catch(i){const o=Qo(i,"Failed to persist write");n.reject(o)}}async function Au(s,e){const n=K(s);try{const r=await n0(n.localStore,e);e.targetChanges.forEach(((i,o)=>{const l=n.Au.get(o);l&&(te(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?l.hu=!0:i.modifiedDocuments.size>0?te(l.hu,14607):i.removedDocuments.size>0&&(te(l.hu,42227),l.hu=!1))})),await Rs(n,r,e)}catch(r){await Cn(r)}}function vc(s,e,n){const r=K(s);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Tu.forEach(((o,l)=>{const c=l.view.va(e);c.snapshot&&i.push(c.snapshot)})),(function(l,c){const d=K(l);d.onlineState=c;let h=!1;d.queries.forEach(((f,g)=>{for(const b of g.Sa)b.va(c)&&(h=!0)})),h&&Xo(d)})(r.eventManager,e),i.length&&r.Pu.H_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function H0(s,e,n){const r=K(s);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Au.get(e),o=i&&i.key;if(o){let l=new oe(B.comparator);l=l.insert(o,Ee.newNoDocument(o,W.min()));const c=X().add(o),d=new Wr(W.min(),new Map,new oe(J),l,c);await Au(r,d),r.Ru=r.Ru.remove(o),r.Au.delete(e),ta(r)}else await mo(r.localStore,e,!1).then((()=>bo(r,e,n))).catch(Cn)}async function G0(s,e){const n=K(s),r=e.batch.batchId;try{const i=await t0(n.localStore,e);Ru(n,r,null),Su(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Rs(n,i)}catch(i){await Cn(i)}}async function W0(s,e,n){const r=K(s);try{const i=await(function(l,c){const d=K(l);return d.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return d.mutationQueue.lookupMutationBatch(h,c).next((g=>(te(g!==null,37113),f=g.keys(),d.mutationQueue.removeMutationBatch(h,g)))).next((()=>d.mutationQueue.performConsistencyCheck(h))).next((()=>d.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>d.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>d.localDocuments.getDocuments(h,f)))}))})(r.localStore,e);Ru(r,e,n),Su(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Rs(r,i)}catch(i){await Cn(i)}}function Su(s,e){(s.mu.get(e)||[]).forEach((n=>{n.resolve()})),s.mu.delete(e)}function Ru(s,e,n){const r=K(s);let i=r.du[r.currentUser.toKey()];if(i){const o=i.get(e);o&&(n?o.reject(n):o.resolve(),i=i.remove(e)),r.du[r.currentUser.toKey()]=i}}function bo(s,e,n=null){s.sharedClientState.removeLocalQueryTarget(e);for(const r of s.Eu.get(e))s.Tu.delete(r),n&&s.Pu.yu(r,n);s.Eu.delete(e),s.isPrimaryClient&&s.Vu.Gr(e).forEach((r=>{s.Vu.containsKey(r)||Cu(s,r)}))}function Cu(s,e){s.Iu.delete(e.path.canonicalString());const n=s.Ru.get(e);n!==null&&(qo(s.remoteStore,n),s.Ru=s.Ru.remove(e),s.Au.delete(n),ta(s))}function xc(s,e,n){for(const r of n)r instanceof ku?(s.Vu.addReference(r.key,e),K0(s,r)):r instanceof Iu?(O(ea,"Document no longer in limbo: "+r.key),s.Vu.removeReference(r.key,e),s.Vu.containsKey(r.key)||Cu(s,r.key)):z(19791,{wu:r})}function K0(s,e){const n=e.key,r=n.path.canonicalString();s.Ru.get(n)||s.Iu.has(r)||(O(ea,"New document in limbo: "+n),s.Iu.add(r),ta(s))}function ta(s){for(;s.Iu.size>0&&s.Ru.size<s.maxConcurrentLimboResolutions;){const e=s.Iu.values().next().value;s.Iu.delete(e);const n=new B(se.fromString(e)),r=s.fu.next();s.Au.set(r,new $0(n)),s.Ru=s.Ru.insert(n,r),bu(s.remoteStore,new Et(Ke(jr(n.path)),r,"TargetPurposeLimboResolution",Fr.ce))}}async function Rs(s,e,n){const r=K(s),i=[],o=[],l=[];r.Tu.isEmpty()||(r.Tu.forEach(((c,d)=>{l.push(r.pu(d,e,n).then((h=>{var f;if((h||n)&&r.isPrimaryClient){const g=h?!h.fromCache:(f=n==null?void 0:n.targetChanges.get(d.targetId))==null?void 0:f.current;r.sharedClientState.updateQueryState(d.targetId,g?"current":"not-current")}if(h){i.push(h);const g=jo.Is(d.targetId,h);o.push(g)}})))})),await Promise.all(l),r.Pu.H_(i),await(async function(d,h){const f=K(d);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(g=>V.forEach(h,(b=>V.forEach(b.Ts,(v=>f.persistence.referenceDelegate.addReference(g,b.targetId,v))).next((()=>V.forEach(b.Es,(v=>f.persistence.referenceDelegate.removeReference(g,b.targetId,v)))))))))}catch(g){if(!Pn(g))throw g;O(zo,"Failed to update sequence numbers: "+g)}for(const g of h){const b=g.targetId;if(!g.fromCache){const v=f.vs.get(b),T=v.snapshotVersion,R=v.withLastLimboFreeSnapshotVersion(T);f.vs=f.vs.insert(b,R)}}})(r.localStore,o))}async function Q0(s,e){const n=K(s);if(!n.currentUser.isEqual(e)){O(ea,"User change. New user:",e.toKey());const r=await fu(n.localStore,e);n.currentUser=e,(function(o,l){o.mu.forEach((c=>{c.forEach((d=>{d.reject(new $(D.CANCELLED,l))}))})),o.mu.clear()})(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Rs(n,r.Ns)}}function Y0(s,e){const n=K(s),r=n.Au.get(e);if(r&&r.hu)return X().add(r.key);{let i=X();const o=n.Eu.get(e);if(!o)return i;for(const l of o){const c=n.Tu.get(l);i=i.unionWith(c.view.nu)}return i}}function Pu(s){const e=K(s);return e.remoteStore.remoteSyncer.applyRemoteEvent=Au.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Y0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=H0.bind(null,e),e.Pu.H_=V0.bind(null,e.eventManager),e.Pu.yu=N0.bind(null,e.eventManager),e}function J0(s){const e=K(s);return e.remoteStore.remoteSyncer.applySuccessfulWrite=G0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=W0.bind(null,e),e}class kr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Kr(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,n){return null}Mu(e,n){return null}vu(e){return e0(this.persistence,new Jg,e.initialUser,this.serializer)}Cu(e){return new pu(Bo.Vi,this.serializer)}Du(e){return new a0}async terminate(){var e,n;(e=this.gcScheduler)==null||e.stop(),(n=this.indexBackfillerScheduler)==null||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}kr.provider={build:()=>new kr};class X0 extends kr{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,n){te(this.persistence.referenceDelegate instanceof _r,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Lg(r,e.asyncQueue,n)}Cu(e){const n=this.cacheSizeBytes!==void 0?Ce.withCacheSize(this.cacheSizeBytes):Ce.DEFAULT;return new pu((r=>_r.Vi(r,n)),this.serializer)}}class vo{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>vc(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Q0.bind(null,this.syncEngine),await C0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new D0})()}createDatastore(e){const n=Kr(e.databaseInfo.databaseId),r=h0(e.databaseInfo);return y0(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return(function(r,i,o,l,c){return new v0(r,i,o,l,c)})(this.localStore,this.datastore,e.asyncQueue,(n=>vc(this.syncEngine,n,0)),(function(){return pc.v()?new pc:new l0})())}createSyncEngine(e,n){return(function(i,o,l,c,d,h,f){const g=new O0(i,o,l,c,d,h);return f&&(g.gu=!0),g})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await(async function(i){const o=K(i);O(Zt,"RemoteStore shutting down."),o.Ia.add(5),await Ss(o),o.Aa.shutdown(),o.Va.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(n=this.eventManager)==null||n.terminate()}}vo.provider={build:()=>new vo};/**
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
 */class na{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):it("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,n){setTimeout((()=>{this.muted||e(n)}),0)}}/**
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
 */const Mt="FirestoreClient";class Z0{constructor(e,n,r,i,o){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this._databaseInfo=i,this.user=Re.UNAUTHENTICATED,this.clientId=Ro.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,(async l=>{O(Mt,"Received user=",l.uid),await this.authCredentialListener(l),this.user=l})),this.appCheckCredentials.start(r,(l=>(O(Mt,"Received new app check token=",l),this.appCheckCredentialListener(l,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new st;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Qo(n,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function zi(s,e){s.asyncQueue.verifyOperationInProgress(),O(Mt,"Initializing OfflineComponentProvider");const n=s.configuration;await e.initialize(n);let r=n.initialUser;s.setCredentialChangeListener((async i=>{r.isEqual(i)||(await fu(e.localStore,i),r=i)})),e.persistence.setDatabaseDeletedListener((()=>s.terminate())),s._offlineComponents=e}async function wc(s,e){s.asyncQueue.verifyOperationInProgress();const n=await ey(s);O(Mt,"Initializing OnlineComponentProvider"),await e.initialize(n,s.configuration),s.setCredentialChangeListener((r=>mc(e.remoteStore,r))),s.setAppCheckTokenChangeListener(((r,i)=>mc(e.remoteStore,i))),s._onlineComponents=e}async function ey(s){if(!s._offlineComponents)if(s._uninitializedComponentsProvider){O(Mt,"Using user provided OfflineComponentProvider");try{await zi(s,s._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!(function(i){return i.name==="FirebaseError"?i.code===D.FAILED_PRECONDITION||i.code===D.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11})(n))throw n;wn("Error using user provided cache. Falling back to memory cache: "+n),await zi(s,new kr)}}else O(Mt,"Using default OfflineComponentProvider"),await zi(s,new X0(void 0));return s._offlineComponents}async function Du(s){return s._onlineComponents||(s._uninitializedComponentsProvider?(O(Mt,"Using user provided OnlineComponentProvider"),await wc(s,s._uninitializedComponentsProvider._online)):(O(Mt,"Using default OnlineComponentProvider"),await wc(s,new vo))),s._onlineComponents}function ty(s){return Du(s).then((e=>e.syncEngine))}async function Ir(s){const e=await Du(s),n=e.eventManager;return n.onListen=F0.bind(null,e.syncEngine),n.onUnlisten=j0.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=U0.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=z0.bind(null,e.syncEngine),n}function ny(s,e,n,r){const i=new na(r),o=new Zo(e,i,n);return s.asyncQueue.enqueueAndForget((async()=>Yo(await Ir(s),o))),()=>{i.Nu(),s.asyncQueue.enqueueAndForget((async()=>Jo(await Ir(s),o)))}}function sy(s,e,n={}){const r=new st;return s.asyncQueue.enqueueAndForget((async()=>(function(o,l,c,d,h){const f=new na({next:b=>{f.Nu(),l.enqueueAndForget((()=>Jo(o,g)));const v=b.docs.has(c);!v&&b.fromCache?h.reject(new $(D.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&b.fromCache&&d&&d.source==="server"?h.reject(new $(D.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(b)},error:b=>h.reject(b)}),g=new Zo(jr(c.path),f,{includeMetadataChanges:!0,qa:!0});return Yo(o,g)})(await Ir(s),s.asyncQueue,e,n,r))),r.promise}function ry(s,e,n={}){const r=new st;return s.asyncQueue.enqueueAndForget((async()=>(function(o,l,c,d,h){const f=new na({next:b=>{f.Nu(),l.enqueueAndForget((()=>Jo(o,g))),b.fromCache&&d.source==="server"?h.reject(new $(D.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(b)},error:b=>h.reject(b)}),g=new Zo(c,f,{includeMetadataChanges:!0,qa:!0});return Yo(o,g)})(await Ir(s),s.asyncQueue,e,n,r))),r.promise}function iy(s,e){const n=new st;return s.asyncQueue.enqueueAndForget((async()=>q0(await ty(s),e,n))),n.promise}/**
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
 */function Vu(s){const e={};return s.timeoutSeconds!==void 0&&(e.timeoutSeconds=s.timeoutSeconds),e}/**
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
 */const oy="ComponentProvider",_c=new Map;function ay(s,e,n,r,i){return new Tm(s,e,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,Vu(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}/**
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
 */const ly="firestore.googleapis.com",Ec=!0;class kc{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new $(D.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ly,this.ssl=Ec}else this.host=e.host,this.ssl=e.ssl??Ec;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=uu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<hu)throw new $(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}mm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Vu(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new $(D.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class sa{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new kc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(D.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(D.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new kc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new om;switch(r.type){case"firstParty":return new cm(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new $(D.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(n){const r=_c.get(n);r&&(O(oy,"Removing Datastore"),_c.delete(n),r.terminate())})(this),Promise.resolve()}}/**
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
 */class Ft{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ft(this.firestore,e,this._query)}}class ce{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new St(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ce(this.firestore,e,this._key)}toJSON(){return{type:ce._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Is(n,ce._jsonSchema))return new ce(e,r||null,new B(se.fromString(n.referencePath)))}}ce._jsonSchemaVersion="firestore/documentReference/1.0",ce._jsonSchema={type:pe("string",ce._jsonSchemaVersion),referencePath:pe("string")};class St extends Ft{constructor(e,n,r){super(e,n,jr(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ce(this.firestore,null,new B(e))}withConverter(e){return new St(this.firestore,e,this._path)}}function ra(s,e,...n){if(s=Ie(s),Ed("collection","path",e),s instanceof sa){const r=se.fromString(e,...n);return $l(r),new St(s,null,r)}{if(!(s instanceof ce||s instanceof St))throw new $(D.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=s._path.child(se.fromString(e,...n));return $l(r),new St(s.firestore,null,r)}}function We(s,e,...n){if(s=Ie(s),arguments.length===1&&(e=Ro.newId()),Ed("doc","path",e),s instanceof sa){const r=se.fromString(e,...n);return Ll(r),new ce(s,null,new B(r))}{if(!(s instanceof ce||s instanceof St))throw new $(D.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=s._path.child(se.fromString(e,...n));return Ll(r),new ce(s.firestore,s instanceof St?s.converter:null,new B(r))}}/**
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
 */const Ic="AsyncQueue";class Tc{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new gu(this,"async_queue_retry"),this._c=()=>{const r=ji();r&&O(Ic,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const n=ji();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const n=ji();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const n=new st;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise))).then((()=>n.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Pn(e))throw e;O(Ic,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const n=this.ac.then((()=>(this.rc=!0,e().catch((r=>{throw this.nc=r,this.rc=!1,it("INTERNAL UNHANDLED ERROR: ",Ac(r)),r})).then((r=>(this.rc=!1,r))))));return this.ac=n,n}enqueueAfterDelay(e,n,r){this.uc(),this.oc.indexOf(e)>-1&&(n=0);const i=Ko.createAndSchedule(this,e,n,r,(o=>this.hc(o)));return this.tc.push(i),i}uc(){this.nc&&z(47125,{Pc:Ac(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const n of this.tc)if(n.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((n,r)=>n.targetTimeMs-r.targetTimeMs));for(const n of this.tc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const n=this.tc.indexOf(e);this.tc.splice(n,1)}}function Ac(s){let e=s.message||"";return s.stack&&(e=s.stack.includes(s.message)?s.stack:s.message+`
`+s.stack),e}class at extends sa{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new Tc,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Tc(e),this._firestoreClient=void 0,await e}}}function cy(s,e,n){n||(n=yr);const r=Ao(s,"firestore");if(r.isInitialized(n)){const i=r.getImmediate({identifier:n}),o=r.getOptions(n);if(Yt(o,e))return i;throw new $(D.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new $(D.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<hu)throw new $(D.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&ks(e.host)&&dd(e.host),r.initialize({options:e,instanceIdentifier:n})}function Jr(s){if(s._terminated)throw new $(D.FAILED_PRECONDITION,"The client has already been terminated.");return s._firestoreClient||dy(s),s._firestoreClient}function dy(s){var r,i,o,l;const e=s._freezeSettings(),n=ay(s._databaseId,((r=s._app)==null?void 0:r.options.appId)||"",s._persistenceKey,(i=s._app)==null?void 0:i.options.apiKey,e);s._componentsProvider||(o=e.localCache)!=null&&o._offlineComponentProvider&&((l=e.localCache)!=null&&l._onlineComponentProvider)&&(s._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),s._firestoreClient=new Z0(s._authCredentials,s._appCheckCredentials,s._queue,n,s._componentsProvider&&(function(d){const h=d==null?void 0:d._online.build();return{_offline:d==null?void 0:d._offline.build(h),_online:h}})(s._componentsProvider))}/**
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
 */class Me{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Me(xe.fromBase64String(e))}catch(n){throw new $(D.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new Me(xe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Me._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Is(e,Me._jsonSchema))return Me.fromBase64String(e.bytes)}}Me._jsonSchemaVersion="firestore/bytes/1.0",Me._jsonSchema={type:pe("string",Me._jsonSchemaVersion),bytes:pe("string")};/**
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
 */class ia{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new $(D.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ve(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Xr{constructor(e){this._methodName=e}}/**
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
 */class Ye{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new $(D.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new $(D.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return J(this._lat,e._lat)||J(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ye._jsonSchemaVersion}}static fromJSON(e){if(Is(e,Ye._jsonSchema))return new Ye(e.latitude,e.longitude)}}Ye._jsonSchemaVersion="firestore/geoPoint/1.0",Ye._jsonSchema={type:pe("string",Ye._jsonSchemaVersion),latitude:pe("number"),longitude:pe("number")};/**
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
 */class Ue{constructor(e){this._values=(e||[]).map((n=>n))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,i){if(r.length!==i.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==i[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Ue._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Is(e,Ue._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((n=>typeof n=="number")))return new Ue(e.vectorValues);throw new $(D.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ue._jsonSchemaVersion="firestore/vectorValue/1.0",Ue._jsonSchema={type:pe("string",Ue._jsonSchemaVersion),vectorValues:pe("object")};/**
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
 */const uy=/^__.*__$/;class hy{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new Ot(e,this.data,this.fieldMask,n,this.fieldTransforms):new Ts(e,this.data,n,this.fieldTransforms)}}class Nu{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new Ot(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function Mu(s){switch(s){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw z(40011,{dataSource:s})}}class oa{constructor(e,n,r,i,o,l){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=l||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new oa({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.mc(e),r}fc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.Ac(),r}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return Tr(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((n=>e.isPrefixOf(n)))!==void 0||this.fieldTransforms.find((n=>e.isPrefixOf(n.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(Mu(this.dataSource)&&uy.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class py{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Kr(e)}I(e,n,r,i=!1){return new oa({dataSource:e,methodName:n,targetDoc:r,path:ve.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Zr(s){const e=s._freezeSettings(),n=Kr(s._databaseId);return new py(s._databaseId,!!e.ignoreUndefinedProperties,n)}function Lu(s,e,n,r,i,o={}){const l=s.I(o.merge||o.mergeFields?2:0,e,n,i);la("Data must be an object, but it was:",l,r);const c=$u(r,l);let d,h;if(o.merge)d=new Ve(l.fieldMask),h=l.fieldTransforms;else if(o.mergeFields){const f=[];for(const g of o.mergeFields){const b=en(e,g,n);if(!l.contains(b))throw new $(D.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);Uu(f,b)||f.push(b)}d=new Ve(f),h=l.fieldTransforms.filter((g=>d.covers(g.field)))}else d=null,h=l.fieldTransforms;return new hy(new Pe(c),d,h)}class ei extends Xr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.yc(`${this._methodName}() can only appear at the top level of your update data`):e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ei}}class aa extends Xr{_toFieldTransform(e){return new tg(e.path,new gs)}isEqual(e){return e instanceof aa}}function fy(s,e,n,r){const i=s.I(1,e,n);la("Data must be an object, but it was:",i,r);const o=[],l=Pe.empty();$t(r,((d,h)=>{const f=Fu(e,d,n);h=Ie(h);const g=i.fc(f);if(h instanceof ei)o.push(f);else{const b=Cs(h,g);b!=null&&(o.push(f),l.set(f,b))}}));const c=new Ve(o);return new Nu(l,c,i.fieldTransforms)}function my(s,e,n,r,i,o){const l=s.I(1,e,n),c=[en(e,r,n)],d=[i];if(o.length%2!=0)throw new $(D.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let b=0;b<o.length;b+=2)c.push(en(e,o[b])),d.push(o[b+1]);const h=[],f=Pe.empty();for(let b=c.length-1;b>=0;--b)if(!Uu(h,c[b])){const v=c[b];let T=d[b];T=Ie(T);const R=l.fc(v);if(T instanceof ei)h.push(v);else{const P=Cs(T,R);P!=null&&(h.push(v),f.set(v,P))}}const g=new Ve(h);return new Nu(f,g,l.fieldTransforms)}function gy(s,e,n,r=!1){return Cs(n,s.I(r?4:3,e))}function Cs(s,e){if(Ou(s=Ie(s)))return la("Unsupported field value:",e,s),$u(s,e);if(s instanceof Xr)return(function(r,i){if(!Mu(i.dataSource))throw i.yc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.yc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(s,e),null;if(s===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),s instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return(function(r,i){const o=[];let l=0;for(const c of r){let d=Cs(c,i.gc(l));d==null&&(d={nullValue:"NULL_VALUE"}),o.push(d),l++}return{arrayValue:{values:o}}})(s,e)}return(function(r,i){if((r=Ie(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return Xm(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=ie.fromDate(r);return{timestampValue:wr(i.serializer,o)}}if(r instanceof ie){const o=new ie(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:wr(i.serializer,o)}}if(r instanceof Ye)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Me)return{bytesValue:su(i.serializer,r._byteString)};if(r instanceof ce){const o=i.databaseId,l=r.firestore._databaseId;if(!l.isEqual(o))throw i.yc(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Fo(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Ue)return(function(l,c){const d=l instanceof Ue?l.toArray():l;return{mapValue:{fields:{[Dd]:{stringValue:Vd},[br]:{arrayValue:{values:d.map((f=>{if(typeof f!="number")throw c.yc("VectorValues must only contain numeric values.");return Mo(c.serializer,f)}))}}}}}})(r,i);if(du(r))return r._toProto(i.serializer);throw i.yc(`Unsupported field value: ${Or(r)}`)})(s,e)}function $u(s,e){const n={};return Td(s)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):$t(s,((r,i)=>{const o=Cs(i,e.dc(r));o!=null&&(n[r]=o)})),{mapValue:{fields:n}}}function Ou(s){return!(typeof s!="object"||s===null||s instanceof Array||s instanceof Date||s instanceof ie||s instanceof Ye||s instanceof Me||s instanceof ce||s instanceof Xr||s instanceof Ue||du(s))}function la(s,e,n){if(!Ou(n)||!kd(n)){const r=Or(n);throw r==="an object"?e.yc(s+" a custom object"):e.yc(s+" "+r)}}function en(s,e,n){if((e=Ie(e))instanceof ia)return e._internalPath;if(typeof e=="string")return Fu(s,e);throw Tr("Field path arguments must be of type string or ",s,!1,void 0,n)}const yy=new RegExp("[~\\*/\\[\\]]");function Fu(s,e,n){if(e.search(yy)>=0)throw Tr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,s,!1,void 0,n);try{return new ia(...e.split("."))._internalPath}catch{throw Tr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,s,!1,void 0,n)}}function Tr(s,e,n,r,i){const o=r&&!r.isEmpty(),l=i!==void 0;let c=`Function ${e}() called with invalid data`;n&&(c+=" (via `toFirestore()`)"),c+=". ";let d="";return(o||l)&&(d+=" (found",o&&(d+=` in field ${r}`),l&&(d+=` in document ${i}`),d+=")"),new $(D.INVALID_ARGUMENT,c+s+d)}function Uu(s,e){return s.some((n=>n.isEqual(e)))}/**
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
 */class by{convertValue(e,n="none"){switch(Vt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return de(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Dt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw z(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return $t(e,((i,o)=>{r[i]=this.convertValue(o,n)})),r}convertVectorValue(e){var r,i,o;const n=(o=(i=(r=e.fields)==null?void 0:r[br].arrayValue)==null?void 0:i.values)==null?void 0:o.map((l=>de(l.doubleValue)));return new Ue(n)}convertGeoPoint(e){return new Ye(de(e.latitude),de(e.longitude))}convertArray(e,n){return(e.values||[]).map((r=>this.convertValue(r,n)))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Br(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(hs(e));default:return null}}convertTimestamp(e){const n=Pt(e);return new ie(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=se.fromString(e);te(cu(r),9688,{name:e});const i=new ps(r.get(1),r.get(3)),o=new B(r.popFirst(5));return i.isEqual(n)||it(`Document ${o} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),o}}/**
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
 */class ca extends by{constructor(e){super(),this.firestore=e}convertBytes(e){return new Me(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new ce(this.firestore,null,n)}}function ti(){return new aa("serverTimestamp")}const Sc="@firebase/firestore",Rc="4.14.0";/**
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
 */function Cc(s){return(function(n,r){if(typeof n!="object"||n===null)return!1;const i=n;for(const o of r)if(o in i&&typeof i[o]=="function")return!0;return!1})(s,["next","error","complete"])}/**
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
 */class Bu{constructor(e,n,r,i,o){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new ce(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new vy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const n=this._document.data.field(en("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class vy extends Bu{data(){return super.data()}}/**
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
 */function ju(s){if(s.limitType==="L"&&s.explicitOrderBy.length===0)throw new $(D.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class da{}class zu extends da{}function qu(s,e,...n){let r=[];e instanceof da&&r.push(e),r=r.concat(n),(function(o){const l=o.filter((d=>d instanceof ua)).length,c=o.filter((d=>d instanceof ni)).length;if(l>1||l>0&&c>0)throw new $(D.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const i of r)s=i._apply(s);return s}class ni extends zu{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new ni(e,n,r)}_apply(e){const n=this._parse(e);return Hu(e._query,n),new Ft(e.firestore,e.converter,lo(e._query,n))}_parse(e){const n=Zr(e.firestore);return(function(o,l,c,d,h,f,g){let b;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new $(D.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Dc(g,f);const T=[];for(const R of g)T.push(Pc(d,o,R));b={arrayValue:{values:T}}}else b=Pc(d,o,g)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Dc(g,f),b=gy(c,l,g,f==="in"||f==="not-in");return he.create(h,f,b)})(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function xy(s,e,n){const r=e,i=en("where",s);return ni._create(i,r,n)}class ua extends da{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new ua(e,n)}_parse(e){const n=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return n.length===1?n[0]:Be.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:((function(i,o){let l=i;const c=o.getFlattenedFilters();for(const d of c)Hu(l,d),l=lo(l,d)})(e._query,n),new Ft(e.firestore,e.converter,lo(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ha extends zu{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new ha(e,n)}_apply(e){const n=(function(i,o,l){if(i.startAt!==null)throw new $(D.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new $(D.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ms(o,l)})(e._query,this._field,this._direction);return new Ft(e.firestore,e.converter,qm(e._query,n))}}function wy(s,e="asc"){const n=e,r=en("orderBy",s);return ha._create(r,n)}function Pc(s,e,n){if(typeof(n=Ie(n))=="string"){if(n==="")throw new $(D.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Bd(e)&&n.indexOf("/")!==-1)throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(se.fromString(n));if(!B.isDocumentKey(r))throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Hl(s,new B(r))}if(n instanceof ce)return Hl(s,n._key);throw new $(D.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Or(n)}.`)}function Dc(s,e){if(!Array.isArray(s)||s.length===0)throw new $(D.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Hu(s,e){const n=(function(i,o){for(const l of i)for(const c of l.getFlattenedFilters())if(o.indexOf(c.op)>=0)return c.op;return null})(s.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(n!==null)throw n===e.op?new $(D.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(D.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}function Gu(s,e,n){let r;return r=s?s.toFirestore(e):e,r}class ts{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Kt extends Bu{constructor(e,n,r,i,o,l){super(e,n,r,i,l),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new cr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(en("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new $(D.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=Kt._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}Kt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Kt._jsonSchema={type:pe("string",Kt._jsonSchemaVersion),bundleSource:pe("string","DocumentSnapshot"),bundleName:pe("string"),bundle:pe("string")};class cr extends Kt{data(e={}){return super.data(e)}}class Qt{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new ts(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach((n=>e.push(n))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach((r=>{e.call(n,new cr(this._firestore,this._userDataWriter,r.key,r,new ts(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new $(D.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=(function(i,o){if(i._snapshot.oldDocs.isEmpty()){let l=0;return i._snapshot.docChanges.map((c=>{const d=new cr(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ts(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:d,oldIndex:-1,newIndex:l++}}))}{let l=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((c=>o||c.type!==3)).map((c=>{const d=new cr(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ts(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return c.type!==0&&(h=l.indexOf(c.doc.key),l=l.delete(c.doc.key)),c.type!==1&&(l=l.add(c.doc),f=l.indexOf(c.doc.key)),{type:_y(c.type),doc:d,oldIndex:h,newIndex:f}}))}})(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new $(D.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Qt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ro.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach((o=>{o._document!==null&&(n.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),i.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function _y(s){switch(s){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return z(61501,{type:s})}}/**
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
 */Qt._jsonSchemaVersion="firestore/querySnapshot/1.0",Qt._jsonSchema={type:pe("string",Qt._jsonSchemaVersion),bundleSource:pe("string","QuerySnapshot"),bundleName:pe("string"),bundle:pe("string")};/**
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
 */function dr(s){s=Ne(s,ce);const e=Ne(s.firestore,at),n=Jr(e);return sy(n,s._key).then((r=>Ku(e,s,r)))}function Ey(s){s=Ne(s,Ft);const e=Ne(s.firestore,at),n=Jr(e),r=new ca(e);return ju(s._query),ry(n,s._query).then((i=>new Qt(e,r,s,i)))}function si(s,e,n){s=Ne(s,ce);const r=Ne(s.firestore,at),i=Gu(s.converter,e),o=Zr(r);return ri(r,[Lu(o,"setDoc",s._key,i,s.converter!==null,n).toMutation(s._key,$e.none())])}function xo(s,e,n,...r){s=Ne(s,ce);const i=Ne(s.firestore,at),o=Zr(i);let l;return l=typeof(e=Ie(e))=="string"||e instanceof ia?my(o,"updateDoc",s._key,e,n,r):fy(o,"updateDoc",s._key,e),ri(i,[l.toMutation(s._key,$e.exists(!0))])}function Wu(s){return ri(Ne(s.firestore,at),[new Lo(s._key,$e.none())])}function ky(s,e){const n=Ne(s.firestore,at),r=We(s),i=Gu(s.converter,e),o=Zr(s.firestore);return ri(n,[Lu(o,"addDoc",r._key,i,s.converter!==null,{}).toMutation(r._key,$e.exists(!1))]).then((()=>r))}function Iy(s,...e){var h,f,g;s=Ie(s);let n={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||Cc(e[r])||(n=e[r++]);const i={includeMetadataChanges:n.includeMetadataChanges,source:n.source};if(Cc(e[r])){const b=e[r];e[r]=(h=b.next)==null?void 0:h.bind(b),e[r+1]=(f=b.error)==null?void 0:f.bind(b),e[r+2]=(g=b.complete)==null?void 0:g.bind(b)}let o,l,c;if(s instanceof ce)l=Ne(s.firestore,at),c=jr(s._key.path),o={next:b=>{e[r]&&e[r](Ku(l,s,b))},error:e[r+1],complete:e[r+2]};else{const b=Ne(s,Ft);l=Ne(b.firestore,at),c=b._query;const v=new ca(l);o={next:T=>{e[r]&&e[r](new Qt(l,v,b,T))},error:e[r+1],complete:e[r+2]},ju(s._query)}const d=Jr(l);return ny(d,c,i,o)}function ri(s,e){const n=Jr(s);return iy(n,e)}function Ku(s,e,n){const r=n.docs.get(e._key),i=new ca(s);return new Kt(s,i,e._key,r,new ts(n.hasPendingWrites,n.fromCache),e.converter)}(function(e,n=!0){rm(Sn),xn(new Jt("firestore",((r,{instanceIdentifier:i,options:o})=>{const l=r.getProvider("app").getImmediate(),c=new at(new am(r.getProvider("auth-internal")),new dm(l,r.getProvider("app-check-internal")),Am(l,i),l);return o={useFetchStreams:n,...o},c._setSettings(o),c}),"PUBLIC").setMultipleInstances(!0)),Tt(Sc,Rc,e),Tt(Sc,Rc,"esm2020")})();function Qu(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ty=Qu,Yu=new _s("auth","Firebase",Qu());/**
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
 */const Ar=new Io("@firebase/auth");function Ay(s,...e){Ar.logLevel<=Y.WARN&&Ar.warn(`Auth (${Sn}): ${s}`,...e)}function ur(s,...e){Ar.logLevel<=Y.ERROR&&Ar.error(`Auth (${Sn}): ${s}`,...e)}/**
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
 */function lt(s,...e){throw pa(s,...e)}function Je(s,...e){return pa(s,...e)}function Ju(s,e,n){const r={...Ty(),[e]:n};return new _s("auth","Firebase",r).create(e,{appName:s.name})}function Rt(s){return Ju(s,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function pa(s,...e){if(typeof s!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=s.name),s._errorFactory.create(n,...r)}return Yu.create(s,...e)}function H(s,e,...n){if(!s)throw pa(e,...n)}function tt(s){const e="INTERNAL ASSERTION FAILED: "+s;throw ur(e),new Error(e)}function ct(s,e){s||tt(e)}/**
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
 */function wo(){var s;return typeof self<"u"&&((s=self.location)==null?void 0:s.href)||""}function Sy(){return Vc()==="http:"||Vc()==="https:"}function Vc(){var s;return typeof self<"u"&&((s=self.location)==null?void 0:s.protocol)||null}/**
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
 */function Ry(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Sy()||Vp()||"connection"in navigator)?navigator.onLine:!0}function Cy(){if(typeof navigator>"u")return null;const s=navigator;return s.languages&&s.languages[0]||s.language||null}/**
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
 */class Ps{constructor(e,n){this.shortDelay=e,this.longDelay=n,ct(n>e,"Short delay should be less than long delay!"),this.isMobile=Cp()||Np()}get(){return Ry()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function fa(s,e){ct(s.emulator,"Emulator should always be set here");const{url:n}=s.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
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
 */class Xu{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;tt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;tt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;tt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Py={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Dy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Vy=new Ps(3e4,6e4);function ii(s,e){return s.tenantId&&!e.tenantId?{...e,tenantId:s.tenantId}:e}async function Nn(s,e,n,r,i={}){return Zu(s,i,async()=>{let o={},l={};r&&(e==="GET"?l=r:o={body:JSON.stringify(r)});const c=Es({key:s.config.apiKey,...l}).slice(1),d=await s._getAdditionalHeaders();d["Content-Type"]="application/json",s.languageCode&&(d["X-Firebase-Locale"]=s.languageCode);const h={method:e,headers:d,...o};return Dp()||(h.referrerPolicy="no-referrer"),s.emulatorConfig&&ks(s.emulatorConfig.host)&&(h.credentials="include"),Xu.fetch()(await th(s,s.config.apiHost,n,c),h)})}async function Zu(s,e,n){s._canInitEmulator=!1;const r={...Py,...e};try{const i=new Ny(s),o=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const l=await o.json();if("needConfirmation"in l)throw er(s,"account-exists-with-different-credential",l);if(o.ok&&!("errorMessage"in l))return l;{const c=o.ok?l.errorMessage:l.error.message,[d,h]=c.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw er(s,"credential-already-in-use",l);if(d==="EMAIL_EXISTS")throw er(s,"email-already-in-use",l);if(d==="USER_DISABLED")throw er(s,"user-disabled",l);const f=r[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Ju(s,f,h);lt(s,f)}}catch(i){if(i instanceof dt)throw i;lt(s,"network-request-failed",{message:String(i)})}}async function eh(s,e,n,r,i={}){const o=await Nn(s,e,n,r,i);return"mfaPendingCredential"in o&&lt(s,"multi-factor-auth-required",{_serverResponse:o}),o}async function th(s,e,n,r){const i=`${e}${n}?${r}`,o=s,l=o.config.emulator?fa(s.config,i):`${s.config.apiScheme}://${i}`;return Dy.includes(n)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(l).toString():l}class Ny{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Je(this.auth,"network-request-failed")),Vy.get())})}}function er(s,e,n){const r={appName:s.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Je(s,e,r);return i.customData._tokenResponse=n,i}/**
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
 */async function My(s,e){return Nn(s,"POST","/v1/accounts:delete",e)}async function Sr(s,e){return Nn(s,"POST","/v1/accounts:lookup",e)}/**
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
 */function os(s){if(s)try{const e=new Date(Number(s));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ly(s,e=!1){const n=Ie(s),r=await n.getIdToken(e),i=ma(r);H(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const o=typeof i.firebase=="object"?i.firebase:void 0,l=o==null?void 0:o.sign_in_provider;return{claims:i,token:r,authTime:os(qi(i.auth_time)),issuedAtTime:os(qi(i.iat)),expirationTime:os(qi(i.exp)),signInProvider:l||null,signInSecondFactor:(o==null?void 0:o.sign_in_second_factor)||null}}function qi(s){return Number(s)*1e3}function ma(s){const[e,n,r]=s.split(".");if(e===void 0||n===void 0||r===void 0)return ur("JWT malformed, contained fewer than 3 sections"),null;try{const i=ad(n);return i?JSON.parse(i):(ur("Failed to decode base64 JWT payload"),null)}catch(i){return ur("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Nc(s){const e=ma(s);return H(e,"internal-error"),H(typeof e.exp<"u","internal-error"),H(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function vs(s,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof dt&&$y(r)&&s.auth.currentUser===s&&await s.auth.signOut(),r}}function $y({code:s}){return s==="auth/user-disabled"||s==="auth/user-token-expired"}/**
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
 */class Oy{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class _o{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=os(this.lastLoginAt),this.creationTime=os(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Rr(s){var g;const e=s.auth,n=await s.getIdToken(),r=await vs(s,Sr(e,{idToken:n}));H(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];s._notifyReloadListener(i);const o=(g=i.providerUserInfo)!=null&&g.length?nh(i.providerUserInfo):[],l=Uy(s.providerData,o),c=s.isAnonymous,d=!(s.email&&i.passwordHash)&&!(l!=null&&l.length),h=c?d:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:l,metadata:new _o(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(s,f)}async function Fy(s){const e=Ie(s);await Rr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Uy(s,e){return[...s.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function nh(s){return s.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
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
 */async function By(s,e){const n=await Zu(s,{},async()=>{const r=Es({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:o}=s.config,l=await th(s,i,"/v1/token",`key=${o}`),c=await s._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const d={method:"POST",headers:c,body:r};return s.emulatorConfig&&ks(s.emulatorConfig.host)&&(d.credentials="include"),Xu.fetch()(l,d)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function jy(s,e){return Nn(s,"POST","/v2/accounts:revokeToken",ii(s,e))}/**
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
 */class yn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){H(e.idToken,"internal-error"),H(typeof e.idToken<"u","internal-error"),H(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Nc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){H(e.length!==0,"internal-error");const n=Nc(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(H(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:o}=await By(e,n);this.updateTokensAndExpiration(r,i,Number(o))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:o}=n,l=new yn;return r&&(H(typeof r=="string","internal-error",{appName:e}),l.refreshToken=r),i&&(H(typeof i=="string","internal-error",{appName:e}),l.accessToken=i),o&&(H(typeof o=="number","internal-error",{appName:e}),l.expirationTime=o),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new yn,this.toJSON())}_performRefresh(){return tt("not implemented")}}/**
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
 */function yt(s,e){H(typeof s=="string"||typeof s>"u","internal-error",{appName:e})}class Fe{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Oy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new _o(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await vs(this,this.stsTokenManager.getToken(this.auth,e));return H(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return Ly(this,e)}reload(){return Fy(this)}_assign(e){this!==e&&(H(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new Fe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){H(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Rr(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Oe(this.auth.app))return Promise.reject(Rt(this.auth));const e=await this.getIdToken();return await vs(this,My(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,o=n.phoneNumber??void 0,l=n.photoURL??void 0,c=n.tenantId??void 0,d=n._redirectEventId??void 0,h=n.createdAt??void 0,f=n.lastLoginAt??void 0,{uid:g,emailVerified:b,isAnonymous:v,providerData:T,stsTokenManager:R}=n;H(g&&R,e,"internal-error");const P=yn.fromJSON(this.name,R);H(typeof g=="string",e,"internal-error"),yt(r,e.name),yt(i,e.name),H(typeof b=="boolean",e,"internal-error"),H(typeof v=="boolean",e,"internal-error"),yt(o,e.name),yt(l,e.name),yt(c,e.name),yt(d,e.name),yt(h,e.name),yt(f,e.name);const L=new Fe({uid:g,auth:e,email:i,emailVerified:b,displayName:r,isAnonymous:v,photoURL:l,phoneNumber:o,tenantId:c,stsTokenManager:P,createdAt:h,lastLoginAt:f});return T&&Array.isArray(T)&&(L.providerData=T.map(N=>({...N}))),d&&(L._redirectEventId=d),L}static async _fromIdTokenResponse(e,n,r=!1){const i=new yn;i.updateFromServerResponse(n);const o=new Fe({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Rr(o),o}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];H(i.localId!==void 0,"internal-error");const o=i.providerUserInfo!==void 0?nh(i.providerUserInfo):[],l=!(i.email&&i.passwordHash)&&!(o!=null&&o.length),c=new yn;c.updateFromIdToken(r);const d=new Fe({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:l}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new _o(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(o!=null&&o.length)};return Object.assign(d,h),d}}/**
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
 */const Mc=new Map;function nt(s){ct(s instanceof Function,"Expected a class definition");let e=Mc.get(s);return e?(ct(e instanceof s,"Instance stored in cache mismatched with class"),e):(e=new s,Mc.set(s,e),e)}/**
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
 */class sh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}sh.type="NONE";const Lc=sh;/**
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
 */function hr(s,e,n){return`firebase:${s}:${e}:${n}`}class bn{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:o}=this.auth;this.fullUserKey=hr(this.userKey,i.apiKey,o),this.fullPersistenceKey=hr("persistence",i.apiKey,o),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Sr(this.auth,{idToken:e}).catch(()=>{});return n?Fe._fromGetAccountInfoResponse(this.auth,n,e):null}return Fe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new bn(nt(Lc),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let o=i[0]||nt(Lc);const l=hr(r,e.config.apiKey,e.name);let c=null;for(const h of n)try{const f=await h._get(l);if(f){let g;if(typeof f=="string"){const b=await Sr(e,{idToken:f}).catch(()=>{});if(!b)break;g=await Fe._fromGetAccountInfoResponse(e,b,f)}else g=Fe._fromJSON(e,f);h!==o&&(c=g),o=h;break}}catch{}const d=i.filter(h=>h._shouldAllowMigration);return!o._shouldAllowMigration||!d.length?new bn(o,e,r):(o=d[0],c&&await o._set(l,c.toJSON()),await Promise.all(n.map(async h=>{if(h!==o)try{await h._remove(l)}catch{}})),new bn(o,e,r))}}/**
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
 */function $c(s){const e=s.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ah(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(rh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(ch(e))return"Blackberry";if(dh(e))return"Webos";if(ih(e))return"Safari";if((e.includes("chrome/")||oh(e))&&!e.includes("edge/"))return"Chrome";if(lh(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=s.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function rh(s=ke()){return/firefox\//i.test(s)}function ih(s=ke()){const e=s.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function oh(s=ke()){return/crios\//i.test(s)}function ah(s=ke()){return/iemobile/i.test(s)}function lh(s=ke()){return/android/i.test(s)}function ch(s=ke()){return/blackberry/i.test(s)}function dh(s=ke()){return/webos/i.test(s)}function ga(s=ke()){return/iphone|ipad|ipod/i.test(s)||/macintosh/i.test(s)&&/mobile/i.test(s)}function zy(s=ke()){var e;return ga(s)&&!!((e=window.navigator)!=null&&e.standalone)}function qy(){return Mp()&&document.documentMode===10}function uh(s=ke()){return ga(s)||lh(s)||dh(s)||ch(s)||/windows phone/i.test(s)||ah(s)}/**
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
 */function hh(s,e=[]){let n;switch(s){case"Browser":n=$c(ke());break;case"Worker":n=`${$c(ke())}-${s}`;break;default:n=s}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Sn}/${r}`}/**
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
 */class Hy{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=o=>new Promise((l,c)=>{try{const d=e(o);l(d)}catch(d){c(d)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Gy(s,e={}){return Nn(s,"GET","/v2/passwordPolicy",ii(s,e))}/**
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
 */const Wy=6;class Ky{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??Wy,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
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
 */class Qy{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Oc(this),this.idTokenSubscription=new Oc(this),this.beforeStateQueue=new Hy(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Yu,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=nt(n)),this._initializationPromise=this.queue(async()=>{var r,i,o;if(!this._deleted&&(this.persistenceManager=await bn.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((o=this.currentUser)==null?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Sr(this,{idToken:e}),r=await Fe._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var o;if(Oe(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(o=this.redirectUser)==null?void 0:o._redirectEventId,c=r==null?void 0:r._redirectEventId,d=await this.tryRedirectSignIn(e);(!l||l===c)&&(d!=null&&d.user)&&(r=d.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(l){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return H(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Rr(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Cy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Oe(this.app))return Promise.reject(Rt(this));const n=e?Ie(e):null;return n&&H(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&H(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Oe(this.app)?Promise.reject(Rt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Oe(this.app)?Promise.reject(Rt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(nt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Gy(this),n=new Ky(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new _s("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await jy(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&nt(e)||this._popupRedirectResolver;H(n,this,"argument-error"),this.redirectPersistenceManager=await bn.create(this,[nt(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const o=typeof n=="function"?n:n.next.bind(n);let l=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(H(c,this,"internal-error"),c.then(()=>{l||o(this.currentUser)}),typeof n=="function"){const d=e.addObserver(n,r,i);return()=>{l=!0,d()}}else{const d=e.addObserver(n);return()=>{l=!0,d()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return H(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=hh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ay(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function oi(s){return Ie(s)}class Oc{constructor(e){this.auth=e,this.observer=null,this.addObserver=zp(n=>this.observer=n)}get next(){return H(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let ya={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Yy(s){ya=s}function Jy(s){return ya.loadJS(s)}function Xy(){return ya.gapiScript}function Zy(s){return`__${s}${Math.floor(Math.random()*1e6)}`}/**
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
 */function eb(s,e){const n=Ao(s,"auth");if(n.isInitialized()){const i=n.getImmediate(),o=n.getOptions();if(Yt(o,e??{}))return i;lt(i,"already-initialized")}return n.initialize({options:e})}function tb(s,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(nt);e!=null&&e.errorMap&&s._updateErrorMap(e.errorMap),s._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function nb(s,e,n){const r=oi(s);H(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,o=ph(e),{host:l,port:c}=sb(e),d=c===null?"":`:${c}`,h={url:`${o}//${l}${d}/`},f=Object.freeze({host:l,port:c,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){H(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),H(Yt(h,r.config.emulator)&&Yt(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,ks(l)?dd(`${o}//${l}${d}`):rb()}function ph(s){const e=s.indexOf(":");return e<0?"":s.substr(0,e+1)}function sb(s){const e=ph(s),n=/(\/\/)?([^?#/]+)/.exec(s.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const o=i[1];return{host:o,port:Fc(r.substr(o.length+1))}}else{const[o,l]=r.split(":");return{host:o,port:Fc(l)}}}function Fc(s){if(!s)return null;const e=Number(s);return isNaN(e)?null:e}function rb(){function s(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",s):s())}/**
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
 */class fh{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return tt("not implemented")}_getIdTokenResponse(e){return tt("not implemented")}_linkToIdToken(e,n){return tt("not implemented")}_getReauthenticationResolver(e){return tt("not implemented")}}/**
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
 */async function vn(s,e){return eh(s,"POST","/v1/accounts:signInWithIdp",ii(s,e))}/**
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
 */const ib="http://localhost";class tn extends fh{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new tn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):lt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...o}=n;if(!r||!i)return null;const l=new tn(r,i);return l.idToken=o.idToken||void 0,l.accessToken=o.accessToken||void 0,l.secret=o.secret,l.nonce=o.nonce,l.pendingToken=o.pendingToken||null,l}_getIdTokenResponse(e){const n=this.buildRequest();return vn(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,vn(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,vn(e,n)}buildRequest(){const e={requestUri:ib,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Es(n)}return e}}/**
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
 */class mh{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ds extends mh{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class vt extends Ds{constructor(){super("facebook.com")}static credential(e){return tn._fromParams({providerId:vt.PROVIDER_ID,signInMethod:vt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vt.credentialFromTaggedObject(e)}static credentialFromError(e){return vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vt.credential(e.oauthAccessToken)}catch{return null}}}vt.FACEBOOK_SIGN_IN_METHOD="facebook.com";vt.PROVIDER_ID="facebook.com";/**
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
 */class xt extends Ds{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return tn._fromParams({providerId:xt.PROVIDER_ID,signInMethod:xt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return xt.credentialFromTaggedObject(e)}static credentialFromError(e){return xt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return xt.credential(n,r)}catch{return null}}}xt.GOOGLE_SIGN_IN_METHOD="google.com";xt.PROVIDER_ID="google.com";/**
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
 */class wt extends Ds{constructor(){super("github.com")}static credential(e){return tn._fromParams({providerId:wt.PROVIDER_ID,signInMethod:wt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return wt.credentialFromTaggedObject(e)}static credentialFromError(e){return wt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return wt.credential(e.oauthAccessToken)}catch{return null}}}wt.GITHUB_SIGN_IN_METHOD="github.com";wt.PROVIDER_ID="github.com";/**
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
 */class _t extends Ds{constructor(){super("twitter.com")}static credential(e,n){return tn._fromParams({providerId:_t.PROVIDER_ID,signInMethod:_t.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return _t.credentialFromTaggedObject(e)}static credentialFromError(e){return _t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return _t.credential(n,r)}catch{return null}}}_t.TWITTER_SIGN_IN_METHOD="twitter.com";_t.PROVIDER_ID="twitter.com";/**
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
 */async function ob(s,e){return eh(s,"POST","/v1/accounts:signUp",ii(s,e))}/**
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
 */class Lt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const o=await Fe._fromIdTokenResponse(e,r,i),l=Uc(r);return new Lt({user:o,providerId:l,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Uc(r);return new Lt({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Uc(s){return s.providerId?s.providerId:"phoneNumber"in s?"phone":null}/**
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
 */async function ab(s){var i;if(Oe(s.app))return Promise.reject(Rt(s));const e=oi(s);if(await e._initializationPromise,(i=e.currentUser)!=null&&i.isAnonymous)return new Lt({user:e.currentUser,providerId:null,operationType:"signIn"});const n=await ob(e,{returnSecureToken:!0}),r=await Lt._fromIdTokenResponse(e,"signIn",n,!0);return await e._updateCurrentUser(r.user),r}/**
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
 */class Cr extends dt{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Cr.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Cr(e,n,r,i)}}function gh(s,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(s):n._getIdTokenResponse(s)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Cr._fromErrorAndOperation(s,o,e,r):o})}async function lb(s,e,n=!1){const r=await vs(s,e._linkToIdToken(s.auth,await s.getIdToken()),n);return Lt._forOperation(s,"link",r)}/**
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
 */async function cb(s,e,n=!1){const{auth:r}=s;if(Oe(r.app))return Promise.reject(Rt(r));const i="reauthenticate";try{const o=await vs(s,gh(r,i,e,s),n);H(o.idToken,r,"internal-error");const l=ma(o.idToken);H(l,r,"internal-error");const{sub:c}=l;return H(s.uid===c,r,"user-mismatch"),Lt._forOperation(s,i,o)}catch(o){throw(o==null?void 0:o.code)==="auth/user-not-found"&&lt(r,"user-mismatch"),o}}/**
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
 */async function db(s,e,n=!1){if(Oe(s.app))return Promise.reject(Rt(s));const r="signIn",i=await gh(s,r,e),o=await Lt._fromIdTokenResponse(s,r,i);return n||await s._updateCurrentUser(o.user),o}function ub(s,e,n,r){return Ie(s).onIdTokenChanged(e,n,r)}function hb(s,e,n){return Ie(s).beforeAuthStateChanged(e,n)}const Pr="__sak";/**
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
 */class yh{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Pr,"1"),this.storage.removeItem(Pr),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const pb=1e3,fb=10;class bh extends yh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=uh(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((l,c,d)=>{this.notifyListeners(l,d)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const l=this.storage.getItem(r);!n&&this.localCache[r]===l||this.notifyListeners(r,l)},o=this.storage.getItem(r);qy()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,fb):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},pb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}bh.type="LOCAL";const mb=bh;/**
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
 */class vh extends yh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}vh.type="SESSION";const xh=vh;/**
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
 */function gb(s){return Promise.all(s.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
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
 */class ai{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new ai(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:o}=n.data,l=this.handlersMap[i];if(!(l!=null&&l.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(l).map(async h=>h(n.origin,o)),d=await gb(c);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:d})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ai.receivers=[];/**
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
 */function ba(s="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return s+n}/**
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
 */class yb{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let o,l;return new Promise((c,d)=>{const h=ba("",20);i.port1.start();const f=setTimeout(()=>{d(new Error("unsupported_event"))},r);l={messageChannel:i,onMessage(g){const b=g;if(b.data.eventId===h)switch(b.data.status){case"ack":clearTimeout(f),o=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),c(b.data.response);break;default:clearTimeout(f),clearTimeout(o),d(new Error("invalid_response"));break}}},this.handlers.add(l),i.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
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
 */function Xe(){return window}function bb(s){Xe().location.href=s}/**
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
 */function wh(){return typeof Xe().WorkerGlobalScope<"u"&&typeof Xe().importScripts=="function"}async function vb(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function xb(){var s;return((s=navigator==null?void 0:navigator.serviceWorker)==null?void 0:s.controller)||null}function wb(){return wh()?self:null}/**
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
 */const _h="firebaseLocalStorageDb",_b=1,Dr="firebaseLocalStorage",Eh="fbase_key";class Vs{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function li(s,e){return s.transaction([Dr],e?"readwrite":"readonly").objectStore(Dr)}function Eb(){const s=indexedDB.deleteDatabase(_h);return new Vs(s).toPromise()}function Eo(){const s=indexedDB.open(_h,_b);return new Promise((e,n)=>{s.addEventListener("error",()=>{n(s.error)}),s.addEventListener("upgradeneeded",()=>{const r=s.result;try{r.createObjectStore(Dr,{keyPath:Eh})}catch(i){n(i)}}),s.addEventListener("success",async()=>{const r=s.result;r.objectStoreNames.contains(Dr)?e(r):(r.close(),await Eb(),e(await Eo()))})})}async function Bc(s,e,n){const r=li(s,!0).put({[Eh]:e,value:n});return new Vs(r).toPromise()}async function kb(s,e){const n=li(s,!1).get(e),r=await new Vs(n).toPromise();return r===void 0?null:r.value}function jc(s,e){const n=li(s,!0).delete(e);return new Vs(n).toPromise()}const Ib=800,Tb=3;class kh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Eo(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>Tb)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return wh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ai._getInstance(wb()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await vb(),!this.activeServiceWorker)return;this.sender=new yb(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||xb()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Eo();return await Bc(e,Pr,"1"),await jc(e,Pr),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Bc(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>kb(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>jc(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const o=li(i,!1).getAll();return new Vs(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:o}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(o)&&(this.notifyListeners(i,o),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ib)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}kh.type="LOCAL";const Ab=kh;new Ps(3e4,6e4);/**
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
 */function Sb(s,e){return e?nt(e):(H(s._popupRedirectResolver,s,"argument-error"),s._popupRedirectResolver)}/**
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
 */class va extends fh{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return vn(e,this._buildIdpRequest())}_linkToIdToken(e,n){return vn(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return vn(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Rb(s){return db(s.auth,new va(s),s.bypassAuthState)}function Cb(s){const{auth:e,user:n}=s;return H(n,e,"internal-error"),cb(n,new va(s),s.bypassAuthState)}async function Pb(s){const{auth:e,user:n}=s;return H(n,e,"internal-error"),lb(n,new va(s),s.bypassAuthState)}/**
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
 */class Ih{constructor(e,n,r,i,o=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:o,error:l,type:c}=e;if(l){this.reject(l);return}const d={auth:this.auth,requestUri:n,sessionId:r,tenantId:o||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(d))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Rb;case"linkViaPopup":case"linkViaRedirect":return Pb;case"reauthViaPopup":case"reauthViaRedirect":return Cb;default:lt(this.auth,"internal-error")}}resolve(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ct(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Db=new Ps(2e3,1e4);class fn extends Ih{constructor(e,n,r,i,o){super(e,n,i,o),this.provider=r,this.authWindow=null,this.pollId=null,fn.currentPopupAction&&fn.currentPopupAction.cancel(),fn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return H(e,this.auth,"internal-error"),e}async onExecution(){ct(this.filter.length===1,"Popup operations only handle one event");const e=ba();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,fn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Db.get())};e()}}fn.currentPopupAction=null;/**
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
 */const Vb="pendingRedirect",pr=new Map;class Nb extends Ih{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=pr.get(this.auth._key());if(!e){try{const r=await Mb(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}pr.set(this.auth._key(),e)}return this.bypassAuthState||pr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Mb(s,e){const n=Ob(e),r=$b(s);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}function Lb(s,e){pr.set(s._key(),e)}function $b(s){return nt(s._redirectPersistence)}function Ob(s){return hr(Vb,s.config.apiKey,s.name)}async function Fb(s,e,n=!1){if(Oe(s.app))return Promise.reject(Rt(s));const r=oi(s),i=Sb(r,e),l=await new Nb(r,i,n).execute();return l&&!n&&(delete l.user._redirectEventId,await r._persistUserIfCurrent(l.user),await r._setRedirectUser(null,e)),l}/**
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
 */const Ub=600*1e3;class Bb{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!jb(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Th(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Je(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Ub&&this.cachedEventUids.clear(),this.cachedEventUids.has(zc(e))}saveEventToCache(e){this.cachedEventUids.add(zc(e)),this.lastProcessedEventTime=Date.now()}}function zc(s){return[s.type,s.eventId,s.sessionId,s.tenantId].filter(e=>e).join("-")}function Th({type:s,error:e}){return s==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function jb(s){switch(s.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Th(s);default:return!1}}/**
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
 */async function zb(s,e={}){return Nn(s,"GET","/v1/projects",e)}/**
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
 */const qb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Hb=/^https?/;async function Gb(s){if(s.config.emulator)return;const{authorizedDomains:e}=await zb(s);for(const n of e)try{if(Wb(n))return}catch{}lt(s,"unauthorized-domain")}function Wb(s){const e=wo(),{protocol:n,hostname:r}=new URL(e);if(s.startsWith("chrome-extension://")){const l=new URL(s);return l.hostname===""&&r===""?n==="chrome-extension:"&&s.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&l.hostname===r}if(!Hb.test(n))return!1;if(qb.test(s))return r===s;const i=s.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const Kb=new Ps(3e4,6e4);function qc(){const s=Xe().___jsl;if(s!=null&&s.H){for(const e of Object.keys(s.H))if(s.H[e].r=s.H[e].r||[],s.H[e].L=s.H[e].L||[],s.H[e].r=[...s.H[e].L],s.CP)for(let n=0;n<s.CP.length;n++)s.CP[n]=null}}function Qb(s){return new Promise((e,n)=>{var i,o,l;function r(){qc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{qc(),n(Je(s,"network-request-failed"))},timeout:Kb.get()})}if((o=(i=Xe().gapi)==null?void 0:i.iframes)!=null&&o.Iframe)e(gapi.iframes.getContext());else if((l=Xe().gapi)!=null&&l.load)r();else{const c=Zy("iframefcb");return Xe()[c]=()=>{gapi.load?r():n(Je(s,"network-request-failed"))},Jy(`${Xy()}?onload=${c}`).catch(d=>n(d))}}).catch(e=>{throw fr=null,e})}let fr=null;function Yb(s){return fr=fr||Qb(s),fr}/**
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
 */const Jb=new Ps(5e3,15e3),Xb="__/auth/iframe",Zb="emulator/auth/iframe",ev={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},tv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function nv(s){const e=s.config;H(e.authDomain,s,"auth-domain-config-required");const n=e.emulator?fa(e,Zb):`https://${s.config.authDomain}/${Xb}`,r={apiKey:e.apiKey,appName:s.name,v:Sn},i=tv.get(s.config.apiHost);i&&(r.eid=i);const o=s._getFrameworks();return o.length&&(r.fw=o.join(",")),`${n}?${Es(r).slice(1)}`}async function sv(s){const e=await Yb(s),n=Xe().gapi;return H(n,s,"internal-error"),e.open({where:document.body,url:nv(s),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ev,dontclear:!0},r=>new Promise(async(i,o)=>{await r.restyle({setHideOnLeave:!1});const l=Je(s,"network-request-failed"),c=Xe().setTimeout(()=>{o(l)},Jb.get());function d(){Xe().clearTimeout(c),i(r)}r.ping(d).then(d,()=>{o(l)})}))}/**
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
 */const rv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},iv=500,ov=600,av="_blank",lv="http://localhost";class Hc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function cv(s,e,n,r=iv,i=ov){const o=Math.max((window.screen.availHeight-i)/2,0).toString(),l=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const d={...rv,width:r.toString(),height:i.toString(),top:o,left:l},h=ke().toLowerCase();n&&(c=oh(h)?av:n),rh(h)&&(e=e||lv,d.scrollbars="yes");const f=Object.entries(d).reduce((b,[v,T])=>`${b}${v}=${T},`,"");if(zy(h)&&c!=="_self")return dv(e||"",c),new Hc(null);const g=window.open(e||"",c,f);H(g,s,"popup-blocked");try{g.focus()}catch{}return new Hc(g)}function dv(s,e){const n=document.createElement("a");n.href=s,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
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
 */const uv="__/auth/handler",hv="emulator/auth/handler",pv=encodeURIComponent("fac");async function Gc(s,e,n,r,i,o){H(s.config.authDomain,s,"auth-domain-config-required"),H(s.config.apiKey,s,"invalid-api-key");const l={apiKey:s.config.apiKey,appName:s.name,authType:n,redirectUrl:r,v:Sn,eventId:i};if(e instanceof mh){e.setDefaultLanguage(s.languageCode),l.providerId=e.providerId||"",jp(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,g]of Object.entries({}))l[f]=g}if(e instanceof Ds){const f=e.getScopes().filter(g=>g!=="");f.length>0&&(l.scopes=f.join(","))}s.tenantId&&(l.tid=s.tenantId);const c=l;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const d=await s._getAppCheckToken(),h=d?`#${pv}=${encodeURIComponent(d)}`:"";return`${fv(s)}?${Es(c).slice(1)}${h}`}function fv({config:s}){return s.emulator?fa(s,hv):`https://${s.authDomain}/${uv}`}/**
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
 */const Hi="webStorageSupport";class mv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=xh,this._completeRedirectFn=Fb,this._overrideRedirectResult=Lb}async _openPopup(e,n,r,i){var l;ct((l=this.eventManagers[e._key()])==null?void 0:l.manager,"_initialize() not called before _openPopup()");const o=await Gc(e,n,r,wo(),i);return cv(e,o,ba())}async _openRedirect(e,n,r,i){await this._originValidation(e);const o=await Gc(e,n,r,wo(),i);return bb(o),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:o}=this.eventManagers[n];return i?Promise.resolve(i):(ct(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await sv(e),r=new Bb(e);return n.register("authEvent",i=>(H(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(Hi,{type:Hi},i=>{var l;const o=(l=i==null?void 0:i[0])==null?void 0:l[Hi];o!==void 0&&n(!!o),lt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=Gb(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return uh()||ih()||ga()}}const gv=mv;var Wc="@firebase/auth",Kc="1.13.0";/**
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
 */class yv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){H(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function bv(s){switch(s){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function vv(s){xn(new Jt("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:l,authDomain:c}=r.options;H(l&&!l.includes(":"),"invalid-api-key",{appName:r.name});const d={apiKey:l,authDomain:c,clientPlatform:s,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:hh(s)},h=new Qy(r,i,o,d);return tb(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),xn(new Jt("auth-internal",e=>{const n=oi(e.getProvider("auth").getImmediate());return(r=>new yv(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Tt(Wc,Kc,bv(s)),Tt(Wc,Kc,"esm2020")}/**
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
 */const xv=300,wv=cd("authIdTokenMaxAge")||xv;let Qc=null;const _v=s=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>wv)return;const i=n==null?void 0:n.token;Qc!==i&&(Qc=i,await fetch(s,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Ev(s=Hf()){const e=Ao(s,"auth");if(e.isInitialized())return e.getImmediate();const n=eb(s,{popupRedirectResolver:gv,persistence:[Ab,mb,xh]}),r=cd("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const l=_v(o.toString());hb(n,l,()=>l(n.currentUser)),ub(n,c=>l(c))}}const i=Sp("auth");return i&&nb(n,`http://${i}`),n}function kv(){var s;return((s=document.getElementsByTagName("head"))==null?void 0:s[0])??document}Yy({loadJS(s){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",s),r.onload=e,r.onerror=i=>{const o=Je("internal-error");o.customData=i,n(o)},r.type="text/javascript",r.charset="UTF-8",kv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});vv("Browser");const Ah={projectId:"gen-lang-client-0833655128",appId:"1:681326869225:web:cada6ac531e1ded3b1ce78",apiKey:"AIzaSyAWyge6N-FseAcfTDNUN5P51j88PYQW-ms",authDomain:"gen-lang-client-0833655128.firebaseapp.com",firestoreDatabaseId:"ai-studio-cb688270-9194-4388-8b0d-99a18b09beb1",storageBucket:"gen-lang-client-0833655128.firebasestorage.app",messagingSenderId:"681326869225",measurementId:""},Sh=pd(Ah),Iv=Ev(Sh),Le=cy(Sh,{experimentalForceLongPolling:!0},Ah.firestoreDatabaseId),Tv=ab(Iv).then(s=>(console.log("[KickOff] Anonymous auth success:",s.user.uid),s)).catch(s=>{throw console.error("Anonymous auth failed:",s),s});function Vr(){return Math.random().toString(36).slice(2,9)}function xa(s,e=1,n="league",r=0){const i=[...s];i.length%2!==0&&i.push({id:"__bye__",name:"BYE"});const l=i.length,c=l-1,d=l/2,h=[];for(let f=0;f<e;f++){const g=f%2===1,b=[i[0],...i.slice(1)];for(let v=0;v<c;v++){const T=v+1+r+f*c,R=[];for(let P=0;P<d;P++){const L=b[P],N=b[l-1-P];L.id==="__bye__"||N.id==="__bye__"||R.push(g?{homeId:N.id,awayId:L.id}:{homeId:L.id,awayId:N.id})}R.forEach(P=>{h.push({id:`fix-${Vr()}`,homeId:P.homeId,awayId:P.awayId,homeScore:null,awayScore:null,status:"upcoming",round:T,stage:n,date:null,venue:null,time:null})}),b.splice(1,0,b.pop())}}return h}function Av(s,e=1,n=1){let r=1;for(;r<s.length;)r*=2;const i=[...s],o=new Array(r).fill(null),l=Rh(r);i.forEach((b,v)=>{l[v]!==void 0&&(o[l[v]]=b)});const c=[],d=r/2;for(let b=0;b<d;b++){const v=o[b*2],T=o[b*2+1];if(!(!v&&!T)&&v&&T)for(let R=0;R<n;R++)c.push({id:`ko-r${e}-m${b}-l${R}-${Vr()}`,homeId:R===0?v.id:T.id,awayId:R===0?T.id:v.id,homeScore:null,awayScore:null,status:"upcoming",round:e+R,matchIndex:b,stage:"knockout",leg:R+1,date:null,venue:null,time:null})}let h=d,f=e+n;for(;h>1;){h/=2;for(let b=0;b<h;b++)for(let v=0;v<n;v++)c.push({id:`ko-r${f}-m${b}-l${v}-${Vr()}`,homeId:null,awayId:null,homeScore:null,awayScore:null,status:"upcoming",round:f+v,matchIndex:b,stage:"knockout",leg:v+1,date:null,venue:null,time:null});f+=n}const g=e+n;for(let b=0;b<d;b++){const v=o[b*2],T=o[b*2+1];if(!v||!T){const R=v||T;if(!R)continue;const P=Math.floor(b/2),L=b%2===0?"homeId":"awayId",N=c.find(q=>q.round===g&&q.matchIndex===P&&q.leg===1);N&&(N[L]=R.id)}}return c}function Rh(s){if(s===1)return[0];const e=Rh(s/2),n=new Array(s);return e.forEach((r,i)=>{n[i*2]=r,n[i*2+1]=s-1-r}),n}function Sv(s,e=4){const n=[...s].sort(()=>Math.random()-.5),r=Math.ceil(n.length/e),i=[],o=[];for(let l=0;l<r;l++){const c=n.slice(l*e,(l+1)*e);i.push({id:l,name:String.fromCharCode(65+l),teamIds:c.map(h=>h.id)}),xa(c,1,"groups",0).forEach(h=>{h.groupId=l,o.push(h)})}return{groups:i,fixtures:o}}function Rv(s,e,n,r=1,i="league"){const o=xa(s,r,i,0),l=[];for(let c=1;c<=n;c++){const d=(e[c]||[]).filter(g=>g.homeId&&g.awayId),h=new Set(d.flatMap(g=>[g.homeId,g.awayId])),f=o.filter(g=>g.round===c&&!h.has(g.homeId)&&!h.has(g.awayId));d.forEach(g=>{l.push({id:`fix-${Vr()}`,homeId:g.homeId,awayId:g.awayId,homeScore:null,awayScore:null,status:"upcoming",round:c,stage:i,date:g.date||null,venue:g.venue||null,time:g.time||null,pinned:!0})}),f.forEach(g=>{g.round=c,l.push(g)})}return l}function Cv(s){const e=[],n={};return s.forEach(r=>{n[r.round]||(n[r.round]=[]),n[r.round].push(r)}),Object.entries(n).forEach(([r,i])=>{const o=new Set;i.forEach(l=>{l.homeId&&o.has(l.homeId)&&e.push(`Round ${r}: team ${l.homeId} plays twice`),l.awayId&&o.has(l.awayId)&&e.push(`Round ${r}: team ${l.awayId} plays twice`),l.homeId&&o.add(l.homeId),l.awayId&&o.add(l.awayId)})}),e}console.log("[KickOff] main.js is initializing...");function Yc(s){const e=document.createElement("div");e.className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300",e.innerHTML=`
    <div class="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-3xl flex flex-col p-10 space-y-8">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">Link Club Player</h3>
        <button id="close-selection" class="p-4 bg-slate-950 rounded-2xl text-slate-500">${F.reset}</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[60vh] pr-4 custom-scrollbar">
        ${m.dashboardPlayers.length===0?'<p class="col-span-2 text-center text-slate-500 py-10">No club players synced. Ensure dashboard is open.</p>':m.dashboardPlayers.map(r=>`
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
Line: `+n)};window.addEventListener("unhandledrejection",function(s){alert("PROMISE REJECTION: "+s.reason)});console.log("KickOff + Firebase Initialized");async function as(s){const e=new TextEncoder().encode(s),n=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(n)).map(r=>r.toString(16).padStart(2,"0")).join("")}const ci="kickoff_session_v2";async function Nr(s){if(m.user)try{await ky(ra(Le,"activityLog"),{action:s,performedBy:m.user.username,role:m.user.role,timestamp:ti()})}catch(e){console.warn("Activity log failed:",e)}}if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("[PWA] Service Worker Registered"),setInterval(()=>{e.update()},1e3*60*60)}).catch(e=>{console.error("[PWA] Registration Failed:",e)})});let s=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{s||(s=!0,console.log("[PWA] New controller detected, refreshing page..."),window.location.reload())})}const F={home:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',more:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',trophy:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',dashboard:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',fixtures:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',standings:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h5"/></svg>',teams:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',bracket:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 15 6 18 9"/><path d="M6 21 9 18 6 15"/><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M15 6h6"/><path d="M15 18h6"/></svg>',reset:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',league:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/></svg>',knockout:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M21 6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3"/></svg>',group:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',arrowLeft:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7M5 12h14"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',boot:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h2l3-4h1a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 12V8"/><path d="M8 12V8"/></svg>',medal:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',archive:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',sword:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',fire:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',share:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',certificate:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/><path d="M9 13.71V11"/><path d="M15 13.71V11"/><path d="M12 8V5"/><path d="M12 3V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>'},Ch="1.0",Ph="kickoff_tournaments_v1",Pv="kickoff_tournaments_backup",Dv=new URLSearchParams(window.location.search),Dh=Dv.get("admin")==="true";console.log("[KickOff] URL Params:",window.location.search,"isAdmin:",Dh);const m={tournaments:[],tournament:null,user:{username:"ADMIN",role:"superadmin",loggedIn:!0,loginTime:Date.now()},view:"home",theme:localStorage.getItem("kickoff_theme")||"dark",mobileStandingsMode:localStorage.getItem("mobile_standings_mode")||"compact",activeRound:1,activeBottomSheet:null,isMobile:window.innerWidth<768,onboarding:{step:0,selectedFormat:null},standingsFilter:"overall",timelineRound:null,loginError:null,isLoading:!1,isAdmin:Dh,dashboardPlayers:[]};function xs(s,e={}){window.parent!==window&&window.parent.postMessage({type:s,...e},"*")}window.addEventListener("message",s=>{console.log("[TournamentSystem] Received message:",s.data),s.data.type==="PLAYERS_LIST"&&(m.dashboardPlayers=s.data.players,m.view==="standings"&&m.activeBottomSheet&&U())});window.parent!==window&&window.parent.postMessage({type:"REQUEST_PLAYERS"},"*");window.addEventListener("resize",()=>{const s=window.innerWidth<768;s!==m.isMobile&&(m.isMobile=s,U())});let Gi=null;async function le(s=!1){try{if(m.tournament){const n=m.tournaments.findIndex(r=>r.id===m.tournament.id);n!==-1?m.tournaments[n]=m.tournament:m.tournaments.push(m.tournament)}const e=JSON.stringify({version:Ch,tournaments:m.tournaments});if(localStorage.setItem(Ph,e),localStorage.setItem("kickoff_theme",m.theme),s&&localStorage.setItem(Pv,e),!m.tournament||!m.user)return;Gi&&clearTimeout(Gi),Gi=setTimeout(async()=>{var n;try{await si(We(Le,"tournaments",m.tournament.id),{...m.tournament,updatedAt:ti(),updatedBy:((n=m.user)==null?void 0:n.username)||"system"}),console.log("[Firestore] Synced:",m.tournament.name)}catch(r){r.code==="resource-exhausted"?console.warn("[Firestore] Quota exhausted — retry soon"):console.error("[Firestore] Sync error:",r)}},1500)}catch(e){console.error("Save failed:",e)}}async function Vv(){if(!m.user)return;try{await Tv}catch(e){console.error("Cannot sync: Auth failed",e);return}const s=qu(ra(Le,"tournaments"),wy("createdAt","desc"));return new Promise((e,n)=>{let r=!0;Iy(s,i=>{if(m.tournaments=i.docs.map(o=>({id:o.id,...o.data()})),localStorage.setItem(Ph,JSON.stringify({version:Ch,tournaments:m.tournaments})),m.tournament){const o=m.tournaments.find(l=>l.id===m.tournament.id);o&&(m.tournament=o)}r?(r=!1,e()):U()},i=>{console.error("Sync failed:",i),r&&n(i)})})}async function Nv(s){try{await Wu(We(Le,"tournaments",s))}catch(e){console.error("Delete failed:",e)}}async function Mv(){try{const s=qu(ra(Le,"users"),xy("role","==","superadmin"));if((await Ey(s)).empty){const n=await as("admin123");await si(We(Le,"users","admin"),{username:"admin",password:n,role:"superadmin",isActive:!0,createdAt:ti(),loginAttempts:0})}}catch(s){console.warn("Admin check failed:",s)}}function Lv(){document.documentElement.classList.toggle("light-mode",m.theme==="light"),document.documentElement.classList.toggle("dark",m.theme==="dark"),document.body.style.background="#050508",document.body.style.color="#f1f5f9"}function Vh(){m.theme=m.theme==="dark"?"light":"dark",le(),U()}let Mr=!1;async function U(){console.log("[KickOff] Render called. View:",m.view);try{const s=document.getElementById("root");if(!s){console.error("[KickOff] Root element not found!");return}if(Lv(),!m.user){s.innerHTML=`
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:#475569;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">Initializing Security Protocols...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;try{await Mv()}catch(e){console.warn("[KickOff] Admin check failed, proceeding to login anyway:",e)}Ov(s);return}if(!Mr){s.innerHTML=`
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
    `,Mr=!0,await Vv(),U();return}m.onboarding.step>0?Uv(s):m.tournament?m.tournament.status==="setup_teams"||m.tournament.status==="onboarding_summary"?Gv(s):ex(s):Fv(s)}catch(s){alert("RENDER ERROR: "+s.message+`
`+s.stack),console.error(s)}}async function $v(s,e){m.loginError=null;const n=document.getElementById("login-btn");n&&(n.disabled=!0,n.textContent="Verifying...");try{const r=We(Le,"users",s),i=await dr(r);if(!i.exists()){m.loginError="Invalid username or password.",U();return}const o=i.data();if(o.lockedUntil&&o.lockedUntil.toDate()>new Date){const c=Math.ceil((o.lockedUntil.toDate()-new Date)/6e4);m.loginError=`Account locked. Try again in ${c} minute(s).`,U();return}if(!o.isActive){m.loginError="Account deactivated. Contact administrator.",U();return}const l=await as(e);if(o.password===l){await xo(r,{loginAttempts:0,lockedUntil:null,lastLogin:ti()});const c={username:o.username,role:o.role,loggedIn:!0,loginTime:Date.now()};localStorage.setItem(ci,JSON.stringify(c)),m.user=c,await Nr("User logged in"),U()}else{const c=(o.loginAttempts||0)+1,d={loginAttempts:c};c>=5?(d.lockedUntil=new Date(Date.now()+900*1e3),m.loginError="Too many failed attempts. Locked for 15 minutes."):m.loginError="Invalid username or password.",await xo(r,d),U()}}catch(r){console.error(r),m.loginError="Authentication error. Check your connection.",U()}}function Ov(s){s.innerHTML=`
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
            ${m.loginError?`<p style="font-size:0.75rem;font-weight:700;color:#f87171;text-align:center;padding:0.5rem 0">${m.loginError}</p>`:""}
            <button id="login-btn" type="submit" style="width:100%;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;padding:1rem;border-radius:0.875rem;border:none;cursor:pointer;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;box-shadow:0 8px 24px rgba(59,130,246,0.3),0 0 40px rgba(124,58,237,0.15);margin-top:0.5rem">
              Sign In &rarr;
            </button>
          </form>
        </div>
        <p style="text-align:center;margin-top:1.5rem;font-size:0.6rem;font-weight:900;color:#1e1e32;text-transform:uppercase;letter-spacing:0.3em">Secured with Firebase &bull; v2.1</p>
      </div>
    </div>
  `,document.getElementById("toggle-pw").addEventListener("click",()=>{const e=document.getElementById("login-password");e.type=e.type==="password"?"text":"password"}),document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault(),await $v(document.getElementById("login-username").value.trim(),document.getElementById("login-password").value)})}function Fv(s){const e=m.tournaments.filter(l=>!l.archived),n=m.tournaments.filter(l=>l.archived);m.isMobile?s.innerHTML=`
      <div class="min-h-screen p-5 pb-24 safe-area-pb" style="background:#050508">
        <header class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="KickOff Logo" style="width:44px;height:44px;border-radius:12px;object-fit:cover;box-shadow:0 0 20px rgba(59,130,246,0.5),0 0 40px rgba(124,58,237,0.2)">
            <div>
              <h1 class="text-xl font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</h1>
              <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${m.isAdmin?"Control Center":"Official Hub"}</p>
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
              `:e.map(l=>Jc(l)).join("")}
            </div>
          </div>

          ${n.length>0?`
            <div class="pt-6">
              <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#334155">Archived</h2>
              <div class="space-y-3 opacity-50">
                ${n.map(l=>Jc(l)).join("")}
              </div>
            </div>
          `:""}
        </section>

        ${m.isAdmin?`
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
                 ${m.isAdmin?`
                 <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
                   <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.8)"></span>
                   Command Center Active
                 </div>
                 `:""}
                 <h1 class="text-5xl font-black tracking-tighter" style="background:linear-gradient(135deg,#f1f5f9 30%,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${m.isAdmin?"Your Tournaments":"Official Tournaments"}</h1>
                 <p class="font-bold tracking-[0.3em] uppercase text-xs" style="color:#475569">${m.isAdmin?"Manage multiple disciplines":"Live Competition Center"}</p>
               </div>
             </div>
             <div class="flex items-center gap-4">
               ${m.isAdmin?`
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
                <p class="text-sm font-medium" style="color:#334155">${m.isAdmin?"Create your first tournament to get started.":"Waiting for the next season to begin..."}</p>
              </div>
              ${m.isAdmin?`
              <button id="new-tournament-btn-empty" class="px-10 py-4 rounded-2xl font-black text-sm transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 8px 32px rgba(59,130,246,0.3)">Create Tournament</button>
              `:""}
            </div>
          `:`
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${e.map(l=>Xc(l)).join("")}
            </div>
          `}

          ${n.length>0?`
            <div class="pt-20 space-y-8" style="border-top:1px solid #0f0f1a">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-black uppercase tracking-widest" style="color:#334155">Archived</h2>
                <div class="flex-1" style="height:1px;background:#0f0f1a"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                ${n.map(l=>Xc(l)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `;const r=document.getElementById("new-tournament-btn");r&&r.addEventListener("click",()=>{if(m.tournaments.length>=10){alert("Maximum 10 tournaments reached. Delete old ones to create new.");return}m.onboarding.step=1,U()});const i=document.getElementById("new-tournament-btn-empty");i&&i.addEventListener("click",()=>{m.onboarding.step=1,U()});const o=document.getElementById("theme-toggle");o&&o.addEventListener("click",Vh),s.querySelectorAll(".open-tournament").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.id;m.tournament=m.tournaments.find(d=>d.id===c),m.view="dashboard",xs("TOURNAMENT_OPENED",{id:c}),U()})}),s.querySelectorAll(".next-season-btn").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation(),wa(l.dataset.id)})}),s.querySelectorAll(".view-champion-btn").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id;m.tournament=m.tournaments.find(h=>h.id===d),m.view="champion",xs("TOURNAMENT_OPENED",{id:d}),U()})}),s.querySelectorAll(".archive-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id,h=m.tournaments.find(f=>f.id===d);h&&(h.archived=!h.archived,le(),U())})}),s.querySelectorAll(".delete-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id;Nh(d)})}),s.querySelectorAll(".duplicate-tournament").forEach(l=>{l.addEventListener("click",c=>{c.stopPropagation();const d=l.dataset.id,h=m.tournaments.find(v=>v.id===d);if(m.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}const f=JSON.parse(JSON.stringify(h));f.id=`t-${Date.now()}`,f.archived=!1;let g=`${h.name} (Copy)`,b=1;for(;m.tournaments.some(v=>v.name.toLowerCase()===g.toLowerCase());)g=`${h.name} (Copy ${++b})`;f.name=g,f.fixtures=h.fixtures.map(v=>({...v,homeScore:null,awayScore:null,status:"upcoming"})),f.status="active",m.tournaments.push(f),le(),U()})})}function Nh(s){const e=m.tournaments.find(r=>r.id===s);if(!e)return;const n=document.createElement("div");n.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.9);backdrop-filter:blur(16px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem",n.innerHTML=`
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
  `,document.body.appendChild(n),document.getElementById("confirm-delete").addEventListener("click",async()=>{var i;const r=e.name;m.tournaments=m.tournaments.filter(o=>o.id!==s);try{await Nv(s),await Nr(`Deleted tournament: ${r}`)}catch(o){console.error("Firestore delete failed:",o)}le(),n.remove(),((i=m.tournament)==null?void 0:i.id)===s&&(m.tournament=null,m.view="home"),U(),ls(`${r} deleted`)}),document.getElementById("cancel-delete").addEventListener("click",()=>{n.remove()})}function ls(s){const e=document.createElement("div");e.style.cssText="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));border:1px solid rgba(96,165,250,0.3);color:#93c5fd;font-weight:900;padding:0.875rem 2rem;border-radius:1rem;box-shadow:0 8px 32px rgba(59,130,246,0.2),0 0 60px rgba(124,58,237,0.1);z-index:200;pointer-events:none;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;backdrop-filter:blur(12px);animation:float-up 0.3s ease forwards",e.innerText=s,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transition="opacity 0.3s",setTimeout(()=>e.remove(),300)},3e3)}function Jc(s){const e=s.fixtures.filter(c=>c.status==="completed").length,n=s.fixtures.length,r=n>0?e/n*100:0,i=F[s.type==="groups"?"group":s.type==="knockout"?"knockout":"league"],o=Mh(s),l=o?o.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}):null;return`
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
  `}function Mh(s){if(!s.scheduling||!s.scheduling.matchDays||s.scheduling.matchDays.length===0)return null;const e={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6},n=s.scheduling.matchDays.map(i=>e[i]),r=new Date;r.setHours(0,0,0,0);for(let i=0;i<14;i++){let o=new Date(r);if(o.setDate(r.getDate()+i),n.includes(o.getDay()))return o}return null}function Xc(s){const e=s.fixtures.filter(f=>f.status==="completed").length,n=s.fixtures.length,r=n>0?e/n*100:0;let i,o;const l=Date.now(),c=s.startDate&&new Date(s.startDate).getTime()>l;s.archived?(o="Archived",i="background:#0a0a12;color:#475569;border-color:#1e1e32"):c?(o="Upcoming",i="background:rgba(245,158,11,0.1);color:#f59e0b;border-color:rgba(245,158,11,0.25)"):e===n&&n>0?(o="Completed",i="background:rgba(16,185,129,0.08);color:#34d399;border-color:rgba(16,185,129,0.2)"):e>0?(o="Live",i="background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25)"):(o="Setup",i="background:#0a0a12;color:#475569;border-color:#1e1e32");const d={round_robin:"Round Robin",knockout:"Knockout",league:"Full League",groups:"Group+KO"},h=F[s.type==="groups"?"group":s.type==="knockout"?"knockout":"league"];return`
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
           ${m.isAdmin?`
            <div class="flex gap-2">
              <button data-id="${s.id}" class="archive-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="${s.archived?"Restore":"Archive"}" onmouseover="this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.archive}</button>
              <button data-id="${s.id}" class="duplicate-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Duplicate" onmouseover="this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.copy}</button>
              <button data-id="${s.id}" class="delete-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Delete" onmouseover="this.style.color='#f87171';this.style.borderColor='rgba(239,68,68,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${F.trash}</button>
            </div>
            `:""}
        </div>
        <div class="flex items-center gap-4">
          ${s.logo?`<img src="${s.logo}" class="w-14 h-14 rounded-xl object-contain p-1 border" style="background:#0a0a12;border-color:#1e1e32">`:`
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background:#0a0a12;border:1px solid #1e1e32;color:#60a5fa">${h}</div>
          `}
          <div>
            <h3 class="text-xl font-black tracking-tight mb-1 line-clamp-1 transition-all" style="color:#f1f5f9">${s.name}</h3>
            <p class="text-[10px] font-black uppercase tracking-widest" style="color:#475569">${d[s.type]||s.type} &bull; ${s.teams.length} Teams &bull; S${s.season||1}</p>
            ${(()=>{const f=Mh(s);return f?`<p class="mt-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
                Next Matchday: ${f.toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short"})}
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
  `}function Uv(s){m.onboarding.step===1?Bv(s):m.onboarding.step===2&&zv(s)}function Bv(s){const e=[{id:"round_robin",name:"Round Robin",icon:F.league,desc:"Small local competition. Every team plays everyone once.",color:"text-indigo-400"},{id:"knockout",name:"Knockout",icon:F.knockout,desc:"High stakes drama. Win or go home sudden-death.",color:"text-red-400"},{id:"groups",name:"Group + KO",icon:F.group,desc:"World Cup format. Group stage followed by brackets.",color:"text-emerald-400"},{id:"league",name:"Full League",icon:F.league,desc:"Double round robin. The ultimate consistency test.",color:"text-yellow-400"}];m.isMobile?(s.innerHTML=`
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
    `,document.getElementById("cancel-onboarding").addEventListener("click",()=>{m.onboarding.step=0,U()})):s.innerHTML=`
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
    `;const n=document.getElementById("cancel-onboarding-desktop");n&&n.addEventListener("click",()=>{m.onboarding.step=0,U()}),s.querySelectorAll("[data-format]").forEach(r=>{r.addEventListener("click",()=>{m.onboarding.selectedFormat=r.dataset.format,m.onboarding.step=2,U()})})}function jv(s){return new Promise((e,n)=>{const r=new FileReader;r.readAsDataURL(s),r.onload=()=>e(r.result),r.onerror=i=>n(i)})}function zv(s){const e=m.onboarding.selectedFormat,n=e==="groups",r=e==="league";s.innerHTML=`
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{m.onboarding.step=1,U()});const i=document.getElementById("config-form"),o=document.getElementById("matchCountLabel"),l=document.getElementById("teamCountInput"),c=()=>{var b;const h=parseInt(l.value)||0,f=e;let g=0;if(f==="round_robin"||f==="league"){const v=parseInt(((b=i.elements.legs)==null?void 0:b.value)||(f==="league"?2:1));g=h*(h-1)/2*v}else if(f==="knockout"){const v=parseInt(i.elements.legs.value);g=(h-1)*v}else if(f==="groups"){const v=parseInt(i.elements.groupSize.value),T=Math.ceil(h/v),R=v*(v-1)/2;g=T*R+(T*2-1)}o.innerText=`${Math.floor(g)} Matches`};i.addEventListener("input",c),c();let d=null;document.getElementById("logo-upload").addEventListener("change",async h=>{const f=h.target.files[0];if(f){if(f.size>2*1024*1024){alert("Maximum size 2MB allowed.");return}d=await jv(f);const g=document.getElementById("logo-preview"),b=document.getElementById("logo-placeholder");g.src=d,g.classList.remove("hidden"),b.classList.add("hidden")}}),document.getElementById("back-btn").addEventListener("click",()=>{m.onboarding.step=1,U()}),i.addEventListener("submit",h=>{h.preventDefault();const f=new FormData(h.target);Hv({name:f.get("name"),startDate:f.get("startDate"),type:e,logo:d,teamCount:parseInt(f.get("teamCount")),legs:parseInt(f.get("legs")||(e==="league"?2:1)),groupSize:parseInt(f.get("groupSize")||0),promoSpots:parseInt(f.get("promoSpots")||0),relegationSpots:parseInt(f.get("relegationSpots")||0),continentalSpots:parseInt(f.get("continentalSpots")||0),scheduling:{daysPerMatchday:parseInt(f.get("daysPerMatchday")),matchDays:Array.from(h.target.querySelectorAll('input[name="matchDays"]:checked')).map(g=>g.value)}})})}function Lh(s){const e=new Date(s);let n=new Date(2026,3,17);if(e>=n)for(;;){let r=new Date(n);if(r.setMonth(r.getMonth()+9),r.setDate(r.getDate()-1),e<=r){const i=n.getFullYear(),o=r.getFullYear();return{name:i===o?`${i} Season`:`${i}/${o}`,start:n,end:r}}if(n.setMonth(n.getMonth()+9),n.getFullYear()>2100)break}else for(;;){let r=new Date(n);n=new Date(n),n.setMonth(n.getMonth()-9);let i=new Date(r);if(i.setDate(i.getDate()-1),e>=n&&e<=i){const o=n.getFullYear(),l=i.getFullYear();return{name:o===l?`${o} Season`:`${o}/${l}`,start:n,end:i}}if(n.getFullYear()<2020)break}return{name:"Legacy",start:null,end:null}}function qv(){return Lh(new Date).name}async function Hv(s){const e=qv();if(m.tournaments.find(o=>o.name.toLowerCase()===s.name.toLowerCase()&&(o.season===e||!o.season))){alert(`A tournament named "${s.name}" already exists in the ${e} season.`);return}const r=`t-${Date.now()}`,i={id:r,...s,season:e,teams:Array.from({length:s.teamCount},(o,l)=>({id:l,name:`Team ${l+1}`,players:[]})),fixtures:[],standings:[],groups:[],currentStage:s.type==="groups"?"groups":s.type,status:"setup_teams",startDate:s.startDate||null,createdAt:Date.now()};m.tournament=i,m.onboarding.step=0;try{await si(We(Le,"tournaments",r),{id:r,name:s.name,season:e,createdAt:Date.now()}),console.log("[KickOff] Tournament synced to Firestore ranking system")}catch(o){console.error("[KickOff] Firestore sync failed:",o)}le(),U()}function Gv(s){s.innerHTML=`
    <div class="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <main class="flex-1 p-6 md:p-10 lg:p-16 overflow-auto">
        <div id="view-container"></div>
      </main>
    </div>
  `;const e=document.getElementById("view-container");m.tournament.status==="setup_teams"?Wv(e):m.tournament.status==="onboarding_summary"&&Kv(e)}function Wv(s){const e=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#f97316","#14b8a6","#3b82f6"];s.innerHTML=`
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
        ${m.tournament.teams.map((o,l)=>`
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
        ${m.dashboardPlayers.map(o=>`<option value="${o.name}">${o.ovr} OVR • #${o.number}</option>`).join("")}
      </datalist>
    </div>
  `,document.querySelectorAll(".team-name-input").forEach(o=>{o.addEventListener("input",l=>{const c=l.target.value.trim(),d=m.dashboardPlayers.find(b=>b.name.toLowerCase()===c.toLowerCase()),h=parseInt(l.target.dataset.teamId),f=m.tournament.teams.find(b=>b.id===h),g=document.getElementById(`team-img-container-${h}`);d?(f.playerId=d.id,f.image=d.image,g&&(g.querySelector("img").src=d.image,g.classList.remove("hidden"))):(f.playerId=null,f.image=null,g&&g.classList.add("hidden"))})}),document.querySelectorAll('input[type="color"]').forEach(o=>{o.addEventListener("input",l=>{const c=l.target.dataset.colorId,d=document.querySelector(`.team-color-dot[data-dot-id="${c}"]`);d&&(d.style.backgroundColor=l.target.value)})});const n=()=>{if(console.log("Back button clicked!"),!!m.tournament)try{m.tournaments=m.tournaments.filter(o=>o&&o.id!==m.tournament.id),m.tournament=null,m.onboarding.step=2,le(),U()}catch(o){console.error(o),alert("Error going back: "+o.message)}},r=document.getElementById("back-to-config-btn");r&&r.addEventListener("click",n);const i=document.getElementById("back-to-config-btn-mobile");i&&i.addEventListener("click",n),document.getElementById("generate-fixtures-btn").addEventListener("click",()=>{document.querySelectorAll(".team-name-input").forEach(o=>{const l=parseInt(o.dataset.teamId),c=document.querySelector(`input[data-color-id="${l}"]`);m.tournament.teams[l].name=o.value||`Team ${l+1}`,m.tournament.teams[l].color=c?c.value:"#6366f1"}),le(),Jv()})}function Kv(s){const{fixtures:e}=m.tournament,n=Math.max(...e.map(r=>r.round),0);s.innerHTML=`
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
  `,document.getElementById("begin-ops-btn").addEventListener("click",()=>{m.tournament.status="active",le(),U()})}function Qv(s="auto",e={}){const{type:n,teams:r,legs:i=1,groupSize:o=4}=m.tournament;if(n==="round_robin"||n==="league")if(s==="semi"){const c=r.length%2===0?r.length:r.length+1;m.tournament.fixtures=Rv(r,e,(c-1)*i,i,n)}else m.tournament.fixtures=xa(r,i,n);else if(n==="knockout")m.tournament.fixtures=Av(r,1,i);else if(n==="groups"){const{groups:c,fixtures:d}=Sv(r,o);m.tournament.groups=c,m.tournament.fixtures=d}const l=Cv(m.tournament.fixtures);l.length&&console.warn("[FixtureEngine]",l)}function Yv(s,e=1,n=1){let r=1;for(;r<s.length;)r*=2;const i=r,o=[],l=[...s].sort(()=>Math.random()-.5),c=(f,g,b,v,T)=>({id:`ko-r${f}-m${g}-l${b}`,homeId:v,awayId:v===null?null:T,homeScore:null,awayScore:null,status:"upcoming",round:f+b,matchIndex:g,stage:"knockout",leg:b+1});for(let f=0;f<i/2;f++){const g=l[f*2]||null,b=l[f*2+1]||null;if(g&&b)for(let v=0;v<n;v++)o.push(c(e,f,v,v===0?g.id:b.id,v===0?b.id:g.id))}let d=i/2,h=e+n;for(;d>1;){d/=2;for(let f=0;f<d;f++)for(let g=0;g<n;g++)o.push(c(h,f,g,null,null));h+=n}if(i>s.length){const f=e+n;for(let g=0;g<i/2;g++){const b=l[g*2]||null,v=l[g*2+1]||null;if(!b||!v){const T=b||v,R=Math.floor(g/2),P=g%2===0?"homeId":"awayId",L=o.find(N=>N.round===f&&N.matchIndex===R);L&&(L[P]=T.id)}}}return o}function Jv(){const s=document.createElement("div");s.id="fixture-wizard",s.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto";const{type:e,teams:n,legs:r=1}=m.tournament,i=e==="knockout",o=e==="groups",l=!i&&!o;s.innerHTML=`
    <div style="width:100%;max-width:620px;background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:${m.isMobile?"1.25rem":"2.5rem"};box-shadow:0 40px 80px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
      <div style="margin-bottom:2rem">
        <div style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.25em;margin-bottom:0.4rem">Fixture Engine v2</div>
        <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;margin:0">Choose Generation Mode</h2>
        <p style="font-size:0.75rem;color:#475569;margin-top:0.5rem">${n.length} teams · ${e.replace("_"," ")}${l?` · ${r} leg${r>1?"s":""}`:""}</p>
      </div>
      <div id="mode-tabs" style="display:grid;grid-template-columns:${m.isMobile?"1fr":i||o?"1fr 1fr":"repeat(3,1fr)"};gap:0.75rem;margin-bottom:1.5rem">
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
  `,document.body.appendChild(s);let c="auto";const d={};let h=[];function f(v){c=v,s.querySelectorAll(".wiz-mode").forEach(T=>{const R=T.dataset.mode===v;T.style.border=R?"2px solid #3b82f6":"2px solid #1e1e32",T.style.background=R?"rgba(59,130,246,0.1)":"#0a0a12";const P=T.querySelector("div:nth-child(2)");P&&(P.style.color=R?"#60a5fa":"#94a3b8")}),g(v)}function g(v){const T=document.getElementById("wiz-panel");if(v==="auto"){const R=l?'<strong style="color:#60a5fa">Berger Circle</strong> round-robin — every team plays exactly once per matchday. Home/away alternates each leg. Odd teams get a fair BYE rotation.':i?`<strong style="color:#60a5fa">Seeded bracket</strong> — teams placed 1–${n.length} in optimal positions. BYE teams auto-advance. Subsequent rounds pre-generated as empty slots.`:'<strong style="color:#60a5fa">Randomised group draw</strong> then Berger round-robin within each group.';T.innerHTML=`
        <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:1.25rem">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.7;margin:0">${R}</p>
          <div style="margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:0.65rem;color:#60a5fa;font-weight:900">
            ✓ No team plays twice on the same matchday &nbsp;|&nbsp; ✓ Validated before saving
          </div>
        </div>`}else if(v==="semi"){const P=((n.length%2===0?n.length:n.length+1)-1)*r,L=Math.min(P,8),N=n.map(G=>`<option value="${G.id}">${G.name}</option>`).join(""),q=Math.floor(n.length/2);let j="";for(let G=1;G<=L;G++){let Z="";for(let E=0;E<q;E++)Z+=`
            <div style="display:grid;grid-template-columns:1fr 0.4rem 1fr;gap:0.5rem;align-items:center;margin-top:0.4rem">
              <select data-round="${G}" data-match="${E}" data-side="home" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Home</option>${N}
              </select>
              <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
              <select data-round="${G}" data-match="${E}" data-side="away" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Away</option>${N}
              </select>
            </div>`;j+=`<div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem;margin-bottom:0.5rem">
          <span style="font-size:0.6rem;font-weight:900;color:#334155;white-space:nowrap;display:block;margin-bottom:0.2rem">MD ${G}</span>
          ${Z}
        </div>`}T.innerHTML=`
        <p style="font-size:0.72rem;color:#475569;margin:0 0 0.75rem">Optionally pin matches per matchday (Max ${q}). Leave blank to let the algorithm decide.</p>
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:300px;overflow-y:auto">${j}</div>
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
        ${h.length===0?'<p style="font-size:0.72rem;color:#334155;text-align:center;padding:1rem 0">No fixtures yet — add some above.</p>':h.map((R,P)=>{var q,j;const L=((q=n.find(G=>G.id===R.homeId))==null?void 0:q.name)||"?",N=((j=n.find(G=>G.id===R.awayId))==null?void 0:j.name)||"?";return`<div style="display:flex;align-items:center;justify-content:space-between;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.625rem;padding:0.45rem 0.75rem">
                <span style="font-size:0.75rem;color:#94a3b8"><strong style="color:#60a5fa">MD${R.round}</strong>  ${L} <span style="color:#334155">vs</span> ${N}</span>
                <button data-del="${P}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:0.9rem;padding:0 0.25rem">✕</button>
              </div>`}).join("")}
      </div>`,document.getElementById("m-add").addEventListener("click",()=>{const R=parseInt(document.getElementById("m-home").value),P=parseInt(document.getElementById("m-away").value),L=parseInt(document.getElementById("m-round").value),N=document.getElementById("m-err");if(N.style.display="none",!R||!P){N.textContent="Select both teams.",N.style.display="block";return}if(R===P){N.textContent="Home and away must differ.",N.style.display="block";return}if(!L||L<1){N.textContent="Enter a valid matchday (≥1).",N.style.display="block";return}if(h.filter(j=>j.round===L).some(j=>j.homeId===R||j.awayId===R||j.homeId===P||j.awayId===P)){N.textContent="A team already plays on this matchday!",N.style.display="block";return}h.push({id:`man-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,homeId:R,awayId:P,round:L,homeScore:null,awayScore:null,status:"upcoming",stage:i?"knockout":e,date:null,venue:null}),b(v)}),v.querySelectorAll("[data-del]").forEach(R=>{R.addEventListener("click",()=>{h.splice(parseInt(R.dataset.del),1),b(v)})})}s.querySelectorAll(".wiz-mode").forEach(v=>v.addEventListener("click",()=>f(v.dataset.mode))),g("auto"),document.getElementById("wiz-confirm").addEventListener("click",()=>{if(c==="manual"){if(h.length===0){ls("Add at least one fixture first.");return}m.tournament.fixtures=h}else Qv(c,d);m.tournament.status="onboarding_summary",le(),s.remove(),U()}),document.getElementById("wiz-cancel").addEventListener("click",()=>s.remove())}function Xv(){return`
    <header class="backdrop-blur-xl border-b p-3 sticky top-0 z-50 flex items-center justify-between no-print" style="background:rgba(10,10,18,0.92);border-color:#1e1e32">
      <div class="flex items-center gap-2.5 overflow-hidden" ${m.isAdmin?'id="mobile-switcher-btn"':""}>
        <img src="/logo.png" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(59,130,246,0.4),0 0 24px rgba(124,58,237,0.15);flex-shrink:0">
        <div class="overflow-hidden">
          <div class="text-[8px] font-black uppercase tracking-widest" style="color:#475569">Tournament</div>
          <h2 class="text-sm font-black truncate tracking-tighter uppercase" style="color:#f1f5f9">${m.tournament.name}</h2>
        </div>
        ${m.isAdmin?`<span class="ml-1" style="color:#334155">${F.menu}</span>`:""}
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle-mobile" class="p-2 rounded-xl border transition-all active:scale-95" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
          ${m.theme==="dark"?F.sun:F.moon}
        </button>
      </div>
    </header>
  `}function Zv(){return`
    <nav class="fixed bottom-0 inset-x-0 grid grid-cols-5 safe-area-pb z-50 no-print" style="background:rgba(10,10,18,0.95);border-top:1px solid #1e1e32;backdrop-filter:blur(20px);box-shadow:0 -10px 40px rgba(0,0,0,0.6)">
       ${[{id:"dashboard",label:"Home",icon:F.home},{id:"fixtures",label:"Matches",icon:F.fixtures},{id:"standings",label:"Stats",icon:F.standings},{id:"teams",label:"Squads",icon:F.teams},{id:"more",label:"More",icon:F.more}].map(e=>{const n=m.view===e.id||e.id==="more"&&["scorers","bracket","awards","summary"].includes(m.view);return`
           <button data-nav="${e.id}" class="flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90" style="color:${n?"#60a5fa":"#475569"}">
             <span class="w-5 h-5">${e.icon}</span>
             <span class="text-[8px] font-black uppercase tracking-widest" style="opacity:${n?1:.5}">${e.label}</span>
             ${n?'<span class="absolute bottom-0 w-8 h-0.5 rounded-full" style="background:linear-gradient(90deg,#3b82f6,#7c3aed)"></span>':""}
           </button>
         `}).join("")}
    </nav>
  `}function ko(s,e=!1){const n=document.getElementById("bottom-sheet-container"),r=e?"custom":s;if(m.activeBottomSheet===r&&!e){m.activeBottomSheet=null,n.innerHTML="";return}m.activeBottomSheet=r;let i="";e?i=s:r==="more"?i=`
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
          ${m.isAdmin?`
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
        </div>
      </div>
    `:r==="switcher"&&(i=`
      <div class="space-y-6 p-8">
        <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Tournament Registry</h4>
        <div class="space-y-3 max-h-[50vh] overflow-auto">
          ${m.tournaments.map(o=>{var l,c,d;return`
            <button data-switch="${o.id}" class="w-full p-6 bg-slate-950 border ${((l=m.tournament)==null?void 0:l.id)===o.id?"border-indigo-500 bg-indigo-500/5":"border-slate-800"} rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98]">
               <div class="flex flex-col items-start">
                 <span class="font-black text-sm uppercase tracking-tighter ${((c=m.tournament)==null?void 0:c.id)===o.id?"text-indigo-400":"text-slate-100"}">${o.name}</span>
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${o.type} &bull; ${o.teams.length} Teams</span>
               </div>
               ${((d=m.tournament)==null?void 0:d.id)===o.id?'<span class="text-indigo-500 text-xs">●</span>':""}
            </button>
          `}).join("")}
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
  `,document.getElementById("bs-backdrop").addEventListener("click",()=>{m.activeBottomSheet=null,n.innerHTML=""}),r==="more"?(document.querySelectorAll("[data-view-mobile]").forEach(o=>o.addEventListener("click",()=>{m.view=o.dataset.viewMobile,m.activeBottomSheet=null,n.innerHTML="",U()})),document.getElementById("logout-btn").addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(ci),m.user=null,m.tournament=null,m.tournaments=[],Mr=!1,m.activeBottomSheet=null,n.innerHTML="",U())})):r==="switcher"&&(document.querySelectorAll("[data-switch]").forEach(o=>o.addEventListener("click",()=>{m.tournament=m.tournaments.find(l=>l.id===o.dataset.switch),m.view="dashboard",m.activeBottomSheet=null,n.innerHTML="",U()})),document.getElementById("exit-tournament").addEventListener("click",()=>{m.tournament=null,m.view="home",m.activeBottomSheet=null,n.innerHTML="",xs("TOURNAMENT_CLOSED"),U()}))}function ex(s){const e=m.tournament.archived;m.isMobile?s.innerHTML=`
      <div class="flex flex-col min-h-screen" style="background:#050508;color:#f1f5f9">
        ${Xv()}
        <main id="main-content" class="flex-1 p-5 pb-32 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div id="view-container"></div>
        </main>
        ${Zv()}
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
            ${m.isAdmin?`
            <button id="back-to-home" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm mb-4" style="color:#475569" onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'">
              <span class="w-4 h-4">${F.arrowLeft}</span>
              <span>All Tournaments</span>
            </button>
            <div class="mb-4" style="height:1px;background:#1e1e32"></div>
            `:""}
            ${et("dashboard","Dashboard",F.dashboard)}
            ${et("fixtures","Fixtures",F.fixtures)}
            ${et("standings","Standings",F.standings)}
            ${et("scorers","Top Scorers",F.boot)}
            ${et("teams","Teams",F.teams)}
            ${m.isAdmin&&(m.tournament.type==="knockout"||m.tournament.type==="groups")?et("bracket","Bracket",F.bracket):""}
            ${et("history","League History",F.certificate)}
            ${m.isAdmin?et("player-creds","Player Credentials",F.teams):""}
            ${m.isAdmin?`
            <div style="height:1px;background:#1e1e32;margin:0.5rem 0"></div>
            ${et("settings","Account Settings",'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>')}
            `:""}
          </nav>

          ${m.isAdmin?`
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
                <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Operational Registry</div>
                <div class="text-xs font-black uppercase" style="color:#60a5fa">${m.tournament.name}</div>
              </div>
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
                  <span style="color:#60a5fa">${m.tournament.name}</span>
                  ${e?'<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase" style="background:#0f0f1a;color:#475569;border:1px solid #1e1e32">READ ONLY</span>':""}
                </div>
                <h2 class="text-3xl font-black tracking-tight capitalize" style="color:#f1f5f9">${m.view}</h2>
             </div>
             <nav class="flex gap-1 p-1 rounded-xl border no-print" style="background:#0a0a12;border-color:#1e1e32">
                ${["dashboard","fixtures","standings","scorers"].map(n=>`
                  <button data-view="${n}" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" style="${m.view===n?"background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 2px 12px rgba(59,130,246,0.3)":"color:#475569"}" ${m.view!==n?`onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'"`:""}>
                    ${n==="scorers"?"Scorers":n.charAt(0).toUpperCase()+n.slice(1)}
                  </button>
                `).join("")}
             </nav>
          </header>
          <div id="view-container"></div>
        </main>
      </div>
    `,tx(),nx()}function tx(){if(m.isMobile){document.querySelectorAll("[data-nav]").forEach(r=>r.addEventListener("click",()=>{const i=r.dataset.nav;i==="more"?ko("more"):(m.view=i,U())}));const s=document.getElementById("exit-to-registry");s&&s.addEventListener("click",()=>{m.tournament=null,m.view="home",xs("TOURNAMENT_CLOSED"),U()});const e=document.getElementById("mobile-switcher-btn");e&&e.addEventListener("click",()=>ko("switcher"));const n=document.getElementById("theme-toggle-mobile");n&&n.addEventListener("click",Vh)}else{document.querySelectorAll("[data-view]").forEach(r=>r.addEventListener("click",()=>{m.view=r.dataset.view,U()}));const s=document.getElementById("back-to-home");s&&s.addEventListener("click",()=>{m.tournament=null,m.view="home",xs("TOURNAMENT_CLOSED"),U()});const e=document.getElementById("new-btn-sidebar");e&&e.addEventListener("click",()=>{if(m.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}m.tournament=null,m.onboarding.step=1,U()});const n=document.getElementById("logout-btn-sidebar");n&&n.addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(ci),m.user=null,m.tournament=null,m.tournaments=[],Mr=!1,U())})}}function et(s,e,n){const r=m.view===s;return`<button data-view="${s}" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm" style="${r?"background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));color:#60a5fa;border:1px solid rgba(59,130,246,0.2)":"color:#475569;border:1px solid transparent"}" ${r?"":`onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'"`}><span class="w-4 h-4 flex-shrink-0">${n}</span><span>${e}</span></button>`}function nx(){const s=document.getElementById("view-container");switch(m.view){case"dashboard":ix(s);break;case"fixtures":$h(s);break;case"standings":bt(s);break;case"scorers":rx(s);break;case"teams":ux(s);break;case"bracket":Bh(s);break;case"h2h":dx(s);break;case"summary":gx(s);break;case"history":yx(s);break;case"player-creds":renderPlayerCredentialsView(s);break;case"champion":mx(s);break;case"awards":bx(s);break;case"settings":sx(s);break}}function sx(s){var i,o;const e='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',n='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';s.innerHTML=`
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
          <p class="font-black text-base uppercase" style="color:#60a5fa">${(i=m.user)==null?void 0:i.username}</p>
          <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${((o=m.user)==null?void 0:o.role)||"admin"}</p>
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
      ${m.isAdmin?`
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

      ${m.isAdmin?`
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
  `,m.isAdmin&&document.getElementById("update-scheduling-form").addEventListener("submit",l=>{l.preventDefault();const c=new FormData(l.target);t.scheduling={daysPerMatchday:parseInt(c.get("daysPerMatchday")),matchDays:Array.from(l.target.querySelectorAll('input[name="matchDays"]:checked')).map(d=>d.value)},le(),ls("Schedule updated"),U()}),document.getElementById("change-username-form").addEventListener("submit",async l=>{l.preventDefault();const c=document.getElementById("username-msg"),d=document.getElementById("new-username").value.trim(),h=document.getElementById("confirm-pw-for-username").value;if(c.style.display="none",!d||d.length<3){c.textContent="Username must be at least 3 characters.",c.style.display="block";return}if(d===m.user.username){c.textContent="New username is the same as current.",c.style.display="block";return}try{const f=We(Le,"users",m.user.username),g=await dr(f);if(!g.exists()){c.textContent="User not found.",c.style.display="block";return}const b=g.data(),v=await as(h);if(b.password!==v){c.textContent="Incorrect current password.",c.style.color="#f87171",c.style.display="block";return}if((await dr(We(Le,"users",d))).exists()){c.textContent="That username is already taken.",c.style.color="#f87171",c.style.display="block";return}await si(We(Le,"users",d),{...b,username:d}),await Wu(f);const R={...m.user,username:d,loginTime:Date.now()};localStorage.setItem(ci,JSON.stringify(R)),m.user=R,await Nr(`Username changed to: ${d}`),ls("Username updated successfully!"),c.style.color="#34d399",c.textContent="✓ Username updated. You are now signed in as "+d,c.style.display="block",document.getElementById("new-username").value="",document.getElementById("confirm-pw-for-username").value="",U()}catch(f){console.error(f),c.textContent="Error: "+(f.message||"Update failed."),c.style.color="#f87171",c.style.display="block"}}),document.getElementById("change-password-form").addEventListener("submit",async l=>{l.preventDefault();const c=document.getElementById("password-msg"),d=document.getElementById("current-password").value,h=document.getElementById("new-password").value,f=document.getElementById("confirm-new-password").value;if(c.style.display="none",h.length<6){c.textContent="New password must be at least 6 characters.",c.style.color="#f87171",c.style.display="block";return}if(h!==f){c.textContent="New passwords do not match.",c.style.color="#f87171",c.style.display="block";return}try{const g=We(Le,"users",m.user.username),b=await dr(g);if(!b.exists()){c.textContent="User not found.",c.style.display="block";return}const v=b.data(),T=await as(d);if(v.password!==T){c.textContent="Current password is incorrect.",c.style.color="#f87171",c.style.display="block";return}const R=await as(h);await xo(g,{password:R,loginAttempts:0}),await Nr("Password changed"),ls("Password updated successfully!"),c.style.color="#34d399",c.textContent="✓ Password changed. Keep it safe!",c.style.display="block",document.getElementById("current-password").value="",document.getElementById("new-password").value="",document.getElementById("confirm-new-password").value=""}catch(g){console.error(g),c.textContent="Error: "+(g.message||"Update failed."),c.style.color="#f87171",c.style.display="block"}});const r=document.getElementById("delete-tournament-btn-settings");r&&r.addEventListener("click",()=>{Nh(m.tournament.id)})}function bt(s){const e=m.tournament.type==="groups",n=Math.max(...m.tournament.fixtures.map(d=>d.round),1);m.timelineRound===null&&(m.timelineRound=n);const r=`
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 no-print">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matchday Timeline</h4>
          <p class="text-xl font-black text-indigo-400 font-mono">MD ${m.timelineRound} / ${n}</p>
        </div>
        <div class="flex-1 flex items-center gap-4">
          <input type="range" id="timeline-slider" min="1" max="${n}" value="${m.timelineRound}" 
            class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
          <div class="flex gap-2">
            <button id="timeline-prev" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&larr;</button>
            <button id="timeline-next" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&rarr;</button>
          </div>
        </div>
        <button id="timeline-reset" class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Latest</button>
      </div>
    </div>
  `;if(m.isMobile){s.innerHTML=`
      <div class="space-y-6">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Engine Output</h3>
          <div class="flex items-center gap-2 no-print">
            <button id="export-pdf-btn-mobile" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-2 rounded-lg active:scale-95 transition-all">PDF</button>
            <div class="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button id="view-mode-compact" class="p-2.5 rounded-lg ${m.mobileStandingsMode==="compact"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${F.league}
              </button>
              <button id="view-mode-cards" class="p-2.5 rounded-lg ${m.mobileStandingsMode==="cards"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${F.group}
              </button>
            </div>
          </div>
        </header>

        ${r}

        <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print overflow-x-auto no-scrollbar mb-4">
          ${["overall","home","away","cleansheets"].map(h=>`
            <button data-filter="${h}" class="flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${m.standingsFilter===h?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}">
              ${h==="cleansheets"?"Clean":h}
            </button>
          `).join("")}
        </div>

        <div id="standings-content" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${cs(!1,null,m.timelineRound)}
        </div>
      </div>
    `;const d=s.querySelector("#export-pdf-btn-mobile");d&&d.addEventListener("click",nd),s.querySelector("#view-mode-compact").addEventListener("click",()=>{m.mobileStandingsMode="compact",localStorage.setItem("mobile_standings_mode","compact"),bt(s)}),s.querySelector("#view-mode-cards").addEventListener("click",()=>{m.mobileStandingsMode="cards",localStorage.setItem("mobile_standings_mode","cards"),bt(s)})}else{const d=`
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
        <h1>${m.tournament.name}</h1>
        <p>Tournament Standings • ${m.standingsFilter.toUpperCase()} View • Matchday ${m.timelineRound} • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `,f=`
      <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print self-start">
        ${["overall","home","away","cleansheets"].map(T=>`
          <button data-filter="${T}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${m.standingsFilter===T?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}" style="${m.standingsFilter===T?"box-shadow:0 4px 12px rgba(79,70,229,0.3)":""}">
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
          ${m.tournament.groups.map(T=>`
            <div class="space-y-6">
              <h4 class="text-xl font-black text-slate-100 flex items-center gap-4">
                <span class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm tracking-tighter">${T.name}</span>
                Group ${T.name}
              </h4>
              ${cs(!1,T.id,m.timelineRound)}
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
          ${cs(!1,null,m.timelineRound)}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;const g=s.querySelector("#print-btn");g&&g.addEventListener("click",()=>window.print());const b=s.querySelector("#export-img-btn");b&&b.addEventListener("click",px);const v=s.querySelector("#export-pdf-btn");v&&v.addEventListener("click",nd)}const i=document.getElementById("timeline-slider");i&&i.addEventListener("input",d=>{m.timelineRound=parseInt(d.target.value),bt(s)});const o=document.getElementById("timeline-prev");o&&o.addEventListener("click",()=>{m.timelineRound>1&&(m.timelineRound--,bt(s))});const l=document.getElementById("timeline-next");l&&l.addEventListener("click",()=>{m.timelineRound<n&&(m.timelineRound++,bt(s))});const c=document.getElementById("timeline-reset");c&&c.addEventListener("click",()=>{m.timelineRound=n,bt(s)}),s.querySelectorAll("[data-filter]").forEach(d=>{d.addEventListener("click",()=>{m.standingsFilter=d.dataset.filter,bt(s)})}),s.querySelectorAll(".team-detail-btn").forEach(d=>{d.addEventListener("click",()=>Ge(d.dataset.teamId))})}function rx(s){const e=An();if(m.isMobile)s.innerHTML=`
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
    `}s.querySelectorAll(".team-detail-btn").forEach(n=>{n.addEventListener("click",()=>Ge(n.dataset.teamId))})}function ix(s){const e=m.tournament.fixtures,n=e.filter(c=>c.status==="completed").slice(-3).reverse(),r=e.filter(c=>c.status==="upcoming").slice(0,3),i=m.tournament.type==="groups"&&m.tournament.currentStage==="groups"&&e.filter(c=>c.stage==="groups"&&c.status!=="completed").length===0,l=An()[0]||null;m.isMobile?s.innerHTML=`
      <div class="space-y-8 pb-32 animate-in fade-in duration-700">
        <!-- Hero Section -->
        <div class="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${F.trophy}</div>
          <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 italic">Tournament Active</p>
          <h3 class="text-white font-black text-2xl leading-none tracking-tighter uppercase mb-6">${m.tournament.name}</h3>
          <button data-view="fixtures" class="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
            ${F.league} ${m.isAdmin?"Manage Schedule":"View Fixtures"}
          </button>
        </div>

        <!-- Mini Stats -->
        <div class="grid grid-cols-2 gap-4">
          ${Wi("Matches",e.length,"text-indigo-400")}
          ${Wi("Played",e.filter(c=>c.status==="completed").length,"text-emerald-400")}
          ${Wi("Goals",e.reduce((c,d)=>c+(d.homeScore||0)+(d.awayScore||0),0),"text-slate-400")}
        </div>

        ${i?'<div class="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-lg font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white w-full py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}

        <!-- Recent Activity -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
            <button data-view="fixtures" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">View All</button>
          </div>
          <div class="space-y-3">
            ${n.length?n.map(c=>Ki(c)).join(""):'<div class="p-10 border border-slate-800 rounded-[2rem] text-center text-slate-600 italic text-xs uppercase font-black">No recent matches</div>'}
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
           ${cs(!0)}
        </section>

        <!-- Biggest Win Snapshot -->
        ${(()=>{const c=ws();if(!c)return"";const d=m.tournament.teams.find(f=>f.id===c.homeId),h=m.tournament.teams.find(f=>f.id===c.awayId);return!d||!h?"":`
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
          ${tr("Matches",e.length,"text-indigo-400")}
          ${tr("Played",e.filter(c=>c.status==="completed").length,"text-emerald-400")}
          ${tr("Teams",m.tournament.teams.length,"text-slate-400")}
          ${tr("Goals",e.reduce((c,d)=>c+(d.homeScore||0)+(d.awayScore||0),0),"text-yellow-400")}
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
              <div class="space-y-4">${n.length?n.map(c=>Ki(c)).join(""):'<p class="text-slate-600 italic">No matches detected.</p>'}</div>
            </section>
            
            <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Next Engagements</h3>
              <div class="space-y-4">${r.length?r.map(c=>Ki(c)).join(""):'<p class="text-slate-600 italic">Season complete.</p>'}</div>
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
             ${cs(!0)}
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
              ${(()=>{const c=ws();if(!c)return'<p class="text-xs text-slate-600 italic">No records established.</p>';const d=m.tournament.teams.find(f=>f.id===c.homeId),h=m.tournament.teams.find(f=>f.id===c.awayId);return!d||!h?"":`
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
              ${m.tournament.teams.slice(0,4).map(c=>`
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
    `,document.getElementById("adv-ko")&&document.getElementById("adv-ko").addEventListener("click",ax),s.querySelectorAll("[data-view]").forEach(c=>c.addEventListener("click",()=>{m.view=c.dataset.view,U()})),s.querySelectorAll(".team-detail-btn").forEach(c=>{c.addEventListener("click",()=>Ge(c.dataset.teamId))}),setTimeout(()=>{try{if(typeof Chart>"u"){console.warn("[KickOff] Chart.js not loaded yet.");return}m.isMobile?Zc("formChartMobileDashboard"):Zc("formChartDesktopDashboard")}catch(c){console.error("[KickOff] Dashboard Charts Error:",c)}},100)}function Zc(s){if(typeof Chart>"u")return;const e=document.getElementById(s);if(!e)return;const n=e.getContext("2d"),r=je().slice(0,5),i=Array.from(new Set(m.tournament.fixtures.map(c=>c.round))).sort((c,d)=>c-d);Array.from(new Set(m.tournament.fixtures.filter(c=>c.status==="completed").map(c=>c.round))).sort((c,d)=>c-d);const o=r.map((c,d)=>{let h=0;const f=[0],g=m.tournament.fixtures.filter(v=>v.status==="completed"&&(v.homeId===c.id||v.awayId===c.id));i.forEach(v=>{const T=g.find(R=>R.round===v);if(T){const R=T.homeId===c.id;T.homeScore===T.awayScore?h+=1:(R&&T.homeScore>T.awayScore||!R&&T.awayScore>T.homeScore)&&(h+=3)}f.push(h)});const b=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899"];return{label:c.name,data:f,borderColor:b[d%b.length],backgroundColor:b[d%b.length]+"10",borderWidth:3,pointRadius:0,pointHoverRadius:4,tension:.4,fill:d===0}}),l=Chart.getChart(e);l&&l.destroy(),new Chart(n,{type:"line",data:{labels:["0",...i.map(c=>`${c}`)],datasets:o},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!m.isMobile,position:"bottom",labels:{color:"#475569",font:{size:9,weight:"700"},usePointStyle:!0,boxWidth:6}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:11,weight:"bold"}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}}}}})}function tr(s,e,n){const i={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399","text-slate-400":"#94a3b8","text-yellow-400":"#facc15"}[n]||"#60a5fa";return`<div class="rounded-2xl p-6" style="background:#0f0f1a;border:1px solid #1e1e32"><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#475569">${s}</p><p class="text-3xl font-black font-mono" style="color:${i}">${e}</p></div>`}function Wi(s,e,n){const i={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399"}[n]||"#60a5fa";return`<div class="p-5 rounded-2xl text-center" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)"><p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#475569">${s}</p><p class="text-2xl font-black font-mono leading-none" style="color:${i}">${e}</p></div>`}function Ki(s){const e=m.tournament.teams.find(l=>l.id===s.homeId)||{name:"?"},n=m.tournament.teams.find(l=>l.id===s.awayId)||{name:"?"},r=s.status==="upcoming"?"VS":`${s.homeScore}–${s.awayScore}`,i=e.image?`<img src="${e.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"",o=n.image?`<img src="${n.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"";return`<div class="p-4 rounded-xl flex items-center justify-between transition-all" style="background:#0a0a12;border:1px solid #1e1e32">
    <div class="flex-1 flex items-center justify-end gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${e.id}">
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${e.name}</span>
      ${i}
    </div>
    <div class="mx-4 px-4 py-1.5 rounded-lg font-black font-mono text-sm" style="background:#0f0f1a;color:#60a5fa;border:1px solid #1e1e32">${r}</div>
    <div class="flex-1 flex items-center gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${n.id}">
      ${o}
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${n.name}</span>
    </div>
  </div>`}function $h(s){const e=m.tournament.fixtures,n=m.tournament.type==="league"||m.tournament.type==="groups",r=Array.from(new Set(e.map(o=>o.round))).sort((o,l)=>o-l);m.isMobile?(r.includes(m.activeRound)||(m.activeRound=r[0]||1),s.innerHTML=`
      <div class="space-y-6">
        <div class="flex items-center justify-between no-print mb-2">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Management</h3>
          <button id="export-fixtures-btn" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Export PDF</button>
        </div>

        <!-- Horizontal Round Tabs -->
        <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth snap-x">
          ${r.map(o=>`
            <button data-round="${o}" class="flex-shrink-0 snap-start px-6 py-3 rounded-2xl border ${m.activeRound===o?"bg-indigo-600 border-indigo-500 text-white shadow-lg":"bg-slate-900 border-slate-800 text-slate-500"} transition-all active:scale-95">
              <span class="text-[10px] font-black uppercase tracking-widest">${n?"MW":"RD"} ${o}</span>
            </button>
          `).join("")}
        </div>

        <div id="fixtures-content" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${(()=>{const o=ws();return e.filter(l=>l.round===m.activeRound).map(l=>ed(l,o&&o.id===l.id)).join("")})()}
           ${e.length===0?'<p class="text-center py-20 text-slate-700 italic">No fixtures generated yet.</p>':""}
        </div>
      </div>
    `,s.querySelectorAll("[data-round]").forEach(o=>o.addEventListener("click",()=>{m.activeRound=parseInt(o.dataset.round),$h(s)}))):s.innerHTML=`
      <div class="flex justify-end mb-8 no-print">
        <button id="export-fixtures-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> Export Fixtures PDF
        </button>
      </div>
      <div id="fixtures-content" class="space-y-16">
        ${(()=>{const o=ws();return r.map(l=>`
            <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="flex items-center gap-4">
                 <div class="h-8 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                 <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">${m.tournament.type==="league"||m.tournament.type==="groups"&&m.tournament.currentStage==="groups"?"Matchweek":"Round"} ${l}</h5>
                 <div class="flex-1 h-px bg-slate-800/50"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${e.filter(c=>c.round===l).map(c=>ed(c,o&&o.id===c.id)).join("")}
              </div>
            </div>
          `).join("")})()}
      </div>
    `;const i=s.querySelector("#export-fixtures-btn");i&&i.addEventListener("click",fx),s.querySelectorAll(".score-input").forEach(o=>o.addEventListener("change",l=>{Oh(l.target.closest("[data-match-id]").dataset.matchId,l.target.dataset.type,l.target.value)})),s.querySelectorAll(".status-toggle").forEach(o=>o.addEventListener("click",l=>Fh(l.currentTarget.closest("[data-match-id]").dataset.matchId)))}function ed(s,e=!1){const n=m.tournament.teams.find(d=>d.id===s.homeId)||{name:"TBD"},r=m.tournament.teams.find(d=>d.id===s.awayId)||{name:"TBD"},i=s.status==="completed",o=m.tournament.archived,l=m.isMobile,c=e?"border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50":"border-slate-800 shadow-xl";return`
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
  `}function Oh(s,e,n,r=null){let i=m.tournament;r&&(i=m.tournaments.find(l=>l.name===r)||m.tournament);const o=i.fixtures.find(l=>l.id===s);o&&(o[`${e}Score`]=n===""?null:parseInt(n),le(!0))}function Fh(s,e=null){let n=m.tournament;e&&(n=m.tournaments.find(i=>i.name===e)||m.tournament);const r=n.fixtures.find(i=>i.id===s);if(!r||r.homeScore===null||r.awayScore===null){alert("Results must be entered before marking as complete.");return}if(r.status=r.status==="completed"?"upcoming":"completed",r.stage==="knockout"&&r.status==="completed"&&ox(r),r.status==="completed"&&window.parent!==window){const i=n.teams.find(l=>l.id===r.homeId),o=n.teams.find(l=>l.id===r.awayId);window.parent.postMessage({type:"MATCH_COMPLETED",match:{p1Id:(i==null?void 0:i.playerId)||null,p1Score:r.homeScore,p2Id:(o==null?void 0:o.playerId)||null,p2Score:r.awayScore,tournament:n.name}},"*")}le(!0),r.status==="completed"&&hx(),U()}function ox(s){const e=s.homeScore>s.awayScore?s.homeId:s.awayId,n=s.round+(m.tournament.legs||1),r=Math.floor(s.matchIndex/2),i=s.matchIndex%2===0?"homeId":"awayId",o=m.tournament.fixtures.find(l=>l.round===n&&l.matchIndex===r&&l.stage==="knockout");o&&(o[i]=e,le())}function ax(){const s=[];m.tournament.groups.forEach((r,i)=>{const o=je(r.id);s.push({groupId:i,rank:1,team:m.tournament.teams.find(l=>l.id===o[0].id)}),s.push({groupId:i,rank:2,team:m.tournament.teams.find(l=>l.id===o[1].id)})});const e=[];for(let r=0;r<s.length;r+=4)s[r]&&s[r+3]&&e.push(s[r].team,s[r+3].team),s[r+1]&&s[r+2]&&e.push(s[r+2].team,s[r+1].team);const n=Yv(e,Math.max(...m.tournament.fixtures.map(r=>r.round))+1,m.tournament.legs||1);m.tournament.fixtures.push(...n),m.tournament.currentStage="knockout",m.view="bracket",le(),U()}function Lr(s){return m.tournament.fixtures.filter(n=>n.status==="completed"&&(n.homeId===s||n.awayId===s)).sort((n,r)=>n.round-r.round).slice(-5).map(n=>{const r=n.homeId===s,i=r?n.homeScore:n.awayScore,o=r?n.awayScore:n.homeScore;return i>o?"W":i<o?"L":"D"})}function An(){const s={},e=je();return m.tournament.teams.forEach(n=>{const r=e.find(i=>i.id===n.id)||{w:0,d:0,cs:0};s[n.id]={name:n.name,teamId:n.id,teamName:n.name,image:n.image||null,goals:0,assists:0,matchesPlayed:new Set,fantasyPoints:r.w*5+r.d*2+r.cs*6}}),m.tournament.fixtures.forEach(n=>{n.status==="completed"&&(s[n.homeId]&&(s[n.homeId].goals+=n.homeScore||0,s[n.homeId].matchesPlayed.add(n.id),s[n.homeId].fantasyPoints+=(n.homeScore||0)*4),s[n.awayId]&&(s[n.awayId].goals+=n.awayScore||0,s[n.awayId].matchesPlayed.add(n.id),s[n.awayId].fantasyPoints+=(n.awayScore||0)*4))}),Object.values(s).map(n=>{const r=n.matchesPlayed.size;return{...n,matchesCount:r}}).sort((n,r)=>r.fantasyPoints-n.fantasyPoints||r.goals-n.goals)}function cs(s,e=null,n=999){let r=je(e,n);const i=m.standingsFilter||"overall";i==="home"?r.sort((f,g)=>g.home.pts-f.home.pts||g.home.gf-g.home.ga-(f.home.gf-f.home.ga)||g.home.gf-f.home.gf):i==="away"?r.sort((f,g)=>g.away.pts-f.away.pts||g.away.gf-g.away.ga-(f.away.gf-f.away.ga)||g.away.gf-f.away.gf):i==="cleansheets"&&r.sort((f,g)=>g.cs-f.cs||f.ga-g.ga||g.pts-f.pts);const o=(m.tournament.type==="league"||m.tournament.type==="round_robin")&&e===null,l=m.tournament.promoSpots||0,c=m.tournament.relegationSpots||0,d=m.tournament.continentalSpots||0;if(m.isMobile)if(m.mobileStandingsMode==="compact"){let f=`
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
                ${r.map((g,b)=>{const v=o&&b<d,T=o&&b>=r.length-c,R=o&&b>=d&&b<d+l;let P="text-slate-600";v?P="text-emerald-400":R?P="text-indigo-400":T&&(P="text-red-500/60");const L=i==="home"?g.home:i==="away"?g.away:g,N=L.gf-L.ga;return`
                    <tr class="active:bg-slate-800 transition-all team-detail-btn cursor-pointer" data-team-id="${g.id}">
                      <td class="p-4"><span class="font-black ${P}">${(b+1).toString().padStart(2,"0")}</span></td>
                      <td class="p-4 font-black text-slate-200 uppercase truncate max-w-[120px]">${g.name}</td>
                      <td class="p-4 text-center font-bold text-slate-400">${L.p}</td>
                      ${i==="cleansheets"?`
                        <td class="p-4 text-center font-black text-emerald-400 italic">${L.cs}</td>
                      `:`
                        <td class="p-4 text-center font-bold ${N>=0?"text-emerald-500/70":"text-red-500/70"}">${N>0?"+":""}${N}</td>
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
          ${r.map((f,g)=>{const b=Lr(f.id),v=o&&g<d,T=o&&g>=r.length-c,R=o&&g>=d&&g<d+l;let P="border-slate-800";v?P="border-emerald-500/30 bg-emerald-500/5":R?P="border-indigo-500/30 bg-indigo-500/5":T&&(P="border-red-500/30 bg-red-500/5");const L=i==="home"?f.home:i==="away"?f.away:f;return`
              <div class="team-detail-btn bg-slate-900 border ${P} rounded-[2rem] p-6 flex items-center justify-between shadow-xl active:scale-95 transition-all" data-team-id="${f.id}">
                <div class="flex items-center gap-5">
                  <span class="text-3xl font-black text-slate-800 italic leading-none">${g+1}</span>
                  <div>
                    <h4 class="font-black text-slate-100 uppercase tracking-tight text-lg">${f.name}</h4>
                    <div class="flex gap-1.5 mt-2">
                      ${b.map(N=>`<span class="w-1.5 h-1.5 rounded-full ${N==="W"?"bg-emerald-500":N==="D"?"bg-slate-600":"bg-red-500"}"></span>`).join("")}
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
          ${r.map((f,g)=>{const b=o&&g<d,v=o&&g>=d&&g<d+l,T=o&&g>=r.length-c;let R="";b?R="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]":v?R="bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]":T&&(R="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]");const P=i==="home"?f.home:i==="away"?f.away:f,L=P.gf-P.ga,N=L>0?"+":"",q=L>0?"text-emerald-400":L<0?"text-red-400":"text-slate-600",j=Lr(f.id);let G="";if(i==="cleansheets"){const Z=P.p>0?(P.cs/P.p).toFixed(2):"0.00";G=`
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
                <td class="py-4 text-center font-mono font-black ${q}">${N}${L}</td>
                <td class="py-4 text-center font-black text-slate-100 text-base tracking-tighter shadow-indigo-500/10">${P.pts}</td>
              `;return`<tr class="bg-slate-950/40 group relative transition-all cursor-default scale-100 hover:scale-[1.01]">
              <td class="py-4 pl-4 rounded-l-3xl relative overflow-hidden">
                ${R?`<div class="absolute inset-y-2 left-0 w-1.5 ${R} rounded-r-full"></div>`:""}
                <span class="font-mono font-black ${b?"text-emerald-400":v?"text-indigo-400":T?"text-red-500/60":"text-slate-600"}">
                    ${(g+1).toString().padStart(2,"0")}
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
                  ${j.map(Z=>`<span data-result="${Z}" class="w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-black ${Z==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":Z==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"} form-badge-print"><span class="form-badge-bg">${Z}</span></span>`).join("")}
                  ${j.length===0?'<span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">-</span>':""}
                </div>
                `:""}
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
  `}function lx(s,e,n){const r=document.createElement("div");r.className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200",r.innerHTML=`
    <div class="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-2xl p-6 relative">
      <h3 class="text-lg font-black text-slate-100 uppercase tracking-tighter mb-4">${s}</h3>
      <input type="text" id="edit-modal-input" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6" value="${e||""}" autocomplete="off">
      <div class="flex gap-3">
        <button id="edit-modal-cancel" class="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
        <button id="edit-modal-save" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30">Save Data</button>
      </div>
    </div>
  `,document.body.appendChild(r);const i=r.querySelector("#edit-modal-input");i.focus(),i.setSelectionRange(0,i.value.length);const o=()=>r.remove();r.querySelector("#edit-modal-cancel").addEventListener("click",o),r.querySelector("#edit-modal-save").addEventListener("click",()=>{n(i.value),o()}),i.addEventListener("keydown",l=>{l.key==="Enter"&&(n(i.value),o()),l.key==="Escape"&&o()})}function Ge(s){var f,g;const e=b=>{b.querySelectorAll(".global-score-input").forEach(v=>v.addEventListener("change",T=>{const R=T.target.closest("[data-match-id]");Oh(R.dataset.matchId,T.target.dataset.type,T.target.value,R.dataset.tournament)})),b.querySelectorAll(".global-status-toggle").forEach(v=>v.addEventListener("click",T=>{const R=T.target.closest("[data-match-id]");Fh(R.dataset.matchId,R.dataset.tournament),Ge(s)}))},n=m.tournament.teams.find(b=>b.id===parseInt(s));if(!n)return;const r=je().find(b=>b.id===n.id)||{p:0,w:0,d:0,l:0,gd:0,home:{},away:{}},i=Lr(n.id),o=[];m.tournaments.forEach(b=>{const v=b.teams.find(T=>T.name===n.name||n.playerId&&T.playerId===n.playerId);v&&b.fixtures.filter(T=>T.status==="completed"&&(T.homeId===v.id||T.awayId===v.id)).forEach(T=>{o.push({...T,tournamentName:b.name,teamInMatch:v})})});const l=o.sort((b,v)=>new Date(v.date||0)-new Date(b.date||0));if(m.isMobile){const b=`
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
           ${cn("P",r.p)}
           ${cn("W",r.w)}
           ${cn("D",r.d)}
           ${cn("L",r.l)}
           ${cn("FP",((f=An().find(v=>v.teamId===n.id))==null?void 0:f.fantasyPoints)||0)}
           ${cn("GD",r.gd)}
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
             ${m.isAdmin?'<button id="link-player-btn-mobile" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">Link Club Player</button>':""}
           </div>
           <div id="roster-container-mobile" class="space-y-3">
             ${n.playerId?(()=>{const v=m.dashboardPlayers.find(T=>T.id===n.playerId);return v?`
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
               ${l.map(v=>{const T=v.homeId===v.teamInMatch.id,R=T?v.awayId:v.homeId,L=(m.tournaments.find(G=>G.name===v.tournamentName)||m.tournament).teams.find(G=>G.id===R)||{name:"Unknown"},N=T?v.homeScore>v.awayScore:v.awayScore>v.homeScore,q=v.homeScore===v.awayScore,j=v.status==="completed";return`
                   <div data-match-id="${v.id}" data-tournament="${v.tournamentName}" class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="flex flex-col items-center gap-1">
                           <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] ${N?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":q?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-500"}">
                             ${N?"W":q?"D":"L"}
                           </div>
                           ${m.isAdmin?`<button class="global-status-toggle p-1 text-slate-600 hover:text-indigo-400 transition-colors text-xs">${j?"✅":"⏳"}</button>`:""}
                        </div>
                        <div>
                          <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">${L.name}</div>
                          <div class="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${v.tournamentName}</div>
                        </div>
                      </div>
                      <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                        ${m.isAdmin?`
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
    `;ko(b,!0),setTimeout(()=>sd(n.id,"formChartMobile"),100),e(document.getElementById("bottom-sheet-container"));return}const c=document.createElement("div");c.id="team-detail-modal",c.className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300",c.innerHTML=`
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
           ${ln("Played",r.p)}
           ${ln("Wins",r.w)}
           ${ln("Draws",r.d)}
           ${ln("Losses",r.l)}
           ${ln("Fantasy Pts",((g=An().find(b=>b.teamId===n.id))==null?void 0:g.fantasyPoints)||0)}
           ${ln("GD",(r.gd>0?"+":"")+r.gd)}
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
               ${l.map(b=>{const v=b.homeId===b.teamInMatch.id,R=(m.tournaments.find(j=>j.name===b.tournamentName)||m.tournament).teams.find(j=>j.id===(v?b.awayId:b.homeId))||{name:"Unknown"},P=v?b.homeScore>b.awayScore:b.awayScore>b.homeScore,L=b.homeScore===b.awayScore,N=P?"W":L?"D":"L",q=b.status==="completed";return`
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
                           ${m.isAdmin?`
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
                              ${N}
                            </div>
                            ${m.isAdmin?`<button class="global-status-toggle text-[10px] hover:text-indigo-400 transition-colors uppercase font-black tracking-widest mt-1">${q?"Undo":"Complete"}</button>`:""}
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
  `,document.body.appendChild(c),c.addEventListener("click",b=>{b.target===c&&c.remove()}),document.getElementById("close-modal").addEventListener("click",()=>c.remove()),setTimeout(()=>sd(n.id,m.isMobile?"formChartMobile":"formChartDesktop"),100),e(document.getElementById("team-detail-modal"));const d=m.isMobile?document.getElementById("bottom-sheet"):c;n.players||(n.players=[]);const h=b=>{var T,R,P,L;(T=b.querySelector(".edit-team-name-btn"))==null||T.addEventListener("click",()=>{const N=prompt("Enter new squad name:",n.name);N&&N.trim()&&(n.name=N.trim(),le(),U(),m.isMobile||c.remove(),Ge(s))}),(R=b.querySelector(".add-player-btn"))==null||R.remove(),(P=b.querySelector("#link-player-btn"))==null||P.addEventListener("click",()=>{Yc(N=>{n.playerId=N,le(),m.isMobile||c.remove(),Ge(s)})}),(L=b.querySelector("#link-player-btn-mobile"))==null||L.addEventListener("click",()=>{Yc(N=>{n.playerId=N,le(),Ge(s)})});const v=b.querySelector("#mobile-team-back-btn");v&&v.addEventListener("click",()=>{m.view="standings",U()}),b.querySelectorAll(".edit-player-btn").forEach(N=>{N.addEventListener("click",()=>{const q=parseInt(N.dataset.idx);lx("Edit player name:",n.players[q],j=>{j&&j.trim()&&(n.players[q]=j.trim(),le(),!m.isMobile&&c&&c.remove(),Ge(s))})})}),b.querySelectorAll(".del-player-btn").forEach(N=>{N.addEventListener("click",()=>{if(confirm("Remove this player?")){const q=parseInt(N.dataset.idx);n.players.splice(q,1),le(),m.isMobile||c.remove(),Ge(s)}})})};m.isMobile?setTimeout(()=>h(d),50):h(c)}function ln(s,e){return`<div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1"><p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${s}</p><p class="text-2xl font-black text-slate-100 font-mono">${e}</p></div>`}function cn(s,e){return`<div class="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-center space-y-0.5"><p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">${s}</p><p class="text-sm font-black text-slate-100 font-mono leading-none">${e}</p></div>`}function je(s=null,e=999){let n=m.tournament.teams;if(s!==null){const o=m.tournament.groups.find(l=>l.id===s)||m.tournament.groups[s];o&&o.teamIds&&(n=m.tournament.teams.filter(l=>o.teamIds.includes(l.id)))}const r=n.map(o=>({id:o.id,name:o.name,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0,home:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},away:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},cs:0})),i=m.tournament.fixtures;return i.filter(o=>o.status==="completed"&&o.round<=e&&(s===null||o.groupId===s)&&(o.stage==="groups"||o.stage==="league"||o.stage==="round_robin"||!o.stage)).forEach(o=>{const l=r.find(d=>d.id===o.homeId),c=r.find(d=>d.id===o.awayId);l&&c&&(l.p++,c.p++,l.gf+=o.homeScore,l.ga+=o.awayScore,c.gf+=o.awayScore,c.ga+=o.homeScore,l.home.p++,l.home.gf+=o.homeScore,l.home.ga+=o.awayScore,c.away.p++,c.away.gf+=o.awayScore,c.away.ga+=o.homeScore,o.awayScore===0&&(l.cs++,l.home.cs++),o.homeScore===0&&(c.cs++,c.away.cs++),o.homeScore>o.awayScore?(l.w++,l.pts+=3,c.l++,l.home.w++,l.home.pts+=3,c.away.l++):o.homeScore<o.awayScore?(c.w++,c.pts+=3,l.l++,c.away.w++,c.away.pts+=3,l.home.l++):(l.d++,c.d++,l.pts++,c.pts++,l.home.d++,l.home.pts++,c.away.d++,c.away.pts++))}),r.forEach(o=>o.gd=o.gf-o.ga),r.sort((o,l)=>{if(l.pts!==o.pts)return l.pts-o.pts;if(l.gd!==o.gd)return l.gd-o.gd;if(l.gf!==o.gf)return l.gf-o.gf;const c=i.filter(d=>d.status==="completed"&&(d.homeId===o.id&&d.awayId===l.id||d.homeId===l.id&&d.awayId===o.id));if(c.length>0){let d=0,h=0;if(c.forEach(f=>{f.homeId===o.id?f.homeScore>f.awayScore?d+=3:f.homeScore<f.awayScore?h+=3:(d++,h++):f.homeScore>f.awayScore?h+=3:f.homeScore<f.awayScore?d+=3:(h++,d++)}),h!==d)return h-d}return o.name.localeCompare(l.name)})}function cx(){const s=je();if(s.length===0)return{bestAttack:null,bestDefence:null,biggestWin:null};const e=[...s].sort((i,o)=>o.gf-i.gf||i.p-o.p)[0],n=[...s].sort((i,o)=>i.ga-o.ga||i.p-o.p)[0],r=ws();return{bestAttack:e,bestDefence:n,biggestWin:r}}function ws(){const s=m.tournament.fixtures.filter(e=>e.status==="completed");return s.length===0?null:[...s].sort((e,n)=>{const r=Math.abs(e.homeScore-e.awayScore),i=Math.abs(n.homeScore-n.awayScore);return i!==r?i-r:n.homeScore+n.awayScore-(e.homeScore+e.awayScore)})[0]}function nr(s,e){const n=m.tournament.fixtures.filter(h=>h.status==="completed"&&(h.homeId===s&&h.awayId===e||h.homeId===e&&h.awayId===s)).sort((h,f)=>new Date(f.date||0)-new Date(h.date||0));let r=0,i=0,o=0,l=0,c=0;const d=n.map(h=>{const f=h.homeId===s,g=f?h.homeScore:h.awayScore,b=f?h.awayScore:h.homeScore;l+=g,c+=b;let v="D";return g>b?(r++,v="W"):b>g?(i++,v="L"):o++,{...h,aScore:g,bScore:b,result:v}});return{aWins:r,bWins:i,draws:o,aGoals:l,bGoals:c,history:d}}function dx(s){var o,l;const e=m.tournament.teams;let n=(o=e[0])==null?void 0:o.id,r=(l=e[1])==null?void 0:l.id;const i=()=>{if(n===void 0||r===void 0)return;const c=nr(n,r),d=e.find(g=>g.id===n),h=e.find(g=>g.id===r),f=document.getElementById("h2h-analysis");f.innerHTML=`
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
              ${c.history.map(g=>`
                <div class="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-all">
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-500 font-mono">RD ${g.round}</span>
                    <span class="text-sm font-bold text-slate-300">${new Date(g.date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <p class="text-xs font-black text-slate-200">${d.name}</p>
                    </div>
                    <div class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-black font-mono text-indigo-400">
                      ${g.aScore} - ${g.bScore}
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
  `,document.getElementById("team-a-select").addEventListener("change",c=>{n=parseInt(c.target.value),i(),setTimeout(()=>{Qi(nr(n,r)),Yi(n,r)},100)}),document.getElementById("team-b-select").addEventListener("change",c=>{r=parseInt(c.target.value),i(),setTimeout(()=>{Qi(nr(n,r)),Yi(n,r)},100)}),i(),setTimeout(()=>{Qi(nr(n,r)),Yi(n,r)},100)}function ux(s){m.isMobile?s.innerHTML=`
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
          ${m.tournament.teams.map(e=>`
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
          ${m.tournament.teams.map(e=>`
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
    `,document.getElementById("h2h-view-btn").addEventListener("click",()=>{m.view="h2h",U()}),s.querySelectorAll(".team-detail-btn").forEach(e=>{e.addEventListener("click",()=>Ge(e.dataset.teamId))})}function Uh(s="#4f46e5"){const n=Date.now()+4e3,r={startVelocity:30,spread:360,ticks:60,zIndex:1e4},i=(l,c)=>Math.random()*(c-l)+l,o=setInterval(function(){const l=n-Date.now();if(l<=0)return clearInterval(o);const c=50*(l/4e3);confetti({...r,particleCount:c,origin:{x:i(.1,.3),y:Math.random()-.2},colors:[s,"#ffffff","#fbbf24"]}),confetti({...r,particleCount:c,origin:{x:i(.7,.9),y:Math.random()-.2},colors:[s,"#ffffff","#fbbf24"]})},250)}function hx(){const s=m.tournament.fixtures.filter(n=>n.status==="completed").length,e=m.tournament.fixtures.length;s===e&&e>0&&m.tournament.status!=="completed"&&(m.tournament.status="completed",le(),m.view="champion",U(),setTimeout(()=>{var n;return Uh((n=m.tournament.teams[0])==null?void 0:n.color)},500))}function Bh(s){const e=m.tournament.fixtures.filter(r=>r.stage==="knockout");if(!e.length){s.innerHTML='<div class="h-96 flex flex-col items-center justify-center text-slate-600 italic font-black uppercase tracking-widest gap-4"><span class="text-4xl opacity-20">📂</span>Knockout phase has not started yet.</div>';return}const n=Array.from(new Set(e.map(r=>r.round))).sort((r,i)=>r-i);m.isMobile?(s.innerHTML=`
      <div class="space-y-8 animate-in fade-in duration-500 pb-20">
        <div class="flex overflow-x-auto gap-3 no-scrollbar px-2 snap-x">
          ${n.map(r=>`
            <button class="round-tab shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all snap-center ${m.activeRound===r?"bg-indigo-600 text-white shadow-lg shadow-indigo-900/40":"bg-slate-900 text-slate-500 border border-slate-800"}" data-round="${r}">
              Round ${r}
            </button>
          `).join("")}
        </div>

        <div id="bracket-matches" class="space-y-6">
           ${e.filter(r=>r.round===m.activeRound&&(r.leg===1||!r.leg)).map(r=>td(r)).join("")}
        </div>
      </div>
    `,s.querySelectorAll(".round-tab").forEach(r=>{r.addEventListener("click",()=>{m.activeRound=parseInt(r.dataset.round),Bh(s)})})):s.innerHTML=`<div class="flex gap-20 overflow-x-auto pb-10 no-scrollbar select-none">${n.map(r=>`<div class="flex flex-col justify-around gap-12 min-w-[280px]">
      <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Round ${r}</h5>
      ${e.filter(i=>i.round===r&&(i.leg===1||!i.leg)).map(i=>td(i)).join("")}
    </div>`).join("")}</div>`}function td(s){const e=m.tournament.teams.find(r=>r.id===s.homeId)||{name:"?"},n=m.tournament.teams.find(r=>r.id===s.awayId)||{name:"?"};return m.isMobile?`
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
    `:`<div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${e.name}</span><span class="font-mono text-xs font-black text-indigo-400">${s.homeScore??"-"}</span></div><div class="h-px bg-slate-800/50"></div><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${n.name}</span><span class="font-mono text-xs font-black text-indigo-400">${s.awayScore??"-"}</span></div></div>`}async function px(){const s=document.getElementById("standings-content");if(!s)return;const e=document.createElement("div");e.className="bg-slate-950 p-12 text-slate-100 font-sans",e.style.width="1200px",e.innerHTML=`
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter">${m.tournament.name}</h1>
      <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">League Standings</p>
    </div>
    ${s.innerHTML}
    <div class="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
      Exported on ${new Date().toLocaleDateString()} • Tournament Management Engine
    </div>
  `,document.body.appendChild(e);try{const n=await html2canvas(e,{backgroundColor:"#020617",scale:2,useCORS:!0,logging:!1}),r=document.createElement("a");r.download=`${m.tournament.name.replace(/\s+/g,"_")}_Standings.png`,r.href=n.toDataURL("image/png"),r.click()}catch(n){console.error("Snapshot failed:",n)}finally{document.body.removeChild(e)}}async function nd(){const{jsPDF:s}=window.jspdf,e=new s,n=m.tournament.name.replace(/\s+/g,"_");e.setFontSize(22),e.setTextColor(30,41,59),e.text(m.tournament.name,14,20),e.setFontSize(10),e.setTextColor(100,116,139);const r=m.tournament.type.charAt(0).toUpperCase()+m.tournament.type.slice(1);e.text(`${r} Status Report`,14,28);const o=je().map((d,h)=>{const f=Lr(d.id).join(" "),g=d.gd>0?"+":"";return[h+1,d.name,d.p,d.w,d.d,d.l,d.gf,d.ga,`${g}${d.gd}`,d.pts,f]});e.autoTable({head:[["Pos","Team","MP","W","D","L","GF","GA","GD","Pts","Form"]],body:o,startY:35,theme:"striped",headStyles:{fillColor:[79,70,229],textColor:[255,255,255],fontStyle:"bold"},styles:{fontSize:8,cellPadding:2},columnStyles:{0:{halign:"center"},1:{fontStyle:"bold"},2:{halign:"center"},3:{halign:"center"},4:{halign:"center"},5:{halign:"center"},6:{halign:"center"},7:{halign:"center"},8:{halign:"center"},9:{halign:"center",fontStyle:"bold"},10:{halign:"center"}}});const l=An();if(l.length>0){const d=e.lastAutoTable.finalY+15;e.setFontSize(14),e.setTextColor(30,41,59),e.text("Top Scorer Registry",14,d);const h=l.slice(0,10).map((f,g)=>[g+1,f.name,f.teamName,f.matchesCount,f.assists,f.goals]);e.autoTable({head:[["Rank","Player","Squad","MP","Assists","Goals"]],body:h,startY:d+5,theme:"grid",headStyles:{fillColor:[15,23,42],textColor:[255,255,255]},styles:{fontSize:8}})}const c=e.internal.getNumberOfPages();for(let d=1;d<=c;d++)e.setPage(d),e.setFontSize(8),e.setTextColor(148,163,184),e.text(`Generated on ${new Date().toLocaleString()} • KickOff Tournament Manager`,14,e.internal.pageSize.height-10);e.save(`${n}_Standings.pdf`)}async function fx(){const{jsPDF:s}=window.jspdf,e=new s,n=m.tournament.name.replace(/\s+/g,"_"),r=m.tournament.fixtures,i=[5,5,8],o=[15,15,26],l=[59,130,246],c=[124,58,237],d=[241,245,249],h=[148,163,184],f=[30,30,50],g=()=>{e.setFillColor(...i),e.rect(0,0,e.internal.pageSize.width,e.internal.pageSize.height,"F")};g(),e.setFillColor(...o),e.rect(0,0,e.internal.pageSize.width,40,"F"),e.setFillColor(...l),e.rect(0,40,e.internal.pageSize.width/2,2,"F"),e.setFillColor(...c),e.rect(e.internal.pageSize.width/2,40,e.internal.pageSize.width/2,2,"F"),e.setTextColor(...d),e.setFontSize(26),e.setFont("helvetica","bold"),e.text(m.tournament.name.toUpperCase(),14,25),e.setTextColor(...l),e.setFontSize(11),e.setFont("helvetica","bold"),e.text("OFFICIAL FIXTURE SCHEDULE",14,34);const b=Array.from(new Set(r.map(R=>R.round))).sort((R,P)=>R-P);let v=55;b.forEach(R=>{const L=r.filter(j=>j.round===R).map(j=>{const G=m.tournament.teams.find(x=>x.id===j.homeId)||{name:"?"},Z=m.tournament.teams.find(x=>x.id===j.awayId)||{name:"?"},E=j.status==="completed"?`${j.homeScore} - ${j.awayScore}`:"vs";return[j.date?new Date(j.date).toLocaleDateString():"TBD",G.name.toUpperCase(),E,Z.name.toUpperCase(),j.status==="completed"?"FT":j.status==="live"?"LIVE":""]}),q=m.tournament.type==="league"||m.tournament.type==="round_robin"?`MATCHWEEK ${R}`:`ROUND ${R}`;v>260&&(e.addPage(),g(),v=20),e.setFillColor(...o),e.roundedRect(14,v,e.internal.pageSize.width-28,12,2,2,"F"),e.setTextColor(...d),e.setFontSize(11),e.setFont("helvetica","bold"),e.text(q,20,v+8),e.autoTable({body:L,startY:v+14,theme:"grid",styles:{fillColor:i,textColor:d,lineColor:f,lineWidth:.1,fontSize:10,cellPadding:5,font:"helvetica"},alternateRowStyles:{fillColor:[10,10,16]},columnStyles:{0:{halign:"center",textColor:h,cellWidth:35,fontStyle:"bold"},1:{halign:"right",fontStyle:"bold",cellWidth:55,textColor:d},2:{halign:"center",fontStyle:"bold",cellWidth:20,textColor:l},3:{halign:"left",fontStyle:"bold",cellWidth:55,textColor:d},4:{halign:"center",textColor:c,fontStyle:"bold"}},didDrawPage:function(j){j.pageNumber>1&&j.cursor.y===j.settings.margin.top&&g()}}),v=e.lastAutoTable.finalY+15});const T=e.internal.getNumberOfPages();for(let R=1;R<=T;R++){e.setPage(R),e.setTextColor(...h),e.setFontSize(8),e.setFont("helvetica","normal");const P=`Generated by Quantum Vortex Engine • ${new Date().toLocaleDateString()} • Page ${R} of ${T}`;e.text(P,e.internal.pageSize.width/2,e.internal.pageSize.height-10,{align:"center"})}e.save(`${n}_Fixtures.pdf`)}function mx(s){const n=je()[0],r=(n==null?void 0:n.color)||"#fbbf24";s.innerHTML=`
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
           <h3 class="text-xl font-bold text-slate-400 capitalize">${m.tournament.name}</h3>
            <div class="flex items-center justify-center gap-6">
              <button id="view-standings-final" class="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl border border-slate-800 transition-all uppercase text-[10px] tracking-widest">Full Standings</button>
              <button id="summary-report-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase text-[10px] tracking-widest">Tournament Summary</button>
              <button id="next-season-champion" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase text-[10px] tracking-widest">Start Season ${(m.tournament.season||1)+1}</button>
              <button id="celebrate-btn" class="bg-slate-950 text-slate-400 px-6 py-4 rounded-xl font-bold border border-slate-800 uppercase text-[10px] tracking-[0.2em]">Celebrate Again 🎉</button>
            </div>
        </div>

        <button id="close-champion" class="text-slate-600 hover:text-slate-100 font-bold uppercase text-[9px] tracking-widest transition-colors mt-20">Skip Recognition Screen &rarr;</button>
      </div>
    </div>
  `,document.getElementById("view-standings-final").addEventListener("click",()=>{m.view="standings",U()}),document.getElementById("summary-report-btn").addEventListener("click",()=>{m.view="summary",U()}),document.getElementById("celebrate-btn").addEventListener("click",()=>Uh(r)),document.getElementById("close-champion").addEventListener("click",()=>{m.view="dashboard",U()});const i=document.getElementById("next-season-champion");i&&i.addEventListener("click",()=>wa(m.tournament.id))}function wa(s){const e=m.tournaments.find(i=>i.id===s);if(!e)return;const n=e.teams.map(i=>({...i,players:[...i.players||[]]})),r={...e,id:`t-${Date.now()}`,season:(e.season||1)+1,leagueId:e.leagueId||e.id,teams:n,fixtures:[],groups:[],status:"setup_teams",currentStage:e.type==="groups"?"groups":null,createdAt:new Date().toISOString()};m.tournaments.push(r),m.tournament=r,m.onboarding.step=0,m.view="dashboard",le(),U()}function gx(s){var b,v,T,R;const e=je(),n=e[0],r=e[1],i=e[2],o=cx(),c=An()[0],d=m.tournament.fixtures,h=d.reduce((P,L)=>P+(L.homeScore||0)+(L.awayScore||0),0),f=(h/d.length||0).toFixed(1);s.innerHTML=`
    <div class="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-12">
        <div class="space-y-4">
          <h1 class="text-5xl font-black text-slate-100 uppercase tracking-tighter">Mission Summary</h1>
          <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">${m.tournament.name} • Final Logistics Report</p>
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
         <button id="next-season-summary" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-emerald-900/40 uppercase tracking-widest text-sm">Deploy Season ${(m.tournament.season||1)+1} &rarr;</button>
      </div>
    </div>
  `,document.getElementById("export-summary-pdf").addEventListener("click",vx),document.getElementById("view-manual-awards").addEventListener("click",()=>{m.view="awards",U()});const g=document.getElementById("next-season-summary");g&&g.addEventListener("click",()=>wa(m.tournament.id))}function yx(s){const e=m.tournament.leagueId||m.tournament.id,n=m.tournaments.filter(r=>r.leagueId===e||r.id===e).sort((r,i)=>(r.season||1)-(i.season||1));s.innerHTML=`
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
        ${n.map(r=>{const i=m.tournament;m.tournament=r;const o=je(),l=o[0],c=o[1],d=r.fixtures.filter(g=>g.status==="completed").length,h=r.fixtures.length,f=i.id===r.id;return m.tournament=i,`
            <div class="bg-slate-900 border ${f?"border-indigo-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]":"border-slate-800"} rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-slate-900/80">
               <div class="flex items-center gap-8 flex-1">
                   <div class="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center border border-slate-800 p-2 text-center">
                     <span class="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Season</span>
                     <span class="text-[10px] font-black text-slate-100 font-mono leading-tight">${r.season||Lh(new Date(r.createdAt)).name}</span>
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
  `,s.querySelectorAll("[data-goto]").forEach(r=>{r.addEventListener("click",()=>{const i=r.dataset.goto;m.tournament=m.tournaments.find(o=>o.id===i),m.view="dashboard",U()})})}function bx(s){m.tournament.manualAwards=m.tournament.manualAwards||{},s.innerHTML=`
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div class="text-center space-y-4">
         <h2 class="text-5xl font-black text-white uppercase tracking-tighter">Honorable Recognition</h2>
         <p class="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Select and honor the top operatives and teams manually</p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${sr("Team of Tournament","player-ot")}
          ${sr("Fair Play Award","fair-play")}
          ${sr("Best Manager","best-manager")}
          ${sr("Goal of the Mission","goal-om")}
       </div>

       <div class="pt-20 text-center">
         <button id="back-to-summary" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Consolidate Summary Registry</button>
       </div>
    </div>
  `,s.querySelectorAll(".award-input").forEach(e=>{e.addEventListener("input",n=>{m.tournament.manualAwards[n.target.dataset.key]=n.target.value,le()})}),document.getElementById("back-to-summary").addEventListener("click",()=>{m.view="summary",U()})}function sr(s,e){return`
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
       <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${s}</h4>
       <input type="text" placeholder="Team Name..." class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all award-input" data-key="${e}" value="${m.tournament.manualAwards[e]||""}">
    </div>
  `}function vx(){const{jsPDF:s}=window.jspdf,e=new s;e.setFontSize(28),e.text("OFFICIAL TOURNAMENT SUMMARY",14,25),e.setFontSize(14),e.text(m.tournament.name,14,35);const r=je().map((i,o)=>[o+1,i.name,i.p,i.w,i.d,i.l,i.gf,i.ga,i.pts]);e.autoTable({startY:50,head:[["Pos","Squad","MP","W","D","L","GF","GA","Pts"]],body:r,theme:"grid"}),e.save(`${m.tournament.name}_Final_Report.pdf`)}try{console.log("[KickOff] Script execution reaching bottom. Triggering initial render."),document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{console.log("[KickOff] DOMContentLoaded triggered."),U()}):U()}catch(s){alert("CRITICAL STARTUP ERROR: "+s.message),console.error(s)}function Qi(s){if(typeof Chart>"u")return;const e=document.getElementById("h2hChart");if(!e)return;const n=e.getContext("2d"),r=Chart.getChart(e);r&&r.destroy(),new Chart(n,{type:"doughnut",data:{labels:["Squad A Wins","Stalemate","Squad B Wins"],datasets:[{data:[s.aWins,s.draws,s.bWins],backgroundColor:["#10b981","#475569","#6366f1"],hoverBackgroundColor:["#34d399","#64748b","#818cf8"],borderWidth:0,hoverOffset:15,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:12,weight:"bold"}}}}})}function Yi(s,e){if(typeof Chart>"u")return;const n=document.getElementById("h2hProgressionChart");if(!n)return;const r=n.getContext("2d"),i=m.tournament.teams.find(h=>h.id===s),o=m.tournament.teams.find(h=>h.id===e),l=Array.from(new Set(m.tournament.fixtures.map(h=>h.round))).sort((h,f)=>h-f),c=h=>{let f=0;const g=[0],b=m.tournament.fixtures.filter(v=>v.status==="completed"&&(v.homeId===h||v.awayId===h));return l.forEach(v=>{const T=b.find(R=>R.round===v);if(T){const R=T.homeId===h;T.homeScore===T.awayScore?f+=1:(R&&T.homeScore>T.awayScore||!R&&T.awayScore>T.homeScore)&&(f+=3)}g.push(f)}),g},d=Chart.getChart(n);d&&d.destroy(),new Chart(r,{type:"line",data:{labels:["0",...l.map(h=>`${h}`)],datasets:[{label:i.name,data:c(s),borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:3,tension:.4,pointRadius:2},{label:o.name,data:c(e),borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",borderWidth:3,tension:.4,pointRadius:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:"#475569",font:{size:9,weight:"bold"},usePointStyle:!0}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)"},ticks:{color:"#475569",font:{size:9}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9}}}}}})}function sd(s,e){if(typeof Chart>"u")return;const n=document.getElementById(e);if(!n)return;const r=n.getContext("2d"),i=m.tournament.fixtures.filter(d=>d.status==="completed"&&(d.homeId===s||d.awayId===s)),o=Array.from(new Set(m.tournament.fixtures.map(d=>d.round))).sort((d,h)=>d-h);let l=0;const c=[0];o.forEach(d=>{const h=i.find(f=>f.round===d);if(h){const f=h.homeId===s;h.homeScore===h.awayScore?l+=1:(f&&h.homeScore>h.awayScore||!f&&h.awayScore>h.homeScore)&&(l+=3)}c.push(l)}),new Chart(r,{type:"line",data:{labels:["Start",...o.map(d=>`RD ${d}`)],datasets:[{label:"Points",data:c,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",fill:!0,tension:.4,borderWidth:3,pointBackgroundColor:"#6366f1",pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#475569"}},x:{grid:{display:!1},ticks:{color:"#475569"}}}}})}
