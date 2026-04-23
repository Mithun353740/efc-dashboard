(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const ed=()=>{};var ra={};/**
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
 */const wl=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},td=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const o=n[t++];e[s++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=n[t++],a=n[t++],l=n[t++],u=((r&7)<<18|(o&63)<<12|(a&63)<<6|l&63)-65536;e[s++]=String.fromCharCode(55296+(u>>10)),e[s++]=String.fromCharCode(56320+(u&1023))}else{const o=n[t++],a=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(o&63)<<6|a&63)}}return e.join("")},_l={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const o=n[r],a=r+1<n.length,l=a?n[r+1]:0,u=r+2<n.length,h=u?n[r+2]:0,p=o>>2,m=(o&3)<<4|l>>4;let b=(l&15)<<2|h>>6,w=h&63;u||(w=64,a||(b=64)),s.push(t[p],t[m],t[b],t[w])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(wl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):td(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const o=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const h=r<n.length?t[n.charAt(r)]:64;++r;const m=r<n.length?t[n.charAt(r)]:64;if(++r,o==null||l==null||h==null||m==null)throw new nd;const b=o<<2|l>>4;if(s.push(b),h!==64){const w=l<<4&240|h>>2;if(s.push(w),m!==64){const A=h<<6&192|m;s.push(A)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class nd extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const sd=function(n){const e=wl(n);return _l.encodeByteArray(e,!0)},El=function(n){return sd(n).replace(/\./g,"")},rd=function(n){try{return _l.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function id(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const od=()=>id().__FIREBASE_DEFAULTS__,ad=()=>{if(typeof process>"u"||typeof ra>"u")return;const n=ra.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},ld=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&rd(n[1]);return e&&JSON.parse(e)},kl=()=>{try{return ed()||od()||ad()||ld()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},cd=()=>{var n;return(n=kl())==null?void 0:n.config};/**
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
 */class ud{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
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
 */function dd(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function hd(){var e;const n=(e=kl())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function pd(){return!hd()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function fd(){try{return typeof indexedDB=="object"}catch{return!1}}function md(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var o;e(((o=r.error)==null?void 0:o.message)||"")}}catch(t){e(t)}})}/**
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
 */const gd="FirebaseError";class en extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=gd,Object.setPrototypeOf(this,en.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Tl.prototype.create)}}class Tl{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,o=this.errors[e],a=o?yd(o,s):"Error",l=`${this.serviceName}: ${a} (${r}).`;return new en(r,l,s)}}function yd(n,e){return n.replace(bd,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const bd=/\{\$([^}]+)}/g;function As(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const o=n[r],a=e[r];if(ia(o)&&ia(a)){if(!As(o,a))return!1}else if(o!==a)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function ia(n){return n!==null&&typeof n=="object"}/**
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
 */function Ge(n){return n&&n._delegate?n._delegate:n}/**
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
 */function Il(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function vd(n){return(await fetch(n,{credentials:"include"})).ok}class $n{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Et="[DEFAULT]";/**
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
 */class xd{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new ud;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(_d(e))try{this.getOrInitializeService({instanceIdentifier:Et})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:r});s.resolve(o)}catch{}}}}clearInstance(e=Et){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Et){return this.instances.has(e)}getOptions(e=Et){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[o,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);s===l&&a.resolve(r)}return r}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:wd(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Et){return this.component?this.component.multipleInstances?e:Et:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wd(n){return n===Et?void 0:n}function _d(n){return n.instantiationMode==="EAGER"}/**
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
 */class Ed{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new xd(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var X;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(X||(X={}));const kd={debug:X.DEBUG,verbose:X.VERBOSE,info:X.INFO,warn:X.WARN,error:X.ERROR,silent:X.SILENT},Td=X.INFO,Id={[X.DEBUG]:"log",[X.VERBOSE]:"log",[X.INFO]:"info",[X.WARN]:"warn",[X.ERROR]:"error"},Ad=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=Id[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Al{constructor(e){this.name=e,this._logLevel=Td,this._logHandler=Ad,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in X))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?kd[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,X.DEBUG,...e),this._logHandler(this,X.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,X.VERBOSE,...e),this._logHandler(this,X.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,X.INFO,...e),this._logHandler(this,X.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,X.WARN,...e),this._logHandler(this,X.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,X.ERROR,...e),this._logHandler(this,X.ERROR,...e)}}const Sd=(n,e)=>e.some(t=>n instanceof t);let oa,aa;function Cd(){return oa||(oa=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Rd(){return aa||(aa=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Sl=new WeakMap,Wr=new WeakMap,Cl=new WeakMap,Dr=new WeakMap,yi=new WeakMap;function Pd(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(ot(n.result)),r()},a=()=>{s(n.error),r()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Sl.set(t,n)}).catch(()=>{}),yi.set(e,n),e}function Vd(n){if(Wr.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),r()},a=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Wr.set(n,e)}let Kr={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Wr.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Cl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return ot(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Dd(n){Kr=n(Kr)}function $d(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call($r(this),e,...t);return Cl.set(s,e.sort?e.sort():[e]),ot(s)}:Rd().includes(n)?function(...e){return n.apply($r(this),e),ot(Sl.get(this))}:function(...e){return ot(n.apply($r(this),e))}}function Md(n){return typeof n=="function"?$d(n):(n instanceof IDBTransaction&&Vd(n),Sd(n,Cd())?new Proxy(n,Kr):n)}function ot(n){if(n instanceof IDBRequest)return Pd(n);if(Dr.has(n))return Dr.get(n);const e=Md(n);return e!==n&&(Dr.set(n,e),yi.set(e,n)),e}const $r=n=>yi.get(n);function Nd(n,e,{blocked:t,upgrade:s,blocking:r,terminated:o}={}){const a=indexedDB.open(n,e),l=ot(a);return s&&a.addEventListener("upgradeneeded",u=>{s(ot(a.result),u.oldVersion,u.newVersion,ot(a.transaction),u)}),t&&a.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),l.then(u=>{o&&u.addEventListener("close",()=>o()),r&&u.addEventListener("versionchange",h=>r(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const Ld=["get","getKey","getAll","getAllKeys","count"],Od=["put","add","delete","clear"],Mr=new Map;function la(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Mr.get(e))return Mr.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=Od.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Ld.includes(t)))return;const o=async function(a,...l){const u=this.transaction(a,r?"readwrite":"readonly");let h=u.store;return s&&(h=h.index(l.shift())),(await Promise.all([h[t](...l),r&&u.done]))[0]};return Mr.set(e,o),o}Dd(n=>({...n,get:(e,t,s)=>la(e,t)||n.get(e,t,s),has:(e,t)=>!!la(e,t)||n.has(e,t)}));/**
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
 */class Fd{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Bd(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Bd(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Qr="@firebase/app",ca="0.14.11";/**
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
 */const We=new Al("@firebase/app"),jd="@firebase/app-compat",Ud="@firebase/analytics-compat",zd="@firebase/analytics",qd="@firebase/app-check-compat",Hd="@firebase/app-check",Gd="@firebase/auth",Wd="@firebase/auth-compat",Kd="@firebase/database",Qd="@firebase/data-connect",Yd="@firebase/database-compat",Jd="@firebase/functions",Xd="@firebase/functions-compat",Zd="@firebase/installations",eh="@firebase/installations-compat",th="@firebase/messaging",nh="@firebase/messaging-compat",sh="@firebase/performance",rh="@firebase/performance-compat",ih="@firebase/remote-config",oh="@firebase/remote-config-compat",ah="@firebase/storage",lh="@firebase/storage-compat",ch="@firebase/firestore",uh="@firebase/ai",dh="@firebase/firestore-compat",hh="firebase",ph="12.12.0";/**
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
 */const fh="[DEFAULT]",mh={[Qr]:"fire-core",[jd]:"fire-core-compat",[zd]:"fire-analytics",[Ud]:"fire-analytics-compat",[Hd]:"fire-app-check",[qd]:"fire-app-check-compat",[Gd]:"fire-auth",[Wd]:"fire-auth-compat",[Kd]:"fire-rtdb",[Qd]:"fire-data-connect",[Yd]:"fire-rtdb-compat",[Jd]:"fire-fn",[Xd]:"fire-fn-compat",[Zd]:"fire-iid",[eh]:"fire-iid-compat",[th]:"fire-fcm",[nh]:"fire-fcm-compat",[sh]:"fire-perf",[rh]:"fire-perf-compat",[ih]:"fire-rc",[oh]:"fire-rc-compat",[ah]:"fire-gcs",[lh]:"fire-gcs-compat",[ch]:"fire-fst",[dh]:"fire-fst-compat",[uh]:"fire-vertex","fire-js":"fire-js",[hh]:"fire-js-all"};/**
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
 */const Yr=new Map,gh=new Map,Jr=new Map;function ua(n,e){try{n.container.addComponent(e)}catch(t){We.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ss(n){const e=n.name;if(Jr.has(e))return We.debug(`There were multiple attempts to register component ${e}.`),!1;Jr.set(e,n);for(const t of Yr.values())ua(t,n);for(const t of gh.values())ua(t,n);return!0}function yh(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function bh(n){return n==null?!1:n.settings!==void 0}/**
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
 */const vh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Tt=new Tl("app","Firebase",vh);/**
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
 */class xh{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new $n("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Tt.create("app-deleted",{appName:this._name})}}/**
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
 */const wh=ph;function _h(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s={name:fh,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw Tt.create("bad-app-name",{appName:String(r)});if(t||(t=cd()),!t)throw Tt.create("no-options");const o=Yr.get(r);if(o){if(As(t,o.options)&&As(s,o.config))return o;throw Tt.create("duplicate-app",{appName:r})}const a=new Ed(r);for(const u of Jr.values())a.addComponent(u);const l=new xh(t,s,a);return Yr.set(r,l),l}function jt(n,e,t){let s=mh[n]??n;t&&(s+=`-${t}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),We.warn(a.join(" "));return}Ss(new $n(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Eh="firebase-heartbeat-database",kh=1,Mn="firebase-heartbeat-store";let Nr=null;function Rl(){return Nr||(Nr=Nd(Eh,kh,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Mn)}catch(t){console.warn(t)}}}}).catch(n=>{throw Tt.create("idb-open",{originalErrorMessage:n.message})})),Nr}async function Th(n){try{const t=(await Rl()).transaction(Mn),s=await t.objectStore(Mn).get(Pl(n));return await t.done,s}catch(e){if(e instanceof en)We.warn(e.message);else{const t=Tt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});We.warn(t.message)}}}async function da(n,e){try{const s=(await Rl()).transaction(Mn,"readwrite");await s.objectStore(Mn).put(e,Pl(n)),await s.done}catch(t){if(t instanceof en)We.warn(t.message);else{const s=Tt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});We.warn(s.message)}}}function Pl(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Ih=1024,Ah=30;class Sh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Rh(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ha();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats.length>Ah){const a=Ph(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){We.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ha(),{heartbeatsToSend:s,unsentEntries:r}=Ch(this._heartbeatsCache.heartbeats),o=El(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(t){return We.warn(t),""}}}function ha(){return new Date().toISOString().substring(0,10)}function Ch(n,e=Ih){const t=[];let s=n.slice();for(const r of n){const o=t.find(a=>a.agent===r.agent);if(o){if(o.dates.push(r.date),pa(t)>e){o.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),pa(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Rh{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return fd()?md().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Th(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return da(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return da(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function pa(n){return El(JSON.stringify({version:2,heartbeats:n})).length}function Ph(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
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
 */function Vh(n){Ss(new $n("platform-logger",e=>new Fd(e),"PRIVATE")),Ss(new $n("heartbeat",e=>new Sh(e),"PRIVATE")),jt(Qr,ca,n),jt(Qr,ca,"esm2020"),jt("fire-js","")}Vh("");var Dh="firebase",$h="12.12.1";/**
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
 */jt(Dh,$h,"app");var fa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var at,Vl;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,y){function x(){}x.prototype=y.prototype,_.F=y.prototype,_.prototype=new x,_.prototype.constructor=_,_.D=function(k,E,I){for(var v=Array(arguments.length-2),ke=2;ke<arguments.length;ke++)v[ke-2]=arguments[ke];return y.prototype[E].apply(k,v)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(s,t),s.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(_,y,x){x||(x=0);const k=Array(16);if(typeof y=="string")for(var E=0;E<16;++E)k[E]=y.charCodeAt(x++)|y.charCodeAt(x++)<<8|y.charCodeAt(x++)<<16|y.charCodeAt(x++)<<24;else for(E=0;E<16;++E)k[E]=y[x++]|y[x++]<<8|y[x++]<<16|y[x++]<<24;y=_.g[0],x=_.g[1],E=_.g[2];let I=_.g[3],v;v=y+(I^x&(E^I))+k[0]+3614090360&4294967295,y=x+(v<<7&4294967295|v>>>25),v=I+(E^y&(x^E))+k[1]+3905402710&4294967295,I=y+(v<<12&4294967295|v>>>20),v=E+(x^I&(y^x))+k[2]+606105819&4294967295,E=I+(v<<17&4294967295|v>>>15),v=x+(y^E&(I^y))+k[3]+3250441966&4294967295,x=E+(v<<22&4294967295|v>>>10),v=y+(I^x&(E^I))+k[4]+4118548399&4294967295,y=x+(v<<7&4294967295|v>>>25),v=I+(E^y&(x^E))+k[5]+1200080426&4294967295,I=y+(v<<12&4294967295|v>>>20),v=E+(x^I&(y^x))+k[6]+2821735955&4294967295,E=I+(v<<17&4294967295|v>>>15),v=x+(y^E&(I^y))+k[7]+4249261313&4294967295,x=E+(v<<22&4294967295|v>>>10),v=y+(I^x&(E^I))+k[8]+1770035416&4294967295,y=x+(v<<7&4294967295|v>>>25),v=I+(E^y&(x^E))+k[9]+2336552879&4294967295,I=y+(v<<12&4294967295|v>>>20),v=E+(x^I&(y^x))+k[10]+4294925233&4294967295,E=I+(v<<17&4294967295|v>>>15),v=x+(y^E&(I^y))+k[11]+2304563134&4294967295,x=E+(v<<22&4294967295|v>>>10),v=y+(I^x&(E^I))+k[12]+1804603682&4294967295,y=x+(v<<7&4294967295|v>>>25),v=I+(E^y&(x^E))+k[13]+4254626195&4294967295,I=y+(v<<12&4294967295|v>>>20),v=E+(x^I&(y^x))+k[14]+2792965006&4294967295,E=I+(v<<17&4294967295|v>>>15),v=x+(y^E&(I^y))+k[15]+1236535329&4294967295,x=E+(v<<22&4294967295|v>>>10),v=y+(E^I&(x^E))+k[1]+4129170786&4294967295,y=x+(v<<5&4294967295|v>>>27),v=I+(x^E&(y^x))+k[6]+3225465664&4294967295,I=y+(v<<9&4294967295|v>>>23),v=E+(y^x&(I^y))+k[11]+643717713&4294967295,E=I+(v<<14&4294967295|v>>>18),v=x+(I^y&(E^I))+k[0]+3921069994&4294967295,x=E+(v<<20&4294967295|v>>>12),v=y+(E^I&(x^E))+k[5]+3593408605&4294967295,y=x+(v<<5&4294967295|v>>>27),v=I+(x^E&(y^x))+k[10]+38016083&4294967295,I=y+(v<<9&4294967295|v>>>23),v=E+(y^x&(I^y))+k[15]+3634488961&4294967295,E=I+(v<<14&4294967295|v>>>18),v=x+(I^y&(E^I))+k[4]+3889429448&4294967295,x=E+(v<<20&4294967295|v>>>12),v=y+(E^I&(x^E))+k[9]+568446438&4294967295,y=x+(v<<5&4294967295|v>>>27),v=I+(x^E&(y^x))+k[14]+3275163606&4294967295,I=y+(v<<9&4294967295|v>>>23),v=E+(y^x&(I^y))+k[3]+4107603335&4294967295,E=I+(v<<14&4294967295|v>>>18),v=x+(I^y&(E^I))+k[8]+1163531501&4294967295,x=E+(v<<20&4294967295|v>>>12),v=y+(E^I&(x^E))+k[13]+2850285829&4294967295,y=x+(v<<5&4294967295|v>>>27),v=I+(x^E&(y^x))+k[2]+4243563512&4294967295,I=y+(v<<9&4294967295|v>>>23),v=E+(y^x&(I^y))+k[7]+1735328473&4294967295,E=I+(v<<14&4294967295|v>>>18),v=x+(I^y&(E^I))+k[12]+2368359562&4294967295,x=E+(v<<20&4294967295|v>>>12),v=y+(x^E^I)+k[5]+4294588738&4294967295,y=x+(v<<4&4294967295|v>>>28),v=I+(y^x^E)+k[8]+2272392833&4294967295,I=y+(v<<11&4294967295|v>>>21),v=E+(I^y^x)+k[11]+1839030562&4294967295,E=I+(v<<16&4294967295|v>>>16),v=x+(E^I^y)+k[14]+4259657740&4294967295,x=E+(v<<23&4294967295|v>>>9),v=y+(x^E^I)+k[1]+2763975236&4294967295,y=x+(v<<4&4294967295|v>>>28),v=I+(y^x^E)+k[4]+1272893353&4294967295,I=y+(v<<11&4294967295|v>>>21),v=E+(I^y^x)+k[7]+4139469664&4294967295,E=I+(v<<16&4294967295|v>>>16),v=x+(E^I^y)+k[10]+3200236656&4294967295,x=E+(v<<23&4294967295|v>>>9),v=y+(x^E^I)+k[13]+681279174&4294967295,y=x+(v<<4&4294967295|v>>>28),v=I+(y^x^E)+k[0]+3936430074&4294967295,I=y+(v<<11&4294967295|v>>>21),v=E+(I^y^x)+k[3]+3572445317&4294967295,E=I+(v<<16&4294967295|v>>>16),v=x+(E^I^y)+k[6]+76029189&4294967295,x=E+(v<<23&4294967295|v>>>9),v=y+(x^E^I)+k[9]+3654602809&4294967295,y=x+(v<<4&4294967295|v>>>28),v=I+(y^x^E)+k[12]+3873151461&4294967295,I=y+(v<<11&4294967295|v>>>21),v=E+(I^y^x)+k[15]+530742520&4294967295,E=I+(v<<16&4294967295|v>>>16),v=x+(E^I^y)+k[2]+3299628645&4294967295,x=E+(v<<23&4294967295|v>>>9),v=y+(E^(x|~I))+k[0]+4096336452&4294967295,y=x+(v<<6&4294967295|v>>>26),v=I+(x^(y|~E))+k[7]+1126891415&4294967295,I=y+(v<<10&4294967295|v>>>22),v=E+(y^(I|~x))+k[14]+2878612391&4294967295,E=I+(v<<15&4294967295|v>>>17),v=x+(I^(E|~y))+k[5]+4237533241&4294967295,x=E+(v<<21&4294967295|v>>>11),v=y+(E^(x|~I))+k[12]+1700485571&4294967295,y=x+(v<<6&4294967295|v>>>26),v=I+(x^(y|~E))+k[3]+2399980690&4294967295,I=y+(v<<10&4294967295|v>>>22),v=E+(y^(I|~x))+k[10]+4293915773&4294967295,E=I+(v<<15&4294967295|v>>>17),v=x+(I^(E|~y))+k[1]+2240044497&4294967295,x=E+(v<<21&4294967295|v>>>11),v=y+(E^(x|~I))+k[8]+1873313359&4294967295,y=x+(v<<6&4294967295|v>>>26),v=I+(x^(y|~E))+k[15]+4264355552&4294967295,I=y+(v<<10&4294967295|v>>>22),v=E+(y^(I|~x))+k[6]+2734768916&4294967295,E=I+(v<<15&4294967295|v>>>17),v=x+(I^(E|~y))+k[13]+1309151649&4294967295,x=E+(v<<21&4294967295|v>>>11),v=y+(E^(x|~I))+k[4]+4149444226&4294967295,y=x+(v<<6&4294967295|v>>>26),v=I+(x^(y|~E))+k[11]+3174756917&4294967295,I=y+(v<<10&4294967295|v>>>22),v=E+(y^(I|~x))+k[2]+718787259&4294967295,E=I+(v<<15&4294967295|v>>>17),v=x+(I^(E|~y))+k[9]+3951481745&4294967295,_.g[0]=_.g[0]+y&4294967295,_.g[1]=_.g[1]+(E+(v<<21&4294967295|v>>>11))&4294967295,_.g[2]=_.g[2]+E&4294967295,_.g[3]=_.g[3]+I&4294967295}s.prototype.v=function(_,y){y===void 0&&(y=_.length);const x=y-this.blockSize,k=this.C;let E=this.h,I=0;for(;I<y;){if(E==0)for(;I<=x;)r(this,_,I),I+=this.blockSize;if(typeof _=="string"){for(;I<y;)if(k[E++]=_.charCodeAt(I++),E==this.blockSize){r(this,k),E=0;break}}else for(;I<y;)if(k[E++]=_[I++],E==this.blockSize){r(this,k),E=0;break}}this.h=E,this.o+=y},s.prototype.A=function(){var _=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);_[0]=128;for(var y=1;y<_.length-8;++y)_[y]=0;y=this.o*8;for(var x=_.length-8;x<_.length;++x)_[x]=y&255,y/=256;for(this.v(_),_=Array(16),y=0,x=0;x<4;++x)for(let k=0;k<32;k+=8)_[y++]=this.g[x]>>>k&255;return _};function o(_,y){var x=l;return Object.prototype.hasOwnProperty.call(x,_)?x[_]:x[_]=y(_)}function a(_,y){this.h=y;const x=[];let k=!0;for(let E=_.length-1;E>=0;E--){const I=_[E]|0;k&&I==y||(x[E]=I,k=!1)}this.g=x}var l={};function u(_){return-128<=_&&_<128?o(_,function(y){return new a([y|0],y<0?-1:0)}):new a([_|0],_<0?-1:0)}function h(_){if(isNaN(_)||!isFinite(_))return m;if(_<0)return R(h(-_));const y=[];let x=1;for(let k=0;_>=x;k++)y[k]=_/x|0,x*=4294967296;return new a(y,0)}function p(_,y){if(_.length==0)throw Error("number format error: empty string");if(y=y||10,y<2||36<y)throw Error("radix out of range: "+y);if(_.charAt(0)=="-")return R(p(_.substring(1),y));if(_.indexOf("-")>=0)throw Error('number format error: interior "-" character');const x=h(Math.pow(y,8));let k=m;for(let I=0;I<_.length;I+=8){var E=Math.min(8,_.length-I);const v=parseInt(_.substring(I,I+E),y);E<8?(E=h(Math.pow(y,E)),k=k.j(E).add(h(v))):(k=k.j(x),k=k.add(h(v)))}return k}var m=u(0),b=u(1),w=u(16777216);n=a.prototype,n.m=function(){if(C(this))return-R(this).m();let _=0,y=1;for(let x=0;x<this.g.length;x++){const k=this.i(x);_+=(k>=0?k:4294967296+k)*y,y*=4294967296}return _},n.toString=function(_){if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(A(this))return"0";if(C(this))return"-"+R(this).toString(_);const y=h(Math.pow(_,6));var x=this;let k="";for(;;){const E=z(x,y).g;x=N(x,E.j(y));let I=((x.g.length>0?x.g[0]:x.h)>>>0).toString(_);if(x=E,A(x))return I+k;for(;I.length<6;)I="0"+I;k=I+k}},n.i=function(_){return _<0?0:_<this.g.length?this.g[_]:this.h};function A(_){if(_.h!=0)return!1;for(let y=0;y<_.g.length;y++)if(_.g[y]!=0)return!1;return!0}function C(_){return _.h==-1}n.l=function(_){return _=N(this,_),C(_)?-1:A(_)?0:1};function R(_){const y=_.g.length,x=[];for(let k=0;k<y;k++)x[k]=~_.g[k];return new a(x,~_.h).add(b)}n.abs=function(){return C(this)?R(this):this},n.add=function(_){const y=Math.max(this.g.length,_.g.length),x=[];let k=0;for(let E=0;E<=y;E++){let I=k+(this.i(E)&65535)+(_.i(E)&65535),v=(I>>>16)+(this.i(E)>>>16)+(_.i(E)>>>16);k=v>>>16,I&=65535,v&=65535,x[E]=v<<16|I}return new a(x,x[x.length-1]&-2147483648?-1:0)};function N(_,y){return _.add(R(y))}n.j=function(_){if(A(this)||A(_))return m;if(C(this))return C(_)?R(this).j(R(_)):R(R(this).j(_));if(C(_))return R(this.j(R(_)));if(this.l(w)<0&&_.l(w)<0)return h(this.m()*_.m());const y=this.g.length+_.g.length,x=[];for(var k=0;k<2*y;k++)x[k]=0;for(k=0;k<this.g.length;k++)for(let E=0;E<_.g.length;E++){const I=this.i(k)>>>16,v=this.i(k)&65535,ke=_.i(E)>>>16,yt=_.i(E)&65535;x[2*k+2*E]+=v*yt,L(x,2*k+2*E),x[2*k+2*E+1]+=I*yt,L(x,2*k+2*E+1),x[2*k+2*E+1]+=v*ke,L(x,2*k+2*E+1),x[2*k+2*E+2]+=I*ke,L(x,2*k+2*E+2)}for(_=0;_<y;_++)x[_]=x[2*_+1]<<16|x[2*_];for(_=y;_<2*y;_++)x[_]=0;return new a(x,0)};function L(_,y){for(;(_[y]&65535)!=_[y];)_[y+1]+=_[y]>>>16,_[y]&=65535,y++}function W(_,y){this.g=_,this.h=y}function z(_,y){if(A(y))throw Error("division by zero");if(A(_))return new W(m,m);if(C(_))return y=z(R(_),y),new W(R(y.g),R(y.h));if(C(y))return y=z(_,R(y)),new W(R(y.g),y.h);if(_.g.length>30){if(C(_)||C(y))throw Error("slowDivide_ only works with positive integers.");for(var x=b,k=y;k.l(_)<=0;)x=H(x),k=H(k);var E=Y(x,1),I=Y(k,1);for(k=Y(k,2),x=Y(x,2);!A(k);){var v=I.add(k);v.l(_)<=0&&(E=E.add(x),I=v),k=Y(k,1),x=Y(x,1)}return y=N(_,E.j(y)),new W(E,y)}for(E=m;_.l(y)>=0;){for(x=Math.max(1,Math.floor(_.m()/y.m())),k=Math.ceil(Math.log(x)/Math.LN2),k=k<=48?1:Math.pow(2,k-48),I=h(x),v=I.j(y);C(v)||v.l(_)>0;)x-=k,I=h(x),v=I.j(y);A(I)&&(I=b),E=E.add(I),_=N(_,v)}return new W(E,_)}n.B=function(_){return z(this,_).h},n.and=function(_){const y=Math.max(this.g.length,_.g.length),x=[];for(let k=0;k<y;k++)x[k]=this.i(k)&_.i(k);return new a(x,this.h&_.h)},n.or=function(_){const y=Math.max(this.g.length,_.g.length),x=[];for(let k=0;k<y;k++)x[k]=this.i(k)|_.i(k);return new a(x,this.h|_.h)},n.xor=function(_){const y=Math.max(this.g.length,_.g.length),x=[];for(let k=0;k<y;k++)x[k]=this.i(k)^_.i(k);return new a(x,this.h^_.h)};function H(_){const y=_.g.length+1,x=[];for(let k=0;k<y;k++)x[k]=_.i(k)<<1|_.i(k-1)>>>31;return new a(x,_.h)}function Y(_,y){const x=y>>5;y%=32;const k=_.g.length-x,E=[];for(let I=0;I<k;I++)E[I]=y>0?_.i(I+x)>>>y|_.i(I+x+1)<<32-y:_.i(I+x);return new a(E,_.h)}s.prototype.digest=s.prototype.A,s.prototype.reset=s.prototype.u,s.prototype.update=s.prototype.v,Vl=s,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=p,at=a}).apply(typeof fa<"u"?fa:typeof self<"u"?self:typeof window<"u"?window:{});var hs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dl,kn,$l,xs,Xr,Ml,Nl,Ll;(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof hs=="object"&&hs];for(var c=0;c<i.length;++c){var d=i[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var s=t(this);function r(i,c){if(c)e:{var d=s;i=i.split(".");for(var g=0;g<i.length-1;g++){var T=i[g];if(!(T in d))break e;d=d[T]}i=i[i.length-1],g=d[i],c=c(g),c!=g&&c!=null&&e(d,i,{configurable:!0,writable:!0,value:c})}}r("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(i){return i||function(c){var d=[],g;for(g in c)Object.prototype.hasOwnProperty.call(c,g)&&d.push([g,c[g]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function u(i,c,d){return i.call.apply(i.bind,arguments)}function h(i,c,d){return h=u,h.apply(null,arguments)}function p(i,c){var d=Array.prototype.slice.call(arguments,1);return function(){var g=d.slice();return g.push.apply(g,arguments),i.apply(this,g)}}function m(i,c){function d(){}d.prototype=c.prototype,i.Z=c.prototype,i.prototype=new d,i.prototype.constructor=i,i.Ob=function(g,T,S){for(var D=Array(arguments.length-2),G=2;G<arguments.length;G++)D[G-2]=arguments[G];return c.prototype[T].apply(g,D)}}var b=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function w(i){const c=i.length;if(c>0){const d=Array(c);for(let g=0;g<c;g++)d[g]=i[g];return d}return[]}function A(i,c){for(let g=1;g<arguments.length;g++){const T=arguments[g];var d=typeof T;if(d=d!="object"?d:T?Array.isArray(T)?"array":d:"null",d=="array"||d=="object"&&typeof T.length=="number"){d=i.length||0;const S=T.length||0;i.length=d+S;for(let D=0;D<S;D++)i[d+D]=T[D]}else i.push(T)}}class C{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function R(i){a.setTimeout(()=>{throw i},0)}function N(){var i=_;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class L{constructor(){this.h=this.g=null}add(c,d){const g=W.get();g.set(c,d),this.h?this.h.next=g:this.g=g,this.h=g}}var W=new C(()=>new z,i=>i.reset());class z{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let H,Y=!1,_=new L,y=()=>{const i=Promise.resolve(void 0);H=()=>{i.then(x)}};function x(){for(var i;i=N();){try{i.h.call(i.g)}catch(d){R(d)}var c=W;c.j(i),c.h<100&&(c.h++,i.next=c.g,c.g=i)}Y=!1}function k(){this.u=this.u,this.C=this.C}k.prototype.u=!1,k.prototype.dispose=function(){this.u||(this.u=!0,this.N())},k.prototype[Symbol.dispose]=function(){this.dispose()},k.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var I=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const d=()=>{};a.addEventListener("test",d,c),a.removeEventListener("test",d,c)}catch{}return i})();function v(i){return/^[\s\xa0]*$/.test(i)}function ke(i,c){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,c)}m(ke,E),ke.prototype.init=function(i,c){const d=this.type=i.type,g=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget,c||(d=="mouseover"?c=i.fromElement:d=="mouseout"&&(c=i.toElement)),this.relatedTarget=c,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&ke.Z.h.call(this)},ke.prototype.h=function(){ke.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var yt="closure_listenable_"+(Math.random()*1e6|0),_u=0;function Eu(i,c,d,g,T){this.listener=i,this.proxy=null,this.src=c,this.type=d,this.capture=!!g,this.ha=T,this.key=++_u,this.da=this.fa=!1}function Jn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Xn(i,c,d){for(const g in i)c.call(d,i[g],g,i)}function ku(i,c){for(const d in i)c.call(void 0,i[d],d,i)}function no(i){const c={};for(const d in i)c[d]=i[d];return c}const so="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ro(i,c){let d,g;for(let T=1;T<arguments.length;T++){g=arguments[T];for(d in g)i[d]=g[d];for(let S=0;S<so.length;S++)d=so[S],Object.prototype.hasOwnProperty.call(g,d)&&(i[d]=g[d])}}function Zn(i){this.src=i,this.g={},this.h=0}Zn.prototype.add=function(i,c,d,g,T){const S=i.toString();i=this.g[S],i||(i=this.g[S]=[],this.h++);const D=ur(i,c,g,T);return D>-1?(c=i[D],d||(c.fa=!1)):(c=new Eu(c,this.src,S,!!g,T),c.fa=d,i.push(c)),c};function cr(i,c){const d=c.type;if(d in i.g){var g=i.g[d],T=Array.prototype.indexOf.call(g,c,void 0),S;(S=T>=0)&&Array.prototype.splice.call(g,T,1),S&&(Jn(c),i.g[d].length==0&&(delete i.g[d],i.h--))}}function ur(i,c,d,g){for(let T=0;T<i.length;++T){const S=i[T];if(!S.da&&S.listener==c&&S.capture==!!d&&S.ha==g)return T}return-1}var dr="closure_lm_"+(Math.random()*1e6|0),hr={};function io(i,c,d,g,T){if(Array.isArray(c)){for(let S=0;S<c.length;S++)io(i,c[S],d,g,T);return null}return d=lo(d),i&&i[yt]?i.J(c,d,l(g)?!!g.capture:!1,T):Tu(i,c,d,!1,g,T)}function Tu(i,c,d,g,T,S){if(!c)throw Error("Invalid event type");const D=l(T)?!!T.capture:!!T;let G=fr(i);if(G||(i[dr]=G=new Zn(i)),d=G.add(c,d,g,D,S),d.proxy)return d;if(g=Iu(),d.proxy=g,g.src=i,g.listener=d,i.addEventListener)I||(T=D),T===void 0&&(T=!1),i.addEventListener(c.toString(),g,T);else if(i.attachEvent)i.attachEvent(ao(c.toString()),g);else if(i.addListener&&i.removeListener)i.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Iu(){function i(d){return c.call(i.src,i.listener,d)}const c=Au;return i}function oo(i,c,d,g,T){if(Array.isArray(c))for(var S=0;S<c.length;S++)oo(i,c[S],d,g,T);else g=l(g)?!!g.capture:!!g,d=lo(d),i&&i[yt]?(i=i.i,S=String(c).toString(),S in i.g&&(c=i.g[S],d=ur(c,d,g,T),d>-1&&(Jn(c[d]),Array.prototype.splice.call(c,d,1),c.length==0&&(delete i.g[S],i.h--)))):i&&(i=fr(i))&&(c=i.g[c.toString()],i=-1,c&&(i=ur(c,d,g,T)),(d=i>-1?c[i]:null)&&pr(d))}function pr(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[yt])cr(c.i,i);else{var d=i.type,g=i.proxy;c.removeEventListener?c.removeEventListener(d,g,i.capture):c.detachEvent?c.detachEvent(ao(d),g):c.addListener&&c.removeListener&&c.removeListener(g),(d=fr(c))?(cr(d,i),d.h==0&&(d.src=null,c[dr]=null)):Jn(i)}}}function ao(i){return i in hr?hr[i]:hr[i]="on"+i}function Au(i,c){if(i.da)i=!0;else{c=new ke(c,this);const d=i.listener,g=i.ha||i.src;i.fa&&pr(i),i=d.call(g,c)}return i}function fr(i){return i=i[dr],i instanceof Zn?i:null}var mr="__closure_events_fn_"+(Math.random()*1e9>>>0);function lo(i){return typeof i=="function"?i:(i[mr]||(i[mr]=function(c){return i.handleEvent(c)}),i[mr])}function ve(){k.call(this),this.i=new Zn(this),this.M=this,this.G=null}m(ve,k),ve.prototype[yt]=!0,ve.prototype.removeEventListener=function(i,c,d,g){oo(this,i,c,d,g)};function _e(i,c){var d,g=i.G;if(g)for(d=[];g;g=g.G)d.push(g);if(i=i.M,g=c.type||c,typeof c=="string")c=new E(c,i);else if(c instanceof E)c.target=c.target||i;else{var T=c;c=new E(g,i),ro(c,T)}T=!0;let S,D;if(d)for(D=d.length-1;D>=0;D--)S=c.g=d[D],T=es(S,g,!0,c)&&T;if(S=c.g=i,T=es(S,g,!0,c)&&T,T=es(S,g,!1,c)&&T,d)for(D=0;D<d.length;D++)S=c.g=d[D],T=es(S,g,!1,c)&&T}ve.prototype.N=function(){if(ve.Z.N.call(this),this.i){var i=this.i;for(const c in i.g){const d=i.g[c];for(let g=0;g<d.length;g++)Jn(d[g]);delete i.g[c],i.h--}}this.G=null},ve.prototype.J=function(i,c,d,g){return this.i.add(String(i),c,!1,d,g)},ve.prototype.K=function(i,c,d,g){return this.i.add(String(i),c,!0,d,g)};function es(i,c,d,g){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();let T=!0;for(let S=0;S<c.length;++S){const D=c[S];if(D&&!D.da&&D.capture==d){const G=D.listener,he=D.ha||D.src;D.fa&&cr(i.i,D),T=G.call(he,g)!==!1&&T}}return T&&!g.defaultPrevented}function Su(i,c){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=h(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(i,c||0)}function co(i){i.g=Su(()=>{i.g=null,i.i&&(i.i=!1,co(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Cu extends k{constructor(c,d){super(),this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:co(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function an(i){k.call(this),this.h=i,this.g={}}m(an,k);var uo=[];function ho(i){Xn(i.g,function(c,d){this.g.hasOwnProperty(d)&&pr(c)},i),i.g={}}an.prototype.N=function(){an.Z.N.call(this),ho(this)},an.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var gr=a.JSON.stringify,Ru=a.JSON.parse,Pu=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function po(){}function fo(){}var ln={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function yr(){E.call(this,"d")}m(yr,E);function br(){E.call(this,"c")}m(br,E);var bt={},mo=null;function ts(){return mo=mo||new ve}bt.Ia="serverreachability";function go(i){E.call(this,bt.Ia,i)}m(go,E);function cn(i){const c=ts();_e(c,new go(c))}bt.STAT_EVENT="statevent";function yo(i,c){E.call(this,bt.STAT_EVENT,i),this.stat=c}m(yo,E);function Ee(i){const c=ts();_e(c,new yo(c,i))}bt.Ja="timingevent";function bo(i,c){E.call(this,bt.Ja,i),this.size=c}m(bo,E);function un(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},c)}function dn(){this.g=!0}dn.prototype.ua=function(){this.g=!1};function Vu(i,c,d,g,T,S){i.info(function(){if(i.g)if(S){var D="",G=S.split("&");for(let ee=0;ee<G.length;ee++){var he=G[ee].split("=");if(he.length>1){const fe=he[0];he=he[1];const Le=fe.split("_");D=Le.length>=2&&Le[1]=="type"?D+(fe+"="+he+"&"):D+(fe+"=redacted&")}}}else D=null;else D=S;return"XMLHTTP REQ ("+g+") [attempt "+T+"]: "+c+`
`+d+`
`+D})}function Du(i,c,d,g,T,S,D){i.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+T+"]: "+c+`
`+d+`
`+S+" "+D})}function Vt(i,c,d,g){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+Mu(i,d)+(g?" "+g:"")})}function $u(i,c){i.info(function(){return"TIMEOUT: "+c})}dn.prototype.info=function(){};function Mu(i,c){if(!i.g)return c;if(!c)return null;try{const S=JSON.parse(c);if(S){for(i=0;i<S.length;i++)if(Array.isArray(S[i])){var d=S[i];if(!(d.length<2)){var g=d[1];if(Array.isArray(g)&&!(g.length<1)){var T=g[0];if(T!="noop"&&T!="stop"&&T!="close")for(let D=1;D<g.length;D++)g[D]=""}}}}return gr(S)}catch{return c}}var ns={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},vo={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},xo;function vr(){}m(vr,po),vr.prototype.g=function(){return new XMLHttpRequest},xo=new vr;function hn(i){return encodeURIComponent(String(i))}function Nu(i){var c=1;i=i.split(":");const d=[];for(;c>0&&i.length;)d.push(i.shift()),c--;return i.length&&d.push(i.join(":")),d}function Ye(i,c,d,g){this.j=i,this.i=c,this.l=d,this.S=g||1,this.V=new an(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new wo}function wo(){this.i=null,this.g="",this.h=!1}var _o={},xr={};function wr(i,c,d){i.M=1,i.A=rs(Ne(c)),i.u=d,i.R=!0,Eo(i,null)}function Eo(i,c){i.F=Date.now(),ss(i),i.B=Ne(i.A);var d=i.B,g=i.S;Array.isArray(g)||(g=[String(g)]),No(d.i,"t",g),i.C=0,d=i.j.L,i.h=new wo,i.g=ea(i.j,d?c:null,!i.u),i.P>0&&(i.O=new Cu(h(i.Y,i,i.g),i.P)),c=i.V,d=i.g,g=i.ba;var T="readystatechange";Array.isArray(T)||(T&&(uo[0]=T.toString()),T=uo);for(let S=0;S<T.length;S++){const D=io(d,T[S],g||c.handleEvent,!1,c.h||c);if(!D)break;c.g[D.key]=D}c=i.J?no(i.J):{},i.u?(i.v||(i.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,c)):(i.v="GET",i.g.ea(i.B,i.v,null,c)),cn(),Vu(i.i,i.v,i.B,i.l,i.S,i.u)}Ye.prototype.ba=function(i){i=i.target;const c=this.O;c&&Ze(i)==3?c.j():this.Y(i)},Ye.prototype.Y=function(i){try{if(i==this.g)e:{const G=Ze(this.g),he=this.g.ya(),ee=this.g.ca();if(!(G<3)&&(G!=3||this.g&&(this.h.h||this.g.la()||zo(this.g)))){this.K||G!=4||he==7||(he==8||ee<=0?cn(3):cn(2)),_r(this);var c=this.g.ca();this.X=c;var d=Lu(this);if(this.o=c==200,Du(this.i,this.v,this.B,this.l,this.S,G,c),this.o){if(this.U&&!this.L){t:{if(this.g){var g,T=this.g;if((g=T.g?T.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!v(g)){var S=g;break t}}S=null}if(i=S)Vt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Er(this,i);else{this.o=!1,this.m=3,Ee(12),vt(this),pn(this);break e}}if(this.R){i=!0;let fe;for(;!this.K&&this.C<d.length;)if(fe=Ou(this,d),fe==xr){G==4&&(this.m=4,Ee(14),i=!1),Vt(this.i,this.l,null,"[Incomplete Response]");break}else if(fe==_o){this.m=4,Ee(15),Vt(this.i,this.l,d,"[Invalid Chunk]"),i=!1;break}else Vt(this.i,this.l,fe,null),Er(this,fe);if(ko(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),G!=4||d.length!=0||this.h.h||(this.m=1,Ee(16),i=!1),this.o=this.o&&i,!i)Vt(this.i,this.l,d,"[Invalid Chunked Response]"),vt(this),pn(this);else if(d.length>0&&!this.W){this.W=!0;var D=this.j;D.g==this&&D.aa&&!D.P&&(D.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Pr(D),D.P=!0,Ee(11))}}else Vt(this.i,this.l,d,null),Er(this,d);G==4&&vt(this),this.o&&!this.K&&(G==4?Yo(this.j,this):(this.o=!1,ss(this)))}else Xu(this.g),c==400&&d.indexOf("Unknown SID")>0?(this.m=3,Ee(12)):(this.m=0,Ee(13)),vt(this),pn(this)}}}catch{}finally{}};function Lu(i){if(!ko(i))return i.g.la();const c=zo(i.g);if(c==="")return"";let d="";const g=c.length,T=Ze(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return vt(i),pn(i),"";i.h.i=new a.TextDecoder}for(let S=0;S<g;S++)i.h.h=!0,d+=i.h.i.decode(c[S],{stream:!(T&&S==g-1)});return c.length=0,i.h.g+=d,i.C=0,i.h.g}function ko(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Ou(i,c){var d=i.C,g=c.indexOf(`
`,d);return g==-1?xr:(d=Number(c.substring(d,g)),isNaN(d)?_o:(g+=1,g+d>c.length?xr:(c=c.slice(g,g+d),i.C=g+d,c)))}Ye.prototype.cancel=function(){this.K=!0,vt(this)};function ss(i){i.T=Date.now()+i.H,To(i,i.H)}function To(i,c){if(i.D!=null)throw Error("WatchDog timer not null");i.D=un(h(i.aa,i),c)}function _r(i){i.D&&(a.clearTimeout(i.D),i.D=null)}Ye.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?($u(this.i,this.B),this.M!=2&&(cn(),Ee(17)),vt(this),this.m=2,pn(this)):To(this,this.T-i)};function pn(i){i.j.I==0||i.K||Yo(i.j,i)}function vt(i){_r(i);var c=i.O;c&&typeof c.dispose=="function"&&c.dispose(),i.O=null,ho(i.V),i.g&&(c=i.g,i.g=null,c.abort(),c.dispose())}function Er(i,c){try{var d=i.j;if(d.I!=0&&(d.g==i||kr(d.h,i))){if(!i.L&&kr(d.h,i)&&d.I==3){try{var g=d.Ba.g.parse(c)}catch{g=null}if(Array.isArray(g)&&g.length==3){var T=g;if(T[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<i.F)cs(d),as(d);else break e;Rr(d),Ee(18)}}else d.xa=T[1],0<d.xa-d.K&&T[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=un(h(d.Va,d),6e3));So(d.h)<=1&&d.ta&&(d.ta=void 0)}else wt(d,11)}else if((i.L||d.g==i)&&cs(d),!v(c))for(T=d.Ba.g.parse(c),c=0;c<T.length;c++){let ee=T[c];const fe=ee[0];if(!(fe<=d.K))if(d.K=fe,ee=ee[1],d.I==2)if(ee[0]=="c"){d.M=ee[1],d.ba=ee[2];const Le=ee[3];Le!=null&&(d.ka=Le,d.j.info("VER="+d.ka));const _t=ee[4];_t!=null&&(d.za=_t,d.j.info("SVER="+d.za));const et=ee[5];et!=null&&typeof et=="number"&&et>0&&(g=1.5*et,d.O=g,d.j.info("backChannelRequestTimeoutMs_="+g)),g=d;const tt=i.g;if(tt){const ds=tt.g?tt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ds){var S=g.h;S.g||ds.indexOf("spdy")==-1&&ds.indexOf("quic")==-1&&ds.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Tr(S,S.h),S.h=null))}if(g.G){const Vr=tt.g?tt.g.getResponseHeader("X-HTTP-Session-Id"):null;Vr&&(g.wa=Vr,ne(g.J,g.G,Vr))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-i.F,d.j.info("Handshake RTT: "+d.T+"ms")),g=d;var D=i;if(g.na=Zo(g,g.L?g.ba:null,g.W),D.L){Co(g.h,D);var G=D,he=g.O;he&&(G.H=he),G.D&&(_r(G),ss(G)),g.g=D}else Ko(g);d.i.length>0&&ls(d)}else ee[0]!="stop"&&ee[0]!="close"||wt(d,7);else d.I==3&&(ee[0]=="stop"||ee[0]=="close"?ee[0]=="stop"?wt(d,7):Cr(d):ee[0]!="noop"&&d.l&&d.l.qa(ee),d.A=0)}}cn(4)}catch{}}var Fu=class{constructor(i,c){this.g=i,this.map=c}};function Io(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Ao(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function So(i){return i.h?1:i.g?i.g.size:0}function kr(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function Tr(i,c){i.g?i.g.add(c):i.h=c}function Co(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Io.prototype.cancel=function(){if(this.i=Ro(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Ro(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const d of i.g.values())c=c.concat(d.G);return c}return w(i.i)}var Po=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Bu(i,c){if(i){i=i.split("&");for(let d=0;d<i.length;d++){const g=i[d].indexOf("=");let T,S=null;g>=0?(T=i[d].substring(0,g),S=i[d].substring(g+1)):T=i[d],c(T,S?decodeURIComponent(S.replace(/\+/g," ")):"")}}}function Je(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;i instanceof Je?(this.l=i.l,fn(this,i.j),this.o=i.o,this.g=i.g,mn(this,i.u),this.h=i.h,Ir(this,Lo(i.i)),this.m=i.m):i&&(c=String(i).match(Po))?(this.l=!1,fn(this,c[1]||"",!0),this.o=gn(c[2]||""),this.g=gn(c[3]||"",!0),mn(this,c[4]),this.h=gn(c[5]||"",!0),Ir(this,c[6]||"",!0),this.m=gn(c[7]||"")):(this.l=!1,this.i=new bn(null,this.l))}Je.prototype.toString=function(){const i=[];var c=this.j;c&&i.push(yn(c,Vo,!0),":");var d=this.g;return(d||c=="file")&&(i.push("//"),(c=this.o)&&i.push(yn(c,Vo,!0),"@"),i.push(hn(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&i.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&i.push("/"),i.push(yn(d,d.charAt(0)=="/"?zu:Uu,!0))),(d=this.i.toString())&&i.push("?",d),(d=this.m)&&i.push("#",yn(d,Hu)),i.join("")},Je.prototype.resolve=function(i){const c=Ne(this);let d=!!i.j;d?fn(c,i.j):d=!!i.o,d?c.o=i.o:d=!!i.g,d?c.g=i.g:d=i.u!=null;var g=i.h;if(d)mn(c,i.u);else if(d=!!i.h){if(g.charAt(0)!="/")if(this.g&&!this.h)g="/"+g;else{var T=c.h.lastIndexOf("/");T!=-1&&(g=c.h.slice(0,T+1)+g)}if(T=g,T==".."||T==".")g="";else if(T.indexOf("./")!=-1||T.indexOf("/.")!=-1){g=T.lastIndexOf("/",0)==0,T=T.split("/");const S=[];for(let D=0;D<T.length;){const G=T[D++];G=="."?g&&D==T.length&&S.push(""):G==".."?((S.length>1||S.length==1&&S[0]!="")&&S.pop(),g&&D==T.length&&S.push("")):(S.push(G),g=!0)}g=S.join("/")}else g=T}return d?c.h=g:d=i.i.toString()!=="",d?Ir(c,Lo(i.i)):d=!!i.m,d&&(c.m=i.m),c};function Ne(i){return new Je(i)}function fn(i,c,d){i.j=d?gn(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function mn(i,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);i.u=c}else i.u=null}function Ir(i,c,d){c instanceof bn?(i.i=c,Gu(i.i,i.l)):(d||(c=yn(c,qu)),i.i=new bn(c,i.l))}function ne(i,c,d){i.i.set(c,d)}function rs(i){return ne(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function gn(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function yn(i,c,d){return typeof i=="string"?(i=encodeURI(i).replace(c,ju),d&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function ju(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Vo=/[#\/\?@]/g,Uu=/[#\?:]/g,zu=/[#\?]/g,qu=/[#\?@]/g,Hu=/#/g;function bn(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function xt(i){i.g||(i.g=new Map,i.h=0,i.i&&Bu(i.i,function(c,d){i.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}n=bn.prototype,n.add=function(i,c){xt(this),this.i=null,i=Dt(this,i);let d=this.g.get(i);return d||this.g.set(i,d=[]),d.push(c),this.h+=1,this};function Do(i,c){xt(i),c=Dt(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function $o(i,c){return xt(i),c=Dt(i,c),i.g.has(c)}n.forEach=function(i,c){xt(this),this.g.forEach(function(d,g){d.forEach(function(T){i.call(c,T,g,this)},this)},this)};function Mo(i,c){xt(i);let d=[];if(typeof c=="string")$o(i,c)&&(d=d.concat(i.g.get(Dt(i,c))));else for(i=Array.from(i.g.values()),c=0;c<i.length;c++)d=d.concat(i[c]);return d}n.set=function(i,c){return xt(this),this.i=null,i=Dt(this,i),$o(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=Mo(this,i),i.length>0?String(i[0]):c):c};function No(i,c,d){Do(i,c),d.length>0&&(i.i=null,i.g.set(Dt(i,c),w(d)),i.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(let g=0;g<c.length;g++){var d=c[g];const T=hn(d);d=Mo(this,d);for(let S=0;S<d.length;S++){let D=T;d[S]!==""&&(D+="="+hn(d[S])),i.push(D)}}return this.i=i.join("&")};function Lo(i){const c=new bn;return c.i=i.i,i.g&&(c.g=new Map(i.g),c.h=i.h),c}function Dt(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function Gu(i,c){c&&!i.j&&(xt(i),i.i=null,i.g.forEach(function(d,g){const T=g.toLowerCase();g!=T&&(Do(this,g),No(this,T,d))},i)),i.j=c}function Wu(i,c){const d=new dn;if(a.Image){const g=new Image;g.onload=p(Xe,d,"TestLoadImage: loaded",!0,c,g),g.onerror=p(Xe,d,"TestLoadImage: error",!1,c,g),g.onabort=p(Xe,d,"TestLoadImage: abort",!1,c,g),g.ontimeout=p(Xe,d,"TestLoadImage: timeout",!1,c,g),a.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=i}else c(!1)}function Ku(i,c){const d=new dn,g=new AbortController,T=setTimeout(()=>{g.abort(),Xe(d,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:g.signal}).then(S=>{clearTimeout(T),S.ok?Xe(d,"TestPingServer: ok",!0,c):Xe(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(T),Xe(d,"TestPingServer: error",!1,c)})}function Xe(i,c,d,g,T){try{T&&(T.onload=null,T.onerror=null,T.onabort=null,T.ontimeout=null),g(d)}catch{}}function Qu(){this.g=new Pu}function Ar(i){this.i=i.Sb||null,this.h=i.ab||!1}m(Ar,po),Ar.prototype.g=function(){return new is(this.i,this.h)};function is(i,c){ve.call(this),this.H=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(is,ve),n=is.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=c,this.readyState=1,xn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(c.body=i),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,vn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,xn(this)),this.g&&(this.readyState=3,xn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Oo(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Oo(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?vn(this):xn(this),this.readyState==3&&Oo(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,vn(this))},n.Na=function(i){this.g&&(this.response=i,vn(this))},n.ga=function(){this.g&&vn(this)};function vn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,xn(i)}n.setRequestHeader=function(i,c){this.A.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,i.push(d[0]+": "+d[1]),d=c.next();return i.join(`\r
`)};function xn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(is.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Fo(i){let c="";return Xn(i,function(d,g){c+=g,c+=":",c+=d,c+=`\r
`}),c}function Sr(i,c,d){e:{for(g in d){var g=!1;break e}g=!0}g||(d=Fo(d),typeof i=="string"?d!=null&&hn(d):ne(i,c,d))}function ie(i){ve.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(ie,ve);var Yu=/^https?$/i,Ju=["POST","PUT"];n=ie.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,c,d,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():xo.g(),this.g.onreadystatechange=b(h(this.Ca,this));try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(S){Bo(this,S);return}if(i=d||"",d=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var T in g)d.set(T,g[T]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const S of g.keys())d.set(S,g.get(S));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),T=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(Ju,c,void 0)>=0)||g||T||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,D]of d)this.g.setRequestHeader(S,D);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(S){Bo(this,S)}};function Bo(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.o=5,jo(i),os(i)}function jo(i){i.A||(i.A=!0,_e(i,"complete"),_e(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,_e(this,"complete"),_e(this,"abort"),os(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),os(this,!0)),ie.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Uo(this):this.Xa())},n.Xa=function(){Uo(this)};function Uo(i){if(i.h&&typeof o<"u"){if(i.v&&Ze(i)==4)setTimeout(i.Ca.bind(i),0);else if(_e(i,"readystatechange"),Ze(i)==4){i.h=!1;try{const S=i.ca();e:switch(S){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var g;if(g=S===0){let D=String(i.D).match(Po)[1]||null;!D&&a.self&&a.self.location&&(D=a.self.location.protocol.slice(0,-1)),g=!Yu.test(D?D.toLowerCase():"")}d=g}if(d)_e(i,"complete"),_e(i,"success");else{i.o=6;try{var T=Ze(i)>2?i.g.statusText:""}catch{T=""}i.l=T+" ["+i.ca()+"]",jo(i)}}finally{os(i)}}}}function os(i,c){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const d=i.g;i.g=null,c||_e(i,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Ze(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Ze(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),Ru(c)}};function zo(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Xu(i){const c={};i=(i.g&&Ze(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<i.length;g++){if(v(i[g]))continue;var d=Nu(i[g]);const T=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=c[T]||[];c[T]=S,S.push(d)}ku(c,function(g){return g.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function wn(i,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[i]||c}function qo(i){this.za=0,this.i=[],this.j=new dn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=wn("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=wn("baseRetryDelayMs",5e3,i),this.Za=wn("retryDelaySeedMs",1e4,i),this.Ta=wn("forwardChannelMaxRetries",2,i),this.va=wn("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Io(i&&i.concurrentRequestLimit),this.Ba=new Qu,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=qo.prototype,n.ka=8,n.I=1,n.connect=function(i,c,d,g){Ee(0),this.W=i,this.H=c||{},d&&g!==void 0&&(this.H.OSID=d,this.H.OAID=g),this.F=this.X,this.J=Zo(this,null,this.W),ls(this)};function Cr(i){if(Ho(i),i.I==3){var c=i.V++,d=Ne(i.J);if(ne(d,"SID",i.M),ne(d,"RID",c),ne(d,"TYPE","terminate"),_n(i,d),c=new Ye(i,i.j,c),c.M=2,c.A=rs(Ne(d)),d=!1,a.navigator&&a.navigator.sendBeacon)try{d=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!d&&a.Image&&(new Image().src=c.A,d=!0),d||(c.g=ea(c.j,null),c.g.ea(c.A)),c.F=Date.now(),ss(c)}Xo(i)}function as(i){i.g&&(Pr(i),i.g.cancel(),i.g=null)}function Ho(i){as(i),i.v&&(a.clearTimeout(i.v),i.v=null),cs(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function ls(i){if(!Ao(i.h)&&!i.m){i.m=!0;var c=i.Ea;H||y(),Y||(H(),Y=!0),_.add(c,i),i.D=0}}function Zu(i,c){return So(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=c.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=un(h(i.Ea,i,c),Jo(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const T=new Ye(this,this.j,i);let S=this.o;if(this.U&&(S?(S=no(S),ro(S,this.U)):S=this.U),this.u!==null||this.R||(T.J=S,S=null),this.S)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var g=this.i[d];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(c+=g,c>4096){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Wo(this,T,c),d=Ne(this.J),ne(d,"RID",i),ne(d,"CVER",22),this.G&&ne(d,"X-HTTP-Session-Id",this.G),_n(this,d),S&&(this.R?c="headers="+hn(Fo(S))+"&"+c:this.u&&Sr(d,this.u,S)),Tr(this.h,T),this.Ra&&ne(d,"TYPE","init"),this.S?(ne(d,"$req",c),ne(d,"SID","null"),T.U=!0,wr(T,d,null)):wr(T,d,c),this.I=2}}else this.I==3&&(i?Go(this,i):this.i.length==0||Ao(this.h)||Go(this))};function Go(i,c){var d;c?d=c.l:d=i.V++;const g=Ne(i.J);ne(g,"SID",i.M),ne(g,"RID",d),ne(g,"AID",i.K),_n(i,g),i.u&&i.o&&Sr(g,i.u,i.o),d=new Ye(i,i.j,d,i.D+1),i.u===null&&(d.J=i.o),c&&(i.i=c.G.concat(i.i)),c=Wo(i,d,1e3),d.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),Tr(i.h,d),wr(d,g,c)}function _n(i,c){i.H&&Xn(i.H,function(d,g){ne(c,g,d)}),i.l&&Xn({},function(d,g){ne(c,g,d)})}function Wo(i,c,d){d=Math.min(i.i.length,d);const g=i.l?h(i.l.Ka,i.l,i):null;e:{var T=i.i;let G=-1;for(;;){const he=["count="+d];G==-1?d>0?(G=T[0].g,he.push("ofs="+G)):G=0:he.push("ofs="+G);let ee=!0;for(let fe=0;fe<d;fe++){var S=T[fe].g;const Le=T[fe].map;if(S-=G,S<0)G=Math.max(0,T[fe].g-100),ee=!1;else try{S="req"+S+"_"||"";try{var D=Le instanceof Map?Le:Object.entries(Le);for(const[_t,et]of D){let tt=et;l(et)&&(tt=gr(et)),he.push(S+_t+"="+encodeURIComponent(tt))}}catch(_t){throw he.push(S+"type="+encodeURIComponent("_badmap")),_t}}catch{g&&g(Le)}}if(ee){D=he.join("&");break e}}D=void 0}return i=i.i.splice(0,d),c.G=i,D}function Ko(i){if(!i.g&&!i.v){i.Y=1;var c=i.Da;H||y(),Y||(H(),Y=!0),_.add(c,i),i.A=0}}function Rr(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=un(h(i.Da,i),Jo(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,Qo(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=un(h(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Ee(10),as(this),Qo(this))};function Pr(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function Qo(i){i.g=new Ye(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var c=Ne(i.na);ne(c,"RID","rpc"),ne(c,"SID",i.M),ne(c,"AID",i.K),ne(c,"CI",i.F?"0":"1"),!i.F&&i.ia&&ne(c,"TO",i.ia),ne(c,"TYPE","xmlhttp"),_n(i,c),i.u&&i.o&&Sr(c,i.u,i.o),i.O&&(i.g.H=i.O);var d=i.g;i=i.ba,d.M=1,d.A=rs(Ne(c)),d.u=null,d.R=!0,Eo(d,i)}n.Va=function(){this.C!=null&&(this.C=null,as(this),Rr(this),Ee(19))};function cs(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function Yo(i,c){var d=null;if(i.g==c){cs(i),Pr(i),i.g=null;var g=2}else if(kr(i.h,c))d=c.G,Co(i.h,c),g=1;else return;if(i.I!=0){if(c.o)if(g==1){d=c.u?c.u.length:0,c=Date.now()-c.F;var T=i.D;g=ts(),_e(g,new bo(g,d)),ls(i)}else Ko(i);else if(T=c.m,T==3||T==0&&c.X>0||!(g==1&&Zu(i,c)||g==2&&Rr(i)))switch(d&&d.length>0&&(c=i.h,c.i=c.i.concat(d)),T){case 1:wt(i,5);break;case 4:wt(i,10);break;case 3:wt(i,6);break;default:wt(i,2)}}}function Jo(i,c){let d=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(d*=2),d*c}function wt(i,c){if(i.j.info("Error code "+c),c==2){var d=h(i.bb,i),g=i.Ua;const T=!g;g=new Je(g||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||fn(g,"https"),rs(g),T?Wu(g.toString(),d):Ku(g.toString(),d)}else Ee(2);i.I=0,i.l&&i.l.pa(c),Xo(i),Ho(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))};function Xo(i){if(i.I=0,i.ja=[],i.l){const c=Ro(i.h);(c.length!=0||i.i.length!=0)&&(A(i.ja,c),A(i.ja,i.i),i.h.i.length=0,w(i.i),i.i.length=0),i.l.oa()}}function Zo(i,c,d){var g=d instanceof Je?Ne(d):new Je(d);if(g.g!="")c&&(g.g=c+"."+g.g),mn(g,g.u);else{var T=a.location;g=T.protocol,c=c?c+"."+T.hostname:T.hostname,T=+T.port;const S=new Je(null);g&&fn(S,g),c&&(S.g=c),T&&mn(S,T),d&&(S.h=d),g=S}return d=i.G,c=i.wa,d&&c&&ne(g,d,c),ne(g,"VER",i.ka),_n(i,g),g}function ea(i,c,d){if(c&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Aa&&!i.ma?new ie(new Ar({ab:d})):new ie(i.ma),c.Fa(i.L),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ta(){}n=ta.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function us(){}us.prototype.g=function(i,c){return new Se(i,c)};function Se(i,c){ve.call(this),this.g=new qo(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(i?i["X-WebChannel-Client-Profile"]=c.sa:i={"X-WebChannel-Client-Profile":c.sa}),this.g.U=i,(i=c&&c.Qb)&&!v(i)&&(this.g.u=i),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!v(c)&&(this.g.G=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new $t(this)}m(Se,ve),Se.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Se.prototype.close=function(){Cr(this.g)},Se.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var d={};d.__data__=i,i=d}else this.v&&(d={},d.__data__=gr(i),i=d);c.i.push(new Fu(c.Ya++,i)),c.I==3&&ls(c)},Se.prototype.N=function(){this.g.l=null,delete this.j,Cr(this.g),delete this.g,Se.Z.N.call(this)};function na(i){yr.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const d in c){i=d;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}m(na,yr);function sa(){br.call(this),this.status=1}m(sa,br);function $t(i){this.g=i}m($t,ta),$t.prototype.ra=function(){_e(this.g,"a")},$t.prototype.qa=function(i){_e(this.g,new na(i))},$t.prototype.pa=function(i){_e(this.g,new sa)},$t.prototype.oa=function(){_e(this.g,"b")},us.prototype.createWebChannel=us.prototype.g,Se.prototype.send=Se.prototype.o,Se.prototype.open=Se.prototype.m,Se.prototype.close=Se.prototype.close,Ll=function(){return new us},Nl=function(){return ts()},Ml=bt,Xr={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ns.NO_ERROR=0,ns.TIMEOUT=8,ns.HTTP_ERROR=6,xs=ns,vo.COMPLETE="complete",$l=vo,fo.EventType=ln,ln.OPEN="a",ln.CLOSE="b",ln.ERROR="c",ln.MESSAGE="d",ve.prototype.listen=ve.prototype.J,kn=fo,ie.prototype.listenOnce=ie.prototype.K,ie.prototype.getLastError=ie.prototype.Ha,ie.prototype.getLastErrorCode=ie.prototype.ya,ie.prototype.getStatus=ie.prototype.ca,ie.prototype.getResponseJson=ie.prototype.La,ie.prototype.getResponseText=ie.prototype.la,ie.prototype.send=ie.prototype.ea,ie.prototype.setWithCredentials=ie.prototype.Fa,Dl=ie}).apply(typeof hs<"u"?hs:typeof self<"u"?self:typeof window<"u"?window:{});/**
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
 */class Te{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Te.UNAUTHENTICATED=new Te(null),Te.GOOGLE_CREDENTIALS=new Te("google-credentials-uid"),Te.FIRST_PARTY=new Te("first-party-uid"),Te.MOCK_USER=new Te("mock-user");/**
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
 */let tn="12.12.0";function Mh(n){tn=n}/**
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
 */const At=new Al("@firebase/firestore");function Lt(){return At.logLevel}function M(n,...e){if(At.logLevel<=X.DEBUG){const t=e.map(bi);At.debug(`Firestore (${tn}): ${n}`,...t)}}function Ke(n,...e){if(At.logLevel<=X.ERROR){const t=e.map(bi);At.error(`Firestore (${tn}): ${n}`,...t)}}function Ht(n,...e){if(At.logLevel<=X.WARN){const t=e.map(bi);At.warn(`Firestore (${tn}): ${n}`,...t)}}function bi(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
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
 */function j(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Ol(n,s,t)}function Ol(n,e,t){let s=`FIRESTORE (${tn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Ke(s),new Error(s)}function Z(n,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,n||Ol(e,r,s)}function q(n,e){return n}/**
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
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class $ extends en{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class He{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Nh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Lh{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Te.UNAUTHENTICATED)))}shutdown(){}}class Oh{constructor(e){this.t=e,this.currentUser=Te.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Z(this.o===void 0,42304);let s=this.i;const r=u=>this.i!==s?(s=this.i,t(u)):Promise.resolve();let o=new He;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new He,e.enqueueRetryable((()=>r(this.currentUser)))};const a=()=>{const u=o;e.enqueueRetryable((async()=>{await u.promise,await r(this.currentUser)}))},l=u=>{M("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((u=>l(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(M("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new He)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(M("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Z(typeof s.accessToken=="string",31837,{l:s}),new Nh(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Z(e===null||typeof e=="string",2055,{h:e}),new Te(e)}}class Fh{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Te.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class Bh{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new Fh(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Te.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ma{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class jh{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,bh(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Z(this.o===void 0,3512);const s=o=>{o.error!=null&&M("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,M("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>s(o)))};const r=o=>{M("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>r(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?r(o):M("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ma(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Z(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ma(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Uh(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
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
 */class vi{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=Uh(40);for(let o=0;o<r.length;++o)s.length<20&&r[o]<t&&(s+=e.charAt(r[o]%62))}return s}}function K(n,e){return n<e?-1:n>e?1:0}function Zr(n,e){const t=Math.min(n.length,e.length);for(let s=0;s<t;s++){const r=n.charAt(s),o=e.charAt(s);if(r!==o)return Lr(r)===Lr(o)?K(r,o):Lr(r)?1:-1}return K(n.length,e.length)}const zh=55296,qh=57343;function Lr(n){const e=n.charCodeAt(0);return e>=zh&&e<=qh}function Gt(n,e,t){return n.length===e.length&&n.every(((s,r)=>t(s,e[r])))}/**
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
 */const ga="__name__";class Oe{constructor(e,t,s){t===void 0?t=0:t>e.length&&j(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&j(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return Oe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Oe?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const o=Oe.compareSegments(e.get(r),t.get(r));if(o!==0)return o}return K(e.length,t.length)}static compareSegments(e,t){const s=Oe.isNumericId(e),r=Oe.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?Oe.extractNumericId(e).compare(Oe.extractNumericId(t)):Zr(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return at.fromString(e.substring(4,e.length-2))}}class te extends Oe{construct(e,t,s){return new te(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new $(P.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((r=>r.length>0)))}return new te(t)}static emptyPath(){return new te([])}}const Hh=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ye extends Oe{construct(e,t,s){return new ye(e,t,s)}static isValidIdentifier(e){return Hh.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ye.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===ga}static keyField(){return new ye([ga])}static fromServerFormat(e){const t=[];let s="",r=0;const o=()=>{if(s.length===0)throw new $(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let a=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new $(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[r+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new $(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=u,r+=2}else l==="`"?(a=!a,r++):l!=="."||a?(s+=l,r++):(o(),r++)}if(o(),a)throw new $(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ye(t)}static emptyPath(){return new ye([])}}/**
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
 */class F{constructor(e){this.path=e}static fromPath(e){return new F(te.fromString(e))}static fromName(e){return new F(te.fromString(e).popFirst(5))}static empty(){return new F(te.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&te.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return te.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new F(new te(e.slice()))}}/**
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
 */function Fl(n,e,t){if(!t)throw new $(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Gh(n,e,t,s){if(e===!0&&s===!0)throw new $(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function ya(n){if(!F.isDocumentKey(n))throw new $(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function ba(n){if(F.isDocumentKey(n))throw new $(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Bl(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Hs(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":j(12329,{type:typeof n})}function Ue(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new $(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Hs(n);throw new $(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
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
 */function ue(n,e){const t={typeString:n};return e&&(t.value=e),t}function qn(n,e){if(!Bl(n))throw new $(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,o="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const a=n[s];if(r&&typeof a!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${s}' field to equal '${o.value}'`;break}}if(t)throw new $(P.INVALID_ARGUMENT,t);return!0}/**
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
 */const va=-62135596800,xa=1e6;class se{static now(){return se.fromMillis(Date.now())}static fromDate(e){return se.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*xa);return new se(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new $(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new $(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<va)throw new $(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new $(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/xa}_compareTo(e){return this.seconds===e.seconds?K(this.nanoseconds,e.nanoseconds):K(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:se._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(qn(e,se._jsonSchema))return new se(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-va;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}se._jsonSchemaVersion="firestore/timestamp/1.0",se._jsonSchema={type:ue("string",se._jsonSchemaVersion),seconds:ue("number"),nanoseconds:ue("number")};/**
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
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new se(0,0))}static max(){return new U(new se(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const Nn=-1;function Wh(n,e){const t=n.toTimestamp().seconds,s=n.toTimestamp().nanoseconds+1,r=U.fromTimestamp(s===1e9?new se(t+1,0):new se(t,s));return new ct(r,F.empty(),e)}function Kh(n){return new ct(n.readTime,n.key,Nn)}class ct{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new ct(U.min(),F.empty(),Nn)}static max(){return new ct(U.max(),F.empty(),Nn)}}function Qh(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=F.comparator(n.documentKey,e.documentKey),t!==0?t:K(n.largestBatchId,e.largestBatchId))}/**
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
 */const Yh="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Jh{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function nn(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==Yh)throw n;M("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class V{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&j(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new V(((s,r)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(s,r)},this.catchCallback=o=>{this.wrapFailure(t,o).next(s,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof V?t:V.resolve(t)}catch(t){return V.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):V.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):V.reject(t)}static resolve(e){return new V(((t,s)=>{t(e)}))}static reject(e){return new V(((t,s)=>{s(e)}))}static waitFor(e){return new V(((t,s)=>{let r=0,o=0,a=!1;e.forEach((l=>{++r,l.next((()=>{++o,a&&o===r&&t()}),(u=>s(u)))})),a=!0,o===r&&t()}))}static or(e){let t=V.resolve(!1);for(const s of e)t=t.next((r=>r?V.resolve(r):s()));return t}static forEach(e,t){const s=[];return e.forEach(((r,o)=>{s.push(t.call(this,r,o))})),this.waitFor(s)}static mapArray(e,t){return new V(((s,r)=>{const o=e.length,a=new Array(o);let l=0;for(let u=0;u<o;u++){const h=u;t(e[h]).next((p=>{a[h]=p,++l,l===o&&s(a)}),(p=>r(p)))}}))}static doWhile(e,t){return new V(((s,r)=>{const o=()=>{e()===!0?t().next((()=>{o()}),r):s()};o()}))}}function Xh(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function sn(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Gs{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this.ae(s),this.ue=s=>t.writeSequenceNumber(s))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Gs.ce=-1;/**
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
 */const xi=-1;function Ws(n){return n==null}function Cs(n){return n===0&&1/n==-1/0}function Zh(n){return typeof n=="number"&&Number.isInteger(n)&&!Cs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const jl="";function ep(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=wa(e)),e=tp(n.get(t),e);return wa(e)}function tp(n,e){let t=e;const s=n.length;for(let r=0;r<s;r++){const o=n.charAt(r);switch(o){case"\0":t+="";break;case jl:t+="";break;default:t+=o}}return t}function wa(n){return n+jl+""}/**
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
 */function _a(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function mt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Ul(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class re{constructor(e,t){this.comparator=e,this.root=t||ge.EMPTY}insert(e,t){return new re(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ge.BLACK,null,null))}remove(e){return new re(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ge.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const r=this.comparator(e,s.key);if(r===0)return t+s.left.size;r<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ps(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ps(this.root,e,this.comparator,!1)}getReverseIterator(){return new ps(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ps(this.root,e,this.comparator,!0)}}class ps{constructor(e,t,s,r){this.isReverse=r,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?s(e.key,t):1,t&&r&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ge{constructor(e,t,s,r,o){this.key=e,this.value=t,this.color=s??ge.RED,this.left=r??ge.EMPTY,this.right=o??ge.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,r,o){return new ge(e??this.key,t??this.value,s??this.color,r??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let r=this;const o=s(e,r.key);return r=o<0?r.copy(null,null,null,r.left.insert(e,t,s),null):o===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,s)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ge.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return ge.EMPTY;s=r.right.min(),r=r.copy(s.key,s.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ge.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ge.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw j(43730,{key:this.key,value:this.value});if(this.right.isRed())throw j(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw j(27949);return e+(this.isRed()?0:1)}}ge.EMPTY=null,ge.RED=!0,ge.BLACK=!1;ge.EMPTY=new class{constructor(){this.size=0}get key(){throw j(57766)}get value(){throw j(16141)}get color(){throw j(16727)}get left(){throw j(29726)}get right(){throw j(36894)}copy(e,t,s,r,o){return this}insert(e,t,s){return new ge(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class pe{constructor(e){this.comparator=e,this.data=new re(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const r=s.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ea(this.data.getIterator())}getIteratorFrom(e){return new Ea(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof pe)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(this.comparator(r,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new pe(this.comparator);return t.data=e,t}}class Ea{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Ce{constructor(e){this.fields=e,e.sort(ye.comparator)}static empty(){return new Ce([])}unionWith(e){let t=new pe(ye.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Ce(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Gt(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
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
 */class zl extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class be{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new zl("Invalid base64 string: "+o):o}})(e);return new be(t)}static fromUint8Array(e){const t=(function(r){let o="";for(let a=0;a<r.length;++a)o+=String.fromCharCode(r[a]);return o})(e);return new be(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return K(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}be.EMPTY_BYTE_STRING=new be("");const np=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ut(n){if(Z(!!n,39018),typeof n=="string"){let e=0;const t=np.exec(n);if(Z(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const s=new Date(n);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:oe(n.seconds),nanos:oe(n.nanos)}}function oe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function dt(n){return typeof n=="string"?be.fromBase64String(n):be.fromUint8Array(n)}/**
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
 */const ql="server_timestamp",Hl="__type__",Gl="__previous_value__",Wl="__local_write_time__";function wi(n){var t,s;return((s=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Hl])==null?void 0:s.stringValue)===ql}function Ks(n){const e=n.mapValue.fields[Gl];return wi(e)?Ks(e):e}function Ln(n){const e=ut(n.mapValue.fields[Wl].timestampValue);return new se(e.seconds,e.nanos)}/**
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
 */class sp{constructor(e,t,s,r,o,a,l,u,h,p,m){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=r,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=p,this.apiKey=m}}const Rs="(default)";class On{constructor(e,t){this.projectId=e,this.database=t||Rs}static empty(){return new On("","")}get isDefaultDatabase(){return this.database===Rs}isEqual(e){return e instanceof On&&e.projectId===this.projectId&&e.database===this.database}}function rp(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new $(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new On(n.options.projectId,e)}/**
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
 */const Kl="__type__",ip="__max__",fs={mapValue:{}},Ql="__vector__",Ps="value";function ht(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?wi(n)?4:ap(n)?9007199254740991:op(n)?10:11:j(28295,{value:n})}function ze(n,e){if(n===e)return!0;const t=ht(n);if(t!==ht(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Ln(n).isEqual(Ln(e));case 3:return(function(r,o){if(typeof r.timestampValue=="string"&&typeof o.timestampValue=="string"&&r.timestampValue.length===o.timestampValue.length)return r.timestampValue===o.timestampValue;const a=ut(r.timestampValue),l=ut(o.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,o){return dt(r.bytesValue).isEqual(dt(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,o){return oe(r.geoPointValue.latitude)===oe(o.geoPointValue.latitude)&&oe(r.geoPointValue.longitude)===oe(o.geoPointValue.longitude)})(n,e);case 2:return(function(r,o){if("integerValue"in r&&"integerValue"in o)return oe(r.integerValue)===oe(o.integerValue);if("doubleValue"in r&&"doubleValue"in o){const a=oe(r.doubleValue),l=oe(o.doubleValue);return a===l?Cs(a)===Cs(l):isNaN(a)&&isNaN(l)}return!1})(n,e);case 9:return Gt(n.arrayValue.values||[],e.arrayValue.values||[],ze);case 10:case 11:return(function(r,o){const a=r.mapValue.fields||{},l=o.mapValue.fields||{};if(_a(a)!==_a(l))return!1;for(const u in a)if(a.hasOwnProperty(u)&&(l[u]===void 0||!ze(a[u],l[u])))return!1;return!0})(n,e);default:return j(52216,{left:n})}}function Fn(n,e){return(n.values||[]).find((t=>ze(t,e)))!==void 0}function Wt(n,e){if(n===e)return 0;const t=ht(n),s=ht(e);if(t!==s)return K(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return K(n.booleanValue,e.booleanValue);case 2:return(function(o,a){const l=oe(o.integerValue||o.doubleValue),u=oe(a.integerValue||a.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1})(n,e);case 3:return ka(n.timestampValue,e.timestampValue);case 4:return ka(Ln(n),Ln(e));case 5:return Zr(n.stringValue,e.stringValue);case 6:return(function(o,a){const l=dt(o),u=dt(a);return l.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(o,a){const l=o.split("/"),u=a.split("/");for(let h=0;h<l.length&&h<u.length;h++){const p=K(l[h],u[h]);if(p!==0)return p}return K(l.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(o,a){const l=K(oe(o.latitude),oe(a.latitude));return l!==0?l:K(oe(o.longitude),oe(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Ta(n.arrayValue,e.arrayValue);case 10:return(function(o,a){var b,w,A,C;const l=o.fields||{},u=a.fields||{},h=(b=l[Ps])==null?void 0:b.arrayValue,p=(w=u[Ps])==null?void 0:w.arrayValue,m=K(((A=h==null?void 0:h.values)==null?void 0:A.length)||0,((C=p==null?void 0:p.values)==null?void 0:C.length)||0);return m!==0?m:Ta(h,p)})(n.mapValue,e.mapValue);case 11:return(function(o,a){if(o===fs.mapValue&&a===fs.mapValue)return 0;if(o===fs.mapValue)return 1;if(a===fs.mapValue)return-1;const l=o.fields||{},u=Object.keys(l),h=a.fields||{},p=Object.keys(h);u.sort(),p.sort();for(let m=0;m<u.length&&m<p.length;++m){const b=Zr(u[m],p[m]);if(b!==0)return b;const w=Wt(l[u[m]],h[p[m]]);if(w!==0)return w}return K(u.length,p.length)})(n.mapValue,e.mapValue);default:throw j(23264,{he:t})}}function ka(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return K(n,e);const t=ut(n),s=ut(e),r=K(t.seconds,s.seconds);return r!==0?r:K(t.nanos,s.nanos)}function Ta(n,e){const t=n.values||[],s=e.values||[];for(let r=0;r<t.length&&r<s.length;++r){const o=Wt(t[r],s[r]);if(o)return o}return K(t.length,s.length)}function Kt(n){return ei(n)}function ei(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const s=ut(t);return`time(${s.seconds},${s.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return dt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return F.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let s="[",r=!0;for(const o of t.values||[])r?r=!1:s+=",",s+=ei(o);return s+"]"})(n.arrayValue):"mapValue"in n?(function(t){const s=Object.keys(t.fields||{}).sort();let r="{",o=!0;for(const a of s)o?o=!1:r+=",",r+=`${a}:${ei(t.fields[a])}`;return r+"}"})(n.mapValue):j(61005,{value:n})}function ws(n){switch(ht(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ks(n);return e?16+ws(e):16;case 5:return 2*n.stringValue.length;case 6:return dt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((r,o)=>r+ws(o)),0)})(n.arrayValue);case 10:case 11:return(function(s){let r=0;return mt(s.fields,((o,a)=>{r+=o.length+ws(a)})),r})(n.mapValue);default:throw j(13486,{value:n})}}function Ia(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function ti(n){return!!n&&"integerValue"in n}function _i(n){return!!n&&"arrayValue"in n}function Aa(n){return!!n&&"nullValue"in n}function Sa(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function _s(n){return!!n&&"mapValue"in n}function op(n){var t,s;return((s=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Kl])==null?void 0:s.stringValue)===Ql}function Sn(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return mt(n.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Sn(s))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Sn(n.arrayValue.values[t]);return e}return{...n}}function ap(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===ip}/**
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
 */class Ae{constructor(e){this.value=e}static empty(){return new Ae({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!_s(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Sn(t)}setAll(e){let t=ye.emptyPath(),s={},r=[];e.forEach(((a,l)=>{if(!t.isImmediateParentOf(l)){const u=this.getFieldsMap(t);this.applyChanges(u,s,r),s={},r=[],t=l.popLast()}a?s[l.lastSegment()]=Sn(a):r.push(l.lastSegment())}));const o=this.getFieldsMap(t);this.applyChanges(o,s,r)}delete(e){const t=this.field(e.popLast());_s(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ze(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let r=t.mapValue.fields[e.get(s)];_s(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,s){mt(t,((r,o)=>e[r]=o));for(const r of s)delete e[r]}clone(){return new Ae(Sn(this.value))}}function Yl(n){const e=[];return mt(n.fields,((t,s)=>{const r=new ye([t]);if(_s(s)){const o=Yl(s.mapValue).fields;if(o.length===0)e.push(r);else for(const a of o)e.push(r.child(a))}else e.push(r)})),new Ce(e)}/**
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
 */class we{constructor(e,t,s,r,o,a,l){this.key=e,this.documentType=t,this.version=s,this.readTime=r,this.createTime=o,this.data=a,this.documentState=l}static newInvalidDocument(e){return new we(e,0,U.min(),U.min(),U.min(),Ae.empty(),0)}static newFoundDocument(e,t,s,r){return new we(e,1,t,U.min(),s,r,0)}static newNoDocument(e,t){return new we(e,2,t,U.min(),U.min(),Ae.empty(),0)}static newUnknownDocument(e,t){return new we(e,3,t,U.min(),U.min(),Ae.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ae.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ae.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof we&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new we(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class Vs{constructor(e,t){this.position=e,this.inclusive=t}}function Ca(n,e,t){let s=0;for(let r=0;r<n.position.length;r++){const o=e[r],a=n.position[r];if(o.field.isKeyField()?s=F.comparator(F.fromName(a.referenceValue),t.key):s=Wt(a,t.data.field(o.field)),o.dir==="desc"&&(s*=-1),s!==0)break}return s}function Ra(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ze(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class Ds{constructor(e,t="asc"){this.field=e,this.dir=t}}function lp(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Jl{}class ce extends Jl{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new up(e,t,s):t==="array-contains"?new pp(e,s):t==="in"?new fp(e,s):t==="not-in"?new mp(e,s):t==="array-contains-any"?new gp(e,s):new ce(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new dp(e,s):new hp(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Wt(t,this.value)):t!==null&&ht(this.value)===ht(t)&&this.matchesComparison(Wt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return j(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class $e extends Jl{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new $e(e,t)}matches(e){return Xl(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Xl(n){return n.op==="and"}function Zl(n){return cp(n)&&Xl(n)}function cp(n){for(const e of n.filters)if(e instanceof $e)return!1;return!0}function ni(n){if(n instanceof ce)return n.field.canonicalString()+n.op.toString()+Kt(n.value);if(Zl(n))return n.filters.map((e=>ni(e))).join(",");{const e=n.filters.map((t=>ni(t))).join(",");return`${n.op}(${e})`}}function ec(n,e){return n instanceof ce?(function(s,r){return r instanceof ce&&s.op===r.op&&s.field.isEqual(r.field)&&ze(s.value,r.value)})(n,e):n instanceof $e?(function(s,r){return r instanceof $e&&s.op===r.op&&s.filters.length===r.filters.length?s.filters.reduce(((o,a,l)=>o&&ec(a,r.filters[l])),!0):!1})(n,e):void j(19439)}function tc(n){return n instanceof ce?(function(t){return`${t.field.canonicalString()} ${t.op} ${Kt(t.value)}`})(n):n instanceof $e?(function(t){return t.op.toString()+" {"+t.getFilters().map(tc).join(" ,")+"}"})(n):"Filter"}class up extends ce{constructor(e,t,s){super(e,t,s),this.key=F.fromName(s.referenceValue)}matches(e){const t=F.comparator(e.key,this.key);return this.matchesComparison(t)}}class dp extends ce{constructor(e,t){super(e,"in",t),this.keys=nc("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class hp extends ce{constructor(e,t){super(e,"not-in",t),this.keys=nc("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function nc(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((s=>F.fromName(s.referenceValue)))}class pp extends ce{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return _i(t)&&Fn(t.arrayValue,this.value)}}class fp extends ce{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Fn(this.value.arrayValue,t)}}class mp extends ce{constructor(e,t){super(e,"not-in",t)}matches(e){if(Fn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Fn(this.value.arrayValue,t)}}class gp extends ce{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!_i(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>Fn(this.value.arrayValue,s)))}}/**
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
 */class yp{constructor(e,t=null,s=[],r=[],o=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=r,this.limit=o,this.startAt=a,this.endAt=l,this.Te=null}}function Pa(n,e=null,t=[],s=[],r=null,o=null,a=null){return new yp(n,e,t,s,r,o,a)}function Ei(n){const e=q(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>ni(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(o){return o.field.canonicalString()+o.dir})(s))).join(","),Ws(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>Kt(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>Kt(s))).join(",")),e.Te=t}return e.Te}function ki(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!lp(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!ec(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Ra(n.startAt,e.startAt)&&Ra(n.endAt,e.endAt)}function si(n){return F.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Hn{constructor(e,t=null,s=[],r=[],o=null,a="F",l=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=o,this.limitType=a,this.startAt=l,this.endAt=u,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function bp(n,e,t,s,r,o,a,l){return new Hn(n,e,t,s,r,o,a,l)}function Ti(n){return new Hn(n)}function Va(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function vp(n){return F.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function sc(n){return n.collectionGroup!==null}function Cn(n){const e=q(n);if(e.Ee===null){e.Ee=[];const t=new Set;for(const o of e.explicitOrderBy)e.Ee.push(o),t.add(o.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new pe(ye.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(l=l.add(h.field))}))})),l})(e).forEach((o=>{t.has(o.canonicalString())||o.isKeyField()||e.Ee.push(new Ds(o,s))})),t.has(ye.keyField().canonicalString())||e.Ee.push(new Ds(ye.keyField(),s))}return e.Ee}function Fe(n){const e=q(n);return e.Ie||(e.Ie=xp(e,Cn(n))),e.Ie}function xp(n,e){if(n.limitType==="F")return Pa(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const o=r.dir==="desc"?"asc":"desc";return new Ds(r.field,o)}));const t=n.endAt?new Vs(n.endAt.position,n.endAt.inclusive):null,s=n.startAt?new Vs(n.startAt.position,n.startAt.inclusive):null;return Pa(n.path,n.collectionGroup,e,n.filters,n.limit,t,s)}}function ri(n,e){const t=n.filters.concat([e]);return new Hn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function ii(n,e,t){return new Hn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Qs(n,e){return ki(Fe(n),Fe(e))&&n.limitType===e.limitType}function rc(n){return`${Ei(Fe(n))}|lt:${n.limitType}`}function Ot(n){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((r=>tc(r))).join(", ")}]`),Ws(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((r=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(r))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((r=>Kt(r))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((r=>Kt(r))).join(",")),`Target(${s})`})(Fe(n))}; limitType=${n.limitType})`}function Ys(n,e){return e.isFoundDocument()&&(function(s,r){const o=r.key.path;return s.collectionGroup!==null?r.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(o):F.isDocumentKey(s.path)?s.path.isEqual(o):s.path.isImmediateParentOf(o)})(n,e)&&(function(s,r){for(const o of Cn(s))if(!o.field.isKeyField()&&r.data.field(o.field)===null)return!1;return!0})(n,e)&&(function(s,r){for(const o of s.filters)if(!o.matches(r))return!1;return!0})(n,e)&&(function(s,r){return!(s.startAt&&!(function(a,l,u){const h=Ca(a,l,u);return a.inclusive?h<=0:h<0})(s.startAt,Cn(s),r)||s.endAt&&!(function(a,l,u){const h=Ca(a,l,u);return a.inclusive?h>=0:h>0})(s.endAt,Cn(s),r))})(n,e)}function wp(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function ic(n){return(e,t)=>{let s=!1;for(const r of Cn(n)){const o=_p(r,e,t);if(o!==0)return o;s=s||r.field.isKeyField()}return 0}}function _p(n,e,t){const s=n.field.isKeyField()?F.comparator(e.key,t.key):(function(o,a,l){const u=a.data.field(o),h=l.data.field(o);return u!==null&&h!==null?Wt(u,h):j(42886)})(n.field,e,t);switch(n.dir){case"asc":return s;case"desc":return-1*s;default:return j(19790,{direction:n.dir})}}/**
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
 */class Ct{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[r,o]of s)if(this.equalsFn(r,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),r=this.inner[s];if(r===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let o=0;o<r.length;o++)if(this.equalsFn(r[o][0],e))return void(r[o]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let r=0;r<s.length;r++)if(this.equalsFn(s[r][0],e))return s.length===1?delete this.inner[t]:s.splice(r,1),this.innerSize--,!0;return!1}forEach(e){mt(this.inner,((t,s)=>{for(const[r,o]of s)e(r,o)}))}isEmpty(){return Ul(this.inner)}size(){return this.innerSize}}/**
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
 */const Ep=new re(F.comparator);function Qe(){return Ep}const oc=new re(F.comparator);function Tn(...n){let e=oc;for(const t of n)e=e.insert(t.key,t);return e}function ac(n){let e=oc;return n.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function kt(){return Rn()}function lc(){return Rn()}function Rn(){return new Ct((n=>n.toString()),((n,e)=>n.isEqual(e)))}const kp=new re(F.comparator),Tp=new pe(F.comparator);function Q(...n){let e=Tp;for(const t of n)e=e.add(t);return e}const Ip=new pe(K);function Ap(){return Ip}/**
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
 */function Ii(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Cs(e)?"-0":e}}function cc(n){return{integerValue:""+n}}function Sp(n,e){return Zh(e)?cc(e):Ii(n,e)}/**
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
 */class Js{constructor(){this._=void 0}}function Cp(n,e,t){return n instanceof Bn?(function(r,o){const a={fields:{[Hl]:{stringValue:ql},[Wl]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return o&&wi(o)&&(o=Ks(o)),o&&(a.fields[Gl]=o),{mapValue:a}})(t,e):n instanceof jn?dc(n,e):n instanceof Un?hc(n,e):(function(r,o){const a=uc(r,o),l=Da(a)+Da(r.Ae);return ti(a)&&ti(r.Ae)?cc(l):Ii(r.serializer,l)})(n,e)}function Rp(n,e,t){return n instanceof jn?dc(n,e):n instanceof Un?hc(n,e):t}function uc(n,e){return n instanceof $s?(function(s){return ti(s)||(function(o){return!!o&&"doubleValue"in o})(s)})(e)?e:{integerValue:0}:null}class Bn extends Js{}class jn extends Js{constructor(e){super(),this.elements=e}}function dc(n,e){const t=pc(e);for(const s of n.elements)t.some((r=>ze(r,s)))||t.push(s);return{arrayValue:{values:t}}}class Un extends Js{constructor(e){super(),this.elements=e}}function hc(n,e){let t=pc(e);for(const s of n.elements)t=t.filter((r=>!ze(r,s)));return{arrayValue:{values:t}}}class $s extends Js{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Da(n){return oe(n.integerValue||n.doubleValue)}function pc(n){return _i(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class Pp{constructor(e,t){this.field=e,this.transform=t}}function Vp(n,e){return n.field.isEqual(e.field)&&(function(s,r){return s instanceof jn&&r instanceof jn||s instanceof Un&&r instanceof Un?Gt(s.elements,r.elements,ze):s instanceof $s&&r instanceof $s?ze(s.Ae,r.Ae):s instanceof Bn&&r instanceof Bn})(n.transform,e.transform)}class Dp{constructor(e,t){this.version=e,this.transformResults=t}}class Pe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Pe}static exists(e){return new Pe(void 0,e)}static updateTime(e){return new Pe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Es(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Xs{}function fc(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Ai(n.key,Pe.none()):new Gn(n.key,n.data,Pe.none());{const t=n.data,s=Ae.empty();let r=new pe(ye.comparator);for(let o of e.fields)if(!r.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?s.delete(o):s.set(o,a),r=r.add(o)}return new gt(n.key,s,new Ce(r.toArray()),Pe.none())}}function $p(n,e,t){n instanceof Gn?(function(r,o,a){const l=r.value.clone(),u=Ma(r.fieldTransforms,o,a.transformResults);l.setAll(u),o.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):n instanceof gt?(function(r,o,a){if(!Es(r.precondition,o))return void o.convertToUnknownDocument(a.version);const l=Ma(r.fieldTransforms,o,a.transformResults),u=o.data;u.setAll(mc(r)),u.setAll(l),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(r,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Pn(n,e,t,s){return n instanceof Gn?(function(o,a,l,u){if(!Es(o.precondition,a))return l;const h=o.value.clone(),p=Na(o.fieldTransforms,u,a);return h.setAll(p),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null})(n,e,t,s):n instanceof gt?(function(o,a,l,u){if(!Es(o.precondition,a))return l;const h=Na(o.fieldTransforms,u,a),p=a.data;return p.setAll(mc(o)),p.setAll(h),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((m=>m.field)))})(n,e,t,s):(function(o,a,l){return Es(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l})(n,e,t)}function Mp(n,e){let t=null;for(const s of n.fieldTransforms){const r=e.data.field(s.field),o=uc(s.transform,r||null);o!=null&&(t===null&&(t=Ae.empty()),t.set(s.field,o))}return t||null}function $a(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(s,r){return s===void 0&&r===void 0||!(!s||!r)&&Gt(s,r,((o,a)=>Vp(o,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Gn extends Xs{constructor(e,t,s,r=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class gt extends Xs{constructor(e,t,s,r,o=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=r,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function mc(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=n.data.field(t);e.set(t,s)}})),e}function Ma(n,e,t){const s=new Map;Z(n.length===t.length,32656,{Ve:t.length,de:n.length});for(let r=0;r<t.length;r++){const o=n[r],a=o.transform,l=e.data.field(o.field);s.set(o.field,Rp(a,l,t[r]))}return s}function Na(n,e,t){const s=new Map;for(const r of n){const o=r.transform,a=t.data.field(r.field);s.set(r.field,Cp(o,a,e))}return s}class Ai extends Xs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Np extends Xs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Lp{constructor(e,t,s,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=r}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const o=this.mutations[r];o.key.isEqual(e.key)&&$p(o,e,s[r])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=Pn(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=Pn(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=lc();return this.mutations.forEach((r=>{const o=e.get(r.key),a=o.overlayedDocument;let l=this.applyToLocalView(a,o.mutatedFields);l=t.has(r.key)?null:l;const u=fc(a,l);u!==null&&s.set(r.key,u),a.isValidDocument()||a.convertToNoDocument(U.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Q())}isEqual(e){return this.batchId===e.batchId&&Gt(this.mutations,e.mutations,((t,s)=>$a(t,s)))&&Gt(this.baseMutations,e.baseMutations,((t,s)=>$a(t,s)))}}class Si{constructor(e,t,s,r){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=r}static from(e,t,s){Z(e.mutations.length===s.length,58842,{me:e.mutations.length,fe:s.length});let r=(function(){return kp})();const o=e.mutations;for(let a=0;a<o.length;a++)r=r.insert(o[a].key,s[a].version);return new Si(e,t,s,r)}}/**
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
 */class Op{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class Fp{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var le,J;function Bp(n){switch(n){case P.OK:return j(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return j(15467,{code:n})}}function gc(n){if(n===void 0)return Ke("GRPC error has no .code"),P.UNKNOWN;switch(n){case le.OK:return P.OK;case le.CANCELLED:return P.CANCELLED;case le.UNKNOWN:return P.UNKNOWN;case le.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case le.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case le.INTERNAL:return P.INTERNAL;case le.UNAVAILABLE:return P.UNAVAILABLE;case le.UNAUTHENTICATED:return P.UNAUTHENTICATED;case le.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case le.NOT_FOUND:return P.NOT_FOUND;case le.ALREADY_EXISTS:return P.ALREADY_EXISTS;case le.PERMISSION_DENIED:return P.PERMISSION_DENIED;case le.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case le.ABORTED:return P.ABORTED;case le.OUT_OF_RANGE:return P.OUT_OF_RANGE;case le.UNIMPLEMENTED:return P.UNIMPLEMENTED;case le.DATA_LOSS:return P.DATA_LOSS;default:return j(39323,{code:n})}}(J=le||(le={}))[J.OK=0]="OK",J[J.CANCELLED=1]="CANCELLED",J[J.UNKNOWN=2]="UNKNOWN",J[J.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",J[J.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",J[J.NOT_FOUND=5]="NOT_FOUND",J[J.ALREADY_EXISTS=6]="ALREADY_EXISTS",J[J.PERMISSION_DENIED=7]="PERMISSION_DENIED",J[J.UNAUTHENTICATED=16]="UNAUTHENTICATED",J[J.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",J[J.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",J[J.ABORTED=10]="ABORTED",J[J.OUT_OF_RANGE=11]="OUT_OF_RANGE",J[J.UNIMPLEMENTED=12]="UNIMPLEMENTED",J[J.INTERNAL=13]="INTERNAL",J[J.UNAVAILABLE=14]="UNAVAILABLE",J[J.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function jp(){return new TextEncoder}/**
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
 */const Up=new at([4294967295,4294967295],0);function La(n){const e=jp().encode(n),t=new Vl;return t.update(e),new Uint8Array(t.digest())}function Oa(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),r=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new at([t,s],0),new at([r,o],0)]}class Ci{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new In(`Invalid padding: ${t}`);if(s<0)throw new In(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new In(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new In(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=at.fromNumber(this.ge)}ye(e,t,s){let r=e.add(t.multiply(at.fromNumber(s)));return r.compare(Up)===1&&(r=new at([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=La(e),[s,r]=Oa(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(s,r,o);if(!this.we(a))return!1}return!0}static create(e,t,s){const r=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new Ci(o,r,t);return s.forEach((l=>a.insert(l))),a}insert(e){if(this.ge===0)return;const t=La(e),[s,r]=Oa(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(s,r,o);this.Se(a)}}Se(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class In extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Zs{constructor(e,t,s,r,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=r,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const r=new Map;return r.set(e,Wn.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new Zs(U.min(),r,new re(K),Qe(),Q())}}class Wn{constructor(e,t,s,r,o){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=r,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new Wn(s,t,Q(),Q(),Q())}}/**
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
 */class ks{constructor(e,t,s,r){this.be=e,this.removedTargetIds=t,this.key=s,this.De=r}}class yc{constructor(e,t){this.targetId=e,this.Ce=t}}class bc{constructor(e,t,s=be.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=r}}class Fa{constructor(){this.ve=0,this.Fe=Ba(),this.Me=be.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=Q(),t=Q(),s=Q();return this.Fe.forEach(((r,o)=>{switch(o){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:s=s.add(r);break;default:j(38017,{changeType:o})}})),new Wn(this.Me,this.xe,e,t,s)}qe(){this.Oe=!1,this.Fe=Ba()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,Z(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class zp{constructor(e){this.Ge=e,this.ze=new Map,this.je=Qe(),this.Je=ms(),this.He=ms(),this.Ze=new re(K)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const s=this.nt(t);switch(e.state){case 0:this.rt(t)&&s.Le(e.resumeToken);break;case 1:s.We(),s.Ne||s.qe(),s.Le(e.resumeToken);break;case 2:s.We(),s.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(s.Qe(),s.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),s.Le(e.resumeToken));break;default:j(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((s,r)=>{this.rt(r)&&t(r)}))}st(e){const t=e.targetId,s=e.Ce.count,r=this.ot(t);if(r){const o=r.target;if(si(o))if(s===0){const a=new F(o.path);this.et(t,a,we.newNoDocument(a,U.min()))}else Z(s===1,20013,{expectedCount:s});else{const a=this._t(t);if(a!==s){const l=this.ut(e),u=l?this.ct(l,e,a):1;if(u!==0){this.it(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,h)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:r=0},hashCount:o=0}=t;let a,l;try{a=dt(s).toUint8Array()}catch(u){if(u instanceof zl)return Ht("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Ci(a,r,o)}catch(u){return Ht(u instanceof In?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.ge===0?null:l}ct(e,t,s){return t.Ce.count===s-this.Pt(e,t.targetId)?0:2}Pt(e,t){const s=this.Ge.getRemoteKeysForTarget(t);let r=0;return s.forEach((o=>{const a=this.Ge.ht(),l=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(l)||(this.et(t,o,null),r++)})),r}Tt(e){const t=new Map;this.ze.forEach(((o,a)=>{const l=this.ot(a);if(l){if(o.current&&si(l.target)){const u=new F(l.target.path);this.Et(u).has(a)||this.It(a,u)||this.et(a,u,we.newNoDocument(u,e))}o.Be&&(t.set(a,o.ke()),o.qe())}}));let s=Q();this.He.forEach(((o,a)=>{let l=!0;a.forEachWhile((u=>{const h=this.ot(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(s=s.add(o))})),this.je.forEach(((o,a)=>a.setReadTime(e)));const r=new Zs(e,t,this.Ze,this.je,s);return this.je=Qe(),this.Je=ms(),this.He=ms(),this.Ze=new re(K),r}Ye(e,t){if(!this.rt(e))return;const s=this.It(e,t.key)?2:0;this.nt(e).Ke(t.key,s),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Et(t.key).add(e)),this.He=this.He.insert(t.key,this.Rt(t.key).add(e))}et(e,t,s){if(!this.rt(e))return;const r=this.nt(e);this.It(e,t)?r.Ke(t,1):r.Ue(t),this.He=this.He.insert(t,this.Rt(t).delete(e)),this.He=this.He.insert(t,this.Rt(t).add(e)),s&&(this.je=this.je.insert(t,s))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let t=this.ze.get(e);return t||(t=new Fa,this.ze.set(e,t)),t}Rt(e){let t=this.He.get(e);return t||(t=new pe(K),this.He=this.He.insert(e,t)),t}Et(e){let t=this.Je.get(e);return t||(t=new pe(K),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||M("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Fa),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function ms(){return new re(F.comparator)}function Ba(){return new re(F.comparator)}const qp={asc:"ASCENDING",desc:"DESCENDING"},Hp={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Gp={and:"AND",or:"OR"};class Wp{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function oi(n,e){return n.useProto3Json||Ws(e)?e:{value:e}}function Ms(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function vc(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Kp(n,e){return Ms(n,e.toTimestamp())}function Be(n){return Z(!!n,49232),U.fromTimestamp((function(t){const s=ut(t);return new se(s.seconds,s.nanos)})(n))}function Ri(n,e){return ai(n,e).canonicalString()}function ai(n,e){const t=(function(r){return new te(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function xc(n){const e=te.fromString(n);return Z(Tc(e),10190,{key:e.toString()}),e}function li(n,e){return Ri(n.databaseId,e.path)}function Or(n,e){const t=xc(e);if(t.get(1)!==n.databaseId.projectId)throw new $(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new $(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new F(_c(t))}function wc(n,e){return Ri(n.databaseId,e)}function Qp(n){const e=xc(n);return e.length===4?te.emptyPath():_c(e)}function ci(n){return new te(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function _c(n){return Z(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function ja(n,e,t){return{name:li(n,e),fields:t.value.mapValue.fields}}function Yp(n,e){let t;if("targetChange"in e){e.targetChange;const s=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:j(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],o=(function(h,p){return h.useProto3Json?(Z(p===void 0||typeof p=="string",58123),be.fromBase64String(p||"")):(Z(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),be.fromUint8Array(p||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&(function(h){const p=h.code===void 0?P.UNKNOWN:gc(h.code);return new $(p,h.message||"")})(a);t=new bc(s,r,o,l||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const r=Or(n,s.document.name),o=Be(s.document.updateTime),a=s.document.createTime?Be(s.document.createTime):U.min(),l=new Ae({mapValue:{fields:s.document.fields}}),u=we.newFoundDocument(r,o,a,l),h=s.targetIds||[],p=s.removedTargetIds||[];t=new ks(h,p,u.key,u)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const r=Or(n,s.document),o=s.readTime?Be(s.readTime):U.min(),a=we.newNoDocument(r,o),l=s.removedTargetIds||[];t=new ks([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const r=Or(n,s.document),o=s.removedTargetIds||[];t=new ks([],o,r,null)}else{if(!("filter"in e))return j(11601,{Vt:e});{e.filter;const s=e.filter;s.targetId;const{count:r=0,unchangedNames:o}=s,a=new Fp(r,o),l=s.targetId;t=new yc(l,a)}}return t}function Jp(n,e){let t;if(e instanceof Gn)t={update:ja(n,e.key,e.value)};else if(e instanceof Ai)t={delete:li(n,e.key)};else if(e instanceof gt)t={update:ja(n,e.key,e.data),updateMask:af(e.fieldMask)};else{if(!(e instanceof Np))return j(16599,{dt:e.type});t={verify:li(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(o,a){const l=a.transform;if(l instanceof Bn)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof jn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Un)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof $s)return{fieldPath:a.field.canonicalString(),increment:l.Ae};throw j(20930,{transform:a.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(r,o){return o.updateTime!==void 0?{updateTime:Kp(r,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:j(27497)})(n,e.precondition)),t}function Xp(n,e){return n&&n.length>0?(Z(e!==void 0,14353),n.map((t=>(function(r,o){let a=r.updateTime?Be(r.updateTime):Be(o);return a.isEqual(U.min())&&(a=Be(o)),new Dp(a,r.transformResults||[])})(t,e)))):[]}function Zp(n,e){return{documents:[wc(n,e.path)]}}function ef(n,e){const t={structuredQuery:{}},s=e.path;let r;e.collectionGroup!==null?(r=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=wc(n,r);const o=(function(h){if(h.length!==0)return kc($e.create(h,"and"))})(e.filters);o&&(t.structuredQuery.where=o);const a=(function(h){if(h.length!==0)return h.map((p=>(function(b){return{field:Ft(b.field),direction:sf(b.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=oi(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{ft:t,parent:r}}function tf(n){let e=Qp(n.parent);const t=n.structuredQuery,s=t.from?t.from.length:0;let r=null;if(s>0){Z(s===1,65062);const p=t.from[0];p.allDescendants?r=p.collectionId:e=e.child(p.collectionId)}let o=[];t.where&&(o=(function(m){const b=Ec(m);return b instanceof $e&&Zl(b)?b.getFilters():[b]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((b=>(function(A){return new Ds(Bt(A.field),(function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(A.direction))})(b)))})(t.orderBy));let l=null;t.limit&&(l=(function(m){let b;return b=typeof m=="object"?m.value:m,Ws(b)?null:b})(t.limit));let u=null;t.startAt&&(u=(function(m){const b=!!m.before,w=m.values||[];return new Vs(w,b)})(t.startAt));let h=null;return t.endAt&&(h=(function(m){const b=!m.before,w=m.values||[];return new Vs(w,b)})(t.endAt)),bp(e,r,a,o,l,"F",u,h)}function nf(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return j(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Ec(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=Bt(t.unaryFilter.field);return ce.create(s,"==",{doubleValue:NaN});case"IS_NULL":const r=Bt(t.unaryFilter.field);return ce.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Bt(t.unaryFilter.field);return ce.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Bt(t.unaryFilter.field);return ce.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return j(61313);default:return j(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ce.create(Bt(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return j(58110);default:return j(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return $e.create(t.compositeFilter.filters.map((s=>Ec(s))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return j(1026)}})(t.compositeFilter.op))})(n):j(30097,{filter:n})}function sf(n){return qp[n]}function rf(n){return Hp[n]}function of(n){return Gp[n]}function Ft(n){return{fieldPath:n.canonicalString()}}function Bt(n){return ye.fromServerFormat(n.fieldPath)}function kc(n){return n instanceof ce?(function(t){if(t.op==="=="){if(Sa(t.value))return{unaryFilter:{field:Ft(t.field),op:"IS_NAN"}};if(Aa(t.value))return{unaryFilter:{field:Ft(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Sa(t.value))return{unaryFilter:{field:Ft(t.field),op:"IS_NOT_NAN"}};if(Aa(t.value))return{unaryFilter:{field:Ft(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ft(t.field),op:rf(t.op),value:t.value}}})(n):n instanceof $e?(function(t){const s=t.getFilters().map((r=>kc(r)));return s.length===1?s[0]:{compositeFilter:{op:of(t.op),filters:s}}})(n):j(54877,{filter:n})}function af(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Tc(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Ic(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
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
 */class rt{constructor(e,t,s,r,o=U.min(),a=U.min(),l=be.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=r,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new rt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new rt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class lf{constructor(e){this.yt=e}}function cf(n){const e=tf({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?ii(e,e.limit,"L"):e}/**
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
 */class uf{constructor(){this.bn=new df}addToCollectionParentIndex(e,t){return this.bn.add(t),V.resolve()}getCollectionParents(e,t){return V.resolve(this.bn.getEntries(t))}addFieldIndex(e,t){return V.resolve()}deleteFieldIndex(e,t){return V.resolve()}deleteAllFieldIndexes(e){return V.resolve()}createTargetIndexes(e,t){return V.resolve()}getDocumentsMatchingTarget(e,t){return V.resolve(null)}getIndexType(e,t){return V.resolve(0)}getFieldIndexes(e,t){return V.resolve([])}getNextCollectionGroupToUpdate(e){return V.resolve(null)}getMinOffset(e,t){return V.resolve(ct.min())}getMinOffsetFromCollectionGroup(e,t){return V.resolve(ct.min())}updateCollectionGroup(e,t,s){return V.resolve()}updateIndexEntries(e,t){return V.resolve()}}class df{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t]||new pe(te.comparator),o=!r.has(s);return this.index[t]=r.add(s),o}has(e){const t=e.lastSegment(),s=e.popLast(),r=this.index[t];return r&&r.has(s)}getEntries(e){return(this.index[e]||new pe(te.comparator)).toArray()}}/**
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
 */const Ua={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Ac=41943040;class Ie{static withCacheSize(e){return new Ie(e,Ie.DEFAULT_COLLECTION_PERCENTILE,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
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
 */Ie.DEFAULT_COLLECTION_PERCENTILE=10,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ie.DEFAULT=new Ie(Ac,Ie.DEFAULT_COLLECTION_PERCENTILE,Ie.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ie.DISABLED=new Ie(-1,0,0);/**
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
 */class Qt{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new Qt(0)}static ar(){return new Qt(-1)}}/**
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
 */const za="LruGarbageCollector",Sc=1048576;function qa([n,e],[t,s]){const r=K(n,t);return r===0?K(e,s):r}class hf{constructor(e){this.Pr=e,this.buffer=new pe(qa),this.Tr=0}Er(){return++this.Tr}Ir(e){const t=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();qa(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class pf{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){M(za,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){sn(t)?M(za,"Ignoring IndexedDB error during garbage collection: ",t):await nn(t)}await this.Ar(3e5)}))}}class ff{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.dr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return V.resolve(Gs.ce);const s=new hf(t);return this.Vr.forEachTarget(e,(r=>s.Ir(r.sequenceNumber))).next((()=>this.Vr.mr(e,(r=>s.Ir(r))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(M("LruGarbageCollector","Garbage collection skipped; disabled"),V.resolve(Ua)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(M("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ua):this.gr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,t){let s,r,o,a,l,u,h;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(M("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),r=this.params.maximumSequenceNumbersToCollect):r=m,a=Date.now(),this.nthSequenceNumber(e,r)))).next((m=>(s=m,l=Date.now(),this.removeTargets(e,s,t)))).next((m=>(o=m,u=Date.now(),this.removeOrphanedDocuments(e,s)))).next((m=>(h=Date.now(),Lt()<=X.DEBUG&&M("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${r} in `+(l-a)+`ms
	Removed ${o} targets in `+(u-l)+`ms
	Removed ${m} documents in `+(h-u)+`ms
Total Duration: ${h-p}ms`),V.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:o,documentsRemoved:m}))))}}function mf(n,e){return new ff(n,e)}/**
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
 */class gf{constructor(){this.changes=new Ct((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,we.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?V.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class yf{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class bf{constructor(e,t,s,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=r}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(s=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(s!==null&&Pn(s.mutation,r,Ce.empty(),se.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,Q()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=Q()){const r=kt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,s).next((o=>{let a=Tn();return o.forEach(((l,u)=>{a=a.insert(l,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const s=kt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,Q())))}populateOverlays(e,t,s){const r=[];return s.forEach((o=>{t.has(o)||r.push(o)})),this.documentOverlayCache.getOverlays(e,r).next((o=>{o.forEach(((a,l)=>{t.set(a,l)}))}))}computeViews(e,t,s,r){let o=Qe();const a=Rn(),l=(function(){return Rn()})();return t.forEach(((u,h)=>{const p=s.get(h.key);r.has(h.key)&&(p===void 0||p.mutation instanceof gt)?o=o.insert(h.key,h):p!==void 0?(a.set(h.key,p.mutation.getFieldMask()),Pn(p.mutation,h,p.mutation.getFieldMask(),se.now())):a.set(h.key,Ce.empty())})),this.recalculateAndSaveOverlays(e,o).next((u=>(u.forEach(((h,p)=>a.set(h,p))),t.forEach(((h,p)=>l.set(h,new yf(p,a.get(h)??null)))),l)))}recalculateAndSaveOverlays(e,t){const s=Rn();let r=new re(((a,l)=>a-l)),o=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const l of a)l.keys().forEach((u=>{const h=t.get(u);if(h===null)return;let p=s.get(u)||Ce.empty();p=l.applyToLocalView(h,p),s.set(u,p);const m=(r.get(l.batchId)||Q()).add(u);r=r.insert(l.batchId,m)}))})).next((()=>{const a=[],l=r.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,p=u.value,m=lc();p.forEach((b=>{if(!o.has(b)){const w=fc(t.get(b),s.get(b));w!==null&&m.set(b,w),o=o.add(b)}})),a.push(this.documentOverlayCache.saveOverlays(e,h,m))}return V.waitFor(a)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,r){return vp(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):sc(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,r):this.getDocumentsMatchingCollectionQuery(e,t,s,r)}getNextDocuments(e,t,s,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,r).next((o=>{const a=r-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,r-o.size):V.resolve(kt());let l=Nn,u=o;return a.next((h=>V.forEach(h,((p,m)=>(l<m.largestBatchId&&(l=m.largestBatchId),o.get(p)?V.resolve():this.remoteDocumentCache.getEntry(e,p).next((b=>{u=u.insert(p,b)}))))).next((()=>this.populateOverlays(e,h,o))).next((()=>this.computeViews(e,u,h,Q()))).next((p=>({batchId:l,changes:ac(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new F(t)).next((s=>{let r=Tn();return s.isFoundDocument()&&(r=r.insert(s.key,s)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,r){const o=t.collectionGroup;let a=Tn();return this.indexManager.getCollectionParents(e,o).next((l=>V.forEach(l,(u=>{const h=(function(m,b){return new Hn(b,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,u.child(o));return this.getDocumentsMatchingCollectionQuery(e,h,s,r).next((p=>{p.forEach(((m,b)=>{a=a.insert(m,b)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,s,r){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,o,r)))).next((a=>{o.forEach(((u,h)=>{const p=h.getKey();a.get(p)===null&&(a=a.insert(p,we.newInvalidDocument(p)))}));let l=Tn();return a.forEach(((u,h)=>{const p=o.get(u);p!==void 0&&Pn(p.mutation,h,Ce.empty(),se.now()),Ys(t,h)&&(l=l.insert(u,h))})),l}))}}/**
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
 */class vf{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,t){return V.resolve(this.Nr.get(t))}saveBundleMetadata(e,t){return this.Nr.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:Be(r.createTime)}})(t)),V.resolve()}getNamedQuery(e,t){return V.resolve(this.Br.get(t))}saveNamedQuery(e,t){return this.Br.set(t.name,(function(r){return{name:r.name,query:cf(r.bundledQuery),readTime:Be(r.readTime)}})(t)),V.resolve()}}/**
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
 */class xf{constructor(){this.overlays=new re(F.comparator),this.Lr=new Map}getOverlay(e,t){return V.resolve(this.overlays.get(t))}getOverlays(e,t){const s=kt();return V.forEach(t,(r=>this.getOverlay(e,r).next((o=>{o!==null&&s.set(r,o)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((r,o)=>{this.St(e,t,o)})),V.resolve()}removeOverlaysForBatchId(e,t,s){const r=this.Lr.get(s);return r!==void 0&&(r.forEach((o=>this.overlays=this.overlays.remove(o))),this.Lr.delete(s)),V.resolve()}getOverlaysForCollection(e,t,s){const r=kt(),o=t.length+1,a=new F(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===o&&u.largestBatchId>s&&r.set(u.getKey(),u)}return V.resolve(r)}getOverlaysForCollectionGroup(e,t,s,r){let o=new re(((h,p)=>h-p));const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>s){let p=o.get(h.largestBatchId);p===null&&(p=kt(),o=o.insert(h.largestBatchId,p)),p.set(h.getKey(),h)}}const l=kt(),u=o.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,p)=>l.set(h,p))),!(l.size()>=r)););return V.resolve(l)}St(e,t,s){const r=this.overlays.get(s.key);if(r!==null){const a=this.Lr.get(r.largestBatchId).delete(s.key);this.Lr.set(r.largestBatchId,a)}this.overlays=this.overlays.insert(s.key,new Op(t,s));let o=this.Lr.get(t);o===void 0&&(o=Q(),this.Lr.set(t,o)),this.Lr.set(t,o.add(s.key))}}/**
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
 */class wf{constructor(){this.sessionToken=be.EMPTY_BYTE_STRING}getSessionToken(e){return V.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,V.resolve()}}/**
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
 */class Pi{constructor(){this.kr=new pe(me.qr),this.Kr=new pe(me.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,t){const s=new me(e,t);this.kr=this.kr.add(s),this.Kr=this.Kr.add(s)}$r(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new me(e,t))}Qr(e,t){e.forEach((s=>this.removeReference(s,t)))}Gr(e){const t=new F(new te([])),s=new me(t,e),r=new me(t,e+1),o=[];return this.Kr.forEachInRange([s,r],(a=>{this.Wr(a),o.push(a.key)})),o}zr(){this.kr.forEach((e=>this.Wr(e)))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const t=new F(new te([])),s=new me(t,e),r=new me(t,e+1);let o=Q();return this.Kr.forEachInRange([s,r],(a=>{o=o.add(a.key)})),o}containsKey(e){const t=new me(e,0),s=this.kr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class me{constructor(e,t){this.key=e,this.Jr=t}static qr(e,t){return F.comparator(e.key,t.key)||K(e.Jr,t.Jr)}static Ur(e,t){return K(e.Jr,t.Jr)||F.comparator(e.key,t.key)}}/**
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
 */class _f{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Yn=1,this.Hr=new pe(me.qr)}checkEmpty(e){return V.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,r){const o=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Lp(o,t,s,r);this.mutationQueue.push(a);for(const l of r)this.Hr=this.Hr.add(new me(l.key,o)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return V.resolve(a)}lookupMutationBatch(e,t){return V.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,r=this.Xr(s),o=r<0?0:r;return V.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return V.resolve(this.mutationQueue.length===0?xi:this.Yn-1)}getAllMutationBatches(e){return V.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new me(t,0),r=new me(t,Number.POSITIVE_INFINITY),o=[];return this.Hr.forEachInRange([s,r],(a=>{const l=this.Zr(a.Jr);o.push(l)})),V.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new pe(K);return t.forEach((r=>{const o=new me(r,0),a=new me(r,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([o,a],(l=>{s=s.add(l.Jr)}))})),V.resolve(this.Yr(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,r=s.length+1;let o=s;F.isDocumentKey(o)||(o=o.child(""));const a=new me(new F(o),0);let l=new pe(K);return this.Hr.forEachWhile((u=>{const h=u.key.path;return!!s.isPrefixOf(h)&&(h.length===r&&(l=l.add(u.Jr)),!0)}),a),V.resolve(this.Yr(l))}Yr(e){const t=[];return e.forEach((s=>{const r=this.Zr(s);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){Z(this.ei(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Hr;return V.forEach(t.mutations,(r=>{const o=new me(r.key,t.batchId);return s=s.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Hr=s}))}nr(e){}containsKey(e,t){const s=new me(t,0),r=this.Hr.firstAfterOrEqual(s);return V.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,V.resolve()}ei(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Ef{constructor(e){this.ti=e,this.docs=(function(){return new re(F.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,r=this.docs.get(s),o=r?r.size:0,a=this.ti(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return V.resolve(s?s.document.mutableCopy():we.newInvalidDocument(t))}getEntries(e,t){let s=Qe();return t.forEach((r=>{const o=this.docs.get(r);s=s.insert(r,o?o.document.mutableCopy():we.newInvalidDocument(r))})),V.resolve(s)}getDocumentsMatchingQuery(e,t,s,r){let o=Qe();const a=t.path,l=new F(a.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:p}}=u.getNext();if(!a.isPrefixOf(h.path))break;h.path.length>a.length+1||Qh(Kh(p),s)<=0||(r.has(p.key)||Ys(t,p))&&(o=o.insert(p.key,p.mutableCopy()))}return V.resolve(o)}getAllFromCollectionGroup(e,t,s,r){j(9500)}ni(e,t){return V.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new kf(this)}getSize(e){return V.resolve(this.size)}}class kf extends gf{constructor(e){super(),this.Mr=e}applyChanges(e){const t=[];return this.changes.forEach(((s,r)=>{r.isValidDocument()?t.push(this.Mr.addEntry(e,r)):this.Mr.removeEntry(s)})),V.waitFor(t)}getFromCache(e,t){return this.Mr.getEntry(e,t)}getAllFromCache(e,t){return this.Mr.getEntries(e,t)}}/**
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
 */class Tf{constructor(e){this.persistence=e,this.ri=new Ct((t=>Ei(t)),ki),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.ii=0,this.si=new Pi,this.targetCount=0,this.oi=Qt._r()}forEachTarget(e,t){return this.ri.forEach(((s,r)=>t(r))),V.resolve()}getLastRemoteSnapshotVersion(e){return V.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return V.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),V.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.ii&&(this.ii=t),V.resolve()}lr(e){this.ri.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.oi=new Qt(t),this.highestTargetId=t),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,t){return this.lr(t),this.targetCount+=1,V.resolve()}updateTargetData(e,t){return this.lr(t),V.resolve()}removeTargetData(e,t){return this.ri.delete(t.target),this.si.Gr(t.targetId),this.targetCount-=1,V.resolve()}removeTargets(e,t,s){let r=0;const o=[];return this.ri.forEach(((a,l)=>{l.sequenceNumber<=t&&s.get(l.targetId)===null&&(this.ri.delete(a),o.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)})),V.waitFor(o).next((()=>r))}getTargetCount(e){return V.resolve(this.targetCount)}getTargetData(e,t){const s=this.ri.get(t)||null;return V.resolve(s)}addMatchingKeys(e,t,s){return this.si.$r(t,s),V.resolve()}removeMatchingKeys(e,t,s){this.si.Qr(t,s);const r=this.persistence.referenceDelegate,o=[];return r&&t.forEach((a=>{o.push(r.markPotentiallyOrphaned(e,a))})),V.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this.si.Gr(t),V.resolve()}getMatchingKeysForTargetId(e,t){const s=this.si.jr(t);return V.resolve(s)}containsKey(e,t){return V.resolve(this.si.containsKey(t))}}/**
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
 */class Cc{constructor(e,t){this._i={},this.overlays={},this.ai=new Gs(0),this.ui=!1,this.ui=!0,this.ci=new wf,this.referenceDelegate=e(this),this.li=new Tf(this),this.indexManager=new uf,this.remoteDocumentCache=(function(r){return new Ef(r)})((s=>this.referenceDelegate.hi(s))),this.serializer=new lf(t),this.Pi=new vf(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new xf,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this._i[e.toKey()];return s||(s=new _f(t,this.referenceDelegate),this._i[e.toKey()]=s),s}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,t,s){M("MemoryPersistence","Starting transaction:",e);const r=new If(this.ai.next());return this.referenceDelegate.Ti(),s(r).next((o=>this.referenceDelegate.Ei(r).next((()=>o)))).toPromise().then((o=>(r.raiseOnCommittedEvent(),o)))}Ii(e,t){return V.or(Object.values(this._i).map((s=>()=>s.containsKey(e,t))))}}class If extends Jh{constructor(e){super(),this.currentSequenceNumber=e}}class Vi{constructor(e){this.persistence=e,this.Ri=new Pi,this.Ai=null}static Vi(e){return new Vi(e)}get di(){if(this.Ai)return this.Ai;throw j(60996)}addReference(e,t,s){return this.Ri.addReference(s,t),this.di.delete(s.toString()),V.resolve()}removeReference(e,t,s){return this.Ri.removeReference(s,t),this.di.add(s.toString()),V.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),V.resolve()}removeTarget(e,t){this.Ri.Gr(t.targetId).forEach((r=>this.di.add(r.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((o=>this.di.add(o.toString())))})).next((()=>s.removeTargetData(e,t)))}Ti(){this.Ai=new Set}Ei(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return V.forEach(this.di,(s=>{const r=F.fromPath(s);return this.mi(e,r).next((o=>{o||t.removeEntry(r,U.min())}))})).next((()=>(this.Ai=null,t.apply(e))))}updateLimboDocument(e,t){return this.mi(e,t).next((s=>{s?this.di.delete(t.toString()):this.di.add(t.toString())}))}hi(e){return 0}mi(e,t){return V.or([()=>V.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class Ns{constructor(e,t){this.persistence=e,this.fi=new Ct((s=>ep(s.path)),((s,r)=>s.isEqual(r))),this.garbageCollector=mf(this,t)}static Vi(e,t){return new Ns(e,t)}Ti(){}Ei(e){return V.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((r=>s+r))))}pr(e){let t=0;return this.mr(e,(s=>{t++})).next((()=>t))}mr(e,t){return V.forEach(this.fi,((s,r)=>this.wr(e,s,r).next((o=>o?V.resolve():t(r)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const r=this.persistence.getRemoteDocumentCache(),o=r.newChangeBuffer();return r.ni(e,(a=>this.wr(e,a,t).next((l=>{l||(s++,o.removeEntry(a,U.min()))})))).next((()=>o.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.fi.set(t,e.currentSequenceNumber),V.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),V.resolve()}removeReference(e,t,s){return this.fi.set(s,e.currentSequenceNumber),V.resolve()}updateLimboDocument(e,t){return this.fi.set(t,e.currentSequenceNumber),V.resolve()}hi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ws(e.data.value)),t}wr(e,t,s){return V.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.fi.get(t);return V.resolve(r!==void 0&&r>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Di{constructor(e,t,s,r){this.targetId=e,this.fromCache=t,this.Ts=s,this.Es=r}static Is(e,t){let s=Q(),r=Q();for(const o of t.docChanges)switch(o.type){case 0:s=s.add(o.doc.key);break;case 1:r=r.add(o.doc.key)}return new Di(e,t.fromCache,s,r)}}/**
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
 */class Af{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Sf{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=(function(){return pd()?8:Xh(dd())>0?6:4})()}initialize(e,t){this.fs=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,s,r){const o={result:null};return this.gs(e,t).next((a=>{o.result=a})).next((()=>{if(!o.result)return this.ps(e,t,r,s).next((a=>{o.result=a}))})).next((()=>{if(o.result)return;const a=new Af;return this.ys(e,t,a).next((l=>{if(o.result=l,this.As)return this.ws(e,t,a,l.size)}))})).next((()=>o.result))}ws(e,t,s,r){return s.documentReadCount<this.Vs?(Lt()<=X.DEBUG&&M("QueryEngine","SDK will not create cache indexes for query:",Ot(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),V.resolve()):(Lt()<=X.DEBUG&&M("QueryEngine","Query:",Ot(t),"scans",s.documentReadCount,"local documents and returns",r,"documents as results."),s.documentReadCount>this.ds*r?(Lt()<=X.DEBUG&&M("QueryEngine","The SDK decides to create cache indexes for query:",Ot(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Fe(t))):V.resolve())}gs(e,t){if(Va(t))return V.resolve(null);let s=Fe(t);return this.indexManager.getIndexType(e,s).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=ii(t,null,"F"),s=Fe(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const a=Q(...o);return this.fs.getDocuments(e,a).next((l=>this.indexManager.getMinOffset(e,s).next((u=>{const h=this.Ss(t,l);return this.bs(t,h,a,u.readTime)?this.gs(e,ii(t,null,"F")):this.Ds(e,h,t,u)}))))})))))}ps(e,t,s,r){return Va(t)||r.isEqual(U.min())?V.resolve(null):this.fs.getDocuments(e,s).next((o=>{const a=this.Ss(t,o);return this.bs(t,a,s,r)?V.resolve(null):(Lt()<=X.DEBUG&&M("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Ot(t)),this.Ds(e,a,t,Wh(r,Nn)).next((l=>l)))}))}Ss(e,t){let s=new pe(ic(e));return t.forEach(((r,o)=>{Ys(e,o)&&(s=s.add(o))})),s}bs(e,t,s,r){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(r)>0)}ys(e,t,s){return Lt()<=X.DEBUG&&M("QueryEngine","Using full collection scan to execute query:",Ot(t)),this.fs.getDocumentsMatchingQuery(e,t,ct.min(),s)}Ds(e,t,s,r){return this.fs.getDocumentsMatchingQuery(e,s,r).next((o=>(t.forEach((a=>{o=o.insert(a.key,a)})),o)))}}/**
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
 */const $i="LocalStore",Cf=3e8;class Rf{constructor(e,t,s,r){this.persistence=e,this.Cs=t,this.serializer=r,this.vs=new re(K),this.Fs=new Ct((o=>Ei(o)),ki),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(s)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new bf(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.vs)))}}function Pf(n,e,t,s){return new Rf(n,e,t,s)}async function Rc(n,e){const t=q(n);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let r;return t.mutationQueue.getAllMutationBatches(s).next((o=>(r=o,t.Os(e),t.mutationQueue.getAllMutationBatches(s)))).next((o=>{const a=[],l=[];let u=Q();for(const h of r){a.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}for(const h of o){l.push(h.batchId);for(const p of h.mutations)u=u.add(p.key)}return t.localDocuments.getDocuments(s,u).next((h=>({Ns:h,removedBatchIds:a,addedBatchIds:l})))}))}))}function Vf(n,e){const t=q(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const r=e.batch.keys(),o=t.xs.newChangeBuffer({trackRemovals:!0});return(function(l,u,h,p){const m=h.batch,b=m.keys();let w=V.resolve();return b.forEach((A=>{w=w.next((()=>p.getEntry(u,A))).next((C=>{const R=h.docVersions.get(A);Z(R!==null,48541),C.version.compareTo(R)<0&&(m.applyToRemoteDocument(C,h),C.isValidDocument()&&(C.setReadTime(h.commitVersion),p.addEntry(C)))}))})),w.next((()=>l.mutationQueue.removeMutationBatch(u,m)))})(t,s,e,o).next((()=>o.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(l){let u=Q();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(s,r)))}))}function Pc(n){const e=q(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.li.getLastRemoteSnapshotVersion(t)))}function Df(n,e){const t=q(n),s=e.snapshotVersion;let r=t.vs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const a=t.xs.newChangeBuffer({trackRemovals:!0});r=t.vs;const l=[];e.targetChanges.forEach(((p,m)=>{const b=r.get(m);if(!b)return;l.push(t.li.removeMatchingKeys(o,p.removedDocuments,m).next((()=>t.li.addMatchingKeys(o,p.addedDocuments,m))));let w=b.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(m)!==null?w=w.withResumeToken(be.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):p.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(p.resumeToken,s)),r=r.insert(m,w),(function(C,R,N){return C.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-C.snapshotVersion.toMicroseconds()>=Cf?!0:N.addedDocuments.size+N.modifiedDocuments.size+N.removedDocuments.size>0})(b,w,p)&&l.push(t.li.updateTargetData(o,w))}));let u=Qe(),h=Q();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(o,p))})),l.push($f(o,a,e.documentUpdates).next((p=>{u=p.Bs,h=p.Ls}))),!s.isEqual(U.min())){const p=t.li.getLastRemoteSnapshotVersion(o).next((m=>t.li.setTargetsMetadata(o,o.currentSequenceNumber,s)));l.push(p)}return V.waitFor(l).next((()=>a.apply(o))).next((()=>t.localDocuments.getLocalViewOfDocuments(o,u,h))).next((()=>u))})).then((o=>(t.vs=r,o)))}function $f(n,e,t){let s=Q(),r=Q();return t.forEach((o=>s=s.add(o))),e.getEntries(n,s).next((o=>{let a=Qe();return t.forEach(((l,u)=>{const h=o.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(r=r.add(l)),u.isNoDocument()&&u.version.isEqual(U.min())?(e.removeEntry(l,u.readTime),a=a.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),a=a.insert(l,u)):M($i,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)})),{Bs:a,Ls:r}}))}function Mf(n,e){const t=q(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=xi),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function Nf(n,e){const t=q(n);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let r;return t.li.getTargetData(s,e).next((o=>o?(r=o,V.resolve(r)):t.li.allocateTargetId(s).next((a=>(r=new rt(e,a,"TargetPurposeListen",s.currentSequenceNumber),t.li.addTargetData(s,r).next((()=>r)))))))})).then((s=>{const r=t.vs.get(s.targetId);return(r===null||s.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.vs=t.vs.insert(s.targetId,s),t.Fs.set(e,s.targetId)),s}))}async function ui(n,e,t){const s=q(n),r=s.vs.get(e),o=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",o,(a=>s.persistence.referenceDelegate.removeTarget(a,r)))}catch(a){if(!sn(a))throw a;M($i,`Failed to update sequence numbers for target ${e}: ${a}`)}s.vs=s.vs.remove(e),s.Fs.delete(r.target)}function Ha(n,e,t){const s=q(n);let r=U.min(),o=Q();return s.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,h,p){const m=q(u),b=m.Fs.get(p);return b!==void 0?V.resolve(m.vs.get(b)):m.li.getTargetData(h,p)})(s,a,Fe(e)).next((l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,s.li.getMatchingKeysForTargetId(a,l.targetId).next((u=>{o=u}))})).next((()=>s.Cs.getDocumentsMatchingQuery(a,e,t?r:U.min(),t?o:Q()))).next((l=>(Lf(s,wp(e),l),{documents:l,ks:o})))))}function Lf(n,e,t){let s=n.Ms.get(e)||U.min();t.forEach(((r,o)=>{o.readTime.compareTo(s)>0&&(s=o.readTime)})),n.Ms.set(e,s)}class Ga{constructor(){this.activeTargetIds=Ap()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Of{constructor(){this.vo=new Ga,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,t,s){this.Fo[e]=t}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new Ga,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Ff{Mo(e){}shutdown(){}}/**
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
 */const Wa="ConnectivityMonitor";class Ka{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){M(Wa,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){M(Wa,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let gs=null;function di(){return gs===null?gs=(function(){return 268435456+Math.round(2147483648*Math.random())})():gs++,"0x"+gs.toString(16)}/**
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
 */const Fr="RestConnection",Bf={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class jf{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Ko=t+"://"+e.host,this.Uo=`projects/${s}/databases/${r}`,this.$o=this.databaseId.database===Rs?`project_id=${s}`:`project_id=${s}&database_id=${r}`}Wo(e,t,s,r,o){const a=di(),l=this.Qo(e,t.toUriEncodedString());M(Fr,`Sending RPC '${e}' ${a}:`,l,s);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(u,r,o);const{host:h}=new URL(l),p=Il(h);return this.zo(e,l,u,s,p).then((m=>(M(Fr,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw Ht(Fr,`RPC '${e}' ${a} failed with error: `,m,"url: ",l,"request:",s),m}))}jo(e,t,s,r,o,a){return this.Wo(e,t,s,r,o)}Go(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+tn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,o)=>e[o]=r)),s&&s.headers.forEach(((r,o)=>e[o]=r))}Qo(e,t){const s=Bf[e];let r=`${this.Ko}/v1/${t}:${s}`;return this.databaseInfo.apiKey&&(r=`${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),r}terminate(){}}/**
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
 */class Uf{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
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
 */const xe="WebChannelConnection",En=(n,e,t)=>{n.listen(e,(s=>{try{t(s)}catch(r){setTimeout((()=>{throw r}),0)}}))};class Ut extends jf{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!Ut.c_){const e=Nl();En(e,Ml.STAT_EVENT,(t=>{t.stat===Xr.PROXY?M(xe,"STAT_EVENT: detected buffering proxy"):t.stat===Xr.NOPROXY&&M(xe,"STAT_EVENT: detected no buffering proxy")})),Ut.c_=!0}}zo(e,t,s,r,o){const a=di();return new Promise(((l,u)=>{const h=new Dl;h.setWithCredentials(!0),h.listenOnce($l.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case xs.NO_ERROR:const m=h.getResponseJson();M(xe,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),l(m);break;case xs.TIMEOUT:M(xe,`RPC '${e}' ${a} timed out`),u(new $(P.DEADLINE_EXCEEDED,"Request time out"));break;case xs.HTTP_ERROR:const b=h.getStatus();if(M(xe,`RPC '${e}' ${a} failed with status:`,b,"response text:",h.getResponseText()),b>0){let w=h.getResponseJson();Array.isArray(w)&&(w=w[0]);const A=w==null?void 0:w.error;if(A&&A.status&&A.message){const C=(function(N){const L=N.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(L)>=0?L:P.UNKNOWN})(A.status);u(new $(C,A.message))}else u(new $(P.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new $(P.UNAVAILABLE,"Connection failed."));break;default:j(9055,{l_:e,streamId:a,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{M(xe,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(r);M(xe,`RPC '${e}' ${a} sending request:`,r),h.send(t,"POST",p,s,15)}))}T_(e,t,s){const r=di(),o=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Go(l.initMessageHeaders,t,s),l.encodeInitMessageHeaders=!0;const h=o.join("");M(xe,`Creating RPC '${e}' stream ${r}: ${h}`,l);const p=a.createWebChannel(h,l);this.E_(p);let m=!1,b=!1;const w=new Uf({Jo:A=>{b?M(xe,`Not sending because RPC '${e}' stream ${r} is closed:`,A):(m||(M(xe,`Opening RPC '${e}' stream ${r} transport.`),p.open(),m=!0),M(xe,`RPC '${e}' stream ${r} sending:`,A),p.send(A))},Ho:()=>p.close()});return En(p,kn.EventType.OPEN,(()=>{b||(M(xe,`RPC '${e}' stream ${r} transport opened.`),w.i_())})),En(p,kn.EventType.CLOSE,(()=>{b||(b=!0,M(xe,`RPC '${e}' stream ${r} transport closed`),w.o_(),this.I_(p))})),En(p,kn.EventType.ERROR,(A=>{b||(b=!0,Ht(xe,`RPC '${e}' stream ${r} transport errored. Name:`,A.name,"Message:",A.message),w.o_(new $(P.UNAVAILABLE,"The operation could not be completed")))})),En(p,kn.EventType.MESSAGE,(A=>{var C;if(!b){const R=A.data[0];Z(!!R,16349);const N=R,L=(N==null?void 0:N.error)||((C=N[0])==null?void 0:C.error);if(L){M(xe,`RPC '${e}' stream ${r} received error:`,L);const W=L.status;let z=(function(_){const y=le[_];if(y!==void 0)return gc(y)})(W),H=L.message;W==="NOT_FOUND"&&H.includes("database")&&H.includes("does not exist")&&H.includes(this.databaseId.database)&&Ht(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),z===void 0&&(z=P.INTERNAL,H="Unknown error status: "+W+" with message "+L.message),b=!0,w.o_(new $(z,H)),p.close()}else M(xe,`RPC '${e}' stream ${r} received:`,R),w.__(R)}})),Ut.u_(),setTimeout((()=>{w.s_()}),0),w}terminate(){this.a_.forEach((e=>e.close())),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter((t=>t===e))}Go(e,t,s){super.Go(e,t,s),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Ll()}}/**
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
 */function zf(n){return new Ut(n)}function Br(){return typeof document<"u"?document:null}/**
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
 */function er(n){return new Wp(n,!0)}/**
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
 */Ut.c_=!1;class Vc{constructor(e,t,s=1e3,r=1.5,o=6e4){this.Ci=e,this.timerId=t,this.R_=s,this.A_=r,this.V_=o,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),s=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-s);r>0&&M("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,r,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
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
 */const Qa="PersistentStream";class Dc{constructor(e,t,s,r,o,a,l,u){this.Ci=e,this.S_=s,this.b_=r,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Vc(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(Ke(t.toString()),Ke("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(t)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,r])=>{this.D_===t&&this.G_(s,r)}),(s=>{e((()=>{const r=new $(P.UNKNOWN,"Fetching auth token failed: "+s.message);return this.z_(r)}))}))}G_(e,t){const s=this.Q_(this.D_);this.stream=this.j_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.Yo((()=>{s((()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.Yo())))})),this.stream.t_((r=>{s((()=>this.z_(r)))})),this.stream.onMessage((r=>{s((()=>++this.F_==1?this.J_(r):this.onNext(r)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return M(Qa,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return t=>{this.Ci.enqueueAndForget((()=>this.D_===e?t():(M(Qa,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class qf extends Dc{constructor(e,t,s,r,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,r,a),this.serializer=o}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=Yp(this.serializer,e),s=(function(o){if(!("targetChange"in o))return U.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?Be(a.readTime):U.min()})(e);return this.listener.H_(t,s)}Z_(e){const t={};t.database=ci(this.serializer),t.addTarget=(function(o,a){let l;const u=a.target;if(l=si(u)?{documents:Zp(o,u)}:{query:ef(o,u).ft},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=vc(o,a.resumeToken);const h=oi(o,a.expectedCount);h!==null&&(l.expectedCount=h)}else if(a.snapshotVersion.compareTo(U.min())>0){l.readTime=Ms(o,a.snapshotVersion.toTimestamp());const h=oi(o,a.expectedCount);h!==null&&(l.expectedCount=h)}return l})(this.serializer,e);const s=nf(this.serializer,e);s&&(t.labels=s),this.q_(t)}X_(e){const t={};t.database=ci(this.serializer),t.removeTarget=e,this.q_(t)}}class Hf extends Dc{constructor(e,t,s,r,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,r,a),this.serializer=o}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return Z(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Z(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){Z(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=Xp(e.writeResults,e.commitTime),s=Be(e.commitTime);return this.listener.na(s,t)}ra(){const e={};e.database=ci(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>Jp(this.serializer,s)))};this.q_(t)}}/**
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
 */class Gf{}class Wf extends Gf{constructor(e,t,s,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new $(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.Wo(e,ai(t,s),r,o,a))).catch((o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new $(P.UNKNOWN,o.toString())}))}jo(e,t,s,r,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,l])=>this.connection.jo(e,ai(t,s),r,a,l,o))).catch((a=>{throw a.name==="FirebaseError"?(a.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new $(P.UNKNOWN,a.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}function Kf(n,e,t,s){return new Wf(n,e,t,s)}class Qf{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Ke(t),this.aa=!1):M("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const St="RemoteStore";class Yf{constructor(e,t,s,r,o){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=o,this.Aa.Mo((a=>{s.enqueueAndForget((async()=>{Rt(this)&&(M(St,"Restarting streams for network reachability change."),await(async function(u){const h=q(u);h.Ia.add(4),await Kn(h),h.Va.set("Unknown"),h.Ia.delete(4),await tr(h)})(this))}))})),this.Va=new Qf(s,r)}}async function tr(n){if(Rt(n))for(const e of n.Ra)await e(!0)}async function Kn(n){for(const e of n.Ra)await e(!1)}function $c(n,e){const t=q(n);t.Ea.has(e.targetId)||(t.Ea.set(e.targetId,e),Oi(t)?Li(t):rn(t).O_()&&Ni(t,e))}function Mi(n,e){const t=q(n),s=rn(t);t.Ea.delete(e),s.O_()&&Mc(t,e),t.Ea.size===0&&(s.O_()?s.L_():Rt(t)&&t.Va.set("Unknown"))}function Ni(n,e){if(n.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}rn(n).Z_(e)}function Mc(n,e){n.da.$e(e),rn(n).X_(e)}function Li(n){n.da=new zp({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),At:e=>n.Ea.get(e)||null,ht:()=>n.datastore.serializer.databaseId}),rn(n).start(),n.Va.ua()}function Oi(n){return Rt(n)&&!rn(n).x_()&&n.Ea.size>0}function Rt(n){return q(n).Ia.size===0}function Nc(n){n.da=void 0}async function Jf(n){n.Va.set("Online")}async function Xf(n){n.Ea.forEach(((e,t)=>{Ni(n,e)}))}async function Zf(n,e){Nc(n),Oi(n)?(n.Va.ha(e),Li(n)):n.Va.set("Unknown")}async function em(n,e,t){if(n.Va.set("Online"),e instanceof bc&&e.state===2&&e.cause)try{await(async function(r,o){const a=o.cause;for(const l of o.targetIds)r.Ea.has(l)&&(await r.remoteSyncer.rejectListen(l,a),r.Ea.delete(l),r.da.removeTarget(l))})(n,e)}catch(s){M(St,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Ls(n,s)}else if(e instanceof ks?n.da.Xe(e):e instanceof yc?n.da.st(e):n.da.tt(e),!t.isEqual(U.min()))try{const s=await Pc(n.localStore);t.compareTo(s)>=0&&await(function(o,a){const l=o.da.Tt(a);return l.targetChanges.forEach(((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const p=o.Ea.get(h);p&&o.Ea.set(h,p.withResumeToken(u.resumeToken,a))}})),l.targetMismatches.forEach(((u,h)=>{const p=o.Ea.get(u);if(!p)return;o.Ea.set(u,p.withResumeToken(be.EMPTY_BYTE_STRING,p.snapshotVersion)),Mc(o,u);const m=new rt(p.target,u,h,p.sequenceNumber);Ni(o,m)})),o.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(s){M(St,"Failed to raise snapshot:",s),await Ls(n,s)}}async function Ls(n,e,t){if(!sn(e))throw e;n.Ia.add(1),await Kn(n),n.Va.set("Offline"),t||(t=()=>Pc(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{M(St,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await tr(n)}))}function Lc(n,e){return e().catch((t=>Ls(n,t,e)))}async function nr(n){const e=q(n),t=pt(e);let s=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:xi;for(;tm(e);)try{const r=await Mf(e.localStore,s);if(r===null){e.Ta.length===0&&t.L_();break}s=r.batchId,nm(e,r)}catch(r){await Ls(e,r)}Oc(e)&&Fc(e)}function tm(n){return Rt(n)&&n.Ta.length<10}function nm(n,e){n.Ta.push(e);const t=pt(n);t.O_()&&t.Y_&&t.ea(e.mutations)}function Oc(n){return Rt(n)&&!pt(n).x_()&&n.Ta.length>0}function Fc(n){pt(n).start()}async function sm(n){pt(n).ra()}async function rm(n){const e=pt(n);for(const t of n.Ta)e.ea(t.mutations)}async function im(n,e,t){const s=n.Ta.shift(),r=Si.from(s,e,t);await Lc(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await nr(n)}async function om(n,e){e&&pt(n).Y_&&await(async function(s,r){if((function(a){return Bp(a)&&a!==P.ABORTED})(r.code)){const o=s.Ta.shift();pt(s).B_(),await Lc(s,(()=>s.remoteSyncer.rejectFailedWrite(o.batchId,r))),await nr(s)}})(n,e),Oc(n)&&Fc(n)}async function Ya(n,e){const t=q(n);t.asyncQueue.verifyOperationInProgress(),M(St,"RemoteStore received new credentials");const s=Rt(t);t.Ia.add(3),await Kn(t),s&&t.Va.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await tr(t)}async function am(n,e){const t=q(n);e?(t.Ia.delete(2),await tr(t)):e||(t.Ia.add(2),await Kn(t),t.Va.set("Unknown"))}function rn(n){return n.ma||(n.ma=(function(t,s,r){const o=q(t);return o.sa(),new qf(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:Jf.bind(null,n),Yo:Xf.bind(null,n),t_:Zf.bind(null,n),H_:em.bind(null,n)}),n.Ra.push((async e=>{e?(n.ma.B_(),Oi(n)?Li(n):n.Va.set("Unknown")):(await n.ma.stop(),Nc(n))}))),n.ma}function pt(n){return n.fa||(n.fa=(function(t,s,r){const o=q(t);return o.sa(),new Hf(s,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),Yo:sm.bind(null,n),t_:om.bind(null,n),ta:rm.bind(null,n),na:im.bind(null,n)}),n.Ra.push((async e=>{e?(n.fa.B_(),await nr(n)):(await n.fa.stop(),n.Ta.length>0&&(M(St,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))}))),n.fa}/**
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
 */class Fi{constructor(e,t,s,r,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=o,this.deferred=new He,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,o){const a=Date.now()+s,l=new Fi(e,t,a,r,o);return l.start(s),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new $(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Bi(n,e){if(Ke("AsyncQueue",`${e}: ${n}`),sn(n))return new $(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class zt{static emptySet(e){return new zt(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||F.comparator(t.key,s.key):(t,s)=>F.comparator(t.key,s.key),this.keyedMap=Tn(),this.sortedSet=new re(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof zt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,o=s.getNext().key;if(!r.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new zt;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
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
 */class Ja{constructor(){this.ga=new re(F.comparator)}track(e){const t=e.doc.key,s=this.ga.get(t);s?e.type!==0&&s.type===3?this.ga=this.ga.insert(t,e):e.type===3&&s.type!==1?this.ga=this.ga.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.ga=this.ga.remove(t):e.type===1&&s.type===2?this.ga=this.ga.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):j(63341,{Vt:e,pa:s}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Yt{constructor(e,t,s,r,o,a,l,u,h){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=r,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,s,r,o){const a=[];return t.forEach((l=>{a.push({type:0,doc:l})})),new Yt(e,t,zt.emptySet(t),a,s,r,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Qs(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==s[r].type||!t[r].doc.isEqual(s[r].doc))return!1;return!0}}/**
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
 */class lm{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class cm{constructor(){this.queries=Xa(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,s){const r=q(t),o=r.queries;r.queries=Xa(),o.forEach(((a,l)=>{for(const u of l.Sa)u.onError(s)}))})(this,new $(P.ABORTED,"Firestore shutting down"))}}function Xa(){return new Ct((n=>rc(n)),Qs)}async function Bc(n,e){const t=q(n);let s=3;const r=e.query;let o=t.queries.get(r);o?!o.ba()&&e.Da()&&(s=2):(o=new lm,s=e.Da()?0:1);try{switch(s){case 0:o.wa=await t.onListen(r,!0);break;case 1:o.wa=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(a){const l=Bi(a,`Initialization of query '${Ot(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,o),o.Sa.push(e),e.va(t.onlineState),o.wa&&e.Fa(o.wa)&&ji(t)}async function jc(n,e){const t=q(n),s=e.query;let r=3;const o=t.queries.get(s);if(o){const a=o.Sa.indexOf(e);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?r=e.Da()?0:1:!o.ba()&&e.Da()&&(r=2))}switch(r){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function um(n,e){const t=q(n);let s=!1;for(const r of e){const o=r.query,a=t.queries.get(o);if(a){for(const l of a.Sa)l.Fa(r)&&(s=!0);a.wa=r}}s&&ji(t)}function dm(n,e,t){const s=q(n),r=s.queries.get(e);if(r)for(const o of r.Sa)o.onError(t);s.queries.delete(e)}function ji(n){n.Ca.forEach((e=>{e.next()}))}var hi,Za;(Za=hi||(hi={})).Ma="default",Za.Cache="cache";class Uc{constructor(e,t,s){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=s||{}}Fa(e){if(!this.options.includeMetadataChanges){const s=[];for(const r of e.docChanges)r.type!==3&&s.push(r);e=new Yt(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const s=t!=="Offline";return(!this.options.qa||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=Yt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==hi.Cache}}/**
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
 */class zc{constructor(e){this.key=e}}class qc{constructor(e){this.key=e}}class hm{constructor(e,t){this.query=e,this.Za=t,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=Q(),this.mutatedKeys=Q(),this.eu=ic(e),this.tu=new zt(this.eu)}get nu(){return this.Za}ru(e,t){const s=t?t.iu:new Ja,r=t?t.tu:this.tu;let o=t?t.mutatedKeys:this.mutatedKeys,a=r,l=!1;const u=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,h=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((p,m)=>{const b=r.get(p),w=Ys(this.query,m)?m:null,A=!!b&&this.mutatedKeys.has(b.key),C=!!w&&(w.hasLocalMutations||this.mutatedKeys.has(w.key)&&w.hasCommittedMutations);let R=!1;b&&w?b.data.isEqual(w.data)?A!==C&&(s.track({type:3,doc:w}),R=!0):this.su(b,w)||(s.track({type:2,doc:w}),R=!0,(u&&this.eu(w,u)>0||h&&this.eu(w,h)<0)&&(l=!0)):!b&&w?(s.track({type:0,doc:w}),R=!0):b&&!w&&(s.track({type:1,doc:b}),R=!0,(u||h)&&(l=!0)),R&&(w?(a=a.add(w),o=C?o.add(p):o.delete(p)):(a=a.delete(p),o=o.delete(p)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),o=o.delete(p.key),s.track({type:1,doc:p})}return{tu:a,iu:s,bs:l,mutatedKeys:o}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,r){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort(((p,m)=>(function(w,A){const C=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return j(20277,{Vt:R})}};return C(w)-C(A)})(p.type,m.type)||this.eu(p.doc,m.doc))),this.ou(s),r=r??!1;const l=t&&!r?this._u():[],u=this.Ya.size===0&&this.current&&!r?1:0,h=u!==this.Xa;return this.Xa=u,a.length!==0||h?{snapshot:new Yt(this.query,e.tu,o,a,e.mutatedKeys,u===0,h,!1,!!s&&s.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Ja,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Za=this.Za.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Za=this.Za.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=Q(),this.tu.forEach((s=>{this.uu(s.key)&&(this.Ya=this.Ya.add(s.key))}));const t=[];return e.forEach((s=>{this.Ya.has(s)||t.push(new qc(s))})),this.Ya.forEach((s=>{e.has(s)||t.push(new zc(s))})),t}cu(e){this.Za=e.ks,this.Ya=Q();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Yt.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const Ui="SyncEngine";class pm{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class fm{constructor(e){this.key=e,this.hu=!1}}class mm{constructor(e,t,s,r,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=r,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new Ct((l=>rc(l)),Qs),this.Eu=new Map,this.Iu=new Set,this.Ru=new re(F.comparator),this.Au=new Map,this.Vu=new Pi,this.du={},this.mu=new Map,this.fu=Qt.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function gm(n,e,t=!0){const s=Yc(n);let r;const o=s.Tu.get(e);return o?(s.sharedClientState.addLocalQueryTarget(o.targetId),r=o.view.lu()):r=await Hc(s,e,t,!0),r}async function ym(n,e){const t=Yc(n);await Hc(t,e,!0,!1)}async function Hc(n,e,t,s){const r=await Nf(n.localStore,Fe(e)),o=r.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let l;return s&&(l=await bm(n,e,o,a==="current",r.resumeToken)),n.isPrimaryClient&&t&&$c(n.remoteStore,r),l}async function bm(n,e,t,s,r){n.pu=(m,b,w)=>(async function(C,R,N,L){let W=R.view.ru(N);W.bs&&(W=await Ha(C.localStore,R.query,!1).then((({documents:_})=>R.view.ru(_,W))));const z=L&&L.targetChanges.get(R.targetId),H=L&&L.targetMismatches.get(R.targetId)!=null,Y=R.view.applyChanges(W,C.isPrimaryClient,z,H);return tl(C,R.targetId,Y.au),Y.snapshot})(n,m,b,w);const o=await Ha(n.localStore,e,!0),a=new hm(e,o.ks),l=a.ru(o.documents),u=Wn.createSynthesizedTargetChangeForCurrentChange(t,s&&n.onlineState!=="Offline",r),h=a.applyChanges(l,n.isPrimaryClient,u);tl(n,t,h.au);const p=new pm(e,t,a);return n.Tu.set(e,p),n.Eu.has(t)?n.Eu.get(t).push(e):n.Eu.set(t,[e]),h.snapshot}async function vm(n,e,t){const s=q(n),r=s.Tu.get(e),o=s.Eu.get(r.targetId);if(o.length>1)return s.Eu.set(r.targetId,o.filter((a=>!Qs(a,e)))),void s.Tu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(r.targetId),s.sharedClientState.isActiveQueryTarget(r.targetId)||await ui(s.localStore,r.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(r.targetId),t&&Mi(s.remoteStore,r.targetId),pi(s,r.targetId)})).catch(nn)):(pi(s,r.targetId),await ui(s.localStore,r.targetId,!0))}async function xm(n,e){const t=q(n),s=t.Tu.get(e),r=t.Eu.get(s.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Mi(t.remoteStore,s.targetId))}async function wm(n,e,t){const s=Sm(n);try{const r=await(function(a,l){const u=q(a),h=se.now(),p=l.reduce(((w,A)=>w.add(A.key)),Q());let m,b;return u.persistence.runTransaction("Locally write mutations","readwrite",(w=>{let A=Qe(),C=Q();return u.xs.getEntries(w,p).next((R=>{A=R,A.forEach(((N,L)=>{L.isValidDocument()||(C=C.add(N))}))})).next((()=>u.localDocuments.getOverlayedDocuments(w,A))).next((R=>{m=R;const N=[];for(const L of l){const W=Mp(L,m.get(L.key).overlayedDocument);W!=null&&N.push(new gt(L.key,W,Yl(W.value.mapValue),Pe.exists(!0)))}return u.mutationQueue.addMutationBatch(w,h,N,l)})).next((R=>{b=R;const N=R.applyToLocalDocumentSet(m,C);return u.documentOverlayCache.saveOverlays(w,R.batchId,N)}))})).then((()=>({batchId:b.batchId,changes:ac(m)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(r.batchId),(function(a,l,u){let h=a.du[a.currentUser.toKey()];h||(h=new re(K)),h=h.insert(l,u),a.du[a.currentUser.toKey()]=h})(s,r.batchId,t),await Qn(s,r.changes),await nr(s.remoteStore)}catch(r){const o=Bi(r,"Failed to persist write");t.reject(o)}}async function Gc(n,e){const t=q(n);try{const s=await Df(t.localStore,e);e.targetChanges.forEach(((r,o)=>{const a=t.Au.get(o);a&&(Z(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?a.hu=!0:r.modifiedDocuments.size>0?Z(a.hu,14607):r.removedDocuments.size>0&&(Z(a.hu,42227),a.hu=!1))})),await Qn(t,s,e)}catch(s){await nn(s)}}function el(n,e,t){const s=q(n);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const r=[];s.Tu.forEach(((o,a)=>{const l=a.view.va(e);l.snapshot&&r.push(l.snapshot)})),(function(a,l){const u=q(a);u.onlineState=l;let h=!1;u.queries.forEach(((p,m)=>{for(const b of m.Sa)b.va(l)&&(h=!0)})),h&&ji(u)})(s.eventManager,e),r.length&&s.Pu.H_(r),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function _m(n,e,t){const s=q(n);s.sharedClientState.updateQueryState(e,"rejected",t);const r=s.Au.get(e),o=r&&r.key;if(o){let a=new re(F.comparator);a=a.insert(o,we.newNoDocument(o,U.min()));const l=Q().add(o),u=new Zs(U.min(),new Map,new re(K),a,l);await Gc(s,u),s.Ru=s.Ru.remove(o),s.Au.delete(e),zi(s)}else await ui(s.localStore,e,!1).then((()=>pi(s,e,t))).catch(nn)}async function Em(n,e){const t=q(n),s=e.batch.batchId;try{const r=await Vf(t.localStore,e);Kc(t,s,null),Wc(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Qn(t,r)}catch(r){await nn(r)}}async function km(n,e,t){const s=q(n);try{const r=await(function(a,l){const u=q(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let p;return u.mutationQueue.lookupMutationBatch(h,l).next((m=>(Z(m!==null,37113),p=m.keys(),u.mutationQueue.removeMutationBatch(h,m)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,p,l))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,p))).next((()=>u.localDocuments.getDocuments(h,p)))}))})(s.localStore,e);Kc(s,e,t),Wc(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Qn(s,r)}catch(r){await nn(r)}}function Wc(n,e){(n.mu.get(e)||[]).forEach((t=>{t.resolve()})),n.mu.delete(e)}function Kc(n,e,t){const s=q(n);let r=s.du[s.currentUser.toKey()];if(r){const o=r.get(e);o&&(t?o.reject(t):o.resolve(),r=r.remove(e)),s.du[s.currentUser.toKey()]=r}}function pi(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const s of n.Eu.get(e))n.Tu.delete(s),t&&n.Pu.yu(s,t);n.Eu.delete(e),n.isPrimaryClient&&n.Vu.Gr(e).forEach((s=>{n.Vu.containsKey(s)||Qc(n,s)}))}function Qc(n,e){n.Iu.delete(e.path.canonicalString());const t=n.Ru.get(e);t!==null&&(Mi(n.remoteStore,t),n.Ru=n.Ru.remove(e),n.Au.delete(t),zi(n))}function tl(n,e,t){for(const s of t)s instanceof zc?(n.Vu.addReference(s.key,e),Tm(n,s)):s instanceof qc?(M(Ui,"Document no longer in limbo: "+s.key),n.Vu.removeReference(s.key,e),n.Vu.containsKey(s.key)||Qc(n,s.key)):j(19791,{wu:s})}function Tm(n,e){const t=e.key,s=t.path.canonicalString();n.Ru.get(t)||n.Iu.has(s)||(M(Ui,"New document in limbo: "+t),n.Iu.add(s),zi(n))}function zi(n){for(;n.Iu.size>0&&n.Ru.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new F(te.fromString(e)),s=n.fu.next();n.Au.set(s,new fm(t)),n.Ru=n.Ru.insert(t,s),$c(n.remoteStore,new rt(Fe(Ti(t.path)),s,"TargetPurposeLimboResolution",Gs.ce))}}async function Qn(n,e,t){const s=q(n),r=[],o=[],a=[];s.Tu.isEmpty()||(s.Tu.forEach(((l,u)=>{a.push(s.pu(u,e,t).then((h=>{var p;if((h||t)&&s.isPrimaryClient){const m=h?!h.fromCache:(p=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:p.current;s.sharedClientState.updateQueryState(u.targetId,m?"current":"not-current")}if(h){r.push(h);const m=Di.Is(u.targetId,h);o.push(m)}})))})),await Promise.all(a),s.Pu.H_(r),await(async function(u,h){const p=q(u);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>V.forEach(h,(b=>V.forEach(b.Ts,(w=>p.persistence.referenceDelegate.addReference(m,b.targetId,w))).next((()=>V.forEach(b.Es,(w=>p.persistence.referenceDelegate.removeReference(m,b.targetId,w)))))))))}catch(m){if(!sn(m))throw m;M($i,"Failed to update sequence numbers: "+m)}for(const m of h){const b=m.targetId;if(!m.fromCache){const w=p.vs.get(b),A=w.snapshotVersion,C=w.withLastLimboFreeSnapshotVersion(A);p.vs=p.vs.insert(b,C)}}})(s.localStore,o))}async function Im(n,e){const t=q(n);if(!t.currentUser.isEqual(e)){M(Ui,"User change. New user:",e.toKey());const s=await Rc(t.localStore,e);t.currentUser=e,(function(o,a){o.mu.forEach((l=>{l.forEach((u=>{u.reject(new $(P.CANCELLED,a))}))})),o.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Qn(t,s.Ns)}}function Am(n,e){const t=q(n),s=t.Au.get(e);if(s&&s.hu)return Q().add(s.key);{let r=Q();const o=t.Eu.get(e);if(!o)return r;for(const a of o){const l=t.Tu.get(a);r=r.unionWith(l.view.nu)}return r}}function Yc(n){const e=q(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gc.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Am.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=_m.bind(null,e),e.Pu.H_=um.bind(null,e.eventManager),e.Pu.yu=dm.bind(null,e.eventManager),e}function Sm(n){const e=q(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Em.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=km.bind(null,e),e}class Os{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=er(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Pf(this.persistence,new Sf,e.initialUser,this.serializer)}Cu(e){return new Cc(Vi.Vi,this.serializer)}Du(e){return new Of}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Os.provider={build:()=>new Os};class Cm extends Os{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Z(this.persistence.referenceDelegate instanceof Ns,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new pf(s,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Ie.withCacheSize(this.cacheSizeBytes):Ie.DEFAULT;return new Cc((s=>Ns.Vi(s,t)),this.serializer)}}class fi{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>el(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Im.bind(null,this.syncEngine),await am(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new cm})()}createDatastore(e){const t=er(e.databaseInfo.databaseId),s=zf(e.databaseInfo);return Kf(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,r,o,a,l){return new Yf(s,r,o,a,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>el(this.syncEngine,t,0)),(function(){return Ka.v()?new Ka:new Ff})())}createSyncEngine(e,t){return(function(r,o,a,l,u,h,p){const m=new mm(r,o,a,l,u,h);return p&&(m.gu=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const o=q(r);M(St,"RemoteStore shutting down."),o.Ia.add(5),await Kn(o),o.Aa.shutdown(),o.Va.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}fi.provider={build:()=>new fi};/**
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
 */class Jc{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Ke("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const ft="FirestoreClient";class Rm{constructor(e,t,s,r,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this._databaseInfo=r,this.user=Te.UNAUTHENTICATED,this.clientId=vi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(s,(async a=>{M(ft,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(s,(a=>(M(ft,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new He;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=Bi(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function jr(n,e){n.asyncQueue.verifyOperationInProgress(),M(ft,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let s=t.initialUser;n.setCredentialChangeListener((async r=>{s.isEqual(r)||(await Rc(e.localStore,r),s=r)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function nl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Pm(n);M(ft,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((s=>Ya(e.remoteStore,s))),n.setAppCheckTokenChangeListener(((s,r)=>Ya(e.remoteStore,r))),n._onlineComponents=e}async function Pm(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){M(ft,"Using user provided OfflineComponentProvider");try{await jr(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===P.FAILED_PRECONDITION||r.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;Ht("Error using user provided cache. Falling back to memory cache: "+t),await jr(n,new Os)}}else M(ft,"Using default OfflineComponentProvider"),await jr(n,new Cm(void 0));return n._offlineComponents}async function Xc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(M(ft,"Using user provided OnlineComponentProvider"),await nl(n,n._uninitializedComponentsProvider._online)):(M(ft,"Using default OnlineComponentProvider"),await nl(n,new fi))),n._onlineComponents}function Vm(n){return Xc(n).then((e=>e.syncEngine))}async function Zc(n){const e=await Xc(n),t=e.eventManager;return t.onListen=gm.bind(null,e.syncEngine),t.onUnlisten=vm.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=ym.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=xm.bind(null,e.syncEngine),t}function Dm(n,e,t={}){const s=new He;return n.asyncQueue.enqueueAndForget((async()=>(function(o,a,l,u,h){const p=new Jc({next:b=>{p.Nu(),a.enqueueAndForget((()=>jc(o,m)));const w=b.docs.has(l);!w&&b.fromCache?h.reject(new $(P.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&b.fromCache&&u&&u.source==="server"?h.reject(new $(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(b)},error:b=>h.reject(b)}),m=new Uc(Ti(l.path),p,{includeMetadataChanges:!0,qa:!0});return Bc(o,m)})(await Zc(n),n.asyncQueue,e,t,s))),s.promise}function $m(n,e,t={}){const s=new He;return n.asyncQueue.enqueueAndForget((async()=>(function(o,a,l,u,h){const p=new Jc({next:b=>{p.Nu(),a.enqueueAndForget((()=>jc(o,m))),b.fromCache&&u.source==="server"?h.reject(new $(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(b)},error:b=>h.reject(b)}),m=new Uc(l,p,{includeMetadataChanges:!0,qa:!0});return Bc(o,m)})(await Zc(n),n.asyncQueue,e,t,s))),s.promise}function Mm(n,e){const t=new He;return n.asyncQueue.enqueueAndForget((async()=>wm(await Vm(n),e,t))),t.promise}/**
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
 */function eu(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Nm="ComponentProvider",sl=new Map;function Lm(n,e,t,s,r){return new sp(n,e,t,r.host,r.ssl,r.experimentalForceLongPolling,r.experimentalAutoDetectLongPolling,eu(r.experimentalLongPollingOptions),r.useFetchStreams,r.isUsingEmulator,s)}/**
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
 */const Om="firestore.googleapis.com",rl=!0;class il{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new $(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Om,this.ssl=rl}else this.host=e.host,this.ssl=e.ssl??rl;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Ac;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Sc)throw new $(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Gh("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=eu(e.experimentalLongPollingOptions??{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new $(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new $(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new $(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,r){return s.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class qi{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new il({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new $(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new $(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new il(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new Lh;switch(s.type){case"firstParty":return new Bh(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new $(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=sl.get(t);s&&(M(Nm,"Removing Datastore"),sl.delete(t),s.terminate())})(this),Promise.resolve()}}/**
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
 */class on{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new on(this.firestore,e,this._query)}}class ae{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new lt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ae(this.firestore,e,this._key)}toJSON(){return{type:ae._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(qn(t,ae._jsonSchema))return new ae(e,s||null,new F(te.fromString(t.referencePath)))}}ae._jsonSchemaVersion="firestore/documentReference/1.0",ae._jsonSchema={type:ue("string",ae._jsonSchemaVersion),referencePath:ue("string")};class lt extends on{constructor(e,t,s){super(e,t,Ti(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ae(this.firestore,null,new F(e))}withConverter(e){return new lt(this.firestore,e,this._path)}}function Hi(n,e,...t){if(n=Ge(n),Fl("collection","path",e),n instanceof qi){const s=te.fromString(e,...t);return ba(s),new lt(n,null,s)}{if(!(n instanceof ae||n instanceof lt))throw new $(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(te.fromString(e,...t));return ba(s),new lt(n.firestore,null,s)}}function qe(n,e,...t){if(n=Ge(n),arguments.length===1&&(e=vi.newId()),Fl("doc","path",e),n instanceof qi){const s=te.fromString(e,...t);return ya(s),new ae(n,null,new F(s))}{if(!(n instanceof ae||n instanceof lt))throw new $(P.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=n._path.child(te.fromString(e,...t));return ya(s),new ae(n.firestore,n instanceof lt?n.converter:null,new F(s))}}/**
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
 */const ol="AsyncQueue";class al{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Vc(this,"async_queue_retry"),this._c=()=>{const s=Br();s&&M(ol,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=Br();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Br();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new He;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!sn(e))throw e;M(ol,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((s=>{throw this.nc=s,this.rc=!1,Ke("INTERNAL UNHANDLED ERROR: ",ll(s)),s})).then((s=>(this.rc=!1,s))))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=Fi.createAndSchedule(this,e,t,s,(o=>this.hc(o)));return this.tc.push(r),r}uc(){this.nc&&j(47125,{Pc:ll(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ic(e){return this.Tc().then((()=>{this.tc.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function ll(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Pt extends qi{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new al,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new al(e),this._firestoreClient=void 0,await e}}}function Fm(n,e,t){t||(t=Rs);const s=yh(n,"firestore");if(s.isInitialized(t)){const r=s.getImmediate({identifier:t}),o=s.getOptions(t);if(As(o,e))return r;throw new $(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new $(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Sc)throw new $(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Il(e.host)&&vd(e.host),s.initialize({options:e,instanceIdentifier:t})}function Gi(n){if(n._terminated)throw new $(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Bm(n),n._firestoreClient}function Bm(n){var s,r,o,a;const e=n._freezeSettings(),t=Lm(n._databaseId,((s=n._app)==null?void 0:s.options.appId)||"",n._persistenceKey,(r=n._app)==null?void 0:r.options.apiKey,e);n._componentsProvider||(o=e.localCache)!=null&&o._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new Rm(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}})(n._componentsProvider))}/**
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
 */class Re{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Re(be.fromBase64String(e))}catch(t){throw new $(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Re(be.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Re._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(qn(e,Re._jsonSchema))return Re.fromBase64String(e.bytes)}}Re._jsonSchemaVersion="firestore/bytes/1.0",Re._jsonSchema={type:ue("string",Re._jsonSchemaVersion),bytes:ue("string")};/**
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
 */class Wi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new $(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ye(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class sr{constructor(e){this._methodName=e}}/**
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
 */class je{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new $(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new $(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return K(this._lat,e._lat)||K(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:je._jsonSchemaVersion}}static fromJSON(e){if(qn(e,je._jsonSchema))return new je(e.latitude,e.longitude)}}je._jsonSchemaVersion="firestore/geoPoint/1.0",je._jsonSchema={type:ue("string",je._jsonSchemaVersion),latitude:ue("number"),longitude:ue("number")};/**
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
 */class De{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,r){if(s.length!==r.length)return!1;for(let o=0;o<s.length;++o)if(s[o]!==r[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:De._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(qn(e,De._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new De(e.vectorValues);throw new $(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}De._jsonSchemaVersion="firestore/vectorValue/1.0",De._jsonSchema={type:ue("string",De._jsonSchemaVersion),vectorValues:ue("object")};/**
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
 */const jm=/^__.*__$/;class Um{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new gt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Gn(e,this.data,t,this.fieldTransforms)}}class tu{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return new gt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function nu(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw j(40011,{dataSource:n})}}class Ki{constructor(e,t,s,r,o,a){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=r,o===void 0&&this.Ac(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new Ki({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var r;const t=(r=this.path)==null?void 0:r.child(e),s=this.i({path:t,arrayElement:!1});return s.mc(e),s}fc(e){var r;const t=(r=this.path)==null?void 0:r.child(e),s=this.i({path:t,arrayElement:!1});return s.Ac(),s}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return Fs(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(nu(this.dataSource)&&jm.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class zm{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||er(e)}I(e,t,s,r=!1){return new Ki({dataSource:e,methodName:t,targetDoc:s,path:ye.emptyPath(),arrayElement:!1,hasConverter:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function rr(n){const e=n._freezeSettings(),t=er(n._databaseId);return new zm(n._databaseId,!!e.ignoreUndefinedProperties,t)}function su(n,e,t,s,r,o={}){const a=n.I(o.merge||o.mergeFields?2:0,e,t,r);Yi("Data must be an object, but it was:",a,s);const l=ru(s,a);let u,h;if(o.merge)u=new Ce(a.fieldMask),h=a.fieldTransforms;else if(o.mergeFields){const p=[];for(const m of o.mergeFields){const b=Jt(e,m,t);if(!a.contains(b))throw new $(P.INVALID_ARGUMENT,`Field '${b}' is specified in your field mask but missing from your input data.`);au(p,b)||p.push(b)}u=new Ce(p),h=a.fieldTransforms.filter((m=>u.covers(m.field)))}else u=null,h=a.fieldTransforms;return new Um(new Ae(l),u,h)}class ir extends sr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.yc(`${this._methodName}() can only appear at the top level of your update data`):e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ir}}class Qi extends sr{_toFieldTransform(e){return new Pp(e.path,new Bn)}isEqual(e){return e instanceof Qi}}function qm(n,e,t,s){const r=n.I(1,e,t);Yi("Data must be an object, but it was:",r,s);const o=[],a=Ae.empty();mt(s,((u,h)=>{const p=ou(e,u,t);h=Ge(h);const m=r.fc(p);if(h instanceof ir)o.push(p);else{const b=Yn(h,m);b!=null&&(o.push(p),a.set(p,b))}}));const l=new Ce(o);return new tu(a,l,r.fieldTransforms)}function Hm(n,e,t,s,r,o){const a=n.I(1,e,t),l=[Jt(e,s,t)],u=[r];if(o.length%2!=0)throw new $(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let b=0;b<o.length;b+=2)l.push(Jt(e,o[b])),u.push(o[b+1]);const h=[],p=Ae.empty();for(let b=l.length-1;b>=0;--b)if(!au(h,l[b])){const w=l[b];let A=u[b];A=Ge(A);const C=a.fc(w);if(A instanceof ir)h.push(w);else{const R=Yn(A,C);R!=null&&(h.push(w),p.set(w,R))}}const m=new Ce(h);return new tu(p,m,a.fieldTransforms)}function Gm(n,e,t,s=!1){return Yn(t,n.I(s?4:3,e))}function Yn(n,e){if(iu(n=Ge(n)))return Yi("Unsupported field value:",e,n),ru(n,e);if(n instanceof sr)return(function(s,r){if(!nu(r.dataSource))throw r.yc(`${s._methodName}() can only be used with update() and set()`);if(!r.path)throw r.yc(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(r);o&&r.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return(function(s,r){const o=[];let a=0;for(const l of s){let u=Yn(l,r.gc(a));u==null&&(u={nullValue:"NULL_VALUE"}),o.push(u),a++}return{arrayValue:{values:o}}})(n,e)}return(function(s,r){if((s=Ge(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Sp(r.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const o=se.fromDate(s);return{timestampValue:Ms(r.serializer,o)}}if(s instanceof se){const o=new se(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Ms(r.serializer,o)}}if(s instanceof je)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Re)return{bytesValue:vc(r.serializer,s._byteString)};if(s instanceof ae){const o=r.databaseId,a=s.firestore._databaseId;if(!a.isEqual(o))throw r.yc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Ri(s.firestore._databaseId||r.databaseId,s._key.path)}}if(s instanceof De)return(function(a,l){const u=a instanceof De?a.toArray():a;return{mapValue:{fields:{[Kl]:{stringValue:Ql},[Ps]:{arrayValue:{values:u.map((p=>{if(typeof p!="number")throw l.yc("VectorValues must only contain numeric values.");return Ii(l.serializer,p)}))}}}}}})(s,r);if(Ic(s))return s._toProto(r.serializer);throw r.yc(`Unsupported field value: ${Hs(s)}`)})(n,e)}function ru(n,e){const t={};return Ul(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):mt(n,((s,r)=>{const o=Yn(r,e.dc(s));o!=null&&(t[s]=o)})),{mapValue:{fields:t}}}function iu(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof se||n instanceof je||n instanceof Re||n instanceof ae||n instanceof sr||n instanceof De||Ic(n))}function Yi(n,e,t){if(!iu(t)||!Bl(t)){const s=Hs(t);throw s==="an object"?e.yc(n+" a custom object"):e.yc(n+" "+s)}}function Jt(n,e,t){if((e=Ge(e))instanceof Wi)return e._internalPath;if(typeof e=="string")return ou(n,e);throw Fs("Field path arguments must be of type string or ",n,!1,void 0,t)}const Wm=new RegExp("[~\\*/\\[\\]]");function ou(n,e,t){if(e.search(Wm)>=0)throw Fs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Wi(...e.split("."))._internalPath}catch{throw Fs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Fs(n,e,t,s,r){const o=s&&!s.isEmpty(),a=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(o||a)&&(u+=" (found",o&&(u+=` in field ${s}`),a&&(u+=` in document ${r}`),u+=")"),new $(P.INVALID_ARGUMENT,l+n+u)}function au(n,e){return n.some((t=>t.isEqual(e)))}/**
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
 */class Km{convertValue(e,t="none"){switch(ht(e)){case 0:return null;case 1:return e.booleanValue;case 2:return oe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(dt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw j(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return mt(e,((r,o)=>{s[r]=this.convertValue(o,t)})),s}convertVectorValue(e){var s,r,o;const t=(o=(r=(s=e.fields)==null?void 0:s[Ps].arrayValue)==null?void 0:r.values)==null?void 0:o.map((a=>oe(a.doubleValue)));return new De(t)}convertGeoPoint(e){return new je(oe(e.latitude),oe(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=Ks(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(Ln(e));default:return null}}convertTimestamp(e){const t=ut(e);return new se(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=te.fromString(e);Z(Tc(s),9688,{name:e});const r=new On(s.get(1),s.get(3)),o=new F(s.popFirst(5));return r.isEqual(t)||Ke(`Document ${o} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
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
 */class lu extends Km{constructor(e){super(),this.firestore=e}convertBytes(e){return new Re(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ae(this.firestore,null,t)}}function or(){return new Qi("serverTimestamp")}const cl="@firebase/firestore",ul="4.14.0";/**
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
 */class cu{constructor(e,t,s,r,o){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Qm(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Jt("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Qm extends cu{data(){return super.data()}}/**
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
 */function Ym(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new $(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ji{}class Jm extends Ji{}function Xm(n,e,...t){let s=[];e instanceof Ji&&s.push(e),s=s.concat(t),(function(o){const a=o.filter((u=>u instanceof Xi)).length,l=o.filter((u=>u instanceof ar)).length;if(a>1||a>0&&l>0)throw new $(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const r of s)n=r._apply(n);return n}class ar extends Jm{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new ar(e,t,s)}_apply(e){const t=this._parse(e);return uu(e._query,t),new on(e.firestore,e.converter,ri(e._query,t))}_parse(e){const t=rr(e.firestore);return(function(o,a,l,u,h,p,m){let b;if(h.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new $(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){hl(m,p);const A=[];for(const C of m)A.push(dl(u,o,C));b={arrayValue:{values:A}}}else b=dl(u,o,m)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||hl(m,p),b=Gm(l,a,m,p==="in"||p==="not-in");return ce.create(h,p,b)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Zm(n,e,t){const s=e,r=Jt("where",n);return ar._create(r,s,t)}class Xi extends Ji{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Xi(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:$e.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(r,o){let a=r;const l=o.getFlattenedFilters();for(const u of l)uu(a,u),a=ri(a,u)})(e._query,t),new on(e.firestore,e.converter,ri(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function dl(n,e,t){if(typeof(t=Ge(t))=="string"){if(t==="")throw new $(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!sc(e)&&t.indexOf("/")!==-1)throw new $(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(te.fromString(t));if(!F.isDocumentKey(s))throw new $(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Ia(n,new F(s))}if(t instanceof ae)return Ia(n,t._key);throw new $(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Hs(t)}.`)}function hl(n,e){if(!Array.isArray(n)||n.length===0)throw new $(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function uu(n,e){const t=(function(r,o){for(const a of r)for(const l of a.getFlattenedFilters())if(o.indexOf(l.op)>=0)return l.op;return null})(n.filters,(function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new $(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new $(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function du(n,e,t){let s;return s=n?n.toFirestore(e):e,s}class An{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class It extends cu{constructor(e,t,s,r,o,a){super(e,t,s,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ts(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(Jt("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new $(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=It._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}It._jsonSchemaVersion="firestore/documentSnapshot/1.0",It._jsonSchema={type:ue("string",It._jsonSchemaVersion),bundleSource:ue("string","DocumentSnapshot"),bundleName:ue("string"),bundle:ue("string")};class Ts extends It{data(e={}){return super.data(e)}}class qt{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new An(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new Ts(this._firestore,this._userDataWriter,s.key,s,new An(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new $(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,o){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map((l=>{const u=new Ts(r._firestore,r._userDataWriter,l.doc.key,l.doc,new An(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((l=>o||l.type!==3)).map((l=>{const u=new Ts(r._firestore,r._userDataWriter,l.doc.key,l.doc,new An(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let h=-1,p=-1;return l.type!==0&&(h=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),p=a.indexOf(l.doc.key)),{type:eg(l.type),doc:u,oldIndex:h,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new $(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=qt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=vi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach((o=>{o._document!==null&&(t.push(o._document),s.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),r.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function eg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return j(61501,{type:n})}}/**
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
 */qt._jsonSchemaVersion="firestore/querySnapshot/1.0",qt._jsonSchema={type:ue("string",qt._jsonSchemaVersion),bundleSource:ue("string","QuerySnapshot"),bundleName:ue("string"),bundle:ue("string")};/**
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
 */function Is(n){n=Ue(n,ae);const e=Ue(n.firestore,Pt),t=Gi(e);return Dm(t,n._key).then((s=>ng(e,n,s)))}function hu(n){n=Ue(n,on);const e=Ue(n.firestore,Pt),t=Gi(e),s=new lu(e);return Ym(n._query),$m(t,n._query).then((r=>new qt(e,s,n,r)))}function Zi(n,e,t){n=Ue(n,ae);const s=Ue(n.firestore,Pt),r=du(n.converter,e),o=rr(s);return lr(s,[su(o,"setDoc",n._key,r,n.converter!==null,t).toMutation(n._key,Pe.none())])}function mi(n,e,t,...s){n=Ue(n,ae);const r=Ue(n.firestore,Pt),o=rr(r);let a;return a=typeof(e=Ge(e))=="string"||e instanceof Wi?Hm(o,"updateDoc",n._key,e,t,s):qm(o,"updateDoc",n._key,e),lr(r,[a.toMutation(n._key,Pe.exists(!0))])}function pu(n){return lr(Ue(n.firestore,Pt),[new Ai(n._key,Pe.none())])}function tg(n,e){const t=Ue(n.firestore,Pt),s=qe(n),r=du(n.converter,e),o=rr(n.firestore);return lr(t,[su(o,"addDoc",s._key,r,n.converter!==null,{}).toMutation(s._key,Pe.exists(!1))]).then((()=>s))}function lr(n,e){const t=Gi(n);return Mm(t,e)}function ng(n,e,t){const s=t.docs.get(e._key),r=new lu(n);return new It(n,r,e._key,s,new An(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){Mh(wh),Ss(new $n("firestore",((s,{instanceIdentifier:r,options:o})=>{const a=s.getProvider("app").getImmediate(),l=new Pt(new Oh(s.getProvider("auth-internal")),new jh(a,s.getProvider("app-check-internal")),rp(a,r),a);return o={useFetchStreams:t,...o},l._setSettings(o),l}),"PUBLIC").setMultipleInstances(!0)),jt(cl,ul,e),jt(cl,ul,"esm2020")})();const fu={projectId:"gen-lang-client-0833655128",appId:"1:681326869225:web:cada6ac531e1ded3b1ce78",apiKey:"AIzaSyAWyge6N-FseAcfTDNUN5P51j88PYQW-ms",authDomain:"gen-lang-client-0833655128.firebaseapp.com",firestoreDatabaseId:"ai-studio-cb688270-9194-4388-8b0d-99a18b09beb1",storageBucket:"gen-lang-client-0833655128.firebasestorage.app",messagingSenderId:"681326869225",measurementId:""},sg=_h(fu),Ve=Fm(sg,{experimentalForceLongPolling:!0},fu.firestoreDatabaseId);function Bs(){return Math.random().toString(36).slice(2,9)}function eo(n,e=1,t="league",s=0){const r=[...n];r.length%2!==0&&r.push({id:"__bye__",name:"BYE"});const a=r.length,l=a-1,u=a/2,h=[];for(let p=0;p<e;p++){const m=p%2===1,b=[r[0],...r.slice(1)];for(let w=0;w<l;w++){const A=w+1+s+p*l,C=[];for(let R=0;R<u;R++){const N=b[R],L=b[a-1-R];N.id==="__bye__"||L.id==="__bye__"||C.push(m?{homeId:L.id,awayId:N.id}:{homeId:N.id,awayId:L.id})}C.forEach(R=>{h.push({id:`fix-${Bs()}`,homeId:R.homeId,awayId:R.awayId,homeScore:null,awayScore:null,status:"upcoming",round:A,stage:t,date:null,venue:null,time:null})}),b.splice(1,0,b.pop())}}return h}function rg(n,e=1,t=1){let s=1;for(;s<n.length;)s*=2;const r=[...n],o=new Array(s).fill(null),a=mu(s);r.forEach((b,w)=>{a[w]!==void 0&&(o[a[w]]=b)});const l=[],u=s/2;for(let b=0;b<u;b++){const w=o[b*2],A=o[b*2+1];if(!(!w&&!A)&&w&&A)for(let C=0;C<t;C++)l.push({id:`ko-r${e}-m${b}-l${C}-${Bs()}`,homeId:C===0?w.id:A.id,awayId:C===0?A.id:w.id,homeScore:null,awayScore:null,status:"upcoming",round:e+C,matchIndex:b,stage:"knockout",leg:C+1,date:null,venue:null,time:null})}let h=u,p=e+t;for(;h>1;){h/=2;for(let b=0;b<h;b++)for(let w=0;w<t;w++)l.push({id:`ko-r${p}-m${b}-l${w}-${Bs()}`,homeId:null,awayId:null,homeScore:null,awayScore:null,status:"upcoming",round:p+w,matchIndex:b,stage:"knockout",leg:w+1,date:null,venue:null,time:null});p+=t}const m=e+t;for(let b=0;b<u;b++){const w=o[b*2],A=o[b*2+1];if(!w||!A){const C=w||A;if(!C)continue;const R=Math.floor(b/2),N=b%2===0?"homeId":"awayId",L=l.find(W=>W.round===m&&W.matchIndex===R&&W.leg===1);L&&(L[N]=C.id)}}return l}function mu(n){if(n===1)return[0];const e=mu(n/2),t=new Array(n);return e.forEach((s,r)=>{t[r*2]=s,t[r*2+1]=n-1-s}),t}function ig(n,e=4){const t=[...n].sort(()=>Math.random()-.5),s=Math.ceil(t.length/e),r=[],o=[];for(let a=0;a<s;a++){const l=t.slice(a*e,(a+1)*e);r.push({id:a,name:String.fromCharCode(65+a),teamIds:l.map(h=>h.id)}),eo(l,1,"groups",0).forEach(h=>{h.groupId=a,o.push(h)})}return{groups:r,fixtures:o}}function og(n,e,t,s=1,r="league"){const o=eo(n,s,r,0),a=[];for(let l=1;l<=t;l++){const u=(e[l]||[]).filter(m=>m.homeId&&m.awayId),h=new Set(u.flatMap(m=>[m.homeId,m.awayId])),p=o.filter(m=>m.round===l&&!h.has(m.homeId)&&!h.has(m.awayId));u.forEach(m=>{a.push({id:`fix-${Bs()}`,homeId:m.homeId,awayId:m.awayId,homeScore:null,awayScore:null,status:"upcoming",round:l,stage:r,date:m.date||null,venue:m.venue||null,time:m.time||null,pinned:!0})}),p.forEach(m=>{m.round=l,a.push(m)})}return a}function ag(n){const e=[],t={};return n.forEach(s=>{t[s.round]||(t[s.round]=[]),t[s.round].push(s)}),Object.entries(t).forEach(([s,r])=>{const o=new Set;r.forEach(a=>{a.homeId&&o.has(a.homeId)&&e.push(`Round ${s}: team ${a.homeId} plays twice`),a.awayId&&o.has(a.awayId)&&e.push(`Round ${s}: team ${a.awayId} plays twice`),a.homeId&&o.add(a.homeId),a.awayId&&o.add(a.awayId)})}),e}console.log("[KickOff] main.js is initializing...");window.onerror=function(n,e,t,s,r){alert("GLOBAL ERROR: "+n+`
Line: `+t)};window.addEventListener("unhandledrejection",function(n){alert("PROMISE REJECTION: "+n.reason)});console.log("KickOff + Firebase Initialized");async function Vn(n){const e=new TextEncoder().encode(n),t=await crypto.subtle.digest("SHA-256",e);return Array.from(new Uint8Array(t)).map(s=>s.toString(16).padStart(2,"0")).join("")}const Xt="kickoff_session_v2";function lg(){try{const n=localStorage.getItem(Xt);if(!n)return null;const e=JSON.parse(n);return Date.now()-e.loginTime>10080*60*1e3?(localStorage.removeItem(Xt),null):e}catch{return null}}async function js(n){if(f.user)try{await tg(Hi(Ve,"activityLog"),{action:n,performedBy:f.user.username,role:f.user.role,timestamp:or()})}catch(e){console.warn("Activity log failed:",e)}}if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(e=>{console.log("[PWA] Service Worker Registered"),setInterval(()=>{e.update()},1e3*60*60)}).catch(e=>{console.error("[PWA] Registration Failed:",e)})});let n=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{n||(n=!0,console.log("[PWA] New controller detected, refreshing page..."),window.location.reload())})}const O={home:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',more:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',menu:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',trophy:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',dashboard:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',fixtures:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',standings:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h5"/></svg>',teams:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',bracket:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 15 6 18 9"/><path d="M6 21 9 18 6 15"/><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M15 6h6"/><path d="M15 18h6"/></svg>',reset:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',league:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M3 8h18"/><path d="M3 16h18"/></svg>',knockout:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3"/><path d="M21 6h-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h3"/></svg>',group:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',arrowLeft:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7M5 12h14"/></svg>',trash:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',boot:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h2l3-4h1a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M14 12V8"/><path d="M8 12V8"/></svg>',medal:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><circle cx="12" cy="15" r="5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',archive:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',sword:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',fire:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.292 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',share:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',certificate:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"/><path d="M9 13.71V11"/><path d="M15 13.71V11"/><path d="M12 8V5"/><path d="M12 3V2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>'},gu="1.0",yu="kickoff_tournaments_v1",cg="kickoff_tournaments_backup",f={tournaments:[],tournament:null,user:lg(),view:"home",theme:localStorage.getItem("kickoff_theme")||"dark",mobileStandingsMode:localStorage.getItem("mobile_standings_mode")||"compact",activeRound:1,activeBottomSheet:null,isMobile:window.innerWidth<768,onboarding:{step:0,selectedFormat:null},standingsFilter:"overall",timelineRound:null,loginError:null,isLoading:!1};window.addEventListener("resize",()=>{const n=window.innerWidth<768;n!==f.isMobile&&(f.isMobile=n,B())});let Ur=null;async function de(n=!1){try{if(f.tournament){const t=f.tournaments.findIndex(s=>s.id===f.tournament.id);t!==-1?f.tournaments[t]=f.tournament:f.tournaments.push(f.tournament)}const e=JSON.stringify({version:gu,tournaments:f.tournaments});if(localStorage.setItem(yu,e),localStorage.setItem("kickoff_theme",f.theme),n&&localStorage.setItem(cg,e),!f.tournament||!f.user)return;Ur&&clearTimeout(Ur),Ur=setTimeout(async()=>{var t;try{await Zi(qe(Ve,"tournaments",f.tournament.id),{...f.tournament,updatedAt:or(),updatedBy:((t=f.user)==null?void 0:t.username)||"system"}),console.log("[Firestore] Synced:",f.tournament.name)}catch(s){s.code==="resource-exhausted"?console.warn("[Firestore] Quota exhausted — retry soon"):console.error("[Firestore] Sync error:",s)}},1500)}catch(e){console.error("Save failed:",e)}}async function ug(){if(f.user)try{const n=await hu(Hi(Ve,"tournaments"));f.tournaments=n.docs.map(e=>({id:e.id,...e.data()})),localStorage.setItem(yu,JSON.stringify({version:gu,tournaments:f.tournaments}))}catch(n){console.error("Firestore sync failed:",n)}}async function dg(n){try{await pu(qe(Ve,"tournaments",n))}catch(e){console.error("Delete failed:",e)}}async function hg(){try{const n=Xm(Hi(Ve,"users"),Zm("role","==","superadmin"));if((await hu(n)).empty){const t=await Vn("admin123");await Zi(qe(Ve,"users","admin"),{username:"admin",password:t,role:"superadmin",isActive:!0,createdAt:or(),loginAttempts:0})}}catch(n){console.warn("Admin check failed:",n)}}function pg(){document.documentElement.classList.toggle("light-mode",f.theme==="light"),document.documentElement.classList.toggle("dark",f.theme==="dark"),document.body.style.background="#050508",document.body.style.color="#f1f5f9"}function bu(){f.theme=f.theme==="dark"?"light":"dark",de(),B()}let Us=!1;async function B(){console.log("[KickOff] Render called. View:",f.view);try{const n=document.getElementById("root");if(!n){console.error("[KickOff] Root element not found!");return}if(pg(),!f.user){n.innerHTML=`
      <div style="min-height:100vh;background:#050508;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid rgba(59,130,246,0.1);border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:#475569;font-size:0.65rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">Initializing Security Protocols...</p>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;try{await hg()}catch(e){console.warn("[KickOff] Admin check failed, proceeding to login anyway:",e)}mg(n);return}if(!Us){n.innerHTML=`
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
    `,Us=!0,await ug(),B();return}f.onboarding.step>0?bg(n):f.tournament?f.tournament.status==="setup_teams"||f.tournament.status==="onboarding_summary"?Eg(n):Pg(n):gg(n)}catch(n){alert("RENDER ERROR: "+n.message+`
`+n.stack),console.error(n)}}async function fg(n,e){f.loginError=null;const t=document.getElementById("login-btn");t&&(t.disabled=!0,t.textContent="Verifying...");try{const s=qe(Ve,"users",n),r=await Is(s);if(!r.exists()){f.loginError="Invalid username or password.",B();return}const o=r.data();if(o.lockedUntil&&o.lockedUntil.toDate()>new Date){const l=Math.ceil((o.lockedUntil.toDate()-new Date)/6e4);f.loginError=`Account locked. Try again in ${l} minute(s).`,B();return}if(!o.isActive){f.loginError="Account deactivated. Contact administrator.",B();return}const a=await Vn(e);if(o.password===a){await mi(s,{loginAttempts:0,lockedUntil:null,lastLogin:or()});const l={username:o.username,role:o.role,loggedIn:!0,loginTime:Date.now()};localStorage.setItem(Xt,JSON.stringify(l)),f.user=l,await js("User logged in"),B()}else{const l=(o.loginAttempts||0)+1,u={loginAttempts:l};l>=5?(u.lockedUntil=new Date(Date.now()+900*1e3),f.loginError="Too many failed attempts. Locked for 15 minutes."):f.loginError="Invalid username or password.",await mi(s,u),B()}}catch(s){console.error(s),f.loginError="Authentication error. Check your connection.",B()}}function mg(n){n.innerHTML=`
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
  `,document.getElementById("toggle-pw").addEventListener("click",()=>{const e=document.getElementById("login-password");e.type=e.type==="password"?"text":"password"}),document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault(),await fg(document.getElementById("login-username").value.trim(),document.getElementById("login-password").value)})}function gg(n){const e=f.tournaments.filter(a=>!a.archived),t=f.tournaments.filter(a=>a.archived);f.isMobile?n.innerHTML=`
      <div class="min-h-screen p-5 pb-24 safe-area-pb" style="background:#050508">
        <header class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="KickOff Logo" style="width:44px;height:44px;border-radius:12px;object-fit:cover;box-shadow:0 0 20px rgba(59,130,246,0.5),0 0 40px rgba(124,58,237,0.2)">
            <div>
              <h1 class="text-xl font-black tracking-tighter" style="background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent">KickOff</h1>
              <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">Tournament Manager</p>
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
              `:e.map(a=>pl(a)).join("")}
            </div>
          </div>

          ${t.length>0?`
            <div class="pt-6">
              <h2 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color:#334155">Archived</h2>
              <div class="space-y-3 opacity-50">
                ${t.map(a=>pl(a)).join("")}
              </div>
            </div>
          `:""}
        </section>

        <button id="new-tournament-btn" class="fixed bottom-8 right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-50 active:scale-90 transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 10px 40px rgba(59,130,246,0.45),0 0 60px rgba(124,58,237,0.2)">
          ${O.plus}
        </button>
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
                 <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
                   <span style="width:6px;height:6px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.8)"></span>
                   Command Center Active
                 </div>
                 <h1 class="text-5xl font-black tracking-tighter" style="background:linear-gradient(135deg,#f1f5f9 30%,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Your Tournaments</h1>
                 <p class="font-bold tracking-[0.3em] uppercase text-xs" style="color:#475569">Manage multiple disciplines</p>
               </div>
             </div>
             <div class="flex items-center gap-4">
               <button id="new-tournament-btn" class="flex items-center gap-4 font-black px-10 py-5 rounded-2xl transition-all group" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);box-shadow:0 8px 32px rgba(59,130,246,0.35),0 0 60px rgba(124,58,237,0.15);color:white">
                 <span class="group-hover:rotate-90 transition-transform duration-300">${O.plus}</span>
                 <span class="uppercase tracking-widest text-sm">New Tournament</span>
               </button>
             </div>
          </div>

          ${e.length===0?`
            <div class="rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed" style="background:rgba(15,15,26,0.5);border-color:#1e1e32">
              <div class="w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto" style="background:#0a0a12;border:1px solid #1e1e32;color:#334155">
                ${O.trophy}
              </div>
              <div class="space-y-3">
                <h3 class="text-2xl font-black" style="color:#475569">No active tournaments</h3>
                <p class="text-sm font-medium" style="color:#334155">Create your first tournament to get started.</p>
              </div>
              <button id="new-tournament-btn-empty" class="px-10 py-4 rounded-2xl font-black text-sm transition-all" style="background:linear-gradient(135deg,#3b82f6,#7c3aed);color:white;box-shadow:0 8px 32px rgba(59,130,246,0.3)">Create Tournament</button>
            </div>
          `:`
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${e.map(a=>fl(a)).join("")}
            </div>
          `}

          ${t.length>0?`
            <div class="pt-20 space-y-8" style="border-top:1px solid #0f0f1a">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-black uppercase tracking-widest" style="color:#334155">Archived</h2>
                <div class="flex-1" style="height:1px;background:#0f0f1a"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-50">
                ${t.map(a=>fl(a)).join("")}
              </div>
            </div>
          `:""}
        </div>
      </div>
    `;const s=document.getElementById("new-tournament-btn");s&&s.addEventListener("click",()=>{if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached. Delete old ones to create new.");return}f.onboarding.step=1,B()});const r=document.getElementById("new-tournament-btn-empty");r&&r.addEventListener("click",()=>{f.onboarding.step=1,B()});const o=document.getElementById("theme-toggle");o&&o.addEventListener("click",bu),n.querySelectorAll(".open-tournament").forEach(a=>{a.addEventListener("click",()=>{const l=a.dataset.id;f.tournament=f.tournaments.find(u=>u.id===l),f.view="dashboard",B()})}),n.querySelectorAll(".next-season-btn").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation(),to(a.dataset.id)})}),n.querySelectorAll(".view-champion-btn").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const u=a.dataset.id;f.tournament=f.tournaments.find(h=>h.id===u),f.view="champion",B()})}),n.querySelectorAll(".archive-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const u=a.dataset.id,h=f.tournaments.find(p=>p.id===u);h&&(h.archived=!h.archived,de(),B())})}),n.querySelectorAll(".delete-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const u=a.dataset.id;yg(u)})}),n.querySelectorAll(".duplicate-tournament").forEach(a=>{a.addEventListener("click",l=>{l.stopPropagation();const u=a.dataset.id,h=f.tournaments.find(w=>w.id===u);if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}const p=JSON.parse(JSON.stringify(h));p.id=`t-${Date.now()}`,p.archived=!1;let m=`${h.name} (Copy)`,b=1;for(;f.tournaments.some(w=>w.name.toLowerCase()===m.toLowerCase());)m=`${h.name} (Copy ${++b})`;p.name=m,p.fixtures=h.fixtures.map(w=>({...w,homeScore:null,awayScore:null,status:"upcoming"})),p.status="active",f.tournaments.push(p),de(),B()})})}function yg(n){const e=f.tournaments.find(s=>s.id===n);if(!e)return;const t=document.createElement("div");t.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.9);backdrop-filter:blur(16px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem",t.innerHTML=`
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
  `,document.body.appendChild(t),document.getElementById("confirm-delete").addEventListener("click",async()=>{var r;const s=e.name;f.tournaments=f.tournaments.filter(o=>o.id!==n);try{await dg(n),await js(`Deleted tournament: ${s}`)}catch(o){console.error("Firestore delete failed:",o)}de(),t.remove(),((r=f.tournament)==null?void 0:r.id)===n&&(f.tournament=null,f.view="home"),B(),zs(`${s} deleted`)}),document.getElementById("cancel-delete").addEventListener("click",()=>{t.remove()})}function zs(n){const e=document.createElement("div");e.style.cssText="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(124,58,237,0.15));border:1px solid rgba(96,165,250,0.3);color:#93c5fd;font-weight:900;padding:0.875rem 2rem;border-radius:1rem;box-shadow:0 8px 32px rgba(59,130,246,0.2),0 0 60px rgba(124,58,237,0.1);z-index:200;pointer-events:none;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.15em;backdrop-filter:blur(12px);animation:float-up 0.3s ease forwards",e.innerText=n,document.body.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transition="opacity 0.3s",setTimeout(()=>e.remove(),300)},3e3)}function pl(n){const e=n.fixtures.filter(o=>o.status==="completed").length,t=n.fixtures.length,s=t>0?e/t*100:0,r=O[n.type==="groups"?"group":n.type==="knockout"?"knockout":"league"];return`
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
  `}function fl(n){const e=n.fixtures.filter(u=>u.status==="completed").length,t=n.fixtures.length,s=t>0?e/t*100:0;let r,o;n.archived?(o="Archived",r="background:#0a0a12;color:#475569;border-color:#1e1e32"):e===t&&t>0?(o="Completed",r="background:rgba(16,185,129,0.08);color:#34d399;border-color:rgba(16,185,129,0.2)"):e>0?(o="Live",r="background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.25)"):(o="Upcoming",r="background:#0a0a12;color:#475569;border-color:#1e1e32");const a={round_robin:"Round Robin",knockout:"Knockout",league:"Full League",groups:"Group+KO"},l=O[n.type==="groups"?"group":n.type==="knockout"?"knockout":"league"];return`
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
             ${o}
           </div>
           <div class="flex gap-2">
             <button data-id="${n.id}" class="archive-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="${n.archived?"Restore":"Archive"}" onmouseover="this.style.color='#60a5fa';this.style.borderColor='rgba(59,130,246,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.archive}</button>
             <button data-id="${n.id}" class="duplicate-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Duplicate" onmouseover="this.style.color='#a78bfa';this.style.borderColor='rgba(124,58,237,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.copy}</button>
             <button data-id="${n.id}" class="delete-tournament p-2.5 rounded-xl border transition-all" style="background:#0a0a12;border-color:#1e1e32;color:#475569" title="Delete" onmouseover="this.style.color='#f87171';this.style.borderColor='rgba(239,68,68,0.3)'" onmouseout="this.style.color='#475569';this.style.borderColor='#1e1e32'">${O.trash}</button>
           </div>
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
  `}function bg(n){f.onboarding.step===1?vg(n):f.onboarding.step===2&&wg(n)}function vg(n){const e=[{id:"round_robin",name:"Round Robin",icon:O.league,desc:"Small local competition. Every team plays everyone once.",color:"text-indigo-400"},{id:"knockout",name:"Knockout",icon:O.knockout,desc:"High stakes drama. Win or go home sudden-death.",color:"text-red-400"},{id:"groups",name:"Group + KO",icon:O.group,desc:"World Cup format. Group stage followed by brackets.",color:"text-emerald-400"},{id:"league",name:"Full League",icon:O.league,desc:"Double round robin. The ultimate consistency test.",color:"text-yellow-400"}];f.isMobile?(n.innerHTML=`
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
    `,document.getElementById("cancel-onboarding").addEventListener("click",()=>{f.onboarding.step=0,B()})):n.innerHTML=`
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
    `;const t=document.getElementById("cancel-onboarding-desktop");t&&t.addEventListener("click",()=>{f.onboarding.step=0,B()}),n.querySelectorAll("[data-format]").forEach(s=>{s.addEventListener("click",()=>{f.onboarding.selectedFormat=s.dataset.format,f.onboarding.step=2,B()})})}function xg(n){return new Promise((e,t)=>{const s=new FileReader;s.readAsDataURL(n),s.onload=()=>e(s.result),s.onerror=r=>t(r)})}function wg(n){const e=f.onboarding.selectedFormat,t=e==="groups",s=e==="league";n.innerHTML=`
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
  `,document.getElementById("back-btn").addEventListener("click",()=>{f.onboarding.step=1,B()});const r=document.getElementById("config-form"),o=document.getElementById("matchCountLabel"),a=document.getElementById("teamCountInput"),l=()=>{var b;const h=parseInt(a.value)||0,p=e;let m=0;if(p==="round_robin"||p==="league"){const w=parseInt(((b=r.elements.legs)==null?void 0:b.value)||(p==="league"?2:1));m=h*(h-1)/2*w}else if(p==="knockout"){const w=parseInt(r.elements.legs.value);m=(h-1)*w}else if(p==="groups"){const w=parseInt(r.elements.groupSize.value),A=Math.ceil(h/w),C=w*(w-1)/2;m=A*C+(A*2-1)}o.innerText=`${Math.floor(m)} Matches`};r.addEventListener("input",l),l();let u=null;document.getElementById("logo-upload").addEventListener("change",async h=>{const p=h.target.files[0];if(p){if(p.size>2*1024*1024){alert("Maximum size 2MB allowed.");return}u=await xg(p);const m=document.getElementById("logo-preview"),b=document.getElementById("logo-placeholder");m.src=u,m.classList.remove("hidden"),b.classList.add("hidden")}}),document.getElementById("back-btn").addEventListener("click",()=>{f.onboarding.step=1,B()}),r.addEventListener("submit",h=>{h.preventDefault();const p=new FormData(h.target);_g({name:p.get("name"),startDate:p.get("startDate"),type:e,logo:u,teamCount:parseInt(p.get("teamCount")),legs:parseInt(p.get("legs")||(e==="league"?2:1)),groupSize:parseInt(p.get("groupSize")||0),promoSpots:parseInt(p.get("promoSpots")||0),relegationSpots:parseInt(p.get("relegationSpots")||0),continentalSpots:parseInt(p.get("continentalSpots")||0)})})}function _g(n){if(f.tournaments.find(t=>t.name.toLowerCase()===n.name.toLowerCase())){alert("A tournament with this name already exists. Choose a unique title.");return}f.tournament={id:`t-${Date.now()}`,...n,teams:Array.from({length:n.teamCount},(t,s)=>({id:s,name:`Team ${s+1}`,players:[]})),fixtures:[],standings:[],groups:[],currentStage:n.type==="groups"?"groups":n.type,status:"setup_teams",createdAt:new Date().toISOString()},f.onboarding.step=0,de(),B()}function Eg(n){n.innerHTML=`
    <div class="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <main class="flex-1 p-6 md:p-10 lg:p-16 overflow-auto">
        <div id="view-container"></div>
      </main>
    </div>
  `;const e=document.getElementById("view-container");f.tournament.status==="setup_teams"?kg(e):f.tournament.status==="onboarding_summary"&&Tg(e)}function kg(n){const e=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#06b6d4","#f97316","#14b8a6","#3b82f6"];n.innerHTML=`
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
        ${f.tournament.teams.map((o,a)=>`
          <div class="group bg-slate-900 p-6 rounded-[2rem] border border-slate-800 hover:border-indigo-500/30 transition-all flex items-center gap-4 shadow-xl">
            <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-700 relative overflow-hidden">
               <input type="color" data-color-id="${o.id}" value="${e[a%e.length]}" class="absolute inset-0 w-full h-full border-none p-0 cursor-pointer opacity-0">
               <div style="background-color: ${e[a%e.length]}" class="w-6 h-6 rounded-full shadow-inner team-color-dot" data-dot-id="${o.id}"></div>
            </div>
            <div class="flex-1">
               <label class="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Squad Name</label>
               <input type="text" data-team-id="${o.id}" value="${o.name}" class="team-name-input w-full bg-transparent border-none focus:ring-0 text-lg font-black text-slate-100 placeholder:text-slate-800" placeholder="Red Devils FC">
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `,document.querySelectorAll('input[type="color"]').forEach(o=>{o.addEventListener("input",a=>{const l=a.target.dataset.colorId,u=document.querySelector(`.team-color-dot[data-dot-id="${l}"]`);u&&(u.style.backgroundColor=a.target.value)})});const t=()=>{if(console.log("Back button clicked!"),!!f.tournament)try{f.tournaments=f.tournaments.filter(o=>o&&o.id!==f.tournament.id),f.tournament=null,f.onboarding.step=2,de(),B()}catch(o){console.error(o),alert("Error going back: "+o.message)}},s=document.getElementById("back-to-config-btn");s&&s.addEventListener("click",t);const r=document.getElementById("back-to-config-btn-mobile");r&&r.addEventListener("click",t),document.getElementById("generate-fixtures-btn").addEventListener("click",()=>{document.querySelectorAll(".team-name-input").forEach(o=>{const a=parseInt(o.dataset.teamId),l=document.querySelector(`input[data-color-id="${a}"]`);f.tournament.teams[a].name=o.value||`Team ${a+1}`,f.tournament.teams[a].color=l?l.value:"#6366f1"}),de(),Sg()})}function Tg(n){const{fixtures:e}=f.tournament,t=Math.max(...e.map(s=>s.round),0);n.innerHTML=`
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
  `,document.getElementById("begin-ops-btn").addEventListener("click",()=>{f.tournament.status="active",de(),B()})}function Ig(n="auto",e={}){const{type:t,teams:s,legs:r=1,groupSize:o=4}=f.tournament;if(t==="round_robin"||t==="league")if(n==="semi"){const l=s.length%2===0?s.length:s.length+1;f.tournament.fixtures=og(s,e,(l-1)*r,r,t)}else f.tournament.fixtures=eo(s,r,t);else if(t==="knockout")f.tournament.fixtures=rg(s,1,r);else if(t==="groups"){const{groups:l,fixtures:u}=ig(s,o);f.tournament.groups=l,f.tournament.fixtures=u}const a=ag(f.tournament.fixtures);a.length&&console.warn("[FixtureEngine]",a)}function Ag(n,e=1,t=1){let s=1;for(;s<n.length;)s*=2;const r=s,o=[],a=[...n].sort(()=>Math.random()-.5),l=(p,m,b,w,A)=>({id:`ko-r${p}-m${m}-l${b}`,homeId:w,awayId:w===null?null:A,homeScore:null,awayScore:null,status:"upcoming",round:p+b,matchIndex:m,stage:"knockout",leg:b+1});for(let p=0;p<r/2;p++){const m=a[p*2]||null,b=a[p*2+1]||null;if(m&&b)for(let w=0;w<t;w++)o.push(l(e,p,w,w===0?m.id:b.id,w===0?b.id:m.id))}let u=r/2,h=e+t;for(;u>1;){u/=2;for(let p=0;p<u;p++)for(let m=0;m<t;m++)o.push(l(h,p,m,null,null));h+=t}if(r>n.length){const p=e+t;for(let m=0;m<r/2;m++){const b=a[m*2]||null,w=a[m*2+1]||null;if(!b||!w){const A=b||w,C=Math.floor(m/2),R=m%2===0?"homeId":"awayId",N=o.find(L=>L.round===p&&L.matchIndex===C);N&&(N[R]=A.id)}}}return o}function Sg(){const n=document.createElement("div");n.id="fixture-wizard",n.style.cssText="position:fixed;inset:0;background:rgba(5,5,8,0.95);backdrop-filter:blur(20px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto";const{type:e,teams:t,legs:s=1}=f.tournament,r=e==="knockout",o=e==="groups",a=!r&&!o;n.innerHTML=`
    <div style="width:100%;max-width:620px;background:#0f0f1a;border:1px solid #1e1e32;border-radius:2rem;padding:${f.isMobile?"1.25rem":"2.5rem"};box-shadow:0 40px 80px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
      <div style="margin-bottom:2rem">
        <div style="font-size:0.6rem;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:0.25em;margin-bottom:0.4rem">Fixture Engine v2</div>
        <h2 style="font-size:1.75rem;font-weight:900;color:#f1f5f9;letter-spacing:-0.03em;margin:0">Choose Generation Mode</h2>
        <p style="font-size:0.75rem;color:#475569;margin-top:0.5rem">${t.length} teams · ${e.replace("_"," ")}${a?` · ${s} leg${s>1?"s":""}`:""}</p>
      </div>
      <div id="mode-tabs" style="display:grid;grid-template-columns:${f.isMobile?"1fr":r||o?"1fr 1fr":"repeat(3,1fr)"};gap:0.75rem;margin-bottom:1.5rem">
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
  `,document.body.appendChild(n);let l="auto";const u={};let h=[];function p(w){l=w,n.querySelectorAll(".wiz-mode").forEach(A=>{const C=A.dataset.mode===w;A.style.border=C?"2px solid #3b82f6":"2px solid #1e1e32",A.style.background=C?"rgba(59,130,246,0.1)":"#0a0a12";const R=A.querySelector("div:nth-child(2)");R&&(R.style.color=C?"#60a5fa":"#94a3b8")}),m(w)}function m(w){const A=document.getElementById("wiz-panel");if(w==="auto"){const C=a?'<strong style="color:#60a5fa">Berger Circle</strong> round-robin — every team plays exactly once per matchday. Home/away alternates each leg. Odd teams get a fair BYE rotation.':r?`<strong style="color:#60a5fa">Seeded bracket</strong> — teams placed 1–${t.length} in optimal positions. BYE teams auto-advance. Subsequent rounds pre-generated as empty slots.`:'<strong style="color:#60a5fa">Randomised group draw</strong> then Berger round-robin within each group.';A.innerHTML=`
        <div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:1rem;padding:1.25rem">
          <p style="font-size:0.8rem;color:#94a3b8;line-height:1.7;margin:0">${C}</p>
          <div style="margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);font-size:0.65rem;color:#60a5fa;font-weight:900">
            ✓ No team plays twice on the same matchday &nbsp;|&nbsp; ✓ Validated before saving
          </div>
        </div>`}else if(w==="semi"){const R=((t.length%2===0?t.length:t.length+1)-1)*s,N=Math.min(R,8),L=t.map(H=>`<option value="${H.id}">${H.name}</option>`).join(""),W=Math.floor(t.length/2);let z="";for(let H=1;H<=N;H++){let Y="";for(let _=0;_<W;_++)Y+=`
            <div style="display:grid;grid-template-columns:1fr 0.4rem 1fr;gap:0.5rem;align-items:center;margin-top:0.4rem">
              <select data-round="${H}" data-match="${_}" data-side="home" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Home</option>${L}
              </select>
              <span style="font-size:0.65rem;color:#334155;text-align:center">vs</span>
              <select data-round="${H}" data-match="${_}" data-side="away" class="sp" style="background:#050508;border:1px solid #1e1e32;border-radius:0.5rem;padding:0.4rem;color:#94a3b8;font-size:0.72rem;outline:none">
                <option value="">Away</option>${L}
              </select>
            </div>`;z+=`<div style="background:#0a0a12;border:1px solid #1e1e32;border-radius:0.75rem;padding:0.75rem;margin-bottom:0.5rem">
          <span style="font-size:0.6rem;font-weight:900;color:#334155;white-space:nowrap;display:block;margin-bottom:0.2rem">MD ${H}</span>
          ${Y}
        </div>`}A.innerHTML=`
        <p style="font-size:0.72rem;color:#475569;margin:0 0 0.75rem">Optionally pin matches per matchday (Max ${W}). Leave blank to let the algorithm decide.</p>
        <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:300px;overflow-y:auto">${z}</div>
        <p style="font-size:0.6rem;color:#334155;margin-top:0.5rem">Showing ${N} of ${R} matchdays. Algorithm fills all unpinned slots automatically.</p>`,A.querySelectorAll(".sp").forEach(H=>{H.addEventListener("change",()=>{const Y=parseInt(H.dataset.round),_=parseInt(H.dataset.match);u[Y]||(u[Y]=[]),u[Y][_]||(u[Y][_]={}),u[Y][_][H.dataset.side==="home"?"homeId":"awayId"]=H.value?parseInt(H.value):null})})}else b(A)}function b(w){const A=t.map(C=>`<option value="${C.id}">${C.name}</option>`).join("");w.innerHTML=`
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
      <div style="font-size:0.65rem;font-weight:900;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">${h.length} fixture${h.length!==1?"s":""} added</div>
      <div style="max-height:180px;overflow-y:auto;display:flex;flex-direction:column;gap:0.35rem">
        ${h.length===0?'<p style="font-size:0.72rem;color:#334155;text-align:center;padding:1rem 0">No fixtures yet — add some above.</p>':h.map((C,R)=>{var W,z;const N=((W=t.find(H=>H.id===C.homeId))==null?void 0:W.name)||"?",L=((z=t.find(H=>H.id===C.awayId))==null?void 0:z.name)||"?";return`<div style="display:flex;align-items:center;justify-content:space-between;background:#0a0a12;border:1px solid #1e1e32;border-radius:0.625rem;padding:0.45rem 0.75rem">
                <span style="font-size:0.75rem;color:#94a3b8"><strong style="color:#60a5fa">MD${C.round}</strong>  ${N} <span style="color:#334155">vs</span> ${L}</span>
                <button data-del="${R}" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:0.9rem;padding:0 0.25rem">✕</button>
              </div>`}).join("")}
      </div>`,document.getElementById("m-add").addEventListener("click",()=>{const C=parseInt(document.getElementById("m-home").value),R=parseInt(document.getElementById("m-away").value),N=parseInt(document.getElementById("m-round").value),L=document.getElementById("m-err");if(L.style.display="none",!C||!R){L.textContent="Select both teams.",L.style.display="block";return}if(C===R){L.textContent="Home and away must differ.",L.style.display="block";return}if(!N||N<1){L.textContent="Enter a valid matchday (≥1).",L.style.display="block";return}if(h.filter(z=>z.round===N).some(z=>z.homeId===C||z.awayId===C||z.homeId===R||z.awayId===R)){L.textContent="A team already plays on this matchday!",L.style.display="block";return}h.push({id:`man-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,homeId:C,awayId:R,round:N,homeScore:null,awayScore:null,status:"upcoming",stage:r?"knockout":e,date:null,venue:null}),b(w)}),w.querySelectorAll("[data-del]").forEach(C=>{C.addEventListener("click",()=>{h.splice(parseInt(C.dataset.del),1),b(w)})})}n.querySelectorAll(".wiz-mode").forEach(w=>w.addEventListener("click",()=>p(w.dataset.mode))),m("auto"),document.getElementById("wiz-confirm").addEventListener("click",()=>{if(l==="manual"){if(h.length===0){zs("Add at least one fixture first.");return}f.tournament.fixtures=h}else Ig(l,u);f.tournament.status="onboarding_summary",de(),n.remove(),B()}),document.getElementById("wiz-cancel").addEventListener("click",()=>n.remove())}function Cg(){return`
    <header class="backdrop-blur-xl border-b p-3 sticky top-0 z-50 flex items-center justify-between no-print" style="background:rgba(10,10,18,0.92);border-color:#1e1e32">
      <div class="flex items-center gap-2.5 overflow-hidden" id="mobile-switcher-btn">
        <img src="/logo.png" alt="Logo" style="width:34px;height:34px;border-radius:8px;object-fit:cover;box-shadow:0 0 12px rgba(59,130,246,0.4),0 0 24px rgba(124,58,237,0.15);flex-shrink:0">
        <div class="overflow-hidden">
          <div class="text-[8px] font-black uppercase tracking-widest" style="color:#475569">Tournament</div>
          <h2 class="text-sm font-black truncate tracking-tighter uppercase" style="color:#f1f5f9">${f.tournament.name}</h2>
        </div>
        <span class="ml-1" style="color:#334155">${O.menu}</span>
      </div>
      <div class="flex items-center gap-2">
        <button id="theme-toggle-mobile" class="p-2 rounded-xl border transition-all active:scale-95" style="background:#0f0f1a;border-color:#1e1e32;color:#60a5fa">
          ${f.theme==="dark"?O.sun:O.moon}
        </button>
      </div>
    </header>
  `}function Rg(){return`
    <nav class="fixed bottom-0 inset-x-0 grid grid-cols-5 safe-area-pb z-50 no-print" style="background:rgba(10,10,18,0.95);border-top:1px solid #1e1e32;backdrop-filter:blur(20px);box-shadow:0 -10px 40px rgba(0,0,0,0.6)">
       ${[{id:"dashboard",label:"Home",icon:O.home},{id:"fixtures",label:"Matches",icon:O.fixtures},{id:"standings",label:"Stats",icon:O.standings},{id:"teams",label:"Squads",icon:O.teams},{id:"more",label:"More",icon:O.more}].map(e=>{const t=f.view===e.id||e.id==="more"&&["scorers","bracket","awards","summary"].includes(f.view);return`
           <button data-nav="${e.id}" class="flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-90" style="color:${t?"#60a5fa":"#475569"}">
             <span class="w-5 h-5">${e.icon}</span>
             <span class="text-[8px] font-black uppercase tracking-widest" style="opacity:${t?1:.5}">${e.label}</span>
             ${t?'<span class="absolute bottom-0 w-8 h-0.5 rounded-full" style="background:linear-gradient(90deg,#3b82f6,#7c3aed)"></span>':""}
           </button>
         `}).join("")}
    </nav>
  `}function gi(n,e=!1){const t=document.getElementById("bottom-sheet-container"),s=e?"custom":n;if(f.activeBottomSheet===s&&!e){f.activeBottomSheet=null,t.innerHTML="";return}f.activeBottomSheet=s;let r="";e?r=n:s==="more"?r=`
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
          <button data-view-mobile="summary" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.trophy}</span>
             <span class="text-xs font-black uppercase tracking-tight">Tournament Report</span>
          </button>
          <button data-view-mobile="awards" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.medal}</span>
             <span class="text-xs font-black uppercase tracking-tight">Special Awards</span>
          </button>
          <button data-view-mobile="history" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800">
             <span class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">${O.certificate}</span>
             <span class="text-xs font-black uppercase tracking-tight">League History</span>
          </button>
          <button data-view-mobile="settings" class="flex flex-col items-start gap-4 p-5 bg-slate-950 rounded-3xl border border-slate-800 text-slate-300 active:bg-slate-800 col-span-2">
             <span class="p-3 rounded-xl" style="background:rgba(59,130,246,0.1);color:#60a5fa">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
             </span>
             <span class="text-xs font-black uppercase tracking-tight">Account Settings &amp; Credentials</span>
          </button>
        </div>
        <div class="h-px bg-slate-800/50 my-3"></div>
        <button id="logout-btn" class="w-full flex items-center justify-center gap-4 p-5 rounded-2xl border font-black uppercase text-[10px] tracking-[0.2em] transition-all" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2);color:#f87171">
           ${O.trash} Sign Out
        </button>
      </div>
    `:s==="switcher"&&(r=`
      <div class="space-y-6 p-8">
        <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Tournament Registry</h4>
        <div class="space-y-3 max-h-[50vh] overflow-auto">
          ${f.tournaments.map(o=>`
            <button data-switch="${o.id}" class="w-full p-6 bg-slate-950 border ${f.tournament.id===o.id?"border-indigo-500 bg-indigo-500/5":"border-slate-800"} rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98]">
               <div class="flex flex-col items-start">
                 <span class="font-black text-sm uppercase tracking-tighter ${f.tournament.id===o.id?"text-indigo-400":"text-slate-100"}">${o.name}</span>
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${o.type} &bull; ${o.teams.length} Teams</span>
               </div>
               ${f.tournament.id===o.id?'<span class="text-indigo-500 text-xs">●</span>':""}
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
  `,document.getElementById("bs-backdrop").addEventListener("click",()=>{f.activeBottomSheet=null,t.innerHTML=""}),s==="more"?(document.querySelectorAll("[data-view-mobile]").forEach(o=>o.addEventListener("click",()=>{f.view=o.dataset.viewMobile,f.activeBottomSheet=null,t.innerHTML="",B()})),document.getElementById("logout-btn").addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(Xt),f.user=null,f.tournament=null,f.tournaments=[],Us=!1,f.activeBottomSheet=null,t.innerHTML="",B())})):s==="switcher"&&(document.querySelectorAll("[data-switch]").forEach(o=>o.addEventListener("click",()=>{f.tournament=f.tournaments.find(a=>a.id===o.dataset.switch),f.view="dashboard",f.activeBottomSheet=null,t.innerHTML="",B()})),document.getElementById("exit-tournament").addEventListener("click",()=>{f.tournament=null,f.view="home",f.activeBottomSheet=null,t.innerHTML="",B()}))}function Pg(n){var t;const e=f.tournament.archived;f.isMobile?n.innerHTML=`
      <div class="flex flex-col min-h-screen" style="background:#050508;color:#f1f5f9">
        ${Cg()}
        <main id="main-content" class="flex-1 p-5 pb-32 overflow-x-hidden overflow-y-auto scroll-smooth">
          <div id="view-container"></div>
        </main>
        ${Rg()}
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
              <div class="text-[8px] font-black uppercase tracking-widest" style="color:#334155">Tournament Manager</div>
            </div>
          </div>

          <nav class="flex-1 px-4 space-y-1">
            <button id="back-to-home" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm mb-4" style="color:#475569" onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'">
              <span class="w-4 h-4">${O.arrowLeft}</span>
              <span>All Tournaments</span>
            </button>
            <div class="mb-4" style="height:1px;background:#1e1e32"></div>
            ${nt("dashboard","Dashboard",O.dashboard)}
            ${nt("fixtures","Fixtures",O.fixtures)}
            ${nt("standings","Standings",O.standings)}
            ${nt("scorers","Top Scorers",O.boot)}
            ${nt("teams","Teams",O.teams)}
            ${f.tournament.type==="knockout"||f.tournament.type==="groups"?nt("bracket","Bracket",O.bracket):""}
            ${nt("history","League History",O.certificate)}
            <div style="height:1px;background:#1e1e32;margin:0.5rem 0"></div>
            ${nt("settings","Account Settings",'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>')}
          </nav>

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
    `,Vg(),Dg()}function Vg(){if(f.isMobile){document.querySelectorAll("[data-nav]").forEach(t=>t.addEventListener("click",()=>{const s=t.dataset.nav;s==="more"?gi("more"):(f.view=s,B())}));const n=document.getElementById("mobile-switcher-btn");n&&n.addEventListener("click",()=>gi("switcher"));const e=document.getElementById("theme-toggle-mobile");e&&e.addEventListener("click",bu)}else{document.querySelectorAll("[data-view]").forEach(s=>s.addEventListener("click",()=>{f.view=s.dataset.view,B()}));const n=document.getElementById("back-to-home");n&&n.addEventListener("click",()=>{f.tournament=null,f.view="home",B()});const e=document.getElementById("new-btn-sidebar");e&&e.addEventListener("click",()=>{if(f.tournaments.length>=10){alert("Maximum 10 tournaments reached.");return}f.tournament=null,f.onboarding.step=1,B()});const t=document.getElementById("logout-btn-sidebar");t&&t.addEventListener("click",()=>{confirm("Sign out of KickOff?")&&(localStorage.removeItem(Xt),f.user=null,f.tournament=null,f.tournaments=[],Us=!1,B())})}}function nt(n,e,t){const s=f.view===n;return`<button data-view="${n}" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm" style="${s?"background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(124,58,237,0.2));color:#60a5fa;border:1px solid rgba(59,130,246,0.2)":"color:#475569;border:1px solid transparent"}" ${s?"":`onmouseover="this.style.background='#0f0f1a';this.style.color='#94a3b8'" onmouseout="this.style.background='transparent';this.style.color='#475569'"`}><span class="w-4 h-4 flex-shrink-0">${t}</span><span>${e}</span></button>`}function Dg(){const n=document.getElementById("view-container");switch(f.view){case"dashboard":Ng(n);break;case"fixtures":vu(n);break;case"standings":st(n);break;case"scorers":Mg(n);break;case"teams":zg(n);break;case"bracket":wu(n);break;case"h2h":Ug(n);break;case"summary":Kg(n);break;case"history":Qg(n);break;case"champion":Wg(n);break;case"awards":Yg(n);break;case"settings":$g(n);break}}function $g(n){var s,r;const e='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',t='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';n.innerHTML=`
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
          <p class="font-black text-base uppercase" style="color:#60a5fa">${(s=f.user)==null?void 0:s.username}</p>
          <p class="text-[9px] font-black uppercase tracking-widest" style="color:#475569">${((r=f.user)==null?void 0:r.role)||"admin"}</p>
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
    </div>
  `,document.getElementById("change-username-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("username-msg"),l=document.getElementById("new-username").value.trim(),u=document.getElementById("confirm-pw-for-username").value;if(a.style.display="none",!l||l.length<3){a.textContent="Username must be at least 3 characters.",a.style.display="block";return}if(l===f.user.username){a.textContent="New username is the same as current.",a.style.display="block";return}try{const h=qe(Ve,"users",f.user.username),p=await Is(h);if(!p.exists()){a.textContent="User not found.",a.style.display="block";return}const m=p.data(),b=await Vn(u);if(m.password!==b){a.textContent="Incorrect current password.",a.style.color="#f87171",a.style.display="block";return}if((await Is(qe(Ve,"users",l))).exists()){a.textContent="That username is already taken.",a.style.color="#f87171",a.style.display="block";return}await Zi(qe(Ve,"users",l),{...m,username:l}),await pu(h);const A={...f.user,username:l,loginTime:Date.now()};localStorage.setItem(Xt,JSON.stringify(A)),f.user=A,await js(`Username changed to: ${l}`),zs("Username updated successfully!"),a.style.color="#34d399",a.textContent="✓ Username updated. You are now signed in as "+l,a.style.display="block",document.getElementById("new-username").value="",document.getElementById("confirm-pw-for-username").value="",B()}catch(h){console.error(h),a.textContent="Error: "+(h.message||"Update failed."),a.style.color="#f87171",a.style.display="block"}}),document.getElementById("change-password-form").addEventListener("submit",async o=>{o.preventDefault();const a=document.getElementById("password-msg"),l=document.getElementById("current-password").value,u=document.getElementById("new-password").value,h=document.getElementById("confirm-new-password").value;if(a.style.display="none",u.length<6){a.textContent="New password must be at least 6 characters.",a.style.color="#f87171",a.style.display="block";return}if(u!==h){a.textContent="New passwords do not match.",a.style.color="#f87171",a.style.display="block";return}try{const p=qe(Ve,"users",f.user.username),m=await Is(p);if(!m.exists()){a.textContent="User not found.",a.style.display="block";return}const b=m.data(),w=await Vn(l);if(b.password!==w){a.textContent="Current password is incorrect.",a.style.color="#f87171",a.style.display="block";return}const A=await Vn(u);await mi(p,{password:A,loginAttempts:0}),await js("Password changed"),zs("Password updated successfully!"),a.style.color="#34d399",a.textContent="✓ Password changed. Keep it safe!",a.style.display="block",document.getElementById("current-password").value="",document.getElementById("new-password").value="",document.getElementById("confirm-new-password").value=""}catch(p){console.error(p),a.textContent="Error: "+(p.message||"Update failed."),a.style.color="#f87171",a.style.display="block"}})}function st(n){const e=f.tournament.type==="groups",t=Math.max(...f.tournament.fixtures.map(u=>u.round),1);f.timelineRound===null&&(f.timelineRound=t);const s=`
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
          ${["overall","home","away","cleansheets"].map(h=>`
            <button data-filter="${h}" class="flex-1 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${f.standingsFilter===h?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}">
              ${h==="cleansheets"?"Clean":h}
            </button>
          `).join("")}
        </div>

        <div id="standings-content" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${Dn(!1,null,f.timelineRound)}
        </div>
      </div>
    `;const u=n.querySelector("#export-pdf-btn-mobile");u&&u.addEventListener("click",vl),n.querySelector("#view-mode-compact").addEventListener("click",()=>{f.mobileStandingsMode="compact",localStorage.setItem("mobile_standings_mode","compact"),st(n)}),n.querySelector("#view-mode-cards").addEventListener("click",()=>{f.mobileStandingsMode="cards",localStorage.setItem("mobile_standings_mode","cards"),st(n)})}else{const u=`
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
        <h1>${f.tournament.name}</h1>
        <p>Tournament Standings • ${f.standingsFilter.toUpperCase()} View • Matchday ${f.timelineRound} • Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `,p=`
      <div class="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl no-print self-start">
        ${["overall","home","away","cleansheets"].map(A=>`
          <button data-filter="${A}" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f.standingsFilter===A?"bg-indigo-600 text-white shadow-lg":"text-slate-500 hover:text-slate-300"}" style="${f.standingsFilter===A?"box-shadow:0 4px 12px rgba(79,70,229,0.3)":""}">
            ${A==="cleansheets"?"Clean Sheets":A}
          </button>
        `).join("")}
      </div>
    `;e?n.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${p}
           ${u}
        </div>
        ${s}
        ${h}
        <div id="standings-content" class="grid grid-cols-1 xl:grid-cols-2 gap-12">
          ${f.tournament.groups.map(A=>`
            <div class="space-y-6">
              <h4 class="text-xl font-black text-slate-100 flex items-center gap-4">
                <span class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm tracking-tighter">${A.name}</span>
                Group ${A.name}
              </h4>
              ${Dn(!1,A.id,f.timelineRound)}
            </div>
          `).join("")}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `:n.innerHTML=`
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           ${p}
           ${u}
        </div>
        ${s}
        ${h}
        <div id="standings-content">
          ${Dn(!1,null,f.timelineRound)}
        </div>
        <div class="print-footer hidden print:block text-center mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Generated on ${new Date().toLocaleDateString()} • Built with KickOff
        </div>
      `;const m=n.querySelector("#print-btn");m&&m.addEventListener("click",()=>window.print());const b=n.querySelector("#export-img-btn");b&&b.addEventListener("click",Hg);const w=n.querySelector("#export-pdf-btn");w&&w.addEventListener("click",vl)}const r=document.getElementById("timeline-slider");r&&r.addEventListener("input",u=>{f.timelineRound=parseInt(u.target.value),st(n)});const o=document.getElementById("timeline-prev");o&&o.addEventListener("click",()=>{f.timelineRound>1&&(f.timelineRound--,st(n))});const a=document.getElementById("timeline-next");a&&a.addEventListener("click",()=>{f.timelineRound<t&&(f.timelineRound++,st(n))});const l=document.getElementById("timeline-reset");l&&l.addEventListener("click",()=>{f.timelineRound=t,st(n)}),n.querySelectorAll("[data-filter]").forEach(u=>{u.addEventListener("click",()=>{f.standingsFilter=u.dataset.filter,st(n)})}),n.querySelectorAll(".team-detail-btn").forEach(u=>{u.addEventListener("click",()=>it(u.dataset.teamId))})}function Mg(n){const e=Zt();if(f.isMobile)n.innerHTML=`
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
          ${t.map((o,a)=>{const l=r[a];return`
              <div class="${l.bg} ${l.border} border rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                 <div class="absolute top-6 right-8 text-4xl">${l.label}</div>
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
                     <p class="text-3xl font-black ${l.text} font-mono">${o.fantasyPoints}</p>
                   </div>
                   <div>
                     <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Goals / Matches</p>
                     <p class="text-xl font-black text-slate-100 font-mono">${o.goals} / ${o.matchesCount}</p>
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
                ${s.map((o,a)=>`
                  <tr class="group">
                    <td class="py-6 pl-4 font-mono font-black text-slate-600">${a+4}</td>
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
    `}n.querySelectorAll(".team-detail-btn").forEach(t=>{t.addEventListener("click",()=>it(t.dataset.teamId))})}function Ng(n){const e=f.tournament.fixtures,t=e.filter(l=>l.status==="completed").slice(-3).reverse(),s=e.filter(l=>l.status==="upcoming").slice(0,3),r=f.tournament.type==="groups"&&f.tournament.currentStage==="groups"&&e.filter(l=>l.stage==="groups"&&l.status!=="completed").length===0,a=Zt()[0]||null;f.isMobile?n.innerHTML=`
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
          ${zr("Matches",e.length,"text-indigo-400")}
          ${zr("Played",e.filter(l=>l.status==="completed").length,"text-emerald-400")}
          ${zr("Goals",e.reduce((l,u)=>l+(u.homeScore||0)+(u.awayScore||0),0),"text-slate-400")}
        </div>

        ${r?'<div class="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/30 text-center"><h4 class="text-lg font-black text-indigo-400 mb-4">Stage Complete</h4><button id="adv-ko" class="bg-indigo-600 text-white w-full py-4 rounded-2xl font-black shadow-xl">ADVANCE TO KNOCKOUT</button></div>':""}

        <!-- Recent Activity -->
        <section class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</h3>
            <button data-view="fixtures" class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">View All</button>
          </div>
          <div class="space-y-3">
            ${t.length?t.map(l=>qr(l)).join(""):'<div class="p-10 border border-slate-800 rounded-[2rem] text-center text-slate-600 italic text-xs uppercase font-black">No recent matches</div>'}
          </div>
        </section>

        <!-- Top Scoring Team Snapshot -->
        ${a?`
          <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 shadow-xl flex items-center justify-between" data-view="scorers">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-sm font-black text-indigo-400 border border-slate-800 shadow-inner">
                 ${a.name.substring(0,2).toUpperCase()}
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
           ${Dn(!0)}
        </section>

        <!-- Biggest Win Snapshot -->
        ${(()=>{const l=zn();if(!l)return"";const u=f.tournament.teams.find(p=>p.id===l.homeId),h=f.tournament.teams.find(p=>p.id===l.awayId);return!u||!h?"":`
            <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tournament Record: Biggest Win</h3>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 text-right">
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${u.name}</p>
                </div>
                <div class="px-5 py-2 bg-indigo-600 rounded-xl font-black font-mono text-white shadow-lg shadow-indigo-900/40">
                  ${l.homeScore} - ${l.awayScore}
                </div>
                <div class="flex-1 text-left">
                  <p class="text-xs font-black text-slate-200 truncate uppercase">${h.name}</p>
                </div>
              </div>
            </div>
          `})()}
      </div>
    `:n.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          ${ys("Matches",e.length,"text-indigo-400")}
          ${ys("Played",e.filter(l=>l.status==="completed").length,"text-emerald-400")}
          ${ys("Teams",f.tournament.teams.length,"text-slate-400")}
          ${ys("Goals",e.reduce((l,u)=>l+(u.homeScore||0)+(u.awayScore||0),0),"text-yellow-400")}
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
              <div class="space-y-4">${t.length?t.map(l=>qr(l)).join(""):'<p class="text-slate-600 italic">No matches detected.</p>'}</div>
            </section>
            
            <section class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 h-full">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Next Engagements</h3>
              <div class="space-y-4">${s.length?s.map(l=>qr(l)).join(""):'<p class="text-slate-600 italic">Season complete.</p>'}</div>
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
             ${Dn(!0)}
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
                <div class="w-20 h-20 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-center text-2xl font-black text-indigo-400 shadow-inner">
                  ${a.name.substring(0,2).toUpperCase()}
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
              ${(()=>{const l=zn();if(!l)return'<p class="text-xs text-slate-600 italic">No records established.</p>';const u=f.tournament.teams.find(p=>p.id===l.homeId),h=f.tournament.teams.find(p=>p.id===l.awayId);return!u||!h?"":`
                  <div class="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Biggest Margin of Victory</p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-300">${u.name}</span>
                      <span class="font-black font-mono text-indigo-400 mx-3">${l.homeScore} - ${l.awayScore}</span>
                      <span class="text-xs font-bold text-slate-300">${h.name}</span>
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
    `,document.getElementById("adv-ko")&&document.getElementById("adv-ko").addEventListener("click",Fg),n.querySelectorAll("[data-view]").forEach(l=>l.addEventListener("click",()=>{f.view=l.dataset.view,B()})),n.querySelectorAll(".team-detail-btn").forEach(l=>{l.addEventListener("click",()=>it(l.dataset.teamId))}),setTimeout(()=>{try{if(typeof Chart>"u"){console.warn("[KickOff] Chart.js not loaded yet.");return}f.isMobile?ml("formChartMobileDashboard"):ml("formChartDesktopDashboard")}catch(l){console.error("[KickOff] Dashboard Charts Error:",l)}},100)}function ml(n){if(typeof Chart>"u")return;const e=document.getElementById(n);if(!e)return;const t=e.getContext("2d"),s=Me().slice(0,5),r=Array.from(new Set(f.tournament.fixtures.map(l=>l.round))).sort((l,u)=>l-u);Array.from(new Set(f.tournament.fixtures.filter(l=>l.status==="completed").map(l=>l.round))).sort((l,u)=>l-u);const o=s.map((l,u)=>{let h=0;const p=[0],m=f.tournament.fixtures.filter(w=>w.status==="completed"&&(w.homeId===l.id||w.awayId===l.id));r.forEach(w=>{const A=m.find(C=>C.round===w);if(A){const C=A.homeId===l.id;A.homeScore===A.awayScore?h+=1:(C&&A.homeScore>A.awayScore||!C&&A.awayScore>A.homeScore)&&(h+=3)}p.push(h)});const b=["#6366f1","#10b981","#f59e0b","#ef4444","#ec4899"];return{label:l.name,data:p,borderColor:b[u%b.length],backgroundColor:b[u%b.length]+"10",borderWidth:3,pointRadius:0,pointHoverRadius:4,tension:.4,fill:u===0}}),a=Chart.getChart(e);a&&a.destroy(),new Chart(t,{type:"line",data:{labels:["0",...r.map(l=>`${l}`)],datasets:o},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!f.isMobile,position:"bottom",labels:{color:"#475569",font:{size:9,weight:"700"},usePointStyle:!0,boxWidth:6}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:11,weight:"bold"}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)",drawBorder:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9,weight:"700"}}}}}})}function ys(n,e,t){const r={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399","text-slate-400":"#94a3b8","text-yellow-400":"#facc15"}[t]||"#60a5fa";return`<div class="rounded-2xl p-6" style="background:#0f0f1a;border:1px solid #1e1e32"><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:#475569">${n}</p><p class="text-3xl font-black font-mono" style="color:${r}">${e}</p></div>`}function zr(n,e,t){const r={"text-indigo-400":"#60a5fa","text-emerald-400":"#34d399"}[t]||"#60a5fa";return`<div class="p-5 rounded-2xl text-center" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)"><p class="text-[9px] font-black uppercase tracking-widest mb-1" style="color:#475569">${n}</p><p class="text-2xl font-black font-mono leading-none" style="color:${r}">${e}</p></div>`}function qr(n){const e=f.tournament.teams.find(r=>r.id===n.homeId)||{name:"?"},t=f.tournament.teams.find(r=>r.id===n.awayId)||{name:"?"},s=n.status==="upcoming"?"VS":`${n.homeScore}–${n.awayScore}`;return`<div class="p-4 rounded-xl flex items-center justify-between transition-all" style="background:#0a0a12;border:1px solid #1e1e32"><div class="flex-1 flex items-center justify-end gap-2 team-detail-btn" data-team-id="${e.id}"><span class="font-bold text-sm truncate" style="color:#94a3b8">${e.name}</span></div><div class="mx-4 px-4 py-1.5 rounded-lg font-black font-mono text-sm" style="background:#0f0f1a;color:#60a5fa;border:1px solid #1e1e32">${s}</div><div class="flex-1 flex items-center gap-2 team-detail-btn" data-team-id="${t.id}"><span class="font-bold text-sm truncate" style="color:#94a3b8">${t.name}</span></div></div>`}function vu(n){const e=f.tournament.fixtures,t=f.tournament.type==="league"||f.tournament.type==="groups",s=Array.from(new Set(e.map(o=>o.round))).sort((o,a)=>o-a);f.isMobile?(s.includes(f.activeRound)||(f.activeRound=s[0]||1),n.innerHTML=`
      <div class="space-y-6">
        <div class="flex items-center justify-between no-print mb-2">
          <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Management</h3>
          <button id="export-fixtures-btn" class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Export PDF</button>
        </div>

        <!-- Horizontal Round Tabs -->
        <div class="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth snap-x">
          ${s.map(o=>`
            <button data-round="${o}" class="flex-shrink-0 snap-start px-6 py-3 rounded-2xl border ${f.activeRound===o?"bg-indigo-600 border-indigo-500 text-white shadow-lg":"bg-slate-900 border-slate-800 text-slate-500"} transition-all active:scale-95">
              <span class="text-[10px] font-black uppercase tracking-widest">${t?"MW":"RD"} ${o}</span>
            </button>
          `).join("")}
        </div>

        <div id="fixtures-content" class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           ${(()=>{const o=zn();return e.filter(a=>a.round===f.activeRound).map(a=>gl(a,o&&o.id===a.id)).join("")})()}
           ${e.length===0?'<p class="text-center py-20 text-slate-700 italic">No fixtures generated yet.</p>':""}
        </div>
      </div>
    `,n.querySelectorAll("[data-round]").forEach(o=>o.addEventListener("click",()=>{f.activeRound=parseInt(o.dataset.round),vu(n)}))):n.innerHTML=`
      <div class="flex justify-end mb-8 no-print">
        <button id="export-fixtures-btn" class="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
          <span class="text-base">📄</span> Export Fixtures PDF
        </button>
      </div>
      <div id="fixtures-content" class="space-y-16">
        ${(()=>{const o=zn();return s.map(a=>`
            <div class="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div class="flex items-center gap-4">
                 <div class="h-8 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                 <h5 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">${f.tournament.type==="league"||f.tournament.type==="groups"&&f.tournament.currentStage==="groups"?"Matchweek":"Round"} ${a}</h5>
                 <div class="flex-1 h-px bg-slate-800/50"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${e.filter(l=>l.round===a).map(l=>gl(l,o&&o.id===l.id)).join("")}
              </div>
            </div>
          `).join("")})()}
      </div>
    `;const r=n.querySelector("#export-fixtures-btn");r&&r.addEventListener("click",Gg),n.querySelectorAll(".score-input").forEach(o=>o.addEventListener("change",a=>{Lg(a.target.closest("[data-match-id]").dataset.matchId,a.target.dataset.type,a.target.value)})),n.querySelectorAll(".status-toggle").forEach(o=>o.addEventListener("click",a=>yl(a.currentTarget.closest("[data-match-id]").dataset.matchId))),n.querySelectorAll(".status-toggle").forEach(o=>o.addEventListener("click",a=>yl(a.currentTarget.closest("[data-match-id]").dataset.matchId)))}function gl(n,e=!1){const t=f.tournament.teams.find(u=>u.id===n.homeId)||{name:"TBD"},s=f.tournament.teams.find(u=>u.id===n.awayId)||{name:"TBD"},r=n.status==="completed",o=f.tournament.archived,a=f.isMobile,l=e?"border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50":"border-slate-800 shadow-xl";return`
    <div data-match-id="${n.id}" class="${a?"bg-slate-900 rounded-[2.5rem] p-8":"bg-slate-900 rounded-[2rem] p-6"} border ${l} transition-all flex flex-col justify-between h-full group ${o?"grayscale-[0.5] opacity-90":""}">
       <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full ${r?"bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]":"bg-slate-700"}"></span>
            <span class="text-[9px] font-black uppercase text-slate-500 tracking-widest">${n.status}</span>
            ${e?'<span class="text-[8px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 ml-2">Record Win</span>':""}
          </div>
          ${o?"":`
            <button class="status-toggle p-3 md:p-2 bg-slate-950 md:bg-transparent border border-slate-800 md:border-none rounded-xl text-slate-700 hover:text-indigo-400 transition-all active:scale-90">
              ${O.fixtures}
            </button>
          `}
       </div>
       <div class="${a?"space-y-6":"space-y-4"}">
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${a?"text-base":"text-sm"} truncate uppercase tracking-tighter">${t.name}</span>
            <input type="number" data-type="home" value="${n.homeScore??""}" placeholder="-" ${o?"disabled":""} class="score-input ${a?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="font-black text-slate-200 ${a?"text-base":"text-sm"} truncate uppercase tracking-tighter">${s.name}</span>
            <input type="number" data-type="away" value="${n.awayScore??""}" placeholder="-" ${o?"disabled":""} class="score-input ${a?"w-14 h-12 text-lg":"w-12 h-10 text-sm"} bg-slate-950 border border-slate-800 rounded-xl text-center font-black text-indigo-400 outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          </div>
       </div>
       
       <div class="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <input type="date" value="${n.date||""}" class="match-date-input bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none hover:text-indigo-400 transition-colors" ${o?"disabled":""}>
       </div>
    </div>
  `}function Lg(n,e,t){const s=f.tournament.fixtures.find(r=>r.id===n);s&&(s[`${e}Score`]=t===""?null:parseInt(t),de(!0))}function yl(n){const e=f.tournament.fixtures.find(t=>t.id===n);if(!e||e.homeScore===null||e.awayScore===null){alert("Results must be entered before marking as complete.");return}e.status=e.status==="completed"?"upcoming":"completed",e.stage==="knockout"&&e.status==="completed"&&Og(e),de(!0),e.status==="completed"&&qg(),B()}function Og(n){const e=n.homeScore>n.awayScore?n.homeId:n.awayId,t=n.round+(f.tournament.legs||1),s=Math.floor(n.matchIndex/2),r=n.matchIndex%2===0?"homeId":"awayId",o=f.tournament.fixtures.find(a=>a.round===t&&a.matchIndex===s&&a.stage==="knockout");o&&(o[r]=e,de())}function Fg(){const n=[];f.tournament.groups.forEach((s,r)=>{const o=Me(s.id);n.push({groupId:r,rank:1,team:f.tournament.teams.find(a=>a.id===o[0].id)}),n.push({groupId:r,rank:2,team:f.tournament.teams.find(a=>a.id===o[1].id)})});const e=[];for(let s=0;s<n.length;s+=4)n[s]&&n[s+3]&&e.push(n[s].team,n[s+3].team),n[s+1]&&n[s+2]&&e.push(n[s+2].team,n[s+1].team);const t=Ag(e,Math.max(...f.tournament.fixtures.map(s=>s.round))+1,f.tournament.legs||1);f.tournament.fixtures.push(...t),f.tournament.currentStage="knockout",f.view="bracket",de(),B()}function qs(n){return f.tournament.fixtures.filter(t=>t.status==="completed"&&(t.homeId===n||t.awayId===n)).sort((t,s)=>t.round-s.round).slice(-5).map(t=>{const s=t.homeId===n,r=s?t.homeScore:t.awayScore,o=s?t.awayScore:t.homeScore;return r>o?"W":r<o?"L":"D"})}function Zt(){const n={},e=Me();return f.tournament.teams.forEach(t=>{const s=e.find(r=>r.id===t.id)||{w:0,d:0,cs:0};n[t.id]={name:t.name,teamId:t.id,teamName:t.name,goals:0,assists:0,matchesPlayed:new Set,fantasyPoints:s.w*5+s.d*2+s.cs*6}}),f.tournament.fixtures.forEach(t=>{t.status==="completed"&&(n[t.homeId]&&(n[t.homeId].goals+=t.homeScore||0,n[t.homeId].matchesPlayed.add(t.id),n[t.homeId].fantasyPoints+=(t.homeScore||0)*4),n[t.awayId]&&(n[t.awayId].goals+=t.awayScore||0,n[t.awayId].matchesPlayed.add(t.id),n[t.awayId].fantasyPoints+=(t.awayScore||0)*4))}),Object.values(n).map(t=>{const s=t.matchesPlayed.size;return{...t,matchesCount:s}}).sort((t,s)=>s.fantasyPoints-t.fantasyPoints||s.goals-t.goals)}function Dn(n,e=null,t=999){let s=Me(e,t);const r=f.standingsFilter||"overall";r==="home"?s.sort((p,m)=>m.home.pts-p.home.pts||m.home.gf-m.home.ga-(p.home.gf-p.home.ga)||m.home.gf-p.home.gf):r==="away"?s.sort((p,m)=>m.away.pts-p.away.pts||m.away.gf-m.away.ga-(p.away.gf-p.away.ga)||m.away.gf-p.away.gf):r==="cleansheets"&&s.sort((p,m)=>m.cs-p.cs||p.ga-m.ga||m.pts-p.pts);const o=(f.tournament.type==="league"||f.tournament.type==="round_robin")&&e===null,a=f.tournament.promoSpots||0,l=f.tournament.relegationSpots||0,u=f.tournament.continentalSpots||0;if(f.isMobile)if(f.mobileStandingsMode==="compact"){let p=`
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Pos</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest">Team</th>
        <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">P</th>
      `;return r==="cleansheets"?p+='<th class="p-4 font-black text-emerald-400 uppercase tracking-widest text-center">CS</th>':p+=`
          <th class="p-4 font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
          <th class="p-4 font-black text-indigo-400 uppercase tracking-widest text-center">Pts</th>
        `,`
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left font-mono text-[11px] border-separate border-spacing-0">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-800">
                  ${p}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                ${s.map((m,b)=>{const w=o&&b<u,A=o&&b>=s.length-l,C=o&&b>=u&&b<u+a;let R="text-slate-600";w?R="text-emerald-400":C?R="text-indigo-400":A&&(R="text-red-500/60");const N=r==="home"?m.home:r==="away"?m.away:m,L=N.gf-N.ga;return`
                    <tr class="active:bg-slate-800 transition-all team-detail-btn cursor-pointer" data-team-id="${m.id}">
                      <td class="p-4"><span class="font-black ${R}">${(b+1).toString().padStart(2,"0")}</span></td>
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
          ${s.map((p,m)=>{const b=qs(p.id),w=o&&m<u,A=o&&m>=s.length-l,C=o&&m>=u&&m<u+a;let R="border-slate-800";w?R="border-emerald-500/30 bg-emerald-500/5":C?R="border-indigo-500/30 bg-indigo-500/5":A&&(R="border-red-500/30 bg-red-500/5");const N=r==="home"?p.home:r==="away"?p.away:p;return`
              <div class="team-detail-btn bg-slate-900 border ${R} rounded-[2rem] p-6 flex items-center justify-between shadow-xl active:scale-95 transition-all" data-team-id="${p.id}">
                <div class="flex items-center gap-5">
                  <span class="text-3xl font-black text-slate-800 italic leading-none">${m+1}</span>
                  <div>
                    <h4 class="font-black text-slate-100 uppercase tracking-tight text-lg">${p.name}</h4>
                    <div class="flex gap-1.5 mt-2">
                      ${b.map(L=>`<span class="w-1.5 h-1.5 rounded-full ${L==="W"?"bg-emerald-500":L==="D"?"bg-slate-600":"bg-red-500"}"></span>`).join("")}
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
      `;let h="";return r==="cleansheets"?h=`
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
    <div class="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 ${n?"overflow-visible":"overflow-x-auto"} shadow-2xl relative">
      <table class="w-full text-left text-xs border-separate border-spacing-y-3 min-w-[800px] lg:min-w-0">
        <thead>
          <tr class="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
            ${h}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/20">
          ${s.map((p,m)=>{const b=o&&m<u,w=o&&m>=u&&m<u+a,A=o&&m>=s.length-l;let C="";b?C="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]":w?C="bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]":A&&(C="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]");const R=r==="home"?p.home:r==="away"?p.away:p,N=R.gf-R.ga,L=N>0?"+":"",W=N>0?"text-emerald-400":N<0?"text-red-400":"text-slate-600",z=qs(p.id);let H="";if(r==="cleansheets"){const Y=R.p>0?(R.cs/R.p).toFixed(2):"0.00";H=`
                <td class="py-4 text-center font-mono text-slate-500">${R.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.ga}</td>
                <td class="py-4 text-center"><span class="font-black font-mono text-emerald-400 italic text-sm">${R.cs}</span></td>
                <td class="py-4 text-center text-slate-500 font-mono">${Y}</td>
              `}else H=`
                <td class="py-4 text-center font-mono text-slate-500 font-bold">${R.p}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.w}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.d}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.l}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.gf}</td>
                <td class="py-4 text-center font-mono text-slate-500">${R.ga}</td>
                <td class="py-4 text-center font-mono font-black ${W}">${L}${N}</td>
                <td class="py-4 text-center font-black text-slate-100 text-base tracking-tighter shadow-indigo-500/10">${R.pts}</td>
              `;return`<tr class="bg-slate-950/40 group relative transition-all cursor-default scale-100 hover:scale-[1.01]">
              <td class="py-4 pl-4 rounded-l-3xl relative overflow-hidden">
                ${C?`<div class="absolute inset-y-2 left-0 w-1.5 ${C} rounded-r-full"></div>`:""}
                <span class="font-mono font-black ${b?"text-emerald-400":w?"text-indigo-400":A?"text-red-500/60":"text-slate-600"}">
                    ${(m+1).toString().padStart(2,"0")}
                </span>
              </td>
              <td class="py-4 font-black text-slate-200 truncate max-w-[150px] transition-colors group-hover:text-white cursor-pointer hover:underline team-detail-btn" data-team-id="${p.id}">
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-600 group-hover:border-indigo-500/30">
                    ${p.name.substring(0,2).toUpperCase()}
                  </div>
                  ${p.name}
                </div>
              </td>
              ${H}
              <td class="py-4 pr-6 rounded-r-3xl">
                ${r==="overall"?`
                <div class="flex items-center justify-center gap-1">
                  ${z.map(Y=>`<span data-result="${Y}" class="w-6 h-6 flex items-center justify-center rounded-lg border text-[10px] font-black ${Y==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":Y==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"} form-badge-print"><span class="form-badge-bg">${Y}</span></span>`).join("")}
                  ${z.length===0?'<span class="text-slate-800 font-black text-[10px] uppercase tracking-widest">-</span>':""}
                </div>
                `:""}
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>
  `}function Bg(n,e,t){const s=document.createElement("div");s.className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200",s.innerHTML=`
    <div class="bg-slate-900 w-full max-w-sm rounded-[2rem] border border-slate-800 shadow-2xl p-6 relative">
      <h3 class="text-lg font-black text-slate-100 uppercase tracking-tighter mb-4">${n}</h3>
      <input type="text" id="edit-modal-input" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-6" value="${e||""}" autocomplete="off">
      <div class="flex gap-3">
        <button id="edit-modal-cancel" class="flex-1 bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-300 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
        <button id="edit-modal-save" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/30">Save Data</button>
      </div>
    </div>
  `,document.body.appendChild(s);const r=s.querySelector("#edit-modal-input");r.focus(),r.setSelectionRange(0,r.value.length);const o=()=>s.remove();s.querySelector("#edit-modal-cancel").addEventListener("click",o),s.querySelector("#edit-modal-save").addEventListener("click",()=>{t(r.value),o()}),r.addEventListener("keydown",a=>{a.key==="Enter"&&(t(r.value),o()),a.key==="Escape"&&o()})}function it(n){var u,h;const e=f.tournament.teams.find(p=>p.id===parseInt(n));if(!e)return;const t=Me().find(p=>p.id===e.id)||{p:0,w:0,d:0,l:0,gd:0,home:{},away:{}},s=qs(e.id),r=f.tournament.fixtures.filter(p=>p.status==="completed"&&(p.homeId===e.id||p.awayId===e.id)).sort((p,m)=>new Date(m.date||0)-new Date(p.date||0));if(f.isMobile){const p=`
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
           ${Nt("P",t.p)}
           ${Nt("W",t.w)}
           ${Nt("D",t.d)}
           ${Nt("L",t.l)}
           ${Nt("FP",((u=Zt().find(m=>m.teamId===e.id))==null?void 0:u.fantasyPoints)||0)}
           ${Nt("GD",t.gd)}
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
           <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Match History</h4>
           <div class="space-y-3">
             ${r.map(m=>{const b=m.homeId===e.id,w=b?m.awayId:m.homeId,A=f.tournament.teams.find(N=>N.id===w)||{name:"Unknown"},C=b?m.homeScore>m.awayScore:m.awayScore>m.homeScore,R=m.homeScore===m.awayScore;return`
                 <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-8 h-8 flex items-center justify-center rounded-lg border font-black text-[10px] ${C?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":R?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-500"}">
                        ${C?"W":R?"D":"L"}
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
    `;gi(p,!0),setTimeout(()=>xl(e.id,"formChartMobile"),100);return}const o=document.createElement("div");o.id="team-detail-modal",o.className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300",o.innerHTML=`
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
                 ${s.map(p=>`<span class="w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-black ${p==="W"?"bg-emerald-500/20 text-emerald-400 border-emerald-500/30":p==="L"?"bg-red-500/20 text-red-400 border-red-500/30":"bg-yellow-500/20 text-yellow-500/70 border-yellow-500/30"}">${p}</span>`).join("")}
               </div>
               <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Recent Performance</span>
             </div>
           </div>
        </div>
        <button id="close-modal" class="p-4 bg-slate-950 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all">${O.reset}</button>
      </header>
      
      <div class="flex-1 overflow-auto p-10 space-y-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
           ${Mt("Played",t.p)}
           ${Mt("Wins",t.w)}
           ${Mt("Draws",t.d)}
           ${Mt("Losses",t.l)}
           ${Mt("Fantasy Pts",((h=Zt().find(p=>p.teamId===e.id))==null?void 0:h.fantasyPoints)||0)}
           ${Mt("GD",(t.gd>0?"+":"")+t.gd)}
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
             ${r.map(p=>{const m=p.homeId===e.id,b=f.tournament.teams.find(R=>R.id===(m?p.awayId:p.homeId)),w=m?p.homeScore>p.awayScore:p.awayScore>p.homeScore,A=p.homeScore===p.awayScore,C=w?"W":A?"D":"L";return`
                 <div class="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                      <div class="text-[10px] font-mono text-slate-700">${p.date||"TBD"}</div>
                      <div class="font-black text-slate-200">${b.name}</div>
                    </div>
                    <div class="flex items-center gap-8">
                       <div class="font-black font-mono text-xl text-slate-100">${p.homeScore} - ${p.awayScore}</div>
                       <div class="w-10 h-10 flex items-center justify-center rounded-xl border font-black text-sm ${w?"bg-emerald-500/10 border-emerald-500/20 text-emerald-400":A?"bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70":"bg-red-500/10 border-red-500/20 text-red-400"}">
                         ${C}
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
  `,document.body.appendChild(o),o.addEventListener("click",p=>{p.target===o&&o.remove()}),document.getElementById("close-modal").addEventListener("click",()=>o.remove()),setTimeout(()=>xl(e.id,f.isMobile?"formChartMobile":"formChartDesktop"),100);const a=f.isMobile?document.getElementById("bottom-sheet"):o;e.players||(e.players=[]);const l=p=>{var b,w;(b=p.querySelector(".edit-team-name-btn"))==null||b.addEventListener("click",()=>{const A=prompt("Enter new squad name:",e.name);A&&A.trim()&&(e.name=A.trim(),de(),B(),f.isMobile||o.remove(),it(n))}),(w=p.querySelector(".add-player-btn"))==null||w.addEventListener("click",()=>{const A=prompt("Enter new player name:");A&&A.trim()&&(e.players.push(A.trim()),de(),f.isMobile||o.remove(),it(n))});const m=p.querySelector("#mobile-team-back-btn");m&&m.addEventListener("click",()=>{f.view="standings",B()}),p.querySelectorAll(".edit-player-btn").forEach(A=>{A.addEventListener("click",()=>{const C=parseInt(A.dataset.idx);Bg("Edit player name:",e.players[C],R=>{R&&R.trim()&&(e.players[C]=R.trim(),de(),!f.isMobile&&o&&o.remove(),it(n))})})}),p.querySelectorAll(".del-player-btn").forEach(A=>{A.addEventListener("click",()=>{if(confirm("Remove this player?")){const C=parseInt(A.dataset.idx);e.players.splice(C,1),de(),f.isMobile||o.remove(),it(n)}})})};f.isMobile?setTimeout(()=>l(a),50):l(o)}function Mt(n,e){return`<div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl text-center space-y-1"><p class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${n}</p><p class="text-2xl font-black text-slate-100 font-mono">${e}</p></div>`}function Nt(n,e){return`<div class="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-center space-y-0.5"><p class="text-[8px] font-black text-slate-600 uppercase tracking-widest">${n}</p><p class="text-sm font-black text-slate-100 font-mono leading-none">${e}</p></div>`}function Me(n=null,e=999){let t=f.tournament.teams;if(n!==null){const o=f.tournament.groups.find(a=>a.id===n)||f.tournament.groups[n];o&&o.teamIds&&(t=f.tournament.teams.filter(a=>o.teamIds.includes(a.id)))}const s=t.map(o=>({id:o.id,name:o.name,p:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,pts:0,home:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},away:{p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0,cs:0},cs:0})),r=f.tournament.fixtures;return r.filter(o=>o.status==="completed"&&o.round<=e&&(n===null||o.groupId===n)&&(o.stage==="groups"||o.stage==="league"||o.stage==="round_robin"||!o.stage)).forEach(o=>{const a=s.find(u=>u.id===o.homeId),l=s.find(u=>u.id===o.awayId);a&&l&&(a.p++,l.p++,a.gf+=o.homeScore,a.ga+=o.awayScore,l.gf+=o.awayScore,l.ga+=o.homeScore,a.home.p++,a.home.gf+=o.homeScore,a.home.ga+=o.awayScore,l.away.p++,l.away.gf+=o.awayScore,l.away.ga+=o.homeScore,o.awayScore===0&&(a.cs++,a.home.cs++),o.homeScore===0&&(l.cs++,l.away.cs++),o.homeScore>o.awayScore?(a.w++,a.pts+=3,l.l++,a.home.w++,a.home.pts+=3,l.away.l++):o.homeScore<o.awayScore?(l.w++,l.pts+=3,a.l++,l.away.w++,l.away.pts+=3,a.home.l++):(a.d++,l.d++,a.pts++,l.pts++,a.home.d++,a.home.pts++,l.away.d++,l.away.pts++))}),s.forEach(o=>o.gd=o.gf-o.ga),s.sort((o,a)=>{if(a.pts!==o.pts)return a.pts-o.pts;if(a.gd!==o.gd)return a.gd-o.gd;if(a.gf!==o.gf)return a.gf-o.gf;const l=r.filter(u=>u.status==="completed"&&(u.homeId===o.id&&u.awayId===a.id||u.homeId===a.id&&u.awayId===o.id));if(l.length>0){let u=0,h=0;if(l.forEach(p=>{p.homeId===o.id?p.homeScore>p.awayScore?u+=3:p.homeScore<p.awayScore?h+=3:(u++,h++):p.homeScore>p.awayScore?h+=3:p.homeScore<p.awayScore?u+=3:(h++,u++)}),h!==u)return h-u}return o.name.localeCompare(a.name)})}function jg(){const n=Me();if(n.length===0)return{bestAttack:null,bestDefence:null,biggestWin:null};const e=[...n].sort((r,o)=>o.gf-r.gf||r.p-o.p)[0],t=[...n].sort((r,o)=>r.ga-o.ga||r.p-o.p)[0],s=zn();return{bestAttack:e,bestDefence:t,biggestWin:s}}function zn(){const n=f.tournament.fixtures.filter(e=>e.status==="completed");return n.length===0?null:[...n].sort((e,t)=>{const s=Math.abs(e.homeScore-e.awayScore),r=Math.abs(t.homeScore-t.awayScore);return r!==s?r-s:t.homeScore+t.awayScore-(e.homeScore+e.awayScore)})[0]}function bs(n,e){const t=f.tournament.fixtures.filter(h=>h.status==="completed"&&(h.homeId===n&&h.awayId===e||h.homeId===e&&h.awayId===n)).sort((h,p)=>new Date(p.date||0)-new Date(h.date||0));let s=0,r=0,o=0,a=0,l=0;const u=t.map(h=>{const p=h.homeId===n,m=p?h.homeScore:h.awayScore,b=p?h.awayScore:h.homeScore;a+=m,l+=b;let w="D";return m>b?(s++,w="W"):b>m?(r++,w="L"):o++,{...h,aScore:m,bScore:b,result:w}});return{aWins:s,bWins:r,draws:o,aGoals:a,bGoals:l,history:u}}function Ug(n){var o,a;const e=f.tournament.teams;let t=(o=e[0])==null?void 0:o.id,s=(a=e[1])==null?void 0:a.id;const r=()=>{if(t===void 0||s===void 0)return;const l=bs(t,s),u=e.find(m=>m.id===t),h=e.find(m=>m.id===s),p=document.getElementById("h2h-analysis");p.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-50"></div>
            <div class="relative z-10 flex items-center justify-between gap-8">
              <div class="text-center space-y-4 flex-1">
                <div class="w-24 h-24 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black" style="border-color: ${u.color||"#4f46e5"}">
                  ${u.name.substring(0,2).toUpperCase()}
                </div>
                <h3 class="text-2xl font-black text-slate-100 uppercase tracking-tighter">${u.name}</h3>
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
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${u.name} Aggregate Goals</p>
                      <p class="text-2xl font-black text-slate-100 font-mono">${l.aGoals}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">${h.name} Aggregate Goals</p>
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
                      <p class="text-xs font-black text-slate-200">${u.name}</p>
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
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${u.name.substring(0,6)} GF</p>
                    <p class="text-2xl font-black text-slate-100 font-mono">${l.aGoals}</p>
                  </div>
                  <div class="flex-1 p-5 bg-slate-950 rounded-2xl border border-slate-800">
                    <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">${h.name.substring(0,6)} GF</p>
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
  `,document.getElementById("team-a-select").addEventListener("change",l=>{t=parseInt(l.target.value),r(),setTimeout(()=>{Hr(bs(t,s)),Gr(t,s)},100)}),document.getElementById("team-b-select").addEventListener("change",l=>{s=parseInt(l.target.value),r(),setTimeout(()=>{Hr(bs(t,s)),Gr(t,s)},100)}),r(),setTimeout(()=>{Hr(bs(t,s)),Gr(t,s)},100)}function zg(n){f.isMobile?n.innerHTML=`
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
    `,document.getElementById("h2h-view-btn").addEventListener("click",()=>{f.view="h2h",B()}),n.querySelectorAll(".team-detail-btn").forEach(e=>{e.addEventListener("click",()=>it(e.dataset.teamId))})}function xu(n="#4f46e5"){const t=Date.now()+4e3,s={startVelocity:30,spread:360,ticks:60,zIndex:1e4},r=(a,l)=>Math.random()*(l-a)+a,o=setInterval(function(){const a=t-Date.now();if(a<=0)return clearInterval(o);const l=50*(a/4e3);confetti({...s,particleCount:l,origin:{x:r(.1,.3),y:Math.random()-.2},colors:[n,"#ffffff","#fbbf24"]}),confetti({...s,particleCount:l,origin:{x:r(.7,.9),y:Math.random()-.2},colors:[n,"#ffffff","#fbbf24"]})},250)}function qg(){const n=f.tournament.fixtures.filter(t=>t.status==="completed").length,e=f.tournament.fixtures.length;n===e&&e>0&&f.tournament.status!=="completed"&&(f.tournament.status="completed",de(),f.view="champion",B(),setTimeout(()=>{var t;return xu((t=f.tournament.teams[0])==null?void 0:t.color)},500))}function wu(n){const e=f.tournament.fixtures.filter(s=>s.stage==="knockout");if(!e.length){n.innerHTML='<div class="h-96 flex flex-col items-center justify-center text-slate-600 italic font-black uppercase tracking-widest gap-4"><span class="text-4xl opacity-20">📂</span>Knockout phase has not started yet.</div>';return}const t=Array.from(new Set(e.map(s=>s.round))).sort((s,r)=>s-r);f.isMobile?(n.innerHTML=`
      <div class="space-y-8 animate-in fade-in duration-500 pb-20">
        <div class="flex overflow-x-auto gap-3 no-scrollbar px-2 snap-x">
          ${t.map(s=>`
            <button class="round-tab shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all snap-center ${f.activeRound===s?"bg-indigo-600 text-white shadow-lg shadow-indigo-900/40":"bg-slate-900 text-slate-500 border border-slate-800"}" data-round="${s}">
              Round ${s}
            </button>
          `).join("")}
        </div>

        <div id="bracket-matches" class="space-y-6">
           ${e.filter(s=>s.round===f.activeRound&&(s.leg===1||!s.leg)).map(s=>bl(s)).join("")}
        </div>
      </div>
    `,n.querySelectorAll(".round-tab").forEach(s=>{s.addEventListener("click",()=>{f.activeRound=parseInt(s.dataset.round),wu(n)})})):n.innerHTML=`<div class="flex gap-20 overflow-x-auto pb-10 no-scrollbar select-none">${t.map(s=>`<div class="flex flex-col justify-around gap-12 min-w-[280px]">
      <h5 class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Round ${s}</h5>
      ${e.filter(r=>r.round===s&&(r.leg===1||!r.leg)).map(r=>bl(r)).join("")}
    </div>`).join("")}</div>`}function bl(n){const e=f.tournament.teams.find(s=>s.id===n.homeId)||{name:"?"},t=f.tournament.teams.find(s=>s.id===n.awayId)||{name:"?"};return f.isMobile?`
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
    `:`<div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-2"><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${e.name}</span><span class="font-mono text-xs font-black text-indigo-400">${n.homeScore??"-"}</span></div><div class="h-px bg-slate-800/50"></div><div class="flex items-center justify-between"><span class="text-xs font-bold text-slate-300 truncate w-32 uppercase tracking-tighter">${t.name}</span><span class="font-mono text-xs font-black text-indigo-400">${n.awayScore??"-"}</span></div></div>`}async function Hg(){const n=document.getElementById("standings-content");if(!n)return;const e=document.createElement("div");e.className="bg-slate-950 p-12 text-slate-100 font-sans",e.style.width="1200px",e.innerHTML=`
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-black mb-4 tracking-tighter">${f.tournament.name}</h1>
      <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">League Standings</p>
    </div>
    ${n.innerHTML}
    <div class="mt-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
      Exported on ${new Date().toLocaleDateString()} • Tournament Management Engine
    </div>
  `,document.body.appendChild(e);try{const t=await html2canvas(e,{backgroundColor:"#020617",scale:2,useCORS:!0,logging:!1}),s=document.createElement("a");s.download=`${f.tournament.name.replace(/\s+/g,"_")}_Standings.png`,s.href=t.toDataURL("image/png"),s.click()}catch(t){console.error("Snapshot failed:",t)}finally{document.body.removeChild(e)}}async function vl(){const{jsPDF:n}=window.jspdf,e=new n,t=f.tournament.name.replace(/\s+/g,"_");e.setFontSize(22),e.setTextColor(30,41,59),e.text(f.tournament.name,14,20),e.setFontSize(10),e.setTextColor(100,116,139);const s=f.tournament.type.charAt(0).toUpperCase()+f.tournament.type.slice(1);e.text(`${s} Status Report`,14,28);const o=Me().map((u,h)=>{const p=qs(u.id).join(" "),m=u.gd>0?"+":"";return[h+1,u.name,u.p,u.w,u.d,u.l,u.gf,u.ga,`${m}${u.gd}`,u.pts,p]});e.autoTable({head:[["Pos","Team","MP","W","D","L","GF","GA","GD","Pts","Form"]],body:o,startY:35,theme:"striped",headStyles:{fillColor:[79,70,229],textColor:[255,255,255],fontStyle:"bold"},styles:{fontSize:8,cellPadding:2},columnStyles:{0:{halign:"center"},1:{fontStyle:"bold"},2:{halign:"center"},3:{halign:"center"},4:{halign:"center"},5:{halign:"center"},6:{halign:"center"},7:{halign:"center"},8:{halign:"center"},9:{halign:"center",fontStyle:"bold"},10:{halign:"center"}}});const a=Zt();if(a.length>0){const u=e.lastAutoTable.finalY+15;e.setFontSize(14),e.setTextColor(30,41,59),e.text("Top Scorer Registry",14,u);const h=a.slice(0,10).map((p,m)=>[m+1,p.name,p.teamName,p.matchesCount,p.assists,p.goals]);e.autoTable({head:[["Rank","Player","Squad","MP","Assists","Goals"]],body:h,startY:u+5,theme:"grid",headStyles:{fillColor:[15,23,42],textColor:[255,255,255]},styles:{fontSize:8}})}const l=e.internal.getNumberOfPages();for(let u=1;u<=l;u++)e.setPage(u),e.setFontSize(8),e.setTextColor(148,163,184),e.text(`Generated on ${new Date().toLocaleString()} • KickOff Tournament Manager`,14,e.internal.pageSize.height-10);e.save(`${t}_Standings.pdf`)}async function Gg(){const{jsPDF:n}=window.jspdf,e=new n,t=f.tournament.name.replace(/\s+/g,"_"),s=f.tournament.fixtures,r=[5,5,8],o=[15,15,26],a=[59,130,246],l=[124,58,237],u=[241,245,249],h=[148,163,184],p=[30,30,50],m=()=>{e.setFillColor(...r),e.rect(0,0,e.internal.pageSize.width,e.internal.pageSize.height,"F")};m(),e.setFillColor(...o),e.rect(0,0,e.internal.pageSize.width,40,"F"),e.setFillColor(...a),e.rect(0,40,e.internal.pageSize.width/2,2,"F"),e.setFillColor(...l),e.rect(e.internal.pageSize.width/2,40,e.internal.pageSize.width/2,2,"F"),e.setTextColor(...u),e.setFontSize(26),e.setFont("helvetica","bold"),e.text(f.tournament.name.toUpperCase(),14,25),e.setTextColor(...a),e.setFontSize(11),e.setFont("helvetica","bold"),e.text("OFFICIAL FIXTURE SCHEDULE",14,34);const b=Array.from(new Set(s.map(C=>C.round))).sort((C,R)=>C-R);let w=55;b.forEach(C=>{const N=s.filter(z=>z.round===C).map(z=>{const H=f.tournament.teams.find(y=>y.id===z.homeId)||{name:"?"},Y=f.tournament.teams.find(y=>y.id===z.awayId)||{name:"?"},_=z.status==="completed"?`${z.homeScore} - ${z.awayScore}`:"vs";return[z.date?new Date(z.date).toLocaleDateString():"TBD",H.name.toUpperCase(),_,Y.name.toUpperCase(),z.status==="completed"?"FT":z.status==="live"?"LIVE":""]}),W=f.tournament.type==="league"||f.tournament.type==="round_robin"?`MATCHWEEK ${C}`:`ROUND ${C}`;w>260&&(e.addPage(),m(),w=20),e.setFillColor(...o),e.roundedRect(14,w,e.internal.pageSize.width-28,12,2,2,"F"),e.setTextColor(...u),e.setFontSize(11),e.setFont("helvetica","bold"),e.text(W,20,w+8),e.autoTable({body:N,startY:w+14,theme:"grid",styles:{fillColor:r,textColor:u,lineColor:p,lineWidth:.1,fontSize:10,cellPadding:5,font:"helvetica"},alternateRowStyles:{fillColor:[10,10,16]},columnStyles:{0:{halign:"center",textColor:h,cellWidth:35,fontStyle:"bold"},1:{halign:"right",fontStyle:"bold",cellWidth:55,textColor:u},2:{halign:"center",fontStyle:"bold",cellWidth:20,textColor:a},3:{halign:"left",fontStyle:"bold",cellWidth:55,textColor:u},4:{halign:"center",textColor:l,fontStyle:"bold"}},didDrawPage:function(z){z.pageNumber>1&&z.cursor.y===z.settings.margin.top&&m()}}),w=e.lastAutoTable.finalY+15});const A=e.internal.getNumberOfPages();for(let C=1;C<=A;C++){e.setPage(C),e.setTextColor(...h),e.setFontSize(8),e.setFont("helvetica","normal");const R=`Generated by Quantum Vortex Engine • ${new Date().toLocaleDateString()} • Page ${C} of ${A}`;e.text(R,e.internal.pageSize.width/2,e.internal.pageSize.height-10,{align:"center"})}e.save(`${t}_Fixtures.pdf`)}function Wg(n){const t=Me()[0],s=(t==null?void 0:t.color)||"#fbbf24";n.innerHTML=`
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
  `,document.getElementById("view-standings-final").addEventListener("click",()=>{f.view="standings",B()}),document.getElementById("summary-report-btn").addEventListener("click",()=>{f.view="summary",B()}),document.getElementById("celebrate-btn").addEventListener("click",()=>xu(s)),document.getElementById("close-champion").addEventListener("click",()=>{f.view="dashboard",B()});const r=document.getElementById("next-season-champion");r&&r.addEventListener("click",()=>to(f.tournament.id))}function to(n){const e=f.tournaments.find(r=>r.id===n);if(!e)return;const t=e.teams.map(r=>({...r,players:[...r.players||[]]})),s={...e,id:`t-${Date.now()}`,season:(e.season||1)+1,leagueId:e.leagueId||e.id,teams:t,fixtures:[],groups:[],status:"setup_teams",currentStage:e.type==="groups"?"groups":null,createdAt:new Date().toISOString()};f.tournaments.push(s),f.tournament=s,f.onboarding.step=0,f.view="dashboard",de(),B()}function Kg(n){var b,w,A,C;const e=Me(),t=e[0],s=e[1],r=e[2],o=jg(),l=Zt()[0],u=f.tournament.fixtures,h=u.reduce((R,N)=>R+(N.homeScore||0)+(N.awayScore||0),0),p=(h/u.length||0).toFixed(1);n.innerHTML=`
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
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${h}</h5>
                <p class="text-[10px] font-bold text-indigo-400 italic font-mono">${p} Per Engagement</p>
             </div>
             <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-4">
                <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Match Count</p>
                <h5 class="text-5xl font-black text-slate-100 font-mono tracking-tighter">${u.length}</h5>
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
                       <p class="font-black text-slate-100 capitalize">${((b=o.bestAttack)==null?void 0:b.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-red-400 font-mono uppercase tracking-widest">${((w=o.bestAttack)==null?void 0:w.gf)||0} Goals Scored</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="p-4 bg-blue-400/10 text-blue-500 rounded-2xl">${O.shield}</div>
                    <div>
                       <p class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best Defence</p>
                       <p class="font-black text-slate-100 capitalize">${((A=o.bestDefence)==null?void 0:A.name)||"N/A"}</p>
                       <p class="text-[10px] font-black text-blue-400 font-mono uppercase tracking-widest">${((C=o.bestDefence)==null?void 0:C.ga)||0} Conceded</p>
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
  `,document.getElementById("export-summary-pdf").addEventListener("click",Jg),document.getElementById("view-manual-awards").addEventListener("click",()=>{f.view="awards",B()});const m=document.getElementById("next-season-summary");m&&m.addEventListener("click",()=>to(f.tournament.id))}function Qg(n){const e=f.tournament.leagueId||f.tournament.id,t=f.tournaments.filter(s=>s.leagueId===e||s.id===e).sort((s,r)=>(s.season||1)-(r.season||1));n.innerHTML=`
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
        ${t.map(s=>{const r=f.tournament;f.tournament=s;const o=Me(),a=o[0],l=o[1],u=s.fixtures.filter(m=>m.status==="completed").length,h=s.fixtures.length,p=r.id===s.id;return f.tournament=r,`
            <div class="bg-slate-900 border ${p?"border-indigo-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]":"border-slate-800"} rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-slate-900/80">
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
                        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">${u}/${h} Matches Played</span>
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
                  ${p?`
                    <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active</div>
                  `:""}
               </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,n.querySelectorAll("[data-goto]").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.goto;f.tournament=f.tournaments.find(o=>o.id===r),f.view="dashboard",B()})})}function Yg(n){f.tournament.manualAwards=f.tournament.manualAwards||{},n.innerHTML=`
    <div class="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
       <div class="text-center space-y-4">
         <h2 class="text-5xl font-black text-white uppercase tracking-tighter">Honorable Recognition</h2>
         <p class="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">Select and honor the top operatives and teams manually</p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${vs("Team of Tournament","player-ot")}
          ${vs("Fair Play Award","fair-play")}
          ${vs("Best Manager","best-manager")}
          ${vs("Goal of the Mission","goal-om")}
       </div>

       <div class="pt-20 text-center">
         <button id="back-to-summary" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-900/40 uppercase tracking-widest">Consolidate Summary Registry</button>
       </div>
    </div>
  `,n.querySelectorAll(".award-input").forEach(e=>{e.addEventListener("input",t=>{f.tournament.manualAwards[t.target.dataset.key]=t.target.value,de()})}),document.getElementById("back-to-summary").addEventListener("click",()=>{f.view="summary",B()})}function vs(n,e){return`
    <div class="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6">
       <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${n}</h4>
       <input type="text" placeholder="Team Name..." class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-100 font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all award-input" data-key="${e}" value="${f.tournament.manualAwards[e]||""}">
    </div>
  `}function Jg(){const{jsPDF:n}=window.jspdf,e=new n;e.setFontSize(28),e.text("OFFICIAL TOURNAMENT SUMMARY",14,25),e.setFontSize(14),e.text(f.tournament.name,14,35);const s=Me().map((r,o)=>[o+1,r.name,r.p,r.w,r.d,r.l,r.gf,r.ga,r.pts]);e.autoTable({startY:50,head:[["Pos","Squad","MP","W","D","L","GF","GA","Pts"]],body:s,theme:"grid"}),e.save(`${f.tournament.name}_Final_Report.pdf`)}try{console.log("[KickOff] Script execution reaching bottom. Triggering initial render."),document.readyState==="loading"?window.addEventListener("DOMContentLoaded",()=>{console.log("[KickOff] DOMContentLoaded triggered."),B()}):B()}catch(n){alert("CRITICAL STARTUP ERROR: "+n.message),console.error(n)}function Hr(n){if(typeof Chart>"u")return;const e=document.getElementById("h2hChart");if(!e)return;const t=e.getContext("2d"),s=Chart.getChart(e);s&&s.destroy(),new Chart(t,{type:"doughnut",data:{labels:["Squad A Wins","Stalemate","Squad B Wins"],datasets:[{data:[n.aWins,n.draws,n.bWins],backgroundColor:["#10b981","#475569","#6366f1"],hoverBackgroundColor:["#34d399","#64748b","#818cf8"],borderWidth:0,hoverOffset:15,borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"75%",plugins:{legend:{display:!1},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12,titleFont:{family:"Inter",size:10,weight:"900"},bodyFont:{family:"Inter",size:12,weight:"bold"}}}}})}function Gr(n,e){if(typeof Chart>"u")return;const t=document.getElementById("h2hProgressionChart");if(!t)return;const s=t.getContext("2d"),r=f.tournament.teams.find(h=>h.id===n),o=f.tournament.teams.find(h=>h.id===e),a=Array.from(new Set(f.tournament.fixtures.map(h=>h.round))).sort((h,p)=>h-p),l=h=>{let p=0;const m=[0],b=f.tournament.fixtures.filter(w=>w.status==="completed"&&(w.homeId===h||w.awayId===h));return a.forEach(w=>{const A=b.find(C=>C.round===w);if(A){const C=A.homeId===h;A.homeScore===A.awayScore?p+=1:(C&&A.homeScore>A.awayScore||!C&&A.awayScore>A.homeScore)&&(p+=3)}m.push(p)}),m},u=Chart.getChart(t);u&&u.destroy(),new Chart(s,{type:"line",data:{labels:["0",...a.map(h=>`${h}`)],datasets:[{label:r.name,data:l(n),borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.1)",borderWidth:3,tension:.4,pointRadius:2},{label:o.name,data:l(e),borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",borderWidth:3,tension:.4,pointRadius:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0,position:"top",labels:{color:"#475569",font:{size:9,weight:"bold"},usePointStyle:!0}},tooltip:{backgroundColor:"#0f172a",padding:12,cornerRadius:12}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.03)"},ticks:{color:"#475569",font:{size:9}}},x:{grid:{display:!1},ticks:{color:"#475569",font:{size:9}}}}}})}function xl(n,e){if(typeof Chart>"u")return;const t=document.getElementById(e);if(!t)return;const s=t.getContext("2d"),r=f.tournament.fixtures.filter(u=>u.status==="completed"&&(u.homeId===n||u.awayId===n)),o=Array.from(new Set(f.tournament.fixtures.map(u=>u.round))).sort((u,h)=>u-h);let a=0;const l=[0];o.forEach(u=>{const h=r.find(p=>p.round===u);if(h){const p=h.homeId===n;h.homeScore===h.awayScore?a+=1:(p&&h.homeScore>h.awayScore||!p&&h.awayScore>h.homeScore)&&(a+=3)}l.push(a)}),new Chart(s,{type:"line",data:{labels:["Start",...o.map(u=>`RD ${u}`)],datasets:[{label:"Points",data:l,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",fill:!0,tension:.4,borderWidth:3,pointBackgroundColor:"#6366f1",pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255,255,255,0.05)"},ticks:{color:"#475569"}},x:{grid:{display:!1},ticks:{color:"#475569"}}}}})}
