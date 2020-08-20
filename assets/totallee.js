window.totallee = window.totallee || {}
window.utils = window.utils || {}
window.theme = window.theme || {}
window.ShopifyAPI = window.ShopifyAPI || {}

/**
 * *********************************************************************************************************************************************
 * UTILS
 * *********************************************************************************************************************************************
 */
utils.optionIndexOf = function (productJson, name) {
  var normalizedOptions = productJson.options.map(function (opt) { return opt.toUpperCase() })
  var normalizedName = name.toUpperCase()
  return normalizedOptions.indexOf(normalizedName)
}

utils.button = function (classNames, children) {
  return '<button class="' + classNames + '">' + children + '</button>';
}

utils.label = function (classNames, children) {
  return '<label class="' + classNames + '">' + children + '</label>'
}

utils.slideArrow = function (dir) {
  // Use label to get button functionality with label styles
  return dir === 'next'
    ? utils.label('s-slider__arrow s-slider__arrow--next', theme.assets.chevronRight)
    : utils.label('s-slider__arrow s-slider__arrow--prev', theme.assets.chevronLeft)
}

/**
 * Prevents single word breaks
 * @param  {String} str - Text
 * @param  {Number} int - Number of words to group
 * @returns {String}     - Text with grouped words
 */
utils.buddy = function (str, int) {
  var head = str.split(' ')

  // Head is now mutated
  var tail = head.splice(head.length - int, int).join('&nbsp;')
  return head.join(' ') + ' ' + tail
}

/**
 * Calculate Y position between element and viewport
 * @param  {jQuery.Node} $el     - Waypoint element
 * @returns {Object}
 */
utils.waypointFactory = function ($el) {
  var el = $el[0]
  var rect = el.getBoundingClientRect()
  var wHeight = window.innerHeight

  /**
   * Returns true if:
   * 1. Top edge of element is below top of viewport
   * 2. Bottom edge of element is above bottom of viewport
   */
  var isVisible = function () {
    return (
      rect.top >= 0 &&
      rect.bottom <= wHeight
    )
  }

  /**
   * Returns...
   * 1. 'bottom' if bottom edge is greater than viewport
   * 2. 'top' if top edge is less than viewport
   * 3. 'inside' otherwise
   */
  var location = function () {
    if (rect.bottom >= wHeight) return 'bottom'
    else if (rect.top <= 0) return 'top'
    return 'inside'
  }

  return {
    isVisible: isVisible(),
    location: location(),
  }
}

/**
 * *********************************************************************************************************************************************
 * MAIN
 * *********************************************************************************************************************************************
 */

// ################################################################################################################
// BUDDY SYSTEM
// ################################################################################################################
totallee.buddySystem = (function () {
  var cache = {
    $container: $('.js-buddy')
  }

  function init() {
    cache.$container.each(function () {
      var $this = $(this)
      var count = +$this.data('buddy-count') || 2
      $this.html(utils.buddy($this.text(), count))
    })
  }

  return {
    init: init,
  }
})()


// ################################################################################################################
// ACCORDIONS
// ################################################################################################################
totallee.accordions = (function () {
  function init() {
    $('.js-accordion-toggle').on('click', function (e) {
      e.preventDefault()

      var $this = $(this)

      //Expand or collapse this panel
      $(this).next().slideToggle('fast')
      $this.toggleClass('active')

      //Hide the other panels
      $('.js-accordion-toggle').not($this).removeClass('active')
      $(".accordion__content").not($(this).next()).slideUp('fast');
    })

    $('.pp-accordions .js-accordion-toggle').eq(0).trigger('click')
  }

  return {
    init: init,
  }
})()


