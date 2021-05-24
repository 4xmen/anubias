<!--page symbol for element of list of pages-->
<template>
  <div id="page" :class="active?'active':''">
    <div id="page-content" :style="'background:'+bg">
      <img :src="image !== undefined ? image:''" alt="no preview">
      <slot></slot>
    </div>
    <h3 id="page-title">
      <span :class="{main:isMain}">
        {{ title }}
      </span>
    </h3>
  </div>
</template>

<script>
export default {
  name: "PageElement",
  props: [
    'title',
    'active',
    'isMain',
    'image',
    'bg'
  ]
}
</script>

<style scoped>

.main {
  font-weight: 900;
}

#page {
  display: inline-block;
  text-align: center;
  padding: 10px;
  min-width: 85px;
  position: relative;
}

#page:hover {
  background: rgba(0, 0, 0, 0.2);
}

#page-content {
  width: 65px;
  height: 80px;
  background: #ffffff;
  color: #000000;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin: auto;
  margin-bottom: 5px;
  cursor: pointer;
  overflow: hidden;
  overflow-y: scroll;
}

#page-content img {
  max-width: 100%;
}

#page-title {
  font-size: 15px;
}

.active {
  border-bottom: 1px solid #1b9a59;
}

.active #page-title {
  color: #1b9a59;
}
</style>