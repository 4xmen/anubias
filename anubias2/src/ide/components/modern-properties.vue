<template>
  <div>
    <collapsible title="Name" icon="ri-codepen-line">
      <input type="text">
    </collapsible>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import collapsible from "./collapsible.vue";

export default {
  name: "modern-properties",
  components: {
    collapsible
  },
  data() {
    return {}
  },
  mounted() {
  },
  computed: {
    ...mapState('ide', {
      properties: 'onEditComponent',
    })
  },
  methods: {}
}
</script>

<style scoped>

</style>