// ################################################################################################################
// DRAWERS
// ################################################################################################################
totallee.drawers = (function () {
  function init() {
    ajaxCart.init({
      cartContainer: '#CartContainer',
      addToCartSelector: 'button[type="submit"]',
      cartCountSelector: '.js-cart-count',
      enableQtySelectors: true,
      moneyFormat: '${{amount}}',
      // Disable ajax cart on product pages offering addon / on upsell page
      disableAjaxCart: !!document.getElementById('AddOnJson') ||
                       !!$('.template-page--upsell').length,
    })

    theme.CartDrawer = new theme.Drawers('shopify-section-cart-menu', 'right', {
      onDrawerOpen: ajaxCart.load,
    })

    $(document.body).on('click', '.js-cart-nav-toggle', theme.CartDrawer.open.bind(theme.CartDrawer))

    $(document.body).on('afterCartLoad.ajaxCart', function (evt, cart) {
      theme.CartDrawer.open()
      var price = cart.total_price;
      var minus = 5000;
      var total = parseFloat(minus - price) / 100;
      var total2 = total.toFixed(2);
      var width = (price / minus) * 100;
      $('.progress-bar').css('width', width+'%');
      if (cart.total_price < 5000) {
      	$('.cart-total-mot').html('$'+total2);
        $('.mot-text').show();
        $('.free-ship').hide();
      } else {
      	$('.mot-text').hide();
        $('.free-ship').show();
      }
   $(document).ready(function(){
     $('.upsell-holder').empty();

var arrayx = [];
$.getJSON('/cart.js', function(cart) {
  for(var i=0; i<cart.items.length; i++){
    var item = cart.items[i];
    var itemid = item.handle;
    var itemvariant = item.variant_title;
    var itemtype = item.product_type

    arrayx.push(itemid + '-' + itemvariant);


   if (itemtype == 'case') {
$.getJSON('/products/'+ itemid +'.js', function(data) {
  var producturl = data.url;
  var producttitle = data.title.toString().replace("Thin ", "");
var i;
var activev = [];
for (i = 0; i < arrayx.length; i++) {
if (arrayx[i].indexOf(itemid) > -1) {
  activev += arrayx[i]+",";
}
}

    var firstx = activev.split(',');
    var var1 = firstx[0].split(itemid+'-').toString().replace(",", "");

  if (activev.indexOf(itemid) > -1) {
    if(typeof firstx[1] != 'undefined'){var var2 = firstx[1].split(itemid+'-').toString().replace(",", "");}
    if(typeof firstx[2] != 'undefined'){var var3 = firstx[2].split(itemid+'-').toString().replace(",", "");}
    if(typeof firstx[3] != 'undefined'){var var4 = firstx[3].split(itemid+'-').toString().replace(",", "");}
  }

  for(var i=0; i<data.tags.length; i++){
    var tag = data.tags[i].toString();
       if (tag.indexOf('1-') > -1) {
          var first = tag.split('1-').toString().replace(",", "");
       }
       if (tag.indexOf('2-') > -1) {
          var second = tag.split('2-').toString().replace(",", "");
       }
       if (tag.indexOf('3-') > -1) {
          var third = tag.split('3-').toString().replace(",", "");
       }
       if (tag.indexOf('4-') > -1) {
          var fourth = tag.split('4-').toString().replace(",", "");
       }
  }

  for(var i=0; i<data.variants.length; i++){
    var variant = data.variants[i];
    var vartitlex = variant.title.toLowerCase();

    if(typeof var4 != 'undefined') {
    if (var1 != first && var2 != first && var3 != first && var4 != first) {
       if (vartitlex == first) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != second && var2 != second && var3 != second && var4 != second) {
        if (vartitlex == second) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != third && var2 != third && var3 != third && var4 != third) {
        if (vartitlex == third) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }  else if (var1 != fourth && var2 != fourth && var3 != itemvariant && var4 != fourth) {
        if (vartitlex == fourth) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }
    } else if(typeof var3 != 'undefined') {
    if (var1 != first && var2 != first && var3 != first) {
       if (vartitlex == first) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != second && var2 != second && var3 != second) {
        if (vartitlex == second) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != third && var2 != third && var3 != third) {
        if (vartitlex == third) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }  else if (var1 != fourth && var2 != fourth && var3 != fourth) {
        if (vartitlex == fourth) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }
    } else if(typeof var2 != 'undefined') {
    if (var1 != first && var2 != first) {
       if (vartitlex == first) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != second && var2 != second) {
        if (vartitlex == second) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != third && var2 != third) {
        if (vartitlex == third) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }  else if (var1 != fourth && var2 != fourth) {
        if (vartitlex == fourth) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }
    } else {
    if (var1 != first) {
       if (vartitlex == first) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != second) {
        if (vartitlex == second) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    } else if (var1 != third) {
        if (vartitlex == third) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }  else if (var1 != fourth) {
        if (vartitlex == fourth) {
    	var varid = variant.id;
        var vartitle = variant.title;
        var vartitleh = variant.title.toLowerCase().replace(/ /g,'-');
        var varprice = variant.price
       }
    }
    }

  }

for (var i = 0; i < data.images.length; i++) {
    var image = data.images[i];
    var imagefile = "upsell-" + producttitle.replace("+", "-plus").toLowerCase().replace(/ /g,'-') + "-" + vartitleh.replace("(", "_").replace(")", "");
  	if (image.indexOf(imagefile) > -1) {
      var imagex = image
  	}
}
  if(typeof vartitle != 'undefined') {
  var pricex = (varprice / 100).toFixed(2).replace(".00", "");
  var newdiv = $('<div class="'+ imagefile +' upsellcase var-' + varid +'"><div class="ajaxcart__product-wrapper"><div class="ajaxcart__product-image-wrapper"><img class="grid-view-item__image" src="' + imagex + '" /></div><div class="ajaxcart__product-right"><div class="ajaxcart__product-name"><a href="' + producturl + '"><span class="title">' + data.title + '</span></a><span class="ajaxcart__product-meta">' + vartitle + '</span></div><button class="btn" type="submit" name="add" data-cart-add="' + varid + '">Add <span class="divider">|</span> <span class="price">$' + pricex + '</span></button></div></div></div>');
  $('.upsell-holder').append(newdiv);
  $(".var-" + varid).not(':last').hide();
  }
});
   }
  }

});
   });
    })
  }

  return {
    init: init,
  }
})()


