var Tooltip = {
  tooltip: undefined,
  target: undefined,
  bindEvents: function() {
    Tooltip.tooltip = document.getElementById('tooltip');
    var targets = document.querySelectorAll('[rel=tooltip]' );
    //alert(targets.length)
    for (var i = 0; i < targets.length; ++i) {
       targets[i].addEventListener('click', Tooltip.show);
       targets[i].addEventListener('mouseleave', Tooltip.hide);
    //  alert(targets[i]['title'])
    }
    Tooltip.tooltip.addEventListener('click', Tooltip.hide);
     window.addEventListener('resize', Tooltip.show);

  },

  show: function()
  {
    console.log('show');
   // alert(this['title'])
    Tooltip.target = this;
    var tip = Tooltip.target['title'];
    if( !tip || tip == '' ) {
      return false;
    }
    this.innerHTML = this['title'] ;
    //Tooltip.tooltip.innerHTML = tip ;
    if( window.innerWidth < this.offsetWidth * 1.5 ) {
      this.style.maxWidth = (window.innerWidth / 2)+'px';
    }
    else {
      this.style.maxWidth = 320 + 'px';
    }

    var pos_left = Tooltip.target.offsetLeft + ( Tooltip.target.offsetWidth / 2 ) - ( Tooltip.tooltip.offsetWidth / 2 ),
      pos_top  = Tooltip.target.offsetTop - Tooltip.tooltip.offsetHeight - 20;
    Tooltip.tooltip.className = '';
    console.log('('+pos_left+', '+pos_top+')')
    if( pos_left < 0 )
    {
      pos_left = Tooltip.target.offsetLeft + Tooltip.target.offsetWidth / 2 - 20;
      Tooltip.tooltip.className += ' left';
    }

    if( pos_left + Tooltip.tooltip.offsetWidth > window.innerWidth ) {
      pos_left = Tooltip.target.offsetLeft - Tooltip.tooltip.offsetWidth + Tooltip.target.offsetWidth / 2 + 20;
      Tooltip.tooltip.className +=' right';
    }

    if( pos_top < 0 )
    {
      var pos_top  = Tooltip.target.offsetTop + Tooltip.target.offsetHeight;
      Tooltip.tooltip.className += ' top';
    }

    Tooltip.tooltip.style.left = pos_left + 'px';
    Tooltip.tooltip.style.top = pos_top + 'px';

    Tooltip.tooltip.className += ' show';
  },
  hide: function()
  {
    console.log('hide');
    this.className = this.className.replace('show', '');
  }
};
Tooltip.bindEvents();
