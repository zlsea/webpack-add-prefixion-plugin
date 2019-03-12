'use strict';
class SourceAddPrefixionPlugin {
    constructor(domain) {
        this.regJs = /\.js/;
        this.regCss = /\.css/;
        this.domain = '';
        this.init(domain);
    }
    init(domain) {
        if (this.isObject(domain)) {
            Object.keys(domain).forEach(key => {
                if (!this.isString(domain[key])) {
                    this.errfn('参数传入异常！');
                }
            });
            this.domain = domain;
        } else if (this.isString(domain)) {
            this.domain = {
                js: domain,
                css: domain
            };
        } else {
            this.errfn('参数传入异常！');
        }
    }
    addRealms(tag) {
        if (tag.tagName === 'link' || tag.tagName === 'script') {
            if (this.regJs.test(tag.attributes.href)) {
                tag.attributes.href = this.domain.js + tag.attributes.href;
            } else if (this.regCss.test(tag.attributes.href)) {
                tag.attributes.href = this.domain.css + tag.attributes.href;
            } else if (this.regJs.test(tag.attributes.src)) {
                tag.attributes.src = this.domain.js + tag.attributes.src;
            }
        }
    }
    isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }
    errfn(err) {
        throw 'Plugin：Source-Add-Prefixion:' + err;
    }
    processRealm(data) {
        [...data.head, ...data.body].forEach(tag => {
            this.addRealms(tag);
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('SourceAddPrefixionPlugin', compilation => {
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
                'html-webpack-plugin-alter-asset-tags',
                data => {
                    this.processRealm(data);
                }
            );
        });
    }
}
module.exports = SourceAddPrefixionPlugin;