// ################################################################################################################
// COLOR SWATCHES
// ################################################################################################################
totallee.colorSwatchFactory = function (element) {
  var state = {
    activeImage: '',
    activeVariant: '',
  }

  var props = {
    $swatch: null,
    $container: null,
    $image: null,
    $anchors: null,
    baseUrl: ''
  }

  function setProps() {
    props.$swatch = $(element)
    props.$container = props.$swatch.parent().parent().parent()
    props.$image = props.$container.find('.js-image-swap').eq(0)
    props.$anchors = props.$container.find('.js-swatch-link')
    props.baseUrl = props.$anchors.eq(0).attr('href')
  }

  function render() {
    props.$anchors.each(function () {
      $(this).attr('href', props.baseUrl + '?variant=' + state.activeVariant)

      if ($(this).hasClass('js-quick-add')) {
        $(this).attr('data-cart-add', state.activeVariant)
      }
    })

    props.$image.attr('src', state.activeImage)
  }

  function handleSwatchClick(e) {
    e.preventDefault()
    var src = $(this).data('image')
    var id = $(this).data('variant-id')

    if (src) {
      state.activeImage = src
      state.activeVariant = id
      render()
    }
  }

  function bindUIEvents() {
    props.$swatch.on('click', handleSwatchClick)
  }

  function init() {
    setProps()
    bindUIEvents()
  }

  return {
    init: init,
  }
}

