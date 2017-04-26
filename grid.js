(function() {

  var GRID_CLASS_NAME = 'grid'
  var GRID_OPACITY = '0.2'
      
  var grid = grid_container(window.innerWidth, window.innerHeight)
  var config_form = new_config_form()

  document.body.appendChild(grid)
  document.body.appendChild(config_form)

  offsets = new Proxy({}, {
    set: function(obj, prop, val) {
      var old_val = obj[prop] || null

      obj[prop] = val

      if (old_val === val) {
        return
      }

      if ('dx' == prop) {
        var n_columns = window.innerWidth / val
        range(0, n_columns)
          .map(new_el)
          .map(size_el(val, window.innerHeight))
          .map(color_blue_green)
          .map(position_one_after_other)
          .map(append_to(grid))
      }

      if ('dy' == prop) {
        var n_rows = window.innerHeight / val
        range(0, n_rows)
          .map(new_el)
          .map(size_el(window.innerWidth, val))
          .map(color_blue_green)
          .map(position_one_below_other)
          .map(append_to(grid))
      }
    }
  })

  //offsets.dx = 20
  //offsets.dy = 20

  config_form.addEventListener('submit', function(e) {
    e.preventDefault()
    dw = this.querySelector('input[name="dx"]').value
    dh = this.querySelector('input[name="dy"]').value
    document.querySelectorAll('.grid div').forEach(function(el) {
      el.remove()
    })
    vertical_grid()
    horizontal_grid()
  })

  function append_to(el) {
    return function(child) {
      el.appendChild(child)
      return el
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
      pointerEvents: 'none'
    })

    return gc
  }

  function new_el(el, i) {
    var el = document.createElement('div')
    Object.assign(el.style, {
      margin: '0px',
      padding: '0px',
      opacity: GRID_OPACITY
    })
    el.setAttribute('class', (i + 1) % 2 == 0 ? 'even' : 'odd')
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

  function has_class(el, class_name) {
    var at_start = "^" + class_name + "\\s+.*$"
    var at_end = "^.*\\s+" + class_name + "$"
    var in_the_middle = "^.*\\s+" + class_name + "\\s+.*$"
    var only_this = "^" + class_name + "$"
    var regex = new RegExp(only_this + "|" + at_start + "|" + at_end + "|" + in_the_middle)

    return !!el.getAttribute('class').match(regex)
  }

  function color_blue_green(el) {
    el.style.backgroundColor = has_class(el, 'odd') ? 'blue' : 'green'
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
