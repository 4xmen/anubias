<template>
  <div id="download">
    <Particles
        id="tsparticles"
        :options='{
  "particles": {
    "number": {
      "value": 355,
      "density": {
        "enable": true,
        "value_area": 789.1476416322727
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.48927153781200905,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 0.2,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 0,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 83.91608391608392,
        "size": 1,
        "duration": 3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}'
    />
    <img :src="'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl='+dl+'&choe=UTF-8'" alt="">
    <h5>
      Congratulation, Download your compiled application
    </h5>
    <div class="row">
      <div class="col s12">
        <div class="btn btn-link waves-effect" @click="openSite(dl)" >
          Download
        </div>
      </div>
      <div class="col s12">
        <br>
        For support Please start our project:
        <br>
        <div class="gh-button" @click="openSite('https://github.com/4xmen/Anubias-Desktop/stargazers')">
          <i class="fab fa-github"></i>
          Star
        </div>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "download",
  props: ['dl'],
  methods:{
    openSite: function (web) {
      window.api.send("openWeb", web);
    },
  }
}
</script>

<style scoped>
#download {
  position: fixed;
  top: 10vh;
  bottom: 10vh;
  left: 30%;
  right: 30%;
  z-index: 9999;
  background-color: #1c1d1f;
  border-radius: 5px;
  text-align: center;
  padding: 2rem;
}

h5{
  margin: .7em auto;
}

#tsparticles {
  position: fixed;
  top: 10vh;
  bottom: 10vh;
  left: 30%;
  right: 30%;
  border-radius: 5px;
}


.gh-button {
  display: inline-block;
}
.gh-button i{
  float: left;
  margin-top: 2px;
  margin-right: 15px;
}
.gh-button {
  box-sizing: border-box;
  height: 30px;
  font-weight: bold;
  font-size: 11px;
  line-height: 14px;
  padding: 2px 5px 2px 4px;
  color: #333;
  text-decoration: none;
  text-shadow: 0 1px 0 #fff;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  border-radius: 3px;

  padding: 3px 10px 3px 8px;
  font-size: 16px;
  line-height: 22px;
  border-radius: 4px;
  background-color: #eee;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid #d5d5d5;
}

.gh-button:hover,
.gh-button:focus {
  text-decoration: none;
  background-color: #ddd;
  background-image: linear-gradient(#eee, #ddd);
  border-color: #ccc;
}

.gh-button:active {
  background: #dcdcdc;
  border-color: #b5b5b5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, .15);
}


</style>