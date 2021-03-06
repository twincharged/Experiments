function matches(e,s){return (e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||e.oMatchesSelector).call(e,s)}
function htmlType(el){ return matches(el, "select, option, input, textarea")?"value":"innerHTML"}
function contains(a, o) {var i = a.length;while (i--) {if (a[i] === o) return true;}return false;}

if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop, handler) {
      var oldval = this[prop],
          newval = oldval,
          getter = function() { return newval; },
          setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval, val);
          }			
      if (delete this[prop]) Object.defineProperty(this, prop, { get: getter, set: setter, enumerable: true, configurable: true});
    }
  });
}
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (prop) {
      var val = this[prop];
      delete this[prop];
      this[prop] = val;
    }
  });
}





// FW

function Bind(ob) {
  var els   = document.querySelectorAll("[bind]"),
      types = []
  for (var i=0;i<els.length;i++) {
    var attr = els[i].getAttribute("bind")
    if (!contains(types, attr)) types.push(attr)
  }
  for (var i=0;i<types.length;i++) {
    Watch(ob, types[i])
  }
}

function Watch(ob, attr) {
  var els = document.querySelectorAll("[bind='"+attr+"']")
  Build(ob, attr, els)
  ob.watch(attr, function(id, ov, nv){
    for (var i=0;i<els.length;i++) {
      var el   = els[i],
          html = htmlType(el);
      (function(e, nv){
        return e[html] = nv
      })(el, nv)
    }
  })
}

function Build(ob, attr, els) {
  for (var i=0;i<els.length;i++) {
    var el   = els[i],
        html = htmlType(el)
    el[html] = ob[attr]
    if (html === "value") Listen(el, ob);
  }
}

function Listen(el, ob) {
  el.addEventListener("keydown", function(e){
    ob[this.getAttribute("bind")] = this.value  // Need to stop ∞ setter loop :(
    e.preventDefault()
  })
}






var person = {
  name: "James"
}

Bind(person)

setTimeout(function(){person.name="Jose";person.age=22},500)


