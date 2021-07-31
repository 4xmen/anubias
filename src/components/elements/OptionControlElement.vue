<template>
  <div class="container">
    <div class="terminal">
      <i class="fa fa-circle red-text" @click="closeModal"></i>
      <!--    <i class="fa fa-circle yellow-text text-darken-2"></i>-->
      <!--    <i class="fa fa-circle green-text text-lighten-2"></i>-->
      <div class="content">
        <table class=" responsive-table ">
          <thead>
          <tr>
            <th>
              Title
            </th>
            <th>
              Value
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(itm,i) in options" :key="i">
            <td>
              <input type="text" v-model="itm.title" :placeholder="'Title of `'+i+'`'"/>
            </td>
            <td>
              <input type="text" v-model="itm.value" :placeholder="'Value of `'+i+'`'"/>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="btn btn-block add-item" @click="addItem">
          <i class="fa fa-plus"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OptionControlElement",
  data: function () {
    return {
    }
  },
  methods: {
    addItem: function () {
      this.options.push({
        title: '',
        value: '',
      });
    },
    closeModal: function () {
      let n = this;
      do {
        n = n.$parent;
      } while (n.closeAllModal === undefined);
      n.closeAllModal();
    },
  },
  props: ['options']
}
</script>

<style scoped>

.terminal {
  margin: 50px auto 0 auto;
  border-radius: 7px;
  background: #272c34;
  padding: 15px;
  line-height: 1.2em;

}

.content {
  padding: 0 20px;
  color: #eee;
  height: 600px;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
  position: relative;
}

.content ul li {
  white-space: pre;
}

.fa-circle {
  margin-right: 10px;
}

.add-item {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
td,th{
  padding: 0;
  border-right: 1px solid rgba(0,0,0,0.12);
  text-align: center;
}
td:last-child,th:last-child{
  border-right: 0;
}
</style>