totallee.colorSwatches = (function () {
  function init() {
    $('.js-color-swatch').each(function () {
      totallee.colorSwatchFactory($(this)).init()
    })
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// PP - VARIANTS - Swatches / Options / Variant Slides / Videos
// ################################################################################################################
totallee.ppVariants = (function () {
  var cache = {}
  var props = {}
  var state = {
    options: [],
    hasColorOption: false,
    hasSizeOption: false,
    hasQuantityOption: false,
    activeVideoContainer: null,
    activeVideoContainerMobile: null,
    color: '',
    size: '',
    quantity: '',
  }

  function cacheSelectors() {
    var idxSize = utils.optionIndexOf(state, 'Size')
    var idxSelectSize = utils.optionIndexOf(state, 'select your size')
    var corrSizeIdx = idxSize === -1 ? idxSelectSize : idxSize

    var idxQty = utils.optionIndexOf(state, 'Quantity')
    var idxSelectQty = utils.optionIndexOf(state, 'select your quantity')
    var corrQtyIdx = idxQty === -1 ? idxSelectQty : idxQty

    cache = {
      $form: $('form[action="/cart/add"]'),
      $thumbnails: $('.product-single__thumbnails-item'),
      $sizeOption: $('#SingleOptionSelector-' + corrSizeIdx),
      $quantityOption: $('#SingleOptionSelector-' + corrQtyIdx),
      $swatchOption: $('.swatch :radio'),
      $mobileSlider: $('#pp-mobile-slider'),
      $thumbnailContainer: $('#pp-thumbnails'),
      $lowerHalf: $('.js-half-blocks'),
      $window: $(window),
      $loading: $('#loading'),
      $loadingContent: $('#loading-content'),
    }
  }

  function setState() {
    var id = 'ProductJson-' + props.sectionId
    var pJson = document.getElementById(id)
    state = pJson
              ? $.extend({}, state, JSON.parse(pJson.innerHTML))
              : state

    var normalizedOptions = state.options.map(function (opt) { return opt.toUpperCase() })

    state.hasColorOption = normalizedOptions.indexOf('COLOR') !== -1
    state.hasQuantityOption = normalizedOptions.indexOf('QUANTITY') !== -1
      || normalizedOptions.indexOf('SELECT YOUR QUANTITY') !== -1
    state.hasSizeOption = normalizedOptions.indexOf('SIZE') !== -1
      || normalizedOptions.indexOf('SELECT YOUR SIZE') !== -1

    if (theme.variant && theme.variant.currentVariant) {
      var idxSize = utils.optionIndexOf(state, 'Size')
      var idxSelectSize = utils.optionIndexOf(state, 'select your size')
      var corrSizeIdx = idxSize === -1 ? idxSelectSize : idxSize

      var idxQty = utils.optionIndexOf(state, 'Quantity')
      var idxSelectQty = utils.optionIndexOf(state, 'select your quantity')
      var corrQtyIdx = idxQty === -1 ? idxSelectQty : idxQty

      $(document.body).trigger({
        type: 'totallee.variantChange',
        payload: {
          color: theme.variant.currentVariant.options[utils.optionIndexOf(state, 'Color')],
          size: theme.variant.currentVariant.options[corrSizeIdx],
          quantity: theme.variant.currentVariant.options[corrQtyIdx],
        }
      })
    }
  }

  function lowerTrim(str) {
    return str.toLowerCase().replace(/\/\/.*/gi, '').trim()
  }

  function swapRoutine() {
    if (!theme.variant) return null

    $(document.body).trigger({
      type: 'totallee.variantChange',
      payload: {
        color: state.color,
        size: state.size,
        quantity: state.quantity,
      }
    })

    cache.$thumbnails.each(function () {
      var $img = $(this).find('img')
      var imgAlt = $img.attr('alt')
      var altList = imgAlt.split(',')
                          .map(lowerTrim)

      $(this).addClass('hide')

      // Some products will not have color or size options
      var isColorMatch = !state.hasColorOption
                        || altList.indexOf(state.color) !== -1

      var isSizeMatch = !state.hasSizeOption
                        || altList.indexOf(state.size) !== -1

      var isQuantityMatch = !state.hasQuantityOption
                        || altList.indexOf(state.quantity) !== -1

      // Image / Slider swap
      if (state.hasColorOption && state.hasSizeOption) {
        if (isColorMatch && isSizeMatch && isQuantityMatch) {
          $(this).removeClass('hide')
        }
      } else if (state.hasColorOption && !state.hasSizeOption && !state.hasQuantityOption) {
        if (isColorMatch) {
          $(this).removeClass('hide')
        }
      } else if (!state.hasColorOption && state.hasSizeOption && !state.hasQuantityOption) {
        if (isSizeMatch) {
          $(this).removeClass('hide')
        }
      } else if (!state.hasColorOption && !state.hasSizeOption && state.hasQuantityOption) {
        if (isQuantityMatch) {
          $(this).removeClass('hide')
        }
      } else {
        $(this).removeClass('hide')
      }

      // Do BTF
      var btfList = imgAlt.split('-').map(lowerTrim)

      var isColorMatchBtf = !state.hasColorOption
                            || btfList.indexOf(state.color) !== -1

      var isSizeMatchBtf = !state.hasSizeOption
                            || btfList.indexOf(state.size) !== -1

      var isQuantityMatchBtf = !state.hasQuantityOption
                            || btfList.indexOf(state.quantity) !== -1

      function doBtf() {
        var src = $img.attr('src').replace('_80x80', '')
        var alt = imgAlt.split('//')[1]

        var $lowerImg = cache.$lowerHalf.find('.js-block-img')
                                        .eq(parseInt(btfList[1], 10) - 1)

        cache.$lowerHalf.find('.js-block-bg')
                        .eq(parseInt(btfList[1], 10) - 1)
                        .css({ backgroundImage: 'url("'+ src +'")' })

        $lowerImg.attr('src', src)

        if (alt) {
          $lowerImg.attr('alt', alt.trim())
        }
      }

      if (btfList.indexOf('btf') !== -1) {
        if (state.hasColorOption && state.hasSizeOption && state.hasQuantityOption ) {
          if (isColorMatchBtf && isSizeMatchBtf && isQuantityMatchBtf) {
            doBtf()
          }
        } else if (state.hasColorOption && !state.hasSizeOption && !state.hasQuantityOption) {
          if (isColorMatchBtf) {
            doBtf()
          }
        } else if (!state.hasColorOption && !state.hasQuantityOption && state.hasSizeOption) {
          if (isSizeMatchBtf) {
            doBtf()
          }
        } else if (!state.hasColorOption && !state.hasSizeOption && state.hasQuantityOption) {
          if (isQuantityMatchBtf) {
            doBtf()
          }
        }
      }
    })

    // Handle appending variant videos here
    $('.js-variant-video').hide()
    var variantId = theme.variant.currentVariant ? theme.variant.currentVariant.id : theme.variant.id

    if (!$('.js-variant-video').length) {
      var docFrag = document.createDocumentFragment()

      var li = document.createElement('li')
      li.setAttribute('class', 'js-variant-video product-single__thumbnails-item')

      var anchor = document.createElement('a')
      anchor.setAttribute('class', 'text-link product-single__thumbnail product-single__thumbnail--product-template scroll-video')

      var image = document.createElement('img')
      image.setAttribute('class', 'product-single__thumbnail-image')

      var icon = document.createElement('img')
      icon.setAttribute('class', 'popup-youtube-play')
      icon.setAttribute('src', '//cdn.shopify.com/s/files/1/1166/1584/files/play-button.png?13376713011070547127')

      anchor.appendChild(image)
      anchor.appendChild(icon)
      li.appendChild(anchor)
      docFrag.appendChild(li)

      $('#pp-thumbnails').append(docFrag)
    }

    var $li = $('.js-variant-video')
    if (
      totallee.metafieldsById &&
      totallee.metafieldsById[variantId] &&
      totallee.metafieldsById[variantId].video_url &&
      totallee.metafieldsById[variantId].video_image
    ) {
      var field = totallee.metafieldsById[variantId]
      $li.attr('data-video-src', field.video_url)

      var $anchor = $li.find('.scroll-video')
      $anchor.attr('data-video', field.video_url)
      $anchor.attr('data-image', field.video_image)

      var $image = $anchor.find('.product-single__thumbnail-image')

      $image.on('load', function () {
        $('.js-variant-video').show()
        $(this).off('load')
      })

      $image.attr('src', field.video_image)
    } else {
      $li.attr('data-video-src', null)
    }
    // END handling variant video

    cache.$mobileSlider.empty()
    cache.$thumbnailContainer.clone().attr('id', 'mobileThumbs').appendTo(cache.$mobileSlider)

    var isFirst = true
    $('#mobileThumbs li').each(function () {
      if ($(this).hasClass('hide')) {
        return $(this).remove()
      }

      // Hack to prevent second image from flashing..
      if (isFirst) {
        isFirst = false
      } else {
        $(this).hide()
      }

      var $image = $(this).find('img').eq(0).detach()
      var $anchor = $(this).find('a')

      if ($(this).hasClass('js-variant-video')) {
        if (!$(this).attr('data-video-src')) {
          $(this).remove()
          return null
        }

        if (!$('.video-container').length) {
          var frag = document.createDocumentFragment()
          var container = document.createElement('div')
          container.setAttribute('class', 'video-container')

          var video = document.createElement('video')
          video.setAttribute('muted', true)
          video.setAttribute('playsinline', true)
          video.setAttribute('loop', true)

          container.appendChild(video)
          frag.appendChild(container)
          $(this)[0].appendChild(frag)
        }

        $image.remove()
        $(this).find('.scroll-video').remove()
        return null
      }

      var href = $anchor.data('image') || $anchor.attr('href')
      $image.attr('src', href)
      $anchor.remove()

      return $(this).append($image)
    })

    if ($('#mobileThumbs').hasClass('slick-initialized')) {
      $('#mobileThumbs').slick('unslick')
    }

    $('#mobileThumbs').slick({ arrows: false, dots: true })

    window.setTimeout(function () {
      $('#mobileThumbs li').each(function () {
        $(this).show()
      })
    }, 100)

    $('#mobileThumbs').on('afterChange', function (e, slick, currentSlide) {
      var $slide = $(slick.$slides[currentSlide])
      if ($slide.hasClass('js-variant-video')) {
        var src = $slide.attr('data-video-src')
        var $video = $slide.find('video')

        if ($video.attr('src') !== src) {
          $video.attr('src', src)
          $video[0].load()
          $video[0].play()
        }
      }
    })

    $('.scroll-video').on('click', function (e) {
      e.preventDefault()

      if ($(this).hasClass('active-thumb')) return

      if (!$('#FeaturedImageZoom-product-template').find('.video-container').length) {
        var frag = document.createDocumentFragment()
        var container = document.createElement('div')
        container.setAttribute('class', 'video-container')

        var video = document.createElement('video')
        video.setAttribute('muted', true)
        video.setAttribute('playsinline', true)
        video.setAttribute('loop', true)

        container.appendChild(video)
        frag.appendChild(container)
        $('#FeaturedImageZoom-product-template')[0].appendChild(frag)
      }

      $('.product-single__thumbnail').not($(this)).removeClass('active-thumb')
      $(this).addClass('active-thumb')

      var $video = $('#FeaturedImageZoom-product-template').find('video')
      $video.attr('src', $(this).attr('data-video'))
      $video[0].load()
      $video[0].play()

      $('#FeaturedImageZoom-product-template').find('img').hide()
      $('#FeaturedImageZoom-product-template').find('.video-container').show()
    })

    $('#pp-thumbnails a.product-single__thumbnail').on('click', function () {
      if (!$(this).hasClass('scroll-video')) {
        $('#FeaturedImageZoom-product-template').find('video').parent().hide()
        $('#FeaturedImageZoom-product-template').find('img').show()
      }
    })
  }

  function handleSwatchChange(_, _ref) {
    var $ref = _ref || $(this)
    var $closestSwatch = $(this).closest('.swatch')
    var optionIndex = $closestSwatch.attr('data-option-index')

    var val = $ref.val() || ''
    state = $.extend({}, state, { color: val.toLowerCase() })

    cache.$form
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(state.color)
      .trigger('change')

    var group = $(this).attr('data-group')

    // Swatch color name
    var $myResult = $closestSwatch.find('.js-swatch-result[data-group='+group+']')
    $closestSwatch.find('.js-swatch-result').not($myResult).html('')
    $myResult.html(' - ' + state.color)

    // Swatch label tag
    var variantId = theme.variant.currentVariant ? theme.variant.currentVariant.id : theme.variant.id
    var $myLabel = $closestSwatch.find('.js-swatch-label[data-group=' + group + ']')
    var metaFields = totallee.metafieldsById[variantId] || {}
    var label = metaFields.swatch_label || ''
    var myDisplayMethod = label ? 'addClass' : 'removeClass'
    var visibilityClassname = 'visible'
    $closestSwatch.find('.js-swatch-label').not($myLabel).removeClass(visibilityClassname)
    $myLabel[myDisplayMethod](visibilityClassname).html(label)

    swapRoutine()
  }

  function handleSizeChange(_, _ref) {
    var $ref = _ref || $(this)
    var val = $ref.val() || ''
    state = $.extend({}, state, { size: val.toLowerCase() })
    swapRoutine()
  }

  function handleQuantityChange(_, _ref) {
    var $ref = _ref || $(this)
    var val = $ref.val() || ''
    state = $.extend({}, state, { quantity: val.toLowerCase() })
    swapRoutine()
  }

  function init(sectionId) {
    props.sectionId = sectionId

    setState()
    cacheSelectors()

    cache.$swatchOption.on('change', handleSwatchChange)
    cache.$sizeOption.on('change', handleSizeChange)
    cache.$quantityOption.on('change', handleQuantityChange)

    if ($('.swatch :radio:checked').length) {
      handleSwatchChange(null, $('.swatch :radio:checked'))
    }

    if (cache.$sizeOption.length) {
      handleSizeChange(null, cache.$sizeOption)
    }

    if (cache.$quantityOption.length) {
      handleQuantityChange(null, cache.$quantityOption)
    }

    cache.$loading.hide()
    cache.$loadingContent.css({ visibility: 'visible', opacity: '1' })
    swapRoutine()
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// PP - QTY
// ################################################################################################################
totallee.qty = (function () {
  var cache = {}
  function cacheSelectors() {
    cache = {
      $minus: $('.js-qty-minus'),
      $plus: $('.js-qty-plus'),
      $input: $('.js-qty-input'),
    }
  }

  function handleAdjust(val) {
    return function (e) {
      e.preventDefault()
      var inputVal = parseInt(cache.$input.val(), 10)
      var newVal = inputVal + val > -1
        ? inputVal + val
        : 0
      cache.$input.val(newVal)
    }
  }

  function init() {
    cacheSelectors()
    cache.$minus.on('click', handleAdjust(-1))
    cache.$plus.on('click', handleAdjust(1))
  }

  return {
    init: init
  }
})()

// ################################################################################################################
// PP - HALF BLOCKS
// ################################################################################################################
totallee.ppHalfBlocks = (function () {
  var cache = {
    $blockSlider: $('.js-slider')
  }

  function init() {
    cache.$blockSlider.slick({
      arrows: true,
      dots: true,
      nextArrow: utils.slideArrow('next'),
      prevArrow: utils.slideArrow('prev'),
    })
  }

  return {
    init: init
  }
})()


// ################################################################################################################
// PP - FORM
// ################################################################################################################
totallee.ppForm = (function () {
  var state = {
    selected: null,
    isTotalleeChecked: false,
  }

  var cache = {}


  var itemErrorCallback = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');

    if (!!data.message) {
      if (data.status == 422) {
        var $ele = $('.product-form__item--submit');

        $ele.find('button').attr('disabled', true);
        $ele.find('button').find('span').html('Sold Out');
        $ele.after('<div class="errors qty-error">'+ data.description +'</div>');
      }
    }
  };

  function cacheSelectors() {
    cache.$sizeSelector = $('.js-single-option-selector--size')
    cache.$checkBox = $('#totalleeAddOn')
    cache.$form = $('form[action^="/cart/add"]')
    cache.$selectCase = $('.js-select-url')

    if (!cache.$sizeSelector.length) {
      cache.$sizeSelector = $('.js-opt-size')
    }
  }

  function bindUIEvents() {
    cache.$checkBox.on('change', function () {
      state.isTotalleeChecked = $(this).is(':checked')
    })

    cache.$sizeSelector.on('change', function () {
      state.selected = $(this).val()
      var size = $(this).val()
                        .toLowerCase()
                        .split('/')[0]
                        .replace(/\s/g, '-')
                        .replace(/iphone-|galaxy-|pixel-/g, '')
      if (
        totallee.addonsBySize &&
        Object.keys(totallee.addonsBySize).length &&
        totallee.addonsBySize[size].id
      ) {
        cache.$checkBox.data('variant-id', totallee.addonsBySize[size].id)
      }
    })

    cache.$form.off('submit').on('submit', function (e) {
      e.preventDefault()





      if (!state.isTotalleeChecked) {
        ShopifyAPI.addItemFromForm(e.target, ajaxCart.load, itemErrorCallback)
      } else {
        var updates = {}
        var serialized = cache.$form.serialize()
        var matchQty = serialized.match(/quantity=(\d+)/)
        var quantity = matchQty ? matchQty[1] : 1
        var id = serialized.match(/id=(\d+)/)[1]

        updates[id] = quantity
        updates[cache.$checkBox.data('variant-id')] = quantity
        ShopifyAPI.updateCart(updates, ajaxCart.load)
      }
    })

    cache.$selectCase.on('change', function (e) {
      e.preventDefault()
      var value = $(this).val()

      if (value && window.location.pathname.indexOf(value) === -1) {
        window.location = value
      }
    })
  }

  function initState() {
    state.selected = cache.$sizeSelector.val()
  }

  function init() {
    cacheSelectors()
    initState()
    bindUIEvents()
  }
  return {
    init: init,
  }
})()

// ################################################################################################################
// PP - SHOPPING BAR
// ################################################################################################################
totallee.shopBar = (function () {
  var state = {}
  var cache = {}

  var classes = {
    active: 'shopbar--active'
  }

  function cacheSelectors() {
    cache.$body = $(document.body)
    cache.$waypoint = $('.js-waypoint')
    cache.$window = $(window)
    cache.$shopbar = $('.js-shopbar')
    cache.$shopbarBtn = $('.js-shopbar-btn')
    cache.$singleMeta = $('#pp-single-meta')
    cache.$form = $('form[action^="/cart/add"]')
  }

  function handleWaypoint() {
    state = utils.waypointFactory(cache.$waypoint)

    if (state.location === 'top') {
      cache.$shopbar.addClass(classes.active)
    } else {
      cache.$shopbar.removeClass(classes.active)
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    cache.$form.trigger('submit')
  }

  function init() {
    cacheSelectors()
    if (cache.$shopbar.length) {
      $(window).on('DOMContentLoaded load resize scroll touchmove', handleWaypoint)
    }

    if (cache.$shopbarBtn.length) {
      cache.$shopbarBtn.on('click', handleFormSubmit)
    }
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// VARIANT MAP
// ################################################################################################################
totallee.variantMap = (function () {
  var idx = -1
  var pJson

  var state = {
    idsByColor: {},
    variantEntity: {}
  }

  var cache = {
    $selectCase: $('.js-select-url')
  }


  function mapVariantToKey(variantArray) {
    variantArray.forEach(function (variant) {
      state.idsByColor[variant.options[idx]] = (state.idsByColor[variant.options[idx]] || []).concat(variant.id)
    })
  }

  function normalizeVariant(product) {
    product.variants.forEach(function (variant) {
      state.variantEntity[variant.id] = variant
      state.variantEntity[variant.id].product_id = product.id
    })
  }

  function setState() {
    Object.keys(totallee.productEntity).forEach(function (key) {
      var product = totallee.productEntity[key]
      var variants = product.variants
      mapVariantToKey(variants)
      normalizeVariant(product)
    })
  }

  function bindUIEvents() {
    $(document.body).on('totallee.variantChange', function (e) {
      var payload = e.payload
      var color = payload.color

      if (!color || !state.idsByColor[color]) return

      state.idsByColor[color].forEach(function (id) {
        var productId = state.variantEntity[id].product_id
        var $option = $("option[data-product-id=" + productId + "]")
        if ($option.length) {
          var value = $option.val().split('?')[0] + '?variant=' + id
          $option[0].setAttribute('value', value)
        }
      })
    })
  }

  function init(sectionId) {
    var id = 'ProductJson-' + sectionId
    var el = document.getElementById(id)
    pJson = el ? JSON.parse(el.innerHTML) : {}
    idx = utils.optionIndexOf(pJson, 'Color')
    setState()
    bindUIEvents()
  }

  return {
    init: init
  }
})()

// ################################################################################################################
// PRODUCT PAGE
// ################################################################################################################
totallee.productPage = (function () {
  function init() {
    var sectionId = $('.product-template__container').data('section-id')
    totallee.variantMap.init(sectionId) // This needs to come before ppVariants because we're listening to an event
    totallee.ppVariants.init(sectionId)
    totallee.qty.init()
    totallee.ppHalfBlocks.init()
    totallee.shopBar.init()
    totallee.ppForm.init()
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// UPSELL PAGE
// ################################################################################################################
totallee.upsellPage = (function () {
  var cache = {
    $form: $('form[action^="/cart/add"]')
  }

  function callback() {
    window.location.href = '/checkout'
  }

  function init() {
    totallee.qty.init()

    cache.$form.on('submit', function (e) {
      e.preventDefault()

      var cableId = $('.js-showcase').eq(0).data('id')
      if (cableId) {
        ShopifyAPI.queueUp({
          action: 'ADD',
          data: { quantity: 1, id: cableId },
          callback: callback
        })
      }

      var variantId = $(this).serialize().split('id=')[1]
      if (variantId) {
        ShopifyAPI.queueUp({
          action: 'ADD',
          data: {
            quantity: 1,
            id: variantId,
            properties: { Includes: 'Free Charger' } // 'Includes' should be titlecased
          },
          callback: callback
        })
      }

      ShopifyAPI.moveAlong()
    })

    $('.js-upsell-atc').on('click', function (e) {
      e.preventDefault()
      cache.$form.trigger('submit')
    })

    $('.swatch :radio').change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();
      $(this)
        .closest('form')
        .find('.single-option-selector')
        .eq(optionIndex)
        .val(optionValue)
        .trigger('change');
    });
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// VIDEO - Video UI Functionality
// ################################################################################################################
totallee.video = (function () {
  function init() {
    $('.js-video-play').on('click', function (e) {
      e.preventDefault()
      var $overlay = $(this).parent()
      $overlay.fadeOut().parent().find('.js-video')[0].play()
    })

    $('.js-video').on('play', function () {
      $(this).parent().prev().fadeOut()
    })

    $('.js-video').on('ended', function () {
      $(this).parent().prev().fadeIn()
    })
  }

  return {
    init: init,
  }
})()


// ################################################################################################################
// BACK TO TOP
// ################################################################################################################
totallee.backTop = (function () {
  var cache = {
    $body: $(document.body),
    $returnBtn: $('.js-return-btn'),
  }

  function bindUIEvents() {
    cache.$returnBtn.on('click', function (e) {
      e.preventDefault()
      $('html, body').animate({ scrollTop: 0 }, 'fast')
    });

    // Reveal Functionality
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 250) {
        cache.$returnBtn.addClass('shopbar--active')
        cache.$body.addClass('pad-bottom')
      } else {
        cache.$returnBtn.removeClass('shopbar--active')
        cache.$body.removeClass('pad-bottom')
      }
    });
  }

  function init() {
    if (cache.$returnBtn.length) {
      bindUIEvents()
    }
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// SELECT SIZER
// ################################################################################################################
totallee.selectSizer = (function () {
  var cache = {
    $sizer: $('.js-select-sizer'),
  }

  function resizeSelect($element) {
    $element.each(function() {
      var $this = $(this);
      var arrowWidth = 18;
      // create test element
      var text = $this.find('option:selected').text();
      var $test = $('<span>').html(text);

      // add to body, get width, and get out
      $test.appendTo('body');
      var width = $test.width();
      $test.remove();

      // set select width
      $this.width(width + arrowWidth);
    });
  }

  function init() {
    resizeSelect(cache.$sizer)
    cache.$sizer.on('change', function () {
      resizeSelect($(this))
    })
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// FREE PRODUCT
// ################################################################################################################
totallee.freeProduct = (function () {
  var cart = {}
  var state = {}

  function cacheCart() {
    cart = theme.cart
  }

  function refresh() {
    window.location.href = '/cart'
  }

  function setState() {
    var legitSizes = ['010', '012', '011', '009', '008', '007', '006']
    state = cart.items.reduce(function (a, c) {
      if (parseInt(c.variant_id, 10) === parseInt(theme.upsell.variantId, 10)) {
        a.hasFreeProduct = true
      }

      if (c.properties && c.properties['Includes'] && c.properties['Includes'].toUpperCase() === 'FREE CHARGER') {
        a.hasPrereq = true
        a.prereqVid = c.variant_id
      }

      var size = c.sku.split('-')[0]

      if (legitSizes.indexOf(size) !== -1) {
        a.sizeCount += 1
      }

      return a

    }, { hasFreeProduct: false, hasPrereq: false, sizeCount: 0, prereqVid: 0 })
  }

  function runCheck() {
    var run = false
    var shouldRemoveFreeProduct = (state.hasFreeProduct && !state.hasPrereq) || (state.hasFreeProduct && state.sizeCount < 2)
    var shouldUpdateProperty = (shouldRemoveFreeProduct && state.hasPrereq) || (!state.hasFreeProduct && state.hasPrereq)

    var freeProductData = {}
    freeProductData.updates = {}
    freeProductData.updates[theme.upsell.variantId] = 0

    var prereqProductData = {}
    prereqProductData.updates = {}
    prereqProductData.updates[state.prereqVid] = 0

    if (shouldRemoveFreeProduct) {
      ShopifyAPI.queueUp({
        action: 'UPDATE',
        data: freeProductData,
        callback: refresh
      })

      run = true
    }

    if (shouldUpdateProperty) {
      ShopifyAPI.queueUp({
        action: 'UPDATE',
        data: prereqProductData,
        callback: refresh
      })

      ShopifyAPI.queueUp({
        action: 'ADD',
        data: { quantity: 1, id: state.prereqVid },
        callback: refresh
      })

      run = true
    }

    if (run) {
      ShopifyAPI.moveAlong()
    }
  }

  function init() {
    cacheCart()
    setState()
    runCheck()
  }

  return {
    init: init,
  }
})()


// ################################################################################################################
// QUESTIONNAIRE
// ################################################################################################################
totallee.questionnaire = (function () {
  var cache = {}
  var slides = {}

  function cacheSelectors() {
    cache.$slider = $('.js-questionnaire')
    cache.$qSelect = $('.js-questionnaire-select')
    cache.$qResult = $('.js-questionnaire-result')
  }

  function bindSlick() {
    cache.$qResult.each(function (i) {
      var key = $(this).attr('id')
      slides[key] = i + 1
    })

    cache.$slider.slick({
      arrows: false,
      dots: false,
      draggable: false,
      swipe: false,
      touchMove: false,
      adaptiveHeight: true,
    })
  }

  function bindUIEvents() {
    cache.$qSelect.on('click', function () {
      var key = $(this).data('questionnaire')
      var value = slides[key]

      if (!isNaN(value)) {
        var $result = $('#' + key)

        cache.$qResult.not($result).css({
          visibility: 'hidden',
          opacity: '0',
        })

        cache.$qResult.eq(slides[key]).css({
          visibility: 'visible',
          opacity: '1,'
        })

        cache.$slider.slick('slickGoTo', value)
      }
    })
  }

  function init() {
    cacheSelectors()
    bindSlick()
    bindUIEvents()
  }

  return {
    init: init,
  }
})()

// ################################################################################################################
// INIT
// ################################################################################################################
totallee.init = function () {
  var sections = new theme.Sections()
  totallee.buddySystem.init()
  totallee.accordions.init()
  totallee.drawers.init()
  totallee.colorSwatches.init()
  totallee.video.init()
  totallee.backTop.init()
  totallee.selectSizer.init()

  sections.register('questionnaire-section', totallee.questionnaire.init)

  if (window.location.pathname.indexOf('/products/') !== -1 || window.location.pathname.indexOf('/products_preview') !== -1) {
    totallee.productPage.init()
  }

  if ($('.template-page--upsell').length || $('.template-page--upsell-free-cable').length) {
    totallee.upsellPage.init()
  }

  if (window.location.pathname.indexOf('/cart') !== -1) {
    totallee.freeProduct.init()
  }

  $('#hp-press').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    appendArrows: '.s-slider__arrows',
    responsive: [
      {
        breakpoint: 750,
        settings: {
          dots: true,
          slidesToShow: 1,
          autoplay: true,
          autoplaySpeed: 3500,
        },
      },
    ],
  })

  $('.js-smooth-scroll').on('click', function (e) {
    var $target = $($(this).data('smooth'))
    if ($target.length) {
      e.preventDefault()
      e.stopPropagation()
      $('html, body').animate({
        scrollTop: $target.offset().top - 35
      }, 450)
    }
  })
}

$(totallee.init)
