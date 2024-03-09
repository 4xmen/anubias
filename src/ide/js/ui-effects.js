let btnWave = ()=>{
    var buttons = document.querySelectorAll('.circle-btn');

    Array.prototype.forEach.call(buttons, function(button) {
        button.addEventListener('click', function(e) {
            var ripple = document.createElement('span');
            ripple.classList.add('ripple');
            var x = e.pageX - this.offsetLeft - ripple.offsetWidth / 2;
            var y = e.pageY - this.offsetTop - ripple.offsetHeight / 2;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });
}

export {
  btnWave
};