(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const lp=()=>{};var fl={};/**
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
 */const Kc=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},cp=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=n[t++];e[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=n[t++],a=n[t++],l=n[t++],c=((r&7)<<18|(i&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const i=n[t++],a=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Qc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const i=n[r],a=r+1<n.length,l=a?n[r+1]:0,c=r+2<n.length,d=c?n[r+2]:0,h=i>>2,m=(i&3)<<4|l>>4;let y=(l&15)<<2|d>>6,x=d&63;c||(x=64,a||(y=64)),s.push(t[h],t[m],t[y],t[x])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Kc(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):cp(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const i=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const d=r<n.length?t[n.charAt(r)]:64;++r;const m=r<n.length?t[n.charAt(r)]:64;if(++r,i==null||l==null||d==null||m==null)throw new up;const y=i<<2|l>>4;if(s.push(y),d!==64){const x=l<<4&240|d>>2;if(s.push(x),m!==64){const A=d<<6&192|m;s.push(A)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class up extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const dp=function(n){const e=Kc(n);return Qc.encodeByteArray(e,!0)},Yc=function(n){return dp(n).replace(/\./g,"")},Jc=function(n){try{return Qc.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function hp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const pp=()=>hp().__FIREBASE_DEFAULTS__,fp=()=>{if(typeof process>"u"||typeof fl>"u")return;const n=fl.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},mp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Jc(n[1]);return e&&JSON.parse(e)},Nr=()=>{try{return lp()||pp()||fp()||mp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},gp=n=>{var e,t;return(t=(e=Nr())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Xc=()=>{var n;return(n=Nr())==null?void 0:n.config},Zc=n=>{var e;return(e=Nr())==null?void 0:e[`_${n}`]};/**
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
 */class yp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function Ee(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function bp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ee())}function vp(){var e;const n=(e=Nr())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function xp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function wp(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function _p(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ep(){const n=Ee();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function kp(){return!vp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ip(){try{return typeof indexedDB=="object"}catch{return!1}}function Tp(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var i;e(((i=r.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
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
 */const Ap="FirebaseError";class at extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Ap,Object.setPrototypeOf(this,at.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ys.prototype.create)}}class ys{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?Sp(i,s):"Error",l=`${this.serviceName}: ${a} (${r}).`;return new at(r,l,s)}}function Sp(n,e){return n.replace(Rp,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Rp=/\{\$([^}]+)}/g;function Cp(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Gt(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const i=n[r],a=e[r];if(ml(i)&&ml(a)){if(!Gt(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function ml(n){return n!==null&&typeof n=="object"}/**
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
 */function bs(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Pp(n,e){const t=new Dp(n,e);return t.subscribe.bind(t)}class Dp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Vp(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=Si),r.error===void 0&&(r.error=Si),r.complete===void 0&&(r.complete=Si);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Vp(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Si(){}/**
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
 */function Te(n){return n&&n._delegate?n._delegate:n}/**
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
 */function vs(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function eu(n){return(await fetch(n,{credentials:"include"})).ok}class Wt{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const zt="[DEFAULT]";/**
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
 */class Np{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new yp;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Lp(e))try{this.getOrInitializeService({instanceIdentifier:zt})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(e=zt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=zt){return this.instances.has(e)}getOptions(e=zt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[i,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(i);s===l&&a.resolve(r)}return r}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const i=this.instances.get(s);return i&&e(i,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Mp(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=zt){return this.component?this.component.multipleInstances?e:zt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Mp(n){return n===zt?void 0:n}function Lp(n){return n.instantiationMode==="EAGER"}/**
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
 */class $p{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Np(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var Q;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Q||(Q={}));const Op={debug:Q.DEBUG,verbose:Q.VERBOSE,info:Q.INFO,warn:Q.WARN,error:Q.ERROR,silent:Q.SILENT},Fp=Q.INFO,Up={[Q.DEBUG]:"log",[Q.VERBOSE]:"log",[Q.INFO]:"info",[Q.WARN]:"warn",[Q.ERROR]:"error"},Bp=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=Up[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class vo{constructor(e){this.name=e,this._logLevel=Fp,this._logHandler=Bp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Q))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Op[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Q.DEBUG,...e),this._logHandler(this,Q.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Q.VERBOSE,...e),this._logHandler(this,Q.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Q.INFO,...e),this._logHandler(this,Q.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Q.WARN,...e),this._logHandler(this,Q.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Q.ERROR,...e),this._logHandler(this,Q.ERROR,...e)}}const jp=(n,e)=>e.some(t=>n instanceof t);let gl,yl;function zp(){return gl||(gl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function qp(){return yl||(yl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const tu=new WeakMap,Hi=new WeakMap,nu=new WeakMap,Ri=new WeakMap,xo=new WeakMap;function Hp(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(_t(n.result)),r()},a=()=>{s(n.error),r()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&tu.set(t,n)}).catch(()=>{}),xo.set(e,n),e}function Gp(n){if(Hi.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});Hi.set(n,e)}let Gi={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Hi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||nu.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return _t(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Wp(n){Gi=n(Gi)}function Kp(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(Ci(this),e,...t);return nu.set(s,e.sort?e.sort():[e]),_t(s)}:qp().includes(n)?function(...e){return n.apply(Ci(this),e),_t(tu.get(this))}:function(...e){return _t(n.apply(Ci(this),e))}}function Qp(n){return typeof n=="function"?Kp(n):(n instanceof IDBTransaction&&Gp(n),jp(n,zp())?new Proxy(n,Gi):n)}function _t(n){if(n instanceof IDBRequest)return Hp(n);if(Ri.has(n))return Ri.get(n);const e=Qp(n);return e!==n&&(Ri.set(n,e),xo.set(e,n)),e}const Ci=n=>xo.get(n);function Yp(n,e,{blocked:t,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(n,e),l=_t(a);return s&&a.addEventListener("upgradeneeded",c=>{s(_t(a.result),c.oldVersion,c.newVersion,_t(a.transaction),c)}),t&&a.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Jp=["get","getKey","getAll","getAllKeys","count"],Xp=["put","add","delete","clear"],Pi=new Map;function bl(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Pi.get(e))return Pi.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=Xp.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Jp.includes(t)))return;const i=async function(a,...l){const c=this.transaction(a,r?"readwrite":"readonly");let d=c.store;return s&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),r&&c.done]))[0]};return Pi.set(e,i),i}Wp(n=>({...n,get:(e,t,s)=>bl(e,t)||n.get(e,t,s),has:(e,t)=>!!bl(e,t)||n.has(e,t)}));/**
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
 */class Zp{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ef(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function ef(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Wi="@firebase/app",vl="0.14.11";/**
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
 */const nt=new vo("@firebase/app"),tf="@firebase/app-compat",nf="@firebase/analytics-compat",sf="@firebase/analytics",rf="@firebase/app-check-compat",of="@firebase/app-check",af="@firebase/auth",lf="@firebase/auth-compat",cf="@firebase/database",uf="@firebase/data-connect",df="@firebase/database-compat",hf="@firebase/functions",pf="@firebase/functions-compat",ff="@firebase/installations",mf="@firebase/installations-compat",gf="@firebase/messaging",yf="@firebase/messaging-compat",bf="@firebase/performance",vf="@firebase/performance-compat",xf="@firebase/remote-config",wf="@firebase/remote-config-compat",_f="@firebase/storage",Ef="@firebase/storage-compat",kf="@firebase/firestore",If="@firebase/ai",Tf="@firebase/firestore-compat",Af="firebase",Sf="12.12.0";/**
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
 */const Ki="[DEFAULT]",Rf={[Wi]:"fire-core",[tf]:"fire-core-compat",[sf]:"fire-analytics",[nf]:"fire-analytics-compat",[of]:"fire-app-check",[rf]:"fire-app-check-compat",[af]:"fire-auth",[lf]:"fire-auth-compat",[cf]:"fire-rtdb",[uf]:"fire-data-connect",[df]:"fire-rtdb-compat",[hf]:"fire-fn",[pf]:"fire-fn-compat",[ff]:"fire-iid",[mf]:"fire-iid-compat",[gf]:"fire-fcm",[yf]:"fire-fcm-compat",[bf]:"fire-perf",[vf]:"fire-perf-compat",[xf]:"fire-rc",[wf]:"fire-rc-compat",[_f]:"fire-gcs",[Ef]:"fire-gcs-compat",[kf]:"fire-fst",[Tf]:"fire-fst-compat",[If]:"fire-vertex","fire-js":"fire-js",[Af]:"fire-js-all"};/**
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
 */const dr=new Map,Cf=new Map,Qi=new Map;function xl(n,e){try{n.container.addComponent(e)}catch(t){nt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function yn(n){const e=n.name;if(Qi.has(e))return nt.debug(`There were multiple attempts to register component ${e}.`),!1;Qi.set(e,n);for(const t of dr.values())xl(t,n);for(const t of Cf.values())xl(t,n);return!0}function wo(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Me(n){return n==null?!1:n.settings!==void 0}/**
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
 */const Pf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Et=new ys("app","Firebase",Pf);/**
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
 */class Df{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Wt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Et.create("app-deleted",{appName:this._name})}}/**
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
 */const Tn=Sf;function su(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s={name:Ki,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw Et.create("bad-app-name",{appName:String(r)});if(t||(t=Xc()),!t)throw Et.create("no-options");const i=dr.get(r);if(i){if(Gt(t,i.options)&&Gt(s,i.config))return i;throw Et.create("duplicate-app",{appName:r})}const a=new $p(r);for(const c of Qi.values())a.addComponent(c);const l=new Df(t,s,a);return dr.set(r,l),l}function Vf(n=Ki){const e=dr.get(n);if(!e&&n===Ki&&Xc())return su();if(!e)throw Et.create("no-app",{appName:n});return e}function kt(n,e,t){let s=Rf[n]??n;t&&(s+=`-${t}`);const r=s.match(/\s|\//),i=e.match(/\s|\//);if(r||i){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),nt.warn(a.join(" "));return}yn(new Wt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Nf="firebase-heartbeat-database",Mf=1,as="firebase-heartbeat-store";let Di=null;function ru(){return Di||(Di=Yp(Nf,Mf,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(as)}catch(t){console.warn(t)}}}}).catch(n=>{throw Et.create("idb-open",{originalErrorMessage:n.message})})),Di}async function Lf(n){try{const t=(await ru()).transaction(as),s=await t.objectStore(as).get(iu(n));return await t.done,s}catch(e){if(e instanceof at)nt.warn(e.message);else{const t=Et.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});nt.warn(t.message)}}}async function wl(n,e){try{const s=(await ru()).transaction(as,"readwrite");await s.objectStore(as).put(e,iu(n)),await s.done}catch(t){if(t instanceof at)nt.warn(t.message);else{const s=Et.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});nt.warn(s.message)}}}function iu(n){return`${n.name}!${n.options.appId}`}/**
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
 */const $f=1024,Of=30;class Ff{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Bf(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=_l();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats.length>Of){const a=jf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){nt.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=_l(),{heartbeatsToSend:s,unsentEntries:r}=Uf(this._heartbeatsCache.heartbeats),i=Yc(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return nt.warn(t),""}}}function _l(){return new Date().toISOString().substring(0,10)}function Uf(n,e=$f){const t=[];let s=n.slice();for(const r of n){const i=t.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),El(t)>e){i.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),El(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Bf{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ip()?Tp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Lf(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return wl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return wl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function El(n){return Yc(JSON.stringify({version:2,heartbeats:n})).length}function jf(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
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
 */function zf(n){yn(new Wt("platform-logger",e=>new Zp(e),"PRIVATE")),yn(new Wt("heartbeat",e=>new Ff(e),"PRIVATE")),kt(Wi,vl,n),kt(Wi,vl,"esm2020"),kt("fire-js","")}zf("");var qf="firebase",Hf="12.12.1";/**
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
 */kt(qf,Hf,"app");var kl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var It,ou;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,b){function w(){}w.prototype=b.prototype,_.F=b.prototype,_.prototype=new w,_.prototype.constructor=_,_.D=function(k,E,T){for(var v=Array(arguments.length-2),Ae=2;Ae<arguments.length;Ae++)v[Ae-2]=arguments[Ae];return b.prototype[E].apply(k,v)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(s,t),s.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(_,b,w){w||(w=0);const k=Array(16);if(typeof b=="string")for(var E=0;E<16;++E)k[E]=b.charCodeAt(w++)|b.charCodeAt(w++)<<8|b.charCodeAt(w++)<<16|b.charCodeAt(w++)<<24;else for(E=0;E<16;++E)k[E]=b[w++]|b[w++]<<8|b[w++]<<16|b[w++]<<24;b=_.g[0],w=_.g[1],E=_.g[2];let T=_.g[3],v;v=b+(T^w&(E^T))+k[0]+3614090360&4294967295,b=w+(v<<7&4294967295|v>>>25),v=T+(E^b&(w^E))+k[1]+3905402710&4294967295,T=b+(v<<12&4294967295|v>>>20),v=E+(w^T&(b^w))+k[2]+606105819&4294967295,E=T+(v<<17&4294967295|v>>>15),v=w+(b^E&(T^b))+k[3]+3250441966&4294967295,w=E+(v<<22&4294967295|v>>>10),v=b+(T^w&(E^T))+k[4]+4118548399&4294967295,b=w+(v<<7&4294967295|v>>>25),v=T+(E^b&(w^E))+k[5]+1200080426&4294967295,T=b+(v<<12&4294967295|v>>>20),v=E+(w^T&(b^w))+k[6]+2821735955&4294967295,E=T+(v<<17&4294967295|v>>>15),v=w+(b^E&(T^b))+k[7]+4249261313&4294967295,w=E+(v<<22&4294967295|v>>>10),v=b+(T^w&(E^T))+k[8]+1770035416&4294967295,b=w+(v<<7&4294967295|v>>>25),v=T+(E^b&(w^E))+k[9]+2336552879&4294967295,T=b+(v<<12&4294967295|v>>>20),v=E+(w^T&(b^w))+k[10]+4294925233&4294967295,E=T+(v<<17&4294967295|v>>>15),v=w+(b^E&(T^b))+k[11]+2304563134&4294967295,w=E+(v<<22&4294967295|v>>>10),v=b+(T^w&(E^T))+k[12]+1804603682&4294967295,b=w+(v<<7&4294967295|v>>>25),v=T+(E^b&(w^E))+k[13]+4254626195&4294967295,T=b+(v<<12&4294967295|v>>>20),v=E+(w^T&(b^w))+k[14]+2792965006&4294967295,E=T+(v<<17&4294967295|v>>>15),v=w+(b^E&(T^b))+k[15]+1236535329&4294967295,w=E+(v<<22&4294967295|v>>>10),v=b+(E^T&(w^E))+k[1]+4129170786&4294967295,b=w+(v<<5&4294967295|v>>>27),v=T+(w^E&(b^w))+k[6]+3225465664&4294967295,T=b+(v<<9&4294967295|v>>>23),v=E+(b^w&(T^b))+k[11]+643717713&4294967295,E=T+(v<<14&4294967295|v>>>18),v=w+(T^b&(E^T))+k[0]+3921069994&4294967295,w=E+(v<<20&4294967295|v>>>12),v=b+(E^T&(w^E))+k[5]+3593408605&4294967295,b=w+(v<<5&4294967295|v>>>27),v=T+(w^E&(b^w))+k[10]+38016083&4294967295,T=b+(v<<9&4294967295|v>>>23),v=E+(b^w&(T^b))+k[15]+3634488961&4294967295,E=T+(v<<14&4294967295|v>>>18),v=w+(T^b&(E^T))+k[4]+3889429448&4294967295,w=E+(v<<20&4294967295|v>>>12),v=b+(E^T&(w^E))+k[9]+568446438&4294967295,b=w+(v<<5&4294967295|v>>>27),v=T+(w^E&(b^w))+k[14]+3275163606&4294967295,T=b+(v<<9&4294967295|v>>>23),v=E+(b^w&(T^b))+k[3]+4107603335&4294967295,E=T+(v<<14&4294967295|v>>>18),v=w+(T^b&(E^T))+k[8]+1163531501&4294967295,w=E+(v<<20&4294967295|v>>>12),v=b+(E^T&(w^E))+k[13]+2850285829&4294967295,b=w+(v<<5&4294967295|v>>>27),v=T+(w^E&(b^w))+k[2]+4243563512&4294967295,T=b+(v<<9&4294967295|v>>>23),v=E+(b^w&(T^b))+k[7]+1735328473&4294967295,E=T+(v<<14&4294967295|v>>>18),v=w+(T^b&(E^T))+k[12]+2368359562&4294967295,w=E+(v<<20&4294967295|v>>>12),v=b+(w^E^T)+k[5]+4294588738&4294967295,b=w+(v<<4&4294967295|v>>>28),v=T+(b^w^E)+k[8]+2272392833&4294967295,T=b+(v<<11&4294967295|v>>>21),v=E+(T^b^w)+k[11]+1839030562&4294967295,E=T+(v<<16&4294967295|v>>>16),v=w+(E^T^b)+k[14]+4259657740&4294967295,w=E+(v<<23&4294967295|v>>>9),v=b+(w^E^T)+k[1]+2763975236&4294967295,b=w+(v<<4&4294967295|v>>>28),v=T+(b^w^E)+k[4]+1272893353&4294967295,T=b+(v<<11&4294967295|v>>>21),v=E+(T^b^w)+k[7]+4139469664&4294967295,E=T+(v<<16&4294967295|v>>>16),v=w+(E^T^b)+k[10]+3200236656&4294967295,w=E+(v<<23&4294967295|v>>>9),v=b+(w^E^T)+k[13]+681279174&4294967295,b=w+(v<<4&4294967295|v>>>28),v=T+(b^w^E)+k[0]+3936430074&4294967295,T=b+(v<<11&4294967295|v>>>21),v=E+(T^b^w)+k[3]+3572445317&4294967295,E=T+(v<<16&4294967295|v>>>16),v=w+(E^T^b)+k[6]+76029189&4294967295,w=E+(v<<23&4294967295|v>>>9),v=b+(w^E^T)+k[9]+3654602809&4294967295,b=w+(v<<4&4294967295|v>>>28),v=T+(b^w^E)+k[12]+3873151461&4294967295,T=b+(v<<11&4294967295|v>>>21),v=E+(T^b^w)+k[15]+530742520&4294967295,E=T+(v<<16&4294967295|v>>>16),v=w+(E^T^b)+k[2]+3299628645&4294967295,w=E+(v<<23&4294967295|v>>>9),v=b+(E^(w|~T))+k[0]+4096336452&4294967295,b=w+(v<<6&4294967295|v>>>26),v=T+(w^(b|~E))+k[7]+1126891415&4294967295,T=b+(v<<10&4294967295|v>>>22),v=E+(b^(T|~w))+k[14]+2878612391&4294967295,E=T+(v<<15&4294967295|v>>>17),v=w+(T^(E|~b))+k[5]+4237533241&4294967295,w=E+(v<<21&4294967295|v>>>11),v=b+(E^(w|~T))+k[12]+1700485571&4294967295,b=w+(v<<6&4294967295|v>>>26),v=T+(w^(b|~E))+k[3]+2399980690&4294967295,T=b+(v<<10&4294967295|v>>>22),v=E+(b^(T|~w))+k[10]+4293915773&4294967295,E=T+(v<<15&4294967295|v>>>17),v=w+(T^(E|~b))+k[1]+2240044497&4294967295,w=E+(v<<21&4294967295|v>>>11),v=b+(E^(w|~T))+k[8]+1873313359&4294967295,b=w+(v<<6&4294967295|v>>>26),v=T+(w^(b|~E))+k[15]+4264355552&4294967295,T=b+(v<<10&4294967295|v>>>22),v=E+(b^(T|~w))+k[6]+2734768916&4294967295,E=T+(v<<15&4294967295|v>>>17),v=w+(T^(E|~b))+k[13]+1309151649&4294967295,w=E+(v<<21&4294967295|v>>>11),v=b+(E^(w|~T))+k[4]+4149444226&4294967295,b=w+(v<<6&4294967295|v>>>26),v=T+(w^(b|~E))+k[11]+3174756917&4294967295,T=b+(v<<10&4294967295|v>>>22),v=E+(b^(T|~w))+k[2]+718787259&4294967295,E=T+(v<<15&4294967295|v>>>17),v=w+(T^(E|~b))+k[9]+3951481745&4294967295,_.g[0]=_.g[0]+b&4294967295,_.g[1]=_.g[1]+(E+(v<<21&4294967295|v>>>11))&4294967295,_.g[2]=_.g[2]+E&4294967295,_.g[3]=_.g[3]+T&4294967295}s.prototype.v=function(_,b){b===void 0&&(b=_.length);const w=b-this.blockSize,k=this.C;let E=this.h,T=0;for(;T<b;){if(E==0)for(;T<=w;)r(this,_,T),T+=this.blockSize;if(typeof _=="string"){for(;T<b;)if(k[E++]=_.charCodeAt(T++),E==this.blockSize){r(this,k),E=0;break}}else for(;T<b;)if(k[E++]=_[T++],E==this.blockSize){r(this,k),E=0;break}}this.h=E,this.o+=b},s.prototype.A=function(){var _=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);_[0]=128;for(var b=1;b<_.length-8;++b)_[b]=0;b=this.o*8;for(var w=_.length-8;w<_.length;++w)_[w]=b&255,b/=256;for(this.v(_),_=Array(16),b=0,w=0;w<4;++w)for(let k=0;k<32;k+=8)_[b++]=this.g[w]>>>k&255;return _};function i(_,b){var w=l;return Object.prototype.hasOwnProperty.call(w,_)?w[_]:w[_]=b(_)}function a(_,b){this.h=b;const w=[];let k=!0;for(let E=_.length-1;E>=0;E--){const T=_[E]|0;k&&T==b||(w[E]=T,k=!1)}this.g=w}var l={};function c(_){return-128<=_&&_<128?i(_,function(b){return new a([b|0],b<0?-1:0)}):new a([_|0],_<0?-1:0)}function d(_){if(isNaN(_)||!isFinite(_))return m;if(_<0)return C(d(-_));const b=[];let w=1;for(let k=0;_>=w;k++)b[k]=_/w|0,w*=4294967296;return new a(b,0)}function h(_,b){if(_.length==0)throw Error("number format error: empty string");if(b=b||10,b<2||36<b)throw Error("radix out of range: "+b);if(_.charAt(0)=="-")return C(h(_.substring(1),b));if(_.indexOf("-")>=0)throw Error('number format error: interior "-" character');const w=d(Math.pow(b,8));let k=m;for(let T=0;T<_.length;T+=8){var E=Math.min(8,_.length-T);const v=parseInt(_.substring(T,T+E),b);E<8?(E=d(Math.pow(b,E)),k=k.j(E).add(d(v))):(k=k.j(w),k=k.add(d(v)))}return k}var m=c(0),y=c(1),x=c(16777216);n=a.prototype,n.m=function(){if(S(this))return-C(this).m();let _=0,b=1;for(let w=0;w<this.g.length;w++){const k=this.i(w);_+=(k>=0?k:4294967296+k)*b,b*=4294967296}return _},n.toString=function(_){if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(A(this))return"0";if(S(this))return"-"+C(this).toString(_);const b=d(Math.pow(_,6));var w=this;let k="";for(;;){const E=q(w,b).g;w=N(w,E.j(b));let T=((w.g.length>0?w.g[0]:w.h)>>>0).toString(_);if(w=E,A(w))return T+k;for(;T.length<6;)T="0"+T;k=T+k}},n.i=function(_){return _<0?0:_<this.g.length?this.g[_]:this.h};function A(_){if(_.h!=0)return!1;for(let b=0;b<_.g.length;b++)if(_.g[b]!=0)return!1;return!0}function S(_){return _.h==-1}n.l=function(_){return _=N(this,_),S(_)?-1:A(_)?0:1};function C(_){const b=_.g.length,w=[];for(let k=0;k<b;k++)w[k]=~_.g[k];return new a(w,~_.h).add(y)}n.abs=function(){return S(this)?C(this):this},n.add=function(_){const b=Math.max(this.g.length,_.g.length),w=[];let k=0;for(let E=0;E<=b;E++){let T=k+(this.i(E)&65535)+(_.i(E)&65535),v=(T>>>16)+(this.i(E)>>>16)+(_.i(E)>>>16);k=v>>>16,T&=65535,v&=65535,w[E]=v<<16|T}return new a(w,w[w.length-1]&-2147483648?-1:0)};function N(_,b){return _.add(C(b))}n.j=function(_){if(A(this)||A(_))return m;if(S(this))return S(_)?C(this).j(C(_)):C(C(this).j(_));if(S(_))return C(this.j(C(_)));if(this.l(x)<0&&_.l(x)<0)return d(this.m()*_.m());const b=this.g.length+_.g.length,w=[];for(var k=0;k<2*b;k++)w[k]=0;for(k=0;k<this.g.length;k++)for(let E=0;E<_.g.length;E++){const T=this.i(k)>>>16,v=this.i(k)&65535,Ae=_.i(E)>>>16,$t=_.i(E)&65535;w[2*k+2*E]+=v*$t,L(w,2*k+2*E),w[2*k+2*E+1]+=T*$t,L(w,2*k+2*E+1),w[2*k+2*E+1]+=v*Ae,L(w,2*k+2*E+1),w[2*k+2*E+2]+=T*Ae,L(w,2*k+2*E+2)}for(_=0;_<b;_++)w[_]=w[2*_+1]<<16|w[2*_];for(_=b;_<2*b;_++)w[_]=0;return new a(w,0)};function L(_,b){for(;(_[b]&65535)!=_[b];)_[b+1]+=_[b]>>>16,_[b]&=65535,b++}function K(_,b){this.g=_,this.h=b}function q(_,b){if(A(b))throw Error("division by zero");if(A(_))return new K(m,m);if(S(_))return b=q(C(_),b),new K(C(b.g),C(b.h));if(S(b))return b=q(_,C(b)),new K(C(b.g),b.h);if(_.g.length>30){if(S(_)||S(b))throw Error("slowDivide_ only works with positive integers.");for(var w=y,k=b;k.l(_)<=0;)w=G(w),k=G(k);var E=X(w,1),T=X(k,1);for(k=X(k,2),w=X(w,2);!A(k);){var v=T.add(k);v.l(_)<=0&&(E=E.add(w),T=v),k=X(k,1),w=X(w,1)}return b=N(_,E.j(b)),new K(E,b)}for(E=m;_.l(b)>=0;){for(w=Math.max(1,Math.floor(_.m()/b.m())),k=Math.ceil(Math.log(w)/Math.LN2),k=k<=48?1:Math.pow(2,k-48),T=d(w),v=T.j(b);S(v)||v.l(_)>0;)w-=k,T=d(w),v=T.j(b);A(T)&&(T=y),E=E.add(T),_=N(_,v)}return new K(E,_)}n.B=function(_){return q(this,_).h},n.and=function(_){const b=Math.max(this.g.length,_.g.length),w=[];for(let k=0;k<b;k++)w[k]=this.i(k)&_.i(k);return new a(w,this.h&_.h)},n.or=function(_){const b=Math.max(this.g.length,_.g.length),w=[];for(let k=0;k<b;k++)w[k]=this.i(k)|_.i(k);return new a(w,this.h|_.h)},n.xor=function(_){const b=Math.max(this.g.length,_.g.length),w=[];for(let k=0;k<b;k++)w[k]=this.i(k)^_.i(k);return new a(w,this.h^_.h)};function G(_){const b=_.g.length+1,w=[];for(let k=0;k<b;k++)w[k]=_.i(k)<<1|_.i(k-1)>>>31;return new a(w,_.h)}function X(_,b){const w=b>>5;b%=32;const k=_.g.length-w,E=[];for(let T=0;T<k;T++)E[T]=b>0?_.i(T+w)>>>b|_.i(T+w+1)<<32-b:_.i(T+w);return new a(E,_.h)}s.prototype.digest=s.prototype.A,s.prototype.reset=s.prototype.u,s.prototype.update=s.prototype.v,ou=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=h,It=a}).apply(typeof kl<"u"?kl:typeof self<"u"?self:typeof window<"u"?window:{});var Hs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var au,Yn,lu,er,Yi,cu,uu,du;(function(){var n,e=Object.defineProperty;function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Hs=="object"&&Hs];for(var u=0;u<o.length;++u){var p=o[u];if(p&&p.Math==Math)return p}throw Error("Cannot find global object")}var s=t(this);function r(o,u){if(u)e:{var p=s;o=o.split(".");for(var g=0;g<o.length-1;g++){var I=o[g];if(!(I in p))break e;p=p[I]}o=o[o.length-1],g=p[o],u=u(g),u!=g&&u!=null&&e(p,o,{configurable:!0,writable:!0,value:u})}}r("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(o){return o||function(u){var p=[],g;for(g in u)Object.prototype.hasOwnProperty.call(u,g)&&p.push([g,u[g]]);return p}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function l(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function c(o,u,p){return o.call.apply(o.bind,arguments)}function d(o,u,p){return d=c,d.apply(null,arguments)}function h(o,u){var p=Array.prototype.slice.call(arguments,1);return function(){var g=p.slice();return g.push.apply(g,arguments),o.apply(this,g)}}function m(o,u){function p(){}p.prototype=u.prototype,o.Z=u.prototype,o.prototype=new p,o.prototype.constructor=o,o.Ob=function(g,I,R){for(var V=Array(arguments.length-2),W=2;W<arguments.length;W++)V[W-2]=arguments[W];return u.prototype[I].apply(g,V)}}var y=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function x(o){const u=o.length;if(u>0){const p=Array(u);for(let g=0;g<u;g++)p[g]=o[g];return p}return[]}function A(o,u){for(let g=1;g<arguments.length;g++){const I=arguments[g];var p=typeof I;if(p=p!="object"?p:I?Array.isArray(I)?"array":p:"null",p=="array"||p=="object"&&typeof I.length=="number"){p=o.length||0;const R=I.length||0;o.length=p+R;for(let V=0;V<R;V++)o[p+V]=I[V]}else o.push(I)}}class S{constructor(u,p){this.i=u,this.j=p,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function C(o){a.setTimeout(()=>{throw o},0)}function N(){var o=_;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class L{constructor(){this.h=this.g=null}add(u,p){const g=K.get();g.set(u,p),this.h?this.h.next=g:this.g=g,this.h=g}}var K=new S(()=>new q,o=>o.reset());class q{constructor(){this.next=this.g=this.h=null}set(u,p){this.h=u,this.g=p,this.next=null}reset(){this.next=this.g=this.h=null}}let G,X=!1,_=new L,b=()=>{const o=Promise.resolve(void 0);G=()=>{o.then(w)}};function w(){for(var o;o=N();){try{o.h.call(o.g)}catch(p){C(p)}var u=K;u.j(o),u.h<100&&(u.h++,o.next=u.g,u.g=o)}X=!1}function k(){this.u=this.u,this.C=this.C}k.prototype.u=!1,k.prototype.dispose=function(){this.u||(this.u=!0,this.N())},k.prototype[Symbol.dispose]=function(){this.dispose()},k.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var T=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const p=()=>{};a.addEventListener("test",p,u),a.removeEventListener("test",p,u)}catch{}return o})();function v(o){return/^[\s\xa0]*$/.test(o)}function Ae(o,u){E.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,u)}m(Ae,E),Ae.prototype.init=function(o,u){const p=this.type=o.type,g=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget,u||(p=="mouseover"?u=o.fromElement:p=="mouseout"&&(u=o.toElement)),this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Ae.Z.h.call(this)},Ae.prototype.h=function(){Ae.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var $t="closure_listenable_"+(Math.random()*1e6|0),Ch=0;function Ph(o,u,p,g,I){this.listener=o,this.proxy=null,this.src=u,this.type=p,this.capture=!!g,this.ha=I,this.key=++Ch,this.da=this.fa=!1}function Cs(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Ps(o,u,p){for(const g in o)u.call(p,o[g],g,o)}function Dh(o,u){for(const p in o)u.call(void 0,o[p],p,o)}function pa(o){const u={};for(const p in o)u[p]=o[p];return u}const fa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ma(o,u){let p,g;for(let I=1;I<arguments.length;I++){g=arguments[I];for(p in g)o[p]=g[p];for(let R=0;R<fa.length;R++)p=fa[R],Object.prototype.hasOwnProperty.call(g,p)&&(o[p]=g[p])}}function Ds(o){this.src=o,this.g={},this.h=0}Ds.prototype.add=function(o,u,p,g,I){const R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);const V=ii(o,u,g,I);return V>-1?(u=o[V],p||(u.fa=!1)):(u=new Ph(u,this.src,R,!!g,I),u.fa=p,o.push(u)),u};function ri(o,u){const p=u.type;if(p in o.g){var g=o.g[p],I=Array.prototype.indexOf.call(g,u,void 0),R;(R=I>=0)&&Array.prototype.splice.call(g,I,1),R&&(Cs(u),o.g[p].length==0&&(delete o.g[p],o.h--))}}function ii(o,u,p,g){for(let I=0;I<o.length;++I){const R=o[I];if(!R.da&&R.listener==u&&R.capture==!!p&&R.ha==g)return I}return-1}var oi="closure_lm_"+(Math.random()*1e6|0),ai={};function ga(o,u,p,g,I){if(Array.isArray(u)){for(let R=0;R<u.length;R++)ga(o,u[R],p,g,I);return null}return p=va(p),o&&o[$t]?o.J(u,p,l(g)?!!g.capture:!1,I):Vh(o,u,p,!1,g,I)}function Vh(o,u,p,g,I,R){if(!u)throw Error("Invalid event type");const V=l(I)?!!I.capture:!!I;let W=ci(o);if(W||(o[oi]=W=new Ds(o)),p=W.add(u,p,g,V,R),p.proxy)return p;if(g=Nh(),p.proxy=g,g.src=o,g.listener=p,o.addEventListener)T||(I=V),I===void 0&&(I=!1),o.addEventListener(u.toString(),g,I);else if(o.attachEvent)o.attachEvent(ba(u.toString()),g);else if(o.addListener&&o.removeListener)o.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return p}function Nh(){function o(p){return u.call(o.src,o.listener,p)}const u=Mh;return o}function ya(o,u,p,g,I){if(Array.isArray(u))for(var R=0;R<u.length;R++)ya(o,u[R],p,g,I);else g=l(g)?!!g.capture:!!g,p=va(p),o&&o[$t]?(o=o.i,R=String(u).toString(),R in o.g&&(u=o.g[R],p=ii(u,p,g,I),p>-1&&(Cs(u[p]),Array.prototype.splice.call(u,p,1),u.length==0&&(delete o.g[R],o.h--)))):o&&(o=ci(o))&&(u=o.g[u.toString()],o=-1,u&&(o=ii(u,p,g,I)),(p=o>-1?u[o]:null)&&li(p))}function li(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[$t])ri(u.i,o);else{var p=o.type,g=o.proxy;u.removeEventListener?u.removeEventListener(p,g,o.capture):u.detachEvent?u.detachEvent(ba(p),g):u.addListener&&u.removeListener&&u.removeListener(g),(p=ci(u))?(ri(p,o),p.h==0&&(p.src=null,u[oi]=null)):Cs(o)}}}function ba(o){return o in ai?ai[o]:ai[o]="on"+o}function Mh(o,u){if(o.da)o=!0;else{u=new Ae(u,this);const p=o.listener,g=o.ha||o.src;o.fa&&li(o),o=p.call(g,u)}return o}function ci(o){return o=o[oi],o instanceof Ds?o:null}var ui="__closure_events_fn_"+(Math.random()*1e9>>>0);function va(o){return typeof o=="function"?o:(o[ui]||(o[ui]=function(u){return o.handleEvent(u)}),o[ui])}function xe(){k.call(this),this.i=new Ds(this),this.M=this,this.G=null}m(xe,k),xe.prototype[$t]=!0,xe.prototype.removeEventListener=function(o,u,p,g){ya(this,o,u,p,g)};function ke(o,u){var p,g=o.G;if(g)for(p=[];g;g=g.G)p.push(g);if(o=o.M,g=u.type||u,typeof u=="string")u=new E(u,o);else if(u instanceof E)u.target=u.target||o;else{var I=u;u=new E(g,o),ma(u,I)}I=!0;let R,V;if(p)for(V=p.length-1;V>=0;V--)R=u.g=p[V],I=Vs(R,g,!0,u)&&I;if(R=u.g=o,I=Vs(R,g,!0,u)&&I,I=Vs(R,g,!1,u)&&I,p)for(V=0;V<p.length;V++)R=u.g=p[V],I=Vs(R,g,!1,u)&&I}xe.prototype.N=function(){if(xe.Z.N.call(this),this.i){var o=this.i;for(const u in o.g){const p=o.g[u];for(let g=0;g<p.length;g++)Cs(p[g]);delete o.g[u],o.h--}}this.G=null},xe.prototype.J=function(o,u,p,g){return this.i.add(String(o),u,!1,p,g)},xe.prototype.K=function(o,u,p,g){return this.i.add(String(o),u,!0,p,g)};function Vs(o,u,p,g){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();let I=!0;for(let R=0;R<u.length;++R){const V=u[R];if(V&&!V.da&&V.capture==p){const W=V.listener,pe=V.ha||V.src;V.fa&&ri(o.i,V),I=W.call(pe,g)!==!1&&I}}return I&&!g.defaultPrevented}function Lh(o,u){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=d(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(o,u||0)}function xa(o){o.g=Lh(()=>{o.g=null,o.i&&(o.i=!1,xa(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class $h extends k{constructor(u,p){super(),this.m=u,this.l=p,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:xa(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Vn(o){k.call(this),this.h=o,this.g={}}m(Vn,k);var wa=[];function _a(o){Ps(o.g,function(u,p){this.g.hasOwnProperty(p)&&li(u)},o),o.g={}}Vn.prototype.N=function(){Vn.Z.N.call(this),_a(this)},Vn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var di=a.JSON.stringify,Oh=a.JSON.parse,Fh=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function Ea(){}function ka(){}var Nn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function hi(){E.call(this,"d")}m(hi,E);function pi(){E.call(this,"c")}m(pi,E);var Ot={},Ia=null;function Ns(){return Ia=Ia||new xe}Ot.Ia="serverreachability";function Ta(o){E.call(this,Ot.Ia,o)}m(Ta,E);function Mn(o){const u=Ns();ke(u,new Ta(u))}Ot.STAT_EVENT="statevent";function Aa(o,u){E.call(this,Ot.STAT_EVENT,o),this.stat=u}m(Aa,E);function Ie(o){const u=Ns();ke(u,new Aa(u,o))}Ot.Ja="timingevent";function Sa(o,u){E.call(this,Ot.Ja,o),this.size=u}m(Sa,E);function Ln(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},u)}function $n(){this.g=!0}$n.prototype.ua=function(){this.g=!1};function Uh(o,u,p,g,I,R){o.info(function(){if(o.g)if(R){var V="",W=R.split("&");for(let te=0;te<W.length;te++){var pe=W[te].split("=");if(pe.length>1){const me=pe[0];pe=pe[1];const je=me.split("_");V=je.length>=2&&je[1]=="type"?V+(me+"="+pe+"&"):V+(me+"=redacted&")}}}else V=null;else V=R;return"XMLHTTP REQ ("+g+") [attempt "+I+"]: "+u+`
`+p+`
`+V})}function Bh(o,u,p,g,I,R,V){o.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+I+"]: "+u+`
`+p+`
`+R+" "+V})}function en(o,u,p,g){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+zh(o,p)+(g?" "+g:"")})}function jh(o,u){o.info(function(){return"TIMEOUT: "+u})}$n.prototype.info=function(){};function zh(o,u){if(!o.g)return u;if(!u)return null;try{const R=JSON.parse(u);if(R){for(o=0;o<R.length;o++)if(Array.isArray(R[o])){var p=R[o];if(!(p.length<2)){var g=p[1];if(Array.isArray(g)&&!(g.length<1)){var I=g[0];if(I!="noop"&&I!="stop"&&I!="close")for(let V=1;V<g.length;V++)g[V]=""}}}}return di(R)}catch{return u}}var Ms={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Ra={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Ca;function fi(){}m(fi,Ea),fi.prototype.g=function(){return new XMLHttpRequest},Ca=new fi;function On(o){return encodeURIComponent(String(o))}function qh(o){var u=1;o=o.split(":");const p=[];for(;u>0&&o.length;)p.push(o.shift()),u--;return o.length&&p.push(o.join(":")),p}function lt(o,u,p,g){this.j=o,this.i=u,this.l=p,this.S=g||1,this.V=new Vn(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Pa}function Pa(){this.i=null,this.g="",this.h=!1}var Da={},mi={};function gi(o,u,p){o.M=1,o.A=$s(Be(u)),o.u=p,o.R=!0,Va(o,null)}function Va(o,u){o.F=Date.now(),Ls(o),o.B=Be(o.A);var p=o.B,g=o.S;Array.isArray(g)||(g=[String(g)]),Ga(p.i,"t",g),o.C=0,p=o.j.L,o.h=new Pa,o.g=ul(o.j,p?u:null,!o.u),o.P>0&&(o.O=new $h(d(o.Y,o,o.g),o.P)),u=o.V,p=o.g,g=o.ba;var I="readystatechange";Array.isArray(I)||(I&&(wa[0]=I.toString()),I=wa);for(let R=0;R<I.length;R++){const V=ga(p,I[R],g||u.handleEvent,!1,u.h||u);if(!V)break;u.g[V.key]=V}u=o.J?pa(o.J):{},o.u?(o.v||(o.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,u)):(o.v="GET",o.g.ea(o.B,o.v,null,u)),Mn(),Uh(o.i,o.v,o.B,o.l,o.S,o.u)}lt.prototype.ba=function(o){o=o.target;const u=this.O;u&&dt(o)==3?u.j():this.Y(o)},lt.prototype.Y=function(o){try{if(o==this.g)e:{const W=dt(this.g),pe=this.g.ya(),te=this.g.ca();if(!(W<3)&&(W!=3||this.g&&(this.h.h||this.g.la()||Za(this.g)))){this.K||W!=4||pe==7||(pe==8||te<=0?Mn(3):Mn(2)),yi(this);var u=this.g.ca();this.X=u;var p=Hh(this);if(this.o=u==200,Bh(this.i,this.v,this.B,this.l,this.S,W,u),this.o){if(this.U&&!this.L){t:{if(this.g){var g,I=this.g;if((g=I.g?I.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!v(g)){var R=g;break t}}R=null}if(o=R)en(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,bi(this,o);else{this.o=!1,this.m=3,Ie(12),Ft(this),Fn(this);break e}}if(this.R){o=!0;let me;for(;!this.K&&this.C<p.length;)if(me=Gh(this,p),me==mi){W==4&&(this.m=4,Ie(14),o=!1),en(this.i,this.l,null,"[Incomplete Response]");break}else if(me==Da){this.m=4,Ie(15),en(this.i,this.l,p,"[Invalid Chunk]"),o=!1;break}else en(this.i,this.l,me,null),bi(this,me);if(Na(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),W!=4||p.length!=0||this.h.h||(this.m=1,Ie(16),o=!1),this.o=this.o&&o,!o)en(this.i,this.l,p,"[Invalid Chunked Response]"),Ft(this),Fn(this);else if(p.length>0&&!this.W){this.W=!0;var V=this.j;V.g==this&&V.aa&&!V.P&&(V.j.info("Great, no buffering proxy detected. Bytes received: "+p.length),Ti(V),V.P=!0,Ie(11))}}else en(this.i,this.l,p,null),bi(this,p);W==4&&Ft(this),this.o&&!this.K&&(W==4?ol(this.j,this):(this.o=!1,Ls(this)))}else op(this.g),u==400&&p.indexOf("Unknown SID")>0?(this.m=3,Ie(12)):(this.m=0,Ie(13)),Ft(this),Fn(this)}}}catch{}finally{}};function Hh(o){if(!Na(o))return o.g.la();const u=Za(o.g);if(u==="")return"";let p="";const g=u.length,I=dt(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return Ft(o),Fn(o),"";o.h.i=new a.TextDecoder}for(let R=0;R<g;R++)o.h.h=!0,p+=o.h.i.decode(u[R],{stream:!(I&&R==g-1)});return u.length=0,o.h.g+=p,o.C=0,o.h.g}function Na(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function Gh(o,u){var p=o.C,g=u.indexOf(`
`,p);return g==-1?mi:(p=Number(u.substring(p,g)),isNaN(p)?Da:(g+=1,g+p>u.length?mi:(u=u.slice(g,g+p),o.C=g+p,u)))}lt.prototype.cancel=function(){this.K=!0,Ft(this)};function Ls(o){o.T=Date.now()+o.H,Ma(o,o.H)}function Ma(o,u){if(o.D!=null)throw Error("WatchDog timer not null");o.D=Ln(d(o.aa,o),u)}function yi(o){o.D&&(a.clearTimeout(o.D),o.D=null)}lt.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(jh(this.i,this.B),this.M!=2&&(Mn(),Ie(17)),Ft(this),this.m=2,Fn(this)):Ma(this,this.T-o)};function Fn(o){o.j.I==0||o.K||ol(o.j,o)}function Ft(o){yi(o);var u=o.O;u&&typeof u.dispose=="function"&&u.dispose(),o.O=null,_a(o.V),o.g&&(u=o.g,o.g=null,u.abort(),u.dispose())}function bi(o,u){try{var p=o.j;if(p.I!=0&&(p.g==o||vi(p.h,o))){if(!o.L&&vi(p.h,o)&&p.I==3){try{var g=p.Ba.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var I=g;if(I[0]==0){e:if(!p.v){if(p.g)if(p.g.F+3e3<o.F)js(p),Us(p);else break e;Ii(p),Ie(18)}}else p.xa=I[1],0<p.xa-p.K&&I[2]<37500&&p.F&&p.A==0&&!p.C&&(p.C=Ln(d(p.Va,p),6e3));Oa(p.h)<=1&&p.ta&&(p.ta=void 0)}else Bt(p,11)}else if((o.L||p.g==o)&&js(p),!v(u))for(I=p.Ba.g.parse(u),u=0;u<I.length;u++){let te=I[u];const me=te[0];if(!(me<=p.K))if(p.K=me,te=te[1],p.I==2)if(te[0]=="c"){p.M=te[1],p.ba=te[2];const je=te[3];je!=null&&(p.ka=je,p.j.info("VER="+p.ka));const jt=te[4];jt!=null&&(p.za=jt,p.j.info("SVER="+p.za));const ht=te[5];ht!=null&&typeof ht=="number"&&ht>0&&(g=1.5*ht,p.O=g,p.j.info("backChannelRequestTimeoutMs_="+g)),g=p;const pt=o.g;if(pt){const qs=pt.g?pt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(qs){var R=g.h;R.g||qs.indexOf("spdy")==-1&&qs.indexOf("quic")==-1&&qs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(xi(R,R.h),R.h=null))}if(g.G){const Ai=pt.g?pt.g.getResponseHeader("X-HTTP-Session-Id"):null;Ai&&(g.wa=Ai,se(g.J,g.G,Ai))}}p.I=3,p.l&&p.l.ra(),p.aa&&(p.T=Date.now()-o.F,p.j.info("Handshake RTT: "+p.T+"ms")),g=p;var V=o;if(g.na=cl(g,g.L?g.ba:null,g.W),V.L){Fa(g.h,V);var W=V,pe=g.O;pe&&(W.H=pe),W.D&&(yi(W),Ls(W)),g.g=V}else rl(g);p.i.length>0&&Bs(p)}else te[0]!="stop"&&te[0]!="close"||Bt(p,7);else p.I==3&&(te[0]=="stop"||te[0]=="close"?te[0]=="stop"?Bt(p,7):ki(p):te[0]!="noop"&&p.l&&p.l.qa(te),p.A=0)}}Mn(4)}catch{}}var Wh=class{constructor(o,u){this.g=o,this.map=u}};function La(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function $a(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Oa(o){return o.h?1:o.g?o.g.size:0}function vi(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function xi(o,u){o.g?o.g.add(u):o.h=u}function Fa(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}La.prototype.cancel=function(){if(this.i=Ua(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Ua(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const p of o.g.values())u=u.concat(p.G);return u}return x(o.i)}var Ba=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Kh(o,u){if(o){o=o.split("&");for(let p=0;p<o.length;p++){const g=o[p].indexOf("=");let I,R=null;g>=0?(I=o[p].substring(0,g),R=o[p].substring(g+1)):I=o[p],u(I,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function ct(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;o instanceof ct?(this.l=o.l,Un(this,o.j),this.o=o.o,this.g=o.g,Bn(this,o.u),this.h=o.h,wi(this,Wa(o.i)),this.m=o.m):o&&(u=String(o).match(Ba))?(this.l=!1,Un(this,u[1]||"",!0),this.o=jn(u[2]||""),this.g=jn(u[3]||"",!0),Bn(this,u[4]),this.h=jn(u[5]||"",!0),wi(this,u[6]||"",!0),this.m=jn(u[7]||"")):(this.l=!1,this.i=new qn(null,this.l))}ct.prototype.toString=function(){const o=[];var u=this.j;u&&o.push(zn(u,ja,!0),":");var p=this.g;return(p||u=="file")&&(o.push("//"),(u=this.o)&&o.push(zn(u,ja,!0),"@"),o.push(On(p).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),p=this.u,p!=null&&o.push(":",String(p))),(p=this.h)&&(this.g&&p.charAt(0)!="/"&&o.push("/"),o.push(zn(p,p.charAt(0)=="/"?Jh:Yh,!0))),(p=this.i.toString())&&o.push("?",p),(p=this.m)&&o.push("#",zn(p,Zh)),o.join("")},ct.prototype.resolve=function(o){const u=Be(this);let p=!!o.j;p?Un(u,o.j):p=!!o.o,p?u.o=o.o:p=!!o.g,p?u.g=o.g:p=o.u!=null;var g=o.h;if(p)Bn(u,o.u);else if(p=!!o.h){if(g.charAt(0)!="/")if(this.g&&!this.h)g="/"+g;else{var I=u.h.lastIndexOf("/");I!=-1&&(g=u.h.slice(0,I+1)+g)}if(I=g,I==".."||I==".")g="";else if(I.indexOf("./")!=-1||I.indexOf("/.")!=-1){g=I.lastIndexOf("/",0)==0,I=I.split("/");const R=[];for(let V=0;V<I.length;){const W=I[V++];W=="."?g&&V==I.length&&R.push(""):W==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),g&&V==I.length&&R.push("")):(R.push(W),g=!0)}g=R.join("/")}else g=I}return p?u.h=g:p=o.i.toString()!=="",p?wi(u,Wa(o.i)):p=!!o.m,p&&(u.m=o.m),u};function Be(o){return new ct(o)}function Un(o,u,p){o.j=p?jn(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Bn(o,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);o.u=u}else o.u=null}function wi(o,u,p){u instanceof qn?(o.i=u,ep(o.i,o.l)):(p||(u=zn(u,Xh)),o.i=new qn(u,o.l))}function se(o,u,p){o.i.set(u,p)}function $s(o){return se(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function jn(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function zn(o,u,p){return typeof o=="string"?(o=encodeURI(o).replace(u,Qh),p&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Qh(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var ja=/[#\/\?@]/g,Yh=/[#\?:]/g,Jh=/[#\?]/g,Xh=/[#\?@]/g,Zh=/#/g;function qn(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Ut(o){o.g||(o.g=new Map,o.h=0,o.i&&Kh(o.i,function(u,p){o.add(decodeURIComponent(u.replace(/\+/g," ")),p)}))}n=qn.prototype,n.add=function(o,u){Ut(this),this.i=null,o=tn(this,o);let p=this.g.get(o);return p||this.g.set(o,p=[]),p.push(u),this.h+=1,this};function za(o,u){Ut(o),u=tn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function qa(o,u){return Ut(o),u=tn(o,u),o.g.has(u)}n.forEach=function(o,u){Ut(this),this.g.forEach(function(p,g){p.forEach(function(I){o.call(u,I,g,this)},this)},this)};function Ha(o,u){Ut(o);let p=[];if(typeof u=="string")qa(o,u)&&(p=p.concat(o.g.get(tn(o,u))));else for(o=Array.from(o.g.values()),u=0;u<o.length;u++)p=p.concat(o[u]);return p}n.set=function(o,u){return Ut(this),this.i=null,o=tn(this,o),qa(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=Ha(this,o),o.length>0?String(o[0]):u):u};function Ga(o,u,p){za(o,u),p.length>0&&(o.i=null,o.g.set(tn(o,u),x(p)),o.h+=p.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(let g=0;g<u.length;g++){var p=u[g];const I=On(p);p=Ha(this,p);for(let R=0;R<p.length;R++){let V=I;p[R]!==""&&(V+="="+On(p[R])),o.push(V)}}return this.i=o.join("&")};function Wa(o){const u=new qn;return u.i=o.i,o.g&&(u.g=new Map(o.g),u.h=o.h),u}function tn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function ep(o,u){u&&!o.j&&(Ut(o),o.i=null,o.g.forEach(function(p,g){const I=g.toLowerCase();g!=I&&(za(this,g),Ga(this,I,p))},o)),o.j=u}function tp(o,u){const p=new $n;if(a.Image){const g=new Image;g.onload=h(ut,p,"TestLoadImage: loaded",!0,u,g),g.onerror=h(ut,p,"TestLoadImage: error",!1,u,g),g.onabort=h(ut,p,"TestLoadImage: abort",!1,u,g),g.ontimeout=h(ut,p,"TestLoadImage: timeout",!1,u,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=o}else u(!1)}function np(o,u){const p=new $n,g=new AbortController,I=setTimeout(()=>{g.abort(),ut(p,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:g.signal}).then(R=>{clearTimeout(I),R.ok?ut(p,"TestPingServer: ok",!0,u):ut(p,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(I),ut(p,"TestPingServer: error",!1,u)})}function ut(o,u,p,g,I){try{I&&(I.onload=null,I.onerror=null,I.onabort=null,I.ontimeout=null),g(p)}catch{}}function sp(){this.g=new Fh}function _i(o){this.i=o.Sb||null,this.h=o.ab||!1}m(_i,Ea),_i.prototype.g=function(){return new Os(this.i,this.h)};function Os(o,u){xe.call(this),this.H=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Os,xe),n=Os.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=u,this.readyState=1,Gn(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(u.body=o),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Hn(this)),this.readyState=0},n.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Gn(this)),this.g&&(this.readyState=3,Gn(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ka(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ka(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}n.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Hn(this):Gn(this),this.readyState==3&&Ka(this)}},n.Oa=function(o){this.g&&(this.response=this.responseText=o,Hn(this))},n.Na=function(o){this.g&&(this.response=o,Hn(this))},n.ga=function(){this.g&&Hn(this)};function Hn(o){o.readyState=4,o.l=null,o.j=null,o.B=null,Gn(o)}n.setRequestHeader=function(o,u){this.A.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var p=u.next();!p.done;)p=p.value,o.push(p[0]+": "+p[1]),p=u.next();return o.join(`\r
`)};function Gn(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Os.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Qa(o){let u="";return Ps(o,function(p,g){u+=g,u+=":",u+=p,u+=`\r
`}),u}function Ei(o,u,p){e:{for(g in p){var g=!1;break e}g=!0}g||(p=Qa(p),typeof o=="string"?p!=null&&On(p):se(o,u,p))}function oe(o){xe.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(oe,xe);var rp=/^https?$/i,ip=["POST","PUT"];n=oe.prototype,n.Fa=function(o){this.H=o},n.ea=function(o,u,p,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ca.g(),this.g.onreadystatechange=y(d(this.Ca,this));try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(R){Ya(this,R);return}if(o=p||"",p=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var I in g)p.set(I,g[I]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const R of g.keys())p.set(R,g.get(R));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(p.keys()).find(R=>R.toLowerCase()=="content-type"),I=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(ip,u,void 0)>=0)||g||I||p.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,V]of p)this.g.setRequestHeader(R,V);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(R){Ya(this,R)}};function Ya(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.o=5,Ja(o),Fs(o)}function Ja(o){o.A||(o.A=!0,ke(o,"complete"),ke(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,ke(this,"complete"),ke(this,"abort"),Fs(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Fs(this,!0)),oe.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Xa(this):this.Xa())},n.Xa=function(){Xa(this)};function Xa(o){if(o.h&&typeof i<"u"){if(o.v&&dt(o)==4)setTimeout(o.Ca.bind(o),0);else if(ke(o,"readystatechange"),dt(o)==4){o.h=!1;try{const R=o.ca();e:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var p;if(!(p=u)){var g;if(g=R===0){let V=String(o.D).match(Ba)[1]||null;!V&&a.self&&a.self.location&&(V=a.self.location.protocol.slice(0,-1)),g=!rp.test(V?V.toLowerCase():"")}p=g}if(p)ke(o,"complete"),ke(o,"success");else{o.o=6;try{var I=dt(o)>2?o.g.statusText:""}catch{I=""}o.l=I+" ["+o.ca()+"]",Ja(o)}}finally{Fs(o)}}}}function Fs(o,u){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const p=o.g;o.g=null,u||ke(o,"ready");try{p.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function dt(o){return o.g?o.g.readyState:0}n.ca=function(){try{return dt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Oh(u)}};function Za(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function op(o){const u={};o=(o.g&&dt(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<o.length;g++){if(v(o[g]))continue;var p=qh(o[g]);const I=p[0];if(p=p[1],typeof p!="string")continue;p=p.trim();const R=u[I]||[];u[I]=R,R.push(p)}Dh(u,function(g){return g.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Wn(o,u,p){return p&&p.internalChannelParams&&p.internalChannelParams[o]||u}function el(o){this.za=0,this.i=[],this.j=new $n,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Wn("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Wn("baseRetryDelayMs",5e3,o),this.Za=Wn("retryDelaySeedMs",1e4,o),this.Ta=Wn("forwardChannelMaxRetries",2,o),this.va=Wn("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new La(o&&o.concurrentRequestLimit),this.Ba=new sp,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=el.prototype,n.ka=8,n.I=1,n.connect=function(o,u,p,g){Ie(0),this.W=o,this.H=u||{},p&&g!==void 0&&(this.H.OSID=p,this.H.OAID=g),this.F=this.X,this.J=cl(this,null,this.W),Bs(this)};function ki(o){if(tl(o),o.I==3){var u=o.V++,p=Be(o.J);if(se(p,"SID",o.M),se(p,"RID",u),se(p,"TYPE","terminate"),Kn(o,p),u=new lt(o,o.j,u),u.M=2,u.A=$s(Be(p)),p=!1,a.navigator&&a.navigator.sendBeacon)try{p=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!p&&a.Image&&(new Image().src=u.A,p=!0),p||(u.g=ul(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Ls(u)}ll(o)}function Us(o){o.g&&(Ti(o),o.g.cancel(),o.g=null)}function tl(o){Us(o),o.v&&(a.clearTimeout(o.v),o.v=null),js(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function Bs(o){if(!$a(o.h)&&!o.m){o.m=!0;var u=o.Ea;G||b(),X||(G(),X=!0),_.add(u,o),o.D=0}}function ap(o,u){return Oa(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=u.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=Ln(d(o.Ea,o,u),al(o,o.D)),o.D++,!0)}n.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const I=new lt(this,this.j,o);let R=this.o;if(this.U&&(R?(R=pa(R),ma(R,this.U)):R=this.U),this.u!==null||this.R||(I.J=R,R=null),this.S)e:{for(var u=0,p=0;p<this.i.length;p++){t:{var g=this.i[p];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,u>4096){u=p;break e}if(u===4096||p===this.i.length-1){u=p+1;break e}}u=1e3}else u=1e3;u=sl(this,I,u),p=Be(this.J),se(p,"RID",o),se(p,"CVER",22),this.G&&se(p,"X-HTTP-Session-Id",this.G),Kn(this,p),R&&(this.R?u="headers="+On(Qa(R))+"&"+u:this.u&&Ei(p,this.u,R)),xi(this.h,I),this.Ra&&se(p,"TYPE","init"),this.S?(se(p,"$req",u),se(p,"SID","null"),I.U=!0,gi(I,p,null)):gi(I,p,u),this.I=2}}else this.I==3&&(o?nl(this,o):this.i.length==0||$a(this.h)||nl(this))};function nl(o,u){var p;u?p=u.l:p=o.V++;const g=Be(o.J);se(g,"SID",o.M),se(g,"RID",p),se(g,"AID",o.K),Kn(o,g),o.u&&o.o&&Ei(g,o.u,o.o),p=new lt(o,o.j,p,o.D+1),o.u===null&&(p.J=o.o),u&&(o.i=u.G.concat(o.i)),u=sl(o,p,1e3),p.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),xi(o.h,p),gi(p,g,u)}function Kn(o,u){o.H&&Ps(o.H,function(p,g){se(u,g,p)}),o.l&&Ps({},function(p,g){se(u,g,p)})}function sl(o,u,p){p=Math.min(o.i.length,p);const g=o.l?d(o.l.Ka,o.l,o):null;e:{var I=o.i;let W=-1;for(;;){const pe=["count="+p];W==-1?p>0?(W=I[0].g,pe.push("ofs="+W)):W=0:pe.push("ofs="+W);let te=!0;for(let me=0;me<p;me++){var R=I[me].g;const je=I[me].map;if(R-=W,R<0)W=Math.max(0,I[me].g-100),te=!1;else try{R="req"+R+"_"||"";try{var V=je instanceof Map?je:Object.entries(je);for(const[jt,ht]of V){let pt=ht;l(ht)&&(pt=di(ht)),pe.push(R+jt+"="+encodeURIComponent(pt))}}catch(jt){throw pe.push(R+"type="+encodeURIComponent("_badmap")),jt}}catch{g&&g(je)}}if(te){V=pe.join("&");break e}}V=void 0}return o=o.i.splice(0,p),u.G=o,V}function rl(o){if(!o.g&&!o.v){o.Y=1;var u=o.Da;G||b(),X||(G(),X=!0),_.add(u,o),o.A=0}}function Ii(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=Ln(d(o.Da,o),al(o,o.A)),o.A++,!0)}n.Da=function(){if(this.v=null,il(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=Ln(d(this.Wa,this),o)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Ie(10),Us(this),il(this))};function Ti(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function il(o){o.g=new lt(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var u=Be(o.na);se(u,"RID","rpc"),se(u,"SID",o.M),se(u,"AID",o.K),se(u,"CI",o.F?"0":"1"),!o.F&&o.ia&&se(u,"TO",o.ia),se(u,"TYPE","xmlhttp"),Kn(o,u),o.u&&o.o&&Ei(u,o.u,o.o),o.O&&(o.g.H=o.O);var p=o.g;o=o.ba,p.M=1,p.A=$s(Be(u)),p.u=null,p.R=!0,Va(p,o)}n.Va=function(){this.C!=null&&(this.C=null,Us(this),Ii(this),Ie(19))};function js(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function ol(o,u){var p=null;if(o.g==u){js(o),Ti(o),o.g=null;var g=2}else if(vi(o.h,u))p=u.G,Fa(o.h,u),g=1;else return;if(o.I!=0){if(u.o)if(g==1){p=u.u?u.u.length:0,u=Date.now()-u.F;var I=o.D;g=Ns(),ke(g,new Sa(g,p)),Bs(o)}else rl(o);else if(I=u.m,I==3||I==0&&u.X>0||!(g==1&&ap(o,u)||g==2&&Ii(o)))switch(p&&p.length>0&&(u=o.h,u.i=u.i.concat(p)),I){case 1:Bt(o,5);break;case 4:Bt(o,10);break;case 3:Bt(o,6);break;default:Bt(o,2)}}}function al(o,u){let p=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(p*=2),p*u}function Bt(o,u){if(o.j.info("Error code "+u),u==2){var p=d(o.bb,o),g=o.Ua;const I=!g;g=new ct(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Un(g,"https"),$s(g),I?tp(g.toString(),p):np(g.toString(),p)}else Ie(2);o.I=0,o.l&&o.l.pa(u),ll(o),tl(o)}n.bb=function(o){o?(this.j.info("Successfully pinged google.com"),Ie(2)):(this.j.info("Failed to ping google.com"),Ie(1))};function ll(o){if(o.I=0,o.ja=[],o.l){const u=Ua(o.h);(u.length!=0||o.i.length!=0)&&(A(o.ja,u),A(o.ja,o.i),o.h.i.length=0,x(o.i),o.i.length=0),o.l.oa()}}function cl(o,u,p){var g=p instanceof ct?Be(p):new ct(p);if(g.g!="")u&&(g.g=u+"."+g.g),Bn(g,g.u);else{var I=a.location;g=I.protocol,u=u?u+"."+I.hostname:I.hostname,I=+I.port;const R=new ct(null);g&&Un(R,g),u&&(R.g=u),I&&Bn(R,I),p&&(R.h=p),g=R}return p=o.G,u=o.wa,p&&u&&se(g,p,u),se(g,"VER",o.ka),Kn(o,g),g}function ul(o,u,p){if(u&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Aa&&!o.ma?new oe(new _i({ab:p})):new oe(o.ma),u.Fa(o.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function dl(){}n=dl.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function zs(){}zs.prototype.g=function(o,u){return new Pe(o,u)};function Pe(o,u){xe.call(this),this.g=new el(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(o?o["X-WebChannel-Client-Profile"]=u.sa:o={"X-WebChannel-Client-Profile":u.sa}),this.g.U=o,(o=u&&u.Qb)&&!v(o)&&(this.g.u=o),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!v(u)&&(this.g.G=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new nn(this)}m(Pe,xe),Pe.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Pe.prototype.close=function(){ki(this.g)},Pe.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var p={};p.__data__=o,o=p}else this.v&&(p={},p.__data__=di(o),o=p);u.i.push(new Wh(u.Ya++,o)),u.I==3&&Bs(u)},Pe.prototype.N=function(){this.g.l=null,delete this.j,ki(this.g),delete this.g,Pe.Z.N.call(this)};function hl(o){hi.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const p in u){o=p;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}m(hl,hi);function pl(){pi.call(this),this.status=1}m(pl,pi);function nn(o){this.g=o}m(nn,dl),nn.prototype.ra=function(){ke(this.g,"a")},nn.prototype.qa=function(o){ke(this.g,new hl(o))},nn.prototype.pa=function(o){ke(this.g,new pl)},nn.prototype.oa=function(){ke(this.g,"b")},zs.prototype.createWebChannel=zs.prototype.g,Pe.prototype.send=Pe.prototype.o,Pe.prototype.open=Pe.prototype.m,Pe.prototype.close=Pe.prototype.close,du=function(){return new zs},uu=function(){return Ns()},cu=Ot,Yi={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ms.NO_ERROR=0,Ms.TIMEOUT=8,Ms.HTTP_ERROR=6,er=Ms,Ra.COMPLETE="complete",lu=Ra,ka.EventType=Nn,Nn.OPEN="a",Nn.CLOSE="b",Nn.ERROR="c",Nn.MESSAGE="d",xe.prototype.listen=xe.prototype.J,Yn=ka,oe.prototype.listenOnce=oe.prototype.K,oe.prototype.getLastError=oe.prototype.Ha,oe.prototype.getLastErrorCode=oe.prototype.ya,oe.prototype.getStatus=oe.prototype.ca,oe.prototype.getResponseJson=oe.prototype.La,oe.prototype.getResponseText=oe.prototype.la,oe.prototype.send=oe.prototype.ea,oe.prototype.setWithCredentials=oe.prototype.Fa,au=oe}).apply(typeof Hs<"u"?Hs:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */class Se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Se.UNAUTHENTICATED=new Se(null),Se.GOOGLE_CREDENTIALS=new Se("google-credentials-uid"),Se.FIRST_PARTY=new Se("first-party-uid"),Se.MOCK_USER=new Se("mock-user");/**
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
 */let An="12.12.0";function Gf(n){An=n}/**
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
 */const Kt=new vo("@firebase/firestore");function on(){return Kt.logLevel}function $(n,...e){if(Kt.logLevel<=Q.DEBUG){const t=e.map(_o);Kt.debug(`Firestore (${An}): ${n}`,...t)}}function st(n,...e){if(Kt.logLevel<=Q.ERROR){const t=e.map(_o);Kt.error(`Firestore (${An}): ${n}`,...t)}}function bn(n,...e){if(Kt.logLevel<=Q.WARN){const t=e.map(_o);Kt.warn(`Firestore (${An}): ${n}`,...t)}}function _o(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function B(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,hu(n,s,t)}function hu(n,e,t){let s=`FIRESTORE (${An}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw st(s),new Error(s)}function ee(n,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,n||hu(e,r,s)}function H(n,e){return n}/**
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
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class M extends at{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class tt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Wf{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Kf{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Se.UNAUTHENTICATED)))}shutdown(){}}class Qf{constructor(e){this.t=e,this.currentUser=Se.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ee(this.o===void 0,42304);let s=this.i;const r=c=>this.i!==s?(s=this.i,t(c)):Promise.resolve();let i=new tt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new tt,e.enqueueRetryable((()=>r(this.currentUser)))};const a=()=>{const c=i;e.enqueueRetryable((async()=>{await c.promise,await r(this.currentUser)}))},l=c=>{$("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((c=>l(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):($("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new tt)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?($("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(ee(typeof s.accessToken=="string",31837,{l:s}),new Wf(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ee(e===null||typeof e=="string",2055,{h:e}),new Se(e)}}class Yf{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Se.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class Jf{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new Yf(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Se.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Il{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Xf{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Me(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){ee(this.o===void 0,3512);const s=i=>{i.error!=null&&$("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.m;return this.m=i.token,$("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>s(i)))};const r=i=>{$("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>r(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?r(i):$("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Il(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ee(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Il(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Zf(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
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
 */class Eo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=Zf(40);for(let i=0;i<r.length;++i)s.length<20&&r[i]<t&&(s+=e.charAt(r[i]%62))}return s}}function Y(n,e){return n<e?-1:n>e?1:0}function Ji(n,e){const t=Math.min(n.length,e.length);for(let s=0;s<t;s++){const r=n.charAt(s),i=e.charAt(s);if(r!==i)return Vi(r)===Vi(i)?Y(r,i):Vi(r)?1:-1}return Y(n.length,e.length)}const em=55296,tm=57343;function Vi(n){const e=n.charCodeAt(0);return e>=em&&e<=tm}function vn(n,e,t){return n.length===e.length&&n.every(((s,r)=>t(s,e[r])))}/**
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
 */const Tl="__name__";class ze{constructor(e,t,s){t===void 0?t=0:t>e.length&&B(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&B(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return ze.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ze?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const i=ze.compareSegments(e.get(r),t.get(r));if(i!==0)return i}return Y(e.length,t.length)}static compareSegments(e,t){const s=ze.isNumericId(e),r=ze.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?ze.extractNumericId(e).compare(ze.extractNumericId(t)):Ji(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return It.fromString(e.substring(4,e.length-2))}}class ne extends ze{construct(e,t,s){return new ne(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new M(P.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((r=>r.length>0)))}return new ne(t)}static emptyPath(){return new ne([])}}const nm=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class be extends ze{construct(e,t,s){return new be(e,t,s)}static isValidIdentifier(e){return nm.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),be.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Tl}static keyField(){return new be([Tl])}static fromServerFormat(e){const t=[];let s="",r=0;const i=()=>{if(s.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new M(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new M(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=c,r+=2}else l==="`"?(a=!a,r++):l!=="."||a?(s+=l,r++):(i(),r++)}if(i(),a)throw new M(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new be(t)}static emptyPath(){return new be([])}}/**
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
 */class F{constructor(e){this.path=e}static fromPath(e){return new F(ne.fromString(e))}static fromName(e){return new F(ne.fromString(e).popFirst(5))}static empty(){return new F(ne.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ne.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ne.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new F(new ne(e.slice()))}}/**
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
 */function pu(n,e,t){if(!t)throw new M(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function sm(n,e,t,s){if(e===!0&&s===!0)throw new M(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Al(n){if(!F.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Sl(n){if(F.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function fu(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Mr(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":B(12329,{type:typeof n})}function Qe(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Mr(n);throw new M(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */function he(n,e){const t={typeString:n};return e&&(t.value=e),t}function xs(n,e){if(!fu(n))throw new M(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,i="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const a=n[s];if(r&&typeof a!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${s}' field to equal '${i.value}'`;break}}if(t)throw new M(P.INVALID_ARGUMENT,t);return!0}/**
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
 */const Rl=-62135596800,Cl=1e6;class re{static now(){return re.fromMillis(Date.now())}static fromDate(e){return re.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Cl);return new re(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Rl)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Cl}_compareTo(e){return this.seconds===e.seconds?Y(this.nanoseconds,e.nanoseconds):Y(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:re._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(xs(e,re._jsonSchema))return new re(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Rl;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}re._jsonSchemaVersion="firestore/timestamp/1.0",re._jsonSchema={type:he("string",re._jsonSchemaVersion),seconds:he("number"),nanoseconds:he("number")};/**
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
 */class z{static fromTimestamp(e){return new z(e)}static min(){return new z(new re(0,0))}static max(){return new z(new re(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const ls=-1;function rm(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=z.fromTimestamp(s===1e9?new re(t+1,0):new re(t,s));return new St(r,F.empty(),e)}function im(n){return new St(n.readTime,n.key,ls)}class St{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new St(z.min(),F.empty(),ls)}static max(){return new St(z.max(),F.empty(),ls)}}function om(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=F.comparator(n.documentKey,e.documentKey),t!==0?t:Y(n.largestBatchId,e.largestBatchId))}/**
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
 */const am="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class lm{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function Sn(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==am)throw n;$("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class D{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&B(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new D(((s,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(s,r)},this.catchCallback=i=>{this.wrapFailure(t,i).next(s,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof D?t:D.resolve(t)}catch(t){return D.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):D.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):D.reject(t)}static resolve(e){return new D(((t,s)=>{t(e)}))}static reject(e){return new D(((t,s)=>{s(e)}))}static waitFor(e){return new D(((t,s)=>{let r=0,i=0,a=!1;e.forEach((l=>{++r,l.next((()=>{++i,a&&i===r&&t()}),(c=>s(c)))})),a=!0,i===r&&t()}))}static or(e){let t=D.resolve(!1);for(const s of e)t=t.next((r=>r?D.resolve(r):s()));return t}static forEach(e,t){const s=[];return e.forEach(((r,i)=>{s.push(t.call(this,r,i))})),this.waitFor(s)}static mapArray(e,t){return new D(((s,r)=>{const i=e.length,a=new Array(i);let l=0;for(let c=0;c<i;c++){const d=c;t(e[d]).next((h=>{a[d]=h,++l,l===i&&s(a)}),(h=>r(h)))}}))}static doWhile(e,t){return new D(((s,r)=>{const i=()=>{e()===!0?t().next((()=>{i()}),r):s()};i()}))}}function cm(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Rn(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Lr{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ae(s),this.ue=s=>t.writeSequenceNumber(s))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Lr.ce=-1;/**
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
 */const ko=-1;function $r(n){return n==null}function hr(n){return n===0&&1/n==-1/0}function um(n){return typeof n=="number"&&Number.isInteger(n)&&!hr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const mu="";function dm(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Pl(e)),e=hm(n.get(t),e);return Pl(e)}function hm(n,e){let t=e;const s=n.length;for(let r=0;r<s;r++){const i=n.charAt(r);switch(i){case"\0":t+="";break;case mu:t+="";break;default:t+=i}}return t}function Pl(n){return n+mu+""}/**
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
 */function Dl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Mt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function gu(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class ie{constructor(e,t){this.comparator=e,this.root=t||ye.EMPTY}insert(e,t){return new ie(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ye.BLACK,null,null))}remove(e){return new ie(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ye.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Gs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Gs(this.root,e,this.comparator,!1)}getReverseIterator(){return new Gs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Gs(this.root,e,this.comparator,!0)}}class Gs{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?s(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ye{constructor(e,t,s,r,i){this.key=e,this.value=t,this.color=s??ye.RED,this.left=r??ye.EMPTY,this.right=i??ye.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,i){return new ye(e??this.key,t??this.value,s??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const i=s(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,s),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ye.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return ye.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ye.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ye.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw B(43730,{key:this.key,value:this.value});if(this.right.isRed())throw B(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw B(27949);return e+(this.isRed()?0:1)}}ye.EMPTY=null,ye.RED=!0,ye.BLACK=!1;ye.EMPTY=new class{constructor(){this.size=0}get key(){throw B(57766)}get value(){throw B(16141)}get color(){throw B(16727)}get left(){throw B(29726)}get right(){throw B(36894)}copy(e,t,s,r,i){return this}insert(e,t,s){return new ye(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class fe{constructor(e){this.comparator=e,this.data=new ie(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Vl(this.data.getIterator())}getIteratorFrom(e){return new Vl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof fe)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new fe(this.comparator);return t.data=e,t}}class Vl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class De{constructor(e){this.fields=e,e.sort(be.comparator)}static empty(){return new De([])}unionWith(e){let t=new fe(be.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new De(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return vn(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
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
 */class yu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class ve{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new yu("Invalid base64 string: "+i):i}})(e);return new ve(t)}static fromUint8Array(e){const t=(function(r){let i="";for(let a=0;a<r.length;++a)i+=String.fromCharCode(r[a]);return i})(e);return new ve(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Y(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ve.EMPTY_BYTE_STRING=new ve("");const pm=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rt(n){if(ee(!!n,39018),typeof n=="string"){let e=0;const t=pm.exec(n);if(ee(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:ae(n.seconds),nanos:ae(n.nanos)}}function ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ct(n){return typeof n=="string"?ve.fromBase64String(n):ve.fromUint8Array(n)}/**
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
 */const bu="server_timestamp",vu="__type__",xu="__previous_value__",wu="__local_write_time__";function Io(n){var t,s;return((s=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[vu])==null?void 0:s.stringValue)===bu}function Or(n){const e=n.mapValue.fields[xu];return Io(e)?Or(e):e}function cs(n){const e=Rt(n.mapValue.fields[wu].timestampValue);return new re(e.seconds,e.nanos)}/**
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
 */class fm{constructor(e,t,s,r,i,a,l,c,d,h,m){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=d,this.isUsingEmulator=h,this.apiKey=m}}const pr="(default)";class us{constructor(e,t){this.projectId=e,this.database=t||pr}static empty(){return new us("","")}get isDefaultDatabase(){return this.database===pr}isEqual(e){return e instanceof us&&e.projectId===this.projectId&&e.database===this.database}}function mm(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new M(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new us(n.options.projectId,e)}/**
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
 */const _u="__type__",gm="__max__",Ws={mapValue:{}},Eu="__vector__",fr="value";function Pt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Io(n)?4:bm(n)?9007199254740991:ym(n)?10:11:B(28295,{value:n})}function Ye(n,e){if(n===e)return!0;const t=Pt(n);if(t!==Pt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return cs(n).isEqual(cs(e));case 3:return(function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const a=Rt(r.timestampValue),l=Rt(i.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,i){return Ct(r.bytesValue).isEqual(Ct(i.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,i){return ae(r.geoPointValue.latitude)===ae(i.geoPointValue.latitude)&&ae(r.geoPointValue.longitude)===ae(i.geoPointValue.longitude)})(n,e);case 2:return(function(r,i){if("integerValue"in r&&"integerValue"in i)return ae(r.integerValue)===ae(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const a=ae(r.doubleValue),l=ae(i.doubleValue);return a===l?hr(a)===hr(l):isNaN(a)&&isNaN(l)}return!1})(n,e);case 9:return vn(n.arrayValue.values||[],e.arrayValue.values||[],Ye);case 10:case 11:return(function(r,i){const a=r.mapValue.fields||{},l=i.mapValue.fields||{};if(Dl(a)!==Dl(l))return!1;for(const c in a)if(a.hasOwnProperty(c)&&(l[c]===void 0||!Ye(a[c],l[c])))return!1;return!0})(n,e);default:return B(52216,{left:n})}}function ds(n,e){return(n.values||[]).find((t=>Ye(t,e)))!==void 0}function xn(n,e){if(n===e)return 0;const t=Pt(n),s=Pt(e);if(t!==s)return Y(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return Y(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const l=ae(i.integerValue||i.doubleValue),c=ae(a.integerValue||a.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1})(n,e);case 3:return Nl(n.timestampValue,e.timestampValue);case 4:return Nl(cs(n),cs(e));case 5:return Ji(n.stringValue,e.stringValue);case 6:return(function(i,a){const l=Ct(i),c=Ct(a);return l.compareTo(c)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const l=i.split("/"),c=a.split("/");for(let d=0;d<l.length&&d<c.length;d++){const h=Y(l[d],c[d]);if(h!==0)return h}return Y(l.length,c.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const l=Y(ae(i.latitude),ae(a.latitude));return l!==0?l:Y(ae(i.longitude),ae(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Ml(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var y,x,A,S;const l=i.fields||{},c=a.fields||{},d=(y=l[fr])==null?void 0:y.arrayValue,h=(x=c[fr])==null?void 0:x.arrayValue,m=Y(((A=d==null?void 0:d.values)==null?void 0:A.length)||0,((S=h==null?void 0:h.values)==null?void 0:S.length)||0);return m!==0?m:Ml(d,h)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===Ws.mapValue&&a===Ws.mapValue)return 0;if(i===Ws.mapValue)return 1;if(a===Ws.mapValue)return-1;const l=i.fields||{},c=Object.keys(l),d=a.fields||{},h=Object.keys(d);c.sort(),h.sort();for(let m=0;m<c.length&&m<h.length;++m){const y=Ji(c[m],h[m]);if(y!==0)return y;const x=xn(l[c[m]],d[h[m]]);if(x!==0)return x}return Y(c.length,h.length)})(n.mapValue,e.mapValue);default:throw B(23264,{he:t})}}function Nl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Y(n,e);const t=Rt(n),s=Rt(e),r=Y(t.seconds,s.seconds);return r!==0?r:Y(t.nanos,s.nanos)}function Ml(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const i=xn(t[r],s[r]);if(i)return i}return Y(t.length,s.length)}function wn(n){return Xi(n)}function Xi(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=Rt(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Ct(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return F.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",r=!0;for(const i of t.values||[])r?r=!1:s+=",",s+=Xi(i);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let r="{",i=!0;for(const a of s)i?i=!1:r+=",",r+=`${a}:${Xi(t.fields[a])}`;return r+"}"})(n.mapValue):B(61005,{value:n})}function tr(n){switch(Pt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Or(n);return e?16+tr(e):16;case 5:return 2*n.stringValue.length;case 6:return Ct(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((r,i)=>r+tr(i)),0)})(n.arrayValue);case 10:case 11:return(function(s){let r=0;return Mt(s.fields,((i,a)=>{r+=i.length+tr(a)})),r})(n.mapValue);default:throw B(13486,{value:n})}}function Ll(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Zi(n){return!!n&&"integerValue"in n}function To(n){return!!n&&"arrayValue"in n}function $l(n){return!!n&&"nullValue"in n}function Ol(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function nr(n){return!!n&&"mapValue"in n}function ym(n){var t,s;return((s=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[_u])==null?void 0:s.stringValue)===Eu}function es(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Mt(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=es(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=es(n.arrayValue.values[t]);return e}return{...n}}function bm(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===gm}/**
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
 */class Ce{constructor(e){this.value=e}static empty(){return new Ce({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!nr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=es(t)}setAll(e){let t=be.emptyPath(),s={},r=[];e.forEach(((a,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,s,r),s={},r=[],t=l.popLast()}a?s[l.lastSegment()]=es(a):r.push(l.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,s,r)}delete(e){const t=this.field(e.popLast());nr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ye(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];nr(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){Mt(t,((r,i)=>e[r]=i));for(const r of s)delete e[r]}clone(){return new Ce(es(this.value))}}function ku(n){const e=[];return Mt(n.fields,((t,s)=>{const r=new be([t]);if(nr(s)){const i=ku(s.mapValue).fields;if(i.length===0)e.push(r);else for(const a of i)e.push(r.child(a))}else e.push(r)})),new De(e)}/**
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
 */class _e{constructor(e,t,s,r,i,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=i,this.data=a,this.documentState=l}static newInvalidDocument(e){return new _e(e,0,z.min(),z.min(),z.min(),Ce.empty(),0)}static newFoundDocument(e,t,s,r){return new _e(e,1,t,z.min(),s,r,0)}static newNoDocument(e,t){return new _e(e,2,t,z.min(),z.min(),Ce.empty(),0)}static newUnknownDocument(e,t){return new _e(e,3,t,z.min(),z.min(),Ce.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(z.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ce.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ce.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=z.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof _e&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new _e(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class mr{constructor(e,t){this.position=e,this.inclusive=t}}function Fl(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const i=e[r],a=n.position[r];if(i.field.isKeyField()?s=F.comparator(F.fromName(a.referenceValue),t.key):s=xn(a,t.data.field(i.field)),i.dir==="desc"&&(s*=-1),s!==0)break}return s}function Ul(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ye(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class gr{constructor(e,t="asc"){this.field=e,this.dir=t}}function vm(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Iu{}class de extends Iu{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new wm(e,t,s):t==="array-contains"?new km(e,s):t==="in"?new Im(e,s):t==="not-in"?new Tm(e,s):t==="array-contains-any"?new Am(e,s):new de(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new _m(e,s):new Em(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(xn(t,this.value)):t!==null&&Pt(this.value)===Pt(t)&&this.matchesComparison(xn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return B(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Fe extends Iu{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Fe(e,t)}matches(e){return Tu(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Tu(n){return n.op==="and"}function Au(n){return xm(n)&&Tu(n)}function xm(n){for(const e of n.filters)if(e instanceof Fe)return!1;return!0}function eo(n){if(n instanceof de)return n.field.canonicalString()+n.op.toString()+wn(n.value);if(Au(n))return n.filters.map((e=>eo(e))).join(",");{const e=n.filters.map((t=>eo(t))).join(",");return`${n.op}(${e})`}}function Su(n,e){return n instanceof de?(function(s,r){return r instanceof de&&s.op===r.op&&s.field.isEqual(r.field)&&Ye(s.value,r.value)})(n,e):n instanceof Fe?(function(s,r){return r instanceof Fe&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce(((i,a,l)=>i&&Su(a,r.filters[l])),!0):!1})(n,e):void B(19439)}function Ru(n){return n instanceof de?(function(t){return`${t.field.canonicalString()} ${t.op} ${wn(t.value)}`})(n):n instanceof Fe?(function(t){return t.op.toString()+" {"+t.getFilters().map(Ru).join(" ,")+"}"})(n):"Filter"}class wm extends de{constructor(e,t,s){super(e,t,s),this.key=F.fromName(s.referenceValue)}matches(e){const t=F.comparator(e.key,this.key);return this.matchesComparison(t)}}class _m extends de{constructor(e,t){super(e,"in",t),this.keys=Cu("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Em extends de{constructor(e,t){super(e,"not-in",t),this.keys=Cu("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Cu(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((s=>F.fromName(s.referenceValue)))}class km extends de{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return To(t)&&ds(t.arrayValue,this.value)}}class Im extends de{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ds(this.value.arrayValue,t)}}class Tm extends de{constructor(e,t){super(e,"not-in",t)}matches(e){if(ds(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ds(this.value.arrayValue,t)}}class Am extends de{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!To(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>ds(this.value.arrayValue,s)))}}/**
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
 */class Sm{constructor(e,t=null,s=[],r=[],i=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=i,this.startAt=a,this.endAt=l,this.Te=null}}function Bl(n,e=null,t=[],s=[],r=null,i=null,a=null){return new Sm(n,e,t,s,r,i,a)}function Ao(n){const e=H(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>eo(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(i){return i.field.canonicalString()+i.dir})(s))).join(","),$r(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>wn(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>wn(s))).join(",")),e.Te=t}return e.Te}function So(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!vm(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Su(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ul(n.startAt,e.startAt)&&Ul(n.endAt,e.endAt)}function to(n){return F.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class ws{constructor(e,t=null,s=[],r=[],i=null,a="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=i,this.limitType=a,this.startAt=l,this.endAt=c,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function Rm(n,e,t,s,r,i,a,l){return new ws(n,e,t,s,r,i,a,l)}function Ro(n){return new ws(n)}function jl(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Cm(n){return F.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Pu(n){return n.collectionGroup!==null}function ts(n){const e=H(n);if(e.Ee===null){e.Ee=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ee.push(i),t.add(i.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new fe(be.comparator);return a.filters.forEach((c=>{c.getFlattenedFilters().forEach((d=>{d.isInequality()&&(l=l.add(d.field))}))})),l})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ee.push(new gr(i,s))})),t.has(be.keyField().canonicalString())||e.Ee.push(new gr(be.keyField(),s))}return e.Ee}function qe(n){const e=H(n);return e.Ie||(e.Ie=Pm(e,ts(n))),e.Ie}function Pm(n,e){if(n.limitType==="F")return Bl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const i=r.dir==="desc"?"asc":"desc";return new gr(r.field,i)}));const t=n.endAt?new mr(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new mr(n.startAt.position,n.startAt.inclusive):null;return Bl(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function no(n,e){const t=n.filters.concat([e]);return new ws(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function so(n,e,t){return new ws(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Fr(n,e){return So(qe(n),qe(e))&&n.limitType===e.limitType}function Du(n){return`${Ao(qe(n))}|lt:${n.limitType}`}function an(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((r=>Ru(r))).join(", ")}]`),$r(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((r=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(r))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((r=>wn(r))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((r=>wn(r))).join(",")),`Target(${s})`})(qe(n))}; limitType=${n.limitType})`}function Ur(n,e){return e.isFoundDocument()&&(function(s,r){const i=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(i):F.isDocumentKey(s.path)?s.path.isEqual(i):s.path.isImmediateParentOf(i)})(n,e)&&(function(s,r){for(const i of ts(s))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(s,r){for(const i of s.filters)if(!i.matches(r))return!1;return!0})(n,e)&&(function(s,r){return!(s.startAt&&!(function(a,l,c){const d=Fl(a,l,c);return a.inclusive?d<=0:d<0})(s.startAt,ts(s),r)||s.endAt&&!(function(a,l,c){const d=Fl(a,l,c);return a.inclusive?d>=0:d>0})(s.endAt,ts(s),r))})(n,e)}function Dm(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Vu(n){return(e,t)=>{let s=!1;for(const r of ts(n)){const i=Vm(r,e,t);if(i!==0)return i;s=s||r.field.isKeyField()}return 0}}function Vm(n,e,t){const s=n.field.isKeyField()?F.comparator(e.key,t.key):(function(i,a,l){const c=a.data.field(i),d=l.data.field(i);return c!==null&&d!==null?xn(c,d):B(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return B(19790,{direction:n.dir})}}/**
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
 */class Jt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,i]of s)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Mt(this.inner,((t,s)=>{for(const[r,i]of s)e(r,i)}))}isEmpty(){return gu(this.inner)}size(){return this.innerSize}}/**
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
 */const Nm=new ie(F.comparator);function rt(){return Nm}const Nu=new ie(F.comparator);function Jn(...n){let e=Nu;for(const t of n)e=e.insert(t.key,t);return e}function Mu(n){let e=Nu;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function qt(){return ns()}function Lu(){return ns()}function ns(){return new Jt((n=>n.toString()),((n,e)=>n.isEqual(e)))}const Mm=new ie(F.comparator),Lm=new fe(F.comparator);function J(...n){let e=Lm;for(const t of n)e=e.add(t);return e}const $m=new fe(Y);function Om(){return $m}/**
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
 */function Co(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:hr(e)?"-0":e}}function $u(n){return{integerValue:""+n}}function Fm(n,e){return um(e)?$u(e):Co(n,e)}/**
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
 */class Br{constructor(){this._=void 0}}function Um(n,e,t){return n instanceof hs?(function(r,i){const a={fields:{[vu]:{stringValue:bu},[wu]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&Io(i)&&(i=Or(i)),i&&(a.fields[xu]=i),{mapValue:a}})(t,e):n instanceof ps?Fu(n,e):n instanceof fs?Uu(n,e):(function(r,i){const a=Ou(r,i),l=zl(a)+zl(r.Ae);return Zi(a)&&Zi(r.Ae)?$u(l):Co(r.serializer,l)})(n,e)}function Bm(n,e,t){return n instanceof ps?Fu(n,e):n instanceof fs?Uu(n,e):t}function Ou(n,e){return n instanceof yr?(function(s){return Zi(s)||(function(i){return!!i&&"doubleValue"in i})(s)})(e)?e:{integerValue:0}:null}class hs extends Br{}class ps extends Br{constructor(e){super(),this.elements=e}}function Fu(n,e){const t=Bu(e);for(const s of n.elements)t.some((r=>Ye(r,s)))||t.push(s);return{arrayValue:{values:t}}}class fs extends Br{constructor(e){super(),this.elements=e}}function Uu(n,e){let t=Bu(e);for(const s of n.elements)t=t.filter((r=>!Ye(r,s)));return{arrayValue:{values:t}}}class yr extends Br{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function zl(n){return ae(n.integerValue||n.doubleValue)}function Bu(n){return To(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class jm{constructor(e,t){this.field=e,this.transform=t}}function zm(n,e){return n.field.isEqual(e.field)&&(function(s,r){return s instanceof ps&&r instanceof ps||s instanceof fs&&r instanceof fs?vn(s.elements,r.elements,Ye):s instanceof yr&&r instanceof yr?Ye(s.Ae,r.Ae):s instanceof hs&&r instanceof hs})(n.transform,e.transform)}class qm{constructor(e,t){this.version=e,this.transformResults=t}}class Ne{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ne}static exists(e){return new Ne(void 0,e)}static updateTime(e){return new Ne(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function sr(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class jr{}function ju(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Po(n.key,Ne.none()):new _s(n.key,n.data,Ne.none());{const t=n.data,s=Ce.empty();let r=new fe(be.comparator);for(let i of e.fields)if(!r.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?s.delete(i):s.set(i,a),r=r.add(i)}return new Lt(n.key,s,new De(r.toArray()),Ne.none())}}function Hm(n,e,t){n instanceof _s?(function(r,i,a){const l=r.value.clone(),c=Hl(r.fieldTransforms,i,a.transformResults);l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):n instanceof Lt?(function(r,i,a){if(!sr(r.precondition,i))return void i.convertToUnknownDocument(a.version);const l=Hl(r.fieldTransforms,i,a.transformResults),c=i.data;c.setAll(zu(r)),c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):(function(r,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function ss(n,e,t,s){return n instanceof _s?(function(i,a,l,c){if(!sr(i.precondition,a))return l;const d=i.value.clone(),h=Gl(i.fieldTransforms,c,a);return d.setAll(h),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,s):n instanceof Lt?(function(i,a,l,c){if(!sr(i.precondition,a))return l;const d=Gl(i.fieldTransforms,c,a),h=a.data;return h.setAll(zu(i)),h.setAll(d),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),l===null?null:l.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,s):(function(i,a,l){return sr(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l})(n,e,t)}function Gm(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),i=Ou(s.transform,r||null);i!=null&&(t===null&&(t=Ce.empty()),t.set(s.field,i))}return t||null}function ql(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&vn(s,r,((i,a)=>zm(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class _s extends jr{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Lt extends jr{constructor(e,t,s,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function zu(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function Hl(n,e,t){const s=new Map;ee(n.length===t.length,32656,{Ve:t.length,de:n.length});for(let r=0;r<t.length;r++){const i=n[r],a=i.transform,l=e.data.field(i.field);s.set(i.field,Bm(a,l,t[r]))}return s}function Gl(n,e,t){const s=new Map;for(const r of n){const i=r.transform,a=t.data.field(r.field);s.set(r.field,Um(i,a,e))}return s}class Po extends jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Wm extends jr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Km{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&Hm(i,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=ss(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=ss(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Lu();return this.mutations.forEach((r=>{const i=e.get(r.key),a=i.overlayedDocument;let l=this.applyToLocalView(a,i.mutatedFields);l=t.has(r.key)?null:l;const c=ju(a,l);c!==null&&s.set(r.key,c),a.isValidDocument()||a.convertToNoDocument(z.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),J())}isEqual(e){return this.batchId===e.batchId&&vn(this.mutations,e.mutations,((t,s)=>ql(t,s)))&&vn(this.baseMutations,e.baseMutations,((t,s)=>ql(t,s)))}}class Do{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){ee(e.mutations.length===s.length,58842,{me:e.mutations.length,fe:s.length});let r=(function(){return Mm})();const i=e.mutations;for(let a=0;a<i.length;a++)r=r.insert(i[a].key,s[a].version);return new Do(e,t,s,r)}}/**
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
 */class Qm{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class Ym{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var ue,Z;function Jm(n){switch(n){case P.OK:return B(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return B(15467,{code:n})}}function qu(n){if(n===void 0)return st("GRPC error has no .code"),P.UNKNOWN;switch(n){case ue.OK:return P.OK;case ue.CANCELLED:return P.CANCELLED;case ue.UNKNOWN:return P.UNKNOWN;case ue.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case ue.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case ue.INTERNAL:return P.INTERNAL;case ue.UNAVAILABLE:return P.UNAVAILABLE;case ue.UNAUTHENTICATED:return P.UNAUTHENTICATED;case ue.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case ue.NOT_FOUND:return P.NOT_FOUND;case ue.ALREADY_EXISTS:return P.ALREADY_EXISTS;case ue.PERMISSION_DENIED:return P.PERMISSION_DENIED;case ue.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case ue.ABORTED:return P.ABORTED;case ue.OUT_OF_RANGE:return P.OUT_OF_RANGE;case ue.UNIMPLEMENTED:return P.UNIMPLEMENTED;case ue.DATA_LOSS:return P.DATA_LOSS;default:return B(39323,{code:n})}}(Z=ue||(ue={}))[Z.OK=0]="OK",Z[Z.CANCELLED=1]="CANCELLED",Z[Z.UNKNOWN=2]="UNKNOWN",Z[Z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Z[Z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Z[Z.NOT_FOUND=5]="NOT_FOUND",Z[Z.ALREADY_EXISTS=6]="ALREADY_EXISTS",Z[Z.PERMISSION_DENIED=7]="PERMISSION_DENIED",Z[Z.UNAUTHENTICATED=16]="UNAUTHENTICATED",Z[Z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Z[Z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Z[Z.ABORTED=10]="ABORTED",Z[Z.OUT_OF_RANGE=11]="OUT_OF_RANGE",Z[Z.UNIMPLEMENTED=12]="UNIMPLEMENTED",Z[Z.INTERNAL=13]="INTERNAL",Z[Z.UNAVAILABLE=14]="UNAVAILABLE",Z[Z.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function Xm(){return new TextEncoder}/**
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
 */const Zm=new It([4294967295,4294967295],0);function Wl(n){const e=Xm().encode(n),t=new ou;return t.update(e),new Uint8Array(t.digest())}function Kl(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new It([t,s],0),new It([r,i],0)]}class Vo{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Xn(`Invalid padding: ${t}`);if(s<0)throw new Xn(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Xn(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Xn(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=It.fromNumber(this.ge)}ye(e,t,s){let r=e.add(t.multiply(It.fromNumber(s)));return r.compare(Zm)===1&&(r=new It([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Wl(e),[s,r]=Kl(t);for(let i=0;i<this.hashCount;i++){const a=this.ye(s,r,i);if(!this.we(a))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Vo(i,r,t);return s.forEach((l=>a.insert(l))),a}insert(e){if(this.ge===0)return;const t=Wl(e),[s,r]=Kl(t);for(let i=0;i<this.hashCount;i++){const a=this.ye(s,r,i);this.Se(a)}}Se(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Xn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class zr{constructor(e,t,s,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,Es.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new zr(z.min(),r,new ie(Y),rt(),J())}}class Es{constructor(e,t,s,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new Es(s,t,J(),J(),J())}}/**
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
 */class rr{constructor(e,t,s,r){this.be=e,this.removedTargetIds=t,this.key=s,this.De=r}}class Hu{constructor(e,t){this.targetId=e,this.Ce=t}}class Gu{constructor(e,t,s=ve.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class Ql{constructor(){this.ve=0,this.Fe=Yl(),this.Me=ve.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=J(),t=J(),s=J();return this.Fe.forEach(((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:B(38017,{changeType:i})}})),new Es(this.Me,this.xe,e,t,s)}qe(){this.Oe=!1,this.Fe=Yl()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,ee(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class eg{constructor(e){this.Ge=e,this.ze=new Map,this.je=rt(),this.Je=Ks(),this.He=Ks(),this.Ze=new ie(Y)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const s=this.nt(t);switch(e.state){case 0:this.rt(t)&&s.Le(e.resumeToken);break;case 1:s.We(),s.Ne||s.qe(),s.Le(e.resumeToken);break;case 2:s.We(),s.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(s.Qe(),s.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),s.Le(e.resumeToken));break;default:B(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((s,r)=>{this.rt(r)&&t(r)}))}st(e){const t=e.targetId,s=e.Ce.count,r=this.ot(t);if(r){const i=r.target;if(to(i))if(s===0){const a=new F(i.path);this.et(t,a,_e.newNoDocument(a,z.min()))}else ee(s===1,20013,{expectedCount:s});else{const a=this._t(t);if(a!==s){const l=this.ut(e),c=l?this.ct(l,e,a):1;if(c!==0){this.it(t);const d=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,d)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:i=0}=t;let a,l;try{a=Ct(s).toUint8Array()}catch(c){if(c instanceof yu)return bn("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new Vo(a,r,i)}catch(c){return bn(c instanceof Xn?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.ge===0?null:l}ct(e,t,s){return t.Ce.count===s-this.Pt(e,t.targetId)?0:2}Pt(e,t){const s=this.Ge.getRemoteKeysForTarget(t);let r=0;return s.forEach((i=>{const a=this.Ge.ht(),l=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(l)||(this.et(t,i,null),r++)})),r}Tt(e){const t=new Map;this.ze.forEach(((i,a)=>{const l=this.ot(a);if(l){if(i.current&&to(l.target)){const c=new F(l.target.path);this.Et(c).has(a)||this.It(a,c)||this.et(a,c,_e.newNoDocument(c,e))}i.Be&&(t.set(a,i.ke()),i.qe())}}));let s=J();this.He.forEach(((i,a)=>{let l=!0;a.forEachWhile((c=>{const d=this.ot(c);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(s=s.add(i))})),this.je.forEach(((i,a)=>a.setReadTime(e)));const r=new zr(e,t,this.Ze,this.je,s);return this.je=rt(),this.Je=Ks(),this.He=Ks(),this.Ze=new ie(Y),r}Ye(e,t){if(!this.rt(e))return;const s=this.It(e,t.key)?2:0;this.nt(e).Ke(t.key,s),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Et(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,s){if(!this.rt(e))return;const r=this.nt(e);this.It(e,t)?r.Ke(t,1):r.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),s&&(this.je=this.je.insert(t,s))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new Ql,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new fe(Y),this.He=this.He.insert(e,t)),t}Et(e){let t=this.Je.get(e);return t||(t=new fe(Y),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||$("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Ql),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Ks(){return new ie(F.comparator)}function Yl(){return new ie(F.comparator)}const tg={asc:"ASCENDING",desc:"DESCENDING"},ng={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},sg={and:"AND",or:"OR"};class rg{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ro(n,e){return n.useProto3Json||$r(e)?e:{value:e}}function br(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Wu(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function ig(n,e){return br(n,e.toTimestamp())}function He(n){return ee(!!n,49232),z.fromTimestamp((function(t){const s=Rt(t);return new re(s.seconds,s.nanos)})(n))}function No(n,e){return io(n,e).canonicalString()}function io(n,e){const t=(function(r){return new ne(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Ku(n){const e=ne.fromString(n);return ee(Zu(e),10190,{key:e.toString()}),e}function oo(n,e){return No(n.databaseId,e.path)}function Ni(n,e){const t=Ku(e);if(t.get(1)!==n.databaseId.projectId)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new F(Yu(t))}function Qu(n,e){return No(n.databaseId,e)}function og(n){const e=Ku(n);return e.length===4?ne.emptyPath():Yu(e)}function ao(n){return new ne(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Yu(n){return ee(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Jl(n,e,t){return{name:oo(n,e),fields:t.value.mapValue.fields}}function ag(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:B(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=(function(d,h){return d.useProto3Json?(ee(h===void 0||typeof h=="string",58123),ve.fromBase64String(h||"")):(ee(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),ve.fromUint8Array(h||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&(function(d){const h=d.code===void 0?P.UNKNOWN:qu(d.code);return new M(h,d.message||"")})(a);t=new Gu(s,r,i,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Ni(n,s.document.name),i=He(s.document.updateTime),a=s.document.createTime?He(s.document.createTime):z.min(),l=new Ce({mapValue:{fields:s.document.fields}}),c=_e.newFoundDocument(r,i,a,l),d=s.targetIds||[],h=s.removedTargetIds||[];t=new rr(d,h,c.key,c)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Ni(n,s.document),i=s.readTime?He(s.readTime):z.min(),a=_e.newNoDocument(r,i),l=s.removedTargetIds||[];t=new rr([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Ni(n,s.document),i=s.removedTargetIds||[];t=new rr([],i,r,null)}else{if(!("filter"in e))return B(11601,{Vt:e});{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:i}=s,a=new Ym(r,i),l=s.targetId;t=new Hu(l,a)}}return t}function lg(n,e){let t;if(e instanceof _s)t={update:Jl(n,e.key,e.value)};else if(e instanceof Po)t={delete:oo(n,e.key)};else if(e instanceof Lt)t={update:Jl(n,e.key,e.data),updateMask:yg(e.fieldMask)};else{if(!(e instanceof Wm))return B(16599,{dt:e.type});t={verify:oo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(i,a){const l=a.transform;if(l instanceof hs)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof ps)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof fs)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof yr)return{fieldPath:a.field.canonicalString(),increment:l.Ae};throw B(20930,{transform:a.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(r,i){return i.updateTime!==void 0?{updateTime:ig(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:B(27497)})(n,e.precondition)),t}function cg(n,e){return n&&n.length>0?(ee(e!==void 0,14353),n.map((t=>(function(r,i){let a=r.updateTime?He(r.updateTime):He(i);return a.isEqual(z.min())&&(a=He(i)),new qm(a,r.transformResults||[])})(t,e)))):[]}function ug(n,e){return{documents:[Qu(n,e.path)]}}function dg(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=Qu(n,r);const i=(function(d){if(d.length!==0)return Xu(Fe.create(d,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(d){if(d.length!==0)return d.map((h=>(function(y){return{field:ln(y.field),direction:fg(y.dir)}})(h)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=ro(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{ft:t,parent:r}}function hg(n){let e=og(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){ee(s===1,65062);const h=t.from[0];h.allDescendants?r=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(m){const y=Ju(m);return y instanceof Fe&&Au(y)?y.getFilters():[y]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((y=>(function(A){return new gr(cn(A.field),(function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(A.direction))})(y)))})(t.orderBy));let l=null;t.limit&&(l=(function(m){let y;return y=typeof m=="object"?m.value:m,$r(y)?null:y})(t.limit));let c=null;t.startAt&&(c=(function(m){const y=!!m.before,x=m.values||[];return new mr(x,y)})(t.startAt));let d=null;return t.endAt&&(d=(function(m){const y=!m.before,x=m.values||[];return new mr(x,y)})(t.endAt)),Rm(e,r,a,i,l,"F",c,d)}function pg(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return B(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Ju(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=cn(t.unaryFilter.field);return de.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=cn(t.unaryFilter.field);return de.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=cn(t.unaryFilter.field);return de.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=cn(t.unaryFilter.field);return de.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return B(61313);default:return B(60726)}})(n):n.fieldFilter!==void 0?(function(t){return de.create(cn(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return B(58110);default:return B(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Fe.create(t.compositeFilter.filters.map((s=>Ju(s))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return B(1026)}})(t.compositeFilter.op))})(n):B(30097,{filter:n})}function fg(n){return tg[n]}function mg(n){return ng[n]}function gg(n){return sg[n]}function ln(n){return{fieldPath:n.canonicalString()}}function cn(n){return be.fromServerFormat(n.fieldPath)}function Xu(n){return n instanceof de?(function(t){if(t.op==="=="){if(Ol(t.value))return{unaryFilter:{field:ln(t.field),op:"IS_NAN"}};if($l(t.value))return{unaryFilter:{field:ln(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ol(t.value))return{unaryFilter:{field:ln(t.field),op:"IS_NOT_NAN"}};if($l(t.value))return{unaryFilter:{field:ln(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ln(t.field),op:mg(t.op),value:t.value}}})(n):n instanceof Fe?(function(t){const s=t.getFilters().map((r=>Xu(r)));return s.length===1?s[0]:{compositeFilter:{op:gg(t.op),filters:s}}})(n):B(54877,{filter:n})}function yg(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Zu(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function ed(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
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
 */class wt{constructor(e,t,s,r,i=z.min(),a=z.min(),l=ve.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new wt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new wt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new wt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new wt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class bg{constructor(e){this.yt=e}}function vg(n){const e=hg({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?so(e,e.limit,"L"):e}/**
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
 */class xg{constructor(){this.bn=new wg}addToCollectionParentIndex(e,t){return this.bn.add(t),D.resolve()}getCollectionParents(e,t){return D.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return D.resolve()}deleteFieldIndex(e,t){return D.resolve()}deleteAllFieldIndexes(e){return D.resolve()}createTargetIndexes(e,t){return D.resolve()}getDocumentsMatchingTarget(e,t){return D.resolve(null)}getIndexType(e,t){return D.resolve(0)}getFieldIndexes(e,t){return D.resolve([])}getNextCollectionGroupToUpdate(e){return D.resolve(null)}getMinOffset(e,t){return D.resolve(St.min())}getMinOffsetFromCollectionGroup(e,t){return D.resolve(St.min())}updateCollectionGroup(e,t,s){return D.resolve()}updateIndexEntries(e,t){return D.resolve()}}class wg{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new fe(ne.comparator),i=!r.has(s);return this.index[t]=r.add(s),i}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new fe(ne.comparator)).toArray()}}/**
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
 */const Xl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},td=41943040;class Re{static withCacheSize(e){return new Re(e,Re.DEFAULT_COLLECTION_PERCENTILE,Re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
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
 */Re.DEFAULT_COLLECTION_PERCENTILE=10,Re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Re.DEFAULT=new Re(td,Re.DEFAULT_COLLECTION_PERCENTILE,Re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Re.DISABLED=new Re(-1,0,0);/**
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
 */class _n{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new _n(0)}static ar(){return new _n(-1)}}/**
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
 */const Zl="LruGarbageCollector",nd=1048576;function ec([n,e],[t,s]){const r=Y(n,t);return r===0?Y(e,s):r}class _g{constructor(e){this.Pr=e,this.buffer=new fe(ec),this.Tr=0}Er(){return++this.Tr}Ir(e){const t=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();ec(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Eg{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){$(Zl,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Rn(t)?$(Zl,"Ignoring IndexedDB error during garbage collection: ",t):await Sn(t)}await this.Ar(3e5)}))}}class kg{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return D.resolve(Lr.ce);const s=new _g(t);return this.Vr.forEachTarget(e,(r=>s.Ir(r.sequenceNumber))).next((()=>this.Vr.mr(e,(r=>s.Ir(r))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?($("LruGarbageCollector","Garbage collection skipped; disabled"),D.resolve(Xl)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?($("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Xl):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let s,r,i,a,l,c,d;const h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?($("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),r=this.params.maximumSequenceNumbersToCollect):r=m,a=Date.now(),this.nthSequenceNumber(e,r)))).next((m=>(s=m,l=Date.now(),this.removeTargets(e,s,t)))).next((m=>(i=m,c=Date.now(),this.removeOrphanedDocuments(e,s)))).next((m=>(d=Date.now(),on()<=Q.DEBUG&&$("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-h}ms
	Determined least recently used ${r} in `+(l-a)+`ms
	Removed ${i} targets in `+(c-l)+`ms
	Removed ${m} documents in `+(d-c)+`ms
Total Duration: ${d-h}ms`),D.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:m}))))}}function Ig(n,e){return new kg(n,e)}/**
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
 */class Tg{constructor(){this.changes=new Jt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,_e.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?D.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Ag{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class Sg{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(s=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(s!==null&&ss(s.mutation,r,De.empty(),re.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,J()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=J()){const r=qt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,s).next((i=>{let a=Jn();return i.forEach(((l,c)=>{a=a.insert(l,c.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const s=qt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,J())))}populateOverlays(e,t,s){const r=[];return s.forEach((i=>{t.has(i)||r.push(i)})),this.documentOverlayCache.getOverlays(e,r).next((i=>{i.forEach(((a,l)=>{t.set(a,l)}))}))}computeViews(e,t,s,r){let i=rt();const a=ns(),l=(function(){return ns()})();return t.forEach(((c,d)=>{const h=s.get(d.key);r.has(d.key)&&(h===void 0||h.mutation instanceof Lt)?i=i.insert(d.key,d):h!==void 0?(a.set(d.key,h.mutation.getFieldMask()),ss(h.mutation,d,h.mutation.getFieldMask(),re.now())):a.set(d.key,De.empty())})),this.recalculateAndSaveOverlays(e,i).next((c=>(c.forEach(((d,h)=>a.set(d,h))),t.forEach(((d,h)=>l.set(d,new Ag(h,a.get(d)??null)))),l)))}recalculateAndSaveOverlays(e,t){const s=ns();let r=new ie(((a,l)=>a-l)),i=J();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const l of a)l.keys().forEach((c=>{const d=t.get(c);if(d===null)return;let h=s.get(c)||De.empty();h=l.applyToLocalView(d,h),s.set(c,h);const m=(r.get(l.batchId)||J()).add(c);r=r.insert(l.batchId,m)}))})).next((()=>{const a=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),d=c.key,h=c.value,m=Lu();h.forEach((y=>{if(!i.has(y)){const x=ju(t.get(y),s.get(y));x!==null&&m.set(y,x),i=i.add(y)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return D.waitFor(a)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,r){return Cm(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Pu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next((i=>{const a=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-i.size):D.resolve(qt());let l=ls,c=i;return a.next((d=>D.forEach(d,((h,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),i.get(h)?D.resolve():this.remoteDocumentCache.getEntry(e,h).next((y=>{c=c.insert(h,y)}))))).next((()=>this.populateOverlays(e,d,i))).next((()=>this.computeViews(e,c,d,J()))).next((h=>({batchId:l,changes:Mu(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new F(t)).next((s=>{let r=Jn();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const i=t.collectionGroup;let a=Jn();return this.indexManager.getCollectionParents(e,i).next((l=>D.forEach(l,(c=>{const d=(function(m,y){return new ws(y,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,s,r).next((h=>{h.forEach(((m,y)=>{a=a.insert(m,y)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,s,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,i,r)))).next((a=>{i.forEach(((c,d)=>{const h=d.getKey();a.get(h)===null&&(a=a.insert(h,_e.newInvalidDocument(h)))}));let l=Jn();return a.forEach(((c,d)=>{const h=i.get(c);h!==void 0&&ss(h.mutation,d,De.empty(),re.now()),Ur(t,d)&&(l=l.insert(c,d))})),l}))}}/**
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
 */class Rg{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return D.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:He(r.createTime)}})(t)),D.resolve()}getNamedQuery(e,t){return D.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(r){return{name:r.name,query:vg(r.bundledQuery),readTime:He(r.readTime)}})(t)),D.resolve()}}/**
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
 */class Cg{constructor(){this.overlays=new ie(F.comparator),this.Lr=new Map}getOverlay(e,t){return D.resolve(this.overlays.get(t))}getOverlays(e,t){const s=qt();return D.forEach(t,(r=>this.getOverlay(e,r).next((i=>{i!==null&&s.set(r,i)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((r,i)=>{this.St(e,t,i)})),D.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.Lr.get(s);return r!==void 0&&(r.forEach((i=>this.overlays=this.overlays.remove(i))),this.Lr.delete(s)),D.resolve()}getOverlaysForCollection(e,t,s){const r=qt(),i=t.length+1,a=new F(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const c=l.getNext().value,d=c.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&c.largestBatchId>s&&r.set(c.getKey(),c)}return D.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let i=new ie(((d,h)=>d-h));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>s){let h=i.get(d.largestBatchId);h===null&&(h=qt(),i=i.insert(d.largestBatchId,h)),h.set(d.getKey(),d)}}const l=qt(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((d,h)=>l.set(d,h))),!(l.size()>=r)););return D.resolve(l)}St(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const a=this.Lr.get(r.largestBatchId).delete(s.key);this.Lr.set(r.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new Qm(t,s));let i=this.Lr.get(t);i===void 0&&(i=J(),this.Lr.set(t,i)),this.Lr.set(t,i.add(s.key))}}/**
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
 */class Pg{constructor(){this.sessionToken=ve.EMPTY_BYTE_STRING}getSessionToken(e){return D.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,D.resolve()}}/**
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
 */class Mo{constructor(){this.kr=new fe(ge.qr),this.Kr=new fe(ge.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const s=new ge(e,t);this.kr=this.kr.add(s),this.Kr=this.Kr.add(s)}$r(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new ge(e,t))}Qr(e,t){e.forEach((s=>this.removeReference(s,t)))}Gr(e){const t=new F(new ne([])),s=new ge(t,e),r=new ge(t,e+1),i=[];return this.Kr.forEachInRange([s,r],(a=>{this.Wr(a),i.push(a.key)})),i}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const t=new F(new ne([])),s=new ge(t,e),r=new ge(t,e+1);let i=J();return this.Kr.forEachInRange([s,r],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new ge(e,0),s=this.kr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class ge{constructor(e,t){this.key=e,this.Jr=t}static qr(e,t){return F.comparator(e.key,t.key)||Y(e.Jr,t.Jr)}static Ur(e,t){return Y(e.Jr,t.Jr)||F.comparator(e.key,t.key)}}/**
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
 */class Dg{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new fe(ge.qr)}checkEmpty(e){return D.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const i=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Km(i,t,s,r);this.mutationQueue.push(a);for(const l of r)this.Hr=this.Hr.add(new ge(l.key,i)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return D.resolve(a)}lookupMutationBatch(e,t){return D.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.Xr(s),i=r<0?0:r;return D.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return D.resolve(this.mutationQueue.length===0?ko:this.Yn-1)}getAllMutationBatches(e){return D.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new ge(t,0),r=new ge(t,Number.POSITIVE_INFINITY),i=[];return this.Hr.forEachInRange([s,r],(a=>{const l=this.Zr(a.Jr);i.push(l)})),D.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new fe(Y);return t.forEach((r=>{const i=new ge(r,0),a=new ge(r,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([i,a],(l=>{s=s.add(l.Jr)}))})),D.resolve(this.Yr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let i=s;F.isDocumentKey(i)||(i=i.child(""));const a=new ge(new F(i),0);let l=new fe(Y);return this.Hr.forEachWhile((c=>{const d=c.key.path;return!!s.isPrefixOf(d)&&(d.length===r&&(l=l.add(c.Jr)),!0)}),a),D.resolve(this.Yr(l))}Yr(e){const t=[];return e.forEach((s=>{const r=this.Zr(s);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){ee(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Hr;return D.forEach(t.mutations,(r=>{const i=new ge(r.key,t.batchId);return s=s.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Hr=s}))}nr(e){}containsKey(e,t){const s=new ge(t,0),r=this.Hr.firstAfterOrEqual(s);return D.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,D.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Vg{constructor(e){this.ti=e,this.docs=(function(){return new ie(F.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),i=r?r.size:0,a=this.ti(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return D.resolve(s?s.document.mutableCopy():_e.newInvalidDocument(t))}getEntries(e,t){let s=rt();return t.forEach((r=>{const i=this.docs.get(r);s=s.insert(r,i?i.document.mutableCopy():_e.newInvalidDocument(r))})),D.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let i=rt();const a=t.path,l=new F(a.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:d,value:{document:h}}=c.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||om(im(h),s)<=0||(r.has(h.key)||Ur(t,h))&&(i=i.insert(h.key,h.mutableCopy()))}return D.resolve(i)}getAllFromCollectionGroup(e,t,s,r){B(9500)}ni(e,t){return D.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new Ng(this)}getSize(e){return D.resolve(this.size)}}class Ng extends Tg{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((s,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(s)})),D.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
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
 */class Mg{constructor(e){this.persistence=e,this.ri=new Jt((t=>Ao(t)),So),this.lastRemoteSnapshotVersion=z.min(),this.highestTargetId=0,this.ii=0,this.si=new Mo,this.targetCount=0,this.oi=_n._r()}forEachTarget(e,t){return this.ri.forEach(((s,r)=>t(r))),D.resolve()}getLastRemoteSnapshotVersion(e){return D.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return D.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),D.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.ii&&(this.ii=t),D.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new _n(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,D.resolve()}updateTargetData(e,t){return this.lr(t),D.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,D.resolve()}removeTargets(e,t,s){let r=0;const i=[];return this.ri.forEach(((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.ri.delete(a),i.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)})),D.waitFor(i).next((()=>r))}getTargetCount(e){return D.resolve(this.targetCount)}getTargetData(e,t){const s=this.ri.get(t)||null;return D.resolve(s)}addMatchingKeys(e,t,s){return this.si.$r(t,s),D.resolve()}removeMatchingKeys(e,t,s){this.si.Qr(t,s);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach((a=>{i.push(r.markPotentiallyOrphaned(e,a))})),D.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),D.resolve()}getMatchingKeysForTargetId(e,t){const s=this.si.jr(t);return D.resolve(s)}containsKey(e,t){return D.resolve(this.si.containsKey(t))}}/**
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
 */class sd{constructor(e,t){this._i={},this.overlays={},this.ai=new Lr(0),this.ui=!1,this.ui=!0,this.ci=new Pg,this.referenceDelegate=e(this),this.li=new Mg(this),this.indexManager=new xg,this.remoteDocumentCache=(function(r){return new Vg(r)})((s=>this.referenceDelegate.hi(s))),this.serializer=new bg(t),this.Pi=new Rg(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Cg,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this._i[e.toKey()];return s||(s=new Dg(t,this.referenceDelegate),this._i[e.toKey()]=s),s}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,s){$("MemoryPersistence","Starting transaction:",e);const r=new Lg(this.ai.next());return this.referenceDelegate.Ti(),s(r).next((i=>this.referenceDelegate.Ei(r).next((()=>i)))).toPromise().then((i=>(r.raiseOnCommittedEvent(),i)))}Ii(e,t){return D.or(Object.values(this._i).map((s=>()=>s.containsKey(e,t))))}}class Lg extends lm{constructor(e){super(),this.currentSequenceNumber=e}}class Lo{constructor(e){this.persistence=e,this.Ri=new Mo,this.Ai=null}static Vi(e){return new Lo(e)}get di(){if(this.Ai)return this.Ai;throw B(60996)}addReference(e,t,s){return this.Ri.addReference(s,t),this.di.delete(s.toString()),D.resolve()}removeReference(e,t,s){return this.Ri.removeReference(s,t),this.di.add(s.toString()),D.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),D.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((r=>this.di.add(r.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((i=>this.di.add(i.toString())))})).next((()=>s.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ei(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return D.forEach(this.di,(s=>{const r=F.fromPath(s);return this.mi(e,r).next((i=>{i||t.removeEntry(r,z.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((s=>{s?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return D.or([()=>D.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class vr{constructor(e,t){this.persistence=e,this.fi=new Jt((s=>dm(s.path)),((s,r)=>s.isEqual(r))),this.garbageCollector=Ig(this,t)}static Vi(e,t){return new vr(e,t)}Ti(){}Ei(e){return D.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((r=>s+r))))}pr(e){let t=0;return this.mr(e,(s=>{t++})).next((()=>t))}mr(e,t){return D.forEach(this.fi,((s,r)=>this.wr(e,s,r).next((i=>i?D.resolve():t(r)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ni(e,(a=>this.wr(e,a,t).next((l=>{l||(s++,i.removeEntry(a,z.min()))})))).next((()=>i.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),D.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),D.resolve()}removeReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),D.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),D.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=tr(e.data.value)),t}wr(e,t,s){return D.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.fi.get(t);return D.resolve(r!==void 0&&r>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class $o{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.Ts=s,this.Es=r}static Is(e,t){let s=J(),r=J();for(const i of t.docChanges)switch(i.type){case 0:s=s.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new $o(e,t.fromCache,s,r)}}/**
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
 */class $g{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Og{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return kp()?8:cm(Ee())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,s,r){const i={result:null};return this.gs(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.ps(e,t,r,s).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new $g;return this.ys(e,t,a).next((l=>{if(i.result=l,this.As)return this.ws(e,t,a,l.size)}))})).next((()=>i.result))}ws(e,t,s,r){return s.documentReadCount<this.Vs?(on()<=Q.DEBUG&&$("QueryEngine","SDK will not create cache indexes for query:",an(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),D.resolve()):(on()<=Q.DEBUG&&$("QueryEngine","Query:",an(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.ds*r?(on()<=Q.DEBUG&&$("QueryEngine","The SDK decides to create cache indexes for query:",an(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,qe(t))):D.resolve())}gs(e,t){if(jl(t))return D.resolve(null);let s=qe(t);return this.indexManager.getIndexType(e,s).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=so(t,null,"F"),s=qe(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((i=>{const a=J(...i);return this.fs.getDocuments(e,a).next((l=>this.indexManager.getMinOffset(e,s).next((c=>{const d=this.Ss(t,l);return this.bs(t,d,a,c.readTime)?this.gs(e,so(t,null,"F")):this.Ds(e,d,t,c)}))))})))))}ps(e,t,s,r){return jl(t)||r.isEqual(z.min())?D.resolve(null):this.fs.getDocuments(e,s).next((i=>{const a=this.Ss(t,i);return this.bs(t,a,s,r)?D.resolve(null):(on()<=Q.DEBUG&&$("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),an(t)),this.Ds(e,a,t,rm(r,ls)).next((l=>l)))}))}Ss(e,t){let s=new fe(Vu(e));return t.forEach(((r,i)=>{Ur(e,i)&&(s=s.add(i))})),s}bs(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}ys(e,t,s){return on()<=Q.DEBUG&&$("QueryEngine","Using full collection scan to execute query:",an(t)),this.fs.getDocumentsMatchingQuery(e,t,St.min(),s)}Ds(e,t,s,r){return this.fs.getDocumentsMatchingQuery(e,s,r).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
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
 */const Oo="LocalStore",Fg=3e8;class Ug{constructor(e,t,s,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new ie(Y),this.Fs=new Jt((i=>Ao(i)),So),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(s)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Sg(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function Bg(n,e,t,s){return new Ug(n,e,t,s)}async function rd(n,e){const t=H(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next((i=>(r=i,t.Os(e),t.mutationQueue.getAllMutationBatches(s)))).next((i=>{const a=[],l=[];let c=J();for(const d of r){a.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}for(const d of i){l.push(d.batchId);for(const h of d.mutations)c=c.add(h.key)}return t.localDocuments.getDocuments(s,c).next((d=>({Ns:d,removedBatchIds:a,addedBatchIds:l})))}))}))}function jg(n,e){const t=H(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const r=e.batch.keys(),i=t.xs.newChangeBuffer({trackRemovals:!0});return(function(l,c,d,h){const m=d.batch,y=m.keys();let x=D.resolve();return y.forEach((A=>{x=x.next((()=>h.getEntry(c,A))).next((S=>{const C=d.docVersions.get(A);ee(C!==null,48541),S.version.compareTo(C)<0&&(m.applyToRemoteDocument(S,d),S.isValidDocument()&&(S.setReadTime(d.commitVersion),h.addEntry(S)))}))})),x.next((()=>l.mutationQueue.removeMutationBatch(c,m)))})(t,s,e,i).next((()=>i.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(l){let c=J();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(c=c.add(l.batch.mutations[d].key));return c})(e)))).next((()=>t.localDocuments.getDocuments(s,r)))}))}function id(n){const e=H(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function zg(n,e){const t=H(n),s=e.snapshotVersion;let r=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.xs.newChangeBuffer({trackRemovals:!0});r=t.vs;const l=[];e.targetChanges.forEach(((h,m)=>{const y=r.get(m);if(!y)return;l.push(t.li.removeMatchingKeys(i,h.removedDocuments,m).next((()=>t.li.addMatchingKeys(i,h.addedDocuments,m))));let x=y.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?x=x.withResumeToken(ve.EMPTY_BYTE_STRING,z.min()).withLastLimboFreeSnapshotVersion(z.min()):h.resumeToken.approximateByteSize()>0&&(x=x.withResumeToken(h.resumeToken,s)),r=r.insert(m,x),(function(S,C,N){return S.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=Fg?!0:N.addedDocuments.size+N.modifiedDocuments.size+N.removedDocuments.size>0})(y,x,h)&&l.push(t.li.updateTargetData(i,x))}));let c=rt(),d=J();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),l.push(qg(i,a,e.documentUpdates).next((h=>{c=h.Bs,d=h.Ls}))),!s.isEqual(z.min())){const h=t.li.getLastRemoteSnapshotVersion(i).next((m=>t.li.setTargetsMetadata(i,i.currentSequenceNumber,s)));l.push(h)}return D.waitFor(l).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,c,d))).next((()=>c))})).then((i=>(t.vs=r,i)))}function qg(n,e,t){let s=J(),r=J();return t.forEach((i=>s=s.add(i))),e.getEntries(n,s).next((i=>{let a=rt();return t.forEach(((l,c)=>{const d=i.get(l);c.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(z.min())?(e.removeEntry(l,c.readTime),a=a.insert(l,c)):!d.isValidDocument()||c.version.compareTo(d.version)>0||c.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(c),a=a.insert(l,c)):$(Oo,"Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",c.version)})),{Bs:a,Ls:r}}))}function Hg(n,e){const t=H(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=ko),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function Gg(n,e){const t=H(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let r;return t.li.getTargetData(s,e).next((i=>i?(r=i,D.resolve(r)):t.li.allocateTargetId(s).next((a=>(r=new wt(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.li.addTargetData(s,r).next((()=>r)))))))})).then((s=>{const r=t.vs.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.vs=t.vs.insert(s.targetId,s),t.Fs.set(e,s.targetId)),s}))}async function lo(n,e,t){const s=H(n),r=s.vs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",i,(a=>s.persistence.referenceDelegate.removeTarget(a,r)))}catch(a){if(!Rn(a))throw a;$(Oo,`Failed to update sequence numbers for target ${e}: ${a}`)}s.vs=s.vs.remove(e),s.Fs.delete(r.target)}function tc(n,e,t){const s=H(n);let r=z.min(),i=J();return s.persistence.runTransaction("Execute query","readwrite",(a=>(function(c,d,h){const m=H(c),y=m.Fs.get(h);return y!==void 0?D.resolve(m.vs.get(y)):m.li.getTargetData(d,h)})(s,a,qe(e)).next((l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.li.getMatchingKeysForTargetId(a,l.targetId).next((c=>{i=c}))})).next((()=>s.Cs.getDocumentsMatchingQuery(a,e,t?r:z.min(),t?i:J()))).next((l=>(Wg(s,Dm(e),l),{documents:l,ks:i})))))}function Wg(n,e,t){let s=n.Ms.get(e)||z.min();t.forEach(((r,i)=>{i.readTime.compareTo(s)>0&&(s=i.readTime)})),n.Ms.set(e,s)}class nc{constructor(){this.activeTargetIds=Om()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Kg{constructor(){this.vo=new nc,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,s){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new nc,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Qg{Mo(e){}shutdown(){}}/**
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
 */const sc="ConnectivityMonitor";class rc{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){$(sc,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){$(sc,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Qs=null;function co(){return Qs===null?Qs=(function(){return 268435456+Math.round(2147483648*Math.random())})():Qs++,"0x"+Qs.toString(16)}/**
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
 */const Mi="RestConnection",Yg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Jg{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Ko=t+"://"+e.host,this.Uo=`projects/${s}/databases/${r}`,this.$o=this.databaseId.database===pr?`project_id=${s}`:`project_id=${s}&database_id=${r}`}Wo(e,t,s,r,i){const a=co(),l=this.Qo(e,t.toUriEncodedString());$(Mi,`Sending RPC '${e}' ${a}:`,l,s);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(c,r,i);const{host:d}=new URL(l),h=vs(d);return this.zo(e,l,c,s,h).then((m=>($(Mi,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw bn(Mi,`RPC '${e}' ${a} failed with error: `,m,"url: ",l,"request:",s),m}))}jo(e,t,s,r,i,a){return this.Wo(e,t,s,r,i)}Go(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+An})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,i)=>e[i]=r)),s&&s.headers.forEach(((r,i)=>e[i]=r))}Qo(e,t){const s=Yg[e];let r=`${this.Ko}/v1/${t}:${s}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}/**
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
 */class Xg{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
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
 */const we="WebChannelConnection",Qn=(n,e,t)=>{n.listen(e,(s=>{try{t(s)}catch(r){setTimeout((()=>{throw r}),0)}}))};class dn extends Jg{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!dn.c_){const e=uu();Qn(e,cu.STAT_EVENT,(t=>{t.stat===Yi.PROXY?$(we,"STAT_EVENT: detected buffering proxy"):t.stat===Yi.NOPROXY&&$(we,"STAT_EVENT: detected no buffering proxy")})),dn.c_=!0}}zo(e,t,s,r,i){const a=co();return new Promise(((l,c)=>{const d=new au;d.setWithCredentials(!0),d.listenOnce(lu.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case er.NO_ERROR:const m=d.getResponseJson();$(we,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),l(m);break;case er.TIMEOUT:$(we,`RPC '${e}' ${a} timed out`),c(new M(P.DEADLINE_EXCEEDED,"Request time out"));break;case er.HTTP_ERROR:const y=d.getStatus();if($(we,`RPC '${e}' ${a} failed with status:`,y,"response text:",d.getResponseText()),y>0){let x=d.getResponseJson();Array.isArray(x)&&(x=x[0]);const A=x==null?void 0:x.error;if(A&&A.status&&A.message){const S=(function(N){const L=N.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(L)>=0?L:P.UNKNOWN})(A.status);c(new M(S,A.message))}else c(new M(P.UNKNOWN,"Server responded with status "+d.getStatus()))}else c(new M(P.UNAVAILABLE,"Connection failed."));break;default:B(9055,{l_:e,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{$(we,`RPC '${e}' ${a} completed.`)}}));const h=JSON.stringify(r);$(we,`RPC '${e}' ${a} sending request:`,r),d.send(t,"POST",h,s,15)}))}T_(e,t,s){const r=co(),i=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(l.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Go(l.initMessageHeaders,t,s),l.encodeInitMessageHeaders=!0;const d=i.join("");$(we,`Creating RPC '${e}' stream ${r}: ${d}`,l);const h=a.createWebChannel(d,l);this.E_(h);let m=!1,y=!1;const x=new Xg({Jo:A=>{y?$(we,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(m||($(we,`Opening RPC '${e}' stream ${r} transport.`),h.open(),m=!0),$(we,`RPC '${e}' stream ${r} sending:`,A),h.send(A))},Ho:()=>h.close()});return Qn(h,Yn.EventType.OPEN,(()=>{y||($(we,`RPC '${e}' stream ${r} transport opened.`),x.i_())})),Qn(h,Yn.EventType.CLOSE,(()=>{y||(y=!0,$(we,`RPC '${e}' stream ${r} transport closed`),x.o_(),this.I_(h))})),Qn(h,Yn.EventType.ERROR,(A=>{y||(y=!0,bn(we,`RPC '${e}' stream ${r} transport errored. Name:`,A.name,"Message:",A.message),x.o_(new M(P.UNAVAILABLE,"The operation could not be completed")))})),Qn(h,Yn.EventType.MESSAGE,(A=>{var S;if(!y){const C=A.data[0];ee(!!C,16349);const N=C,L=(N==null?void 0:N.error)||((S=N[0])==null?void 0:S.error);if(L){$(we,`RPC '${e}' stream ${r} received error:`,L);const K=L.status;let q=(function(_){const b=ue[_];if(b!==void 0)return qu(b)})(K),G=L.message;K==="NOT_FOUND"&&G.includes("database")&&G.includes("does not exist")&&G.includes(this.databaseId.database)&&bn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),q===void 0&&(q=P.INTERNAL,G="Unknown error status: "+K+" with message "+L.message),y=!0,x.o_(new M(q,G)),h.close()}else $(we,`RPC '${e}' stream ${r} received:`,C),x.__(C)}})),dn.u_(),setTimeout((()=>{x.s_()}),0),x}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,s){super.Go(e,t,s),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return du()}}/**
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
 */function Zg(n){return new dn(n)}function Li(){return typeof document<"u"?document:null}/**
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
 */function qr(n){return new rg(n,!0)}/**
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
 */dn.c_=!1;class od{constructor(e,t,s=1e3,r=1.5,i=6e4){this.Ci=e,this.timerId=t,this.R_=s,this.A_=r,this.V_=i,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),s=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-s);r>0&&$("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */const ic="PersistentStream";class ad{constructor(e,t,s,r,i,a,l,c){this.Ci=e,this.S_=s,this.b_=r,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new od(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(st(t.toString()),st("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,r])=>{this.D_===t&&this.G_(s,r)}),(s=>{e((()=>{const r=new M(P.UNKNOWN,"Fetching auth token failed: "+s.message);return this.z_(r)}))}))}G_(e,t){const s=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.Yo((()=>{s((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((r=>{s((()=>this.z_(r)))})),this.stream.onMessage((r=>{s((()=>++this.F_==1?this.J_(r):this.onNext(r)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return $(ic,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():($(ic,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class e0 extends ad{constructor(e,t,s,r,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=ag(this.serializer,e),s=(function(i){if(!("targetChange"in i))return z.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?z.min():a.readTime?He(a.readTime):z.min()})(e);return this.listener.H_(t,s)}Z_(e){const t={};t.database=ao(this.serializer),t.addTarget=(function(i,a){let l;const c=a.target;if(l=to(c)?{documents:ug(i,c)}:{query:dg(i,c).ft},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Wu(i,a.resumeToken);const d=ro(i,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(z.min())>0){l.readTime=br(i,a.snapshotVersion.toTimestamp());const d=ro(i,a.expectedCount);d!==null&&(l.expectedCount=d)}return l})(this.serializer,e);const s=pg(this.serializer,e);s&&(t.labels=s),this.q_(t)}X_(e){const t={};t.database=ao(this.serializer),t.removeTarget=e,this.q_(t)}}class t0 extends ad{constructor(e,t,s,r,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,a),this.serializer=i}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return ee(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ee(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){ee(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=cg(e.writeResults,e.commitTime),s=He(e.commitTime);return this.listener.na(s,t)}ra(){const e={};e.database=ao(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>lg(this.serializer,s)))};this.q_(t)}}/**
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
 */class n0{}class s0 extends n0{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.Wo(e,io(t,s),r,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new M(P.UNKNOWN,i.toString())}))}jo(e,t,s,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,l])=>this.connection.jo(e,io(t,s),r,a,l,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new M(P.UNKNOWN,a.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function r0(n,e,t,s){return new s0(n,e,t,s)}class i0{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(st(t),this.aa=!1):$("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const Qt="RemoteStore";class o0{constructor(e,t,s,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=i,this.Aa.Mo((a=>{s.enqueueAndForget((async()=>{Xt(this)&&($(Qt,"Restarting streams for network reachability change."),await(async function(c){const d=H(c);d.Ia.add(4),await ks(d),d.Va.set("Unknown"),d.Ia.delete(4),await Hr(d)})(this))}))})),this.Va=new i0(s,r)}}async function Hr(n){if(Xt(n))for(const e of n.Ra)await e(!0)}async function ks(n){for(const e of n.Ra)await e(!1)}function ld(n,e){const t=H(n);t.Ea.has(e.targetId)||(t.Ea.set(e.targetId,e),jo(t)?Bo(t):Cn(t).O_()&&Uo(t,e))}function Fo(n,e){const t=H(n),s=Cn(t);t.Ea.delete(e),s.O_()&&cd(t,e),t.Ea.size===0&&(s.O_()?s.L_():Xt(t)&&t.Va.set("Unknown"))}function Uo(n,e){if(n.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(z.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Cn(n).Z_(e)}function cd(n,e){n.da.$e(e),Cn(n).X_(e)}function Bo(n){n.da=new eg({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),At:e=>n.Ea.get(e)||null,ht:()=>n.datastore.serializer.databaseId}),Cn(n).start(),n.Va.ua()}function jo(n){return Xt(n)&&!Cn(n).x_()&&n.Ea.size>0}function Xt(n){return H(n).Ia.size===0}function ud(n){n.da=void 0}async function a0(n){n.Va.set("Online")}async function l0(n){n.Ea.forEach(((e,t)=>{Uo(n,e)}))}async function c0(n,e){ud(n),jo(n)?(n.Va.ha(e),Bo(n)):n.Va.set("Unknown")}async function u0(n,e,t){if(n.Va.set("Online"),e instanceof Gu&&e.state===2&&e.cause)try{await(async function(r,i){const a=i.cause;for(const l of i.targetIds)r.Ea.has(l)&&(await r.remoteSyncer.rejectListen(l,a),r.Ea.delete(l),r.da.removeTarget(l))})(n,e)}catch(s){$(Qt,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await xr(n,s)}else if(e instanceof rr?n.da.Xe(e):e instanceof Hu?n.da.st(e):n.da.tt(e),!t.isEqual(z.min()))try{const s=await id(n.localStore);t.compareTo(s)>=0&&await(function(i,a){const l=i.da.Tt(a);return l.targetChanges.forEach(((c,d)=>{if(c.resumeToken.approximateByteSize()>0){const h=i.Ea.get(d);h&&i.Ea.set(d,h.withResumeToken(c.resumeToken,a))}})),l.targetMismatches.forEach(((c,d)=>{const h=i.Ea.get(c);if(!h)return;i.Ea.set(c,h.withResumeToken(ve.EMPTY_BYTE_STRING,h.snapshotVersion)),cd(i,c);const m=new wt(h.target,c,d,h.sequenceNumber);Uo(i,m)})),i.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(s){$(Qt,"Failed to raise snapshot:",s),await xr(n,s)}}async function xr(n,e,t){if(!Rn(e))throw e;n.Ia.add(1),await ks(n),n.Va.set("Offline"),t||(t=()=>id(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{$(Qt,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Hr(n)}))}function dd(n,e){return e().catch((t=>xr(n,t,e)))}async function Gr(n){const e=H(n),t=Dt(e);let s=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:ko;for(;d0(e);)try{const r=await Hg(e.localStore,s);if(r===null){e.Ta.length===0&&t.L_();break}s=r.batchId,h0(e,r)}catch(r){await xr(e,r)}hd(e)&&pd(e)}function d0(n){return Xt(n)&&n.Ta.length<10}function h0(n,e){n.Ta.push(e);const t=Dt(n);t.O_()&&t.Y_&&t.ea(e.mutations)}function hd(n){return Xt(n)&&!Dt(n).x_()&&n.Ta.length>0}function pd(n){Dt(n).start()}async function p0(n){Dt(n).ra()}async function f0(n){const e=Dt(n);for(const t of n.Ta)e.ea(t.mutations)}async function m0(n,e,t){const s=n.Ta.shift(),r=Do.from(s,e,t);await dd(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await Gr(n)}async function g0(n,e){e&&Dt(n).Y_&&await(async function(s,r){if((function(a){return Jm(a)&&a!==P.ABORTED})(r.code)){const i=s.Ta.shift();Dt(s).B_(),await dd(s,(()=>s.remoteSyncer.rejectFailedWrite(i.batchId,r))),await Gr(s)}})(n,e),hd(n)&&pd(n)}async function oc(n,e){const t=H(n);t.asyncQueue.verifyOperationInProgress(),$(Qt,"RemoteStore received new credentials");const s=Xt(t);t.Ia.add(3),await ks(t),s&&t.Va.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Hr(t)}async function y0(n,e){const t=H(n);e?(t.Ia.delete(2),await Hr(t)):e||(t.Ia.add(2),await ks(t),t.Va.set("Unknown"))}function Cn(n){return n.ma||(n.ma=(function(t,s,r){const i=H(t);return i.sa(),new e0(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)})(n.datastore,n.asyncQueue,{Zo:a0.bind(null,n),Yo:l0.bind(null,n),t_:c0.bind(null,n),H_:u0.bind(null,n)}),n.Ra.push((async e=>{e?(n.ma.B_(),jo(n)?Bo(n):n.Va.set("Unknown")):(await n.ma.stop(),ud(n))}))),n.ma}function Dt(n){return n.fa||(n.fa=(function(t,s,r){const i=H(t);return i.sa(),new t0(s,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),Yo:p0.bind(null,n),t_:g0.bind(null,n),ta:f0.bind(null,n),na:m0.bind(null,n)}),n.Ra.push((async e=>{e?(n.fa.B_(),await Gr(n)):(await n.fa.stop(),n.Ta.length>0&&($(Qt,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))}))),n.fa}/**
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
 */class zo{constructor(e,t,s,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=i,this.deferred=new tt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,i){const a=Date.now()+s,l=new zo(e,t,a,r,i);return l.start(s),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function qo(n,e){if(st("AsyncQueue",`${e}: ${n}`),Rn(n))return new M(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class hn{static emptySet(e){return new hn(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||F.comparator(t.key,s.key):(t,s)=>F.comparator(t.key,s.key),this.keyedMap=Jn(),this.sortedSet=new ie(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof hn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=s.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new hn;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class ac{constructor(){this.ga=new ie(F.comparator)}track(e){const t=e.doc.key,s=this.ga.get(t);s?e.type!==0&&s.type===3?this.ga=this.ga.insert(t,e):e.type===3&&s.type!==1?this.ga=this.ga.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.ga=this.ga.remove(t):e.type===1&&s.type===2?this.ga=this.ga.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):B(63341,{Vt:e,pa:s}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,s)=>{e.push(s)})),e}}class En{constructor(e,t,s,r,i,a,l,c,d){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=d}static fromInitialDocuments(e,t,s,r,i){const a=[];return t.forEach((l=>{a.push({type:0,doc:l})})),new En(e,t,hn.emptySet(t),a,s,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Fr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
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
 */class b0{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class v0{constructor(){this.queries=lc(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,s){const r=H(t),i=r.queries;r.queries=lc(),i.forEach(((a,l)=>{for(const c of l.Sa)c.onError(s)}))})(this,new M(P.ABORTED,"Firestore shutting down"))}}function lc(){return new Jt((n=>Du(n)),Fr)}async function fd(n,e){const t=H(n);let s=3;const r=e.query;let i=t.queries.get(r);i?!i.ba()&&e.Da()&&(s=2):(i=new b0,s=e.Da()?0:1);try{switch(s){case 0:i.wa=await t.onListen(r,!0);break;case 1:i.wa=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(a){const l=qo(a,`Initialization of query '${an(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,i),i.Sa.push(e),e.va(t.onlineState),i.wa&&e.Fa(i.wa)&&Ho(t)}async function md(n,e){const t=H(n),s=e.query;let r=3;const i=t.queries.get(s);if(i){const a=i.Sa.indexOf(e);a>=0&&(i.Sa.splice(a,1),i.Sa.length===0?r=e.Da()?0:1:!i.ba()&&e.Da()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function x0(n,e){const t=H(n);let s=!1;for(const r of e){const i=r.query,a=t.queries.get(i);if(a){for(const l of a.Sa)l.Fa(r)&&(s=!0);a.wa=r}}s&&Ho(t)}function w0(n,e,t){const s=H(n),r=s.queries.get(e);if(r)for(const i of r.Sa)i.onError(t);s.queries.delete(e)}function Ho(n){n.Ca.forEach((e=>{e.next()}))}var uo,cc;(cc=uo||(uo={})).Ma="default",cc.Cache="cache";class gd{constructor(e,t,s){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=s||{}}Fa(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new En(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const s=t!=="Offline";return(!this.options.qa||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=En.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==uo.Cache}}/**
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
 */class yd{constructor(e){this.key=e}}class bd{constructor(e){this.key=e}}class _0{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=J(),this.mutatedKeys=J(),this.eu=Vu(e),this.tu=new hn(this.eu)}get nu(){return this.Za}ru(e,t){const s=t?t.iu:new ac,r=t?t.tu:this.tu;let i=t?t.mutatedKeys:this.mutatedKeys,a=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((h,m)=>{const y=r.get(h),x=Ur(this.query,m)?m:null,A=!!y&&this.mutatedKeys.has(y.key),S=!!x&&(x.hasLocalMutations||this.mutatedKeys.has(x.key)&&x.hasCommittedMutations);let C=!1;y&&x?y.data.isEqual(x.data)?A!==S&&(s.track({type:3,doc:x}),C=!0):this.su(y,x)||(s.track({type:2,doc:x}),C=!0,(c&&this.eu(x,c)>0||d&&this.eu(x,d)<0)&&(l=!0)):!y&&x?(s.track({type:0,doc:x}),C=!0):y&&!x&&(s.track({type:1,doc:y}),C=!0,(c||d)&&(l=!0)),C&&(x?(a=a.add(x),i=S?i.add(h):i.delete(h)):(a=a.delete(h),i=i.delete(h)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const h=this.query.limitType==="F"?a.last():a.first();a=a.delete(h.key),i=i.delete(h.key),s.track({type:1,doc:h})}return{tu:a,iu:s,bs:l,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort(((h,m)=>(function(x,A){const S=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return B(20277,{Vt:C})}};return S(x)-S(A)})(h.type,m.type)||this.eu(h.doc,m.doc))),this.ou(s),r=r??!1;const l=t&&!r?this._u():[],c=this.Ya.size===0&&this.current&&!r?1:0,d=c!==this.Xa;return this.Xa=c,a.length!==0||d?{snapshot:new En(this.query,e.tu,i,a,e.mutatedKeys,c===0,d,!1,!!s&&s.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new ac,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Za=this.Za.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Za=this.Za.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=J(),this.tu.forEach((s=>{this.uu(s.key)&&(this.Ya=this.Ya.add(s.key))}));const t=[];return e.forEach((s=>{this.Ya.has(s)||t.push(new bd(s))})),this.Ya.forEach((s=>{e.has(s)||t.push(new yd(s))})),t}cu(e){this.Za=e.ks,this.Ya=J();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return En.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Go="SyncEngine";class E0{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class k0{constructor(e){this.key=e,this.hu=!1}}class I0{constructor(e,t,s,r,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new Jt((l=>Du(l)),Fr),this.Eu=new Map,this.Iu=new Set,this.Ru=new ie(F.comparator),this.Au=new Map,this.Vu=new Mo,this.du={},this.mu=new Map,this.fu=_n.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function T0(n,e,t=!0){const s=kd(n);let r;const i=s.Tu.get(e);return i?(s.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.lu()):r=await vd(s,e,t,!0),r}async function A0(n,e){const t=kd(n);await vd(t,e,!0,!1)}async function vd(n,e,t,s){const r=await Gg(n.localStore,qe(e)),i=r.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let l;return s&&(l=await S0(n,e,i,a==="current",r.resumeToken)),n.isPrimaryClient&&t&&ld(n.remoteStore,r),l}async function S0(n,e,t,s,r){n.pu=(m,y,x)=>(async function(S,C,N,L){let K=C.view.ru(N);K.bs&&(K=await tc(S.localStore,C.query,!1).then((({documents:_})=>C.view.ru(_,K))));const q=L&&L.targetChanges.get(C.targetId),G=L&&L.targetMismatches.get(C.targetId)!=null,X=C.view.applyChanges(K,S.isPrimaryClient,q,G);return dc(S,C.targetId,X.au),X.snapshot})(n,m,y,x);const i=await tc(n.localStore,e,!0),a=new _0(e,i.ks),l=a.ru(i.documents),c=Es.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),d=a.applyChanges(l,n.isPrimaryClient,c);dc(n,t,d.au);const h=new E0(e,t,a);return n.Tu.set(e,h),n.Eu.has(t)?n.Eu.get(t).push(e):n.Eu.set(t,[e]),d.snapshot}async function R0(n,e,t){const s=H(n),r=s.Tu.get(e),i=s.Eu.get(r.targetId);if(i.length>1)return s.Eu.set(r.targetId,i.filter((a=>!Fr(a,e)))),void s.Tu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await lo(s.localStore,r.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(r.targetId),t&&Fo(s.remoteStore,r.targetId),ho(s,r.targetId)})).catch(Sn)):(ho(s,r.targetId),await lo(s.localStore,r.targetId,!0))}async function C0(n,e){const t=H(n),s=t.Tu.get(e),r=t.Eu.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Fo(t.remoteStore,s.targetId))}async function P0(n,e,t){const s=O0(n);try{const r=await(function(a,l){const c=H(a),d=re.now(),h=l.reduce(((x,A)=>x.add(A.key)),J());let m,y;return c.persistence.runTransaction("Locally write mutations","readwrite",(x=>{let A=rt(),S=J();return c.xs.getEntries(x,h).next((C=>{A=C,A.forEach(((N,L)=>{L.isValidDocument()||(S=S.add(N))}))})).next((()=>c.localDocuments.getOverlayedDocuments(x,A))).next((C=>{m=C;const N=[];for(const L of l){const K=Gm(L,m.get(L.key).overlayedDocument);K!=null&&N.push(new Lt(L.key,K,ku(K.value.mapValue),Ne.exists(!0)))}return c.mutationQueue.addMutationBatch(x,d,N,l)})).next((C=>{y=C;const N=C.applyToLocalDocumentSet(m,S);return c.documentOverlayCache.saveOverlays(x,C.batchId,N)}))})).then((()=>({batchId:y.batchId,changes:Mu(m)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),(function(a,l,c){let d=a.du[a.currentUser.toKey()];d||(d=new ie(Y)),d=d.insert(l,c),a.du[a.currentUser.toKey()]=d})(s,r.batchId,t),await Is(s,r.changes),await Gr(s.remoteStore)}catch(r){const i=qo(r,"Failed to persist write");t.reject(i)}}async function xd(n,e){const t=H(n);try{const s=await zg(t.localStore,e);e.targetChanges.forEach(((r,i)=>{const a=t.Au.get(i);a&&(ee(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?a.hu=!0:r.modifiedDocuments.size>0?ee(a.hu,14607):r.removedDocuments.size>0&&(ee(a.hu,42227),a.hu=!1))})),await Is(t,s,e)}catch(s){await Sn(s)}}function uc(n,e,t){const s=H(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Tu.forEach(((i,a)=>{const l=a.view.va(e);l.snapshot&&r.push(l.snapshot)})),(function(a,l){const c=H(a);c.onlineState=l;let d=!1;c.queries.forEach(((h,m)=>{for(const y of m.Sa)y.va(l)&&(d=!0)})),d&&Ho(c)})(s.eventManager,e),r.length&&s.Pu.H_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function D0(n,e,t){const s=H(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Au.get(e),i=r&&r.key;if(i){let a=new ie(F.comparator);a=a.insert(i,_e.newNoDocument(i,z.min()));const l=J().add(i),c=new zr(z.min(),new Map,new ie(Y),a,l);await xd(s,c),s.Ru=s.Ru.remove(i),s.Au.delete(e),Wo(s)}else await lo(s.localStore,e,!1).then((()=>ho(s,e,t))).catch(Sn)}async function V0(n,e){const t=H(n),s=e.batch.batchId;try{const r=await jg(t.localStore,e);_d(t,s,null),wd(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Is(t,r)}catch(r){await Sn(r)}}async function N0(n,e,t){const s=H(n);try{const r=await(function(a,l){const c=H(a);return c.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let h;return c.mutationQueue.lookupMutationBatch(d,l).next((m=>(ee(m!==null,37113),h=m.keys(),c.mutationQueue.removeMutationBatch(d,m)))).next((()=>c.mutationQueue.performConsistencyCheck(d))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(d,h,l))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,h))).next((()=>c.localDocuments.getDocuments(d,h)))}))})(s.localStore,e);_d(s,e,t),wd(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Is(s,r)}catch(r){await Sn(r)}}function wd(n,e){(n.mu.get(e)||[]).forEach((t=>{t.resolve()})),n.mu.delete(e)}function _d(n,e,t){const s=H(n);let r=s.du[s.currentUser.toKey()];if(r){const i=r.get(e);i&&(t?i.reject(t):i.resolve(),r=r.remove(e)),s.du[s.currentUser.toKey()]=r}}function ho(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Eu.get(e))n.Tu.delete(s),t&&n.Pu.yu(s,t);n.Eu.delete(e),n.isPrimaryClient&&n.Vu.Gr(e).forEach((s=>{n.Vu.containsKey(s)||Ed(n,s)}))}function Ed(n,e){n.Iu.delete(e.path.canonicalString());const t=n.Ru.get(e);t!==null&&(Fo(n.remoteStore,t),n.Ru=n.Ru.remove(e),n.Au.delete(t),Wo(n))}function dc(n,e,t){for(const s of t)s instanceof yd?(n.Vu.addReference(s.key,e),M0(n,s)):s instanceof bd?($(Go,"Document no longer in limbo: "+s.key),n.Vu.removeReference(s.key,e),n.Vu.containsKey(s.key)||Ed(n,s.key)):B(19791,{wu:s})}function M0(n,e){const t=e.key,s=t.path.canonicalString();n.Ru.get(t)||n.Iu.has(s)||($(Go,"New document in limbo: "+t),n.Iu.add(s),Wo(n))}function Wo(n){for(;n.Iu.size>0&&n.Ru.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new F(ne.fromString(e)),s=n.fu.next();n.Au.set(s,new k0(t)),n.Ru=n.Ru.insert(t,s),ld(n.remoteStore,new wt(qe(Ro(t.path)),s,"TargetPurposeLimboResolution",Lr.ce))}}async function Is(n,e,t){const s=H(n),r=[],i=[],a=[];s.Tu.isEmpty()||(s.Tu.forEach(((l,c)=>{a.push(s.pu(c,e,t).then((d=>{var h;if((d||t)&&s.isPrimaryClient){const m=d?!d.fromCache:(h=t==null?void 0:t.targetChanges.get(c.targetId))==null?void 0:h.current;s.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(d){r.push(d);const m=$o.Is(c.targetId,d);i.push(m)}})))})),await Promise.all(a),s.Pu.H_(r),await(async function(c,d){const h=H(c);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>D.forEach(d,(y=>D.forEach(y.Ts,(x=>h.persistence.referenceDelegate.addReference(m,y.targetId,x))).next((()=>D.forEach(y.Es,(x=>h.persistence.referenceDelegate.removeReference(m,y.targetId,x)))))))))}catch(m){if(!Rn(m))throw m;$(Oo,"Failed to update sequence numbers: "+m)}for(const m of d){const y=m.targetId;if(!m.fromCache){const x=h.vs.get(y),A=x.snapshotVersion,S=x.withLastLimboFreeSnapshotVersion(A);h.vs=h.vs.insert(y,S)}}})(s.localStore,i))}async function L0(n,e){const t=H(n);if(!t.currentUser.isEqual(e)){$(Go,"User change. New user:",e.toKey());const s=await rd(t.localStore,e);t.currentUser=e,(function(i,a){i.mu.forEach((l=>{l.forEach((c=>{c.reject(new M(P.CANCELLED,a))}))})),i.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Is(t,s.Ns)}}function $0(n,e){const t=H(n),s=t.Au.get(e);if(s&&s.hu)return J().add(s.key);{let r=J();const i=t.Eu.get(e);if(!i)return r;for(const a of i){const l=t.Tu.get(a);r=r.unionWith(l.view.nu)}return r}}function kd(n){const e=H(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=xd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=$0.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=D0.bind(null,e),e.Pu.H_=x0.bind(null,e.eventManager),e.Pu.yu=w0.bind(null,e.eventManager),e}function O0(n){const e=H(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=V0.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=N0.bind(null,e),e}class wr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=qr(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Bg(this.persistence,new Og,e.initialUser,this.serializer)}Cu(e){return new sd(Lo.Vi,this.serializer)}Du(e){return new Kg}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}wr.provider={build:()=>new wr};class F0 extends wr{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){ee(this.persistence.referenceDelegate instanceof vr,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new Eg(s,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Re.withCacheSize(this.cacheSizeBytes):Re.DEFAULT;return new sd((s=>vr.Vi(s,t)),this.serializer)}}class po{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>uc(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=L0.bind(null,this.syncEngine),await y0(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new v0})()}createDatastore(e){const t=qr(e.databaseInfo.databaseId),s=Zg(e.databaseInfo);return r0(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,r,i,a,l){return new o0(s,r,i,a,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>uc(this.syncEngine,t,0)),(function(){return rc.v()?new rc:new Qg})())}createSyncEngine(e,t){return(function(r,i,a,l,c,d,h){const m=new I0(r,i,a,l,c,d);return h&&(m.gu=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const i=H(r);$(Qt,"RemoteStore shutting down."),i.Ia.add(5),await ks(i),i.Aa.shutdown(),i.Va.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}po.provider={build:()=>new po};/**
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
 */class Id{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):st("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Vt="FirestoreClient";class U0{constructor(e,t,s,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this._databaseInfo=r,this.user=Se.UNAUTHENTICATED,this.clientId=Eo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(s,(async a=>{$(Vt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(s,(a=>($(Vt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new tt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=qo(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function $i(n,e){n.asyncQueue.verifyOperationInProgress(),$(Vt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async r=>{s.isEqual(r)||(await rd(e.localStore,r),s=r)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function hc(n,e){n.asyncQueue.verifyOperationInProgress();const t=await B0(n);$(Vt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>oc(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,r)=>oc(e.remoteStore,r))),n._onlineComponents=e}async function B0(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){$(Vt,"Using user provided OfflineComponentProvider");try{await $i(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===P.FAILED_PRECONDITION||r.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;bn("Error using user provided cache. Falling back to memory cache: "+t),await $i(n,new wr)}}else $(Vt,"Using default OfflineComponentProvider"),await $i(n,new F0(void 0));return n._offlineComponents}async function Td(n){return n._onlineComponents||(n._uninitializedComponentsProvider?($(Vt,"Using user provided OnlineComponentProvider"),await hc(n,n._uninitializedComponentsProvider._online)):($(Vt,"Using default OnlineComponentProvider"),await hc(n,new po))),n._onlineComponents}function j0(n){return Td(n).then((e=>e.syncEngine))}async function Ad(n){const e=await Td(n),t=e.eventManager;return t.onListen=T0.bind(null,e.syncEngine),t.onUnlisten=R0.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=A0.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=C0.bind(null,e.syncEngine),t}function z0(n,e,t={}){const s=new tt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,l,c,d){const h=new Id({next:y=>{h.Nu(),a.enqueueAndForget((()=>md(i,m)));const x=y.docs.has(l);!x&&y.fromCache?d.reject(new M(P.UNAVAILABLE,"Failed to get document because the client is offline.")):x&&y.fromCache&&c&&c.source==="server"?d.reject(new M(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new gd(Ro(l.path),h,{includeMetadataChanges:!0,qa:!0});return fd(i,m)})(await Ad(n),n.asyncQueue,e,t,s))),s.promise}function q0(n,e,t={}){const s=new tt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,l,c,d){const h=new Id({next:y=>{h.Nu(),a.enqueueAndForget((()=>md(i,m))),y.fromCache&&c.source==="server"?d.reject(new M(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(y)},error:y=>d.reject(y)}),m=new gd(l,h,{includeMetadataChanges:!0,qa:!0});return fd(i,m)})(await Ad(n),n.asyncQueue,e,t,s))),s.promise}function H0(n,e){const t=new tt;return n.asyncQueue.enqueueAndForget((async()=>P0(await j0(n),e,t))),t.promise}/**
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
 */function Sd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const G0="ComponentProvider",pc=new Map;function W0(n,e,t,s,r){return new fm(n,e,t,r.host,r.ssl,r.experimentalForceLongPolling,r.experimentalAutoDetectLongPolling,Sd(r.experimentalLongPollingOptions),r.useFetchStreams,r.isUsingEmulator,s)}/**
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
 */const K0="firestore.googleapis.com",fc=!0;class mc{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new M(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=K0,this.ssl=fc}else this.host=e.host,this.ssl=e.ssl??fc;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=td;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<nd)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}sm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Sd(e.experimentalLongPollingOptions??{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,r){return s.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Ko{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new mc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new mc(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new Kf;switch(s.type){case"firstParty":return new Jf(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new M(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=pc.get(t);s&&($(G0,"Removing Datastore"),pc.delete(t),s.terminate())})(this),Promise.resolve()}}/**
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
 */class Pn{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Pn(this.firestore,e,this._query)}}class ce{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Tt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ce(this.firestore,e,this._key)}toJSON(){return{type:ce._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(xs(t,ce._jsonSchema))return new ce(e,s||null,new F(ne.fromString(t.referencePath)))}}ce._jsonSchemaVersion="firestore/documentReference/1.0",ce._jsonSchema={type:he("string",ce._jsonSchemaVersion),referencePath:he("string")};class Tt extends Pn{constructor(e,t,s){super(e,t,Ro(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ce(this.firestore,null,new F(e))}withConverter(e){return new Tt(this.firestore,e,this._path)}}function Qo(n,e,...t){if(n=Te(n),pu("collection","path",e),n instanceof Ko){const s=ne.fromString(e,...t);return Sl(s),new Tt(n,null,s)}{if(!(n instanceof ce||n instanceof Tt))throw new M(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ne.fromString(e,...t));return Sl(s),new Tt(n.firestore,null,s)}}function Xe(n,e,...t){if(n=Te(n),arguments.length===1&&(e=Eo.newId()),pu("doc","path",e),n instanceof Ko){const s=ne.fromString(e,...t);return Al(s),new ce(n,null,new F(s))}{if(!(n instanceof ce||n instanceof Tt))throw new M(P.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(ne.fromString(e,...t));return Al(s),new ce(n.firestore,n instanceof Tt?n.converter:null,new F(s))}}/**
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
 */const gc="AsyncQueue";class yc{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new od(this,"async_queue_retry"),this._c=()=>{const s=Li();s&&$(gc,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=Li();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Li();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new tt;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Rn(e))throw e;$(gc,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((s=>{throw this.nc=s,this.rc=!1,st("INTERNAL UNHANDLED ERROR: ",bc(s)),s})).then((s=>(this.rc=!1,s))))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=zo.createAndSchedule(this,e,t,s,(i=>this.hc(i)));return this.tc.push(r),r}uc(){this.nc&&B(47125,{Pc:bc(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function bc(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Zt extends Ko{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new yc,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new yc(e),this._firestoreClient=void 0,await e}}}function Q0(n,e,t){t||(t=pr);const s=wo(n,"firestore");if(s.isInitialized(t)){const r=s.getImmediate({identifier:t}),i=s.getOptions(t);if(Gt(i,e))return r;throw new M(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new M(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<nd)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&vs(e.host)&&eu(e.host),s.initialize({options:e,instanceIdentifier:t})}function Yo(n){if(n._terminated)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Y0(n),n._firestoreClient}function Y0(n){var s,r,i,a;const e=n._freezeSettings(),t=W0(n._databaseId,((s=n._app)==null?void 0:s.options.appId)||"",n._persistenceKey,(r=n._app)==null?void 0:r.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new U0(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(c){const d=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(d),_online:d}})(n._componentsProvider))}/**
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
 */class Ve{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ve(ve.fromBase64String(e))}catch(t){throw new M(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ve(ve.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ve._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(xs(e,Ve._jsonSchema))return Ve.fromBase64String(e.bytes)}}Ve._jsonSchemaVersion="firestore/bytes/1.0",Ve._jsonSchema={type:he("string",Ve._jsonSchemaVersion),bytes:he("string")};/**
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
 */class Jo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Wr{constructor(e){this._methodName=e}}/**
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
 */class Ge{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new M(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Y(this._lat,e._lat)||Y(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ge._jsonSchemaVersion}}static fromJSON(e){if(xs(e,Ge._jsonSchema))return new Ge(e.latitude,e.longitude)}}Ge._jsonSchemaVersion="firestore/geoPoint/1.0",Ge._jsonSchema={type:he("string",Ge._jsonSchemaVersion),latitude:he("number"),longitude:he("number")};/**
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
 */class Oe{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,r){if(s.length!==r.length)return!1;for(let i=0;i<s.length;++i)if(s[i]!==r[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Oe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(xs(e,Oe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Oe(e.vectorValues);throw new M(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Oe._jsonSchemaVersion="firestore/vectorValue/1.0",Oe._jsonSchema={type:he("string",Oe._jsonSchemaVersion),vectorValues:he("object")};/**
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
 */const J0=/^__.*__$/;class X0{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Lt(e,this.data,this.fieldMask,t,this.fieldTransforms):new _s(e,this.data,t,this.fieldTransforms)}}class Rd{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new Lt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Cd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw B(40011,{dataSource:n})}}class Xo{constructor(e,t,s,r,i,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,i===void 0&&this.Ac(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Xo({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var r;const t=(r=this.path)==null?void 0:r.child(e),s=this.i({path:t,arrayElement:!1});return s.mc(e),s}fc(e){var r;const t=(r=this.path)==null?void 0:r.child(e),s=this.i({path:t,arrayElement:!1});return s.Ac(),s}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return _r(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(Cd(this.dataSource)&&J0.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class Z0{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||qr(e)}I(e,t,s,r=!1){return new Xo({dataSource:e,methodName:t,targetDoc:s,path:be.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Kr(n){const e=n._freezeSettings(),t=qr(n._databaseId);return new Z0(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Pd(n,e,t,s,r,i={}){const a=n.I(i.merge||i.mergeFields?2:0,e,t,r);ea("Data must be an object, but it was:",a,s);const l=Dd(s,a);let c,d;if(i.merge)c=new De(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const h=[];for(const m of i.mergeFields){const y=kn(e,m,t);if(!a.contains(y))throw new M(P.INVALID_ARGUMENT,`Field '${y}' is specified in your field mask but missing from your input data.`);Md(h,y)||h.push(y)}c=new De(h),d=a.fieldTransforms.filter((m=>c.covers(m.field)))}else c=null,d=a.fieldTransforms;return new X0(new Ce(l),c,d)}class Qr extends Wr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.yc(`${this._methodName}() can only appear at the top level of your update data`):e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Qr}}class Zo extends Wr{_toFieldTransform(e){return new jm(e.path,new hs)}isEqual(e){return e instanceof Zo}}function ey(n,e,t,s){const r=n.I(1,e,t);ea("Data must be an object, but it was:",r,s);const i=[],a=Ce.empty();Mt(s,((c,d)=>{const h=Nd(e,c,t);d=Te(d);const m=r.fc(h);if(d instanceof Qr)i.push(h);else{const y=Ts(d,m);y!=null&&(i.push(h),a.set(h,y))}}));const l=new De(i);return new Rd(a,l,r.fieldTransforms)}function ty(n,e,t,s,r,i){const a=n.I(1,e,t),l=[kn(e,s,t)],c=[r];if(i.length%2!=0)throw new M(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let y=0;y<i.length;y+=2)l.push(kn(e,i[y])),c.push(i[y+1]);const d=[],h=Ce.empty();for(let y=l.length-1;y>=0;--y)if(!Md(d,l[y])){const x=l[y];let A=c[y];A=Te(A);const S=a.fc(x);if(A instanceof Qr)d.push(x);else{const C=Ts(A,S);C!=null&&(d.push(x),h.set(x,C))}}const m=new De(d);return new Rd(h,m,a.fieldTransforms)}function ny(n,e,t,s=!1){return Ts(t,n.I(s?4:3,e))}function Ts(n,e){if(Vd(n=Te(n)))return ea("Unsupported field value:",e,n),Dd(n,e);if(n instanceof Wr)return(function(s,r){if(!Cd(r.dataSource))throw r.yc(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.yc(`${s._methodName}() is not currently supported inside arrays`);const i=s._toFieldTransform(r);i&&r.fieldTransforms.push(i)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return(function(s,r){const i=[];let a=0;for(const l of s){let c=Ts(l,r.gc(a));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),a++}return{arrayValue:{values:i}}})(n,e)}return(function(s,r){if((s=Te(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Fm(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const i=re.fromDate(s);return{timestampValue:br(r.serializer,i)}}if(s instanceof re){const i=new re(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:br(r.serializer,i)}}if(s instanceof Ge)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ve)return{bytesValue:Wu(r.serializer,s._byteString)};if(s instanceof ce){const i=r.databaseId,a=s.firestore._databaseId;if(!a.isEqual(i))throw r.yc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:No(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof Oe)return(function(a,l){const c=a instanceof Oe?a.toArray():a;return{mapValue:{fields:{[_u]:{stringValue:Eu},[fr]:{arrayValue:{values:c.map((h=>{if(typeof h!="number")throw l.yc("VectorValues must only contain numeric values.");return Co(l.serializer,h)}))}}}}}})(s,r);if(ed(s))return s._toProto(r.serializer);throw r.yc(`Unsupported field value: ${Mr(s)}`)})(n,e)}function Dd(n,e){const t={};return gu(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Mt(n,((s,r)=>{const i=Ts(r,e.dc(s));i!=null&&(t[s]=i)})),{mapValue:{fields:t}}}function Vd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof re||n instanceof Ge||n instanceof Ve||n instanceof ce||n instanceof Wr||n instanceof Oe||ed(n))}function ea(n,e,t){if(!Vd(t)||!fu(t)){const s=Mr(t);throw s==="an object"?e.yc(n+" a custom object"):e.yc(n+" "+s)}}function kn(n,e,t){if((e=Te(e))instanceof Jo)return e._internalPath;if(typeof e=="string")return Nd(n,e);throw _r("Field path arguments must be of type string or ",n,!1,void 0,t)}const sy=new RegExp("[~\\*/\\[\\]]");function Nd(n,e,t){if(e.search(sy)>=0)throw _r(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Jo(...e.split("."))._internalPath}catch{throw _r(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function _r(n,e,t,s,r){const i=s&&!s.isEmpty(),a=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(i||a)&&(c+=" (found",i&&(c+=` in field ${s}`),a&&(c+=` in document ${r}`),c+=")"),new M(P.INVALID_ARGUMENT,l+n+c)}function Md(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class ry{convertValue(e,t="none"){switch(Pt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ae(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ct(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw B(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return Mt(e,((r,i)=>{s[r]=this.convertValue(i,t)})),s}convertVectorValue(e){var s,r,i;const t=(i=(r=(s=e.fields)==null?void 0:s[fr].arrayValue)==null?void 0:r.values)==null?void 0:i.map((a=>ae(a.doubleValue)));return new Oe(t)}convertGeoPoint(e){return new Ge(ae(e.latitude),ae(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Or(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(cs(e));default:return null}}convertTimestamp(e){const t=Rt(e);return new re(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=ne.fromString(e);ee(Zu(s),9688,{name:e});const r=new us(s.get(1),s.get(3)),i=new F(s.popFirst(5));return r.isEqual(t)||st(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */class Ld extends ry{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ve(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ce(this.firestore,null,t)}}function Yr(){return new Zo("serverTimestamp")}const vc="@firebase/firestore",xc="4.14.0";/**
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
 */class $d{constructor(e,t,s,r,i){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ce(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new iy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(kn("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class iy extends $d{data(){return super.data()}}/**
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
 */function oy(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new M(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ta{}class ay extends ta{}function ly(n,e,...t){let s=[];e instanceof ta&&s.push(e),s=s.concat(t),(function(i){const a=i.filter((c=>c instanceof na)).length,l=i.filter((c=>c instanceof Jr)).length;if(a>1||a>0&&l>0)throw new M(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const r of s)n=r._apply(n);return n}class Jr extends ay{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Jr(e,t,s)}_apply(e){const t=this._parse(e);return Od(e._query,t),new Pn(e.firestore,e.converter,no(e._query,t))}_parse(e){const t=Kr(e.firestore);return(function(i,a,l,c,d,h,m){let y;if(d.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new M(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){_c(m,h);const A=[];for(const S of m)A.push(wc(c,i,S));y={arrayValue:{values:A}}}else y=wc(c,i,m)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||_c(m,h),y=ny(l,a,m,h==="in"||h==="not-in");return de.create(d,h,y)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function cy(n,e,t){const s=e,r=kn("where",n);return Jr._create(r,s,t)}class na extends ta{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new na(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:Fe.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(r,i){let a=r;const l=i.getFlattenedFilters();for(const c of l)Od(a,c),a=no(a,c)})(e._query,t),new Pn(e.firestore,e.converter,no(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function wc(n,e,t){if(typeof(t=Te(t))=="string"){if(t==="")throw new M(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Pu(e)&&t.indexOf("/")!==-1)throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(ne.fromString(t));if(!F.isDocumentKey(s))throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Ll(n,new F(s))}if(t instanceof ce)return Ll(n,t._key);throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Mr(t)}.`)}function _c(n,e){if(!Array.isArray(n)||n.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Od(n,e){const t=(function(r,i){for(const a of r)for(const l of a.getFlattenedFilters())if(i.indexOf(l.op)>=0)return l.op;return null})(n.filters,(function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function Fd(n,e,t){let s;return s=n?n.toFirestore(e):e,s}class Zn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ht extends $d{constructor(e,t,s,r,i,a){super(e,t,s,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ir(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(kn("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new M(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Ht._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Ht._jsonSchemaVersion="firestore/documentSnapshot/1.0",Ht._jsonSchema={type:he("string",Ht._jsonSchemaVersion),bundleSource:he("string","DocumentSnapshot"),bundleName:he("string"),bundle:he("string")};class ir extends Ht{data(e={}){return super.data(e)}}class pn{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Zn(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new ir(this._firestore,this._userDataWriter,s.key,s,new Zn(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,i){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map((l=>{const c=new ir(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Zn(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:a++}}))}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((l=>i||l.type!==3)).map((l=>{const c=new ir(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Zn(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,h=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),h=a.indexOf(l.doc.key)),{type:uy(l.type),doc:c,oldIndex:d,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new M(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=pn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Eo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),s.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),r.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function uy(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return B(61501,{type:n})}}/**
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
 */pn._jsonSchemaVersion="firestore/querySnapshot/1.0",pn._jsonSchema={type:he("string",pn._jsonSchemaVersion),bundleSource:he("string","QuerySnapshot"),bundleName:he("string"),bundle:he("string")};/**
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
 */function or(n){n=Qe(n,ce);const e=Qe(n.firestore,Zt),t=Yo(e);return z0(t,n._key).then((s=>hy(e,n,s)))}function Ud(n){n=Qe(n,Pn);const e=Qe(n.firestore,Zt),t=Yo(e),s=new Ld(e);return oy(n._query),q0(t,n._query).then((r=>new pn(e,s,n,r)))}function sa(n,e,t){n=Qe(n,ce);const s=Qe(n.firestore,Zt),r=Fd(n.converter,e),i=Kr(s);return Xr(s,[Pd(i,"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,Ne.none())])}function fo(n,e,t,...s){n=Qe(n,ce);const r=Qe(n.firestore,Zt),i=Kr(r);let a;return a=typeof(e=Te(e))=="string"||e instanceof Jo?ty(i,"updateDoc",n._key,e,t,s):ey(i,"updateDoc",n._key,e),Xr(r,[a.toMutation(n._key,Ne.exists(!0))])}function Bd(n){return Xr(Qe(n.firestore,Zt),[new Po(n._key,Ne.none())])}function dy(n,e){const t=Qe(n.firestore,Zt),s=Xe(n),r=Fd(n.converter,e),i=Kr(n.firestore);return Xr(t,[Pd(i,"addDoc",s._key,r,n.converter!==null,{}).toMutation(s._key,Ne.exists(!1))]).then((()=>s))}function Xr(n,e){const t=Yo(n);return H0(t,e)}function hy(n,e,t){const s=t.docs.get(e._key),r=new Ld(n);return new Ht(n,r,e._key,s,new Zn(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){Gf(Tn),yn(new Wt("firestore",((s,{instanceIdentifier:r,options:i})=>{const a=s.getProvider("app").getImmediate(),l=new Zt(new Qf(s.getProvider("auth-internal")),new Xf(a,s.getProvider("app-check-internal")),mm(a,r),a);return i={useFetchStreams:t,...i},l._setSettings(i),l}),"PUBLIC").setMultipleInstances(!0)),kt(vc,xc,e),kt(vc,xc,"esm2020")})();function jd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const py=jd,zd=new ys("auth","Firebase",jd());/**
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
 */const Er=new vo("@firebase/auth");function fy(n,...e){Er.logLevel<=Q.WARN&&Er.warn(`Auth (${Tn}): ${n}`,...e)}function ar(n,...e){Er.logLevel<=Q.ERROR&&Er.error(`Auth (${Tn}): ${n}`,...e)}/**
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
 */function it(n,...e){throw ra(n,...e)}function We(n,...e){return ra(n,...e)}function qd(n,e,t){const s={...py(),[e]:t};return new ys("auth","Firebase",s).create(e,{appName:n.name})}function At(n){return qd(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ra(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return zd.create(n,...e)}function j(n,e,...t){if(!n)throw ra(e,...t)}function Ze(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ar(e),new Error(e)}function ot(n,e){n||Ze(e)}/**
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
 */function mo(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function my(){return Ec()==="http:"||Ec()==="https:"}function Ec(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
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
 */function gy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(my()||wp()||"connection"in navigator)?navigator.onLine:!0}function yy(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class As{constructor(e,t){this.shortDelay=e,this.longDelay=t,ot(t>e,"Short delay should be less than long delay!"),this.isMobile=bp()||_p()}get(){return gy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function ia(n,e){ot(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Hd{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ze("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ze("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ze("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const by={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const vy=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],xy=new As(3e4,6e4);function Zr(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Dn(n,e,t,s,r={}){return Gd(n,r,async()=>{let i={},a={};s&&(e==="GET"?a=s:i={body:JSON.stringify(s)});const l=bs({key:n.config.apiKey,...a}).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const d={method:e,headers:c,...i};return xp()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&vs(n.emulatorConfig.host)&&(d.credentials="include"),Hd.fetch()(await Kd(n,n.config.apiHost,t,l),d)})}async function Gd(n,e,t){n._canInitEmulator=!1;const s={...by,...e};try{const r=new wy(n),i=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Ys(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const l=i.ok?a.errorMessage:a.error.message,[c,d]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ys(n,"credential-already-in-use",a);if(c==="EMAIL_EXISTS")throw Ys(n,"email-already-in-use",a);if(c==="USER_DISABLED")throw Ys(n,"user-disabled",a);const h=s[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw qd(n,h,d);it(n,h)}}catch(r){if(r instanceof at)throw r;it(n,"network-request-failed",{message:String(r)})}}async function Wd(n,e,t,s,r={}){const i=await Dn(n,e,t,s,r);return"mfaPendingCredential"in i&&it(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Kd(n,e,t,s){const r=`${e}${t}?${s}`,i=n,a=i.config.emulator?ia(n.config,r):`${n.config.apiScheme}://${r}`;return vy.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}class wy{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(We(this.auth,"network-request-failed")),xy.get())})}}function Ys(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=We(n,e,s);return r.customData._tokenResponse=t,r}/**
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
 */async function _y(n,e){return Dn(n,"POST","/v1/accounts:delete",e)}async function kr(n,e){return Dn(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function rs(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ey(n,e=!1){const t=Te(n),s=await t.getIdToken(e),r=oa(s);j(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:r,token:s,authTime:rs(Oi(r.auth_time)),issuedAtTime:rs(Oi(r.iat)),expirationTime:rs(Oi(r.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function Oi(n){return Number(n)*1e3}function oa(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return ar("JWT malformed, contained fewer than 3 sections"),null;try{const r=Jc(t);return r?JSON.parse(r):(ar("Failed to decode base64 JWT payload"),null)}catch(r){return ar("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function kc(n){const e=oa(n);return j(e,"internal-error"),j(typeof e.exp<"u","internal-error"),j(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function ms(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof at&&ky(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function ky({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Iy{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class go{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=rs(this.lastLoginAt),this.creationTime=rs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function Ir(n){var m;const e=n.auth,t=await n.getIdToken(),s=await ms(n,kr(e,{idToken:t}));j(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];n._notifyReloadListener(r);const i=(m=r.providerUserInfo)!=null&&m.length?Qd(r.providerUserInfo):[],a=Ay(n.providerData,i),l=n.isAnonymous,c=!(n.email&&r.passwordHash)&&!(a!=null&&a.length),d=l?c:!1,h={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new go(r.createdAt,r.lastLoginAt),isAnonymous:d};Object.assign(n,h)}async function Ty(n){const e=Te(n);await Ir(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ay(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function Qd(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function Sy(n,e){const t=await Gd(n,{},async()=>{const s=bs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=n.config,a=await Kd(n,r,"/v1/token",`key=${i}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:s};return n.emulatorConfig&&vs(n.emulatorConfig.host)&&(c.credentials="include"),Hd.fetch()(a,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Ry(n,e){return Dn(n,"POST","/v2/accounts:revokeToken",Zr(n,e))}/**
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
 */class fn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){j(e.idToken,"internal-error"),j(typeof e.idToken<"u","internal-error"),j(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):kc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){j(e.length!==0,"internal-error");const t=kc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(j(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:i}=await Sy(e,t);this.updateTokensAndExpiration(s,r,Number(i))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:i}=t,a=new fn;return s&&(j(typeof s=="string","internal-error",{appName:e}),a.refreshToken=s),r&&(j(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(j(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new fn,this.toJSON())}_performRefresh(){return Ze("not implemented")}}/**
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
 */function ft(n,e){j(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Le{constructor({uid:e,auth:t,stsTokenManager:s,...r}){this.providerId="firebase",this.proactiveRefresh=new Iy(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new go(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await ms(this,this.stsTokenManager.getToken(this.auth,e));return j(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Ey(this,e)}reload(){return Ty(this)}_assign(e){this!==e&&(j(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Le({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){j(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Ir(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Me(this.auth.app))return Promise.reject(At(this.auth));const e=await this.getIdToken();return await ms(this,_y(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,r=t.email??void 0,i=t.phoneNumber??void 0,a=t.photoURL??void 0,l=t.tenantId??void 0,c=t._redirectEventId??void 0,d=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:m,emailVerified:y,isAnonymous:x,providerData:A,stsTokenManager:S}=t;j(m&&S,e,"internal-error");const C=fn.fromJSON(this.name,S);j(typeof m=="string",e,"internal-error"),ft(s,e.name),ft(r,e.name),j(typeof y=="boolean",e,"internal-error"),j(typeof x=="boolean",e,"internal-error"),ft(i,e.name),ft(a,e.name),ft(l,e.name),ft(c,e.name),ft(d,e.name),ft(h,e.name);const N=new Le({uid:m,auth:e,email:r,emailVerified:y,displayName:s,isAnonymous:x,photoURL:a,phoneNumber:i,tenantId:l,stsTokenManager:C,createdAt:d,lastLoginAt:h});return A&&Array.isArray(A)&&(N.providerData=A.map(L=>({...L}))),c&&(N._redirectEventId=c),N}static async _fromIdTokenResponse(e,t,s=!1){const r=new fn;r.updateFromServerResponse(t);const i=new Le({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await Ir(i),i}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];j(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Qd(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!(i!=null&&i.length),l=new fn;l.updateFromIdToken(s);const c=new Le({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new go(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(i!=null&&i.length)};return Object.assign(c,d),c}}/**
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
 */const Ic=new Map;function et(n){ot(n instanceof Function,"Expected a class definition");let e=Ic.get(n);return e?(ot(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Ic.set(n,e),e)}/**
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
 */class Yd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Yd.type="NONE";const Tc=Yd;/**
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
 */function lr(n,e,t){return`firebase:${n}:${e}:${t}`}class mn{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:i}=this.auth;this.fullUserKey=lr(this.userKey,r.apiKey,i),this.fullPersistenceKey=lr("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await kr(this.auth,{idToken:e}).catch(()=>{});return t?Le._fromGetAccountInfoResponse(this.auth,t,e):null}return Le._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new mn(et(Tc),e,s);const r=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||et(Tc);const a=lr(s,e.config.apiKey,e.name);let l=null;for(const d of t)try{const h=await d._get(a);if(h){let m;if(typeof h=="string"){const y=await kr(e,{idToken:h}).catch(()=>{});if(!y)break;m=await Le._fromGetAccountInfoResponse(e,y,h)}else m=Le._fromJSON(e,h);d!==i&&(l=m),i=d;break}}catch{}const c=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new mn(i,e,s):(i=c[0],l&&await i._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new mn(i,e,s))}}/**
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
 */function Ac(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(eh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Jd(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(nh(e))return"Blackberry";if(sh(e))return"Webos";if(Xd(e))return"Safari";if((e.includes("chrome/")||Zd(e))&&!e.includes("edge/"))return"Chrome";if(th(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function Jd(n=Ee()){return/firefox\//i.test(n)}function Xd(n=Ee()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Zd(n=Ee()){return/crios\//i.test(n)}function eh(n=Ee()){return/iemobile/i.test(n)}function th(n=Ee()){return/android/i.test(n)}function nh(n=Ee()){return/blackberry/i.test(n)}function sh(n=Ee()){return/webos/i.test(n)}function aa(n=Ee()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Cy(n=Ee()){var e;return aa(n)&&!!((e=window.navigator)!=null&&e.standalone)}function Py(){return Ep()&&document.documentMode===10}function rh(n=Ee()){return aa(n)||th(n)||sh(n)||nh(n)||/windows phone/i.test(n)||eh(n)}/**
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
 */function ih(n,e=[]){let t;switch(n){case"Browser":t=Ac(Ee());break;case"Worker":t=`${Ac(Ee())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Tn}/${s}`}/**
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
 */class Dy{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=i=>new Promise((a,l)=>{try{const c=e(i);a(c)}catch(c){l(c)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
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
 */async function Vy(n,e={}){return Dn(n,"GET","/v2/passwordPolicy",Zr(n,e))}/**
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
 */const Ny=6;class My{constructor(e){var s;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Ny,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((s=e.allowedNonAlphanumericCharacters)==null?void 0:s.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
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
 */class Ly{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Sc(this),this.idTokenSubscription=new Sc(this),this.beforeStateQueue=new Dy(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=zd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=et(t)),this._initializationPromise=this.queue(async()=>{var s,r,i;if(!this._deleted&&(this.persistenceManager=await mn.create(this,e),(s=this._resolvePersistenceManagerAvailable)==null||s.call(this),!this._deleted)){if((r=this._popupRedirectResolver)!=null&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await kr(this,{idToken:e}),s=await Le._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Me(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(l,l))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(i=this.redirectUser)==null?void 0:i._redirectEventId,l=s==null?void 0:s._redirectEventId,c=await this.tryRedirectSignIn(e);(!a||a===l)&&(c!=null&&c.user)&&(s=c.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(a){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return j(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ir(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=yy()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Me(this.app))return Promise.reject(At(this));const t=e?Te(e):null;return t&&j(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&j(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Me(this.app)?Promise.reject(At(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Me(this.app)?Promise.reject(At(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(et(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Vy(this),t=new My(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ys("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await Ry(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&et(e)||this._popupRedirectResolver;j(t,this,"argument-error"),this.redirectPersistenceManager=await mn.create(this,[et(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)==null?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(j(l,this,"internal-error"),l.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,s,r);return()=>{a=!0,c()}}else{const c=e.addObserver(t);return()=>{a=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return j(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ih(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var r;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((r=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:r.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(Me(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&fy(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ei(n){return Te(n)}class Sc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Pp(t=>this.observer=t)}get next(){return j(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let la={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function $y(n){la=n}function Oy(n){return la.loadJS(n)}function Fy(){return la.gapiScript}function Uy(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function By(n,e){const t=wo(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),i=t.getOptions();if(Gt(i,e??{}))return r;it(r,"already-initialized")}return t.initialize({options:e})}function jy(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(et);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function zy(n,e,t){const s=ei(n);j(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,i=oh(e),{host:a,port:l}=qy(e),c=l===null?"":`:${l}`,d={url:`${i}//${a}${c}/`},h=Object.freeze({host:a,port:l,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){j(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),j(Gt(d,s.config.emulator)&&Gt(h,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=d,s.emulatorConfig=h,s.settings.appVerificationDisabledForTesting=!0,vs(a)?eu(`${i}//${a}${c}`):Hy()}function oh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function qy(n){const e=oh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const i=r[1];return{host:i,port:Rc(s.substr(i.length+1))}}else{const[i,a]=s.split(":");return{host:i,port:Rc(a)}}}function Rc(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Hy(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class ah{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ze("not implemented")}_getIdTokenResponse(e){return Ze("not implemented")}_linkToIdToken(e,t){return Ze("not implemented")}_getReauthenticationResolver(e){return Ze("not implemented")}}/**
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
 */async function gn(n,e){return Wd(n,"POST","/v1/accounts:signInWithIdp",Zr(n,e))}/**
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
 */const Gy="http://localhost";class Yt extends ah{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Yt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):it("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r,...i}=t;if(!s||!r)return null;const a=new Yt(s,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return gn(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,gn(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,gn(e,t)}buildRequest(){const e={requestUri:Gy,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=bs(t)}return e}}/**
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
 */class lh{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Ss extends lh{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class yt extends Ss{constructor(){super("facebook.com")}static credential(e){return Yt._fromParams({providerId:yt.PROVIDER_ID,signInMethod:yt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yt.credentialFromTaggedObject(e)}static credentialFromError(e){return yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yt.credential(e.oauthAccessToken)}catch{return null}}}yt.FACEBOOK_SIGN_IN_METHOD="facebook.com";yt.PROVIDER_ID="facebook.com";/**
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
 */class bt extends Ss{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Yt._fromParams({providerId:bt.PROVIDER_ID,signInMethod:bt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return bt.credentialFromTaggedObject(e)}static credentialFromError(e){return bt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return bt.credential(t,s)}catch{return null}}}bt.GOOGLE_SIGN_IN_METHOD="google.com";bt.PROVIDER_ID="google.com";/**
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
 */class vt extends Ss{constructor(){super("github.com")}static credential(e){return Yt._fromParams({providerId:vt.PROVIDER_ID,signInMethod:vt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vt.credentialFromTaggedObject(e)}static credentialFromError(e){return vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vt.credential(e.oauthAccessToken)}catch{return null}}}vt.GITHUB_SIGN_IN_METHOD="github.com";vt.PROVIDER_ID="github.com";/**
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
 */class xt extends Ss{constructor(){super("twitter.com")}static credential(e,t){return Yt._fromParams({providerId:xt.PROVIDER_ID,signInMethod:xt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return xt.credentialFromTaggedObject(e)}static credentialFromError(e){return xt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return xt.credential(t,s)}catch{return null}}}xt.TWITTER_SIGN_IN_METHOD="twitter.com";xt.PROVIDER_ID="twitter.com";/**
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
 */async function Wy(n,e){return Wd(n,"POST","/v1/accounts:signUp",Zr(n,e))}/**
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
 */class Nt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const i=await Le._fromIdTokenResponse(e,s,r),a=Cc(s);return new Nt({user:i,providerId:a,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Cc(s);return new Nt({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Cc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */async function Ky(n){var r;if(Me(n.app))return Promise.reject(At(n));const e=ei(n);if(await e._initializationPromise,(r=e.currentUser)!=null&&r.isAnonymous)return new Nt({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await Wy(e,{returnSecureToken:!0}),s=await Nt._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(s.user),s}/**
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
 */class Tr extends at{constructor(e,t,s,r){super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,Tr.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new Tr(e,t,s,r)}}function ch(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Tr._fromErrorAndOperation(n,i,e,s):i})}async function Qy(n,e,t=!1){const s=await ms(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Nt._forOperation(n,"link",s)}/**
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
 */async function Yy(n,e,t=!1){const{auth:s}=n;if(Me(s.app))return Promise.reject(At(s));const r="reauthenticate";try{const i=await ms(n,ch(s,r,e,n),t);j(i.idToken,s,"internal-error");const a=oa(i.idToken);j(a,s,"internal-error");const{sub:l}=a;return j(n.uid===l,s,"user-mismatch"),Nt._forOperation(n,r,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&it(s,"user-mismatch"),i}}/**
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
 */async function Jy(n,e,t=!1){if(Me(n.app))return Promise.reject(At(n));const s="signIn",r=await ch(n,s,e),i=await Nt._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(i.user),i}function Xy(n,e,t,s){return Te(n).onIdTokenChanged(e,t,s)}function Zy(n,e,t){return Te(n).beforeAuthStateChanged(e,t)}const Ar="__sak";/**
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
 */class uh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ar,"1"),this.storage.removeItem(Ar),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const eb=1e3,tb=10;class dh extends uh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=rh(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,c)=>{this.notifyListeners(a,c)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(s);!t&&this.localCache[s]===a||this.notifyListeners(s,a)},i=this.storage.getItem(s);Py()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,tb):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},eb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}dh.type="LOCAL";const nb=dh;/**
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
 */class hh extends uh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}hh.type="SESSION";const ph=hh;/**
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
 */function sb(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class ti{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new ti(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:i}=t.data,a=this.handlersMap[r];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const l=Array.from(a).map(async d=>d(t.origin,i)),c=await sb(l);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}ti.receivers=[];/**
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
 */function ca(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class rb{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((l,c)=>{const d=ca("",20);r.port1.start();const h=setTimeout(()=>{c(new Error("unsupported_event"))},s);a={messageChannel:r,onMessage(m){const y=m;if(y.data.eventId===d)switch(y.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),l(y.data.response);break;default:clearTimeout(h),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Ke(){return window}function ib(n){Ke().location.href=n}/**
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
 */function fh(){return typeof Ke().WorkerGlobalScope<"u"&&typeof Ke().importScripts=="function"}async function ob(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ab(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function lb(){return fh()?self:null}/**
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
 */const mh="firebaseLocalStorageDb",cb=1,Sr="firebaseLocalStorage",gh="fbase_key";class Rs{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ni(n,e){return n.transaction([Sr],e?"readwrite":"readonly").objectStore(Sr)}function ub(){const n=indexedDB.deleteDatabase(mh);return new Rs(n).toPromise()}function yo(){const n=indexedDB.open(mh,cb);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Sr,{keyPath:gh})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Sr)?e(s):(s.close(),await ub(),e(await yo()))})})}async function Pc(n,e,t){const s=ni(n,!0).put({[gh]:e,value:t});return new Rs(s).toPromise()}async function db(n,e){const t=ni(n,!1).get(e),s=await new Rs(t).toPromise();return s===void 0?null:s.value}function Dc(n,e){const t=ni(n,!0).delete(e);return new Rs(t).toPromise()}const hb=800,pb=3;class yh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await yo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>pb)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return fh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=ti._getInstance(lb()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,s;if(this.activeServiceWorker=await ob(),!this.activeServiceWorker)return;this.sender=new rb(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(s=e[0])!=null&&s.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ab()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await yo();return await Pc(e,Ar,"1"),await Dc(e,Ar),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>Pc(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>db(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Dc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=ni(r,!1).getAll();return new Rs(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}yh.type="LOCAL";const fb=yh;new As(3e4,6e4);/**
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
 */function mb(n,e){return e?et(e):(j(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class ua extends ah{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return gn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return gn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return gn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function gb(n){return Jy(n.auth,new ua(n),n.bypassAuthState)}function yb(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),Yy(t,new ua(n),n.bypassAuthState)}async function bb(n){const{auth:e,user:t}=n;return j(t,e,"internal-error"),Qy(t,new ua(n),n.bypassAuthState)}/**
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
 */class bh{constructor(e,t,s,r,i=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:i,error:a,type:l}=e;if(a){this.reject(a);return}const c={auth:this.auth,requestUri:t,sessionId:s,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return gb;case"linkViaPopup":case"linkViaRedirect":return bb;case"reauthViaPopup":case"reauthViaRedirect":return yb;default:it(this.auth,"internal-error")}}resolve(e){ot(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ot(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const vb=new As(2e3,1e4);class un extends bh{constructor(e,t,s,r,i){super(e,t,r,i),this.provider=s,this.authWindow=null,this.pollId=null,un.currentPopupAction&&un.currentPopupAction.cancel(),un.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return j(e,this.auth,"internal-error"),e}async onExecution(){ot(this.filter.length===1,"Popup operations only handle one event");const e=ca();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(We(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(We(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,un.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if((s=(t=this.authWindow)==null?void 0:t.window)!=null&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(We(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,vb.get())};e()}}un.currentPopupAction=null;/**
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
 */const xb="pendingRedirect",cr=new Map;class wb extends bh{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=cr.get(this.auth._key());if(!e){try{const s=await _b(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}cr.set(this.auth._key(),e)}return this.bypassAuthState||cr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function _b(n,e){const t=Ib(e),s=kb(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}function Eb(n,e){cr.set(n._key(),e)}function kb(n){return et(n._redirectPersistence)}function Ib(n){return lr(xb,n.config.apiKey,n.name)}async function Tb(n,e,t=!1){if(Me(n.app))return Promise.reject(At(n));const s=ei(n),r=mb(s,e),a=await new wb(s,r,t).execute();return a&&!t&&(delete a.user._redirectEventId,await s._persistUserIfCurrent(a.user),await s._setRedirectUser(null,e)),a}/**
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
 */const Ab=600*1e3;class Sb{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Rb(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!vh(e)){const r=((s=e.error.code)==null?void 0:s.split("auth/")[1])||"internal-error";t.onError(We(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Ab&&this.cachedEventUids.clear(),this.cachedEventUids.has(Vc(e))}saveEventToCache(e){this.cachedEventUids.add(Vc(e)),this.lastProcessedEventTime=Date.now()}}function Vc(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function vh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Rb(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return vh(n);default:return!1}}/**
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
 */async function Cb(n,e={}){return Dn(n,"GET","/v1/projects",e)}/**
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
 */const Pb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Db=/^https?/;async function Vb(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Cb(n);for(const t of e)try{if(Nb(t))return}catch{}it(n,"unauthorized-domain")}function Nb(n){const e=mo(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===s}if(!Db.test(t))return!1;if(Pb.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
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
 */const Mb=new As(3e4,6e4);function Nc(){const n=Ke().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Lb(n){return new Promise((e,t)=>{var r,i,a;function s(){Nc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Nc(),t(We(n,"network-request-failed"))},timeout:Mb.get()})}if((i=(r=Ke().gapi)==null?void 0:r.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((a=Ke().gapi)!=null&&a.load)s();else{const l=Uy("iframefcb");return Ke()[l]=()=>{gapi.load?s():t(We(n,"network-request-failed"))},Oy(`${Fy()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw ur=null,e})}let ur=null;function $b(n){return ur=ur||Lb(n),ur}/**
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
 */const Ob=new As(5e3,15e3),Fb="__/auth/iframe",Ub="emulator/auth/iframe",Bb={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jb=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zb(n){const e=n.config;j(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ia(e,Ub):`https://${n.config.authDomain}/${Fb}`,s={apiKey:e.apiKey,appName:n.name,v:Tn},r=jb.get(n.config.apiHost);r&&(s.eid=r);const i=n._getFrameworks();return i.length&&(s.fw=i.join(",")),`${t}?${bs(s).slice(1)}`}async function qb(n){const e=await $b(n),t=Ke().gapi;return j(t,n,"internal-error"),e.open({where:document.body,url:zb(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Bb,dontclear:!0},s=>new Promise(async(r,i)=>{await s.restyle({setHideOnLeave:!1});const a=We(n,"network-request-failed"),l=Ke().setTimeout(()=>{i(a)},Ob.get());function c(){Ke().clearTimeout(l),r(s)}s.ping(c).then(c,()=>{i(a)})}))}/**
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
 */const Hb={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Gb=500,Wb=600,Kb="_blank",Qb="http://localhost";class Mc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Yb(n,e,t,s=Gb,r=Wb){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-s)/2,0).toString();let l="";const c={...Hb,width:s.toString(),height:r.toString(),top:i,left:a},d=Ee().toLowerCase();t&&(l=Zd(d)?Kb:t),Jd(d)&&(e=e||Qb,c.scrollbars="yes");const h=Object.entries(c).reduce((y,[x,A])=>`${y}${x}=${A},`,"");if(Cy(d)&&l!=="_self")return Jb(e||"",l),new Mc(null);const m=window.open(e||"",l,h);j(m,n,"popup-blocked");try{m.focus()}catch{}return new Mc(m)}function Jb(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
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
 */const Xb="__/auth/handler",Zb="emulator/auth/handler",ev=encodeURIComponent("fac");async function Lc(n,e,t,s,r,i){j(n.config.authDomain,n,"auth-domain-config-required"),j(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:Tn,eventId:r};if(e instanceof lh){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Cp(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,m]of Object.entries({}))a[h]=m}if(e instanceof Ss){const h=e.getScopes().filter(m=>m!=="");h.length>0&&(a.scopes=h.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const c=await n._getAppCheckToken(),d=c?`#${ev}=${encodeURIComponent(c)}`:"";return`${tv(n)}?${bs(l).slice(1)}${d}`}function tv({config:n}){return n.emulator?ia(n,Zb):`https://${n.authDomain}/${Xb}`}/**
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
 */const Fi="webStorageSupport";class nv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ph,this._completeRedirectFn=Tb,this._overrideRedirectResult=Eb}async _openPopup(e,t,s,r){var a;ot((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const i=await Lc(e,t,s,mo(),r);return Yb(e,i,ca())}async _openRedirect(e,t,s,r){await this._originValidation(e);const i=await Lc(e,t,s,mo(),r);return ib(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:i}=this.eventManagers[t];return r?Promise.resolve(r):(ot(i,"If manager is not set, promise should be"),i)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await qb(e),s=new Sb(e);return t.register("authEvent",r=>(j(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Fi,{type:Fi},r=>{var a;const i=(a=r==null?void 0:r[0])==null?void 0:a[Fi];i!==void 0&&t(!!i),it(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Vb(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return rh()||Xd()||aa()}}const sv=nv;var $c="@firebase/auth",Oc="1.13.0";/**
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
 */class rv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){j(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function iv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ov(n){yn(new Wt("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=s.options;j(a&&!a.includes(":"),"invalid-api-key",{appName:s.name});const c={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ih(n)},d=new Ly(s,r,i,c);return jy(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),yn(new Wt("auth-internal",e=>{const t=ei(e.getProvider("auth").getImmediate());return(s=>new rv(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),kt($c,Oc,iv(n)),kt($c,Oc,"esm2020")}/**
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
 */const av=300,lv=Zc("authIdTokenMaxAge")||av;let Fc=null;const cv=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>lv)return;const r=t==null?void 0:t.token;Fc!==r&&(Fc=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function uv(n=Vf()){const e=wo(n,"auth");if(e.isInitialized())return e.getImmediate();const t=By(n,{popupRedirectResolver:sv,persistence:[fb,nb,ph]}),s=Zc("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(s,location.origin);if(location.origin===i.origin){const a=cv(i.toString());Zy(t,a,()=>a(t.currentUser)),Xy(t,l=>a(l))}}const r=gp("auth");return r&&zy(t,`http://${r}`),t}function dv(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}$y({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const i=We("internal-error");i.customData=r,t(i)},s.type="text/javascript",s.charset="UTF-8",dv().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ov("Browser");const xh={projectId:"gen-lang-client-0833655128",appId:"1:681326869225:web:cada6ac531e1ded3b1ce78",apiKey:"AIzaSyAWyge6N-FseAcfTDNUN5P51j88PYQW-ms",authDomain:"gen-lang-client-0833655128.firebaseapp.com",firestoreDatabaseId:"ai-studio-cb688270-9194-4388-8b0d-99a18b09beb1",storageBucket:"gen-lang-client-0833655128.firebasestorage.app",messagingSenderId:"681326869225",measurementId:""},wh=su(xh),hv=uv(wh),$e=Q0(wh,{experimentalForceLongPolling:!0},xh.firestoreDatabaseId);Ky(hv).catch(n=>console.error("Anonymous auth failed:",n));function Rr(){return Math.random().toString(36).slice(2,9)}function da(n,e=1,t="league",s=0){const r=[...n];r.length%2!==0&&r.push({id:"__bye__",name:"BYE"});const a=r.length,l=a-1,c=a/2,d=[];for(let h=0;h<e;h++){const m=h%2===1,y=[r[0],...r.slice(1)];for(let x=0;x<l;x++){const A=x+1+s+h*l,S=[];for(let C=0;C<c;C++){const N=y[C],L=y[a-1-C];N.id==="__bye__"||L.id==="__bye__"||S.push(m?{homeId:L.id,awayId:N.id}:{homeId:N.id,awayId:L.id})}S.forEach(C=>{d.push({id:`fix-${Rr()}`,homeId:C.homeId,awayId:C.awayId,homeScore:null,awayScore:null,status:"upcoming",round:A,stage:t,date:null,venue:null,time:null})}),y.splice(1,0,y.pop())}}return d}function pv(n,e=1,t=1){let s=1;for(;s<n.length;)s*=2;const r=[...n],i=new Array(s).fill(null),a=_h(s);r.forEach((y,x)=>{a[x]!==void 0&&(i[a[x]]=y)});const l=[],c=s/2;for(let y=0;y<c;y++){const x=i[y*2],A=i[y*2+1];if(!(!x&&!A)&&x&&A)for(let S=0;S<t;S++)l.push({id:`ko-r${e}-m${y}-l${S}-${Rr()}`,homeId:S===0?x.id:A.id,awayId:S===0?A.id:x.id,homeScore:null,awayScore:null,status:"upcoming",round:e+S,matchIndex:y,stage:"knockout",leg:S+1,date:null,venue:null,time:null})}let d=c,h=e+t;for(;d>1;){d/=2;for(let y=0;y<d;y++)for(let x=0;x<t;x++)l.push({id:`ko-r${h}-m${y}-l${x}-${Rr()}`,homeId:null,awayId:null,homeScore:null,awayScore:null,status:"upcoming",round:h+x,matchIndex:y,stage:"knockout",leg:x+1,date:null,venue:null,time:null});h+=t}const m=e+t;for(let y=0;y<c;y++){const x=i[y*2],A=i[y*2+1];if(!x||!A){const S=x||A;if(!S)continue;const C=Math.floor(y/2),N=y%2===0?"homeId":"awayId",L=l.find(K=>K.round===m&&K.matchIndex===C&&K.leg===1);L&&(L[N]=S.id)}}return l}function _h(n){if(n===1)return[0];const e=_h(n/2),t=new Array(n);return e.forEach((s,r)=>{t[r*2]=s,t[r*2+1]=n-1-s}),t}function fv(n,e=4){const t=[...n].sort(()=>Math.random()-.5),s=Math.ceil(t.length/e),r=[],i=[];for(let a=0;a<s;a++){const l=t.slice(a*e,(a+1)*e);r.push({id:a,name:String.fromCharCode(65+a),teamIds:l.map(d=>d.id)}),da(l,1,"groups",0).forEach(d=>{d.groupId=a,i.push(d)})}return{groups:r,fixtures:i}}function mv(n,e,t,s=1,r="league"){const i=da(n,s,r,0),a=[];for(let l=1;l<=t;l++){const c=(e[l]||[]).filter(m=>m.homeId&&m.awayId),d=new Set(c.flatMap(m=>[m.homeId,m.awayId])),h=i.filter(m=>m.round===l&&!d.has(m.homeId)&&!d.has(m.awayId));c.forEach(m=>{a.push({id:`fix-${Rr()}`,homeId:m.homeId,awayId:m.awayId,homeScore:null,awayScore:null,status:"upcoming",round:l,stage:r,date:m.date||null,venue:m.venue||null,time:m.time||null,pinned:!0})}),h.forEach(m=>{m.round=l,a.push(m)})}return a}function gv(n){const e=[],t={};return n.forEach(s=>{t[s.round]||(t[s.round]=[]),t[s.round].push(s)}),Object.entries(t).forEach(([s,r])=>{const i=new Set;r.forEach(a=>{a.homeId&&i.has(a.homeId)&&e.push(`Round ${s}: team ${a.homeId} plays twice`),a.awayId&&i.has(a.awayId)&&e.push(`Round ${s}: team ${a.awayId} plays twice`),a.homeId&&i.add(a.homeId),a.awayId&&i.add(a.awayId)})}),e}console.log("[KickOff] main.js is initializing...");function Uc(n){const e=document.createElement("div");e.className="fixed inset-0 bg-slate-950/90 backdrop-blur-3xl z-[200] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300",e.innerHTML=`
    <div class="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-3xl flex flex-col p-10 space-y-8">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">Link Club Player</h3>
        <button id="close-selection" class="p-4 bg-slate-950 rounded-2xl text-slate-500">${O.reset}</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[60vh] pr-4 custom-scrollbar">
        ${f.dashboardPlayers.length===0?'<p class="col-span-2 text-center text-slate-500 py-10">No club players synced. Ensure dashboard is open.</p>':f.dashboardPlayers.map(s=>`
          <button class="player-select-btn p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4 hover:border-indigo-500/50 transition-all text-left group" data-player-id="${s.id}">
            <img src="${s.image}" class="w-12 h-12 rounded-xl object-cover border border-slate-800" />
            <div>
              <p class="font-black text-slate-200 text-sm group-hover:text-indigo-400">${s.name}</p>
              <p class="text-[9px] font-black text-slate-600 uppercase">#${s.number} • OVR ${s.ovr}</p>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(e),e.querySelectorAll(".player-select-btn").forEach(s=>{s.addEventListener("click",()=>{n(s.dataset.playerId),e.remove()})}),e.addEventListener("click",s=>{s.target===e&&e.remove()});const t=document.getElementById("close-selection");t&&t.addEventListener("click",()=>e.remove())}window.onerror=function(n,e,t,s,r){alert("GLOBAL ERROR: "+n+`
Line: `+t)};window.addEventListener("unhandledrejection",function(n){alert("PROMISE REJECTION: "+n.reason)});console.log("KickOff + Firebase Initialized");async function is(n){const e=new TextEncoder().encode(n),t=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(t)).map(s=>s.toString(16).padStart(2,"0")).join("")}const si="kickoff_session_v2";async function Cr(n){if(f.user)try{await dy(Qo($e,"activityLog"),{action:n,performedBy:f.user.username,role:f.user.role,timestamp:Yr()})}catch(e){console.warn("Activity log failed:",e)}}if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("[PWA] Service Worker Registered"),setInterval(()=>{e.update()},1e3*60*60)}).catch(e=>{console.error("[PWA] Registration Failed:",e)})});let n=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{n||(n=!0,console.log("[PWA] New controller detected, refreshing page..."),window.location.reload())})}const O={home:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',more:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',trophy:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',dashboard:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',fixtures:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',standings:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h5"/></svg>',teams:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',bracket:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 15 6 18 9"/><path d="M6 21 9 18 6 15"/><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M15 6h6"/><path d="M15 18h6"/></svg>',reset:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',league:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/></svg>',knockout:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M21 6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3"/></svg>',group:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',arrowLeft:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7M5 12h14"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',boot:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h2l3-4h1a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 12V8"/><path d="M8 12V8"/></svg>',medal:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',archive:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',sword:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',fire:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',share:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',certificate:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/><path d="M9 13.71V11"/><path d="M15 13.71V11"/><path d="M12 8V5"/><path d="M12 3V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>'},Eh="1.0",kh="kickoff_tournaments_v1",yv="kickoff_tournaments_backup",bv=new URLSearchParams(window.location.search),vv=bv.get("admin")==="true",f={tournaments:[],tournament:null,user:{username:"ADMIN",role:"superadmin",loggedIn:!0,loginTime:Date.now()},view:"home",theme:localStorage.getItem("kickoff_theme")||"dark",mobileStandingsMode:localStorage.getItem("mobile_standings_mode")||"compact",activeRound:1,activeBottomSheet:null,isMobile:window.innerWidth<768,onboarding:{step:0,selectedFormat:null},standingsFilter:"overall",timelineRound:null,loginError:null,isLoading:!1,isAdmin:vv,dashboardPlayers:[]};window.addEventListener("message",n=>{console.log("[TournamentSystem] Received message:",n.data),n.data.type==="PLAYERS_LIST"&&(f.dashboardPlayers=n.data.players,f.view==="standings"&&f.activeBottomSheet&&U())});window.parent!==window&&window.parent.postMessage({type:"REQUEST_PLAYERS"},"*");window.addEventListener("resize",()=>{const n=window.innerWidth<768;n!==f.isMobile&&(f.isMobile=n,U())});let Ui=null;async function le(n=!1){try{if(f.tournament){const t=f.tournaments.findIndex(s=>s.id===f.tournament.id);t!==-1?f.tournaments[t]=f.tournament:f.tournaments.push(f.tournament)}const e=JSON.stringify({version:Eh,tournaments:f.tournaments});if(localStorage.setItem(kh,e),localStorage.setItem("kickoff_theme",f.theme),n&&localStorage.setItem(yv,e),!f.tournament||!f.user)return;Ui&&clearTimeout(Ui),Ui=setTimeout(async()=>{var t;try{await sa(Xe($e,"tournaments",f.tournament.id),{...f.tournament,updatedAt:Yr(),updatedBy:((t=f.user)==null?void 0:t.username)||"system"}),console.log("[Firestore] Synced:",f.tournament.name)}catch(s){s.code==="resource-exhausted"?console.warn("[Firestore] Quota exhausted — retry soon"):console.error("[Firestore] Sync error:",s)}},1500)}catch(e){console.error("Save failed:",e)}}async function xv(){if(f.user)try{const n=await Ud(Qo($e,"tournaments"));f.tournaments=n.docs.map(e=>({id:e.id,...e.data()})),localStorage.setItem(kh,JSON.stringify({version:Eh,tournaments:f.tournaments}))}catch(n){console.error("Firestore sync failed:",n)}}async function wv(n){try{await Bd(Xe($e,"tournaments",n))}catch(e){console.error("Delete failed:",e)}}async function _v(){try{const n=ly(Qo($e,"users"),cy("role","==","superadmin"));if((await Ud(n)).empty){const t=await is("admin123");await sa(Xe($e,"users","admin"),{username:"admin",password:t,role:"superadmin",isActive:!0,createdAt:Yr(),loginAttempts:0})}}catch(n){console.warn("Admin check failed:",n)}}function Ev(){document.documentElement.classList.toggle("light-mode",f.theme==="light"),document.documentElement.classList.toggle("dark",f.theme==="dark"),document.body.style.background="#050508",document.body.style.color="#f1f5f9"}function Ih(){f.theme=f.theme==="dark"?"light":"dark",le(),U()}let Pr=!1;async function U(){console.log("[KickOff] Render called. View:",f.view);try{const n=document.getElementById("root");if(!n){console.error("[KickOff] Root element not found!");return}if(Ev(),!f.user){n.innerHTML=`
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:#475569;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">Initializing Security Protocols...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;try{await _v()}catch(e){console.warn("[KickOff] Admin check failed, proceeding to login anyway:",e)}Iv(n);return}if(!Pr){n.innerHTML=`
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
    `,Pr=!0,await xv(),U();return}f.onboarding.step>0?Av(n):f.tournament?f.tournament.status==="setup_teams"||f.tournament.status==="onboarding_summary"?Dv(n):Uv(n):Tv(n)}catch(n){alert("RENDER ERROR: "+n.message+`
`+n.stack),console.error(n)}}async function kv(n,e){f.loginError=null;const t=document.getElementById("login-btn");t&&(t.disabled=!0,t.textContent="Verifying...");try{const s=Xe($e,"users",n),r=await or(s);if(!r.exists()){f.loginError="Invalid username or password.",U();return}const i=r.data();if(i.lockedUntil&&i.lockedUntil.toDate()>new Date){const l=Math.ceil((i.lockedUntil.toDate()-new Date)/6e4);f.loginError=`Account locked. Try again in ${l} minute(s).`,U();return}if(!i.isActive){f.loginError="Account deactivated. Contact administrator.",U();return}const a=await is(e);if(i.password===a){await fo(s,{loginAttempts:0,lockedUntil:null,lastLogin:Yr()});const l={username:i.username,role:i.role,loggedIn:!0,loginTime:Date.now()};localStorage.setItem(si,JSON.stringify(l)),f.user=l,await Cr("User logged in"),U()}else{const l=(i.loginAttempts||0)+1,c={loginAttempts:l};l>=5?(c.lockedUntil=new Date(Date.now()+900*1e3),f.loginError="Too many failed attempts. Locked for 15 minutes."):f.loginError="Invalid username or password.",await fo(s,c),U()}}catch(s){console.error(s),f.loginError="Authentication error. Check your connection.",U()}}function Iv(n){n.innerHTML=`
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
            ${f.loginError?`<p style="font-size:0.75rem;font-weight:700;color:#f87171;text-align:center;padding:0.5rem 0">${f.loginError}</p>`:""}
            <button id="login-btn" type="submit" style="width:100%;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;font-weight:900;padding:1rem;border-radius:0.875rem;border:none;cursor:pointer;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;box-shadow:0 8px 24px rgba(59,130,246,0.3),0 0 40px rgba(124,58,237,0.15);margin-top:0.5rem">
              Sign In &rarr;
            </button>
          </form>
        </div>
        <p style="text-align:center;margin-top:1.5rem;font-size:0.6rem;font-weight:900;color:#1e1e32;text-transform:uppercase;letter-spacing:0.3em">Secured with Firebase &bull; v2.1</p>
      </div>
    </div>
  `,document.getElementById("toggle-pw").addEventListener("click",()=>{const e=document.getElementById("login-password");e.type=e.type==="password"?"text":"password"}),document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault(),await kv(document.getElementById("login-username").value.trim(),document.getElementById("login-password").value)})}function Tv(n){const e=f.tournaments.filter(a=>!a.archived),t=f.tournaments.filter(a=>a.archived);f.isMobile?n.innerHTML=`
      <div class="min-h-screen p-5 pb-24 safe-area-pb" style="background:#050508">
        <header class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="KickOff Logo" style="width:44px;height:44px;border-radius:12px;object-fit:cover;box-shadow:0 0 20px rgba(59,130,246,0.5),0 0 40px rgba(124,58,237,0.2)">
            <div>
              <h1 class="text-xl font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</h1>
              <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${f.isAdmin?"Control Center":"Official Hub"}</p>
            </div>
          </div>
          <button id="theme-toggle" class="p-3 rounded-xl border transition-all" style="background:#0f0f1a;border-color:#1e1e32;color:#94a3b8">
            ${O.sun}
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
              `:e.map(a=>Bc(a)).join("")}
            </div>
          </div>

          ${t.length>0?`
            <div class="pt-6">
              <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#334155">Archived</h2>
              <div class="space-y-3 opacity-50">
                ${t.map(a=>Bc(a)).join("")}
              </div>
            </div>
          `:""}
        </section>

        ${f.isAdmin?`
        <button id="new-tournament-btn" class="fixed bottom-8 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 active:scale-90 transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 10px 40px rgba(59,130,246,0.45),0 0 60px rgba(124,58,237,0.2)">
          ${O.plus}
        </button>
        `:""}
      </div>
    `:n.innerHTML=`
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
                 ${f.isAdmin?`
                 <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
                   <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.8)"></span>
                   Command Center Active
                 </div>
                 `:""}
                 <h1 class="text-5xl font-black tracking-tighter" style="background:linear-gradient(135deg,#f1f5f9 30%,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${f.isAdmin?"Your Tournaments":"Official Tournaments"}</h1>
                 <p class="font-bold tracking-[0.3em] uppercase text-xs" style="color:#475569">${f.isAdmin?"Manage multiple disciplines":"Live Competition Center"}</p>
               </div>
             </div>
             <div class="flex items-center gap-4">
               ${f.isAdmin?`
               <button id="new-tournament-btn" class="flex items-center gap-4 font-black px-10 py-5 rounded-2xl transition-all group" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 8px 32px rgba(59,130,246,0.35),0 0 60px rgba(124,58,237,0.15);color:white">
                 <span class="group-hover:rotate-90 transition-transform duration-300">${O.plus}</span>
                 <span class="uppercase tracking-widest text-sm">New Tournament</span>
               </button>
               `:""}
             </div>
          </div>

          ${e.length===0?`
            <div class="rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed" style="background:rgba(15,15,26,0.5);border-color:#1e1e32">
              <div class="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto" style="background:#0a0a12;border:1px solid #1e1e32;color:#334155">
                ${O.trophy}
              </div>
              <div class="space-y-3">
                <h3 class="text-2xl font-black" style="color:#475569">No active tournaments</h3>
                <p class="text-sm font-medium" style="color:#334155">${f.isAdmin?"Create your first tournament to get started.":"Waiting for the next season to begin..."}</p>
              </div>
              ${f.isAdmin?`
              <button id="new-tournament-btn-empty" class="px-10 py-4 rounded-2xl font-black text-sm transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 8px 32px rgba(59,130,246,0.3)">Create Tournament</button>
              `:""}
            </div>
          `:`
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${e.map(a=>jc(a)).join("")}
            </div>
          `}

          ${t.length>0?`
            <div class="pt-20 space-y-8" style="border-top:1px solid #0f0f1a">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-black uppercase tracking-widest" style="color:#334155">Archived</h2>
                <div class="flex-1" style="height:1px;background:#0f0f1a"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                ${t.map(a=>jc(a)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `;const s=document.getElementById("new-tournament-btn");s&&s.addEventListener("click",()=>{if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached. Delete old ones to create new.");return}f.onboarding.step=1,U()});const r=document.getElementById("new-tournament-btn-empty");r&&r.addEventListener("click",()=>{f.onboarding.step=1,U()});const i=document.getElementById("theme-toggle");i&&i.addEventListener("click",Ih),n.querySelectorAll(".open-tournament").forEach(a=>{a.addEventListener("click",()=>{const l=a.dataset.id;f.tournament=f.tournaments.find(c=>c.id===l),f.view="dashboard",U()})}),n.querySelectorAll(".next-season-btn").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation(),ha(a.dataset.id)})}),n.querySelectorAll(".view-champion-btn").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const c=a.dataset.id;f.tournament=f.tournaments.find(d=>d.id===c),f.view="champion",U()})}),n.querySelectorAll(".archive-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const c=a.dataset.id,d=f.tournaments.find(h=>h.id===c);d&&(d.archived=!d.archived,le(),U())})}),n.querySelectorAll(".delete-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const c=a.dataset.id;Th(c)})}),n.querySelectorAll(".duplicate-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const c=a.dataset.id,d=f.tournaments.find(x=>x.id===c);if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}const h=JSON.parse(JSON.stringify(d));h.id=`t-${Date.now()}`,h.archived=!1;let m=`${d.name} (Copy)`,y=1;for(;f.tournaments.some(x=>x.name.toLowerCase()===m.toLowerCase());)m=`${d.name} (Copy ${++y})`;h.name=m,h.fixtures=d.fixtures.map(x=>({...x,homeScore:null,awayScore:null,status:"upcoming"})),h.status="active",f.tournaments.push(h),le(),U()})})}function Th(n){const e=f.tournaments.find(s=>s.id===n);if(!e)return;const t=document.createElement("div");t.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.9);backdrop-filter:blur(16px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem",t.innerHTML=`
    <div style="background:#0f0f1a;width:100%;max-width:420px;border-radius:2rem;padding:3rem;border:1px solid #1e1e32;text-align:center;box-shadow:0 40px 80px rgba(0,0,0,0.8)">
      <div style="width:5rem;height:5rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:1.5rem;display:flex;align-items:center;justify-content:center;color:#f87171;margin:0 auto 1.5rem">
        ${O.trash}
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
  `,document.body.appendChild(t),document.getElementById("confirm-delete").addEventListener("click",async()=>{var r;const s=e.name;f.tournaments=f.tournaments.filter(i=>i.id!==n);try{await wv(n),await Cr(`Deleted tournament: ${s}`)}catch(i){console.error("Firestore delete failed:",i)}le(),t.remove(),((r=f.tournament)==null?void 0:r.id)===n&&(f.tournament=null,f.view="home"),U(),Dr(`${s} deleted`)}),document.getElementById("cancel-delete").addEventListener("click",()=>{t.remove()})}function Dr(n){const e=document.createElement("div");e.style.cssText="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));border:1px solid rgba(96,165,250,0.3);color:#93c5fd;font-weight:900;padding:0.875rem 2rem;border-radius:1rem;box-shadow:0 8px 32px rgba(59,130,246,0.2),0 0 60px rgba(124,58,237,0.1);z-index:200;pointer-events:none;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;backdrop-filter:blur(12px);animation:float-up 0.3s ease forwards",e.innerText=n,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transition="opacity 0.3s",setTimeout(()=>e.remove(),300)},3e3)}function Bc(n){const e=n.fixtures.filter(i=>i.status==="completed").length,t=n.fixtures.length,s=t>0?e/t*100:0,r=O[n.type==="groups"?"group":n.type==="knockout"?"knockout":"league"];return`
    <div data-id="${n.id}" class="open-tournament rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all" style="background:#0f0f1a;border:1px solid #1e1e32">
       <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style="background:#050508;border:1px solid #1e1e32;color:#60a5fa">
         ${n.logo?`<img src="${n.logo}" class="w-full h-full object-cover">`:r}
       </div>
       <div class="flex-1 min-w-0">
         <h3 class="font-black tracking-tight uppercase truncate" style="color:#f1f5f9">${n.name}</h3>
         <div class="flex items-center gap-2 mt-1">
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#60a5fa">${n.type.replace("_"," ")}</span>
           <span style="color:#1e293b;font-size:9px">•</span>
           <span class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${Math.round(s)}%</span>
         </div>
         <div class="mt-2 rounded-full overflow-hidden" style="height:2px;background:#0a0a12">
           <div class="h-full" style="width:${s}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 6px rgba(59,130,246,0.5)"></div>
         </div>
       </div>
       <span style="color:#1e293b">›</span>
    </div>
  `}function jc(n){const e=n.fixtures.filter(c=>c.status==="completed").length,t=n.fixtures.length,s=t>0?e/t*100:0;let r,i;n.archived?(i="Archived",r="background:#0a0a12;color:#475569;border-color:#1e1e32"):e===t&&t>0?(i="Completed",r="background:rgba(16,185,129,0.08);color:#34d399;border-color:rgba(16,185,129,0.2)"):e>0?(i="Live",r="background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25)"):(i="Upcoming",r="background:#0a0a12;color:#475569;border-color:#1e1e32");const a={round_robin:"Round Robin",knockout:"Knockout",league:"Full League",groups:"Group+KO"},l=O[n.type==="groups"?"group":n.type==="knockout"?"knockout":"league"];return`
    <div class="rounded-[2rem] p-8 flex flex-col justify-between h-[420px] transition-all group relative overflow-hidden" style="background:#0f0f1a;border:1px solid #1e1e32;box-shadow:0 20px 60px rgba(0,0,0,0.5)" onmouseover="this.style.borderColor='rgba(59,130,246,0.25)'" onmouseout="this.style.borderColor='#1e1e32'">
      ${n.archived?'<div class="absolute inset-0 pointer-events-none" style="background:rgba(5,5,8,0.3)"></div>':""}
      <!-- gradient progress bar bottom -->
      <div class="absolute inset-x-0 bottom-0 overflow-hidden" style="height:2px;background:#0a0a12">
        <div class="h-full transition-all duration-1000" style="width:${s}%;background:linear-gradient(90deg,#3b82f6,#7c3aed);box-shadow:0 0 8px rgba(59,130,246,0.6)"></div>
      </div>
      <!-- Subtle orb glow on hover -->
      <div class="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style="background:radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)"></div>

      <div class="space-y-5 relative z-10">
        <div class="flex items-center justify-between">
           <div class="flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest" style="${r}">
             ${i}
           </div>
           ${f.isAdmin?`
            <div class="flex gap-2">
              <button data-id="${n.id}" class="archive-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="${n.archived?"Restore":"Archive"}" onmouseover="this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.archive}</button>
              <button data-id="${n.id}" class="duplicate-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Duplicate" onmouseover="this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.copy}</button>
              <button data-id="${n.id}" class="delete-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Delete" onmouseover="this.style.color='#f87171';this.style.borderColor='rgba(239,68,68,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.trash}</button>
            </div>
            `:""}
        </div>
        <div class="flex items-center gap-4">
          ${n.logo?`<img src="${n.logo}" class="w-14 h-14 rounded-xl object-contain p-1 border" style="background:#0a0a12;border-color:#1e1e32">`:`
            <div class="w-14 h-14 rounded-xl flex items-center justify-center" style="background:#0a0a12;border:1px solid #1e1e32;color:#60a5fa">${l}</div>
          `}
          <div>
            <h3 class="text-xl font-black tracking-tight mb-1 line-clamp-1 transition-all" style="color:#f1f5f9">${n.name}</h3>
            <p class="text-[10px] font-black uppercase tracking-widest" style="color:#475569">${a[n.type]||n.type} &bull; ${n.teams.length} Teams &bull; S${n.season||1}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4 relative z-10">
        <div class="flex items-center justify-between">
           <div>
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Progress</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${Math.round(s)}%</p>
           </div>
           <div class="text-right">
              <p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#334155">Matches</p>
              <p class="text-xl font-black font-mono" style="color:#94a3b8">${e}/${t}</p>
           </div>
        </div>
        <button data-id="${n.id}" class="open-tournament w-full font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
          ${n.archived?"View Archive &rarr;":"Open Tournament &rarr;"}
        </button>
        ${e===t&&t>0?`
          <div class="flex gap-2">
            <button data-id="${n.id}" class="view-champion-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 4px 20px rgba(59,130,246,0.3)">
               Champions
            </button>
            <button data-id="${n.id}" class="next-season-btn flex-1 font-black py-3.5 rounded-xl transition-all uppercase tracking-widest text-[8.5px] flex items-center justify-center gap-1.5" style="background:#0a0a12;border:1px solid #1e1e32;color:#94a3b8" onmouseover="this.style.background='linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15))';this.style.borderColor='rgba(59,130,246,0.3)';this.style.color='#f1f5f9'" onmouseout="this.style.background='#0a0a12';this.style.borderColor='#1e1e32';this.style.color='#94a3b8'">
               Next Season &rarr;
            </button>
          </div>
        `:""}
      </div>
    </div>
  `}function Av(n){f.onboarding.step===1?Sv(n):f.onboarding.step===2&&Cv(n)}function Sv(n){const e=[{id:"round_robin",name:"Round Robin",icon:O.league,desc:"Small local competition. Every team plays everyone once.",color:"text-indigo-400"},{id:"knockout",name:"Knockout",icon:O.knockout,desc:"High stakes drama. Win or go home sudden-death.",color:"text-red-400"},{id:"groups",name:"Group + KO",icon:O.group,desc:"World Cup format. Group stage followed by brackets.",color:"text-emerald-400"},{id:"league",name:"Full League",icon:O.league,desc:"Double round robin. The ultimate consistency test.",color:"text-yellow-400"}];f.isMobile?(n.innerHTML=`
      <div class="min-h-screen bg-slate-950 p-6 flex flex-col">
        <header class="mb-10 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Phase 1/2</div>
          <h1 class="text-3xl font-black text-slate-100 tracking-tighter uppercase">Select Format</h1>
        </header>

        <div class="space-y-4 flex-1">
          ${e.map(s=>`
            <button data-format="${s.id}" class="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left active:bg-slate-800 flex items-center gap-5 transition-all">
              <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center ${s.color} flex-shrink-0 shadow-inner">
                ${s.icon}
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black text-slate-100 tracking-tight uppercase">${s.name}</h3>
                <p class="text-xs text-slate-500 leading-tight">${s.desc}</p>
              </div>
            </button>
          `).join("")}
        </div>
        
        <button id="cancel-onboarding" class="mt-8 w-full py-5 text-slate-600 font-bold uppercase text-[10px] tracking-[0.2em]">Abort Mission</button>
      </div>
    `,document.getElementById("cancel-onboarding").addEventListener("click",()=>{f.onboarding.step=0,U()})):n.innerHTML=`
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
            ${e.map(s=>`
              <button data-format="${s.id}" class="format-card bg-slate-900 border border-slate-800 p-8 rounded-[3rem] text-left hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group flex flex-col justify-between h-[420px] shadow-3xl relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:to-indigo-500/5 transition-all duration-500"></div>
                
                <div class="space-y-8 relative z-10">
                  <div class="w-16 h-16 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center ${s.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                    ${s.icon}
                  </div>
                  <div class="space-y-3">
                    <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${s.name}</h3>
                    <p class="text-xs text-slate-400 leading-relaxed font-medium">${s.desc}</p>
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
    `;const t=document.getElementById("cancel-onboarding-desktop");t&&t.addEventListener("click",()=>{f.onboarding.step=0,U()}),n.querySelectorAll("[data-format]").forEach(s=>{s.addEventListener("click",()=>{f.onboarding.selectedFormat=s.dataset.format,f.onboarding.step=2,U()})})}function Rv(n){return new Promise((e,t)=>{const s=new FileReader;s.readAsDataURL(n),s.onload=()=>e(s.result),s.onerror=r=>t(r)})}function Cv(n){const e=f.onboarding.selectedFormat,t=e==="groups",s=e==="league";n.innerHTML=`
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
             <div id="logo-placeholder">${O[e==="groups"?"group":e==="knockout"?"knockout":"league"]}</div>
             <img id="logo-preview" class="absolute inset-0 w-full h-full object-contain hidden" style="background: transparent;">
             <label for="logo-upload" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span class="text-[10px] font-black text-white uppercase tracking-widest">${O.plus}</span>
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
            
            ${t?`
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
                  <option value="2" ${s?"selected":""}>Home & Away</option>
                </select>
              </div>
            `}
          </div>

          ${s?`
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

          <div id="est-matches" class="bg-slate-950 p-5 rounded-2xl md:rounded-[2rem] border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400">
                ${O.fixtures}
              </div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Schedule Capacity</span>
            </div>
            <span id="matchCountLabel" class="text-slate-100 font-black font-mono text-lg tracking-tighter italic">-- Matches</span>
          </div>

          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 md:py-6 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-indigo-900/40 text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 group active:scale-95">
            <span>Provision Unit</span>
            <span class="group-hover:translate-x-2 transition-transform">${O.star}</span>
          </button>
        </form>
      </div>
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{f.onboarding.step=1,U()});const r=document.getElementById("config-form"),i=document.getElementById("matchCountLabel"),a=document.getElementById("teamCountInput"),l=()=>{var y;const d=parseInt(a.value)||0,h=e;let m=0;if(h==="round_robin"||h==="league"){const x=parseInt(((y=r.elements.legs)==null?void 0:y.value)||(h==="league"?2:1));m=d*(d-1)/2*x}else if(h==="knockout"){const x=parseInt(r.elements.legs.value);m=(d-1)*x}else if(h==="groups"){const x=parseInt(r.elements.groupSize.value),A=Math.ceil(d/x),S=x*(x-1)/2;m=A*S+(A*2-1)}i.innerText=`${Math.floor(m)} Matches`};r.addEventListener("input",l),l();let c=null;document.getElementById("logo-upload").addEventListener("change",async d=>{const h=d.target.files[0];if(h){if(h.size>2*1024*1024){alert("Maximum size 2MB allowed.");return}c=await Rv(h);const m=document.getElementById("logo-preview"),y=document.getElementById("logo-placeholder");m.src=c,m.classList.remove("hidden"),y.classList.add("hidden")}}),document.getElementById("back-btn").addEventListener("click",()=>{f.onboarding.step=1,U()}),r.addEventListener("submit",d=>{d.preventDefault();const h=new FormData(d.target);Pv({name:h.get("name"),startDate:h.get("startDate"),type:e,logo:c,teamCount:parseInt(h.get("teamCount")),legs:parseInt(h.get("legs")||(e==="league"?2:1)),groupSize:parseInt(h.get("groupSize")||0),promoSpots:parseInt(h.get("promoSpots")||0),relegationSpots:parseInt(h.get("relegationSpots")||0),continentalSpots:parseInt(h.get("continentalSpots")||0)})})}function Pv(n){if(f.tournaments.find(t=>t.name.toLowerCase()===n.name.toLowerCase())){alert("A tournament with this name already exists. Choose a unique title.");return}f.tournament={id:`t-${Date.now()}`,...n,teams:Array.from({length:n.teamCount},(t,s)=>({id:s,name:`Team ${s+1}`,players:[]})),fixtures:[],standings:[],groups:[],currentStage:n.type==="groups"?"groups":n.type,status:"setup_teams",createdAt:new Date().toISOString()},f.onboarding.step=0,le(),U()}function Dv(n){n.innerHTML=`
    <div class="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <main class="flex-1 p-6 md:p-10 lg:p-16 overflow-auto">
        <div id="view-container"></div>
      </main>
    </div>
  `;const e=document.getElementById("view-container");f.tournament.status==="setup_teams"?Vv(e):f.tournament.status==="onboarding_summary"&&Nv(e)}function Vv(n){const e=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#f97316","#14b8a6","#3b82f6"];n.innerHTML=`
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
          <span class="group-hover:translate-x-1 transition-transform border-l border-white/20 pl-4 ml-4">${O.fixtures}</span>
        </button>
      </div>
      
      <div id="team-inputs" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        ${f.tournament.teams.map((i,a)=>`
          <div class="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-all flex items-center gap-4 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-700 relative overflow-hidden">
               <input type="color" data-color-id="${i.id}" value="${e[a%e.length]}" class="absolute inset-0 w-full h-full border-none p-0 cursor-pointer opacity-0">
               <div id="team-img-container-${i.id}" class="absolute inset-0 ${i.image?"":"hidden"}">
                 <img src="${i.image||""}" class="w-full h-full object-cover">
               </div>
               <div style="background-color: ${e[a%e.length]}" class="w-6 h-6 rounded-full shadow-inner team-color-dot" data-dot-id="${i.id}"></div>
            </div>
            <div class="flex-1">
               <label class="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Squad Name</label>
               <input type="text" data-team-id="${i.id}" value="${i.name}" list="club-players" class="team-name-input w-full bg-transparent border-none focus:ring-0 text-lg font-black text-slate-100 placeholder:text-slate-800" placeholder="Type name for suggestions...">
            </div>
          </div>
        `).join("")}
      </div>

      <datalist id="club-players">
        ${f.dashboardPlayers.map(i=>`<option value="${i.name}">${i.ovr} OVR • #${i.number}</option>`).join("")}
      </datalist>
    </div>
  `,document.querySelectorAll(".team-name-input").forEach(i=>{i.addEventListener("input",a=>{const l=a.target.value.trim(),c=f.dashboardPlayers.find(y=>y.name.toLowerCase()===l.toLowerCase()),d=parseInt(a.target.dataset.teamId),h=f.tournament.teams.find(y=>y.id===d),m=document.getElementById(`team-img-container-${d}`);c?(h.playerId=c.id,h.image=c.image,m&&(m.querySelector("img").src=c.image,m.classList.remove("hidden"))):(h.playerId=null,h.image=null,m&&m.classList.add("hidden"))})}),document.querySelectorAll('input[type="color"]').forEach(i=>{i.addEventListener("input",a=>{const l=a.target.dataset.colorId,c=document.querySelector(`.team-color-dot[data-dot-id="${l}"]`);c&&(c.style.backgroundColor=a.target.value)})});const t=()=>{if(console.log("Back button clicked!"),!!f.tournament)try{f.tournaments=f.tournaments.filter(i=>i&&i.id!==f.tournament.id),f.tournament=null,f.onboarding.step=2,le(),U()}catch(i){console.error(i),alert("Error going back: "+i.message)}},s=document.getElementById("back-to-config-btn");s&&s.addEventListener("click",t);const r=document.getElementById("back-to-config-btn-mobile");r&&r.addEventListener("click",t),document.getElementById("generate-fixtures-btn").addEventListener("click",()=>{document.querySelectorAll(".team-name-input").forEach(i=>{const a=parseInt(i.dataset.teamId),l=document.querySelector(`input[data-color-id="${a}"]`);f.tournament.teams[a].name=i.value||`Team ${a+1}`,f.tournament.teams[a].color=l?l.value:"#6366f1"}),le(),$v()})}function Nv(n){const{fixtures:e}=f.tournament,t=Math.max(...e.map(s=>s.round),0);n.innerHTML=`
    <div class="min-h-screen flex items-center justify-center -mt-20">
      <div class="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-3xl p-12 border border-slate-800 text-center animate-in fade-in zoom-in duration-500">
        <div class="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-8 shadow-[0_0_40px_rgba(79,70,229,0.4)]">
          ${O.trophy}
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
             <p class="text-2xl font-black text-slate-100 font-mono">${t}</p>
          </div>
        </div>
        <button id="begin-ops-btn" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/20">
          Begin Operations &rarr;
        </button>
      </div>
    </div>
  `,document.getElementById("begin-ops-btn").addEventListener("click",()=>{f.tournament.status="active",le(),U()})}function Mv(n="auto",e={}){const{type:t,teams:s,legs:r=1,groupSize:i=4}=f.tournament;if(t==="round_robin"||t==="league")if(n==="semi"){const l=s.length%2===0?s.length:s.length+1;f.tournament.fixtures=mv(s,e,(l-1)*r,r,t)}else f.tournament.fixtures=da(s,r,t);else if(t==="knockout")f.tournament.fixtures=pv(s,1,r);else if(t==="groups"){const{groups:l,fixtures:c}=fv(s,i);f.tournament.groups=l,f.tournament.fixtures=c}const a=gv(f.tournament.fixtures);a.length&&console.warn("[FixtureEngine]",a)}function Lv(n,e=1,t=1){let s=1;for(;s<n.length;)s*=2;const r=s,i=[],a=[...n].sort(()=>Math.random()-.5),l=(h,m,y,x,A)=>({id:`ko-r${h}-m${m}-l${y}`,homeId:x,awayId:x===null?null:A,homeScore:null,awayScore:null,status:"upcoming",round:h+y,matchIndex:m,stage:"knockout",leg:y+1});for(let h=0;h<r/2;h++){const m=a[h*2]||null,y=a[h*2+1]||null;if(m&&y)for(let x=0;x<t;x++)i.push(l(e,h,x,x===0?m.id:y.id,x===0?y.id:m.id))}let c=r/2,d=e+t;for(;c>1;){c/=2;for(let h=0;h<c;h++)for(let m=0;m<t;m++)i.push(l(d,h,m,null,null));d+=t}if(r>n.length){const h=e+t;for(let m=0;m<r/2;m++){const y=a[m*2]||null,x=a[m*2+1]||null;if(!y||!x){const A=y||x,S=Math.floor(m/2),C=m%2===0?"homeId":"awayId",N=i.find(L=>L.round===h&&L.matchIndex===S);N&&(N[C]=A.id)}}}return i}function $v(){const n=document.createElement("div");n.id="fixture-wizard",n.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto";const{type:e,teams:t,legs:s=1}=f.tournament,r=e==="knockout",i=e==="groups",a=!r&&!i;n.innerHTML=`
    <div style="width:100%;max-width:620px;background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:${f.isMobile?"1.25rem":"2.5rem"};box-shadow:0 40px 80px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
      <div style="margin-bottom:2rem">
        <div style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.25em;margin-bottom:0.4rem">Fixture Engine v2</div>
        <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;margin:0">Choose Generation Mode</h2>
        <p style="font-size:0.75rem;color:#475569;margin-top:0.5rem">${t.length} teams · ${e.replace("_"," ")}${a?` · ${s} leg${s>1?"s":""}`:""}</p>
      </div>
      <div id="mode-tabs" style="display:grid;grid-template-columns:${f.isMobile?"1fr":r||i?"1fr 1fr":"repeat(3,1fr)"};gap:0.75rem;margin-bottom:1.5rem">
        <button class="wiz-mode" data-mode="auto" style="padding:1rem;border-radius:1rem;border:2px solid #3b82f6;background:rgba(59,130,246,0.1);cursor:pointer;text-align:center">
          <div style="font-size:1.4rem;margin-bottom:0.35rem">⚡</div>
          <div style="font-size:0.7rem;font-weight:900;color:#60a5fa;text-transform:uppercase;letter-spacing:0.1em">Auto</div>
          <div style="font-size:0.6rem;color:#334155;margin-top:0.2rem">Full algorithm</div>
        </button>
        ${a?`<button class="wiz-mode" data-mode="semi" style="padding:1rem;border-radius:1rem;border:2px solid #1e1e32;background:#0a0a12;cursor:pointer;text-align:center">
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
  `,document.body.appendChild(n);let l="auto";const c={};let d=[];function h(x){l=x,n.querySelectorAll(".wiz-mode").forEach(A=>{const S=A.dataset.mode===x;A.style.border=S?"2px solid #3b82f6":"2px solid #1e1e32",A.style.background=S?"rgba(59,130,246,0.1)":"#0a0a12";const C=A.querySelector("div:nth-child(2)");C&&(C.style.color=S?"#60a5fa":"#94a3b8")}),m(x)}function m(x){const A=document.getElementById("wiz-panel");if(x==="auto"){const S=a?'<strong style="color:#60a5fa">Berger Circle</strong> round-robin — every team plays exactly once per matchday. Home/away alternates each leg. Odd teams get a fair BYE rotation.':r?`<strong style="color:#60a5fa">Seeded bracket</strong> — teams placed 1–${t.length} in optimal positions. BYE teams auto-advance. Subsequent rounds pre-generated as empty slots.`:'<strong style="color:#60a5fa">Randomised group draw</strong> then Berger round-robin within each group.';A.innerHTML=`
        <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:1.25rem">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.7;margin:0">${S}</p>
          <div style="margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:0.65rem;color:#60a5fa;font-weight:900">
            ✓ No team plays twice on the same matchday &nbsp;|&nbsp; ✓ Validated before saving
          </div>
        </div>`}else if(x==="semi"){const C=((t.length%2===0?t.length:t.length+1)-1)*s,N=Math.min(C,8),L=t.map(G=>`<option value="${G.id}">${G.name}</option>`).join(""),K=Math.floor(t.length/2);let q="";for(let G=1;G<=N;G++){let X="";for(let _=0;_<K;_++)X+=`
            <div style="display:grid;grid-template-columns:1fr 0.4rem 1fr;gap:0.5rem;align-items:center;margin-top:0.4rem">
              <select data-round="${G}" data-match="${_}" data-side="home" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Home</option>${L}
              </select>
              <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
              <select data-round="${G}" data-match="${_}" data-side="away" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Away</option>${L}
              </select>
            </div>`;q+=`<div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem;margin-bottom:0.5rem">
          <span style="font-size:0.6rem;font-weight:900;color:#334155;white-space:nowrap;display:block;margin-bottom:0.2rem">MD ${G}</span>
          ${X}
        </div>`}A.innerHTML=`
        <p style="font-size:0.72rem;color:#475569;margin:0 0 0.75rem">Optionally pin matches per matchday (Max ${K}). Leave blank to let the algorithm decide.</p>
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:300px;overflow-y:auto">${q}</div>
        <p style="font-size:0.6rem;color:#334155;margin-top:0.5rem">Showing ${N} of ${C} matchdays. Algorithm fills all unpinned slots automatically.</p>`,A.querySelectorAll(".sp").forEach(G=>{G.addEventListener("change",()=>{const X=parseInt(G.dataset.round),_=parseInt(G.dataset.match);c[X]||(c[X]=[]),c[X][_]||(c[X][_]={}),c[X][_][G.dataset.side==="home"?"homeId":"awayId"]=G.value?parseInt(G.value):null})})}else y(A)}function y(x){const A=t.map(S=>`<option value="${S.id}">${S.name}</option>`).join("");x.innerHTML=`
      <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:0.875rem;margin-bottom:0.625rem">
        <div style="display:grid;grid-template-columns:1fr 0.3fr 1fr 52px 36px;gap:0.4rem;align-items:center">
          <select id="m-home" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Home</option>${A}</select>
          <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
          <select id="m-away" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none"><option value="">Away</option>${A}</select>
          <input id="m-round" type="number" min="1" placeholder="MD" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.45rem;color:#94a3b8;font-size:0.72rem;outline:none;text-align:center;width:100%">
          <button id="m-add" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);border:none;color:white;font-weight:900;font-size:1rem;border-radius:0.5rem;cursor:pointer;height:100%;width:100%">＋</button>
        </div>
        <p id="m-err" style="font-size:0.65rem;color:#f87171;margin-top:0.4rem;display:none"></p>
      </div>
      <div style="font-size:0.65rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">${d.length} fixture${d.length!==1?"s":""} added</div>
      <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:0.35rem">
        ${d.length===0?'<p style="font-size:0.72rem;color:#334155;text-align:center;padding:1rem 0">No fixtures yet — add some above.</p>':d.map((S,C)=>{var K,q;const N=((K=t.find(G=>G.id===S.homeId))==null?void 0:K.name)||"?",L=((q=t.find(G=>G.id===S.awayId))==null?void 0:q.name)||"?";return`<div style="display:flex;align-items:center;justify-content:space-between;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.625rem;padding:0.45rem 0.75rem">
                <span style="font-size:0.75rem;color:#94a3b8"><strong style="color:#60a5fa">MD${S.round}</strong>  ${N} <span style="color:#334155">vs</span> ${L}</span>
                <button data-del="${C}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:0.9rem;padding:0 0.25rem">✕</button>
              </div>`}).join("")}
      </div>`,document.getElementById("m-add").addEventListener("click",()=>{const S=parseInt(document.getElementById("m-home").value),C=parseInt(document.getElementById("m-away").value),N=parseInt(document.getElementById("m-round").value),L=document.getElementById("m-err");if(L.style.display="none",!S||!C){L.textContent="Select both teams.",L.style.display="block";return}if(S===C){L.textContent="Home and away must differ.",L.style.display="block";return}if(!N||N<1){L.textContent="Enter a valid matchday (≥1).",L.style.display="block";return}if(d.filter(q=>q.round===N).some(q=>q.homeId===S||q.awayId===S||q.homeId===C||q.awayId===C)){L.textContent="A team already plays on this matchday!",L.style.display="block";return}d.push({id:`man-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,homeId:S,awayId:C,round:N,homeScore:null,awayScore:null,status:"upcoming",stage:r?"knockout":e,date:null,venue:null}),y(x)}),x.querySelectorAll("[data-del]").forEach(S=>{S.addEventListener("click",()=>{d.splice(parseInt(S.dataset.del),1),y(x)})})}n.querySelectorAll(".wiz-mode").forEach(x=>x.addEventListener("click",()=>h(x.dataset.mode))),m("auto"),document.getElementById("wiz-confirm").addEventListener("click",()=>{if(l==="manual"){if(d.length===0){Dr("Add at least one fixture first.");return}f.tournament.fixtures=d}else Mv(l,c);f.tournament.status="onboarding_summary",le(),n.remove(),U()}),document.getElementById("wiz-cancel").addEventListener("click",()=>n.remove())}function Ov(){return`
    <header class="backdrop-blur-xl border-b p-3 sticky top-0 z-50 flex items-center justify-between no-print" style="background:rgba(10,10,18,0.92);border-color:#1e1e32">
      <div class="flex items-center gap-2.5 overflow-hidden" ${f.isAdmin?'id="mobile-switcher-btn"':""}>
        <img src="/logo.png" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(59,130,246,0.4),0 0 24px rgba(124,58,237,0.15);flex-shrink:0">
        <div class="overflow-hidden">
          <div class="text-[8px] font-black uppercase tracking-widest" style="color:#475569">Tournament</div>
          <h2 class="text-sm font-black truncate tracking-tighter uppercase" style="color:#f1f5f9">${f.tournament.name}</h2>
        </div>
        ${f.isAdmin?`<span class="ml-1" style="color:#334155">${O.menu}</span>`:""}
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle-mobile" class="p-2 rounded-xl border transition-all active:scale-95" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
          ${f.theme==="dark"?O.sun:O.moon}
        </button>
      </div>
    </header>
  `}function Fv(){return`
    <nav class="fixed bottom-0 inset-x-0 grid grid-cols-5 safe-area-pb z-50 no-print" style="background:rgba(10,10,18,0.95);border-top:1px solid #1e1e32;backdrop-filter:blur(20px);box-shadow:0 -10px 40px rgba(0,0,0,0.6)">
       ${[{id:"dashboard",label:"Home",icon:O.home},{id:"fixtures",label:"Matches",icon:O.fixtures},{id:"standings",label:"Stats",icon:O.standings},{id:"teams",label:"Squads",icon:O.teams},{id:"more",label:"More",icon:O.more}].map(e=>{const t=f.view===e.id||e.id==="more"&&["scorers","bracket","awards","summary"].includes(f.view);return`
           <button data-nav="${e.id}" class="flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90" style="color:${t?"#60a5fa":"#475569"}">
             <span class="w-5 h-5">${e.icon}</span>
             <span class="text-[8px] font-black uppercase tracking-widest" style="opacity:${t?1:.5}">${e.label}</span>
             ${t?'<span class="absolute bottom-0 w-8 h-0.5 rounded-full" style="background:linear-gradient(90deg,#3b82f6,#7c3aed)"></span>':""}
           </button>
         `}).join("")}
    </nav>
  `}function bo(n,e=!1){const t=document.getElementById("bottom-sheet-container"),s=e?"custom":n;if(f.activeBottomSheet===s&&!e){f.activeBottomSheet=null,t.innerHTML="";return}f.activeBottomSheet=s;let r="";e?r=n:s==="more"?r=`
      <div class="space-y-3 p-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">More Options</h4>
          <span class="text-slate-700 font-mono text-[9px] uppercase">v2.1</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button data-view-mobile="scorers" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.boot}</span>
             <span class="text-xs font-black uppercase tracking-tight">Top Scorers</span>
          </button>
          <button data-view-mobile="bracket" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.bracket}</span>
             <span class="text-xs font-black uppercase tracking-tight">Knockout Stage</span>
          </button>
          <button data-view-mobile="history" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.certificate}</span>
             <span class="text-xs font-black uppercase tracking-tight">League History</span>
          </button>
          ${f.isAdmin?`
          <button data-view-mobile="summary" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.trophy}</span>
             <span class="text-xs font-black uppercase tracking-tight">Tournament Report</span>
          </button>
          <button data-view-mobile="awards" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.medal}</span>
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
        ${f.isAdmin?`
        <div class="h-px bg-slate-800/50 my-3"></div>
        <button id="logout-btn" class="w-full flex items-center justify-center gap-4 p-5 rounded-2xl border font-black uppercase text-[10px] tracking-[0.2em] transition-all" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2);color:#f87171">
           ${O.trash} Sign Out
        </button>
        `:""}
      </div>
    `:s==="switcher"&&(r=`
      <div class="space-y-6 p-8">
        <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Tournament Registry</h4>
        <div class="space-y-3 max-h-[50vh] overflow-auto">
          ${f.tournaments.map(i=>`
            <button data-switch="${i.id}" class="w-full p-6 bg-slate-950 border ${f.tournament.id===i.id?"border-indigo-500 bg-indigo-500/5":"border-slate-800"} rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98]">
               <div class="flex flex-col items-start">
                 <span class="font-black text-sm uppercase tracking-tighter ${f.tournament.id===i.id?"text-indigo-400":"text-slate-100"}">${i.name}</span>
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${i.type} &bull; ${i.teams.length} Teams</span>
               </div>
               ${f.tournament.id===i.id?'<span class="text-indigo-500 text-xs">●</span>':""}
            </button>
          `).join("")}
        </div>
        <button id="exit-tournament" class="w-full p-6 bg-slate-800 rounded-[2rem] text-slate-300 font-black uppercase text-[10px] tracking-widest border border-slate-700 shadow-xl">
           EXIT TO COMMAND CENTER &rarr;
        </button>
      </div>
    `),t.innerHTML=`
    <div id="bs-backdrop" class="fixed inset-0 z-[90]" style="background:rgba(5,5,8,0.85);backdrop-filter:blur(12px)"></div>
    <div id="bs-body" class="fixed inset-x-0 bottom-0 rounded-t-[3rem] z-[100] pb-10 safe-area-pb max-h-[90vh] overflow-auto" style="background:#0f0f1a;border-top:1px solid #2a2a48;box-shadow:0 -40px 80px rgba(0,0,0,0.8)">
       <div class="w-12 h-1 rounded-full mx-auto mt-6 mb-4" style="background:#1e1e32"></div>
       ${r}
    </div>
  `,document.getElementById("bs-backdrop").addEventListener("click",()=>{f.activeBottomSheet=null,t.innerHTML=""}),s==="more"?(document.querySelectorAll("[data-view-mobile]").forEach(i=>i.addEventListener("click",()=>{f.view=i.dataset.viewMobile,f.activeBottomSheet=null,t.innerHTML="",U()})),document.getElementById("logout-btn").addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(si),f.user=null,f.tournament=null,f.tournaments=[],Pr=!1,f.activeBottomSheet=null,t.innerHTML="",U())})):s==="switcher"&&(document.querySelectorAll("[data-switch]").forEach(i=>i.addEventListener("click",()=>{f.tournament=f.tournaments.find(a=>a.id===i.dataset.switch),f.view="dashboard",f.activeBottomSheet=null,t.innerHTML="",U()})),document.getElementById("exit-tournament").addEventListener("click",()=>{f.tournament=null,f.view="home",f.activeBottomSheet=null,t.innerHTML="",U()}))}function Uv(n){var t;const e=f.tournament.archived;f.isMobile?n.innerHTML=`
      <div class="flex flex-col min-h-screen" style="background:#050508;color:#f1f5f9">
        ${Ov()}
        <main id="main-content" class="flex-1 p-5 pb-32 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div id="view-container"></div>
        </main>
        ${Fv()}
        <div id="bottom-sheet-container"></div>
      </div>
    `:n.innerHTML=`
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
            ${f.isAdmin?`
            <button id="back-to-home" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm mb-4" style="color:#475569" onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'">
              <span class="w-4 h-4">${O.arrowLeft}</span>
              <span>All Tournaments</span>
            </button>
            <div class="mb-4" style="height:1px;background:#1e1e32"></div>
            `:""}
            ${mt("dashboard","Dashboard",O.dashboard)}
            ${mt("fixtures","Fixtures",O.fixtures)}
            ${mt("standings","Standings",O.standings)}
            ${mt("scorers","Top Scorers",O.boot)}
            ${mt("teams","Teams",O.teams)}
            ${f.isAdmin&&(f.tournament.type==="knockout"||f.tournament.type==="groups")?mt("bracket","Bracket",O.bracket):""}
            ${mt("history","League History",O.certificate)}
            ${f.isAdmin?`
            <div style="height:1px;background:#1e1e32;margin:0.5rem 0"></div>
            ${mt("settings","Account Settings",'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>')}
            `:""}
          </nav>

          ${f.isAdmin?`
          <div class="p-4 mx-4 mb-6 rounded-xl" style="background:#0f0f1a;border:1px solid #1e1e32">
            <p class="text-[8px] font-black uppercase tracking-widest mb-2" style="color:#334155">Status</p>
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full ${e?"":"pulse-dot"}" style="background:${e?"#475569":"#3b82f6"};box-shadow:${e?"none":"0 0 6px rgba(59,130,246,0.7)"}"></div>
              <span class="text-[10px] font-black uppercase tracking-widest" style="color:${e?"#475569":"#60a5fa"}">${e?"Archived":"Active"}</span>
            </div>
          </div>
          <div class="px-4 mb-2">
            <button id="new-btn-sidebar" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all" style="background:rgba(59,130,246,0.08);color:#60a5fa;border:1px solid rgba(59,130,246,0.15)" onmouseover="this.style.background='linear-gradient(135deg,#3b82f6,#7c3aed)';this.style.color='white';this.style.borderColor='transparent'" onmouseout="this.style.background='rgba(59,130,246,0.08)';this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.15)'">
               <span class="w-4 h-4">${O.plus}</span>
               <span>New Tournament</span>
            </button>
          </div>
          <div class="px-4 pb-4">
            <div class="flex items-center justify-between px-3 py-2.5 rounded-xl" style="background:#0a0a12;border:1px solid #1e1e32">
              <div>
                <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Signed in as</div>
                <div class="text-xs font-black uppercase" style="color:#60a5fa">${((t=f.user)==null?void 0:t.username)||"user"}</div>
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
                  <span style="color:#60a5fa">${f.tournament.name}</span>
                  ${e?'<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase" style="background:#0f0f1a;color:#475569;border:1px solid #1e1e32">READ ONLY</span>':""}
                </div>
                <h2 class="text-3xl font-black tracking-tight capitalize" style="color:#f1f5f9">${f.view}</h2>
             </div>
             <nav class="flex gap-1 p-1 rounded-xl border no-print" style="background:#0a0a12;border-color:#1e1e32">
                ${["dashboard","fixtures","standings","scorers"].map(s=>`
                  <button data-view="${s}" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" style="${f.view===s?"background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 2px 12px rgba(59,130,246,0.3)":"color:#475569"}" ${f.view!==s?`onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#475569'"`:""}>
                    ${s==="scorers"?"Scorers":s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                `).join("")}
             </nav>
          </header>
          <div id="view-container"></div>
        </main>
      </div>
    `,Bv(),jv()}function Bv(){if(f.isMobile){document.querySelectorAll("[data-nav]").forEach(t=>t.addEventListener("click",()=>{const s=t.dataset.nav;s==="more"?bo("more"):(f.view=s,U())}));const n=document.getElementById("mobile-switcher-btn");n&&n.addEventListener("click",()=>bo("switcher"));const e=document.getElementById("theme-toggle-mobile");e&&e.addEventListener("click",Ih)}else{document.querySelectorAll("[data-view]").forEach(s=>s.addEventListener("click",()=>{f.view=s.dataset.view,U()}));const n=document.getElementById("back-to-home");n&&n.addEventListener("click",()=>{f.tournament=null,f.view="home",U()});const e=document.getElementById("new-btn-sidebar");e&&e.addEventListener("click",()=>{if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}f.tournament=null,f.onboarding.step=1,U()});const t=document.getElementById("logout-btn-sidebar");t&&t.addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(si),f.user=null,f.tournament=null,f.tournaments=[],Pr=!1,U())})}}function mt(n,e,t){const s=f.view===n;return`<button data-view="${n}" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm" style="${s?"background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));color:#60a5fa;border:1px solid rgba(59,130,246,0.2)":"color:#475569;border:1px solid transparent"}" ${s?"":`onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'"`}><span class="w-4 h-4 flex-shrink-0">${t}</span><span>${e}</span></button>`}function jv(){const n=document.getElementById("view-container");switch(f.view){case"dashboard":Hv(n);break;case"fixtures":Ah(n);break;case"standings":gt(n);break;case"scorers":qv(n);break;case"teams":Zv(n);break;case"bracket":Rh(n);break;case"h2h":Xv(n);break;case"summary":rx(n);break;case"history":ix(n);break;case"champion":sx(n);break;case"awards":ox(n);break;case"settings":zv(n);break}}function zv(n){var r,i;const e='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',t='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';n.innerHTML=`
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
          <p class="font-black text-base uppercase" style="color:#60a5fa">${(r=f.user)==null?void 0:r.username}</p>
          <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${((i=f.user)==null?void 0:i.role)||"admin"}</p>
        </div>
      </div>

      <!-- Change Username -->
      <div class="rounded-2xl overflow-hidden" style="border:1px solid #1e1e32">
        <div class="px-5 py-4 flex items-center gap-3" style="background:#0f0f1a;border-bottom:1px solid #1e1e32">
          <span style="color:#60a5fa">${t}</span>
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

      ${f.isAdmin?`
      <!-- Danger Zone -->
      <div class="rounded-2xl overflow-hidden mt-12" style="border:1px solid rgba(239,68,68,0.2)">
        <div class="px-5 py-4 flex items-center gap-3" style="background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.2)">
          <span style="color:#f87171">${O.trash}</span>
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
  `,document.getElementById("change-username-form").addEventListener("submit",async a=>{a.preventDefault();const l=document.getElementById("username-msg"),c=document.getElementById("new-username").value.trim(),d=document.getElementById("confirm-pw-for-username").value;if(l.style.display="none",!c||c.length<3){l.textContent="Username must be at least 3 characters.",l.style.display="block";return}if(c===f.user.username){l.textContent="New username is the same as current.",l.style.display="block";return}try{const h=Xe($e,"users",f.user.username),m=await or(h);if(!m.exists()){l.textContent="User not found.",l.style.display="block";return}const y=m.data(),x=await is(d);if(y.password!==x){l.textContent="Incorrect current password.",l.style.color="#f87171",l.style.display="block";return}if((await or(Xe($e,"users",c))).exists()){l.textContent="That username is already taken.",l.style.color="#f87171",l.style.display="block";return}await sa(Xe($e,"users",c),{...y,username:c}),await Bd(h);const S={...f.user,username:c,loginTime:Date.now()};localStorage.setItem(si,JSON.stringify(S)),f.user=S,await Cr(`Username changed to: ${c}`),Dr("Username updated successfully!"),l.style.color="#34d399",l.textContent="✓ Username updated. You are now signed in as "+c,l.style.display="block",document.getElementById("new-username").value="",document.getElementById("confirm-pw-for-username").value="",U()}catch(h){console.error(h),l.textContent="Error: "+(h.message||"Update failed."),l.style.color="#f87171",l.style.display="block"}}),document.getElementById("change-password-form").addEventListener("submit",async a=>{a.preventDefault();const l=document.getElementById("password-msg"),c=document.getElementById("current-password").value,d=document.getElementById("new-password").value,h=document.getElementById("confirm-new-password").value;if(l.style.display="none",d.length<6){l.textContent="New password must be at least 6 characters.",l.style.color="#f87171",l.style.display="block";return}if(d!==h){l.textContent="New passwords do not match.",l.style.color="#f87171",l.style.display="block";return}try{const m=Xe($e,"users",f.user.username),y=await or(m);if(!y.exists()){l.textContent="User not found.",l.style.display="block";return}const x=y.data(),A=await is(c);if(x.password!==A){l.textContent="Current password is incorrect.",l.style.color="#f87171",l.style.display="block";return}const S=await is(d);await fo(m,{password:S,loginAttempts:0}),await Cr("Password changed"),Dr("Password updated successfully!"),l.style.color="#34d399",l.textContent="✓ Password changed. Keep it safe!",l.style.display="block",document.getElementById("current-password").value="",document.getElementById("new-password").value="",document.getElementById("confirm-new-password").value=""}catch(m){console.error(m),l.textContent="Error: "+(m.message||"Update failed."),l.style.color="#f87171",l.style.display="block"}});const s=document.getElementById("delete-tournament-btn-settings");s&&s.addEventListener("click",()=>{Th(f.tournament.id)})}function gt(n){const e=f.tournament.type==="groups",t=Math.max(...f.tournament.fixtures.map(c=>c.round),1);f.timelineRound===null&&(f.timelineRound=t);const s=`
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 no-print">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matchday Timeline</h4>
          <p class="text-xl font-black text-indigo-400 font-mono">MD ${f.timelineRound} / ${t}</p>
        </div>
        <div class="flex-1 flex items-center gap-4">
          <input type="range" id="timeline-slider" min="1" max="${t}" value="${f.timelineRound}" 
            class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500">
          <div class="flex gap-2">
            <button id="timeline-prev" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&larr;</button>
            <button id="timeline-next" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400">&rarr;</button>
          </div>
        </div>
        <button id="timeline-reset" class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Latest</button>
      </div>
    </div>
  `;if(f.isMobile){n.innerHTML=`
      <div class="space-y-6">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Engine Output</h3>
          <div class="flex items-center gap-2 no-print">
            <button id="export-pdf-btn-mobile" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-2 rounded-lg active:scale-95 transition-all">PDF</button>
            <div class="flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button id="view-mode-compact" class="p-2.5 rounded-lg ${f.mobileStandingsMode==="compact"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${O.league}
              </button>
              <button id="view-mode-cards" class="p-2.5 rounded-lg ${f.mobileStandingsMode==="cards"?"bg-slate-800 text-indigo-400":"text-slate-600"} transition-all active:scale-90">
                ${O.group}
              </button>
            </div>
          </div>
        </header>

        ${s}

        <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print overflow-x-auto no-scrollbar mb-4">
          ${["overall","home","away","cleansheets"].map(d=>`
            <button data-filter="${d}" class="flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${f.standingsFilter===d?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}">
              ${d==="cleansheets"?"Clean":d}
            </button>
          `).join("")}
        </div>

        <div id="standings-content" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${os(!1,null,f.timelineRound)}
        </div>
      </div>
    `;const c=n.querySelector("#export-pdf-btn-mobile");c&&c.addEventListener("click",Gc),n.querySelector("#view-mode-compact").addEventListener("click",()=>{f.mobileStandingsMode="compact",localStorage.setItem("mobile_standings_mode","compact"),gt(n)}),n.querySelector("#view-mode-cards").addEventListener("click",()=>{f.mobileStandingsMode="cards",localStorage.setItem("mobile_standings_mode","cards"),gt(n)})}else{const c=`
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
    `,d=`
      <div class="print-header">
        <h1>${f.tournament.name}</h1>
        <p>Tournament Standings • ${f.standingsFilter.toUpperCase()} View • Matchday ${f.timelineRound} • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `,h=`
      <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print self-start">
        ${["overall","home","away","cleansheets"].map(A=>`
          <button data-filter="${A}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f.standingsFilter===A?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}" style="${f.standingsFilter===A?"box-shadow:0 4px 12px rgba(79,70,229,0.3)":""}">
            ${A==="cleansheets"?"Clean Sheets":A}
          </button>
        `).join("")}
      </div>
    `;e?n.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${h}
           ${c}
        </div>
        ${s}
        ${d}
        <div id="standings-content" class="grid grid-cols-1 xl:grid-cols-2 gap-12">
          ${f.tournament.groups.map(A=>`
            <div class="space-y-6">
              <h4 class="text-xl font-black text-slate-100 flex items-center gap-4">
                <span class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm tracking-tighter">${A.name}</span>
                Group ${A.name}
              </h4>
              ${os(!1,A.id,f.timelineRound)}
            </div>
          `).join("")}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `:n.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${h}
           ${c}
        </div>
        ${s}
        ${d}
        <div id="standings-content">
          ${os(!1,null,f.timelineRound)}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;const m=n.querySelector("#print-btn");m&&m.addEventListener("click",()=>window.print());const y=n.querySelector("#export-img-btn");y&&y.addEventListener("click",tx);const x=n.querySelector("#export-pdf-btn");x&&x.addEventListener("click",Gc)}const r=document.getElementById("timeline-slider");r&&r.addEventListener("input",c=>{f.timelineRound=parseInt(c.target.value),gt(n)});const i=document.getElementById("timeline-prev");i&&i.addEventListener("click",()=>{f.timelineRound>1&&(f.timelineRound--,gt(n))});const a=document.getElementById("timeline-next");a&&a.addEventListener("click",()=>{f.timelineRound<t&&(f.timelineRound++,gt(n))});const l=document.getElementById("timeline-reset");l&&l.addEventListener("click",()=>{f.timelineRound=t,gt(n)}),n.querySelectorAll("[data-filter]").forEach(c=>{c.addEventListener("click",()=>{f.standingsFilter=c.dataset.filter,gt(n)})}),n.querySelectorAll(".team-detail-btn").forEach(c=>{c.addEventListener("click",()=>Je(c.dataset.teamId))})}function qv(n){const e=In();if(f.isMobile)n.innerHTML=`
      <div class="space-y-4 animate-in fade-in duration-500 pb-20">
        <div>
          <h3 class="text-3xl font-black tracking-tight text-slate-100">Top Scorers</h3>
          <p class="text-slate-500 font-medium tracking-widest uppercase text-xs mt-1">Full Leaderboard & Fantasy Performance</p>
        </div>
        ${e.map((t,s)=>{const r=s===0?"🥇":s===1?"🥈":s===2?"🥉":null;return`
            <div class="${s<3?"bg-indigo-600/10 border-indigo-500/20":"bg-slate-900 border-slate-800"} border rounded-[2rem] p-5 flex items-center justify-between shadow-lg active:scale-[0.98] transition-all">
              <div class="flex items-center gap-4">
                <div class="relative">
                  <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-xs font-black text-slate-700 border border-slate-800">
                    ${t.name.substring(0,2).toUpperCase()}
                  </div>
                  ${r?`<span class="absolute -top-1 -right-1 text-base animate-bounce">${r}</span>`:""}
                </div>
                <div>
                  <h4 class="font-black text-slate-100 uppercase tracking-tight text-sm">${t.name}</h4>
                  <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest team-detail-btn cursor-pointer" data-team-id="${t.teamId}">View Stats</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-black text-slate-100 italic tracking-tighter leading-none">${t.fantasyPoints}</div>
                <div class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Fantasy Pts</div>
                <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">${t.goals} Goals • ${t.matchesCount} Matches</div>
              </div>
            </div>
          `}).join("")}
        ${e.length===0?'<div class="text-center py-20 text-slate-700 italic uppercase tracking-[0.2em] font-black text-xs">No records detected</div>':""}
      </div>
    `;else{const t=e.slice(0,3),s=e.slice(3),r=[{label:"🥇",bg:"bg-yellow-500/10",border:"border-yellow-500/20",text:"text-yellow-500"},{label:"🥈",bg:"bg-slate-300/10",border:"border-slate-300/20",text:"text-slate-300"},{label:"🥉",bg:"bg-orange-500/10",border:"border-orange-500/20",text:"text-orange-500"}];n.innerHTML=`
      <div class="space-y-16 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${t.map((i,a)=>{const l=r[a];return`
              <div class="${l.bg} ${l.border} border rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                 <div class="absolute top-6 right-8 text-4xl">${l.label}</div>
                 <div class="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-slate-800 border border-slate-800">
                   ${i.name.substring(0,2).toUpperCase()}
                 </div>
                 <div class="space-y-2">
                   <h3 class="text-2xl font-black text-slate-100">${i.name}</h3>
                   <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-indigo-400 team-detail-btn" data-team-id="${i.teamId}">Team Profile</p>
                 </div>
                 <div class="grid grid-cols-2 w-full gap-4 pt-4 border-t border-slate-800/30">
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Fantasy Points</p>
                     <p class="text-3xl font-black ${l.text} font-mono">${i.fantasyPoints}</p>
                   </div>
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Goals / Matches</p>
                     <p class="text-xl font-black text-slate-100 font-mono">${i.goals} / ${i.matchesCount}</p>
                   </div>
                 </div>
              </div>
            `}).join("")}
          ${t.length===0?'<div class="md:col-span-3 text-center py-20 text-slate-700 italic">No goal records detected in the current deployment.</div>':""}
        </div>

        ${s.length>0?`
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
                ${s.map((i,a)=>`
                  <tr class="group">
                    <td class="py-6 pl-4 font-mono font-black text-slate-600">${a+4}</td>
                    <td class="py-6 font-black text-slate-200">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-700">${i.name.substring(0,2).toUpperCase()}</div>
                        ${i.name}
                      </div>
                    </td>
                    <td class="py-6 text-center font-mono text-slate-500">${i.goals} G / ${i.matchesCount} M</td>
                    <td class="py-6 text-right pr-6 font-black text-2xl text-indigo-400 font-mono tracking-tighter">${i.fantasyPoints}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `:""}
      </div>
    `}n.querySelectorAll(".team-detail-btn").forEach(t=>{t.addEventListener("click",()=>Je(t.dataset.teamId))})}function Hv(n){const e=f.tournament.fixtures,t=e.filter(l=>l.status==="completed").slice(-3).reverse(),s=e.filter(l=>l.status==="upcoming").slice(0,3),r=f.tournament.type==="groups"&&f.tournament.currentStage==="groups"&&e.filter(l=>l.stage==="groups"&&l.status!=="completed").length===0,a=In()[0]||null;f.isMobile?n.innerHTML=`
      <div class="space-y-8 pb-32 animate-in fade-in duration-700">
        <!-- Hero Section -->
        <div class="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${O.trophy}</div>
          <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1 italic">Tournament Active</p>
          <h3 class="text-white font-black text-2xl leading-none tracking-tighter uppercase mb-6">${f.tournament.name}</h3>
          <button data-view="fixtures" class="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
            ${O.league} Manage Schedule
          </button>
        </div>

        <!-- Mini Stats -->
        <div class="grid grid-cols-2 gap-4">
          ${Bi("Matches",e.length,"text-indigo-400")}
          ${Bi("Played",e.filter(l=>l.status==="completed").length,"text-emerald-400")}
          ${Bi("Goals",e.reduce((l,c)=>l+(c.homeScore||0)+(c.awayScore||0),0),"text-slate-400")}
        </div>

        ${r?'<div class="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-lg font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white w-full py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}

        <!-- Recent Activity -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
            <button data-view="fixtures" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">View All</button>
          </div>
          <div class="space-y-3">
            ${t.length?t.map(l=>ji(l)).join(""):'<div class="p-10 border border-slate-800 rounded-[2rem] text-center text-slate-600 italic text-xs uppercase font-black">No recent matches</div>'}
          </div>
        </section>

        <!-- Top Scoring Team Snapshot -->
        ${a?`
          <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between" data-view="scorers">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-sm font-black text-indigo-400 border border-slate-800 shadow-inner overflow-hidden">
                 ${a.image?`<img src="${a.image}" class="w-full h-full object-cover">`:a.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h4 class="font-black text-slate-100 uppercase tracking-tight text-xs">Top Scorer</h4>
                <p class="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">${a.name}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black text-indigo-400 font-mono italic">${a.goals}</span>
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
           ${os(!0)}
        </section>

        <!-- Biggest Win Snapshot -->
        ${(()=>{const l=gs();if(!l)return"";const c=f.tournament.teams.find(h=>h.id===l.homeId),d=f.tournament.teams.find(h=>h.id===l.awayId);return!c||!d?"":`
            <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Record: Biggest Win</h3>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 flex items-center justify-end gap-2">
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${c.name}</p>
                  ${c.image?`<img src="${c.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                </div>
                <div class="px-5 py-2 bg-indigo-600 rounded-xl font-black font-mono text-white shadow-lg shadow-indigo-900/40 whitespace-nowrap">
                  ${l.homeScore} - ${l.awayScore}
                </div>
                <div class="flex-1 flex items-center gap-2">
                  ${d.image?`<img src="${d.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${d.name}</p>
                </div>
              </div>
            </div>
          `})()}
      </div>
    `:n.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          ${Js("Matches",e.length,"text-indigo-400")}
          ${Js("Played",e.filter(l=>l.status==="completed").length,"text-emerald-400")}
          ${Js("Teams",f.tournament.teams.length,"text-slate-400")}
          ${Js("Goals",e.reduce((l,c)=>l+(c.homeScore||0)+(c.awayScore||0),0),"text-yellow-400")}
        </div>
        
        <div class="lg:col-span-4 bg-indigo-600 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700">${O.trophy}</div>
          <h3 class="text-white font-black text-xl leading-tight">System Online</h3>
          <button data-view="fixtures" class="bg-white text-indigo-600 font-black py-4 rounded-2xl mt-6 uppercase text-[10px] tracking-widest relative z-10 hover:bg-slate-100 transition-colors">Manage Schedule</button>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-8 space-y-8">
          ${r?'<div class="bg-indigo-600/10 p-10 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-2xl font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Recent Activity</h3>
              <div class="space-y-4">${t.length?t.map(l=>ji(l)).join(""):'<p class="text-slate-600 italic">No matches detected.</p>'}</div>
            </section>
            
            <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Next Engagements</h3>
              <div class="space-y-4">${s.length?s.map(l=>ji(l)).join(""):'<p class="text-slate-600 italic">Season complete.</p>'}</div>
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
             ${os(!0)}
          </section>
        </div>
  
        <div class="lg:col-span-12 xl:col-span-4 space-y-8">
          ${a?`
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-3xl">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top Scorer</span>
                <span class="text-2xl">🥇</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-center text-2xl font-black text-indigo-400 shadow-inner overflow-hidden">
                  ${a.image?`<img src="${a.image}" class="w-full h-full object-cover">`:a.name.substring(0,2).toUpperCase()}
                </div>
                <div class="space-y-1">
                  <h4 class="text-2xl font-black text-slate-100 tracking-tighter uppercase">${a.name}</h4>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${a.matchesCount} Matches Played</p>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4">
                <div class="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                  <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Scored</p>
                  <p class="text-4xl font-black text-indigo-400 font-mono italic">${a.goals}</p>
                </div>
              </div>
              <button data-view="scorers" class="w-full bg-slate-950 border border-slate-800 text-slate-500 hover:text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest">Full Stats Registry</button>
            </div>
          `:`
            <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-center space-y-4">
              <div class="text-slate-800 mx-auto">${O.boot}</div>
              <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest">Competitive data pending</p>
            </div>
          `}
  
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Records</h4>
            <div class="space-y-4">
              ${(()=>{const l=gs();if(!l)return'<p class="text-xs text-slate-600 italic">No records established.</p>';const c=f.tournament.teams.find(h=>h.id===l.homeId),d=f.tournament.teams.find(h=>h.id===l.awayId);return!c||!d?"":`
                  <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Biggest Margin of Victory</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        ${c.image?`<img src="${c.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${c.name}</span>
                      </div>
                      <span class="font-black font-mono text-indigo-400 mx-3">${l.homeScore} - ${l.awayScore}</span>
                      <div class="flex items-center justify-end gap-2 text-right">
                        <span class="text-xs font-bold text-slate-300 truncate w-24">${d.name}</span>
                        ${d.image?`<img src="${d.image}" class="w-6 h-6 rounded-full object-cover border border-slate-700/50">`:""}
                      </div>
                    </div>
                  </div>
                `})()}
            </div>
          </div>
          

          
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-6">
            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming Discipline</h4>
            <div class="space-y-4">
              ${f.tournament.teams.slice(0,4).map(l=>`
                 <div class="flex items-center justify-between group cursor-pointer hover:bg-slate-800/30 p-2 rounded-xl transition-all team-detail-btn" data-team-id="${l.id}">
                   <div class="flex items-center gap-3">
                     <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-600">${l.name.substring(0,2).toUpperCase()}</div>
                     <span class="font-bold text-slate-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-32">${l.name}</span>
                   </div>
                   <div class="text-xs font-black text-indigo-400/50 group-hover:text-indigo-400">DETAIL</div>
                 </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `,document.getElementById("adv-ko")&&document.getElementById("adv-ko").addEventListener("click",Qv),n.querySelectorAll("[data-view]").forEach(l=>l.addEventListener("click",()=>{f.view=l.dataset.view,U()})),n.querySelectorAll(".team-detail-btn").forEach(l=>{l.addEventListener("click",()=>Je(l.dataset.teamId))}),setTimeout(()=>{try{if(typeof Chart>"u"){console.warn("[KickOff] Chart.js not loaded yet.");return}f.isMobile?zc("formChartMobileDashboard"):zc("formChartDesktopDashboard")}catch(l){console.error("[KickOff] Dashboard Charts Error:",l)}},100)}function zc(n){if(typeof Chart>"u")return;const e=document.getElementById(n);if(!e)return;const t=e.getContext("2d"),s=Ue().slice(0,5),r=Array.from(new Set(f.tournament.fixtures.map(l=>l.round))).sort((l,c)=>l-c);Array.from(new Set(f.tournament.fixtures.filter(l=>l.status==="completed").map(l=>l.round))).sort((l,c)=>l-c);const i=s.map((l,c)=>{let d=0;const h=[0],m=f.tournament.fixtures.filter(x=>x.status==="completed"&&(x.homeId===l.id||x.awayId===l.id));r.forEach(x=>{const A=m.find(S=>S.round===x);if(A){const S=A.homeId===l.id;A.homeScore===A.awayScore?d+=1:(S&&A.homeScore>A.awayScore||!S&&A.awayScore>A.homeScore)&&(d+=3)}h.push(d)});const y=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899"];return{label:l.name,data:h,borderColor:y[c%y.length],backgroundColor:y[c%y.length]+"10",borderWidth:3,pointRadius:0,pointHoverRadius:4,tension:.4,fill:c===0}}),a=Chart.getChart(e);a&&a.destroy(),new Chart(t,{type:"line",data:{labels:["0",...r.map(l=>`${l}`)],datasets:i},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!f.isMobile,position:"bottom",labels:{color:"#475569",font:{size:9,weight:"700"},usePointStyle:!0,boxWidth:6}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:11,weight:"bold"}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}}}}})}function Js(n,e,t){const r={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399","text-slate-400":"#94a3b8","text-yellow-400":"#facc15"}[t]||"#60a5fa";return`<div class="rounded-2xl p-6" style="background:#0f0f1a;border:1px solid #1e1e32"><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#475569">${n}</p><p class="text-3xl font-black font-mono" style="color:${r}">${e}</p></div>`}function Bi(n,e,t){const r={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399"}[t]||"#60a5fa";return`<div class="p-5 rounded-2xl text-center" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)"><p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#475569">${n}</p><p class="text-2xl font-black font-mono leading-none" style="color:${r}">${e}</p></div>`}function ji(n){const e=f.tournament.teams.find(a=>a.id===n.homeId)||{name:"?"},t=f.tournament.teams.find(a=>a.id===n.awayId)||{name:"?"},s=n.status==="upcoming"?"VS":`${n.homeScore}–${n.awayScore}`,r=e.image?`<img src="${e.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"",i=t.image?`<img src="${t.image}" class="w-5 h-5 rounded-full object-cover border border-slate-700/50">`:"";return`<div class="p-4 rounded-xl flex items-center justify-between transition-all" style="background:#0a0a12;border:1px solid #1e1e32">
    <div class="flex-1 flex items-center justify-end gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${e.id}">
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${e.name}</span>
      ${r}
    </div>
    <div class="mx-4 px-4 py-1.5 rounded-lg font-black font-mono text-sm" style="background:#0f0f1a;color:#60a5fa;border:1px solid #1e1e32">${s}</div>
    <div class="flex-1 flex items-center gap-2 team-detail-btn cursor-pointer hover:opacity-80" data-team-id="${t.id}">
      ${i}
      <span class="font-bold text-sm truncate" style="color:#94a3b8">${t.name}</span>
    </div>
  </div>`}function Ah(n){const e=f.tournament.fixtures,t=f.tournament.type==="league"||f.tournament.type==="groups",s=Array.from(new Set(e.map(i=>i.round))).sort((i,a)=>i-a);f.isMobile?(s.includes(f.activeRound)||(f.activeRound=s[0]||1),n.innerHTML=`
      <div class="space-y-6">
        <div class="flex items-center justify-between no-print mb-2">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Management</h3>
          <button id="export-fixtures-btn" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Export PDF</button>
        </div>

        <!-- Horizontal Round Tabs -->
        <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth snap-x">
          ${s.map(i=>`
            <button data-round="${i}" class="flex-shrink-0 snap-start px-6 py-3 rounded-2xl border ${f.activeRound===i?"bg-indigo-600 border-indigo-500 text-white shadow-lg":"bg-slate-900 border-slate-800 text-slate-500"} transition-all active:scale-95">
              <span class="text-[10px] font-black uppercase tracking-widest">${t?"MW":"RD"} ${i}</span>
            </button>
          `).join("")}
        </div>

        <div id="fixtures-content" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${(()=>{const i=gs();return e.filter(a=>a.round===f.activeRound).map(a=>qc(a,i&&i.id===a.id)).join("")})()}
           ${e.length===0?'<p class="text-center py-20 text-slate-700 italic">No fixtures generated yet.</p>':""}
        </div>
      </div>
    `,n.querySelectorAll("[data-round]").forEach(i=>i.addEventListener("click",()=>{f.activeRound=parseInt(i.dataset.round),Ah(n)}))):n.innerHTML=`
      <div class="flex justify-end mb-8 no-print">
        <button id="export-fixtures-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> Export Fixtures PDF
        </button>
      </div>
      <div id="fixtures-content" class="space-y-16">
        ${(()=>{const i=gs();return s.map(a=>`
            <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="flex items-center gap-4">
                 <div class="h-8 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                 <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">${f.tournament.type==="league"||f.tournament.type==="groups"&&f.tournament.currentStage==="groups"?"Matchweek":"Round"} ${a}</h5>
                 <div class="flex-1 h-px bg-slate-800/50"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${e.filter(l=>l.round===a).map(l=>qc(l,i&&i.id===l.id)).join("")}
              </div>
            </div>
          `).join("")})()}
      </div>
    `;const r=n.querySelector("#export-fixtures-btn");r&&r.addEventListener("click",nx),n.querySelectorAll(".score-input").forEach(i=>i.addEventListener("change",a=>{Gv(a.target.closest("[data-match-id]").dataset.matchId,a.target.dataset.type,a.target.value)})),n.querySelectorAll(".status-toggle").forEach(i=>i.addEventListener("click",a=>Wv(a.currentTarget.closest("[data-match-id]").dataset.matchId)))}function qc(n,e=!1){const t=f.tournament.teams.find(c=>c.id===n.homeId)||{name:"TBD"},s=f.tournament.teams.find(c=>c.id===n.awayId)||{name:"TBD"},r=n.status==="completed",i=f.tournament.archived,a=f.isMobile,l=e?"border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50":"border-slate-800 shadow-xl";return`
    <div data-match-id="${n.id}" class="${a?"bg-slate-900 rounded-[2.5rem] p-8":"bg-slate-900 rounded-[2rem] p-6"} border ${l} transition-all flex flex-col justify-between h-full group ${i?"grayscale-[0.5] opacity-90":""}">
       <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${r?"bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]":"bg-slate-700"}"></span>
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${n.status}</span>
            ${e?'<span class="text-[8px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 ml-2">Record Win</span>':""}
          </div>
          ${i?"":`
            <button class="status-toggle p-3 md:p-2 bg-slate-950 md:bg-transparent border border-slate-800 md:border-none rounded-xl text-slate-700 hover:text-indigo-400 transition-all active:scale-90">
              ${O.fixtures}
            </button>
          `}
       </div>
       <div class="${a?"space-y-6":"space-y-4"}">
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${a?"text-base":"text-sm"} truncate uppercase tracking-tighter">${t.name}</span>
            <input type="number" data-type="home" value="${n.homeScore??""}" placeholder="-" ${i?"disabled":""} class="score-input ${a?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${a?"text-base":"text-sm"} truncate uppercase tracking-tighter">${s.name}</span>
            <input type="number" data-type="away" value="${n.awayScore??""}" placeholder="-" ${i?"disabled":""} class="score-input ${a?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
       </div>
       
       <div class="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <input type="date" value="${n.date||""}" class="match-date-input bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none hover:text-indigo-400 transition-colors" ${i?"disabled":""}>
       </div>
    </div>
  `}function Gv(n,e,t){const s=f.tournament.fixtures.find(r=>r.id===n);s&&(s[`${e}Score`]=t===""?null:parseInt(t),le(!0))}function Wv(n){const e=f.tournament.fixtures.find(t=>t.id===n);if(!e||e.homeScore===null||e.awayScore===null){alert("Results must be entered before marking as complete.");return}if(e.status=e.status==="completed"?"upcoming":"completed",e.stage==="knockout"&&e.status==="completed"&&Kv(e),e.status==="completed"&&window.parent!==window){const t=f.tournament.teams.find(r=>r.id===e.homeId),s=f.tournament.teams.find(r=>r.id===e.awayId);window.parent.postMessage({type:"MATCH_COMPLETED",match:{p1Id:(t==null?void 0:t.playerId)||null,p1Score:e.homeScore,p2Id:(s==null?void 0:s.playerId)||null,p2Score:e.awayScore,tournament:f.tournament.name}},"*")}le(!0),e.status==="completed"&&ex(),U()}function Kv(n){const e=n.homeScore>n.awayScore?n.homeId:n.awayId,t=n.round+(f.tournament.legs||1),s=Math.floor(n.matchIndex/2),r=n.matchIndex%2===0?"homeId":"awayId",i=f.tournament.fixtures.find(a=>a.round===t&&a.matchIndex===s&&a.stage==="knockout");i&&(i[r]=e,le())}function Qv(){const n=[];f.tournament.groups.forEach((s,r)=>{const i=Ue(s.id);n.push({groupId:r,rank:1,team:f.tournament.teams.find(a=>a.id===i[0].id)}),n.push({groupId:r,rank:2,team:f.tournament.teams.find(a=>a.id===i[1].id)})});const e=[];for(let s=0;s<n.length;s+=4)n[s]&&n[s+3]&&e.push(n[s].team,n[s+3].team),n[s+1]&&n[s+2]&&e.push(n[s+2].team,n[s+1].team);const t=Lv(e,Math.max(...f.tournament.fixtures.map(s=>s.round))+1,f.tournament.legs||1);f.tournament.fixtures.push(...t),f.tournament.currentStage="knockout",f.view="bracket",le(),U()}function Vr(n){return f.tournament.fixtures.filter(t=>t.status==="completed"&&(t.homeId===n||t.awayId===n)).sort((t,s)=>t.round-s.round).slice(-5).map(t=>{const s=t.homeId===n,r=s?t.homeScore:t.awayScore,i=s?t.awayScore:t.homeScore;return r>i?"W":r<i?"L":"D"})}function In(){const n={},e=Ue();return f.tournament.teams.forEach(t=>{const s=e.find(r=>r.id===t.id)||{w:0,d:0,cs:0};n[t.id]={name:t.name,teamId:t.id,teamName:t.name,image:t.image||null,goals:0,assists:0,matchesPlayed:new Set,fantasyPoints:s.w*5+s.d*2+s.cs*6}}),f.tournament.fixtures.forEach(t=>{t.status==="completed"&&(n[t.homeId]&&(n[t.homeId].goals+=t.homeScore||0,n[t.homeId].matchesPlayed.add(t.id),n[t.homeId].fantasyPoints+=(t.homeScore||0)*4),n[t.awayId]&&(n[t.awayId].goals+=t.awayScore||0,n[t.awayId].matchesPlayed.add(t.id),n[t.awayId].fantasyPoints+=(t.awayScore||0)*4))}),Object.values(n).map(t=>{const s=t.matchesPlayed.size;return{...t,matchesCount:s}}).sort((t,s)=>s.fantasyPoints-t.fantasyPoints||s.goals-t.goals)}function os(n,e=null,t=999){let s=Ue(e,t);const r=f.standingsFilter||"overall";r==="home"?s.sort((h,m)=>m.home.pts-h.home.pts||m.home.gf-m.home.ga-(h.home.gf-h.home.ga)||m.home.gf-h.home.gf):r==="away"?s.sort((h,m)=>m.away.pts-h.away.pts||m.away.gf-m.away.ga-(h.away.gf-h.away.ga)||m.away.gf-h.away.gf):r==="cleansheets"&&s.sort((h,m)=>m.cs-h.cs||h.ga-m.ga||m.pts-h.pts);const i=(f.tournament.type==="league"||f.tournament.type==="round_robin")&&e===null,a=f.tournament.promoSpots||0,l=f.tournament.relegationSpots||0,c=f.tournament.continentalSpots||0;if(f.isMobile)if(f.mobileStandingsMode==="compact"){let h=`
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Pos</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Team</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">P</th>
      `;return r==="cleansheets"?h+='<th class="p-4 font-black text-emerald-400 uppercase tracking-widest text-center">CS</th>':h+=`
          <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
          <th class="p-4 font-black text-indigo-400 uppercase tracking-widest text-center">Pts</th>
        `,`
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left font-mono text-[11px] border-separate border-spacing-0">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-800">
                  ${h}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${s.map((m,y)=>{const x=i&&y<c,A=i&&y>=s.length-l,S=i&&y>=c&&y<c+a;let C="text-slate-600";x?C="text-emerald-400":S?C="text-indigo-400":A&&(C="text-red-500/60");const N=r==="home"?m.home:r==="away"?m.away:m,L=N.gf-N.ga;return`
                    <tr class="active:bg-slate-800 transition-all team-detail-btn cursor-pointer" data-team-id="${m.id}">
                      <td class="p-4"><span class="font-black ${C}">${(y+1).toString().padStart(2,"0")}</span></td>
                      <td class="p-4 font-black text-slate-200 uppercase truncate max-w-[120px]">${m.name}</td>
                      <td class="p-4 text-center font-bold text-slate-400">${N.p}</td>
                      ${r==="cleansheets"?`
                        <td class="p-4 text-center font-black text-emerald-400 italic">${N.cs}</td>
                      `:`
                        <td class="p-4 text-center font-bold ${L>=0?"text-emerald-500/70":"text-red-500/70"}">${L>0?"+":""}${L}</td>
                        <td class="p-4 text-center font-black text-indigo-400 text-sm italic">${N.pts}</td>
                      `}
                    </tr>
                  `}).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `}else return`
        <div class="space-y-4">
          ${s.map((h,m)=>{const y=Vr(h.id),x=i&&m<c,A=i&&m>=s.length-l,S=i&&m>=c&&m<c+a;let C="border-slate-800";x?C="border-emerald-500/30 bg-emerald-500/5":S?C="border-indigo-500/30 bg-indigo-500/5":A&&(C="border-red-500/30 bg-red-500/5");const N=r==="home"?h.home:r==="away"?h.away:h;return`
              <div class="team-detail-btn bg-slate-900 border ${C} rounded-[2rem] p-6 flex items-center justify-between shadow-xl active:scale-95 transition-all" data-team-id="${h.id}">
                <div class="flex items-center gap-5">
                  <span class="text-3xl font-black text-slate-800 italic leading-none">${m+1}</span>
                  <div>
                    <h4 class="font-black text-slate-100 uppercase tracking-tight text-lg">${h.name}</h4>
                    <div class="flex gap-1.5 mt-2">
                      ${y.map(L=>`<span class="w-1.5 h-1.5 rounded-full ${L==="W"?"bg-emerald-500":L==="D"?"bg-slate-600":"bg-red-500"}"></span>`).join("")}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-3xl font-black ${r==="cleansheets"?"text-emerald-400":"text-indigo-400"} leading-none italic tracking-tighter">${r==="cleansheets"?N.cs:N.pts}</div>
                  <div class="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">${r==="cleansheets"?"Clean Sheets":"Classification Pts"}</div>
                </div>
              </div>
            `}).join("")}
        </div>
      `;let d="";return r==="cleansheets"?d=`
      <th class="pb-2 pl-4">Pos</th>
      <th class="pb-2">Squad Operative</th>
      <th class="pb-2 text-center">Played</th>
      <th class="pb-2 text-center">GA</th>
      <th class="pb-2 text-center text-emerald-400">Clean Sheets</th>
      <th class="pb-2 text-center">Ratio</th>
    `:d=`
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
    <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 ${n?"overflow-visible":"overflow-x-auto"} shadow-2xl relative">
      <table class="w-full text-left text-xs border-separate border-spacing-y-3 min-w-[800px] lg:min-w-0">
        <thead>
          <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
            ${d}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/20">
          ${s.map((h,m)=>{const y=i&&m<c,x=i&&m>=c&&m<c+a,A=i&&m>=s.length-l;let S="";y?S="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]":x?S="bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]":A&&(S="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]");const C=r==="home"?h.home:r==="away"?h.away:h,N=C.gf-C.ga,L=N>0?"+":"",K=N>0?"text-emerald-400":N<0?"text-red-400":"text-slate-600",q=Vr(h.id);let G="";if(r==="cleansheets"){const X=C.p>0?(C.cs/C.p).toFixed(2):"0.00";G=`
                <td class="py-4 text-center font-mono text-slate-500">${C.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.ga}</td>
                <td class="py-4 text-center"><span class="font-black font-mono text-emerald-400 italic text-sm">${C.cs}</span></td>
                <td class="py-4 text-center text-slate-500 font-mono">${X}</td>
              `}else G=`
                <td class="py-4 text-center font-mono text-slate-500 font-bold">${C.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.w}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.d}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.l}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.gf}</td>
                <td class="py-4 text-center font-mono text-slate-500">${C.ga}</td>
                <td class="py-4 text-center font-mono font-black ${K}">${L}${N}</td>
                <td class="py-4 text-center font-black text-slate-100 text-base tracking-tighter shadow-indigo-500/10">${C.pts}</td>
              `;return`<tr class="bg-slate-950/40 group relative transition-all cursor-default scale-100 hover:scale-[1.01]">
              <td class="py-4 pl-4 rounded-l-3xl relative overflow-hidden">
                ${S?`<div class="absolute inset-y-2 left-0 w-1.5 ${S} rounded-r-full"></div>`:""}
                <span class="font-mono font-black ${y?"text-emerald-400":x?"text-indigo-400":A?"text-red-500/60":"text-slate-600"}">
                    ${(m+1).toString().padStart(2,"0")}
                </span>
              </td>
              <td class="py-4 font-black text-slate-200 truncate max-w-[150px] transition-colors group-hover:text-white cursor-pointer hover:underline team-detail-btn" data-team-id="${h.id}">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600 group-hover:border-indigo-500/30">
                    ${h.name.substring(0,2).toUpperCase()}
                  </div>
                  ${h.name}
                </div>
              </td>
              ${G}
              <td class="py-4 pr-6 rounded-r-3xl">
                ${r==="overall"?`
                <div class="flex items-center justify-center gap-1">
                  ${q.map(X=>`<span data-result="${X}" class="w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-black ${X==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":X==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"} form-badge-print"><span class="form-badge-bg">${X}</span></span>`).join("")}
                  ${q.length===0?'<span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">-</span>':""}
                </div>
                `:""}
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
  `}function Yv(n,e,t){const s=document.createElement("div");s.className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200",s.innerHTML=`
    <div class="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-2xl p-6 relative">
      <h3 class="text-lg font-black text-slate-100 uppercase tracking-tighter mb-4">${n}</h3>
      <input type="text" id="edit-modal-input" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6" value="${e||""}" autocomplete="off">
      <div class="flex gap-3">
        <button id="edit-modal-cancel" class="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
        <button id="edit-modal-save" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30">Save Data</button>
      </div>
    </div>
  `,document.body.appendChild(s);const r=s.querySelector("#edit-modal-input");r.focus(),r.setSelectionRange(0,r.value.length);const i=()=>s.remove();s.querySelector("#edit-modal-cancel").addEventListener("click",i),s.querySelector("#edit-modal-save").addEventListener("click",()=>{t(r.value),i()}),r.addEventListener("keydown",a=>{a.key==="Enter"&&(t(r.value),i()),a.key==="Escape"&&i()})}function Je(n){var c,d;const e=f.tournament.teams.find(h=>h.id===parseInt(n));if(!e)return;const t=Ue().find(h=>h.id===e.id)||{p:0,w:0,d:0,l:0,gd:0,home:{},away:{}},s=Vr(e.id),r=f.tournament.fixtures.filter(h=>h.status==="completed"&&(h.homeId===e.id||h.awayId===e.id)).sort((h,m)=>new Date(m.date||0)-new Date(h.date||0));if(f.isMobile){const h=`
      <div class="p-6 space-y-10 selection:bg-indigo-500/30">
        <header class="flex items-center gap-4">
           <button id="mobile-team-back-btn" class="md:hidden text-slate-600 hover:text-indigo-400 transition-all text-2xl font-black shrink-0">&larr;</button>
           <div class="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-400">
             ${e.name.substring(0,2).toUpperCase()}
           </div>
           <div>
             <div class="flex items-center gap-2">
               <h3 class="text-2xl font-black text-slate-100 tracking-tight uppercase">${e.name}</h3>
               <button class="edit-team-name-btn text-slate-500 hover:text-indigo-400 p-1 active:scale-95 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-1.5 mt-1">
               ${s.map(m=>`<span class="w-2 h-2 rounded-full ${m==="W"?"bg-emerald-500":m==="L"?"bg-red-500":"bg-slate-700"}"></span>`).join("")}
               <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Recent Form</span>
             </div>
           </div>
        </header>

        <div class="grid grid-cols-5 gap-2">
           ${rn("P",t.p)}
           ${rn("W",t.w)}
           ${rn("D",t.d)}
           ${rn("L",t.l)}
           ${rn("FP",((c=In().find(m=>m.teamId===e.id))==null?void 0:c.fantasyPoints)||0)}
           ${rn("GD",t.gd)}
        </div>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Home vs Away</h4>
           <div class="grid grid-cols-2 gap-4">
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Home</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${t.home.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${t.home.gf} GF</span>
               </div>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
               <p class="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">Away</p>
               <div class="flex items-baseline gap-1">
                 <span class="text-xl font-black text-slate-200">${t.away.w}W</span>
                 <span class="text-[9px] font-bold text-slate-600">${t.away.gf} GF</span>
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
             ${f.isAdmin?'<button id="link-player-btn-mobile" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">Link Club Player</button>':""}
           </div>
           <div id="roster-container-mobile" class="space-y-3">
             ${e.playerId?(()=>{const m=f.dashboardPlayers.find(y=>y.id===e.playerId);return m?`
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between group">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <img src="${m.image}" class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="text-xs font-black text-slate-200 uppercase">${m.name}</p>
                        <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest">#${m.number} • ${m.device}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-black text-indigo-400 font-mono">${m.ovr}</p>
                      <p class="text-[7px] font-black text-slate-600 uppercase tracking-tighter">Rating</p>
                    </div>
                 </div>
               `:'<p class="text-slate-700 italic text-center py-6 text-xs">Linked player not found in sync</p>'})():'<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No club player linked</p>'}
           </div>
        </section>

        <section class="space-y-6">
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Match History</h4>
           <div class="space-y-3">
             ${r.map(m=>{const y=m.homeId===e.id,x=y?m.awayId:m.homeId,A=f.tournament.teams.find(N=>N.id===x)||{name:"Unknown"},S=y?m.homeScore>m.awayScore:m.awayScore>m.homeScore,C=m.homeScore===m.awayScore;return`
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] ${S?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":C?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-500"}">
                        ${S?"W":C?"D":"L"}
                      </div>
                      <div class="font-black text-slate-300 uppercase text-xs truncate max-w-[120px]">${A.name}</div>
                    </div>
                    <div class="font-black font-mono text-slate-100 flex items-center gap-2">
                      <span>${m.homeScore}</span>
                      <span class="text-slate-700">-</span>
                      <span>${m.awayScore}</span>
                    </div>
                 </div>
               `}).join("")}
             ${r.length===0?'<p class="text-slate-700 italic text-center py-6 text-xs uppercase tracking-widest">No data recorded</p>':""}
           </div>
        </section>
      </div>
    `;bo(h,!0),setTimeout(()=>Wc(e.id,"formChartMobile"),100);return}const i=document.createElement("div");i.id="team-detail-modal",i.className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300",i.innerHTML=`
    <div class="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-slate-800 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-10 duration-500">
      <header class="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div class="flex items-center gap-8">
           <div class="w-24 h-24 bg-slate-950 border border-slate-800 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-indigo-400">
             ${e.name.substring(0,2).toUpperCase()}
           </div>
           <div class="space-y-2">
             <div class="flex items-center gap-3">
               <h3 class="text-4xl font-black text-slate-100 tracking-tighter">${e.name}</h3>
               <button class="edit-team-name-btn bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-xl transition-colors active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
             </div>
             <div class="flex items-center gap-4">
               <div class="flex gap-1">
                 ${s.map(h=>`<span class="w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-black ${h==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":h==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"}">${h}</span>`).join("")}
               </div>
               <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Recent Performance</span>
             </div>
           </div>
        </div>
        <button id="close-modal" class="p-4 bg-slate-950 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all">${O.reset}</button>
      </header>
      
      <div class="flex-1 overflow-auto p-10 space-y-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
           ${sn("Played",t.p)}
           ${sn("Wins",t.w)}
           ${sn("Draws",t.d)}
           ${sn("Losses",t.l)}
           ${sn("Fantasy Pts",((d=In().find(h=>h.teamId===e.id))==null?void 0:d.fantasyPoints)||0)}
           ${sn("GD",(t.gd>0?"+":"")+t.gd)}
        </div>

        <section class="space-y-8">
          <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Performance: Home vs Away</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Home Base</span>
                <span class="text-xs font-black text-slate-600">${t.home.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${t.home.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${t.home.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${t.home.cs}</p></div>
              </div>
            </div>
            <div class="bg-slate-950 rounded-[2rem] p-8 border border-slate-800/50 space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Away Frontier</span>
                <span class="text-xs font-black text-slate-600">${t.away.p} Matches</span>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">Wins</p><p class="text-2xl font-black text-slate-200">${t.away.w}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">GF</p><p class="text-2xl font-black text-slate-200">${t.away.gf}</p></div>
                <div><p class="text-[9px] font-black text-slate-600 uppercase mb-1">CS</p><p class="text-2xl font-black text-emerald-400">${t.away.cs}</p></div>
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
             ${r.map(h=>{const m=h.homeId===e.id,y=f.tournament.teams.find(C=>C.id===(m?h.awayId:h.homeId)),x=m?h.homeScore>h.awayScore:h.awayScore>h.homeScore,A=h.homeScore===h.awayScore,S=x?"W":A?"D":"L";return`
                 <div class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                      <div class="text-[10px] font-mono text-slate-700">${h.date||"TBD"}</div>
                      <div class="font-black text-slate-200">${y.name}</div>
                    </div>
                    <div class="flex items-center gap-8">
                       <div class="font-black font-mono text-xl text-slate-100">${h.homeScore} - ${h.awayScore}</div>
                       <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm ${x?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":A?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-400"}">
                         ${S}
                       </div>
                    </div>
                 </div>
               `}).join("")}
             ${r.length===0?'<p class="text-slate-600 italic text-center py-10">No matches recorded for this deployment.</p>':""}
           </div>
        </section>
      </div>
    </div>
    </div>
  `,document.body.appendChild(i),i.addEventListener("click",h=>{h.target===i&&i.remove()}),document.getElementById("close-modal").addEventListener("click",()=>i.remove()),setTimeout(()=>Wc(e.id,f.isMobile?"formChartMobile":"formChartDesktop"),100);const a=f.isMobile?document.getElementById("bottom-sheet"):i;e.players||(e.players=[]);const l=h=>{var y,x,A,S;(y=h.querySelector(".edit-team-name-btn"))==null||y.addEventListener("click",()=>{const C=prompt("Enter new squad name:",e.name);C&&C.trim()&&(e.name=C.trim(),le(),U(),f.isMobile||i.remove(),Je(n))}),(x=h.querySelector(".add-player-btn"))==null||x.remove(),(A=h.querySelector("#link-player-btn"))==null||A.addEventListener("click",()=>{Uc(C=>{e.playerId=C,le(),f.isMobile||i.remove(),Je(n)})}),(S=h.querySelector("#link-player-btn-mobile"))==null||S.addEventListener("click",()=>{Uc(C=>{e.playerId=C,le(),Je(n)})});const m=h.querySelector("#mobile-team-back-btn");m&&m.addEventListener("click",()=>{f.view="standings",U()}),h.querySelectorAll(".edit-player-btn").forEach(C=>{C.addEventListener("click",()=>{const N=parseInt(C.dataset.idx);Yv("Edit player name:",e.players[N],L=>{L&&L.trim()&&(e.players[N]=L.trim(),le(),!f.isMobile&&i&&i.remove(),Je(n))})})}),h.querySelectorAll(".del-player-btn").forEach(C=>{C.addEventListener("click",()=>{if(confirm("Remove this player?")){const N=parseInt(C.dataset.idx);e.players.splice(N,1),le(),f.isMobile||i.remove(),Je(n)}})})};f.isMobile?setTimeout(()=>l(a),50):l(i)}function sn(n,e){return`<div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1"><p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${n}</p><p class="text-2xl font-black text-slate-100 font-mono">${e}</p></div>`}function rn(n,e){return`<div class="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-center space-y-0.5"><p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">${n}</p><p class="text-sm font-black text-slate-100 font-mono leading-none">${e}</p></div>`}function Ue(n=null,e=999){let t=f.tournament.teams;if(n!==null){const i=f.tournament.groups.find(a=>a.id===n)||f.tournament.groups[n];i&&i.teamIds&&(t=f.tournament.teams.filter(a=>i.teamIds.includes(a.id)))}const s=t.map(i=>({id:i.id,name:i.name,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0,home:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},away:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},cs:0})),r=f.tournament.fixtures;return r.filter(i=>i.status==="completed"&&i.round<=e&&(n===null||i.groupId===n)&&(i.stage==="groups"||i.stage==="league"||i.stage==="round_robin"||!i.stage)).forEach(i=>{const a=s.find(c=>c.id===i.homeId),l=s.find(c=>c.id===i.awayId);a&&l&&(a.p++,l.p++,a.gf+=i.homeScore,a.ga+=i.awayScore,l.gf+=i.awayScore,l.ga+=i.homeScore,a.home.p++,a.home.gf+=i.homeScore,a.home.ga+=i.awayScore,l.away.p++,l.away.gf+=i.awayScore,l.away.ga+=i.homeScore,i.awayScore===0&&(a.cs++,a.home.cs++),i.homeScore===0&&(l.cs++,l.away.cs++),i.homeScore>i.awayScore?(a.w++,a.pts+=3,l.l++,a.home.w++,a.home.pts+=3,l.away.l++):i.homeScore<i.awayScore?(l.w++,l.pts+=3,a.l++,l.away.w++,l.away.pts+=3,a.home.l++):(a.d++,l.d++,a.pts++,l.pts++,a.home.d++,a.home.pts++,l.away.d++,l.away.pts++))}),s.forEach(i=>i.gd=i.gf-i.ga),s.sort((i,a)=>{if(a.pts!==i.pts)return a.pts-i.pts;if(a.gd!==i.gd)return a.gd-i.gd;if(a.gf!==i.gf)return a.gf-i.gf;const l=r.filter(c=>c.status==="completed"&&(c.homeId===i.id&&c.awayId===a.id||c.homeId===a.id&&c.awayId===i.id));if(l.length>0){let c=0,d=0;if(l.forEach(h=>{h.homeId===i.id?h.homeScore>h.awayScore?c+=3:h.homeScore<h.awayScore?d+=3:(c++,d++):h.homeScore>h.awayScore?d+=3:h.homeScore<h.awayScore?c+=3:(d++,c++)}),d!==c)return d-c}return i.name.localeCompare(a.name)})}function Jv(){const n=Ue();if(n.length===0)return{bestAttack:null,bestDefence:null,biggestWin:null};const e=[...n].sort((r,i)=>i.gf-r.gf||r.p-i.p)[0],t=[...n].sort((r,i)=>r.ga-i.ga||r.p-i.p)[0],s=gs();return{bestAttack:e,bestDefence:t,biggestWin:s}}function gs(){const n=f.tournament.fixtures.filter(e=>e.status==="completed");return n.length===0?null:[...n].sort((e,t)=>{const s=Math.abs(e.homeScore-e.awayScore),r=Math.abs(t.homeScore-t.awayScore);return r!==s?r-s:t.homeScore+t.awayScore-(e.homeScore+e.awayScore)})[0]}function Xs(n,e){const t=f.tournament.fixtures.filter(d=>d.status==="completed"&&(d.homeId===n&&d.awayId===e||d.homeId===e&&d.awayId===n)).sort((d,h)=>new Date(h.date||0)-new Date(d.date||0));let s=0,r=0,i=0,a=0,l=0;const c=t.map(d=>{const h=d.homeId===n,m=h?d.homeScore:d.awayScore,y=h?d.awayScore:d.homeScore;a+=m,l+=y;let x="D";return m>y?(s++,x="W"):y>m?(r++,x="L"):i++,{...d,aScore:m,bScore:y,result:x}});return{aWins:s,bWins:r,draws:i,aGoals:a,bGoals:l,history:c}}function Xv(n){var i,a;const e=f.tournament.teams;let t=(i=e[0])==null?void 0:i.id,s=(a=e[1])==null?void 0:a.id;const r=()=>{if(t===void 0||s===void 0)return;const l=Xs(t,s),c=e.find(m=>m.id===t),d=e.find(m=>m.id===s),h=document.getElementById("h2h-analysis");h.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-50"></div>
            <div class="relative z-10 flex items-center justify-between gap-8">
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${c.color||"#4f46e5"}">
                  ${c.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${c.name}</h3>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div class="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/40 font-black italic text-xl">VS</div>
              </div>
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${d.color||"#10b981"}">
                  ${d.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${d.name}</h3>
              </div>
            </div>

            <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10 border-t border-slate-800/50">
               <div class="space-y-6">
                 <div class="grid grid-cols-3 gap-6">
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-emerald-400 font-mono">${l.aWins}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Draws</p>
                      <p class="text-3xl font-black text-slate-400 font-mono">${l.draws}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Wins</p>
                      <p class="text-3xl font-black text-indigo-400 font-mono">${l.bWins}</p>
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
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${c.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${l.aGoals}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${d.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${l.bGoals}</p>
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
              ${l.history.map(m=>`
                <div class="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-all">
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-500 font-mono">RD ${m.round}</span>
                    <span class="text-sm font-bold text-slate-300">${new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <p class="text-xs font-black text-slate-200">${c.name}</p>
                    </div>
                    <div class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-black font-mono text-indigo-400">
                      ${m.aScore} - ${m.bScore}
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-black text-slate-200">${d.name}</p>
                    </div>
                  </div>
                </div>
              `).join("")}
              ${l.history.length===0?'<div class="p-12 text-center text-slate-600 italic">No historical data between these squadrons.</div>':""}
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 space-y-6">
             <h3 class="text-lg font-black text-slate-100 tracking-tight">Aggregated Logistics</h3>
             <div class="space-y-4">
                <div class="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                   <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Total Combined Goals</p>
                   <p class="text-2xl font-black text-indigo-400 font-mono">${l.aGoals+l.bGoals}</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${c.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${l.aGoals}</p>
                  </div>
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${d.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${l.bGoals}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    `};n.innerHTML=`
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-xl">
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Primary Squadron</label>
           <select id="team-a-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${e.map(l=>`<option value="${l.id}" ${l.id===t?"selected":""}>${l.name}</option>`).join("")}
           </select>
        </div>
        <div class="flex items-center justify-center p-4">
           <span class="text-2xl opacity-20">⚔️</span>
        </div>
        <div class="flex-1 space-y-2">
           <label class="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 font-mono">Secondary Squadron</label>
           <select id="team-b-select" class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
             ${e.map(l=>`<option value="${l.id}" ${l.id===s?"selected":""}>${l.name}</option>`).join("")}
           </select>
        </div>
      </div>

      <div id="h2h-analysis"></div>
    </div>
  `,document.getElementById("team-a-select").addEventListener("change",l=>{t=parseInt(l.target.value),r(),setTimeout(()=>{zi(Xs(t,s)),qi(t,s)},100)}),document.getElementById("team-b-select").addEventListener("change",l=>{s=parseInt(l.target.value),r(),setTimeout(()=>{zi(Xs(t,s)),qi(t,s)},100)}),r(),setTimeout(()=>{zi(Xs(t,s)),qi(t,s)},100)}function Zv(n){f.isMobile?n.innerHTML=`
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
          ${f.tournament.teams.map(e=>`
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
    `:n.innerHTML=`
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
          ${f.tournament.teams.map(e=>`
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
    `,document.getElementById("h2h-view-btn").addEventListener("click",()=>{f.view="h2h",U()}),n.querySelectorAll(".team-detail-btn").forEach(e=>{e.addEventListener("click",()=>Je(e.dataset.teamId))})}function Sh(n="#4f46e5"){const t=Date.now()+4e3,s={startVelocity:30,spread:360,ticks:60,zIndex:1e4},r=(a,l)=>Math.random()*(l-a)+a,i=setInterval(function(){const a=t-Date.now();if(a<=0)return clearInterval(i);const l=50*(a/4e3);confetti({...s,particleCount:l,origin:{x:r(.1,.3),y:Math.random()-.2},colors:[n,"#ffffff","#fbbf24"]}),confetti({...s,particleCount:l,origin:{x:r(.7,.9),y:Math.random()-.2},colors:[n,"#ffffff","#fbbf24"]})},250)}function ex(){const n=f.tournament.fixtures.filter(t=>t.status==="completed").length,e=f.tournament.fixtures.length;n===e&&e>0&&f.tournament.status!=="completed"&&(f.tournament.status="completed",le(),f.view="champion",U(),setTimeout(()=>{var t;return Sh((t=f.tournament.teams[0])==null?void 0:t.color)},500))}function Rh(n){const e=f.tournament.fixtures.filter(s=>s.stage==="knockout");if(!e.length){n.innerHTML='<div class="h-96 flex flex-col items-center justify-center text-slate-600 italic font-black uppercase tracking-widest gap-4"><span class="text-4xl opacity-20">📂</span>Knockout phase has not started yet.</div>';return}const t=Array.from(new Set(e.map(s=>s.round))).sort((s,r)=>s-r);f.isMobile?(n.innerHTML=`
      <div class="space-y-8 animate-in fade-in duration-500 pb-20">
        <div class="flex overflow-x-auto gap-3 no-scrollbar px-2 snap-x">
          ${t.map(s=>`
            <button class="round-tab shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all snap-center ${f.activeRound===s?"bg-indigo-600 text-white shadow-lg shadow-indigo-900/40":"bg-slate-900 text-slate-500 border border-slate-800"}" data-round="${s}">
              Round ${s}
            </button>
          `).join("")}
        </div>

        <div id="bracket-matches" class="space-y-6">
           ${e.filter(s=>s.round===f.activeRound&&(s.leg===1||!s.leg)).map(s=>Hc(s)).join("")}
        </div>
      </div>
    `,n.querySelectorAll(".round-tab").forEach(s=>{s.addEventListener("click",()=>{f.activeRound=parseInt(s.dataset.round),Rh(n)})})):n.innerHTML=`<div class="flex gap-20 overflow-x-auto pb-10 no-scrollbar select-none">${t.map(s=>`<div class="flex flex-col justify-around gap-12 min-w-[280px]">
      <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Round ${s}</h5>
      ${e.filter(r=>r.round===s&&(r.leg===1||!r.leg)).map(r=>Hc(r)).join("")}
    </div>`).join("")}</div>`}function Hc(n){const e=f.tournament.teams.find(s=>s.id===n.homeId)||{name:"?"},t=f.tournament.teams.find(s=>s.id===n.awayId)||{name:"?"};return f.isMobile?`
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl flex flex-col gap-4 active:scale-[0.98] transition-all">
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${e.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${e.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${n.homeScore??"-"}</span>
         </div>
         <div class="h-px bg-slate-800/30"></div>
         <div class="flex items-center justify-between">
           <div class="flex items-center gap-3 truncate">
             <div class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600">${t.name.substring(0,2).toUpperCase()}</div>
             <span class="text-xs font-black text-slate-200 uppercase tracking-tight truncate">${t.name}</span>
           </div>
           <span class="font-mono text-lg font-black text-indigo-400 italic">${n.awayScore??"-"}</span>
         </div>
      </div>
    `:`<div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${e.name}</span><span class="font-mono text-xs font-black text-indigo-400">${n.homeScore??"-"}</span></div><div class="h-px bg-slate-800/50"></div><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${t.name}</span><span class="font-mono text-xs font-black text-indigo-400">${n.awayScore??"-"}</span></div></div>`}async function tx(){const n=document.getElementById("standings-content");if(!n)return;const e=document.createElement("div");e.className="bg-slate-950 p-12 text-slate-100 font-sans",e.style.width="1200px",e.innerHTML=`
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter">${f.tournament.name}</h1>
      <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">League Standings</p>
    </div>
    ${n.innerHTML}
    <div class="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
      Exported on ${new Date().toLocaleDateString()} • Tournament Management Engine
    </div>
  `,document.body.appendChild(e);try{const t=await html2canvas(e,{backgroundColor:"#020617",scale:2,useCORS:!0,logging:!1}),s=document.createElement("a");s.download=`${f.tournament.name.replace(/\s+/g,"_")}_Standings.png`,s.href=t.toDataURL("image/png"),s.click()}catch(t){console.error("Snapshot failed:",t)}finally{document.body.removeChild(e)}}async function Gc(){const{jsPDF:n}=window.jspdf,e=new n,t=f.tournament.name.replace(/\s+/g,"_");e.setFontSize(22),e.setTextColor(30,41,59),e.text(f.tournament.name,14,20),e.setFontSize(10),e.setTextColor(100,116,139);const s=f.tournament.type.charAt(0).toUpperCase()+f.tournament.type.slice(1);e.text(`${s} Status Report`,14,28);const i=Ue().map((c,d)=>{const h=Vr(c.id).join(" "),m=c.gd>0?"+":"";return[d+1,c.name,c.p,c.w,c.d,c.l,c.gf,c.ga,`${m}${c.gd}`,c.pts,h]});e.autoTable({head:[["Pos","Team","MP","W","D","L","GF","GA","GD","Pts","Form"]],body:i,startY:35,theme:"striped",headStyles:{fillColor:[79,70,229],textColor:[255,255,255],fontStyle:"bold"},styles:{fontSize:8,cellPadding:2},columnStyles:{0:{halign:"center"},1:{fontStyle:"bold"},2:{halign:"center"},3:{halign:"center"},4:{halign:"center"},5:{halign:"center"},6:{halign:"center"},7:{halign:"center"},8:{halign:"center"},9:{halign:"center",fontStyle:"bold"},10:{halign:"center"}}});const a=In();if(a.length>0){const c=e.lastAutoTable.finalY+15;e.setFontSize(14),e.setTextColor(30,41,59),e.text("Top Scorer Registry",14,c);const d=a.slice(0,10).map((h,m)=>[m+1,h.name,h.teamName,h.matchesCount,h.assists,h.goals]);e.autoTable({head:[["Rank","Player","Squad","MP","Assists","Goals"]],body:d,startY:c+5,theme:"grid",headStyles:{fillColor:[15,23,42],textColor:[255,255,255]},styles:{fontSize:8}})}const l=e.internal.getNumberOfPages();for(let c=1;c<=l;c++)e.setPage(c),e.setFontSize(8),e.setTextColor(148,163,184),e.text(`Generated on ${new Date().toLocaleString()} • KickOff Tournament Manager`,14,e.internal.pageSize.height-10);e.save(`${t}_Standings.pdf`)}async function nx(){const{jsPDF:n}=window.jspdf,e=new n,t=f.tournament.name.replace(/\s+/g,"_"),s=f.tournament.fixtures,r=[5,5,8],i=[15,15,26],a=[59,130,246],l=[124,58,237],c=[241,245,249],d=[148,163,184],h=[30,30,50],m=()=>{e.setFillColor(...r),e.rect(0,0,e.internal.pageSize.width,e.internal.pageSize.height,"F")};m(),e.setFillColor(...i),e.rect(0,0,e.internal.pageSize.width,40,"F"),e.setFillColor(...a),e.rect(0,40,e.internal.pageSize.width/2,2,"F"),e.setFillColor(...l),e.rect(e.internal.pageSize.width/2,40,e.internal.pageSize.width/2,2,"F"),e.setTextColor(...c),e.setFontSize(26),e.setFont("helvetica","bold"),e.text(f.tournament.name.toUpperCase(),14,25),e.setTextColor(...a),e.setFontSize(11),e.setFont("helvetica","bold"),e.text("OFFICIAL FIXTURE SCHEDULE",14,34);const y=Array.from(new Set(s.map(S=>S.round))).sort((S,C)=>S-C);let x=55;y.forEach(S=>{const N=s.filter(q=>q.round===S).map(q=>{const G=f.tournament.teams.find(b=>b.id===q.homeId)||{name:"?"},X=f.tournament.teams.find(b=>b.id===q.awayId)||{name:"?"},_=q.status==="completed"?`${q.homeScore} - ${q.awayScore}`:"vs";return[q.date?new Date(q.date).toLocaleDateString():"TBD",G.name.toUpperCase(),_,X.name.toUpperCase(),q.status==="completed"?"FT":q.status==="live"?"LIVE":""]}),K=f.tournament.type==="league"||f.tournament.type==="round_robin"?`MATCHWEEK ${S}`:`ROUND ${S}`;x>260&&(e.addPage(),m(),x=20),e.setFillColor(...i),e.roundedRect(14,x,e.internal.pageSize.width-28,12,2,2,"F"),e.setTextColor(...c),e.setFontSize(11),e.setFont("helvetica","bold"),e.text(K,20,x+8),e.autoTable({body:N,startY:x+14,theme:"grid",styles:{fillColor:r,textColor:c,lineColor:h,lineWidth:.1,fontSize:10,cellPadding:5,font:"helvetica"},alternateRowStyles:{fillColor:[10,10,16]},columnStyles:{0:{halign:"center",textColor:d,cellWidth:35,fontStyle:"bold"},1:{halign:"right",fontStyle:"bold",cellWidth:55,textColor:c},2:{halign:"center",fontStyle:"bold",cellWidth:20,textColor:a},3:{halign:"left",fontStyle:"bold",cellWidth:55,textColor:c},4:{halign:"center",textColor:l,fontStyle:"bold"}},didDrawPage:function(q){q.pageNumber>1&&q.cursor.y===q.settings.margin.top&&m()}}),x=e.lastAutoTable.finalY+15});const A=e.internal.getNumberOfPages();for(let S=1;S<=A;S++){e.setPage(S),e.setTextColor(...d),e.setFontSize(8),e.setFont("helvetica","normal");const C=`Generated by Quantum Vortex Engine • ${new Date().toLocaleDateString()} • Page ${S} of ${A}`;e.text(C,e.internal.pageSize.width/2,e.internal.pageSize.height-10,{align:"center"})}e.save(`${t}_Fixtures.pdf`)}function sx(n){const t=Ue()[0],s=(t==null?void 0:t.color)||"#fbbf24";n.innerHTML=`
    <div class="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-1000">
      <div class="max-w-4xl w-full text-center space-y-12">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
          <div class="relative p-12 bg-slate-900 border-4 border-indigo-500/30 rounded-[4rem] shadow-2xl">
            <div class="text-9xl mb-8 animate-bounce">${O.trophy}</div>
            <h1 class="text-2xl font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">CHAMPION</h1>
            <h2 class="text-7xl font-black text-white uppercase tracking-tighter shadow-indigo-500/20" style="color: ${s}">${t?t.name:"Unknown"}</h2>
          </div>
        </div>

        <div class="space-y-6">
           <h3 class="text-xl font-bold text-slate-400 capitalize">${f.tournament.name}</h3>
            <div class="flex items-center justify-center gap-6">
              <button id="view-standings-final" class="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl border border-slate-800 transition-all uppercase text-[10px] tracking-widest">Full Standings</button>
              <button id="summary-report-btn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase text-[10px] tracking-widest">Tournament Summary</button>
              <button id="next-season-champion" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase text-[10px] tracking-widest">Start Season ${(f.tournament.season||1)+1}</button>
              <button id="celebrate-btn" class="bg-slate-950 text-slate-400 px-6 py-4 rounded-xl font-bold border border-slate-800 uppercase text-[10px] tracking-[0.2em]">Celebrate Again 🎉</button>
            </div>
        </div>

        <button id="close-champion" class="text-slate-600 hover:text-slate-100 font-bold uppercase text-[9px] tracking-widest transition-colors mt-20">Skip Recognition Screen &rarr;</button>
      </div>
    </div>
  `,document.getElementById("view-standings-final").addEventListener("click",()=>{f.view="standings",U()}),document.getElementById("summary-report-btn").addEventListener("click",()=>{f.view="summary",U()}),document.getElementById("celebrate-btn").addEventListener("click",()=>Sh(s)),document.getElementById("close-champion").addEventListener("click",()=>{f.view="dashboard",U()});const r=document.getElementById("next-season-champion");r&&r.addEventListener("click",()=>ha(f.tournament.id))}function ha(n){const e=f.tournaments.find(r=>r.id===n);if(!e)return;const t=e.teams.map(r=>({...r,players:[...r.players||[]]})),s={...e,id:`t-${Date.now()}`,season:(e.season||1)+1,leagueId:e.leagueId||e.id,teams:t,fixtures:[],groups:[],status:"setup_teams",currentStage:e.type==="groups"?"groups":null,createdAt:new Date().toISOString()};f.tournaments.push(s),f.tournament=s,f.onboarding.step=0,f.view="dashboard",le(),U()}function rx(n){var y,x,A,S;const e=Ue(),t=e[0],s=e[1],r=e[2],i=Jv(),l=In()[0],c=f.tournament.fixtures,d=c.reduce((C,N)=>C+(N.homeScore||0)+(N.awayScore||0),0),h=(d/c.length||0).toFixed(1);n.innerHTML=`
    <div class="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-12">
        <div class="space-y-4">
          <h1 class="text-5xl font-black text-slate-100 uppercase tracking-tighter">Mission Summary</h1>
          <p class="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">${f.tournament.name} • Final Logistics Report</p>
        </div>
        <button id="export-summary-pdf" class="bg-slate-900 border border-slate-800 text-slate-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:border-indigo-500/50 transition-all flex items-center gap-3">
          ${O.certificate} Export Official Report (PDF)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
             <div class="absolute top-0 right-0 p-8 text-indigo-500/10 scale-150 transform rotate-12">${O.trophy}</div>
             <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Podium Recognition</h4>
             <div class="space-y-8 relative z-10">
                <div class="flex items-end gap-6 h-64">
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[70%]">
                         <span class="text-3xl">🥈</span>
                         <span class="text-xs font-black text-slate-400 uppercase text-center">${(s==null?void 0:s.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-10 rounded-b-xl flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">Runner Up</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-indigo-600/10 rounded-t-3xl border-t border-x border-indigo-500/30 flex flex-col items-center justify-center p-6 space-y-4 h-full relative">
                         <div class="absolute -top-4 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl">1</div>
                         <span class="text-5xl animate-bounce">🏆</span>
                         <span class="text-lg font-black text-white uppercase text-center">${(t==null?void 0:t.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-indigo-600 h-14 rounded-b-xl flex items-center justify-center text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-900/40">Champion</div>
                   </div>
                   <div class="flex-1 flex flex-col items-center">
                      <div class="w-full bg-slate-950/50 rounded-t-3xl border-t border-x border-slate-800 flex flex-col items-center justify-center p-6 space-y-4 h-[50%]">
                         <span class="text-2xl">🥉</span>
                         <span class="text-[10px] font-black text-slate-500 uppercase text-center">${(r==null?void 0:r.name)||"---"}</span>
                      </div>
                      <div class="w-full bg-slate-800 h-8 rounded-b-lg flex items-center justify-center text-[9px] font-black text-slate-600 uppercase">3rd Place</div>
                   </div>
                </div>
             </div>
           </div>

           <div class="grid grid-cols-2 gap-8">
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total Goals Logged</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${d}</h5>
                <p class="text-[10px] font-bold text-indigo-400 italic font-mono">${h} Per Engagement</p>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Match Count</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${c.length}</h5>
                <p class="text-[10px] font-bold text-slate-500 italic font-mono">100% Success Rate</p>
             </div>
           </div>
        </div>

        <div class="space-y-8">
           <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8">
              <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">Special Awards</h4>
              <div class="space-y-8">
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-yellow-500/10 text-yellow-500 rounded-2xl">${O.boot}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Golden Boot</p>
                       <p class="font-black text-slate-100 capitalize">${(l==null?void 0:l.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-amber-500 font-mono uppercase tracking-widest">${(l==null?void 0:l.goals)||0} Goals</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-red-400/10 text-red-500 rounded-2xl">${O.sword}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Attack</p>
                       <p class="font-black text-slate-100 capitalize">${((y=i.bestAttack)==null?void 0:y.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-red-400 font-mono uppercase tracking-widest">${((x=i.bestAttack)==null?void 0:x.gf)||0} Goals Scored</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-blue-400/10 text-blue-500 rounded-2xl">${O.shield}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Defence</p>
                       <p class="font-black text-slate-100 capitalize">${((A=i.bestDefence)==null?void 0:A.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-blue-400 font-mono uppercase tracking-widest">${((S=i.bestDefence)==null?void 0:S.ga)||0} Conceded</p>
                    </div>
                 </div>
              </div>
           </div>
           <button id="view-manual-awards" class="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-100 py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all">Select Bonus Awards &rarr;</button>
        </div>
      </div>
      <div class="pt-20 text-center">
         <button id="next-season-summary" class="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-emerald-900/40 uppercase tracking-widest text-sm">Deploy Season ${(f.tournament.season||1)+1} &rarr;</button>
      </div>
    </div>
  `,document.getElementById("export-summary-pdf").addEventListener("click",ax),document.getElementById("view-manual-awards").addEventListener("click",()=>{f.view="awards",U()});const m=document.getElementById("next-season-summary");m&&m.addEventListener("click",()=>ha(f.tournament.id))}function ix(n){const e=f.tournament.leagueId||f.tournament.id,t=f.tournaments.filter(s=>s.leagueId===e||s.id===e).sort((s,r)=>(s.season||1)-(r.season||1));n.innerHTML=`
    <div class="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div class="flex items-center justify-between border-b border-slate-800 pb-10">
        <div>
          <h2 class="text-4xl font-black text-slate-100 uppercase tracking-tighter">Hall of Immortals</h2>
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Chronological Registry of League Dominance</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="px-6 py-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Total Seasons</span>
              <span class="text-xl font-black text-indigo-400 font-mono">${t.length}</span>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        ${t.map(s=>{const r=f.tournament;f.tournament=s;const i=Ue(),a=i[0],l=i[1],c=s.fixtures.filter(m=>m.status==="completed").length,d=s.fixtures.length,h=r.id===s.id;return f.tournament=r,`
            <div class="bg-slate-900 border ${h?"border-indigo-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]":"border-slate-800"} rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-slate-900/80">
               <div class="flex items-center gap-8 flex-1">
                  <div class="w-20 h-20 bg-slate-950 rounded-3xl flex flex-col items-center justify-center border border-slate-800">
                     <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Season</span>
                     <span class="text-3xl font-black text-slate-100 font-mono">${s.season||1}</span>
                  </div>
                  <div>
                     <h3 class="text-xl font-black text-slate-100 uppercase tracking-tight mb-2">${s.name}</h3>
                     <div class="flex items-center gap-3">
                        <span class="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">${s.type.replace("_"," ")}</span>
                        <span class="text-slate-800 text-xs">•</span>
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${c}/${d} Matches Played</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-12">
                  <div class="text-center">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Champion</p>
                     <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">${a?"🏆":"---"}</span>
                        <span class="font-black text-white uppercase text-xs tracking-tight truncate max-w-[120px]">${(a==null?void 0:a.name)||"In Progress"}</span>
                     </div>
                  </div>
                  <div class="text-center opacity-60">
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Runner Up</p>
                     <div class="flex flex-col items-center">
                        <span class="text-xl mb-1">${l?"🥈":"---"}</span>
                        <span class="font-bold text-slate-400 uppercase text-[10px] tracking-tight truncate max-w-[120px]">${(l==null?void 0:l.name)||"---"}</span>
                     </div>
                  </div>
               </div>

               <div class="flex items-center gap-3">
                  <button data-goto="${s.id}" class="px-6 py-3 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-100 uppercase tracking-widest transition-all">
                     Inspect Registry
                  </button>
                  ${h?`
                    <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active</div>
                  `:""}
               </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,n.querySelectorAll("[data-goto]").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.goto;f.tournament=f.tournaments.find(i=>i.id===r),f.view="dashboard",U()})})}function ox(n){f.tournament.manualAwards=f.tournament.manualAwards||{},n.innerHTML=`
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div class="text-center space-y-4">
         <h2 class="text-5xl font-black text-white uppercase tracking-tighter">Honorable Recognition</h2>
         <p class="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Select and honor the top operatives and teams manually</p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${Zs("Team of Tournament","player-ot")}
          ${Zs("Fair Play Award","fair-play")}
          ${Zs("Best Manager","best-manager")}
          ${Zs("Goal of the Mission","goal-om")}
       </div>

       <div class="pt-20 text-center">
         <button id="back-to-summary" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Consolidate Summary Registry</button>
       </div>
    </div>
  `,n.querySelectorAll(".award-input").forEach(e=>{e.addEventListener("input",t=>{f.tournament.manualAwards[t.target.dataset.key]=t.target.value,le()})}),document.getElementById("back-to-summary").addEventListener("click",()=>{f.view="summary",U()})}function Zs(n,e){return`
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
       <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${n}</h4>
       <input type="text" placeholder="Team Name..." class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all award-input" data-key="${e}" value="${f.tournament.manualAwards[e]||""}">
    </div>
  `}function ax(){const{jsPDF:n}=window.jspdf,e=new n;e.setFontSize(28),e.text("OFFICIAL TOURNAMENT SUMMARY",14,25),e.setFontSize(14),e.text(f.tournament.name,14,35);const s=Ue().map((r,i)=>[i+1,r.name,r.p,r.w,r.d,r.l,r.gf,r.ga,r.pts]);e.autoTable({startY:50,head:[["Pos","Squad","MP","W","D","L","GF","GA","Pts"]],body:s,theme:"grid"}),e.save(`${f.tournament.name}_Final_Report.pdf`)}try{console.log("[KickOff] Script execution reaching bottom. Triggering initial render."),document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{console.log("[KickOff] DOMContentLoaded triggered."),U()}):U()}catch(n){alert("CRITICAL STARTUP ERROR: "+n.message),console.error(n)}function zi(n){if(typeof Chart>"u")return;const e=document.getElementById("h2hChart");if(!e)return;const t=e.getContext("2d"),s=Chart.getChart(e);s&&s.destroy(),new Chart(t,{type:"doughnut",data:{labels:["Squad A Wins","Stalemate","Squad B Wins"],datasets:[{data:[n.aWins,n.draws,n.bWins],backgroundColor:["#10b981","#475569","#6366f1"],hoverBackgroundColor:["#34d399","#64748b","#818cf8"],borderWidth:0,hoverOffset:15,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:12,weight:"bold"}}}}})}function qi(n,e){if(typeof Chart>"u")return;const t=document.getElementById("h2hProgressionChart");if(!t)return;const s=t.getContext("2d"),r=f.tournament.teams.find(d=>d.id===n),i=f.tournament.teams.find(d=>d.id===e),a=Array.from(new Set(f.tournament.fixtures.map(d=>d.round))).sort((d,h)=>d-h),l=d=>{let h=0;const m=[0],y=f.tournament.fixtures.filter(x=>x.status==="completed"&&(x.homeId===d||x.awayId===d));return a.forEach(x=>{const A=y.find(S=>S.round===x);if(A){const S=A.homeId===d;A.homeScore===A.awayScore?h+=1:(S&&A.homeScore>A.awayScore||!S&&A.awayScore>A.homeScore)&&(h+=3)}m.push(h)}),m},c=Chart.getChart(t);c&&c.destroy(),new Chart(s,{type:"line",data:{labels:["0",...a.map(d=>`${d}`)],datasets:[{label:r.name,data:l(n),borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:3,tension:.4,pointRadius:2},{label:i.name,data:l(e),borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",borderWidth:3,tension:.4,pointRadius:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:"#475569",font:{size:9,weight:"bold"},usePointStyle:!0}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)"},ticks:{color:"#475569",font:{size:9}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9}}}}}})}function Wc(n,e){if(typeof Chart>"u")return;const t=document.getElementById(e);if(!t)return;const s=t.getContext("2d"),r=f.tournament.fixtures.filter(c=>c.status==="completed"&&(c.homeId===n||c.awayId===n)),i=Array.from(new Set(f.tournament.fixtures.map(c=>c.round))).sort((c,d)=>c-d);let a=0;const l=[0];i.forEach(c=>{const d=r.find(h=>h.round===c);if(d){const h=d.homeId===n;d.homeScore===d.awayScore?a+=1:(h&&d.homeScore>d.awayScore||!h&&d.awayScore>d.homeScore)&&(a+=3)}l.push(a)}),new Chart(s,{type:"line",data:{labels:["Start",...i.map(c=>`RD ${c}`)],datasets:[{label:"Points",data:l,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",fill:!0,tension:.4,borderWidth:3,pointBackgroundColor:"#6366f1",pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#475569"}},x:{grid:{display:!1},ticks:{color:"#475569"}}}}})}
