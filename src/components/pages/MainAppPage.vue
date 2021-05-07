<template>
  <div>
    <div id="main">
      <div class="container">
        <div id="app">
        </div>
      </div>
    </div>
    <div id="pages">
      <div class="container">

      </div>
    </div>
    <div id="side">
      <div id="elements">
        <h2>
          Elements
          <i class="fa fa-cubes"></i>
        </h2>
      </div>
      <div id="properties">
        <h2>
          Properties
          <i class="fa fa-expand"></i>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainAppPage"
}
</script>

<style scoped>
#side {
  background: #20252b;
  width: 25%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  min-height: 100vh;
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 0, 0, .1);
}

#side #elements {
  height: 50vh;
}

#side #properties {
  height: 50vh;
}

#side h2 {
  padding: 3px;
  text-align: center;
  background: #272c34;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  font-size: 17px;
}

#side h2 .fa {
  float: right;
  padding: 5px;
}

#main {
  width: 75%;
  min-height: 80vh;
}

#main #app {
  background: white;
  width: 300px;
  min-height: 600px;
  margin: auto;
  border-radius: 15px;
  border: 13px solid black;
  color: #1e2329;
}

#main .container {
  padding: 15px;
}

#pages {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 25%;
  background: #20252b;
  height: 20vh;
  border: 1px solid rgba(0, 0, 0, .1);
  border-right: 0;
}

#pages .container {
  padding: 5px;
}
</style>