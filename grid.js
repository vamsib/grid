(function() {

  var GRID_CLASS_NAME = 'grid'
  var COL_CLASS = 'g_col'
  var ROW_CLASS = 'g_row'
  var GRID_OPACITY = '0.2'
      
  var grid = grid_container(window.innerWidth, window.innerHeight)
  var config_form = new_config_form()

  document.body.appendChild(grid)
  document.body.appendChild(config_form)

	function select(selector, count, scope) {
		scope = scope || document
		var el_list = scope.querySelectorAll(selector)
		
		return {
			extras: function() {
				return Array.prototype.slice.call(el_list, count)
			},
			missing: function() {
				return range(el_list.length, count)
			}
		}
	}

  offsets = new Proxy({}, {
    set: function(obj, prop, val) {
      var old_val = obj[prop] || null

      obj[prop] = val

      if (old_val === val) {
        return
      }

      if ('dx' == prop) {
        var n_columns = Math.floor(window.innerWidth / val)

				select('.' + COL_CLASS, n_columns, grid).extras().map(function(el) { el.remove() })
				select('.' + COL_CLASS, n_columns, grid).missing().map(new_el).map(append_to(grid)).map(add_class(COL_CLASS))
        select('.' + COL_CLASS, 0, grid).extras().map(size_el(val, window.innerHeight)).map(color_blue_green).map(position_one_after_other)
      }

      if ('dy' == prop) {
        var n_rows = Math.floor(window.innerHeight / val)

				select('.' + ROW_CLASS, n_rows, grid).extras().map(function(el) { el.remove() })
				select('.' + ROW_CLASS, n_rows, grid).missing().map(new_el).map(append_to(grid)).map(add_class(ROW_CLASS))
        select('.' + ROW_CLASS, 0, grid).extras().map(size_el(window.innerWidth, val)).map(color_blue_green).map(position_one_below_other)
      }
    }
  })

  config_form.querySelector('input[name="dx"]').addEventListener('change', function() {
    offsets.dx = Math.floor(parseFloat(this.value, 10))
  })

  config_form.querySelector('input[name="dy"]').addEventListener('change', function() {
    offsets.dy = Math.floor(parseFloat(this.value, 10))
  })

  config_form.addEventListener('submit', function(e) {
    e.preventDefault()
    offsets.dx = this.querySelector('input[name="dx"]').value
    offsets.dy = this.querySelector('input[name="dy"]').value
  })

  function append_to(el) {
    return function(child) {
      el.appendChild(child)
      return child 
    }
  }

  function grid_container(w, h) {
    var gc = document.querySelector('grid')
    if (gc) {
      return gc
    }
    gc = document.createElement('div')
    gc.setAttribute('class', GRID_CLASS_NAME)
    Object.assign(gc.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: w + 'px',
      height: h + 'px',
      margin: '0px',
      padding: '0px',
      pointerEvents: 'none',
      textAlign: 'center'
    })

    return gc
  }

  function new_el(i) {
    var el = document.createElement('div')
    Object.assign(el.style, {
      margin: '0px',
      padding: '0px',
      opacity: GRID_OPACITY
    })
    return el
  }

  function size_el(width, height) {
    return function(el) {
      Object.assign(el.style, {
        height: height + 'px',
        width: width + 'px'
      })
      return el
    }
  }

  function add_class(class_name) {
    return function(el) {
      if (!has_class(el, class_name)) {
        if (el.getAttribute('class')) {
          el.setAttribute('class', el.getAttribute('class') + ' ' + class_name)
        } else {
          el.setAttribute('class', class_name)
        }
      }
      return el
    }
  }

  function has_class(el, class_name) {
    var at_start = "^" + class_name + "\\s+.*$"
    var at_end = "^.*\\s+" + class_name + "$"
    var in_the_middle = "^.*\\s+" + class_name + "\\s+.*$"
    var only_this = "^" + class_name + "$"
    var regex = new RegExp(only_this + "|" + at_start + "|" + at_end + "|" + in_the_middle)

    return el.getAttribute('class') && !!el.getAttribute('class').match(regex)
  }

  function color_blue_green(el, i) {
    el.style.backgroundColor = i % 2 == 0 ? 'blue' : 'green'
    return el
  }

  function position_one_after_other(el, i) {
    el.style.display = 'inline-block'
    return el
  }

  function position_one_below_other(el, i) {
    el.style.position = 'absolute'
    el.style.top = (parseInt(el.style.height, 10) * i) + 'px'
    return el
  }

  function range(start, end) {
    var r = []
    for (var i = start; i < end; i++) {
      r.push(i)
    }
    return r
  }
  
  function new_config_form() {
    var inputs = document.createElement('form')
    var dx = text_box('dx')
    var dy = text_box('dy')
    var btn_set = submit_button('set')

    inputs.setAttribute('class', 'config')

    Object.assign(inputs.style, {
      position: 'fixed',
      top: '0px',
      right: '0px',
      padding: '20px',
      background: '#fff'
    })

    inputs.appendChild(dx)
    inputs.appendChild(dy)
    inputs.appendChild(btn_set)

    return inputs
  }

  function text_box(name) {
    var el = document.createElement('input')

    el.setAttribute('type', 'text')
    el.setAttribute('name', name)
    el.setAttribute('placeholder', name)

    Object.assign(el.style, {
      display: 'block',
      marginBottom: '4px',
      width: '40px'
    })

    return el
  }

  function submit_button(label) {
    var submit = document.createElement('button')

    submit.setAttribute('type', 'submit')
    submit.innerText = label
    submit.style.display = 'block'
    submit.style.width = '47px'

    return submit
  }

})()
